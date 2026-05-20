const fs = require("fs");
let html = fs.readFileSync("admin_dashbord.html", "utf8");

// We want to replace everything inside <div class="dashboard-content" id="dashboard-top">...</div>
// We can use regex or just string splitting.
const startMarker = `<div class="dashboard-content" id="dashboard-top">`;
const endMarker = `</main>`;
const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.log("Markers not found");
    process.exit(1);
}

// Extract the existing overview content up to the first Section card.
const originalContent = html.substring(startIndex, endIndex);

// We know the KPI cards and charts are before `<!-- Section: Users -->`
const usersSectionMarker = `<!-- Section: Users -->`;
const usersIndex = originalContent.indexOf(usersSectionMarker);
const dashboardOverviewContent = originalContent.substring(startMarker.length, usersIndex);

// We also need the User Management Table which is later in the file.
const userTableStart = `<!-- User Management Table -->`;
const userTableEnd = `<!-- Reviews + Notifications -->`;
const userTableContent = originalContent.substring(
    originalContent.indexOf(userTableStart),
    originalContent.indexOf(userTableEnd)
);

// We need the Pending Reviews and Notifications for their respective tabs.
const reviewsNotificationsStart = `<!-- Reviews + Notifications -->`;
const reviewsNotificationsContent = originalContent.substring(
    originalContent.indexOf(reviewsNotificationsStart)
);
// Split reviews and notifications. They are in two col-xl-6 inside a row.
// Let us just wrap them into their own tabs.

const newContent = `
    <div class="dashboard-content">
      
      <!-- TAB: DASHBOARD OVERVIEW -->
      <div class="dashboard-tab active" id="dashboard-top">
        ${dashboardOverviewContent}
      </div>

      <!-- TAB: USERS -->
      <div class="dashboard-tab" id="users-section">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-0" style="font-size:1.6rem">User Management</h1>
            <p class="text-muted-light fs-sm">Manage registered students and their status.</p>
          </div>
          <button class="btn btn-primary-grad btn-sm"><i class="bi bi-person-plus me-2"></i>Add User</button>
        </div>
        ${userTableContent}
      </div>

      <!-- TAB: INTERNSHIPS -->
      <div class="dashboard-tab" id="internships-section">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-0" style="font-size:1.6rem">Internships</h1>
            <p class="text-muted-light fs-sm">Manage internship listings.</p>
          </div>
          <button class="btn btn-primary-grad btn-sm"><i class="bi bi-plus me-2"></i>Post Internship</button>
        </div>
        <div class="data-table-container mb-4">
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Title</th><th>Company</th><th>Applicants</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td>Software Engineer Intern</td><td>TechCorp</td><td>145</td><td><span class="status-badge approved">Active</span></td><td><div class="d-flex gap-1"><button class="action-btn"><i class="bi bi-pencil"></i></button></div></td></tr>
                <tr><td>Marketing Intern</td><td>BrandSolutions</td><td>89</td><td><span class="status-badge approved">Active</span></td><td><div class="d-flex gap-1"><button class="action-btn"><i class="bi bi-pencil"></i></button></div></td></tr>
                <tr><td>UI/UX Designer</td><td>Creative Studio</td><td>230</td><td><span class="status-badge pending">Draft</span></td><td><div class="d-flex gap-1"><button class="action-btn"><i class="bi bi-pencil"></i></button></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: TESTS -->
      <div class="dashboard-tab" id="tests-section">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-0" style="font-size:1.6rem">Test Management</h1>
            <p class="text-muted-light fs-sm">Manage aptitude tests and questions.</p>
          </div>
          <button class="btn btn-primary-grad btn-sm"><i class="bi bi-plus me-2"></i>Create Test</button>
        </div>
        <div class="data-table-container mb-4">
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Test Name</th><th>Questions</th><th>Duration</th><th>Attempts</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td>General Aptitude 2026</td><td>50</td><td>60 mins</td><td>4,820</td><td><div class="d-flex gap-1"><button class="action-btn"><i class="bi bi-pencil"></i></button></div></td></tr>
                <tr><td>Coding Assessment (Python)</td><td>15</td><td>45 mins</td><td>1,250</td><td><div class="d-flex gap-1"><button class="action-btn"><i class="bi bi-pencil"></i></button></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: REVIEWS -->
      <div class="dashboard-tab" id="reviews-section">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-0" style="font-size:1.6rem">Reviews</h1>
            <p class="text-muted-light fs-sm">Moderate student reviews.</p>
          </div>
        </div>
        <!-- We reuse the left column of the original reviews+notifications block -->
        <div class="chart-card">
          <div class="chart-card-header"><h5 class="chart-title">Pending Reviews</h5><span class="badge-count" style="padding:4px 10px;border-radius:50px">3 Pending</span></div>
          <div class="d-flex flex-column gap-3">
            <div class="glass-card-dark p-3 rounded-md">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center gap-2"><img src="https://i.pravatar.cc/30?img=32" class="rounded-circle" width="30" height="30"><strong class="fs-sm">Sarah Jenkins</strong></div>
                <div class="review-star">★★★★★</div>
              </div>
              <p class="text-muted-light fs-sm mb-2">"InternHub completely transformed my career path. Highly recommended!"</p>
              <div class="d-flex gap-2"><button class="btn btn-sm btn-success-grad px-3">Approve</button><button class="btn btn-sm btn-outline-light-grad px-3">Reject</button></div>
            </div>
            <div class="glass-card-dark p-3 rounded-md">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center gap-2"><img src="https://i.pravatar.cc/30?img=11" class="rounded-circle" width="30" height="30"><strong class="fs-sm">Rahul Sharma</strong></div>
                <div class="review-star">★★★★★</div>
              </div>
              <p class="text-muted-light fs-sm mb-2">"Great platform, got shortlisted for 2 companies within a week!"</p>
              <div class="d-flex gap-2"><button class="btn btn-sm btn-success-grad px-3">Approve</button><button class="btn btn-sm btn-outline-light-grad px-3">Reject</button></div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: ADVERTISEMENTS -->
      <div class="dashboard-tab" id="ads-section">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-0" style="font-size:1.6rem">Advertisements</h1>
            <p class="text-muted-light fs-sm">Manage promotional banners.</p>
          </div>
          <button class="btn btn-primary-grad btn-sm"><i class="bi bi-plus me-2"></i>New Ad Campaign</button>
        </div>
        <div class="data-table-container mb-4">
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Campaign</th><th>Placement</th><th>Views</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td>Summer Internship Fair</td><td>Home Banner</td><td>12,450</td><td><span class="status-badge approved">Active</span></td><td><div class="d-flex gap-1"><button class="action-btn"><i class="bi bi-pencil"></i></button></div></td></tr>
                <tr><td>Premium Certification Promo</td><td>Sidebar</td><td>8,200</td><td><span class="status-badge approved">Active</span></td><td><div class="d-flex gap-1"><button class="action-btn"><i class="bi bi-pencil"></i></button></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: PAYMENTS -->
      <div class="dashboard-tab" id="payments-section">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-0" style="font-size:1.6rem">Payments</h1>
            <p class="text-muted-light fs-sm">Track registration payments and revenue.</p>
          </div>
        </div>
        <div class="data-table-container mb-4">
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Transaction ID</th><th>Student</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>TXN-99381</td><td>Sarah Jenkins</td><td>₹499</td><td>May 15, 2026</td><td><span class="text-success fw-600">Success</span></td></tr>
                <tr><td>TXN-99382</td><td>Rahul Sharma</td><td>₹499</td><td>May 12, 2026</td><td><span class="text-success fw-600">Success</span></td></tr>
                <tr><td>TXN-99383</td><td>Arjun Singh</td><td>₹499</td><td>May 08, 2026</td><td><span class="text-danger fw-600">Failed</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: NOTIFICATIONS -->
      <div class="dashboard-tab" id="notifications-section">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-0" style="font-size:1.6rem">Notifications</h1>
            <p class="text-muted-light fs-sm">System alerts and activity logs.</p>
          </div>
          <button class="btn btn-outline-light-grad btn-sm">Mark All Read</button>
        </div>
        <div class="chart-card">
          <div class="notification-item unread">
            <div class="notification-icon" style="background:rgba(102,126,234,.15);color:var(--primary)"><i class="bi bi-person-plus"></i></div>
            <div><div class="fw-600 fs-sm">New student registration</div><div class="text-muted-light fs-xs">Priya Patel registered • 5 mins ago</div></div>
          </div>
          <div class="notification-item unread">
            <div class="notification-icon" style="background:rgba(67,233,123,.15);color:#43e97b"><i class="bi bi-currency-rupee"></i></div>
            <div><div class="fw-600 fs-sm">Payment received</div><div class="text-muted-light fs-xs">₹499 from Sarah Jenkins • 20 mins ago</div></div>
          </div>
          <div class="notification-item">
            <div class="notification-icon" style="background:rgba(246,211,101,.15);color:#f6d365"><i class="bi bi-star"></i></div>
            <div><div class="fw-600 fs-sm">New review submitted</div><div class="text-muted-light fs-xs">Rahul Sharma left a 4-star review • 1 hr ago</div></div>
          </div>
          <div class="notification-item">
            <div class="notification-icon" style="background:rgba(245,87,108,.15);color:#f5576c"><i class="bi bi-exclamation-triangle"></i></div>
            <div><div class="fw-600 fs-sm">Internship expired</div><div class="text-muted-light fs-xs">Web Dev at Acme Corp listing expired • 2 hr ago</div></div>
          </div>
        </div>
      </div>

      <!-- TAB: SETTINGS -->
      <div class="dashboard-tab" id="settings-section">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 class="section-title mb-0" style="font-size:1.6rem">Settings</h1>
            <p class="text-muted-light fs-sm">System configuration and preferences.</p>
          </div>
          <button class="btn btn-primary-grad btn-sm">Save Changes</button>
        </div>
        <div class="chart-card mb-4">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="form-label-dark">Platform Name</label>
              <input type="text" class="form-control-dark" value="InternHub">
            </div>
            <div class="col-md-6">
              <label class="form-label-dark">Contact Email</label>
              <input type="email" class="form-control-dark" value="support@internhub.com">
            </div>
            <div class="col-md-6">
              <label class="form-label-dark">Registration Fee (₹)</label>
              <input type="number" class="form-control-dark" value="499">
            </div>
            <div class="col-md-6 d-flex align-items-end">
              <div class="form-check form-switch w-100">
                <input class="form-check-input" type="checkbox" id="maintenanceMode">
                <label class="form-check-label text-muted-light" for="maintenanceMode">Enable Maintenance Mode</label>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
`;

html = html.substring(0, startIndex) + newContent + html.substring(endIndex);
fs.writeFileSync("admin_dashbord.html", html, "utf8");
console.log("Updated admin_dashbord.html successfully");

