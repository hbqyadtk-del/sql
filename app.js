const classes = [
  'الصف الأول ابتدائي', 'الصف الثاني ابتدائي', 'الصف الثالث ابتدائي',
  'الصف الأول متوسط', 'الصف الثاني متوسط', 'الصف الثالث متوسط',
  'الصف الأول ثانوي', 'الصف الثاني ثانوي', 'الصف الثالث ثانوي'
];
let students = loadFromStorage('students') || {};
let savedExtraFieldNames = new Set(loadFromStorage('extraFields') || []);
let teachers = loadFromStorage('teachers') || {};
let teacherCustomFields = loadFromStorage('teacherCustomFields') || [];
let feesData = loadFromStorage('feesData') || {};
let feesCustomFields = loadFromStorage('feesCustomFields') || [];
let deletedStudents = loadFromStorage('deletedStudents') || [];
let deletedTeachers = loadFromStorage('deletedTeachers') || {};
let attendanceData = loadFromStorage('attendanceData') || {};

// === المتغيرات الجديدة ===
let teachersAdvanced = loadFromStorage('teachersAdvanced') || [];
let teacherDisplayMap = []; // لتتبع نوع كل سجل في العرض
let currentWeekKey = '';
classes.forEach(cls => {
  if (!students[cls]) students[cls] = [];
  if (!teachers[cls]) teachers[cls] = [];
});
let pageHistory = [];
let currentEditTeacher = null;
let currentUnifiedClass = '';
let currentUnifiedMonth = '';
function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.warn("فشل الحفظ:", e); }
}
function loadFromStorage(key) {
  try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : null; } catch (e) { console.warn("فشل التحميل:", e); return null; }
}
function showPage(pageId) {
  document.querySelectorAll('.box').forEach(box => box.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}
function goBack() {
  if (pageHistory.length > 0) showPage(pageHistory.pop());
  else if (document.getElementById('receiptPage').style.display === 'block') {
    document.getElementById('receiptPage').style.display = 'none';
    showPage('salariesPage');
  }
}
function navigateTo(from, to) {
  pageHistory.push(from);
  showPage(to);
}
function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  if (!u || !p) {
    alert("يرجى إدخال اسم المستخدم وكلمة المرور!");
    return;
  }

  // دخول المدير
  if (p === "590") {
    navigateTo("loginPage", "menuPage");
    return;
  }

  // دخول المعلم المتقدم
  const advancedTeacher = teachersAdvanced.find(t => t.username === u && t.password === p);
  if (advancedTeacher) {
    window.currentTeacher = advancedTeacher;
    document.getElementById('teacherDashboardName').textContent = advancedTeacher.fullName;
    renderTeacherDashboard();
    showPage('teacherDashboard');
    return;
  }

  alert("❌ البيانات غير صحيحة!");
}

// === دعم المعلمين المتقدمين ===
function addTeacherClassSubjectRow() {
  const container = document.getElementById('teacherClassesContainer');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'form-group';
  div.innerHTML = `
    <div style="display:flex; gap:10px; margin-bottom:8px;">
      <select style="flex:2;">
        ${classes.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <input type="text" placeholder="اسم المادة (مثل: القرآن، الرياضيات)" style="flex:2;" />
      <button type="button" class="btn btn-sm btn-danger" style="width:auto;" onclick="this.closest('div').remove()">×</button>
    </div>
  `;
  container.appendChild(div);
}

function saveTeacherAdvanced() {
  const username = document.getElementById('teacherUsername')?.value.trim();
  const password = document.getElementById('teacherPassword')?.value.trim();
  const fullName = document.getElementById('teacherFullName')?.value.trim();
  const phone = document.getElementById('teacherPhone')?.value.trim();
  const salaryType = document.getElementById('teacherSalaryType')?.value;
  const agreedAmount = salaryType === 'probation' ? 0 : parseFloat(document.getElementById('teacherAgreedAmount')?.value) || 0;
  const notes = document.getElementById('teacherNotes')?.value.trim();

  if (!username || !password || !fullName) {
    alert("اسم المستخدم، كلمة السر، والاسم الكامل مطلوبة!");
    return;
  }

  // التحقق من التكرار عند الإضافة الجديدة فقط
  if (!currentEditTeacher || currentEditTeacher.type !== 'advanced') {
    if (teachersAdvanced.some(t => t.username === username)) {
      alert("اسم المستخدم موجود مسبقًا!");
      return;
    }
  }

  const classSubjectPairs = [];
  document.querySelectorAll('#teacherClassesContainer > .form-group').forEach(row => {
    const cls = row.querySelector('select')?.value;
    const subject = row.querySelector('input[type="text"]')?.value.trim();
    if (cls && subject) classSubjectPairs.push({ class: cls, subject });
  });

  if (classSubjectPairs.length === 0) {
    alert("أضف صف ومقرر واحد على الأقل!");
    return;
  }

  const customFields = {};
  document.querySelectorAll('#customTeacherFields .form-group input[type="text"]').forEach(input => {
    const label = input.closest('.form-group').querySelector('label');
    if (label) {
      customFields[label.innerText] = input.value.trim();
    }
  });

  const newTeacher = {
    username, password, fullName, phone, salaryType, agreedAmount, notes,
    classesSubjects: classSubjectPairs,
    customFields
  };

  if (currentEditTeacher && currentEditTeacher.type === 'advanced') {
    teachersAdvanced[currentEditTeacher.index] = newTeacher;
  } else {
    teachersAdvanced.push(newTeacher);
  }

  saveToStorage('teachersAdvanced', teachersAdvanced);
  alert(currentEditTeacher ? "✅ تم التعديل!" : "✅ تم الحفظ!");
  goBack();
  currentEditTeacher = null;
}

function renderTeacherDashboard() {
  const container = document.getElementById('teacherClassesSubjects');
  if (!container) return;
  container.innerHTML = '';

  const grouped = {};
  window.currentTeacher.classesSubjects.forEach(item => {
    if (!grouped[item.class]) grouped[item.class] = [];
    grouped[item.class].push(item.subject);
  });

  Object.entries(grouped).forEach(([cls, subjects]) => {
    const div = document.createElement('div');
    div.className = 'class-subject-item';
    div.innerHTML = `<h4>${cls}</h4><p>المواد: ${subjects.join(', ')}</p>`;
    div.onclick = () => {
      window.currentEvalClass = cls;
      window.currentEvalSubject = subjects[0];
      document.getElementById('evalClass').textContent = cls;
      document.getElementById('evalSubject').textContent = subjects[0];
      showPage('dailyEvaluationPage');
    };
    container.appendChild(div);
  });
}

// === دالة عرض المعلمين المعدّلة (القلب الجديد) ===
function renderTeachersByClass() {
  const container = document.getElementById('teachersTablesContainer');
  container.innerHTML = '';
  const colors = {
    'الصف الأول ابتدائي': '#ff5555',
    'الصف الثاني ابتدائي': '#ff8800',
    'الصف الثالث ابتدائي': '#ffcc00',
    'الصف الأول متوسط': '#55ff55',
    'الصف الثاني متوسط': '#00cc77',
    'الصف الثالث متوسط': '#0088ff',
    'الصف الأول ثانوي': '#aa55ff',
    'الصف الثاني ثانوي': '#cc55cc',
    'الصف الثالث ثانوي': '#8844aa'
  };
  let hasTeachers = false;

  // تهيئة خريطة العرض
  teacherDisplayMap = [];

  classes.forEach(cls => {
    const oldList = teachers[cls] || [];
    const advancedList = [];

    // جمع المعلمين المتقدمين لهذا الصف
    teachersAdvanced.forEach((t, idx) => {
      const subjectsInThisClass = t.classesSubjects
        .filter(item => item.class === cls)
        .map(item => item.subject);
      if (subjectsInThisClass.length > 0) {
        advancedList.push({
          originalIndex: idx,
          data: {
            "اسم المعلم": t.fullName,
            "رقم الهاتف": t.phone || '',
            "ملاحظات": t.notes || '',
            "الراتب_المتفق_عليه": t.agreedAmount || 0,
            "نوع_الراتb": t.salaryType || '',
            "المواد": subjectsInThisClass.join('، ')
          },
          customFields: t.customFields || {}
        });
      }
    });

    const fullList = [...oldList, ...advancedList.map(item => item.data)];
    if (fullList.length === 0) return;
    hasTeachers = true;

    // حفظ الخريطة: لكل صف، ما هو نوع كل سجل (قديم أم متقدم) وفهرسه
    teacherDisplayMap[cls] = [];
    oldList.forEach((_, i) => {
      teacherDisplayMap[cls].push({ type: 'old', index: i });
    });
    advancedList.forEach((item, i) => {
      teacherDisplayMap[cls].push({ type: 'advanced', index: item.originalIndex });
    });

    const header = document.createElement('h3');
    header.style.backgroundColor = colors[cls];
    header.style.padding = '10px';
    header.style.borderRadius = '8px';
    header.style.margin = '20px 0 10px';
    header.style.textAlign = 'center';
    header.style.color = '#000';
    header.style.fontWeight = 'bold';
    header.innerText = cls;
    container.appendChild(header);

    // جمع الأعمدة
    const allKeys = new Set();
    fullList.forEach(t => {
      Object.keys(t).forEach(k => {
        if (k !== 'الصف' && k !== 'نوع_الراتb') allKeys.add(k);
      });
    });
    let keys = Array.from(allKeys);
    if (keys.includes('المواد')) {
      const idx = keys.indexOf('المواد');
      if (idx !== -1) keys.splice(idx, 1);
      keys.push('المواد');
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '25px';
    table.style.backgroundColor = '#0a0a0a';
    table.style.borderRadius = '8px';
    table.style.overflow = 'hidden';
    table.style.color = '#fff';

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    keys.forEach(k => {
      const th = document.createElement('th');
      th.textContent = k;
      headerRow.appendChild(th);
    });
    const actionsTh = document.createElement('th');
    actionsTh.textContent = 'الإجراءات';
    headerRow.appendChild(actionsTh);

    const tbody = table.createTBody();
    fullList.forEach((teacher, displayIndex) => {
      const row = tbody.insertRow();
      keys.forEach(k => {
        const cell = row.insertCell();
        cell.textContent = teacher[k] || '';
      });
      const actionsCell = row.insertCell();
      const mapInfo = teacherDisplayMap[cls][displayIndex];
      if (mapInfo.type === 'old') {
        actionsCell.innerHTML = `
          <button class="btn btn-sm" onclick="editTeacher('${cls}', ${mapInfo.index})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTeacherPermanent('${cls}', ${mapInfo.index})">🗑️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTeacher('${cls}', ${mapInfo.index})">❌</button>
        `;
      } else {
        // معلم متقدم
        actionsCell.innerHTML = `
          <button class="btn btn-sm" onclick="editAdvancedTeacher(${mapInfo.index})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteAdvancedTeacher(${mapInfo.index}, true)">🗑️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteAdvancedTeacher(${mapInfo.index}, false)">❌</button>
        `;
      }
    });
    container.appendChild(table);
  });

  if (!hasTeachers) {
    container.innerHTML = '<p style="text-align:center; color:#ffcc00; font-size:18px;">لا يوجد معلمون مسجلون بعد.</p>';
  }

  const searchInput = document.getElementById('globalTeacherSearch');
  if (searchInput) {
    searchInput.value = '';
    searchInput.oninput = () => {
      const term = searchInput.value.toLowerCase().trim();
      const tables = container.querySelectorAll('table');
      tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        let hasVisibleRow = false;
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          if (term === '' || text.includes(term)) {
            row.style.display = '';
            hasVisibleRow = true;
          } else {
            row.style.display = 'none';
          }
        });
        const header = table.previousElementSibling;
        if (header && header.tagName === 'H3') {
          header.style.display = hasVisibleRow ? '' : 'none';
          table.style.display = hasVisibleRow ? 'table' : 'none';
        }
      });
    };
  }
}

// === دوال المعلم المتقدم ===
function editAdvancedTeacher(advancedIndex) {
  const t = teachersAdvanced[advancedIndex];
  if (!t) return;

  navigateTo("teachersByClassPage", "addTeacherPage");
  document.getElementById('teacherUsername').value = t.username || '';
  document.getElementById('teacherPassword').value = t.password || '';
  document.getElementById('teacherFullName').value = t.fullName || '';
  document.getElementById('teacherPhone').value = t.phone || '';
  document.getElementById('teacherSalaryType').value = t.salaryType || '';
  document.getElementById('teacherNotes').value = t.notes || '';
  document.getElementById('teacherAgreedAmount').value = t.agreedAmount || '';

  // عرض الصفوف والمواد
  const container = document.getElementById('teacherClassesContainer');
  container.innerHTML = '';
  t.classesSubjects.forEach(item => {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <div style="display:flex; gap:10px; margin-bottom:8px;">
        <select style="flex:2;">
          ${classes.map(c => `<option value="${c}" ${c === item.class ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <input type="text" value="${item.subject}" placeholder="اسم المادة" style="flex:2;" />
        <button type="button" class="btn btn-sm btn-danger" style="width:auto;" onclick="this.closest('div').remove()">×</button>
      </div>
    `;
    container.appendChild(div);
  });

  // عرض الحقول المخصصة
  const customFieldsContainer = document.getElementById('customTeacherFields');
  customFieldsContainer.innerHTML = '';
  if (t.customFields) {
    Object.entries(t.customFields).forEach(([name, value]) => {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label>${name}</label>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="text" value="${value}" placeholder="أدخل ${name}" style="flex:1;" />
          <button type="button" class="btn btn-sm btn-danger" onclick="removeTeacherField('${name}')">×</button>
        </div>
      `;
      customFieldsContainer.appendChild(div);
    });
  }

  // حفظ المؤشر للتعديل
  currentEditTeacher = { type: 'advanced', index: advancedIndex };
}

function deleteAdvancedTeacher(advancedIndex, isPermanent = false) {
  const t = teachersAdvanced[advancedIndex];
  if (!t) return;

  if (isPermanent) {
    if (!confirm("⚠️ سيتم الحذف النهائي لهذا المعلم ولا يمكن استرجاعه!")) return;
    teachersAdvanced.splice(advancedIndex, 1);
    saveToStorage('teachersAdvanced', teachersAdvanced);
    alert("✅ تم الحذف النهائي!");
  } else {
    if (!confirm("هل أنت متأكد من حذف هذا المعلم؟")) return;
    // لا يوجد نظام "محذوفون" للمتقدمين حاليًا، لذا نحذفه مباشرةً
    teachersAdvanced.splice(advancedIndex, 1);
    saveToStorage('teachersAdvanced', teachersAdvanced);
    alert("✅ تم الحذف!");
  }
  renderTeachersByClass();
}

// === باقي الدوال كما هي (من ملفك الأصلي) ===
function appendStudentField(name) {
  const container = document.getElementById('extraFieldsContainer');
  const div = document.createElement('div');
  div.className = 'form-group';
  div.innerHTML = `
    <label>${name}</label>
    <div style="display:flex; gap:8px; align-items:center;">
      <input type="text" data-field-name="${name}" placeholder="أدخل ${name}" class="extraFieldValue" style="flex:1;" />
      <button type="button" class="btn btn-sm btn-danger" onclick="removeStudentField('${name}')">×</button>
    </div>
  `;
  container.appendChild(div);
}
function addExtraField() {
  const name = prompt("أدخل اسم الحقل الجديد:");
  if (!name || name.trim() === "") return;
  const n = name.trim();
  if (savedExtraFieldNames.has(n)) { alert("الحقل موجود!"); return; }
  savedExtraFieldNames.add(n);
  saveToStorage('extraFields', Array.from(savedExtraFieldNames));
  appendStudentField(n);
}
function removeStudentField(fieldName) {
  if (!confirm(`هل أنت متأكد من حذف الحقل "${fieldName}" نهائيًا؟ سيتم إزالته من جميع الطلاب!`)) return;
  savedExtraFieldNames.delete(fieldName);
  saveToStorage('extraFields', Array.from(savedExtraFieldNames));
  const container = document.getElementById('extraFieldsContainer');
  const fieldDiv = container.querySelector(`[data-field-name="${fieldName}"]`)?.closest('.form-group');
  if (fieldDiv) fieldDiv.remove();
}
function openStudentsPage() { navigateTo("menuPage", "studentsPage"); }
function showAddStudent() {
  navigateTo("studentsPage", "addStudentPage");
  const cont = document.getElementById('extraFieldsContainer');
  cont.innerHTML = '';
  savedExtraFieldNames.forEach(name => appendStudentField(name));
}
function saveStudent() {
  const cls = document.getElementById('stuClassForNew').value;
  const fullName = document.getElementById("stuFullName").value.trim();
  if (!cls || !classes.includes(cls) || !fullName) { alert("تأكد من الصف والاسم!"); return; }
  const studentData = {
    "الاسم الكامل": fullName,
    "رقم ولي الأمر": document.getElementById("stuGuardianPhone").value.trim(),
    "الجنس": document.getElementById("stuGender").value,
    "رقم شهادة الميلاد": document.getElementById("stuBirthCert").value.trim(),
    "ملاحظات": document.getElementById("stuNotes").value.trim(),
    fees: []
  };
  document.querySelectorAll('#extraFieldsContainer .extraFieldValue').forEach(input => {
    const name = input.getAttribute('data-field-name');
    if (name) {
      studentData[name] = input.value.trim();
      savedExtraFieldNames.add(name);
    }
  });
  students[cls].push(studentData);
  saveToStorage('students', students);
  saveToStorage('extraFields', Array.from(savedExtraFieldNames));
  ['stuFullName', 'stuGuardianPhone', 'stuBirthCert', 'stuNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('stuGender').value = 'ذكر';
  document.getElementById('extraFieldsContainer').innerHTML = '';
  alert("✅ تم الحفظ!");
  goBack();
}
function showViewStudents() {
  navigateTo("studentsPage", "viewStudentsPage");
  const grid = document.getElementById('classGrid');
  grid.innerHTML = '';
  classes.forEach(c => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.innerText = c;
    div.onclick = () => showStudentsList(c);
    grid.appendChild(div);
  });
}
function showStudentsList(cls) {
  document.getElementById('currentClass').innerText = cls;
  navigateTo("viewStudentsPage", "studentsListPage");
  renderStudentsList(cls);
}
function renderStudentsList(cls) {
  const tbody = document.querySelector('#studentsTable tbody');
  const thead = document.querySelector('#studentsTable thead');
  tbody.innerHTML = '';
  const list = students[cls] || [];
  if (list.length === 0) { thead.innerHTML = '<tr><th colspan="2">لا يوجد طلاب</th></tr>'; return; }
  const keys = [...new Set(list.flatMap(s => Object.keys(s).filter(k => k !== 'fees')))];
  thead.innerHTML = '<tr>' + keys.map(k => `<th>${k}</th>`).join('') + '<th>الإجراءات</th></tr>';
  tbody.innerHTML = list.map((s, i) => {
    const cells = keys.map(k => `<td>${s[k] || ''}</td>`).join('');
    return `<tr>${cells}<td>
      <button class="btn btn-sm" onclick="editStudent('${cls}', ${i})">✏️</button>
      <button class="btn btn-sm btn-danger" onclick="deleteStudent('${cls}', ${i})">❌</button>
    </td></tr>`;
  }).join('');
  const search = document.getElementById('searchInput');
  if (search) {
    search.value = '';
    search.oninput = () => {
      const term = search.value.toLowerCase();
      tbody.querySelectorAll('tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    };
  }
}
function editStudent(cls, index) {
  const s = students[cls][index];
  navigateTo("studentsListPage", "addStudentPage");
  document.getElementById('stuClassForNew').value = cls;
  document.getElementById('stuFullName').value = s["الاسم الكامل"] || '';
  document.getElementById('stuGuardianPhone').value = s["رقم ولي الأمر"] || '';
  document.getElementById('stuGender').value = s["الجنس"] || 'ذكر';
  document.getElementById('stuBirthCert').value = s["رقم شهادة الميلاد"] || '';
  document.getElementById('stuNotes').value = s["ملاحظات"] || '';
  const cont = document.getElementById('extraFieldsContainer');
  cont.innerHTML = '';
  Object.keys(s).forEach(k => {
    if (!["الاسم الكامل", "رقم ولي الأمر", "الجنس", "رقم شهادة الميلاد", "ملاحظات", "fees"].includes(k)) {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label>${k}</label>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="text" data-field-name="${k}" value="${s[k]}" class="extraFieldValue" style="flex:1;" />
          <button type="button" class="btn btn-sm btn-danger" onclick="removeStudentField('${k}')">×</button>
        </div>
      `;
      cont.appendChild(div);
      savedExtraFieldNames.add(k);
    }
  });
  saveToStorage('extraFields', Array.from(savedExtraFieldNames));
}
function deleteStudent(cls, index) {
  if (!confirm("هل أنت متأكد من حذف هذا الطالب؟ لن يُحذف نهائيًا، ويمكنك استرجاعه لاحقًا.")) return;
  const student = students[cls][index];
  student.__originalClass = cls;
  student.__deletedAt = new Date().toLocaleString('ar-EG');
  deletedStudents.push(student);
  saveToStorage('deletedStudents', deletedStudents);
  students[cls].splice(index, 1);
  saveToStorage('students', students);
  renderStudentsList(cls);
  alert("✅ تم حذف الطالب (يمكنك استرجاعه من 'الطلاب المحذوفون')");
}
function showDeletedStudents() {
  navigateTo("studentsPage", "deletedStudentsPage");
  renderDeletedStudents();
}
function renderDeletedStudents() {
  const tbody = document.querySelector('#deletedStudentsTable tbody');
  const thead = document.querySelector('#deletedStudentsTable thead');
  tbody.innerHTML = '';
  if (deletedStudents.length === 0) {
    thead.innerHTML = '<tr><th colspan="2">لا يوجد طلاب محذوفين</th></tr>';
    return;
  }
  const allKeys = new Set();
  deletedStudents.forEach(s => {
    Object.keys(s).forEach(k => {
      if (!['__originalClass', '__deletedAt', 'fees'].includes(k)) {
        allKeys.add(k);
      }
    });
  });
  const keys = Array.from(allKeys);
  keys.push('الصف الأصلي', 'تاريخ الحذف');
  thead.innerHTML = '<tr>' + keys.map(k => `<th>${k === 'الصف الأصلي' ? k : (k === 'تاريخ الحذف' ? k : k)}</th>`).join('') + '<th>الإجراءات</th></tr>';
  tbody.innerHTML = deletedStudents.map((s, i) => {
    const cells = keys.map(k => {
      if (k === 'الصف الأصلي') return `<td>${s.__originalClass || 'غير معروف'}</td>`;
      if (k === 'تاريخ الحذف') return `<td>${s.__deletedAt || 'غير محدد'}</td>`;
      return `<td>${s[k] || ''}</td>`;
    }).join('');
    return `<tr>${cells}<td><button class="btn btn-sm" onclick="restoreStudent(${i})">↩️ استرجاع</button></td></tr>`;
  }).join('');
}
function restoreStudent(index) {
  const student = deletedStudents[index];
  const cls = student.__originalClass;
  if (!cls || !classes.includes(cls)) {
    alert("❌ خطأ: لا يمكن تحديد الصف الأصلي لهذا الطالب!");
    return;
  }
  const restoredStudent = { ...student };
  delete restoredStudent.__originalClass;
  delete restoredStudent.__deletedAt;
  students[cls].push(restoredStudent);
  saveToStorage('students', students);
  deletedStudents.splice(index, 1);
  saveToStorage('deletedStudents', deletedStudents);
  renderDeletedStudents();
  alert("✅ تم استرجاع الطالب بنجاح!");
}
function showGradesPage() {
  navigateTo("studentsPage", "gradesPage");
  const grid = document.getElementById('gradesClassGrid');
  grid.innerHTML = '';
  classes.forEach(c => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.innerText = c;
    div.onclick = () => alert(`سيتم فتح درجات: ${c}`);
    grid.appendChild(div);
  });
}
function appendTeacherField(name) {
  const container = document.getElementById('customTeacherFields');
  const div = document.createElement('div');
  div.className = 'form-group';
  div.innerHTML = `
    <label>${name}</label>
    <div style="display:flex; gap:8px; align-items:center;">
      <input type="text" id="customField_${name}" placeholder="أدخل ${name}" style="flex:1;" />
      <button type="button" class="btn btn-sm btn-danger" onclick="removeTeacherField('${name}')">×</button>
    </div>
  `;
  container.appendChild(div);
}
function addTeacherField() {
  const fieldName = prompt("أدخل اسم الحقل الجديد (مثل: الشهادة، الخبرة...):");
  if (!fieldName || fieldName.trim() === "") return;
  const name = fieldName.trim();
  if (teacherCustomFields.includes(name)) { alert("هذا الحقل موجود مسبقًا!"); return; }
  teacherCustomFields.push(name);
  saveToStorage('teacherCustomFields', teacherCustomFields);
  appendTeacherField(name);
}
function removeTeacherField(fieldName) {
  if (!confirm(`هل أنت متأكد من حذف الحقل "${fieldName}" نهائيًا من نظام المعلمين؟`)) return;
  teacherCustomFields = teacherCustomFields.filter(f => f !== fieldName);
  saveToStorage('teacherCustomFields', teacherCustomFields);
  const container = document.getElementById('customTeacherFields');
  const fieldDiv = container.querySelector(`#customField_${fieldName}`)?.closest('.form-group');
  if (fieldDiv) fieldDiv.remove();
}
function openTeachersPage() { navigateTo("menuPage", "teachersPage"); }
function showAddTeacher() {
  navigateTo("teachersPage", "addTeacherPage");
  currentEditTeacher = null;
  const container = document.getElementById('customTeacherFields');
  container.innerHTML = '';
  teacherCustomFields.forEach(name => appendTeacherField(name));
  document.getElementById('amountField').style.display = 'none';
}
document.getElementById('teacherSalaryType')?.addEventListener('change', function() {
  const type = this.value;
  const amountField = document.getElementById('amountField');
  if (type === 'probation') {
    amountField.style.display = 'none';
    document.getElementById('teacherAgreedAmount').value = '';
  } else if (type) {
    amountField.style.display = 'block';
  } else {
    amountField.style.display = 'none';
    document.getElementById('teacherAgreedAmount').value = '';
  }
});
function saveTeacher() {
  const cls = document.getElementById('teacherClass').value;
  const name = document.getElementById('teacherFullName').value.trim();
  if (!cls || !classes.includes(cls) || !name) { alert("املأ جميع الحقول المطلوبة!"); return; }
  const salaryType = document.getElementById('teacherSalaryType').value;
  const agreedAmount = salaryType === 'probation' ? 0 : parseFloat(document.getElementById('teacherAgreedAmount').value) || 0;
  const teacherData = {
    "اسم المعلم": name,
    "رقم الهاتف": document.getElementById('teacherPhone').value.trim(),
    "الصف": cls,
    "نوع_الراتb": salaryType,
    "الراتب_المتفق_عليه": agreedAmount,
    "ملاحظات": document.getElementById('teacherNotes').value.trim()
  };
  teacherCustomFields.forEach(fieldName => {
    const input = document.getElementById(`customField_${fieldName}`);
    if (input) teacherData[fieldName] = input.value.trim();
  });
  if (!teachers[cls]) teachers[cls] = [];
  teachers[cls].push(teacherData);
  saveToStorage('teachers', teachers);
  document.getElementById('teacherClass').value = '';
  document.getElementById('teacherFullName').value = '';
  document.getElementById('teacherPhone').value = '';
  document.getElementById('teacherSalaryType').value = '';
  document.getElementById('teacherAgreedAmount').value = '';
  document.getElementById('teacherNotes').value = '';
  document.getElementById('amountField').style.display = 'none';
  document.querySelectorAll('#customTeacherFields input').forEach(input => input.value = '');
  alert("✅ تم حفظ المعلم بنجاح!");
  goBack();
}
function showTeachersByClass() {
  navigateTo("teachersPage", "teachersByClassPage");
  renderTeachersByClass();
}
function deleteTeacher(cls, index) {
  if (!confirm("هل أنت متأكد من حذف هذا المعلم؟ لن يُحذف نهائيًا، ويمكنك استرجاعه لاحقًا.")) return;
  const teacher = teachers[cls][index];
  teacher.__originalClass = cls;
  teacher.__deletedAt = new Date().toLocaleString('ar-EG');
  deletedTeachers.push(teacher);
  saveToStorage('deletedTeachers', deletedTeachers);
  teachers[cls].splice(index, 1);
  saveToStorage('teachers', teachers);
  renderTeachersByClass();
  alert("✅ تم حذف المعلم (يمكنك استرجاعه من 'المعلمون المحذوفون')");
}
function showDeletedTeachers() {
  navigateTo("teachersPage", "deletedTeachersPage");
  renderDeletedTeachers();
}
function renderDeletedTeachers() {
  const tbody = document.querySelector('#deletedTeachersTable tbody');
  const thead = document.querySelector('#deletedTeachersTable thead');
  tbody.innerHTML = '';
  if (deletedTeachers.length === 0) {
    thead.innerHTML = '<tr><th colspan="2">لا يوجد معلمون محذوفون</th></tr>';
    return;
  }
  const allKeys = new Set();
  deletedTeachers.forEach(t => {
    Object.keys(t).forEach(k => {
      if (!['__originalClass', '__deletedAt', 'الصف', 'نوع_الراتb'].includes(k)) {
        allKeys.add(k);
      }
    });
  });
  const keys = Array.from(allKeys);
  keys.push('الصف الأصلي', 'تاريخ الحذف');
  thead.innerHTML = '<tr>' + keys.map(k => `<th>${k === 'الصف الأصلي' ? k : (k === 'تاريخ الحذف' ? k : k)}</th>`).join('') + '<th>الإجراءات</th></tr>';
  tbody.innerHTML = deletedTeachers.map((t, i) => {
    const cells = keys.map(k => {
      if (k === 'الصف الأصلي') return `<td>${t.__originalClass || 'غير معروف'}</td>`;
      if (k === 'تاريخ الحذف') return `<td>${t.__deletedAt || 'غير محدد'}</td>`;
      return `<td>${t[k] || ''}</td>`;
    }).join('');
    return `<tr>${cells}<td><button class="btn btn-sm" onclick="restoreTeacher(${i})">↩️ استرجاع</button></td></tr>`;
  }).join('');
}
function restoreTeacher(index) {
  const teacher = deletedTeachers[index];
  const cls = teacher.__originalClass;
  if (!cls || !classes.includes(cls)) {
    alert("❌ خطأ: لا يمكن تحديد الصف الأصلي لهذا المعلم!");
    return;
  }
  const restoredTeacher = { ...teacher };
  delete restoredTeacher.__originalClass;
  delete restoredTeacher.__deletedAt;
  delete restoredTeacher.الصف;
  teachers[cls].push(restoredTeacher);
  saveToStorage('teachers', teachers);
  deletedTeachers.splice(index, 1);
  saveToStorage('deletedTeachers', deletedTeachers);
  renderDeletedTeachers();
  alert("✅ تم استرجاع المعلم بنجاح!");
}
function deleteTeacherPermanent(cls, index) {
  if (!confirm("⚠️ تحذير: سيتم حذف هذا المعلم نهائيًا ولا يمكن استرجاعه!")) return;
  teachers[cls].splice(index, 1);
  saveToStorage('teachers', teachers);
  renderTeachersByClass();
  alert("✅ تم الحذف النهائي!");
}
function editTeacher(cls, index) {
  const t = teachers[cls][index];
  currentEdit_teacher = { cls, index };
  navigateTo("teachersByClassPage", "addTeacherPage");
  const container = document.getElementById('customTeacherFields');
  container.innerHTML = '';
  document.getElementById('teacherClass').value = cls;
  document.getElementById('teacherFullName').value = t["اسم المعلم"] || '';
  document.getElementById('teacherPhone').value = t["رقم الهاتف"] || '';
  document.getElementById('teacherSalaryType').value = t["نوع_الراتb"] || '';
  document.getElementById('teacherNotes').value = t["ملاحظات"] || '';
  const amountField = document.getElementById('amountField');
  if (t["نوع_الراتb"] === 'probation') {
    amountField.style.display = 'none';
    document.getElementById('teacherAgreedAmount').value = '';
  } else if (t["نوع_الراتb"]) {
    amountField.style.display = 'block';
    document.getElementById('teacherAgreedAmount').value = t["الراتب_المتفق_عليه"] || '';
  } else {
    amountField.style.display = 'none';
  }
  teacherCustomFields.forEach(name => {
    const currentValue = t[name] || '';
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label>${name}</label>
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="text" id="customField_${name}" value="${currentValue}" placeholder="أدخل ${name}" style="flex:1;" />
        <button type="button" class="btn btn-sm btn-danger" onclick="removeTeacherField('${name}')">×</button>
      </div>
    `;
    container.appendChild(div);
  });
}
function showSalariesPage() {
  navigateTo("teachersPage", "salariesPage");
  renderSalariesTable();
}
function renderSalariesTable() {
  const tbody = document.querySelector('#salariesTable tbody');
  tbody.innerHTML = '';
  let allTeachers = [];
  classes.forEach(cls => {
    const list = teachers[cls] || [];
    list.forEach(teacher => allTeachers.push({ ...teacher, class: cls }));
  });
  if (allTeachers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">لا يوجد معلمون</td></tr>';
    return;
  }
  allTeachers.forEach((t) => {
    const key = `salary_${t["اسم المعلم"]}_${t.class}`;
    const saved = loadFromStorage(key) || { paid: '' };
    const agreed = t["الراتب_المتفق_عليه"] || 0;
    let agreedDisplay = 'غير محدد';
    if (t["نوع_الراتb"] === 'probation') agreedDisplay = 'تحت التجربة';
    else if (agreed > 0) agreedDisplay = agreed.toLocaleString();
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t["اسم المعلم"] || 'غير معروف'}</td>
      <td>${agreedDisplay}</td>
      <td><input type="number" class="salary-paid" data-key="${key}" value="${saved.paid}" placeholder="المسلم" /></td>
      <td>
        <button class="btn btn-sm" onclick="saveSalary('${key}', this)">💾 حفظ</button>
        <button class="btn btn-sm" onclick="printReceipt('${t["اسم المعلم"]}', '${saved.paid}', '${agreed}', '${t["نوع_الراتb"]}')">🖨️ طباعة</button>
      </td>
    `;
    tbody.appendChild(row);
    row.querySelector('.salary-paid').addEventListener('blur', (e) => saveToStorage(key, { paid: e.target.value }));
  });
}
function saveSalary(key, btn) {
  const paid = btn.closest('tr').querySelector('.salary-paid').value;
  saveToStorage(key, { paid });
  alert("✅ تم الحفظ!");
}
function printReceipt(teacherName, paidAmount, agreedAmount, salaryType) {
  if (!paidAmount || paidAmount <= 0) return;
  const paid = parseFloat(paidAmount);
  const agreed = parseFloat(agreedAmount) || 0;
  const statusEl = document.getElementById('receipt-status');
  if (salaryType === 'probation') statusEl.innerHTML = "الحالة: تحت التجربة";
  else if (agreed <= 0) statusEl.innerHTML = "الراتب المتفق عليه: غير محدد";
  else {
    const remaining = agreed - paid;
    if (remaining <= 0) statusEl.innerHTML = "تم الدفع بالكامل حسب الاتفاق";
    else statusEl.innerHTML = `المتبقي: ${remaining.toLocaleString()} ريال`;
  }
  document.getElementById('receipt-teacher-name').innerText = teacherName || 'غير معروف';
  document.getElementById('receipt-amount').innerText = paid.toLocaleString();
  const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('receipt-date').innerText = today;
  document.querySelectorAll('.box').forEach(box => box.style.display = 'none');
  document.getElementById('receiptPage').style.display = 'block';
}
function showAttendancePage() {
  navigateTo("teachersPage", "attendancePage");
}
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function viewOrEditWeek(weekKey, startDate, endDate, isEditMode = false) {
  if (isEditMode) {
    const pass = prompt("أدخل كلمة المرور للتعديل:");
    if (pass !== "5900") {
      alert("كلمة المرور غير صحيحة!");
      return;
    }
  }
  navigateTo("monthlyAttendancePage", "weeklyAttendancePage");
  renderWeeklyAttendance(weekKey, startDate, endDate, isEditMode);
}
function showWeeklyAttendance() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekKey = `${formatDate(weekStart)}_${formatDate(weekEnd)}`;
  attendanceData[weekKey] = {
    finalized: false,
    teachers: {}
  };
  classes.forEach(cls => {
    (teachers[cls] || []).forEach(t => {
      const name = t["اسم المعلم"];
      if (name) {
        attendanceData[weekKey].teachers[name] = { 
          days: [null, null, null, null, null, null, null] 
        };
      }
    });
  });
  saveToStorage('attendanceData', attendanceData);
  navigateTo("attendancePage", "weeklyAttendancePage");
  renderWeeklyAttendance(weekKey, weekStart, weekEnd, true);
}
function renderWeeklyAttendance(weekKey, startDate, endDate, isEditable = false) {
  const weekData = attendanceData[weekKey] || { teachers: {}, finalized: false };
  const isFinalized = weekData.finalized;
  const canEdit = isEditable && !isFinalized;
  const title = `الأسبوع من ${startDate.toLocaleDateString('ar-EG')} إلى ${endDate.toLocaleDateString('ar-EG')}`;
  document.getElementById('weekTitle').innerText = title;
  currentWeekKey = weekKey;
  const finalizeBtn = document.getElementById('finalizeWeekBtn');
  finalizeBtn.style.display = canEdit ? 'block' : 'none';
  const daysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const thead = document.querySelector('#attendanceTable thead');
  thead.innerHTML = '<tr><th>اسم المعلم</th>' + daysAr.map(d => `<th>${d}</th>`).join('') + '</tr>';
  const tbody = document.querySelector('#attendanceTable tbody');
  const teacherNames = Object.keys(weekData.teachers);
  if (teacherNames.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">لا يوجد معلمون</td></tr>';
    return;
  }
  tbody.innerHTML = '';
  teacherNames.forEach(name => {
    const record = weekData.teachers[name];
    let cells = `<td>${name}</td>`;
    for (let i = 0; i < 7; i++) {
      let icon = '';
      if (record.days[i] === true) icon = '✔️';
      else if (record.days[i] === false) icon = '❌';
      else icon = '➖';
      const clickable = canEdit ? `onclick="toggleDayState('${weekKey}', '${name.replace(/'/g, "\\'")}', ${i})"` : '';
      const cursor = canEdit ? 'pointer' : 'default';
      cells += `<td style="cursor:${cursor};" ${clickable}>${icon}</td>`;
    }
    tbody.innerHTML += `<tr>${cells}</tr>`;
  });
}
function toggleDayState(weekKey, teacherName, dayIndex) {
  const week = attendanceData[weekKey];
  if (!week || week.finalized) return;
  const current = week.teachers[teacherName].days[dayIndex];
  if (current === null) week.teachers[teacherName].days[dayIndex] = true;
  else if (current === true) week.teachers[teacherName].days[dayIndex] = false;
  else week.teachers[teacherName].days[dayIndex] = null;
  saveToStorage('attendanceData', attendanceData);
  const titleText = document.getElementById('weekTitle').innerText;
  const dates = titleText.split(' من ')[1].split(' إلى ');
  const start = new Date(dates[0].split('/').reverse().join('-'));
  const end = new Date(dates[1].split('/').reverse().join('-'));
  renderWeeklyAttendance(weekKey, start, end, true);
}
function finalizeCurrentWeek() {
  if (!currentWeekKey || !attendanceData[currentWeekKey]) {
    alert("❌ خطأ: لا يوجد بيانات أسبوع نشط!");
    return;
  }
  if (confirm("هل أنت متأكد من جرد هذا الأسبوع؟")) {
    attendanceData[currentWeekKey].finalized = true;
    saveToStorage('attendanceData', attendanceData);
    alert("✅ تم جرد الأسبوع بنجاح!");
    showMonthlyAttendance();
  }
}
function showMonthlyAttendance() {
  navigateTo("attendancePage", "monthlyAttendancePage");
  const now = new Date();
  document.getElementById('currentMonthDisplay').innerText = 
    `الشهر: ${now.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}`;
  const container = document.getElementById('weeksList');
  container.innerHTML = '';
  const weekKeys = Object.keys(attendanceData).filter(key => {
    if (!attendanceData[key].finalized) return false;
    const [startStr] = key.split('_');
    const startDate = new Date(startStr);
    return startDate.getMonth() === now.getMonth() && startDate.getFullYear() === now.getFullYear();
  }).sort();
  if (weekKeys.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#ffcc00;">لا توجد أسابيع مُجرَّدة بعد.</p>';
    return;
  }
  weekKeys.forEach(key => {
    const [startStr, endStr] = key.split('_');
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.style.backgroundColor = '#0a330a';
    div.innerHTML = `
      الأسبوع من ${startDate.toLocaleDateString('ar-EG')} إلى ${endDate.toLocaleDateString('ar-EG')}
      <br>
      <button class="btn btn-sm" style="margin:5px; width:auto;" 
        onclick="viewOrEditWeek('${key}', new Date('${startStr}'), new Date('${endStr}'), false)">
        👁️ عرض
      </button>
      <button class="btn btn-sm" style="margin:5px; width:auto; background:#555;" 
        onclick="viewOrEditWeek('${key}', new Date('${startStr}'), new Date('${endStr}'), true)">
        ✏️ تعديل
      </button>
    `;
    container.appendChild(div);
  });
}
function showFeesPage() {
  navigateTo("studentsPage", "feesClassSelectPage");
  const grid = document.getElementById('feesClassGridUnique');
  grid.innerHTML = '';
  classes.forEach(c => {
    const div = document.createElement('div');
    div.className = 'grid-item';
    div.innerText = c;
    div.onclick = () => {
      currentUnifiedClass = c;
      showUnifiedFeesPage(c);
    };
    grid.appendChild(div);
  });
}
function showUnifiedFeesPage(cls) {
  navigateTo("feesClassSelectPage", "feesUnifiedPage");
  document.getElementById('feesUnifiedClassName').innerText = cls;
  renderUnifiedPage(cls);
}
function renderUnifiedPage(cls) {
  renderUnifiedMonthsList(cls);
  document.getElementById('unifiedStudentsTableContainer').style.display = 'none';
}
function toggleAddMonthForm() {
  const form = document.getElementById('addMonthForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
function saveUnifiedFeeMonth() {
  const cls = currentUnifiedClass;
  const month = document.getElementById('unifiedFeeMonth').value.trim();
  const year = document.getElementById('unifiedFeeYear').value.trim();
  const amount = parseFloat(document.getElementById('unifiedFeeAmount').value);
  const note = document.getElementById('unifiedFeeNote').value.trim();
  if (!month || !year || isNaN(amount) || amount <= 0) { alert("يرجى تعبئة جميع الحقول بشكل صحيح!"); return; }
  const fullMonth = `${month} ${year}`;
  if (!feesData[cls]) feesData[cls] = {};
  if (feesData[cls][fullMonth]) { alert("هذا الشهر موجود مسبقًا!"); return; }
  feesData[cls][fullMonth] = { amount, note, students: {} };
  students[cls]?.forEach(s => {
    const name = s["الاسم الكامل"];
    if (name) {
      feesData[cls][fullMonth].students[name] = {
        paid: false,
        note: ""
      };
      feesCustomFields.forEach(field => {
        feesData[cls][fullMonth].students[name][field] = "";
      });
    }
  });
  saveToStorage('feesData', feesData);
  document.getElementById('unifiedFeeMonth').value = '';
  document.getElementById('unifiedFeeYear').value = '';
  document.getElementById('unifiedFeeAmount').value = '';
  document.getElementById('unifiedFeeNote').value = '';
  toggleAddMonthForm();
  renderUnifiedPage(cls);
  alert("✅ تم حفظ الشهر!");
}
function renderUnifiedMonthsList(cls) {
  const container = document.getElementById('unifiedMonthsList');
  container.innerHTML = '';
  if (!feesData[cls] || Object.keys(feesData[cls]).length === 0) {
    container.innerHTML = '<p style="color:#ffcc00; width:100%; text-align:right;">لا توجد شهور مضافة بعد.</p>';
    return;
  }
  Object.keys(feesData[cls]).forEach(month => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '8px';
    div.style.alignItems = 'center';
    div.style.flexWrap = 'wrap';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.fontSize = '14px';
    btn.style.padding = '8px 12px';
    btn.style.flex = '1';
    btn.innerText = month;
    btn.onclick = () => showUnifiedStudentsTable(cls, month);
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.style.width = 'auto';
    deleteBtn.style.padding = '4px 8px';
    deleteBtn.innerText = '🗑️';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`هل أنت متأكد من حذف "${month}" نهائيًا؟`)) {
        delete feesData[cls][month];
        saveToStorage('feesData', feesData);
        renderUnifiedPage(cls);
      }
    };
    div.appendChild(btn);
    div.appendChild(deleteBtn);
    container.appendChild(div);
  });
}
function addFeesCustomField() {
  const fieldName = prompt("أدخل اسم الحقل المخصص (مثلاً: خصم، ملاحظة إضافية):");
  if (!fieldName || fieldName.trim() === "") return;
  const name = fieldName.trim();
  if (feesCustomFields.includes(name)) {
    alert("هذا الحقل موجود مسبقًا!");
    return;
  }
  feesCustomFields.push(name);
  saveToStorage('feesCustomFields', feesCustomFields);
  alert(`✅ تم إضافة الحقل: ${name}`);
  if (document.getElementById('unifiedStudentsTableContainer').style.display !== 'none') {
    showUnifiedStudentsTable(currentUnifiedClass, currentUnifiedMonth);
  }
}
function showUnifiedStudentsTable(cls, month) {
  currentUnifiedMonth = month;
  document.getElementById('unifiedMonthTitle').innerText = `حالة الطلاب لـ ${month}`;
  document.getElementById('unifiedStudentsTableContainer').style.display = 'block';
  const tbody = document.querySelector('#unifiedStudentsTable tbody');
  const thead = document.querySelector('#unifiedStudentsTable thead');
  tbody.innerHTML = '';
  const list = students[cls] || [];
  if (list.length === 0) { tbody.innerHTML = '<tr><td colspan="5">لا يوجد طلاب في هذا الصف</td></tr>'; return; }
  const monthData = feesData[cls]?.[month] || { students: {} };
  const headers = ["اسم الطالب", "الحالة", "ملاحظات"];
  feesCustomFields.forEach(field => headers.push(field));
  headers.push("الإجراءات");
  thead.innerHTML = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
  tbody.innerHTML = list.map(s => {
    const name = s["الاسم الكامل"];
    const stData = monthData.students[name] || { paid: false, note: "" };
    const statusIcon = stData.paid 
      ? '<span style="color:#55ff55; font-size:20px;">✔️</span>' 
      : '<span style="color:#ff5555; font-size:20px;">❌</span>';
    let cells = [
      `<td>${name}</td>`,
      `<td>${statusIcon}</td>`,
      `<td><input type="text" value="${stData.note || ''}" data-student="${name}" data-field="note" class="fees-input" placeholder="ملاحظة" /></td>`
    ];
    feesCustomFields.forEach(field => {
      const val = stData[field] || "";
      cells.push(`<td><input type="text" value="${val}" data-student="${name}" data-field="${field}" class="fees-input" placeholder="${field}" /></td>`);
    });
    cells.push(`<td><button class="btn btn-sm" onclick="showStudentFeesHistoryUnified('${cls}', '${name}')">👁️ عرض</button></td>`);
    return `<tr>${cells.join('')}</tr>`;
  }).join('');
  document.querySelectorAll('.fees-input').forEach(input => {
    input.addEventListener('blur', () => {
      const name = input.getAttribute('data-student');
      const field = input.getAttribute('data-field');
      const value = input.value || "";
      if (!feesData[cls] || !feesData[cls][month]) return;
      if (!feesData[cls][month].students[name]) {
        feesData[cls][month].students[name] = { paid: false, note: "" };
      }
      feesData[cls][month].students[name][field] = value;
      saveToStorage('feesData', feesData);
    });
  });
  document.querySelectorAll('#unifiedStudentsTable tbody tr').forEach((row, index) => {
    const name = list[index]["الاسم الكامل"];
    const statusCell = row.children[1];
    statusCell.style.cursor = 'pointer';
    statusCell.onclick = () => {
      const current = feesData[cls][month].students[name] || { paid: false, note: "" };
      feesData[cls][month].students[name] = { paid: !current.paid, note: current.note };
      saveToStorage('feesData', feesData);
      showUnifiedStudentsTable(cls, month);
    };
  });
}
function showStudentFeesHistoryUnified(cls, studentName) {
  navigateTo("feesUnifiedPage", "studentFeesHistoryPage");
  document.getElementById('historyStudentName').innerText = studentName;
  let historyHTML = '';
  if (feesData[cls]) {
    Object.keys(feesData[cls]).forEach(month => {
      const monthData = feesData[cls][month];
      const stData = monthData.students[studentName] || { paid: false, note: "" };
      const amount = monthData.amount || 0;
      const paidText = stData.paid ? "دفع" : "لم يدفع";
      const icon = stData.paid ? "✔️" : "❌";
      const color = stData.paid ? "#55ff55" : "#ff5555";
      historyHTML += `
        <div style="padding:10px; border-bottom:1px solid #00eaff;">
          <strong>${month}</strong> — المبلغ: ${amount.toLocaleString()} ريال<br>
          الحالة: <span style="color:${color}">${paidText} ${icon}</span>
          ${stData.note ? `<br>ملاحظة: ${stData.note}` : ''}
          ${feesCustomFields.map(field => stData[field] ? `<br>${field}: ${stData[field]}` : '').join('')}
        </div>
      `;
    });
  }
  if (!historyHTML) historyHTML = '<p style="text-align:center; color:#ffcc00;">لا توجد بيانات رسوم لهذا الطالب.</p>';
  document.getElementById('studentFeesHistoryList').innerHTML = historyHTML;
}
// === تشغيل أولي ===
document.addEventListener('DOMContentLoaded', () => {
  showPage('loginPage');
}); 