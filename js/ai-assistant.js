/**
 * BFS Adventure — Floating AI Assistant Module
 * Bottom-Right interactive helper providing instant algorithm guidance,
 * queue rules, time & space complexity breakdowns, and step-by-step level hints.
 */

const BOT_MASCOT_SVG = `
<svg class="ai-bot-avatar-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="aiBotBg" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="55%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#0e1e4f"/>
    </radialGradient>
    
    <!-- Helmet Gradient -->
    <linearGradient id="aiHelmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="85%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>

    <!-- Visor Gradient -->
    <linearGradient id="aiVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0b1329"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>

    <!-- Ear Left Gradient -->
    <linearGradient id="aiEarL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>

    <!-- Ear Right Gradient -->
    <linearGradient id="aiEarR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>

    <!-- Book Base Gradient -->
    <linearGradient id="aiBookCover" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="48%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>

    <!-- Soft Glow Filter -->
    <filter id="aiDropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#050c26" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Circular Outer Badge -->
  <circle cx="50" cy="50" r="49" fill="url(#aiBotBg)"/>

  <!-- Subtle Rim Light -->
  <circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/>

  <!-- Bottom Dark Vignette Arc -->
  <path d="M10 74 C 22 92, 78 92, 90 74 C 76 96, 24 96, 10 74 Z" fill="#040b20" opacity="0.6"/>

  <!-- Top Antenna -->
  <rect x="48" y="20" width="4" height="8" rx="2" fill="#ffffff" filter="url(#aiDropShadow)"/>
  <circle cx="50" cy="17" r="4" fill="#ffffff" filter="url(#aiDropShadow)"/>
  <circle cx="49" cy="16" r="1.2" fill="#bae6fd"/>

  <!-- Side Ear Cushions / Headphone Muffs -->
  <rect x="22" y="38" width="8" height="18" rx="4" fill="url(#aiEarL)" filter="url(#aiDropShadow)"/>
  <rect x="70" y="38" width="8" height="18" rx="4" fill="url(#aiEarR)" filter="url(#aiDropShadow)"/>

  <!-- Robot Head / Helmet -->
  <rect x="26" y="24" width="48" height="38" rx="19" fill="url(#aiHelmetGrad)" filter="url(#aiDropShadow)"/>

  <!-- Screen / Visor -->
  <rect x="32" y="32" width="36" height="24" rx="11" fill="url(#aiVisorGrad)"/>

  <!-- Screen Glass Reflection highlight -->
  <path d="M35 35 C 44 33, 56 33, 65 35 C 62 38, 38 38, 35 35 Z" fill="rgba(255,255,255,0.2)"/>

  <!-- Cute Smiling Eyes (Arch Shapes ^ ^) -->
  <path d="M38 43 C 39.5 39, 44.5 39, 46 43" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M54 43 C 55.5 39, 60.5 39, 62 43" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" fill="none"/>

  <!-- Cute Smile (Cyan Arc) -->
  <path d="M46 48.5 C 47.5 51.5, 52.5 51.5, 54 48.5" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" fill="none"/>

  <!-- Robot Shoulders / Upper Body -->
  <path d="M34 60 C 34 57, 66 57, 66 60 L 72 72 C 62 76, 38 76, 28 72 Z" fill="#e2e8f0"/>

  <!-- Book Outer Cover Glow -->
  <path d="M22 75 C 33 84, 47 80, 50 78 C 53 80, 67 84, 78 75 C 70 86, 54 87, 50 82 C 46 87, 30 86, 22 75 Z" fill="url(#aiBookCover)" filter="url(#aiDropShadow)"/>

  <!-- Open Book Pages (White) -->
  <path d="M24 72 C 34 76, 46 72, 49.5 68 C 50 67.5, 50 67.5, 50.5 68 C 54 72, 66 76, 76 72 C 73 80, 61 82, 50.5 76 C 50 75.8, 50 75.8, 49.5 76 C 39 82, 27 80, 24 72 Z" fill="#ffffff" filter="url(#aiDropShadow)"/>

  <!-- Book Spine Center Fold Line & Page Details -->
  <line x1="50" y1="68" x2="50" y2="76" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M28 73 C 35 75.5, 43 73, 47 70.5" stroke="#e2e8f0" stroke-width="1" fill="none"/>
  <path d="M53 70.5 C 57 73, 65 75.5, 72 73" stroke="#e2e8f0" stroke-width="1" fill="none"/>

  <!-- Robot Hands / Little Thumbs gripping book -->
  <ellipse cx="26" cy="72" rx="3" ry="2.2" fill="#ffffff" transform="rotate(-15 26 72)"/>
  <ellipse cx="74" cy="72" rx="3" ry="2.2" fill="#ffffff" transform="rotate(15 74 72)"/>
</svg>
`;

class AIAssistant {
  constructor() {
    this.isOpen = false;
    this.history = [];
  }

  init() {
    this.render();
    this.bindEvents();
    this.addSystemMessage("Hi! I'm your **BFS AI Assistant**. Ask me anything about Breadth-First Search, FIFO Queues, time complexity, or click a quick question below!");
  }

  render() {
    // Check if container already exists
    if (document.getElementById("ai-assistant-container")) return;

    const div = document.createElement("div");
    div.id = "ai-assistant-container";
    div.innerHTML = `
      <!-- Floating Action Button (Bottom-Right Logo Only) -->
      <button id="ai-assistant-fab" class="ai-fab-btn" title="Open BFS AI Assistant" aria-label="Open BFS AI Assistant">
        <span class="ai-fab-icon">
          ${BOT_MASCOT_SVG}
        </span>
        <span class="ai-fab-pulse"></span>
      </button>

      <!-- Chat Window Drawer -->
      <div id="ai-assistant-window" class="ai-chat-window hidden" style="display: none;">
        
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-header-left">
            <div class="ai-avatar-icon">
              ${BOT_MASCOT_SVG}
            </div>
            <div>
              <h4 class="ai-chat-title">BFS AI Assistant</h4>
              <span class="ai-chat-status"><span class="status-dot"></span> Online &amp; Ready</span>
            </div>
          </div>
          <button id="ai-close-btn" class="ai-close-btn" title="Close AI Assistant">&times;</button>
        </div>

        <!-- Message Body -->
        <div id="ai-chat-body" class="ai-chat-body">
          <!-- Dynamically populated messages -->
        </div>

        <!-- Quick Query Chips -->
        <div class="ai-quick-chips-wrapper">
          <span class="chips-title">Quick Questions:</span>
          <div class="chips-row">
            <button class="ai-chip" data-query="What is BFS?">What is BFS?</button>
            <button class="ai-chip" data-query="Why use FIFO Queue?">FIFO Queue?</button>
            <button class="ai-chip" data-query="Time & Space Complexity?">Complexity?</button>
            <button class="ai-chip" data-query="How does Spanning Tree form?">Spanning Tree?</button>
            <button class="ai-chip" data-query="Give me a level hint!">Level Hint?</button>
          </div>
        </div>

        <!-- Input Bar -->
        <div class="ai-chat-footer">
          <input type="text" id="ai-chat-input" class="ai-chat-input" placeholder="Ask about BFS, queues, or level hints..." />
          <button id="ai-send-btn" class="ai-send-btn" title="Send Message">
            <span>&rarr;</span>
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(div);
  }

  bindEvents() {
    const fab = document.getElementById("ai-assistant-fab");
    const closeBtn = document.getElementById("ai-close-btn");
    const sendBtn = document.getElementById("ai-send-btn");
    const input = document.getElementById("ai-chat-input");

    if (fab) fab.addEventListener("click", () => this.toggle());
    if (closeBtn) closeBtn.addEventListener("click", () => this.close());
    if (sendBtn) sendBtn.addEventListener("click", () => this.handleUserSend());

    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleUserSend();
      });
    }

    // Delegate chip clicks
    document.addEventListener("click", (e) => {
      const chip = e.target.closest(".ai-chip");
      if (chip && chip.dataset.query) {
        this.processQuery(chip.dataset.query);
      }
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    const win = document.getElementById("ai-assistant-window");
    if (win) {
      win.classList.remove("hidden");
      win.classList.add("is-visible");
      win.style.display = "flex";
    }
    const input = document.getElementById("ai-chat-input");
    if (input) input.focus();
    if (window.soundManager) window.soundManager.playPop();
  }

  close() {
    this.isOpen = false;
    const win = document.getElementById("ai-assistant-window");
    if (win) {
      win.classList.remove("is-visible");
      win.classList.add("hidden");
      win.style.display = "none";
    }
    if (window.soundManager) window.soundManager.playPop();
  }

  handleUserSend() {
    const input = document.getElementById("ai-chat-input");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    this.processQuery(text);
  }

  processQuery(query) {
    if (!this.isOpen) this.open();

    this.addUserMessage(query);

    // Generate intelligent AI response with slight realistic delay
    setTimeout(() => {
      const response = this.generateResponse(query);
      this.addSystemMessage(response);
    }, 350);
  }

  addUserMessage(text) {
    const body = document.getElementById("ai-chat-body");
    if (!body) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = "ai-msg ai-msg-user";
    msgDiv.innerHTML = `<div class="msg-bubble">${this.escapeHTML(text)}</div>`;

    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
  }

  addSystemMessage(text) {
    const body = document.getElementById("ai-chat-body");
    if (!body) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = "ai-msg ai-msg-system";
    msgDiv.innerHTML = `
      <div class="ai-msg-avatar">
        ${BOT_MASCOT_SVG}
      </div>
      <div class="msg-bubble">${this.formatMarkdown(text)}</div>
    `;

    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
  }

  generateResponse(query) {
    const q = query.toLowerCase();

    if (q.includes("what is bfs") || q.includes("breadth")) {
      return "**Breadth-First Search (BFS)** is a fundamental graph traversal algorithm that explores nodes **level by level**.\n\nKey Facts:\n• Starts at a root node and visits all immediate distance-1 neighbors first.\n• Then moves to distance-2 neighbors, then distance-3, and so on.\n• Uses a **First-In, First-Out (FIFO) Queue**.\n• Guarantees finding the **shortest path** in unweighted graphs!";
    }

    if (q.includes("fifo") || q.includes("queue")) {
      return "**Why FIFO Queue?**\n\nA **FIFO (First-In, First-Out) Queue** enforces fairness:\n1. The node added *earliest* is dequeued *first*.\n2. This guarantees that all nodes at distance d are completely explored before any node at distance d+1 is processed.\n\nWithout a queue (e.g., using a Stack), the traversal would turn into Depth-First Search (DFS)!";
    }

    if (q.includes("time") || q.includes("space") || q.includes("complexity")) {
      return "**BFS Complexity Analysis**:\n\n• **Time Complexity**: O(V + E)\n  Every vertex V is enqueued/dequeued once, and every edge E is examined.\n\n• **Space Complexity**: O(V)\n  In the worst case (e.g. star graph or wide tree), the queue holds up to O(V) nodes simultaneously.";
    }

    if (q.includes("spanning tree") || q.includes("tree")) {
      return "**BFS Spanning Tree (Discovery Tree)**:\n\nWhen BFS visits an unvisited neighbor v from node u, the edge (u -> v) is recorded as a **Discovery Edge**.\n\nProperties:\n• The set of all discovery edges forms a **Spanning Tree** rooted at the start node.\n• Non-tree edges (cross edges or back edges) are ignored so no cycles exist.\n• The path from root to any node in this tree is guaranteed to be the **shortest path**!";
    }

    if (q.includes("hint") || q.includes("solve") || q.includes("level")) {
      if (window.game && window.game.currentLevelData) {
        const lvl = window.game.currentLevelData;
        const qItems = window.game.queue || [];
        const curr = window.game.currentExplorerNode;
        return `**Hint for Level ${lvl.id}: ${lvl.title}**\n\nGoal: ${lvl.goalText || lvl.concept}\n\n• Start Node: **${lvl.startNode}**\n• Current Active Explorer: **${curr || 'None'}**\n• Nodes in Queue: **[${qItems.join(', ')}]**\n\nRule: Always enqueue all unvisited neighbors of the active node before dequeuing the next item!`;
      }
      return "**Level Hint**:\nNavigate to the **Game** tab and select any level! I will give you live hints based on your current active node and FIFO queue state.";
    }

    if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
      return "Hello there! Ready to master Breadth-First Search? Ask me about queues, graph edges, complexity, or spanning trees!";
    }

    return `**BFS AI Insights**:\n\nRegarding "${this.escapeHTML(query)}":\nRemember that in BFS, every node transition follows the 3-step loop:\n1. Dequeue front node u.\n2. Inspect all adjacent neighbors v.\n3. If v is undiscovered, mark it discovered, record edge (u -> v) in the Spanning Tree, and push to Queue rear!`;
  }

  escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  formatMarkdown(str) {
    let html = this.escapeHTML(str);
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    html = html.replace(/• (.*?)(\n|$)/g, '<li>$1</li>');
    if (html.includes('<li>')) {
      html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    }
    // Newlines
    html = html.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    return html;
  }
}

// Global instance
window.aiAssistant = new AIAssistant();

document.addEventListener("DOMContentLoaded", () => {
  window.aiAssistant.init();
});
