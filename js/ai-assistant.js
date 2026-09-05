/**
 * BFS Adventure — Floating AI Assistant Module
 * Bottom-Right interactive helper providing instant algorithm guidance,
 * queue rules, time & space complexity breakdowns, and step-by-step level hints.
 */

const BOT_MASCOT_SVG = `
<svg class="ai-bot-avatar-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Royal Blue to Violet Gradient exactly matching image.png -->
    <linearGradient id="chatLogoBg" x1="12%" y1="5%" x2="88%" y2="95%">
      <stop offset="0%" stop-color="#2165fc"/>
      <stop offset="48%" stop-color="#4651fb"/>
      <stop offset="100%" stop-color="#8028f8"/>
    </linearGradient>

    <!-- Soft Depth Filter for Back Bubble onto Squircle Background -->
    <filter id="backBubbleShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0.8" dy="1.6" stdDeviation="2.0" flood-color="#120b3e" flood-opacity="0.22"/>
    </filter>

    <!-- High-Contrast Multi-Layer Depth Filter for Front Bubble onto Back Bubble -->
    <filter id="frontBubbleShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="1.2" dy="2.2" stdDeviation="1.2" flood-color="#0e0736" flood-opacity="0.55"/>
      <feDropShadow dx="2.0" dy="4.0" stdDeviation="3.5" flood-color="#140a48" flood-opacity="0.32"/>
    </filter>
  </defs>

  <!-- 1. Squircle Rounded Background -->
  <rect width="100" height="100" rx="23" ry="23" fill="url(#chatLogoBg)"/>

  <!-- 2. Back Speech Bubble (placed behind front bubble, tail pointing down-right) -->
  <path filter="url(#backBubbleShadow)"
        d="M 52.0 36.0
           C 60.5 35.0 70.0 39.0 74.8 45.5
           C 78.5 51.5 78.2 59.5 75.0 65.0
           C 75.0 67.5 76.0 71.5 74.0 74.2
           C 71.4 73.4 68.2 70.8 66.2 69.2
           C 61.2 71.2 55.5 70.0 50.5 66.8
           Z"
        fill="#ffffff"/>

  <!-- 3. Distinct Shadow Crease / Outline separating upper bubble from lower bubble -->
  <path d="M 61.5 37.0
           C 66.0 43.0 67.2 51.5 64.5 58.5
           C 62.5 63.5 58.0 67.5 51.0 67.0"
        stroke="#0e0736" stroke-width="3.0" stroke-opacity="0.42" stroke-linecap="round" fill="none"/>

  <!-- 4. Front Speech Bubble (main circular bubble with tail pointing bottom-left) -->
  <path filter="url(#frontBubbleShadow)"
        d="M 45.5 25.0
           C 57.1 25.0 66.5 34.4 66.5 46.0
           C 66.5 57.6 57.1 67.0 45.5 67.0
           C 42.2 67.0 39.0 66.2 36.2 64.8
           C 32.5 63.0 29.0 65.0 26.8 68.2
           C 27.2 64.5 27.2 60.5 26.0 56.5
           C 25.0 53.0 24.5 49.6 24.5 46.0
           C 24.5 34.4 33.9 25.0 45.5 25.0
           Z"
        fill="#ffffff"/>

  <!-- 5. Three Gradient Sequence Dots inside Front Bubble -->
  <circle cx="36.5" cy="46.0" r="2.9" fill="#2165fc"/>
  <circle cx="45.5" cy="46.0" r="2.9" fill="#4651fb"/>
  <circle cx="54.5" cy="46.0" r="2.9" fill="#8028f8"/>
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
