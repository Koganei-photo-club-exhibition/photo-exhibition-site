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

// ================================
// 保存防止＋Lightbox＋ピンチズーム対応
// ================================

// 保存操作防止
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());

// スマホ長押し防止（ただしタップ動作は許可）
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());

// iPhone Safari対応：タップも確実にLightbox起動
document.querySelectorAll(".photo-overlay").forEach(layer => {
  layer.addEventListener("touchstart", e => {
    e.stopPropagation(); // タップ波及を防ぐ
  }, { passive: true });

  layer.addEventListener("click", e => {
    const wrapper = e.target.closest(".photo-wrapper");
    if (!wrapper) return;
    const url = wrapper.dataset.full;
    if (!url) return;
    const lightbox = document.querySelector(".lightbox");
    const img = lightbox.querySelector("img");
    img.src = url;
    img.style.transform = "scale(1)";
    lightbox.classList.add("active");
  });
});

// Lightbox生成
document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(".photo-wrapper");
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  const img = document.createElement("img");
  lightbox.appendChild(img);
  document.body.appendChild(lightbox);

  // 通常クリックでLightbox開く
  wrappers.forEach(wrapper => {
    wrapper.addEventListener("click", () => {
      const url = wrapper.dataset.full;
      if (!url) return;
      img.src = url;
      img.style.transform = "scale(1)";
      img.dataset.scale = "1";
      lightbox.classList.add("active");
    });
  });

  // 背景クリックで閉じる
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.classList.remove("active");
  });

  // ======================
  // ピンチズーム対応処理
  // ======================
  let initialDistance = 0;
  let currentScale = 1;

  lightbox.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = e.touches;
      initialDistance = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      );
    }
  }, { passive: false });

  lightbox.addEventListener("touchmove", e => {
    if (e.touches.length === 2 && initialDistance > 0) {
      e.preventDefault();
      const [t1, t2] = e.touches;
      const newDistance = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      );
      const scale = Math.min(Math.max(newDistance / initialDistance, 1), 3); // 1〜3倍
      currentScale = scale;
      img.style.transform = `scale(${scale})`;
    }
  }, { passive: false });

  lightbox.addEventListener("touchend", e => {
    if (e.touches.length < 2) {
      initialDistance = 0;
      if (currentScale < 1.05) img.style.transform = "scale(1)";
    }
  });
});