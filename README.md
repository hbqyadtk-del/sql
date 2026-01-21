<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>نظام إدارة الطلاب - فاخر</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    /* === إخفاء الأزرار عند الطباعة === */
@media print {
  .print-hidden,
  .print-hidden * {
    display: none !important;
  }
  body * {
    visibility: hidden;
  }
  #salaryReceiptPage, #salaryReceiptPage * {
    visibility: visible;
  }

  
  #salaryReceiptPage {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
    background: white !important;
    color: black !important;
    border: 2px solid #ff3366 !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 30px !important;
  }
}

    body {
      background: linear-gradient(135deg, #0c0c0c, #1a1a1a);
      color: #000000;
      padding: 10px;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    
    .box {
      background: rgba(0, 0, 0, 0.85);
      width: 100%;
      max-width: 900px;
      padding: 20px;
      border-radius: 20px;
      border: 2px solid #00eaff;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
      margin-top: 15px;
      display: none;
    }
    .box.active {
      display: block;
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    h2 {
      color: #00eaff;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
    }
    h3 {
      margin: 15px 0 8px;
      font-size: 18px;
    }
    .form-group {
      margin: 12px 0;
      width: 100%;
    }
    .form-group label {
      display: block;
      text-align: right;
      margin-bottom: 6px;
      font-size: 16px;
      color: #fff;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      border: 2px solid #00eaff;
      background: #111;
      color: #fff;
      font-size: 16px;
      outline: none;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
    }
    .btn {
      width: 100%;
      padding: 14px;
      margin: 8px 0;
      border: none;
      border-radius: 12px;
      background: #000;
      color: #00eaff;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      border: 2px solid #00eaff;
      transition: all 0.3s;
    }
    .btn:hover {
      background: #00eaff;
      color: #000;
    }
    .btn-danger {
      background: #ff3366;
      color: white;
      border-color: #ff3366;
    }
    .btn-danger:hover {
      background: white;
      color: #ff3366;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
    .grid-item {
      background: #111;
      color: #00eaff;
      padding: 15px;
      border-radius: 12px;
      text-align: center;
      border: 2px solid #00eaff;
      cursor: pointer;
      font-size: 16px;
      transition: 0.3s;
    }
    .grid-item:hover {
      background: #000;
      box-shadow: 0 0 20px #00eaff;
    }
    .table-container {
      overflow-x: auto;
      width: 100%;
      margin: 15px 0;
      border-radius: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #000;
      color: #00eaff;
      border-radius: 10px;
      overflow: hidden;
      min-width: 600px;
    }
    th, td {
      padding: 12px;
      text-align: center;
      border-bottom: 1px solid #00eaff;
      font-size: 14px;
    }
    th {
      background: #111;
    }
    tr:nth-child(even) {
      background-color: #0a0a0a;
    }
    tr:hover {
      background: #1a1a1a !important;
    }
    #searchInput,
    #globalTeacherSearch,
    #teacherLoginPassword {
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      border-radius: 10px;
      border: 2px solid #00eaff;
      background: #111;
      color: #fff;
      font-size: 16px;
    }
    .btn-sm {
      padding: 4px 8px !important;
      font-size: 14px !important;
      width: auto !important;
      margin: 2px !important;
    }
    input[type="number"] {
      width: 100%;
      padding: 6px;
      background: #111;
      color: #fff;
      border: 1px solid #00eaff;
      border-radius: 4px;
      text-align: center;
    }
    .class-subject-item {
      background: #111;
      padding: 12px;
      border-radius: 10px;
      margin: 8px 0;
      border: 1px solid #00eaff;
      cursor: pointer;
    }
    .class-subject-item:hover {
      background: #0a0a0a;
      box-shadow: 0 0 10px #00eaff;
    }
    .class-subject-item h4 {
      margin: 0 0 6px;
      color: #00eaff;
      font-size: 16px;
    }

    /* === تنسيق الصفوف والمقررات للمعلمين === */
    .teacher-class-row {
      display: flex;
      gap: 10px;
      margin: 12px 0;
      padding: 10px;
      background: #111;
      border-radius: 10px;
      border: 1px solid #00eaff;
      align-items: flex-start;
    }
    .teacher-class-row > div {
      flex: 1;
    }
    .teacher-class-row label {
      display: block;
      font-size: 14px;
      color: #fff;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .teacher-class-row select,
    .teacher-class-row input {
      width: 100%;
      padding: 10px;
      background: #0a0a0a;
      color: #fff;
      border: 1px solid #00eaff;
      border-radius: 8px;
      font-size: 15px;
      outline: none;
    }
    .teacher-class-row .delete-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #ff3366;
      color: white;
      border: none;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 28px;
    }
    .teacher-class-row .delete-btn:hover {
      background: white;
      color: #ff3366;
      transform: scale(1.1);
    }

    /* === الحقول المخصصة === */
    .extra-field {
      display: flex;
      gap: 8px;
      margin: 12px 0;
      align-items: flex-start;
    }
    .extra-field > div {
      flex: 1;
    }
    .extra-field .delete-btn {
      margin-top: 28px;
    }

    /* === تنسيق الطباعة === */
    @media print {
      .print-hidden,
      .print-hidden * {
        display: none !important;
      }
      body {
        background: white !important;
      }
      #receiptStudentPage {
        box-shadow: none !important;
        border: none !important;
        background: white !important;
        color: black !important;
      }
      #receiptStudentPage * {
        color: black !important;
      }
    }
    /* === تحسين جداول المعلمين === */
.teacher-table {
  width: 100%;
  border-collapse: collapse;
  background: #0a0a0a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 255, 255, 0.15);
  margin: 15px 0;
}
.teacher-table th {
  background: #111;
  color: #00eaff;
  padding: 14px 12px;
  font-weight: bold;
  text-align: center;
  font-size: 15px;
  border-bottom: 2px solid #00eaff;
}
.teacher-table td {
  padding: 12px;
  text-align: center;
  color: #fff;
  border-bottom: 1px solid #333;
}
.teacher-table tr:nth-child(even) {
  background-color: #0f0f0f;
}
.teacher-table tr:hover {
  background: #1a1a1a !important;
  transform: scale(1.01);
  transition: all 0.2s ease;
}
.teacher-table .btn-sm {
  padding: 6px 10px !important;
  font-size: 13px !important;
  margin: 2px !important;
  border-radius: 6px !important;
}

/* === تحسين مودال عرض المعلم === */
#teacherModal {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  justify-content: center;
  align-items: center;
}
#teacherModal > div {
  background: rgba(10, 10, 10, 0.95);
  color: white;
  padding: 25px;
  border-radius: 16px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
  border: 2px solid #00eaff;
  position: relative;
}
#teacherModal h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #00eaff;
  font-size: 22px;
}
#modalTeacherData p {
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.6;
}
#modalTeacherData strong {
  color: #00eaff;
  font-weight: bold;
}
#modalTeacherData ul {
  padding-right: 20px;
  margin: 10px 0;
}
#modalTeacherData li {
  margin: 6px 0;
  color: #fff;
}

#teacherModal button[onclick*="close"] {
  position: absolute;
  top: 15px; right: 15px;
  background: #ff3366;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
#teacherModal button[onclick*="close"]:hover {
  background: white;
  color: #ff3366;
  transform: rotate(90deg);
}

#teacherModal .btn {
  background: #000;
  color: #00eaff;
  border: 2px solid #00eaff;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 20px;
}
#teacherModal .btn:hover {
  background: #00eaff;
  color: #000;
}

h3[style*="color:#ffcc00"] {
  color: #ffcc00 !important;
  font-weight: bold;
  font-size: 18px;
}
  </style>
</head>
<body>

<!-- تسجيل الدخول -->
<div class="box active" id="loginPage">
  <h2>تسجيل الدخول</h2>
  <div class="form-group">
    <label>اسم المستخدم</label>
    <input type="text" id="username" placeholder="أدخل اسم المستخدم" />
  </div>
  <div class="form-group">
    <label>كلمة المرور</label>
    <input type="password" id="password" placeholder="أدخل كلمة المرور" />
  </div>
  <div style="margin-top: 20px;">
    <button class="btn" type="button" onclick="login()">دخول</button>
  </div>
</div>

<!-- القائمة -->
<div class="box" id="menuPage">
  <h2>القائمة الرئيسية</h2>
  <div class="grid">
    <div class="grid-item" onclick="openStudentsPage()">🧑‍🎓 الطلاب</div>
    <div class="grid-item" onclick="openTeachersPage()">👩‍🏫 المعلمين</div>
    <div class="grid-item">⚙️ الإعدادات</div>
  </div>
</div>

<!-- صفحة الطلاب -->
<div class="box" id="studentsPage">
  <h2>إدارة الطلاب</h2>
  <div class="grid">
    <div class="grid-item" onclick="showAddStudent()">➕ إضافة طالب</div>
    <div class="grid-item" onclick="showViewStudents()">📋 عرض الطلاب</div>
    <div class="grid-item" onclick="showFeesPage()">💰 الرسوم</div>
    <div class="grid-item" onclick="showNoteClassSelection()">📨 ملاحظات الطالب</div>
    <div class="grid-item" onclick="showGradesPage()">📊 الدرجات</div>
    <div class="grid-item" onclick="showDeletedStudents()">🗑️ الطلاب المحذوفون</div>
  </div>
  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>
<div class="form-group" id="amountField" style="display:none;"></div>
<!-- إضافة طالب -->
<div class="box" id="addStudentPage">
  <h2>إضافة طالب جديد</h2>
  <div class="form-group">
    <label>اختر الصف</label>
    <select id="stuClassForNew">
      <option value="الصف الأول ابتدائي">الصف الأول ابتدائي</option>
      <option value="الصف الثاني ابتدائي">الصف الثاني ابتدائي</option>
      <option value="الصف الثالث ابتدائي">الصف الثالث ابتدائي</option>
      <option value="الصف الأول متوسط">الصف الأول متوسط</option>
      <option value="الصف الثاني متوسط">الصف الثاني متوسط</option>
      <option value="الصف الثالث متوسط">الصف الثالث متوسط</option>
      <option value="الصف الأول ثانوي">الصف الأول ثانوي</option>
      <option value="الصف الثاني ثانوي">الصف الثاني ثانوي</option>
      <option value="الصف الثالث ثانوي">الصف الثالث ثانوي</option>
    </select>
  </div>
  <div class="form-group">
    <label>الاسم الكامل للطالب</label>
    <input type="text" id="stuFullName" placeholder="أدخل الاسم الكامل" />
  </div>
  <div class="form-group">
    <label>رقم هاتف ولي الأمر</label>
    <input type="text" id="stuGuardianPhone" placeholder="أدخل رقم الهاتف" />
  </div>
  <div class="form-group">
    <label>الجنس</label>
    <select id="stuGender">
      <option value="ذكر">ذكر</option>
      <option value="أنثى">أنثى</option>
    </select>
  </div>
  <div class="form-group">
    <label>رقم شهادة الميلاد</label>
    <input type="text" id="stuBirthCert" placeholder="أدخل الرقم" />
  </div>
  <div class="form-group">
    <label>ملاحظات</label>
    <textarea id="stuNotes" rows="2" placeholder="أي ملاحظات إضافية"></textarea>
  </div>

  <h3 style="text-align:right; margin:20px 0 10px; color:#00eaff;">حقول إضافية</h3>
  <div id="extraFieldsContainer"></div>
  <button class="btn" onclick="addExtraField()">➕ إضافة حقل نصي</button>
  <button class="btn" onclick="addPhotoField()">📸 إضافة حقل صورة</button>
  <div style="margin-top: 20px;">
    <button class="btn" type="button" onclick="saveStudent()">💾 حفظ الطالب</button>
    <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
  </div>
</div>

<!-- صفحات الملاحظات (تم اختصارها للإيجاز، لكنها تعمل) -->
<div class="box" id="noteClassSelectPage" style="background: #fff9f9 !important; color: #000 !important; border: 2px solid #c00; max-width: 800px;">
  <h2 style="color: #c00; text-align: center; margin-bottom: 25px; font-size: 24px; font-weight: bold;">📌 اختر الصف لإرسال ملاحظة</h2>
  <div class="grid" id="noteClassGrid" style="grid-template-columns: repeat(2, 1fr); gap: 15px;"></div>
  <button class="btn" type="button" onclick="goBack()" style="background: #e0e0e0; color: #333; margin-top: 20px; font-weight: bold;">🔙 رجوع</button>
</div>

<div class="box" id="noteStudentSelectPage" style="background: #fff9f9 !important; color: #000 !important; border: 2px solid #c00; max-width: 800px;">
  <h2 style="color: #c00; text-align: center; margin-bottom: 25px; font-size: 24px; font-weight: bold;">👤 اختر الطالب من <span id="noteSelectedClass"></span></h2>
  <input type="text" id="noteStudentSearchInClass" placeholder="ابحث باسم الطالب..." style="width: 100%; padding: 12px; margin-bottom: 20px; border: 2px solid #c00; border-radius: 10px; background: #fff; color: #000; font-size: 16px;" />
  <div class="table-container">
    <table id="noteStudentsTable">
      <thead><tr><th style="background: #ffecec; color: #c00;">اسم الطالب</th><th style="background: #ffecec; color: #c00;">الإجراءات</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <button class="btn" type="button" onclick="goBack()" style="background: #e0e0e0; color: #333; margin-top: 20px; font-weight: bold;">🔙 رجوع</button>
</div>

<div class="box" id="noteFormPage" style="background: #fff9f9 !important; color: #000 !important; border: 2px solid #c00; max-width: 800px; padding: 25px !important; position: relative;">
  <button onclick="submitTemporaryNote()" style="position: absolute; top: 15px; left: 15px; background: #8b0000; color: white; width: 40px; height: 40px; border-radius: 8px; border: none; font-size: 14px; font-weight: bold;">إرسال</button>
  <button onclick="goBack()" style="position: absolute; top: 15px; right: 15px; background: #666; color: white; width: 40px; height: 40px; border-radius: 8px; border: none; font-size: 14px; font-weight: bold;">رجوع</button>
  <h2 style="color: #c00; text-align: center; margin: 20px 0 5px; font-size: 22px; font-weight: bold;">📤 إرسال ملاحظة رسمية</h2>
  <h3 id="noteFormStudentName" style="text-align: center; color: #c00; margin-bottom: 25px; font-size: 18px;"></h3>
  <div id="noteFieldsContainer"></div>
  <button id="addFieldBtn" class="btn" type="button" onclick="addDynamicField()" style="background: #c00; color: white; border: none; width: 100%; padding: 10px; margin-top: 15px; font-weight: bold; font-size: 16px;">➕ إضافة بند جديد</button>
</div>

<!-- عرض الطلاب -->
<div class="box" id="viewStudentsPage">
  <h2>اختر الصف لعرض الطلاب</h2>
  <div class="grid" id="classGrid"></div>
  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>

<!-- Modal الطالب -->
<div id="studentModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:1000; justify-content:center; align-items:center;">
  <div style="background:#1a1a1a; color:white; padding:20px; border-radius:12px; max-width:90%; max-height:90%; overflow-y:auto; box-shadow:0 0 20px rgba(0,255,255,0.5); position:relative;">
    <button onclick="closeStudentModal()" style="position:absolute; top:10px; right:15px; background:#ff4444; color:white; border:none; border-radius:50%; width:30px; height:30px; font-weight:bold;">×</button>
    <h3 style="text-align:center; margin-bottom:15px;">بيانات الطالب</h3>
    <div style="text-align:center; margin-bottom:20px;"><img id="modalStudentPhoto" src="" alt="صورة الطالب" style="max-width:300px; max-height:300px; border-radius:10px; border:2px solid #00eaff;" /></div>
    <table style="width:100%; border-collapse:collapse; direction:rtl;"><tbody id="modalStudentData"></tbody></table>
    <div style="text-align:center; margin-top:20px;"><button class="btn" onclick="closeStudentModal()" style="background:#555; padding:8px 20px; color:white; border:none; border-radius:5px;">رجوع</button></div>
  </div>
</div>

<!-- Modal الصورة -->
<div id="imageModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:2000; justify-content:center; align-items:center;">
  <div style="text-align:center; color:white;">
    <h3 id="modalImageLabel" style="margin-bottom:15px;"></h3>
    <img id="modalImageView" src="" alt="صورة" style="max-width:90%; max-height:80%; border:2px solid #00eaff; border-radius:8px;">
    <br><br>
    <button class="btn" onclick="closeImageModal()" style="background:#555; padding:8px 20px; color:white; border:none; border-radius:5px;">رجوع</button>
  </div>
</div>

<!-- === صفحة عرض المعلمين (المهمة!) === -->
<div class="box" id="teachersByClassPage">
  <h2>المعلمون حسب الصفوف</h2>
  <input type="text" id="globalTeacherSearch" placeholder="ابحث باسم المعلم..." style="width:100%; padding:12px; margin:15px 0; border-radius:10px; border:2px solid #00eaff; background:#111; color:#fff; font-size:16px;" />
  <div id="teachersTablesContainer">
    <!-- سيتم ملؤه ديناميكيًا -->
  </div>
  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>

<!-- قائمة الطلاب في صف -->
<div class="box" id="studentsListPage">
  <h2>الطلاب في <span id="currentClass"></span></h2>
  <input type="text" id="searchInput" placeholder="ابحث باسم الطالب..." />
  <div class="table-container">
    <table id="studentsTable">
      <thead><tr></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>

<!-- صفحة الطلاب المحذوفين -->
<div class="box" id="deletedStudentsPage">
  <h2>الطلاب المحذوفون</h2>
  <div class="table-container">
    <table id="deletedStudentsTable">
      <thead><tr></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>

<!-- صفحات الرسوم (مختصرة) -->
<div class="box" id="feesUnifiedPage">
  <h2>الرسوم — <span id="feesUnifiedClassName"></span></h2>
  <button class="btn" type="button" onclick="toggleAddMonthForm()" style="width:auto; margin:10px 0;">➕ إضافة شهر جديد</button>
  <div id="addMonthForm" style="display:none; background:#111; padding:15px; border-radius:12px; margin:15px 0;">
    <h3 style="text-align:right; margin:0 0 10px; color:#00eaff;">إضافة شهر جديد</h3>
    <div class="form-group"><label>اسم الشهر</label><input type="text" id="unifiedFeeMonth" placeholder="مثلاً: ربيع أول" /></div>
    <div class="form-group"><label>السنة</label><input type="text" id="unifiedFeeYear" placeholder="مثلاً: 1447" /></div>
    <div class="form-group"><label>المبلغ المستحق (ريال)</label><input type="number" id="unifiedFeeAmount" placeholder="أدخل المبلغ" /></div>
    <div class="form-group"><label>ملاحظة عامة</label><textarea id="unifiedFeeNote" rows="1" placeholder="ملاحظة عن هذا الشهر (اختياري)"></textarea></div>
    <div style="margin-top:15px;">
      <button class="btn" type="button" onclick="saveUnifiedFeeMonth()" style="width:auto; margin:0 10px 0 0;">💾 حفظ الشهر</button>
      <button class="btn" type="button" onclick="toggleAddMonthForm()" style="width:auto; background:#ff3366; border-color:#ff3366; color:white;">إلغاء</button>
    </div>
  </div>
  <div style="margin:15px 0;"><button class="btn" type="button" style="background:#333;" onclick="addFeesCustomField()">➕ إضافة حقل مخصص</button></div>
  <h3 style="text-align:right; margin:20px 0 10px; color:#00eaff;">الشهور المضافة:</h3>
  <div id="unifiedMonthsList" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px;"></div>
  <div id="unifiedStudentsTableContainer" style="display:none;">
    <h3 id="unifiedMonthTitle" style="text-align:center; margin:20px 0; color:#00eaff;"></h3>
    <div class="table-container">
      <table id="unifiedStudentsTable">
        <thead><tr></tr></thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>

<div class="box" id="feesClassSelectPage">
  <h2>اختر الصف لتسجيل الرسوم</h2>
  <div class="grid" id="feesClassGridUnique"></div>
  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>

<div class="box" id="receiptStudentPage" style="max-width:700px; text-align:center; padding:30px; background:white !important; color:black !important; border:none !important; box-shadow:none !important;">
  <h2 style="font-family:'Amiri',serif; font-weight:bold; margin-bottom:20px; color:black !important;">سند استلام رسوم دراسية</h2>
  <p style="font-size:18px; margin:8px 0;"><strong>المدرسة:</strong> مدرسة الفاخر النموذجية</p>
  <p style="font-size:18px; margin:8px 0;"><strong>اسم الطالب:</strong> <span id="receipt-student-name"></span></p>
  <p style="font-size:18px; margin:8px 0;"><strong>الصف:</strong> <span id="receipt-student-class"></span></p>
  <div id="receipt-fees-details" style="margin:25px 0; text-align:right; line-height:1.8; font-size:16px; color:black !important;"></div>
  <div style="margin-top:50px; display:flex; justify-content:space-between; width:100%;">
    <div style="text-align:left;"><p>توقيع ولي الأمر: _______________</p></div>
    <div style="text-align:right;"><p>ختم المدرسة / التاريخ: _______________</p></div>
  </div>
  <div class="print-hidden" style="margin-top:25px;">
    <button class="btn" type="button" onclick="printAndReturn()">🖨️ طباعة السند</button>
    <button class="btn" type="button" onclick="closeReceiptStudent()">🔙 رجوع</button>
  </div>
</div>

<!-- صفحة المعلمين -->
<div class="box" id="teachersPage">
  <h2>إدارة المعلمين</h2>
  <div class="grid">
    <div class="grid-item" onclick="showAddTeacher()">➕ إضافة معلم</div>
<div class="grid-item" onclick="window.showTeachersByClass && showTeachersByClass()">📋 عرض المعلمين</div>
<div class="grid-item" onclick="showSalariesPage()">💰 الرواتب</div>
    <div class="grid-item" onclick="showAttendancePage()">📅 الحضور</div>
    <div class="grid-item" onclick="showDeletedTeachers()">🗑️ المعلمون المحذوفون</div>
  </div>
  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>

<!-- إضافة معلم -->
<div class="box" id="addTeacherPage">
  <h2>إضافة معلم جديد</h2>
  <div class="form-group"><label>اسم المستخدم (يُستخدم للدخول)</label><input type="text" id="teacherUsername" placeholder="مثل: ahmed_math" /></div>
  <div class="form-group"><label>كلمة السر</label><input type="password" id="teacherPassword" placeholder="أدخل كلمة سر فريدة" /></div>
  <div class="form-group"><label>الاسم الكامل</label><input type="text" id="teacherFullName" placeholder="أدخل الاسم الكامل" /></div>
  <div class="form-group"><label>رقم الهاتف</label><input type="text" id="teacherPhone" placeholder="أدخل رقم الهاتف" /></div>

  <h3 style="text-align:right; margin:20px 0 10px; color:#00eaff;">الصفوف والمقررات</h3>
  <div id="teacherClassesContainer"></div>
  <button class="btn" type="button" style="background:#333; margin:10px 0;" onclick="addTeacherClassSubjectRow()">➕ إضافة صف/مقرر</button>

  <div class="form-group">
    <label>نظام الراتب</label>
    <select id="teacherSalaryType">
      <option value="">اختر النظام</option>
      <option value="monthly">شهري</option>
      <option value="weekly">أسبوعي</option>
      <option value="daily">يومي</option>
      <option value="probation">تحت التجربة</option>
    </select>
  </div>
  <div class="form-group">
  <label>المبلغ المتفق عليه (ريال)</label>
  <input type="number" id="teacherAgreedAmount" placeholder="أدخل المبلغ المتفق عليه" min="0" />
</div>
  <div class="form-group"><label>ملاحظات</label><textarea id="teacherNotes" rows="2" placeholder="أي ملاحظات إضافية"></textarea></div>
  
  <div id="customTeacherFields"></div>
  <button class="btn" type="button" style="background:#333; margin:10px 0;" onclick="addTeacherField()">➕ إضافة حقل مخصص</button>
  
  <div style="margin-top:20px;">
    <button class="btn" type="button" onclick="saveTeacherAdvanced()">💾 حفظ المعلم</button>
    <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
  </div>
</div>

<!-- Modal عرض بيانات المعلم -->
<div id="teacherModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:1000; justify-content:center; align-items:center;">
  <div style="background:#1a1a1a; color:white; padding:20px; border-radius:12px; max-width:90%; max-height:90%; overflow-y:auto; box-shadow:0 0 20px rgba(0,255,255,0.5); position:relative;">
    <button onclick="closeTeacherModal()" style="position:absolute; top:10px; right:15px; background:#ff4444; color:white; border:none; border-radius:50%; width:30px; height:30px; font-weight:bold;">×</button>
    <h3 style="text-align:center; margin-bottom:15px;">بيانات المعلم</h3>
    <div id="modalTeacherData" style="line-height:1.8;"></div>
    <div style="text-align:center; margin-top:20px;">
      <button class="btn" onclick="closeTeacherModal()" style="background:#555; padding:8px 20px; color:white; border:none; border-radius:5px;">رجوع</button>
    </div>
  </div>
</div>



<!-- === سند راتب رسمي - مثالي للطباعة === -->
<div class="box" id="salaryReceiptPage" 
     style="max-width: 800px; 
            margin: 20px auto; 
            padding: 30px; 
            background: white !important; 
            color: #333 !important; 
            border: 2px solid #ff3366; 
            box-shadow: 0 0 25px rgba(255, 51, 102, 0.3); 
            display: none; 
            font-family: 'Amiri', serif; 
            text-align: right; 
            direction: rtl;">

  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #ff3366; font-weight: bold; margin: 0; font-size: 24px;">سند صرف راتب رسمي</h2>
    <p style="margin: 8px 0; font-size: 16px; color: #ff0000;">مدرسة الفاخر النموذجية</p>
  </div>

  <table style="width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
                font-size: 17px; 
                border: 2px solid #ff3366;
                font-weight: normal;">
    <tr>
      <td style="padding: 12px; border: 1px solid #ff3366; width: 35%; background: #fff9f9; font-weight: bold; text-align: center;">اسم المعلم:</td>
      <td style="padding: 12px; border: 1px solid #ff3366; text-align: center;" id="receipt-teacher-name"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ff3366; background: #fff9f9; font-weight: bold; text-align: center;">الشهر والسنة:</td>
      <td style="padding: 12px; border: 1px solid #ff3366; text-align: center;" id="receipt-month"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ff3366; background: #fff9f9; font-weight: bold; text-align: center;">المبلغ المتفق عليه:</td>
      <td style="padding: 12px; border: 1px solid #ff3366; text-align: center;" id="receipt-agreed"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ff3366; background: #fff9f9; font-weight: bold; text-align: center;">المبلغ المدفوع:</td>
      <td style="padding: 12px; border: 1px solid #ff3366; text-align: center;" id="receipt-paid"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ff3366; background: #fff9f9; font-weight: bold; text-align: center;">الرصيد السابق:</td>
      <td style="padding: 12px; border: 1px solid #ff3366; text-align: center;" id="receipt-balance"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ff3366; background: #fff9f9; font-weight: bold; text-align: center;">تاريخ الدفع:</td>
      <td style="padding: 12px; border: 1px solid #ff3366; text-align: center;" id="receipt-date"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ff3366; background: #fff9f9; font-weight: bold; text-align: center;">حالة الدفع:</td>
      <td style="padding: 12px; border: 1px solid #ff3366; text-align: center; color: #000000;" id="receipt-status"></td>
    </tr>
  </table>

  <div style="display: flex; justify-content: space-between; margin-top: 40px; font-size: 16px;">
    <div style="text-align: left; width: 45%;">
      <p style="margin: 0; font-weight: bold; color: #ff3366;">ختم المدرسة</p>
      <p style="margin: 0;">التاريخ: _______________</p>
    </div>
    <div style="text-align: right; width: 45%;">
      <p style="margin: 0; font-weight: bold; color: #ff3366;">توقيع المعلم</p>
      <p style="margin: 0;">الاسم: _______________</p>
    </div>
  </div>

  <!-- هذا الزر لا يظهر عند الطباعة -->
  <div class="print-hidden" style="margin-top: 30px; text-align: center;">
    <button class="btn" type="button" onclick="window.print()" 
            style="background:#ff3366; color:white; border:none; padding:10px 25px; font-size:16px; border-radius:8px; margin:0 10px;">
      🖨️ طباعة السند
    </button>
    <button class="btn" type="button" onclick="closeSalaryReceipt()" 
            style="background:#555; color:white; border:none; padding:10px 25px; font-size:16px; border-radius:8px; margin:0 10px;">
      🔙 رجوع
    </button>
  </div>
</div>


<!-- === صفحة الرواتب === -->
<div class="box" id="salariesPage">
  <h2>إدارة رواتب المعلمين</h2>
  
  <button class="btn" type="button" onclick="toggleAddSalariesMonthForm()" style="width:auto; margin:10px 0;">
    ➕ إضافة شهر جديد
  </button>

  <!-- نموذج إضافة شهر -->
  <div id="addSalariesMonthForm" style="display:none; background:#111; padding:15px; border-radius:12px; margin:15px 0;">
    <h3 style="text-align:right; margin:0 0 10px; color:#00eaff;">إضافة شهر رواتب جديد</h3>
    <div class="form-group">
      <label>اسم الشهر</label>
      <input type="text" id="salariesMonthName" placeholder="مثل: ربيع أول" />
    </div>
    <div class="form-group">
      <label>السنة</label>
      <input type="text" id="salariesYear" placeholder="مثل: 1447" />
    </div>
    <div style="margin-top: 15px;">
      <button class="btn" type="button" onclick="saveSalariesMonth()" style="width:auto; margin:0 10px 0 0;">💾 حفظ الشهر</button>
      <button class="btn" type="button" onclick="toggleAddSalariesMonthForm()" style="width:auto; background:#ff3366; border-color:#ff3366; color:white;">إلغاء</button>
    </div>
  </div>

  <!-- قائمة الشهور -->
  <h3 style="text-align:right; margin:20px 0 10px; color:#00eaff;">الشهور المضافة:</h3>
  <div id="salariesMonthsList" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px;"></div>

  <!-- جدول تفاصيل الشهر -->
  <div id="salariesMonthTableContainer" style="display:none;">
    <h3 id="salariesMonthTitle" style="text-align:center; margin:20px 0; color:#00eaff;"></h3>
    <div class="table-container">
      <table id="salariesMonthTable">
        <thead><tr></tr></thead>
        <tbody></tbody>
      </table>
    </div>
  </div>

  <button class="btn" type="button" onclick="goBack()">🔙 رجوع</button>
</div>


<!-- ربط الملفات -->
<script src="utils.js"></script>
<script src="students.js"></script>
<script src="teachers.js"></script>

</body>
</html>
