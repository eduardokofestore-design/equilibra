/* ==========================================================
   Equilibra — tela "Biblioteca do bem-estar"
   Busca, filtro por categoria, favoritos e links para as fontes.
   Depende de: storage.js, main.js e artigos.js
   ========================================================== */
(function () {
  'use strict';

  var Store = window.EquilibraStore;
  var Eq = window.Equilibra;
  var ARTIGOS = window.EQUILIBRA_ARTIGOS || [];
  var CATEGORIAS = window.EQUILIBRA_CATEGORIAS || [];

  var state = { query: '', cat: 'todas', onlyFav: false };

  var searchEl = document.getElementById('busca');
  var filtersEl = document.getElementById('filtros');
  var gridEl = document.getElementById('artigos');
  var statusEl = document.getElementById('resultado');
  var emptyEl = document.getElementById('sem-resultados');
  var clearBtn = document.getElementById('limpar-filtros');

  var catLabel = {};
  CATEGORIAS.forEach(function (c) { catLabel[c.id] = c.label; });

  /* ---------- Utilitários ---------- */

  // Minúsculas e sem acentos, para a busca ignorar "á" x "a".
  function normalize(text) {
    return String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
  }

  function matches(a) {
    if (state.onlyFav && !Store.isFavorite(a.id)) return false;
    if (state.cat !== 'todas' && a.categorias.indexOf(state.cat) === -1) return false;
    if (state.query) {
      var haystack = normalize([a.titulo, a.resumo, a.fonte, a.categorias.map(function (c) { return catLabel[c]; }).join(' ')].join(' '));
      var terms = normalize(state.query).split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) {
        if (haystack.indexOf(terms[i]) === -1) return false;
      }
    }
    return true;
  }

  /* ---------- Filtros ---------- */

  function renderFilters() {
    var chips = [{ id: 'todas', label: 'Todas' }].concat(CATEGORIAS);
    filtersEl.innerHTML = chips.map(function (c) {
      var on = state.cat === c.id;
      return '<button type="button" class="chip" data-cat="' + Eq.escapeHTML(c.id) + '" aria-pressed="' + on + '">' +
        Eq.escapeHTML(c.label) + '</button>';
    }).join('') +
      '<button type="button" class="chip chip-fav" data-fav-filter aria-pressed="' + state.onlyFav + '">★ Meus favoritos</button>';
  }

  /* ---------- Cards ---------- */

  function cardHTML(a) {
    var fav = Store.isFavorite(a.id);
    var tags = a.categorias.map(function (c) {
      return '<span class="tag">' + Eq.escapeHTML(catLabel[c] || c) + '</span>';
    }).join(' ');
    var host = hostOf(a.url);

    return '<article class="card article-card" data-id="' + Eq.escapeHTML(a.id) + '">' +
      '<div class="article-tags">' + tags + '</div>' +
      '<h2 class="article-title">' + Eq.escapeHTML(a.titulo) + '</h2>' +
      '<p class="article-summary">' + Eq.escapeHTML(a.resumo) + '</p>' +
      '<p class="article-meta small muted">' +
        Eq.escapeHTML(a.fonte) + ' · ' + Eq.escapeHTML(a.tipo) + ' · ' + Eq.escapeHTML(a.idioma) +
        (host ? '<br>' + Eq.escapeHTML(host) : '') +
      '</p>' +
      '<div class="article-actions">' +
        '<a class="btn btn-small btn-primary" href="' + Eq.escapeHTML(a.url) + '" target="_blank" rel="noopener noreferrer">' +
          'Ler na fonte<span class="visually-hidden"> (abre em nova aba): ' + Eq.escapeHTML(a.titulo) + '</span></a>' +
        '<button type="button" class="btn btn-small btn-ghost fav-btn" data-fav="' + Eq.escapeHTML(a.id) + '" aria-pressed="' + fav + '">' +
          '<span aria-hidden="true">' + (fav ? '★' : '☆') + '</span> ' + (fav ? 'Salvo' : 'Salvar') +
          '<span class="visually-hidden"> nos favoritos: ' + Eq.escapeHTML(a.titulo) + '</span></button>' +
      '</div>' +
    '</article>';
  }

  function render() {
    var list = ARTIGOS.filter(matches);
    gridEl.innerHTML = list.map(cardHTML).join('');
    emptyEl.hidden = list.length > 0;

    if (state.onlyFav && !Store.getFavorites().length) {
      statusEl.textContent = 'Você ainda não salvou nenhum conteúdo. Use o botão Salvar nos cards.';
    } else {
      statusEl.textContent = list.length === 1 ? '1 conteúdo encontrado.' : list.length + ' conteúdos encontrados.';
    }
  }

  /* ---------- Eventos ---------- */

  searchEl.addEventListener('input', function () {
    state.query = searchEl.value;
    render();
  });

  filtersEl.addEventListener('click', function (e) {
    var catBtn = e.target.closest('[data-cat]');
    var favBtn = e.target.closest('[data-fav-filter]');
    if (catBtn) {
      state.cat = catBtn.getAttribute('data-cat');
    } else if (favBtn) {
      state.onlyFav = !state.onlyFav;
    } else {
      return;
    }
    renderFilters();
    render();
    // Mantém o foco no botão que foi acionado (a lista de filtros é redesenhada).
    var again = catBtn
      ? filtersEl.querySelector('[data-cat="' + state.cat + '"]')
      : filtersEl.querySelector('[data-fav-filter]');
    if (again) again.focus();
  });

  gridEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-fav]');
    if (!btn) return;
    var nowFav = Store.toggleFavorite(btn.getAttribute('data-fav'));

    if (state.onlyFav && !nowFav) {
      // O card sai da lista de favoritos: redesenha e leva o foco ao resumo.
      render();
      statusEl.setAttribute('tabindex', '-1');
      statusEl.focus();
      Eq.toast('Removido dos favoritos.');
      return;
    }

    btn.setAttribute('aria-pressed', String(nowFav));
    btn.firstChild.textContent = nowFav ? '★' : '☆';
    btn.childNodes[1].textContent = nowFav ? ' Salvo' : ' Salvar';
    Eq.toast(nowFav ? 'Salvo nos favoritos.' : 'Removido dos favoritos.');
  });

  clearBtn.addEventListener('click', function () {
    state = { query: '', cat: 'todas', onlyFav: false };
    searchEl.value = '';
    renderFilters();
    render();
    searchEl.focus();
  });

  renderFilters();
  render();
})();
