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
    this.unansweredWarning = null;
    this.expandedQuestions = new Set([2]);
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
    this.unansweredWarning = null;
    this.expandedQuestions = new Set([2]);
    this.render();
  }

  getUnansweredIndices() {
    const list = [];
    this.questions.forEach((q, idx) => {
      if (this.userAnswers[q.id] === undefined) {
        list.push(idx);
      }
    });
    return list;
  }

  clearUnansweredWarning() {
    this.unansweredWarning = null;
    this.render();
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
      if (this.unansweredWarning && this.unansweredWarning.unansweredIndices.includes(index)) {
        this.unansweredWarning.targetQuestionNum = index + 1;
      }
      this.render();
      if (typeof soundManager !== 'undefined' && soundManager.playPop) {
        soundManager.playPop();
      }
      setTimeout(() => {
        const card = document.getElementById('assessment-question-card');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
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

    // Refresh or clear unanswered warning if active
    const remaining = this.getUnansweredIndices();
    if (remaining.length === 0) {
      this.unansweredWarning = null;
    } else if (this.unansweredWarning) {
      this.unansweredWarning.remainingCount = remaining.length;
      this.unansweredWarning.unansweredIndices = remaining;
      const nextTarget = remaining.find(idx => idx > this.currentIndex) ?? remaining[0];
      this.unansweredWarning.targetQuestionNum = nextTarget + 1;
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
      this.completeQuiz();
    }
  }

  completeQuiz() {
    const unanswered = this.getUnansweredIndices();
    if (unanswered.length > 0) {
      // User has not answered all questions: direct to first unanswered question
      const targetIdx = unanswered[0];
      this.currentIndex = targetIdx;
      this.unansweredWarning = {
        remainingCount: unanswered.length,
        targetQuestionNum: targetIdx + 1,
        unansweredIndices: unanswered
      };
      this.render();
      if (typeof soundManager !== 'undefined' && soundManager.playPop) {
        soundManager.playPop();
      }
      setTimeout(() => {
        const banner = document.getElementById('assessment-unanswered-banner') || document.getElementById('assessment-question-card');
        if (banner) {
          banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    // All questions answered: complete quiz and show results review
    this.unansweredWarning = null;
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
                if (this.unansweredWarning && this.unansweredWarning.unansweredIndices.includes(idx)) {
                  navClass += " needs-attention";
                }
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

        ${this.unansweredWarning ? `
          <!-- UNANSWERED QUESTIONS ALERT BANNER -->
          <div class="assessment-unanswered-banner" id="assessment-unanswered-banner" role="alert" aria-live="polite">
            <div class="unanswered-banner-left">
              <div class="unanswered-banner-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="unanswered-banner-info">
                <div class="unanswered-banner-heading">
                  Incomplete Assessment: ${this.unansweredWarning.remainingCount} Question${this.unansweredWarning.remainingCount > 1 ? 's' : ''} Left
                </div>
                <div class="unanswered-banner-msg">
                  Please answer all questions before submitting for review. Directed to <strong>Question ${this.currentIndex + 1}</strong>.
                </div>
              </div>
            </div>
            <div class="unanswered-banner-right">
              <div class="unanswered-banner-chips">
                <span class="unanswered-chips-label">Unanswered:</span>
                ${this.unansweredWarning.unansweredIndices.map(uIdx => `
                  <button type="button" 
                    class="unanswered-chip-pill ${uIdx === this.currentIndex ? 'is-active-target' : ''}" 
                    onclick="quizEngine.goToQuestion(${uIdx})"
                    title="Go to Question ${uIdx + 1}">
                    Q${uIdx + 1}
                  </button>
                `).join('')}
              </div>
              <button type="button" class="btn-dismiss-unanswered" onclick="quizEngine.clearUnansweredWarning()" aria-label="Dismiss notice" title="Dismiss notice">
                ✕
              </button>
            </div>
          </div>
        ` : ''}

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
                SUBMIT ANSWER
              </button>
            ` : (this.currentIndex === totalQ - 1 || answeredCount === totalQ ? `
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

  toggleExplanation(id) {
    if (!this.expandedQuestions) {
      this.expandedQuestions = new Set();
    }
    const detailsEl = document.getElementById(`q-expl-details-${id}`);
    const btnEl = document.getElementById(`q-expl-btn-${id}`);
    
    if (this.expandedQuestions.has(id)) {
      this.expandedQuestions.delete(id);
      if (detailsEl) detailsEl.classList.add('hidden');
      if (btnEl) btnEl.textContent = 'Explain';
    } else {
      this.expandedQuestions.add(id);
      if (detailsEl) detailsEl.classList.remove('hidden');
      if (btnEl) btnEl.textContent = 'Hide';
    }
  }

  renderSummary() {
    const totalQ = this.questions.length;
    let correctCount = 0;
    this.questions.forEach(q => {
      const ans = this.userAnswers[q.id];
      if (ans && ans.isCorrect) correctCount++;
    });

    const incorrectCount = totalQ - correctCount;
    const percentage = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    const gradeText = "★ OUTSTANDING MASTERY (GRADE A+) ★";
    const subtitleText = "Incredible performance! You demonstrated thorough command of BFS operations and algorithmic constraints.";

    if (!this.expandedQuestions) {
      this.expandedQuestions = new Set([2]);
    }

    this.container.innerHTML = `
      <div class="quiz-review-image-format-container">

        <!-- TOP KNOWLEDGE ASSESSMENT CARD (AS SHOWN IN REFERENCE IMAGE 2) -->
        <div class="assessment-header-card" id="assessment-header-card">
          <div class="assessment-top-row">
            <div class="assessment-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>KNOWLEDGE ASSESSMENT</span>
            </div>
            <div class="assessment-meta-group">
              <span class="assessment-meta">Breadth First Search (BFS) Quiz (${totalQ} Questions)</span>
              <span class="assessment-completed-pill">Completed</span>
            </div>
          </div>

          <h1 class="assessment-title">Breadth First Search (BFS) Knowledge Check</h1>
          <p class="assessment-desc">
            Test your understanding of level-by-level traversal, FIFO queue mechanics, visited sets, shortest unweighted paths, and time/space complexity.
          </p>

          <div class="assessment-progress-bar-row">
            <div class="assessment-progress-left">
              <svg class="sparkle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              <span class="progress-label">Progress: <strong>${totalQ} / ${totalQ} Answered</strong></span>
            </div>
            <div class="assessment-progress-right">
              <span class="progress-correct-text"><strong>${correctCount}</strong> / ${totalQ} Correct</span>
            </div>
          </div>

          <div class="q-nav-row" role="navigation" aria-label="Question Review Navigation">
            ${this.questions.map((quest, idx) => {
              const ans = this.userAnswers[quest.id];
              const isCorrect = Boolean(ans && ans.isCorrect);
              return `
                <button type="button" class="q-nav-btn ${isCorrect ? 'is-pass' : 'is-fail'}" 
                        onclick="document.getElementById('review-q-${quest.id}')?.scrollIntoView({behavior: 'smooth', block: 'center'})"
                        title="Jump to Question ${idx + 1} (${isCorrect ? 'Correct' : 'Missed'})">
                  <span class="q-nav-num">Q${idx + 1}</span>
                  <span class="q-nav-mark">${isCorrect ? '✓' : '✕'}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- MAIN COMPLETION HERO CARD -->
        <div class="quiz-result-hero-card" id="quiz-result-hero-card">
          
          <!-- Centered Green Trophy Icon Squircle -->
          <div class="result-trophy-badge" aria-label="Trophy Badge">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>

          <!-- Grade Tag Pill -->
          <div class="result-grade-pill">${gradeText}</div>

          <!-- Headline -->
          <h1 class="result-completed-title">QUIZ ASSESSMENT COMPLETED</h1>

          <!-- Subtitle -->
          <p class="result-completed-subtitle">${subtitleText}</p>

          <!-- Highlighted Score Box -->
          <div class="result-score-card">
            <div class="result-score-label">FINAL HIGHLIGHTED SCORE</div>
            <div class="result-score-value">${percentage}%</div>
            <div class="result-score-fraction-pill">${correctCount} &nbsp;/&nbsp; ${totalQ} Questions Correct</div>
          </div>

          <!-- 3 Stat Cards Row: CORRECT, INCORRECT, ACCURACY -->
          <div class="result-stats-row">
            <div class="result-stat-card">
              <div class="stat-card-label">CORRECT</div>
              <div class="stat-card-val val-green">✓ ${correctCount}</div>
            </div>
            <div class="result-stat-card">
              <div class="stat-card-label">INCORRECT</div>
              <div class="stat-card-val val-red">${incorrectCount}</div>
            </div>
            <div class="result-stat-card">
              <div class="stat-card-label">ACCURACY</div>
              <div class="stat-card-val val-accuracy">${percentage}%</div>
            </div>
          </div>

          <!-- Actions: Retake Quiz and Back to Home -->
          <div class="result-actions-row">
            <button type="button" class="btn-result-retake" onclick="quizEngine.reset()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              Retake Quiz
            </button>
            <button type="button" class="btn-result-home" onclick="if(window.app && app.switchTab){ app.switchTab('overview'); } else { window.location.reload(); }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Back to Home
            </button>
          </div>

        </div>

        <!-- FULL QUESTION-BY-QUESTION REVIEW HEADER (EXACT IMAGE 1 FORMAT) -->
        <div class="review-section-header" id="quiz-full-review-header">
          <div class="review-header-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>Full Question-by-Question Review</span>
          </div>
          <div class="review-header-count">
            ${correctCount} of ${totalQ} Correct
          </div>
        </div>

        <!-- FULL QUESTION-BY-QUESTION REVIEW CARDS LIST -->
        <div class="review-cards-list" id="quiz-review-cards-list">
          ${this.questions.map((quest, idx) => {
            const ans = this.userAnswers[quest.id];
            const isCorrect = Boolean(ans && ans.isCorrect);
            const userOpt = ans ? quest.options.find(o => o.id === ans.optionId) : null;
            const userOptText = userOpt ? `${userOpt.id}: ${userOpt.text}` : 'No answer submitted';
            const correctOpt = quest.options.find(o => o.correct);
            const correctOptText = correctOpt ? `${correctOpt.id}: ${correctOpt.text}` : '';
            const qNumFormatted = String(idx + 1).padStart(2, '0');
            const codeTag = `CORE-${qNumFormatted}`;

            return `
              <div class="review-question-card ${isCorrect ? 'rev-card-correct' : 'rev-card-incorrect'}" id="review-q-${quest.id}">
                <div class="rev-card-top">
                  <div class="rev-card-left">
                    <span class="rev-pill-qnum">Question ${qNumFormatted}</span>
                    <span class="rev-pill-code">${codeTag}</span>
                  </div>
                  <div>
                    ${isCorrect ? `
                      <span class="rev-status-pill pill-correct">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2"><polyline points="20 6 9 17 4 12"/></svg>
                        Correct
                      </span>
                    ` : `
                      <span class="rev-status-pill pill-incorrect">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Missed Answer
                      </span>
                    `}
                  </div>
                </div>

                <h3 class="rev-question-title">${quest.question}</h3>

                <div class="rev-submissions-grid">
                  <div class="rev-submission-box ${isCorrect ? 'sub-box-correct' : 'sub-box-incorrect'}">
                    <div class="sub-box-label ${isCorrect ? 'label-correct' : 'label-incorrect'}">YOUR SUBMISSION:</div>
                    <div class="sub-box-text">${userOptText}</div>
                  </div>
                  <div class="rev-submission-box sub-box-neutral">
                    <div class="sub-box-label label-neutral">CORRECT ANSWER:</div>
                    <div class="sub-box-text">${correctOptText}</div>
                  </div>
                </div>

                <div class="rev-explanation-box">
                  <div class="rev-expl-header">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Technical Explanation:</span>
                  </div>
                  <div class="rev-expl-text">${quest.explanation}</div>
                  <div class="rev-expl-links">
                    <button type="button" class="rev-expl-link" onclick="if(window.app && app.switchTab){ app.switchTab('tutorial'); }">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                      Review in Theory Guide →
                    </button>
                    <button type="button" class="rev-expl-link" onclick="if(window.app && app.switchTab){ app.switchTab('visualizer'); }">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                      Practice in Visualizer →
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
