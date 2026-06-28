# Claude Code QA Checklist

請在本地切到 `design/soft-storybook-ui` 後執行：

```bash
npm install
npm run build
npm run dev
```

## 必測流程

- 選擇孩子進入首頁
- 任務完成動畫可正常顯示
- 任務拖曳排序仍可用
- 全部完成後會進入今日完成頁
- 底部導航可切換成就與設定
- 家長 PIN `1234` 可進入
- localStorage 仍保存孩子資料

## 視覺驗收

- 首頁左側應明顯是故事世界，不是一般 dashboard
- 任務卡按鈕不小於 44px
- 平板橫向不應出現擁擠或截斷
- 任務文案仍保留故事感
- 顏色應保持柔和、明亮、低壓力
