const csvFile = document.getElementById('csvfile');
const messageEl = document.getElementById('message');
const minDelayEl = document.getElementById('minDelay');
const maxDelayEl = document.getElementById('maxDelay');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const statusEl = document.getElementById('status');
const testCountEl = document.getElementById('testCount');

let contacts = [];

function parseCSV(text) {
  // parser simples: aceita CSV com duas colunas: number,name
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const header = lines.shift().split(',').map(h=>h.trim().toLowerCase());
  const idxNumber = header.indexOf('number');
  const idxName = header.indexOf('name');
  if (idxNumber === -1) throw new Error('CSV precisa ter coluna "number"');
  const out = lines.map(line => {
    // split simples por vírgula (não suporta vírgulas em campos)
    const parts = line.split(',');
    return {
      number: parts[idxNumber].replace(/[^0-9]/g, ''),
      name: parts[idxName] ? parts[idxName].trim() : ''
    };
  });
  return out;
}

csvFile.addEventListener('change', async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const text = await f.text();
  try {
    contacts = parseCSV(text);
    statusEl.textContent = `Status: ${contacts.length} contatos carregados`;
  } catch (err) {
    statusEl.textContent = 'Erro ao ler CSV: ' + err.message;
  }
});

startBtn.addEventListener('click', async () => {
  if (!contacts.length) { statusEl.textContent = 'Nenhum contato carregado'; return; }
  const minDelay = parseInt(minDelayEl.value,10) || 5;
  const maxDelay = parseInt(maxDelayEl.value,10) || (minDelay+5);
  const testCount = parseInt(testCountEl.value,10) || contacts.length;
  const messageTemplate = messageEl.value || '';

  // enviar dados para o background
  chrome.runtime.sendMessage({
    action: 'start',
    contacts: contacts.slice(0, testCount),
    minDelay, maxDelay, messageTemplate
  });
  statusEl.textContent = 'Status: iniciado';
});

stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' });
  statusEl.textContent = 'Status: parado (pedido de parada enviado)';
});

// atualizar status a partir do background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'status') statusEl.textContent = 'Status: ' + msg.text;
});