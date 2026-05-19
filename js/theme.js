/* =============================================
   InternHub — Global Dark / Light Mode Toggle
   ============================================= */
(function () {
  /* ---- Apply saved preference immediately (no flash) ---- */
  const isLightPref = localStorage.getItem('internhub-theme') === 'light';
  if (isLightPref) {
    document.body.classList.add('light-mode');
  }

  window.addEventListener('DOMContentLoaded', () => {
    /* ---- Inject the toggle button ---- */
    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle light / dark mode');
    btn.innerHTML = `<span id="theme-toggle-icon">${isLightPref ? '☀️' : '🌙'}</span><span id="theme-toggle-label" class="d-none d-md-inline ms-1">${isLightPref ? 'Dark Mode' : 'Light Mode'}</span>`;
    
    // Find the right-side nav container (where the profile is rendered)
    const authNav = document.querySelector('.navbar-collapse > .d-flex');
    if (authNav) {
      authNav.appendChild(btn);
    } else {
      document.body.prepend(btn);
    }

    const icon  = document.getElementById('theme-toggle-icon');
    const label = document.getElementById('theme-toggle-label');

    /* ---- Toggle handler ---- */
    btn.addEventListener('click', function () {
      const isLight = document.body.classList.toggle('light-mode');
      if (isLight) {
        icon.textContent  = '☀️';
        label.textContent = 'Dark Mode';
        localStorage.setItem('internhub-theme', 'light');
      } else {
        icon.textContent  = '🌙';
        label.textContent = 'Light Mode';
        localStorage.setItem('internhub-theme', 'dark');
      }
    });
  });

  /* ---- Local Storage DB Initialization ---- */
  const defaultStudents = [
    {
      id: "student_1",
      fullName: "Alex Johnson",
      email: "alex@example.com",
      phone: "+91 98765 43210",
      dob: "2003-08-15",
      gender: "Male",
      college: "IIT Bombay",
      degree: "B.Tech Computer Science",
      year: "3rd Year",
      cgpa: "8.8",
      skills: ["Python", "JavaScript", "React.js", "Communication"],
      resumeName: "alex_johnson_resume.pdf",
      photo: "https://i.pravatar.cc/150?u=alex",
      paymentStatus: "Paid",
      score: 80,
      status: "Shortlisted",
      appliedJobs: ["Frontend Developer Intern"],
      appliedAt: "May 15, 2026"
    },
    {
      id: "student_2",
      fullName: "Sarah Jenkins",
      email: "sarah@jenkins.com",
      phone: "+91 99887 76655",
      dob: "2004-03-22",
      gender: "Female",
      college: "BITS Pilani",
      degree: "B.E. Information Systems",
      year: "3rd Year",
      cgpa: "9.1",
      skills: ["React.js", "CSS3", "Bootstrap", "UI/UX Design"],
      resumeName: "sarah_jenkins_cv.pdf",
      photo: "https://i.pravatar.cc/150?img=32",
      paymentStatus: "Paid",
      score: 95,
      status: "Shortlisted",
      appliedJobs: ["Frontend Developer Intern"],
      appliedAt: "May 14, 2026"
    },
    {
      id: "student_3",
      fullName: "Rahul Sharma",
      email: "rahul@sharma.com",
      phone: "+91 91234 56789",
      dob: "2002-12-05",
      gender: "Male",
      college: "Delhi Technological University",
      degree: "B.Tech IT",
      year: "4th Year",
      cgpa: "7.9",
      skills: ["SEO", "Social Media", "Analytics", "MS Excel"],
      resumeName: "rahul_sharma_resume.pdf",
      photo: "https://i.pravatar.cc/150?img=11",
      paymentStatus: "Paid",
      score: 65,
      status: "Applied",
      appliedJobs: ["Digital Marketing Intern"],
      appliedAt: "May 12, 2026"
    }
  ];

  if (!localStorage.getItem('internhub_db_initialized')) {
    localStorage.setItem('allStudents', JSON.stringify(defaultStudents));
    // Default current user to student_1 (Alex Johnson) so the dashboard works instantly out-of-the-box
    localStorage.setItem('currentUser', JSON.stringify(defaultStudents[0]));
    localStorage.setItem('internhub_db_initialized', 'true');
  }
})();
