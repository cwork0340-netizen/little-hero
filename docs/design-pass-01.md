# Design Pass 01 — Soft Storybook UI

本次設計優化目標：將 Little Hero 從工程 Demo 推進到「兒童繪本風平板 App」的第一版視覺架構。

## 已完成

- 建立 `design/soft-storybook-ui` 分支
- 重構首頁外層為平板優先的 storybook frame
- 新增 `WorldScene` 元件，將左側改為故事世界場景
- 任務卡重新設計為大尺寸兒童觸控卡片
- 底部導航改為膠囊式平板導航
- 擴充主題資料結構：gradient、decorations、taskTitle、completionPhrase
- 補上 global design tokens 與世界場景 CSS

## 設計方向

首頁不再只是任務清單，而是：

> 孩子完成任務 → 世界變亮 → 角色給回饋 → 累積徽章。

## 下一輪建議

1. 將 emoji 角色替換為正式 PNG / SVG 去背角色素材。
2. 家長模式仍偏工程後台，下一輪需改成卡片式設定中心。
3. 主題切換頁需要做成「世界選擇卡」。
4. AllDone 完成頁可改成故事進度結算頁。
5. 手機直向 RWD 仍需實機測試。
