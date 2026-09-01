/**
 * AlgoLearn - Breadth First Search (BFS) Theory Curriculum Data
 * 12 Comprehensive Chapters covering Graph Traversal, FIFO Queue Dynamics, and Shortest Paths
 */

const THEORY_MODULES = [
  /* ─────────────────────────────────────────────────────────────
     CHAPTER 01 — GRAPH REPRESENTATION & FOUNDATIONS
  ───────────────────────────────────────────────────────────── */
  {
    id: "graph-foundations",
    chapterNum: "01",
    category: "FUNDAMENTALS",
    readTime: "2 MIN",
    title: "1. GRAPH REPRESENTATION & FOUNDATIONS",
    tocTitle: "01 Graph Foundations",
    execDefinition: "A graph G = (V, E) is a non-linear data structure consisting of a set of vertices (nodes) V and a collection of edges (connections) E that link pairs of vertices.",
    analogy: "Think of a graph like an airline flight network: cities are vertices, and direct non-stop flight paths between cities are edges.",
    specs: [
      "Graphs can be directed (one-way streets) or undirected (bidirectional roadways).",
      "Graphs can be unweighted (all edges have unit cost = 1) or weighted (edges have distances/costs).",
      "Adjacency List: Space-efficient O(V + E) representation storing adjacent neighbors per node.",
      "Adjacency Matrix: O(V²) 2D lookup table providing O(1) edge existence queries."
    ],
    formula: "Graph G = (V, E) | Density = |E| / (|V| · (|V| - 1))",
    diagram: {
      step1Title: "1. GRAPH VERTICES",
      step1Val: "V = {A, B, C, D}",
      step2Title: "2. EDGE RELATIONS",
      step2Val: "E = {(A,B), (A,C), (B,D)}",
      step3Title: "3. ADJACENCY LIST",
      step3Val: "A: [B, C], B: [D]",
      step4Title: "4. GRAPH TYPE",
      step4Val: "Unweighted Graph",
      trayLabel: "GRAPH NODE ADJACENCY STRUCTURE:",
      items: [
        { label: "Node A", val: "➔ [B, C]", active: true },
        { label: "Node B", val: "➔ [D]", active: false },
        { label: "Node C", val: "➔ []", active: false },
        { label: "Node D", val: "➔ []", active: false }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 02 — WHAT IS BREADTH FIRST SEARCH (BFS)?
  ───────────────────────────────────────────────────────────── */
  {
    id: "what-is-bfs",
    chapterNum: "02",
    category: "CORE ALGORITHM",
    readTime: "3 MIN",
    title: "2. WHAT IS BREADTH FIRST SEARCH (BFS)?",
    tocTitle: "02 What is BFS?",
    execDefinition: "An exhaustive level-order graph traversal algorithm that visits all neighbor vertices at the current depth distance before proceeding to vertices at the next depth level.",
    analogy: "Dropping a pebble into a calm pond: the ripples expand outward in perfect concentric rings. BFS explores node neighbors in exactly the same expanding concentric waves.",
    specs: [
      "Systematic level-by-level exploration starting from a designated source root vertex.",
      "Guarantees that vertices at distance k are completely processed before any vertex at distance k+1.",
      "Discovers the shortest path (minimum edge count) from the start vertex to all reachable vertices in unweighted graphs.",
      "Visits every reachable vertex and explores every reachable edge in deterministic order."
    ],
    formula: "Level(v) = Level(u) + 1 for each undiscovered neighbor v of u",
    diagram: {
      step1Title: "1. SOURCE ROOT",
      step1Val: "Node A (Level 0)",
      step2Title: "2. WAVE EXPANSION",
      step2Val: "Level 0 ➔ Level 1 ➔ Level 2",
      step3Title: "3. DISCOVERED",
      step3Val: "Level 1: [B, C]",
      step4Title: "4. TRAVERSAL ORDER",
      step4Val: "A ➔ B ➔ C ➔ D ➔ E",
      trayLabel: "BFS CONCENTRIC DISTANCE TIERS:",
      items: [
        { label: "L0", val: "Root A (dist: 0)", active: true },
        { label: "L1", val: "Node B (dist: 1)", active: false },
        { label: "L1", val: "Node C (dist: 1)", active: false },
        { label: "L2", val: "Node D (dist: 2)", active: false },
        { label: "L2", val: "Node E (dist: 2)", active: false }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 03 — THE FIFO QUEUE ENGINE
  ───────────────────────────────────────────────────────────── */
  {
    id: "fifo-queue-engine",
    chapterNum: "03",
    category: "ENGINE & MECHANICS",
    readTime: "3 MIN",
    title: "3. THE FIFO QUEUE ENGINE",
    tocTitle: "03 The FIFO Queue Engine",
    execDefinition: "A First-In, First-Out (FIFO) sequential buffer that enforces level-by-level traversal order by staging discovered frontier vertices at the back and serving exploration candidates from the front.",
    analogy: "A polite queue at a ticket counter: people who arrive earlier stand near the front and get served first. Newer arrivals join the back and wait their turn.",
    specs: [
      "Enqueue (Push Back): Appends newly discovered neighbor vertices into the rear of the queue in O(1) time.",
      "Dequeue (Pop Front): Removes the earliest discovered vertex from the front of the queue in O(1) time.",
      "Ensures strictly non-decreasing distance ordering: elements in the queue always have distances d or d+1.",
      "Maintains the BFS 3-step engine loop: Dequeue Front ➔ Explore Adjacent Neighbors ➔ Enqueue Unvisited."
    ],
    formula: "Queue Invariant: dist(head) ≤ dist(tail) ≤ dist(head) + 1",
    diagram: {
      step1Title: "1. ENQUEUE ROOT",
      step1Val: "Push A into Queue",
      step2Title: "2. DEQUEUE FRONT",
      step2Val: "Pop A ➔ Explore",
      step3Title: "3. ENQUEUE NEIGHBORS",
      step3Val: "Push B, C to Rear",
      step4Title: "4. CURRENT STATE",
      step4Val: "Front: B | Rear: C",
      trayLabel: "FIFO QUEUE WAITING LINE (FRONT ➔ REAR):",
      items: [
        { label: "[FRONT]", val: "Node B", active: true },
        { label: "[SLOT 1]", val: "Node C", active: true },
        { label: "[SLOT 2]", val: "Node D", active: false },
        { label: "[REAR]", val: "Node E", active: false }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 04 — LEVEL-BY-LEVEL CONCENTRIC EXPLORATION
  ───────────────────────────────────────────────────────────── */
  {
    id: "level-by-level",
    chapterNum: "04",
    category: "TRAVERSAL PATTERN",
    readTime: "3 MIN",
    title: "4. LEVEL-BY-LEVEL CONCENTRIC EXPLORATION",
    tocTitle: "04 Level-by-Level Waves",
    execDefinition: "The property where BFS organizes vertices into discrete distance layers $L_0, L_1, L_2, \\dots, L_k$, where each level $L_d$ contains all vertices whose shortest path from the source contains exactly $d$ edges.",
    analogy: "Radar sweeps radiating outward from a lighthouse beacon: the beam catches all objects 1 mile away, then 2 miles away, then 3 miles away in sequential pulses.",
    specs: [
      "Level 0 ($L_0$): Contains exclusively the starting source vertex $\{s\}$ with distance 0.",
      "Level 1 ($L_1$): Contains all immediate 1-hop neighbors of the source vertex.",
      "Level k ($L_k$): Contains all vertices reachable in exactly $k$ hops but not in any earlier level.",
      "A level delimiter or queue size tracking snapshot allows batch processing of entire levels."
    ],
    formula: "L_0 = {s}, \\quad L_{k+1} = \\{v \\notin \\bigcup_{i=0}^k L_i \\mid \\exists u \\in L_k, (u,v) \\in E\\}",
    diagram: {
      step1Title: "1. LEVEL 0",
      step1Val: "{ Start Node S }",
      step2Title: "2. LEVEL 1 (1 Hop)",
      step2Val: "{ Node A, Node B }",
      step3Title: "3. LEVEL 2 (2 Hops)",
      step3Val: "{ Node C, Node D }",
      step4Title: "4. LEVEL 3 (3 Hops)",
      step4Val: "{ Target Node T }",
      trayLabel: "DISCOVERY WAVE LAYERS (PROXIMITY TREE):",
      items: [
        { label: "Level 0", val: "Root [S]", active: true },
        { label: "Level 1", val: "Neighbors [A, B]", active: true },
        { label: "Level 2", val: "Sub-nodes [C, D]", active: false },
        { label: "Level 3", val: "Deep target [T]", active: false }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 05 — VISITED STATE TRACKING & CYCLE PREVENTION
  ───────────────────────────────────────────────────────────── */
  {
    id: "visited-tracking",
    chapterNum: "05",
    category: "SAFETY & INTEGRITY",
    readTime: "2 MIN",
    title: "5. VISITED STATE TRACKING & CYCLE PREVENTION",
    tocTitle: "05 Visited Set & Cycles",
    execDefinition: "A boolean state tracker (hash set or boolean array) that marks vertices the moment they are discovered/enqueued to prevent redundant processing, infinite loops, and cycle re-traversals.",
    analogy: "Breadcrumbs dropped at every intersection you visit: if you come across an intersection that already has breadcrumbs, you know you've already been there and turn back.",
    specs: [
      "Critical Rule: Mark a vertex as visited immediately upon ENQUEUE, NOT when dequeued.",
      "Marking upon enqueue guarantees each node is inserted into the queue at most once.",
      "Prevents infinite recursion/loops in cyclic graphs (e.g., triangles, loops, multi-graphs).",
      "Lookups and insertions into the visited boolean structure occur in constant O(1) time."
    ],
    formula: "if (visited[v] == false) { visited[v] = true; queue.push(v); }",
    diagram: {
      step1Title: "1. EDGE INSPECTION",
      step1Val: "Edge (B ➔ C)",
      step2Title: "2. VISITED LOOKUP",
      step2Val: "visited['C'] == false?",
      step3Title: "3. ENQUEUE & MARK",
      step3Val: "visited['C'] = true",
      step4Title: "4. DUPLICATE BLOCKED",
      step4Val: "Cycle edge skipped",
      trayLabel: "BOOLEAN VISITED LOOKUP ARRAY:",
      items: [
        { label: "visited[A]", val: "TRUE (explored)", active: true },
        { label: "visited[B]", val: "TRUE (explored)", active: true },
        { label: "visited[C]", val: "TRUE (in queue)", active: true },
        { label: "visited[D]", val: "FALSE (undiscovered)", active: false }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 06 — DISCOVERY EDGES VS CROSS EDGES
  ───────────────────────────────────────────────────────────── */
  {
    id: "edge-classification",
    chapterNum: "06",
    category: "GRAPH THEORY",
    readTime: "3 MIN",
    title: "6. DISCOVERY EDGES VS CROSS EDGES",
    tocTitle: "06 Edge Classification",
    execDefinition: "During BFS execution, traversed edges are partitioned into Discovery (Tree) Edges that lead to newly uncovered vertices, and Cross Edges that connect vertices in the same or adjacent levels without forming tree branches.",
    analogy: "Building a family genealogical tree: child-parent bonds are discovery tree branches, while marriages between cousins at the same generational tier are cross-links.",
    specs: [
      "Discovery (Tree) Edge: An edge $(u, v)$ where vertex $v$ was undiscovered prior to checking $u$.",
      "Cross Edge: An edge $(u, v)$ where vertex $v$ was already discovered before visiting edge $(u, v)$.",
      "In undirected graphs, BFS cross edges only connect vertices at the same level $\\Delta d = 0$ or adjacent levels $\\Delta d = \\pm 1$.",
      "BFS never produces back edges that span more than 1 level difference in undirected graphs."
    ],
    formula: "|Level(u) - Level(v)| \\le 1 \\quad \\text{for all undirected edges } (u,v) \\in E",
    diagram: {
      step1Title: "1. DISCOVERY EDGE",
      step1Val: "A ➔ B (New Branch)",
      step2Title: "2. DISCOVERY EDGE",
      step2Val: "A ➔ C (New Branch)",
      step3Title: "3. CROSS EDGE",
      step3Val: "B ➔ C (Same Level 1)",
      step4Title: "4. SPANNING TREE",
      step4Val: "Keeps Discovery only",
      trayLabel: "BFS TRAVERSED EDGE CLASSIFICATION:",
      items: [
        { label: "Edge (A,B)", val: "DISCOVERY (Tree Edge)", active: true },
        { label: "Edge (A,C)", val: "DISCOVERY (Tree Edge)", active: true },
        { label: "Edge (B,C)", val: "CROSS EDGE (Level 1-1)", active: false },
        { label: "Edge (B,D)", val: "DISCOVERY (Tree Edge)", active: true }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 07 — BFS SPANNING TREE GENERATION
  ───────────────────────────────────────────────────────────── */
  {
    id: "spanning-tree",
    chapterNum: "07",
    category: "STRUCTURES",
    readTime: "3 MIN",
    title: "7. BFS SPANNING TREE GENERATION",
    tocTitle: "07 BFS Spanning Tree",
    execDefinition: "A rooted acyclic subgraph $T = (V, E_T)$ comprising all reachable vertices and exactly $|V| - 1$ discovery edges, rooted at the BFS source vertex.",
    analogy: "A pruned bonsai tree: taking a tangled, web-like mesh and trimming away redundant cross-loops until only the clean skeleton of direct trunk and branch routes remains.",
    specs: [
      "Contains every reachable vertex with zero cycles (strictly acyclic tree structure).",
      "Tree height equals the maximum shortest distance from the source to any vertex in the component.",
      "The path in the spanning tree from the root to any vertex $v$ is the shortest path in the original graph.",
      "Maintained efficiently during traversal using parent pointer mapping: `parent[v] = u`."
    ],
    formula: "|E_{Tree}| = |V| - 1 \\quad \\text{(Acyclic connected subgraph)}",
    diagram: {
      step1Title: "1. ROOT OF TREE",
      step1Val: "Node A (Depth 0)",
      step2Title: "2. PRIMARY BRANCHES",
      step2Val: "Branches A-B, A-C",
      step3Title: "3. SUB-BRANCHES",
      step3Val: "Branches B-D, C-E",
      step4Title: "4. TOTAL TREE EDGES",
      step4Val: "|E_T| = 5 - 1 = 4 Edges",
      trayLabel: "PARENT POINTER RECONSTRUCTION TABLE:",
      items: [
        { label: "parent[A]", val: "NULL (Root)", active: true },
        { label: "parent[B]", val: "Node A", active: true },
        { label: "parent[C]", val: "Node A", active: true },
        { label: "parent[D]", val: "Node B", active: true }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 08 — SHORTEST PATH IN UNWEIGHTED GRAPHS
  ───────────────────────────────────────────────────────────── */
  {
    id: "shortest-path",
    chapterNum: "08",
    category: "OPTIMIZATION",
    readTime: "3 MIN",
    title: "8. SHORTEST PATH IN UNWEIGHTED GRAPHS",
    tocTitle: "08 Shortest Path Guarantee",
    execDefinition: "The mathematical guarantee that the first time BFS dequeues or discovers any target vertex $t$, the path traversed from source $s$ has the minimum possible number of edges.",
    analogy: "A rescue team searching rooms in a building: they search all rooms 1 hallway away first, then 2 hallways away. When they find the survivor, they are guaranteed to have taken the shortest possible route.",
    specs: [
      "Guaranteed minimum edge hops for any unweighted, positive unit-weight graph.",
      "More efficient than Dijkstra's Algorithm ($O(V+E)$ vs $O((V+E) \\log V)$) when edge weights are uniform.",
      "Path Reconstruction: Backtrack from target $t$ to source $s$ using `parent[v]` pointers in $O(\\text{path length})$ time.",
      "Provides both single-source shortest paths and distance array `dist[v]` for all reachable vertices."
    ],
    formula: "dist[v] = dist[u] + 1 \\quad \\text{where } u = \\text{parent}[v]",
    diagram: {
      step1Title: "1. START SOURCE",
      step1Val: "Start at Node S",
      step2Title: "2. TARGET LOCATED",
      step2Val: "Target T at Level 2",
      step3Title: "3. BACKTRACK POINTERS",
      step3Val: "T ➔ B ➔ S",
      step4Title: "4. OPTIMAL PATH",
      step4Val: "S ➔ B ➔ T (Cost: 2 hops)",
      trayLabel: "OPTIMAL HOP DISTANCE VECTOR:",
      items: [
        { label: "dist[S]", val: "0 hops (Source)", active: true },
        { label: "dist[B]", val: "1 hop (Shortest)", active: true },
        { label: "dist[T]", val: "2 hops (Optimal)", active: true },
        { label: "dist[Z]", val: "∞ (Unreachable)", active: false }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 09 — CONNECTED COMPONENTS & DISCONNECTED GRAPHS
  ───────────────────────────────────────────────────────────── */
  {
    id: "connected-components",
    chapterNum: "09",
    category: "GRAPH TOPOLOGY",
    readTime: "2 MIN",
    title: "9. CONNECTED COMPONENTS & DISCONNECTED GRAPHS",
    tocTitle: "09 Connected Components",
    execDefinition: "Running BFS iteratively across all unvisited vertices in a graph to identify and count isolated subgraphs (connected components) where no path exists between disjoint sets.",
    analogy: "An archipelago of islands: doing a land search on Island 1 finds all towns on Island 1. To explore Island 2, you must take a boat to Island 2 and start a new search.",
    specs: [
      "A single BFS run from node $s$ visits only the component containing $s$.",
      "Outer loop iterates $v \\in V$: if $v$ is unvisited, launch BFS from $v$ and increment component count.",
      "Identifies all connected clusters in $O(V + E)$ total aggregate runtime.",
      "Multi-Source BFS: Enqueue multiple source seed nodes initially to compute nearest-facility voronoi partitions."
    ],
    formula: "\\text{Component Count} = \\sum_{v \\in V} [\\text{visited}[v] == \\text{false} \\implies \\text{BFS}(v)]",
    diagram: {
      step1Title: "1. LAUNCH BFS 1",
      step1Val: "Source A ➔ {A, B, C}",
      step2Title: "2. CLUSTER 1 FOUND",
      step2Val: "Component #1 Marked",
      step3Title: "3. LAUNCH BFS 2",
      step3Val: "Source D ➔ {D, E}",
      step4Title: "4. TOTAL COMPONENTS",
      step4Val: "2 Isolated Clusters",
      trayLabel: "COMPONENT CLUSTER PARTITIONS:",
      items: [
        { label: "Cluster 1", val: "Nodes {A, B, C}", active: true },
        { label: "Cluster 2", val: "Nodes {D, E}", active: true },
        { label: "Cluster 3", val: "Nodes {F}", active: false },
        { label: "Total", val: "3 Disjoint Islands", active: false }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 10 — BFS VS DFS COMPARATIVE ANALYSIS
  ───────────────────────────────────────────────────────────── */
  {
    id: "bfs-vs-dfs",
    chapterNum: "10",
    category: "COMPARATIVE ANALYSIS",
    readTime: "3 MIN",
    title: "10. BFS VS DFS COMPARATIVE ANALYSIS",
    tocTitle: "10 BFS vs DFS Comparison",
    execDefinition: "A structural and behavioral comparison between Breadth First Search (level-order FIFO queue traversal) and Depth First Search (deep-branch LIFO stack/recursion traversal).",
    analogy: "BFS is like pouring water on a flat floor: it spreads evenly in all directions. DFS is like a mouse exploring a maze: it runs down one tunnel as far as it can before hitting a wall and backing up.",
    specs: [
      "Data Structure: BFS uses a Queue (FIFO); DFS uses a Stack / Call Stack (LIFO).",
      "Traversal Shape: BFS expands in wide concentric rings; DFS dives deeply down a single lineage branch.",
      "Shortest Path: BFS guarantees shortest path in unweighted graphs; DFS does not guarantee shortest path.",
      "Memory Footprint: BFS memory depends on graph width (branching factor); DFS memory depends on tree depth."
    ],
    formula: "\\text{BFS Space} = O(B^D) \\quad \\text{vs} \\quad \\text{DFS Space} = O(D) \\quad (B=\\text{Branching}, D=\\text{Depth})",
    diagram: {
      step1Title: "1. DATA STRUCTURE",
      step1Val: "BFS: Queue | DFS: Stack",
      step2Title: "2. EXPLORATION",
      step2Val: "BFS: Wide | DFS: Deep",
      step3Title: "3. SHORTEST PATH",
      step3Val: "BFS: Yes (Unweighted)",
      step4Title: "4. BEST USE CASE",
      step4Val: "BFS: Proximity / Routing",
      trayLabel: "CORE METRIC COMPARISON MATRIX:",
      items: [
        { label: "Queue vs Stack", val: "BFS: FIFO | DFS: LIFO", active: true },
        { label: "Shortest Path", val: "BFS: Guaranteed Optimal", active: true },
        { label: "Graph Traversal", val: "BFS: Concentric Levels", active: true },
        { label: "Cycle Detection", val: "Both supported O(V+E)", active: false }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 11 — TIME & SPACE COMPLEXITY ANALYSIS
  ───────────────────────────────────────────────────────────── */
  {
    id: "complexity-analysis",
    chapterNum: "11",
    category: "COMPLEXITY BOUNDS",
    readTime: "3 MIN",
    title: "11. TIME & SPACE COMPLEXITY ANALYSIS",
    tocTitle: "11 Complexity Analysis",
    execDefinition: "Rigorous asymptotic analysis demonstrating that BFS runs in linear time $O(V + E)$ and requires linear auxiliary memory space $O(V)$ when implemented with an adjacency list.",
    analogy: "Inspecting an office complex: you swipe your badge at every door once (O(V)) and check every connecting hallway between doors once (O(E)).",
    specs: [
      "Vertex Processing: Every vertex is enqueued at most once and dequeued at most once: $O(V)$.",
      "Edge Processing: In an undirected graph, every edge $(u,v)$ is examined exactly twice (once from $u$, once from $v$): $O(E)$.",
      "Adjacency List Runtime: Total Time Complexity = $O(V + E)$.",
      "Adjacency Matrix Runtime: Checking row entries takes $O(V)$ per node, yielding $O(V^2)$ total time.",
      "Space Complexity: The queue and visited set store at most $O(V)$ vertices at peak load: $O(V)$."
    ],
    formula: "\\text{Time: } O(V + E) \\quad \\mid \\quad \\text{Space: } O(V) \\quad (\\text{with Adjacency List})",
    diagram: {
      step1Title: "1. VERTEX OPS",
      step1Val: "V Enqueue + V Dequeue = O(V)",
      step2Title: "2. EDGE SCANS",
      step2Val: "Sum of degrees = 2E = O(E)",
      step3Title: "3. TOTAL TIME",
      step3Val: "O(V + E) Linear Time",
      step4Title: "4. TOTAL SPACE",
      step4Val: "Queue + Visited = O(V)",
      trayLabel: "ASYMPTOTIC RESOURCE BOUNDS:",
      items: [
        { label: "Time (Adj List)", val: "O(V + E) [Optimal]", active: true },
        { label: "Time (Matrix)", val: "O(V²) [Lookup dense]", active: false },
        { label: "Queue Space", val: "O(V) [Max frontier width]", active: true },
        { label: "Visited Space", val: "O(V) [Boolean flags]", active: true }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     CHAPTER 12 — REAL-WORLD APPLICATIONS
  ───────────────────────────────────────────────────────────── */
  {
    id: "real-world-apps",
    chapterNum: "12",
    category: "ENGINEERING SYSTEMS",
    readTime: "3 MIN",
    title: "12. REAL-WORLD SYSTEMS & APPLICATIONS",
    tocTitle: "12 Real-World Applications",
    execDefinition: "How industry software systems leverage BFS for packet broadcasting, social connection degrees, web crawler page scrapers, GPS routing, and game AI pathfinding.",
    analogy: "LinkedIn's '1st degree', '2nd degree', and '3rd degree' connections: Level 1 are your direct friends, Level 2 are friends-of-friends, and Level 3 are friends-of-friends-of-friends.",
    specs: [
      "Social Networks: Computing degrees of separation and mutual friend recommendations (e.g., LinkedIn, Facebook).",
      "Web Crawlers: Scraping the World Wide Web by visiting root URLs and enqueuing outbound hyperlinks level by level.",
      "Network Routing & P2P: Flooding and broadcasting discovery packets across subnet routers and mesh nodes.",
      "GPS & Game AI: Finding the shortest obstacle-free path across 2D grid maps and mazes."
    ],
    formula: "\\text{Degrees of Separation}(s, t) = \\text{BFS Distance}(s, t)",
    diagram: {
      step1Title: "1. 1ST DEGREE",
      step1Val: "Direct Friends (Level 1)",
      step2Title: "2. 2ND DEGREE",
      step2Val: "Friends of Friends (Level 2)",
      step3Title: "3. 3RD DEGREE",
      step3Val: "Extended Network (Level 3)",
      step4Title: "4. PACKET BROADCAST",
      step4Val: "Subnet flood level-by-level",
      trayLabel: "REAL-WORLD APPLICATION SECTORS:",
      items: [
        { label: "Social Graph", val: "Degrees of separation (Level 1,2,3)", active: true },
        { label: "Web Crawling", val: "Google crawler link frontier", active: true },
        { label: "Game Pathfinding", val: "Shortest maze navigation", active: true },
        { label: "Network Routers", val: "Subnet packet broadcast", active: true }
      ]
    }
  }
];
