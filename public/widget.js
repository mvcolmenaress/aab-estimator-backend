(function () {
  const BACKEND = "https://aab-estimator-backend.onrender.com";
  const BOOK_URL = "https://orchid-armadillo-ehb8.squarespace.com/bookings";
  const PHONE = "tel:+16305437972";

  // ── Styles ──────────────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

    #aab-widget-root * { box-sizing: border-box; margin: 0; padding: 0; }

    #aab-widget-root {
      font-family: 'DM Sans', sans-serif;
      background: #0d0d0d;
      color: #f0ede8;
      max-width: 480px;
      margin: 0 auto;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    }

    #aab-widget-root .aab-header {
      background: #c8102e;
      padding: 20px 24px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #aab-widget-root .aab-header-icon {
      width: 40px; height: 40px;
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }

    #aab-widget-root .aab-header-text h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px;
      letter-spacing: 1px;
      color: #fff;
      line-height: 1;
    }

    #aab-widget-root .aab-header-text p {
      font-size: 12px;
      color: rgba(255,255,255,0.75);
      margin-top: 2px;
    }

    #aab-widget-root .aab-chat {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 360px;
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    #aab-widget-root .aab-chat::-webkit-scrollbar { width: 4px; }
    #aab-widget-root .aab-chat::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

    #aab-widget-root .aab-bubble {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      animation: aab-pop 0.2s ease;
    }

    @keyframes aab-pop {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    #aab-widget-root .aab-bubble.bot {
      background: #1c1c1c;
      border: 1px solid #2a2a2a;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      color: #f0ede8;
    }

    #aab-widget-root .aab-bubble.user {
      background: #c8102e;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
      color: #fff;
    }

    #aab-widget-root .aab-bubble.typing {
      background: #1c1c1c;
      border: 1px solid #2a2a2a;
      align-self: flex-start;
      color: #888;
      font-style: italic;
      font-size: 13px;
    }

    #aab-widget-root .aab-estimate-card {
      background: linear-gradient(135deg, #1a1a1a, #222);
      border: 1px solid #c8102e44;
      border-radius: 12px;
      padding: 16px;
      margin-top: 4px;
      align-self: flex-start;
      width: 100%;
      max-width: 100%;
      animation: aab-pop 0.3s ease;
    }

    #aab-widget-root .aab-estimate-card .aab-est-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #c8102e;
      font-weight: 600;
      margin-bottom: 8px;
    }

    #aab-widget-root .aab-estimate-card .aab-est-range {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 32px;
      letter-spacing: 1px;
      color: #fff;
    }

    #aab-widget-root .aab-estimate-card .aab-est-sub {
      font-size: 12px;
      color: #888;
      margin-top: 4px;
    }

    #aab-widget-root .aab-estimate-card .aab-est-oop {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #2a2a2a;
      font-size: 13px;
      color: #f0ede8;
    }

    #aab-widget-root .aab-estimate-card .aab-est-mods {
      margin-top: 8px;
      font-size: 12px;
      color: #aaa;
    }

    #aab-widget-root .aab-cta-row {
      display: flex;
      gap: 10px;
      padding: 0 20px 20px;
      animation: aab-pop 0.3s ease;
    }

    #aab-widget-root .aab-btn {
      flex: 1;
      padding: 13px 10px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      text-align: center;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }

    #aab-widget-root .aab-btn:hover { transform: translateY(-1px); opacity: 0.92; }
    #aab-widget-root .aab-btn:active { transform: translateY(0); }

    #aab-widget-root .aab-btn-book {
      background: #c8102e;
      color: #fff;
    }

    #aab-widget-root .aab-btn-call {
      background: #1c1c1c;
      border: 1px solid #333;
      color: #f0ede8;
    }

    #aab-widget-root .aab-input-row {
      display: flex;
      gap: 8px;
      padding: 0 20px 20px;
    }

    #aab-widget-root .aab-input {
      flex: 1;
      background: #1c1c1c;
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      padding: 12px 14px;
      color: #f0ede8;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    #aab-widget-root .aab-input:focus { border-color: #c8102e; }
    #aab-widget-root .aab-input::placeholder { color: #555; }

    #aab-widget-root .aab-send-btn {
      background: #c8102e;
      border: none;
      border-radius: 10px;
      width: 44px;
      height: 44px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s;
    }

    #aab-widget-root .aab-send-btn:hover { opacity: 0.85; }
    #aab-widget-root .aab-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    #aab-widget-root .aab-quick-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0 20px 16px;
    }

    #aab-widget-root .aab-quick-btn {
      background: #1c1c1c;
      border: 1px solid #2a2a2a;
      border-radius: 20px;
      padding: 7px 14px;
      font-size: 13px;
      color: #f0ede8;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: border-color 0.15s, background 0.15s;
    }

    #aab-widget-root .aab-quick-btn:hover {
      border-color: #c8102e;
      background: #1f1010;
    }

    #aab-widget-root .aab-disclaimer {
      padding: 0 20px 16px;
      font-size: 11px;
      color: #555;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  // ── HTML ─────────────────────────────────────────────────────────────────────
  const root = document.createElement("div");
  root.id = "aab-widget-root";
  root.innerHTML = `
    <div class="aab-header">
      <div class="aab-header-icon">🔧</div>
      <div class="aab-header-text">
        <h2>Instant Repair Estimate</h2>
        <p>Powered by Addison Auto Body</p>
      </div>
    </div>
    <div class="aab-chat" id="aab-chat"></div>
    <div class="aab-quick-btns" id="aab-quick-btns"></div>
    <div class="aab-input-row">
      <input class="aab-input" id="aab-input" placeholder="Describe your damage…" />
      <button class="aab-send-btn" id="aab-send-btn" aria-label="Send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
    <div class="aab-disclaimer">Estimates are approximate. Final price confirmed after inspection.</div>
  `;

  // Find a target div or append to body
  const target = document.getElementById("aab-estimator") || document.body;
  target.appendChild(root);

  // ── State ────────────────────────────────────────────────────────────────────
  const chatEl    = document.getElementById("aab-chat");
  const inputEl   = document.getElementById("aab-input");
  const sendBtn   = document.getElementById("aab-send-btn");
  const quickBtns = document.getElementById("aab-quick-btns");
  let history = [];
  let estimateShown = false;

  const QUICK_STARTERS = [
    "Front bumper damage 🚗",
    "Door dent or scratch 🚪",
    "Hood or fender damage 🔨",
    "Rear end collision 💥",
  ];

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function scrollToBottom() {
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function addBubble(text, role) {
    const el = document.createElement("div");
    el.className = `aab-bubble ${role}`;
    el.textContent = text;
    chatEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function addTyping() {
    const el = document.createElement("div");
    el.className = "aab-bubble typing";
    el.textContent = "Addison Auto Body is typing…";
    chatEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function showEstimateCard(estimate) {
    const card = document.createElement("div");
    card.className = "aab-estimate-card";

    let modsHtml = "";
    if (estimate.applied_modifiers?.length) {
      modsHtml = `<div class="aab-est-mods">⚠️ Includes: ${estimate.applied_modifiers.join(", ")}</div>`;
    }

    let oopHtml = "";
    if (estimate.out_of_pocket !== null) {
      oopHtml = `<div class="aab-est-oop">💳 Est. out-of-pocket with deductible: <strong>$${estimate.out_of_pocket.toLocaleString()}</strong></div>`;
    }

    card.innerHTML = `
      <div class="aab-est-label">Estimated Cost</div>
      <div class="aab-est-range">$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}</div>
      <div class="aab-est-sub">Based on details provided • Prices in USD</div>
      ${modsHtml}
      ${oopHtml}
    `;
    chatEl.appendChild(card);
    scrollToBottom();
  }

  function showCTAButtons() {
    if (estimateShown) return;
    estimateShown = true;
    const row = document.createElement("div");
    row.className = "aab-cta-row";
    row.innerHTML = `
      <a href="${BOOK_URL}" target="_blank" class="aab-btn aab-btn-book">📅 Book Appointment</a>
      <a href="${PHONE}" class="aab-btn aab-btn-call">📞 Call Us</a>
    `;
    root.insertBefore(row, root.querySelector(".aab-input-row"));
  }

  function setQuickBtns(options) {
    quickBtns.innerHTML = "";
    options.forEach((label) => {
      const btn = document.createElement("button");
      btn.className = "aab-quick-btn";
      btn.textContent = label;
      btn.onclick = () => {
        quickBtns.innerHTML = "";
        sendMessage(label);
      };
      quickBtns.appendChild(btn);
    });
  }

  // ── Core send/receive ────────────────────────────────────────────────────────
  async function sendMessage(text) {
    if (!text.trim()) return;
    inputEl.value = "";
    sendBtn.disabled = true;

    addBubble(text, "user");
    history.push({ role: "user", content: text });

    const typing = addTyping();

    try {
      const res = await fetch(`${BACKEND}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      typing.remove();

      if (data.ok) {
        addBubble(data.message, "bot");
        history.push({ role: "assistant", content: data.message });

        if (data.estimate) {
          showEstimateCard(data.estimate);
          showCTAButtons();
        }
      } else {
        addBubble("Sorry, something went wrong. Please call us directly.", "bot");
      }
    } catch (err) {
      typing.remove();
      addBubble("Connection error. Please try again or give us a call.", "bot");
    }

    sendBtn.disabled = false;
    inputEl.focus();
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  sendBtn.onclick = () => sendMessage(inputEl.value);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage(inputEl.value);
  });

  // Show starter message and quick buttons
  setTimeout(() => {
    addBubble("Hi! 👋 I'm here to help you get a quick repair estimate. What kind of damage does your vehicle have?", "bot");
    setQuickBtns(QUICK_STARTERS);
  }, 400);
})();
