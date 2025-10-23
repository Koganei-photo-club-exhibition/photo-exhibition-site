let lastScrollY = window.scrollY;
const header = document.getElementById("main-header");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  if (scrollTop <= 0) {
    header.style.top = "0";
    navbar.style.top = "70px";
  } else if (scrollTop + windowHeight >= docHeight) {
    header.style.top = "-70px";
    navbar.style.top = "0";
  } else if (scrollTop > lastScrollY) {
    header.style.top = "-70px";
    navbar.style.top = "0";
  } else {
    header.style.top = "0";
    navbar.style.top = "70px";
  }

  lastScrollY = scrollTop;
});

// ================================
// Instagram ポップアップ機能
// ================================
document.addEventListener("DOMContentLoaded", function() {
  const instaIcons = document.querySelectorAll(".insta-icon");
  if (!instaIcons.length) return;

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";
  overlay.innerHTML = `
    <div class="popup-content">
      <p>Instagramアカウントを表示しますか？</p>
      <div class="popup-buttons">
        <button class="confirm">表示する</button>
        <button class="cancel">閉じる</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const confirmBtn = overlay.querySelector(".confirm");
  const cancelBtn = overlay.querySelector(".cancel");
  let currentURL = null;

  instaIcons.forEach(icon => {
    const parent = icon.closest(".work-author");
    const url = parent.dataset.instagram;
    if (!url) return;

    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      currentURL = url;
      overlay.style.display = "flex";
    });
  });

  confirmBtn.addEventListener("click", () => {
    if (currentURL) window.open(currentURL, "_blank");
    overlay.style.display = "none";
  });

  cancelBtn.addEventListener("click", () => overlay.style.display = "none");
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.style.display = "none";
  });
});

// ================================
// 「もっと見る」ボタン機能（完全版）
// ================================
window.addEventListener("load", function() {
  const descriptions = document.querySelectorAll(".work-description");

  descriptions.forEach(desc => {
    const button = desc.nextElementSibling;
    if (!button || !button.classList.contains("toggle-desc")) return;

    const fullHeight = desc.scrollHeight;
    const lineHeight = parseFloat(getComputedStyle(desc).lineHeight) || 18;
    const collapsedHeight = Math.round(lineHeight * 5);

    // --- 高さ判定を少し緩めにする ---
    if (fullHeight <= collapsedHeight * 1.05) { // ← 判定を約5%ゆるく
      // ただし、文字数が短すぎる場合は非表示
      const textLength = desc.textContent.trim().length;
      if (textLength < 60) { // 60文字未満は短文扱い
        button.style.display = "none";
        return;
      }
    }

    // 初期状態
    desc.style.maxHeight = collapsedHeight + "px";
    desc.style.overflow = "hidden";
    desc.dataset.fullHeight = fullHeight;
    desc.dataset.collapsedHeight = collapsedHeight;

    button.addEventListener("click", () => {
      const isExpanded = desc.classList.toggle("expanded");
      if (isExpanded) {
        desc.style.maxHeight = desc.dataset.fullHeight + "px";
        button.textContent = "閉じる";
      } else {
        desc.style.maxHeight = desc.dataset.collapsedHeight + "px";
        button.textContent = "もっと見る";
      }
    });
  });
});