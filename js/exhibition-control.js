// exhibition-control.js

// === 写真展ごとの設定 ===
const exhibitions = {
  "summer": {
    startDate: new Date("2025-10-08T00:47:00"),   // 公開開始
    endDate: new Date("2025-10-08T00:52:59"),     // 投票締切
    worksPasswordURL: "works.html",               // パスワードページ
    worksPublicURL: "af69592862e159a7cf723a78c20a47ce109d13b04db75224503159b765b84967/index.html",
    navSelector: 'a[href*="2025/summer"]',
    voteFormURL: "https://forms.gle/YJQeJJkgrZZoCbBs5" // 投票フォームURL
  },
  "gakusai": {
    startDate: new Date("2025-11-01T00:00:00"),   // 公開開始 # 仮公開
    endDate: new Date("2025-11-30T23:59:59"),     // 投票締切
    worksPasswordURL: "works.html",
    worksPublicURL: "2af262a415562b8849d6ab105bd0f438e062dd5912de91680106214e07239450/index.html",
    navSelector: 'a[href*="2025/gakusai"]',
    voteFormURL: "https://forms.gle/exampleGakusaiForm"
  },
  "winter": {
    startDate: new Date("2026-01-10T00:00:00"),   // 公開開始
    endDate: new Date("2026-02-15T23:59:59"),     // 投票締切
    worksPasswordURL: "works.html",
    worksPublicURL: "public/index.html",
    navSelector: 'a[href*="2025/winter"]',
    voteFormURL: "https://forms.gle/exampleWinterForm"
  }
};

// === 現在ページに応じた制御 ===
const now = new Date();
const path = window.location.pathname;
const match = path.match(/\/2025\/([^/]+)\//);
const exhibitionKey = match ? match[1] : null;

if (exhibitionKey && exhibitions[exhibitionKey]) {
  const { startDate, endDate, worksPasswordURL, worksPublicURL, voteFormURL } = exhibitions[exhibitionKey];

  // 投票ボタンと作品一覧リンクを取得
  const voteButton = document.querySelector(".vote-container .button");
  const worksLink = document.querySelector('.link-buttons a[href*="works"]');
  const resultButton = document.querySelector(".result-container .button");

  // === 1️⃣ 投票開始前 ===
  if (now < startDate) {
    if (voteButton) {
      voteButton.textContent = "投票期間はまだ始まっていません";
      voteButton.classList.add("disabled");
      voteButton.removeAttribute("href");
      voteButton.removeAttribute("target");
    }
    if (worksLink) {
      worksLink.textContent = "作品一覧（準備中）";
      worksLink.classList.add("disabled");
      worksLink.removeAttribute("href");
    }
    if (resultButton) {
    resultButton.textContent = "結果概要（まだ公開されていません）";
    resultButton.classList.add("disabled");
    resultButton.removeAttribute("href");
    }

  // === 2️⃣ 投票期間中 ===
  } else if (now >= startDate && now <= endDate) {
    if (voteButton) {
      voteButton.textContent = "投票フォームはこちら";
      voteButton.classList.remove("disabled");
      voteButton.setAttribute("href", voteFormURL);
      voteButton.setAttribute("target", "_blank");
    }
    if (worksLink) {
      worksLink.setAttribute("href", worksPasswordURL);
      worksLink.classList.remove("disabled");
      worksLink.textContent = "作品一覧";
    }
    if (resultButton) {
    resultButton.textContent = "結果概要（投票期間終了後に公開）";
    resultButton.classList.add("disabled");
    resultButton.removeAttribute("href");
    }

  // === 3️⃣ 投票終了後 ===
  } else {
    if (voteButton) {
      voteButton.textContent = "投票は終了しました";
      voteButton.classList.add("disabled");
      voteButton.removeAttribute("href");
      voteButton.removeAttribute("target");
    }
    if (worksLink) {
      // ✅ 投票終了後は一般公開URLに自動切り替え
      worksLink.setAttribute("href", worksPublicURL);
      worksLink.textContent = "作品一覧（一般公開中）";
      worksLink.classList.remove("disabled");
    }
    if (resultButton) {
    resultButton.textContent = "結果概要を見る";
    resultButton.classList.remove("disabled");
    resultButton.setAttribute("href", "result.html");
    }
  }
}

// === ナビゲーション制御 ===
for (const [key, conf] of Object.entries(exhibitions)) {
  const { startDate, navSelector } = conf;
  const navLink = document.querySelector(navSelector);
  if (!navLink) continue;

  if (now < startDate) {
    navLink.classList.add("disabled");
    navLink.removeAttribute("href");
  } else {
    navLink.classList.remove("disabled");
  }
}