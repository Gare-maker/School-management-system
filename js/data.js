// Crown Hill Academy - Comprehensive Academic Seed Data
// Structure built strictly on Academic Year/Session + Class + Student architecture

window.INITIAL_DATA = {
  school: {
    id: "sch_01",
    name: "Crown Hill Academy",
    motto: "Excellence, Integrity and Innovation",
    address: "14 Victoria Island Boulevard, Lagos, Nigeria",
    phone: "+234 803 123 4567",
    email: "admin@crownhill.edu.ng",
    website: "www.crownhill.edu.ng",
    currentSession: "2026/2027",
    currentTerm: "First Term",
    availableSessions: ["2026/2027", "2025/2026", "2024/2025", "2023/2024", "2022/2023"],
    availableTerms: ["First Term", "Second Term", "Third Term"],
    // 3 Primary Score Components (Default PRD Weights: Projects 10%, Assessments 20%, Exam 70%)
    projectWeight: 10,
    assessmentWeight: 20,
    examWeight: 70,
    logoText: "CHA",
    principalName: "Dr. Mrs. A. O. Balogun",
    principalTitle: "Principal & Head of School",
    schoolStampText: "CROWN HILL ACADEMY • OFFICIAL SEAL • LAGOS",
    resultTemplateNote: "Continuous Assessment constitutes 30% (Projects 10% + Assessments 20%) and Terminal Examination constitutes 70%. Official transcripts are sealed by the Principal's Office.",
    gradingScale: [
      { grade: "A", minScore: 70, maxScore: 100, remark: "Excellent", gpa: 5.0 },
      { grade: "B", minScore: 60, maxScore: 69, remark: "Very Good", gpa: 4.0 },
      { grade: "C", minScore: 50, maxScore: 59, remark: "Good", gpa: 3.0 },
      { grade: "D", minScore: 45, maxScore: 49, remark: "Fair", gpa: 2.0 },
      { grade: "E", minScore: 40, maxScore: 44, remark: "Pass", gpa: 1.0 },
      { grade: "F", minScore: 0, maxScore: 39, remark: "Fail", gpa: 0.0 }
    ]
  },

  // Predefined Nigerian Standard Class Levels (Creche to SS3)
  predefinedClassLevels: [
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
  ],

  // Classes: Every class is strictly bound to an academic session
  classes: [
    // 2026/2027 Session Classes
    { id: "cls_2026_js1a", name: "JS1A", level: "JS1", section: "A", category: "Junior Secondary", session: "2026/2027", status: "Active", studentCount: 32, subjectsCount: 8, teachersCount: 3, formTeacherId: "tch_jane" },
    { id: "cls_2026_js1b", name: "JS1B", level: "JS1", section: "B", category: "Junior Secondary", session: "2026/2027", status: "Active", studentCount: 30, subjectsCount: 8, teachersCount: 3, formTeacherId: "tch_jane" },
    { id: "cls_2026_js2a", name: "JS2A", level: "JS2", section: "A", category: "Junior Secondary", session: "2026/2027", status: "Active", studentCount: 34, subjectsCount: 8, teachersCount: 3, formTeacherId: "tch_grace" },
    { id: "cls_2026_js2b", name: "JS2B", level: "JS2", section: "B", category: "Junior Secondary", session: "2026/2027", status: "Active", studentCount: 31, subjectsCount: 8, teachersCount: 3, formTeacherId: "tch_grace" },
    { id: "cls_2026_js3a", name: "JS3A", level: "JS3", section: "A", category: "Junior Secondary", session: "2026/2027", status: "Active", studentCount: 35, subjectsCount: 8, teachersCount: 3, formTeacherId: "tch_david" },
    { id: "cls_2026_ss1a", name: "SS1A", level: "SS1", section: "A", category: "Senior Secondary", session: "2026/2027", status: "Active", studentCount: 36, subjectsCount: 7, teachersCount: 4, formTeacherId: "tch_david" },
    { id: "cls_2026_ss2a", name: "SS2A", level: "SS2", section: "A", category: "Senior Secondary", session: "2026/2027", status: "Active", studentCount: 32, subjectsCount: 6, teachersCount: 4, formTeacherId: "tch_john" },
    { id: "cls_2026_ss2b", name: "SS2B", level: "SS2", section: "B", category: "Senior Secondary", session: "2026/2027", status: "Active", studentCount: 28, subjectsCount: 6, teachersCount: 4, formTeacherId: "tch_john" },
    { id: "cls_2026_ss3a", name: "SS3A", level: "SS3", section: "A", category: "Senior Secondary", session: "2026/2027", status: "Active", studentCount: 36, subjectsCount: 6, teachersCount: 4, formTeacherId: "tch_grace" },

    // Historical 2025/2026 Session Classes (Preserved for historical integrity)
    { id: "cls_2025_js1a", name: "JS1A", level: "JS1", section: "A", category: "Junior Secondary", session: "2025/2026", status: "Completed", studentCount: 30, subjectsCount: 8, teachersCount: 3 },
    { id: "cls_2025_js2a", name: "JS2A", level: "JS2", section: "A", category: "Junior Secondary", session: "2025/2026", status: "Completed", studentCount: 32, subjectsCount: 8, teachersCount: 3 },
    { id: "cls_2025_js3a", name: "JS3A", level: "JS3", section: "A", category: "Junior Secondary", session: "2025/2026", status: "Completed", studentCount: 34, subjectsCount: 8, teachersCount: 3 },
    { id: "cls_2025_ss1a", name: "SS1A", level: "SS1", section: "A", category: "Senior Secondary", session: "2025/2026", status: "Completed", studentCount: 35, subjectsCount: 6, teachersCount: 4 },
    { id: "cls_2025_ss2a", name: "SS2A", level: "SS2", section: "A", category: "Senior Secondary", session: "2025/2026", status: "Completed", studentCount: 33, subjectsCount: 6, teachersCount: 4 },

    // Historical 2024/2025 Session Classes
    { id: "cls_2024_js1a", name: "JS1A", level: "JS1", section: "A", category: "Junior Secondary", session: "2024/2025", status: "Completed", studentCount: 28, subjectsCount: 8, teachersCount: 3 },
    { id: "cls_2024_js2a", name: "JS2A", level: "JS2", section: "A", category: "Junior Secondary", session: "2024/2025", status: "Completed", studentCount: 30, subjectsCount: 8, teachersCount: 3 }
  ],

  // Predefined Standard Subjects (Section 10 of PRD) + support for custom "Others"
  predefinedSubjects: [
    "Mathematics",
    "English Language",
    "Biology",
    "Chemistry",
    "Physics",
    "Economics",
    "Government",
    "Literature",
    "Geography",
    "Civic Education",
    "Computer Studies",
    "Agricultural Science",
    "Basic Science",
    "Basic Technology",
    "Social Studies"
  ],

  subjects: [
    { id: "sub_math", code: "MTH", name: "Mathematics", category: "Core Science", status: "Active" },
    { id: "sub_eng", code: "ENG", name: "English Language", category: "Core Arts", status: "Active" },
    { id: "sub_phy", code: "PHY", name: "Physics", category: "Science", status: "Active" },
    { id: "sub_chem", code: "CHM", name: "Chemistry", category: "Science", status: "Active" },
    { id: "sub_bio", code: "BIO", name: "Biology", category: "Science", status: "Active" },
    { id: "sub_econ", code: "ECN", name: "Economics", category: "Social Science", status: "Active" },
    { id: "sub_gov", code: "GOV", name: "Government", category: "Social Science", status: "Active" },
    { id: "sub_lit", code: "LIT", name: "Literature in English", category: "Arts", status: "Active" },
    { id: "sub_civic", code: "CIV", name: "Civic Education", category: "General", status: "Active" },
    { id: "sub_bsci", code: "BSC", name: "Basic Science", category: "Junior Science", status: "Active" },
    { id: "sub_btech", code: "BST", name: "Basic Technology", category: "Junior Technical", status: "Active" },
    { id: "sub_soc", code: "SOS", name: "Social Studies", category: "Junior General", status: "Active" },
    { id: "sub_comp", code: "CMP", name: "Computer Studies", category: "ICT & Vocational", status: "Active" },
    { id: "sub_agric", code: "AGR", name: "Agricultural Science", category: "Vocational", status: "Active" }
  ],

  // Subjects assigned to specific classes
  classSubjects: [
    // SS2A 2026/2027
    { classId: "cls_2026_ss2a", subjectId: "sub_math", session: "2026/2027" },
    { classId: "cls_2026_ss2a", subjectId: "sub_eng", session: "2026/2027" },
    { classId: "cls_2026_ss2a", subjectId: "sub_phy", session: "2026/2027" },
    { classId: "cls_2026_ss2a", subjectId: "sub_chem", session: "2026/2027" },
    { classId: "cls_2026_ss2a", subjectId: "sub_bio", session: "2026/2027" },
    { classId: "cls_2026_ss2a", subjectId: "sub_econ", session: "2026/2027" },

    // SS2B 2026/2027
    { classId: "cls_2026_ss2b", subjectId: "sub_math", session: "2026/2027" },
    { classId: "cls_2026_ss2b", subjectId: "sub_eng", session: "2026/2027" },
    { classId: "cls_2026_ss2b", subjectId: "sub_phy", session: "2026/2027" },
    { classId: "cls_2026_ss2b", subjectId: "sub_chem", session: "2026/2027" },
    { classId: "cls_2026_ss2b", subjectId: "sub_bio", session: "2026/2027" },
    { classId: "cls_2026_ss2b", subjectId: "sub_econ", session: "2026/2027" },

    // SS3A 2026/2027
    { classId: "cls_2026_ss3a", subjectId: "sub_math", session: "2026/2027" },
    { classId: "cls_2026_ss3a", subjectId: "sub_eng", session: "2026/2027" },
    { classId: "cls_2026_ss3a", subjectId: "sub_bio", session: "2026/2027" },
    { classId: "cls_2026_ss3a", subjectId: "sub_chem", session: "2026/2027" },
    { classId: "cls_2026_ss3a", subjectId: "sub_phy", session: "2026/2027" },
    { classId: "cls_2026_ss3a", subjectId: "sub_econ", session: "2026/2027" },

    // SS1A 2026/2027
    { classId: "cls_2026_ss1a", subjectId: "sub_math", session: "2026/2027" },
    { classId: "cls_2026_ss1a", subjectId: "sub_eng", session: "2026/2027" },
    { classId: "cls_2026_ss1a", subjectId: "sub_phy", session: "2026/2027" },
    { classId: "cls_2026_ss1a", subjectId: "sub_chem", session: "2026/2027" },
    { classId: "cls_2026_ss1a", subjectId: "sub_bio", session: "2026/2027" },
    { classId: "cls_2026_ss1a", subjectId: "sub_civic", session: "2026/2027" },
    { classId: "cls_2026_ss1a", subjectId: "sub_econ", session: "2026/2027" },

    // JS1A 2026/2027
    { classId: "cls_2026_js1a", subjectId: "sub_math", session: "2026/2027" },
    { classId: "cls_2026_js1a", subjectId: "sub_eng", session: "2026/2027" },
    { classId: "cls_2026_js1a", subjectId: "sub_bsci", session: "2026/2027" },
    { classId: "cls_2026_js1a", subjectId: "sub_btech", session: "2026/2027" },
    { classId: "cls_2026_js1a", subjectId: "sub_soc", session: "2026/2027" },
    { classId: "cls_2026_js1a", subjectId: "sub_civic", session: "2026/2027" },
    { classId: "cls_2026_js1a", subjectId: "sub_comp", session: "2026/2027" },
    { classId: "cls_2026_js1a", subjectId: "sub_agric", session: "2026/2027" },

    // JS2A 2026/2027
    { classId: "cls_2026_js2a", subjectId: "sub_math", session: "2026/2027" },
    { classId: "cls_2026_js2a", subjectId: "sub_eng", session: "2026/2027" },
    { classId: "cls_2026_js2a", subjectId: "sub_bsci", session: "2026/2027" },
    { classId: "cls_2026_js2a", subjectId: "sub_btech", session: "2026/2027" },
    { classId: "cls_2026_js2a", subjectId: "sub_soc", session: "2026/2027" },
    { classId: "cls_2026_js2a", subjectId: "sub_civic", session: "2026/2027" },
    { classId: "cls_2026_js2a", subjectId: "sub_comp", session: "2026/2027" },
    { classId: "cls_2026_js2a", subjectId: "sub_agric", session: "2026/2027" }
  ],

  // Teachers
  teachers: [
    {
      id: "tch_john",
      teacherId: "T001",
      name: "Mr. John Okafor",
      gender: "Male",
      dob: "1985-04-12",
      phone: "+234 802 345 6789",
      email: "john.okafor@crownhill.edu.ng",
      address: "12 Admiralty Way, Lekki Phase 1, Lagos",
      qualification: "B.Sc. (Ed) Mathematics, M.Sc.",
      specialization: "Pure Mathematics & Further Mathematics",
      employmentDate: "2019-09-01",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      avatarBg: "#3b82f6"
    },
    {
      id: "tch_jane",
      teacherId: "T002",
      name: "Mrs. Jane Adebayo",
      gender: "Female",
      dob: "1988-08-23",
      phone: "+234 805 678 9012",
      email: "jane.adebayo@crownhill.edu.ng",
      address: "45 Bourdillon Road, Ikoyi, Lagos",
      qualification: "B.Sc. Biology, PGDE",
      specialization: "Genetics, Ecology & Basic Science",
      employmentDate: "2020-01-15",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
      avatarBg: "#10b981"
    },
    {
      id: "tch_david",
      teacherId: "T003",
      name: "Mr. David Adeleke",
      gender: "Male",
      dob: "1983-11-05",
      phone: "+234 807 890 1234",
      email: "david.adeleke@crownhill.edu.ng",
      address: "8 Ajose Adeogun, Victoria Island, Lagos",
      qualification: "B.Tech Physics, M.Ed.",
      specialization: "Mechanics, Electricity & Basic Technology",
      employmentDate: "2018-03-10",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
      avatarBg: "#8b5cf6"
    },
    {
      id: "tch_grace",
      teacherId: "T004",
      name: "Mrs. Grace Nwosu",
      gender: "Female",
      dob: "1990-02-17",
      phone: "+234 809 012 3456",
      email: "grace.nwosu@crownhill.edu.ng",
      address: "21 Glover Road, Ikoyi, Lagos",
      qualification: "B.Sc. Industrial Chemistry, PGDE",
      specialization: "Organic Chemistry & Environmental Studies",
      employmentDate: "2021-08-20",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
      avatarBg: "#f59e0b"
    }
  ],

  // Teacher Assignments (Section 11 & 25): Teacher -> Academic Year -> Class -> Subject
  teacherAssignments: [
    // 2026/2027 Assignments
    { id: "ta_01", teacherId: "tch_john", classId: "cls_2026_ss2a", subjectId: "sub_math", session: "2026/2027" },
    { id: "ta_02", teacherId: "tch_john", classId: "cls_2026_ss2b", subjectId: "sub_math", session: "2026/2027" },
    { id: "ta_03", teacherId: "tch_john", classId: "cls_2026_ss3a", subjectId: "sub_math", session: "2026/2027" },
    { id: "ta_04", teacherId: "tch_john", classId: "cls_2026_js1a", subjectId: "sub_math", session: "2026/2027" },

    { id: "ta_05", teacherId: "tch_jane", classId: "cls_2026_ss2a", subjectId: "sub_bio", session: "2026/2027" },
    { id: "ta_06", teacherId: "tch_jane", classId: "cls_2026_ss3a", subjectId: "sub_bio", session: "2026/2027" },
    { id: "ta_07", teacherId: "tch_jane", classId: "cls_2026_js1a", subjectId: "sub_bsci", session: "2026/2027" },

    { id: "ta_08", teacherId: "tch_david", classId: "cls_2026_ss2a", subjectId: "sub_phy", session: "2026/2027" },
    { id: "ta_09", teacherId: "tch_david", classId: "cls_2026_ss1a", subjectId: "sub_phy", session: "2026/2027" },
    { id: "ta_10", teacherId: "tch_david", classId: "cls_2026_js1a", subjectId: "sub_btech", session: "2026/2027" },

    { id: "ta_11", teacherId: "tch_grace", classId: "cls_2026_ss2a", subjectId: "sub_chem", session: "2026/2027" },
    { id: "ta_12", teacherId: "tch_grace", classId: "cls_2026_ss3a", subjectId: "sub_chem", session: "2026/2027" },
    { id: "ta_13", teacherId: "tch_grace", classId: "cls_2026_ss1a", subjectId: "sub_chem", session: "2026/2027" },

    // Historical 2025/2026 Assignments
    { id: "ta_h01", teacherId: "tch_john", classId: "cls_2025_js3a", subjectId: "sub_math", session: "2025/2026" },
    { id: "ta_h02", teacherId: "tch_jane", classId: "cls_2025_js3a", subjectId: "sub_bsci", session: "2025/2026" }
  ],

  // Students: Every student record holds personal information, current placement, and comprehensive historical records
  students: [
    {
      id: "stu_01",
      studentId: "STU001",
      admissionNo: "ADM124",
      name: "David Okafor",
      gender: "Male",
      dob: "2009-06-14",
      phone: "+234 802 111 2233",
      email: "david.okafor@student.crownhill.edu.ng",
      address: "18 Adeola Odeku, VI, Lagos",
      admissionDate: "2024-09-10",
      currentClassId: "cls_2026_ss2a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80",
      // Academic Placement History (Section 19, 21, 58)
      academicPlacements: [
        { session: "2024/2025", classId: "cls_2024_js2a", className: "JS2A", placementType: "New", startDate: "2024-09-10", status: "Completed" },
        { session: "2025/2026", classId: "cls_2025_js3a", className: "JS3A", placementType: "Promotion", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss2a", className: "SS2A", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      // Historical Result Summaries (Preserved across years)
      historicalResults: [
        {
          session: "2024/2025",
          term: "Third Term",
          className: "JS2A",
          average: 84.5,
          position: "2nd",
          grade: "A",
          remarks: "Outstanding academic performance. Promoted to JS3.",
          subjects: [
            { subject: "Mathematics", score: 88, grade: "A" },
            { subject: "English Language", score: 82, grade: "A" },
            { subject: "Basic Science", score: 85, grade: "A" }
          ]
        },
        {
          session: "2025/2026",
          term: "Third Term",
          className: "JS3A",
          average: 88.2,
          position: "1st",
          grade: "A",
          remarks: "Passed BECE with 8 Distinctions. Promoted to Senior Secondary.",
          subjects: [
            { subject: "Mathematics", score: 92, grade: "A" },
            { subject: "English Language", score: 86, grade: "A" },
            { subject: "Basic Science", score: 90, grade: "A" }
          ]
        }
      ]
    },
    {
      id: "stu_02",
      studentId: "STU002",
      admissionNo: "ADM125",
      name: "Grace Peter",
      gender: "Female",
      dob: "2010-01-11",
      phone: "+234 805 333 4455",
      email: "grace.peter@student.crownhill.edu.ng",
      address: "10 Lugard Avenue, Ikoyi, Lagos",
      admissionDate: "2024-09-10",
      currentClassId: "cls_2026_ss2a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2024/2025", classId: "cls_2024_js2a", className: "JS2A", placementType: "New", startDate: "2024-09-10", status: "Completed" },
        { session: "2025/2026", classId: "cls_2025_js3a", className: "JS3A", placementType: "Promotion", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss2a", className: "SS2A", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: [
        {
          session: "2025/2026",
          term: "Third Term",
          className: "JS3A",
          average: 86.4,
          position: "2nd",
          grade: "A",
          remarks: "Distinction in BECE. Promoted to SS2A.",
          subjects: [
            { subject: "Mathematics", score: 89, grade: "A" },
            { subject: "English Language", score: 91, grade: "A" }
          ]
        }
      ]
    },
    {
      id: "stu_03",
      studentId: "STU003",
      admissionNo: "ADM126",
      name: "John James",
      gender: "Male",
      dob: "2009-09-20",
      phone: "+234 803 222 3344",
      email: "john.james@student.crownhill.edu.ng",
      address: "5 Kofo Abayomi, VI, Lagos",
      admissionDate: "2024-09-10",
      currentClassId: "cls_2026_ss2a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2025/2026", classId: "cls_2025_js3a", className: "JS3A", placementType: "New", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss2a", className: "SS2A", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: []
    },
    {
      id: "stu_04",
      studentId: "STU004",
      admissionNo: "ADM127",
      name: "Emmanuel Chinedu",
      gender: "Male",
      dob: "2009-04-03",
      phone: "+234 809 444 5566",
      email: "emmanuel.c@student.crownhill.edu.ng",
      address: "24 Marina Street, Lagos Island",
      admissionDate: "2025-09-08",
      currentClassId: "cls_2026_ss2a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2025/2026", classId: "cls_2025_ss1a", className: "SS1A", placementType: "New", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss2a", className: "SS2A", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: []
    },
    {
      id: "stu_05",
      studentId: "STU005",
      admissionNo: "ADM128",
      name: "Fatima Bello",
      gender: "Female",
      dob: "2009-12-08",
      phone: "+234 808 555 6677",
      email: "fatima.bello@student.crownhill.edu.ng",
      address: "7 Queens Drive, Ikoyi, Lagos",
      admissionDate: "2025-09-08",
      currentClassId: "cls_2026_ss2a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2025/2026", classId: "cls_2025_ss1a", className: "SS1A", placementType: "New", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss2a", className: "SS2A", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: []
    },
    {
      id: "stu_06",
      studentId: "STU006",
      admissionNo: "ADM129",
      name: "Tunde Bakare",
      gender: "Male",
      dob: "2009-08-15",
      phone: "+234 802 666 7788",
      email: "tunde.b@student.crownhill.edu.ng",
      address: "15 Cameron Road, Ikoyi, Lagos",
      admissionDate: "2025-09-08",
      currentClassId: "cls_2026_ss2b",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2025/2026", classId: "cls_2025_ss1a", className: "SS1A", placementType: "New", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss2b", className: "SS2B", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: []
    },
    {
      id: "stu_07",
      studentId: "STU007",
      admissionNo: "ADM130",
      name: "Amina Yusuf",
      gender: "Female",
      dob: "2008-05-30",
      phone: "+234 803 777 8899",
      email: "amina.y@student.crownhill.edu.ng",
      address: "3 Parkview Estate, Ikoyi",
      admissionDate: "2024-09-10",
      currentClassId: "cls_2026_ss3a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2024/2025", classId: "cls_2024_js3a", className: "JS3A", placementType: "New", startDate: "2024-09-10", status: "Completed" },
        { session: "2025/2026", classId: "cls_2025_ss2a", className: "SS2A", placementType: "Promotion", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss3a", className: "SS3A", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: []
    },
    {
      id: "stu_08",
      studentId: "STU008",
      admissionNo: "ADM131",
      name: "Chukwudi Obi",
      gender: "Male",
      dob: "2013-03-22",
      phone: "+234 801 234 5678",
      email: "chukwudi.obi@student.crownhill.edu.ng",
      address: "9 Awolowo Road, Ikoyi, Lagos",
      admissionDate: "2026-09-05",
      currentClassId: "cls_2026_js1a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2026/2027", classId: "cls_2026_js1a", className: "JS1A", placementType: "New", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: []
    },
    {
      id: "stu_09",
      studentId: "STU009",
      admissionNo: "ADM132",
      name: "Blessing Akpan",
      gender: "Female",
      dob: "2013-07-19",
      phone: "+234 803 456 7890",
      email: "blessing.akpan@student.crownhill.edu.ng",
      address: "14 Oniru Estate, Victoria Island, Lagos",
      admissionDate: "2026-09-05",
      currentClassId: "cls_2026_js1a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2026/2027", classId: "cls_2026_js1a", className: "JS1A", placementType: "New", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: []
    },
    {
      id: "stu_10",
      studentId: "STU010",
      admissionNo: "ADM133",
      name: "Kehinde Adeleke",
      gender: "Male",
      dob: "2009-11-04",
      phone: "+234 802 888 9900",
      email: "kehinde.a@student.crownhill.edu.ng",
      address: "22 Admiralty Way, Lekki Phase 1, Lagos",
      admissionDate: "2025-09-08",
      currentClassId: "cls_2026_ss2b",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2025/2026", classId: "cls_2025_ss1a", className: "SS1A", placementType: "New", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss2b", className: "SS2B", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: [
        {
          session: "2025/2026",
          term: "Third Term",
          className: "SS1A",
          average: 79.5,
          position: "4th",
          grade: "B",
          remarks: "Solid performance in Sciences. Promoted to SS2.",
          subjects: [
            { subject: "Mathematics", score: 81, grade: "A" },
            { subject: "English Language", score: 76, grade: "B" },
            { subject: "Physics", score: 82, grade: "A" }
          ]
        }
      ]
    },
    {
      id: "stu_11",
      studentId: "STU011",
      admissionNo: "ADM134",
      name: "Ngozi Nwosu",
      gender: "Female",
      dob: "2010-04-18",
      phone: "+234 809 111 4455",
      email: "ngozi.n@student.crownhill.edu.ng",
      address: "8 Glover Road, Ikoyi, Lagos",
      admissionDate: "2025-09-08",
      currentClassId: "cls_2026_ss1a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2025/2026", classId: "cls_2025_js3a", className: "JS3A", placementType: "New", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_ss1a", className: "SS1A", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: [
        {
          session: "2025/2026",
          term: "Third Term",
          className: "JS3A",
          average: 83.0,
          position: "3rd",
          grade: "A",
          remarks: "Passed BECE with flying colours. Promoted to Senior Secondary.",
          subjects: [
            { subject: "Mathematics", score: 84, grade: "A" },
            { subject: "English Language", score: 88, grade: "A" },
            { subject: "Basic Science", score: 77, grade: "B" }
          ]
        }
      ]
    },
    {
      id: "stu_12",
      studentId: "STU012",
      admissionNo: "ADM135",
      name: "Ibrahim Danjuma",
      gender: "Male",
      dob: "2012-09-12",
      phone: "+234 807 333 9922",
      email: "ibrahim.d@student.crownhill.edu.ng",
      address: "12 Bourdillon Road, Ikoyi, Lagos",
      admissionDate: "2025-09-08",
      currentClassId: "cls_2026_js2a",
      currentSession: "2026/2027",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80",
      academicPlacements: [
        { session: "2025/2026", classId: "cls_2025_js1a", className: "JS1A", placementType: "New", startDate: "2025-09-08", status: "Completed" },
        { session: "2026/2027", classId: "cls_2026_js2a", className: "JS2A", placementType: "Promotion", startDate: "2026-09-05", status: "Current" }
      ],
      historicalResults: [
        {
          session: "2025/2026",
          term: "Third Term",
          className: "JS1A",
          average: 81.2,
          position: "5th",
          grade: "A",
          remarks: "Very disciplined student. Promoted to JS2A.",
          subjects: [
            { subject: "Mathematics", score: 82, grade: "A" },
            { subject: "English Language", score: 79, grade: "B" },
            { subject: "Basic Science", score: 83, grade: "A" }
          ]
        }
      ]
    }
  ],

  // Question Sets (Submitted by Teachers for Admin Review - Section 37-41)
  questionSets: [
    {
      id: "qs_01",
      title: "First Term Mathematics Questions - Quadratic Equations",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      session: "2026/2027",
      term: "First Term",
      topic: "Quadratic Equations & Roots",
      difficulty: "Medium",
      questionType: "Mixed",
      totalMarks: 40,
      duration: "2 Hours",
      instructions: "Answer all questions in Section A (Objective) and any three in Section B (Theory). Show all working clearly.",
      status: "Submitted", // Draft, Submitted, Approved, Rejected, Revision Requested
      submittedDate: "2026-09-14 10:30",
      adminNotes: "",
      objectiveQuestions: [
        {
          id: "q_01",
          type: "Objective",
          subType: "Multiple Choice",
          prompt: "Solve the quadratic equation x² - 5x + 6 = 0 for x.",
          options: ["x = 2 or x = 3", "x = -2 or x = -3", "x = 1 or x = 6", "x = -1 or x = -6"],
          correctAnswer: "x = 2 or x = 3",
          marks: 2,
          difficulty: "Easy"
        },
        {
          id: "q_02",
          type: "Objective",
          subType: "Multiple Choice",
          prompt: "What is the discriminant of the quadratic equation 2x² + 4x + 2 = 0?",
          options: ["0", "16", "-16", "8"],
          correctAnswer: "0",
          marks: 2,
          difficulty: "Medium"
        },
        {
          id: "q_03",
          type: "Objective",
          subType: "True/False",
          prompt: "If the discriminant Δ > 0, the quadratic equation has two distinct real roots.",
          options: ["True", "False"],
          correctAnswer: "True",
          marks: 1,
          difficulty: "Easy"
        }
      ],
      theoryQuestions: [
        {
          id: "q_04",
          type: "Theory",
          subType: "Calculation",
          prompt: "Using the quadratic formula, find the exact roots of 3x² - 7x + 2 = 0. Show all working clearly.",
          correctAnswer: "x = (7 ± √(49 - 24))/6 = (7 ± 5)/6 => x = 2 or x = 1/3",
          marks: 5,
          difficulty: "Medium"
        },
        {
          id: "q_05",
          type: "Theory",
          subType: "Short Answer",
          prompt: "Explain the geometric interpretation of the vertex of a parabola in quadratic modeling.",
          correctAnswer: "The vertex represents the maximum or minimum turning point of the quadratic function depending on the sign of coefficient a.",
          marks: 5,
          difficulty: "Hard"
        }
      ],
      questions: []
    },
    {
      id: "qs_02",
      title: "Cell Biology & Genetics Assessment",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_bio",
      subjectName: "Biology",
      session: "2026/2027",
      term: "First Term",
      topic: "Cellular Respiration & Mitosis",
      difficulty: "Hard",
      questionType: "Mixed",
      totalMarks: 30,
      duration: "1 Hour 30 Minutes",
      instructions: "Answer all questions in Section A and Section B.",
      status: "Approved",
      submittedDate: "2026-09-10 14:15",
      adminNotes: "Approved for the official Question Bank and examination generation.",
      objectiveQuestions: [
        {
          id: "q_b01",
          type: "Objective",
          subType: "Multiple Choice",
          prompt: "Which organelle is responsible for ATP synthesis during aerobic cellular respiration?",
          options: ["Mitochondria", "Ribosome", "Endoplasmic Reticulum", "Golgi Body"],
          correctAnswer: "Mitochondria",
          marks: 2,
          difficulty: "Easy"
        }
      ],
      theoryQuestions: [
        {
          id: "q_b02",
          type: "Theory",
          subType: "Explain",
          prompt: "Describe the four distinct phases of Mitosis (Prophase, Metaphase, Anaphase, Telophase) and state their biological significance.",
          correctAnswer: "Prophase: chromosomes condense. Metaphase: chromosomes align at equatorial plate. Anaphase: sister chromatids separate. Telophase: nuclear membranes reform.",
          marks: 8,
          difficulty: "Hard"
        }
      ],
      questions: []
    },
    {
      id: "qs_03",
      title: "SS2 Physics - Newton's Laws of Motion",
      teacherId: "tch_david",
      teacherName: "Mr. David Adeleke",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_phy",
      subjectName: "Physics",
      session: "2026/2027",
      term: "First Term",
      topic: "Mechanics and Linear Momentum",
      difficulty: "Medium",
      questionType: "Objective",
      totalMarks: 20,
      duration: "1 Hour",
      instructions: "Answer all questions. Each question carries equal marks.",
      status: "Revision Requested",
      submittedDate: "2026-09-12 09:00",
      adminNotes: "Please add 2 calculation theory questions to balance the paper before approval.",
      objectiveQuestions: [
        {
          id: "q_p01",
          type: "Objective",
          subType: "Multiple Choice",
          prompt: "The rate of change of momentum of an object is directly proportional to the applied force according to:",
          options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Hooke's Law"],
          correctAnswer: "Newton's Second Law",
          marks: 2,
          difficulty: "Easy"
        }
      ],
      theoryQuestions: [],
      questions: []
    }
  ],

  // Question Bank (Approved items available for Admin Exam Construction - Section 43)
  questionBank: [
    {
      id: "qb_01",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      topic: "Quadratic Equations",
      session: "2026/2027",
      term: "First Term",
      type: "Objective",
      subType: "Multiple Choice",
      prompt: "Find the roots of 2x² - 8x = 0.",
      options: ["x = 0, 4", "x = 2, 4", "x = 0, -4", "x = -2, 4"],
      correctAnswer: "x = 0, 4",
      marks: 2,
      difficulty: "Easy",
      teacherName: "Mr. John Okafor"
    },
    {
      id: "qb_02",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      topic: "Logarithms",
      session: "2026/2027",
      term: "First Term",
      type: "Objective",
      subType: "Multiple Choice",
      prompt: "Evaluate log₁₀(1000) - log₁₀(10).",
      options: ["2", "3", "1", "100"],
      correctAnswer: "2",
      marks: 2,
      difficulty: "Easy",
      teacherName: "Mr. John Okafor"
    },
    {
      id: "qb_03",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      topic: "Trigonometry",
      session: "2026/2027",
      term: "First Term",
      type: "Theory",
      subType: "Calculation",
      prompt: "If sin θ = 3/5 and θ is acute, find the exact value of tan θ + cos θ without using mathematical tables.",
      correctAnswer: "cos θ = 4/5, tan θ = 3/4. tan θ + cos θ = 3/4 + 4/5 = 31/20 = 1.55",
      marks: 6,
      difficulty: "Medium",
      teacherName: "Mr. John Okafor"
    },
    {
      id: "qb_04",
      subjectId: "sub_bio",
      subjectName: "Biology",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      topic: "Cellular Respiration",
      session: "2026/2027",
      term: "First Term",
      type: "Objective",
      subType: "Multiple Choice",
      prompt: "Which organelle is responsible for ATP synthesis during aerobic cellular respiration?",
      options: ["Mitochondria", "Ribosome", "Endoplasmic Reticulum", "Golgi Body"],
      correctAnswer: "Mitochondria",
      marks: 2,
      difficulty: "Easy",
      teacherName: "Mrs. Jane Adebayo"
    },
    {
      id: "qb_05",
      subjectId: "sub_bio",
      subjectName: "Biology",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      topic: "Genetics & Mitosis",
      session: "2026/2027",
      term: "First Term",
      type: "Theory",
      subType: "Essay",
      prompt: "Describe the four distinct phases of Mitosis (Prophase, Metaphase, Anaphase, Telophase) and state their biological significance.",
      correctAnswer: "Detailed description of mitotic phases and conservation of chromosome numbers in somatic cells.",
      marks: 8,
      difficulty: "Hard",
      teacherName: "Mrs. Jane Adebayo"
    },
    {
      id: "qb_06",
      subjectId: "sub_chem",
      subjectName: "Chemistry",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      topic: "Periodic Table & Bonding",
      session: "2026/2027",
      term: "First Term",
      type: "Objective",
      subType: "Multiple Choice",
      prompt: "Which of the following bonds involves the electrostatic attraction between oppositely charged ions?",
      options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Metallic bond"],
      correctAnswer: "Ionic bond",
      marks: 2,
      difficulty: "Easy",
      teacherName: "Mrs. Grace Nwosu"
    }
  ],

  // Examination Papers created by Admin (Section 43)
  examinationPapers: [
    {
      id: "ep_01",
      title: "Senior Secondary 2 Mathematics First Term Main Examination",
      examName: "First Term Examination",
      session: "2026/2027",
      term: "First Term",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      duration: "2 Hours 30 Minutes",
      totalMarks: 100,
      instructions: "Answer ALL questions in Section A (Objective) and any THREE questions in Section B (Theory). Show all steps clearly.",
      createdDate: "2026-09-15",
      status: "Ready for Print",
      objectiveQuestions: [
        { prompt: "Find the roots of 2x² - 8x = 0.", type: "Objective", subType: "Multiple Choice", options: ["x = 0, 4", "x = 2, 4", "x = 0, -4", "x = -2, 4"], marks: 2 },
        { prompt: "Evaluate log₁₀(1000) - log₁₀(10).", type: "Objective", subType: "Multiple Choice", options: ["2", "3", "1", "100"], marks: 2 }
      ],
      theoryQuestions: [
        { prompt: "If sin θ = 3/5 and θ is acute, find the exact value of tan θ + cos θ.", type: "Theory", subType: "Calculation", marks: 10 }
      ],
      questions: [
        { num: 1, prompt: "Find the roots of 2x² - 8x = 0.", type: "Objective", options: ["x = 0, 4", "x = 2, 4", "x = 0, -4", "x = -2, 4"], marks: 2 },
        { num: 2, prompt: "Evaluate log₁₀(1000) - log₁₀(10).", type: "Objective", options: ["2", "3", "1", "100"], marks: 2 },
        { num: 3, prompt: "If sin θ = 3/5 and θ is acute, find the exact value of tan θ + cos θ.", type: "Theory", marks: 10 }
      ]
    }
  ],

  // Student academic results with 3 primary components: Project (10%), Assessment (20%), Exam (70%)
  // Tied to Student + Session + Class + Subject + Teacher + Term (Section 51)
  results: [
    // SS2A Mathematics - Submitted by Mr. John Okafor
    {
      id: "res_01",
      studentId: "stu_01",
      studentNumber: "STU001",
      studentName: "David Okafor",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 10,
      assessment: 25,
      exam: 55,
      total: 90,
      grade: "A",
      remark: "Excellent",
      status: "Submitted" // Draft, Submitted, Approved, Published, Returned
    },
    {
      id: "res_02",
      studentId: "stu_02",
      studentNumber: "STU002",
      studentName: "Grace Peter",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 27,
      exam: 52,
      total: 88,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_03",
      studentId: "stu_03",
      studentNumber: "STU003",
      studentName: "John James",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 23,
      exam: 54,
      total: 85,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_04",
      studentId: "stu_04",
      studentNumber: "STU004",
      studentName: "Emmanuel Chinedu",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 18,
      exam: 42,
      total: 68,
      grade: "B",
      remark: "Very Good",
      status: "Submitted"
    },
    {
      id: "res_05",
      studentId: "stu_05",
      studentNumber: "STU005",
      studentName: "Fatima Bello",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 10,
      assessment: 20,
      exam: 45,
      total: 75,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },

    // SS2A Biology - Submitted by Mrs. Jane Adebayo
    {
      id: "res_06",
      studentId: "stu_01",
      studentNumber: "STU001",
      studentName: "David Okafor",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_bio",
      subjectName: "Biology",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 25,
      exam: 52,
      total: 86,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_07",
      studentId: "stu_02",
      studentNumber: "STU002",
      studentName: "Grace Peter",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_bio",
      subjectName: "Biology",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 10,
      assessment: 26,
      exam: 55,
      total: 91,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_08",
      studentId: "stu_03",
      studentNumber: "STU003",
      studentName: "John James",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_bio",
      subjectName: "Biology",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 7,
      assessment: 19,
      exam: 48,
      total: 74,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_08b",
      studentId: "stu_04",
      studentNumber: "STU004",
      studentName: "Emmanuel Chinedu",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_bio",
      subjectName: "Biology",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 21,
      exam: 47,
      total: 76,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_08c",
      studentId: "stu_05",
      studentNumber: "STU005",
      studentName: "Fatima Bello",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_bio",
      subjectName: "Biology",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 23,
      exam: 50,
      total: 82,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },

    // SS2A Chemistry - Submitted by Mrs. Grace Nwosu
    {
      id: "res_09",
      studentId: "stu_01",
      studentNumber: "STU001",
      studentName: "David Okafor",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_chem",
      subjectName: "Chemistry",
      teacherId: "tch_grace",
      teacherName: "Mrs. Grace Nwosu",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 23,
      exam: 50,
      total: 81,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_10",
      studentId: "stu_02",
      studentNumber: "STU002",
      studentName: "Grace Peter",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_chem",
      subjectName: "Chemistry",
      teacherId: "tch_grace",
      teacherName: "Mrs. Grace Nwosu",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 25,
      exam: 52,
      total: 86,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_11",
      studentId: "stu_03",
      studentNumber: "STU003",
      studentName: "John James",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_chem",
      subjectName: "Chemistry",
      teacherId: "tch_grace",
      teacherName: "Mrs. Grace Nwosu",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 22,
      exam: 49,
      total: 79,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },

    // SS2A Physics - Submitted by Mr. David Adeleke (Partial / In Progress example - 2 of 5 submitted)
    {
      id: "res_12",
      studentId: "stu_01",
      studentNumber: "STU001",
      studentName: "David Okafor",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_phy",
      subjectName: "Physics",
      teacherId: "tch_david",
      teacherName: "Mr. David Adeleke",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 24,
      exam: 45,
      total: 78,
      grade: "A",
      remark: "Excellent",
      status: "Draft"
    },
    {
      id: "res_13",
      studentId: "stu_02",
      studentNumber: "STU002",
      studentName: "Grace Peter",
      classId: "cls_2026_ss2a",
      className: "SS2A",
      subjectId: "sub_phy",
      subjectName: "Physics",
      teacherId: "tch_david",
      teacherName: "Mr. David Adeleke",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 22,
      exam: 52,
      total: 82,
      grade: "A",
      remark: "Excellent",
      status: "Draft"
    },

    // SS2B Mathematics - Mr. John Okafor
    {
      id: "res_14",
      studentId: "stu_06",
      studentNumber: "STU006",
      studentName: "Tunde Bakare",
      classId: "cls_2026_ss2b",
      className: "SS2B",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 22,
      exam: 48,
      total: 79,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_15",
      studentId: "stu_10",
      studentNumber: "STU010",
      studentName: "Kehinde Adeleke",
      classId: "cls_2026_ss2b",
      className: "SS2B",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 20,
      exam: 50,
      total: 78,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },

    // SS2B English Language - Mrs. Jane Adebayo
    {
      id: "res_16",
      studentId: "stu_06",
      studentNumber: "STU006",
      studentName: "Tunde Bakare",
      classId: "cls_2026_ss2b",
      className: "SS2B",
      subjectId: "sub_eng",
      subjectName: "English Language",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 24,
      exam: 52,
      total: 85,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_17",
      studentId: "stu_10",
      studentNumber: "STU010",
      studentName: "Kehinde Adeleke",
      classId: "cls_2026_ss2b",
      className: "SS2B",
      subjectId: "sub_eng",
      subjectName: "English Language",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 22,
      exam: 46,
      total: 76,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },

    // SS3A Mathematics - Mr. John Okafor
    {
      id: "res_18",
      studentId: "stu_07",
      studentNumber: "STU007",
      studentName: "Amina Yusuf",
      classId: "cls_2026_ss3a",
      className: "SS3A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 10,
      assessment: 25,
      exam: 58,
      total: 93,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_19",
      studentId: "stu_07",
      studentNumber: "STU007",
      studentName: "Amina Yusuf",
      classId: "cls_2026_ss3a",
      className: "SS3A",
      subjectId: "sub_eng",
      subjectName: "English Language",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 26,
      exam: 54,
      total: 89,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },

    // SS1A Mathematics & English - Ngozi Nwosu
    {
      id: "res_20",
      studentId: "stu_11",
      studentNumber: "STU011",
      studentName: "Ngozi Nwosu",
      classId: "cls_2026_ss1a",
      className: "SS1A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 21,
      exam: 53,
      total: 82,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_21",
      studentId: "stu_11",
      studentNumber: "STU011",
      studentName: "Ngozi Nwosu",
      classId: "cls_2026_ss1a",
      className: "SS1A",
      subjectId: "sub_eng",
      subjectName: "English Language",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 25,
      exam: 51,
      total: 85,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },

    // JS1A Basic Science & Mathematics
    {
      id: "res_22",
      studentId: "stu_08",
      studentNumber: "STU008",
      studentName: "Chukwudi Obi",
      classId: "cls_2026_js1a",
      className: "JS1A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 23,
      exam: 48,
      total: 80,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_23",
      studentId: "stu_09",
      studentNumber: "STU009",
      studentName: "Blessing Akpan",
      classId: "cls_2026_js1a",
      className: "JS1A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 25,
      exam: 52,
      total: 86,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_24",
      studentId: "stu_08",
      studentNumber: "STU008",
      studentName: "Chukwudi Obi",
      classId: "cls_2026_js1a",
      className: "JS1A",
      subjectId: "sub_bsci",
      subjectName: "Basic Science",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 22,
      exam: 50,
      total: 80,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_25",
      studentId: "stu_09",
      studentNumber: "STU009",
      studentName: "Blessing Akpan",
      classId: "cls_2026_js1a",
      className: "JS1A",
      subjectId: "sub_bsci",
      subjectName: "Basic Science",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 10,
      assessment: 24,
      exam: 54,
      total: 88,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },

    // JS2A Mathematics & English - Ibrahim Danjuma
    {
      id: "res_26",
      studentId: "stu_12",
      studentNumber: "STU012",
      studentName: "Ibrahim Danjuma",
      classId: "cls_2026_js2a",
      className: "JS2A",
      subjectId: "sub_math",
      subjectName: "Mathematics",
      teacherId: "tch_john",
      teacherName: "Mr. John Okafor",
      session: "2026/2027",
      term: "First Term",
      project: 8,
      assessment: 22,
      exam: 51,
      total: 81,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    },
    {
      id: "res_27",
      studentId: "stu_12",
      studentNumber: "STU012",
      studentName: "Ibrahim Danjuma",
      classId: "cls_2026_js2a",
      className: "JS2A",
      subjectId: "sub_eng",
      subjectName: "English Language",
      teacherId: "tch_jane",
      teacherName: "Mrs. Jane Adebayo",
      session: "2026/2027",
      term: "First Term",
      project: 9,
      assessment: 24,
      exam: 49,
      total: 82,
      grade: "A",
      remark: "Excellent",
      status: "Submitted"
    }
  ],

  // Daily Attendance Register Records (Section: Form Teacher Daily Roll Call)
  attendance: [
    // SS2A Attendance History (Form Teacher: Mr. John Okafor - tch_john)
    {
      id: "att_ss2a_2026-10-05",
      classId: "cls_2026_ss2a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-10-05",
      markedBy: "tch_john",
      markedByName: "Mr. John Okafor",
      markedAt: "2026-10-05T08:15:00.000Z",
      notes: "Morning roll call completed promptly. All students seated before assembly.",
      records: [
        { studentId: "stu_01", status: "present", remark: "" },
        { studentId: "stu_02", status: "present", remark: "" },
        { studentId: "stu_03", status: "absent", remark: "Medical leave approved by clinic" },
        { studentId: "stu_04", status: "present", remark: "" },
        { studentId: "stu_05", status: "present", remark: "" }
      ]
    },
    {
      id: "att_ss2a_2026-10-02",
      classId: "cls_2026_ss2a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-10-02",
      markedBy: "tch_john",
      markedByName: "Mr. John Okafor",
      markedAt: "2026-10-02T08:10:00.000Z",
      notes: "Full attendance recorded ahead of inter-house debate.",
      records: [
        { studentId: "stu_01", status: "present", remark: "" },
        { studentId: "stu_02", status: "present", remark: "" },
        { studentId: "stu_03", status: "present", remark: "" },
        { studentId: "stu_04", status: "present", remark: "" },
        { studentId: "stu_05", status: "present", remark: "" }
      ]
    },
    {
      id: "att_ss2a_2026-10-01",
      classId: "cls_2026_ss2a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-10-01",
      markedBy: "tch_john",
      markedByName: "Mr. John Okafor",
      markedAt: "2026-10-01T08:20:00.000Z",
      notes: "Independence anniversary briefing session.",
      records: [
        { studentId: "stu_01", status: "present", remark: "" },
        { studentId: "stu_02", status: "present", remark: "" },
        { studentId: "stu_03", status: "present", remark: "" },
        { studentId: "stu_04", status: "late", remark: "Traffic delay on Lekki-Epe expressway" },
        { studentId: "stu_05", status: "present", remark: "" }
      ]
    },
    {
      id: "att_ss2a_2026-09-30",
      classId: "cls_2026_ss2a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-09-30",
      markedBy: "tch_john",
      markedByName: "Mr. John Okafor",
      markedAt: "2026-09-30T08:12:00.000Z",
      notes: "End of month register reconciliation.",
      records: [
        { studentId: "stu_01", status: "present", remark: "" },
        { studentId: "stu_02", status: "present", remark: "" },
        { studentId: "stu_03", status: "present", remark: "" },
        { studentId: "stu_04", status: "present", remark: "" },
        { studentId: "stu_05", status: "absent", remark: "Family commitment" }
      ]
    },
    {
      id: "att_ss2a_2026-09-29",
      classId: "cls_2026_ss2a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-09-29",
      markedBy: "tch_john",
      markedByName: "Mr. John Okafor",
      markedAt: "2026-09-29T08:14:00.000Z",
      notes: "Standard morning roll call.",
      records: [
        { studentId: "stu_01", status: "present", remark: "" },
        { studentId: "stu_02", status: "present", remark: "" },
        { studentId: "stu_03", status: "present", remark: "" },
        { studentId: "stu_04", status: "present", remark: "" },
        { studentId: "stu_05", status: "present", remark: "" }
      ]
    },
    {
      id: "att_ss2a_2026-09-28",
      classId: "cls_2026_ss2a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-09-28",
      markedBy: "tch_john",
      markedByName: "Mr. John Okafor",
      markedAt: "2026-09-28T08:10:00.000Z",
      notes: "Week 3 commencement roll call.",
      records: [
        { studentId: "stu_01", status: "present", remark: "" },
        { studentId: "stu_02", status: "present", remark: "" },
        { studentId: "stu_03", status: "present", remark: "" },
        { studentId: "stu_04", status: "present", remark: "" },
        { studentId: "stu_05", status: "present", remark: "" }
      ]
    },

    // JS1A Attendance History (Form Teacher: Mrs. Jane Adebayo - tch_jane)
    {
      id: "att_js1a_2026-10-05",
      classId: "cls_2026_js1a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-10-05",
      markedBy: "tch_jane",
      markedByName: "Mrs. Jane Adebayo",
      markedAt: "2026-10-05T08:12:00.000Z",
      notes: "All junior students present in uniform.",
      records: [
        { studentId: "stu_08", status: "present", remark: "" },
        { studentId: "stu_09", status: "present", remark: "" }
      ]
    },
    {
      id: "att_js1a_2026-10-02",
      classId: "cls_2026_js1a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-10-02",
      markedBy: "tch_jane",
      markedByName: "Mrs. Jane Adebayo",
      markedAt: "2026-10-02T08:15:00.000Z",
      notes: "Friday attendance completed.",
      records: [
        { studentId: "stu_08", status: "present", remark: "" },
        { studentId: "stu_09", status: "absent", remark: "Dental appointment" }
      ]
    },

    // SS1A Attendance History (Form Teacher: Mr. David Adeleke - tch_david)
    {
      id: "att_ss1a_2026-10-05",
      classId: "cls_2026_ss1a",
      session: "2026/2027",
      term: "First Term",
      date: "2026-10-05",
      markedBy: "tch_david",
      markedByName: "Mr. David Adeleke",
      markedAt: "2026-10-05T08:18:00.000Z",
      notes: "Morning inspection completed.",
      records: [
        { studentId: "stu_11", status: "present", remark: "" }
      ]
    }
  ],

  // Notifications
  notifications: [
    {
      id: "notif_01",
      recipientRole: "Admin",
      title: "New Question Submission",
      message: "Mr. John Okafor submitted 'First Term Mathematics Questions - Quadratic Equations' for SS2A (2026/2027).",
      time: "10 minutes ago",
      read: false,
      type: "question"
    },
    {
      id: "notif_02",
      recipientRole: "Admin",
      title: "New Result Submission",
      message: "Mrs. Jane Adebayo submitted official class scores for SS2A Biology (5/5 students).",
      time: "1 hour ago",
      read: false,
      type: "result"
    },
    {
      id: "notif_03",
      recipientRole: "Teacher",
      teacherId: "tch_david",
      title: "Question Revision Requested",
      message: "Admin requested revisions on 'SS2 Physics - Newton's Laws of Motion'.",
      time: "2 hours ago",
      read: false,
      type: "question"
    }
  ],

  // Audit Logs (Section 57)
  auditLogs: [
    {
      id: "log_01",
      user: "Admin (Dr. Balogun)",
      role: "Admin",
      action: "Created Examination Paper",
      record: "SS2 Mathematics First Term Exam (ep_01)",
      timestamp: "2026-09-15 14:20:10",
      details: "Configured paper layout, marks and 3 approved questions from Question Bank."
    },
    {
      id: "log_02",
      user: "Mr. John Okafor",
      role: "Teacher",
      action: "Submitted Results",
      record: "SS2A - Mathematics (First Term 2026/2027)",
      timestamp: "2026-09-15 11:05:40",
      details: "Submitted Projects, Assessments & Main Exam scores for 5 students."
    },
    {
      id: "log_03",
      user: "Mrs. Jane Adebayo",
      role: "Teacher",
      action: "AI Question Generation",
      record: "Cell Biology & Genetics Assessment (qs_02)",
      timestamp: "2026-09-10 13:45:22",
      details: "Generated questions from curriculum notes and submitted for Admin review."
    },
    {
      id: "log_04",
      user: "Admin (Dr. Balogun)",
      role: "Admin",
      action: "Approved Question Set",
      record: "Cell Biology & Genetics Assessment (qs_02)",
      timestamp: "2026-09-10 14:30:00",
      details: "Approved questions added to school Question Bank."
    },
    {
      id: "log_05",
      user: "Admin (Dr. Balogun)",
      role: "Admin",
      action: "Promoted Student",
      record: "David Okafor (STU001) -> SS2A (2026/2027)",
      timestamp: "2026-09-05 09:12:00",
      details: "Promoted from JS3A (2025/2026) to SS2A (2026/2027). Previous history preserved."
    }
  ]
};
