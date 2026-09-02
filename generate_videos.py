import subprocess
import os
import sys

FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"

def generate_video_1():
    print("Generating Video 1: BFS Visualization & Traversal...")
    os.makedirs("videos", exist_ok=True)
    out_file = "videos/video1.mp4"
    
    # Filter graph for Video 1 (16 seconds)
    filter_complex = (
        # Background: Deep tech gradient
        "color=c=0x070b14:s=1280x720:d=16[bg];"
        
        # Header banner
        "[bg]drawbox=x=0:y=0:w=1280:h=90:color=0x0f172a@0.9:t=fill[bgh];"
        "[bgh]drawbox=x=0:y=88:w=1280:h=2:color=0x38bdf8@0.8:t=fill[bgh2];"
        "[bgh2]drawtext=fontfile=" + FONT_BOLD + ":text='VIDEO 1\\: BFS VISUALIZATION & LEVEL TRAVERSAL':fontcolor=0x38bdf8:fontsize=28:x=40:y=25[h1];"
        "[h1]drawtext=fontfile=" + FONT_REG + ":text='Core Algorithm Visualizer • Level-by-Level Ripple Expansion':fontcolor=0x94a3b8:fontsize=18:x=40:y=58[h2];"
        
        # Phase Indicator (Changes every 4s)
        "[h2]drawtext=fontfile=" + FONT_BOLD + ":text='PHASE 1\\: SOURCE ROOT (LEVEL 0)':fontcolor=0xa855f7:fontsize=22:x=850:y=35:enable='between(t,0,4)'[ph1];"
        "[ph1]drawtext=fontfile=" + FONT_BOLD + ":text='PHASE 2\\: 1-HOP NEIGHBORS (LEVEL 1)':fontcolor=0x38bdf8:fontsize=22:x=820:y=35:enable='between(t,4,8)'[ph2];"
        "[ph2]drawtext=fontfile=" + FONT_BOLD + ":text='PHASE 3\\: 2-HOP NEIGHBORS (LEVEL 2)':fontcolor=0x22c55e:fontsize=22:x=820:y=35:enable='between(t,8,12)'[ph3];"
        "[ph3]drawtext=fontfile=" + FONT_BOLD + ":text='PHASE 4\\: SHORTEST PATH SPANNING TREE':fontcolor=0xfacc15:fontsize=22:x=800:y=35:enable='between(t,12,16)'[ph4];"

        # Center Graph Canvas Box
        "[ph4]drawbox=x=40:y=110:w=720:h=480:color=0x0f172a@0.6:t=fill[gbox];"
        "[gbox]drawbox=x=40:y=110:w=720:h=480:color=0x1e293b@0.9:t=2[gborder];"
        
        # Graph Nodes & Connections (Level 0: Node 0, Level 1: Nodes 1, 2, Level 2: Nodes 3, 4, 5)
        # Edges
        "[gborder]drawbox=x=200:y=240:w=160:h=3:color=0x334155@0.8:t=fill[e1];"
        "[e1]drawbox=x=200:y=360:w=160:h=3:color=0x334155@0.8:t=fill[e2];"
        "[e2]drawbox=x=400:y=200:w=180:h=3:color=0x334155@0.8:t=fill[e3];"
        "[e3]drawbox=x=400:y=280:w=180:h=3:color=0x334155@0.8:t=fill[e4];"
        "[e4]drawbox=x=400:y=400:w=180:h=3:color=0x334155@0.8:t=fill[e5];"

        # Active Discovery Glows based on time
        # Root Node 0 (x=160, y=300)
        "[e5]drawbox=x=120:y=260:w=80:h=80:color=0xa855f7@0.9:t=fill[n0];"
        "[n0]drawtext=fontfile=" + FONT_BOLD + ":text='Node 0':fontcolor=0xffffff:fontsize=18:x=130:y=285[n0t];"
        "[n0t]drawtext=fontfile=" + FONT_BOLD + ":text='[L0]':fontcolor=0xf3e8ff:fontsize=14:x=145:y=310[n0l];"

        # Level 1: Node 1 (x=360, y=200) & Node 2 (x=360, y=400)
        "[n0l]drawbox=x=320:y=160:w=80:h=80:color=0x1e293b@0.9:t=fill:enable='between(t,0,4)'[n1_dim];"
        "[n1_dim]drawbox=x=320:y=160:w=80:h=80:color=0x0284c7@0.95:t=fill:enable='between(t,4,16)'[n1_active];"
        "[n1_active]drawtext=fontfile=" + FONT_BOLD + ":text='Node 1':fontcolor=0xffffff:fontsize=18:x=330:y=185[n1t];"
        "[n1t]drawtext=fontfile=" + FONT_BOLD + ":text='[L1]':fontcolor=0xe0f2fe:fontsize=14:x=345:y=210[n1l];"

        "[n1l]drawbox=x=320:y=360:w=80:h=80:color=0x1e293b@0.9:t=fill:enable='between(t,0,4)'[n2_dim];"
        "[n2_dim]drawbox=x=320:y=360:w=80:h=80:color=0x0284c7@0.95:t=fill:enable='between(t,4,16)'[n2_active];"
        "[n2_active]drawtext=fontfile=" + FONT_BOLD + ":text='Node 2':fontcolor=0xffffff:fontsize=18:x=330:y=385[n2t];"
        "[n2t]drawtext=fontfile=" + FONT_BOLD + ":text='[L1]':fontcolor=0xe0f2fe:fontsize=14:x=345:y=410[n2l];"

        # Level 2: Node 3, 4, 5
        "[n2l]drawbox=x=580:y=120:w=80:h=80:color=0x1e293b@0.9:t=fill:enable='between(t,0,8)'[n3_dim];"
        "[n3_dim]drawbox=x=580:y=120:w=80:h=80:color=0x16a34a@0.95:t=fill:enable='between(t,8,16)'[n3_active];"
        "[n3_active]drawtext=fontfile=" + FONT_BOLD + ":text='Node 3':fontcolor=0xffffff:fontsize=18:x=590:y=145[n3t];"
        "[n3t]drawtext=fontfile=" + FONT_BOLD + ":text='[L2]':fontcolor=0xdcfce7:fontsize=14:x=605:y=170[n3l];"

        "[n3l]drawbox=x=580:y=260:w=80:h=80:color=0x1e293b@0.9:t=fill:enable='between(t,0,8)'[n4_dim];"
        "[n4_dim]drawbox=x=580:y=260:w=80:h=80:color=0x16a34a@0.95:t=fill:enable='between(t,8,16)'[n4_active];"
        "[n4_active]drawtext=fontfile=" + FONT_BOLD + ":text='Node 4':fontcolor=0xffffff:fontsize=18:x=590:y=285[n4t];"
        "[n4t]drawtext=fontfile=" + FONT_BOLD + ":text='[L2]':fontcolor=0xdcfce7:fontsize=14:x=605:y=310[n4l];"

        "[n4l]drawbox=x=580:y=400:w=80:h=80:color=0x1e293b@0.9:t=fill:enable='between(t,0,8)'[n5_dim];"
        "[n5_dim]drawbox=x=580:y=400:w=80:h=80:color=0x16a34a@0.95:t=fill:enable='between(t,8,16)'[n5_active];"
        "[n5_active]drawtext=fontfile=" + FONT_BOLD + ":text='Node 5':fontcolor=0xffffff:fontsize=18:x=590:y=425[n5t];"
        "[n5t]drawtext=fontfile=" + FONT_BOLD + ":text='[L2]':fontcolor=0xdcfce7:fontsize=14:x=605:y=450[n5l];"

        # Right Inspector Panel: FIFO Queue + State
        "[n5l]drawbox=x=780:y=110:w=460:h=480:color=0x0f172a@0.8:t=fill[pbox];"
        "[pbox]drawbox=x=780:y=110:w=460:h=480:color=0x1e293b@0.9:t=2[pborder];"
        "[pborder]drawtext=fontfile=" + FONT_BOLD + ":text='QUEUE & TRAVERSAL STATE':fontcolor=0x38bdf8:fontsize=20:x=800:y=135[pt];"
        
        # Dynamic Queue visualization
        "[pt]drawtext=fontfile=" + FONT_MONO + ":text='FIFO Queue\\: [ Node 0 ]':fontcolor=0xa855f7:fontsize=18:x=800:y=180:enable='between(t,0,4)'[q1];"
        "[q1]drawtext=fontfile=" + FONT_REG + ":text='Dequeued Node 0 -> Enqueued [1, 2]':fontcolor=0x94a3b8:fontsize=15:x=800:y=215:enable='between(t,0,4)'[qd1];"

        "[qd1]drawtext=fontfile=" + FONT_MONO + ":text='FIFO Queue\\: [ Node 1, Node 2 ]':fontcolor=0x38bdf8:fontsize=18:x=800:y=180:enable='between(t,4,8)'[q2];"
        "[q2]drawtext=fontfile=" + FONT_REG + ":text='Processing Level 1 neighbors':fontcolor=0x94a3b8:fontsize=15:x=800:y=215:enable='between(t,4,8)'[qd2];"

        "[qd2]drawtext=fontfile=" + FONT_MONO + ":text='FIFO Queue\\: [ Node 3, Node 4, Node 5 ]':fontcolor=0x22c55e:fontsize=18:x=800:y=180:enable='between(t,8,12)'[q3];"
        "[q3]drawtext=fontfile=" + FONT_REG + ":text='Processing Level 2 neighbors':fontcolor=0x94a3b8:fontsize=15:x=800:y=215:enable='between(t,8,12)'[qd3];"

        "[qd3]drawtext=fontfile=" + FONT_MONO + ":text='FIFO Queue\\: [ EMPTY - DONE ]':fontcolor=0xfacc15:fontsize=18:x=800:y=180:enable='between(t,12,16)'[q4];"
        "[q4]drawtext=fontfile=" + FONT_REG + ":text='Shortest Path Tree Constructed':fontcolor=0x94a3b8:fontsize=15:x=800:y=215:enable='between(t,12,16)'[qd4];"

        # Traversal Order List
        "[qd4]drawtext=fontfile=" + FONT_BOLD + ":text='VISITED SEQUENCE\\:':fontcolor=0xe2e8f0:fontsize=16:x=800:y=270[vth];"
        "[vth]drawtext=fontfile=" + FONT_MONO + ":text='Order\\: 0':fontcolor=0xa855f7:fontsize=18:x=800:y=305:enable='between(t,0,4)'[vo1];"
        "[vo1]drawtext=fontfile=" + FONT_MONO + ":text='Order\\: 0 -> 1 -> 2':fontcolor=0x38bdf8:fontsize=18:x=800:y=305:enable='between(t,4,8)'[vo2];"
        "[vo2]drawtext=fontfile=" + FONT_MONO + ":text='Order\\: 0 -> 1 -> 2 -> 3 -> 4 -> 5':fontcolor=0x22c55e:fontsize=18:x=800:y=305:enable='between(t,8,16)'[vo3];"

        # Complexity Highlights
        "[vo3]drawbox=x=800:y=360:w=420:h=100:color=0x1e293b@0.7:t=fill[cbox];"
        "[cbox]drawtext=fontfile=" + FONT_BOLD + ":text='TIME COMPLEXITY\\: O(V + E)':fontcolor=0xfacc15:fontsize=18:x=820:y=390[tc];"
        "[tc]drawtext=fontfile=" + FONT_BOLD + ":text='SPACE COMPLEXITY\\: O(V)':fontcolor=0x38bdf8:fontsize=18:x=820:y=425[sc];"

        # Footer Bar
        "[sc]drawbox=x=0:y=620:w=1280:h=100:color=0x0f172a@0.9:t=fill[foot];"
        "[foot]drawbox=x=0:y=620:w=1280:h=2:color=0x334155:t=fill[footb];"
        "[footb]drawtext=fontfile=" + FONT_BOLD + ":text='ALGOLEARN BFS INTERACTIVE CURRICULUM':fontcolor=0x94a3b8:fontsize=16:x=40:y=660[foot1];"
        "[foot1]drawtext=fontfile=" + FONT_REG + ":text='Click Lesson 2 card above to watch Algorithm & Implementation':fontcolor=0x38bdf8:fontsize=16:x=700:y=660[outv]"
    )

    # Audio synthesis: warm chords
    audio_filter = "sine=f=220:d=16,volume=0.1[a1];sine=f=440:d=16,volume=0.05[a2];[a1][a2]amix=inputs=2[aout]"

    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=0x070b14:s=1280x720:d=16",
        "-f", "lavfi", "-i", "sine=f=220:d=16",
        "-filter_complex", filter_complex,
        "-map", "[outv]",
        "-map", "1:a",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-shortest",
        out_file
    ]

    subprocess.run(cmd, check=True)
    print(f"Video 1 created successfully: {out_file}")

def generate_video_2():
    print("Generating Video 2: BFS Algorithm & Implementation...")
    os.makedirs("videos", exist_ok=True)
    out_file = "videos/video2.mp4"

    # Filter graph for Video 2 (16 seconds)
    filter_complex = (
        # Background: Deep navy slate
        "color=c=0x070e1b:s=1280x720:d=16[bg];"
        
        # Header banner
        "[bg]drawbox=x=0:y=0:w=1280:h=90:color=0x0f172a@0.9:t=fill[bgh];"
        "[bgh]drawbox=x=0:y=88:w=1280:h=2:color=0xa855f7@0.8:t=fill[bgh2];"
        "[bgh2]drawtext=fontfile=" + FONT_BOLD + ":text='VIDEO 2\\: BFS ALGORITHM & CODE IMPLEMENTATION':fontcolor=0xa855f7:fontsize=28:x=40:y=25[h1];"
        "[h1]drawtext=fontfile=" + FONT_REG + ":text='Discovery vs Cross Edges • Visited Array Protection • Shortest Path Backtracking':fontcolor=0x94a3b8:fontsize=18:x=40:y=58[h2];"
        
        # Phase Indicator
        "[h2]drawtext=fontfile=" + FONT_BOLD + ":text='STEP 1\\: INITIALIZE QUEUE & VISITED[]':fontcolor=0x38bdf8:fontsize=22:x=780:y=35:enable='between(t,0,4)'[ph1];"
        "[ph1]drawtext=fontfile=" + FONT_BOLD + ":text='STEP 2\\: DISCOVERY EDGES & TREE EDGES':fontcolor=0x22c55e:fontsize=22:x=780:y=35:enable='between(t,4,8)'[ph2];"
        "[ph2]drawtext=fontfile=" + FONT_BOLD + ":text='STEP 3\\: CROSS EDGES & CYCLE DETECTION':fontcolor=0xf97316:fontsize=22:x=780:y=35:enable='between(t,8,12)'[ph3];"
        "[ph3]drawtext=fontfile=" + FONT_BOLD + ":text='STEP 4\\: OPTIMAL PATH RECONSTRUCTION':fontcolor=0xfacc15:fontsize=22:x=780:y=35:enable='between(t,12,16)'[ph4];"

        # Left Column: C++ / Python Algorithm Code Box
        "[ph4]drawbox=x=40:y=110:w=600:h=480:color=0x0b1120@0.9:t=fill[codebox];"
        "[codebox]drawbox=x=40:y=110:w=600:h=480:color=0x1e293b@0.9:t=2[codeborder];"
        "[codeborder]drawbox=x=40:y=110:w=600:h=35:color=0x1e293b@0.8:t=fill[codebar];"
        "[codebar]drawtext=fontfile=" + FONT_BOLD + ":text='ALGORITHM IMPLEMENTATION (C++ / Python)':fontcolor=0x38bdf8:fontsize=15:x=60:y=122[codetitle];"

        # Code Lines
        "[codetitle]drawtext=fontfile=" + FONT_MONO + ":text='void BFS(int startVertex) {':fontcolor=0xf8fafc:fontsize=15:x=60:y=160[c1];"
        "[c1]drawtext=fontfile=" + FONT_MONO + ":text='    vector<bool> visited(V, false);':fontcolor=0xa855f7:fontsize=15:x=60:y=190[c2];"
        "[c2]drawtext=fontfile=" + FONT_MONO + ":text='    queue<int> q;':fontcolor=0x38bdf8:fontsize=15:x=60:y=220[c3];"
        "[c3]drawtext=fontfile=" + FONT_MONO + ":text='    visited[start] = true; q.push(start);':fontcolor=0x22c55e:fontsize=15:x=60:y=250[c4];"
        "[c4]drawtext=fontfile=" + FONT_MONO + ":text='    while (!q.empty()) {':fontcolor=0xf8fafc:fontsize=15:x=60:y=290[c5];"
        "[c5]drawtext=fontfile=" + FONT_MONO + ":text='        int u = q.front(); q.pop();':fontcolor=0xfacc15:fontsize=15:x=60:y=320[c6];"
        "[c6]drawtext=fontfile=" + FONT_MONO + ":text='        for (int v : adj[u]) {':fontcolor=0xf8fafc:fontsize=15:x=60:y=350[c7];"
        "[c7]drawtext=fontfile=" + FONT_MONO + ":text='            if (!visited[v]) { // Discovery':fontcolor=0x38bdf8:fontsize=15:x=60:y=380[c8];"
        "[c8]drawtext=fontfile=" + FONT_MONO + ":text='                visited[v] = true;':fontcolor=0x22c55e:fontsize=15:x=60:y=410[c9];"
        "[c9]drawtext=fontfile=" + FONT_MONO + ":text='                parent[v] = u;':fontcolor=0xa855f7:fontsize=15:x=60:y=440[c10];"
        "[c10]drawtext=fontfile=" + FONT_MONO + ":text='                q.push(v);':fontcolor=0x38bdf8:fontsize=15:x=60:y=470[c11];"
        "[c11]drawtext=fontfile=" + FONT_MONO + ":text='            } // Cross Edge if visited':fontcolor=0x94a3b8:fontsize=15:x=60:y=500[c12];"
        "[c12]drawtext=fontfile=" + FONT_MONO + ":text='    } } }':fontcolor=0xf8fafc:fontsize=15:x=60:y=530[c13];"

        # Right Column: Edge Classification & Shortest Path Tree
        "[c13]drawbox=x=660:y=110:w=580:h=480:color=0x0f172a@0.8:t=fill[rbox];"
        "[rbox]drawbox=x=660:y=110:w=580:h=480:color=0x1e293b@0.9:t=2[rborder];"
        "[rborder]drawtext=fontfile=" + FONT_BOLD + ":text='EDGE CLASSIFICATION & TREE':fontcolor=0xa855f7:fontsize=20:x=680:y=135[rt];"

        # Card 1: Discovery Tree Edges
        "[rt]drawbox=x=680:y=170:w=540:h=90:color=0x064e3b@0.6:t=fill[ec1];"
        "[ec1]drawbox=x=680:y=170:w=540:h=90:color=0x059669@0.8:t=1[ec1b];"
        "[ec1b]drawtext=fontfile=" + FONT_BOLD + ":text='1. DISCOVERY EDGES (TREE EDGES)':fontcolor=0x34d399:fontsize=17:x=700:y=195[ect1];"
        "[ect1]drawtext=fontfile=" + FONT_REG + ":text='Leads to previously UNVISITED vertex. Forms BFS Spanning Tree.':fontcolor=0xd1fae5:fontsize=14:x=700:y=225[ecd1];"

        # Card 2: Cross Edges
        "[ecd1]drawbox=x=680:y=280:w=540:h=90:color=0x7c2d12@0.6:t=fill[ec2];"
        "[ec2]drawbox=x=680:y=280:w=540:h=90:color=0xd97706@0.8:t=1[ec2b];"
        "[ec2b]drawtext=fontfile=" + FONT_BOLD + ":text='2. CROSS EDGES (NON-TREE EDGES)':fontcolor=0xfbbf24:fontsize=17:x=700:y=305[ect2];"
        "[ect2]drawtext=fontfile=" + FONT_REG + ":text='Connects to ALREADY VISITED vertex at same or adjacent level.':fontcolor=0xfef3c7:fontsize=14:x=700:y=335[ecd2];"

        # Card 3: Shortest Path Property
        "[ecd2]drawbox=x=680:y=390:w=540:h=90:color=0x1e1b4b@0.6:t=fill[ec3];"
        "[ec3]drawbox=x=680:y=390:w=540:h=90:color=0x6366f1@0.8:t=1[ec3b];"
        "[ec3b]drawtext=fontfile=" + FONT_BOLD + ":text='3. UNWEIGHTED SHORTEST PATH GUARANTEE':fontcolor=0xa5b4fc:fontsize=17:x=700:y=415[ect3];"
        "[ect3]drawtext=fontfile=" + FONT_REG + ":text='Backtrack parent pointers from Target -> Source for min hops.':fontcolor=0xe0e7ff:fontsize=14:x=700:y=445[ecd3];"

        # Invariant Summary
        "[ecd3]drawtext=fontfile=" + FONT_BOLD + ":text='Key Invariant\\: Queue holds at most 2 adjacent levels at any time.':fontcolor=0x38bdf8:fontsize=15:x=680:y=520[inv];"
        "[inv]drawtext=fontfile=" + FONT_BOLD + ":text='Complexity\\: Time O(V + E)  |  Space O(V)':fontcolor=0xfacc15:fontsize=16:x=680:y=550[inv2];"

        # Footer Bar
        "[inv2]drawbox=x=0:y=620:w=1280:h=100:color=0x0f172a@0.9:t=fill[foot];"
        "[foot]drawbox=x=0:y=620:w=1280:h=2:color=0x334155:t=fill[footb];"
        "[footb]drawtext=fontfile=" + FONT_BOLD + ":text='ALGOLEARN BFS INTERACTIVE CURRICULUM':fontcolor=0x94a3b8:fontsize=16:x=40:y=660[foot1];"
        "[foot1]drawtext=fontfile=" + FONT_REG + ":text='Click Lesson 1 card above to watch BFS Visualization':fontcolor=0xa855f7:fontsize=16:x=700:y=660[outv]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=0x070e1b:s=1280x720:d=16",
        "-f", "lavfi", "-i", "sine=f=330:d=16",
        "-filter_complex", filter_complex,
        "-map", "[outv]",
        "-map", "1:a",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-shortest",
        out_file
    ]

    subprocess.run(cmd, check=True)
    print(f"Video 2 created successfully: {out_file}")

if __name__ == "__main__":
    generate_video_1()
    generate_video_2()
    print("Both videos successfully generated!")
