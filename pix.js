// Presente por Pix: compartilhado pelos convites presencial e Zoom.
(function initPixPresentes() {
  'use strict';
  const PIX_KEY = '0f97bf0e-495a-483d-8435-6e196a4acb0a';
  // Matriz do QR Code Pix estático (53 x 53, com margem), conferida por leitura.
  const QR_BITS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/tXboAv4BBBfhmyQQC6Rm0u0ugF1qWVjNdALq2//F66AQUhsdmEEA/qqqqqv4AAcHxAeAACLyc+rL8gGgwmPsEDAF62d1w0oAMNDjHqiwA8hsqx71YBE4W/h0kwAvJcxRlUgExJ7Oz0LAJouiK2TWAePtp6A4UAm4aXk3BABYk3f2uSgCv2R/Bj9gExYvEXEVALreSpD6qAVFjEYexgAb8Yvg++ABKq354BRwD+knj6BYAApyg+q6qANch6sOPyAXhua6pccAH8NVTrtQB2MH5nmrQBeEIg16mgEbk9LVOkAAqk50jDaAPMydxOooAm9+voD+YAAYJRwxHQD+xdrAesAEEnlFA0bALquX+PfuAXSVQPcccAukkLbBmgBBOfpammgD+qxCZNngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
  const gifts = document.querySelector('[data-page="2"]');
  if (!gifts || document.getElementById('openPixModal')) return;

  const openButton = document.createElement('button');
  openButton.id = 'openPixModal';
  openButton.type = 'button';
  openButton.className = 'mx-auto mt-1 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-purple-800 px-6 py-4 font-bold text-white shadow-lg shadow-purple-300/40 transition hover:bg-purple-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600';
  openButton.textContent = '🎁 Presentear com Pix';
  const lastText = gifts.lastElementChild;
  gifts.insertBefore(openButton, lastText);
  if (lastText) lastText.classList.add('mt-5');

  const modal = document.createElement('div');
  modal.id = 'pixModal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'pixModalTitle');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-purple-950/75 p-4 backdrop-blur-sm';
  modal.innerHTML = [
    '<div class="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-purple-100 bg-white px-5 py-6 text-center shadow-2xl sm:px-7">',
      '<button id="closePixModal" type="button" aria-label="Fechar janela do Pix" class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-2xl text-purple-800 hover:bg-purple-100">×</button>',
      '<div class="text-3xl text-purple-500">♡</div>',
      '<h2 id="pixModalTitle" class="serif mt-2 text-3xl italic text-purple-950">Presenteie com Pix</h2>',
      '<p class="mt-3 text-sm leading-6 text-slate-600">Escaneie o QR Code com o aplicativo do seu banco ou copie nossa chave Pix.</p>',
      '<canvas id="pixQRCode" width="530" height="530" role="img" aria-label="QR Code Pix dos noivos" class="mx-auto mt-4 block h-52 w-52 max-w-full rounded-lg border border-purple-100 bg-white p-1"></canvas>',
      '<p class="mt-4 text-xs font-bold uppercase tracking-widest text-purple-600">Chave Pix aleatória</p>',
      '<p id="pixKeyText" class="mt-2 select-all break-all rounded-xl border border-purple-100 bg-purple-50 p-3 font-mono text-xs text-purple-950">' + PIX_KEY + '</p>',
      '<button id="copyPixKey" type="button" class="mt-3 w-full rounded-xl bg-purple-800 px-5 py-4 text-sm font-bold text-white hover:bg-purple-900">▢ Copiar chave Pix</button>',
      '<p id="pixCopyStatus" role="status" aria-live="polite" class="mt-2 min-h-5 text-xs text-green-700"></p>',
      '<p class="mt-2 text-xs leading-5 text-slate-500">Sem valor definido. Confira o nome do recebedor no aplicativo do banco antes de pagar.</p>',
    '</div>'
  ].join('');
  document.body.appendChild(modal);

  // Desenha localmente o mesmo QR estático já gerado, sem depender de API externa.
  const canvas = document.getElementById('pixQRCode');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const bits = Uint8Array.from(atob(QR_BITS), function (c) { return c.charCodeAt(0); });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 530, 530);
    ctx.fillStyle = '#111827';
    for (let y = 0; y < 53; y++) {
      for (let x = 0; x < 53; x++) {
        const bit = y * 53 + x;
        if ((bits[bit >> 3] >> (7 - (bit & 7))) & 1) ctx.fillRect(x * 10, y * 10, 10, 10);
      }
    }
  }

  const closeButton = document.getElementById('closePixModal');
  const copyButton = document.getElementById('copyPixKey');
  const status = document.getElementById('pixCopyStatus');
  let previousOverflow = '';
  function openModal() {
    previousOverflow = document.body.style.overflow;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    status.textContent = '';
    copyButton.textContent = '▢ Copiar chave Pix';
    closeButton.focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = previousOverflow;
    openButton.focus();
  }
  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { closeModal(); return; }
    if (event.key !== 'Tab') return;
    const items = [closeButton, copyButton];
    if (event.shiftKey && document.activeElement === items[0]) {
      event.preventDefault(); items[1].focus();
    } else if (!event.shiftKey && document.activeElement === items[1]) {
      event.preventDefault(); items[0].focus();
    }
  });
  copyButton.addEventListener('click', async function () {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(PIX_KEY);
      } else {
        const input = document.createElement('textarea');
        input.value = PIX_KEY;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.focus();
        input.select();
        let copied = false;
        try { copied = document.execCommand('copy'); } finally { input.remove(); }
        if (!copied) throw new Error('Cópia não disponível');
      }
      copyButton.textContent = '✓ Chave copiada!';
      status.textContent = 'Agora é só colar no aplicativo do banco.';
    } catch (error) {
      status.textContent = 'Não foi possível copiar automaticamente. Toque e segure a chave acima para copiá-la.';
    }
  });
})();