# Little Hero 🌟

> 兒童放學後習慣養成 App — 每天放學，開始你的冒險！

## 技術棧

- React 18 + Vite 5
- 純 CSS-in-JS（inline styles）
- localStorage 本地儲存
- PWA manifest

## 快速開始

```bash
npm install
npm run dev
```

## 部署到 Vercel

1. 推到 GitHub repo
2. 在 Vercel 連接 repo
3. Framework preset 選 **Vite**
4. 自動部署 ✅

## 專案結構

```
src/
├── components/     # 共用元件
│   ├── WoodSign.jsx      # 木頭招牌標題
│   ├── ProgressBar.jsx   # 進度條
│   ├── StarBurst.jsx     # 星星爆炸動畫
│   ├── TaskCard.jsx      # 任務卡片
│   └── BottomNav.jsx     # 底部導覽列
├── pages/          # 各畫面
│   ├── SelectChild.jsx   # 選擇孩子
│   ├── MainScreen.jsx    # 主畫面（雙欄）
│   └── AllScreens.jsx    # AllDone / 成就 / PIN / 家長設定
├── data/           # 資料定義
│   ├── themes.js         # 4 種主題設定
│   └── tasks.js          # 任務、成就、獎勵資料
├── styles/
│   ├── global.css        # 全域樣式 + 動畫
│   └── tokens.js         # 設計 token（色盤）
├── utils/
│   └── storage.js        # localStorage helpers
├── App.jsx               # 主路由
└── main.jsx              # 入口
```

## 素材說明

`src/assets/` 請放入 GPT 生成的圖片素材：
- `bear.png` — 小熊角色
- `treehouse.png` — 樹屋
- `forest-bg.png` — 森林背景
- `star.png` — 星星角色

## 家長模式

PIN 碼：**1234**（開發測試用，之後改為可自訂）
