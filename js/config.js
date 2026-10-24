// Supabase 設定：填入 Project URL 與 anon public key 即啟用「Email 登入 + 跨裝置同步」。
// 留空時網站照常運作，進度只存在這台裝置的瀏覽器。
// ⚠️ 只能填 anon public key，絕對不要填 service_role key。
window.EC_CONFIG = {
  version: "1.0.0",
  supabaseUrl: "",
  supabaseAnonKey: ""
};
