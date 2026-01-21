// utils.js - النواة الأساسية للنظام

const classes = [
  'الصف الأول ابتدائي', 'الصف الثاني ابتدائي', 'الصف الثالث ابتدائي',
  'الصف الأول متوسط', 'الصف الثاني متوسط', 'الصف الثالث متوسط',
  'الصف الأول ثانوي', 'الصف الثاني ثانوي', 'الصف الثالث ثانوي'
];

// === التخزين الآمن ===
function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.warn("فشل الحفظ:", e); }
} 
function loadFromStorage(key) {
  try { const data = localStorage.getItem(key); return data ? JSON.parse(data) : null; } catch (e) { console.warn("فشل التحميل:", e); return null; }
}

// === التنقل بين الصفحات ===
function showPage(pageId) {
  document.querySelectorAll('.box').forEach(box => box.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

let pageHistory = [];

function navigateTo(from, to) {
  pageHistory.push(from);
  showPage(to);
}

// ❌ تم حذف showTeachersByClass الزائدة ❌

function goBack() {
  if (document.getElementById('receiptPage')?.style.display === 'block') {
    document.getElementById('receiptPage').style.display = 'none';
    showPage('salariesPage');
    return;
  }
  if (document.getElementById('receiptStudentPage')?.style.display === 'block') {
    closeReceiptStudent();
    return;
  }
  if (pageHistory.length > 0) {
    showPage(pageHistory.pop());
  } else {
    showPage('menuPage');
  }
}

// === السندات والطباعة ===
function closeReceiptStudent() {
  showPage(window.receiptReturnPage || 'feesClassSelectPage');
  delete window.receiptReturnPage;
  delete window.receiptStudentClass;
  delete window.receiptStudentName;
}

function printAndReturn() {
  window.print();
  setTimeout(() => closeReceiptStudent(), 500);
}

// === المودالات ===
function closeStudentModal() {
  document.getElementById('studentModal').style.display = 'none';
}

function closeTeacherModal() {
  document.getElementById('teacherModal').style.display = 'none';
}

function closeImageModal() {
  document.getElementById('imageModal').style.display = 'none';
}

function openImageModal(dataUrl, label) {
  document.getElementById('modalImageView').src = dataUrl;
  document.getElementById('modalImageLabel').innerText = label || 'الصورة';
  document.getElementById('imageModal').style.display = 'flex';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeImageModal();
});

// === تسجيل الدخول ===
function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  if (!u || !p) {
    alert("يرجى إدخال اسم المستخدم وكلمة المرور!");
    return;
  }
  if (p === "590") {
    navigateTo("loginPage", "menuPage");
    return;
  }
  alert("❌ البيانات غير صحيحة!");
}
function showTeachersByClass() {
  document.getElementById('teachersPage').classList.remove('active');
  document.getElementById('teachersByClassPage').classList.add('active');
  renderTeachersByClass();
}
// === تشغيل أولي ===
document.addEventListener('DOMContentLoaded', () => {
  showPage('loginPage');
});
