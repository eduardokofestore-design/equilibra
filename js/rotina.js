/* ==========================================================
   Equilibra — tela "Minha rotina"
   Hábitos de autocuidado, progresso do dia e histórico.
   Depende de: storage.js e main.js
   ========================================================== */
(function () {
  'use strict';

  var Store = window.EquilibraStore;
  var Eq = window.Equilibra;

  var MAX_HABITS = 30;
  var HISTORY_DAYS = 14;

  var listEl = document.getElementById('lista-habitos');
  var emptyEl = document.getElementById('vazio-habitos');
  var form = document.getElementById('form-habito');
  var input = document.getElementById('novo-habito');
  var formMsg = document.getElementById('msg-habito');
  var sugBlock = document.getElementById('sugestoes-bloco');
  var sugList = document.getElementById('sugestoes');
  var progText = document.getElementById('progresso-texto');
  var progTrack = document.getElementById('progresso-trilha');
  var progBar = document.getElementById('progresso-barra');
  var progMsg = document.getElementById('progresso-msg');
  var historyBox = document.getElementById('historico-rotina');

  /* ---------- Progresso do dia ---------- */

  function renderProgress() {
    var p = Store.habitProgress();

    progBar.style.width = p.percent + '%';
    progTrack.setAttribute('aria-valuenow', String(p.percent));

    if (!p.total) {
      progText.textContent = 'Nenhum hábito na rotina ainda.';
      progTrack.setAttribute('aria-valuetext', 'Nenhum hábito cadastrado');
      progMsg.textContent = 'Adicione seu primeiro hábito para começar.';
      return;
    }

    progText.textContent = p.done + ' de ' + p.total +
      (p.total === 1 ? ' hábito concluído hoje' : ' hábitos concluídos hoje');
    progTrack.setAttribute('aria-valuetext', p.done + ' de ' + p.total + ' hábitos concluídos hoje');

    if (p.done === 0) {
      progMsg.textContent = 'Cada pequeno passo conta. Comece pelo que parecer mais leve.';
    } else if (p.done < p.total) {
      progMsg.textContent = 'Você já fez ' + p.done + (p.done === 1 ? ' coisa' : ' coisas') +
        ' por você hoje. Siga no seu ritmo.';
    } else {
      progMsg.textContent = 'Tudo feito por hoje. Aproveite para descansar.';
    }
  }

  /* ---------- Lista de hábitos ---------- */

  function renderList() {
    var habits = Store.getHabits();
    var done = Store.getDoneHabits();

    emptyEl.hidden = habits.length > 0;
    listEl.hidden = habits.length === 0;

    listEl.innerHTML = habits.map(function (h) {
      var checked = done.indexOf(h.id) !== -1;
      var name = Eq.escapeHTML(h.name);
      return '<li class="habit-item' + (checked ? ' is-done' : '') + '">' +
        '<input type="checkbox" id="h-' + Eq.escapeHTML(h.id) + '" data-id="' + Eq.escapeHTML(h.id) + '"' + (checked ? ' checked' : '') + '>' +
        '<label for="h-' + Eq.escapeHTML(h.id) + '">' + name + '</label>' +
        '<button class="btn btn-small btn-ghost" type="button" data-remove="' + Eq.escapeHTML(h.id) + '" ' +
          'aria-label="Remover hábito: ' + name + '">Remover</button>' +
      '</li>';
    }).join('');
  }

  /* ---------- Sugestões ---------- */

  function hasHabit(name) {
    var lower = name.toLowerCase();
    return Store.getHabits().some(function (h) { return h.name.toLowerCase() === lower; });
  }

  function renderSuggestions() {
    var available = Store.SUGGESTED_HABITS.filter(function (name) { return !hasHabit(name); });
    sugBlock.hidden = available.length === 0;
    sugList.innerHTML = available.map(function (name) {
      return '<button class="chip" type="button" data-suggest="' + Eq.escapeHTML(name) + '">+ ' + Eq.escapeHTML(name) + '</button>';
    }).join('');
  }

  /* ---------- Histórico ---------- */

  function renderHistory() {
    var habits = Store.getHabits();
    var names = {};
    habits.forEach(function (h) { names[h.id] = h.name; });

    var log = Store.getHabitLog();
    var days = Object.keys(log).sort().reverse().map(function (day) {
      var ids = log[day].filter(function (id) { return names[id]; });
      return { date: day, ids: ids };
    }).filter(function (d) { return d.ids.length; }).slice(0, HISTORY_DAYS);

    if (!days.length) {
      historyBox.innerHTML = '<div class="empty-state"><p>Seu histórico aparece aqui quando você concluir atividades.</p></div>';
      return;
    }

    historyBox.innerHTML = days.map(function (d) {
      var count = d.ids.length;
      return '<details class="day-detail">' +
        '<summary><span class="day-detail-title">' + Eq.escapeHTML(Eq.dayTitle(d.date)) + '</span> ' +
        '<span class="muted small">' + count + (count === 1 ? ' concluído' : ' concluídos') + '</span></summary>' +
        '<ul>' + d.ids.map(function (id) { return '<li>' + Eq.escapeHTML(names[id]) + '</li>'; }).join('') + '</ul>' +
      '</details>';
    }).join('');
  }

  function renderAll() {
    renderProgress();
    renderList();
    renderSuggestions();
    renderHistory();
  }

  /* ---------- Adicionar e remover ---------- */

  function addHabit(name) {
    if (Store.getHabits().length >= MAX_HABITS) {
      formMsg.textContent = 'Você chegou ao limite de ' + MAX_HABITS + ' hábitos. Remova algum para adicionar outro.';
      return false;
    }
    var habit = Store.addHabit(name);
    if (!habit) {
      formMsg.textContent = name.trim() ? 'Esse hábito já está na sua rotina.' : 'Digite o nome do hábito.';
      return false;
    }
    formMsg.textContent = '';
    renderAll();
    Eq.toast('Hábito adicionado.');
    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (addHabit(input.value)) input.value = '';
    input.focus();
  });

  input.addEventListener('input', function () { formMsg.textContent = ''; });

  sugList.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-suggest]');
    if (!btn) return;
    addHabit(btn.getAttribute('data-suggest'));
  });

  listEl.addEventListener('change', function (e) {
    var box = e.target.closest('input[type="checkbox"][data-id]');
    if (!box) return;
    Store.toggleHabit(box.getAttribute('data-id'));
    box.closest('.habit-item').classList.toggle('is-done', box.checked);
    renderProgress();
    renderHistory();
  });

  listEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-remove]');
    if (!btn) return;
    if (!window.confirm('Remover este hábito da sua rotina? O histórico dele também será apagado.')) return;
    Store.removeHabit(btn.getAttribute('data-remove'));
    renderAll();
    input.focus();
    Eq.toast('Hábito removido.');
  });

  renderAll();
})();
