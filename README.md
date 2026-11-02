# English Corner 英文角 v2.1.0

英文練習網站：排序、中翻英、聽寫、跟讀四種練習，加上闖關挑戰與情境對話。Level 0–5 由易到難，另有「工作英文：數位行銷」與選修「C1 挑戰」，共 396 句、每句附文法說明；10 個情境對話。純靜態網頁（HTML/CSS/JS，不用 build）。

## 功能
- **🧩 排序**：英文字都給你，依中文意思點字排成句子（最簡單的入門方式）。
- **🎤 跟讀**：聽標準發音後按麥克風把整句念出來，逐字顯示念到 ✓／沒念到 ✗，念對 80% 以上過關；可回放自己的錄音（iOS 不錄音）。語音辨識需要 Chrome 或 Safari。
- **💬 對話練習**：對方說一句（有發音），你用英文把回答說出來（或切換成用選的）；說成錯的選項或選錯會說明是文法錯還是語氣不恰當。題目在 `js/dialogs.js`。
- **🏆 闖關挑戰**：Level 0–5 的句子由短到長每 10 句一關，3 條命、依剩下的命拿星星，拿到星星才開下一關（排序或打字模式）。
- **中翻英**：看中文，逐字打出英文（底線格子即時顯示），Enter 檢查；錯字標紅，錯 3 次自動給答案。
- **聽寫**：只播英文發音，聽完打出來，答對才顯示中文。
- **教你說**：答對自動朗讀；可慢速播放；點任一單字單獨發音；可選美式或英式發音（瀏覽器內建 Web Speech，口音取決於裝置有哪些語音）。
- 大小寫、標點、縮寫（I'm = I am）不影響對錯；每題可設多種正確說法（`alt`）。
- 繁／簡一鍵切換（OpenCC）；深色／淺色一鍵切換（預設淺色）。
- 進度存瀏覽器；設定 Supabase 後可 Email 登入、跨裝置同步。

## 本機執行
```
python3 -m http.server 5173
```
開 http://localhost:5173

## 啟用 Supabase 同步
1. Supabase → SQL Editor 執行 `supabase/schema.sql`（建立 `ec_progress` 表與 RLS）。
2. Authentication → URL Configuration → Redirect URLs 加入網站網址（本機：`http://localhost:5173`，上線後加正式網址）。
3. Authentication → Providers → Email 保持開啟（Magic Link）。
4. 把 Project URL 與 **anon public key** 填入 `js/config.js`。不要填 service_role key。

Supabase 內建寄信服務每小時只能寄少量信，正式公開前要在 Authentication → SMTP 設定自己的寄信服務。

## 新增題目
編輯 `js/data.js`，中文一律用繁體撰寫，簡體會自動轉換。

## 發版
每次更新：把 `js/config.js` 的 `version` 和 `index.html` 裡所有 `?v=` 改成同一個新版本號，避免瀏覽器拿到舊的 JS/CSS（GitHub Pages 快取 10 分鐘）。
