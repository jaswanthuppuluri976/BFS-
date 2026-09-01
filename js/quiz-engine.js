/**
 * BFS Adventure - Interactive Quiz Engine
 * Powers the Mastery Quiz section with instant feedback and confidence tracking
 */

class QuizEngine {
  constructor() {
    this.questions = (typeof QUIZ_QUESTIONS !== 'undefined' ? QUIZ_QUESTIONS : (typeof window !== 'undefined' ? window.QUIZ_QUESTIONS : [])) || [];
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = {};
    this.isCompleted = false;
    this.container = null;
  }

  init(containerEl) {
    this.container = containerEl;
    if (!this.questions || this.questions.length === 0) {
      this.questions = (typeof QUIZ_QUESTIONS !== 'undefined' ? QUIZ_QUESTIONS : (typeof window !== 'undefined' ? window.QUIZ_QUESTIONS : [])) || [];
    }
    this.reset();
  }

  reset() {
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = {};
    this.isCompleted = false;
    this.render();
  }

  selectOption(questionId, optionId) {
    if (this.userAnswers[questionId] !== undefined) return; // Already answered

    const question = this.questions.find(q => q.id === questionId);
    if (!question) return;

    const chosen = question.options.find(o => o.id === optionId);
    const isCorrect = chosen && chosen.correct;

    this.userAnswers[questionId] = {
      optionId,
      isCorrect,
      explanation: question.explanation
    };

    if (isCorrect) {
      this.score += 10;
      soundManager.playSuccess();
    } else {
      soundManager.playError();
    }

    this.render();
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.render();
      soundManager.playPop();
    } else {
      this.isCompleted = true;
      this.render();
      soundManager.playSuccess();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
      soundManager.playPop();
    }
  }

  render() {
    if (!this.container) return;

    if (this.isCompleted) {
      this.renderSummary();
      return;
    }

    const q = this.questions[this.currentIndex];
    const answer = this.userAnswers[q.id];
    const totalQ = this.questions.length;
    const progressPercent = Math.round(((this.currentIndex + 1) / totalQ) * 100);

    this.container.innerHTML = `
      <div class="quiz-card-wrapper">
        <div class="quiz-header-bar">
          <div class="quiz-category-tag">${q.category}</div>
          <div class="quiz-counter">Question ${this.currentIndex + 1} of ${totalQ}</div>
        </div>

        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <h3 class="quiz-question-title">${q.question}</h3>

        <div class="quiz-options-list">
          ${q.options.map(opt => {
            let stateClass = "";
            let iconHTML = "";
            if (answer) {
              if (opt.correct) {
                stateClass = "correct-opt";
                iconHTML = `<span class="opt-icon" style="color:#10b981; display:flex; align-items:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></span>`;
              } else if (answer.optionId === opt.id) {
                stateClass = "incorrect-opt";
                iconHTML = `<span class="opt-icon" style="color:#ef4444; display:flex; align-items:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>`;
              } else {
                stateClass = "disabled-opt";
              }
            }

            return `
              <button class="quiz-option-card ${stateClass}" 
                onclick="quizEngine.selectOption(${q.id}, '${opt.id}')"
                ${answer ? 'disabled' : ''}>
                <span class="opt-badge">${opt.id}</span>
                <span class="opt-text">${opt.text}</span>
                ${iconHTML}
              </button>
            `;
          }).join('')}
        </div>

        ${answer ? `
          <div class="quiz-explanation-box ${answer.isCorrect ? 'box-correct' : 'box-incorrect'}">
            <div class="expl-title">
              ${answer.isCorrect 
                ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:#10b981;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> <span>Correct Answer!</span>' 
                : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:#ef4444;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> <span>Incorrect</span>'}
            </div>
            <div class="expl-body">${answer.explanation}</div>
          </div>
        ` : ''}

        <div class="quiz-nav-footer">
          <button class="btn btn-outline" onclick="quizEngine.prevQuestion()" ${this.currentIndex === 0 ? 'disabled' : ''}>
            ◀ Previous
          </button>
          
          <span class="quiz-score-badge">Score: ${this.score} pts</span>

          <button class="btn btn-primary" onclick="quizEngine.nextQuestion()" ${!answer ? 'disabled' : ''}>
            ${this.currentIndex === totalQ - 1 ? 'Finish Quiz ➔' : 'Next Question ➔'}
          </button>
        </div>
      </div>
    `;
  }

  renderSummary() {
    const totalQ = this.questions.length;
    const maxScore = totalQ * 10;
    const percentage = Math.round((this.score / maxScore) * 100);

    let rank = "BFS Novice";
    let message = "Good initial attempt! Review the Theory section and try again to build your confidence.";
    if (percentage >= 80) {
      rank = "BFS Traversal Master";
      message = "Outstanding! You have mastered BFS graph traversal, queues, and complexity analysis!";
    } else if (percentage >= 50) {
      rank = "BFS Explorer";
      message = "Great effort! You understand the key foundations of BFS. Review debugging & queue cycles for 100%!";
    }

    this.container.innerHTML = `
      <div class="quiz-summary-card">
        <div class="summary-badge-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
        </div>
        <h2 class="summary-title">Quiz Completed!</h2>
        <div class="summary-rank-tag">${rank}</div>

        <div class="summary-score-wheel">
          <span class="score-num">${this.score}</span>
          <span class="score-denom" style="font-size: 1.1rem; color: var(--text-muted, #64748b);"> / ${maxScore} pts (${percentage}%)</span>
        </div>

        <p class="summary-message">${message}</p>

        <div class="summary-actions">
          <button class="btn btn-outline" onclick="quizEngine.reset()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Retake Quiz
          </button>
          <button class="btn btn-primary" onclick="app.switchTab('game')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
            Play BFS Challenges
          </button>
          <button class="btn btn-outline" onclick="app.switchTab('theory')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Read Queue Theory
          </button>
        </div>
      </div>
    `;
  }
}

const quizEngine = new QuizEngine();
if (typeof window !== 'undefined') {
  window.quizEngine = quizEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuizEngine, quizEngine };
}

