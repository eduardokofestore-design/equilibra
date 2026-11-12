/* ==========================================================
   Equilibra — tela inicial (dashboard)
   Resume o humor e os hábitos do dia e sugere uma atividade.
   Depende de: storage.js e main.js
   ========================================================== */
(function () {
  'use strict';

  var Store = window.EquilibraStore;
  var Eq = window.Equilibra;

  var SUGGESTIONS = [
    { titulo: 'Três respirações lentas',
      texto: 'Pare por um minuto. Inspire pelo nariz contando até 4 e solte pela boca contando até 6. Repita três vezes.',
      habito: 'Realizar exercícios de respiração' },
    { titulo: 'Um copo d’água agora',
      texto: 'Beba um copo d’água e aproveite para perceber como está o seu corpo neste momento.',
      habito: 'Beber água regularmente' },
    { titulo: 'Uma caminhada sem pressa',
      texto: 'Dê uma volta curta, sem meta de ritmo ou distância. Pode ser ao redor do quarteirão.',
      habito: 'Fazer uma caminhada' },
    { titulo: 'Um tempo longe das telas',
      texto: 'Deixe o celular de lado por alguns minutos. Olhe pela janela, alongue-se ou só descanse os olhos.',
      habito: 'Passar um tempo longe das telas' },
    { titulo: 'Algumas páginas de leitura',
      texto: 'Leia um trecho de algo de que você goste, por prazer e não por obrigação.',
      habito: 'Ler um livro' },
    { titulo: 'Um alongamento rápido',
      texto: 'Alongue pescoço, ombros e costas, principalmente se ficou muito tempo sentado(a).',
      habito: 'Alongar o corpo' },
    { titulo: 'Um momento de descanso',
      texto: 'Reserve alguns minutos para não fazer nada produtivo. Descansar também faz parte do cuidado.',
      habito: 'Reservar um momento para descanso' },
    { titulo: 'Três coisas boas do dia',
      texto: 'Anote três coisas, ainda que pequenas, que deram certo ou que fizeram bem hoje.',
      habito: 'Anotar três coisas boas do dia' },
    { titulo: 'Mexer o corpo',
      texto: 'Escolha um movimento de que você goste e faça por alguns minutos: dançar, pedalar, subir escadas.',
      habito: 'Praticar exercícios físicos' },
    { titulo: 'Dizer oi para alguém',
      texto: 'Mande uma mensagem para alguém de quem você gosta, só para saber como a pessoa está.',
      habito: 'Conversar com alguém querido' }
  ];

  function $(id) { return document.getElementById(id); }

  /* ---------- Boas-vindas e humor de hoje ---------- */

  function renderHero() {
    var now = new Date();
    $('saudacao').textContent = Eq.greeting() + '!';
    var dateText = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    $('data-hoje').textContent = dateText.charAt(0).toUpperCase() + dateText.slice(1);

    var today = Store.dateKey(now);
    var entries = Store.getMoods().filter(function (e) { return e.date === today; });
    var status = $('humor-hoje');

    if (!entries.length) {
      status.textContent = 'Você ainda não registrou seu humor hoje.';
      return;
    }

    entries.sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
    var last = entries[0];
    var mood = Store.MOODS.filter(function (m) { return m.id === last.mood; })[0];
    var time = Eq.formatTime(last.createdAt);
    status.textContent = 'Hoje você fez ' + entries.length + (entries.length === 1 ? ' registro' : ' registros') +
      (mood ? '. O último foi “' + mood.label + '”' + (time ? ', às ' + time : '') + '.' : '.');
  }

  /* ---------- Hábitos de hoje ---------- */

  function renderHabits() {
    var habits = Store.getHabits();
    var done = Store.getDoneHabits();
    var p = Store.habitProgress();
    var list = $('habitos-lista');

    $('habitos-barra').style.width = p.percent + '%';
    $('habitos-trilha').setAttribute('aria-valuenow', String(p.percent));

    if (!habits.length) {
      $('habitos-resumo').textContent = 'Você ainda não tem hábitos na rotina.';
      $('habitos-trilha').setAttribute('aria-valuetext', 'Nenhum hábito cadastrado');
      list.innerHTML = '';
      $('habitos-link').textContent = 'Criar minha rotina';
      return;
    }

    $('habitos-resumo').textContent = p.done + ' de ' + p.total +
      (p.total === 1 ? ' hábito concluído hoje' : ' hábitos concluídos hoje');
    $('habitos-trilha').setAttribute('aria-valuetext', p.done + ' de ' + p.total + ' hábitos concluídos hoje');
    $('habitos-link').textContent = 'Ir para Minha rotina';

    list.innerHTML = habits.slice(0, 5).map(function (h) {
      var isDone = done.indexOf(h.id) !== -1;
      return '<li class="' + (isDone ? 'is-done' : '') + '">' +
        '<span aria-hidden="true">' + (isDone ? '✓' : '○') + '</span> ' +
        Eq.escapeHTML(h.name) +
        '<span class="visually-hidden">' + (isDone ? ' (concluído)' : ' (pendente)') + '</span></li>';
    }).join('') + (habits.length > 5 ? '<li class="muted small">e mais ' + (habits.length - 5) + '…</li>' : '');
  }

  /* ---------- Atividade sugerida ---------- */

  function dayOfYear() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  var current = dayOfYear() % SUGGESTIONS.length;

  function hasHabit(name) {
    var lower = name.toLowerCase();
    return Store.getHabits().some(function (h) { return h.name.toLowerCase() === lower; });
  }

  function renderSuggestion() {
    var s = SUGGESTIONS[current];
    var addBtn = $('sugestao-add');
    $('sugestao-titulo').textContent = s.titulo;
    $('sugestao-texto').textContent = s.texto;
    $('sugestao-msg').textContent = '';

    if (hasHabit(s.habito)) {
      addBtn.disabled = true;
      addBtn.textContent = 'Já está na sua rotina';
    } else {
      addBtn.disabled = false;
      addBtn.textContent = 'Adicionar à minha rotina';
    }
  }

  $('sugestao-add').addEventListener('click', function () {
    var s = SUGGESTIONS[current];
    if (Store.getHabits().length >= 30) {
      $('sugestao-msg').textContent = 'Sua rotina está cheia. Remova um hábito na página Minha rotina para adicionar outro.';
      return;
    }
    if (Store.addHabit(s.habito)) {
      renderHabits();
      renderSuggestion();
      $('sugestao-msg').textContent = 'Adicionado à sua rotina.';
    }
  });

  $('sugestao-outra').addEventListener('click', function () {
    current = (current + 1) % SUGGESTIONS.length;
    renderSuggestion();
  });

  renderHero();
  renderHabits();
  renderSuggestion();
})();
