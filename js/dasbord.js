/* =========================================
   DASHBOARD JS - InternHub
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // --- SIDEBAR TOGGLE ---
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.dashboard-main');
    const toggleBtn = document.querySelector('.topbar-toggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    const toggleSidebar = () => {
        if (window.innerWidth < 992) {
            sidebar.classList.toggle('mobile-open');
            sidebarOverlay.classList.toggle('visible');
        } else {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }


    // --- CHART.JS IMPLEMENTATION ---
    const renderCharts = () => {
        // 1. Learning Progress (Doughnut Chart)
        const learningCtx = document.getElementById('learningProgressChart');
        if (learningCtx) {
            new Chart(learningCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'In Progress', 'Not Started'],
                    datasets: [{
                        label: 'Learning Progress',
                        data: [4, 6, 5],
                        backgroundColor: ['#43e97b', '#4facfe', 'rgba(255, 255, 255, 0.1)'],
                        borderColor: '#1a1a2e',
                        borderWidth: 4,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                boxWidth: 12,
                                padding: 20
                            }
                        }
                    }
                }
            });
        }

        // 2. Application Status (Bar Chart)
        const applicationCtx = document.getElementById('applicationStatusChart');
        if (applicationCtx) {
            new Chart(applicationCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Applications Sent',
                        data: [5, 8, 12, 7, 10, 15],
                        backgroundColor: 'rgba(102, 126, 234, 0.6)',
                        borderColor: '#667eea',
                        borderWidth: 2,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.5)' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: 'rgba(255, 255, 255, 0.5)' }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    };

    renderCharts();
});
