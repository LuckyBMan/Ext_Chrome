// ===============================
// Idle Reminder - Click Only
// ===============================

console.log("[Idle Reminder] content script loaded");

const IDLE_TIME = 300 * 1000; // 30 giây
let idleTimer = null;
let modalEl = null;
let overlayEl = null;
let isModalVisible = false;

// --------------------------------
// DOM Ready
// --------------------------------
function domReady(callback) {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

// --------------------------------
// Hiển thị modal
// --------------------------------
function showModal() {
  if (isModalVisible) return;

  overlayEl = document.createElement("div");
  Object.assign(overlayEl.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,0.4)",
    zIndex: 999998
  });

  modalEl = document.createElement("div");
  modalEl.innerHTML = `
    <div style="font-size:18px;font-weight:bold;margin-bottom:10px;">
      ⏰ Nhắc nhở
    </div>
    <!-- <div style="font-size:14px;margin-bottom:16px;">
      Đã quá ${IDLE_TIME / 1000} giây bạn đã không giám sát camera.
	  Vui lòng quay trở lại giám sát
    </div>-->
	<div style="font-size:14px;margin-bottom:16px;">
      Đừng lướt web nữa! Quay lại làm việc đê!😆
    </div>
    <button id="idle-reminder-ok">OK</button>
  `;

  Object.assign(modalEl.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "320px",
    background: "#fff",
    borderRadius: "6px",
    padding: "20px",
    textAlign: "center",
    zIndex: 999999,
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  });

  document.body.appendChild(overlayEl);
  document.body.appendChild(modalEl);

  document.getElementById("idle-reminder-ok").onclick = () => {
    hideModal();
    resetIdleTimer();
  };

  isModalVisible = true;
}

// --------------------------------
// Ẩn modal
// --------------------------------
function hideModal() {
  modalEl?.remove();
  overlayEl?.remove();

  modalEl = null;
  overlayEl = null;
  isModalVisible = false;
}

// --------------------------------
// Reset idle timer
// --------------------------------
function resetIdleTimer() {
  clearTimeout(idleTimer);

  idleTimer = setTimeout(() => {
    if (!document.hidden) {
      showModal();
    }
  }, IDLE_TIME);
}

// --------------------------------
// Bắt CHỈ sự kiện CLICK
// --------------------------------
function bindEvents() {
  window.addEventListener(
    "click",
    () => {
      // chỉ reset khi modal chưa mở
      if (!isModalVisible) {
        resetIdleTimer();
      }
    },
    true // capture → không bị site chặn
  );

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !isModalVisible) {
      resetIdleTimer();
    }
  });
}

// --------------------------------
// Init
// --------------------------------
domReady(() => {
  console.log("[Idle Reminder] DOM ready");
  bindEvents();
  resetIdleTimer();
});
