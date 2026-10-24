// Supabase 設定：填入 Project URL 與 anon public key 即啟用「Email 登入 + 跨裝置同步」。
// 留空時網站照常運作，進度只存在這台裝置的瀏覽器。
// ⚠️ 只能填 publishable / anon public key，絕對不要填 secret / service_role key。
window.EC_CONFIG = {
  version: "1.3.3",
  supabaseUrl: "https://lngydnuzoqdyjnhkzjho.supabase.co",
  supabaseAnonKey: "sb_publishable_pWDfb8BfxhG_EYekWZ_MIw_e7_5T0KT"
};
