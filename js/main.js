/* ==========================================================
   Equilibra — script comum a todas as páginas
   - injeta cabeçalho, menu e rodapé (um único lugar para editar)
   - avisos (toast), exportar/importar/apagar dados
   Cada página deve declarar no <body>:
     data-root=""    (index.html)   ou   data-root="../"  (pages/*.html)
     data-page="inicio | humor | rotina | biblioteca | apoio"
   Carregar depois de storage.js.
   ========================================================== */
(function () {
  'use strict';

  var Store = window.EquilibraStore;
  var root = document.body.getAttribute('data-root') || '';
  var current = document.body.getAttribute('data-page') || '';

  var NAV = [
    { id: 'inicio',     label: 'Início',     href: 'index.html' },
    { id: 'humor',      label: 'Meu humor',  href: 'pages/humor.html' },
    { id: 'rotina',     label: 'Minha rotina', href: 'pages/rotina.html' },
    { id: 'biblioteca', label: 'Biblioteca', href: 'pages/biblioteca.html' },
    { id: 'apoio',      label: 'Apoio',      href: 'pages/apoio.html' }
  ];

  /* ---------- Utilitários públicos ---------- */

  // Escapa texto para uso em HTML e em valores de atributos.
  function escapeHTML(text) {
    return (text == null ? '' : String(text))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Cria um Date local a partir de 'AAAA-MM-DD'.
  function dateFromKey(key) {
    var p = String(key).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  // 'Hoje', 'Ontem' ou 'Terça-feira, 10/11/2026'.
  function dayTitle(key) {
    var today = new Date();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (key === Store.dateKey(today)) return 'Hoje';
    if (key === Store.dateKey(yesterday)) return 'Ontem';
    var weekday = dateFromKey(key).toLocaleDateString('pt-BR', { weekday: 'long' });
    return weekday.charAt(0).toUpperCase() + weekday.slice(1) + ', ' + formatDate(key);
  }

  function formatDate(key) {
    // key: 'AAAA-MM-DD' -> '11/11/2026'
    var p = String(key).split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : key;
  }

  function formatTime(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function greeting() {
    var h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  function toast(message) {
    var area = document.getElementById('toast-area');
    if (!area) {
      area = document.createElement('div');
      area.id = 'toast-area';
      area.className = 'toast-area';
      area.setAttribute('role', 'status');
      area.setAttribute('aria-live', 'polite');
      document.body.appendChild(area);
    }
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    area.appendChild(el);
    setTimeout(function () { el.remove(); }, 3500);
  }

  /* ---------- Cabeçalho ---------- */

  function buildHeader() {
    var links = NAV.map(function (item) {
      var active = item.id === current ? ' aria-current="page"' : '';
      return '<li><a href="' + root + item.href + '"' + active + '>' + item.label + '</a></li>';
    }).join('');

    var header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML =
      '<div class="container header-inner">' +
        '<a class="brand" href="' + root + 'index.html" aria-label="Equilibra, página inicial">' +
          '<span class="brand-mark" aria-hidden="true"></span>Equilibra' +
        '</a>' +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Abrir menu">' +
          '<span aria-hidden="true">☰</span>' +
        '</button>' +
        '<nav class="site-nav" id="site-nav" aria-label="Principal"><ul>' + links + '</ul></nav>' +
      '</div>';

    var toggle = header.querySelector('.nav-toggle');
    var nav = header.querySelector('.site-nav');

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      toggle.firstChild.textContent = open ? '✕' : '☰';
    }

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    return header;
  }

  /* ---------- Rodapé ---------- */

  function buildFooter() {
    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="container footer-grid">' +
        '<div>' +
          '<h2>Sobre o Equilibra</h2>' +
          '<p>O Equilibra tem caráter educativo e de incentivo ao autocuidado. ' +
          'Ele não oferece diagnóstico nem tratamento e não substitui o acompanhamento de profissionais de saúde.</p>' +
          '<p>Precisa de ajuda agora? Veja a página <a href="' + root + 'pages/apoio.html">Apoio e acolhimento</a>.</p>' +
        '</div>' +
        '<div>' +
          '<h2>Meus dados</h2>' +
          '<p>Seus registros ficam salvos somente neste navegador. Faça um backup se quiser guardá-los ou levá-los para outro aparelho.</p>' +
          '<div class="footer-actions">' +
            '<button class="btn btn-small btn-ghost" type="button" data-action="export">Exportar</button>' +
            '<button class="btn btn-small btn-ghost" type="button" data-action="import">Importar</button>' +
            '<button class="btn btn-small btn-ghost" type="button" data-action="clear">Apagar tudo</button>' +
            '<input type="file" accept="application/json,.json" class="visually-hidden" id="import-file" tabindex="-1" aria-label="Escolher arquivo de backup">' +
          '</div>' +
        '</div>' +
      '</div>';

    var fileInput = footer.querySelector('#import-file');

    footer.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'export') exportToFile();
      if (action === 'import') fileInput.click();
      if (action === 'clear') clearData();
    });

    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) importFromFile(fileInput.files[0]);
      fileInput.value = '';
    });

    return footer;
  }

  /* ---------- Backup ---------- */

  function exportToFile() {
    var json = JSON.stringify(Store.exportData(), null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'equilibra-backup-' + Store.dateKey() + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Backup exportado.');
  }

  function importFromFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch (e) {
        toast('Não consegui ler esse arquivo.');
        return;
      }
      if (!window.confirm('Importar este backup vai substituir os dados atuais deste navegador. Deseja continuar?')) return;
      var result = Store.importData(parsed);
      if (result.ok) {
        toast('Backup importado. Atualizando a página…');
        setTimeout(function () { window.location.reload(); }, 900);
      } else {
        toast(result.error);
      }
    };
    reader.onerror = function () { toast('Não consegui ler esse arquivo.'); };
    reader.readAsText(file);
  }

  function clearData() {
    if (!window.confirm('Isso apagará todos os seus registros de humor, hábitos e favoritos deste navegador. Esta ação não pode ser desfeita. Deseja continuar?')) return;
    if (Store.clearAll()) {
      toast('Dados apagados. Atualizando a página…');
      setTimeout(function () { window.location.reload(); }, 900);
    } else {
      toast('Não foi possível apagar os dados.');
    }
  }

  /* ---------- Inicialização ---------- */

  function init() {
    // Link "pular para o conteúdo"
    var skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#conteudo';
    skip.textContent = 'Pular para o conteúdo';
    document.body.insertBefore(skip, document.body.firstChild);

    document.body.insertBefore(buildHeader(), skip.nextSibling);
    document.body.appendChild(buildFooter());

    if (!Store.available()) {
      var main = document.getElementById('conteudo');
      if (main) {
        var warn = document.createElement('div');
        warn.className = 'card card-peach';
        warn.setAttribute('role', 'alert');
        warn.innerHTML = '<strong>Armazenamento indisponível.</strong> ' +
          'Este navegador está bloqueando o salvamento de dados (modo anônimo ou configuração de privacidade). ' +
          'Você pode navegar, mas seus registros não serão guardados.';
        main.insertBefore(warn, main.firstChild);
      }
    }
  }

  window.Equilibra = {
    escapeHTML: escapeHTML,
    dateFromKey: dateFromKey,
    dayTitle: dayTitle,
    formatDate: formatDate,
    formatTime: formatTime,
    greeting: greeting,
    toast: toast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
