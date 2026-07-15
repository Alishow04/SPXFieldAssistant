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


// ─── Helpers premium da FD: normalização, tradução e kits ─────────────
function fdCleanText(v) {
  return String(v ?? '').trim();
}

function fdNormalizePN(v) {
  return fdCleanText(v).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function fdFirstFilled(...values) {
  for (const v of values) {
    const txt = fdCleanText(v);
    if (txt) return txt;
  }
  return '';
}

function fdNormalizeSpareCode(v) {
  const txt = fdCleanText(v);
  if (!txt) return '';

  const n = txt
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  if (
    n === '-' ||
    n === '—' ||
    n === 'CONSULTAR' ||
    n === 'SOB CONSULTA' ||
    n === 'NAO INFORMADO' ||
    n === 'NÃO INFORMADO' ||
    n === 'N/A' ||
    n === 'NA'
  ) {
    return '';
  }

  return txt;
}

function fdFindKitRecordByPN(pn) {
  const clean = fdNormalizePN(pn);
  if (!clean) return null;

  const candidates = new Set([
    clean,
    clean.startsWith('H') ? clean.slice(1) : 'H' + clean
  ]);

  const list = Array.isArray(window.kits) ? window.kits : [];

  return list.find(k => {
    const kpn = fdNormalizePN(k.pn || k.partNumber || k.codigo || k.cod_spx || k.codSpx || '');
    return candidates.has(kpn);
  }) || null;
}

function fdApplyKitTable(fd, src = {}) {
  const pn = fdFirstFilled(
    fd.partNumber,
    src.pn,
    src.partNumber,
    src.codigo,
    src.cod_spx,
    src.codSpx
  );

  const kitRecord = fdFindKitRecordByPN(pn);

  if (kitRecord) {
    fd.kitVedacao = fdNormalizeSpareCode(fdFirstFilled(
      fd.kitVedacao,
      kitRecord.kit,
      kitRecord.kitReparo,
      kitRecord.kitVedacao,
      kitRecord.kit_vedacao,
      kitRecord.kitVedação
    ));

    fd.unidadeControle = fdNormalizeSpareCode(fdFirstFilled(
      fd.unidadeControle,
      kitRecord.unidadeControle,
      kitRecord.unidControle,
      kitRecord.unidade_controle,
      kitRecord.controle
    ));

    fd.adaptador = fdNormalizeSpareCode(fdFirstFilled(
      fd.adaptador,
      kitRecord.kitAdaptador,
      kitRecord.adaptador,
      kitRecord.kit_adaptador
    ));
  } else {
    fd.kitVedacao = fdNormalizeSpareCode(fd.kitVedacao);
    fd.unidadeControle = fdNormalizeSpareCode(fd.unidadeControle);
    fd.adaptador = fdNormalizeSpareCode(fd.adaptador);
  }

  return fd;
}

function fdMergePreferFilled(base = {}, override = {}) {
  const out = { ...base };

  Object.entries(override || {}).forEach(([key, value]) => {
    const txt = fdCleanText(value);

    if (txt) {
      out[key] = value;
    } else if (!(key in out)) {
      out[key] = value;
    }
  });

  return out;
}

function traduzirDescricaoCurtaFD(txt, modelo = '') {
  const raw = fdCleanText(txt);
  const m = fdCleanText(modelo).toUpperCase();

  if (/single seat/i.test(raw)) {
    return `A válvula de controle de fluxo de sede única higiênica da série ${m || 'SW'} é altamente versátil e atende às demandas das indústrias de processamento atuais.`;
  }

  if (/double seat|mixproof/i.test(raw)) {
    return 'A válvula de assento duplo sanitária foi desenvolvida para aplicações higiênicas que exigem segurança, confiabilidade e separação eficiente de produtos.';
  }

  if (/butterfly/i.test(raw)) {
    return 'A válvula borboleta sanitária é uma solução compacta e eficiente para controle de fluxo em linhas de processo higiênicas.';
  }

  if (/ball/i.test(raw)) {
    return 'A válvula de esfera sanitária é indicada para aplicações que exigem passagem plena, operação robusta e construção higiênica.';
  }

  if (/check/i.test(raw)) {
    return 'A válvula de retenção sanitária permite o fluxo em uma direção e auxilia na proteção da linha contra retorno de produto.';
  }

  if (/diaphragm/i.test(raw)) {
    return 'A válvula diafragma sanitária é indicada para processos higiênicos que exigem vedação eficiente e controle seguro do fluxo.';
  }

  return raw;
}

// ─── Normalização ────────────────────────────────
function normalizarDadosFD(src, ctx = {}) {
  src = src || {};

  const modeloFD = fdFirstFilled(src.modelo, src.model);

  const fd = {
    partNumber: fdFirstFilled(
      src.pn,
      src.partNumber,
      src.codigo,
      src.part_number,
      src.cod_spx,
      src.codSpx
    ),

    modelo: modeloFD,

    familia: fdFirstFilled(
      src.familia,
      src.key_pos1
    ),

    titulo: fdFirstFilled(
      ctx.titulo,
      montarTituloFD(src)
    ),

    descricao: traduzirDescricaoCurtaFD(
      fdFirstFilled(src.descricao, src.descrição, src.description, src.desc, src.tipoValvula),
      modeloFD
    ),

    aplicacoes: obterAplicacoesPorFamilia(src),

    codProjeto: fdFirstFilled(
      ctx.codProjeto,
      src.codProjeto,
      src.projeto
    ),

    data: fdFirstFilled(
      ctx.data,
      src.data,
      new Date().toLocaleDateString('pt-BR')
    ),

    tamanho: fdFirstFilled(
      src.bitola,
      src.tamanho,
      src.size
    ),

    tipoConexao: fdFirstFilled(
      src.conexoes,
      src.conexão,
      src.conexao,
      src.tipoConexao
    ),

    acionamento: fdFirstFilled(
      src.atuador,
      src.atuacao,
      src.acionamento
    ),

    comunicacao: fdFirstFilled(
      src.controle,
      src.comunicacao
    ),

    conexaoAtuador: fdFirstFilled(
      src.conexaoAtuador,
      src.conex_at,
      src.conexao_atuador
    ),

    construcaoVedacao: fdFirstFilled(
      src.constVedacao,
      src.construcaoVedacao,
      src.tipoAssento,
      src.valveTipo
    ),

    materialVedacao: fdFirstFilled(
      src.materialVedacao,
      src.material_vedacao,
      src.vedacao
    ),

    acabamento: fdFirstFilled(
      src.acabamentoSuperficial,
      src.acabamento_superficial,
      src.acabamento,
      src.tipoAcabamento
    ),

    adicionais: fdFirstFilled(
      src.especiais,
      src.adicionais
    ),

    kitVedacao: fdNormalizeSpareCode(fdFirstFilled(
      src.kitReparo,
      src.kit,
      src.kitVedacao,
      src.kit_vedacao,
      src.kitVedação,
      src.pn_kit_vedacao,
      src.pn_kit_vedação
    )),

    unidadeControle: fdNormalizeSpareCode(fdFirstFilled(
      src.unidadeControle,
      src.unidControle,
      src.unidade_controle,
      src.pn_unidade_controle,
      src.pn_unidade_cont
    )),

    adaptador: fdNormalizeSpareCode(fdFirstFilled(
      src.kitAdaptador,
      src.adaptador,
      src.kit_adaptador,
      src.pn_kit_adaptador,
      src.pn_kit_adapt
    )),

    imagem: obterImagemFD(src),

    tag: fdFirstFilled(src.tag),
    setor: fdFirstFilled(src.setor),
    serie: fdFirstFilled(src.serie),
  };

  return fdApplyKitTable(fd, src);
}

// ─── Busca de dados do catálogo ──────────────────
async function buscarDadosValvulaPorCodigo(codigo) {
  const clean = fdNormalizePN(codigo);
  if (!clean) return null;

  // 1. Tentar catálogo já carregado na memória
  await (typeof loadValveSpecs === 'function' ? loadValveSpecs() : Promise.resolve());
  const specs = window.valveSpecs || {};

  const withH = clean.startsWith('H') ? clean : 'H' + clean;
  const withoutH = clean.startsWith('H') ? clean.slice(1) : clean;

  // Busca exata, preservando o PN usado como chave para cruzar com a tabela de kits
  if (specs[clean]) return normalizarDadosFD({ pn: clean, partNumber: clean, ...specs[clean] });
  if (specs[withH]) return normalizarDadosFD({ pn: withH, partNumber: withH, ...specs[withH] });
  if (specs[withoutH]) return normalizarDadosFD({ pn: withoutH, partNumber: withoutH, ...specs[withoutH] });

  // 2. Se não achou catálogo técnico, ainda tentar montar uma FD mínima pela tabela de kits
  const kitRecord = fdFindKitRecordByPN(withH);
  if (kitRecord) {
    return normalizarDadosFD({
      pn: withH,
      partNumber: withH,
      descricao: 'Válvula SPX Flow',
      ...kitRecord
    });
  }

  // 3. Tentar Firestore (coleção valve_specs) se disponível
  if (window._db) {
    try {
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      for (const id of [clean, withH, withoutH]) {
        const snap = await getDoc(doc(window._db, 'spx_valve_specs', id));
        if (snap.exists()) return normalizarDadosFD({ pn: id, partNumber: id, ...snap.data(), id: snap.id });
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
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const val = (v, fallback = '—') => fdCleanText(v) ? esc(v) : fallback;
  const sc = (v) => fdCleanText(v)
    ? `<span class="fd-spare-code">${esc(v)}</span>`
    : `<span class="fd-spare-code empty">Sob consulta</span>`;

  const apps = Array.isArray(fd.aplicacoes) ? fd.aplicacoes.filter(Boolean) : [];

  const imagemHtml = fd.imagem
    ? `<img src="${esc(fd.imagem)}" alt="${esc(fd.modelo || 'Válvula')}" class="fd-product-image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';

  const placeholderHtml = `<div class="fd-product-placeholder" ${fd.imagem ? 'style="display:none"' : ''}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="42" height="42"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    <span>Imagem não disponível</span>
  </div>`;

  return `
<div class="fd-page" data-pn="${esc(fd.partNumber || '')}">
  <header class="fd-header">
    <div class="fd-header-brand">
      <img src="logo-fiedler-negativa.png" alt="Fiedler Automação Industrial" class="fd-logo" onerror="this.style.opacity='.45'">
    </div>
    <div class="fd-header-main">
      <div class="fd-header-tag">Folha de Dados</div>
      <div class="fd-header-title">${esc(fd.titulo || 'VÁLVULA SPX FLOW')}</div>
    </div>
  </header>

  <section class="fd-intro">
    <div class="fd-image-panel">
      ${imagemHtml}${placeholderHtml}
    </div>

    <div class="fd-summary-panel">
      <div class="fd-meta-grid">
        <div class="fd-meta-item">
          <span class="fd-meta-label">Cód. Projeto</span>
          <span class="fd-meta-value fd-editable" contenteditable="true" spellcheck="false" title="Clique para editar" data-fd-field="codProjeto">${val(fd.codProjeto, '')}</span>
        </div>
        <div class="fd-meta-item">
          <span class="fd-meta-label">Data</span>
          <span class="fd-meta-value">${val(fd.data)}</span>
        </div>
        ${fd.tag ? `<div class="fd-meta-item">
          <span class="fd-meta-label">TAG</span>
          <span class="fd-meta-value">${esc(fd.tag)}</span>
        </div>` : ''}
        ${fd.setor ? `<div class="fd-meta-item">
          <span class="fd-meta-label">Setor</span>
          <span class="fd-meta-value">${esc(fd.setor)}</span>
        </div>` : ''}
      </div>

      <div class="fd-summary-lead">
        ${val(fd.descricao, 'Válvula de processo SPX Flow de alta performance higiênica.')}
      </div>

      ${apps.length ? `
      <div class="fd-applications-block">
        <div class="fd-section-kicker">Principais Aplicações</div>
        <ul class="fd-applications-list">
          ${apps.map(a => `<li>${esc(a)}</li>`).join('')}
        </ul>
      </div>` : ''}
    </div>
  </section>

  <section class="fd-spec-strip">
    <div class="fd-spec-cell">
      <span class="fd-spec-label">Part Number</span>
      <strong class="fd-spec-value">${val(fd.partNumber)}</strong>
    </div>
    <div class="fd-spec-cell">
      <span class="fd-spec-label">Modelo</span>
      <strong class="fd-spec-value">${val(fd.modelo)}</strong>
    </div>
    <div class="fd-spec-cell">
      <span class="fd-spec-label">Tamanho</span>
      <strong class="fd-spec-value">${val(fd.tamanho)}</strong>
    </div>
    <div class="fd-spec-cell">
      <span class="fd-spec-label">Acionamento</span>
      <strong class="fd-spec-value">${val(fd.acionamento)}</strong>
    </div>
    <div class="fd-spec-cell">
      <span class="fd-spec-label">Tipo de Conexão</span>
      <strong class="fd-spec-value">${val(fd.tipoConexao)}</strong>
    </div>
    <div class="fd-spec-cell">
      <span class="fd-spec-label">Material de Vedação</span>
      <strong class="fd-spec-value">${val(fd.materialVedacao)}</strong>
    </div>
  </section>

  <section class="fd-panels">
    <article class="fd-panel fd-panel-description">
      <div class="fd-panel-title">Descrição</div>
      <p>${val(fd.descricao, 'Válvula de processo SPX Flow de alta performance higiênica, projetada para aplicações de controle de fluxo exigentes nas indústrias de alimentos, bebidas e farmacêutica.')}</p>
    </article>

    <article class="fd-panel fd-panel-technical">
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
    </article>

    <article class="fd-panel fd-panel-spares">
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
    </article>
  </section>

  <footer class="fd-footer">
    <div class="fd-footer-left">PERFORMANCE NO <strong>PRESENTE</strong>,<br>EFICIÊNCIA PARA O <strong>FUTURO</strong>.</div>
    <div class="fd-footer-center">fiedler.com.br</div>
    <div class="fd-footer-right">ESPECIALISTAS EM<br>PROCESSOS INDUSTRIAIS.</div>
  </footer>
</div>`;
}

// ─── Múltiplas FDs ───────────────────────────────
function renderFolhasDadosMultiplas(lista) {
  return lista.map(renderFolhaDados).join('\n');
}

// ─── Impressão ───────────────────────────────────
let __fdPrintCssCache = null;

async function getFDPrintCSS() {
  if (__fdPrintCssCache) return __fdPrintCssCache;

  const link = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(l =>
    /fd-print\.css/i.test(l.getAttribute('href') || '')
  );

  if (!link) return '';

  try {
    const resp = await fetch(link.href, { cache: 'no-store' });
    __fdPrintCssCache = await resp.text();
  } catch (e) {
    console.warn('Não foi possível carregar fd-print.css para impressão:', e);
    __fdPrintCssCache = '';
  }

  return __fdPrintCssCache;
}

function waitForWindowImages(win) {
  const imgs = Array.from(win.document.images || []);
  if (!imgs.length) return Promise.resolve();

  return Promise.all(imgs.map(img => new Promise(res => {
    if (img.complete) return res();
    const done = () => res();
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
    setTimeout(done, 2500);
  })));
}

async function imprimirFD() {
  const container = document.getElementById('fd-preview-container');
  if (!container || !container.innerHTML.trim()) {
    alert('Nenhuma folha de dados gerada para imprimir.');
    return;
  }

  const css = await getFDPrintCSS();
  const printWin = window.open('', '_blank', 'width=1200,height=900');
  if (!printWin) {
    alert('O navegador bloqueou a janela de impressão. Permita pop-ups para este site.');
    return;
  }

  const html = container.innerHTML;
  printWin.document.open();
  printWin.document.write(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Folha de Dados</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body class="fd-print-body">
  <div id="fd-print-root">${html}</div>
</body>
</html>`);
  printWin.document.close();

  await waitForWindowImages(printWin);
  setTimeout(() => {
    printWin.focus();
    printWin.print();
  }, 250);
}

// ─── Abrir preview na tela do sistema ────────────
function wireFDPreviewInteractions() {
  const prev = document.getElementById('fd-preview-container');
  if (!prev || prev.dataset.fdBound === '1') return;

  prev.dataset.fdBound = '1';

  prev.addEventListener('input', (e) => {
    const el = e.target.closest('[data-fd-field]');
    if (!el) return;

    const field = el.getAttribute('data-fd-field');
    const value = el.textContent;

    prev.querySelectorAll('[data-fd-field="' + field + '"]').forEach(other => {
      if (other !== el) other.textContent = value;
    });
  });

  prev.addEventListener('keydown', (e) => {
    const el = e.target.closest('[data-fd-field]');
    if (!el) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      el.blur();
    }
  });
}

function abrirPreviewFD(htmlFDs, titulo) {
  const prev  = document.getElementById('fd-preview-container');
  const tit   = document.getElementById('fd-preview-title');
  const act   = document.getElementById('fd-preview-actions');
  const empty = document.getElementById('fd-empty-state');

  if (!prev) return;

  prev.innerHTML = htmlFDs;
  if (tit)   tit.textContent = titulo || 'Folha de Dados';
  if (act)   act.style.display = 'flex';
  if (empty) empty.style.display = 'none';

  wireFDPreviewInteractions();
  prev.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (spec) base = fdMergePreferFilled(spec, equip); // equip preenchido tem prioridade sem apagar dados do catálogo
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
      if (spec) base = fdMergePreferFilled(spec, e);
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
