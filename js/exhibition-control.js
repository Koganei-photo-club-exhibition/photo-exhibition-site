// exhibition-control.js
// ==============================================
// 法政大学 小金井写真部 写真展サイト 自動制御スクリプト
// 対応内容：
// - openDate / startDate / endDate に基づく4段階制御
// - 投票フォーム・作品一覧・結果概要ボタン自動切替
// - ナビゲーション年度自動切替（4月始まり）
// ==============================================

// === 写真展ごとの設定 ===
const exhibitions = {
  "2025": {
    summer: {
      openDate:  new Date("2025-09-15T00:00:00"),
      startDate: new Date("2025-09-20T00:00:00"),
      endDate:   new Date("2025-09-27T23:59:59"),
      worksPasswordURL: "works.html",
      worksPublicURL: "af69592862e159a7cf723a78c20a47ce109d13b04db75224503159b765b84967/index.html",
      worksPublicEndDate: new Date("2025-09-19T23:59:59"),
      resultURL: "result.html",
      resultPublicEndDate: new Date("2025-09-19T23:59:59"),
      voteFormURL: "https://forms.gle/YJQeJJkgrZZoCbBs5",
      navSelector: 'a[href*="2025/summer"]'
    },
    gakusai: {
      openDate:  new Date("2025-10-13T00:00:00"),
      startDate: new Date("2025-11-01T10:00:00"),
      endDate:   new Date("2025-11-05T00:00:00"),
      worksPasswordURL: "works.html",
      worksPublicURL: "2af262a415562b8849d6ab105bd0f438e062dd5912de91680106214e07239450/index.html",
      worksPublicEndDate: new Date("2025-11-09T23:59:59"),
      resultURL: "result.html",
      resultPublicEndDate: new Date("2025-11-09T23:59:59"),
      voteFormURL: "https://forms.gle/PknQLKGvvztcN8sU6",
      navSelector: 'a[href*="2025/gakusai"]'
    },
    winter: {
      openDate:  new Date("2026-01-01T00:00:00"),
      startDate: new Date("2026-01-10T00:00:00"),
      endDate:   new Date("2026-02-15T23:59:59"),
      worksPasswordURL: "works.html",
      worksPublicURL: "public/index.html",
      resultURL: "result.html",
      voteFormURL: "https://forms.gle/exampleWinterForm",
      navSelector: 'a[href*="2025/winter"]'
    }
  },
  "2026": {
    summer: {
      openDate:  new Date("2026-08-15T00:00:00"),
      startDate: new Date("2026-08-20T00:00:00"),
      endDate:   new Date("2026-09-05T23:59:59"),
      worksPasswordURL: "works.html",
      worksPublicURL: "public/index.html",
      resultURL: "result.html",
      voteFormURL: "https://forms.gle/example2026SummerForm",
      navSelector: 'a[href*="2026/summer"]'
    },
    // 学祭・冬も同様に追記予定
  }
};

// === 現在年度を自動判定（4月始まり） ===
const now = new Date();
const currentYear = now.getMonth() + 1 >= 4 ? now.getFullYear() : now.getFullYear() - 1;

// === 現在ページの特定 ===
const path = window.location.pathname;
const match = path.match(/\/(20\d{2})\/([^/]+)\//);
const exhibitionYear = match ? match[1] : currentYear.toString();
const exhibitionKey = match ? match[2] : null;

// === メイン制御 ===
if (exhibitions[exhibitionYear] && exhibitions[exhibitionYear][exhibitionKey]) {
  const {
    openDate, startDate, endDate,
    worksPasswordURL, worksPublicURL,
    worksPublicEndDate,
    resultPublicEndDate,
    voteFormURL, resultURL
  } = exhibitions[exhibitionYear][exhibitionKey];

  // ボタン要素を取得
  const voteButton = document.querySelector(".vote-container .button");
  const worksLink = document.querySelector('.link-buttons a[href*="works"]');
  const resultLink = document.querySelector('.link-buttons a[href*="result"]');

  // === 0️⃣ 公開前 ===
  if (now < openDate) {
    if (voteButton) {
      voteButton.textContent = "まだ公開されていません";
      voteButton.classList.add("disabled");
      voteButton.removeAttribute("href");
    }
    if (worksLink) {
      worksLink.textContent = "作品一覧（非公開）";
      worksLink.classList.add("disabled");
      worksLink.removeAttribute("href");
    }
    if (resultLink) {
      resultLink.textContent = "結果概要（非公開）";
      resultLink.classList.add("disabled");
      resultLink.removeAttribute("href");
    }

  // === 1️⃣ 公開後〜投票開始前 ===
  } else if (now >= openDate && now < startDate) {
    if (voteButton) {
      voteButton.textContent = "投票期間はまだ始まっていません";
      voteButton.classList.add("disabled");
      voteButton.removeAttribute("href");
    }
    if (worksLink) {
      worksLink.textContent = "作品一覧（準備中）";
      worksLink.classList.add("disabled");
      worksLink.removeAttribute("href");
    }
    if (resultLink) {
      resultLink.textContent = "結果概要（まだ公開されていません）";
      resultLink.classList.add("disabled");
      resultLink.removeAttribute("href");
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
      worksLink.textContent = "作品一覧";
      worksLink.classList.remove("disabled");
      worksLink.setAttribute("href", worksPasswordURL);
    }
    if (resultLink) {
      resultLink.textContent = "結果概要（投票終了後に公開）";
      resultLink.classList.add("disabled");
      resultLink.removeAttribute("href");
    }

  // === 3️⃣ 投票終了後 ===
  } else {
    if (voteButton) {
      voteButton.textContent = "投票は終了しました";
      voteButton.classList.add("disabled");
      voteButton.removeAttribute("href");
    }
    if (worksLink) {
      worksLink.textContent = "作品一覧（一般公開中）";
      worksLink.classList.remove("disabled");
      worksLink.setAttribute("href", worksPublicURL);
    }
    if (resultLink) {
      resultLink.textContent = "結果概要を見る";
      resultLink.classList.remove("disabled");
      resultLink.setAttribute("href", resultURL);
    }

    // == 作品一覧の一般公開終了制御 ==
    if (worksPublicEndDate && now > worksPublicEndDate) {
      // 一般公開が期限切れの場合
      if (worksLink) {
        worksLink.textContent = "作品一覧（公開終了）";
        worksLink.classList.add("disabled");
        worksLink.removeAttribute("href");
      }
    }

    // == 結果概要の一般公開終了制御 ==
    if (resultPublicEndDate && now > resultPublicEndDate) {
      // 一般公開が期限切れの場合
      if (resultLink) {
        resultLink.textContent = "結果概要（公開終了）";
        resultLink.classList.add("disabled");
        resultLink.removeAttribute("href");
      }
    }

    // == mdファイル内リンク制御 ==
    const postWorksLinks = document.querySelectorAll(".works-link");

    if (worksPublicEndDate && now > worksPublicEndDate) {
      postWorksLinks.forEach(link => {
        link.textContent = "作品一覧（公開終了）";
        link.classList.add("disabled");
        link.removeAttribute("href");
      });
    }

    const postResultLinks = document.querySelectorAll(".result-link");

    if (resultPublicEndDate && now > resultPublicEndDate) {
      postResultLinks.forEach(link => {
        link.textContent = "結果概要（公開終了）";
        link.classList.add("disabled");
        link.removeAttribute("href");
      });
    }
  }
}

// === ナビゲーション制御 ===
const allNavLinks = document.querySelectorAll(".navbar a");
for (const navLink of allNavLinks) {
  const href = navLink.getAttribute("href");
  if (!href) continue;

  const match = href.match(/(20\d{2})/);
  if (!match) continue;

  const year = parseInt(match[1], 10);
  if (year !== currentYear) {
    navLink.classList.add("disabled");
    navLink.removeAttribute("href");
  } else {
    navLink.classList.remove("disabled");
  }
}