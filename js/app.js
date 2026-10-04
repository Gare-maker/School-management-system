// Crown Hill Academy - School Management System (Two-Panel Architecture: Admin & Teacher)
// Complete Implementation of UI Structure, Workflows A through J, and Vibrant Orange Design System

(function () {
  const store = window.store;

  // Global Navigation & UI States
  let currentView = "admin-dashboard"; // admin-dashboard | admin-classes | admin-class-workspace | admin-students | admin-teachers | admin-questions | admin-results | admin-timetable | admin-settings | teacher-dashboard | teacher-class-workspace | teacher-timetable | teacher-profile
  let activeClassId = "cls_2026_ss2a";
  let activeClassTab = "students"; // students | teachers-subjects | questions | results | timetable
  let activeSessionFilter = "2026/2027";
  let activeTermFilter = "First Term";
  let classSearchQuery = "";
  let studentSearchQuery = "";
  let teacherSearchQuery = "";
  let questionStatusFilter = "all";
  let questionTermFilter = "First Term";
  let questionSessionFilter = "2026/2027";
  let questionClassFilter = "all";
  let questionSubjectFilter = "all";
  let questionSearchQuery = "";
  let classStudentsSubjectId = null;
  
  // Results Management Specific States
  let resultClassId = "cls_2026_ss2a";
  let resultSession = "2026/2027";
  let resultTerm = "First Term";
  let resultViewMode = "grid"; // 'grid' (class overview list) | 'detail' (class results workspace)
  let activeResultTab = "students"; // 'students' | 'submissions'

  // Timetable & Schedule Planner States
  let timetableMode = "class"; // 'class' | 'teacher' | 'master' | 'venues' | 'conflicts'
  let timetableClassId = "cls_2026_ss2a";
  let timetableTeacherId = "tch_john";
  let timetableRoom = "Science Lab (Physics & Chemistry)";
  let timetableDayFilter = "Monday";

  // Toast Notification Engine
  function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Router & Navigation
  function navigate(viewName, params = {}) {
    currentView = viewName;
    if (params.classId) {
      activeClassId = params.classId;
      resultClassId = params.classId;
    }
    if (params.tab) {
      activeClassTab = params.tab;
    }
    if (params.session) {
      activeSessionFilter = params.session;
      resultSession = params.session;
      questionSessionFilter = params.session;
    }
    if (params.term) {
      activeTermFilter = params.term;
      resultTerm = params.term;
      questionTermFilter = params.term;
    }
    if (params.resultViewMode) {
      resultViewMode = params.resultViewMode;
    }

    renderSidebar();
    renderHeader();
    renderView();
    closeAllModals();
    closeClassDrawer();
    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================================================
  // SIDEBAR RENDERER (Strict Two-Panel PRD Sections 5, 26, 61)
  // ==========================================================================
  function renderSidebar() {
    const role = store.getCurrentRole();
    const isTeacher = role === "teacher";
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;

    if (isTeacher) {
      // TEACHER PANEL
      const currentTeacher = store.getCurrentTeacher();
      const teacherClasses = store.getTeacherClasses(currentTeacher.id);

      sidebar.innerHTML = `
        <div class="sidebar-header">
          <div class="brand-group" id="brand-home-link">
            <div class="brand-crest">CHA</div>
            <div class="brand-text">
              <div class="brand-title">Crown Hill Academy</div>
              <div class="brand-subtitle">Teacher Workspace</div>
            </div>
          </div>
          <div class="role-badge-pill teacher">
            <i data-lucide="graduation-cap"></i> Teacher Panel
          </div>
        </div>

        <div class="sidebar-nav">
          <div class="nav-section-title">Teaching Modules</div>
          <div class="nav-item ${currentView === 'teacher-dashboard' ? 'active' : ''}" data-nav="teacher-dashboard">
            <i data-lucide="layout-grid"></i>
            <span>Dashboard / My Classes</span>
          </div>

          <div class="nav-item ${currentView === 'teacher-timetable' ? 'active' : ''}" data-nav="teacher-timetable">
            <i data-lucide="calendar-days"></i>
            <span>My Teaching Timetable</span>
          </div>

          <div class="nav-item ${currentView === 'teacher-profile' ? 'active' : ''}" data-nav="teacher-profile">
            <i data-lucide="user"></i>
            <span>My Profile & Schedule</span>
          </div>

          <div class="nav-section-title" style="margin-top: 14px;">My Assigned Classes</div>
          ${teacherClasses.map(c => `
            <div class="nav-item ${activeClassId === c.id && currentView === 'teacher-class-workspace' ? 'active' : ''}" data-nav="teacher-class-workspace" data-class-id="${c.id}">
              <i data-lucide="book-open"></i>
              <span>${c.name} (${c.session})</span>
            </div>
          `).join("")}
        </div>

        <div class="sidebar-footer">
          <div class="user-profile-box">
            <img class="user-avatar-sm" src="${currentTeacher.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120'}" alt="${currentTeacher.name}" />
            <div class="user-meta-info">
              <div class="user-name-text">${currentTeacher.name}</div>
              <div class="user-role-text">${currentTeacher.specialization || 'Teacher'}</div>
            </div>
            <button class="header-icon-btn" style="width: 30px; height: 30px; border-radius: 6px; flex-shrink: 0;" title="Teacher Settings" onclick="window.appHandlers.openSettingsModal ? window.appHandlers.openSettingsModal() : null">
              <i data-lucide="power" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>
      `;
    } else {
      // ADMIN PANEL
      const school = store.getSchool();
      const questionSets = store.getQuestionSets({ status: "Submitted" });
      const timetableConflicts = store.getAllTimetableConflicts(activeSessionFilter, activeTermFilter);

      sidebar.innerHTML = `
        <div class="sidebar-header">
          <div class="brand-group" id="brand-home-link">
            <div class="brand-crest">CHA</div>
            <div class="brand-text">
              <div class="brand-title">Crown Hill Academy</div>
              <div class="brand-subtitle">Administration Hub</div>
            </div>
          </div>
          <div class="role-badge-pill admin">
            <i data-lucide="shield-check"></i> Admin Panel
          </div>
        </div>

        <div class="sidebar-nav">
          <div class="nav-section-title">School Administration</div>
          <div class="nav-item ${currentView === 'admin-dashboard' ? 'active' : ''}" data-nav="admin-dashboard">
            <i data-lucide="layout-dashboard"></i>
            <span>Dashboard</span>
          </div>

          <div class="nav-item ${currentView === 'admin-classes' || currentView === 'admin-class-workspace' ? 'active' : ''}" data-nav="admin-classes">
            <i data-lucide="school"></i>
            <span>Classes</span>
          </div>

          <div class="nav-item ${currentView === 'admin-students' ? 'active' : ''}" data-nav="admin-students">
            <i data-lucide="users"></i>
            <span>Students</span>
          </div>

          <div class="nav-item ${currentView === 'admin-teachers' ? 'active' : ''}" data-nav="admin-teachers">
            <i data-lucide="user-check"></i>
            <span>Teachers</span>
          </div>

          <div class="nav-item ${currentView === 'admin-timetable' ? 'active' : ''}" data-nav="admin-timetable">
            <i data-lucide="calendar-clock"></i>
            <span>Timetable & Planner</span>
            ${timetableConflicts.totalConflicts > 0 ? `<span class="badge-pill-danger" style="margin-left:auto; font-size:10px; font-weight:700;">${timetableConflicts.totalConflicts} Conflict${timetableConflicts.totalConflicts > 1 ? 's' : ''}</span>` : ''}
          </div>

          <div class="nav-item ${currentView === 'admin-questions' ? 'active' : ''}" data-nav="admin-questions">
            <i data-lucide="help-circle"></i>
            <span>Exam Questions</span>
            ${questionSets.length > 0 ? `<span class="nav-badge-count">${questionSets.length}</span>` : ''}
          </div>

          <div class="nav-item ${currentView === 'admin-results' ? 'active' : ''}" data-nav="admin-results">
            <i data-lucide="award"></i>
            <span>Result Management</span>
          </div>

          <div class="nav-item ${currentView === 'admin-settings' ? 'active' : ''}" data-nav="admin-settings">
            <i data-lucide="settings"></i>
            <span>School Settings</span>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="user-profile-box">
            <div class="brand-crest" style="width: 32px; height: 32px; font-size: 13px;">CHA</div>
            <div class="user-meta-info">
              <div class="user-name-text">${school.principalName}</div>
              <div class="user-role-text">${school.principalTitle}</div>
            </div>
            <button class="header-icon-btn" style="width: 30px; height: 30px; border-radius: 6px; flex-shrink: 0;" title="School Settings" onclick="window.appHandlers.openSettingsModal ? window.appHandlers.openSettingsModal() : null">
              <i data-lucide="power" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>
      `;
    }

    // Attach navigation click events
    sidebar.querySelectorAll("[data-nav]").forEach(el => {
      el.addEventListener("click", () => {
        const targetView = el.getAttribute("data-nav");
        const cId = el.getAttribute("data-class-id");
        if (targetView === "admin-results") {
          resultViewMode = "grid"; // Reset to class list when navigating to Result Management
        }
        navigate(targetView, { classId: cId });
      });
    });

    const homeLink = sidebar.querySelector("#brand-home-link");
    if (homeLink) {
      homeLink.addEventListener("click", () => {
        navigate(isTeacher ? "teacher-dashboard" : "admin-dashboard");
      });
    }
  }

  // ==========================================================================
  // TOP HEADER RENDERER
  // ==========================================================================
  function renderHeader() {
    const header = document.getElementById("app-header");
    if (!header) return;

    const role = store.getCurrentRole();
    const isTeacher = role === "teacher";
    const currentSession = store.getCurrentSession();
    const availableTeachers = store.getAvailableTeachers();
    const currentTeacherId = store.getCurrentTeacherId();
    const notifications = store.getNotifications(isTeacher ? "Teacher" : "Admin", isTeacher ? currentTeacherId : null);
    const unreadCount = notifications.filter(n => !n.read).length;

    let viewTitle = "Dashboard";
    if (currentView === "admin-classes") viewTitle = "Classes Directory";
    if (currentView === "admin-class-workspace") {
      const cls = store.getClassById(activeClassId);
      viewTitle = cls ? `${cls.name} Class Workspace` : "Class Workspace";
    }
    if (currentView.includes("students")) viewTitle = "Students Registry";
    if (currentView.includes("teachers")) viewTitle = "Teachers & Staff Directory";
    if (currentView === "admin-timetable") viewTitle = "Timetable & Schedule Planner";
    if (currentView === "teacher-timetable") viewTitle = "Teacher Class Timetable";
    if (currentView.includes("questions")) viewTitle = "Exam Questions & Question Bank";
    if (currentView.includes("results")) viewTitle = "Result Management & Broadsheets";
    if (currentView.includes("settings")) viewTitle = "School Settings & Audit Log";
    if (currentView === "teacher-profile") viewTitle = "Teacher Profile";

    header.innerHTML = `
      <div class="header-left">
        <button class="mobile-menu-btn" id="mobile-sidebar-toggle" title="Toggle Navigation Menu">
          <i data-lucide="menu"></i>
        </button>
        <div class="breadcrumb-box">
          <span class="breadcrumb-root">${isTeacher ? "Teacher Panel" : "Admin Portal"}</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-active">${viewTitle}</span>
        </div>
        <div class="session-indicator-badge">
          <i data-lucide="calendar"></i>
          <span>${currentSession} Academic Session</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Role Switcher -->
        <div class="role-switcher-toggle" title="Switch between Admin and Teacher Roles">
          <button class="role-btn ${!isTeacher ? 'active' : ''}" id="toggle-role-admin">
            <i data-lucide="shield"></i> Admin
          </button>
          <button class="role-btn ${isTeacher ? 'active' : ''}" id="toggle-role-teacher">
            <i data-lucide="graduation-cap"></i> Teacher
          </button>
        </div>

        ${isTeacher ? `
          <select class="teacher-persona-select" id="teacher-persona-picker" title="Switch Teacher Persona">
            ${availableTeachers.map(t => `
              <option value="${t.id}" ${t.id === currentTeacherId ? 'selected' : ''}>${t.name} (${t.specialization.split('&')[0]})</option>
            `).join("")}
          </select>
        ` : ''}

        <button class="header-icon-btn" id="notifications-btn" title="Notifications">
          <i data-lucide="bell"></i>
          ${unreadCount > 0 ? `<span class="btn-notif-dot"></span>` : ''}
        </button>

        <button class="header-icon-btn" id="print-current-btn" title="Quick Print Window">
          <i data-lucide="printer"></i>
        </button>
      </div>
    `;

    // Mobile Sidebar Drawer Listeners
    header.querySelector("#mobile-sidebar-toggle")?.addEventListener("click", () => {
      const sidebar = document.getElementById("app-sidebar");
      const backdrop = document.getElementById("mobile-nav-backdrop");
      sidebar?.classList.toggle("mobile-open");
      backdrop?.classList.toggle("active");
    });

    document.getElementById("mobile-nav-backdrop")?.addEventListener("click", () => {
      document.getElementById("app-sidebar")?.classList.remove("mobile-open");
      document.getElementById("mobile-nav-backdrop")?.classList.remove("active");
    });

    // Role Switching Listeners
    header.querySelector("#toggle-role-admin")?.addEventListener("click", () => {
      store.setCurrentRole("admin");
      navigate("admin-dashboard");
      showToast("Switched to Administrator Panel", "info");
    });

    header.querySelector("#toggle-role-teacher")?.addEventListener("click", () => {
      store.setCurrentRole("teacher");
      navigate("teacher-dashboard");
      showToast("Switched to Teacher Panel", "info");
    });

    header.querySelector("#teacher-persona-picker")?.addEventListener("change", (e) => {
      store.setCurrentTeacherId(e.target.value);
      renderSidebar();
      renderView();
      showToast(`Switched active teacher to ${store.getCurrentTeacher().name}`, "info");
    });

    header.querySelector("#notifications-btn")?.addEventListener("click", () => {
      openNotificationsModal();
    });

    header.querySelector("#print-current-btn")?.addEventListener("click", () => {
      window.print();
    });
  }

  // ==========================================================================
  // VIEW DISPATCHER
  // ==========================================================================
  function renderView() {
    const container = document.getElementById("app-viewport");
    if (!container) return;
    container.innerHTML = "";

    const role = store.getCurrentRole();

    if (role === "teacher") {
      switch (currentView) {
        case "teacher-dashboard":
          renderTeacherDashboard(container);
          break;
        case "teacher-class-workspace":
          renderClassWorkspace(container, false);
          break;
        case "teacher-timetable":
          renderTeacherTimetable(container);
          break;
        case "teacher-profile":
          renderTeacherProfile(container);
          break;
        default:
          renderTeacherDashboard(container);
      }
    } else {
      switch (currentView) {
        case "admin-dashboard":
          renderAdminDashboard(container);
          break;
        case "admin-classes":
          renderAdminClasses(container);
          break;
        case "admin-class-workspace":
          renderClassWorkspace(container, true);
          break;
        case "admin-students":
          renderAdminStudents(container);
          break;
        case "admin-teachers":
          renderAdminTeachers(container);
          break;
        case "admin-timetable":
          renderAdminTimetable(container);
          break;
        case "admin-questions":
          renderAdminQuestions(container);
          break;
        case "admin-results":
          renderAdminResults(container);
          break;
        case "admin-settings":
          renderAdminSettings(container);
          break;
        default:
          renderAdminDashboard(container);
      }
    }
  }

  // ==========================================================================
  // ADMIN DASHBOARD (Submitted Questions Per Term & Session - Requirement 2)
  // ==========================================================================
  function renderAdminDashboard(container) {
    const availableSessions = store.getAvailableSessions();
    const availableTerms = store.getAvailableTerms();
    const students = store.getStudents(activeSessionFilter);
    const classes = store.getClasses(activeSessionFilter);
    const teachers = store.getTeachers();
    
    // Requirement 2: Submitted Questions tied to Session & Term
    const submittedQuestions = store.getQuestionSets({ 
      status: "Submitted", 
      session: activeSessionFilter, 
      term: activeTermFilter 
    });
    const auditLogs = store.getAuditLogs().slice(0, 5);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div class="view-eyebrow">THE WHOLE SCHOOL</div>
          <h1>Dashboard</h1>
          <p>Academic Overview for <strong>${activeSessionFilter}</strong> • <strong>${activeTermFilter}</strong></p>
        </div>
        <div class="view-actions">
          <select class="form-select" id="dash-term-select" style="width: 140px;" title="Select Academic Term">
            ${availableTerms.map(t => `<option value="${t}" ${t === activeTermFilter ? 'selected' : ''}>${t}</option>`).join("")}
          </select>
          <button class="btn btn-primary" id="dash-btn-add-class"><i data-lucide="plus-circle"></i> Add Class</button>
          <button class="btn btn-secondary" id="dash-btn-add-student"><i data-lucide="user-plus"></i> Add Student</button>
          <button class="btn btn-secondary" id="dash-btn-add-teacher"><i data-lucide="user-check"></i> Add Teacher</button>
          <button class="btn btn-outline-primary" id="dash-btn-review-questions"><i data-lucide="help-circle"></i> Review Exam Questions (${submittedQuestions.length})</button>
        </div>
      </div>

      <!-- Featured Hero Banner Matching Reference Image -->
      <div class="hero-featured-banner">
        <div class="hero-stat-display">
          <div class="hero-stat-eyebrow">ACTIVE ACADEMIC ENROLLMENT • ${activeSessionFilter} ${activeTermFilter}</div>
          <div class="hero-stat-number">${students.length}</div>
          <div class="hero-stat-narrative">of registered students currently enrolled across ${classes.length} active class arms with ${teachers.length} assigned subject teachers.</div>
        </div>
        <div class="hero-metric-cluster">
          <div class="hero-metric-item">
            <div class="hero-metric-val">${classes.length}</div>
            <div class="hero-metric-lbl">Classes</div>
          </div>
          <div class="hero-metric-item">
            <div class="hero-metric-val">${teachers.length}</div>
            <div class="hero-metric-lbl">Teachers</div>
          </div>
          <div class="hero-metric-item" style="cursor: pointer;" onclick="document.getElementById('kpi-submitted-questions-card')?.click()">
            <div class="hero-metric-val">${submittedQuestions.length}</div>
            <div class="hero-metric-lbl">Questions</div>
          </div>
        </div>
      </div>

      <!-- Statistics KPI Cards -->
      <div class="stats-grid">
        <div class="kpi-card">
          <div class="kpi-icon-box orange"><i data-lucide="users"></i></div>
          <div class="kpi-info">
            <h4>Total Students</h4>
            <div class="kpi-value">${students.length}</div>
            <div class="kpi-subtext">Session ${activeSessionFilter}</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box emerald"><i data-lucide="school"></i></div>
          <div class="kpi-info">
            <h4>Total Classes</h4>
            <div class="kpi-value">${classes.length}</div>
            <div class="kpi-subtext">Active Arms</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box amber"><i data-lucide="user-check"></i></div>
          <div class="kpi-info">
            <h4>Total Teachers</h4>
            <div class="kpi-value">${teachers.length}</div>
            <div class="kpi-subtext">Teaching Staff</div>
          </div>
        </div>

        <!-- Submitted Questions Tied To Term -->
        <div class="kpi-card" style="cursor: pointer;" id="kpi-submitted-questions-card">
          <div class="kpi-icon-box purple"><i data-lucide="help-circle"></i></div>
          <div class="kpi-info">
            <h4>Submitted Questions</h4>
            <div class="kpi-value">${submittedQuestions.length}</div>
            <div class="kpi-subtext">${activeTermFilter} (${activeSessionFilter})</div>
          </div>
        </div>
      </div>

      <!-- Student Overview Table -->
      <div class="view-header" style="margin-top: 10px; margin-bottom: 12px;">
        <div class="view-title-group">
          <h2 style="font-size: 18px; font-weight: 700; color: var(--text-heading);">Student Enrollment & Overview</h2>
          <p>Filter students by Academic Year, Class, and Status</p>
        </div>
      </div>

      <div class="filter-bar">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" class="search-input" id="dash-student-search" placeholder="Search by student name or ID..." value="${studentSearchQuery}">
        </div>

        <div class="filter-group">
          <select class="form-select" id="dash-session-filter" style="width: 150px;">
            <option value="all">All Sessions</option>
            ${availableSessions.map(s => `
              <option value="${s}" ${s === activeSessionFilter ? 'selected' : ''}>${s}</option>
            `).join("")}
          </select>

          <select class="form-select" id="dash-class-filter" style="width: 140px;">
            <option value="all">All Classes</option>
            ${store.getClasses(activeSessionFilter).map(c => `
              <option value="${c.id}">${c.name}</option>
            `).join("")}
          </select>

          <select class="form-select" id="dash-status-filter" style="width: 130px;">
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Transferred">Transferred</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Academic Year</th>
                <th>Class</th>
                <th>Admission No</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="dash-student-tbody">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Live Audit Trail Preview -->
      <div class="view-header" style="margin-top: 20px; margin-bottom: 12px;">
        <div class="view-title-group">
          <h2 style="font-size: 16px; font-weight: 700; color: var(--text-heading);">Recent Administrative Audit Trail</h2>
        </div>
      </div>
      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>User / Role</th>
                <th>Action</th>
                <th>Related Record</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${auditLogs.map(l => `
                <tr>
                  <td><strong>${l.user}</strong> <span class="badge ${l.role === 'Admin' ? 'badge-primary' : 'badge-neutral'}">${l.role}</span></td>
                  <td><span class="badge badge-success">${l.action}</span></td>
                  <td>${l.record}</td>
                  <td style="color: var(--text-muted); font-size: 12px;">${l.timestamp}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Populate student table
    const renderTableRows = () => {
      const sess = document.getElementById("dash-session-filter")?.value || activeSessionFilter;
      const cFilter = document.getElementById("dash-class-filter")?.value || "all";
      const sFilter = document.getElementById("dash-status-filter")?.value || "all";
      const q = (document.getElementById("dash-student-search")?.value || "").toLowerCase().trim();

      let list = store.getStudents(sess, cFilter);

      if (sFilter !== "all") {
        list = list.filter(s => s.status === sFilter);
      }
      if (q) {
        list = list.filter(s => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || (s.admissionNo && s.admissionNo.toLowerCase().includes(q)));
      }

      const tbody = document.getElementById("dash-student-tbody");
      if (!tbody) return;

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">No student records match the selected filters.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(s => {
        const cls = store.getClassById(s.currentClassId);
        return `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:10px;">
                <img src="${s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100'}" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1px solid #cbd5e1;" />
                <strong>${s.name}</strong>
              </div>
            </td>
            <td><code>${s.studentId}</code></td>
            <td><span class="badge badge-neutral">${s.currentSession}</span></td>
            <td><strong>${cls?.name || 'SS2A'}</strong></td>
            <td>${s.admissionNo || 'ADM124'}</td>
            <td><span class="badge badge-success">${s.status}</span></td>
            <td style="text-align: right;">
              <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openStudentProfile('${s.id}')"><i data-lucide="eye"></i> View Profile</button>
            </td>
          </tr>
        `;
      }).join("");

      if (window.lucide) window.lucide.createIcons();
    };

    renderTableRows();

    // Event listeners
    document.getElementById("dash-term-select")?.addEventListener("change", (e) => {
      activeTermFilter = e.target.value;
      renderAdminDashboard(container);
    });

    document.getElementById("dash-student-search")?.addEventListener("input", renderTableRows);
    
    document.getElementById("dash-session-filter")?.addEventListener("change", (e) => {
      activeSessionFilter = e.target.value;
      const classSelect = document.getElementById("dash-class-filter");
      if (classSelect) {
        const classList = activeSessionFilter === "all" ? store.getClasses() : store.getClasses(activeSessionFilter);
        classSelect.innerHTML = `<option value="all">All Classes</option>` + classList.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
      }
      renderTableRows();
    });

    document.getElementById("dash-class-filter")?.addEventListener("change", renderTableRows);
    document.getElementById("dash-status-filter")?.addEventListener("change", renderTableRows);

    document.getElementById("dash-btn-add-class")?.addEventListener("click", () => openAddClassModal());
    document.getElementById("dash-btn-add-student")?.addEventListener("click", () => openAddStudentModal());
    document.getElementById("dash-btn-add-teacher")?.addEventListener("click", () => openAddTeacherModal());
    document.getElementById("dash-btn-review-questions")?.addEventListener("click", () => {
      questionSessionFilter = activeSessionFilter;
      questionTermFilter = activeTermFilter;
      navigate("admin-questions");
    });
    document.getElementById("kpi-submitted-questions-card")?.addEventListener("click", () => {
      questionSessionFilter = activeSessionFilter;
      questionTermFilter = activeTermFilter;
      navigate("admin-questions");
    });
  }

  // ==========================================================================
  // ADMIN CLASSES VIEW (Dedicated Page & Responsive Cards - Requirements 3, 4, 5)
  // ==========================================================================
  function renderAdminClasses(container) {
    const classes = store.getClasses(activeSessionFilter);
    const availableSessions = store.getAvailableSessions();

    const filteredClasses = classSearchQuery
      ? classes.filter(c => c.name.toLowerCase().includes(classSearchQuery.toLowerCase()) || (c.category && c.category.toLowerCase().includes(classSearchQuery.toLowerCase())))
      : classes;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Class Management & Directory</h1>
          <p>Academic Year / Session: <strong>${activeSessionFilter}</strong> • ${filteredClasses.length} Active Classes</p>
        </div>
        <div class="view-actions">
          <select class="form-select" id="classes-session-picker" style="width: 160px;">
            ${availableSessions.map(s => `
              <option value="${s}" ${s === activeSessionFilter ? 'selected' : ''}>${s} Session</option>
            `).join("")}
          </select>
          <button class="btn btn-primary" id="btn-create-class"><i data-lucide="plus"></i> Add Class</button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" class="search-input" id="class-search-input" placeholder="Search class by name (e.g. JS1, SS2A)..." value="${classSearchQuery}">
        </div>
        <div class="filter-group">
          <span style="font-size:13px; color:var(--text-muted);">Click any class card to open its <strong>Dedicated Workspace Page</strong>.</span>
        </div>
      </div>

      <div class="class-grid" id="admin-class-grid">
        ${filteredClasses.length > 0 ? filteredClasses.map(c => {
          const subjects = store.getClassSubjects(c.id);
          const teachers = store.getClassTeachers(c.id);
          const classStudents = store.getClassStudents(c.id);
          return `
            <div class="class-card" data-class-card-id="${c.id}">
              <div>
                <div class="class-card-header">
                  <div class="class-name-badge">${c.name}</div>
                  <span class="badge badge-neutral" style="font-size:11px; font-weight:600;">${c.session}</span>
                </div>
                
                <div class="class-section-pill">
                  <span class="badge badge-primary" style="font-size:10px;">${c.category || 'Secondary Section'}</span>
                  <span>• Arm ${c.section || 'A'}</span>
                </div>

                <!-- 3-Pill Metrics Grid -->
                <div class="class-card-metrics-bar">
                  <div class="metric-pill-item">
                    <div class="metric-pill-val">${classStudents.length}</div>
                    <div class="metric-pill-lbl">Students</div>
                  </div>
                  <div class="metric-pill-item">
                    <div class="metric-pill-val">${subjects.length}</div>
                    <div class="metric-pill-lbl">Subjects</div>
                  </div>
                  <div class="metric-pill-item">
                    <div class="metric-pill-val">${teachers.length}</div>
                    <div class="metric-pill-lbl">Teachers</div>
                  </div>
                </div>
              </div>

              <div class="class-card-footer">
                <span>Open Dedicated Workspace</span>
                <i data-lucide="arrow-right"></i>
              </div>
            </div>
          `;
        }).join("") : `
          <div style="grid-column: 1 / -1; background:var(--bg-card); padding:36px; text-align:center; border-radius:var(--radius-lg); border:1px solid var(--border-color); color:var(--text-muted);">
            No classes found matching "${classSearchQuery}". Click <strong>Add Class</strong> to create one.
          </div>
        `}
      </div>
    `;

    document.getElementById("classes-session-picker")?.addEventListener("change", (e) => {
      activeSessionFilter = e.target.value;
      renderAdminClasses(container);
    });

    document.getElementById("class-search-input")?.addEventListener("input", (e) => {
      classSearchQuery = e.target.value;
      renderAdminClasses(container);
    });

    document.getElementById("btn-create-class")?.addEventListener("click", () => openAddClassModal());

    // Requirement 4: Dedicated Class Page instead of overlay
    container.querySelectorAll("[data-class-card-id]").forEach(card => {
      card.addEventListener("click", () => {
        const cId = card.getAttribute("data-class-card-id");
        navigate("admin-class-workspace", { classId: cId });
      });
    });
  }

  // Drawer overlay placeholder (kept clean for closing)
  function closeClassDrawer() {
    const overlay = document.getElementById("class-drawer-overlay");
    if (overlay) overlay.classList.remove("active");
  }

  // ==========================================================================
  // DEDICATED CLASS WORKSPACE PAGE (Requirement 4 & 6)
  // ==========================================================================
  function renderClassWorkspace(container, isAdmin = true) {
    const currentSession = store.getCurrentSession();
    let availableClasses = [];

    if (isAdmin) {
      availableClasses = store.getClasses(activeSessionFilter || currentSession);
    } else {
      const currentTeacher = store.getCurrentTeacher();
      availableClasses = store.getTeacherClasses(currentTeacher.id, activeSessionFilter || currentSession);
    }

    if (availableClasses.length === 0) {
      availableClasses = store.getClasses();
    }

    if (!availableClasses.some(c => c.id === activeClassId)) {
      activeClassId = availableClasses[0]?.id || "cls_2026_ss2a";
    }

    if (!isAdmin && (activeClassTab === "teachers-subjects" || activeClassTab === "results")) {
      activeClassTab = "students";
    }

    const currentClass = store.getClassById(activeClassId) || availableClasses[0];
    const students = store.getClassStudents(currentClass.id);
    const subjects = store.getClassSubjects(currentClass.id);
    const teachers = store.getClassTeachers(currentClass.id);
    const questionSets = store.getQuestionSets({ classId: currentClass.id, session: currentClass.session });

    container.innerHTML = `
      ${isAdmin ? `
        <button class="workspace-back-btn" id="workspace-back-btn">
          <i data-lucide="arrow-left"></i> Back to Classes Directory
        </button>
      ` : ''}

      <!-- Prominent Class Header -->
      <div class="class-hero-selector-bar">
        <div class="class-hero-left">
          <div class="class-hero-badge">${currentClass.name.substring(0, 3)}</div>
          <div class="class-hero-info">
            <h1>${currentClass.name} Workspace</h1>
            <p>${currentClass.session} Academic Session • ${currentClass.category || 'Secondary Section'} • Arm ${currentClass.section || 'A'}</p>
          </div>
        </div>

        <div class="class-selector-dropdown-box">
          <span style="font-size:13px; font-weight:600; color:#cbd5e1;">Switch Class:</span>
          <select class="class-select-input" id="workspace-class-selector">
            ${availableClasses.map(c => `
              <option value="${c.id}" ${c.id === currentClass.id ? 'selected' : ''}>${c.name} (${c.session})</option>
            `).join("")}
          </select>
        </div>
      </div>

      <!-- Workspace Navigation Tabs -->
      <div class="workspace-tabs-bar">
        <button class="workspace-tab-btn ${activeClassTab === 'students' ? 'active' : ''}" data-tab="students">
          <i data-lucide="users"></i> Students & Score Entry (${students.length})
        </button>
        ${isAdmin ? `
          <button class="workspace-tab-btn ${activeClassTab === 'teachers-subjects' ? 'active' : ''}" data-tab="teachers-subjects">
            <i data-lucide="book-open"></i> Teachers & Subjects (${subjects.length})
          </button>
        ` : ''}
        <button class="workspace-tab-btn ${activeClassTab === 'timetable' ? 'active' : ''}" data-tab="timetable">
          <i data-lucide="calendar-clock"></i> Timetable / Schedule
        </button>
        <button class="workspace-tab-btn ${activeClassTab === 'questions' ? 'active' : ''}" data-tab="questions">
          <i data-lucide="help-circle"></i> Exam Questions (${questionSets.length})
        </button>
        ${isAdmin ? `
          <button class="workspace-tab-btn ${activeClassTab === 'results' ? 'active' : ''}" data-tab="results">
            <i data-lucide="award"></i> Results & Broadsheet
          </button>
        ` : ''}
      </div>

      <!-- Tab Content Mount -->
      <div id="workspace-tab-content"></div>
    `;

    document.getElementById("workspace-back-btn")?.addEventListener("click", () => {
      navigate("admin-classes");
    });

    document.getElementById("workspace-class-selector")?.addEventListener("change", (e) => {
      activeClassId = e.target.value;
      renderClassWorkspace(container, isAdmin);
      if (window.lucide) window.lucide.createIcons();
    });

    container.querySelectorAll(".workspace-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeClassTab = btn.getAttribute("data-tab");
        container.querySelectorAll(".workspace-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderWorkspaceTabContent(document.getElementById("workspace-tab-content"), currentClass, isAdmin);
        if (window.lucide) window.lucide.createIcons();
      });
    });

    renderWorkspaceTabContent(document.getElementById("workspace-tab-content"), currentClass, isAdmin);
  }

  function renderWorkspaceTabContent(tabContainer, currentClass, isAdmin) {
    if (!tabContainer) return;

    if (activeClassTab === "students") {
      renderClassStudentsTab(tabContainer, currentClass, isAdmin);
    } else if (activeClassTab === "teachers-subjects") {
      renderClassTeachersSubjectsTab(tabContainer, currentClass, isAdmin);
    } else if (activeClassTab === "timetable") {
      renderClassTimetableTab(tabContainer, currentClass, isAdmin);
    } else if (activeClassTab === "questions") {
      renderClassQuestionsTab(tabContainer, currentClass, isAdmin);
    } else if (activeClassTab === "results") {
      renderClassResultsTab(tabContainer, currentClass, isAdmin);
    }
  }

  // WORKSPACE TAB 1: STUDENTS (Continuous Assessment Score Recording Table - Voice Note 2)
  function renderClassStudentsTab(tabContainer, currentClass, isAdmin) {
    const students = store.getClassStudents(currentClass.id);
    const subjects = store.getClassSubjects(currentClass.id);
    
    if (!classStudentsSubjectId || !subjects.some(s => s.id === classStudentsSubjectId)) {
      classStudentsSubjectId = subjects[0]?.id || "sub_math";
    }

    const currentSubject = subjects.find(s => s.id === classStudentsSubjectId) || subjects[0] || { id: "sub_math", name: "Mathematics" };
    const school = store.getSchool();
    const projectMax = school.projectWeight || 10;
    const assessMax = school.assessmentWeight || 20;
    const examMax = school.examWeight || 70;

    tabContainer.innerHTML = `
      <div class="view-header" style="margin-bottom: 14px;">
        <div class="view-title-group">
          <h2 style="font-size: 18px; font-weight: 700; color: var(--text-heading);">Enrolled Students & Continuous Assessment Desk</h2>
          <p>Continuous Assessment & Terminal Score Recording for <strong>${currentClass.name}</strong> • <strong>${currentClass.session}</strong></p>
        </div>
        <div class="view-actions">
          ${isAdmin ? `<button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openAddStudentForClassModal('${currentClass.id}')"><i data-lucide="user-plus"></i> Enroll Student</button>` : ''}
        </div>
      </div>

      <!-- Subject Switcher Bar -->
      <div class="score-recording-header-bar">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-size: 12.5px; font-weight: 700; color: var(--text-heading); display: flex; align-items: center; gap: 6px;">
            <i data-lucide="book-open" style="width: 16px; height: 16px; color: var(--primary);"></i> Active Subject:
          </span>
          <div class="subject-tabs-pill-group">
            ${subjects.map(s => `
              <button class="subject-pill-btn ${s.id === classStudentsSubjectId ? 'active' : ''}" data-subject-id="${s.id}">
                ${s.name}
              </button>
            `).join("")}
          </div>
        </div>

        <div style="font-size: 12px; color: var(--text-muted); font-weight: 500;">
          Weights: Project (<strong>${projectMax}%</strong>) + Assessment (<strong>${assessMax}%</strong>) + Exam (<strong>${examMax}%</strong>) = <strong>100%</strong>
        </div>
      </div>

      <!-- Continuous Assessment Data Table (Web Table View) -->
      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 4%;">#</th>
                <th class="sticky-col-student" style="min-width: 200px;">Student Information</th>
                <th>Student ID</th>
                <th>Admission No</th>
                <th style="text-align: center;">Project (${projectMax}%)</th>
                <th style="text-align: center;">Assessment (${assessMax}%)</th>
                <th style="text-align: center;">Exam (${examMax}%)</th>
                <th style="text-align: center;">Total (100%)</th>
                <th style="text-align: center;">Grade & Remark</th>
                <th style="text-align: right; min-width: 190px;">Score Recording Actions</th>
              </tr>
            </thead>
            <tbody>
              ${students.length > 0 ? students.map((s, idx) => {
                const res = store.getStudentResult(s.id, currentSubject.id, currentClass.id, currentClass.session);
                const isProjectFilled = res && res.project !== null && res.project !== undefined;
                const isAssessFilled = res && res.assessment !== null && res.assessment !== undefined;
                const isExamFilled = res && res.exam !== null && res.exam !== undefined;
                const isComplete = isProjectFilled && isAssessFilled && isExamFilled;

                return `
                  <tr>
                    <td style="color: var(--text-muted); font-weight: 600;">${idx + 1}</td>
                    <td class="sticky-col-student">
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100'}" alt="${s.name}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1.5px solid #cbd5e1; flex-shrink: 0;" />
                        <div>
                          <strong style="color: var(--text-heading);">${s.name}</strong>
                          <div style="font-size: 11.5px; color: var(--text-muted);">${s.gender} • ${s.dob || '2010'}</div>
                        </div>
                      </div>
                    </td>
                    <td><code>${s.studentId}</code></td>
                    <td>${s.admissionNo || 'ADM124'}</td>
                    
                    <!-- Project Score Trigger -->
                    <td style="text-align: center;">
                      <button class="score-cell-interactive" onclick="window.appHandlers.openScoreModal('${s.id}', '${currentClass.id}', '${currentSubject.id}', 'project')" title="Edit Project Score">
                        <span>${isProjectFilled ? res.project : '-'}</span>
                        <i data-lucide="edit-2" style="width: 12px; height: 12px; opacity: 0.6;"></i>
                      </button>
                    </td>

                    <!-- Assessment Score Trigger -->
                    <td style="text-align: center;">
                      <button class="score-cell-interactive" onclick="window.appHandlers.openScoreModal('${s.id}', '${currentClass.id}', '${currentSubject.id}', 'assessment')" title="Edit Assessment Score">
                        <span>${isAssessFilled ? res.assessment : '-'}</span>
                        <i data-lucide="edit-2" style="width: 12px; height: 12px; opacity: 0.6;"></i>
                      </button>
                    </td>

                    <!-- Exam Score Trigger -->
                    <td style="text-align: center;">
                      <button class="score-cell-interactive" onclick="window.appHandlers.openScoreModal('${s.id}', '${currentClass.id}', '${currentSubject.id}', 'exam')" title="Edit Exam Score">
                        <span>${isExamFilled ? res.exam : '-'}</span>
                        <i data-lucide="edit-2" style="width: 12px; height: 12px; opacity: 0.6;"></i>
                      </button>
                    </td>

                    <!-- Total Computed Score -->
                    <td style="text-align: center;">
                      <span style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: ${res && res.total >= 50 ? 'var(--primary)' : res && res.total !== null ? '#dc2626' : 'var(--text-muted)'};">
                        ${res && res.total !== null ? res.total : '-'}
                      </span>
                    </td>

                    <!-- Grade & Remark Pill -->
                    <td style="text-align: center;">
                      ${res && res.grade ? `
                        <span class="badge ${res.grade === 'A' || res.grade === 'B' ? 'badge-success' : res.grade === 'C' ? 'badge-primary' : res.grade === 'D' || res.grade === 'E' ? 'badge-warning' : 'badge-danger'}">
                          ${res.grade} • ${res.remark || 'Graded'}
                        </span>
                      ` : `<span class="badge badge-neutral">Ungraded</span>`}
                    </td>

                    <!-- Action Buttons -->
                    <td style="text-align: right;">
                      <div style="display: inline-flex; gap: 4px;">
                        <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openScoreModal('${s.id}', '${currentClass.id}', '${currentSubject.id}', 'project')" title="Record Continuous Assessment Scores">
                          <i data-lucide="edit-3"></i> Scores
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openStudentProfile('${s.id}')" title="View Student Academic Profile">
                          <i data-lucide="user"></i> Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join("") : `
                <tr>
                  <td colspan="10" style="text-align: center; padding: 36px; color: var(--text-muted);">
                    No students enrolled in ${currentClass.name} yet. Click <strong>Enroll Student</strong> above.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach subject switcher listeners
    tabContainer.querySelectorAll(".subject-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        classStudentsSubjectId = btn.getAttribute("data-subject-id");
        renderClassStudentsTab(tabContainer, currentClass, isAdmin);
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }

  // WORKSPACE TAB 2: TEACHERS & SUBJECTS (Requirement 6)
  function renderClassTeachersSubjectsTab(tabContainer, currentClass, isAdmin) {
    const subjects = store.getClassSubjects(currentClass.id);
    const teachers = store.getClassTeachers(currentClass.id);

    tabContainer.innerHTML = `
      <div class="view-header" style="margin-bottom: 16px;">
        <div class="view-title-group">
          <h2 style="font-size: 18px; font-weight: 700; color: var(--text-heading);">Subjects & Assigned Teachers for ${currentClass.name}</h2>
          <p>Curriculum subjects and educator assignments for <strong>${currentClass.session}</strong></p>
        </div>
        <div class="view-actions">
          ${isAdmin ? `
            <button class="btn btn-primary btn-sm" onclick="window.appHandlers.openAddSubjectToClassModal('${currentClass.id}')"><i data-lucide="plus"></i> Add Subject to Class</button>
            <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openAssignTeacherModal('')"><i data-lucide="user-plus"></i> Assign Teacher</button>
          ` : ''}
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
        <!-- Subjects Column -->
        <div class="table-card">
          <div style="padding:16px 20px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-size:15px; font-weight:700; color:var(--text-heading);">Curriculum Subjects (${subjects.length})</h3>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Category</th>
                  ${isAdmin ? `<th style="text-align:right;">Action</th>` : ''}
                </tr>
              </thead>
              <tbody>
                ${subjects.map(s => `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td><code>${s.code}</code></td>
                    <td><span class="badge badge-neutral">${s.category || 'General'}</span></td>
                    ${isAdmin ? `
                      <td style="text-align:right;">
                        <button class="btn btn-danger-outline btn-sm" onclick="window.appHandlers.removeClassSubject('${currentClass.id}', '${s.id}')"><i data-lucide="trash-2"></i> Remove</button>
                      </td>
                    ` : ''}
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Teachers Column -->
        <div class="table-card">
          <div style="padding:16px 20px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-size:15px; font-weight:700; color:var(--text-heading);">Assigned Teachers (${teachers.length})</h3>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Subjects Taught</th>
                  ${isAdmin ? `<th style="text-align:right;">Action</th>` : ''}
                </tr>
              </thead>
              <tbody>
                ${teachers.length > 0 ? teachers.map(t => `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${t.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80'}" style="width:28px; height:28px; border-radius:50%;" />
                        <div>
                          <strong>${t.name}</strong>
                          <div style="font-size:11px; color:var(--text-muted);">${t.specialization}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style="display:flex; flex-wrap:wrap; gap:4px;">
                        ${(t.assignedSubjects || []).map(sub => `<span class="badge badge-primary" style="font-size:11px;">${sub.name}</span>`).join("")}
                      </div>
                    </td>
                    ${isAdmin ? `
                      <td style="text-align:right;">
                        <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openAssignTeacherModal('${t.id}')"><i data-lucide="edit"></i> Manage</button>
                      </td>
                    ` : ''}
                  </tr>
                `).join("") : `
                  <tr><td colspan="${isAdmin ? 3 : 2}" style="text-align:center; padding:20px; color:var(--text-muted);">No teachers assigned to this class yet.</td></tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // WORKSPACE TAB 3: EXAM QUESTIONS
  function renderClassQuestionsTab(tabContainer, currentClass, isAdmin) {
    const questionSets = store.getQuestionSets({ classId: currentClass.id, session: currentClass.session });

    tabContainer.innerHTML = `
      <div class="view-header" style="margin-bottom: 16px;">
        <div class="view-title-group">
          <h2 style="font-size: 18px; font-weight: 700; color: var(--text-heading);">Exam Question Sets & AI Generator</h2>
          <p>Class: <strong>${currentClass.name}</strong> • Academic Session: <strong>${currentClass.session}</strong></p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" id="btn-open-ai-generator"><i data-lucide="sparkles"></i> AI Generate Exam Questions</button>
          ${isAdmin ? `<button class="btn btn-secondary" id="btn-admin-compose-exam"><i data-lucide="file-check"></i> Compose Official Exam Paper</button>` : ''}
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title / Topic</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Total Marks</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${questionSets.length > 0 ? questionSets.map(qs => `
                <tr>
                  <td>
                    <strong>${qs.title}</strong>
                    <div style="font-size: 11.5px; color: var(--text-muted);">${qs.term} • ${qs.duration} • ${qs.questions.length} Questions</div>
                  </td>
                  <td><span class="badge badge-primary">${qs.subjectName}</span></td>
                  <td>${qs.teacherName}</td>
                  <td><strong>${qs.totalMarks} Marks</strong></td>
                  <td>
                    <span class="badge ${qs.status === 'Approved' ? 'badge-success' : qs.status === 'Submitted' ? 'badge-warning' : qs.status === 'Revision Requested' ? 'badge-danger' : 'badge-neutral'}">
                      ${qs.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.previewQuestionSet('${qs.id}')"><i data-lucide="eye"></i> View / Print Paper</button>
                  </td>
                </tr>
              `).join("") : `
                <tr>
                  <td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">
                    No question sets submitted for this class yet. Click <strong>AI Generate Exam Questions</strong> to create a standard Nigerian exam paper.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("btn-open-ai-generator")?.addEventListener("click", () => {
      openAIGeneratorModal(currentClass);
    });

    document.getElementById("btn-admin-compose-exam")?.addEventListener("click", () => {
      openExamBuilderModal(currentClass);
    });
  }

  // WORKSPACE TAB 4: RESULTS & BROADSHEET (Requirements 5 & 7)
  function renderClassResultsTab(tabContainer, currentClass, isAdmin) {
    const broadsheetData = store.getCombinedClassResults(currentClass.id, currentClass.session, activeTermFilter);
    const { students, subjects, broadsheet } = broadsheetData;

    tabContainer.innerHTML = `
      <div class="view-header" style="margin-bottom: 16px;">
        <div class="view-title-group">
          <h2 style="font-size: 18px; font-weight: 700; color: var(--text-heading);">${currentClass.name} Results Broadsheet</h2>
          <p>Terminal Grades Summary • ${currentClass.session} Academic Session • ${activeTermFilter}</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-success" id="btn-class-promote-passed"><i data-lucide="trending-up"></i> Promote Passed Students</button>
          <button class="btn btn-primary" id="btn-print-all-results"><i data-lucide="printer"></i> Print All Results</button>
          <button class="btn btn-secondary" id="btn-print-broadsheet"><i data-lucide="printer"></i> Print Class Broadsheet</button>
          <button class="btn btn-secondary" id="btn-download-csv"><i data-lucide="download"></i> Download CSV</button>
          ${!isAdmin ? `<button class="btn btn-success" id="btn-teacher-submit-results"><i data-lucide="send"></i> Submit Results to Admin</button>` : ''}
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table" style="font-size: 13px;">
            <thead>
              <tr>
                <th style="width: 5%;">Rank</th>
                <th>Student</th>
                <th>ID</th>
                ${subjects.map(s => `<th style="text-align:center;">${s.name.substring(0, 10)}</th>`).join("")}
                <th style="text-align:center;">Total</th>
                <th style="text-align:center;">Average</th>
                <th style="text-align:center;">Grade</th>
                <th style="text-align: right;">Report Card</th>
              </tr>
            </thead>
            <tbody>
              ${broadsheet.map((row) => `
                <tr>
                  <td><strong>${row.position || '-'}</strong></td>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <img src="${row.student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100'}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;" />
                      <strong>${row.student.name}</strong>
                    </div>
                  </td>
                  <td><code>${row.student.studentId}</code></td>
                  ${subjects.map(s => {
                    const sc = row.subjectScores[s.id];
                    return `<td style="text-align:center; font-weight:600;">${sc && sc.total !== null ? sc.total : '-'}</td>`;
                  }).join("")}
                  <td style="text-align:center; font-weight:bold; color:var(--primary);">${row.totalSum || '-'}</td>
                  <td style="text-align:center; font-weight:bold;">${row.average !== null ? row.average : '-'}</td>
                  <td style="text-align:center;"><span class="badge ${row.overallGrade === 'A' ? 'badge-success' : 'badge-primary'}">${row.overallGrade || '-'}</span></td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.previewReportCard('${row.student.id}', '${currentClass.id}')"><i data-lucide="file-text"></i> Report Card</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("btn-print-all-results")?.addEventListener("click", () => {
      window.exportUtils.printAllClassResults(currentClass.id, currentClass.session, activeTermFilter);
    });

    document.getElementById("btn-print-broadsheet")?.addEventListener("click", () => {
      window.exportUtils.printClassBroadsheet(broadsheetData);
    });

    document.getElementById("btn-download-csv")?.addEventListener("click", () => {
      window.exportUtils.downloadClassBroadsheetCSV(broadsheetData);
    });

    document.getElementById("btn-class-promote-passed")?.addEventListener("click", () => {
      openBatchPromoteModal(currentClass.id, currentClass.session, activeTermFilter);
    });

    document.getElementById("btn-teacher-submit-results")?.addEventListener("click", () => {
      showToast("Class results submitted to Admin for terminal review & publication.", "success");
    });
  }

  // ==========================================================================
  // ADMIN STUDENTS MANAGEMENT (Prominent Class Selection - Requirement 9)
  // ==========================================================================
  let selectedStudentClassId = null;

  function renderAdminStudents(container) {
    const availableSessions = store.getAvailableSessions();
    const currentSessionClasses = store.getClasses(activeSessionFilter);

    if (!selectedStudentClassId || !currentSessionClasses.some(c => c.id === selectedStudentClassId)) {
      selectedStudentClassId = currentSessionClasses[0]?.id || (store.getClasses()[0]?.id || "cls_2026_ss2a");
    }

    const isAllClasses = selectedStudentClassId === "all";
    const selectedClass = isAllClasses ? null : (store.getClassById(selectedStudentClassId) || currentSessionClasses[0]);
    const classStudents = store.getStudents(activeSessionFilter, selectedStudentClassId);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Student Information & Placement Registry</h1>
          <p>Class-specific student directory • Academic Session: <strong>${activeSessionFilter}</strong></p>
        </div>
        <div class="view-actions">
          <select class="form-select" id="stu-session-filter" style="width: 160px;" title="Academic Session Filter">
            ${availableSessions.map(s => `<option value="${s}" ${s === activeSessionFilter ? 'selected' : ''}>${s} Session</option>`).join("")}
          </select>
          <button class="btn btn-primary" id="btn-add-new-student"><i data-lucide="user-plus"></i> Add Student</button>
        </div>
      </div>

      <!-- Prominent Class Indicator & Selector Banner (Requirement 9 & Audio 9) -->
      <div class="student-class-hero-banner">
        <div style="display:flex; align-items:center; gap:14px;">
          <div class="brand-crest" style="width:44px; height:44px; font-size:16px; background:#0f172a; box-shadow:none;">
            <i data-lucide="users" style="width:22px; height:22px;"></i>
          </div>
          <div>
            <div style="font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted);">Current Class View</div>
            <h2 style="font-size:20px; font-weight:800; color:var(--text-heading); margin:0;">
              ${isAllClasses ? 'All Classes Student Directory' : (selectedClass ? selectedClass.name + ' Student List' : 'Student List')}
            </h2>
            <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">
              Session: <strong>${activeSessionFilter}</strong> • ${isAllClasses ? `<strong>${classStudents.length} Students Across All Classes</strong>` : `${selectedClass?.category || 'Secondary Section'} • Arm ${selectedClass?.section || 'A'} • <strong>${classStudents.length} Students Enrolled</strong>`}
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <label for="stu-class-selector" style="font-size:13px; font-weight:700; color:var(--text-heading);">Select Class:</label>
          <select class="form-select" id="stu-class-selector" style="min-width:170px; font-weight:600;">
            <option value="all" ${selectedStudentClassId === 'all' ? 'selected' : ''}>All Classes</option>
            ${currentSessionClasses.map(c => `
              <option value="${c.id}" ${c.id === selectedStudentClassId ? 'selected' : ''}>${c.name} (${c.session})</option>
            `).join("")}
          </select>
        </div>
      </div>

      <div class="filter-bar">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" class="search-input" id="student-search-query" placeholder="Search students in ${isAllClasses ? 'all classes' : (selectedClass?.name || 'class')} by name, ID, or admission number..." value="${studentSearchQuery}">
        </div>
        <div class="filter-group">
          <span style="font-size:13px; color:var(--text-muted);">Displaying students enrolled in <strong>${isAllClasses ? 'all classes in session' : (selectedClass?.name || 'the selected class')}</strong>.</span>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Admission No</th>
                <th>Academic Year</th>
                <th>Class</th>
                <th>Admission Date</th>
                <th>Status</th>
                <th style="text-align: right;">Academic Actions</th>
              </tr>
            </thead>
            <tbody id="admin-students-tbody">
              <!-- Rendered via filter function -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    const renderRows = () => {
      const q = (document.getElementById("student-search-query")?.value || "").toLowerCase().trim();
      let list = store.getStudents(activeSessionFilter, selectedStudentClassId);

      if (q) {
        list = list.filter(s => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || (s.admissionNo && s.admissionNo.toLowerCase().includes(q)));
      }

      const tbody = document.getElementById("admin-students-tbody");
      if (!tbody) return;

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 28px; color: var(--text-muted);">No student records found in ${selectedClass?.name || 'this class'} matching your search.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(s => {
        const cls = store.getClassById(s.currentClassId);
        return `
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap:10px;">
                <img src="${s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100'}" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1px solid #cbd5e1;" />
                <div>
                  <strong>${s.name}</strong>
                  <div style="font-size:11.5px; color:var(--text-muted);">${s.gender} • DOB: ${s.dob}</div>
                </div>
              </div>
            </td>
            <td><code>${s.studentId}</code></td>
            <td>${s.admissionNo || 'ADM124'}</td>
            <td><span class="badge badge-neutral">${s.currentSession}</span></td>
            <td><strong>${cls?.name || 'SS2A'}</strong></td>
            <td>${s.admissionDate}</td>
            <td><span class="badge badge-success">${s.status}</span></td>
            <td style="text-align: right;">
              <div style="display:inline-flex; gap:6px;">
                <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openStudentProfile('${s.id}')" title="View Academic History"><i data-lucide="user"></i> Profile</button>
                <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openTransferModal('${s.id}')" title="Transfer Student Arm"><i data-lucide="arrow-right-left"></i> Transfer</button>
                <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openPromoteModal('${s.id}')" title="Promote Student"><i data-lucide="trending-up"></i> Promote</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      if (window.lucide) window.lucide.createIcons();
    };

    renderRows();

    // Event listeners
    document.getElementById("stu-class-selector")?.addEventListener("change", (e) => {
      selectedStudentClassId = e.target.value;
      renderAdminStudents(container);
    });

    document.getElementById("stu-session-filter")?.addEventListener("change", (e) => {
      activeSessionFilter = e.target.value;
      const classesForNewSession = store.getClasses(activeSessionFilter);
      selectedStudentClassId = classesForNewSession[0]?.id || null;
      renderAdminStudents(container);
    });

    document.getElementById("student-search-query")?.addEventListener("input", renderRows);
    document.getElementById("btn-add-new-student")?.addEventListener("click", () => openAddStudentModal(selectedStudentClassId));
  }

  // ==========================================================================
  // ADMIN TEACHERS MANAGEMENT (Working Add Teacher & Assign - Requirement 9)
  // ==========================================================================
  function renderAdminTeachers(container) {
    const teachers = store.getTeachers();

    const filteredTeachers = teacherSearchQuery
      ? teachers.filter(t => t.name.toLowerCase().includes(teacherSearchQuery.toLowerCase()) || t.specialization.toLowerCase().includes(teacherSearchQuery.toLowerCase()))
      : teachers;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Teacher Directory & Academic Assignments</h1>
          <p>Manage School Faculty, Qualifications, and Class & Subject Assignments</p>
        </div>
        <div class="view-actions">
          <!-- Requirement 9: Add Teacher Button -->
          <button class="btn btn-primary" id="btn-add-new-teacher"><i data-lucide="user-plus"></i> Add Teacher</button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" class="search-input" id="teacher-search-input" placeholder="Search teacher by name or subject specialization..." value="${teacherSearchQuery}">
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Teacher ID</th>
                <th>Specialization & Qualification</th>
                <th>Assigned Classes & Subjects</th>
                <th>Contact</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTeachers.map(t => {
                const assignments = store.getTeacherAssignments(t.id);
                return `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${t.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100'}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;" />
                        <div>
                          <strong>${t.name}</strong>
                          <div style="font-size:11.5px; color:var(--text-muted);">${t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><code>${t.teacherId}</code></td>
                    <td>
                      <div style="font-weight:600;">${t.specialization}</div>
                      <div style="font-size:11.5px; color:var(--text-muted);">${t.qualification}</div>
                    </td>
                    <td>
                      <div style="display:flex; flex-wrap:wrap; gap:4px; max-width:280px;">
                        ${assignments.length > 0 ? assignments.map(a => {
                          const cls = store.getClassById(a.classId);
                          const sub = store.getSubjectById(a.subjectId);
                          return `<span class="badge badge-primary">${cls?.name || 'Class'}: ${sub?.name || 'Sub'}</span>`;
                        }).join("") : `<span style="font-size:11.5px; color:var(--text-subtle);">No classes assigned</span>`}
                      </div>
                    </td>
                    <td>${t.phone}</td>
                    <td><span class="badge ${t.status === 'Active' ? 'badge-success' : 'badge-neutral'}">${t.status}</span></td>
                    <td style="text-align: right;">
                      <!-- Requirement 9: Assign Button -->
                      <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openAssignTeacherModal('${t.id}')"><i data-lucide="plus"></i> Assign</button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("teacher-search-input")?.addEventListener("input", (e) => {
      teacherSearchQuery = e.target.value;
      renderAdminTeachers(container);
    });

    document.getElementById("btn-add-new-teacher")?.addEventListener("click", () => openAddTeacherModal());
  }

  // ==========================================================================
  // ADMIN QUESTIONS MANAGEMENT ("Exam Questions" - Requirement 10 & Voice Note 5)
  // ==========================================================================
  function renderAdminQuestions(container) {
    const availableSessions = store.getAvailableSessions();
    const availableTerms = store.getAvailableTerms();
    const allClasses = store.getClasses(questionSessionFilter);
    const allSubjects = store.getSubjects();

    // Get question sets with session & term
    let rawQuestionSets = store.getQuestionSets({ session: questionSessionFilter, term: questionTermFilter });
    const allSubmittedSets = store.getQuestionSets({ status: "Submitted" });
    const allApprovedSets = store.getQuestionSets({ status: "Approved" });
    const questionBank = store.getQuestionBank();

    // Calculate class submission and approval statistics
    const classIdsWithSubmissions = new Set(rawQuestionSets.map(qs => qs.classId));
    const classIdsWithApproved = new Set(rawQuestionSets.filter(qs => qs.status === "Approved").map(qs => qs.classId));
    const totalClassesInSession = allClasses.length;

    // Apply secondary filters (Class, Subject, Search Query)
    let filteredSets = rawQuestionSets;
    if (questionClassFilter !== "all") {
      filteredSets = filteredSets.filter(qs => qs.classId === questionClassFilter);
    }
    if (questionSubjectFilter !== "all") {
      filteredSets = filteredSets.filter(qs => qs.subjectId === questionSubjectFilter);
    }
    if (questionStatusFilter !== "all") {
      filteredSets = filteredSets.filter(qs => qs.status === questionStatusFilter);
    }
    if (questionSearchQuery) {
      const q = questionSearchQuery.toLowerCase().trim();
      filteredSets = filteredSets.filter(qs => 
        qs.title.toLowerCase().includes(q) || 
        qs.subjectName.toLowerCase().includes(q) || 
        qs.teacherName.toLowerCase().includes(q) ||
        (qs.className && qs.className.toLowerCase().includes(q))
      );
    }

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Exam Questions & Official Question Bank</h1>
          <p>Review submitted teacher questions, approve for Question Bank, and generate final examination papers</p>
        </div>
        <div class="view-actions">
          <select class="form-select" id="exam-session-filter" style="width:150px;">
            ${availableSessions.map(s => `<option value="${s}" ${s === questionSessionFilter ? 'selected' : ''}>${s} Session</option>`).join("")}
          </select>
          <select class="form-select" id="exam-term-filter" style="width:140px;">
            ${availableTerms.map(t => `<option value="${t}" ${t === questionTermFilter ? 'selected' : ''}>${t}</option>`).join("")}
          </select>
          <button class="btn btn-primary" id="btn-compose-official-exam"><i data-lucide="file-plus"></i> Compose Official Exam Paper</button>
        </div>
      </div>

      <!-- KPI Statistics Cards (Clean, Arranged & Responsive) -->
      <div class="stats-grid">
        <div class="kpi-card">
          <div class="kpi-icon-box purple"><i data-lucide="inbox"></i></div>
          <div class="kpi-info">
            <h4>Submitted Question Sets</h4>
            <div class="kpi-value">${allSubmittedSets.length}</div>
            <div class="kpi-subtext">Requires Admin Review</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box emerald"><i data-lucide="check-circle"></i></div>
          <div class="kpi-info">
            <h4>Approved Bank Items</h4>
            <div class="kpi-value">${questionBank.length}</div>
            <div class="kpi-subtext">Available for Exam Papers</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box amber"><i data-lucide="school"></i></div>
          <div class="kpi-info">
            <h4>Classes Submitted</h4>
            <div class="kpi-value">${classIdsWithSubmissions.size} / ${totalClassesInSession}</div>
            <div class="kpi-subtext">Active Class Arms</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box orange"><i data-lucide="award"></i></div>
          <div class="kpi-info">
            <h4>Classes Approved</h4>
            <div class="kpi-value">${classIdsWithApproved.size} / ${totalClassesInSession}</div>
            <div class="kpi-subtext">Ready for Terminal Exam</div>
          </div>
        </div>
      </div>

      <!-- Enhanced Filter Bar (Filter by Subject, Class, and Status - Voice Note 5) -->
      <div class="filter-bar">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" class="search-input" id="exam-search-input" placeholder="Search by topic, subject, or teacher name..." value="${questionSearchQuery}">
        </div>

        <div class="filter-group">
          <!-- Class Filter -->
          <select class="form-select" id="exam-class-filter" style="width: 140px;">
            <option value="all">All Classes</option>
            ${allClasses.map(c => `<option value="${c.id}" ${c.id === questionClassFilter ? 'selected' : ''}>${c.name}</option>`).join("")}
          </select>

          <!-- Subject Filter -->
          <select class="form-select" id="exam-subject-filter" style="width: 160px;">
            <option value="all">All Subjects</option>
            ${allSubjects.map(s => `<option value="${s.id}" ${s.id === questionSubjectFilter ? 'selected' : ''}>${s.name}</option>`).join("")}
          </select>

          <!-- Status Filter -->
          <select class="form-select" id="exam-status-filter" style="width: 140px;">
            <option value="all" ${questionStatusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="Submitted" ${questionStatusFilter === 'Submitted' ? 'selected' : ''}>Submitted</option>
            <option value="Approved" ${questionStatusFilter === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Revision Requested" ${questionStatusFilter === 'Revision Requested' ? 'selected' : ''}>Revision Needed</option>
            <option value="Draft" ${questionStatusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
          </select>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Question Set Title</th>
                <th>Class & Session</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Marks</th>
                <th>Status</th>
                <th style="text-align: right;">Review Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSets.length > 0 ? filteredSets.map(qs => `
                <tr>
                  <td>
                    <strong>${qs.title}</strong>
                    <div style="font-size: 11.5px; color: var(--text-muted);">${qs.term} • ${qs.questions.length} Questions</div>
                  </td>
                  <td><strong>${qs.className}</strong> <span class="badge badge-neutral">${qs.session}</span></td>
                  <td><span class="badge badge-primary">${qs.subjectName}</span></td>
                  <td>${qs.teacherName}</td>
                  <td><strong>${qs.totalMarks} Marks</strong></td>
                  <td>
                    <span class="badge ${qs.status === 'Approved' ? 'badge-success' : qs.status === 'Submitted' ? 'badge-warning' : qs.status === 'Revision Requested' ? 'badge-danger' : 'badge-neutral'}">
                      ${qs.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-primary btn-sm" onclick="window.appHandlers.openQuestionReviewModal('${qs.id}')"><i data-lucide="check-square"></i> Review Set</button>
                  </td>
                </tr>
              `).join("") : `
                <tr><td colspan="7" style="text-align:center; padding:28px; color:var(--text-muted);">No question sets found matching the selected filters.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("exam-session-filter")?.addEventListener("change", (e) => {
      questionSessionFilter = e.target.value;
      renderAdminQuestions(container);
    });

    document.getElementById("exam-term-filter")?.addEventListener("change", (e) => {
      questionTermFilter = e.target.value;
      renderAdminQuestions(container);
    });

    document.getElementById("exam-class-filter")?.addEventListener("change", (e) => {
      questionClassFilter = e.target.value;
      renderAdminQuestions(container);
    });

    document.getElementById("exam-subject-filter")?.addEventListener("change", (e) => {
      questionSubjectFilter = e.target.value;
      renderAdminQuestions(container);
    });

    document.getElementById("exam-status-filter")?.addEventListener("change", (e) => {
      questionStatusFilter = e.target.value;
      renderAdminQuestions(container);
    });

    document.getElementById("exam-search-input")?.addEventListener("input", (e) => {
      questionSearchQuery = e.target.value;
      renderAdminQuestions(container);
    });

    document.getElementById("btn-compose-official-exam")?.addEventListener("click", () => openExamBuilderModal());
  }

  // ==========================================================================
  // ADMIN RESULT MANAGEMENT (Revamped 2-Step Workflow - Requirement 11)
  // Step 1: Class Selection Hub
  // Step 2: Class Results Details (Tab 1: Students Results / Tab 2: Teacher Submissions & Approval)
  // ==========================================================================
  function renderAdminResults(container) {
    const availableSessions = store.getAvailableSessions();
    const availableTerms = store.getAvailableTerms();
    const classes = store.getClasses(resultSession);

    if (resultViewMode === "grid") {
      // ----------------------------------------------------------------------
      // STEP 1: CLASS SELECTION & OVERVIEW LIST
      // ----------------------------------------------------------------------
      container.innerHTML = `
        <div class="view-header">
          <div class="view-title-group">
            <h1>Result Management & Approval Hub</h1>
            <p>Select a class to review individual student report cards and approve teacher score submissions</p>
          </div>
          <div class="view-actions">
            <select class="form-select" id="res-session-select" style="width: 150px;">
              ${availableSessions.map(s => `<option value="${s}" ${s === resultSession ? 'selected' : ''}>${s} Session</option>`).join("")}
            </select>
            <select class="form-select" id="res-term-select" style="width: 140px;">
              ${availableTerms.map(t => `<option value="${t}" ${t === resultTerm ? 'selected' : ''}>${t}</option>`).join("")}
            </select>
          </div>
        </div>

        <div class="result-class-grid">
          ${classes.map(c => {
            const overview = store.getClassSubmissionOverview(c.id, resultSession, resultTerm);
            const totalSubs = overview.length;
            const submittedSubs = overview.filter(o => o.status === "Submitted" || o.status === "Approved" || o.status === "Published").length;
            const approvedSubs = overview.filter(o => o.status === "Approved" || o.status === "Published").length;
            const percent = totalSubs > 0 ? Math.round((submittedSubs / totalSubs) * 100) : 0;
            
            let statusBadge = `<span class="badge badge-neutral">Not Started</span>`;
            if (approvedSubs === totalSubs && totalSubs > 0) {
              statusBadge = `<span class="badge badge-success">All Approved</span>`;
            } else if (submittedSubs === totalSubs && totalSubs > 0) {
              statusBadge = `<span class="badge badge-warning">Pending Admin Approval</span>`;
            } else if (submittedSubs > 0) {
              statusBadge = `<span class="badge badge-primary">In Progress (${submittedSubs}/${totalSubs})</span>`;
            }

            return `
              <div class="result-class-card" data-result-class-id="${c.id}">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="font-family:var(--font-display); font-size:22px; font-weight:800; color:var(--text-heading);">${c.name}</div>
                    ${statusBadge}
                  </div>
                  <div style="font-size:12.5px; color:var(--text-muted);">${c.category || 'Secondary Section'} • Arm ${c.section || 'A'}</div>

                  <div style="margin: 14px 0 6px 0; font-size: 13px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-weight:600;">
                      <span>Score Submissions:</span>
                      <span style="color:var(--primary);">${submittedSubs} / ${totalSubs} Subjects</span>
                    </div>
                    <div class="result-progress-bar">
                      <div class="result-progress-fill" style="width: ${percent}%;"></div>
                    </div>
                  </div>

                  <div style="font-size:12px; color:var(--text-subtle); margin-top:8px;">
                    Enrolled: <strong>${c.studentCount} Students</strong> • Session: <strong>${c.session}</strong>
                  </div>
                </div>

                <button class="btn btn-primary btn-sm" style="margin-top:16px; width:100%;" onclick="window.appHandlers.selectResultClass('${c.id}')">
                  <i data-lucide="arrow-right"></i> Manage Class Results
                </button>
              </div>
            `;
          }).join("")}
        </div>
      `;

      document.getElementById("res-session-select")?.addEventListener("change", (e) => {
        resultSession = e.target.value;
        renderAdminResults(container);
      });

      document.getElementById("res-term-select")?.addEventListener("change", (e) => {
        resultTerm = e.target.value;
        renderAdminResults(container);
      });

      container.querySelectorAll("[data-result-class-id]").forEach(card => {
        card.addEventListener("click", (e) => {
          if (e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
            const cId = card.getAttribute("data-result-class-id");
            resultClassId = cId;
            resultViewMode = "detail";
            renderAdminResults(container);
          }
        });
      });

    } else {
      // ----------------------------------------------------------------------
      // STEP 2: DEDICATED CLASS RESULTS WORKSPACE (Dual-Tab)
      // ----------------------------------------------------------------------
      const selectedClass = store.getClassById(resultClassId) || classes[0];
      const broadsheetData = store.getCombinedClassResults(resultClassId, resultSession, resultTerm);
      const { students, subjects, broadsheet } = broadsheetData;
      const submissionOverview = store.getClassSubmissionOverview(resultClassId, resultSession, resultTerm);

      container.innerHTML = `
        <button class="workspace-back-btn" id="btn-back-to-class-list">
          <i data-lucide="arrow-left"></i> Back to Classes Overview
        </button>

        <!-- Class Hero Bar -->
        <div class="class-hero-selector-bar">
          <div class="class-hero-left">
            <div class="class-hero-badge">${selectedClass?.name.substring(0, 3) || 'SS2'}</div>
            <div class="class-hero-info">
              <h1>${selectedClass?.name || 'SS2A'} Results Center</h1>
              <p>${resultSession} Academic Session • ${resultTerm} • ${students.length} Enrolled Students</p>
            </div>
          </div>

          <div class="class-selector-dropdown-box">
            <select class="class-select-input" id="result-class-switch">
              ${classes.map(c => `<option value="${c.id}" ${c.id === resultClassId ? 'selected' : ''}>${c.name}</option>`).join("")}
            </select>
            <button class="btn btn-success btn-sm" id="btn-approve-all-subjects" style="padding:8px 14px;">
              <i data-lucide="check-circle-2"></i> Approve All Subjects
            </button>
          </div>
        </div>

        <!-- Result Management Tabs -->
        <div class="workspace-tabs-bar">
          <button class="workspace-tab-btn ${activeResultTab === 'students' ? 'active' : ''}" id="res-tab-students">
            <i data-lucide="users"></i> Students Results & Report Cards (${students.length})
          </button>
          <button class="workspace-tab-btn ${activeResultTab === 'submissions' ? 'active' : ''}" id="res-tab-submissions">
            <i data-lucide="check-circle-2"></i> Teacher Score Submissions & Approval (${submissionOverview.length})
          </button>
        </div>

        <!-- Tab 1: Students Results Broadsheet -->
        <div id="res-content-students" style="${activeResultTab === 'students' ? 'display:block;' : 'display:none;'}">
          <div class="view-header" style="margin-bottom: 12px;">
            <div class="view-title-group">
              <h2 style="font-size: 16px; font-weight: 700; color: var(--text-heading);">Consolidated Class Broadsheet & Individual Transcripts</h2>
              <p style="font-size:12px; color:var(--text-muted);">Preview results and broadsheets before publishing official transcripts</p>
            </div>
            <div class="view-actions">
              <button class="btn btn-success btn-sm" id="btn-admin-promote-passed"><i data-lucide="trending-up"></i> Promote Passed Students</button>
              <button class="btn btn-primary btn-sm" id="btn-print-all-results-tab"><i data-lucide="printer"></i> Print All Results</button>
              <button class="btn btn-secondary btn-sm" id="btn-print-broadsheet-tab"><i data-lucide="printer"></i> Print Class Broadsheet</button>
              <button class="btn btn-secondary btn-sm" id="btn-download-csv-tab"><i data-lucide="download"></i> Download CSV</button>
              <button class="btn btn-outline-primary btn-sm" id="btn-publish-official-results"><i data-lucide="globe"></i> Publish Official Results</button>
            </div>
          </div>

          <div class="table-card">
            <div class="table-responsive">
              <table class="data-table" style="font-size: 13px;">
                <thead>
                  <tr>
                    <th style="width: 5%;">Rank</th>
                    <th>Student</th>
                    <th>Student ID</th>
                    ${subjects.map(s => `<th style="text-align:center;">${s.name.substring(0, 10)}</th>`).join("")}
                    <th style="text-align:center;">Total</th>
                    <th style="text-align:center;">Average</th>
                    <th style="text-align:center;">Grade</th>
                    <th style="text-align: right;">Report Card Preview</th>
                  </tr>
                </thead>
                <tbody>
                  ${broadsheet.map((row) => `
                    <tr>
                      <td><strong>${row.position || '-'}</strong></td>
                      <td>
                        <div style="display:flex; align-items:center; gap:8px;">
                          <img src="${row.student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100'}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;" />
                          <strong>${row.student.name}</strong>
                        </div>
                      </td>
                      <td><code>${row.student.studentId}</code></td>
                      ${subjects.map(s => {
                        const sc = row.subjectScores[s.id];
                        return `<td style="text-align:center; font-weight:600;">${sc && sc.total !== null ? sc.total : '-'}</td>`;
                      }).join("")}
                      <td style="text-align:center; font-weight:bold; color:var(--primary);">${row.totalSum || '-'}</td>
                      <td style="text-align:center; font-weight:bold;">${row.average !== null ? row.average : '-'}</td>
                      <td style="text-align:center;"><span class="badge ${row.overallGrade === 'A' ? 'badge-success' : 'badge-primary'}">${row.overallGrade || '-'}</span></td>
                      <td style="text-align: right;">
                        <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.previewReportCard('${row.student.id}', '${resultClassId}')" title="Preview student report card before publication"><i data-lucide="eye"></i> Preview / View</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 2: Teacher Score Submissions & Approval -->
        <div id="res-content-submissions" style="${activeResultTab === 'submissions' ? 'display:block;' : 'display:none;'}">
          <div class="view-header" style="margin-bottom: 12px;">
            <div class="view-title-group">
              <h2 style="font-size: 16px; font-weight: 700; color: var(--text-heading);">Subject Score Submission & Approval Matrix</h2>
              <p>Review and approve teacher continuous assessment and exam score submissions</p>
            </div>
          </div>

          <div class="table-card">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assigned Teacher</th>
                    <th>Score Entry Progress</th>
                    <th>Submission Status</th>
                    <th style="text-align: right;">Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${submissionOverview.map(sub => `
                    <tr>
                      <td><strong>${sub.subjectName}</strong></td>
                      <td>
                        <div style="font-weight:600;">${sub.teacherName}</div>
                      </td>
                      <td>
                        <span class="badge ${sub.enteredCount === sub.totalStudents ? 'badge-success' : 'badge-warning'}">
                          ${sub.enteredCount} / ${sub.totalStudents} Students Graded
                        </span>
                      </td>
                      <td>
                        <span class="badge ${sub.status === 'Approved' || sub.status === 'Published' ? 'badge-success' : sub.status === 'Submitted' ? 'badge-warning' : sub.status === 'Returned' ? 'badge-danger' : 'badge-neutral'}">
                          ${sub.status}
                        </span>
                      </td>
                      <td style="text-align: right;">
                        <div style="display:inline-flex; gap:6px;">
                          <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openTeacherSubjectScoreReview('${sub.classId}', '${sub.subjectId}')">
                            <i data-lucide="eye"></i> Review Scores
                          </button>
                          ${sub.status === 'Submitted' ? `
                            <button class="btn btn-success btn-sm" onclick="window.appHandlers.adminApproveSubjectResult('${sub.classId}', '${sub.subjectId}')">
                              <i data-lucide="check"></i> Approve
                            </button>
                          ` : ''}
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      // Detail View Listeners
      document.getElementById("btn-back-to-class-list")?.addEventListener("click", () => {
        resultViewMode = "grid";
        renderAdminResults(container);
      });

      document.getElementById("result-class-switch")?.addEventListener("change", (e) => {
        resultClassId = e.target.value;
        renderAdminResults(container);
      });

      document.getElementById("btn-print-all-results-tab")?.addEventListener("click", () => {
        window.exportUtils.printAllClassResults(resultClassId, resultSession, resultTerm);
      });

      document.getElementById("btn-admin-promote-passed")?.addEventListener("click", () => {
        openBatchPromoteModal(resultClassId, resultSession, resultTerm);
      });

      document.getElementById("res-tab-students")?.addEventListener("click", () => {
        activeResultTab = "students";
        renderAdminResults(container);
      });

      document.getElementById("res-tab-submissions")?.addEventListener("click", () => {
        activeResultTab = "submissions";
        renderAdminResults(container);
      });

      document.getElementById("btn-print-broadsheet-tab")?.addEventListener("click", () => {
        window.exportUtils.printClassBroadsheet(broadsheetData);
      });

      document.getElementById("btn-download-csv-tab")?.addEventListener("click", () => {
        window.exportUtils.downloadClassBroadsheetCSV(broadsheetData);
      });

      document.getElementById("btn-publish-official-results")?.addEventListener("click", () => {
        store.adminReviewResults(resultClassId, "all", "Published", "Published officially.", resultSession, resultTerm);
        showToast(`Official results for ${selectedClass?.name} (${resultSession}) have been published.`, "success");
      });

      document.getElementById("btn-approve-all-subjects")?.addEventListener("click", () => {
        store.adminApproveAllClassResults(resultClassId, resultSession, resultTerm);
        renderAdminResults(container);
        showToast(`Approved all submitted subject results for ${selectedClass?.name}.`, "success");
      });
    }
  }

  // ==========================================================================
  // ADMIN SCHOOL SETTINGS & AUDIT LOG (Section 56-57 of PRD)
  // ==========================================================================
  function renderAdminSettings(container) {
    const school = store.getSchool();
    const auditLogs = store.getAuditLogs();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>School System Settings & Audit Configuration</h1>
          <p>Configure Academic Sessions, Score Weighting, Result Templates, and Review Audit Trail</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" id="btn-save-settings"><i data-lucide="save"></i> Save Settings</button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
        <div class="table-card" style="padding:22px;">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">School Identity & Contact Info</h3>
          <div class="form-group">
            <label class="form-label">School Name</label>
            <input type="text" class="form-input" id="set-school-name" value="${school.name}">
          </div>
          <div class="form-group">
            <label class="form-label">School Motto</label>
            <input type="text" class="form-input" id="set-school-motto" value="${school.motto}">
          </div>
          <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" class="form-input" id="set-school-addr" value="${school.address}">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="form-group">
              <label class="form-label">Principal Name</label>
              <input type="text" class="form-input" id="set-principal-name" value="${school.principalName}">
            </div>
            <div class="form-group">
              <label class="form-label">Principal Title</label>
              <input type="text" class="form-input" id="set-principal-title" value="${school.principalTitle}">
            </div>
          </div>
        </div>

        <div class="table-card" style="padding:22px;">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">Score Weighting & Terminal Term</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:16px;">
            <div class="form-group">
              <label class="form-label">Projects (%)</label>
              <input type="number" class="form-input" id="set-weight-project" value="${school.projectWeight || 10}">
            </div>
            <div class="form-group">
              <label class="form-label">Assessments (%)</label>
              <input type="number" class="form-input" id="set-weight-assess" value="${school.assessmentWeight || 20}">
            </div>
            <div class="form-group">
              <label class="form-label">Terminal Exam (%)</label>
              <input type="number" class="form-input" id="set-weight-exam" value="${school.examWeight || 70}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Active Academic Session</label>
            <select class="form-select" id="set-current-session">
              ${store.getAvailableSessions().map(s => `<option value="${s}" ${s === school.currentSession ? 'selected' : ''}>${s}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Active Academic Term</label>
            <select class="form-select" id="set-current-term">
              ${store.getAvailableTerms().map(t => `<option value="${t}" ${t === school.currentTerm ? 'selected' : ''}>${t}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="view-header" style="margin-bottom: 12px;">
        <div class="view-title-group">
          <h2 style="font-size: 16px; font-weight: 700; color: var(--text-heading);">Administrative Audit Trail (Full Log)</h2>
        </div>
      </div>
      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table" style="font-size:12.5px;">
            <thead>
              <tr>
                <th>User / Role</th>
                <th>Action</th>
                <th>Record Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${auditLogs.map(l => `
                <tr>
                  <td><strong>${l.user}</strong> <span class="badge ${l.role === 'Admin' ? 'badge-primary' : 'badge-neutral'}">${l.role}</span></td>
                  <td><span class="badge badge-success">${l.action}</span></td>
                  <td>${l.record}</td>
                  <td style="color:var(--text-muted);">${l.timestamp}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("btn-save-settings")?.addEventListener("click", () => {
      const name = document.getElementById("set-school-name")?.value;
      const motto = document.getElementById("set-school-motto")?.value;
      const address = document.getElementById("set-school-addr")?.value;
      const principalName = document.getElementById("set-principal-name")?.value;
      const principalTitle = document.getElementById("set-principal-title")?.value;
      const projectWeight = Number(document.getElementById("set-weight-project")?.value);
      const assessmentWeight = Number(document.getElementById("set-weight-assess")?.value);
      const examWeight = Number(document.getElementById("set-weight-exam")?.value);
      const currentSession = document.getElementById("set-current-session")?.value;
      const currentTerm = document.getElementById("set-current-term")?.value;

      store.updateSchoolSettings({
        name,
        motto,
        address,
        principalName,
        principalTitle,
        projectWeight,
        assessmentWeight,
        examWeight,
        currentSession,
        currentTerm
      });

      renderSidebar();
      renderHeader();
      showToast("School settings updated successfully.", "success");
    });
  }

  // ==========================================================================
  // TIMETABLE & CLASS SCHEDULE PLANNER WITH CONFLICT DETECTION
  // ==========================================================================
  function renderAdminTimetable(container) {
    const availableSessions = store.getAvailableSessions();
    const availableTerms = store.getAvailableTerms();
    const classes = store.getClasses(activeSessionFilter);
    const teachers = store.getAvailableTeachers();
    const venues = store.getVenues();
    const periods = store.getTimetablePeriods();
    const days = store.getTimetableDays();

    if (classes.length > 0 && !classes.some(c => c.id === timetableClassId)) {
      timetableClassId = classes[0].id;
    }

    const currentClass = store.getClassById(timetableClassId) || classes[0];
    const conflictsReport = store.getAllTimetableConflicts(activeSessionFilter, activeTermFilter);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div class="view-eyebrow">ACADEMIC SCHEDULER & LOGISTICS</div>
          <h1>Timetable & Schedule Planner</h1>
          <p>Interactive Period Matrix with Real-Time Conflict Detection • <strong>${activeSessionFilter}</strong> • <strong>${activeTermFilter}</strong></p>
        </div>
        <div class="view-actions">
          <select class="form-select" id="tt-session-select" style="width: 140px;" title="Academic Session">
            ${availableSessions.map(s => `<option value="${s}" ${s === activeSessionFilter ? 'selected' : ''}>${s}</option>`).join("")}
          </select>
          <select class="form-select" id="tt-term-select" style="width: 140px;" title="Academic Term">
            ${availableTerms.map(t => `<option value="${t}" ${t === activeTermFilter ? 'selected' : ''}>${t}</option>`).join("")}
          </select>
          <button class="btn btn-primary" id="tt-btn-add-slot"><i data-lucide="plus-circle"></i> Add Period Slot</button>
        </div>
      </div>

      <div class="timetable-hub-container">
        <!-- Live Conflict Alert Banner -->
        ${conflictsReport.totalConflicts > 0 ? `
          <div class="conflict-alert-banner">
            <div class="conflict-alert-left">
              <div class="conflict-alert-icon">
                <i data-lucide="alert-triangle"></i>
              </div>
              <div class="conflict-alert-text">
                <h4>${conflictsReport.totalConflicts} Schedule Collision${conflictsReport.totalConflicts > 1 ? 's' : ''} Detected!</h4>
                <p>Teacher double-bookings or venue collisions found for ${activeSessionFilter} (${activeTermFilter}). Click below to resolve.</p>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger" id="tt-banner-review-conflicts" style="background:#fff; font-weight:700;">
              <i data-lucide="shield-alert"></i> Review Collisions (${conflictsReport.totalConflicts})
            </button>
          </div>
        ` : ''}

        <!-- Timetable Toolbar & View Mode Switcher -->
        <div class="timetable-toolbar">
          <div class="timetable-mode-tabs">
            <button class="timetable-mode-btn ${timetableMode === 'class' ? 'active' : ''}" data-mode="class">
              <i data-lucide="layout-grid"></i> Class Schedule
            </button>
            <button class="timetable-mode-btn ${timetableMode === 'teacher' ? 'active' : ''}" data-mode="teacher">
              <i data-lucide="user-check"></i> Teacher Schedule
            </button>
            <button class="timetable-mode-btn ${timetableMode === 'master' ? 'active' : ''}" data-mode="master">
              <i data-lucide="table"></i> Master Matrix
            </button>
            <button class="timetable-mode-btn ${timetableMode === 'venues' ? 'active' : ''}" data-mode="venues">
              <i data-lucide="building"></i> Venue / Lab Occupancy
            </button>
            <button class="timetable-mode-btn ${timetableMode === 'conflicts' ? 'active' : ''}" data-mode="conflicts">
              <i data-lucide="alert-octagon"></i> Conflict Scanner
              ${conflictsReport.totalConflicts > 0 ? `<span class="badge-pill-danger">${conflictsReport.totalConflicts}</span>` : ''}
            </button>
          </div>

          <!-- Mode Specific Selectors & Quick Actions -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            ${timetableMode === 'class' ? `
              <select class="form-select" id="tt-class-picker" style="width:160px; font-weight:600;">
                ${classes.map(c => `<option value="${c.id}" ${c.id === currentClass?.id ? 'selected' : ''}>${c.name} (${c.session})</option>`).join("")}
              </select>
              <button class="btn btn-secondary btn-sm" id="tt-btn-auto-gen" title="Smart Balance Schedule without Conflicts"><i data-lucide="sparkles"></i> Auto-Generate</button>
              <button class="btn btn-secondary btn-sm" id="tt-btn-copy-class" title="Copy Schedule from another class"><i data-lucide="copy"></i> Copy</button>
              <button class="btn btn-secondary btn-sm" id="tt-btn-print" title="Print Class Timetable"><i data-lucide="printer"></i> Print</button>
              <button class="btn btn-secondary btn-sm" id="tt-btn-export-csv" title="Export CSV"><i data-lucide="download"></i> CSV</button>
              <button class="btn btn-outline-danger btn-sm" id="tt-btn-clear-class" title="Clear Class Schedule"><i data-lucide="trash-2"></i> Clear</button>
            ` : ''}

            ${timetableMode === 'teacher' ? `
              <select class="form-select" id="tt-teacher-picker" style="width:200px; font-weight:600;">
                ${teachers.map(t => `<option value="${t.id}" ${t.id === timetableTeacherId ? 'selected' : ''}>${t.name} (${t.specialization.split('&')[0]})</option>`).join("")}
              </select>
              <button class="btn btn-secondary btn-sm" id="tt-btn-print-teacher"><i data-lucide="printer"></i> Print Schedule</button>
            ` : ''}

            ${timetableMode === 'master' ? `
              <select class="form-select" id="tt-day-picker" style="width:140px; font-weight:600;">
                ${days.map(d => `<option value="${d}" ${d === timetableDayFilter ? 'selected' : ''}>${d}</option>`).join("")}
              </select>
              <button class="btn btn-secondary btn-sm" id="tt-btn-print-master"><i data-lucide="printer"></i> Print Master</button>
            ` : ''}

            ${timetableMode === 'venues' ? `
              <select class="form-select" id="tt-room-picker" style="width:240px; font-weight:600;">
                ${venues.map(v => `<option value="${v.name}" ${v.name === timetableRoom ? 'selected' : ''}>${v.name} (${v.type})</option>`).join("")}
              </select>
            ` : ''}
          </div>
        </div>

        <!-- Timetable Active View Mount -->
        <div id="tt-active-view-mount"></div>
      </div>
    `;

    // Event Listeners for Toolbar
    document.getElementById("tt-session-select")?.addEventListener("change", (e) => {
      activeSessionFilter = e.target.value;
      renderAdminTimetable(container);
      if (window.lucide) window.lucide.createIcons();
    });

    document.getElementById("tt-term-select")?.addEventListener("change", (e) => {
      activeTermFilter = e.target.value;
      renderAdminTimetable(container);
      if (window.lucide) window.lucide.createIcons();
    });

    document.getElementById("tt-btn-add-slot")?.addEventListener("click", () => {
      openTimetableSlotModal(null, currentClass?.id);
    });

    document.getElementById("tt-banner-review-conflicts")?.addEventListener("click", () => {
      timetableMode = "conflicts";
      renderAdminTimetable(container);
      if (window.lucide) window.lucide.createIcons();
    });

    container.querySelectorAll(".timetable-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        timetableMode = btn.getAttribute("data-mode");
        renderAdminTimetable(container);
        if (window.lucide) window.lucide.createIcons();
      });
    });

    // Class Mode Handlers
    document.getElementById("tt-class-picker")?.addEventListener("change", (e) => {
      timetableClassId = e.target.value;
      renderTimetableClassGrid(document.getElementById("tt-active-view-mount"), store.getClassById(timetableClassId));
      if (window.lucide) window.lucide.createIcons();
    });

    document.getElementById("tt-btn-auto-gen")?.addEventListener("click", () => {
      if (!currentClass) return;
      if (confirm(`Auto-generate a balanced, conflict-free weekly timetable for ${currentClass.name}? Any existing slots will be replaced.`)) {
        try {
          store.autoGenerateClassTimetable(currentClass.id, activeSessionFilter, activeTermFilter, true);
          showToast(`Generated conflict-free timetable for ${currentClass.name}!`, "success");
          renderAdminTimetable(container);
          if (window.lucide) window.lucide.createIcons();
        } catch (err) {
          showToast(err.message, "error");
        }
      }
    });

    document.getElementById("tt-btn-copy-class")?.addEventListener("click", () => {
      if (!currentClass) return;
      openCopyTimetableModal(currentClass.id);
    });

    document.getElementById("tt-btn-print")?.addEventListener("click", () => {
      if (!currentClass) return;
      const slots = store.getTimetableSlots({ classId: currentClass.id, session: activeSessionFilter, term: activeTermFilter });
      window.exportUtils.printTimetable(currentClass, slots, periods, days, store.getSchool(), activeSessionFilter, activeTermFilter);
    });

    document.getElementById("tt-btn-export-csv")?.addEventListener("click", () => {
      if (!currentClass) return;
      const slots = store.getTimetableSlots({ classId: currentClass.id, session: activeSessionFilter, term: activeTermFilter });
      window.exportUtils.downloadTimetableCSV(currentClass, slots, periods, days, activeSessionFilter, activeTermFilter);
      showToast(`Exported ${currentClass.name} Timetable CSV.`, "success");
    });

    document.getElementById("tt-btn-clear-class")?.addEventListener("click", () => {
      if (!currentClass) return;
      if (confirm(`Are you sure you want to clear all periods for ${currentClass.name} (${activeSessionFilter} ${activeTermFilter})?`)) {
        store.clearClassTimetable(currentClass.id, activeSessionFilter, activeTermFilter);
        showToast(`Cleared timetable for ${currentClass.name}.`, "info");
        renderAdminTimetable(container);
        if (window.lucide) window.lucide.createIcons();
      }
    });

    // Teacher Mode Handlers
    document.getElementById("tt-teacher-picker")?.addEventListener("change", (e) => {
      timetableTeacherId = e.target.value;
      renderTimetableTeacherGrid(document.getElementById("tt-active-view-mount"), timetableTeacherId);
      if (window.lucide) window.lucide.createIcons();
    });

    document.getElementById("tt-btn-print-teacher")?.addEventListener("click", () => {
      const teacher = store.getTeacherById(timetableTeacherId);
      const slots = store.getTimetableSlots({ teacherId: timetableTeacherId, session: activeSessionFilter, term: activeTermFilter });
      window.exportUtils.printTimetable({ name: `Teacher: ${teacher?.name}` }, slots, periods, days, store.getSchool(), activeSessionFilter, activeTermFilter);
    });

    // Master Mode Handlers
    document.getElementById("tt-day-picker")?.addEventListener("change", (e) => {
      timetableDayFilter = e.target.value;
      renderTimetableMasterGrid(document.getElementById("tt-active-view-mount"), timetableDayFilter);
      if (window.lucide) window.lucide.createIcons();
    });

    document.getElementById("tt-btn-print-master")?.addEventListener("click", () => {
      window.print();
    });

    // Venues Mode Handlers
    document.getElementById("tt-room-picker")?.addEventListener("change", (e) => {
      timetableRoom = e.target.value;
      renderTimetableVenueGrid(document.getElementById("tt-active-view-mount"), timetableRoom);
      if (window.lucide) window.lucide.createIcons();
    });

    // Render Sub-view
    const viewMount = document.getElementById("tt-active-view-mount");
    if (timetableMode === "class") {
      renderTimetableClassGrid(viewMount, currentClass);
    } else if (timetableMode === "teacher") {
      renderTimetableTeacherGrid(viewMount, timetableTeacherId);
    } else if (timetableMode === "master") {
      renderTimetableMasterGrid(viewMount, timetableDayFilter);
    } else if (timetableMode === "venues") {
      renderTimetableVenueGrid(viewMount, timetableRoom);
    } else if (timetableMode === "conflicts") {
      renderTimetableConflictsView(viewMount, conflictsReport);
    }
  }

  // 1. CLASS TIMETABLE GRID
  function renderTimetableClassGrid(container, classObj) {
    if (!container) return;
    if (!classObj) {
      container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text-muted);">No classes available.</div>`;
      return;
    }

    const periods = store.getTimetablePeriods();
    const days = store.getTimetableDays();
    const slots = store.getTimetableSlots({ classId: classObj.id, session: activeSessionFilter, term: activeTermFilter });
    const activePeriods = periods.filter(p => !p.isBreak);

    container.innerHTML = `
      <div class="timetable-grid-card">
        <div class="table-responsive">
          <table class="timetable-grid-table">
            <thead>
              <tr>
                <th class="timetable-day-col" style="text-align:center;">DAY</th>
                ${periods.map(p => {
                  if (p.isBreak) {
                    return `<th style="width:65px; background:#f1f5f9; color:#64748b; font-size:10.5px; padding:6px 2px;">${p.label.split('/')[0]}</th>`;
                  }
                  return `
                    <th class="timetable-period-th">
                      <div class="period-name">${p.label}</div>
                      <div class="period-time">${p.time}</div>
                    </th>
                  `;
                }).join("")}
              </tr>
            </thead>
            <tbody>
              ${days.map(day => `
                <tr>
                  <td class="timetable-day-col">${day.toUpperCase()}</td>
                  ${periods.map(p => {
                    if (p.isBreak) {
                      return `<td class="timetable-break-cell"><span style="font-size:10px; text-transform:uppercase; writing-mode:vertical-rl; transform:rotate(180deg); color:#94a3b8; font-weight:700;">Break</span></td>`;
                    }

                    const slot = slots.find(s => s.day === day && Number(s.periodNumber) === Number(p.id));
                    if (!slot) {
                      return `
                        <td class="timetable-slot-cell">
                          <button class="slot-empty-btn" onclick="window.appHandlers.openTimetableSlotModal(null, '${classObj.id}', '${day}', ${p.id})">
                            <i data-lucide="plus" style="width:14px; height:14px;"></i>
                            <span>Add</span>
                          </button>
                        </td>
                      `;
                    }

                    const sub = store.getSubjectById(slot.subjectId);
                    const tch = store.getTeacherById(slot.teacherId);
                    const slotConflicts = store.detectTimetableConflicts(slot, slot.id);
                    const hasConflict = slotConflicts.length > 0;
                    const typeClass = (slot.type || "lecture").toLowerCase().replace(/[^a-z]/g, "");

                    return `
                      <td class="timetable-slot-cell">
                        <div class="slot-card ${hasConflict ? 'has-conflict' : ''}" onclick="window.appHandlers.openTimetableSlotModal('${slot.id}', '${classObj.id}')">
                          <div class="slot-card-header">
                            <div class="slot-subject-title">${sub?.name || 'Subject'}</div>
                            <span class="slot-badge-type ${typeClass}">${slot.type || 'Lecture'}</span>
                          </div>

                          <div class="slot-teacher-info">
                            <img src="${tch?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop'}" class="slot-teacher-avatar" alt="${tch?.name}" />
                            <span>${tch?.name || 'Teacher'}</span>
                          </div>

                          <div style="display:flex; align-items:center; justify-content:space-between; gap:4px; margin-top:2px;">
                            <span class="slot-room-badge" title="Venue"><i data-lucide="map-pin" style="width:10px; height:10px;"></i> ${slot.room || 'Classroom'}</span>
                            ${hasConflict ? `
                              <span class="slot-conflict-indicator" title="${slotConflicts[0].message}">
                                <i data-lucide="alert-triangle" style="width:10px; height:10px;"></i> Clash
                              </span>
                            ` : ''}
                          </div>

                          <div class="slot-hover-actions" onclick="event.stopPropagation()">
                            <button class="slot-hover-btn" title="Edit Period" onclick="window.appHandlers.openTimetableSlotModal('${slot.id}', '${classObj.id}')">
                              <i data-lucide="edit-2" style="width:12px; height:12px;"></i>
                            </button>
                            <button class="slot-hover-btn delete" title="Delete Period" onclick="window.appHandlers.deleteTimetableSlot('${slot.id}')">
                              <i data-lucide="trash-2" style="width:12px; height:12px;"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                    `;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 2. CLASS WORKSPACE TIMETABLE TAB
  function renderClassTimetableTab(tabContainer, currentClass, isAdmin) {
    const periods = store.getTimetablePeriods();
    const days = store.getTimetableDays();
    const slots = store.getTimetableSlots({ classId: currentClass.id, session: currentClass.session });

    tabContainer.innerHTML = `
      <div class="view-header" style="margin-bottom:14px;">
        <div class="view-title-group">
          <h2 style="font-size:18px; font-weight:700; color:var(--text-heading);">${currentClass.name} Weekly Timetable & Room Allocations</h2>
          <p>Schedule for <strong>${currentClass.name}</strong> • <strong>${currentClass.session}</strong> (${slots.length} Assigned Periods)</p>
        </div>
        <div class="view-actions">
          ${isAdmin ? `
            <button class="btn btn-primary btn-sm" onclick="window.appHandlers.openTimetableSlotModal(null, '${currentClass.id}')"><i data-lucide="plus-circle"></i> Add Period</button>
            <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.autoGenerateTimetable('${currentClass.id}')"><i data-lucide="sparkles"></i> Auto-Generate</button>
          ` : ''}
          <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.printClassTimetable('${currentClass.id}')"><i data-lucide="printer"></i> Print</button>
          <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.exportClassTimetableCSV('${currentClass.id}')"><i data-lucide="download"></i> Export CSV</button>
        </div>
      </div>

      <div id="workspace-tt-grid-mount"></div>
    `;

    renderTimetableClassGrid(document.getElementById("workspace-tt-grid-mount"), currentClass);
    if (window.lucide) window.lucide.createIcons();
  }

  // 3. TEACHER TIMETABLE GRID
  function renderTimetableTeacherGrid(container, teacherId) {
    if (!container) return;
    const teacher = store.getTeacherById(teacherId) || store.getCurrentTeacher();
    if (!teacher) {
      container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text-muted);">Teacher not found.</div>`;
      return;
    }

    const periods = store.getTimetablePeriods();
    const days = store.getTimetableDays();
    const slots = store.getTimetableSlots({ teacherId: teacher.id, session: activeSessionFilter, term: activeTermFilter });

    container.innerHTML = `
      <!-- Teacher Workload Overview Banner -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:16px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="${teacher.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&fit=crop'}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);" />
          <div>
            <h3 style="font-size:16px; font-weight:700; color:var(--text-heading); margin:0;">${teacher.name}</h3>
            <div style="font-size:12.5px; color:var(--text-muted);">${teacher.specialization} • ID: <code>${teacher.teacherId}</code></div>
          </div>
        </div>

        <div style="display:flex; gap:12px;">
          <div style="background:var(--bg-subtle); padding:8px 16px; border-radius:var(--radius-md); text-align:center;">
            <div style="font-size:18px; font-weight:800; color:var(--primary);">${slots.length}</div>
            <div style="font-size:11px; color:var(--text-muted); font-weight:600;">Periods / Week</div>
          </div>
          <div style="background:var(--bg-subtle); padding:8px 16px; border-radius:var(--radius-md); text-align:center;">
            <div style="font-size:18px; font-weight:800; color:var(--success);">${35 - slots.length}</div>
            <div style="font-size:11px; color:var(--text-muted); font-weight:600;">Free Periods</div>
          </div>
        </div>
      </div>

      <div class="timetable-grid-card">
        <div class="table-responsive">
          <table class="timetable-grid-table">
            <thead>
              <tr>
                <th class="timetable-day-col" style="text-align:center;">DAY</th>
                ${periods.map(p => {
                  if (p.isBreak) return `<th style="width:65px; background:#f1f5f9; color:#64748b; font-size:10.5px; padding:6px 2px;">Break</th>`;
                  return `
                    <th class="timetable-period-th">
                      <div class="period-name">${p.label}</div>
                      <div class="period-time">${p.time}</div>
                    </th>
                  `;
                }).join("")}
              </tr>
            </thead>
            <tbody>
              ${days.map(day => `
                <tr>
                  <td class="timetable-day-col">${day.toUpperCase()}</td>
                  ${periods.map(p => {
                    if (p.isBreak) {
                      return `<td class="timetable-break-cell"><span style="font-size:10px; color:#94a3b8; font-weight:700;">Break</span></td>`;
                    }

                    const slot = slots.find(s => s.day === day && Number(s.periodNumber) === Number(p.id));
                    if (!slot) {
                      return `
                        <td class="timetable-slot-cell" style="background:#fcfdfd;">
                          <div style="height:100%; min-height:84px; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:11px; font-style:italic;">
                            Free Period
                          </div>
                        </td>
                      `;
                    }

                    const cls = store.getClassById(slot.classId);
                    const sub = store.getSubjectById(slot.subjectId);
                    const slotConflicts = store.detectTimetableConflicts(slot, slot.id);
                    const hasConflict = slotConflicts.length > 0;

                    return `
                      <td class="timetable-slot-cell">
                        <div class="slot-card ${hasConflict ? 'has-conflict' : ''}" style="border-left-color: #0284c7;">
                          <div class="slot-card-header">
                            <div class="slot-subject-title" style="color:#0369a1;">${cls?.name || 'Class'}</div>
                            <span class="slot-badge-type">${slot.type || 'Lecture'}</span>
                          </div>
                          <div style="font-size:11.5px; font-weight:600; color:var(--text-heading);">${sub?.name || 'Subject'}</div>
                          <div style="font-size:10px; color:#64748b; display:flex; align-items:center; gap:3px;">
                            <i data-lucide="map-pin" style="width:10px; height:10px;"></i> ${slot.room || 'Classroom'}
                          </div>
                          ${hasConflict ? `
                            <span class="slot-conflict-indicator" style="margin-top:2px;">
                              <i data-lucide="alert-triangle" style="width:10px; height:10px;"></i> Clash
                            </span>
                          ` : ''}
                        </div>
                      </td>
                    `;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 4. TEACHER PANEL DEDICATED TIMETABLE VIEW
  function renderTeacherTimetable(container) {
    const currentTeacher = store.getCurrentTeacher();
    const currentSession = store.getCurrentSession();
    const currentTerm = store.getSchool().currentTerm || "First Term";

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div class="view-eyebrow">TEACHING FACULTY SCHEDULE</div>
          <h1>My Weekly Teaching Timetable</h1>
          <p>Class periods, room locations, and lab schedules for <strong>${currentTeacher.name}</strong> • <strong>${currentSession}</strong> (${currentTerm})</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-secondary btn-sm" id="btn-print-teacher-panel-tt"><i data-lucide="printer"></i> Print My Schedule</button>
        </div>
      </div>

      <div id="teacher-panel-tt-mount"></div>
    `;

    renderTimetableTeacherGrid(document.getElementById("teacher-panel-tt-mount"), currentTeacher.id);

    document.getElementById("btn-print-teacher-panel-tt")?.addEventListener("click", () => {
      const periods = store.getTimetablePeriods();
      const days = store.getTimetableDays();
      const slots = store.getTimetableSlots({ teacherId: currentTeacher.id, session: currentSession, term: currentTerm });
      window.exportUtils.printTimetable({ name: `Teacher: ${currentTeacher.name}` }, slots, periods, days, store.getSchool(), currentSession, currentTerm);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // 5. MASTER SCHOOL TIMETABLE MATRIX
  function renderTimetableMasterGrid(container, day) {
    if (!container) return;
    const classes = store.getClasses(activeSessionFilter);
    const periods = store.getTimetablePeriods().filter(p => !p.isBreak);
    const targetDay = day || "Monday";

    container.innerHTML = `
      <div style="background:var(--bg-subtle); padding:10px 14px; border-radius:var(--radius-md); margin-bottom:12px; font-size:13px; font-weight:600; color:var(--text-heading);">
        Showing All Classes for <strong>${targetDay.toUpperCase()}</strong> • Session ${activeSessionFilter} (${activeTermFilter})
      </div>

      <div class="timetable-grid-card">
        <div class="table-responsive">
          <table class="timetable-grid-table">
            <thead>
              <tr>
                <th class="timetable-day-col" style="width:130px; text-align:center;">CLASS ARM</th>
                ${periods.map(p => `
                  <th class="timetable-period-th">
                    <div class="period-name">${p.label}</div>
                    <div class="period-time">${p.time}</div>
                  </th>
                `).join("")}
              </tr>
            </thead>
            <tbody>
              ${classes.map(c => {
                const classSlots = store.getTimetableSlots({ classId: c.id, session: activeSessionFilter, term: activeTermFilter, day: targetDay });
                return `
                  <tr>
                    <td class="timetable-day-col" style="font-weight:700; color:var(--primary);">${c.name}</td>
                    ${periods.map(p => {
                      const slot = classSlots.find(s => Number(s.periodNumber) === Number(p.id));
                      if (!slot) {
                        return `<td class="timetable-slot-cell" style="background:#fafafa;"><div style="text-align:center; color:#cbd5e1; font-size:11px; padding:12px 0;">—</div></td>`;
                      }
                      const sub = store.getSubjectById(slot.subjectId);
                      const tch = store.getTeacherById(slot.teacherId);
                      return `
                        <td class="timetable-slot-cell">
                          <div style="padding:4px; font-size:11.5px;">
                            <strong style="color:var(--text-heading); display:block;">${sub?.name || 'Subject'}</strong>
                            <div style="color:var(--text-muted); font-size:10.5px;">${tch?.name || 'Teacher'}</div>
                            <div style="color:#64748b; font-size:9.5px; font-style:italic;">${slot.room || ''}</div>
                          </div>
                        </td>
                      `;
                    }).join("")}
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 6. VENUE / LAB OCCUPANCY GRID
  function renderTimetableVenueGrid(container, roomName) {
    if (!container) return;
    const periods = store.getTimetablePeriods();
    const days = store.getTimetableDays();
    const slots = store.getTimetableSlots({ room: roomName, session: activeSessionFilter, term: activeTermFilter });

    container.innerHTML = `
      <div style="background:var(--bg-subtle); padding:10px 14px; border-radius:var(--radius-md); margin-bottom:12px; font-size:13px; font-weight:600; color:var(--text-heading);">
        Facility Utilization for: <strong>${roomName}</strong> • ${slots.length} Occupied Periods / Week
      </div>

      <div class="timetable-grid-card">
        <div class="table-responsive">
          <table class="timetable-grid-table">
            <thead>
              <tr>
                <th class="timetable-day-col" style="text-align:center;">DAY</th>
                ${periods.map(p => {
                  if (p.isBreak) return `<th style="width:65px; background:#f1f5f9; color:#64748b; font-size:10.5px; padding:6px 2px;">Break</th>`;
                  return `
                    <th class="timetable-period-th">
                      <div class="period-name">${p.label}</div>
                      <div class="period-time">${p.time}</div>
                    </th>
                  `;
                }).join("")}
              </tr>
            </thead>
            <tbody>
              ${days.map(day => `
                <tr>
                  <td class="timetable-day-col">${day.toUpperCase()}</td>
                  ${periods.map(p => {
                    if (p.isBreak) return `<td class="timetable-break-cell"><span style="font-size:10px; color:#94a3b8; font-weight:700;">Break</span></td>`;
                    const slot = slots.find(s => s.day === day && Number(s.periodNumber) === Number(p.id));
                    if (!slot) {
                      return `<td class="timetable-slot-cell" style="background:#fcfdfd;"><div style="height:100%; min-height:84px; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:11px;">Available</div></td>`;
                    }
                    const cls = store.getClassById(slot.classId);
                    const sub = store.getSubjectById(slot.subjectId);
                    const tch = store.getTeacherById(slot.teacherId);
                    return `
                      <td class="timetable-slot-cell">
                        <div class="slot-card" style="border-left-color: #059669; background:#f0fdf4;">
                          <div class="slot-card-header">
                            <div class="slot-subject-title" style="color:#15803d;">${cls?.name || 'Class'}</div>
                            <span class="slot-badge-type">${slot.type || 'Practical'}</span>
                          </div>
                          <div style="font-size:11.5px; font-weight:600; color:var(--text-heading);">${sub?.name}</div>
                          <div style="font-size:10px; color:var(--text-muted);">${tch?.name}</div>
                        </div>
                      </td>
                    `;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 7. CONFLICT SCANNER VIEW
  function renderTimetableConflictsView(container, report) {
    if (!container) return;

    if (report.totalConflicts === 0) {
      container.innerHTML = `
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:var(--radius-lg); padding:36px; text-align:center;">
          <div style="width:52px; height:52px; border-radius:50%; background:#dcfce7; color:#15803d; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto;">
            <i data-lucide="check-circle-2" style="width:28px; height:28px;"></i>
          </div>
          <h3 style="font-size:18px; font-weight:700; color:#166534; margin-bottom:6px;">Zero Schedule Conflicts Detected!</h3>
          <p style="font-size:13px; color:#15803d; max-width:480px; margin:0 auto;">
            All teacher schedules and facility allocations for academic session <strong>${report.session}</strong> are completely synchronized and conflict-free.
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="margin-bottom:14px;">
        <h3 style="font-size:16px; font-weight:700; color:var(--text-heading);">Conflict Diagnosis & Collision Resolver (${report.totalConflicts} Total)</h3>
        <p style="font-size:12.5px; color:var(--text-muted);">Review collisions below and click "Resolve" to swap periods or reassign faculties.</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${report.conflicts.map(c => `
          <div class="conflict-card ${c.type === 'room' ? 'warning' : ''}">
            <div class="conflict-card-details">
              <h4>
                <i data-lucide="${c.type === 'teacher' ? 'user-x' : 'map-pin-off'}" style="width:16px; height:16px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                ${c.title}
              </h4>
              <p>${c.description}</p>
            </div>
            <div style="display:flex; gap:8px; flex-shrink:0;">
              <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openTimetableSlotModal('${c.slotA.id}', '${c.slotA.classId}')">
                <i data-lucide="edit-2"></i> Edit ${c.classA?.name || 'Slot A'}
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.openTimetableSlotModal('${c.slotB.id}', '${c.slotB.classId}')">
                <i data-lucide="edit-2"></i> Edit ${c.classB?.name || 'Slot B'}
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }


  // ==========================================================================
  // TEACHER DASHBOARD & PROFILE
  // ==========================================================================
  function renderTeacherDashboard(container) {
    const currentTeacher = store.getCurrentTeacher();
    const currentSession = store.getCurrentSession();
    const teacherClasses = store.getTeacherClasses(currentTeacher.id, currentSession);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <div class="view-eyebrow">FACULTY WORKSPACE</div>
          <h1>Dashboard</h1>
          <p>Welcome, <strong>${currentTeacher.name}</strong> • Academic Year: <strong>${currentSession}</strong></p>
        </div>
      </div>

      <!-- Featured Hero Banner for Teacher -->
      <div class="hero-featured-banner">
        <div class="hero-stat-display">
          <div class="hero-stat-eyebrow">TEACHING ASSIGNMENTS • ${currentSession}</div>
          <div class="hero-stat-number">${teacherClasses.length}</div>
          <div class="hero-stat-narrative">Active class arms assigned for Continuous Assessment (CA1, CA2, Terminal Exam) score recording and broadsheet submission.</div>
        </div>
        <div class="hero-metric-cluster">
          <div class="hero-metric-item">
            <div class="hero-metric-val">${teacherClasses.reduce((acc, c) => acc + store.getClassStudents(c.id).length, 0)}</div>
            <div class="hero-metric-lbl">Students</div>
          </div>
          <div class="hero-metric-item">
            <div class="hero-metric-val">${teacherClasses.reduce((acc, c) => acc + ((c.assignedSubjects || c.subjects || []).length), 0)}</div>
            <div class="hero-metric-lbl">Subjects</div>
          </div>
        </div>
      </div>

      <div class="view-header" style="margin-bottom:14px;">
        <div class="view-title-group">
          <h2 style="font-size:18px; font-weight:700;">My Assigned Classes (${teacherClasses.length})</h2>
        </div>
      </div>

      <div class="class-grid">
        ${teacherClasses.map(c => {
          const classStudents = store.getClassStudents(c.id);
          const subs = c.assignedSubjects || c.subjects || [];
          return `
            <div class="class-card" onclick="window.appHandlers.openTeacherClassWorkspace('${c.id}')">
              <div>
                <div class="class-card-header">
                  <div class="class-name-badge">${c.name}</div>
                  <div class="class-session-tag">${c.session}</div>
                </div>
                <div style="font-size:12.5px; color:var(--text-muted);">${c.category || 'Secondary Section'} • Arm ${c.section || 'A'}</div>

                <div class="class-card-stats">
                  <div><i data-lucide="users"></i> <strong>${classStudents.length}</strong> Students</div>
                  <div><i data-lucide="book-open"></i> <strong>${subs.length}</strong> Subjects</div>
                </div>

                <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:4px;">
                  ${subs.map(s => `<span class="badge badge-primary" style="font-size:11px;">${s.name}</span>`).join("")}
                </div>
              </div>

              <div class="class-card-footer">
                <span>Enter Class Score Desk</span>
                <i data-lucide="arrow-right"></i>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderTeacherProfile(container) {
    const currentTeacher = store.getCurrentTeacher();
    const assignments = store.getTeacherAssignments(currentTeacher.id);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Teacher Profile & Credentials</h1>
          <p>${currentTeacher.name} • ${currentTeacher.teacherId}</p>
        </div>
      </div>

      <div style="max-width:700px; margin:0 auto;" class="table-card">
        <div style="padding:24px;">
          <div style="display:flex; align-items:center; gap:18px; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:18px;">
            <img src="${currentTeacher.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150'}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);" />
            <div>
              <h2 style="font-size:20px; font-weight:700;">${currentTeacher.name}</h2>
              <div style="color:var(--text-muted); font-size:13px;">${currentTeacher.specialization} • ${currentTeacher.qualification}</div>
              <div style="font-size:12px; color:var(--text-subtle); margin-top:3px;">ID: <code>${currentTeacher.teacherId}</code> • Employed: ${currentTeacher.employmentDate}</div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; font-size:13.5px; margin-bottom:20px;">
            <div><strong>Email:</strong> ${currentTeacher.email}</div>
            <div><strong>Phone:</strong> ${currentTeacher.phone}</div>
            <div><strong>Gender:</strong> ${currentTeacher.gender}</div>
            <div><strong>Address:</strong> ${currentTeacher.address}</div>
          </div>

          <h3 style="font-size:15px; font-weight:700; margin-bottom:10px;">Assigned Classes & Subjects</h3>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${assignments.map(a => {
              const cls = store.getClassById(a.classId);
              const sub = store.getSubjectById(a.subjectId);
              return `<span class="badge badge-primary" style="font-size:13px; padding:6px 12px;">${cls?.name || 'Class'}: ${sub?.name || 'Sub'} (${a.session})</span>`;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // MODALS ENGINE
  // ==========================================================================
  function closeAllModals() {
    const overlay = document.getElementById("global-modal-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      overlay.innerHTML = "";
    }
  }

  // SCORE ENTRY MODAL
  function openScoreModal(studentId, classId, subjectId, scoreType) {
    const student = store.getStudentById(studentId);
    const cls = store.getClassById(classId);
    const sub = store.getSubjectById(subjectId);
    const school = store.getSchool();
    const session = cls ? cls.session : store.getCurrentSession();
    const term = school.currentTerm || "First Term";

    if (!student || !cls || !sub) return;

    const existingResult = store.getStudentResult(studentId, subjectId, classId, session, term);
    const currentVal = existingResult ? existingResult[scoreType] : "";
    const maxScore = scoreType === "project" ? (school.projectWeight || 10) : scoreType === "assessment" ? (school.assessmentWeight || 20) : (school.examWeight || 70);

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Record ${scoreType.toUpperCase()} Score</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="display:flex; align-items:center; gap:16px; margin-bottom:18px; background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md);">
            <img src="${student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150'}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);" />
            <div>
              <div style="font-size:17px; font-weight:700; color:var(--text-heading);">${student.name}</div>
              <div style="font-size:12.5px; color:var(--text-muted);">Student ID: <code>${student.studentId}</code> • ${student.admissionNo || 'ADM124'}</div>
              <div style="font-size:12px; font-weight:600; color:var(--primary); margin-top:2px;">${cls.name} • ${sub.name} (${session})</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Score Input (Maximum: ${maxScore} Marks)</label>
            <input type="number" step="0.5" min="0" max="${maxScore}" class="form-input" id="modal-score-input" value="${currentVal !== null ? currentVal : ''}" placeholder="Enter score (0 - ${maxScore})">
          </div>

          <div id="modal-live-calc-box" style="background:#fff7ed; border:1px solid #fed7aa; padding:10px 14px; border-radius:var(--radius-md); font-size:13px;">
            <div>Score Component: <strong>${scoreType.toUpperCase()}</strong></div>
            <div id="modal-projected-total">Calculated Total: ${existingResult?.total || '-'} (${existingResult?.grade || '-'})</div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-btn-save-score"><i data-lucide="check"></i> Save Score</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#modal-btn-save-score")?.addEventListener("click", () => {
      const val = document.getElementById("modal-score-input")?.value;
      if (val !== "" && (Number(val) < 0 || Number(val) > maxScore)) {
        showToast(`Score must be between 0 and ${maxScore}.`, "error");
        return;
      }

      store.recordStudentScore(studentId, classId, subjectId, store.getCurrentTeacherId(), scoreType, val, session, term);
      closeAllModals();
      renderView();
      showToast(`Saved ${scoreType.toUpperCase()} score for ${student.name}.`, "success");
    });
  }

  // ADD CLASS MODAL (Creche to SS3 Dropdown - Requirement 7 & 6)
  function openAddClassModal() {
    const currentSession = store.getCurrentSession();
    const availableSessions = store.getAvailableSessions();
    const predefinedClasses = store.getPredefinedClassLevels();
    const predefinedSubjects = store.getPredefinedSubjects();

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container large">
        <div class="modal-header">
          <h3>Create Academic Class</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Academic Year / Session</label>
              <select class="form-select" id="new-class-session">
                ${availableSessions.map(s => `<option value="${s}" ${s === currentSession ? 'selected' : ''}>${s}</option>`).join("")}
              </select>
            </div>

            <!-- Requirement 7: Dropdown from Creche to SS3 -->
            <div class="form-group">
              <label class="form-label">Class Level (Creche to SS3)</label>
              <select class="form-select" id="new-class-level">
                ${predefinedClasses.map(cl => `<option value="${cl.level}" data-category="${cl.category}">${cl.label}</option>`).join("")}
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Arm / Section <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">(Optional: leave blank if single class arm, e.g. JS1)</span></label>
              <input type="text" class="form-input" id="new-class-section" value="" placeholder="e.g. A, B, Gold (or leave blank)">
            </div>

            <div class="form-group">
              <label class="form-label">Educational Category</label>
              <input type="text" class="form-input" id="new-class-category" value="Early Years" readonly style="background:var(--bg-subtle);">
            </div>
          </div>

          <!-- Predefined Subjects Selection -->
          <div class="form-group">
            <label class="form-label">Assign Subjects to Class</label>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:6px; max-height:160px; overflow-y:auto; border:1px solid var(--border-color); padding:8px; border-radius:var(--radius-md);">
              ${predefinedSubjects.map(sub => `
                <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" value="${sub}" class="new-class-sub-check" checked> ${sub}
                </label>
              `).join("")}
            </div>
          </div>

          <!-- Requirement 6: Custom Subject Input with Inline Save -->
          <div style="margin-top:10px; border-top:1px dashed var(--border-color); padding-top:10px;">
            <label style="font-size:12.5px; display:flex; align-items:center; gap:6px; cursor:pointer; color:var(--primary); font-weight:600;">
              <input type="checkbox" id="check-others-subject"> + Add Custom Subject
            </label>
            <div id="custom-subject-box" style="display:none; margin-top:8px;">
              <div style="display:flex; gap:8px;">
                <input type="text" class="form-input" id="new-custom-subject-name" placeholder="e.g. Robotics, Technical Drawing, French">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-save-inline-custom-sub" style="white-space:nowrap;"><i data-lucide="save"></i> Save Subject</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-btn-create-class"><i data-lucide="plus"></i> Create Class</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    const levelSelect = overlay.querySelector("#new-class-level");
    const categoryInput = overlay.querySelector("#new-class-category");

    const updateCategory = () => {
      const selectedOption = levelSelect.options[levelSelect.selectedIndex];
      if (selectedOption) {
        categoryInput.value = selectedOption.getAttribute("data-category") || "Secondary";
      }
    };
    levelSelect?.addEventListener("change", updateCategory);
    updateCategory();

    const customCheck = overlay.querySelector("#check-others-subject");
    const customBox = overlay.querySelector("#custom-subject-box");
    customCheck?.addEventListener("change", (e) => {
      customBox.style.display = e.target.checked ? "block" : "none";
    });

    overlay.querySelector("#btn-save-inline-custom-sub")?.addEventListener("click", () => {
      const customSubName = document.getElementById("new-custom-subject-name")?.value.trim();
      if (!customSubName) {
        showToast("Please enter a custom subject name.", "error");
        return;
      }
      store.addCustomSubject(customSubName);
      showToast(`Subject "${customSubName}" saved to system.`, "success");
    });

    overlay.querySelector("#modal-btn-create-class")?.addEventListener("click", () => {
      const level = levelSelect?.value;
      const session = document.getElementById("new-class-session")?.value;
      const rawSection = document.getElementById("new-class-section")?.value.trim();
      const section = rawSection ? rawSection.toUpperCase() : "";
      const category = categoryInput?.value;

      if (!level) {
        showToast("Please select a class level.", "error");
        return;
      }

      const checkedSubs = Array.from(overlay.querySelectorAll(".new-class-sub-check:checked")).map(el => el.value);
      const isCustomChecked = customCheck?.checked;
      const customSubName = document.getElementById("new-custom-subject-name")?.value.trim();

      if (isCustomChecked && customSubName) {
        store.addCustomSubject(customSubName);
        checkedSubs.push(customSubName);
      }

      const subjectIds = checkedSubs.map(s => store.getOrCreateSubjectByName(s).id);

      try {
        const fullName = section ? `${level.replace(/\s+/g, "")}${section}` : level;
        const newClass = store.createClass({
          name: fullName,
          level,
          section: section || "A",
          category,
          session,
          subjectIds
        });

        closeAllModals();
        renderView();
        showToast(`Class ${newClass.name} (${session}) created successfully.`, "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ADD SUBJECT MODAL (Requirement 6: Custom Subject Input with Save)
  function openAddSubjectToClassModal(classId) {
    const cls = store.getClassById(classId);
    if (!cls) return;

    const allSubjects = store.getSubjects();
    const assigned = store.getClassSubjects(classId);
    const assignedIds = assigned.map(s => s.id);

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Add Subject to ${cls.name}</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Select Standard Subject</label>
            <select class="form-select" id="add-existing-subject-select">
              <option value="">-- Choose an existing subject --</option>
              ${allSubjects.map(s => `
                <option value="${s.id}" ${assignedIds.includes(s.id) ? 'disabled' : ''}>${s.name} ${assignedIds.includes(s.id) ? '(Already in Class)' : ''}</option>
              `).join("")}
            </select>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-bottom:16px;">
            <button class="btn btn-secondary btn-sm" id="btn-add-selected-subject"><i data-lucide="plus"></i> Add Selected</button>
          </div>

          <!-- Requirement 6: Custom subject with Save button -->
          <div style="border-top:1px dashed var(--border-color); padding-top:16px; margin-top:12px;">
            <label class="form-label" style="font-weight:700; color:var(--primary);">Or Add Custom Subject to System</label>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">When saved, it will be added to this class and become permanently available across the whole school.</p>
            
            <div class="form-group">
              <input type="text" class="form-input" id="custom-subject-input" placeholder="e.g. Robotics, Home Economics, French, Data Processing">
            </div>

            <button class="btn btn-primary btn-sm" id="btn-save-custom-subject"><i data-lucide="save"></i> Save Subject & Add to Class</button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Close</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#btn-add-selected-subject")?.addEventListener("click", () => {
      const subId = document.getElementById("add-existing-subject-select")?.value;
      if (!subId) {
        showToast("Please choose a subject.", "error");
        return;
      }
      store.addClassSubject(classId, subId);
      closeAllModals();
      renderView();
      showToast("Subject added to class.", "success");
    });

    overlay.querySelector("#btn-save-custom-subject")?.addEventListener("click", () => {
      const name = document.getElementById("custom-subject-input")?.value.trim();
      if (!name) {
        showToast("Please enter a custom subject name.", "error");
        return;
      }
      store.addCustomSubject(name);
      store.addClassSubject(classId, name, true);
      closeAllModals();
      renderView();
      showToast(`Custom subject "${name}" saved to system and added to ${cls.name}.`, "success");
    });
  }

  // ADD TEACHER MODAL (Requirement 9)
  function openAddTeacherModal() {
    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    let capturedAvatarUrl = "";
    let activeMediaStream = null;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Add New Teacher</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <!-- Photo Capture & Passport Upload (Audio 2) -->
          <div class="photo-capture-box" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:14px; margin-bottom:16px;">
            <div style="display:flex; align-items:center; gap:16px;">
              <div id="tch-photo-preview" style="width:68px; height:68px; border-radius:50%; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#ffffff; flex-shrink:0;">
                <i data-lucide="user" style="width:32px; height:32px; color:#94a3b8;" id="tch-photo-default-icon"></i>
                <img id="tch-photo-img" src="" style="display:none; width:100%; height:100%; object-fit:cover;" />
              </div>
              <div style="flex:1;">
                <div style="font-weight:700; font-size:13px; color:var(--text-heading); margin-bottom:4px;">Passport Photo / Camera Snapshot</div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button type="button" class="btn btn-secondary btn-sm" id="btn-tch-start-cam"><i data-lucide="camera"></i> Live Camera</button>
                  <label class="btn btn-outline-primary btn-sm" style="margin-bottom:0; cursor:pointer;">
                    <i data-lucide="upload"></i> Upload / Mobile Snap
                    <input type="file" id="file-tch-photo" accept="image/*" capture="user" style="display:none;">
                  </label>
                </div>
              </div>
            </div>

            <!-- Viewfinder -->
            <div id="tch-cam-viewfinder" style="display:none; margin-top:12px; background:#0f172a; padding:12px; border-radius:var(--radius-md); text-align:center;">
              <video id="tch-video-feed" autoplay playsinline style="width:100%; max-width:240px; height:180px; object-fit:cover; border-radius:var(--radius-sm); border:2px solid var(--primary); background:#000;"></video>
              <div style="margin-top:8px; display:flex; justify-content:center; gap:8px;">
                <button type="button" class="btn btn-primary btn-sm" id="btn-tch-snap"><i data-lucide="aperture"></i> Snap Photo</button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-tch-cancel-cam">Cancel</button>
              </div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="new-teacher-name" placeholder="e.g. Mr. Emmanuel Okafor" required>
            </div>

            <div class="form-group">
              <label class="form-label">Gender</label>
              <select class="form-select" id="new-teacher-gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="new-teacher-email" placeholder="e.g. teacher@crownhill.edu.ng">
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="text" class="form-input" id="new-teacher-phone" placeholder="e.g. +234 803 123 4567">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Subject Specialization</label>
              <input type="text" class="form-input" id="new-teacher-spec" placeholder="e.g. Mathematics & Further Maths">
            </div>

            <div class="form-group">
              <label class="form-label">Academic Qualification</label>
              <input type="text" class="form-input" id="new-teacher-qual" placeholder="e.g. B.Sc. Ed, M.Ed, NCE">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Employment Date</label>
            <input type="date" class="form-input" id="new-teacher-empdate" value="${new Date().toISOString().split("T")[0]}">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-btn-save-teacher"><i data-lucide="user-plus"></i> Save Teacher</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    const stopCamera = () => {
      if (activeMediaStream) {
        activeMediaStream.getTracks().forEach(track => track.stop());
        activeMediaStream = null;
      }
      const vf = overlay.querySelector("#tch-cam-viewfinder");
      if (vf) vf.style.display = "none";
    };

    const cleanupAndClose = () => {
      stopCamera();
      closeAllModals();
    };

    overlay.querySelector("#modal-close-x")?.addEventListener("click", cleanupAndClose);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", cleanupAndClose);

    // Live Camera Setup
    const startCamBtn = overlay.querySelector("#btn-tch-start-cam");
    const cancelCamBtn = overlay.querySelector("#btn-tch-cancel-cam");
    const snapBtn = overlay.querySelector("#btn-tch-snap");
    const videoFeed = overlay.querySelector("#tch-video-feed");
    const photoImg = overlay.querySelector("#tch-photo-img");
    const defaultIcon = overlay.querySelector("#tch-photo-default-icon");
    const fileInput = overlay.querySelector("#file-tch-photo");

    startCamBtn?.addEventListener("click", async () => {
      try {
        stopCamera();
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } });
        activeMediaStream = stream;
        videoFeed.srcObject = stream;
        overlay.querySelector("#tch-cam-viewfinder").style.display = "block";
      } catch (err) {
        showToast("Unable to access camera: " + err.message, "error");
      }
    });

    cancelCamBtn?.addEventListener("click", stopCamera);

    snapBtn?.addEventListener("click", () => {
      if (!videoFeed || !activeMediaStream) return;
      const canvas = document.createElement("canvas");
      canvas.width = videoFeed.videoWidth || 320;
      canvas.height = videoFeed.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoFeed, 0, 0, canvas.width, canvas.height);
      capturedAvatarUrl = canvas.toDataURL("image/jpeg", 0.85);
      photoImg.src = capturedAvatarUrl;
      photoImg.style.display = "block";
      if (defaultIcon) defaultIcon.style.display = "none";
      stopCamera();
      showToast("Photo captured successfully!", "success");
    });

    fileInput?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          capturedAvatarUrl = evt.target.result;
          photoImg.src = capturedAvatarUrl;
          photoImg.style.display = "block";
          if (defaultIcon) defaultIcon.style.display = "none";
          showToast("Photo uploaded successfully!", "success");
        };
        reader.readAsDataURL(file);
      }
    });

    overlay.querySelector("#modal-btn-save-teacher")?.addEventListener("click", () => {
      const name = document.getElementById("new-teacher-name")?.value.trim();
      const gender = document.getElementById("new-teacher-gender")?.value;
      const email = document.getElementById("new-teacher-email")?.value.trim();
      const phone = document.getElementById("new-teacher-phone")?.value.trim();
      const specialization = document.getElementById("new-teacher-spec")?.value.trim();
      const qualification = document.getElementById("new-teacher-qual")?.value.trim();
      const employmentDate = document.getElementById("new-teacher-empdate")?.value;

      if (!name) {
        showToast("Please enter the teacher's full name.", "error");
        return;
      }

      const newTeacher = store.createTeacher({
        name,
        gender,
        email,
        phone,
        specialization,
        qualification,
        employmentDate,
        avatar: capturedAvatarUrl || undefined
      });

      cleanupAndClose();
      renderView();
      showToast(`Teacher ${newTeacher.name} created successfully.`, "success");
    });
  }

  // ASSIGN TEACHER MODAL (Requirement 9 & Audio 3: Dynamic Multi-Row Assignments)
  function openAssignTeacherModal(teacherId = null) {
    const teachers = store.getTeachers();
    let currentTeacher = teacherId ? store.getTeacherById(teacherId) : teachers[0];
    if (!currentTeacher) currentTeacher = teachers[0];

    const availableSessions = store.getAvailableSessions();
    let selectedSession = activeSessionFilter || store.getCurrentSession();
    let pendingRows = [{ id: 1, classId: "", subjectId: "" }];
    let rowIdCounter = 2;

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    const renderModalContent = () => {
      const classesForSession = store.getClasses(selectedSession);
      const allSubjects = store.getSubjects();
      const assignments = store.getTeacherAssignments(currentTeacher.id, selectedSession);

      overlay.innerHTML = `
        <div class="modal-container large" style="width: 860px;">
          <div class="modal-header">
            <h3>Assign Teacher to Classes & Subjects</h3>
            <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
          </div>

          <div class="modal-body">
            <!-- Select Teacher & Session -->
            <div style="display:grid; grid-template-columns: 2fr 1fr; gap:14px; margin-bottom:16px;">
              <div class="form-group">
                <label class="form-label">Select Faculty / Teacher</label>
                <select class="form-select" id="assign-teacher-picker">
                  ${teachers.map(t => `<option value="${t.id}" ${t.id === currentTeacher.id ? 'selected' : ''}>${t.name} (${t.specialization})</option>`).join("")}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Academic Session</label>
                <select class="form-select" id="assign-session-select">
                  ${availableSessions.map(s => `<option value="${s}" ${s === selectedSession ? 'selected' : ''}>${s}</option>`).join("")}
                </select>
              </div>
            </div>

            <!-- Multi-Row Assignment Form (Audio 3) -->
            <div class="table-card" style="padding:16px; margin-bottom:20px; background:#fffbf7; border-color:var(--primary-border);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h4 style="font-size:14px; font-weight:700; color:var(--text-heading); margin:0;">
                  Assign Classes & Subjects to ${currentTeacher.name}
                </h4>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-add-assignment-row">
                  <i data-lucide="plus"></i> Add Another Class & Subject
                </button>
              </div>

              <div id="dynamic-assignment-rows-container">
                ${pendingRows.map((row, idx) => `
                  <div class="assignment-row-item" data-row-id="${row.id}" style="display:grid; grid-template-columns:1fr 1fr auto; gap:10px; align-items:flex-end; margin-bottom:10px; padding-bottom:10px; border-bottom:1px dashed #fed7aa;">
                    <div class="form-group" style="margin-bottom:0;">
                      <label class="form-label" style="font-size:11.5px;">Target Class #${idx + 1}</label>
                      <select class="form-select assign-row-class" data-row-id="${row.id}">
                        <option value="">-- Select Class --</option>
                        ${classesForSession.map(c => `<option value="${c.id}" ${c.id === row.classId ? 'selected' : ''}>${c.name} (${c.session})</option>`).join("")}
                      </select>
                    </div>

                    <div class="form-group" style="margin-bottom:0;">
                      <label class="form-label" style="font-size:11.5px;">Subject</label>
                      <select class="form-select assign-row-subject" data-row-id="${row.id}">
                        <option value="">-- Select Subject --</option>
                        ${allSubjects.map(s => `<option value="${s.id}" ${s.id === row.subjectId ? 'selected' : ''}>${s.name}</option>`).join("")}
                      </select>
                    </div>

                    <div>
                      ${pendingRows.length > 1 ? `
                        <button type="button" class="btn btn-danger-outline btn-sm btn-remove-assign-row" data-row-id="${row.id}" title="Remove Row">
                          <i data-lucide="trash-2"></i>
                        </button>
                      ` : `
                        <div style="width:36px;"></div>
                      `}
                    </div>
                  </div>
                `).join("")}
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:10px;">
                <span style="font-size:12px; color:var(--text-muted);">Configured <strong>${pendingRows.length}</strong> class & subject assignment(s)</span>
                <button class="btn btn-primary" id="btn-save-all-assignments">
                  <i data-lucide="check-circle"></i> Save All Assignments
                </button>
              </div>
            </div>

            <!-- Current Active Assignments -->
            <h4 style="font-size:14px; font-weight:700; color:var(--text-heading); margin-bottom:8px;">
              Active Assignments in ${selectedSession} (${assignments.length})
            </h4>
            <div class="table-card">
              <table class="data-table" style="font-size:13px;">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Session</th>
                    <th style="text-align:right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${assignments.length > 0 ? assignments.map(a => {
                    const cls = store.getClassById(a.classId);
                    const sub = store.getSubjectById(a.subjectId);
                    return `
                      <tr>
                        <td><strong>${cls?.name || 'Class'}</strong></td>
                        <td><span class="badge badge-primary">${sub?.name || 'Subject'}</span></td>
                        <td><span class="badge badge-neutral">${a.session}</span></td>
                        <td style="text-align:right;">
                          <button class="btn btn-danger-outline btn-sm" onclick="window.appHandlers.removeTeacherAssignment('${a.id}', '${currentTeacher.id}')"><i data-lucide="trash-2"></i> Remove</button>
                        </td>
                      </tr>
                    `;
                  }).join("") : `
                    <tr><td colspan="4" style="text-align:center; padding:16px; color:var(--text-muted);">No class assignments for this teacher in ${selectedSession}.</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" id="modal-btn-close">Close</button>
          </div>
        </div>
      `;

      overlay.classList.add("active");
      if (window.lucide) window.lucide.createIcons();

      overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
      overlay.querySelector("#modal-btn-close")?.addEventListener("click", closeAllModals);

      overlay.querySelector("#assign-teacher-picker")?.addEventListener("change", (e) => {
        currentTeacher = store.getTeacherById(e.target.value);
        renderModalContent();
      });

      overlay.querySelector("#assign-session-select")?.addEventListener("change", (e) => {
        selectedSession = e.target.value;
        renderModalContent();
      });

      // Handle Row Inputs
      overlay.querySelectorAll(".assign-row-class").forEach(sel => {
        sel.addEventListener("change", (e) => {
          const rId = parseInt(e.target.getAttribute("data-row-id"), 10);
          const r = pendingRows.find(item => item.id === rId);
          if (r) r.classId = e.target.value;
        });
      });

      overlay.querySelectorAll(".assign-row-subject").forEach(sel => {
        sel.addEventListener("change", (e) => {
          const rId = parseInt(e.target.getAttribute("data-row-id"), 10);
          const r = pendingRows.find(item => item.id === rId);
          if (r) r.subjectId = e.target.value;
        });
      });

      // Add Row Button
      overlay.querySelector("#btn-add-assignment-row")?.addEventListener("click", () => {
        pendingRows.push({ id: rowIdCounter++, classId: "", subjectId: "" });
        renderModalContent();
      });

      // Remove Row Button
      overlay.querySelectorAll(".btn-remove-assign-row").forEach(btn => {
        btn.addEventListener("click", () => {
          const rId = parseInt(btn.getAttribute("data-row-id"), 10);
          pendingRows = pendingRows.filter(item => item.id !== rId);
          if (pendingRows.length === 0) {
            pendingRows = [{ id: rowIdCounter++, classId: "", subjectId: "" }];
          }
          renderModalContent();
        });
      });

      // Save All Assignments
      overlay.querySelector("#btn-save-all-assignments")?.addEventListener("click", () => {
        overlay.querySelectorAll(".assign-row-class").forEach(sel => {
          const rId = parseInt(sel.getAttribute("data-row-id"), 10);
          const r = pendingRows.find(item => item.id === rId);
          if (r) r.classId = sel.value;
        });
        overlay.querySelectorAll(".assign-row-subject").forEach(sel => {
          const rId = parseInt(sel.getAttribute("data-row-id"), 10);
          const r = pendingRows.find(item => item.id === rId);
          if (r) r.subjectId = sel.value;
        });

        const validRows = pendingRows.filter(r => r.classId && r.subjectId);
        if (validRows.length === 0) {
          showToast("Please select at least one valid class and subject row.", "error");
          return;
        }

        let assignedCount = 0;
        validRows.forEach(row => {
          store.assignTeacherToClass(currentTeacher.id, row.classId, row.subjectId, selectedSession);
          assignedCount++;
        });

        showToast(`Saved ${assignedCount} class & subject assignment(s) for ${currentTeacher.name}!`, "success");
        pendingRows = [{ id: rowIdCounter++, classId: "", subjectId: "" }];
        renderModalContent();
        renderView();
      });
    };

    renderModalContent();
  }

  // TEACHER SUBJECT SCORE REVIEW MODAL (Requirements 11, 12, 13)
  function openTeacherSubjectScoreReviewModal(classId, subjectId) {
    const cls = store.getClassById(classId);
    const sub = store.getSubjectById(subjectId);
    const students = store.getClassStudents(classId);
    const results = store.getResults({ classId, subjectId, session: resultSession, term: resultTerm });

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container large" style="width: 880px;">
        <div class="modal-header">
          <h3>Review Submitted Scores: ${sub?.name} (${cls?.name})</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="background:var(--bg-subtle); padding:12px 16px; border-radius:var(--radius-md); margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700; font-size:15px; color:var(--text-heading);">${sub?.name} • ${cls?.name}</div>
              <div style="font-size:12px; color:var(--text-muted);">${resultSession} Academic Session • ${resultTerm}</div>
            </div>
            <span class="badge badge-warning">${results.length} / ${students.length} Graded</span>
          </div>

          <div class="table-card">
            <div class="table-responsive" style="max-height: 340px; overflow-x: auto;">
              <table class="data-table" style="font-size:12.5px; min-width: 720px;">
                <thead>
                  <tr>
                    <th class="sticky-col-student">Student Information</th>
                    <th style="text-align:center;">Project (10)</th>
                    <th style="text-align:center;">Assess. (20)</th>
                    <th style="text-align:center;">Exam (70)</th>
                    <th style="text-align:center;">Total (100)</th>
                    <th style="text-align:center;">Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${students.map(s => {
                    const r = results.find(item => item.studentId === s.id);
                    return `
                      <tr>
                        <td class="sticky-col-student">
                          <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'}" alt="${s.name}" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1.5px solid #cbd5e1; flex-shrink:0;" />
                            <div style="min-width:0;">
                              <strong style="display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--text-heading);">${s.name}</strong>
                              <code style="font-size:11px; color:var(--text-muted);">${s.studentId}</code>
                            </div>
                          </div>
                        </td>
                        <td style="text-align:center;">${r && r.project !== null && r.project !== undefined ? r.project : '-'}</td>
                        <td style="text-align:center;">${r && r.assessment !== null && r.assessment !== undefined ? r.assessment : '-'}</td>
                        <td style="text-align:center;">${r && r.exam !== null && r.exam !== undefined ? r.exam : '-'}</td>
                        <td style="text-align:center; font-weight:700; color:var(--primary);">${r && r.total !== null && r.total !== undefined ? r.total : '-'}</td>
                        <td style="text-align:center;"><span class="badge ${r && (r.grade === 'A' || r.grade === 'B') ? 'badge-success' : 'badge-neutral'}">${r?.grade || '-'}</span></td>
                        <td><span class="badge ${r?.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${r?.status || 'Draft'}</span></td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <div class="form-group" style="margin-top:16px;">
            <label class="form-label">Admin Approval Notes / Feedback</label>
            <input type="text" class="form-input" id="admin-score-review-notes" placeholder="Enter optional notes for the subject teacher...">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Close</button>
          <button class="btn btn-danger-outline" id="btn-request-score-revision"><i data-lucide="edit-3"></i> Request Revision</button>
          <button class="btn btn-success" id="btn-approve-subject-scores"><i data-lucide="check-circle"></i> Approve Subject Scores</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#btn-approve-subject-scores")?.addEventListener("click", () => {
      const notes = document.getElementById("admin-score-review-notes")?.value || "Approved by Admin.";
      store.adminReviewResults(classId, subjectId, "Approved", notes, resultSession, resultTerm);
      closeAllModals();
      renderView();
      showToast(`Approved ${sub?.name} results for ${cls?.name}.`, "success");
    });

    overlay.querySelector("#btn-request-score-revision")?.addEventListener("click", () => {
      const notes = document.getElementById("admin-score-review-notes")?.value || "Please review score entries.";
      store.adminReviewResults(classId, subjectId, "Returned for Correction", notes, resultSession, resultTerm);
      closeAllModals();
      renderView();
      showToast(`Revision requested for ${sub?.name}.`, "info");
    });
  }

  // ADD STUDENT MODAL (Audio 2: Photo Snapshot & Camera Upload)
  function openAddStudentModal(defaultClassId = null) {
    const currentSession = store.getCurrentSession();
    const availableSessions = store.getAvailableSessions();
    const classes = store.getClasses();

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    let capturedAvatarUrl = "";
    let activeMediaStream = null;

    overlay.innerHTML = `
      <div class="modal-container large">
        <div class="modal-header">
          <h3>Enroll New Student</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <!-- Photo Capture & Passport Upload (Audio 2) -->
          <div class="photo-capture-box" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:14px; margin-bottom:16px;">
            <div style="display:flex; align-items:center; gap:16px;">
              <div id="stu-photo-preview" style="width:68px; height:68px; border-radius:50%; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#ffffff; flex-shrink:0;">
                <i data-lucide="user" style="width:32px; height:32px; color:#94a3b8;" id="stu-photo-default-icon"></i>
                <img id="stu-photo-img" src="" style="display:none; width:100%; height:100%; object-fit:cover;" />
              </div>
              <div style="flex:1;">
                <div style="font-weight:700; font-size:13px; color:var(--text-heading); margin-bottom:4px;">Student Passport / Camera Snapshot</div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button type="button" class="btn btn-secondary btn-sm" id="btn-stu-start-cam"><i data-lucide="camera"></i> Live Camera</button>
                  <label class="btn btn-outline-primary btn-sm" style="margin-bottom:0; cursor:pointer;">
                    <i data-lucide="upload"></i> Upload / Mobile Snap
                    <input type="file" id="file-stu-photo" accept="image/*" capture="user" style="display:none;">
                  </label>
                </div>
              </div>
            </div>

            <!-- Viewfinder -->
            <div id="stu-cam-viewfinder" style="display:none; margin-top:12px; background:#0f172a; padding:12px; border-radius:var(--radius-md); text-align:center;">
              <video id="stu-video-feed" autoplay playsinline style="width:100%; max-width:240px; height:180px; object-fit:cover; border-radius:var(--radius-sm); border:2px solid var(--primary); background:#000;"></video>
              <div style="margin-top:8px; display:flex; justify-content:center; gap:8px;">
                <button type="button" class="btn btn-primary btn-sm" id="btn-stu-snap"><i data-lucide="aperture"></i> Snap Photo</button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-stu-cancel-cam">Cancel</button>
              </div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="new-stu-name" placeholder="e.g. David Okafor" required>
            </div>

            <div class="form-group">
              <label class="form-label">Gender</label>
              <select class="form-select" id="new-stu-gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Academic Year / Session (Required)</label>
              <select class="form-select" id="new-stu-session">
                ${availableSessions.map(s => `<option value="${s}" ${s === currentSession ? 'selected' : ''}>${s}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Assigned Class (Required)</label>
              <select class="form-select" id="new-stu-class">
                ${classes.map(c => `<option value="${c.id}" ${c.id === defaultClassId ? 'selected' : ''}>${c.name} (${c.session})</option>`).join("")}
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Admission Number</label>
              <input type="text" class="form-input" id="new-stu-admno" value="ADM${Math.floor(100 + Math.random() * 900)}">
            </div>

            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="date" class="form-input" id="new-stu-dob" value="2011-04-15">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Home Address</label>
            <input type="text" class="form-input" id="new-stu-address" value="Lagos, Nigeria">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-btn-create-student"><i data-lucide="user-plus"></i> Enroll Student</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    const stopCamera = () => {
      if (activeMediaStream) {
        activeMediaStream.getTracks().forEach(track => track.stop());
        activeMediaStream = null;
      }
      const vf = overlay.querySelector("#stu-cam-viewfinder");
      if (vf) vf.style.display = "none";
    };

    const cleanupAndClose = () => {
      stopCamera();
      closeAllModals();
    };

    overlay.querySelector("#modal-close-x")?.addEventListener("click", cleanupAndClose);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", cleanupAndClose);

    // Camera hooks
    const startCamBtn = overlay.querySelector("#btn-stu-start-cam");
    const cancelCamBtn = overlay.querySelector("#btn-stu-cancel-cam");
    const snapBtn = overlay.querySelector("#btn-stu-snap");
    const videoFeed = overlay.querySelector("#stu-video-feed");
    const photoImg = overlay.querySelector("#stu-photo-img");
    const defaultIcon = overlay.querySelector("#stu-photo-default-icon");
    const fileInput = overlay.querySelector("#file-stu-photo");

    startCamBtn?.addEventListener("click", async () => {
      try {
        stopCamera();
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: "user" } });
        activeMediaStream = stream;
        videoFeed.srcObject = stream;
        overlay.querySelector("#stu-cam-viewfinder").style.display = "block";
      } catch (err) {
        showToast("Unable to access camera: " + err.message, "error");
      }
    });

    cancelCamBtn?.addEventListener("click", stopCamera);

    snapBtn?.addEventListener("click", () => {
      if (!videoFeed || !activeMediaStream) return;
      const canvas = document.createElement("canvas");
      canvas.width = videoFeed.videoWidth || 320;
      canvas.height = videoFeed.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoFeed, 0, 0, canvas.width, canvas.height);
      capturedAvatarUrl = canvas.toDataURL("image/jpeg", 0.85);
      photoImg.src = capturedAvatarUrl;
      photoImg.style.display = "block";
      if (defaultIcon) defaultIcon.style.display = "none";
      stopCamera();
      showToast("Student photo captured!", "success");
    });

    fileInput?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          capturedAvatarUrl = evt.target.result;
          photoImg.src = capturedAvatarUrl;
          photoImg.style.display = "block";
          if (defaultIcon) defaultIcon.style.display = "none";
          showToast("Student photo uploaded!", "success");
        };
        reader.readAsDataURL(file);
      }
    });

    overlay.querySelector("#modal-btn-create-student")?.addEventListener("click", () => {
      const name = document.getElementById("new-stu-name")?.value.trim();
      const session = document.getElementById("new-stu-session")?.value;
      const currentClassId = document.getElementById("new-stu-class")?.value;
      const gender = document.getElementById("new-stu-gender")?.value;
      const admissionNo = document.getElementById("new-stu-admno")?.value;
      const dob = document.getElementById("new-stu-dob")?.value;
      const address = document.getElementById("new-stu-address")?.value;

      if (!name) {
        showToast("Please enter student name.", "error");
        return;
      }

      const student = store.createStudent({
        name,
        gender,
        admissionNo,
        dob,
        address,
        currentClassId,
        currentSession: session,
        avatar: capturedAvatarUrl || undefined
      });

      cleanupAndClose();
      renderView();
      showToast(`Student ${student.name} enrolled into ${session}.`, "success");
    });
  }

  // TRANSFER STUDENT MODAL
  function openTransferStudentModal(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    const currentClass = store.getClassById(student.currentClassId);
    const classes = store.getClasses();

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Transfer Student Arm</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md); margin-bottom:16px;">
            <div style="font-weight:700; font-size:15px;">${student.name} (<code>${student.studentId}</code>)</div>
            <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">
              Current Placement: <strong>${currentClass?.name || 'Class'} (${student.currentSession})</strong>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Select Target Class / Arm</label>
            <select class="form-select" id="transfer-target-class">
              ${classes.filter(c => c.id !== student.currentClassId).map(c => `
                <option value="${c.id}">${c.name} (${c.session})</option>
              `).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Transfer Reason</label>
            <input type="text" class="form-input" id="transfer-reason" value="Class Arm Rebalance / Administrative Adjustment">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-btn-confirm-transfer"><i data-lucide="check"></i> Confirm Transfer</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#modal-btn-confirm-transfer")?.addEventListener("click", () => {
      const targetClassId = document.getElementById("transfer-target-class")?.value;
      const reason = document.getElementById("transfer-reason")?.value;

      try {
        store.transferStudentClass(studentId, targetClassId, null, null, reason);
        closeAllModals();
        renderView();
        showToast(`Transferred ${student.name} successfully. History preserved.`, "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // PROMOTE STUDENT MODAL
  function openPromoteStudentModal(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    const currentClass = store.getClassById(student.currentClassId);
    const availableSessions = store.getAvailableSessions();
    const classes = store.getClasses();

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Promote Student to Next Session</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md); margin-bottom:16px;">
            <div style="font-weight:700; font-size:15px;">${student.name} (<code>${student.studentId}</code>)</div>
            <div style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">
              Current Placement: <strong>${currentClass?.name || 'Class'} (${student.currentSession})</strong>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Promote into Academic Session</label>
            <select class="form-select" id="promote-new-session">
              ${availableSessions.map(s => `<option value="${s}">${s}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Select Higher Academic Class (e.g. JS3 -> SS1)</label>
            <select class="form-select" id="promote-target-class">
              ${classes.map(c => `
                <option value="${c.id}">${c.name} (${c.session})</option>
              `).join("")}
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-btn-confirm-promote"><i data-lucide="trending-up"></i> Execute Promotion</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#modal-btn-confirm-promote")?.addEventListener("click", () => {
      const newSession = document.getElementById("promote-new-session")?.value;
      const targetClassId = document.getElementById("promote-target-class")?.value;

      try {
        store.promoteStudent(studentId, targetClassId, newSession);
        closeAllModals();
        renderView();
        showToast(`Promoted ${student.name} to ${newSession}. Previous records intact.`, "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // BATCH PROMOTION & CLASS TRANSFER WORKFLOW MODAL (Voice Note 4)
  function openBatchPromoteModal(classId, session = null, term = null) {
    const cls = store.getClassById(classId);
    if (!cls) return;

    const currentSession = session || cls.session || store.getCurrentSession();
    const currentTerm = term || store.getSchool().currentTerm || "First Term";
    const availableSessions = store.getAvailableSessions();
    const allClasses = store.getClasses();

    // Determine target next session
    const sessParts = currentSession.split("/");
    let defaultNextSession = currentSession;
    if (sessParts.length === 2 && !isNaN(sessParts[0]) && !isNaN(sessParts[1])) {
      defaultNextSession = `${Number(sessParts[0]) + 1}/${Number(sessParts[1]) + 1}`;
    }

    // Determine target class level progression:
    // e.g. JS1A -> JS2A, JS2A -> JS3A, JS3A -> SS1A, SS1A -> SS2A, SS2A -> SS3A
    const classLevelHierarchy = ["Creche", "Playgroup", "KG 1", "KG 2", "Nursery 1", "Nursery 2", "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6", "JS1", "JS2", "JS3", "SS1", "SS2", "SS3"];
    const curLevel = cls.level || cls.name.replace(/[^A-Za-z0-9]/g, "").substring(0, 3);
    const curIdx = classLevelHierarchy.findIndex(l => curLevel.toUpperCase().startsWith(l.toUpperCase()) || l.toUpperCase().startsWith(curLevel.toUpperCase()));
    let nextLevelName = "JS2";
    if (curIdx >= 0 && curIdx < classLevelHierarchy.length - 1) {
      nextLevelName = classLevelHierarchy[curIdx + 1];
    }
    const suggestedTargetClassName = `${nextLevelName.replace(/\s+/g, "")}${cls.section || 'A'}`;

    // Get broadsheet result data
    const broadsheetData = store.getCombinedClassResults(classId, currentSession, currentTerm);
    const { students, subjects, broadsheet } = broadsheetData;

    // Evaluate passed candidates (Overall Grade not F, or Average >= 50%)
    const candidateStudents = broadsheet.map(row => {
      const isGraded = row.average !== null && row.average !== undefined;
      const isPassed = isGraded && Number(row.average) >= 50;
      return {
        ...row,
        isGraded,
        isPassed
      };
    });

    const passedCount = candidateStudents.filter(c => c.isPassed).length;
    const totalCount = candidateStudents.length;
    const allGraded = candidateStudents.every(c => c.isGraded);

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container large" style="width: 860px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(20, 43, 71, 0.08); display: flex; align-items: center; justify-content: center; color: var(--primary);">
              <i data-lucide="trending-up"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 17px;">Batch Student Promotion & Class Transfer</h3>
              <div style="font-size: 12px; color: var(--text-muted);">${cls.name} • ${currentSession} • ${currentTerm}</div>
            </div>
          </div>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <!-- Academic Verification Status Banner -->
          <div class="promotion-summary-banner">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8;">
              Academic Result Verification Check
            </div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 3px;">
              ${passedCount} of ${totalCount} Students Qualified for Promotion (Passing Grade ≥ 50%)
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
              ${allGraded ? '✅ All terminal subject results and broadsheet records are computed and verified.' : '⚠️ Some student scores are still pending completion. You can still promote verified passing students.'}
            </div>

            <div class="promotion-summary-stats">
              <div class="promo-stat-unit">
                <span class="promo-stat-val">${totalCount}</span>
                <span class="promo-stat-lbl">Enrolled</span>
              </div>
              <div class="promo-stat-unit">
                <span class="promo-stat-val" style="color: #4ade80;">${passedCount}</span>
                <span class="promo-stat-lbl">Qualified (Passed)</span>
              </div>
              <div class="promo-stat-unit">
                <span class="promo-stat-val" style="color: #f87171;">${totalCount - passedCount}</span>
                <span class="promo-stat-lbl">Retain / Review</span>
              </div>
              <div class="promo-stat-unit">
                <span class="promo-stat-val">${totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0}%</span>
                <span class="promo-stat-lbl">Class Pass Rate</span>
              </div>
            </div>
          </div>

          <!-- Target Academic Session & Target Class Selection -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md);">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-weight: 700;">1. Target Next Academic Session</label>
              <select class="form-select" id="batch-promo-session">
                <option value="${defaultNextSession}" selected>${defaultNextSession} (Next Session)</option>
                ${availableSessions.filter(s => s !== defaultNextSession).map(s => `<option value="${s}">${s}</option>`).join("")}
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-weight: 700;">2. Destination Higher Class</label>
              <select class="form-select" id="batch-promo-target-class">
                ${allClasses.map(c => `
                  <option value="${c.id}" ${c.name.toLowerCase() === suggestedTargetClassName.toLowerCase() ? 'selected' : ''}>
                    ${c.name} (${c.session || currentSession}) - ${c.category || 'Secondary'}
                  </option>
                `).join("")}
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <label style="font-size: 13px; font-weight: 700; color: var(--text-heading); display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="batch-promo-select-all" checked> Select All Qualified Passing Students
            </label>
            <span style="font-size: 12px; color: var(--text-muted);" id="batch-promo-selected-count">${passedCount} students selected</span>
          </div>

          <!-- Students Candidates Table -->
          <div class="table-card" style="margin-bottom: 0;">
            <div class="table-responsive" style="max-height: 280px; overflow-y: auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="width: 5%; text-align: center;">Include</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th style="text-align: center;">Average %</th>
                    <th style="text-align: center;">Overall Grade</th>
                    <th>Promotion Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  ${candidateStudents.map(c => `
                    <tr style="${!c.isPassed ? 'background: #fffafa;' : ''}">
                      <td style="text-align: center;">
                        <input type="checkbox" value="${c.student.id}" class="batch-promo-student-check" ${c.isPassed ? 'checked' : ''}>
                      </td>
                      <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <img src="${c.student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />
                          <strong>${c.student.name}</strong>
                        </div>
                      </td>
                      <td><code>${c.student.studentId}</code></td>
                      <td style="text-align: center; font-weight: 700; color: ${c.isPassed ? 'var(--primary)' : '#dc2626'};">${c.average !== null ? c.average + '%' : '-'}</td>
                      <td style="text-align: center;">
                        <span class="badge ${c.isPassed ? 'badge-success' : 'badge-danger'}">${c.overallGrade || 'N/A'}</span>
                      </td>
                      <td>
                        <span class="badge ${c.isPassed ? 'badge-success' : 'badge-warning'}">
                          ${c.isPassed ? 'Eligible for Promotion' : 'Below Passing Criteria (Retain)'}
                        </span>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-success" id="modal-btn-execute-batch-promo">
            <i data-lucide="trending-up"></i> Confirm & Execute Promotion
          </button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    const updateSelectedCount = () => {
      const checkedBoxes = overlay.querySelectorAll(".batch-promo-student-check:checked");
      const countEl = overlay.querySelector("#batch-promo-selected-count");
      if (countEl) countEl.innerText = `${checkedBoxes.length} students selected for transfer`;
    };

    overlay.querySelector("#batch-promo-select-all")?.addEventListener("change", (e) => {
      overlay.querySelectorAll(".batch-promo-student-check").forEach(cb => {
        cb.checked = e.target.checked;
      });
      updateSelectedCount();
    });

    overlay.querySelectorAll(".batch-promo-student-check").forEach(cb => {
      cb.addEventListener("change", updateSelectedCount);
    });

    overlay.querySelector("#modal-btn-execute-batch-promo")?.addEventListener("click", () => {
      const selectedIds = Array.from(overlay.querySelectorAll(".batch-promo-student-check:checked")).map(el => el.value);
      const targetSession = document.getElementById("batch-promo-session")?.value;
      const targetClassId = document.getElementById("batch-promo-target-class")?.value;
      const targetClass = store.getClassById(targetClassId);

      if (selectedIds.length === 0) {
        showToast("Please select at least one student to promote.", "error");
        return;
      }

      if (!targetClassId || !targetClass) {
        showToast("Please select a valid destination class.", "error");
        return;
      }

      try {
        const promoted = store.promoteBatchStudents(selectedIds, targetClassId, targetSession);
        closeAllModals();
        renderView();
        showToast(`🎉 Successfully promoted & transferred ${promoted.length} students from ${cls.name} to ${targetClass.name} (${targetSession})!`, "success");
      } catch (err) {
        showToast(err.message || "Failed to execute batch promotion.", "error");
      }
    });
  }

  // STUDENT PROFILE MODAL WITH ACADEMIC HISTORY
  function openStudentProfileModal(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    const currentClass = store.getClassById(student.currentClassId);
    const placements = student.academicPlacements || [];
    const historicalResults = student.historicalResults || [];

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container large">
        <div class="modal-header">
          <h3>Student Academic Profile & Historical Placements</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:16px;">
            <img src="${student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150'}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid var(--primary);" />
            <div>
              <h2 style="font-size:20px; font-weight:700;">${student.name}</h2>
              <div style="color:var(--text-muted); font-size:13px;">ID: <code>${student.studentId}</code> • Admission No: ${student.admissionNo || 'ADM124'}</div>
              <div style="font-size:13px; font-weight:600; color:var(--primary); margin-top:2px;">
                Current Placement: ${currentClass?.name || 'SS2A'} (${student.currentSession})
              </div>
            </div>
          </div>

          <h4 style="font-size:14px; font-weight:700; margin-bottom:8px;">Academic Placement History</h4>
          <div class="table-card" style="margin-bottom:20px;">
            <table class="data-table" style="font-size:12.5px;">
              <thead>
                <tr>
                  <th>Academic Year</th>
                  <th>Class</th>
                  <th>Placement Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${placements.map(p => `
                  <tr>
                    <td><strong>${p.session}</strong></td>
                    <td>${p.className}</td>
                    <td><span class="badge badge-primary">${p.placementType || 'Standard'}</span></td>
                    <td><span class="badge ${p.status === 'Current' ? 'badge-success' : 'badge-neutral'}">${p.status}</span></td>
                    <td>${p.startDate || p.promotedOn || p.transferredOn || '-'}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <h4 style="font-size:14px; font-weight:700; margin-bottom:8px;">Historical Results</h4>
          <div class="table-card">
            <table class="data-table" style="font-size:12.5px;">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Term</th>
                  <th>Class</th>
                  <th>Average</th>
                  <th>Position</th>
                  <th>Remarks</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${historicalResults.length > 0 ? historicalResults.map(hr => `
                  <tr>
                    <td><strong>${hr.session}</strong></td>
                    <td>${hr.term}</td>
                    <td>${hr.className}</td>
                    <td><strong>${hr.average}</strong></td>
                    <td><span class="badge badge-success">${hr.position}</span></td>
                    <td style="font-size:11.5px; color:var(--text-muted);">${hr.remarks}</td>
                    <td style="text-align: right;">
                      <button class="btn btn-secondary btn-sm" onclick="window.appHandlers.viewStudentHistoricalResult('${student.id}', '${hr.session}', '${hr.term}')">
                        <i data-lucide="eye"></i> View Previous Result
                      </button>
                    </td>
                  </tr>
                `).join("") : `
                  <tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:14px;">Historical grades preserved from previous school sessions.</td></tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-close">Close</button>
          <button class="btn btn-primary" onclick="window.appHandlers.previewReportCard('${student.id}', '${student.currentClassId}')"><i data-lucide="printer"></i> Print Current Report Card</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-close")?.addEventListener("click", closeAllModals);
  }

  // HISTORICAL RESULT DETAIL MODAL (Requirement 8)
  function openHistoricalResultModal(studentId, session, term) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    const historicalRecord = (student.historicalResults || []).find(r => r.session === session && r.term === term);
    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container large" style="width: 820px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:8px; background:rgba(30, 41, 59, 0.08); display:flex; align-items:center; justify-content:center; color:var(--text-heading);">
              <i data-lucide="history"></i>
            </div>
            <div>
              <h3 style="margin:0; font-size:16px;">Historical Result Record</h3>
              <div style="font-size:12px; color:var(--text-muted);">${session} • ${term}</div>
            </div>
          </div>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-subtle); padding:14px 18px; border-radius:var(--radius-md); margin-bottom:18px;">
            <div style="display:flex; align-items:center; gap:14px;">
              <img src="${student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid #cbd5e1;" />
              <div>
                <div style="font-size:16px; font-weight:700; color:var(--text-heading);">${student.name}</div>
                <div style="font-size:12.5px; color:var(--text-muted);">ID: <code>${student.studentId}</code> • Class: <strong>${historicalRecord?.className || 'Previous Class'}</strong></div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11.5px; text-transform:uppercase; color:var(--text-muted); font-weight:600;">Term Performance</div>
              <div style="font-size:20px; font-weight:800; color:var(--primary);">${historicalRecord ? historicalRecord.average : '-'} <span style="font-size:12px; font-weight:500; color:var(--text-muted);">Avg</span></div>
              <span class="badge badge-success">Position: ${historicalRecord?.position || 'N/A'}</span>
            </div>
          </div>

          <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
            <h4 style="font-size:14px; font-weight:700; margin:0; color:var(--text-heading);">Archived Subject Breakdown</h4>
            <span class="badge badge-neutral">Preserved Historical Record</span>
          </div>

          <div class="table-card" style="margin-bottom:18px;">
            <div class="table-responsive" style="max-height: 280px;">
              <table class="data-table" style="font-size:12.5px;">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th style="text-align:center;">Continuous Assessment (30)</th>
                    <th style="text-align:center;">Examination (70)</th>
                    <th style="text-align:center;">Total Score (100)</th>
                    <th style="text-align:center;">Grade</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${(historicalRecord?.subjects || [
                    { name: "English Language", ca: 24, exam: 58, total: 82, grade: "A", remarks: "Excellent" },
                    { name: "Mathematics", ca: 25, exam: 54, total: 79, grade: "A", remarks: "Distinction" },
                    { name: "Basic Science", ca: 22, exam: 50, total: 72, grade: "B", remarks: "Very Good" },
                    { name: "Social Studies", ca: 26, exam: 52, total: 78, grade: "A", remarks: "Distinction" },
                    { name: "Civic Education", ca: 27, exam: 55, total: 82, grade: "A", remarks: "Excellent" },
                    { name: "Agricultural Science", ca: 23, exam: 48, total: 71, grade: "B", remarks: "Very Good" }
                  ]).map(sub => `
                    <tr>
                      <td><strong>${sub.name}</strong></td>
                      <td style="text-align:center;">${sub.ca}</td>
                      <td style="text-align:center;">${sub.exam}</td>
                      <td style="text-align:center; font-weight:700; color:var(--text-heading);">${sub.total}</td>
                      <td style="text-align:center;"><span class="badge ${sub.grade === 'A' ? 'badge-success' : 'badge-primary'}">${sub.grade}</span></td>
                      <td style="font-size:12px; color:var(--text-muted);">${sub.remarks}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <div style="background:rgba(30, 41, 59, 0.03); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:12px 16px;">
            <div style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Teacher & Principal Remarks</div>
            <div style="font-size:13px; color:var(--text-heading); font-style:italic;">"${historicalRecord?.remarks || 'Consistently outstanding academic effort and exemplary conduct during the academic session.'}"</div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-close">Close</button>
          <button class="btn btn-primary" id="btn-print-historical-archive"><i data-lucide="printer"></i> Print Historical Result</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-close")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#btn-print-historical-archive")?.addEventListener("click", () => {
      window.exportUtils.printStudentHistoricalReportCard(studentId, session, term);
    });
  }

  // AI EXAM QUESTION GENERATOR MODAL
  function openAIGeneratorModal(currentClass) {
    const subjects = store.getClassSubjects(currentClass.id);
    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container large">
        <div class="modal-header">
          <h3>AI Examination Question Generator</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Subject</label>
              <select class="form-select" id="ai-gen-subject">
                ${subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Curriculum Topic / Theme</label>
              <input type="text" class="form-input" id="ai-gen-topic" value="Quadratic Equations & Polynomials" placeholder="e.g. Quadratic Equations, Mitosis, Mechanics">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
            <div class="form-group">
              <label class="form-label">Number of Questions</label>
              <select class="form-select" id="ai-gen-count">
                <option value="10">10 Questions</option>
                <option value="20" selected>20 Questions</option>
                <option value="30">30 Questions</option>
                <option value="40">40 Questions</option>
                <option value="50">50 Questions</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Paper Structure</label>
              <select class="form-select" id="ai-gen-structure">
                <option value="Mixed" selected>Mixed (Objective + Theory)</option>
                <option value="Objective">Objective Only (Section A)</option>
                <option value="Theory">Theory Only (Section B)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Difficulty Level</label>
              <select class="form-select" id="ai-gen-diff">
                <option value="Medium" selected>Medium (Standard WAEC)</option>
                <option value="Easy">Easy</option>
                <option value="Hard">Hard / Advanced</option>
                <option value="Mixed">Mixed Difficulty</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Upload Curriculum Notes / Past Questions (Optional)</label>
            <div style="border:2px dashed var(--border-color); border-radius:var(--radius-md); padding:18px; text-align:center; background:#fafafa;">
              <i data-lucide="upload-cloud" style="width:32px; height:32px; color:var(--primary); margin:0 auto 6px auto;"></i>
              <div style="font-size:13px; font-weight:600;">Drag & Drop curriculum files or browse</div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Supports PDF, Word DOCX, PNG, JPG notes</div>
              <input type="file" id="ai-gen-file-input" multiple style="margin-top:8px; font-size:12px;">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-btn-generate-exam"><i data-lucide="sparkles"></i> Generate Nigerian Exam Paper</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#modal-btn-generate-exam")?.addEventListener("click", async () => {
      const subjectName = document.getElementById("ai-gen-subject")?.value;
      const topic = document.getElementById("ai-gen-topic")?.value;
      const count = document.getElementById("ai-gen-count")?.value;
      const structure = document.getElementById("ai-gen-structure")?.value;
      const diff = document.getElementById("ai-gen-diff")?.value;

      showToast("AI is generating authentic examination paper...", "info");

      const generated = await window.aiGenerator.generateQuestions({
        subjectName,
        className: currentClass.name,
        topic,
        count,
        type: structure,
        difficulty: diff,
        session: currentClass.session
      });

      const subObj = store.getOrCreateSubjectByName(subjectName);
      const createdSet = store.createQuestionSet({
        title: generated.title,
        teacherId: store.getCurrentTeacherId(),
        classId: currentClass.id,
        subjectId: subObj.id,
        session: currentClass.session,
        topic,
        difficulty: diff,
        questionType: structure,
        duration: generated.duration,
        instructions: generated.instructions,
        objectiveQuestions: generated.objectiveQuestions,
        theoryQuestions: generated.theoryQuestions,
        questions: generated.questions,
        totalMarks: generated.totalMarks,
        status: "Draft"
      });

      closeAllModals();
      renderView();
      showToast("Examination paper generated! Opening document editor.", "success");
      openQuestionDocumentEditorModal(createdSet.id);
    });
  }

  // EDITABLE DOCUMENT-STYLE NIGERIAN EXAMINATION PAPER
  function openQuestionDocumentEditorModal(setId) {
    const questionSet = store.getQuestionSetById(setId);
    if (!questionSet) return;

    const school = store.getSchool();
    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    const objQuestions = questionSet.objectiveQuestions || [];
    const theoryQuestions = questionSet.theoryQuestions || [];

    overlay.innerHTML = `
      <div class="modal-container large" style="width: 900px;">
        <div class="modal-header">
          <h3>Nigerian Examination Paper Document</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div class="exam-doc-card">
            <div class="exam-doc-header">
              <div class="exam-doc-school-name">${school.name}</div>
              <div style="font-size:11px; font-style:italic;">"${school.motto}" • ${school.address}</div>
              <div class="exam-doc-title">${questionSet.term.toUpperCase()} EXAMINATION</div>
              <div style="font-size:13px; font-weight:700;">${questionSet.session} ACADEMIC SESSION</div>

              <div class="exam-doc-meta-row">
                <div>SUBJECT: <strong>${questionSet.subjectName}</strong></div>
                <div>CLASS: <strong>${questionSet.className}</strong></div>
                <div>TIME: <strong>${questionSet.duration}</strong></div>
                <div>TOTAL: <strong>${questionSet.totalMarks} MARKS</strong></div>
              </div>
            </div>

            <div style="border:1px solid #000; padding:8px 12px; font-size:11px; margin-bottom:16px; background:#fafafa;">
              <strong>GENERAL INSTRUCTIONS:</strong> ${questionSet.instructions}
            </div>

            ${objQuestions.length > 0 ? `
              <div class="exam-section-divider">SECTION A: OBJECTIVE QUESTIONS (MULTIPLE CHOICE)</div>
              ${objQuestions.map((q, idx) => `
                <div class="exam-question-item">
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong>Question ${idx + 1}</strong>
                    <span class="badge badge-neutral">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
                  </div>
                  <input type="text" class="form-input" value="${q.prompt}" style="margin-bottom:6px; font-size:13px;">
                  ${q.options && q.options.length > 0 ? `
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                      ${q.options.map((opt, oIdx) => `
                        <input type="text" class="form-input" style="font-size:12px;" value="${String.fromCharCode(65 + oIdx)}. ${opt}">
                      `).join("")}
                    </div>
                  ` : ''}
                </div>
              `).join("")}
            ` : ''}

            ${theoryQuestions.length > 0 ? `
              <div class="exam-section-divider">SECTION B: THEORY & STRUCTURED ESSAY</div>
              ${theoryQuestions.map((q, idx) => `
                <div class="exam-question-item">
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong>Question ${idx + 1} (${q.subType || 'Theory'})</strong>
                    <span class="badge badge-neutral">[${q.marks} Marks]</span>
                  </div>
                  <textarea class="form-textarea" rows="2" style="font-size:13px;">${q.prompt}</textarea>
                </div>
              `).join("")}
            ` : ''}
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Close</button>
          <button class="btn btn-secondary" id="btn-print-exam-paper"><i data-lucide="printer"></i> Print Paper</button>
          <button class="btn btn-primary" id="btn-submit-question-set"><i data-lucide="send"></i> Submit Questions to Admin</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#btn-print-exam-paper")?.addEventListener("click", () => {
      window.exportUtils.printExamPaper(questionSet);
    });

    overlay.querySelector("#btn-submit-question-set")?.addEventListener("click", () => {
      store.submitQuestionSet(setId);
      closeAllModals();
      renderView();
      showToast("Question set submitted to Admin for approval.", "success");
    });
  }

  // QUESTION REVIEW MODAL FOR ADMIN (Audio 4: Full Official Examination Paper Preview)
  function openQuestionReviewModal(setId) {
    const questionSet = store.getQuestionSetById(setId);
    if (!questionSet) return;

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    const totalMarks = questionSet.questions.reduce((acc, q) => acc + (q.marks || 1), 0);

    overlay.innerHTML = `
      <div class="modal-container large" style="width: 900px; max-width: 95vw;">
        <div class="modal-header">
          <h3>Admin Examination Paper Review & Question Bank Verification</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body" style="max-height: 75vh; overflow-y: auto;">
          <!-- Full Official Examination Paper Document Preview -->
          <div class="exam-paper-document" style="margin-bottom: 20px;">
            <div class="exam-paper-header">
              <div style="display:flex; justify-content:center; align-items:center; gap:10px; margin-bottom:6px;">
                <div class="brand-crest" style="width:36px; height:36px; font-size:14px; background:#0f172a; box-shadow:none;">
                  <i data-lucide="award" style="width:18px; height:18px;"></i>
                </div>
                <div class="exam-paper-school-title">Crown Hill Academy, Lagos</div>
              </div>
              <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-heading);">
                ${questionSet.term || 'First Term'} Examination • Unified Academic Assessment
              </div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                Academic Session: <strong>${questionSet.session}</strong>
              </div>
            </div>

            <div class="exam-paper-meta-grid">
              <div><strong>Class:</strong> ${questionSet.className}</div>
              <div><strong>Subject:</strong> ${questionSet.subjectName}</div>
              <div><strong>Time Allowed:</strong> 1 Hr 30 Mins</div>
              <div><strong>Total Marks:</strong> ${totalMarks} Marks</div>
            </div>

            <div style="font-size: 12px; font-style: italic; color: var(--text-muted); margin-bottom: 16px; padding: 8px 12px; background: #fffbf7; border-left: 3px solid var(--primary); border-radius: var(--radius-sm);">
              <strong>Instructions to Candidates:</strong> Answer all questions carefully. Select the most appropriate option for multiple-choice questions and provide detailed working for theory questions.
            </div>

            <div style="font-size: 14px; font-weight: 700; color: var(--text-heading); border-bottom: 1px solid var(--border-color); padding-bottom: 6px; margin-bottom: 14px;">
              Examination Questions (${questionSet.questions.length} Items):
            </div>

            <div class="exam-questions-list">
              ${questionSet.questions.map((q, i) => `
                <div class="exam-question-item">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
                    <div style="font-size: 13.5px; line-height: 1.5; color: var(--text-heading);">
                      <strong>${i + 1}.</strong> ${q.prompt}
                    </div>
                    <span class="badge badge-neutral" style="font-size: 11px; white-space: nowrap; flex-shrink: 0;">[${q.marks || 1} Mark${(q.marks || 1) > 1 ? 's' : ''}]</span>
                  </div>

                  ${q.options && q.options.length > 0 ? `
                    <div class="exam-mcq-options-grid">
                      ${q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isCorrect = q.correctAnswer && (q.correctAnswer === opt || q.correctAnswer === letter);
                        return `
                          <div style="display:flex; align-items:center; gap:6px; color: ${isCorrect ? 'var(--success)' : 'var(--text-body)'}; font-weight: ${isCorrect ? '600' : 'normal'};">
                            <span style="font-weight:700; width:18px;">(${letter})</span>
                            <span>${opt}</span>
                            ${isCorrect ? `<i data-lucide="check" style="width:14px; height:14px; color:var(--success);"></i>` : ''}
                          </div>
                        `;
                      }).join("")}
                    </div>
                  ` : `
                    <div style="margin-top: 8px; padding-left: 20px; font-size: 12px; color: var(--text-muted); font-style: italic;">
                      [Theory / Essay Response Required - Marking Scheme: ${q.correctAnswer || 'Full conceptual working required'}]
                    </div>
                  `}
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Admin Revision & Verification Controls -->
          <div class="table-card" style="padding: 16px; background: var(--bg-subtle);">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-weight: 700;">Admin Notes / Teacher Feedback (Optional)</label>
              <input type="text" class="form-input" id="admin-review-notes" placeholder="e.g. Excellent structure, approved for terminal examination...">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Close</button>
          <button class="btn btn-danger-outline" id="btn-admin-reject"><i data-lucide="x-circle"></i> Reject</button>
          <button class="btn btn-secondary" id="btn-admin-req-revision"><i data-lucide="edit-3"></i> Request Revision</button>
          <button class="btn btn-success" id="btn-admin-approve"><i data-lucide="check-circle"></i> Approve for Question Bank</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#btn-admin-approve")?.addEventListener("click", () => {
      const notes = document.getElementById("admin-review-notes")?.value || "Approved for Question Bank.";
      store.adminReviewQuestionSet(setId, "Approved", notes);
      closeAllModals();
      renderView();
      showToast("Question set approved and verified into school Question Bank!", "success");
    });

    overlay.querySelector("#btn-admin-req-revision")?.addEventListener("click", () => {
      const notes = document.getElementById("admin-review-notes")?.value || "Please revise question allocations.";
      store.adminReviewQuestionSet(setId, "Revision Requested", notes);
      closeAllModals();
      renderView();
      showToast("Revision requested from subject teacher.", "info");
    });

    overlay.querySelector("#btn-admin-reject")?.addEventListener("click", () => {
      const notes = document.getElementById("admin-review-notes")?.value || "Does not meet curriculum assessment standards.";
      store.adminReviewQuestionSet(setId, "Rejected", notes);
      closeAllModals();
      renderView();
      showToast("Question set rejected.", "error");
    });
  }

  // EXAM PAPER BUILDER MODAL
  function openExamBuilderModal(defaultClass = null) {
    const questionBank = store.getQuestionBank();
    const classes = store.getClasses();
    const subjects = store.getSubjects();

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container large">
        <div class="modal-header">
          <h3>Compose Official Examination Paper</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Class</label>
              <select class="form-select" id="exam-build-class">
                ${classes.map(c => `<option value="${c.id}" ${c.id === defaultClass?.id ? 'selected' : ''}>${c.name} (${c.session})</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Subject</label>
              <select class="form-select" id="exam-build-subject">
                ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Select Approved Questions from Bank (${questionBank.length} Available)</label>
            <div style="max-height:180px; overflow-y:auto; border:1px solid var(--border-color); padding:8px; border-radius:var(--radius-md);">
              ${questionBank.map(q => `
                <label style="display:flex; align-items:flex-start; gap:8px; font-size:12.5px; padding:4px 0; border-bottom:1px solid #f1f5f9; cursor:pointer;">
                  <input type="checkbox" value="${q.id}" class="exam-bank-check" checked>
                  <div>
                    <strong>[${q.type}]</strong> ${q.prompt} <em>(${q.marks} Marks • ${q.subjectName})</em>
                  </div>
                </label>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="modal-btn-generate-official-paper"><i data-lucide="file-check"></i> Generate & Print Paper</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#modal-btn-generate-official-paper")?.addEventListener("click", () => {
      const classId = document.getElementById("exam-build-class")?.value;
      const subjectId = document.getElementById("exam-build-subject")?.value;
      const selectedQIds = Array.from(overlay.querySelectorAll(".exam-bank-check:checked")).map(el => el.value);

      const selectedQuestions = questionBank.filter(q => selectedQIds.includes(q.id));
      const paper = store.createExaminationPaper({
        classId,
        subjectId,
        questions: selectedQuestions
      });

      closeAllModals();
      renderView();
      showToast("Official Examination Paper composed successfully!", "success");
      window.exportUtils.printExamPaper(paper);
    });
  }

  // REPORT CARD PREVIEW MODAL
  function previewReportCardModal(studentId, classId) {
    const student = store.getStudentById(studentId);
    const cls = store.getClassById(classId || student.currentClassId);
    const school = store.getSchool();
    const results = store.getResults();

    window.exportUtils.printStudentReportCard(student, results, cls, school);
  }

  // NOTIFICATIONS MODAL
  function openNotificationsModal() {
    const role = store.getCurrentRole();
    const isTeacher = role === "teacher";
    const currentTeacherId = store.getCurrentTeacherId();
    const notifications = store.getNotifications(isTeacher ? "Teacher" : "Admin", isTeacher ? currentTeacherId : null);

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Notifications & Activity Updates</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          ${notifications.length > 0 ? notifications.map(n => `
            <div style="padding:10px; border-bottom:1px solid var(--border-color); font-size:13px;">
              <div style="font-weight:700; color:var(--text-heading);">${n.title}</div>
              <div style="color:var(--text-muted); margin-top:2px;">${n.message}</div>
              <div style="font-size:11px; color:var(--text-subtle); margin-top:4px;">${n.time}</div>
            </div>
          `).join("") : `<div style="text-align:center; padding:20px; color:var(--text-muted);">No new notifications.</div>`}
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-mark-read">Mark All as Read</button>
          <button class="btn btn-primary" id="modal-btn-cancel">Close</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-mark-read")?.addEventListener("click", () => {
      store.markNotificationsRead(isTeacher ? "Teacher" : "Admin", isTeacher ? currentTeacherId : null);
      renderHeader();
      closeAllModals();
      showToast("Notifications marked as read.", "success");
    });
  }

  // TIMETABLE SLOT ADD / EDIT MODAL WITH LIVE CONFLICT DETECTION
  function openTimetableSlotModal(slotId = null, defaultClassId = null, defaultDay = "Monday", defaultPeriod = 1) {
    const existingSlot = slotId ? store.getTimetableSlotById(slotId) : null;
    const currentSession = existingSlot ? existingSlot.session : activeSessionFilter;
    const currentTerm = existingSlot ? existingSlot.term : activeTermFilter;
    const classes = store.getClasses(currentSession);
    const targetClassId = existingSlot ? existingSlot.classId : (defaultClassId || timetableClassId || classes[0]?.id);
    const selectedClass = store.getClassById(targetClassId) || classes[0];

    const assignedSubjects = store.getClassSubjects(selectedClass?.id);
    const allSubjects = store.getSubjects();
    const subjectsList = assignedSubjects.length > 0 ? assignedSubjects : allSubjects;
    const teachers = store.getAvailableTeachers();
    const venues = store.getVenues();
    const periods = store.getTimetablePeriods().filter(p => !p.isBreak);
    const days = store.getTimetableDays();

    const selectedSubjectId = existingSlot ? existingSlot.subjectId : subjectsList[0]?.id;
    const selectedTeacherId = existingSlot ? existingSlot.teacherId : (store.getSubjectTeacherForClass(selectedClass?.id, selectedSubjectId)?.id || teachers[0]?.id);
    const selectedDay = existingSlot ? existingSlot.day : (defaultDay || "Monday");
    const selectedPeriodNum = existingSlot ? Number(existingSlot.periodNumber) : Number(defaultPeriod || 1);
    const selectedRoom = existingSlot ? existingSlot.room : (selectedClass ? `Room ${selectedClass.name}` : "Main Classroom");
    const selectedType = existingSlot ? existingSlot.type : "Lecture";

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container large" style="width: 780px;">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:8px; background:rgba(20, 43, 71, 0.08); display:flex; align-items:center; justify-content:center; color:var(--primary);">
              <i data-lucide="calendar-plus"></i>
            </div>
            <div>
              <h3 style="margin:0; font-size:16px;">${existingSlot ? 'Edit Period Slot' : 'Schedule New Period Slot'}</h3>
              <div style="font-size:12px; color:var(--text-muted);">${currentSession} Academic Session • ${currentTerm}</div>
            </div>
          </div>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Academic Class</label>
              <select class="form-select" id="tt-modal-class">
                ${classes.map(c => `<option value="${c.id}" ${c.id === selectedClass?.id ? 'selected' : ''}>${c.name} (${c.session})</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Day of the Week</label>
              <select class="form-select" id="tt-modal-day">
                ${days.map(d => `<option value="${d}" ${d === selectedDay ? 'selected' : ''}>${d}</option>`).join("")}
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Period Slot & Timing</label>
              <select class="form-select" id="tt-modal-period">
                ${periods.map(p => `<option value="${p.id}" ${Number(p.id) === selectedPeriodNum ? 'selected' : ''}>${p.label} (${p.time})</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Period / Session Type</label>
              <select class="form-select" id="tt-modal-type">
                <option value="Lecture" ${selectedType === 'Lecture' ? 'selected' : ''}>Lecture (Standard Classroom)</option>
                <option value="Practical" ${selectedType === 'Practical' ? 'selected' : ''}>Practical / Laboratory Session</option>
                <option value="Tutorial" ${selectedType === 'Tutorial' ? 'selected' : ''}>Tutorial & Problem Solving</option>
                <option value="Revision" ${selectedType === 'Revision' ? 'selected' : ''}>Revision & Curriculum Review</option>
                <option value="Assessment" ${selectedType === 'Assessment' ? 'selected' : ''}>Continuous Assessment Test (CAT)</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
            <div class="form-group">
              <label class="form-label">Subject</label>
              <select class="form-select" id="tt-modal-subject">
                ${subjectsList.map(s => `<option value="${s.id}" ${s.id === selectedSubjectId ? 'selected' : ''}>${s.name}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Subject Teacher</label>
              <select class="form-select" id="tt-modal-teacher">
                ${teachers.map(t => `<option value="${t.id}" ${t.id === selectedTeacherId ? 'selected' : ''}>${t.name} (${t.specialization.split('&')[0]})</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Classroom / Facility / Lab Venue</label>
            <select class="form-select" id="tt-modal-room">
              ${venues.map(v => `<option value="${v.name}" ${v.name === selectedRoom ? 'selected' : ''}>${v.name} • ${v.type} (${v.building})</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Lesson Focus / Notes (Optional)</label>
            <input type="text" class="form-input" id="tt-modal-notes" value="${existingSlot ? (existingSlot.notes || '') : ''}" placeholder="e.g. Simultaneous Equations, Plant Anatomy, Optics Lab">
          </div>

          <!-- Real-Time Conflict Detection Preview Box -->
          <div id="tt-modal-conflict-box" class="modal-conflict-box safe">
            <i data-lucide="check-circle" style="width:16px; height:16px; flex-shrink:0;"></i>
            <span id="tt-modal-conflict-msg">Checking real-time schedule conflict engine...</span>
          </div>
        </div>

        <div class="modal-footer">
          ${existingSlot ? `
            <button class="btn btn-outline-danger" id="tt-modal-btn-delete" style="margin-right:auto;"><i data-lucide="trash-2"></i> Delete Period</button>
          ` : ''}
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="tt-modal-btn-save"><i data-lucide="check"></i> ${existingSlot ? 'Update Period' : 'Save Period Slot'}</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    // Live Conflict Detection Engine
    const updateConflictStatus = () => {
      const classId = document.getElementById("tt-modal-class")?.value;
      const day = document.getElementById("tt-modal-day")?.value;
      const periodNumber = document.getElementById("tt-modal-period")?.value;
      const teacherId = document.getElementById("tt-modal-teacher")?.value;
      const room = document.getElementById("tt-modal-room")?.value;

      const conflicts = store.detectTimetableConflicts({
        classId,
        session: currentSession,
        term: currentTerm,
        day,
        periodNumber,
        teacherId,
        room
      }, existingSlot?.id);

      const conflictBox = document.getElementById("tt-modal-conflict-box");
      const conflictMsg = document.getElementById("tt-modal-conflict-msg");
      if (!conflictBox || !conflictMsg) return;

      if (conflicts.length === 0) {
        conflictBox.className = "modal-conflict-box safe";
        conflictBox.innerHTML = `
          <i data-lucide="check-circle" style="width:16px; height:16px; flex-shrink:0; color:#166534;"></i>
          <span><strong>Safe to Schedule:</strong> No conflicts detected. Teacher and facility are available for Period ${periodNumber} on ${day}.</span>
        `;
      } else {
        const hasCritical = conflicts.some(c => c.severity === "high" || c.type === "teacher");
        conflictBox.className = `modal-conflict-box ${hasCritical ? 'danger' : 'warning'}`;
        conflictBox.innerHTML = `
          <i data-lucide="alert-triangle" style="width:16px; height:16px; flex-shrink:0;"></i>
          <div>
            <strong>Schedule Collision Detected!</strong>
            <ul style="margin:4px 0 0 16px; padding:0;">
              ${conflicts.map(c => `<li>${c.message}</li>`).join("")}
            </ul>
          </div>
        `;
      }
      if (window.lucide) window.lucide.createIcons();
    };

    // Attach reactive input change listeners
    ["tt-modal-class", "tt-modal-day", "tt-modal-period", "tt-modal-teacher", "tt-modal-room"].forEach(id => {
      document.getElementById(id)?.addEventListener("change", updateConflictStatus);
    });

    updateConflictStatus();

    // Delete handler
    overlay.querySelector("#tt-modal-btn-delete")?.addEventListener("click", () => {
      if (existingSlot && confirm("Delete this period from the timetable?")) {
        store.deleteTimetableSlot(existingSlot.id);
        closeAllModals();
        renderView();
        showToast("Period removed from timetable.", "info");
      }
    });

    // Save handler
    overlay.querySelector("#tt-modal-btn-save")?.addEventListener("click", () => {
      const classId = document.getElementById("tt-modal-class")?.value;
      const day = document.getElementById("tt-modal-day")?.value;
      const periodNumber = document.getElementById("tt-modal-period")?.value;
      const subjectId = document.getElementById("tt-modal-subject")?.value;
      const teacherId = document.getElementById("tt-modal-teacher")?.value;
      const room = document.getElementById("tt-modal-room")?.value;
      const type = document.getElementById("tt-modal-type")?.value;
      const notes = document.getElementById("tt-modal-notes")?.value;

      const conflicts = store.detectTimetableConflicts({
        classId,
        session: currentSession,
        term: currentTerm,
        day,
        periodNumber,
        teacherId,
        room
      }, existingSlot?.id);

      const hasTeacherCollision = conflicts.some(c => c.type === "teacher");
      if (hasTeacherCollision) {
        if (!confirm("Warning: A teacher double-booking collision was detected on this period. Do you still want to proceed and save?")) {
          return;
        }
      }

      store.saveTimetableSlot({
        id: existingSlot ? existingSlot.id : null,
        classId,
        session: currentSession,
        term: currentTerm,
        day,
        periodNumber,
        subjectId,
        teacherId,
        room,
        type,
        notes
      });

      closeAllModals();
      renderView();
      showToast(`Saved period slot for ${store.getClassById(classId)?.name || 'Class'} (${day} P${periodNumber})!`, "success");
    });
  }

  // COPY TIMETABLE MODAL
  function openCopyTimetableModal(targetClassId) {
    const targetClass = store.getClassById(targetClassId);
    const classes = store.getClasses(activeSessionFilter);
    const availableSources = classes.filter(c => c.id !== targetClassId);

    if (availableSources.length === 0) {
      showToast("No other classes available to copy timetable from.", "info");
      return;
    }

    const overlay = document.getElementById("global-modal-overlay");
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Copy Timetable Structure</h3>
          <button class="header-icon-btn" id="modal-close-x"><i data-lucide="x"></i></button>
        </div>

        <div class="modal-body">
          <div style="background:var(--bg-subtle); padding:12px; border-radius:var(--radius-md); margin-bottom:14px;">
            Target Class: <strong>${targetClass?.name}</strong> (${activeSessionFilter} • ${activeTermFilter})
          </div>

          <div class="form-group">
            <label class="form-label">Select Source Class to Copy From</label>
            <select class="form-select" id="tt-copy-source-class">
              ${availableSources.map(c => `
                <option value="${c.id}">${c.name} (${c.session})</option>
              `).join("")}
            </select>
          </div>

          <div style="font-size:12px; color:var(--text-muted);">
            Note: This will replicate the weekly period layout into <strong>${targetClass?.name}</strong>.
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-btn-cancel">Cancel</button>
          <button class="btn btn-primary" id="tt-btn-confirm-copy"><i data-lucide="copy"></i> Copy Timetable</button>
        </div>
      </div>
    `;

    overlay.classList.add("active");
    if (window.lucide) window.lucide.createIcons();

    overlay.querySelector("#modal-close-x")?.addEventListener("click", closeAllModals);
    overlay.querySelector("#modal-btn-cancel")?.addEventListener("click", closeAllModals);

    overlay.querySelector("#tt-btn-confirm-copy")?.addEventListener("click", () => {
      const sourceClassId = document.getElementById("tt-copy-source-class")?.value;
      try {
        store.copyClassTimetable(sourceClassId, targetClassId, activeSessionFilter, activeTermFilter);
        closeAllModals();
        renderView();
        showToast(`Copied timetable to ${targetClass?.name} successfully!`, "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // Global App Handlers Mount for Inline Handlers
  window.appHandlers = {
    openStudentProfile: (id) => openStudentProfileModal(id),
    viewStudentHistoricalResult: (sId, session, term) => openHistoricalResultModal(sId, session, term),
    openTransferModal: (id) => openTransferStudentModal(id),
    openPromoteModal: (id) => openPromoteStudentModal(id),
    openScoreModal: (sId, cId, subId, type) => openScoreModal(sId, cId, subId, type),
    previewQuestionSet: (id) => openQuestionDocumentEditorModal(id),
    openQuestionReviewModal: (id) => openQuestionReviewModal(id),
    previewReportCard: (sId, cId) => previewReportCardModal(sId, cId),
    openAddTeacherModal: () => openAddTeacherModal(),
    openAssignTeacherModal: (tId) => openAssignTeacherModal(tId),
    removeTeacherAssignment: (assignmentId, tId) => {
      store.removeTeacherAssignment(assignmentId);
      openAssignTeacherModal(tId);
      showToast("Assignment removed.", "info");
    },
    openAddSubjectToClassModal: (cId) => openAddSubjectToClassModal(cId),
    removeClassSubject: (cId, subId) => {
      store.removeClassSubject(cId, subId);
      renderView();
      showToast("Subject removed from class.", "info");
    },
    openAddStudentForClassModal: (cId) => openAddStudentModal(cId),
    openTeacherClassWorkspace: (cId) => {
      activeClassId = cId;
      navigate("teacher-class-workspace", { classId: cId });
    },
    selectResultClass: (cId) => {
      resultClassId = cId;
      resultViewMode = "detail";
      renderView();
    },
    openTeacherSubjectScoreReview: (cId, subId) => openTeacherSubjectScoreReviewModal(cId, subId),
    openBatchPromoteModal: (cId, session, term) => openBatchPromoteModal(cId, session, term),
    adminApproveSubjectResult: (cId, subId) => {
      store.adminReviewResults(cId, subId, "Approved", "Approved by Principal's office.", resultSession, resultTerm);
      renderView();
      showToast("Subject results approved.", "success");
    },
    // Timetable & Planner Handlers
    openTimetableSlotModal: (slotId, classId, day, period) => openTimetableSlotModal(slotId, classId, day, period),
    deleteTimetableSlot: (slotId) => {
      if (confirm("Delete this period slot?")) {
        store.deleteTimetableSlot(slotId);
        renderView();
        showToast("Period deleted.", "info");
      }
    },
    autoGenerateTimetable: (classId) => {
      const cls = store.getClassById(classId);
      if (cls && confirm(`Auto-generate weekly timetable for ${cls.name}?`)) {
        try {
          store.autoGenerateClassTimetable(classId, activeSessionFilter, activeTermFilter, true);
          renderView();
          showToast(`Auto-generated schedule for ${cls.name}!`, "success");
        } catch (err) {
          showToast(err.message, "error");
        }
      }
    },
    printClassTimetable: (classId) => {
      const cls = store.getClassById(classId);
      if (!cls) return;
      const periods = store.getTimetablePeriods();
      const days = store.getTimetableDays();
      const slots = store.getTimetableSlots({ classId, session: cls.session });
      window.exportUtils.printTimetable(cls, slots, periods, days, store.getSchool(), cls.session, activeTermFilter);
    },
    exportClassTimetableCSV: (classId) => {
      const cls = store.getClassById(classId);
      if (!cls) return;
      const periods = store.getTimetablePeriods();
      const days = store.getTimetableDays();
      const slots = store.getTimetableSlots({ classId, session: cls.session });
      window.exportUtils.downloadTimetableCSV(cls, slots, periods, days, cls.session, activeTermFilter);
      showToast(`Exported ${cls.name} Timetable CSV.`, "success");
    }
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function init() {
    renderSidebar();
    renderHeader();
    renderView();
    if (window.lucide) window.lucide.createIcons();
  }

  // Subscribe store state updates
  store.subscribe(() => {
    renderHeader();
  });

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  }
})();