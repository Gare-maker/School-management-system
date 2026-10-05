// Crown Hill Academy Data Store (LocalStorage State Engine)
// Strict Implementation of the Academic Year/Session + Class Two-Panel System

class Store {
  constructor() {
    this.STORAGE_KEY = "CHA_SCHOOL_MANAGEMENT_DB_v3";
    this.ROLE_KEY = "CHA_CURRENT_ROLE";
    this.TEACHER_KEY = "CHA_CURRENT_TEACHER";
    this.SESSION_KEY = "CHA_CURRENT_SESSION";
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY);
        const parsed = JSON.parse(serialized);
        if (parsed && parsed.school && parsed.classes && parsed.students) {
          if (!parsed.attendance || !Array.isArray(parsed.attendance)) {
            parsed.attendance = JSON.parse(JSON.stringify((window.INITIAL_DATA && window.INITIAL_DATA.attendance) || []));
          }
          // Sync formTeacherId from initial data if missing in existing local storage
          if (window.INITIAL_DATA && window.INITIAL_DATA.classes) {
            parsed.classes.forEach(c => {
              if (!c.formTeacherId) {
                const initCls = window.INITIAL_DATA.classes.find(ic => ic.id === c.id);
                if (initCls && initCls.formTeacherId) {
                  c.formTeacherId = initCls.formTeacherId;
                }
              }
            });
          }
          return parsed;
        }
    } catch (e) {
      console.warn("Could not load from localStorage, initializing fresh state", e);
    }
    // Deep clone initial data
    const initial = JSON.parse(JSON.stringify(window.INITIAL_DATA || {}));
    this.saveState(initial);
    return initial;
  }

  saveState(stateToSave = this.state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
      this.state = stateToSave;
      this.notify();
    } catch (e) {
      console.error("Error saving state to localStorage", e);
    }
  }

  resetToDefault() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.state = JSON.parse(JSON.stringify(window.INITIAL_DATA || {}));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --------------------------------------------------------------------------
  // Role and Persona Session
  // --------------------------------------------------------------------------
  getCurrentRole() {
    return localStorage.getItem(this.ROLE_KEY) || "admin";
  }

  setCurrentRole(role) {
    localStorage.setItem(this.ROLE_KEY, role);
    this.notify();
  }

  getCurrentTeacherId() {
    return localStorage.getItem(this.TEACHER_KEY) || "tch_john";
  }

  setCurrentTeacherId(teacherId) {
    localStorage.setItem(this.TEACHER_KEY, teacherId);
    this.notify();
  }

  getCurrentTeacher() {
    const id = this.getCurrentTeacherId();
    return this.state.teachers.find(t => t.id === id) || this.state.teachers[0];
  }

  getAvailableTeachers() {
    return this.state.teachers.filter(t => t.status === "Active");
  }

  // --------------------------------------------------------------------------
  // Academic Session Management
  // --------------------------------------------------------------------------
  getCurrentSession() {
    return this.state.school.currentSession || "2026/2027";
  }

  setCurrentSession(session) {
    this.state.school.currentSession = session;
    this.saveState();
  }

  getAvailableSessions() {
    return this.state.school.availableSessions || ["2026/2027", "2025/2026", "2024/2025", "2023/2024", "2022/2023"];
  }

  getAvailableTerms() {
    return this.state.school.availableTerms || ["First Term", "Second Term", "Third Term"];
  }

  getPredefinedClassLevels() {
    return this.state.predefinedClassLevels || (window.INITIAL_DATA && window.INITIAL_DATA.predefinedClassLevels) || [
      { level: "Creche", category: "Early Years", label: "Creche" },
      { level: "Playgroup", category: "Early Years", label: "Playgroup" },
      { level: "KG 1", category: "Early Years", label: "KG 1 (Kindergarten 1)" },
      { level: "KG 2", category: "Early Years", label: "KG 2 (Kindergarten 2)" },
      { level: "Nursery 1", category: "Early Years", label: "Nursery 1" },
      { level: "Nursery 2", category: "Early Years", label: "Nursery 2" },
      { level: "Basic 1", category: "Primary", label: "Basic 1 (Primary 1)" },
      { level: "Basic 2", category: "Primary", label: "Basic 2 (Primary 2)" },
      { level: "Basic 3", category: "Primary", label: "Basic 3 (Primary 3)" },
      { level: "Basic 4", category: "Primary", label: "Basic 4 (Primary 4)" },
      { level: "Basic 5", category: "Primary", label: "Basic 5 (Primary 5)" },
      { level: "Basic 6", category: "Primary", label: "Basic 6 (Primary 6)" },
      { level: "JS1", category: "Junior Secondary", label: "JSS 1 (JS1)" },
      { level: "JS2", category: "Junior Secondary", label: "JSS 2 (JS2)" },
      { level: "JS3", category: "Junior Secondary", label: "JSS 3 (JS3)" },
      { level: "SS1", category: "Senior Secondary", label: "SSS 1 (SS1)" },
      { level: "SS2", category: "Senior Secondary", label: "SSS 2 (SS2)" },
      { level: "SS3", category: "Senior Secondary", label: "SSS 3 (SS3)" }
    ];
  }

  // --------------------------------------------------------------------------
  // School Settings & Grade Calculation
  // --------------------------------------------------------------------------
  getSchool() {
    return this.state.school;
  }

  updateSchoolSettings(updated) {
    this.state.school = { ...this.state.school, ...updated };
    this.addAuditLog("Updated School Settings", "System Configuration", "Modified school parameters, session, or grading scales.");
    this.saveState();
  }

  // Calculate grade according to configurable weights (Default: Projects 10%, Assessments 20%, Exam 70%)
  calculateGrade(project, assessment, exam) {
    const p = (project !== null && project !== undefined && project !== "") ? Number(project) : null;
    const a = (assessment !== null && assessment !== undefined && assessment !== "") ? Number(assessment) : null;
    const e = (exam !== null && exam !== undefined && exam !== "") ? Number(exam) : null;

    if (p === null && a === null && e === null) {
      return { total: null, grade: "", remark: "", gpa: 0 };
    }

    const total = (p || 0) + (a || 0) + (e || 0);
    const scale = this.state.school.gradingScale || [];
    const matched = scale.find(s => total >= s.minScore && total <= s.maxScore) || {
      grade: total >= 70 ? "A" : total >= 60 ? "B" : total >= 50 ? "C" : total >= 45 ? "D" : total >= 40 ? "E" : "F",
      remark: total >= 70 ? "Excellent" : total >= 60 ? "Very Good" : total >= 50 ? "Good" : total >= 45 ? "Fair" : total >= 40 ? "Pass" : "Fail",
      gpa: total >= 70 ? 5.0 : total >= 60 ? 4.0 : total >= 50 ? 3.0 : total >= 45 ? 2.0 : total >= 40 ? 1.0 : 0.0
    };

    return {
      total: Math.round(total * 10) / 10,
      grade: matched.grade,
      remark: matched.remark,
      gpa: matched.gpa
    };
  }

  // --------------------------------------------------------------------------
  // Classes Management (Section 7, 8, 9)
  // --------------------------------------------------------------------------
  getClasses(session = null) {
    if (session && session !== "all") {
      return this.state.classes.filter(c => c.session === session);
    }
    return this.state.classes;
  }

  getClassById(classId) {
    return this.state.classes.find(c => c.id === classId);
  }

  createClass(classData) {
    const session = classData.session || this.getCurrentSession();
    const cleanSession = session.replace(/\//g, "_");
    const cleanName = classData.name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const newId = `cls_${cleanSession}_${cleanName}`;

    const existing = this.state.classes.find(c => c.id === newId || (c.name.toLowerCase() === classData.name.trim().toLowerCase() && c.session === session));
    if (existing) {
      throw new Error(`Class ${classData.name} already exists for academic session ${session}.`);
    }

    const newClass = {
      id: newId,
      name: classData.name.trim().toUpperCase(),
      level: classData.level || classData.name.trim().substring(0, 3).toUpperCase(),
      section: classData.section || "A",
      category: classData.category || (classData.name.toUpperCase().startsWith("SS") ? "Senior Secondary" : "Junior Secondary"),
      session,
      status: "Active",
      studentCount: 0,
      subjectsCount: 0,
      teachersCount: 0
    };

    this.state.classes.push(newClass);

    // Assign Initial Subjects if provided
    if (classData.subjectIds && Array.isArray(classData.subjectIds)) {
      classData.subjectIds.forEach(subId => {
        this.state.classSubjects.push({ classId: newId, subjectId: subId, session });
      });
      newClass.subjectsCount = classData.subjectIds.length;
    }

    // Assign Initial Teachers if provided
    if (classData.teacherAssignments && Array.isArray(classData.teacherAssignments)) {
      classData.teacherAssignments.forEach(ta => {
        this.state.teacherAssignments.push({
          id: "ta_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
          teacherId: ta.teacherId,
          classId: newId,
          subjectId: ta.subjectId,
          session
        });
      });
      const uniqueTeachers = new Set(classData.teacherAssignments.map(ta => ta.teacherId));
      newClass.teachersCount = uniqueTeachers.size;
    }

    this.addAuditLog("Created Academic Class", `${newClass.name} (${newClass.session})`, `Section ${newClass.section}, Category: ${newClass.category}`);
    this.saveState();
    return newClass;
  }

  updateClass(classId, updateData) {
    const cls = this.getClassById(classId);
    if (!cls) return;
    Object.assign(cls, updateData);
    this.addAuditLog("Updated Class Details", `${cls.name} (${cls.session})`);
    this.saveState();
    return cls;
  }

  deactivateClass(classId) {
    const cls = this.getClassById(classId);
    if (!cls) return;
    cls.status = cls.status === "Active" ? "Inactive" : "Active";
    this.addAuditLog(`${cls.status === "Active" ? "Activated" : "Deactivated"} Class`, `${cls.name} (${cls.session})`);
    this.saveState();
    return cls;
  }

  // --------------------------------------------------------------------------
  // Subjects Management (Section 10)
  // --------------------------------------------------------------------------
  getSubjects() {
    return this.state.subjects;
  }

  getPredefinedSubjects() {
    return this.state.predefinedSubjects || [
      "Mathematics", "English Language", "Biology", "Chemistry", "Physics",
      "Economics", "Government", "Literature", "Geography", "Civic Education",
      "Computer Studies", "Agricultural Science", "Basic Science", "Basic Technology", "Social Studies"
    ];
  }

  getSubjectById(subjectId) {
    return this.state.subjects.find(s => s.id === subjectId);
  }

  getOrCreateSubjectByName(subjectName, category = "General") {
    const trimmed = subjectName.trim();
    let existing = this.state.subjects.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (!existing) {
      const code = trimmed.substring(0, 3).toUpperCase();
      const id = "sub_" + trimmed.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 10);
      existing = {
        id,
        code,
        name: trimmed,
        category,
        status: "Active"
      };
      this.state.subjects.push(existing);
      if (!this.state.predefinedSubjects) this.state.predefinedSubjects = [];
      if (!this.state.predefinedSubjects.includes(trimmed)) {
        this.state.predefinedSubjects.push(trimmed);
      }
      this.addAuditLog("Added New Subject", `${trimmed} (${code})`);
      this.saveState();
    }
    return existing;
  }

  addCustomSubject(subjectName, category = "Custom / Vocational") {
    return this.getOrCreateSubjectByName(subjectName, category);
  }

  getClassSubjects(classId) {
    const links = this.state.classSubjects.filter(cs => cs.classId === classId);
    return links.map(l => this.getSubjectById(l.subjectId)).filter(Boolean);
  }

  addClassSubject(classId, subjectIdOrName, isCustom = false) {
    let subject;
    if (isCustom) {
      subject = this.getOrCreateSubjectByName(subjectIdOrName, "Custom / Vocational");
    } else {
      subject = this.getSubjectById(subjectIdOrName) || this.getOrCreateSubjectByName(subjectIdOrName);
    }

    if (!subject) return;

    const cls = this.getClassById(classId);
    const session = cls ? cls.session : this.getCurrentSession();

    const exists = this.state.classSubjects.some(cs => cs.classId === classId && cs.subjectId === subject.id);
    if (!exists) {
      this.state.classSubjects.push({ classId, subjectId: subject.id, session });
      if (cls) cls.subjectsCount = this.getClassSubjects(classId).length;
      this.addAuditLog("Added Subject to Class", `${subject.name} -> ${cls?.name} (${session})`);
      this.saveState();
    }
    return subject;
  }

  removeClassSubject(classId, subjectId) {
    const sub = this.getSubjectById(subjectId);
    const cls = this.getClassById(classId);
    this.state.classSubjects = this.state.classSubjects.filter(cs => !(cs.classId === classId && cs.subjectId === subjectId));
    // Also remove teacher assignments for that subject in this class
    this.state.teacherAssignments = this.state.teacherAssignments.filter(ta => !(ta.classId === classId && ta.subjectId === subjectId));
    if (cls) {
      cls.subjectsCount = this.getClassSubjects(classId).length;
      cls.teachersCount = this.getClassTeachers(classId).length;
    }
    this.addAuditLog("Removed Subject from Class", `${sub?.name} from ${cls?.name} (${cls?.session})`);
    this.saveState();
  }

  // --------------------------------------------------------------------------
  // Teachers Management & Assignments (Section 11, 23, 24, 25)
  // --------------------------------------------------------------------------
  getTeachers() {
    return this.state.teachers;
  }

  getTeacherById(teacherId) {
    return this.state.teachers.find(t => t.id === teacherId);
  }

  createTeacher(teacherData) {
    const id = "tch_" + (teacherData.name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 10) || Date.now());
    const existingCount = this.state.teachers.length + 1;
    const teacherId = teacherData.teacherId || `T00${existingCount}`;

    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];
    const avatarBg = colors[existingCount % colors.length];

    const newTeacher = {
      id,
      teacherId,
      name: teacherData.name.trim(),
      gender: teacherData.gender || "Male",
      dob: teacherData.dob || "1988-01-01",
      phone: teacherData.phone || "+234 800 000 0000",
      email: teacherData.email || `${teacherData.name.toLowerCase().replace(/\s+/g, ".")}@crownhill.edu.ng`,
      address: teacherData.address || "Lagos, Nigeria",
      qualification: teacherData.qualification || "B.Sc., PGDE",
      specialization: teacherData.specialization || "General Education",
      employmentDate: teacherData.employmentDate || new Date().toISOString().split("T")[0],
      status: "Active",
      avatar: teacherData.avatar || `https://images.unsplash.com/photo-${1500000000000 + existingCount * 1234567}?auto=format&fit=crop&w=200&h=200&q=80`,
      avatarBg
    };

    this.state.teachers.push(newTeacher);
    this.addAuditLog("Created Teacher Record", `${newTeacher.name} (${teacherId})`, `Email: ${newTeacher.email}`);
    this.saveState();
    return newTeacher;
  }

  updateTeacher(teacherId, updateData) {
    const teacher = this.getTeacherById(teacherId);
    if (!teacher) return;
    Object.assign(teacher, updateData);
    this.addAuditLog("Updated Teacher Record", `${teacher.name} (${teacher.teacherId})`);
    this.saveState();
    return teacher;
  }

  toggleTeacherStatus(teacherId) {
    const teacher = this.getTeacherById(teacherId);
    if (!teacher) return;
    teacher.status = teacher.status === "Active" ? "Inactive" : "Active";
    this.addAuditLog(`${teacher.status === "Active" ? "Activated" : "Deactivated"} Teacher`, `${teacher.name}`);
    this.saveState();
    return teacher;
  }

  getTeacherAssignments(teacherId = null, session = null, classId = null) {
    return this.state.teacherAssignments.filter(ta => {
      if (teacherId && ta.teacherId !== teacherId) return false;
      if (session && session !== "all" && ta.session !== session) return false;
      if (classId && classId !== "all" && ta.classId !== classId) return false;
      return true;
    });
  }

  // Form Teacher (Class Master) Management (Audio Requirement)
  getClassFormTeacher(classId) {
    const cls = this.getClassById(classId);
    if (!cls || !cls.formTeacherId) return null;
    return this.getTeacherById(cls.formTeacherId);
  }

  setClassFormTeacher(classId, teacherId, session = null) {
    const cls = this.getClassById(classId);
    const teacher = this.getTeacherById(teacherId);
    if (!cls) return null;

    const oldTeacher = cls.formTeacherId ? this.getTeacherById(cls.formTeacherId) : null;
    cls.formTeacherId = teacherId || null;

    if (teacher) {
      this.addAuditLog(
        "Designated Form Teacher",
        `${teacher.name} appointed as Form Teacher for ${cls.name} (${cls.session})`,
        oldTeacher ? `Replaced ${oldTeacher.name}` : `Initial assignment`
      );
    } else {
      this.addAuditLog("Removed Form Teacher", `Form teacher removed from ${cls.name}`);
    }

    cls.teachersCount = this.getClassTeachers(classId).length;
    this.saveState();
    return teacher;
  }

  removeFormTeacher(classId) {
    return this.setClassFormTeacher(classId, null);
  }

  getTeacherFormClasses(teacherId, session = null) {
    const sess = session || this.getCurrentSession();
    return this.state.classes.filter(c => {
      if (c.formTeacherId !== teacherId) return false;
      if (sess && sess !== "all" && c.session !== sess) return false;
      return true;
    });
  }

  assignTeacherToClass(teacherId, classId, subjectId = null, session = null, isFormTeacher = false) {
    const teacher = this.getTeacherById(teacherId);
    const cls = this.getClassById(classId);
    const sess = session || (cls ? cls.session : this.getCurrentSession());

    if (!teacher || !cls) return;

    if (isFormTeacher) {
      this.setClassFormTeacher(classId, teacherId, sess);
    }

    if (subjectId) {
      const sub = this.getSubjectById(subjectId);
      if (sub) {
        // Check if assignment already exists for this exact session
        const exists = this.state.teacherAssignments.some(
          ta => ta.teacherId === teacherId && ta.classId === classId && ta.subjectId === subjectId && ta.session === sess
        );

        if (!exists) {
          // Ensure subject is added to class
          this.addClassSubject(classId, subjectId);

          this.state.teacherAssignments.push({
            id: "ta_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            teacherId,
            classId,
            subjectId,
            session: sess
          });

          this.addAuditLog("Assigned Subject Teacher", `${teacher.name} -> ${cls.name} (${sub.name}) [${sess}]`);
        }
      }
    }

    cls.teachersCount = this.getClassTeachers(classId).length;
    this.saveState();
  }

  removeTeacherAssignment(assignmentId) {
    const ta = this.state.teacherAssignments.find(t => t.id === assignmentId);
    if (ta) {
      const teacher = this.getTeacherById(ta.teacherId);
      const cls = this.getClassById(ta.classId);
      const sub = this.getSubjectById(ta.subjectId);
      this.state.teacherAssignments = this.state.teacherAssignments.filter(t => t.id !== assignmentId);
      if (cls) cls.teachersCount = this.getClassTeachers(cls.id).length;
      this.addAuditLog("Removed Teacher Assignment", `${teacher?.name} from ${cls?.name} (${sub?.name}) [${ta.session}]`);
      this.saveState();
    }
  }

  getClassTeachers(classId) {
    const cls = this.getClassById(classId);
    const tas = this.state.teacherAssignments.filter(ta => ta.classId === classId);
    const teacherIds = [...new Set(tas.map(t => t.teacherId))];
    
    // Also ensure the Form Teacher is in the list of teachers if assigned
    if (cls && cls.formTeacherId && !teacherIds.includes(cls.formTeacherId)) {
      teacherIds.unshift(cls.formTeacherId);
    }

    return teacherIds.map(id => {
      const teacher = this.getTeacherById(id);
      const subjectsForTeacherInClass = tas
        .filter(t => t.teacherId === id)
        .map(t => this.getSubjectById(t.subjectId))
        .filter(Boolean);
      const isForm = cls && cls.formTeacherId === id;
      return {
        ...teacher,
        isFormTeacher: isForm,
        assignedSubjects: subjectsForTeacherInClass
      };
    }).filter(t => Boolean(t.id));
  }

  getTeacherClasses(teacherId, session = null) {
    const sess = session || this.getCurrentSession();
    const tas = this.state.teacherAssignments.filter(ta => ta.teacherId === teacherId && (sess === "all" || ta.session === sess));
    const formClasses = this.state.classes.filter(c => c.formTeacherId === teacherId && (sess === "all" || c.session === sess));
    const classIds = [...new Set([...tas.map(t => t.classId), ...formClasses.map(c => c.id)])];

    return classIds.map(id => {
      const cls = this.getClassById(id);
      const subjects = tas.filter(t => t.classId === id).map(t => this.getSubjectById(t.subjectId)).filter(Boolean);
      const students = this.getClassStudents(id);
      const isForm = cls && cls.formTeacherId === teacherId;
      return {
        ...cls,
        isFormTeacher: isForm,
        assignedSubjects: subjects,
        studentCount: students.length
      };
    }).filter(c => Boolean(c.id));
  }

  // --------------------------------------------------------------------------
  // Students Management & Academic Placements (Section 16-22)
  // --------------------------------------------------------------------------
  getStudents(session = null, classId = null) {
    return this.state.students.filter(s => {
      if (session && session !== "all" && s.currentSession !== session) return false;
      if (classId && classId !== "all" && s.currentClassId !== classId) return false;
      return true;
    });
  }

  getStudentById(studentId) {
    return this.state.students.find(s => s.id === studentId || s.studentId === studentId);
  }

  getClassStudents(classId) {
    return this.state.students.filter(s => s.currentClassId === classId && s.status === "Active");
  }

  createStudent(studentData) {
    const count = this.state.students.length + 1;
    const studentId = studentData.studentId || `STU00${count}`;
    const admissionNo = studentData.admissionNo || `ADM${120 + count}`;
    const id = "stu_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);

    const cls = this.getClassById(studentData.currentClassId);
    const currentSession = studentData.currentSession || (cls ? cls.session : this.getCurrentSession());

    const newStudent = {
      id,
      studentId,
      admissionNo,
      name: studentData.name.trim(),
      gender: studentData.gender || "Male",
      dob: studentData.dob || "2010-01-01",
      phone: studentData.phone || "+234 800 000 0000",
      email: studentData.email || `${studentData.name.toLowerCase().replace(/\s+/g, ".")}@student.crownhill.edu.ng`,
      address: studentData.address || "Lagos, Nigeria",
      admissionDate: studentData.admissionDate || new Date().toISOString().split("T")[0],
      currentClassId: studentData.currentClassId,
      currentSession,
      status: "Active",
      avatar: studentData.avatar || `https://images.unsplash.com/photo-${1534528741775 + count}?auto=format&fit=crop&w=200&h=200&q=80`,
      academicPlacements: [
        {
          session: currentSession,
          classId: cls?.id || studentData.currentClassId,
          className: cls?.name || "JS1A",
          placementType: "New",
          startDate: studentData.admissionDate || new Date().toISOString().split("T")[0],
          status: "Current"
        }
      ],
      historicalResults: []
    };

    this.state.students.push(newStudent);
    if (cls) cls.studentCount = this.getClassStudents(cls.id).length;

    this.addAuditLog("Created Student Record", `${newStudent.name} (${studentId})`, `Assigned to ${cls?.name} for session ${currentSession}.`);
    this.saveState();
    return newStudent;
  }

  updateStudent(studentId, updateData) {
    const student = this.getStudentById(studentId);
    if (!student) return;
    Object.assign(student, updateData);
    this.addAuditLog("Updated Student Profile", `${student.name} (${student.studentId})`);
    this.saveState();
    return student;
  }

  // Student Class Transfer (Section 20): From JS2A to JS2B - Preserves history
  transferStudentClass(studentId, newClassId, session = null, adminName = null, reason = "Class Arm Rebalance") {
    const student = this.getStudentById(studentId);
    if (!student) throw new Error("Student not found.");

    const oldClass = this.getClassById(student.currentClassId);
    const newClass = this.getClassById(newClassId);
    if (!newClass) throw new Error("Target class not found.");

    const sess = session || newClass.session || this.getCurrentSession();
    const adm = adminName || this.state.school.principalName;
    const oldClassName = oldClass ? oldClass.name : "Previous";

    if (!student.academicPlacements) student.academicPlacements = [];

    // Mark current placement as Transferred
    student.academicPlacements.forEach(p => {
      if (p.status === "Current") {
        p.status = `Transferred to ${newClass.name}`;
        p.endDate = new Date().toISOString().split("T")[0];
      }
    });

    // Create new transfer placement
    student.academicPlacements.push({
      session: sess,
      classId: newClass.id,
      className: newClass.name,
      placementType: "Transfer",
      startDate: new Date().toISOString().split("T")[0],
      status: "Current",
      transferredBy: adm,
      previousClass: oldClassName,
      reason
    });

    student.currentClassId = newClass.id;
    student.currentSession = sess;

    if (oldClass) oldClass.studentCount = this.getClassStudents(oldClass.id).length;
    newClass.studentCount = this.getClassStudents(newClass.id).length;

    this.addAuditLog(
      "Transferred Student",
      `${student.name} (${student.studentId})`,
      `From ${oldClassName} to ${newClass.name} (${sess}). Transferred by: ${adm}. Reason: ${reason}`
    );
    this.saveState();
    return student;
  }

  // Student Promotion (Section 21): From 2025/2026 JS3 to 2026/2027 SS1 - Closes old placement, preserves all history
  promoteStudent(studentId, newClassId, newSession, adminName = null) {
    const student = this.getStudentById(studentId);
    if (!student) throw new Error("Student not found.");

    const oldClass = this.getClassById(student.currentClassId);
    const newClass = this.getClassById(newClassId);
    if (!newClass) throw new Error("Target class not found.");

    const adm = adminName || this.state.school.principalName;
    const oldClassName = oldClass ? oldClass.name : "Previous";
    const oldSession = student.currentSession;

    if (!student.academicPlacements) student.academicPlacements = [];

    // Close all current placements
    student.academicPlacements.forEach(p => {
      if (p.status === "Current") {
        p.status = "Completed";
        p.endDate = new Date().toISOString().split("T")[0];
      }
    });

    // Add new placement
    student.academicPlacements.push({
      session: newSession,
      classId: newClass.id,
      className: newClass.name,
      placementType: "Promotion",
      startDate: new Date().toISOString().split("T")[0],
      status: "Current",
      promotedBy: adm,
      previousClass: `${oldClassName} (${oldSession})`
    });

    student.currentClassId = newClass.id;
    student.currentSession = newSession;

    if (oldClass) oldClass.studentCount = this.getClassStudents(oldClass.id).length;
    newClass.studentCount = this.getClassStudents(newClass.id).length;

    this.addAuditLog(
      "Promoted Student",
      `${student.name} (${student.studentId})`,
      `Promoted from ${oldClassName} (${oldSession}) to ${newClass.name} (${newSession}). Promoted by: ${adm}.`
    );
    this.saveState();
    return student;
  }

  // Batch Promotion & Class Transfer: Promotes multiple qualified students to next session & class
  promoteBatchStudents(studentIds, targetClassId, targetSession, adminName = null) {
    const promoted = [];
    const targetClass = this.getClassById(targetClassId);
    if (!targetClass) throw new Error("Target class for promotion not found.");

    studentIds.forEach(id => {
      try {
        const student = this.promoteStudent(id, targetClassId, targetSession, adminName);
        if (student) promoted.push(student);
      } catch (e) {
        console.warn(`Error promoting student ${id}:`, e);
      }
    });

    this.addAuditLog(
      "Batch Student Promotion",
      `${promoted.length} Students Promoted`,
      `Promoted to ${targetClass.name} (${targetSession}). Transferred by: ${adminName || this.state.school.principalName}`
    );
    this.saveState();
    return promoted;
  }

  // --------------------------------------------------------------------------
  // Results & 3-Component Score Entries (Section 31-36, 44-55)
  // --------------------------------------------------------------------------
  getResults(filters = {}) {
    return this.state.results.filter(r => {
      if (filters.studentId && r.studentId !== filters.studentId) return false;
      if (filters.classId && filters.classId !== "all" && r.classId !== filters.classId) return false;
      if (filters.subjectId && filters.subjectId !== "all" && r.subjectId !== filters.subjectId) return false;
      if (filters.teacherId && filters.teacherId !== "all" && r.teacherId !== filters.teacherId) return false;
      if (filters.session && filters.session !== "all" && r.session !== filters.session) return false;
      if (filters.term && filters.term !== "all" && r.term !== filters.term) return false;
      if (filters.status && filters.status !== "all" && r.status !== filters.status) return false;
      return true;
    });
  }

  getStudentResult(studentId, subjectId, classId = null, session = null, term = null) {
    const ses = session || this.getCurrentSession();
    const trm = term || this.state.school.currentTerm;
    return this.state.results.find(r => 
      r.studentId === studentId && 
      r.subjectId === subjectId && 
      (!classId || r.classId === classId) &&
      r.session === ses && 
      r.term === trm
    );
  }

  recordStudentScore(studentId, classId, subjectId, teacherId, scoreType, scoreValue, session = null, term = null) {
    const student = this.getStudentById(studentId);
    const cls = this.getClassById(classId);
    const sub = this.getSubjectById(subjectId);
    const teacher = this.getTeacherById(teacherId) || this.getCurrentTeacher();
    const sess = session || (cls ? cls.session : this.getCurrentSession());
    const trm = term || this.state.school.currentTerm;

    if (!student || !cls || !sub) throw new Error("Invalid student, class, or subject context.");

    let result = this.getStudentResult(studentId, subjectId, classId, sess, trm);
    const val = (scoreValue !== "" && scoreValue !== null && scoreValue !== undefined) ? Number(scoreValue) : null;

    if (!result) {
      result = {
        id: "res_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        studentId: student.id,
        studentNumber: student.studentId,
        studentName: student.name,
        classId,
        className: cls.name,
        subjectId,
        subjectName: sub.name,
        teacherId: teacher?.id || "tch_john",
        teacherName: teacher?.name || "Teacher",
        session: sess,
        term: trm,
        project: scoreType === "project" ? val : null,
        assessment: scoreType === "assessment" ? val : null,
        exam: scoreType === "exam" ? val : null,
        total: 0,
        grade: "",
        remark: "",
        status: "Draft",
        updatedAt: new Date().toISOString()
      };
      this.state.results.push(result);
    } else {
      if (scoreType === "project") result.project = val;
      if (scoreType === "assessment") result.assessment = val;
      if (scoreType === "exam") result.exam = val;
      result.updatedAt = new Date().toISOString();
    }

    const calc = this.calculateGrade(result.project, result.assessment, result.exam);
    result.total = calc.total;
    result.grade = calc.grade;
    result.remark = calc.remark;

    this.addAuditLog(
      `Recorded ${scoreType.toUpperCase()} Score`,
      `${student.name} - ${sub.name} (${cls.name})`,
      `Score: ${scoreValue}. Total: ${result.total || 0} (${result.grade}) [${sess}]`
    );

    this.saveState();
    return result;
  }

  saveClassResultsDraft(classId, subjectId, teacherId, scoreEntries, session = null, term = null) {
    const cls = this.getClassById(classId);
    const sub = this.getSubjectById(subjectId);
    const teacher = this.getTeacherById(teacherId);
    const sess = session || (cls ? cls.session : this.getCurrentSession());
    const trm = term || this.state.school.currentTerm;

    scoreEntries.forEach(entry => {
      const student = this.getStudentById(entry.studentId);
      if (!student) return;

      const calc = this.calculateGrade(entry.project, entry.assessment, entry.exam);
      const existingIndex = this.state.results.findIndex(
        r => r.studentId === entry.studentId && r.classId === classId && r.subjectId === subjectId && r.session === sess && r.term === trm
      );

      const resultObj = {
        id: existingIndex >= 0 ? this.state.results[existingIndex].id : "res_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        studentId: entry.studentId,
        studentNumber: student.studentId,
        studentName: student.name,
        classId,
        className: cls?.name,
        subjectId,
        subjectName: sub?.name,
        teacherId: teacher?.id || "tch_john",
        teacherName: teacher?.name || "Teacher",
        session: sess,
        term: trm,
        project: (entry.project !== "" && entry.project !== null && entry.project !== undefined) ? Number(entry.project) : null,
        assessment: (entry.assessment !== "" && entry.assessment !== null && entry.assessment !== undefined) ? Number(entry.assessment) : null,
        exam: (entry.exam !== "" && entry.exam !== null && entry.exam !== undefined) ? Number(entry.exam) : null,
        total: (entry.project !== null || entry.assessment !== null || entry.exam !== null) ? calc.total : null,
        grade: (entry.project !== null || entry.assessment !== null || entry.exam !== null) ? calc.grade : "",
        remark: (entry.project !== null || entry.assessment !== null || entry.exam !== null) ? calc.remark : "",
        status: entry.status || "Draft",
        updatedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        this.state.results[existingIndex] = resultObj;
      } else {
        this.state.results.push(resultObj);
      }
    });

    this.saveState();
  }

  submitClassResults(classId, subjectId, teacherId, scoreEntries, session = null, term = null) {
    this.saveClassResultsDraft(classId, subjectId, teacherId, scoreEntries.map(e => ({ ...e, status: "Submitted" })), session, term);
    const cls = this.getClassById(classId);
    const sub = this.getSubjectById(subjectId);
    const teacher = this.getTeacherById(teacherId);
    const sess = session || (cls ? cls.session : this.getCurrentSession());

    this.addAuditLog("Submitted Class Results", `${cls?.name} - ${sub?.name} (${scoreEntries.length} Students) [${sess}]`);
    this.addNotification("Admin", "New Result Submission", `${teacher?.name} submitted results for ${cls?.name} - ${sub?.name}.`, "result");
    this.saveState();
  }

  adminReviewResults(classId, subjectId, action, adminComment = "", session = null, term = null) {
    // action: 'Approved', 'Returned for Correction', 'Published'
    const sess = session || this.getCurrentSession();
    const trm = term || this.state.school.currentTerm;
    const cls = this.getClassById(classId);
    const sub = this.getSubjectById(subjectId);

    let teacherId = null;

    this.state.results.forEach(r => {
      if (r.classId === classId && r.subjectId === subjectId && r.session === sess && r.term === trm) {
        r.status = action;
        teacherId = r.teacherId;
      }
    });

    this.addAuditLog(`${action} Results`, `${cls?.name} - ${sub?.name} (${sess})`, adminComment);

    if (action === "Returned for Correction") {
      this.addNotification("Teacher", "Result Returned for Correction", `Admin returned results for ${cls?.name} - ${sub?.name}. Note: ${adminComment}`, "result", teacherId);
    } else if (action === "Published") {
      this.addNotification("Teacher", "Official Results Published", `Admin approved and published results for ${cls?.name} - ${sub?.name}.`, "result", teacherId);
    } else if (action === "Approved") {
      this.addNotification("Teacher", "Results Approved", `Admin approved results for ${cls?.name} - ${sub?.name}.`, "result", teacherId);
    }

    this.saveState();
  }

  adminApproveAllClassResults(classId, session = null, term = null) {
    const sess = session || this.getCurrentSession();
    const trm = term || this.state.school.currentTerm;
    const cls = this.getClassById(classId);

    let count = 0;
    this.state.results.forEach(r => {
      if (r.classId === classId && r.session === sess && r.term === trm) {
        r.status = "Approved";
        count++;
      }
    });

    this.addAuditLog("Approved All Class Results", `${cls?.name || classId} (${sess} - ${trm})`, `Approved all ${count} student subject score records.`);
    this.saveState();
    return count;
  }

  // Submission tracking matrix for Admin & Teacher (Section 48)
  getClassSubmissionOverview(classId, session = null, term = null) {
    const cls = this.getClassById(classId);
    if (!cls) return [];

    const sess = session || cls.session || this.getCurrentSession();
    const trm = term || this.state.school.currentTerm;
    const classSubjects = this.getClassSubjects(classId);
    const classStudents = this.getClassStudents(classId);
    const totalStudents = classStudents.length;

    return classSubjects.map(sub => {
      const assignment = this.state.teacherAssignments.find(ta => ta.classId === classId && ta.subjectId === sub.id && ta.session === sess);
      const teacher = assignment ? this.getTeacherById(assignment.teacherId) : null;

      const resultsForSub = this.state.results.filter(
        r => r.classId === classId && r.subjectId === sub.id && r.session === sess && r.term === trm
      );

      const enteredCount = resultsForSub.filter(r => r.total !== null && r.total !== undefined).length;
      const submittedCount = resultsForSub.filter(r => r.status === "Submitted" || r.status === "Approved" || r.status === "Published").length;

      // Identify exactly which students are missing results (Section 48)
      const missingStudents = classStudents.filter(stu => {
        const res = resultsForSub.find(r => r.studentId === stu.id);
        return !res || res.total === null || res.total === undefined;
      });

      let status = "Not Started";
      if (resultsForSub.some(r => r.status === "Published")) {
        status = "Published";
      } else if (resultsForSub.some(r => r.status === "Approved")) {
        status = "Approved";
      } else if (resultsForSub.some(r => r.status === "Submitted")) {
        status = "Submitted";
      } else if (resultsForSub.some(r => r.status === "Returned for Correction")) {
        status = "Returned";
      } else if (enteredCount > 0 && enteredCount < totalStudents) {
        status = "In Progress";
      } else if (enteredCount === totalStudents && totalStudents > 0) {
        status = "Ready to Submit";
      }

      return {
        classId,
        className: cls.name,
        subjectId: sub.id,
        subjectName: sub.name,
        teacherName: teacher ? teacher.name : "Unassigned",
        teacherId: teacher ? teacher.id : null,
        totalStudents,
        enteredCount,
        submittedCount,
        missingCount: totalStudents - enteredCount,
        missingStudents,
        status,
        results: resultsForSub
      };
    });
  }

  // Combined Class Results Matrix (Section 46)
  getCombinedClassResults(classId, session = null, term = null) {
    const cls = this.getClassById(classId);
    if (!cls) return { students: [], subjects: [], broadsheet: [] };

    const sess = session || cls.session || this.getCurrentSession();
    const trm = term || this.state.school.currentTerm;
    const students = this.getClassStudents(classId);
    const subjects = this.getClassSubjects(classId);

    const broadsheet = students.map(student => {
      const studentResults = {};
      let totalSum = 0;
      let subjectCount = 0;

      subjects.forEach(sub => {
        const res = this.getStudentResult(student.id, sub.id, classId, sess, trm);
        studentResults[sub.id] = res || null;
        if (res && res.total !== null && res.total !== undefined) {
          totalSum += Number(res.total);
          subjectCount++;
        }
      });

      const average = subjectCount > 0 ? Math.round((totalSum / subjectCount) * 10) / 10 : null;
      const overallGrade = average !== null ? this.calculateGrade(null, null, average).grade : "";

      return {
        student,
        subjectScores: studentResults,
        totalSum,
        subjectCount,
        average,
        overallGrade
      };
    });

    // Rank positions by average
    const sorted = [...broadsheet].filter(b => b.average !== null).sort((a, b) => b.average - a.average);
    broadsheet.forEach(item => {
      if (item.average !== null) {
        const rank = sorted.findIndex(s => s.student.id === item.student.id) + 1;
        item.position = rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : `${rank}th`;
      } else {
        item.position = "-";
      }
    });

    return {
      class: cls,
      session: sess,
      term: trm,
      students,
      subjects,
      broadsheet
    };
  }

  // --------------------------------------------------------------------------
  // Questions & AI Builder & Question Bank (Section 37-43)
  // --------------------------------------------------------------------------
  getQuestionSets(filters = {}) {
    return this.state.questionSets.filter(qs => {
      if (filters.teacherId && qs.teacherId !== filters.teacherId) return false;
      if (filters.classId && filters.classId !== "all" && qs.classId !== filters.classId) return false;
      if (filters.subjectId && filters.subjectId !== "all" && qs.subjectId !== filters.subjectId) return false;
      if (filters.status && filters.status !== "all" && qs.status !== filters.status) return false;
      if (filters.session && filters.session !== "all" && qs.session !== filters.session) return false;
      if (filters.term && filters.term !== "all" && qs.term !== filters.term) return false;
      return true;
    });
  }

  getQuestionSetById(setId) {
    return this.state.questionSets.find(qs => qs.id === setId);
  }

  createQuestionSet(setData) {
    const teacher = this.getTeacherById(setData.teacherId) || this.getCurrentTeacher();
    const cls = this.getClassById(setData.classId);
    const sub = this.getSubjectById(setData.subjectId);

    const questionsList = setData.questions || [];
    const objQuestions = setData.objectiveQuestions || questionsList.filter(q => q.type === "Objective");
    const theoryQuestions = setData.theoryQuestions || questionsList.filter(q => q.type === "Theory");

    const totalMarks = setData.totalMarks || questionsList.reduce((sum, q) => sum + (Number(q.marks) || 0), 0) || 40;
    const session = setData.session || (cls ? cls.session : this.getCurrentSession());

    const newSet = {
      id: "qs_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      title: setData.title || `${cls?.name} ${sub?.name} Question Set - ${setData.topic || "First Term"}`,
      teacherId: teacher?.id,
      teacherName: teacher?.name,
      classId: setData.classId,
      className: cls?.name,
      subjectId: setData.subjectId,
      subjectName: sub?.name,
      session,
      term: setData.term || this.state.school.currentTerm,
      topic: setData.topic || "General Curriculum",
      difficulty: setData.difficulty || "Medium",
      questionType: setData.questionType || "Mixed",
      duration: setData.duration || "2 Hours",
      instructions: setData.instructions || "Answer all questions in Section A (Objective) and Section B (Theory). Show all steps clearly.",
      totalMarks,
      status: setData.status || "Draft", // Draft, Submitted (Pending Admin Review), Approved, Rejected, Revision Requested
      submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      adminNotes: "",
      objectiveQuestions: objQuestions,
      theoryQuestions: theoryQuestions,
      questions: questionsList.length > 0 ? questionsList : [...objQuestions, ...theoryQuestions]
    };

    this.state.questionSets.unshift(newSet);
    this.addAuditLog("Created Question Set", `${newSet.title} (${session})`, `Included ${newSet.questions.length} questions.`);

    if (newSet.status === "Submitted") {
      this.addNotification(
        "Admin",
        "New Question Submission",
        `${teacher?.name} submitted '${newSet.title}' for ${cls?.name} (${session}).`,
        "question"
      );
    }

    this.saveState();
    return newSet;
  }

  updateQuestionSet(setId, updateData) {
    const set = this.getQuestionSetById(setId);
    if (!set) return;

    Object.assign(set, updateData);
    if (updateData.objectiveQuestions || updateData.theoryQuestions) {
      set.questions = [...(set.objectiveQuestions || []), ...(set.theoryQuestions || [])];
      set.totalMarks = set.questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
    }

    this.addAuditLog("Updated Question Set", `${set.title}`);
    this.saveState();
    return set;
  }

  submitQuestionSet(setId) {
    const set = this.getQuestionSetById(setId);
    if (set) {
      set.status = "Submitted";
      set.submittedDate = new Date().toISOString().replace("T", " ").substring(0, 16);
      this.addAuditLog("Submitted Question Set", `${set.title}`, "Sent to Admin for approval.");
      this.addNotification(
        "Admin",
        "New Question Submission",
        `${set.teacherName} submitted question set '${set.title}' for ${set.className} ${set.subjectName}.`,
        "question"
      );
      this.saveState();
    }
  }

  adminReviewQuestionSet(setId, status, adminNotes = "") {
    const set = this.getQuestionSetById(setId);
    if (set) {
      set.status = status; // Approved, Rejected, Revision Requested
      set.adminNotes = adminNotes;

      this.addAuditLog(`${status} Question Set`, `${set.title}`, adminNotes);

      // Notify the teacher
      this.addNotification(
        "Teacher",
        `Question Set ${status}`,
        `Your question set '${set.title}' was marked as ${status} by Admin. ${adminNotes ? 'Note: ' + adminNotes : ''}`,
        "question",
        set.teacherId
      );

      // If approved, push questions into the official Question Bank (Section 43)
      if (status === "Approved") {
        set.questions.forEach(q => {
          const bankItem = {
            id: "qb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            subjectId: set.subjectId,
            subjectName: set.subjectName,
            classId: set.classId,
            className: set.className,
            topic: set.topic,
            session: set.session,
            term: set.term,
            type: q.type,
            subType: q.subType,
            prompt: q.prompt,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            marks: q.marks,
            difficulty: q.difficulty || set.difficulty,
            teacherName: set.teacherName
          };
          this.state.questionBank.push(bankItem);
        });
      }

      this.saveState();
    }
  }

  getQuestionBank(filters = {}) {
    return this.state.questionBank.filter(q => {
      if (filters.subjectId && filters.subjectId !== "all" && q.subjectId !== filters.subjectId) return false;
      if (filters.classId && filters.classId !== "all" && q.classId !== filters.classId) return false;
      if (filters.type && filters.type !== "all" && q.type !== filters.type) return false;
      if (filters.difficulty && filters.difficulty !== "all" && q.difficulty !== filters.difficulty) return false;
      if (filters.session && filters.session !== "all" && q.session !== filters.session) return false;
      if (filters.search && !q.prompt.toLowerCase().includes(filters.search.toLowerCase()) && !q.topic.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }

  // --------------------------------------------------------------------------
  // Examination Papers (Section 43)
  // --------------------------------------------------------------------------
  getExaminationPapers(filters = {}) {
    return this.state.examinationPapers.filter(p => {
      if (filters.classId && filters.classId !== "all" && p.classId !== filters.classId) return false;
      if (filters.subjectId && filters.subjectId !== "all" && p.subjectId !== filters.subjectId) return false;
      if (filters.session && filters.session !== "all" && p.session !== filters.session) return false;
      if (filters.term && filters.term !== "all" && p.term !== filters.term) return false;
      return true;
    });
  }

  getExaminationPaperById(paperId) {
    return this.state.examinationPapers.find(p => p.id === paperId);
  }

  createExaminationPaper(paperData) {
    const cls = this.getClassById(paperData.classId);
    const sub = this.getSubjectById(paperData.subjectId);
    const questionsList = paperData.questions || [];
    const objQuestions = paperData.objectiveQuestions || questionsList.filter(q => q.type === "Objective");
    const theoryQuestions = paperData.theoryQuestions || questionsList.filter(q => q.type === "Theory");
    const session = paperData.session || (cls ? cls.session : this.getCurrentSession());

    const newPaper = {
      id: "ep_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      title: paperData.title || `${cls?.name} ${sub?.name} ${paperData.term || this.state.school.currentTerm} Examination Paper`,
      examName: paperData.examName || `${paperData.term || this.state.school.currentTerm} Examination`,
      session,
      term: paperData.term || this.state.school.currentTerm,
      classId: paperData.classId,
      className: cls?.name || "SS2A",
      subjectId: paperData.subjectId,
      subjectName: sub?.name || "Mathematics",
      duration: paperData.duration || "2 Hours 30 Minutes",
      totalMarks: Number(paperData.totalMarks) || 100,
      instructions: paperData.instructions || "Answer ALL questions in Section A (Objective) and any THREE questions in Section B (Theory). Show all steps clearly.",
      createdDate: new Date().toISOString().split("T")[0],
      status: "Ready for Print",
      objectiveQuestions: objQuestions,
      theoryQuestions: theoryQuestions,
      questions: questionsList.length > 0 ? questionsList : [...objQuestions, ...theoryQuestions]
    };
    this.state.examinationPapers.unshift(newPaper);
    this.addAuditLog("Generated Official Examination Paper", `${newPaper.title} (${session})`, `Composed of ${newPaper.questions.length} approved questions.`);
    this.saveState();
    return newPaper;
  }

  // --------------------------------------------------------------------------
  // Audit Logs & Notifications (Section 57)
  // --------------------------------------------------------------------------
  getAuditLogs() {
    return this.state.auditLogs || [];
  }

  addAuditLog(action, record, details = "") {
    const isTeacher = this.getCurrentRole() === "teacher";
    const teacher = this.getCurrentTeacher();
    const user = isTeacher ? teacher.name : `Admin (${this.state.school.principalName})`;
    const role = isTeacher ? "Teacher" : "Admin";

    const newLog = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      user,
      role,
      action,
      record,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details
    };
    if (!this.state.auditLogs) this.state.auditLogs = [];
    this.state.auditLogs.unshift(newLog);
    this.saveState();
  }

  getNotifications(recipientRole = null, teacherId = null) {
    return (this.state.notifications || []).filter(n => {
      if (recipientRole && n.recipientRole !== recipientRole) return false;
      if (teacherId && n.teacherId && n.teacherId !== teacherId) return false;
      return true;
    });
  }

  addNotification(recipientRole, title, message, type = "general", teacherId = null) {
    const newNotif = {
      id: "notif_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      recipientRole,
      teacherId,
      title,
      message,
      time: "Just now",
      read: false,
      type
    };
    if (!this.state.notifications) this.state.notifications = [];
    this.state.notifications.unshift(newNotif);
    this.saveState();
  }

  // --------------------------------------------------------------------------
  // Class Daily Attendance Register & Form Teacher History Engine
  // --------------------------------------------------------------------------
  getAttendanceList(filters = {}) {
    let list = this.state.attendance || (window.INITIAL_DATA && window.INITIAL_DATA.attendance) || [];
    return list.filter(att => {
      if (filters.classId && att.classId !== filters.classId) return false;
      if (filters.session && filters.session !== "all" && att.session !== filters.session) return false;
      if (filters.term && filters.term !== "all" && att.term !== filters.term) return false;
      if (filters.date && att.date !== filters.date) return false;
      if (filters.markedBy && att.markedBy !== filters.markedBy) return false;
      return true;
    });
  }

  getAttendanceRecord(classId, date, session = null) {
    const sess = session || this.getCurrentSession();
    if (!this.state.attendance) this.state.attendance = (window.INITIAL_DATA && window.INITIAL_DATA.attendance) ? JSON.parse(JSON.stringify(window.INITIAL_DATA.attendance)) : [];
    return this.state.attendance.find(a => a.classId === classId && a.date === date && (!sess || sess === "all" || a.session === sess));
  }

  saveAttendanceRecord(payload) {
    if (!this.state.attendance) this.state.attendance = [];
    const cls = this.getClassById(payload.classId);
    const sess = payload.session || (cls ? cls.session : this.getCurrentSession());
    const term = payload.term || this.state.school.currentTerm || "First Term";
    const date = payload.date; // "YYYY-MM-DD"
    const markedBy = payload.markedBy;
    const teacher = this.getTeacherById(markedBy);

    const existingIndex = this.state.attendance.findIndex(
      a => a.classId === payload.classId && a.date === date && a.session === sess
    );

    const recordObj = {
      id: existingIndex >= 0 ? this.state.attendance[existingIndex].id : "att_" + payload.classId + "_" + date + "_" + Date.now().toString(36),
      classId: payload.classId,
      session: sess,
      term: term,
      date: date,
      markedBy: markedBy,
      markedByName: teacher ? teacher.name : (payload.markedByName || "Form Teacher"),
      markedAt: new Date().toISOString(),
      notes: payload.notes || "",
      records: payload.records || [] // array of { studentId, status: 'present'|'absent'|'late'|'excused', remark }
    };

    if (existingIndex >= 0) {
      this.state.attendance[existingIndex] = recordObj;
    } else {
      this.state.attendance.unshift(recordObj);
    }

    const presentCount = recordObj.records.filter(r => r.status === "present" || r.status === "late").length;
    const totalCount = recordObj.records.length;
    const percent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    this.addAuditLog(
      "Marked Class Attendance",
      `${cls?.name || 'Class'} (${date}) • ${recordObj.markedByName}`,
      `${presentCount}/${totalCount} Students Present (${percent}%)`
    );

    this.saveState();
    return recordObj;
  }

  getAttendanceDatesForMonth(classId, year, month, session = null) {
    // year: number/string (e.g. 2026), month: 1-12
    const mStr = String(month).padStart(2, "0");
    const yStr = String(year);
    const prefix = `${yStr}-${mStr}`;

    const list = (this.state.attendance || []).filter(a => {
      if (a.classId !== classId) return false;
      if (session && session !== "all" && a.session !== session) return false;
      return a.date && a.date.startsWith(prefix);
    });

    const datesMap = {};
    list.forEach(a => {
      const records = a.records || [];
      const total = records.length;
      const present = records.filter(r => r.status === "present").length;
      const late = records.filter(r => r.status === "late").length;
      const absent = records.filter(r => r.status === "absent").length;
      const excused = records.filter(r => r.status === "excused").length;
      const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

      datesMap[a.date] = {
        date: a.date,
        marked: true,
        markedBy: a.markedByName || "Form Teacher",
        markedAt: a.markedAt,
        total,
        present,
        late,
        absent,
        excused,
        rate
      };
    });

    return datesMap;
  }

  getClassAttendanceStats(classId, date, session = null) {
    const students = this.getClassStudents(classId);
    const record = this.getAttendanceRecord(classId, date, session);

    if (!record || !record.records || record.records.length === 0) {
      return {
        isMarked: false,
        totalStudents: students.length,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
        attendanceRate: 0,
        markedByName: null,
        markedAt: null,
        notes: "",
        recordsMap: {}
      };
    }

    const recordsMap = {};
    record.records.forEach(r => {
      recordsMap[r.studentId] = r;
    });

    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    // Evaluate for every current student in class
    students.forEach(st => {
      const rec = recordsMap[st.id];
      if (rec) {
        if (rec.status === "present") present++;
        else if (rec.status === "absent") absent++;
        else if (rec.status === "late") late++;
        else if (rec.status === "excused") excused++;
      } else {
        absent++;
      }
    });

    const total = students.length;
    const effectivePresent = present + late;
    const rate = total > 0 ? Math.round((effectivePresent / total) * 100) : 0;

    return {
      isMarked: true,
      totalStudents: total,
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      excusedCount: excused,
      attendanceRate: rate,
      markedByName: record.markedByName,
      markedAt: record.markedAt,
      notes: record.notes || "",
      recordsMap
    };
  }

  getStudentAttendanceSummary(studentId, session = null, term = null) {
    const sess = session || this.getCurrentSession();
    const list = (this.state.attendance || []).filter(a => {
      if (sess && sess !== "all" && a.session !== sess) return false;
      if (term && term !== "all" && a.term !== term) return false;
      return (a.records || []).some(r => r.studentId === studentId);
    });

    let totalDays = list.length;
    let presentDays = 0;
    let absentDays = 0;
    let lateDays = 0;
    let excusedDays = 0;

    list.forEach(a => {
      const r = a.records.find(rec => rec.studentId === studentId);
      if (r) {
        if (r.status === "present") presentDays++;
        else if (r.status === "absent") absentDays++;
        else if (r.status === "late") lateDays++;
        else if (r.status === "excused") excusedDays++;
      }
    });

    const rate = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 100;

    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      excusedDays,
      rate
    };
  }
}

window.store = new Store();

