/* ==========================================================
   Equilibra — tela "Meu humor"
   Registro, gráfico semanal e histórico.
   Depende de: storage.js e main.js
   ========================================================== */
(function () {
  'use strict';

  var Store = window.EquilibraStore;
  var Eq = window.Equilibra;

  var DAYS_STEP = 5;          // quantos dias do histórico aparecem por vez
  var visibleDays = DAYS_STEP;

  var moodById = {};
  Store.MOODS.forEach(function (m) { moodById[m.id] = m; });

  var form = document.getElementById('form-humor');
  var optionsBox = document.getElementById('mood-options');
  var noteField = document.getElementById('nota');
  var counter = document.getElementById('nota-contador');
  var errorBox = document.getElementById('erro-humor');
  var feedback = document.getElementById('feedback-humor');
  var chart = document.getElementById('grafico-semana');
  var weekSummary = document.getElementById('resumo-semana');
  var historyBox = document.getElementById('historico');
  var historyTitle = document.getElementById('titulo-historico');
  var moreBtn = document.getElementById('ver-mais');

  /* ---------- Opções de sentimento ---------- */

  function renderOptions() {
    optionsBox.innerHTML = Store.MOODS.map(function (m) {
      return '<label class="mood-option" style="--mood-color:' + m.color + '">' +
        '<input type="radio" name="mood" value="' + m.id + '" class="visually-hidden">' +
        '<span class="mood-emoji" aria-hidden="true">' + m.emoji + '</span>' +
        '<span class="mood-label">' + m.label + '</span>' +
      '</label>';
    }).join('');
  }

  /* ---------- Mensagem após salvar ---------- */

  var FEEDBACK = {
    'muito-bem': 'Que bom! Registrar os momentos bons também ajuda a lembrar deles.',
    'bem': 'Registro salvo. Bom ter esse momento anotado.',
    'neutro': 'Registro salvo. Dias neutros também fazem parte.',
    'triste': 'Obrigado por registrar. Se puder, faça uma pausa e respire com calma. ' +
              'Se estiver pesado demais, a página <a href="apoio.html">Apoio e acolhimento</a> mostra onde buscar ajuda.',
    'estressado': 'Obrigado por registrar. Uma pausa curta e algumas respirações lentas podem ajudar. ' +
                  'Se estiver difícil de levar sozinho(a), veja a página <a href="apoio.html">Apoio e acolhimento</a>.'
  };

  function showFeedback(moodId) {
    feedback.innerHTML = FEEDBACK[moodId] || 'Registro salvo.';
    feedback.classList.add('has-content');
  }

  function clearFeedback() {
    feedback.innerHTML = '';
    feedback.classList.remove('has-content');
  }

  /* ---------- Gráfico semanal ---------- */

  function renderChart() {
    var counts = Store.countMoods(7);
    var max = 0;
    var total = 0;
    Store.MOODS.forEach(function (m) {
      total += counts[m.id];
      if (counts[m.id] > max) max = counts[m.id];
    });

    if (total) {
      weekSummary.textContent = 'Nos últimos 7 dias você fez ' + total +
        (total === 1 ? ' registro.' : ' registros.');
    } else {
      weekSummary.textContent = 'Ainda não há registros nos últimos 7 dias. Quando você registrar, a distribuição aparece aqui.';
    }

    chart.innerHTML = Store.MOODS.map(function (m) {
      var n = counts[m.id];
      var width = n ? Math.max(6, Math.round((n / max) * 100)) : 0;
      return '<li class="chart-row">' +
        '<span class="chart-label"><span aria-hidden="true">' + m.emoji + '</span> ' + m.label + '</span>' +
        '<span class="chart-track" aria-hidden="true">' +
          '<span class="chart-bar" style="width:' + width + '%;background:' + m.color + '"></span>' +
        '</span>' +
        '<span class="chart-count">' + n + '<span class="visually-hidden"> ' + (n === 1 ? 'registro' : 'registros') + '</span></span>' +
      '</li>';
    }).join('');
  }

  /* ---------- Histórico ---------- */

  function groupByDay() {
    var map = {};
    Store.getMoods().forEach(function (e) {
      (map[e.date] = map[e.date] || []).push(e);
    });
    var days = Object.keys(map).sort().reverse();
    return days.map(function (day) {
      map[day].sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
      return { date: day, entries: map[day] };
    });
  }

  function entryHTML(e) {
    var m = moodById[e.mood];
    if (!m) return '';
    var time = Eq.formatTime(e.createdAt);
    var note = e.note ? '<p class="entry-note">' + Eq.escapeHTML(e.note) + '</p>' : '';
    return '<li class="entry" style="--mood-color:' + m.color + '">' +
      '<div class="entry-head">' +
        '<span class="entry-mood"><span aria-hidden="true">' + m.emoji + '</span> ' + m.label + '</span>' +
        (time ? '<span class="entry-time muted small">' + time + '</span>' : '') +
        '<button class="btn btn-small btn-ghost entry-delete" type="button" data-delete="' + Eq.escapeHTML(e.id) + '" ' +
          'aria-label="Excluir registro: ' + m.label + (time ? ' às ' + time : '') + '">Excluir</button>' +
      '</div>' + note +
    '</li>';
  }

  function renderHistory() {
    var days = groupByDay();

    if (!days.length) {
      historyBox.innerHTML = '<div class="empty-state"><p>Seu histórico aparece aqui depois do primeiro registro.</p>' +
        '<p class="small">Sem pressa: registre quando se sentir à vontade.</p></div>';
      moreBtn.hidden = true;
      return;
    }

    historyBox.innerHTML = days.slice(0, visibleDays).map(function (d) {
      return '<section class="history-day" aria-label="' + Eq.escapeHTML(Eq.dayTitle(d.date)) + '">' +
        '<h3 class="history-day-title">' + Eq.escapeHTML(Eq.dayTitle(d.date)) + '</h3>' +
        '<ul class="entry-list">' + d.entries.map(entryHTML).join('') + '</ul>' +
      '</section>';
    }).join('');

    moreBtn.hidden = days.length <= visibleDays;
  }

  function renderAll() {
    renderChart();
    renderHistory();
  }

  /* ---------- Eventos ---------- */

  function updateCounter() {
    counter.textContent = noteField.value.length + ' / ' + noteField.maxLength;
  }

  noteField.addEventListener('input', updateCounter);

  optionsBox.addEventListener('change', function () {
    errorBox.hidden = true;
    clearFeedback();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var checked = form.querySelector('input[name="mood"]:checked');

    if (!checked) {
      errorBox.hidden = false;
      var first = optionsBox.querySelector('input');
      if (first) first.focus();
      return;
    }

    errorBox.hidden = true;
    var entry = Store.addMood(checked.value, noteField.value);
    if (!entry) {
      Eq.toast('Não foi possível salvar o registro neste navegador.');
      return;
    }

    form.reset();
    updateCounter();
    showFeedback(entry.mood);
    visibleDays = Math.max(visibleDays, DAYS_STEP);
    renderAll();
    Eq.toast('Registro salvo.');
  });

  historyBox.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-delete]');
    if (!btn) return;
    if (!window.confirm('Excluir este registro? Esta ação não pode ser desfeita.')) return;
    Store.removeMood(btn.getAttribute('data-delete'));
    renderAll();
    historyTitle.focus();
    Eq.toast('Registro excluído.');
  });

  moreBtn.addEventListener('click', function () {
    visibleDays += DAYS_STEP;
    renderHistory();
  });

  /* ---------- Início ---------- */

  renderOptions();
  updateCounter();
  renderAll();
})();
