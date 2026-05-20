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
let timeLeft = 5 * 60; // 5 minutes in seconds (30s per question)
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
    const isSelected = selectedAnswers[index] === i;
    div.className = `mcq-option ${isSelected ? 'selected' : ''}`;
    div.innerHTML = `
      <div class="d-flex align-items-center gap-3 w-100">
        <input class="form-check-input mt-0" type="radio" name="question${index}" id="q${index}_opt${i}" ${isSelected ? 'checked' : ''} style="cursor: pointer;">
        <div class="mcq-label">${String.fromCharCode(65 + i)}</div>
        <label class="form-check-label w-100" for="q${index}_opt${i}" style="cursor: pointer; margin-bottom: 0;">${opt}</label>
      </div>
    `;
    div.addEventListener('click', (e) => {
      // Prevent double triggering if clicked directly on radio
      if(e.target.tagName !== 'INPUT') {
        const radio = div.querySelector('input[type="radio"]');
        if(radio) radio.checked = true;
      }
      selectOption(index, i);
    });
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
  const totalTime = 5 * 60;

  if (ring) ring.style.strokeDasharray = circumference;

  timerInterval = setInterval(() => {
    timeLeft--;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    if (display) display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    if (ring) {
      const progress = timeLeft / totalTime;
      ring.style.strokeDashoffset = circumference * (1 - progress);
      if (timeLeft < 60) ring.style.stroke = '#f5576c';
      else if (timeLeft < 120) ring.style.stroke = '#f6d365';
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

  // Populate detailed results
  const detailedResultsContainer = document.getElementById('detailedResultsContainer');
  const viewDetailsBtn = document.getElementById('viewDetailsBtn');
  const detailedResults = document.getElementById('detailedResults');

  if (detailedResultsContainer && viewDetailsBtn && detailedResults) {
    detailedResultsContainer.innerHTML = '';
    questions.forEach((q, index) => {
      const userAns = selectedAnswers[index];
      const isCorrect = userAns === q.ans;
      const isUnanswered = userAns === -1;
      
      const cardClass = isCorrect ? 'border-success bg-success bg-opacity-10' : (isUnanswered ? 'border-warning bg-warning bg-opacity-10' : 'border-danger bg-danger bg-opacity-10');
      const icon = isCorrect 
        ? '<i class="bi bi-check-circle-fill text-success fs-4"></i>' 
        : (isUnanswered ? '<i class="bi bi-exclamation-circle-fill text-warning fs-4"></i>' : '<i class="bi bi-x-circle-fill text-danger fs-4"></i>');

      const optionsHtml = q.opts.map((opt, i) => {
        let optStyle = "color: var(--text-light);";
        if (i === q.ans) {
          optStyle = "color: #43e97b; font-weight: bold;"; // Correct answer style
        } else if (i === userAns) {
          optStyle = "color: #f5576c; text-decoration: line-through;"; // Wrong answer style
        } else {
          optStyle = "color: var(--text-muted); opacity: 0.7;";
        }
        
        return `<div class="mb-2 p-2 rounded" style="${optStyle} background: rgba(255,255,255,0.05);">
          <strong>${String.fromCharCode(65 + i)}.</strong> ${opt}
          ${i === q.ans ? ' <i class="bi bi-check-lg ms-2"></i>' : ''}
          ${i === userAns && userAns !== q.ans ? ' <i class="bi bi-x-lg ms-2"></i> <em>(Your Answer)</em>' : ''}
          ${i === userAns && userAns === q.ans ? ' <em>(Your Answer)</em>' : ''}
        </div>`;
      }).join('');

      detailedResultsContainer.innerHTML += `
        <div class="card border-glass p-4 rounded-md position-relative" style="background: var(--card-bg);">
          <div class="d-flex align-items-start gap-3">
            <div class="mt-1">${icon}</div>
            <div class="w-100">
              <h6 class="fw-bold mb-3 lh-base">Q${index + 1}. ${q.q}</h6>
              <div class="options-list fs-sm">
                ${optionsHtml}
              </div>
              ${isUnanswered ? '<div class="mt-2 text-warning fs-sm fst-italic"><i class="bi bi-info-circle me-1"></i> You did not answer this question.</div>' : ''}
            </div>
          </div>
        </div>
      `;
    });

    viewDetailsBtn.addEventListener('click', () => {
      if (detailedResults.style.display === 'none') {
        detailedResults.style.display = 'block';
        viewDetailsBtn.textContent = 'Hide Details';
        detailedResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        detailedResults.style.display = 'none';
        viewDetailsBtn.textContent = 'View Details';
      }
    });
  }
};


// ---- CAMERA PROCTORING ----
const initCamera = () => {
  const video = document.getElementById('proctorCamera');
  const overlay = document.getElementById('cameraOverlay');
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && video) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        video.srcObject = stream;
        if(overlay) overlay.style.display = 'none';
      })
      .catch((err) => {
        console.error('Camera access denied:', err);
        if(overlay) overlay.innerHTML = '<i class="bi bi-exclamation-triangle text-warning me-2"></i>Camera access required';
      });
  }
};

// ---- VOICE ASSISTANT ----
const initVoiceAssist = () => {
  const btn = document.getElementById('voiceAssistBtn');
  if (!btn || !('speechSynthesis' in window)) {
    if(btn) btn.style.display = 'none';
    return;
  }

  btn.addEventListener('click', () => {
    // Stop any currently playing speech
    window.speechSynthesis.cancel();
    
    const q = questions[currentQ];
    let textToRead = "Question " + (currentQ + 1) + ". " + q.q + ". The options are: ";
    q.opts.forEach((opt, i) => {
      textToRead += "Option " + String.fromCharCode(65 + i) + ", " + opt + ". ";
    });

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.9;
    
    // Add pulsing animation to button while speaking
    btn.classList.add('pulse-recording');
    utterance.onend = () => btn.classList.remove('pulse-recording');
    utterance.onerror = () => btn.classList.remove('pulse-recording');
    
    window.speechSynthesis.speak(utterance);
  });
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
  initCamera();
  initVoiceAssist();

  document.getElementById('prevBtn')?.addEventListener('click', () => {
    if (currentQ > 0) {
      window.speechSynthesis?.cancel();
      document.getElementById('voiceAssistBtn')?.classList.remove('pulse-recording');
      currentQ--; renderQuestion(currentQ); 
    }
  });

  document.getElementById('nextBtn')?.addEventListener('click', () => {
    if (currentQ < questions.length - 1) {
      window.speechSynthesis?.cancel();
      document.getElementById('voiceAssistBtn')?.classList.remove('pulse-recording');
      currentQ++; renderQuestion(currentQ); 
    }
  });

  document.getElementById('confirmSubmit')?.addEventListener('click', () => {
    const modalEl = document.getElementById('submitModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstance.hide();
    
    // Safety check to remove backdrop if it gets stuck
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    showResult();
  });
});
