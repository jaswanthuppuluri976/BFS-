/**
 * BFS Adventure - Interactive Quiz Engine
 * Redesigned to match professional educational assessment UI standards
 */

class QuizEngine {
  constructor() {
    this.questions = (typeof QUIZ_QUESTIONS !== 'undefined' ? QUIZ_QUESTIONS : (typeof window !== 'undefined' ? window.QUIZ_QUESTIONS : [])) || [];
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = {};
    this.pendingSelections = {};
    this.isCompleted = false;
    this.container = null;
    this.initialized = false;
  }

  init(containerEl) {
    this.container = containerEl;
    if (!this.questions || this.questions.length === 0) {
      this.questions = (typeof QUIZ_QUESTIONS !== 'undefined' ? QUIZ_QUESTIONS : (typeof window !== 'undefined' ? window.QUIZ_QUESTIONS : [])) || [];
    }
    if (!this.initialized) {
      this.initialized = true;
      this.reset();
    } else {
      this.render();
    }
  }

  reset() {
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = {};
    this.pendingSelections = {};
    this.isCompleted = false;
    this.render();
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      this.render();
      if (typeof soundManager !== 'undefined' && soundManager.playPop) {
        soundManager.playPop();
      }
    }
  }

  selectOption(questionId, optionId) {
    // If this question is already answered and locked, do not allow changing
    if (this.userAnswers[questionId] !== undefined) return;

    this.pendingSelections[questionId] = optionId;
    if (typeof soundManager !== 'undefined' && soundManager.playPop) {
      soundManager.playPop();
    }
    this.render();
  }

  confirmAnswer() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    const pending = this.pendingSelections[q.id];
    if (!pending) return; // No selection yet
    if (this.userAnswers[q.id] !== undefined) return; // Already answered

    const chosen = q.options.find(o => o.id === pending);
    const isCorrect = Boolean(chosen && chosen.correct);

    this.userAnswers[q.id] = {
      optionId: pending,
      isCorrect,
      explanation: q.explanation
    };

    if (isCorrect) {
      this.score += 10;
      if (typeof soundManager !== 'undefined' && soundManager.playSuccess) {
        soundManager.playSuccess();
      }
    } else {
      if (typeof soundManager !== 'undefined' && soundManager.playError) {
        soundManager.playError();
      }
    }

    this.render();
  }

  nextQuestion() {
    const totalQ = this.questions.length;
    if (this.currentIndex < totalQ - 1) {
      this.currentIndex++;
      this.render();
      if (typeof soundManager !== 'undefined' && soundManager.playPop) {
        soundManager.playPop();
      }
    } else {
      this.isCompleted = true;
      this.render();
      if (typeof soundManager !== 'undefined' && soundManager.playSuccess) {
        soundManager.playSuccess();
      }
      // Smooth scroll to top of assessment when completed
      if (this.container) {
        this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  completeQuiz() {
    this.isCompleted = true;
    this.render();
    if (typeof soundManager !== 'undefined' && soundManager.playSuccess) {
      soundManager.playSuccess();
    }
    if (this.container) {
      this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  switchToStepMode() {
    this.isCompleted = false;
    this.currentIndex = 0;
    this.render();
  }

  scrollToProgress() {
    const el = document.getElementById('review-section-heading');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
      if (typeof soundManager !== 'undefined' && soundManager.playPop) {
        soundManager.playPop();
      }
    }
  }

  render() {
    if (!this.container) return;

    if (this.isCompleted) {
      this.renderSummary();
      return;
    }

    const totalQ = this.questions.length;
    const answeredCount = Object.keys(this.userAnswers).length;
    const q = this.questions[this.currentIndex];
    const answer = this.userAnswers[q.id];
    const pending = this.pendingSelections[q.id];

    const currentQNum = String(this.currentIndex + 1).padStart(2, '0');
    const codeNum = String(q.id).padStart(2, '0');

    this.container.innerHTML = `
      <div class="assessment-layout-container">
        <!-- TOP ASSESSMENT HEADER & NAVIGATION CARD -->
        <div class="assessment-header-card" id="assessment-header-card">
          <div class="assessment-top-row">
            <div class="assessment-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>KNOWLEDGE ASSESSMENT</span>
            </div>
            <div class="assessment-meta">
              Breadth First Search (BFS) Quiz (${totalQ} Questions)
            </div>
          </div>

          <h1 class="assessment-title">Breadth First Search (BFS) Knowledge Check</h1>
          <p class="assessment-desc">
            Test your understanding of level-by-level traversal, FIFO queue mechanics, visited sets, shortest unweighted paths, and time/space complexity.
          </p>

          <div class="assessment-divider"></div>

          <div class="assessment-progress-bar-row">
            <div class="assessment-progress-left">
              <svg class="sparkle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              <span class="progress-label">Progress: <strong>${answeredCount} / ${totalQ} Answered</strong></span>
            </div>
            ${answeredCount === totalQ ? `
              <button type="button" class="btn-review-complete" onclick="quizEngine.completeQuiz()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Complete & Review Results
              </button>
            ` : ''}
          </div>

          <div class="q-nav-row" role="navigation" aria-label="Question Navigation">
            ${this.questions.map((quest, idx) => {
              const isCurrent = idx === this.currentIndex;
              const ans = this.userAnswers[quest.id];
              const isAnswered = ans !== undefined;
              
              let navClass = "q-nav-btn";
              let contentHTML = `Q${idx + 1}`;

              if (isCurrent) {
                navClass += " is-current";
                if (isAnswered) {
                  if (ans.isCorrect) {
                    contentHTML = `
                      <span class="q-nav-num">Q${idx + 1}</span>
                      <span class="q-nav-mark">✓</span>
                    `;
                  } else {
                    contentHTML = `
                      <span class="q-nav-num">Q${idx + 1}</span>
                      <span class="q-nav-mark">✕</span>
                    `;
                  }
                } else {
                  contentHTML = `<span class="q-nav-num">Q${idx + 1}</span>`;
                }
              } else if (isAnswered) {
                if (ans.isCorrect) {
                  navClass += " is-pass";
                  contentHTML = `
                    <span class="q-nav-num">Q${idx + 1}</span>
                    <span class="q-nav-mark">✓</span>
                  `;
                } else {
                  navClass += " is-fail";
                  contentHTML = `
                    <span class="q-nav-num">Q${idx + 1}</span>
                    <span class="q-nav-mark">✕</span>
                  `;
                }
              } else {
                navClass += " is-unanswered";
                contentHTML = `<span class="q-nav-num">Q${idx + 1}</span>`;
              }

              return `
                <button type="button" class="${navClass}" onclick="quizEngine.goToQuestion(${idx})" aria-label="Question ${idx + 1}" ${isCurrent ? 'aria-current="true"' : ''}>
                  ${contentHTML}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- CURRENT QUESTION CARD -->
        <div class="assessment-question-card ${answer ? (answer.isCorrect ? 'card-state-correct' : 'card-state-incorrect') : ''}" id="assessment-question-card">
          <div class="q-card-header">
            <div class="q-card-header-left">
              <span class="q-num-pill">Question ${currentQNum} of ${totalQ}</span>
              <span class="q-category-code">CORE-${codeNum}</span>
            </div>
            <div class="q-card-header-right">
              ${answer ? (
                answer.isCorrect 
                  ? `<span class="q-status-badge badge-correct">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                       Correct
                     </span>`
                  : `<span class="q-status-badge badge-incorrect">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                       Incorrect
                     </span>`
              ) : ''}
            </div>
          </div>

          <h2 class="q-card-title">${this.currentIndex + 1}. ${q.question}</h2>

          <div class="q-options-container" role="radiogroup" aria-label="Answer options">
            ${q.options.map(opt => {
              let optClass = "q-option-card";
              let indicatorHTML = "";

              if (answer) {
                // Confirmed results
                if (opt.correct) {
                  optClass += " opt-correct";
                  indicatorHTML = `
                    <span class="opt-indicator icon-correct" aria-label="Correct answer">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  `;
                } else if (answer.optionId === opt.id) {
                  optClass += " opt-incorrect";
                  indicatorHTML = `
                    <span class="opt-indicator icon-incorrect" aria-label="Incorrect answer">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </span>
                  `;
                } else {
                  optClass += " opt-muted";
                }
              } else {
                // Not confirmed yet
                if (pending === opt.id) {
                  optClass += " opt-selected";
                }
              }

              return `
                <button type="button" class="${optClass}" 
                  onclick="quizEngine.selectOption(${q.id}, '${opt.id}')"
                  ${answer ? 'disabled' : ''}
                  role="radio"
                  aria-checked="${Boolean(answer ? answer.optionId === opt.id : pending === opt.id)}">
                  <span class="opt-badge">${opt.id}</span>
                  <span class="opt-text">${opt.text}</span>
                  ${indicatorHTML}
                </button>
              `;
            }).join('')}
          </div>

          <div class="q-card-footer">
            <button type="button" class="btn-quiz-nav btn-quiz-prev" onclick="quizEngine.prevQuestion()" ${this.currentIndex === 0 ? 'disabled' : ''}>
              &larr; Previous
            </button>

            ${!answer ? `
              <button type="button" class="btn-quiz-nav btn-quiz-confirm" onclick="quizEngine.confirmAnswer()" ${!pending ? 'disabled' : ''}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                CONFIRM ANSWER
              </button>
            ` : (this.currentIndex === totalQ - 1 ? `
              <button type="button" class="btn-quiz-nav btn-quiz-complete-review" onclick="quizEngine.completeQuiz()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                COMPLETE & REVIEW
              </button>
            ` : `
              <button type="button" class="btn-quiz-nav btn-quiz-next" onclick="quizEngine.nextQuestion()">
                NEXT QUESTION &rarr;
              </button>
            `)}
          </div>

          ${answer ? `
            <div class="q-explanation-panel">
              <div class="expl-heading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>Technical Explanation:</span>
              </div>
              <p class="expl-content">${answer.explanation}</p>
              <div class="expl-actions">
                <button type="button" class="expl-link-btn" onclick="app.switchTab('theory')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Review in Theory Guide &rarr;
                </button>
                <button type="button" class="expl-link-btn" onclick="app.switchTab('game')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
                  Practice in Challenges &rarr;
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderSummary() {
    const totalQ = this.questions.length;
    // Count number of correctly answered questions
    let correctCount = 0;
    this.questions.forEach(q => {
      const ans = this.userAnswers[q.id];
      if (ans && ans.isCorrect) correctCount++;
    });

    const percentage = Math.round((correctCount / totalQ) * 100);

    // Determine performance tier based on 8-10, 6-7, 0-5
    let tier = "low"; // 'high' (8-10), 'mid' (6-7), 'low' (0-5)
    let badgeText = "KEEP LEARNING — REVIEW THEORY";
    let badgeClass = "tier-badge-red";
    let titleHTML = `0–5: 🔴 Keep Learning — Review the theory and visualization.`;
    let descText = `Keep practicing! Review the step-by-step Theory Field Guide chapters and try interactive BFS queue explorations in the Visualizer Workbench.`;

    if (correctCount >= 8) {
      tier = "high";
      badgeText = "EXCELLENT — BFS MASTER!";
      badgeClass = "tier-badge-green";
      titleHTML = `8–10: 🟢 Excellent — BFS Traversal Master!`;
      descText = `Exceptional work! You have complete command over FIFO queue sequencing, visited sets, shortest unweighted path calculation, and time/space complexity.`;
    } else if (correctCount >= 6) {
      tier = "mid";
      badgeText = "GOOD — REVIEW & TRY AGAIN";
      badgeClass = "tier-badge-yellow";
      titleHTML = `6–7: 🟡 Good — Review & Try Again.`;
      descText = `Solid conceptual foundation! Review tricky edge cases, cross edges vs tree edges, and space complexity to achieve a perfect 10/10 score.`;
    }

    this.container.innerHTML = `
      <div class="assessment-layout-container">
        <!-- TOP HEADER CARD (Completed state) -->
        <div class="assessment-header-card" id="assessment-header-card">
          <div class="assessment-top-row">
            <div class="assessment-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>KNOWLEDGE ASSESSMENT</span>
            </div>
            <div class="assessment-meta-group">
              <span class="assessment-meta">Breadth First Search (BFS) Quiz (${totalQ} Questions)</span>
              <span class="completed-pill">Completed</span>
            </div>
          </div>

          <h1 class="assessment-title">Breadth First Search (BFS) Knowledge Check</h1>
          <p class="assessment-desc">
            Test your understanding of level-by-level traversal, FIFO queue mechanics, visited sets, shortest unweighted paths, and time/space complexity.
          </p>

          <div class="assessment-divider"></div>

          <div class="assessment-progress-bar-row">
            <div class="assessment-progress-left">
              <svg class="sparkle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              <span class="progress-label">Progress: <strong>${totalQ} / ${totalQ} Answered</strong></span>
            </div>
            <button type="button" class="btn-switch-mode" onclick="quizEngine.switchToStepMode()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Switch to Step Mode
            </button>
          </div>

          <!-- Question Grid with Checkmarks / Crosses -->
          <div class="q-nav-row q-nav-review-row" role="navigation" aria-label="Question Review Navigation">
            ${this.questions.map((quest, idx) => {
              const ans = this.userAnswers[quest.id];
              const isPass = Boolean(ans && ans.isCorrect);
              const statusClass = isPass ? "q-nav-pass" : "q-nav-fail";
              const mark = isPass ? "✓" : "✕";

              return `
                <button type="button" class="q-nav-btn ${statusClass}" onclick="quizEngine.scrollToQuestion('review-q-${quest.id}')" aria-label="Jump to Question ${idx + 1}">
                  <span class="q-nav-num">Q${idx + 1}</span>
                  <span class="q-nav-mark">${mark}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- SCORE RANGE & PERFORMANCE BANNER CARD (Exact to Screenshot 1 & 3) -->
        <div class="score-banner-card" id="score-banner-card">
          <div class="score-banner-top">
            <div class="score-banner-badge-group">
              <span class="score-tier-badge ${badgeClass}">
                <span class="tier-dot"></span>
                <span>${badgeText}</span>
              </span>
              <span class="score-fraction-text">Final Score: <strong>${correctCount} of ${totalQ} (${percentage}%)</strong></span>
            </div>

            <div class="score-banner-actions">
              <button type="button" class="btn-banner-retake" onclick="quizEngine.reset()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                Retake Quiz
              </button>
              <button type="button" class="btn-banner-progress" onclick="quizEngine.scrollToProgress()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                View Progress
              </button>
            </div>
          </div>

          <h2 class="score-banner-heading">${titleHTML}</h2>
          <p class="score-banner-desc">${descText}</p>

          <!-- 3-TIER RANGES ROW (8-10, 6-7, 0-5) -->
          <div class="tier-ranges-grid">
            <div class="tier-range-pill ${tier === 'high' ? 'is-active-tier' : ''}">
              <span class="tier-range-label">8–10:</span>
              <span class="tier-range-dot green-dot"></span>
              <span class="tier-range-title">Excellent — BFS Master!</span>
            </div>

            <div class="tier-range-pill ${tier === 'mid' ? 'is-active-tier' : ''}">
              <span class="tier-range-label">6–7:</span>
              <span class="tier-range-dot yellow-dot"></span>
              <span class="tier-range-title">Good — Review & Try Again</span>
            </div>

            <div class="tier-range-pill ${tier === 'low' ? 'is-active-tier' : ''}">
              <span class="tier-range-label">0–5:</span>
              <span class="tier-range-dot red-dot"></span>
              <span class="tier-range-title">Keep Learning — Review Theory</span>
            </div>
          </div>
        </div>

        <!-- REVIEW SECTION HEADER (Exact to Screenshot 3) -->
        <div class="review-section-header" id="review-section-heading">
          <div class="review-header-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span>Full Question-by-Question Review</span>
          </div>
          <div class="review-header-count">
            ${correctCount} of ${totalQ} Correct
          </div>
        </div>

        <!-- QUESTION BY QUESTION CARDS (Exact to Screenshots 2 & 3) -->
        <div class="review-cards-list">
          ${this.questions.map((quest, idx) => {
            const ans = this.userAnswers[quest.id];
            const isCorrect = Boolean(ans && ans.isCorrect);
            const userOptionId = ans ? ans.optionId : null;
            const userOption = quest.options.find(o => o.id === userOptionId);
            const correctOption = quest.options.find(o => o.correct);

            const qNumFormatted = String(idx + 1).padStart(2, '0');
            const codeNumFormatted = String(quest.id).padStart(2, '0');

            return `
              <div class="review-question-card ${isCorrect ? 'rev-card-correct' : 'rev-card-incorrect'}" id="review-q-${quest.id}">
                <div class="rev-card-top">
                  <div class="rev-card-left">
                    <span class="rev-pill-qnum">Question ${qNumFormatted}</span>
                    <span class="rev-pill-code">CORE-${codeNumFormatted}</span>
                  </div>
                  <div class="rev-card-right">
                    ${isCorrect ? `
                      <span class="rev-status-pill pill-correct">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Correct
                      </span>
                    ` : `
                      <span class="rev-status-pill pill-incorrect">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        Incorrect
                      </span>
                    `}
                  </div>
                </div>

                <h3 class="rev-question-title">${idx + 1}. ${quest.question}</h3>

                <div class="rev-submissions-grid">
                  <!-- YOUR SUBMISSION BOX -->
                  <div class="rev-submission-box ${isCorrect ? 'sub-box-correct' : 'sub-box-incorrect'}">
                    <div class="sub-box-label">YOUR SUBMISSION:</div>
                    <div class="sub-box-text">
                      <strong>${userOption ? userOption.id + ':' : 'No Answer:'}</strong> ${userOption ? userOption.text : 'Skipped'}
                    </div>
                  </div>

                  <!-- CORRECT ANSWER BOX -->
                  <div class="rev-submission-box sub-box-correct">
                    <div class="sub-box-label">CORRECT ANSWER:</div>
                    <div class="sub-box-text">
                      <strong>${correctOption ? correctOption.id + ':' : ''}</strong> ${correctOption ? correctOption.text : ''}
                    </div>
                  </div>
                </div>

                <!-- TECHNICAL EXPLANATION DRAWER -->
                <div class="rev-explanation-box">
                  <div class="rev-expl-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span>Technical Explanation:</span>
                  </div>
                  <p class="rev-expl-text">${quest.explanation}</p>
                  <div class="rev-expl-links">
                    <button type="button" class="rev-expl-link" onclick="app.switchTab('theory')">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      Review in Theory Guide &rarr;
                    </button>
                    <button type="button" class="rev-expl-link" onclick="app.switchTab('game')">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
                      Practice in Level Challenges &rarr;
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  scrollToQuestion(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('pulse-highlight');
      setTimeout(() => {
        el.classList.remove('pulse-highlight');
      }, 1500);
    }
  }
}

const quizEngine = new QuizEngine();
if (typeof window !== 'undefined') {
  window.quizEngine = quizEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuizEngine, quizEngine };
}
