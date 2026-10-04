// Export, Print, and Document Generation Engine for Crown Hill Academy SMS
// Produces authentic Nigerian Secondary School Examination Papers & Terminal Report Cards (Section 53-55)

class ExportUtils {
  static printCurrentView() {
    window.print();
  }

  /**
   * Opens an interactive print window for an official Nigerian Examination Paper
   */
  static printExamPaper(paper, school = window.store.getSchool()) {
    const printWin = window.open("", "_blank", "width=850,height=900");
    if (!printWin) {
      alert("Please allow popups to print the examination paper.");
      return;
    }

    const objQuestions = paper.objectiveQuestions || (paper.questions ? paper.questions.filter(q => q.type === "Objective") : []);
    const theoryQuestions = paper.theoryQuestions || (paper.questions ? paper.questions.filter(q => q.type === "Theory") : []);

    let sectionAHtml = "";
    if (objQuestions.length > 0) {
      sectionAHtml = `
        <div class="exam-section-title">SECTION A: OBJECTIVE QUESTIONS (MULTIPLE CHOICE)</div>
        <div class="instructions-inline">Instructions: Answer ALL questions in this section by choosing the correct option.</div>
        <div class="questions-list">
          ${objQuestions.map((q, idx) => {
            let optionsMarkup = "";
            if (q.options && q.options.length > 0) {
              optionsMarkup = `
                <div class="options-grid">
                  ${q.options.map((opt, oIdx) => `
                    <div class="option-item"><span class="opt-label">${String.fromCharCode(65 + oIdx)}.</span> ${opt}</div>
                  `).join("")}
                </div>
              `;
            }
            return `
              <div class="question-row">
                <div class="q-text">
                  <span class="q-num">${idx + 1}.</span> ${q.prompt}
                  <span class="q-marks">[${q.marks} Mark${q.marks > 1 ? "s" : ""}]</span>
                </div>
                ${optionsMarkup}
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    let sectionBHtml = "";
    if (theoryQuestions.length > 0) {
      sectionBHtml = `
        <div class="exam-section-title" style="margin-top: 24px;">SECTION B: THEORY & STRUCTURED ESSAY</div>
        <div class="instructions-inline">Instructions: Answer any THREE questions from this section unless otherwise stated. Show all workings clearly.</div>
        <div class="questions-list">
          ${theoryQuestions.map((q, idx) => `
            <div class="question-row theory-row">
              <div class="q-text">
                <span class="q-num">${idx + 1}.</span> ${q.prompt}
                <span class="q-marks">[${q.marks} Mark${q.marks > 1 ? "s" : ""}]</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${paper.title || "Examination Paper"}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 20px;
            font-size: 11.5pt;
            line-height: 1.4;
          }
          .exam-header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .school-title {
            font-size: 18pt;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 0 0 2px 0;
          }
          .school-motto {
            font-size: 9.5pt;
            font-style: italic;
            margin-bottom: 6px;
          }
          .exam-name {
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 3px 0;
            letter-spacing: 0.5px;
          }
          .session-badge {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .meta-grid {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 10.5pt;
            border-top: 1px dashed #444;
            padding-top: 6px;
            margin-top: 6px;
            text-transform: uppercase;
          }
          .instructions-box {
            border: 1px solid #000;
            padding: 6px 10px;
            margin: 12px 0 16px 0;
            font-size: 10.5pt;
            background: #fafafa;
          }
          .instructions-title {
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 3px;
          }
          .exam-section-title {
            font-size: 11.5pt;
            font-weight: bold;
            text-align: center;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            margin-bottom: 6px;
          }
          .instructions-inline {
            font-style: italic;
            font-size: 10pt;
            margin-bottom: 10px;
            text-align: center;
          }
          .question-row {
            margin-bottom: 12px;
            page-break-inside: avoid;
          }
          .q-text {
            font-weight: normal;
            margin-bottom: 4px;
          }
          .q-num {
            font-weight: bold;
            margin-right: 4px;
          }
          .q-marks {
            float: right;
            font-weight: bold;
            font-size: 10pt;
          }
          .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px 16px;
            margin-left: 18px;
            margin-top: 3px;
          }
          .option-item {
            font-size: 10.5pt;
          }
          .opt-label {
            font-weight: bold;
            margin-right: 4px;
          }
          .theory-row {
            margin-bottom: 24px;
            min-height: 45px;
          }
          .footer-note {
            text-align: center;
            font-size: 9pt;
            font-style: italic;
            margin-top: 30px;
            border-top: 1px solid #aaa;
            padding-top: 6px;
          }
        </style>
      </head>
      <body>
        <div class="exam-header">
          <div class="school-title">${school.name}</div>
          <div class="school-motto">"${school.motto}" • ${school.address}</div>
          <div class="exam-name">${paper.examName || "FIRST TERM EXAMINATION"}</div>
          <div class="session-badge">${paper.session || "2026/2027"} ACADEMIC SESSION</div>
          
          <div class="meta-grid">
            <div><strong>SUBJECT:</strong> ${paper.subjectName || "MATHEMATICS"}</div>
            <div><strong>CLASS:</strong> ${paper.className || "SS2A"}</div>
            <div><strong>TIME:</strong> ${paper.duration || "2 HOURS"}</div>
            <div><strong>TOTAL:</strong> ${paper.totalMarks || 100} MARKS</div>
          </div>
        </div>

        <div class="instructions-box">
          <div class="instructions-title">GENERAL INSTRUCTIONS:</div>
          <div>${paper.instructions || "Read each question carefully before attempting. Write your Name, Admission Number, and Class clearly on your answer booklet."}</div>
        </div>

        ${sectionAHtml}
        ${sectionBHtml}

        <div class="footer-note">
          Examiner: Official Board of Examiners • Crown Hill Academy • Best of Luck!
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  }

  /**
   * Downloads an examination paper in Microsoft Word (.doc) format
   */
  static downloadExamPaperDOCX(paper, school = window.store.getSchool()) {
    const objQuestions = paper.objectiveQuestions || (paper.questions ? paper.questions.filter(q => q.type === "Objective") : []);
    const theoryQuestions = paper.theoryQuestions || (paper.questions ? paper.questions.filter(q => q.type === "Theory") : []);

    let bodyHtml = `
      <div style="text-align:center; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <h1 style="margin:0; font-size:20pt; text-transform:uppercase;">${school.name}</h1>
        <p style="margin:2px 0; font-style:italic;">"${school.motto}" • ${school.address}</p>
        <h2 style="margin:4px 0; font-size:14pt;">${paper.examName || "FIRST TERM EXAMINATION"}</h2>
        <h3 style="margin:2px 0; font-size:12pt;">${paper.session || "2026/2027"} ACADEMIC SESSION</h3>
        <table style="width:100%; font-weight:bold; margin-top:8px; border-top:1px dashed #000; padding-top:4px;">
          <tr>
            <td>SUBJECT: ${(paper.subjectName || "MATHEMATICS").toUpperCase()}</td>
            <td>CLASS: ${paper.className || "SS2A"}</td>
            <td>TIME: ${paper.duration || "2 HOURS"}</td>
            <td align="right">MARKS: ${paper.totalMarks || 100}</td>
          </tr>
        </table>
      </div>

      <div style="border: 1px solid #000; padding: 8px; margin: 15px 0; font-size:10.5pt;">
        <strong>INSTRUCTIONS:</strong> ${paper.instructions || "Answer all questions."}
      </div>
    `;

    if (objQuestions.length > 0) {
      bodyHtml += `<h3 style="text-align:center; border-bottom:1px solid #000; margin-top:20px;">SECTION A: OBJECTIVE (MULTIPLE CHOICE)</h3>`;
      objQuestions.forEach((q, idx) => {
        bodyHtml += `
          <p style="margin-bottom:4px;"><strong>${idx + 1}.</strong> ${q.prompt} <span style="float:right;">[${q.marks} Mark${q.marks > 1 ? "s" : ""}]</span></p>
        `;
        if (q.options && q.options.length > 0) {
          bodyHtml += `<table style="width:100%; margin-left:15px; margin-bottom:10px;"><tr>`;
          q.options.forEach((opt, oIdx) => {
            bodyHtml += `<td style="width:50%;"><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}</td>`;
            if (oIdx % 2 === 1 && oIdx < q.options.length - 1) bodyHtml += `</tr><tr>`;
          });
          bodyHtml += `</tr></table>`;
        }
      });
    }

    if (theoryQuestions.length > 0) {
      bodyHtml += `<h3 style="text-align:center; border-bottom:1px solid #000; margin-top:25px;">SECTION B: THEORY</h3>`;
      theoryQuestions.forEach((q, idx) => {
        bodyHtml += `
          <p style="margin-bottom:18px;"><strong>${idx + 1}.</strong> ${q.prompt} <span style="float:right;">[${q.marks} Mark${q.marks > 1 ? "s" : ""}]</span></p>
        `;
      });
    }

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${paper.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.3; }
        </style>
      </head>
      <body>
        ${bodyHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(paper.className || "Class")}_${(paper.subjectName || "Subject")}_Exam_Paper.doc`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }

  /**
   * Helper that builds the HTML markup for a single student's terminal report card
   */
  static generateReportCardBody(student, results = [], classObj = null, school = window.store.getSchool(), session = null, term = null) {
    const sess = session || student.currentSession || school.currentSession;
    const trm = term || school.currentTerm;
    const className = classObj ? classObj.name : (student.currentClassId || "SS2A");

    // Filter results for this student and session/term
    const studentResults = results.filter(r => r.studentId === student.id && r.session === sess && r.term === trm);

    let totalScoreSum = 0;
    let scoredCount = 0;

    studentResults.forEach(r => {
      if (r.total !== null && r.total !== undefined) {
        totalScoreSum += Number(r.total);
        scoredCount++;
      }
    });

    const averageScore = scoredCount > 0 ? Math.round((totalScoreSum / scoredCount) * 10) / 10 : 0;
    const overallGrade = window.store.calculateGrade(null, null, averageScore).grade;

    const gradingScale = school.gradingScale || [
      { grade: "A", minScore: 70, maxScore: 100, remark: "Excellent" },
      { grade: "B", minScore: 60, maxScore: 69, remark: "Very Good" },
      { grade: "C", minScore: 50, maxScore: 59, remark: "Good" },
      { grade: "D", minScore: 45, maxScore: 49, remark: "Fair" },
      { grade: "E", minScore: 40, maxScore: 44, remark: "Pass" },
      { grade: "F", minScore: 0, maxScore: 39, remark: "Fail" }
    ];

    return `
      <div class="report-border">
        <table class="header-table">
          <tr>
            <td style="width: 80px; text-align: center;">
              <div class="school-logo-badge">${school.logoText || "CHA"}</div>
            </td>
            <td style="text-align: center;">
              <h1 class="school-title">${school.name}</h1>
              <div class="school-motto">"${school.motto}"</div>
              <div style="font-size: 9.5pt;">${school.address} • Tel: ${school.phone}</div>
              <div class="sheet-title">STUDENT TERMINAL CONTINUOUS ASSESSMENT & EXAMINATION REPORT</div>
            </td>
          </tr>
        </table>

        <table class="student-info-grid">
          <tr>
            <td class="info-lbl">STUDENT NAME:</td>
            <td class="info-val" style="font-size:11pt; font-weight:bold; color:#1e3a8a;">${student.name}</td>
            <td class="info-lbl">ADMISSION NO:</td>
            <td class="info-val">${student.admissionNo || "ADM124"}</td>
            <td rowspan="3" class="photo-cell">
              <img class="student-photo" src="${student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150'}" alt="${student.name}" />
            </td>
          </tr>
          <tr>
            <td class="info-lbl">STUDENT ID:</td>
            <td class="info-val">${student.studentId}</td>
            <td class="info-lbl">CLASS / ARM:</td>
            <td class="info-val"><strong>${className}</strong></td>
          </tr>
          <tr>
            <td class="info-lbl">ACADEMIC SESSION:</td>
            <td class="info-val"><strong>${sess}</strong></td>
            <td class="info-lbl">TERM:</td>
            <td class="info-val"><strong>${trm}</strong></td>
          </tr>
        </table>

        <table class="scores-table">
          <thead>
            <tr>
              <th style="width: 4%;">S/N</th>
              <th style="width: 32%; text-align: left;">SUBJECT</th>
              <th style="width: 12%;">PROJECTS (${school.projectWeight || 10}%)</th>
              <th style="width: 14%;">ASSESSMENT (${school.assessmentWeight || 20}%)</th>
              <th style="width: 12%;">EXAM (${school.examWeight || 70}%)</th>
              <th style="width: 10%;">TOTAL (100%)</th>
              <th style="width: 8%;">GRADE</th>
              <th style="width: 16%;">REMARK</th>
            </tr>
          </thead>
          <tbody>
            ${studentResults.length > 0 ? studentResults.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td class="subject-name">${r.subjectName}</td>
                <td>${r.project !== null ? r.project : '-'}</td>
                <td>${r.assessment !== null ? r.assessment : '-'}</td>
                <td>${r.exam !== null ? r.exam : '-'}</td>
                <td style="font-weight:bold; color:#1e3a8a;">${r.total !== null ? r.total : '-'}</td>
                <td style="font-weight:bold;">${r.grade || '-'}</td>
                <td style="font-size:9pt;">${r.remark || '-'}</td>
              </tr>
            `).join("") : `
              <tr>
                <td colspan="8" style="padding: 20px; color:#64748b;">No approved terminal subject scores recorded for this session.</td>
              </tr>
            `}
            <tr class="total-row">
              <td colspan="2" style="text-align: right;">CUMULATIVE TOTAL & AVERAGE:</td>
              <td colspan="3" style="text-align: center;">Total Subjects: ${scoredCount}</td>
              <td style="color: #1e3a8a; font-size: 11pt;">${totalScoreSum}</td>
              <td>${overallGrade}</td>
              <td style="font-weight:bold;">Avg: ${averageScore}</td>
            </tr>
          </tbody>
        </table>

        <div class="two-col-grid">
          <div>
            <div style="font-weight:bold; font-size:9pt; margin-bottom:3px;">BEHAVIORAL & PSYCHOMOTOR ASSESSMENT:</div>
            <table class="traits-table">
              <thead>
                <tr>
                  <th>Trait / Skill</th>
                  <th>5</th>
                  <th>4</th>
                  <th>3</th>
                  <th>2</th>
                  <th>1</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="text-align:left;">Punctuality & Regularity</td><td>✓</td><td></td><td></td><td></td><td></td></tr>
                <tr><td style="text-align:left;">Neatness & Personal Hygiene</td><td>✓</td><td></td><td></td><td></td><td></td></tr>
                <tr><td style="text-align:left;">Attentiveness in Class</td><td></td><td>✓</td><td></td><td></td><td></td></tr>
                <tr><td style="text-align:left;">Leadership & Teamwork</td><td>✓</td><td></td><td></td><td></td><td></td></tr>
                <tr><td style="text-align:left;">Honesty & Reliability</td><td>✓</td><td></td><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <div style="font-weight:bold; font-size:9pt; margin-bottom:3px;">OFFICIAL GRADING SCALE:</div>
            <table class="grading-table">
              <thead>
                <tr>
                  <th>Score Range</th>
                  <th>Grade</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                ${gradingScale.map(g => `
                  <tr>
                    <td>${g.minScore}% - ${g.maxScore}%</td>
                    <td style="font-weight:bold;">${g.grade}</td>
                    <td>${g.remark}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="remarks-box">
          <div class="remark-line">
            <span style="font-weight:bold;">CLASS TEACHER'S REMARK:</span>
            <span class="remark-text">${averageScore >= 80 ? 'An exceptionally diligent and hardworking student with sterling intellectual discipline.' : averageScore >= 60 ? 'Good performance. Encouraged to maintain consistency in mathematics and science.' : 'Fair effort. Needs more dedicated revision and practice.'}</span>
          </div>
          <div class="remark-line">
            <span style="font-weight:bold;">PRINCIPAL'S COMMENT:</span>
            <span class="remark-text">${averageScore >= 75 ? 'Splendid academic achievement. Keep soaring higher.' : 'Satisfactory progress. Hard work brings greater success.'}</span>
          </div>
        </div>

        <div class="seal-section">
          <div class="signature-block">
            <div class="sig-line">Class Teacher's Signature & Date</div>
          </div>

          <div style="text-align:center;">
            <div class="stamp-circle">
              <span>CROWN HILL ACADEMY</span>
              <span style="font-size:8pt; margin:1px 0;">★ OFFICIAL ★</span>
              <span>SEAL • LAGOS</span>
            </div>
          </div>

          <div class="signature-block">
            <div class="sig-line">${school.principalName}<br><span style="font-size:8pt; font-weight:normal;">${school.principalTitle}</span></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Opens an authentic, beautifully formatted Nigerian Terminal Student Report Card for printing (Section 53, 54, 55)
   */
  static printStudentReportCard(student, results = [], classObj = null, school = window.store.getSchool(), session = null, term = null) {
    const printWin = window.open("", "_blank", "width=900,height=950");
    if (!printWin) {
      alert("Please allow popups to print the student report sheet.");
      return;
    }

    const sess = session || student.currentSession || school.currentSession;
    const bodyHtml = ExportUtils.generateReportCardBody(student, results, classObj, school, sess, term);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Terminal Report Sheet - ${student.name} (${student.studentId})</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #111;
            background: #fff;
            margin: 0;
            padding: 15px;
            font-size: 10.5pt;
            line-height: 1.3;
          }
          .report-border {
            border: 3px double #1e3a8a;
            padding: 16px;
            position: relative;
          }
          .header-table {
            width: 100%;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .school-logo-badge {
            width: 70px;
            height: 70px;
            background: #1e3a8a;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20pt;
            font-weight: bold;
            font-family: Arial, sans-serif;
            margin: 0 auto;
          }
          .school-title {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #1e3a8a;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .school-motto {
            font-size: 9.5pt;
            font-style: italic;
            color: #475569;
            margin: 2px 0 4px 0;
          }
          .sheet-title {
            font-size: 13pt;
            font-weight: bold;
            background: #1e3a8a;
            color: #fff;
            display: inline-block;
            padding: 3px 18px;
            border-radius: 4px;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 4px;
          }
          .student-info-grid {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0 14px 0;
            font-size: 10pt;
          }
          .student-info-grid td {
            padding: 4px 6px;
            border: 1px solid #cbd5e1;
          }
          .student-info-grid .info-lbl {
            font-weight: bold;
            background: #f1f5f9;
            width: 18%;
          }
          .student-info-grid .info-val {
            width: 32%;
            font-weight: 500;
          }
          .photo-cell {
            width: 90px;
            text-align: center;
            vertical-align: middle;
            background: #f8fafc;
            padding: 4px !important;
          }
          .student-photo {
            width: 75px;
            height: 75px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #1e3a8a;
          }
          .scores-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            font-size: 10pt;
          }
          .scores-table th, .scores-table td {
            border: 1px solid #334155;
            padding: 5px 6px;
            text-align: center;
          }
          .scores-table th {
            background: #1e3a8a;
            color: #fff;
            font-weight: bold;
            font-size: 9.5pt;
          }
          .scores-table td.subject-name {
            text-align: left;
            font-weight: bold;
          }
          .scores-table tr.total-row {
            background: #f8fafc;
            font-weight: bold;
          }
          .two-col-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 12px;
            margin-top: 10px;
          }
          .traits-table, .grading-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
          }
          .traits-table th, .traits-table td, .grading-table th, .grading-table td {
            border: 1px solid #94a3b8;
            padding: 3px 5px;
            text-align: center;
          }
          .traits-table th, .grading-table th {
            background: #e2e8f0;
            color: #0f172a;
            font-weight: bold;
          }
          .remarks-box {
            margin-top: 12px;
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            background: #fafafa;
            font-size: 10pt;
          }
          .remark-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            align-items: baseline;
          }
          .remark-text {
            font-style: italic;
            border-bottom: 1px dotted #64748b;
            flex-grow: 1;
            margin-left: 8px;
            padding-left: 4px;
          }
          .seal-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 16px;
            padding-top: 8px;
          }
          .signature-block {
            text-align: center;
            width: 200px;
          }
          .sig-line {
            border-top: 1px solid #000;
            margin-top: 25px;
            padding-top: 2px;
            font-size: 9.5pt;
            font-weight: bold;
          }
          .stamp-circle {
            width: 90px;
            height: 90px;
            border: 2px dashed #dc2626;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #dc2626;
            font-size: 6.5pt;
            font-weight: bold;
            text-align: center;
            transform: rotate(-10deg);
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        ${bodyHtml}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  }

  /**
   * Prints a student's historical result report card (Requirement 8)
   */
  static printStudentHistoricalReportCard(student, historicalResult, school = window.store.getSchool()) {
    const printWin = window.open("", "_blank", "width=900,height=950");
    if (!printWin) {
      alert("Please allow popups to print the historical report sheet.");
      return;
    }

    const gradingScale = school.gradingScale || [
      { grade: "A", minScore: 70, maxScore: 100, remark: "Excellent" },
      { grade: "B", minScore: 60, maxScore: 69, remark: "Very Good" },
      { grade: "C", minScore: 50, maxScore: 59, remark: "Good" },
      { grade: "D", minScore: 45, maxScore: 49, remark: "Fair" },
      { grade: "E", minScore: 40, maxScore: 44, remark: "Pass" },
      { grade: "F", minScore: 0, maxScore: 39, remark: "Fail" }
    ];

    const subjects = historicalResult.subjects || [
      { subject: "Mathematics", score: 85, grade: "A" },
      { subject: "English Language", score: 80, grade: "A" },
      { subject: "Basic Science", score: 82, grade: "A" }
    ];

    const totalSum = subjects.reduce((sum, s) => sum + Number(s.score || 0), 0);
    const avg = historicalResult.average || (subjects.length > 0 ? Math.round((totalSum / subjects.length) * 10) / 10 : 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Historical Result - ${student.name} (${historicalResult.session})</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body { font-family: 'Times New Roman', Times, serif; color: #111; background: #fff; margin: 0; padding: 15px; font-size: 10.5pt; line-height: 1.3; }
          .report-border { border: 3px double #1e3a8a; padding: 16px; position: relative; }
          .header-table { width: 100%; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 10px; }
          .school-logo-badge { width: 70px; height: 70px; background: #1e3a8a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20pt; font-weight: bold; font-family: Arial, sans-serif; margin: 0 auto; }
          .school-title { font-size: 18pt; font-weight: bold; text-transform: uppercase; color: #1e3a8a; margin: 0; }
          .sheet-title { font-size: 12pt; font-weight: bold; background: #1e3a8a; color: #fff; display: inline-block; padding: 3px 18px; border-radius: 4px; text-transform: uppercase; margin-top: 4px; }
          .student-info-grid { width: 100%; border-collapse: collapse; margin: 10px 0 14px 0; font-size: 10pt; }
          .student-info-grid td { padding: 4px 6px; border: 1px solid #cbd5e1; }
          .info-lbl { font-weight: bold; background: #f1f5f9; width: 18%; }
          .info-val { width: 32%; font-weight: 500; }
          .photo-cell { width: 90px; text-align: center; vertical-align: middle; background: #f8fafc; }
          .student-photo { width: 75px; height: 75px; border-radius: 50%; object-fit: cover; border: 2px solid #1e3a8a; }
          .scores-table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
          .scores-table th, .scores-table td { border: 1px solid #334155; padding: 5px 6px; text-align: center; }
          .scores-table th { background: #1e3a8a; color: #fff; font-weight: bold; }
          .scores-table td.subject-name { text-align: left; font-weight: bold; }
          .two-col-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-top: 10px; }
          .traits-table, .grading-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
          .traits-table th, .traits-table td, .grading-table th, .grading-table td { border: 1px solid #94a3b8; padding: 3px 5px; text-align: center; }
          .traits-table th, .grading-table th { background: #e2e8f0; color: #0f172a; font-weight: bold; }
          .remarks-box { margin-top: 12px; border: 1px solid #cbd5e1; padding: 8px 12px; background: #fafafa; font-size: 10pt; }
          .seal-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 16px; padding-top: 8px; }
          .sig-line { border-top: 1px solid #000; margin-top: 25px; padding-top: 2px; font-size: 9.5pt; font-weight: bold; }
          .stamp-circle { width: 90px; height: 90px; border: 2px dashed #dc2626; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #dc2626; font-size: 6.5pt; font-weight: bold; text-align: center; transform: rotate(-10deg); margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="report-border">
          <table class="header-table">
            <tr>
              <td style="width: 80px; text-align: center;">
                <div class="school-logo-badge">${school.logoText || "CHA"}</div>
              </td>
              <td style="text-align: center;">
                <h1 class="school-title">${school.name}</h1>
                <div style="font-size: 9.5pt; font-style:italic;">"${school.motto}" • ${school.address}</div>
                <div class="sheet-title">HISTORICAL RESULT ARCHIVE • OFFICIAL TRANSCRIPT</div>
              </td>
            </tr>
          </table>

          <table class="student-info-grid">
            <tr>
              <td class="info-lbl">STUDENT NAME:</td>
              <td class="info-val" style="font-size:11pt; font-weight:bold; color:#1e3a8a;">${student.name}</td>
              <td class="info-lbl">ADMISSION NO:</td>
              <td class="info-val">${student.admissionNo || "ADM124"}</td>
              <td rowspan="3" class="photo-cell">
                <img class="student-photo" src="${student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150'}" alt="${student.name}" />
              </td>
            </tr>
            <tr>
              <td class="info-lbl">STUDENT ID:</td>
              <td class="info-val">${student.studentId}</td>
              <td class="info-lbl">HISTORICAL CLASS:</td>
              <td class="info-val"><strong>${historicalResult.className}</strong></td>
            </tr>
            <tr>
              <td class="info-lbl">HISTORICAL SESSION:</td>
              <td class="info-val"><strong>${historicalResult.session}</strong></td>
              <td class="info-lbl">TERM:</td>
              <td class="info-val"><strong>${historicalResult.term}</strong></td>
            </tr>
          </table>

          <table class="scores-table">
            <thead>
              <tr>
                <th style="width: 6%;">S/N</th>
                <th style="width: 50%; text-align: left;">SUBJECT</th>
                <th style="width: 20%;">SCORE</th>
                <th style="width: 24%;">GRADE</th>
              </tr>
            </thead>
            <tbody>
              ${subjects.map((s, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td class="subject-name">${s.subject}</td>
                  <td style="font-weight:bold; color:#1e3a8a;">${s.score}</td>
                  <td style="font-weight:bold;">${s.grade}</td>
                </tr>
              `).join("")}
              <tr style="background:#f8fafc; font-weight:bold;">
                <td colspan="2" style="text-align:right;">AVERAGE & POSITION:</td>
                <td style="color:#1e3a8a;">${avg}</td>
                <td>Position: ${historicalResult.position || '1st'}</td>
              </tr>
            </tbody>
          </table>

          <div class="remarks-box">
            <div style="margin-bottom:6px;"><strong>HISTORICAL REMARKS:</strong> <em>${historicalResult.remarks || 'Commendable academic achievement.'}</em></div>
            <div><strong>STATUS:</strong> <span style="color:#16a34a; font-weight:bold;">Archived Historical Academic Record</span></div>
          </div>

          <div class="seal-section">
            <div style="text-align:center; width:200px;">
              <div class="sig-line">Class Teacher's Signature</div>
            </div>
            <div style="text-align:center;">
              <div class="stamp-circle">
                <span>CROWN HILL ACADEMY</span>
                <span style="font-size:8pt; margin:1px 0;">★ HISTORICAL ★</span>
                <span>SEAL • ARCHIVE</span>
              </div>
            </div>
            <div style="text-align:center; width:200px;">
              <div class="sig-line">${school.principalName}<br><span style="font-size:8pt; font-weight:normal;">${school.principalTitle}</span></div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 300); };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  }

  /**
   * Prints All Results for an entire class at once (Requirement 7)
   * Formats each student's complete report card on its own printable page with page-breaks.
   */
  static printAllClassResults(classId, session = null, term = null) {
    const store = window.store;
    const cls = store.getClassById(classId);
    if (!cls) {
      alert("Class not found.");
      return;
    }

    const sess = session || cls.session || store.getCurrentSession();
    const trm = term || store.getSchool().currentTerm;
    const students = store.getClassStudents(classId);
    const results = store.getResults({ classId, session: sess, term: trm });
    const school = store.getSchool();

    if (students.length === 0) {
      alert("No students found in this class to print results.");
      return;
    }

    const printWin = window.open("", "_blank", "width=900,height=950");
    if (!printWin) {
      alert("Please allow popups to print class results.");
      return;
    }

    const reportCardsHtml = students.map(student => `
      <div class="student-report-page">
        ${ExportUtils.generateReportCardBody(student, results, cls, school, sess, trm)}
      </div>
    `).join("\n");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>All Student Results - ${cls.name} (${sess})</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #111;
            background: #fff;
            margin: 0;
            padding: 0;
            font-size: 10.5pt;
            line-height: 1.3;
          }
          .student-report-page {
            padding: 15px;
            box-sizing: border-box;
            page-break-after: always;
            break-after: page;
          }
          .student-report-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          .report-border {
            border: 3px double #1e3a8a;
            padding: 16px;
            position: relative;
          }
          .header-table {
            width: 100%;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .school-logo-badge {
            width: 70px;
            height: 70px;
            background: #1e3a8a;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20pt;
            font-weight: bold;
            font-family: Arial, sans-serif;
            margin: 0 auto;
          }
          .school-title {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #1e3a8a;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .school-motto {
            font-size: 9.5pt;
            font-style: italic;
            color: #475569;
            margin: 2px 0 4px 0;
          }
          .sheet-title {
            font-size: 13pt;
            font-weight: bold;
            background: #1e3a8a;
            color: #fff;
            display: inline-block;
            padding: 3px 18px;
            border-radius: 4px;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 4px;
          }
          .student-info-grid {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0 14px 0;
            font-size: 10pt;
          }
          .student-info-grid td {
            padding: 4px 6px;
            border: 1px solid #cbd5e1;
          }
          .student-info-grid .info-lbl {
            font-weight: bold;
            background: #f1f5f9;
            width: 18%;
          }
          .student-info-grid .info-val {
            width: 32%;
            font-weight: 500;
          }
          .photo-cell {
            width: 90px;
            text-align: center;
            vertical-align: middle;
            background: #f8fafc;
            padding: 4px !important;
          }
          .student-photo {
            width: 75px;
            height: 75px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #1e3a8a;
          }
          .scores-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            font-size: 10pt;
          }
          .scores-table th, .scores-table td {
            border: 1px solid #334155;
            padding: 5px 6px;
            text-align: center;
          }
          .scores-table th {
            background: #1e3a8a;
            color: #fff;
            font-weight: bold;
            font-size: 9.5pt;
          }
          .scores-table td.subject-name {
            text-align: left;
            font-weight: bold;
          }
          .scores-table tr.total-row {
            background: #f8fafc;
            font-weight: bold;
          }
          .two-col-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 12px;
            margin-top: 10px;
          }
          .traits-table, .grading-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
          }
          .traits-table th, .traits-table td, .grading-table th, .grading-table td {
            border: 1px solid #94a3b8;
            padding: 3px 5px;
            text-align: center;
          }
          .traits-table th, .grading-table th {
            background: #e2e8f0;
            color: #0f172a;
            font-weight: bold;
          }
          .remarks-box {
            margin-top: 12px;
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            background: #fafafa;
            font-size: 10pt;
          }
          .remark-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            align-items: baseline;
          }
          .remark-text {
            font-style: italic;
            border-bottom: 1px dotted #64748b;
            flex-grow: 1;
            margin-left: 8px;
            padding-left: 4px;
          }
          .seal-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 16px;
            padding-top: 8px;
          }
          .signature-block {
            text-align: center;
            width: 200px;
          }
          .sig-line {
            border-top: 1px solid #000;
            margin-top: 25px;
            padding-top: 2px;
            font-size: 9.5pt;
            font-weight: bold;
          }
          .stamp-circle {
            width: 90px;
            height: 90px;
            border: 2px dashed #dc2626;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #dc2626;
            font-size: 6.5pt;
            font-weight: bold;
            text-align: center;
            transform: rotate(-10deg);
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        ${reportCardsHtml}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  }

  /**
   * Prints the Combined Class Results Broadsheet for an entire class (Section 46, 55)
   */
  static printClassBroadsheet(broadsheetData, school = window.store.getSchool()) {
    const { class: cls, session, term, students, subjects, broadsheet } = broadsheetData;
    const printWin = window.open("", "_blank", "width=1100,height=800");
    if (!printWin) {
      alert("Please allow popups to print the class broadsheet.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${cls.name} Master Results Broadsheet - ${session}</title>
        <style>
          @page { size: A4 landscape; margin: 10mm; }
          body {
            font-family: Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 15px;
            font-size: 9.5pt;
          }
          .sheet-header {
            text-align: center;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 6px;
            margin-bottom: 12px;
          }
          .title { font-size: 16pt; font-weight: bold; margin: 0; text-transform: uppercase; color: #1e3a8a; }
          .sub { font-size: 10pt; font-style: italic; color: #475569; margin: 2px 0 6px 0; }
          .meta-bar {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 10.5pt;
            background: #f1f5f9;
            padding: 6px 12px;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #94a3b8; padding: 4px 6px; text-align: center; }
          th { background: #1e3a8a; color: #fff; font-size: 9pt; }
          td.name-col { text-align: left; font-weight: 500; }
          tr:nth-child(even) { background: #f8fafc; }
        </style>
      </head>
      <body>
        <div class="sheet-header">
          <div class="title">${school.name}</div>
          <div class="sub">"${school.motto}" • ${school.address}</div>
          <div style="font-size:12pt; font-weight:bold; text-transform:uppercase;">OFFICIAL CLASS RESULTS BROADSHEET</div>
        </div>

        <div class="meta-bar">
          <div>CLASS: <strong>${cls.name} (${cls.section || 'Senior Secondary'})</strong></div>
          <div>SESSION: <strong>${session}</strong></div>
          <div>TERM: <strong>${term}</strong></div>
          <div>TOTAL STUDENTS: <strong>${students.length}</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 4%;">Pos</th>
              <th style="width: 12%;">Student ID</th>
              <th style="width: 22%; text-align: left;">Student Name</th>
              ${subjects.map(s => `<th>${s.name.substring(0, 10)}</th>`).join("")}
              <th style="width: 8%;">Total</th>
              <th style="width: 8%;">Average</th>
              <th style="width: 6%;">Grade</th>
            </tr>
          </thead>
          <tbody>
            ${broadsheet.map((row, idx) => `
              <tr>
                <td style="font-weight:bold;">${row.position || (idx + 1)}</td>
                <td>${row.student.studentId}</td>
                <td class="name-col">${row.student.name}</td>
                ${subjects.map(s => {
                  const scoreObj = row.subjectScores[s.id];
                  return `<td>${scoreObj && scoreObj.total !== null ? scoreObj.total : '-'}</td>`;
                }).join("")}
                <td style="font-weight:bold; color:#1e3a8a;">${row.totalSum > 0 ? row.totalSum : '-'}</td>
                <td style="font-weight:bold;">${row.average !== null ? row.average : '-'}</td>
                <td style="font-weight:bold;">${row.overallGrade || '-'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div style="display:flex; justify-content:space-between; margin-top:30px; font-size:10pt;">
          <div>Compiled by: ________________________ (Exam Officer)</div>
          <div>Approved by: <strong>${school.principalName}</strong> (Principal)</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  }

  /**
   * Downloads a CSV of the Combined Class Results Broadsheet
   */
  static downloadClassBroadsheetCSV(broadsheetData) {
    const { class: cls, session, term, subjects, broadsheet } = broadsheetData;
    let csv = `sep=,\n`;
    csv += `"Crown Hill Academy - Class Broadsheet"\n`;
    csv += `"Class: ${cls.name}","Session: ${session}","Term: ${term}"\n\n`;

    // Headers
    const headers = ["Position", "Student ID", "Admission No", "Student Name", ...subjects.map(s => s.name), "Total Score", "Average", "Overall Grade"];
    csv += headers.map(h => `"${h}"`).join(",") + "\n";

    broadsheet.forEach(row => {
      const line = [
        row.position || "-",
        row.student.studentId,
        row.student.admissionNo || "",
        row.student.name,
        ...subjects.map(s => {
          const score = row.subjectScores[s.id];
          return score && score.total !== null ? score.total : "";
        }),
        row.totalSum || 0,
        row.average !== null ? row.average : "",
        row.overallGrade || ""
      ];
      csv += line.map(val => `"${val}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cls.name}_${session.replace(/\//g, "-")}_Broadsheet.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }

  /**
   * Interactive Print Window for Official School Weekly Timetable
   */
  static printTimetable(classObj, slots, periods, days, school = window.store.getSchool(), session = "2026/2027", term = "First Term") {
    const printWin = window.open("", "_blank", "width=1050,height=750");
    if (!printWin) {
      alert("Please allow popups to print the timetable.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${classObj ? classObj.name : "School"} Official Timetable • ${session}</title>
        <style>
          @page { size: landscape; margin: 12mm; }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #111;
            background: #fff;
            margin: 0;
            padding: 15px;
            font-size: 11pt;
          }
          .header-crest {
            text-align: center;
            border-bottom: 2px solid #142b47;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .school-name {
            font-size: 20pt;
            font-weight: bold;
            color: #142b47;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0;
          }
          .school-motto {
            font-style: italic;
            font-size: 10.5pt;
            color: #475569;
            margin: 2px 0 6px 0;
          }
          .timetable-meta {
            font-size: 12.5pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #334155;
            padding: 8px 6px;
            text-align: center;
            font-size: 10pt;
          }
          th {
            background-color: #f1f5f9;
            font-weight: bold;
            color: #0f172a;
          }
          .period-th {
            width: 12%;
          }
          .break-row-cell {
            background-color: #f8fafc;
            font-weight: bold;
            font-style: italic;
            color: #475569;
            text-align: center;
            letter-spacing: 1px;
            padding: 6px;
          }
          .slot-subject {
            font-weight: bold;
            color: #0f172a;
            font-size: 10.5pt;
          }
          .slot-teacher {
            font-size: 9pt;
            color: #334155;
            margin-top: 2px;
          }
          .slot-venue {
            font-size: 8.5pt;
            color: #64748b;
            font-style: italic;
          }
          .empty-slot {
            color: #cbd5e1;
            font-size: 9pt;
          }
          .footer-signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding: 0 40px;
            page-break-inside: avoid;
          }
          .sig-box {
            text-align: center;
            width: 200px;
          }
          .sig-line {
            border-top: 1px dashed #333;
            margin-top: 40px;
            padding-top: 4px;
            font-size: 10pt;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header-crest">
          <div class="school-name">${school.name || "Crown Hill Academy"}</div>
          <div class="school-motto">"${school.motto || "Excellence, Integrity and Innovation"}"</div>
          <div style="font-size: 9.5pt; color: #64748b;">${school.address || "Lagos, Nigeria"} • Tel: ${school.phone || "+234 803 123 4567"}</div>
          <div class="timetable-meta">
            OFFICIAL CLASS TIMETABLE — ${classObj ? classObj.name : "ALL CLASSES"} (${session} • ${term})
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 12%;">DAY / PERIOD</th>
              ${periods.filter(p => !p.isBreak).map(p => `
                <th class="period-th">
                  ${p.label}<br>
                  <span style="font-weight: normal; font-size: 8.5pt; color: #475569;">${p.time}</span>
                </th>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            ${days.map(day => {
              const activePeriods = periods.filter(p => !p.isBreak);
              return `
                <tr>
                  <td style="font-weight: bold; background-color: #f8fafc; text-align: left; padding-left: 10px;">${day.toUpperCase()}</td>
                  ${activePeriods.map(p => {
                    const slot = slots.find(s => s.day === day && Number(s.periodNumber) === Number(p.id));
                    if (!slot) {
                      return `<td><span class="empty-slot">— Free —</span></td>`;
                    }
                    const sub = window.store.getSubjectById(slot.subjectId);
                    const tch = window.store.getTeacherById(slot.teacherId);
                    return `
                      <td>
                        <div class="slot-subject">${sub?.name || "Subject"}</div>
                        <div class="slot-teacher">${tch?.name || "Teacher"}</div>
                        <div class="slot-venue">${slot.room || ""}</div>
                      </td>
                    `;
                  }).join("")}
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        <div class="footer-signatures">
          <div class="sig-box">
            <div class="sig-line">Dean of Studies / Timetable Master</div>
          </div>
          <div class="sig-box">
            <div class="sig-line">Form Teacher / Level Coordinator</div>
          </div>
          <div class="sig-box">
            <div class="sig-line">${school.principalName || "Principal & Head of School"}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWin.document.write(htmlContent);
    printWin.document.close();
  }

  /**
   * Export Timetable Grid to CSV
   */
  static downloadTimetableCSV(classObj, slots, periods, days, session = "2026/2027", term = "First Term") {
    let csv = `sep=,\n`;
    csv += `"Crown Hill Academy - Class Weekly Timetable"\n`;
    csv += `"Class: ${classObj?.name || 'Class'}","Session: ${session}","Term: ${term}"\n\n`;

    const activePeriods = periods.filter(p => !p.isBreak);
    const headers = ["Day", ...activePeriods.map(p => `${p.label} (${p.time})`)];
    csv += headers.map(h => `"${h}"`).join(",") + "\n";

    days.forEach(day => {
      const row = [day];
      activePeriods.forEach(p => {
        const slot = slots.find(s => s.day === day && Number(s.periodNumber) === Number(p.id));
        if (slot) {
          const sub = window.store.getSubjectById(slot.subjectId)?.name || "Subject";
          const tch = window.store.getTeacherById(slot.teacherId)?.name || "";
          const rm = slot.room || "";
          row.push(`${sub} [${tch}] (${rm})`);
        } else {
          row.push("Free");
        }
      });
      csv += row.map(v => `"${v}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${classObj?.name || 'Class'}_Timetable_${session.replace(/\//g, "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }
}

window.exportUtils = ExportUtils;

