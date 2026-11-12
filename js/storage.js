/* ==========================================================
   Equilibra — camada de dados (localStorage)
   Todos os dados ficam apenas neste navegador, neste aparelho.
   Uso: window.EquilibraStore
   ========================================================== */
(function () {
  'use strict';

  var PREFIX = 'equilibra:';
  var DATA_VERSION = 1;

  /* ---------- Constantes compartilhadas ---------- */

  var MOODS = [
    { id: 'muito-bem', label: 'Muito bem', emoji: '😄', color: 'var(--mood-muito-bem)' },
    { id: 'bem',       label: 'Bem',       emoji: '🙂', color: 'var(--mood-bem)' },
    { id: 'neutro',    label: 'Neutro',    emoji: '😐', color: 'var(--mood-neutro)' },
    { id: 'triste',    label: 'Triste',    emoji: '😔', color: 'var(--mood-triste)' },
    { id: 'estressado', label: 'Estressado', emoji: '😣', color: 'var(--mood-estressado)' }
  ];

  // Sugestões que o usuário pode ativar na tela de rotina (nada é cadastrado automaticamente).
  var SUGGESTED_HABITS = [
    'Beber água regularmente',
    'Fazer uma caminhada',
    'Praticar exercícios físicos',
    'Reservar um momento para descanso',
    'Ler um livro',
    'Realizar exercícios de respiração',
    'Passar um tempo longe das telas'
  ];

  /* ---------- Utilitários ---------- */

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // Data local no formato AAAA-MM-DD (evita o erro de fuso do toISOString).
  function dateKey(date) {
    var d = date || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function isObject(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }

  // Identificadores aceitos em arquivos importados (letras, números, _ e -).
  function isSafeId(v) { return typeof v === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(v); }

  /* ---------- Leitura e escrita seguras ---------- */

  function available() {
    try {
      var k = PREFIX + '__teste';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- Humor ---------- */
  // Registro: { id, date: 'AAAA-MM-DD', createdAt: ISO, mood: id, note: texto }

  function getMoods() {
    var list = read('moods', []);
    return Array.isArray(list) ? list : [];
  }

  function addMood(moodId, note) {
    var valid = MOODS.some(function (m) { return m.id === moodId; });
    if (!valid) return null;
    var now = new Date();
    var entry = {
      id: uid(),
      date: dateKey(now),
      createdAt: now.toISOString(),
      mood: moodId,
      note: (note || '').trim().slice(0, 1000)
    };
    var list = getMoods();
    list.push(entry);
    return write('moods', list) ? entry : null;
  }

  function removeMood(id) {
    var list = getMoods().filter(function (e) { return e.id !== id; });
    return write('moods', list);
  }

  // Contagem por sentimento nos últimos N dias (inclui hoje).
  function countMoods(days) {
    var counts = {};
    MOODS.forEach(function (m) { counts[m.id] = 0; });
    var limit = new Date();
    limit.setHours(0, 0, 0, 0);
    limit.setDate(limit.getDate() - (days - 1));
    var from = dateKey(limit);
    getMoods().forEach(function (e) {
      if (e.date >= from && counts.hasOwnProperty(e.mood)) counts[e.mood] += 1;
    });
    return counts;
  }

  /* ---------- Hábitos ---------- */
  // Hábito: { id, name, createdAt }
  // Registro diário: { 'AAAA-MM-DD': [idsConcluídos] }

  function getHabits() {
    var list = read('habits', []);
    return Array.isArray(list) ? list : [];
  }

  function addHabit(name) {
    var clean = (name || '').trim().slice(0, 80);
    if (!clean) return null;
    var exists = getHabits().some(function (h) {
      return h.name.toLowerCase() === clean.toLowerCase();
    });
    if (exists) return null;
    var habit = { id: uid(), name: clean, createdAt: new Date().toISOString() };
    var list = getHabits();
    list.push(habit);
    return write('habits', list) ? habit : null;
  }

  function removeHabit(id) {
    var list = getHabits().filter(function (h) { return h.id !== id; });
    var log = getHabitLog();
    Object.keys(log).forEach(function (day) {
      log[day] = log[day].filter(function (hid) { return hid !== id; });
      if (log[day].length === 0) delete log[day];
    });
    return write('habits', list) && write('habitLog', log);
  }

  function getHabitLog() {
    var log = read('habitLog', {});
    return isObject(log) ? log : {};
  }

  function getDoneHabits(day) {
    var done = getHabitLog()[day || dateKey()];
    return Array.isArray(done) ? done : [];
  }

  function toggleHabit(id, day) {
    var key = day || dateKey();
    var log = getHabitLog();
    var done = Array.isArray(log[key]) ? log[key] : [];
    var i = done.indexOf(id);
    if (i === -1) done.push(id); else done.splice(i, 1);
    if (done.length) log[key] = done; else delete log[key];
    write('habitLog', log);
    return i === -1; // true = ficou concluído
  }

  // Progresso do dia: { done, total, percent }
  function habitProgress(day) {
    var key = day || dateKey();
    var ids = getHabits().map(function (h) { return h.id; });
    var done = getDoneHabits(key).filter(function (id) { return ids.indexOf(id) !== -1; }).length;
    var total = ids.length;
    return { done: done, total: total, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  /* ---------- Favoritos (biblioteca) ---------- */

  function getFavorites() {
    var list = read('favorites', []);
    return Array.isArray(list) ? list : [];
  }

  function isFavorite(id) { return getFavorites().indexOf(id) !== -1; }

  function toggleFavorite(id) {
    var list = getFavorites();
    var i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    write('favorites', list);
    return i === -1; // true = favoritado
  }

  /* ---------- Exportar, importar e apagar ---------- */

  function exportData() {
    return {
      app: 'Equilibra',
      version: DATA_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        moods: getMoods(),
        habits: getHabits(),
        habitLog: getHabitLog(),
        favorites: getFavorites()
      }
    };
  }

  // Valida o arquivo antes de substituir qualquer dado. Retorna { ok, error }.
  function importData(obj) {
    if (!isObject(obj) || obj.app !== 'Equilibra' || !isObject(obj.data)) {
      return { ok: false, error: 'Este arquivo não parece ser um backup do Equilibra.' };
    }
    var d = obj.data;
    var moodIds = MOODS.map(function (m) { return m.id; });

    var moods = (Array.isArray(d.moods) ? d.moods : []).filter(function (e) {
      return isObject(e) && isSafeId(e.id) && typeof e.date === 'string' &&
             /^\d{4}-\d{2}-\d{2}$/.test(e.date) && moodIds.indexOf(e.mood) !== -1;
    }).map(function (e) {
      return {
        id: e.id,
        date: e.date,
        createdAt: typeof e.createdAt === 'string' ? e.createdAt : e.date + 'T12:00:00.000Z',
        mood: e.mood,
        note: typeof e.note === 'string' ? e.note.slice(0, 1000) : ''
      };
    });

    var habits = (Array.isArray(d.habits) ? d.habits : []).filter(function (h) {
      return isObject(h) && isSafeId(h.id) && typeof h.name === 'string' && h.name.trim();
    }).map(function (h) {
      return {
        id: h.id,
        name: h.name.trim().slice(0, 80),
        createdAt: typeof h.createdAt === 'string' ? h.createdAt : new Date().toISOString()
      };
    });

    var habitLog = {};
    if (isObject(d.habitLog)) {
      Object.keys(d.habitLog).forEach(function (day) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Array.isArray(d.habitLog[day])) {
          var ids = d.habitLog[day].filter(isSafeId);
          if (ids.length) habitLog[day] = ids;
        }
      });
    }

    var favorites = (Array.isArray(d.favorites) ? d.favorites : []).filter(isSafeId);

    var saved = write('moods', moods) && write('habits', habits) &&
                write('habitLog', habitLog) && write('favorites', favorites);
    return saved ? { ok: true } : { ok: false, error: 'Não foi possível salvar os dados neste navegador.' };
  }

  function clearAll() {
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) keys.push(k);
      }
      keys.forEach(function (k) { localStorage.removeItem(k); });
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- API pública ---------- */

  window.EquilibraStore = {
    MOODS: MOODS,
    SUGGESTED_HABITS: SUGGESTED_HABITS,
    available: available,
    dateKey: dateKey,
    uid: uid,
    getMoods: getMoods,
    addMood: addMood,
    removeMood: removeMood,
    countMoods: countMoods,
    getHabits: getHabits,
    addHabit: addHabit,
    removeHabit: removeHabit,
    getHabitLog: getHabitLog,
    getDoneHabits: getDoneHabits,
    toggleHabit: toggleHabit,
    habitProgress: habitProgress,
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
    exportData: exportData,
    importData: importData,
    clearAll: clearAll
  };
})();
