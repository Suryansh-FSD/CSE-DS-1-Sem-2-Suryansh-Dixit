/* =========================================
   NeuralNet Hub — script.js
   Full chat functionality with Ollama API
   ========================================= */

// ─── Mock API Data ─────────────────────────────────────────────────────────────
const MOCK_API_RESPONSE = {
  props: {
    pageProps: {
      models: [
        {
          id: "386573ca-b2d9-413d-9e8f-913810315f97",
          ip_port: "http://5.149.249.212:11434",
          model_name: "gpt-oss:20b",
          model: "gpt-oss:20b",
          format: "gguf",
          family: "gemma3",
          parameter_size: "4.3B",
          quantization_level: "Q4_K_M",
          ip_city_name_en: "Amsterdam",
          ip_country_name_en: "The Netherlands",
          ip_country_iso_code: "NL",
          ip_isp: "HZ Hosting Ltd",
          perf_tokens: 57,
          perf_time_seconds: "4.38",
          perf_tokens_per_second: "13.01",
          perf_avg_token_speed: "59.27",
          perf_model_size_bytes: "5443152417",
          perf_status: "success",
          perf_error: null,
          perf_last_tested: "2025-04-19T08:24:12.000Z",
        },
        {
          id: "9a3d2e1b-c4f5-4a7b-8e2d-612345678abc",
          ip_port: "http://45.77.155.200:11434",
          model_name: "llama3:8b",
          model: "llama3:8b",
          format: "gguf",
          family: "llama",
          parameter_size: "8B",
          quantization_level: "Q5_K_M",
          ip_city_name_en: "Frankfurt",
          ip_country_name_en: "Germany",
          ip_country_iso_code: "DE",
          ip_isp: "DataPacket",
          perf_tokens: 72,
          perf_time_seconds: "3.21",
          perf_tokens_per_second: "22.43",
          perf_avg_token_speed: "80.12",
          perf_model_size_bytes: "4740000000",
          perf_status: "success",
          perf_error: null,
          perf_last_tested: "2025-04-18T14:30:00.000Z",
        },
        {
          id: "c1d2e3f4-0a1b-2c3d-4e5f-678901234567",
          ip_port: "http://138.68.119.75:11434",
          model_name: "mistral:7b-instruct",
          model: "mistral:7b-instruct",
          format: "gguf",
          family: "mistral",
          parameter_size: "7B",
          quantization_level: "Q4_0",
          ip_city_name_en: "New York",
          ip_country_name_en: "United States",
          ip_country_iso_code: "US",
          ip_isp: "DigitalOcean",
          perf_tokens: 64,
          perf_time_seconds: "2.89",
          perf_tokens_per_second: "22.14",
          perf_avg_token_speed: "70.5",
          perf_model_size_bytes: "3825000000",
          perf_status: "success",
          perf_error: null,
          perf_last_tested: "2025-04-20T09:15:00.000Z",
        },
        {
          id: "d4e5f6a7-b8c9-0d1e-2f3a-456789012345",
          ip_port: "http://203.0.113.45:11434",
          model_name: "phi3:mini",
          model: "phi3:mini",
          format: "gguf",
          family: "phi3",
          parameter_size: "3.8B",
          quantization_level: "Q4_K_M",
          ip_city_name_en: "Singapore",
          ip_country_name_en: "Singapore",
          ip_country_iso_code: "SG",
          ip_isp: "OVH",
          perf_tokens: 88,
          perf_time_seconds: "1.97",
          perf_tokens_per_second: "44.67",
          perf_avg_token_speed: "120.4",
          perf_model_size_bytes: "2100000000",
          perf_status: "success",
          perf_error: null,
          perf_last_tested: "2025-04-21T03:00:00.000Z",
        },
        {
          id: "e7f8a9b0-c1d2-3e4f-5a6b-789012345678",
          ip_port: "http://192.168.50.10:11434",
          model_name: "codellama:34b",
          model: "codellama:34b",
          format: "gguf",
          family: "llama",
          parameter_size: "34B",
          quantization_level: "Q3_K_S",
          ip_city_name_en: "Tokyo",
          ip_country_name_en: "Japan",
          ip_country_iso_code: "JP",
          ip_isp: "BIGLOBE Inc.",
          perf_tokens: 45,
          perf_time_seconds: "8.90",
          perf_tokens_per_second: "5.06",
          perf_avg_token_speed: "18.7",
          perf_model_size_bytes: "19000000000",
          perf_status: "success",
          perf_error: null,
          perf_last_tested: "2025-04-17T20:45:00.000Z",
        },
        {
          id: "f0a1b2c3-d4e5-6f7a-8b9c-012345678901",
          ip_port: "http://89.116.44.22:11434",
          model_name: "deepseek-coder:6.7b",
          model: "deepseek-coder:6.7b",
          format: "gguf",
          family: "deepseek",
          parameter_size: "6.7B",
          quantization_level: "Q5_0",
          ip_city_name_en: "London",
          ip_country_name_en: "United Kingdom",
          ip_country_iso_code: "GB",
          ip_isp: "BT PLC",
          perf_tokens: 60,
          perf_time_seconds: "2.55",
          perf_tokens_per_second: "23.53",
          perf_avg_token_speed: "75.0",
          perf_model_size_bytes: "3800000000",
          perf_status: "error",
          perf_error: "Connection timeout after 5000ms",
          perf_last_tested: "2025-04-15T11:00:00.000Z",
        },
      ],
    },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const countryFlag = (iso) => {
  if (!iso || iso.length !== 2) return "🌐";
  return iso.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(0x1f1e0 + c.charCodeAt(0) - 65)
  );
};

const formatBytes = (bytes) => {
  const b = parseInt(bytes, 10);
  if (isNaN(b)) return "—";
  if (b >= 1e9) return (b / 1e9).toFixed(1) + " GB";
  if (b >= 1e6) return (b / 1e6).toFixed(1) + " MB";
  return b + " B";
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const familyEmoji = (f) => ({
  gemma3: "💎", gemma: "💎", llama: "🦙", mistral: "🌪️",
  phi3: "🔬", phi: "🔬", deepseek: "🔭", falcon: "🦅",
  qwen: "🀄", codellama: "💻",
}[f?.toLowerCase()] ?? "🤖");

const timeStr = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

// ─── App State ─────────────────────────────────────────────────────────────────
let allModels = [];
const MAX_SPEED = 50;

// ─── Chat State ────────────────────────────────────────────────────────────────
let activeModel = null;          // The full model object currently open in chat
let chatHistory = {};            // { [modelId]: [{role, content}] }
let isStreaming = false;         // Whether a stream is in-flight
let abortController = null;      // For cancelling ongoing fetch

// ─── Fetch mock data ───────────────────────────────────────────────────────────
async function fetchModelData() {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_API_RESPONSE), 900));
}

// ─── Build model card ──────────────────────────────────────────────────────────
function buildModelCard(model, index) {
  const {
    id, model_name, family, format, parameter_size, quantization_level,
    ip_city_name_en, ip_country_name_en, ip_country_iso_code, ip_isp,
    perf_tokens_per_second, perf_avg_token_speed, perf_time_seconds,
    perf_tokens, perf_status, perf_error, perf_last_tested, perf_model_size_bytes,
  } = model;

  const isSuccess = perf_status === "success";
  const tokSpeed = parseFloat(perf_tokens_per_second) || 0;
  const barWidth = Math.min((tokSpeed / MAX_SPEED) * 100, 100).toFixed(1);
  const flag = countryFlag(ip_country_iso_code);
  const emoji = familyEmoji(family);

  const card = document.createElement("div");
  card.className = "model-card";
  card.style.animationDelay = `${index * 0.07}s`;
  card.dataset.name = model_name?.toLowerCase() || "";
  card.dataset.family = family?.toLowerCase() || "";
  card.dataset.country = ip_country_name_en?.toLowerCase() || "";
  card.dataset.id = id;

  card.innerHTML = `
    <div class="card-header">
      <div class="card-model-icon">${emoji}</div>
      <div class="card-title-group">
        <div class="card-model-name" title="${model_name}">${model_name}</div>
        <div class="card-family">${family || "Unknown"} · ${format?.toUpperCase() || "—"}</div>
      </div>
      <span class="status-pill ${isSuccess ? "success" : "error"}">${isSuccess ? "Online" : "Offline"}</span>
    </div>

    <div class="card-metrics">
      <div class="metric-item">
        <span class="metric-label">Tokens / sec</span>
        <span class="metric-value highlight">${tokSpeed.toFixed(2)}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Avg Speed</span>
        <span class="metric-value">${parseFloat(perf_avg_token_speed || 0).toFixed(1)} t/s</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Response Time</span>
        <span class="metric-value">${parseFloat(perf_time_seconds || 0).toFixed(2)}s</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Model Size</span>
        <span class="metric-value">${formatBytes(perf_model_size_bytes)}</span>
      </div>
    </div>

    <div class="speed-bar-container">
      <div class="speed-bar-label">
        <span>Token Speed</span>
        <span>${tokSpeed.toFixed(2)} t/s</span>
      </div>
      <div class="speed-bar-track">
        <div class="speed-bar-fill" style="width:0%" data-target="${barWidth}"></div>
      </div>
    </div>

    <div class="card-tags">
      <span class="card-tag size">${parameter_size || "—"}</span>
      <span class="card-tag quant">${quantization_level || "—"}</span>
      <span class="card-tag format">${format?.toUpperCase() || "—"}</span>
      ${perf_tokens ? `<span class="card-tag">${perf_tokens} tokens tested</span>` : ""}
    </div>

    <div class="card-footer">
      <div class="card-location">
        <span class="card-location-flag">${flag}</span>
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${ip_city_name_en || "?"}, ${ip_country_name_en || "?"}
        </span>
      </div>
      <button
        class="card-chat-btn ${isSuccess ? "" : "offline"}"
        id="chat-btn-${id}"
        data-model-id="${id}"
        ${isSuccess ? "" : "disabled"}
        title="${isSuccess ? `Chat with ${model_name}` : "Server offline"}"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        ${isSuccess ? "Chat" : "Offline"}
      </button>
    </div>

    ${!isSuccess && perf_error ? `<div class="error-msg">⚠ ${perf_error}</div>` : ""}
  `;

  // Attach click listener directly on the button element (avoids inline onclick issues)
  if (isSuccess) {
    const btn = card.querySelector(".card-chat-btn");
    if (btn) btn.addEventListener("click", () => openChat(id));
  }

  return card;
}

// ─── Render all model cards ────────────────────────────────────────────────────
function renderModels(models) {
  const grid = document.getElementById("models-grid");
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  grid.innerHTML = "";
  if (!models || !models.length) {
    document.getElementById("no-results").style.display = "flex";
    return;
  }
  document.getElementById("no-results").style.display = "none";
  models.forEach((m, i) => grid.appendChild(buildModelCard(m, i)));
  requestAnimationFrame(() => {
    document.querySelectorAll(".speed-bar-fill").forEach((bar) => {
      setTimeout(() => { bar.style.width = bar.dataset.target + "%"; }, 200);
    });
  });
}

// ─── Family filter dropdown ────────────────────────────────────────────────────
function populateFamilyFilter(models) {
  const select = document.getElementById("family-filter");
  // Remove old options except first
  while (select.options.length > 1) select.remove(1);
  [...new Set(models.map((m) => m.family).filter(Boolean))].sort().forEach((fam) => {
    const opt = document.createElement("option");
    opt.value = fam;
    opt.textContent = fam.charAt(0).toUpperCase() + fam.slice(1);
    select.appendChild(opt);
  });
}

// ─── Stats row ─────────────────────────────────────────────────────────────────
function updateStats(models) {
  const total = models.length;
  const success = models.filter((m) => m.perf_status === "success");
  const successRate = total > 0 ? Math.round((success.length / total) * 100) : 0;
  const avgSpeed = success.reduce((a, m) => a + parseFloat(m.perf_tokens_per_second || 0), 0) / (success.length || 1);
  const countries = new Set(models.map((m) => m.ip_country_iso_code).filter(Boolean)).size;
  animateNumber("total-models", 0, total, 800);
  animateNumber("success-rate", 0, successRate, 900, "%");
  animateNumber("avg-speed", 0, avgSpeed, 1000, " t/s", 1);
  animateNumber("countries-count", 0, countries, 700);
}

function animateNumber(id, from, to, dur, suffix = "", decimals = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = (from + (to - from) * ease).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ─── Filter ────────────────────────────────────────────────────────────────────
function filterModels(query = "") {
  const q = query.toLowerCase().trim();
  const fam = document.getElementById("family-filter").value.toLowerCase();
  const filtered = allModels.filter((m) => {
    const matchQ = !q || [m.model_name, m.family, m.ip_city_name_en, m.ip_country_name_en]
      .some((v) => v?.toLowerCase().includes(q));
    const matchF = !fam || m.family?.toLowerCase() === fam;
    return matchQ && matchF;
  });
  renderModels(filtered);
}

// ─── Main load ─────────────────────────────────────────────────────────────────
async function loadModels() {
  const grid = document.getElementById("models-grid");
  const loader = document.getElementById("loader");
  const refreshBtn = document.getElementById("refresh-btn");
  grid.innerHTML = "";
  document.getElementById("no-results").style.display = "none";
  loader.style.display = "flex";
  refreshBtn.disabled = true;
  refreshBtn.innerHTML = `<div class="loader-ring" style="width:18px;height:18px;border-width:2px"></div> Loading...`;
  try {
    const data = await fetchModelData();
    allModels = data.props.pageProps.models;
    populateFamilyFilter(allModels);
    updateStats(allModels);
    renderModels(allModels);
  } catch (err) {
    loader.style.display = "none";
    grid.innerHTML = `<div style="padding:40px;color:var(--accent-pink);font-size:0.9rem">❌ Failed to load: ${err.message}</div>`;
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Refresh Models`;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  CHAT SYSTEM
// ═══════════════════════════════════════════════════════════════════

// ─── Open chat panel ──────────────────────────────────────────────────────────
function openChat(modelId) {
  activeModel = allModels.find((m) => m.id === modelId);
  if (!activeModel) return;
  if (!chatHistory[modelId]) chatHistory[modelId] = [];

  // Populate header
  document.getElementById("chat-model-emoji").textContent = familyEmoji(activeModel.family);
  document.getElementById("chat-model-name").textContent = activeModel.model_name;
  document.getElementById("chat-model-meta").textContent =
    `${activeModel.family?.toUpperCase()} · ${activeModel.parameter_size} · ${activeModel.quantization_level}`;
  document.getElementById("chat-server-url").textContent = activeModel.ip_port + "/api/chat";

  // Open panel
  document.getElementById("chat-overlay").classList.add("open");
  document.getElementById("chat-panel").classList.add("open");
  document.body.style.overflow = "hidden";

  // Render existing messages or welcome
  renderMessagesPanel(modelId);

  // Focus input
  setTimeout(() => document.getElementById("chat-input").focus(), 400);

  // Test connection
  testConnection();
}

// ─── Close chat panel ─────────────────────────────────────────────────────────
// Called directly (X button / Escape key): no event argument → always close
// Called from overlay onclick: only close if the overlay itself was clicked
function closeChat(event) {
  if (event && event.target !== document.getElementById("chat-overlay")) return;
  _doCloseChat();
}

function _doCloseChat() {
  if (abortController) { abortController.abort(); abortController = null; }
  isStreaming = false;
  document.getElementById("chat-overlay").classList.remove("open");
  document.getElementById("chat-panel").classList.remove("open");
  document.body.style.overflow = "";
}

// ─── Clear chat history ───────────────────────────────────────────────────────
function clearChat() {
  if (!activeModel) return;
  chatHistory[activeModel.id] = [];
  renderMessagesPanel(activeModel.id);
}

// ─── Render all messages for model into the panel ─────────────────────────────
function renderMessagesPanel(modelId) {
  const container = document.getElementById("chat-messages");
  const msgs = chatHistory[modelId] || [];

  if (msgs.length === 0) {
    container.innerHTML = `
      <div class="chat-welcome">
        <div class="chat-welcome-icon">${familyEmoji(activeModel?.family)}</div>
        <h3>Chat with ${activeModel?.model_name}</h3>
        <p>Connected to <span class="code-font" style="color:var(--accent-cyan)">${activeModel?.ip_city_name_en}, ${activeModel?.ip_country_name_en}</span> via Ollama API. Type a message to get started!</p>
      </div>`;
    return;
  }

  container.innerHTML = "";
  msgs.forEach((m) => {
    container.appendChild(createBubble(m.role, m.content, m.time));
  });
  scrollToBottom();
}

// ─── Create a message bubble element ─────────────────────────────────────────
function createBubble(role, content, time) {
  const wrapper = document.createElement("div");
  wrapper.className = `msg ${role}`;
  const avatar = role === "user" ? "👤" : familyEmoji(activeModel?.family);
  wrapper.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div>
      <div class="msg-bubble">${escapeHtml(content)}</div>
      <span class="msg-time">${time || timeStr()}</span>
    </div>`;
  return wrapper;
}

// ─── Escape HTML for safe injection ──────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

// ─── Scroll chat to bottom ────────────────────────────────────────────────────
function scrollToBottom() {
  const c = document.getElementById("chat-messages");
  c.scrollTop = c.scrollHeight;
}

// ─── Keyboard handler ─────────────────────────────────────────────────────────
function handleChatKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// ─── Auto-resize textarea ─────────────────────────────────────────────────────
function autoResizeTextarea(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 140) + "px";
}

// ─── Set banner connection state ──────────────────────────────────────────────
function setBanner(state, text) {
  const banner = document.getElementById("chat-connection-banner");
  const icon = document.getElementById("connection-icon");
  const txt = document.getElementById("connection-text");
  banner.className = "chat-connection-banner " + (state || "");
  icon.textContent = { connected: "✅", error: "❌", "": "⏳" }[state] || "⏳";
  txt.textContent = text;
}

// ─── Test if the Ollama server is reachable ───────────────────────────────────
async function testConnection() {
  if (!activeModel) return;
  setBanner("", "Testing connection to server...");
  const url = `${activeModel.ip_port}/api/tags`;
  try {
    const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const json = await res.json();
      const names = (json.models || []).map((m) => m.name).join(", ") || "ready";
      setBanner("connected", `Connected · Models available: ${names}`);
    } else {
      setBanner("connected", `Server responded (${res.status}) — ready to chat`);
    }
  } catch (err) {
    if (err.name === "AbortError" || err.name === "TimeoutError") {
      setBanner("error", "⚠ Connection timed out — server may be offline or CORS-blocked");
    } else {
      // CORS or network error: still allow chat attempt, explain the situation
      setBanner("error", "⚠ Blocked by CORS policy — try running a local proxy or enable CORS on this server");
    }
  }
}

// ─── Main send message ────────────────────────────────────────────────────────
async function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text || isStreaming || !activeModel) return;

  const modelId = activeModel.id;

  // Add user message
  const t = timeStr();
  chatHistory[modelId].push({ role: "user", content: text, time: t });
  const container = document.getElementById("chat-messages");

  // Re-render if was showing welcome screen
  if (container.querySelector(".chat-welcome")) container.innerHTML = "";

  container.appendChild(createBubble("user", text, t));
  scrollToBottom();

  // Clear input
  input.value = "";
  input.style.height = "auto";

  // Disable controls while streaming
  isStreaming = true;
  document.getElementById("chat-send-btn").disabled = true;
  document.getElementById("chat-input").disabled = true;

  // Show typing indicator
  const typing = document.getElementById("typing-indicator");
  typing.style.display = "flex";
  scrollToBottom();

  // Build the assistant bubble (streaming target)
  const assistantMsg = document.createElement("div");
  assistantMsg.className = "msg assistant";
  const avatar = familyEmoji(activeModel.family);
  assistantMsg.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div>
      <div class="msg-bubble" id="streaming-bubble"><span class="streaming-cursor"></span></div>
      <span class="msg-time" id="streaming-time">${timeStr()}</span>
    </div>`;

  // Call API
  abortController = new AbortController();
  let fullResponse = "";

  try {
    const messages = chatHistory[modelId]
      .filter((m) => m.role !== undefined)
      .map(({ role, content }) => ({ role, content }));

    const res = await fetch(`${activeModel.ip_port}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: activeModel.model,
        messages,
        stream: true,
      }),
      signal: abortController.signal,
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status} ${res.statusText}`);
    }

    // Hide typing indicator and show bubble
    typing.style.display = "none";
    container.appendChild(assistantMsg);
    scrollToBottom();

    const bubble = document.getElementById("streaming-bubble");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    setBanner("connected", "Streaming response…");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      // Ollama streams newline-delimited JSON objects
      const lines = chunk.split("\n").filter((l) => l.trim());
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          const token = obj?.message?.content || "";
          fullResponse += token;
          bubble.innerHTML = escapeHtml(fullResponse) + '<span class="streaming-cursor"></span>';
          scrollToBottom();
          if (obj.done) break;
        } catch (_) { /* partial JSON, skip */ }
      }
    }

    // Finalize bubble
    bubble.innerHTML = escapeHtml(fullResponse);
    const msgTime = timeStr();
    document.getElementById("streaming-time").textContent = msgTime;
    chatHistory[modelId].push({ role: "assistant", content: fullResponse, time: msgTime });
    setBanner("connected", `Done · ${fullResponse.split(" ").length} words generated`);

  } catch (err) {
    typing.style.display = "none";

    let errText = "";
    if (err.name === "AbortError") {
      errText = "Request cancelled.";
    } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      errText = "Cannot reach server — likely a CORS restriction or server is offline.\n\nTo fix: run your browser with CORS disabled, or set up a local proxy.";
    } else {
      errText = err.message;
    }

    // Show error bubble
    const errBubble = document.createElement("div");
    errBubble.className = "msg assistant";
    errBubble.innerHTML = `
      <div class="msg-avatar">⚠️</div>
      <div>
        <div class="msg-bubble" style="background:rgba(239,68,68,0.12);border-color:rgba(239,68,68,0.25);color:#f87171;">
          ${escapeHtml(errText)}
        </div>
        <span class="msg-time">${timeStr()}</span>
      </div>`;
    container.appendChild(errBubble);
    scrollToBottom();
    setBanner("error", "Connection failed — see message above");

  } finally {
    isStreaming = false;
    abortController = null;
    document.getElementById("chat-send-btn").disabled = false;
    document.getElementById("chat-input").disabled = false;
    document.getElementById("chat-input").focus();
  }
}

// ─── Navbar scroll effect ──────────────────────────────────────────────────────
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 40) {
    nav.style.background = "rgba(5,8,16,0.95)";
    nav.style.borderBottomColor = "rgba(255,255,255,0.1)";
  } else {
    nav.style.background = "rgba(5,8,16,0.7)";
    nav.style.borderBottomColor = "rgba(255,255,255,0.06)";
  }
});

// ─── Close panel on Escape ─────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.getElementById("chat-panel").classList.contains("open")) {
    _doCloseChat();
  }
});

// ─── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", loadModels);
