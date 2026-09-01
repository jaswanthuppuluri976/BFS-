/**
 * BFS Adventure — Floating AI Assistant Module
 * Bottom-Right interactive helper providing instant algorithm guidance,
 * queue rules, time & space complexity breakdowns, and step-by-step level hints.
 */

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
      <!-- Floating Action Button (Bottom-Right) -->
      <button id="ai-assistant-fab" class="ai-fab-btn" title="Open BFS AI Assistant">
        <span class="ai-fab-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="4" y="8" width="16" height="12" rx="2"/><line x1="9" y1="13" x2="9.01" y2="13" stroke-width="3"/><line x1="15" y1="13" x2="15.01" y2="13" stroke-width="3"/><path d="M10 17h4"/></svg>
        </span>
        <span class="ai-fab-pulse"></span>
        <span class="ai-fab-label">AI Assistant</span>
      </button>

      <!-- Chat Window Drawer -->
      <div id="ai-assistant-window" class="ai-chat-window hidden" style="display: none;">
        
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="ai-header-left">
            <div class="ai-avatar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="4" y="8" width="16" height="12" rx="2"/><line x1="9" y1="13" x2="9.01" y2="13" stroke-width="3"/><line x1="15" y1="13" x2="15.01" y2="13" stroke-width="3"/><path d="M10 17h4"/></svg>
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="4" y="8" width="16" height="12" rx="2"/></svg>
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
