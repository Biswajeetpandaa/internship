/* =========================================
   ONLINE TEST JS - InternHub
   ========================================= */

const questions = [
  {
    q: "What does HTML stand for?",
    opts: ["Hyper Text Markup Language", "High Tech Machine Learning", "Hyperlink Text Mode Language", "Home Tool Markup Language"],
    ans: 0
  },
  {
    q: "Which data structure follows LIFO order?",
    opts: ["Queue", "Stack", "Linked List", "Tree"],
    ans: 1
  },
  {
    q: "What is the time complexity of binary search?",
    opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    ans: 2
  },
  {
    q: "Which of these is NOT a programming language?",
    opts: ["Python", "Java", "HTML", "C++"],
    ans: 2
  },
  {
    q: "What does SQL stand for?",
    opts: ["Structured Query Language", "Strong Query Language", "Simple Queue Logic", "Standard Query List"],
    ans: 0
  },
  {
    q: "Which company developed the Java programming language?",
    opts: ["Microsoft", "Google", "Sun Microsystems", "Apple"],
    ans: 2
  },
  {
    q: "What is the output of 2 + '2' in JavaScript?",
    opts: ["4", "22", "NaN", "Error"],
    ans: 1
  },
  {
    q: "Which of the following is a NoSQL database?",
    opts: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    ans: 2
  },
  {
    q: "What does API stand for?",
    opts: ["Application Programming Interface", "Automated Program Integration", "Application Process Interaction", "Advanced Programming Instruction"],
    ans: 0
  },
  {
    q: "In project management, what does 'Agile' refer to?",
    opts: ["A programming language", "A database system", "An iterative development methodology", "A testing framework"],
    ans: 2
  }
];

let currentQ = 0;
let selectedAnswers = new Array(questions.length).fill(-1);
let timeLeft = 30 * 60; // 30 minutes in seconds
let timerInterval = null;
const circumference = 2 * Math.PI * 45; // r=45

// ---- RENDER QUESTION ----
const renderQuestion = (index) => {
  const q = questions[index];
  const qText = document.getElementById('questionText');
  const qNum = document.getElementById('questionNum');
  const optsContainer = document.getElementById('optionsContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  if (!qText) return;

  qText.textContent = q.q;
  qNum.textContent = `Question ${index + 1} of ${questions.length}`;

  optsContainer.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = `mcq-option ${selectedAnswers[index] === i ? 'selected' : ''}`;
    div.innerHTML = `<div class="mcq-label">${String.fromCharCode(65 + i)}</div><span>${opt}</span>`;
    div.addEventListener('click', () => selectOption(index, i));
    optsContainer.appendChild(div);
  });

  // Update progress bar
  const pct = ((index + 1) / questions.length) * 100;
  const progressBar = document.getElementById('questionProgress');
  if (progressBar) { progressBar.style.width = pct + '%'; }

  // Palette
  updatePalette();

  // Buttons
  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.style.display = index < questions.length - 1 ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = index === questions.length - 1 ? 'inline-flex' : 'none';
};

const selectOption = (qIndex, optIndex) => {
  selectedAnswers[qIndex] = optIndex;
  renderQuestion(qIndex);
};

const updatePalette = () => {
  document.querySelectorAll('.palette-btn').forEach((btn, i) => {
    btn.classList.remove('answered', 'current');
    if (i === currentQ) btn.classList.add('current');
    else if (selectedAnswers[i] !== -1) btn.classList.add('answered');
  });
};

// ---- TIMER ----
const startTimer = () => {
  const display = document.getElementById('timerDisplay');
  const ring = document.getElementById('timerRing');
  const totalTime = 30 * 60;

  if (ring) ring.style.strokeDasharray = circumference;

  timerInterval = setInterval(() => {
    timeLeft--;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    if (display) display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    if (ring) {
      const progress = timeLeft / totalTime;
      ring.style.strokeDashoffset = circumference * (1 - progress);
      if (timeLeft < 300) ring.style.stroke = '#f5576c';
      else if (timeLeft < 600) ring.style.stroke = '#f6d365';
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
};

// ---- SHOW RESULT ----
const showResult = () => {
  clearInterval(timerInterval);
  const testArea = document.getElementById('testArea');
  const resultArea = document.getElementById('resultArea');

  if (!testArea || !resultArea) return;

  let correct = 0;
  selectedAnswers.forEach((ans, i) => {
    if (ans === questions[i].ans) correct++;
  });

  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= 70;

  // Save score and status in simulated database
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    currentUser.score = score;
    if (passed) {
      currentUser.status = 'Shortlisted';
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update in allStudents list
    let allStudents = JSON.parse(localStorage.getItem('allStudents') || '[]');
    const idx = allStudents.findIndex(s => s.id === currentUser.id);
    if (idx !== -1) {
      allStudents[idx] = currentUser;
      localStorage.setItem('allStudents', JSON.stringify(allStudents));
    }
  }

  testArea.style.display = 'none';
  resultArea.style.display = 'block';

  const scoreEl = document.getElementById('resultScore');
  const resultMsg = document.getElementById('resultMessage');
  const resultIcon = document.getElementById('resultIcon');

  if (scoreEl) scoreEl.textContent = score + '%';
  if (resultMsg) resultMsg.textContent = `You answered ${correct} out of ${questions.length} questions correctly.`;
  if (resultIcon) {
    resultIcon.textContent = passed ? '🎉' : '📚';
    resultIcon.classList.add('success-icon-anim');
  }

  const bonusMsg = document.getElementById('bonusMessage');
  if (bonusMsg) {
    bonusMsg.textContent = passed
      ? '🌟 Congratulations! You qualify for FREE internship opportunities!'
      : '📘 Keep practicing! Score above 70% to unlock free internship opportunities.';
    bonusMsg.className = `notice-box text-center mt-3 ${passed ? 'success' : 'warning'}`;
  }
};


// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('questionText')) return;

  // Build palette
  const palette = document.getElementById('questionPalette');
  if (palette) {
    questions.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = `palette-btn ${i === 0 ? 'current' : ''}`;
      btn.textContent = i + 1;
      btn.addEventListener('click', () => {
        currentQ = i;
        renderQuestion(i);
      });
      palette.appendChild(btn);
    });
  }

  renderQuestion(0);
  startTimer();

  document.getElementById('prevBtn')?.addEventListener('click', () => {
    if (currentQ > 0) { currentQ--; renderQuestion(currentQ); }
  });

  document.getElementById('nextBtn')?.addEventListener('click', () => {
    if (currentQ < questions.length - 1) { currentQ++; renderQuestion(currentQ); }
  });

  document.getElementById('submitBtn')?.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('submitModal'));
    modal.show();
  });

  document.getElementById('confirmSubmit')?.addEventListener('click', () => {
    bootstrap.Modal.getInstance(document.getElementById('submitModal')).hide();
    showResult();
  });
});
