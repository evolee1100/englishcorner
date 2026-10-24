// 題庫：中文一律以繁體撰寫，簡體由 OpenCC 即時轉換。
// en = 標準答案（顯示用）；alt = 其他也算對的說法。
// 每個 Level 3 個情境主題，每主題 12 句，難度由短到長。
window.LEVELS = [
  {
    id: 1, name: "入門", en: "Starter", color: "coral",
    desc: "問候、自我介紹、表達感受",
    topics: [
      {
        id: "1-1", name: "打招呼", en: "Greetings",
        items: [
          { zh: "早安", en: "Good morning." },
          { zh: "你好嗎？", en: "How are you?" },
          { zh: "我很好，謝謝。", en: "I'm fine, thank you.", alt: ["I'm fine, thanks.", "I'm good, thank you."] },
          { zh: "很高興認識你。", en: "Nice to meet you." },
          { zh: "好久不見！", en: "Long time no see!" },
          { zh: "你最近過得怎麼樣？", en: "How have you been?" },
          { zh: "明天見。", en: "See you tomorrow." },
          { zh: "祝你有美好的一天。", en: "Have a nice day.", alt: ["Have a good day.", "Have a great day."] },
          { zh: "謝謝你的幫忙。", en: "Thank you for your help.", alt: ["Thanks for your help."] },
          { zh: "不客氣。", en: "You're welcome." },
          { zh: "不好意思，打擾一下。", en: "Excuse me." },
          { zh: "對不起，我遲到了。", en: "Sorry, I'm late.", alt: ["I'm sorry I'm late.", "Sorry I'm late."] }
        ]
      },
      {
        id: "1-2", name: "自我介紹", en: "About Me",
        items: [
          { zh: "我叫大衛。", en: "My name is David.", alt: ["I'm David."] },
          { zh: "我來自台灣。", en: "I'm from Taiwan.", alt: ["I come from Taiwan."] },
          { zh: "我住在台北。", en: "I live in Taipei." },
          { zh: "我是一名學生。", en: "I'm a student." },
          { zh: "我今年二十五歲。", en: "I'm twenty-five years old.", alt: ["I am 25 years old.", "I'm 25 years old.", "I'm twenty-five."] },
          { zh: "我喜歡看電影。", en: "I like watching movies.", alt: ["I like to watch movies."] },
          { zh: "我有一個妹妹。", en: "I have a younger sister.", alt: ["I have a little sister."] },
          { zh: "我在一家銀行工作。", en: "I work at a bank.", alt: ["I work in a bank."] },
          { zh: "我的興趣是畫畫。", en: "My hobby is drawing.", alt: ["My hobby is painting."] },
          { zh: "我正在學英文。", en: "I'm learning English.", alt: ["I'm studying English."] },
          { zh: "我週末通常待在家。", en: "I usually stay at home on weekends.", alt: ["I usually stay home on weekends."] },
          { zh: "我想交更多朋友。", en: "I want to make more friends." }
        ]
      },
      {
        id: "1-3", name: "表達感受", en: "Feelings",
        items: [
          { zh: "更有自信", en: "more confident" },
          { zh: "我覺得更有自信了。", en: "I feel more confident." },
          { zh: "我好累。", en: "I'm so tired.", alt: ["I'm very tired.", "I'm really tired."] },
          { zh: "我肚子餓了。", en: "I'm hungry." },
          { zh: "我今天很開心。", en: "I'm very happy today.", alt: ["I'm so happy today.", "I'm really happy today."] },
          { zh: "我有點緊張。", en: "I'm a little nervous.", alt: ["I'm a bit nervous."] },
          { zh: "別擔心。", en: "Don't worry." },
          { zh: "我為你感到驕傲。", en: "I'm proud of you." },
          { zh: "這太好笑了！", en: "This is so funny!", alt: ["That's so funny!", "This is hilarious!"] },
          { zh: "我很無聊。", en: "I'm bored." },
          { zh: "聽到這個我很難過。", en: "I'm sorry to hear that." },
          { zh: "我等不及要見你了。", en: "I can't wait to see you." }
        ]
      }
    ]
  },
  {
    id: 2, name: "基礎", en: "Elementary", color: "amber",
    desc: "日常作息、餐廳點餐、購物",
    topics: [
      {
        id: "2-1", name: "日常作息", en: "Daily Routine",
        items: [
          { zh: "我每天早上七點起床。", en: "I get up at seven every morning.", alt: ["I wake up at seven every morning.", "I get up at 7 every morning.", "I wake up at 7 every morning."] },
          { zh: "我通常早餐喝咖啡。", en: "I usually have coffee for breakfast.", alt: ["I usually drink coffee for breakfast."] },
          { zh: "我搭公車去上班。", en: "I take the bus to work.", alt: ["I go to work by bus."] },
          { zh: "我中午在公司吃午餐。", en: "I have lunch at the office.", alt: ["I eat lunch at the office."] },
          { zh: "我六點下班。", en: "I get off work at six.", alt: ["I finish work at six.", "I get off work at 6."] },
          { zh: "晚餐後我會去散步。", en: "I go for a walk after dinner.", alt: ["I take a walk after dinner."] },
          { zh: "我睡前會看一下書。", en: "I read a little before bed.", alt: ["I read a bit before bed.", "I read for a while before bed."] },
          { zh: "我每週運動三次。", en: "I exercise three times a week.", alt: ["I work out three times a week."] },
          { zh: "我週末會打掃房間。", en: "I clean my room on weekends.", alt: ["I clean my room on the weekend."] },
          { zh: "我今天忘了帶雨傘。", en: "I forgot to bring my umbrella today.", alt: ["I forgot my umbrella today."] },
          { zh: "昨晚我很晚才睡。", en: "I went to bed late last night.", alt: ["I stayed up late last night."] },
          { zh: "我需要早一點睡覺。", en: "I need to go to bed earlier.", alt: ["I need to sleep earlier."] }
        ]
      },
      {
        id: "2-2", name: "餐廳點餐", en: "At a Restaurant",
        items: [
          { zh: "請給我菜單。", en: "Can I have the menu, please?", alt: ["Could I have the menu, please?", "The menu, please."] },
          { zh: "請問兩位有位子嗎？", en: "Do you have a table for two?" },
          { zh: "我要點這個。", en: "I'll have this one.", alt: ["I'll have this.", "I'd like this one."] },
          { zh: "你推薦什麼？", en: "What do you recommend?", alt: ["What would you recommend?"] },
          { zh: "我對花生過敏。", en: "I'm allergic to peanuts." },
          { zh: "請不要加冰塊。", en: "No ice, please." },
          { zh: "我要一杯熱拿鐵。", en: "I'd like a hot latte.", alt: ["I'll have a hot latte.", "Can I have a hot latte?"] },
          { zh: "內用還是外帶？", en: "For here or to go?" },
          { zh: "這道菜有點太鹹了。", en: "This dish is a little too salty.", alt: ["This dish is a bit too salty."] },
          { zh: "可以幫我打包嗎？", en: "Can I get this to go?", alt: ["Can you wrap this up for me?", "Could I get a box for this?"] },
          { zh: "麻煩結帳。", en: "Check, please.", alt: ["Can I have the check, please?", "Could I get the bill, please?", "Bill, please."] },
          { zh: "可以刷卡嗎？", en: "Can I pay by card?", alt: ["Do you take credit cards?", "Can I pay with a card?"] }
        ]
      },
      {
        id: "2-3", name: "購物", en: "Shopping",
        items: [
          { zh: "這個多少錢？", en: "How much is this?" },
          { zh: "我只是看看。", en: "I'm just looking.", alt: ["I'm just browsing."] },
          { zh: "可以試穿嗎？", en: "Can I try it on?", alt: ["May I try it on?"] },
          { zh: "有小一號的嗎？", en: "Do you have a smaller size?", alt: ["Do you have this in a smaller size?"] },
          { zh: "有其他顏色嗎？", en: "Do you have it in other colors?", alt: ["Does it come in other colors?", "Do you have other colors?"] },
          { zh: "這太貴了。", en: "It's too expensive.", alt: ["This is too expensive."] },
          { zh: "可以算便宜一點嗎？", en: "Can you give me a discount?", alt: ["Can you make it cheaper?", "Could you give me a discount?"] },
          { zh: "這件有在打折嗎？", en: "Is this on sale?" },
          { zh: "我要買這件。", en: "I'll take it.", alt: ["I'll take this one.", "I'll buy this one."] },
          { zh: "可以給我一個袋子嗎？", en: "Can I have a bag?", alt: ["Could I have a bag, please?", "Can I get a bag?"] },
          { zh: "我想退這件衣服。", en: "I'd like to return this.", alt: ["I want to return this.", "I'd like to return this shirt."] },
          { zh: "收據在這裡。", en: "Here's the receipt.", alt: ["Here is the receipt.", "Here's my receipt."] }
        ]
      }
    ]
  },
  {
    id: 3, name: "中級", en: "Intermediate", color: "green",
    desc: "旅遊、交通、看醫生",
    topics: [
      {
        id: "3-1", name: "旅遊住宿", en: "Travel & Hotels",
        items: [
          { zh: "我訂了一間雙人房。", en: "I booked a double room.", alt: ["I've booked a double room.", "I have a reservation for a double room."] },
          { zh: "我想辦理入住。", en: "I'd like to check in.", alt: ["I want to check in."] },
          { zh: "退房時間是幾點？", en: "What time is checkout?", alt: ["What time is check-out?", "When is checkout?"] },
          { zh: "早餐有包含在房價裡嗎？", en: "Is breakfast included?", alt: ["Is breakfast included in the price?"] },
          { zh: "Wi-Fi 密碼是什麼？", en: "What's the Wi-Fi password?", alt: ["What is the WiFi password?", "What's the WiFi password?"] },
          { zh: "可以幫我保管行李嗎？", en: "Could you keep my luggage for me?", alt: ["Can you hold my luggage?", "Could you hold my bags for me?"] },
          { zh: "附近有什麼好玩的地方？", en: "Are there any fun places nearby?", alt: ["What are some fun places nearby?", "What's fun to do around here?"] },
          { zh: "這是我第一次來這裡。", en: "This is my first time here." },
          { zh: "你可以幫我們拍張照嗎？", en: "Could you take a picture of us?", alt: ["Can you take a photo of us?", "Could you take a photo of us?"] },
          { zh: "我的房間冷氣壞了。", en: "The air conditioner in my room is broken.", alt: ["The AC in my room isn't working.", "The air conditioning in my room is broken."] },
          { zh: "我想多住一晚。", en: "I'd like to stay one more night.", alt: ["I want to stay one more night.", "I'd like to extend my stay by one night."] },
          { zh: "這趟旅行比我預期的還要棒。", en: "This trip was better than I expected.", alt: ["The trip was better than I expected."] }
        ]
      },
      {
        id: "3-2", name: "交通問路", en: "Getting Around",
        items: [
          { zh: "請問捷運站怎麼走？", en: "How do I get to the MRT station?", alt: ["How can I get to the MRT station?", "Which way is the MRT station?"] },
          { zh: "走路要多久？", en: "How long does it take to walk there?", alt: ["How long is the walk?"] },
          { zh: "直走然後在第二個路口右轉。", en: "Go straight and turn right at the second intersection.", alt: ["Go straight and turn right at the second corner."] },
          { zh: "這班公車有到機場嗎？", en: "Does this bus go to the airport?" },
          { zh: "下一班火車幾點開？", en: "When does the next train leave?", alt: ["What time does the next train leave?"] },
          { zh: "我要一張到台中的來回票。", en: "I'd like a round-trip ticket to Taichung.", alt: ["A round-trip ticket to Taichung, please.", "I'd like a return ticket to Taichung."] },
          { zh: "我需要在哪裡換車？", en: "Where do I need to transfer?", alt: ["Where do I change trains?", "Where should I transfer?"] },
          { zh: "請在這裡停車。", en: "Please stop here.", alt: ["Could you stop here, please?"] },
          { zh: "我好像迷路了。", en: "I think I'm lost." },
          { zh: "路上塞車很嚴重。", en: "The traffic is really bad.", alt: ["There's heavy traffic.", "Traffic is terrible."] },
          { zh: "我錯過了最後一班車。", en: "I missed the last bus.", alt: ["I missed the last train."] },
          { zh: "從這裡搭計程車大概要多少錢？", en: "How much would a taxi cost from here?", alt: ["How much is a taxi from here?"] }
        ]
      },
      {
        id: "3-3", name: "看醫生", en: "At the Doctor",
        items: [
          { zh: "我想掛號看醫生。", en: "I'd like to see a doctor.", alt: ["I'd like to make an appointment with a doctor."] },
          { zh: "我頭痛。", en: "I have a headache." },
          { zh: "我喉嚨痛又咳嗽。", en: "I have a sore throat and a cough." },
          { zh: "我從昨天開始發燒。", en: "I've had a fever since yesterday." },
          { zh: "我晚上睡不好。", en: "I can't sleep well at night.", alt: ["I don't sleep well at night."] },
          { zh: "這個症狀持續多久了？", en: "How long have you had these symptoms?", alt: ["How long have you had this symptom?"] },
          { zh: "你有對任何藥物過敏嗎？", en: "Are you allergic to any medication?", alt: ["Are you allergic to any medicine?", "Do you have any drug allergies?"] },
          { zh: "這個藥一天吃三次，飯後吃。", en: "Take this medicine three times a day after meals.", alt: ["Take this three times a day after meals."] },
          { zh: "你需要多休息和多喝水。", en: "You need to get more rest and drink more water.", alt: ["You need more rest and more water."] },
          { zh: "我扭到腳踝了。", en: "I sprained my ankle.", alt: ["I twisted my ankle."] },
          { zh: "我需要請病假嗎？", en: "Do I need to take sick leave?", alt: ["Should I take sick leave?"] },
          { zh: "如果沒有好轉，請再回來複診。", en: "If it doesn't get better, please come back for a follow-up.", alt: ["Come back for a follow-up if it doesn't get better.", "If you don't feel better, please come back."] }
        ]
      }
    ]
  },
  {
    id: 4, name: "中高級", en: "Upper-Intermediate", color: "blue",
    desc: "職場溝通、會議、電話與 Email",
    topics: [
      {
        id: "4-1", name: "職場溝通", en: "At Work",
        items: [
          { zh: "這個專案的截止日是什麼時候？", en: "When is the deadline for this project?", alt: ["What's the deadline for this project?"] },
          { zh: "我今天下班前會完成。", en: "I'll finish it before the end of the day.", alt: ["I'll have it done by the end of the day.", "I'll get it done by the end of the day."] },
          { zh: "你有空可以幫我看一下這份報告嗎？", en: "Do you have time to look over this report?", alt: ["Could you take a look at this report when you're free?", "Do you have a minute to look at this report?"] },
          { zh: "我需要多一點時間。", en: "I need a little more time.", alt: ["I need a bit more time.", "I need more time."] },
          { zh: "我們應該優先處理這個問題。", en: "We should make this issue a priority.", alt: ["We should prioritize this issue.", "We should deal with this issue first."] },
          { zh: "抱歉，我沒有跟上，可以再說一次嗎？", en: "Sorry, I didn't catch that. Could you say it again?", alt: ["Sorry, I didn't catch that. Could you repeat that?"] },
          { zh: "我會再跟你確認。", en: "I'll get back to you.", alt: ["I'll double-check and get back to you."] },
          { zh: "這不在我的負責範圍內。", en: "That's not my responsibility.", alt: ["That's outside my responsibilities.", "That's not part of my job."] },
          { zh: "我想跟你討論一下我的工作量。", en: "I'd like to talk to you about my workload.", alt: ["I'd like to discuss my workload with you."] },
          { zh: "謝謝你在這個專案上的努力。", en: "Thanks for all your hard work on this project.", alt: ["Thank you for your hard work on this project."] },
          { zh: "我們需要在預算內完成。", en: "We need to finish it within budget.", alt: ["We need to stay within budget.", "We need to get it done within budget."] },
          { zh: "如果有任何問題，隨時告訴我。", en: "Let me know if you have any questions.", alt: ["If you have any questions, just let me know.", "Feel free to let me know if you have any questions."] }
        ]
      },
      {
        id: "4-2", name: "開會討論", en: "Meetings",
        items: [
          { zh: "我們開始吧。", en: "Let's get started." },
          { zh: "今天會議的目的是討論新產品。", en: "The purpose of today's meeting is to discuss the new product.", alt: ["Today's meeting is to discuss the new product."] },
          { zh: "我可以補充一點嗎？", en: "Can I add something?", alt: ["May I add something?", "Could I add something?"] },
          { zh: "我同意你的看法。", en: "I agree with you.", alt: ["I agree with your point."] },
          { zh: "我不太確定這是最好的做法。", en: "I'm not sure this is the best approach.", alt: ["I'm not sure that's the best way to do it."] },
          { zh: "你可以說得更具體一點嗎？", en: "Could you be more specific?", alt: ["Can you be more specific?"] },
          { zh: "我們有點離題了。", en: "We're getting off topic.", alt: ["We're getting a little off topic.", "We're getting off track."] },
          { zh: "我們把這個問題留到下次會議討論。", en: "Let's discuss this at the next meeting.", alt: ["Let's save this for the next meeting."] },
          { zh: "誰負責這項任務？", en: "Who's in charge of this task?", alt: ["Who is responsible for this task?"] },
          { zh: "我們時間快到了。", en: "We're running out of time.", alt: ["We're almost out of time."] },
          { zh: "我來總結一下今天的重點。", en: "Let me sum up today's key points.", alt: ["Let me summarize the main points from today."] },
          { zh: "我會在會後寄出會議記錄。", en: "I'll send out the meeting notes afterward.", alt: ["I'll send the minutes after the meeting.", "I'll send out the meeting notes after the meeting."] }
        ]
      },
      {
        id: "4-3", name: "電話與 Email", en: "Calls & Emails",
        items: [
          { zh: "請問哪裡找？", en: "May I ask who's calling?", alt: ["Who's calling, please?"] },
          { zh: "請稍等，我幫你轉接。", en: "Please hold, I'll put you through.", alt: ["Hold on, I'll transfer you.", "Please hold while I transfer you."] },
          { zh: "他現在不在座位上。", en: "He's not at his desk right now.", alt: ["He is away from his desk right now."] },
          { zh: "需要幫你留言嗎？", en: "Would you like to leave a message?", alt: ["Can I take a message?"] },
          { zh: "收訊不太好，你聽得到我嗎？", en: "The connection is bad. Can you hear me?", alt: ["The reception is bad. Can you hear me?"] },
          { zh: "我晚點再打給你。", en: "I'll call you back later." },
          { zh: "附件是本月的報告。", en: "Please find attached this month's report.", alt: ["Attached is this month's report.", "I've attached this month's report."] },
          { zh: "感謝你的快速回覆。", en: "Thank you for your quick reply.", alt: ["Thanks for your quick reply.", "Thank you for your prompt reply."] },
          { zh: "我寫信是想詢問訂單的狀況。", en: "I'm writing to ask about the status of my order.", alt: ["I'm writing to inquire about the status of my order."] },
          { zh: "很抱歉這麼晚才回覆你。", en: "Sorry for the late reply.", alt: ["I'm sorry for the late reply.", "Sorry for getting back to you so late."] },
          { zh: "期待你的回覆。", en: "I look forward to hearing from you.", alt: ["Looking forward to hearing from you.", "I look forward to your reply."] },
          { zh: "如果需要任何進一步的資訊，請告訴我。", en: "Please let me know if you need any further information.", alt: ["Let me know if you need any more information."] }
        ]
      }
    ]
  },
  {
    id: 5, name: "高級", en: "Advanced", color: "purple",
    desc: "商務談判、簡報、辯論表達",
    topics: [
      {
        id: "5-1", name: "商務談判", en: "Negotiation",
        items: [
          { zh: "我們願意在價格上做一些讓步。", en: "We're willing to make some concessions on price.", alt: ["We're willing to compromise on the price."] },
          { zh: "這個價格超出了我們的預算。", en: "This price is beyond our budget.", alt: ["This price is over our budget.", "That price is outside our budget."] },
          { zh: "如果訂購量加倍，你們能給多少折扣？", en: "What discount can you offer if we double our order?", alt: ["How much of a discount can you give us if we double the order?"] },
          { zh: "我們需要在交期上有更多彈性。", en: "We need more flexibility on delivery dates.", alt: ["We need more flexibility on the delivery schedule."] },
          { zh: "這是我們能提出的最好條件。", en: "This is the best offer we can make.", alt: ["That's the best offer we can make.", "This is our best offer."] },
          { zh: "我們能否找到一個雙方都能接受的方案？", en: "Can we find a solution that works for both sides?", alt: ["Can we find a solution that's acceptable to both sides?", "Can we find a compromise that works for both of us?"] },
          { zh: "我需要先跟主管確認才能答應。", en: "I need to check with my manager before I can agree.", alt: ["I'll need to run it by my manager first."] },
          { zh: "付款條件是什麼？", en: "What are the payment terms?" },
          { zh: "我們希望簽一份長期合約。", en: "We'd like to sign a long-term contract.", alt: ["We'd like a long-term contract."] },
          { zh: "坦白說，這不是我們所期待的。", en: "To be honest, this isn't what we were expecting.", alt: ["Frankly, this isn't what we expected."] },
          { zh: "如果你們能保證品質，我們可以接受這個價格。", en: "If you can guarantee the quality, we can accept this price.", alt: ["We can accept this price if you can guarantee the quality."] },
          { zh: "我想我們已經達成共識了。", en: "I think we've reached an agreement.", alt: ["I think we have a deal.", "I think we've reached a consensus."] }
        ]
      },
      {
        id: "5-2", name: "簡報表達", en: "Presentations",
        items: [
          { zh: "感謝各位今天撥空前來。", en: "Thank you all for taking the time to be here today.", alt: ["Thank you all for coming today."] },
          { zh: "我今天的簡報分為三個部分。", en: "My presentation today is divided into three parts.", alt: ["I've divided my presentation into three parts."] },
          { zh: "請看這張圖表。", en: "Please take a look at this chart.", alt: ["Let's take a look at this chart.", "Please look at this chart."] },
          { zh: "如各位所見，營收穩定成長。", en: "As you can see, revenue has grown steadily.", alt: ["As you can see, revenue has been growing steadily."] },
          { zh: "這主要歸功於我們的新行銷策略。", en: "This is mainly due to our new marketing strategy.", alt: ["This is largely thanks to our new marketing strategy."] },
          { zh: "接下來，我要談談我們面臨的挑戰。", en: "Next, I'd like to talk about the challenges we face.", alt: ["Next, I'd like to talk about the challenges we're facing."] },
          { zh: "換句話說，我們必須降低成本。", en: "In other words, we have to cut costs.", alt: ["In other words, we need to reduce costs."] },
          { zh: "這一點非常關鍵。", en: "This point is crucial.", alt: ["This is a crucial point.", "This point is critical."] },
          { zh: "我會在最後留時間給大家發問。", en: "I'll leave some time for questions at the end.", alt: ["There will be time for questions at the end."] },
          { zh: "總結來說，這個計畫可行且值得投資。", en: "In summary, this plan is feasible and worth investing in.", alt: ["To sum up, this plan is feasible and worth the investment."] },
          { zh: "這是個好問題，讓我想一下。", en: "That's a good question. Let me think about it.", alt: ["That's a great question. Let me think about that."] },
          { zh: "我會在會後提供更詳細的數據。", en: "I'll provide more detailed data after the meeting.", alt: ["I'll share more detailed figures after the meeting."] }
        ]
      },
      {
        id: "5-3", name: "辯論與觀點", en: "Debate & Opinions",
        items: [
          { zh: "在我看來，遠距工作利大於弊。", en: "In my view, the advantages of remote work outweigh the disadvantages.", alt: ["In my opinion, the benefits of remote work outweigh the drawbacks."] },
          { zh: "這是一個很值得討論的議題。", en: "This is an issue worth discussing.", alt: ["This issue is well worth discussing."] },
          { zh: "我理解你的觀點，但我不完全同意。", en: "I see your point, but I don't completely agree.", alt: ["I understand your point, but I don't fully agree.", "I see your point, but I don't entirely agree."] },
          { zh: "沒有證據支持這個說法。", en: "There's no evidence to support this claim.", alt: ["There is no evidence to support that claim."] },
          { zh: "我們不能一概而論。", en: "We can't generalize.", alt: ["We shouldn't generalize."] },
          { zh: "這取決於很多因素。", en: "It depends on many factors.", alt: ["That depends on a lot of factors."] },
          { zh: "從長遠來看，這個政策會帶來負面影響。", en: "In the long run, this policy will have negative effects.", alt: ["In the long run, this policy will have a negative impact."] },
          { zh: "另一方面，我們也要考慮成本。", en: "On the other hand, we also need to consider the cost.", alt: ["On the other hand, we also have to consider the cost."] },
          { zh: "事實上，情況比看起來複雜得多。", en: "In fact, the situation is much more complicated than it seems.", alt: ["Actually, the situation is far more complex than it looks."] },
          { zh: "科技讓我們更方便，但也讓我們更孤立。", en: "Technology makes life more convenient, but it also makes us more isolated.", alt: ["Technology makes our lives more convenient, but it also makes us more isolated."] },
          { zh: "這個問題的根源在於教育。", en: "The root of this problem lies in education.", alt: ["The root cause of this problem is education."] },
          { zh: "與其抱怨，不如想辦法解決。", en: "Instead of complaining, we should find a way to solve it.", alt: ["Rather than complaining, we should try to solve the problem."] }
        ]
      }
    ]
  }
];
