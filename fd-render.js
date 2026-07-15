/* ═══════════════════════════════════════════════
   SPX Field Assistant — Folha de Dados
   fd-render.js
   ═══════════════════════════════════════════════ */

'use strict';

// ─── Aplicações por família/modelo ──────────────
const FD_APLICACOES = {
  SW:  ['Laticínios', 'Bebidas', 'Cervejaria', 'Copização (CIP)', 'Produtos Químicos'],
  SV:  ['Laticínios', 'Bebidas', 'Processamento de alimentos', 'Farmacêutico'],
  DA:  ['Laticínios', 'Bebidas', 'Cervejaria', 'Farmacêutico', 'Cosméticos'],
  BLV: ['Alta pressão', 'Laticínios', 'Bebidas', 'Cervejaria'],
  VPN: ['Vácuo', 'Laticínios', 'Bebidas', 'Farmacêutico'],
  D:   ['Laticínios', 'Bebidas', 'Processamento de alimentos'],
  DEFAULT: ['Laticínios', 'Bebidas', 'Indústria de alimentos', 'Processamento industrial'],
};

function obterAplicacoesPorFamilia(dados) {
  const familia = (dados.familia || dados.key_pos1 || '').toUpperCase();
  const modelo  = (dados.modelo  || '').toUpperCase();
  for (const [key, apps] of Object.entries(FD_APLICACOES)) {
    if (key === 'DEFAULT') continue;
    if (familia.startsWith(key) || modelo.startsWith(key)) return apps;
  }
  return FD_APLICACOES.DEFAULT;
}

// ─── Título da FD ───────────────────────────────
function montarTituloFD(dados) {
  const desc = dados.descricao || dados.tipoValvula || '';
  const modelo = (dados.modelo || '').toUpperCase();
  if (!desc && !modelo) return 'VÁLVULA SPX FLOW';

  // Mapear descrições comuns para título PT-BR
  const map = [
    [/single seat/i,   'VÁLVULA ASSENTO SIMPLES SANITÁRIA'],
    [/double seat/i,   'VÁLVULA ASSENTO DUPLO SANITÁRIA'],
    [/butterfly/i,     'VÁLVULA BORBOLETA SANITÁRIA'],
    [/ball/i,          'VÁLVULA ESFERA SANITÁRIA'],
    [/check/i,         'VÁLVULA DE RETENÇÃO SANITÁRIA'],
    [/diaphragm/i,     'VÁLVULA DIAFRAGMA SANITÁRIA'],
    [/mixproof/i,      'VÁLVULA MISTURA SEGURA (MIXPROOF)'],
    [/sample/i,        'VÁLVULA DE AMOSTRAGEM SANITÁRIA'],
    [/pressure/i,      'VÁLVULA DE PRESSÃO SANITÁRIA'],
  ];
  for (const [re, title] of map) {
    if (re.test(desc)) return title;
  }
  // Fallback: usar descrição + modelo
  return desc ? desc.toUpperCase() : `VÁLVULA ${modelo}`;
}

// ─── Imagem da válvula ───────────────────────────
// URLs do SPX Flow media hub — sem necessidade de hospedar localmente
const SPX_IMG_BASE = 'https://www.spxflow.com/assets/half-width-transparent/';

const FD_IMG_MAP = {
  // ── Assento simples (SW) ──
  'SW':   SPX_IMG_BASE + 'apv-valves-single-seat-sw4-with-cu4.png',
  'SW3':  SPX_IMG_BASE + 'apv-valves-single-seat-sw4-with-cu4.png',
  'SW4':  SPX_IMG_BASE + 'apv-valves-single-seat-sw4-with-cu4.png',
  'SW41': SPX_IMG_BASE + 'apv-valves-single-seat-sw4-with-cu4.png',

  // ── Borboleta / Butterfly (SV) ──
  'SV':   SPX_IMG_BASE + 'apv-valves-butterfly-sv-svs-manual-actuator-control-unit-trio.png',
  'SV1':  SPX_IMG_BASE + 'apv-valves-butterfly-sv-svs-manual-actuator-control-unit-trio.png',
  'SV3':  SPX_IMG_BASE + 'apv-valves-butterfly-sv-svs-manual-actuator-control-unit-trio.png',
  'SVS':  SPX_IMG_BASE + 'apv-valves-butterfly-sv-svs-manual-actuator-control-unit-trio.png',

  // ── Esfera (BLV) ──
  'BLV':  SPX_IMG_BASE + 'apv-valves-ball-blv-3-types.png',
  'BLV1': SPX_IMG_BASE + 'apv-valves-ball-blv-3-types.png',
  'BLV2': SPX_IMG_BASE + 'apv-valves-ball-blv-3-types.png',
  'BLV3': SPX_IMG_BASE + 'apv-valves-ball-blv-3-types.png',

  // ── Retenção (VPN) ──
  'VPN':  SPX_IMG_BASE + 'apv-valves-check-vpn.png',
  'VPN1': SPX_IMG_BASE + 'apv-valves-check-vpn.png',

  // ── Retenção (RUF) ──
  'RUF':  SPX_IMG_BASE + 'apv-valves-check-ruf3.png',
  'RUF3': SPX_IMG_BASE + 'apv-valves-check-ruf3.png',

  // ── Regulagem (RG) ──
  'RG':   SPX_IMG_BASE + 'apv-valves-modulating-rg4.png',
  'RG4':  SPX_IMG_BASE + 'apv-valves-modulating-rg4.png',

  // ── Assento duplo / Mix-proof (D4) ──
  'D4':   SPX_IMG_BASE + 'apv-wcb-valves-double-seat-mix-proof-d4-single-valve-manifold.png',

  // ── Duplo Selo (SD) ──
  'SD':   SPX_IMG_BASE + 'apv-valves-double-seal-sd4-cu4.png',
  'SD4':  SPX_IMG_BASE + 'apv-valves-double-seal-sd4-cu4.png',

  // ── Assento duplo (DE3) ──
  'DE':   SPX_IMG_BASE + 'apv-valves-double-seat-de3.png',
  'DE3':  SPX_IMG_BASE + 'apv-valves-double-seat-de3.png',

  // ── Assento duplo (DA3) ──
  'DA':   SPX_IMG_BASE + 'apv-valves-double-seat-da3plus.png',
  'DA3':  SPX_IMG_BASE + 'apv-valves-double-seat-da3plus.png',
  'DA3+': SPX_IMG_BASE + 'apv-valves-double-seat-da3plus.png',
  'DA4':  SPX_IMG_BASE + 'apv-valves-double-seat-da3plus.png',

  // ── UF4 ──
  'UF':   SPX_IMG_BASE + 'apv-uf4-cu4-03.png',
  'UF4':  SPX_IMG_BASE + 'apv-uf4-cu4-03.png',
};

function obterImagemFD(dados) {
  if (dados.imagem) return dados.imagem;

  const modelo  = (dados.modelo  || '').toUpperCase().replace(/\s/g, '');
  const familia = (dados.familia || dados.key_pos1 || '').toUpperCase().replace(/\s/g, '');

  // 1. Correspondência exata pelo modelo
  if (FD_IMG_MAP[modelo]) return FD_IMG_MAP[modelo];

  // 2. Correspondência exata pela família
  if (FD_IMG_MAP[familia]) return FD_IMG_MAP[familia];

  // 3. Correspondência por prefixo (modelo começa com a chave do mapa)
  // Ordenar por comprimento desc para priorizar chaves mais específicas (SW41 > SW4 > SW)
  const keys = Object.keys(FD_IMG_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (modelo.startsWith(key) || familia.startsWith(key)) return FD_IMG_MAP[key];
  }

  return ''; // sem imagem → renderizará placeholder
}

// ─── Normalização ────────────────────────────────
function normalizarDadosFD(src, ctx = {}) {
  return {
    partNumber:        src.pn || src.partNumber || src.codigo || '',
    modelo:            src.modelo || '',
    familia:           src.familia || src.key_pos1 || '',
    titulo:            ctx.titulo  || montarTituloFD(src),
    descricao:         src.descricao || src.tipoValvula || '',
    aplicacoes:        obterAplicacoesPorFamilia(src),
    codProjeto:        ctx.codProjeto || src.codProjeto || '',
    data:              ctx.data || new Date().toLocaleDateString('pt-BR'),
    tamanho:           src.bitola || src.tamanho || src.size || '',
    tipoConexao:       src.conexoes || src.conexao || src.tipoConexao || '',
    acionamento:       src.atuador  || src.atuacao  || src.acionamento || '',
    comunicacao:       src.controle || src.comunicacao || '',
    conexaoAtuador:    src.conexaoAtuador || '',
    construcaoVedacao: src.constVedacao || src.tipoAssento || src.valveTipo || '',
    materialVedacao:   src.materialVedacao || src.vedacao || '',
    acabamento:        src.acabamentoSuperficial || src.acabamento || '',
    adicionais:        src.especiais || src.adicionais || '',
    kitVedacao:        src.kitReparo || src.kit || '',
    unidadeControle:   src.unidadeControle || '',
    adaptador:         src.kitAdaptador || '',
    imagem:            obterImagemFD(src),
    tag:               src.tag || '',
    setor:             src.setor || '',
    serie:             src.serie || '',
  };
}

// ─── Busca de dados do catálogo ──────────────────
async function buscarDadosValvulaPorCodigo(codigo) {
  const clean = String(codigo || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean) return null;

  // 1. Tentar catálogo já carregado na memória
  await (typeof loadValveSpecs === 'function' ? loadValveSpecs() : Promise.resolve());
  const specs = window.valveSpecs || {};

  // Busca exata
  if (specs[clean]) return normalizarDadosFD(specs[clean]);

  // Busca com prefixo "H"
  const withH  = clean.startsWith('H') ? clean : 'H' + clean;
  const withoutH = clean.startsWith('H') ? clean.slice(1) : clean;
  if (specs[withH])     return normalizarDadosFD(specs[withH]);
  if (specs[withoutH])  return normalizarDadosFD(specs[withoutH]);

  // 2. Tentar Firestore (coleção valve_specs) se disponível
  if (window._db) {
    try {
      const { doc, getDoc, collection } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      for (const id of [clean, withH, withoutH]) {
        const snap = await getDoc(doc(window._db, 'spx_valve_specs', id));
        if (snap.exists()) return normalizarDadosFD({ ...snap.data(), id: snap.id });
      }
    } catch(_) {}
  }

  return null;
}

// ─── Ícone SVG por campo ─────────────────────────
function fdIconSVG(tipo) {
  const icons = {
    pn:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M1.05 12H7m10 0h5.95M12 1.05V7m0 10v5.95"/></svg>`,
    modelo:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    tamanho:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 3H3v18h18V3z"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`,
    acionamento:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    conexao:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    vedacao:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  };
  return icons[tipo] || icons.pn;
}

// ─── Renderizar uma FD ───────────────────────────
function renderFolhaDados(fd) {
  const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const val = (v, fallback = '') => v ? esc(v) : fallback;
  const sc  = (v) => v
    ? `<span class="fd-spare-code">${esc(v)}</span>`
    : `<span class="fd-spare-code empty">Sob consulta</span>`;

  const imagemHtml = fd.imagem
    ? `<img src="${esc(fd.imagem)}" alt="${esc(fd.modelo)}" class="fd-product-image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const placeholderHtml = `<div class="fd-product-placeholder" ${fd.imagem ? 'style="display:none"' : ''}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    <span>Imagem não disponível</span>
  </div>`;

  const apps = Array.isArray(fd.aplicacoes) ? fd.aplicacoes : [];

  return `
<div class="fd-page">

  <!-- HERO -->
  <div class="fd-hero">
    <div class="fd-brand">
      <img src="logo-fiedler-negativa.png" alt="Fiedler Automação Industrial" class="fd-logo"
           onerror="this.style.opacity='.5'">
    </div>
    <div class="fd-hero-right">
      <div class="fd-hero-tag">Folha de Dados</div>
      <div class="fd-hero-title">${esc(fd.titulo || 'VÁLVULA SPX FLOW')}</div>
    </div>
  </div>

  <!-- CONTENT: imagem | meta+descrição -->
  <div class="fd-content">
    <div class="fd-product-col">
      ${imagemHtml}${placeholderHtml}
    </div>
    <div class="fd-summary">
      <div class="fd-meta">
        <div class="fd-meta-item">
          <span class="fd-meta-label">Cód. Projeto</span>
          <span class="fd-meta-value">${val(fd.codProjeto, '—')}</span>
        </div>
        <div class="fd-meta-item">
          <span class="fd-meta-label">Data</span>
          <span class="fd-meta-value">${val(fd.data, '—')}</span>
        </div>
        ${fd.tag ? `<div class="fd-meta-item">
          <span class="fd-meta-label">TAG</span>
          <span class="fd-meta-value" style="font-size:10px">${esc(fd.tag)}</span>
        </div>` : ''}
        ${fd.setor ? `<div class="fd-meta-item">
          <span class="fd-meta-label">Setor</span>
          <span class="fd-meta-value" style="font-size:10px">${esc(fd.setor)}</span>
        </div>` : ''}
      </div>

      <div class="fd-lead">
        ${val(fd.descricao, 'Válvula de processo SPX Flow de alta performance higiênica.')}
      </div>

      ${apps.length ? `
      <div class="fd-applications-title">Principais Aplicações</div>
      <ul class="fd-applications">
        ${apps.map(a => `<li>${esc(a)}</li>`).join('')}
      </ul>` : ''}
    </div>
  </div>

  <!-- FAIXA DE ÍCONES -->
  <div class="fd-icons">
    <div class="fd-icon-card">
      ${fdIconSVG('pn')}
      <span class="fd-icon-label">Part Number</span>
      <span class="fd-icon-value">${val(fd.partNumber, '—')}</span>
    </div>
    <div class="fd-icon-card">
      ${fdIconSVG('modelo')}
      <span class="fd-icon-label">Modelo</span>
      <span class="fd-icon-value">${val(fd.modelo, '—')}</span>
    </div>
    <div class="fd-icon-card">
      ${fdIconSVG('tamanho')}
      <span class="fd-icon-label">Tamanho</span>
      <span class="fd-icon-value">${val(fd.tamanho, '—')}</span>
    </div>
    <div class="fd-icon-card">
      ${fdIconSVG('acionamento')}
      <span class="fd-icon-label">Acionamento</span>
      <span class="fd-icon-value">${val(fd.acionamento, '—')}</span>
    </div>
    <div class="fd-icon-card">
      ${fdIconSVG('conexao')}
      <span class="fd-icon-label">Tipo de Conexão</span>
      <span class="fd-icon-value">${val(fd.tipoConexao, '—')}</span>
    </div>
    <div class="fd-icon-card">
      ${fdIconSVG('vedacao')}
      <span class="fd-icon-label">Material de Vedação</span>
      <span class="fd-icon-value">${val(fd.materialVedacao, '—')}</span>
    </div>
  </div>

  <!-- BOTTOM: Descrição | Características | Peças -->
  <div class="fd-bottom-grid">

    <!-- Descrição -->
    <div class="fd-panel fd-description">
      <div class="fd-panel-title">Descrição</div>
      <p>${val(fd.descricao,
        'Válvula de processo SPX Flow de alta performance higiênica, projetada para aplicações de controle de fluxo exigentes nas indústrias de alimentos, bebidas e farmacêutica.')}</p>
    </div>

    <!-- Características técnicas -->
    <div class="fd-panel fd-technical">
      <div class="fd-panel-title">Características Técnicas</div>
      <table class="fd-tech-table">
        <tr><td>Válvula (Part Number)</td><td>${val(fd.partNumber)}</td></tr>
        <tr><td>Modelo</td><td>${val(fd.modelo)}</td></tr>
        <tr><td>Tipo de assento</td><td>${val(fd.construcaoVedacao)}</td></tr>
        <tr><td>Tamanho da conexão</td><td>${val(fd.tamanho)}</td></tr>
        <tr><td>Acionamento</td><td>${val(fd.acionamento)}</td></tr>
        <tr><td>Comunicação</td><td>${val(fd.comunicacao)}</td></tr>
        <tr><td>Conexão atuador</td><td>${val(fd.conexaoAtuador)}</td></tr>
        <tr><td>Construção vedação</td><td>${val(fd.construcaoVedacao)}</td></tr>
        <tr><td>Material da vedação</td><td>${val(fd.materialVedacao)}</td></tr>
        <tr><td>Tipo de acabamento</td><td>${val(fd.acabamento)}</td></tr>
        <tr><td>Adicionais</td><td>${val(fd.adicionais)}</td></tr>
      </table>
    </div>

    <!-- Peças de reposição -->
    <div class="fd-panel fd-spares">
      <div class="fd-panel-title">Peças de Reposição</div>
      <div class="fd-spare-item">
        <div class="fd-spare-label">Kit vedação</div>
        ${sc(fd.kitVedacao)}
      </div>
      <div class="fd-spare-item">
        <div class="fd-spare-label">Unidade de controle</div>
        ${sc(fd.unidadeControle)}
      </div>
      <div class="fd-spare-item">
        <div class="fd-spare-label">Adaptador</div>
        ${sc(fd.adaptador)}
      </div>
    </div>
  </div>

  <!-- RODAPÉ -->
  <div class="fd-footer">
    <div class="fd-footer-left">
      PERFORMANCE NO <strong>PRESENTE</strong>,<br>EFICIÊNCIA PARA O <strong>FUTURO</strong>.
    </div>
    <div class="fd-footer-center">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        width="14" height="14" style="vertical-align:middle;margin-right:4px;color:rgba(255,255,255,.7)">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      fiedler.com.br
    </div>
    <div class="fd-footer-right">ESPECIALISTAS EM<br>PROCESSOS INDUSTRIAIS.</div>
  </div>

</div>`;
}

// ─── Múltiplas FDs ───────────────────────────────
function renderFolhasDadosMultiplas(lista) {
  return lista.map(renderFolhaDados).join('\n');
}

// ─── Impressão ───────────────────────────────────
function imprimirFD() {
  window.scrollTo(0, 0);
  setTimeout(() => window.print(), 300);
}

// ─── Abrir preview na tela do sistema ────────────
function abrirPreviewFD(htmlFDs, titulo) {
  const area = document.getElementById('fd-print-area');
  const prev = document.getElementById('fd-preview-container');
  const tit  = document.getElementById('fd-preview-title');
  const act  = document.getElementById('fd-preview-actions');
  const empty= document.getElementById('fd-empty-state');

  if (!area) return;
  area.innerHTML = htmlFDs;
  if (prev) prev.innerHTML = htmlFDs;
  if (tit)  tit.textContent = titulo || 'Folha de Dados';
  if (act)  act.style.display = 'flex';
  if (empty) empty.style.display = 'none';
}

// ─── Gerar FD por equipamento ────────────────────
async function gerarFDPorEquipamento(equipId) {
  const equip = (window.equipments || []).find(e => e.id === equipId);
  if (!equip) { alert('Equipamento não encontrado.'); return; }

  // Enriquecer com dados do catálogo se possível
  let base = { ...equip };
  if (equip.pn) {
    await (typeof loadValveSpecs === 'function' ? loadValveSpecs() : Promise.resolve());
    const specs = window.valveSpecs || {};
    const clean = String(equip.pn).toUpperCase().replace(/[^A-Z0-9]/g,'');
    const spec  = specs[clean] || specs['H'+clean] || specs[clean.replace(/^H/,'')];
    if (spec) base = { ...spec, ...equip }; // equip tem prioridade
  }

  const fd = normalizarDadosFD(base);
  const html = renderFolhaDados(fd);

  navigate('fd');
  setTimeout(() => {
    abrirPreviewFD(html, `FD — ${fd.partNumber || equip.modelo || 'Equipamento'}`);
  }, 80);
}

// ─── Gerar FDs de uma visita ─────────────────────
async function gerarFDsVisita(visitId) {
  await (typeof loadValveSpecs === 'function' ? loadValveSpecs() : Promise.resolve());
  const specs = window.valveSpecs || {};

  const vEq = (window.equipments || []).filter(e => e.visitId === visitId);
  const valvulas = vEq.filter(e => {
    const t = (e.tipo || '').toLowerCase();
    return !t.includes('bomba') && !t.includes('trocador');
  });

  if (!valvulas.length) {
    alert('Nenhuma válvula encontrada nesta visita para gerar Folha de Dados.');
    return;
  }

  const lista = valvulas.map(e => {
    let base = { ...e };
    if (e.pn) {
      const clean = String(e.pn).toUpperCase().replace(/[^A-Z0-9]/g,'');
      const spec  = specs[clean] || specs['H'+clean] || specs[clean.replace(/^H/,'')];
      if (spec) base = { ...spec, ...e };
    }
    return normalizarDadosFD(base);
  });

  const html = renderFolhasDadosMultiplas(lista);
  const visit = (window.visits || []).find(v => v.id === visitId);

  navigate('fd');
  setTimeout(() => {
    abrirPreviewFD(html, `FDs — ${visit?.cliente || 'Visita'} (${lista.length} válvula${lista.length !== 1 ? 's' : ''})`);
  }, 80);
}

// ─── Busca avulsa ─────────────────────────────────
async function buscarEGerarFD() {
  const input = document.getElementById('fd-codigo-input');
  const msg   = document.getElementById('fd-search-msg');
  const btn   = document.getElementById('fd-btn-buscar');
  if (!input) return;

  const codigo = input.value.trim();
  if (!codigo) { input.focus(); return; }

  if (msg)  { msg.textContent = 'Buscando…'; msg.style.color = 'var(--text3, #9AA5B4)'; }
  if (btn)  { btn.disabled = true; btn.textContent = 'Buscando…'; }

  try {
    const fd = await buscarDadosValvulaPorCodigo(codigo);
    if (!fd) {
      if (msg) {
        msg.textContent = 'Código não encontrado no catálogo. Verifique o Part Number ou complete os dados manualmente.';
        msg.style.color = 'var(--red, #DC2626)';
      }
    } else {
      if (msg) { msg.textContent = ''; }
      abrirPreviewFD(renderFolhaDados(fd), `FD — ${fd.partNumber || codigo}`);
    }
  } finally {
    if (btn)  { btn.disabled = false; btn.textContent = 'Gerar FD'; }
  }
}

function limparFD() {
  const input  = document.getElementById('fd-codigo-input');
  const prev   = document.getElementById('fd-preview-container');
  const area   = document.getElementById('fd-print-area');
  const act    = document.getElementById('fd-preview-actions');
  const empty  = document.getElementById('fd-empty-state');
  const msg    = document.getElementById('fd-search-msg');

  if (input) { input.value = ''; input.focus(); }
  if (prev)  prev.innerHTML = '';
  if (area)  area.innerHTML = '';
  if (act)   act.style.display = 'none';
  if (empty) empty.style.display = 'flex';
  if (msg)   msg.textContent = '';
}

// ─── Expor ao window ──────────────────────────────
window.buscarEGerarFD       = buscarEGerarFD;
window.limparFD             = limparFD;
window.imprimirFD           = imprimirFD;
window.gerarFDPorEquipamento = gerarFDPorEquipamento;
window.gerarFDsVisita       = gerarFDsVisita;
window.normalizarDadosFD    = normalizarDadosFD;
window.renderFolhaDados     = renderFolhaDados;
window.renderFolhasDadosMultiplas = renderFolhasDadosMultiplas;
