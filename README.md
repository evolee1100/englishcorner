# English Corner 英文角 v1.3.1

中翻英打字＋聽寫練習網站。Level 1–5 情境主題，Level 1–4 各 3 個主題、Level 5 有 8 個主題，每主題 12 句，共 240 句。純靜態網頁（HTML/CSS/JS，不用 build）。

## 功能
- **中翻英**：看中文，逐字打出英文（底線格子即時顯示），Enter 檢查；錯字標紅，錯 3 次自動給答案。
- **聽寫**：只播英文發音，聽完打出來，答對才顯示中文。
- **教你說**：答對自動朗讀；可慢速播放；點任一單字單獨發音（瀏覽器內建 Web Speech）。
- 大小寫、標點、縮寫（I'm = I am）不影響對錯；每題可設多種正確說法（`alt`）。
- 繁／簡一鍵切換（OpenCC）；深色／淺色一鍵切換（預設跟系統）。
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
