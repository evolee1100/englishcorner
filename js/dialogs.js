// 對話練習：對方（them）說一句，輪到你（you）時從三個選項選出最恰當的回答。
// 每個 you 回合只有一個 ok: true；錯的選項附 why（為什麼不好：文法錯誤或語氣不恰當）。
// 中文一律繁體，簡體由 OpenCC 即時轉換。
window.DIALOGS = [
  {
    id: "new-coworker", emoji: "🤝", title: "認識新同事", en: "Meeting a New Coworker",
    situation: "你第一天上班，同事 Amy 走過來跟你打招呼。",
    lines: [
      { who: "them", name: "Amy", en: "Hi! Are you new here? I'm Amy.", zh: "嗨！你是新來的嗎？我是 Amy。" },
      { who: "you", zh: "說對，你是新來的，很高興認識她。", options: [
        { en: "Yes, I'm new. Nice to meet you, Amy.", ok: true },
        { en: "Yes, I new. Nice to meet you.", why: "少了 am：new 是形容詞，要說 I'm new（I am new）。" },
        { en: "Yes. What do you want?", why: "太衝了，像在質問對方，第一次見面不適合。" }
      ] },
      { who: "them", name: "Amy", en: "Nice to meet you too! Which team are you on?", zh: "我也很高興認識你！你在哪個團隊？" },
      { who: "you", zh: "說你在行銷團隊，負責社群媒體。", options: [
        { en: "I'm on the marketing team. I handle social media.", ok: true },
        { en: "I'm marketing team. I'm handle social media.", why: "要說 on the marketing team；handle 是動詞，前面不能加 I'm。" },
        { en: "Marketing. Bye.", why: "太簡短又馬上說再見，對方會覺得你不想聊。" }
      ] },
      { who: "them", name: "Amy", en: "Oh, cool! How do you like it so far?", zh: "喔，不錯耶！到目前為止覺得怎麼樣？" },
      { who: "you", zh: "說你很喜歡，大家都很友善。", options: [
        { en: "I like it a lot. Everyone is very friendly.", ok: true },
        { en: "I'm like it a lot. Everyone are friendly.", why: "like 是動詞，前面不加 I'm；everyone 當單數，要用 is。" },
        { en: "It's okay, I guess. The office is too cold.", why: "文法沒錯，但第一次聊天就抱怨，給人的印象不好。" }
      ] },
      { who: "them", name: "Amy", en: "Great! Let me know if you need anything.", zh: "太好了！有需要什麼就跟我說。" },
      { who: "you", zh: "謝謝她的好意。", options: [
        { en: "Thanks, Amy. That's very kind of you.", ok: true },
        { en: "Thanks you, Amy.", why: "要說 Thank you 或 Thanks，沒有 Thanks you。" },
        { en: "I know.", why: "I know 聽起來像「我早就知道了」，不太禮貌。" }
      ] },
      { who: "them", name: "Amy", en: "You're welcome. See you at lunch!", zh: "不客氣，午餐見！" }
    ]
  },
  {
    id: "ask-help", emoji: "💻", title: "請同事幫忙", en: "Asking a Coworker for Help",
    situation: "你的筆電出問題，同事 Ben 剛好經過。",
    lines: [
      { who: "them", name: "Ben", en: "Hey, you look busy. What's up?", zh: "嘿，你看起來很忙。怎麼了？" },
      { who: "you", zh: "說你的筆電壞了，問他可不可以幫忙看一下。", options: [
        { en: "My laptop isn't working. Could you take a look?", ok: true },
        { en: "My laptop is broke. You help me now.", why: "要說 broken；You help me now 像命令，請人幫忙要用 Could you…?" },
        { en: "My laptop don't work. Can you look?", why: "laptop 是單數，要用 doesn't / isn't；look 後面要加 at it。" }
      ] },
      { who: "them", name: "Ben", en: "Sure. What's the problem?", zh: "好啊，什麼問題？" },
      { who: "you", zh: "說它一直當機。", options: [
        { en: "It keeps crashing.", ok: true },
        { en: "It keep crashing.", why: "it 是第三人稱，動詞要加 s：keeps。" },
        { en: "It is crash all the time.", why: "is 後面不能直接接動詞原形；說 It keeps crashing。" }
      ] },
      { who: "them", name: "Ben", en: "Let me restart it... There, it works now.", zh: "我重開看看……好了，現在可以用了。" },
      { who: "you", zh: "很感謝他，說要請他喝咖啡。", options: [
        { en: "Thank you so much! Let me buy you a coffee.", ok: true },
        { en: "Thank you so much! I buy you coffee.", why: "要說 Let me buy you a coffee 或 I'll buy you a coffee。" },
        { en: "Okay.", why: "對方幫了你，只說 Okay 太冷淡。" }
      ] },
      { who: "them", name: "Ben", en: "Ha, no problem. Anytime!", zh: "哈，不客氣，隨時找我！" }
    ]
  },
  {
    id: "meeting", emoji: "📊", title: "會議中提出想法", en: "Speaking Up in a Meeting",
    situation: "行銷會議中，主管 Linda 問大家有沒有想法。",
    lines: [
      { who: "them", name: "Linda", en: "Our Instagram reach dropped last month. Any ideas?", zh: "我們上個月 IG 觸及率下降了，大家有什麼想法？" },
      { who: "you", zh: "說你有個想法：可以多發短影片。", options: [
        { en: "I have an idea. We could post more short videos.", ok: true },
        { en: "I'm have an idea. We can posting more short videos.", why: "have 是動詞，前面不加 I'm；can 後面要用原形 post。" },
        { en: "Your plan is bad. We need videos.", why: "直接說別人的計畫很爛太不客氣，先提出自己的建議就好。" }
      ] },
      { who: "them", name: "Linda", en: "Interesting. Why do you think that would help?", zh: "有意思。為什麼你覺得有幫助？" },
      { who: "you", zh: "說因為短影片的互動比照片多。", options: [
        { en: "Because short videos get more engagement than photos.", ok: true },
        { en: "Because short videos gets more engagement than photos.", why: "videos 是複數，動詞用 get，不加 s。" },
        { en: "Because I like videos.", why: "只說自己喜歡沒有說服力，要給理由或數據。" }
      ] },
      { who: "them", name: "Linda", en: "Good point. Can you prepare a plan by Friday?", zh: "說得好。你可以在週五前準備一份計畫嗎？" },
      { who: "you", zh: "答應她，說會在週五前寄給她。", options: [
        { en: "Sure. I'll send it to you by Friday.", ok: true },
        { en: "Sure. I send it to you by Friday.", why: "答應未來要做的事，要用 I'll（I will）。" },
        { en: "Maybe. I'm very busy.", why: "主管交辦時說 Maybe 會顯得不積極；有困難要說明具體原因。" }
      ] },
      { who: "them", name: "Linda", en: "Perfect. Thanks, everyone.", zh: "太好了，謝謝大家。" }
    ]
  },
  {
    id: "client-call", emoji: "📞", title: "打電話給客戶", en: "Calling a Client",
    situation: "你扮演 ABC Marketing 的 Alex，打電話向客戶 David Lee 報告廣告成效。",
    lines: [
      { who: "them", name: "David", en: "Hello, this is David Lee.", zh: "你好，我是 David Lee。" },
      { who: "you", zh: "介紹自己：你是 ABC Marketing 的 Alex。", options: [
        { en: "Hi Mr. Lee, this is Alex from ABC Marketing.", ok: true },
        { en: "Hello? Who is this?", why: "是你打給對方，應該先介紹自己。" },
        { en: "Hi Mr. Lee, I am Alex of ABC Marketing.", why: "電話中自我介紹習慣說 this is…；公司用 from，不用 of。" }
      ] },
      { who: "them", name: "David", en: "Hi Alex. What can I do for you?", zh: "嗨 Alex，有什麼事嗎？" },
      { who: "you", zh: "說你打來是要談上個月的廣告成效。", options: [
        { en: "I'm calling about last month's ad results.", ok: true },
        { en: "I call about last month's ad results.", why: "現在正在打電話，要用現在進行式 I'm calling。" },
        { en: "I'm calling for talk about last month's ads.", why: "要說 to talk about，不是 for talk。" }
      ] },
      { who: "them", name: "David", en: "Okay. How did the ads do?", zh: "好，廣告效果怎麼樣？" },
      { who: "you", zh: "說點擊數增加了 30%，但銷售沒有增加多少。", options: [
        { en: "Clicks went up 30%, but sales didn't increase much.", ok: true },
        { en: "Clicks go up 30%, but sales don't increase much.", why: "說的是上個月，要用過去式：went up、didn't increase。" },
        { en: "The ads were bad.", why: "只給結論、沒有數據，客戶會緊張；先講具體數字。" }
      ] },
      { who: "them", name: "David", en: "Hmm. What do you suggest?", zh: "嗯，那你有什麼建議？" },
      { who: "you", zh: "建議改善到達頁面。", options: [
        { en: "I suggest we improve the landing page.", ok: true },
        { en: "I suggest to improve the landing page.", why: "suggest 後面不接 to + 動詞；說 suggest we improve 或 suggest improving。" },
        { en: "You should fix your website. It's terrible.", why: "直接說客戶網站很爛太冒犯，用 I suggest… 比較專業。" }
      ] },
      { who: "them", name: "David", en: "Sounds good. Please email me the details.", zh: "聽起來不錯，細節請用 email 寄給我。" },
      { who: "you", zh: "答應今天下午寄給他。", options: [
        { en: "Sure, I'll email you this afternoon.", ok: true },
        { en: "Sure, I emailed you this afternoon.", why: "還沒寄，要用未來式 I'll email。" },
        { en: "Okay, bye.", why: "跟客戶講電話，結尾要確認下一步，這樣太突然。" }
      ] },
      { who: "them", name: "David", en: "Great. Thanks, Alex.", zh: "很好，謝謝你，Alex。" }
    ]
  },
  {
    id: "coffee", emoji: "☕", title: "點咖啡", en: "Ordering Coffee",
    situation: "你在咖啡店櫃檯，店員準備幫你點餐。",
    lines: [
      { who: "them", name: "Barista", en: "Hi! What can I get for you?", zh: "嗨！要點什麼？" },
      { who: "you", zh: "點一杯中杯熱拿鐵。", options: [
        { en: "Can I get a medium hot latte, please?", ok: true },
        { en: "Give me a latte.", why: "Give me 聽起來像命令；點餐用 Can I get… 或 I'd like… 比較禮貌。" },
        { en: "I want drink latte medium hot.", why: "少了 to、語序也不對；說 Can I get a medium hot latte?" }
      ] },
      { who: "them", name: "Barista", en: "Sure. For here or to go?", zh: "好的，內用還是外帶？" },
      { who: "you", zh: "說外帶。", options: [
        { en: "To go, please.", ok: true },
        { en: "Go out, please.", why: "外帶是 to go；go out 是「出去」。" },
        { en: "Take me away.", why: "意思變成「把我帶走」。外帶說 To go（英式說 Takeaway）。" }
      ] },
      { who: "them", name: "Barista", en: "Anything else?", zh: "還需要什麼嗎？" },
      { who: "you", zh: "說不用了，問可不可以刷卡。", options: [
        { en: "No, that's all. Can I pay by card?", ok: true },
        { en: "No more. Can I pay with card?", why: "要說 that's all；with a card 或 by card。" },
        { en: "No. Card.", why: "太簡短，聽起來很沒禮貌。" }
      ] },
      { who: "them", name: "Barista", en: "Of course. That's $4.50.", zh: "當然可以，一共四塊五。" },
      { who: "you", zh: "付錢並道謝。", options: [
        { en: "Here you go. Thank you!", ok: true },
        { en: "Here you are go. Thank you!", why: "說 Here you go 或 Here you are，不要混在一起。" },
        { en: "Fine.", why: "付錢時說 Fine 很冷淡；說 Here you go / Thank you。" }
      ] },
      { who: "them", name: "Barista", en: "Thanks! Your latte will be ready soon.", zh: "謝謝！拿鐵馬上就好。" }
    ]
  },
  {
    id: "day-off", emoji: "🗓", title: "跟主管請假", en: "Asking for a Day Off",
    situation: "你想下週五請假，去找主管 Linda。",
    lines: [
      { who: "them", name: "Linda", en: "Hi, did you want to see me?", zh: "嗨，你找我嗎？" },
      { who: "you", zh: "問她現在有沒有空說幾句話。", options: [
        { en: "Yes. Do you have a minute?", ok: true },
        { en: "Yes. You have time now? I need talk.", why: "問句要用 Do you have…?；need to talk，要加 to。" },
        { en: "Yes. I'm need to talk to you.", why: "need 是動詞，前面不加 I'm。" }
      ] },
      { who: "them", name: "Linda", en: "Sure. What's up?", zh: "當然，怎麼了？" },
      { who: "you", zh: "說你下週五想請一天假。", options: [
        { en: "I'd like to take next Friday off.", ok: true },
        { en: "I want take off next Friday.", why: "want 後面要加 to：want to take。" },
        { en: "I'm not coming next Friday.", why: "像在通知而不是請求，主管會覺得不被尊重。" }
      ] },
      { who: "them", name: "Linda", en: "Hmm, we have the product launch that week.", zh: "嗯，那週有產品發表會耶。" },
      { who: "you", zh: "說你知道，你會在週四前把工作做完。", options: [
        { en: "I know. I'll finish my tasks before Thursday.", ok: true },
        { en: "I know. I finished my tasks before Thursday.", why: "還沒做完，要用未來式 I'll finish。" },
        { en: "That's not my problem.", why: "太不客氣，要先說明你會怎麼處理手上的工作。" }
      ] },
      { who: "them", name: "Linda", en: "Okay, that works. Enjoy your day off!", zh: "好，可以。休假愉快！" },
      { who: "you", zh: "謝謝她。", options: [
        { en: "Thank you. I really appreciate it.", ok: true },
        { en: "Thank you. I'm really appreciate it.", why: "appreciate 是動詞，前面不加 I'm。" },
        { en: "Finally.", why: "聽起來像在抱怨主管太晚答應，很不禮貌。" }
      ] }
    ]
  },
  {
    id: "weekend", emoji: "🌤", title: "週一聊週末", en: "Small Talk About the Weekend",
    situation: "週一早上，同事 Amy 在茶水間問你週末過得如何。",
    lines: [
      { who: "them", name: "Amy", en: "Morning! How was your weekend?", zh: "早安！週末過得怎麼樣？" },
      { who: "you", zh: "說很棒，你去爬山了。", options: [
        { en: "It was great. I went hiking.", ok: true },
        { en: "It is great. I go hiking.", why: "週末已經過去了，要用過去式：was、went。" },
        { en: "Why do you ask?", why: "這只是寒暄，這樣回答會讓對方覺得你不想聊。" }
      ] },
      { who: "them", name: "Amy", en: "Nice! Where did you go?", zh: "不錯耶！去哪裡？" },
      { who: "you", zh: "說你去了陽明山，天氣很好。", options: [
        { en: "I went to Yangmingshan. The weather was really nice.", ok: true },
        { en: "I go to Yangmingshan. The weather is really nice.", why: "說的是上週末，要用過去式：went、was。" },
        { en: "I'm went to Yangmingshan.", why: "went 是動詞，前面不加 I'm。" }
      ] },
      { who: "them", name: "Amy", en: "Sounds fun. I just stayed home and slept.", zh: "聽起來好好玩。我只是待在家睡覺。" },
      { who: "you", zh: "問她：那也很好啊，有休息到嗎？", options: [
        { en: "That sounds nice too. Did you get some rest?", ok: true },
        { en: "That sounds nice too. Do you got some rest?", why: "問過去的事用 Did you get…?（did 後面用原形）。" },
        { en: "That's boring.", why: "直接說別人的週末很無聊，很不禮貌。" }
      ] },
      { who: "them", name: "Amy", en: "Yes, I feel great now. Let's grab coffee later!", zh: "有啊，現在精神很好。晚點一起去買咖啡吧！" }
    ]
  },
  {
    id: "presentation", emoji: "🖥", title: "客戶簡報開場", en: "Opening a Client Presentation",
    situation: "你要向客戶簡報下一季的行銷計畫，現在是開場。",
    lines: [
      { who: "them", name: "Client", en: "Okay, we're all here. You can start.", zh: "好，大家都到了，你可以開始了。" },
      { who: "you", zh: "謝謝大家今天來。", options: [
        { en: "Thank you all for coming today.", ok: true },
        { en: "Thank you all for come today.", why: "for 後面的動詞要加 -ing：for coming。" },
        { en: "Okay, listen to me.", why: "像在下命令，對客戶太不客氣。" }
      ] },
      { who: "them", name: "Client", en: "Our pleasure. What are we looking at today?", zh: "不客氣。今天要看什麼？" },
      { who: "you", zh: "說今天要介紹下一季的行銷計畫。", options: [
        { en: "Today I'll present our marketing plan for next quarter.", ok: true },
        { en: "Today I present our marketing plan for last quarter.", why: "要用 I'll present；而且是下一季（next quarter），不是上一季。" },
        { en: "Today I'm present our marketing plan.", why: "present 在這裡是動詞，前面不加 I'm。" }
      ] },
      { who: "them", name: "Client", en: "Great. How long will it take?", zh: "很好。大概要多久？" },
      { who: "you", zh: "說大約二十分鐘，最後會留時間問問題。", options: [
        { en: "About twenty minutes. I'll leave time for questions at the end.", ok: true },
        { en: "About twenty minute. I leave time for question at the end.", why: "twenty minutes、questions 要用複數；未來的安排用 I'll leave。" },
        { en: "I don't know. Maybe one hour.", why: "簡報者應該知道自己要講多久，這樣回答顯得沒準備。" }
      ] },
      { who: "them", name: "Client", en: "Perfect. Go ahead.", zh: "太好了，請開始。" }
    ]
  },
  {
    id: "return", emoji: "🛍", title: "到店裡退貨", en: "Returning an Item",
    situation: "你上週買的外套太小，拿回店裡想退貨。",
    lines: [
      { who: "them", name: "Staff", en: "Hi, how can I help you?", zh: "你好，有什麼可以幫你的嗎？" },
      { who: "you", zh: "說你想退這件外套。", options: [
        { en: "Hi, I'd like to return this jacket.", ok: true },
        { en: "Hi, I want return this jacket.", why: "want 後面要加 to：want to return（更禮貌是 I'd like to）。" },
        { en: "This jacket is bad. Money back.", why: "太衝也不完整，店員會覺得你在找麻煩。" }
      ] },
      { who: "them", name: "Staff", en: "Sure. Is there a problem with it?", zh: "好的。這件有什麼問題嗎？" },
      { who: "you", zh: "說它太小了。", options: [
        { en: "It's too small for me.", ok: true },
        { en: "It's too much small for me.", why: "too 後面直接加形容詞：too small，不加 much。" },
        { en: "I'm too small.", why: "意思變成「我太小了」；是外套太小：It's too small。" }
      ] },
      { who: "them", name: "Staff", en: "Do you have the receipt?", zh: "你有收據嗎？" },
      { who: "you", zh: "說有，在這裡，你上週買的。", options: [
        { en: "Yes, here it is. I bought it last week.", ok: true },
        { en: "Yes, here it is. I buy it last week.", why: "last week 要用過去式 bought。" },
        { en: "Yes, here is it.", why: "語序要說 here it is。" }
      ] },
      { who: "them", name: "Staff", en: "Thanks. Would you like a refund or a different size?", zh: "謝謝。你要退款還是換別的尺寸？" },
      { who: "you", zh: "說你想換大一號的。", options: [
        { en: "I'd like a bigger size, please.", ok: true },
        { en: "I'd like a more big size, please.", why: "big 的比較級是 bigger，不說 more big。" },
        { en: "Whatever.", why: "很不禮貌，像是不在乎。" }
      ] },
      { who: "them", name: "Staff", en: "No problem. I'll get one for you.", zh: "沒問題，我去幫你拿。" }
    ]
  },
  {
    id: "directions", emoji: "🗺", title: "問路", en: "Asking for Directions",
    situation: "你在國外找不到捷運站，想問路人。",
    lines: [
      { who: "them", name: "Stranger", en: "Hi there. Are you okay? You look lost.", zh: "嗨，你還好嗎？你看起來迷路了。" },
      { who: "you", zh: "說不好意思，問最近的捷運站在哪裡。", options: [
        { en: "Excuse me, where is the nearest subway station?", ok: true },
        { en: "Excuse me, where the nearest subway station is?", why: "直接問的時候要倒裝：where is the station?" },
        { en: "Subway. Where.", why: "太簡短，聽起來沒禮貌。" }
      ] },
      { who: "them", name: "Stranger", en: "Go straight and turn left at the bank. It's on your right.", zh: "直走，在銀行左轉，它就在你右手邊。" },
      { who: "you", zh: "確認：在銀行左轉，對嗎？", options: [
        { en: "Turn left at the bank, right?", ok: true },
        { en: "Turn left in the bank, right?", why: "在某個地點轉彎用 at the bank；in the bank 是「在銀行裡面」。" },
        { en: "Turn right at the bank?", why: "對方說的是左轉（left），你聽錯了。" }
      ] },
      { who: "them", name: "Stranger", en: "That's right. It takes about five minutes.", zh: "對。走路大概五分鐘。" },
      { who: "you", zh: "謝謝對方的幫忙。", options: [
        { en: "Thank you so much for your help!", ok: true },
        { en: "Thank you so much for your helping!", why: "for your help；help 在這裡是名詞，不加 -ing。" },
        { en: "Okay.", why: "對方幫你指路，只說 Okay 太冷淡。" }
      ] },
      { who: "them", name: "Stranger", en: "You're welcome. Have a nice day!", zh: "不客氣，祝你有美好的一天！" }
    ]
  }
];
