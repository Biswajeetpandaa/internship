/* =========================================
   MAIN JS - InternHub
   ========================================= */

// ---- UI SOUND SYNTHESIS USING WEBAUDIO API (PREMIUM TECH CUE) ----
let audioCtx = null;

const playUISound = (type = 'click') => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

      gainNode.gain.setValueAtTime(0.03, now); 
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5

      gainNode.gain.setValueAtTime(0.04, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (error) {
    console.warn("AudioContext error: ", error);
  }
};
window.playUISound = playUISound;

// Global click event for high-tech premium sound feedback
document.addEventListener('click', (e) => {
  const interactive = e.target.closest('.btn, .btn-primary-grad, .btn-outline-light-grad, .btn-accent-grad, .btn-success-grad, .nav-link, .sidebar-link, #theme-toggle-btn, .quick-btn, .mcq-option, .category-card');
  if (interactive) {
    if (interactive.id === 'confirmSubmit' || interactive.classList.contains('btn-success-grad')) {
      playUISound('success');
    } else {
      playUISound('click');
    }
  }
});

// ---- PAGE LOADER ----
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 500);
    }, 600);
  }
});

// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ---- SCROLL ANIMATIONS ----
const animateOnScroll = () => {
  const elements = document.querySelectorAll('[data-anim]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, delay * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
};

// ---- ANIMATED COUNTERS ----
const animateCounters = () => {
  const counters = document.querySelectorAll('.counter-value');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
};

// ---- RIPPLE EFFECT ----
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.ripple-btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  ripple.classList.add('ripple-effect');
  const size = Math.max(btn.offsetWidth, btn.offsetHeight);
  const rect = btn.getBoundingClientRect();
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// ---- CHATBOT ----
const initChatbot = () => {
  const fab = document.getElementById('chatbotFab');
  const window_ = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');

  if (!fab || !window_) return;

  const botReplies = {
    'how to apply': 'To apply for an internship: 1) Browse listings, 2) Click Apply, 3) Complete your profile, 4) Submit application. Good luck! 🎯',
    'payment': 'Our registration fee is ₹499. We offer scholarships based on test scores! Check the Payment page for details.',
    'certificate': 'Yes! You receive a verified digital certificate upon successful completion of your internship. 🏆',
    'duration': 'Internships range from 1 month to 6 months. Check each listing for specific duration details.',
    'contact': 'Email us at support@internhub.in or call +91 98765 43210. We reply within 24 hours!',
    'test': 'The online aptitude test is free. Students scoring above 70% may qualify for free internship opportunities!',
    'default': "Thanks for your question! 😊 I'll connect you with our support team. Meanwhile, check our FAQ section for quick answers."
  };

  const addMessage = (text, isUser = false, delay = 0) => {
    setTimeout(() => {
      const msg = document.createElement('div');
      msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }, delay);
  };

  const showTyping = (callback) => {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot typing-dots';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => {
      typing.remove();
      callback();
    }, 1200);
  };

  const getBotReply = (text) => {
    const lower = text.toLowerCase();
    for (const key in botReplies) {
      if (lower.includes(key)) return botReplies[key];
    }
    return botReplies.default;
  };

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, true);
    input.value = '';
    showTyping(() => addMessage(getBotReply(text), false));
  };

  fab.addEventListener('click', () => {
    window_.classList.toggle('open');
    fab.innerHTML = window_.classList.contains('open') ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-chat-dots-fill"></i>';
  });

  if (closeBtn) closeBtn.addEventListener('click', () => {
    window_.classList.remove('open');
    fab.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';
  });

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

  // Quick buttons
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.textContent;
      addMessage(q, true);
      showTyping(() => addMessage(getBotReply(q), false));
    });
  });
};

// ---- SMOOTH SCROLL FOR ANCHORS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- ACTIVE NAV LINK ----
const setActiveNavLink = () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
};

// ---- INTERNSHIP SEARCH FILTER ----
const initSearch = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
};

// ---- DYNAMIC LOGGED-IN NAVBAR PROFILE ----
const handleLoggedInNavbar = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return;

  const authNavs = document.querySelectorAll('.navbar .d-flex.gap-3, .navbar .d-flex.align-items-center');
  authNavs.forEach(authNav => {
    authNav.innerHTML = `
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center gap-2 text-decoration-none text-light" data-bs-toggle="dropdown">
          <img src="${currentUser.photo || 'https://i.pravatar.cc/150?u=student'}" alt="User Avatar" class="rounded-circle" width="35" height="35" style="border: 2px solid var(--primary)">
          <span class="fw-bold fs-sm d-none d-md-inline text-light">${currentUser.fullName.split(' ')[0]}</span>
          <i class="bi bi-chevron-down fs-xs text-light opacity-75"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow" style="background:var(--dark2);border:1px solid var(--card-border)">
          <li><a class="dropdown-item fw-600 text-grad py-2" href="student_dashbord.html"><i class="bi bi-grid-1x2-fill me-2 text-primary"></i>Dashboard</a></li>
          <li><a class="dropdown-item py-2" href="student_dashbord.html"><i class="bi bi-person-fill me-2"></i>My Profile</a></li>
          <li><a class="dropdown-item py-2" href="online_test.html"><i class="bi bi-card-checklist me-2"></i>Aptitude Test</a></li>
          <li><hr class="dropdown-divider border-glass"></li>
          <li><button class="dropdown-item text-danger py-2" onclick="logoutSession()"><i class="bi bi-box-arrow-left me-2"></i>Sign Out</button></li>
        </ul>
      </div>
    `;
  });
};

window.logoutSession = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAdminLoggedIn');
  window.location.href = "index.html";
};

// ---- INTERNSHIP APPLICATION SUBMIT INTERCEPTOR ----
const initApplyInterceptor = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // 1. Detail Page
  const detailApplyBtn = document.querySelector('.apply-card a[href="register.html"]');
  const detailHeaderTitle = document.querySelector('.detail-header h1.section-title');
  if (detailApplyBtn && detailHeaderTitle) {
    if (currentUser) {
      const jobTitle = detailHeaderTitle.textContent.trim();
      const hasApplied = currentUser.appliedJobs && currentUser.appliedJobs.includes(jobTitle);

      if (hasApplied) {
        detailApplyBtn.className = "btn btn-secondary w-100 py-3 fw-bold mb-3 disabled";
        detailApplyBtn.innerHTML = '<i class="bi bi-check2-circle-fill me-2"></i>Applied ✔';
        detailApplyBtn.removeAttribute('href');
      } else {
        detailApplyBtn.className = "btn btn-success-grad w-100 py-3 fw-bold mb-3 ripple-btn text-white";
        detailApplyBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Apply Now';
        detailApplyBtn.removeAttribute('href');
        detailApplyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          submitApplication(jobTitle, detailApplyBtn);
        });
      }
    }
  }

  // 2. Grid Cards
  const cards = document.querySelectorAll('.internship-card');
  cards.forEach(card => {
    const jobTitle = card.querySelector('h5').textContent.trim();
    const applyBtn = card.querySelector('a[href="internship_details.html"]');

    if (applyBtn && currentUser) {
      const hasApplied = currentUser.appliedJobs && currentUser.appliedJobs.includes(jobTitle);

      if (hasApplied) {
        applyBtn.className = "btn btn-secondary btn-sm px-3 disabled";
        applyBtn.innerHTML = "Applied";
        applyBtn.removeAttribute('href');
      } else {
        applyBtn.textContent = "Apply Now";
        applyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          submitApplication(jobTitle, applyBtn);
        });
      }
    }
  });
};

const submitApplication = (jobTitle, buttonEl) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  if (currentUser.paymentStatus !== "Paid") {
    alert("⚠️ Please pay the registration fee first to unlock internship applications!");
    window.location.href = "payment.html";
    return;
  }

  if (!currentUser.appliedJobs) currentUser.appliedJobs = [];
  
  if (currentUser.appliedJobs.includes(jobTitle)) return;

  currentUser.appliedJobs.push(jobTitle);
  currentUser.appliedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Save user session
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  // Save to student database
  let allStudents = JSON.parse(localStorage.getItem('allStudents') || '[]');
  const idx = allStudents.findIndex(s => s.id === currentUser.id);
  if (idx !== -1) {
    allStudents[idx] = currentUser;
    localStorage.setItem('allStudents', JSON.stringify(allStudents));
  }

  // Update button UI
  if (buttonEl.classList.contains('py-3')) {
    buttonEl.className = "btn btn-secondary w-100 py-3 fw-bold mb-3 disabled";
    buttonEl.innerHTML = '<i class="bi bi-check2-circle-fill me-2"></i>Applied ✔';
  } else {
    buttonEl.className = "btn btn-secondary btn-sm px-3 disabled";
    buttonEl.innerHTML = "Applied";
  }

  alert(`🎉 Application submitted successfully for "${jobTitle}"! You can track its status in real-time on your Student Dashboard.`);
};

// ---- HERO TYPEWRITER EFFECT ----
const initTypewriter = () => {
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;
  const words = ["Dream Internships", "Web Development Opportunities", "UI/UX Design Projects", "Digital Marketing Roles", "Exciting Career Openings"];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  
  const type = () => {
    const currentWord = words[wordIdx];
    if (isDeleting) {
      textEl.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      textEl.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }
    
    let typeSpeed = isDeleting ? 30 : 65;
    
    if (!isDeleting && charIdx === currentWord.length) {
      typeSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typeSpeed = 400; // Pause before typing next word
    }
    
    setTimeout(type, typeSpeed);
  };
  
  setTimeout(type, 1000);
};

// ---- REAL-TIME SEARCH & FILTER ----
const initHomeFilter = () => {
  const searchInput = document.getElementById('search-input');
  const locationSelect = document.getElementById('location-select');
  const categorySelect = document.getElementById('category-select');
  const searchForm = document.getElementById('search-filter-form');
  const filterItems = document.querySelectorAll('.filter-item');
  const noResults = document.getElementById('no-results-msg');
  const searchStatus = document.getElementById('search-status');

  const expandSearchTerms = (text) => {
    const aliases = {
      'web development': ['frontend', 'front end', 'html', 'javascript', 'css'],
      'front end': ['frontend', 'web development', 'html', 'javascript', 'css'],
      'ui ux': ['ui', 'ux', 'design'],
      'ui/ux': ['ui', 'ux', 'design'],
      'digital marketing': ['seo', 'social media', 'branding', 'content'],
      'social work': ['ngo', 'volunteer', 'community service'],
      'hr': ['human resources', 'recruitment', 'people'],
      'human resources': ['hr', 'recruitment', 'people']
    };

    const normalized = text.toLowerCase().trim();
    const groups = [];

    if (normalized) {
      groups.push(normalized.split(/\s+/).filter(Boolean));
    }

    Object.keys(aliases).forEach(key => {
      if (normalized.includes(key)) {
        groups.push(key.split(/\s+/).filter(Boolean));
        aliases[key].forEach(alias => {
          groups.push(alias.toLowerCase().split(/\s+/).filter(Boolean));
        });
      }
    });

    return groups;
  };

  if (!searchInput && !locationSelect && !categorySelect) return;

  const performFilter = (e) => {
    if (e) e.preventDefault();
    const query = (searchInput?.value || '').toLowerCase().trim();
    const queryGroups = expandSearchTerms(query);
    const loc = (locationSelect?.value || '').toLowerCase();
    const cat = (categorySelect?.value || '').toLowerCase();
    let visibleCount = 0;

    filterItems.forEach(item => {
      const itemCat = (item.dataset.category || '').toLowerCase();
      const itemLoc = (item.dataset.location || '').toLowerCase();
      const itemKeywords = (item.dataset.keywords || '').toLowerCase();
      const itemText = (item.textContent || '').toLowerCase();
      const searchableText = `${itemKeywords} ${itemText}`;

      const matchesQuery = queryGroups.length === 0 || queryGroups.some(group => group.every(token => searchableText.includes(token)));
      const matchesLoc = !loc || itemLoc === loc;
      const matchesCat = !cat || itemCat === cat;

      if (item._hideTimer) {
        clearTimeout(item._hideTimer);
        item._hideTimer = null;
      }

      if (matchesQuery && matchesLoc && matchesCat) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 30);
        visibleCount++;
      } else {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        item._hideTimer = setTimeout(() => {
          item.style.display = 'none';
          item._hideTimer = null;
        }, 300);
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (searchStatus) {
      if (!query && !loc && !cat) {
        searchStatus.textContent = 'Browse featured internships below or use the filters to narrow results.';
      } else if (visibleCount > 0) {
        searchStatus.textContent = `Showing ${visibleCount} matching internship${visibleCount === 1 ? '' : 's'}.`;
      } else {
        searchStatus.textContent = 'No internships found. Try a different keyword or filter.';
      }
    }

    if (e && searchForm) {
      const target = document.getElementById('internships');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (searchForm) searchForm.addEventListener('submit', performFilter);
  if (searchInput) searchInput.addEventListener('input', performFilter);
  if (locationSelect) locationSelect.addEventListener('change', performFilter);
  if (categorySelect) categorySelect.addEventListener('change', performFilter);

  // Expose resetFilters globally
  window.resetFilters = () => {
    if (searchInput) searchInput.value = '';
    if (locationSelect) locationSelect.value = '';
    if (categorySelect) categorySelect.value = '';
    performFilter();
    const target = document.getElementById('internships');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Expose triggerCategoryFilter globally for category cards
  window.triggerCategoryFilter = (categoryValue) => {
    if (categorySelect) {
      categorySelect.value = categoryValue;
      performFilter();
      const target = document.getElementById('internships');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
};

// ---- SCROLL PROGRESS BAR DYNAMIC CREATION & LISTENERS ----
const initScrollProgress = () => {
  if (document.querySelector('.scroll-progress-container')) return;
  const container = document.createElement('div');
  container.className = 'scroll-progress-container';
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  container.appendChild(bar);
  document.body.appendChild(container);

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    bar.style.width = scrolled + '%';
  });
};

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  animateOnScroll();
  animateCounters();
  initChatbot();
  setActiveNavLink();
  initSearch();
  handleLoggedInNavbar();
  initApplyInterceptor();
  initTypewriter();
  initHomeFilter();

  // Bootstrap tooltips
  const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggers.forEach(el => new bootstrap.Tooltip(el));

  // Progress bars animate
  document.querySelectorAll('.progress').forEach(p => p.classList.add('progress-animated'));
});
