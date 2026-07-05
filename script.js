// --- 1. Efeito Visual de Partículas de Fundo ---
(function() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let pts = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    pts.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.5 + 0.2
    });
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,' + p.o + ')';
      ctx.fill();

      for (let j = i + 1; j < pts.length; j++) {
        const dx = p.x - pts[j].x;
        const dy = p.y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(139,92,246,' + (1 - d / 120) * 0.12 + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(loop);
  })();
})();

// --- 2. Controle de Navegação de Abas e Modos ---
let currentMode = 'fix_errors';
let isTranslation = false;

function switchTab(tab) {
  isTranslation = tab === 'translation';
  document.getElementById('tab-correction').classList.toggle('active', !isTranslation);
  document.getElementById('tab-translation').classList.toggle('active', isTranslation);
  document.getElementById('modes-grid').classList.toggle('hidden', isTranslation);
  
  const lr = document.getElementById('lang-row');
  if (isTranslation) {
    lr.classList.remove('hidden');
    lr.style.display = 'flex';
  } else {
    lr.classList.add('hidden');
    lr.style.display = 'none';
  }
  document.getElementById('btn-label').textContent = isTranslation ? 'Traduzir' : 'Corrigir';
}

function selectMode(el) {
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  currentMode = el.dataset.mode;
}

// --- 3. Chamadas de API e Requisições à IA ---
const MODE_PROMPTS = {
  fix_errors: "Corrija APENAS os erros de ortografia, gramática, pontuação e acentuação.",
  improve: "Melhore a qualidade geral da escrita.",
  professional: "Reescreva em tom profissional.",
  formal: "Reescreva em linguagem formal.",
  informal: "Reescreva em tom casual.",
  rewrite: "Reescreva completamente mantendo o significado.",
  simplify: "Simplifique usando linguagem acessível.",
  expand: "Expanda com mais detalhes.",
  summarize: "Resuma mantendo os pontos-chave.",
  humanize: "Reescreva com tom mais humano.",
  persuasive: "Reescreva de forma persuasiva.",
  clarity: "Reescreva priorizando clareza."
};

async function processText() {
  const text = document.getElementById('input-text').value.trim();
  if (!text) {
    alert('Digite um texto!');
    return;
  }

  let apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    const k = prompt('Cole sua chave API Gemini:');
    if (!k) return;
    localStorage.setItem('gemini_api_key', k);
    apiKey = k;
  }

  const btn = document.getElementById('correct-btn');
  btn.disabled = true;
  document.getElementById('btn-icon').innerHTML = '<span class="spinner"></span>';

  const promptText = isTranslation 
    ? 'Traduza o texto de ' + document.getElementById('src-lang').value + ' para ' + document.getElementById('tgt-lang').value + '. Responda em JSON: {"corrected_text":"...","errors_found":0,"explanation":"..."}'
    : 'Você é revisor. ' + MODE_PROMPTS[currentMode] + ' Texto: """' + text + '""" Responda em JSON: {"corrected_text":"...","errors_found":0,"explanation":"..."}';

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    const data = await res.json();
    const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
    
    document.getElementById('result-text').textContent = parsed.corrected_text || '';
    document.getElementById('result-section').classList.remove('hidden');
  } catch (e) {
    alert('Erro: ' + e.message);
  }

  btn.disabled = false;
  document.getElementById('btn-icon').textContent = isTranslation ? '🌐' : '✨';
}
