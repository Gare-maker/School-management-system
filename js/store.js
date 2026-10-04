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
      if (serialized) {
        const parsed = JSON.parse(serialized);
        if (parsed && parsed.school && parsed.classes && parsed.students) {
          if (!parsed.timetableSlots || !Array.isArray(parsed.timetableSlots)) {
            parsed.timetableSlots = JSON.parse(JSON.stringify((window.INITIAL_DATA && window.INITIAL_DATA.timetableSlots) || []));
          }
          if (!parsed.venues || !Array.isArray(parsed.venues)) {
            parsed.venues = JSON.parse(JSON.stringify((window.INITIAL_DATA && window.INITIAL_DATA.venues) || []));
          }
          return parsed;
        }
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

  assignTeacherToClass(teacherId, classId, subjectId, session = null) {
    const teacher = this.getTeacherById(teacherId);
    const cls = this.getClassById(classId);
    const sub = this.getSubjectById(subjectId);
    const sess = session || (cls ? cls.session : this.getCurrentSession());

    if (!teacher || !cls || !sub) return;

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

      cls.teachersCount = this.getClassTeachers(classId).length;
      this.addAuditLog("Assigned Teacher", `${teacher.name} -> ${cls.name} (${sub.name}) [${sess}]`);
      this.saveState();
    }
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
    const tas = this.state.teacherAssignments.filter(ta => ta.classId === classId);
    const teacherIds = [...new Set(tas.map(t => t.teacherId))];
    return teacherIds.map(id => {
      const teacher = this.getTeacherById(id);
      const subjectsForTeacherInClass = tas
        .filter(t => t.teacherId === id)
        .map(t => this.getSubjectById(t.subjectId))
        .filter(Boolean);
      return {
        ...teacher,
        assignedSubjects: subjectsForTeacherInClass
      };
    }).filter(t => Boolean(t.id));
  }

  getTeacherClasses(teacherId, session = null) {
    const sess = session || this.getCurrentSession();
    const tas = this.state.teacherAssignments.filter(ta => ta.teacherId === teacherId && (sess === "all" || ta.session === sess));
    const classIds = [...new Set(tas.map(t => t.classId))];
    return classIds.map(id => {
      const cls = this.getClassById(id);
      const subjects = tas.filter(t => t.classId === id).map(t => this.getSubjectById(t.subjectId)).filter(Boolean);
      const students = this.getClassStudents(id);
      return {
        ...cls,
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
  // Timetable & Schedule Management with Real-Time Conflict Detection
  // --------------------------------------------------------------------------
  getVenues() {
    return this.state.venues || (window.INITIAL_DATA && window.INITIAL_DATA.venues) || [];
  }

  getTimetablePeriods() {
    return this.state.timetablePeriods || (window.INITIAL_DATA && window.INITIAL_DATA.timetablePeriods) || [
      { id: 1, label: "Period 1", time: "08:00 - 08:45", isBreak: false },
      { id: 2, label: "Period 2", time: "08:45 - 09:30", isBreak: false },
      { id: "break_1", label: "Morning Break / Assembly", time: "09:30 - 09:50", isBreak: true },
      { id: 3, label: "Period 3", time: "09:50 - 10:35", isBreak: false },
      { id: 4, label: "Period 4", time: "10:35 - 11:20", isBreak: false },
      { id: "break_2", label: "Lunch & Recreation Break", time: "11:20 - 12:10", isBreak: true },
      { id: 5, label: "Period 5", time: "12:10 - 12:55", isBreak: false },
      { id: 6, label: "Period 6", time: "12:55 - 01:40", isBreak: false },
      { id: 7, label: "Period 7", time: "01:40 - 02:25", isBreak: false }
    ];
  }

  getTimetableDays() {
    return this.state.timetableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  }

  getTimetableSlots(filters = {}) {
    const slots = this.state.timetableSlots || [];
    return slots.filter(slot => {
      if (filters.classId && filters.classId !== "all" && slot.classId !== filters.classId) return false;
      if (filters.teacherId && filters.teacherId !== "all" && slot.teacherId !== filters.teacherId) return false;
      if (filters.subjectId && filters.subjectId !== "all" && slot.subjectId !== filters.subjectId) return false;
      if (filters.session && filters.session !== "all" && slot.session !== filters.session) return false;
      if (filters.term && filters.term !== "all" && slot.term !== filters.term) return false;
      if (filters.day && filters.day !== "all" && slot.day !== filters.day) return false;
      if (filters.periodNumber && filters.periodNumber !== "all" && String(slot.periodNumber) !== String(filters.periodNumber)) return false;
      if (filters.room && filters.room !== "all" && slot.room !== filters.room) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const sub = this.getSubjectById(slot.subjectId)?.name.toLowerCase() || "";
        const tch = this.getTeacherById(slot.teacherId)?.name.toLowerCase() || "";
        const cls = this.getClassById(slot.classId)?.name.toLowerCase() || "";
        const rm = (slot.room || "").toLowerCase();
        if (!sub.includes(q) && !tch.includes(q) && !cls.includes(q) && !rm.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }

  getTimetableSlotById(slotId) {
    return (this.state.timetableSlots || []).find(s => s.id === slotId);
  }

  /**
   * Conflict Detection Engine
   * Validates:
   * 1. Teacher double-booking across different classes on the same day & period
   * 2. Venue/Room double-booking by different classes on the same day & period
   * 3. Class period collision (duplicate slot for the same class)
   */
  detectTimetableConflicts(slotData, excludeSlotId = null) {
    const conflicts = [];
    if (!slotData.day || !slotData.periodNumber || !slotData.session) {
      return conflicts;
    }

    const allSlots = this.state.timetableSlots || [];
    const targetPeriod = Number(slotData.periodNumber);
    const targetDay = slotData.day;
    const targetSession = slotData.session;
    const targetTerm = slotData.term || this.getCurrentSession();
    const targetTeacherId = slotData.teacherId;
    const targetRoom = (slotData.room || "").trim();
    const targetClassId = slotData.classId;

    allSlots.forEach(other => {
      if (excludeSlotId && other.id === excludeSlotId) return;
      if (other.session !== targetSession) return;
      if (targetTerm && other.term && other.term !== targetTerm) return;
      if (other.day !== targetDay || Number(other.periodNumber) !== targetPeriod) return;

      const otherClass = this.getClassById(other.classId);
      const otherSubject = this.getSubjectById(other.subjectId);
      const otherTeacher = this.getTeacherById(other.teacherId);
      const className = otherClass ? otherClass.name : "Another Class";
      const subjectName = otherSubject ? otherSubject.name : "Subject";
      const teacherName = otherTeacher ? otherTeacher.name : "Teacher";

      // 1. Teacher Double-Booking Clash (Different Class)
      if (targetTeacherId && other.teacherId === targetTeacherId && other.classId !== targetClassId) {
        conflicts.push({
          type: "teacher",
          severity: "high",
          title: "Teacher Schedule Collision",
          message: `${teacherName} is already assigned to teach ${subjectName} in ${className} on ${targetDay} (Period ${targetPeriod}).`,
          conflictingSlot: other,
          teacherName,
          className,
          subjectName,
          day: targetDay,
          periodNumber: targetPeriod
        });
      }

      // 2. Room / Venue Double-Booking Clash (Different Class)
      if (targetRoom && other.room && other.room.trim().toLowerCase() === targetRoom.toLowerCase() && other.classId !== targetClassId) {
        conflicts.push({
          type: "room",
          severity: "high",
          title: "Venue / Room Collision",
          message: `Venue "${targetRoom}" is already booked by ${className} for ${subjectName} on ${targetDay} (Period ${targetPeriod}).`,
          conflictingSlot: other,
          room: targetRoom,
          className,
          subjectName,
          day: targetDay,
          periodNumber: targetPeriod
        });
      }

      // 3. Same Class Duplicate Period Clash
      if (other.classId === targetClassId) {
        conflicts.push({
          type: "class_duplicate",
          severity: "medium",
          title: "Class Period Overlap",
          message: `${className} already has ${subjectName} scheduled for Period ${targetPeriod} on ${targetDay}. Saving will overwrite this slot.`,
          conflictingSlot: other,
          className,
          subjectName,
          day: targetDay,
          periodNumber: targetPeriod
        });
      }
    });

    return conflicts;
  }

  /**
   * Scans all slots for the given session and term and aggregates all collisions
   */
  getAllTimetableConflicts(session = null, term = null) {
    const sess = session || this.getCurrentSession();
    const slots = this.getTimetableSlots({ session: sess, term });
    const conflictsList = [];
    const seenPairs = new Set();

    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const s1 = slots[i];
        const s2 = slots[j];

        if (s1.day === s2.day && Number(s1.periodNumber) === Number(s2.periodNumber)) {
          const pairKey = [s1.id, s2.id].sort().join("_");
          if (seenPairs.has(pairKey)) continue;

          const cls1 = this.getClassById(s1.classId);
          const cls2 = this.getClassById(s2.classId);
          const sub1 = this.getSubjectById(s1.subjectId);
          const sub2 = this.getSubjectById(s2.subjectId);
          const tch1 = this.getTeacherById(s1.teacherId);
          const tch2 = this.getTeacherById(s2.teacherId);

          // Teacher clash
          if (s1.teacherId && s1.teacherId === s2.teacherId && s1.classId !== s2.classId) {
            seenPairs.add(pairKey);
            conflictsList.push({
              id: "tc_" + pairKey,
              type: "teacher",
              severity: "critical",
              title: `Teacher Double-Booking: ${tch1?.name || 'Teacher'}`,
              description: `${tch1?.name || 'Teacher'} is scheduled simultaneously in ${cls1?.name || 'Class 1'} (${sub1?.name || 'Subject'}) and ${cls2?.name || 'Class 2'} (${sub2?.name || 'Subject'}) on ${s1.day}, Period ${s1.periodNumber}.`,
              slotA: s1,
              slotB: s2,
              day: s1.day,
              periodNumber: s1.periodNumber,
              teacher: tch1,
              classA: cls1,
              classB: cls2
            });
          }

          // Room clash
          if (s1.room && s2.room && s1.room.trim().toLowerCase() === s2.room.trim().toLowerCase() && s1.classId !== s2.classId) {
            seenPairs.add(pairKey);
            conflictsList.push({
              id: "rc_" + pairKey,
              type: "room",
              severity: "warning",
              title: `Venue Clash: ${s1.room}`,
              description: `Venue "${s1.room}" is booked at the same time by ${cls1?.name || 'Class 1'} (${sub1?.name || 'Subject'}) and ${cls2?.name || 'Class 2'} (${sub2?.name || 'Subject'}) on ${s1.day}, Period ${s1.periodNumber}.`,
              slotA: s1,
              slotB: s2,
              day: s1.day,
              periodNumber: s1.periodNumber,
              room: s1.room,
              classA: cls1,
              classB: cls2
            });
          }
        }
      }
    }

    return {
      session: sess,
      term: term || "All Terms",
      totalConflicts: conflictsList.length,
      conflicts: conflictsList,
      teacherConflicts: conflictsList.filter(c => c.type === "teacher"),
      roomConflicts: conflictsList.filter(c => c.type === "room")
    };
  }

  saveTimetableSlot(slotData) {
    if (!this.state.timetableSlots) this.state.timetableSlots = [];
    const cls = this.getClassById(slotData.classId);
    const sub = this.getSubjectById(slotData.subjectId);
    const tch = this.getTeacherById(slotData.teacherId);
    const session = slotData.session || cls?.session || this.getCurrentSession();
    const term = slotData.term || this.state.school.currentTerm || "First Term";

    let slotId = slotData.id;
    let isNew = false;

    if (!slotId) {
      isNew = true;
      slotId = "tt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    }

    const newSlot = {
      id: slotId,
      classId: slotData.classId,
      session,
      term,
      day: slotData.day,
      periodNumber: Number(slotData.periodNumber),
      subjectId: slotData.subjectId,
      teacherId: slotData.teacherId,
      room: slotData.room || (cls ? `Room ${cls.name}` : "Main Classroom"),
      type: slotData.type || "Lecture",
      notes: slotData.notes || ""
    };

    // Remove any exact duplicate slot for the same class, session, term, day, and period
    this.state.timetableSlots = this.state.timetableSlots.filter(s => {
      if (s.id === slotId) return false;
      if (s.classId === newSlot.classId && s.session === newSlot.session && s.term === newSlot.term && s.day === newSlot.day && Number(s.periodNumber) === Number(newSlot.periodNumber)) {
        return false;
      }
      return true;
    });

    this.state.timetableSlots.push(newSlot);

    this.addAuditLog(
      isNew ? "Added Timetable Period" : "Updated Timetable Period",
      `${cls?.name || 'Class'} - ${sub?.name || 'Subject'} (${newSlot.day} P${newSlot.periodNumber})`,
      `Teacher: ${tch?.name || 'Unassigned'}, Venue: ${newSlot.room}`
    );

    this.saveState();
    return newSlot;
  }

  deleteTimetableSlot(slotId) {
    const slot = this.getTimetableSlotById(slotId);
    if (!slot) return;
    const cls = this.getClassById(slot.classId);
    const sub = this.getSubjectById(slot.subjectId);

    this.state.timetableSlots = (this.state.timetableSlots || []).filter(s => s.id !== slotId);
    this.addAuditLog("Deleted Timetable Period", `${cls?.name || 'Class'} - ${sub?.name || 'Subject'} (${slot.day} P${slot.periodNumber})`);
    this.saveState();
  }

  clearClassTimetable(classId, session = null, term = null) {
    const sess = session || this.getCurrentSession();
    const cls = this.getClassById(classId);

    this.state.timetableSlots = (this.state.timetableSlots || []).filter(s => {
      if (s.classId !== classId) return true;
      if (sess && s.session !== sess) return true;
      if (term && term !== "all" && s.term !== term) return true;
      return false;
    });

    this.addAuditLog("Cleared Class Timetable", `${cls?.name || classId} (${sess} ${term || ''})`);
    this.saveState();
  }

  /**
   * Smart Timetable Generator
   * Auto-allocates periods across Monday - Friday (7 periods / day)
   * avoiding clashes with other classes and assigning appropriate venues.
   */
  autoGenerateClassTimetable(classId, session = null, term = null, overwrite = true) {
    const cls = this.getClassById(classId);
    if (!cls) throw new Error("Class not found");
    const sess = session || cls.session || this.getCurrentSession();
    const trm = term || this.state.school.currentTerm || "First Term";

    if (overwrite) {
      this.clearClassTimetable(classId, sess, trm);
    }

    const classSubjects = this.getClassSubjects(classId);
    if (classSubjects.length === 0) {
      throw new Error(`Class ${cls.name} has no subjects assigned yet. Please assign subjects first.`);
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const periods = [1, 2, 3, 4, 5, 6, 7];
    const defaultRoom = `Room ${cls.name}`;

    // Map subjects to preferred venues
    const getPreferredRoom = (sub) => {
      const code = (sub.code || "").toUpperCase();
      const name = sub.name.toLowerCase();
      if (name.includes("physics") || name.includes("chemistry") || code === "CHM" || code === "PHY") {
        return "Science Lab (Physics & Chemistry)";
      }
      if (name.includes("biology") || name.includes("agric") || code === "BIO" || code === "AGR") {
        return "Biology & Agricultural Lab";
      }
      if (name.includes("computer") || code === "CMP" || name.includes("ict")) {
        return "Computer Science & ICT Suite";
      }
      if (name.includes("art") || name.includes("design")) {
        return "Fine Arts & Design Studio";
      }
      if (name.includes("physical") || name.includes("sport")) {
        return "Sports Pavilion & Field";
      }
      return defaultRoom;
    };

    // Calculate period weight per subject (core subjects get 4-5 periods, others 2-3)
    const subjectQueue = [];
    classSubjects.forEach(sub => {
      const isCore = ["Mathematics", "English Language", "Biology", "Physics", "Chemistry"].includes(sub.name);
      const count = isCore ? 5 : 3;
      // Find teacher assigned for this subject in this class
      const teacher = this.getSubjectTeacherForClass(cls.id, sub.id);
      const teacherId = teacher ? teacher.id : (this.state.teachers[0]?.id || "tch_john");
      const room = getPreferredRoom(sub);

      for (let i = 0; i < count; i++) {
        subjectQueue.push({
          subjectId: sub.id,
          subjectName: sub.name,
          teacherId,
          room,
          type: (room.includes("Lab") || room.includes("Suite")) && i % 2 === 1 ? "Practical" : (i === count - 1 ? "Tutorial" : "Lecture")
        });
      }
    });

    // Fill the 35 weekly slots
    let queueIdx = 0;
    const generatedSlots = [];

    days.forEach(day => {
      periods.forEach(periodNum => {
        if (queueIdx >= subjectQueue.length) {
          queueIdx = 0; // Wrap around if needed
        }

        let chosen = null;
        let attempts = 0;

        // Try to find a subject that has no teacher clash for this day & period
        while (attempts < subjectQueue.length) {
          const candidate = subjectQueue[(queueIdx + attempts) % subjectQueue.length];
          const testSlot = {
            classId: cls.id,
            session: sess,
            term: trm,
            day,
            periodNumber: periodNum,
            teacherId: candidate.teacherId,
            room: candidate.room
          };
          const conflicts = this.detectTimetableConflicts(testSlot);
          const hasTeacherConflict = conflicts.some(c => c.type === "teacher");

          if (!hasTeacherConflict) {
            chosen = candidate;
            queueIdx = (queueIdx + attempts + 1) % subjectQueue.length;
            break;
          }
          attempts++;
        }

        if (!chosen) {
          chosen = subjectQueue[queueIdx % subjectQueue.length];
          queueIdx++;
        }

        const slot = this.saveTimetableSlot({
          classId: cls.id,
          session: sess,
          term: trm,
          day,
          periodNumber: periodNum,
          subjectId: chosen.subjectId,
          teacherId: chosen.teacherId,
          room: chosen.room,
          type: chosen.type,
          notes: `${cls.name} standard curriculum session`
        });

        generatedSlots.push(slot);
      });
    });

    this.addAuditLog("Auto-Generated Weekly Schedule", `${cls.name} (${sess} • ${trm})`, `Allocated ${generatedSlots.length} weekly periods.`);
    this.saveState();
    return generatedSlots;
  }

  copyClassTimetable(sourceClassId, targetClassId, session = null, term = null) {
    const srcClass = this.getClassById(sourceClassId);
    const tgtClass = this.getClassById(targetClassId);
    if (!srcClass || !tgtClass) throw new Error("Source or Target class not found.");

    const sess = session || tgtClass.session || this.getCurrentSession();
    const trm = term || this.state.school.currentTerm || "First Term";
    const srcSlots = this.getTimetableSlots({ classId: sourceClassId, session: sess, term: trm });

    if (srcSlots.length === 0) {
      throw new Error(`No timetable periods found in ${srcClass.name} to copy.`);
    }

    const copied = [];
    srcSlots.forEach(slot => {
      const newSlot = this.saveTimetableSlot({
        classId: targetClassId,
        session: sess,
        term: trm,
        day: slot.day,
        periodNumber: slot.periodNumber,
        subjectId: slot.subjectId,
        teacherId: slot.teacherId,
        room: slot.room.includes("Lab") || slot.room.includes("Suite") ? slot.room : `Room ${tgtClass.name}`,
        type: slot.type,
        notes: `Copied from ${srcClass.name}`
      });
      copied.push(newSlot);
    });

    this.addAuditLog("Copied Timetable Schedule", `From ${srcClass.name} to ${tgtClass.name} (${sess})`, `Transferred ${copied.length} periods.`);
    this.saveState();
    return copied;
  }
}

window.store = new Store();

