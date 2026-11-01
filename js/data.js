// 題庫：中文一律以繁體撰寫，簡體由 OpenCC 即時轉換。
// en = 標準答案（顯示用）；alt = 其他也算對的說法。
// Level 1–2 依英文老師評語針對弱點（時態、句子建構、介係詞），Level 3–4 各 3 個情境主題、Level 5 有 8 個；每主題 12 句。
// note = 答完後顯示的一行文法說明（選填）。
window.LEVELS = [
  {
    id: 1, name: "時態攻略", en: "Tenses", color: "coral",
    desc: "過去式、現在完成式、進行式（依老師評語：時態是弱點）",
    topics: [
      {
        id: "1x-1", name: "過去式", en: "Past Simple",
        items: [
          { zh: "我昨天在路上巧遇我的老同學。", en: "I ran into my old classmate on the street yesterday.", alt: ["Yesterday I ran into my old classmate on the street.", "I bumped into my old classmate on the street yesterday.", "I met my old classmate on the street yesterday."], note: "run → ran（不規則動詞）；run into = 巧遇" },
          { zh: "我們上週末開車去海邊，玩得很開心。", en: "We drove to the beach last weekend and had a great time.", alt: ["Last weekend we drove to the beach and had a great time.", "We drove to the beach last weekend and had a lot of fun.", "We drove to the beach last weekend and had a really good time."], note: "drive → drove、have → had（不規則動詞）" },
          { zh: "她把手機忘在計程車上了。", en: "She left her phone in the taxi.", alt: ["She left her phone in the cab.", "She left her cell phone in the taxi."], note: "把東西忘在某處用 leave（left），不用 forget" },
          { zh: "我小時候每天走路上學。", en: "I walked to school every day when I was a child.", alt: ["When I was a child, I walked to school every day.", "I walked to school every day when I was a kid.", "I used to walk to school every day when I was a child."], note: "walked 的 -ed 發 /t/；過去的習慣也可用 used to + 原形" },
          { zh: "他昨晚沒來參加派對，因為他生病了。", en: "He didn't come to the party last night because he was sick.", alt: ["He didn't come to the party last night because he was ill.", "Last night he didn't come to the party because he was sick.", "He didn't come to the party last night because he got sick."], note: "否定：didn't + 原形動詞（didn't come，不是 didn't came）" },
          { zh: "你上次去看醫生是什麼時候？", en: "When did you last see a doctor?", alt: ["When was the last time you saw a doctor?", "When did you last go to the doctor?", "When was the last time you went to the doctor?"], note: "疑問：did + 原形動詞（When did you see，不是 did you saw）" },
          { zh: "我買了一件外套，但太小了，所以我拿去退了。", en: "I bought a jacket, but it was too small, so I returned it.", alt: ["I bought a coat, but it was too small, so I returned it.", "I bought a jacket, but it was too small, so I took it back.", "I bought a jacket, but it was too small so I returned it."], note: "buy → bought（不規則）；returned 的 -ed 發 /d/" },
          { zh: "我們等了半小時，公車才終於來。", en: "We waited for half an hour before the bus finally came.", alt: ["We waited half an hour before the bus finally came.", "We waited for half an hour before the bus finally arrived.", "We waited for thirty minutes before the bus finally came."], note: "waited：t、d 結尾的 -ed 要多念一個音節 /ɪd/" },
          { zh: "我昨天弄丟了錢包，花了一整個下午找。", en: "I lost my wallet yesterday and spent the whole afternoon looking for it.", alt: ["Yesterday I lost my wallet and spent the whole afternoon looking for it.", "I lost my wallet yesterday and spent all afternoon looking for it."], note: "lose → lost、spend → spent；spend + 時間 + V-ing" },
          { zh: "老師說明完規則之後，我們才開始考試。", en: "After the teacher explained the rules, we started the exam.", alt: ["We started the exam after the teacher explained the rules.", "After the teacher explained the rules, we started the test.", "After the teacher had explained the rules, we started the exam.", "After the teacher explained the rules, we began the exam."], note: "兩個先後發生的過去動作，用 after 連接時都用過去式即可" },
          { zh: "我以前不喜歡蔬菜，但現在很愛。", en: "I didn't use to like vegetables, but now I love them.", alt: ["I used to not like vegetables, but now I love them.", "I didn't like vegetables before, but now I love them.", "I used to dislike vegetables, but now I love them."], note: "used to = 以前會（現在不會了）；否定是 didn't use to" },
          { zh: "我寫完報告的時候，已經半夜兩點了。", en: "When I finished the report, it was already two in the morning.", alt: ["By the time I finished the report, it was already two in the morning.", "When I finished the report, it was already 2 a.m.", "It was already 2 a.m. when I finished the report."], note: "主句子句都是過去的事 → 兩邊都用過去式（finished、was）" }
        ]
      },
      {
        id: "1x-2", name: "完成式 vs 過去式", en: "Perfect vs Past",
        items: [
          { zh: "我已經好幾個月沒見到他了。", en: "I haven't seen him for months.", alt: ["I haven't seen him in months.", "I haven't seen him for several months.", "I haven't seen him in several months."], note: "從過去持續到現在都沒見 → 現在完成式 haven't seen；for + 一段時間" },
          { zh: "我們已經認識超過十年了。", en: "We've known each other for more than ten years.", alt: ["We've known each other for over ten years.", "We've known each other for more than 10 years.", "We've known each other for over 10 years."], note: "認識到現在 → have known（不是 know）" },
          { zh: "我從2020年起就住在這裡。", en: "I've lived here since 2020.", alt: ["I've been living here since 2020.", "I have lived here since 2020."], note: "since + 時間點 → 現在完成式" },
          { zh: "我剛吃完晚餐，所以現在不餓。", en: "I've just had dinner, so I'm not hungry now.", alt: ["I've just had dinner, so I'm not hungry.", "I've just eaten dinner, so I'm not hungry now.", "I just had dinner, so I'm not hungry now.", "I just ate dinner, so I'm not hungry now."], note: "剛剛完成 → have just + 過去分詞" },
          { zh: "我已經讀這本書三遍了。", en: "I've read this book three times.", alt: ["I've already read this book three times.", "I've read this book 3 times."], note: "read 的過去分詞也拼 read，但唸 /red/" },
          { zh: "這是我吃過最好吃的蛋糕。", en: "This is the best cake I've ever had.", alt: ["This is the best cake I've ever eaten.", "This is the most delicious cake I've ever had.", "It's the best cake I've ever had."], note: "最高級 + I've ever + 過去分詞" },
          { zh: "你去過日本嗎？去過，我去年去的。", en: "Have you been to Japan? Yes, I went last year.", alt: ["Have you ever been to Japan? Yes, I went last year.", "Have you been to Japan? Yes, I went there last year.", "Have you ever been to Japan? Yes, I went there last year."], note: "問經驗用 have been；講出明確時間（last year）就改用過去式 went" },
          { zh: "他上個月搬到台中，到現在還沒找到工作。", en: "He moved to Taichung last month and still hasn't found a job.", alt: ["He moved to Taichung last month and hasn't found a job yet.", "He moved to Taichung last month, and he still hasn't found a job."], note: "last month → 過去式 moved；到現在還沒 → hasn't found" },
          { zh: "你寄出那封郵件了嗎？還沒，我等一下寄。", en: "Have you sent that email yet? Not yet, I'll send it later.", alt: ["Have you sent the email yet? Not yet, I'll send it later.", "Have you sent that email? Not yet, I'll send it later.", "Did you send that email? Not yet, I'll send it later."], note: "yet 用在問句與否定句；當下決定的未來用 I'll" },
          { zh: "自從我開始運動，已經瘦了五公斤。", en: "Since I started exercising, I've lost five kilograms.", alt: ["Since I started exercising, I've lost five kilos.", "I've lost five kilograms since I started exercising.", "Since I started working out, I've lost five kilos.", "Since I started exercising, I've lost 5 kg."], note: "since + 過去式子句（started），主句用現在完成式（have lost）" },
          { zh: "我的包裹三天前就該到了，但我到現在還沒收到。", en: "My package should have arrived three days ago, but I still haven't received it.", alt: ["My package was supposed to arrive three days ago, but I still haven't received it.", "My package should have arrived three days ago, but I haven't received it yet.", "My package should have arrived 3 days ago, but I still haven't received it."], note: "should have + 過去分詞 = 本來應該（卻沒有）" },
          { zh: "我工作十年了，但從來沒遇過這麼難搞的客戶。", en: "I've been working for ten years, but I've never met such a difficult client.", alt: ["I've worked for ten years, but I've never met such a difficult client.", "I've been working for ten years, but I've never had such a difficult client.", "I've been working for 10 years, but I've never met such a difficult client.", "I've worked for ten years, but I've never dealt with such a difficult client."], note: "never + 過去分詞 = 從來沒有；such a + 形容詞 + 名詞" }
        ]
      },
      {
        id: "1x-3", name: "進行式與混合時態", en: "Continuous & Mixed",
        items: [
          { zh: "你打電話來的時候，我正在洗澡。", en: "I was taking a shower when you called.", alt: ["When you called, I was taking a shower.", "I was in the shower when you called.", "I was having a shower when you called."], note: "正在進行的過去動作（was taking）被另一個動作打斷（called）" },
          { zh: "她每天早上都喝咖啡，但今天她在喝茶。", en: "She drinks coffee every morning, but today she's drinking tea.", alt: ["She has coffee every morning, but today she's drinking tea.", "She drinks coffee every morning, but today she's having tea.", "She has coffee every morning, but today she's having tea."], note: "習慣 → 現在式（drinks，第三人稱要加 s）；此刻 → 現在進行式" },
          { zh: "我們下週五要搬家。", en: "We're moving next Friday.", alt: ["We're going to move next Friday.", "We're moving house next Friday.", "We are moving next Friday."], note: "已經安排好的未來，可以用現在進行式" },
          { zh: "我最近壓力很大，常常睡不好。", en: "I've been really stressed lately, and I often can't sleep well.", alt: ["I've been really stressed lately and often can't sleep well.", "I've been under a lot of stress lately, and I often don't sleep well.", "I've been very stressed recently, and I often don't sleep well."], note: "lately / recently 常搭配現在完成式" },
          { zh: "我一直在想你昨天說的話。", en: "I've been thinking about what you said yesterday.", alt: ["I keep thinking about what you said yesterday.", "I can't stop thinking about what you said yesterday."], note: "從過去持續到現在 → have been + V-ing" },
          { zh: "他學英文學了三年，但還是不敢開口說。", en: "He's been learning English for three years, but he's still afraid to speak.", alt: ["He's been studying English for three years, but he's still afraid to speak.", "He has been learning English for three years, but he's still afraid to speak it.", "He's been learning English for 3 years, but he's still afraid to speak."], note: "have been + V-ing：從過去一直持續到現在" },
          { zh: "我們在等你的時候，外面開始下雨了。", en: "While we were waiting for you, it started to rain.", alt: ["While we were waiting for you, it started raining.", "It started to rain while we were waiting for you.", "It started raining while we were waiting for you."], note: "while + 過去進行式（背景）；突然發生的事用過去式（started）" },
          { zh: "我到的時候，電影已經開始了。", en: "When I arrived, the movie had already started.", alt: ["The movie had already started when I arrived.", "When I got there, the movie had already started.", "When I arrived, the film had already started."], note: "比另一個過去動作更早發生 → 過去完成式 had started" },
          { zh: "明天這個時候，我會在飛機上。", en: "This time tomorrow, I'll be on the plane.", alt: ["At this time tomorrow, I'll be on the plane.", "I'll be on the plane at this time tomorrow.", "This time tomorrow, I'll be on a plane."], note: "未來某個時刻的狀態 → will be" },
          { zh: "他說他會準時到，結果又遲到了。", en: "He said he would be on time, but he was late again.", alt: ["He said he'd be on time, but he was late again.", "He said he would be on time, but he showed up late again."], note: "轉述過去說的話：will 要改成 would" },
          { zh: "我原本以為會很難，結果出乎意料地簡單。", en: "I thought it would be hard, but it turned out to be surprisingly easy.", alt: ["I thought it would be difficult, but it turned out to be surprisingly easy.", "I expected it to be hard, but it turned out to be surprisingly easy.", "I thought it would be hard, but it was surprisingly easy."], note: "過去「以為會…」→ thought it would be" },
          { zh: "要是我早點知道，我就會去幫你了。", en: "If I had known earlier, I would have helped you.", alt: ["If I'd known earlier, I would have helped you.", "Had I known earlier, I would have helped you.", "If I had known sooner, I would have helped you."], note: "與過去事實相反：If + had + 過去分詞, would have + 過去分詞" }
        ]
      }
    ]
  },
  {
    id: 2, name: "句型建構", en: "Sentence Building", color: "amber",
    desc: "介係詞、連接長句、假設語氣與被動（依老師評語：句子建構）",
    topics: [
      {
        id: "2x-1", name: "介係詞", en: "Prepositions",
        items: [
          { zh: "我把鑰匙放在門旁邊的桌子上。", en: "I put the keys on the table next to the door.", alt: ["I put my keys on the table next to the door.", "I put the keys on the table by the door.", "I left the keys on the table next to the door."], note: "on the table（在表面上）；next to / by = 在旁邊" },
          { zh: "藥局就在銀行和郵局中間。", en: "The pharmacy is between the bank and the post office.", alt: ["The drugstore is between the bank and the post office.", "The pharmacy is right between the bank and the post office."], note: "between A and B = 在 A 和 B 中間" },
          { zh: "我住在一棟老公寓的三樓。", en: "I live on the third floor of an old apartment building.", alt: ["I live on the 3rd floor of an old apartment building.", "I live on the third floor of an old building.", "I live on the third floor of an old apartment block."], note: "樓層用 on：on the third floor" },
          { zh: "他坐在我前面，所以我看不到螢幕。", en: "He was sitting in front of me, so I couldn't see the screen.", alt: ["He sat in front of me, so I couldn't see the screen.", "He was in front of me, so I couldn't see the screen."], note: "in front of = 在…前面（不是 in the front of）" },
          { zh: "會議改到星期一早上九點。", en: "The meeting has been moved to nine o'clock on Monday morning.", alt: ["The meeting has been moved to Monday morning at nine.", "The meeting has been moved to 9 a.m. on Monday.", "The meeting was moved to nine o'clock on Monday morning."], note: "at + 時刻、on + 星期／日期、in + 月份／年份" },
          { zh: "我們從星期一工作到星期五。", en: "We work from Monday to Friday.", alt: ["We work Monday through Friday.", "We work from Monday until Friday.", "We work from Monday till Friday."], note: "from A to B = 從 A 到 B" },
          { zh: "這家店週末營業到晚上十點。", en: "The shop is open until ten p.m. on weekends.", alt: ["The store is open until 10 p.m. on weekends.", "On weekends, the shop is open until 10 p.m.", "The shop stays open until ten p.m. on weekends."], note: "until = 直到；on weekends = 在週末" },
          { zh: "我對這個結果很滿意。", en: "I'm very satisfied with the result.", alt: ["I'm very happy with the result.", "I'm really pleased with the result.", "I'm very satisfied with the outcome."], note: "satisfied with、happy with、pleased with" },
          { zh: "她很擅長數學，但對歷史沒興趣。", en: "She's good at math, but she's not interested in history.", alt: ["She's good at math but not interested in history.", "She's good at maths, but she isn't interested in history.", "She's good at math, but she has no interest in history."], note: "good at（擅長）、interested in（對…有興趣）" },
          { zh: "我們沿著河邊一路走到橋那裡。", en: "We walked along the river to the bridge.", alt: ["We walked along the river all the way to the bridge.", "We walked along the riverbank to the bridge.", "We walked along the river as far as the bridge."], note: "along = 沿著；to = 到" },
          { zh: "我會在一小時內回覆你。", en: "I'll get back to you within an hour.", alt: ["I'll reply to you within an hour.", "I'll get back to you in an hour.", "I'll reply within an hour."], note: "within an hour = 一小時之內；in an hour = 一小時後" },
          { zh: "你出門前應該把燈關掉。", en: "You should turn off the lights before you leave.", alt: ["You should turn the lights off before you leave.", "You should turn off the lights before you go out.", "You should turn off the lights before leaving.", "You should switch off the lights before you leave."], note: "turn off = 關掉；before + 子句 或 before + V-ing" }
        ]
      },
      {
        id: "2x-2", name: "連接長句", en: "Linking Ideas",
        items: [
          { zh: "她是我在大學時認識的朋友。", en: "She's a friend I met in college.", alt: ["She's a friend I met at university.", "She's a friend that I met in college.", "She's a friend who I met in college."], note: "關係子句：a friend (who/that) I met…" },
          { zh: "我太累了，累到沒辦法專心。", en: "I'm so tired that I can't concentrate.", alt: ["I'm so tired I can't concentrate.", "I'm too tired to concentrate.", "I'm so tired that I can't focus."], note: "so + 形容詞 + that…；或 too + 形容詞 + to…" },
          { zh: "雖然薪水比較低，但這份工作能讓我學到更多。", en: "Although the salary is lower, this job will let me learn more.", alt: ["Although the pay is lower, this job will let me learn more.", "Even though the salary is lower, I can learn more from this job.", "The salary is lower, but this job will let me learn more."], note: "although 和 but 不能在同一句一起用" },
          { zh: "我不太擅長跟不熟的人聊天。", en: "I'm not very good at talking to people I don't know well.", alt: ["I'm not good at chatting with people I don't know well.", "I'm not great at talking to people I don't know well.", "I'm not very good at talking with people I don't know well."], note: "good at + V-ing；people (who) I don't know well" },
          { zh: "他總是在最後一刻取消約會，真讓我受不了。", en: "He always cancels plans at the last minute, which drives me crazy.", alt: ["He always cancels plans at the last minute, and it drives me crazy.", "It drives me crazy that he always cancels plans at the last minute.", "He always cancels at the last minute, which drives me crazy."], note: "which 可以指前面整件事；cancels 第三人稱要加 s" },
          { zh: "我的老闆從不給回饋，所以我不知道自己做得好不好。", en: "My boss never gives feedback, so I don't know whether I'm doing well.", alt: ["My boss never gives me feedback, so I don't know if I'm doing well.", "My boss never gives feedback, so I don't know if I'm doing a good job.", "My boss never gives me any feedback, so I don't know whether I'm doing well."], note: "whether / if = 是否；gives 第三人稱要加 s" },
          { zh: "我想取消訂閱，但找不到取消的按鈕。", en: "I'd like to cancel my subscription, but I can't find the cancel button.", alt: ["I want to cancel my subscription, but I can't find the cancel button.", "I'd like to cancel my subscription, but I can't find the button to cancel it.", "I want to unsubscribe, but I can't find the cancel button."], note: "I'd like to 比 I want to 更有禮貌" },
          { zh: "公司正在裁員，大家都擔心下一個會是自己。", en: "The company is laying people off, and everyone is worried they'll be next.", alt: ["The company is laying off staff, and everyone is worried they'll be next.", "The company is cutting jobs, and everyone is worried they'll be next.", "The company is laying people off, and everyone is afraid they'll be next."], note: "lay off = 裁員；everyone 當單數（everyone is）" },
          { zh: "與其抱怨工作，不如想想能怎麼改變現況。", en: "Instead of complaining about your job, think about how you can change the situation.", alt: ["Rather than complaining about your job, think about how you can change the situation.", "Instead of complaining about work, think about how you can change things.", "Instead of complaining about your job, think about how to change the situation."], note: "instead of + V-ing（complaining）" },
          { zh: "最讓我害怕的是在很多人面前說話。", en: "What scares me most is speaking in front of a lot of people.", alt: ["What scares me the most is speaking in front of a lot of people.", "What I'm most afraid of is speaking in front of a lot of people.", "Speaking in front of a lot of people scares me the most."], note: "What + 子句 可以當主詞：What scares me most is…" },
          { zh: "我越想越覺得這不是個好主意。", en: "The more I think about it, the less I like the idea.", alt: ["The more I think about it, the more I feel it's not a good idea.", "The more I think about it, the more I think it's a bad idea.", "The more I think about it, the less it seems like a good idea."], note: "the more…, the more / the less…（越…越…）" },
          { zh: "社群媒體讓我們更容易保持聯絡，卻也讓我們更容易跟別人比較。", en: "Social media makes it easier to stay in touch, but it also makes it easier to compare ourselves to others.", alt: ["Social media makes it easier for us to stay in touch, but it also makes it easier to compare ourselves with others.", "Social media makes it easier to stay in touch, but also easier to compare ourselves to others."], note: "make it easier to…；social media 當單數（makes）" }
        ]
      },
      {
        id: "2x-3", name: "假設與被動", en: "Conditionals & Passive",
        items: [
          { zh: "如果明天之前還沒修好，我就要求退款。", en: "If it isn't fixed by tomorrow, I'll ask for a refund.", alt: ["If it's not fixed by tomorrow, I'll ask for a refund.", "If it isn't fixed by tomorrow, I'm going to ask for a refund.", "If it isn't fixed by tomorrow, I will request a refund."], note: "可能發生的條件：If + 現在式, will…（if 子句不用 will）" },
          { zh: "我的帳號被盜了，所以我立刻改了密碼。", en: "My account was hacked, so I changed my password right away.", alt: ["My account got hacked, so I changed my password right away.", "My account was hacked, so I changed my password immediately.", "My account was hacked, so I immediately changed my password."], note: "被動：was + 過去分詞（was hacked）" },
          { zh: "她因為表現出色，被提拔為部門主管。", en: "She was promoted to department head because of her outstanding performance.", alt: ["Because of her outstanding performance, she was promoted to department head.", "She was promoted to head of the department because of her outstanding performance.", "She was promoted to department head thanks to her excellent performance."], note: "被動：was promoted；because of + 名詞" },
          { zh: "我被要求在下週一之前交一份完整的提案。", en: "I've been asked to submit a complete proposal by next Monday.", alt: ["I was asked to submit a complete proposal by next Monday.", "I've been asked to hand in a complete proposal by next Monday.", "I've been asked to submit a full proposal by next Monday."], note: "被動完成式：have been asked；by + 時間 = 在…之前" },
          { zh: "很多老年人因為不會用智慧型手機而被排除在外。", en: "Many older people are left out because they can't use smartphones.", alt: ["Many older people are left out because they don't know how to use smartphones.", "Many elderly people are excluded because they can't use smartphones.", "A lot of older people get left behind because they can't use smartphones."], note: "被動：are left out（被排除在外）" },
          { zh: "這座城市的生活成本在過去五年內幾乎翻倍了。", en: "The cost of living in this city has almost doubled over the past five years.", alt: ["The cost of living in this city has nearly doubled over the past five years.", "The cost of living in this city has almost doubled in the past five years.", "Living costs in this city have almost doubled over the past five years."], note: "over the past five years → 現在完成式（has doubled）" },
          { zh: "如果你不備份檔案，電腦一壞就全沒了。", en: "If you don't back up your files, you'll lose everything when your computer breaks.", alt: ["If you don't back up your files, you'll lose everything if your computer breaks down.", "If you don't back up your files, you'll lose everything if your computer crashes.", "If you don't back up your files, everything will be gone when your computer breaks."], note: "back up（動詞，兩個字）= 備份" },
          { zh: "如果大家都少開車，空氣品質就會改善。", en: "If everyone drove less, air quality would improve.", alt: ["If everyone drove less, the air quality would improve.", "If people drove less, air quality would improve.", "If everyone drives less, air quality will improve."], note: "與現在事實相反的假設：If + 過去式, would + 原形" },
          { zh: "要不是有導航，我早就迷路了。", en: "If it weren't for GPS, I would have gotten lost long ago.", alt: ["Without GPS, I would have gotten lost a long time ago.", "If it hadn't been for GPS, I would have gotten lost long ago.", "If it weren't for the GPS, I would have been lost long ago."], note: "If it weren't for… / Without… = 要不是…" },
          { zh: "早知道要排這麼久，我就線上申請了。", en: "If I'd known the line would be this long, I would have applied online.", alt: ["If I had known the line would be this long, I would have applied online.", "Had I known the line would be this long, I would have applied online.", "If I'd known the queue would be this long, I would have applied online."], note: "If I'd known = If I had known（與過去事實相反）" },
          { zh: "如果我當初讀的是資工，現在可能會過得更好。", en: "If I had studied computer science, I might be better off now.", alt: ["If I'd studied computer science, I might be better off now.", "If I had majored in computer science, I might be better off now.", "If I had studied computer science, I might be doing better now."], note: "混合假設：過去（had studied）影響現在（might be）" },
          { zh: "要是我們早點採取行動，情況就不會這麼糟了。", en: "If we had acted sooner, the situation wouldn't be this bad.", alt: ["If we'd acted sooner, the situation wouldn't be this bad.", "Had we acted sooner, the situation wouldn't be this bad.", "If we had taken action earlier, the situation wouldn't be so bad."], note: "混合假設：If + had + 過去分詞, wouldn't + 原形（現在的結果）" }
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
    desc: "談判簡報、慣用語、新聞、金融、學術、外交辭令",
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
      },
      {
        id: "5-4", name: "道地慣用語", en: "Idioms",
        items: [
          { zh: "我們先別急著下結論。（用 jump）", en: "Let's not jump to conclusions.", alt: ["Let's not jump to any conclusions.", "We shouldn't jump to conclusions."] },
          { zh: "這個我們晚點再回頭討論。（用 circle back）", en: "Let's circle back to this later.", alt: ["Let's circle back on this later.", "We'll circle back to this later."] },
          { zh: "這只是個粗略的估計。（用 ballpark）", en: "This is just a ballpark figure.", alt: ["It's just a ballpark figure.", "This is just a ballpark estimate.", "It's only a ballpark figure.", "It's just a ballpark estimate."] },
          { zh: "別擔心，這件事很容易。（用 piece of cake）", en: "Don't worry, it's a piece of cake.", alt: ["Don't worry, this is a piece of cake."] },
          { zh: "我們開始談正事吧。（用 down to business）", en: "Let's get down to business.", alt: ["We need to get down to business.", "We have to get down to business."] },
          { zh: "他的報告完全沒抓到重點。（用 miss the point）", en: "His report completely missed the point.", alt: ["His report totally missed the point.", "His report missed the point entirely.", "His report missed the point completely."] },
          { zh: "這個計畫因為缺乏資金而被擱置了。（用 put on hold）", en: "The project was put on hold due to a lack of funding.", alt: ["The project was put on hold because of a lack of funding.", "The project has been put on hold due to a lack of funding.", "The project was put on hold due to lack of funding.", "The plan was put on hold due to a lack of funds."] },
          { zh: "光靠一份薪水，他們很難維持生計。（用 make ends meet）", en: "They struggle to make ends meet on one salary.", alt: ["It's hard for them to make ends meet on one salary.", "They struggle to make ends meet on a single salary.", "They can barely make ends meet on one salary.", "It's difficult for them to make ends meet on a single income."] },
          { zh: "他終於鼓起勇氣坦白一切。（用 come clean）", en: "He finally plucked up the courage to come clean.", alt: ["He finally worked up the courage to come clean.", "He finally found the courage to come clean.", "He finally got up the courage to come clean.", "He finally summoned the courage to come clean.", "He finally mustered the courage to come clean."] },
          { zh: "這次失敗結果反而是因禍得福。（用 blessing in disguise）", en: "This failure turned out to be a blessing in disguise.", alt: ["The failure turned out to be a blessing in disguise.", "This failure was actually a blessing in disguise.", "The failure was a blessing in disguise."] },
          { zh: "不能再拖了，我們必須硬著頭皮做決定。（用 bite the bullet）", en: "We can't put it off any longer; we have to bite the bullet.", alt: ["We can't put it off any longer. We need to bite the bullet.", "We can't delay any longer; we have to bite the bullet.", "We can't wait any longer. We have to bite the bullet."] },
          { zh: "我們再檢查一次吧，小心駛得萬年船。（用 better safe than sorry）", en: "Let's check it again. Better safe than sorry.", alt: ["Let's double-check it. Better safe than sorry.", "Let's double-check. Better safe than sorry.", "Let's check it one more time. Better safe than sorry.", "Let's check again. Better safe than sorry."] }
        ]
      },
      {
        id: "5-5", name: "新聞時事", en: "News & Current Affairs",
        items: [
          { zh: "失業率創下十年來新低。", en: "The unemployment rate has hit a ten-year low.", alt: ["The unemployment rate hit a ten-year low.", "Unemployment has hit a ten-year low.", "The unemployment rate has fallen to a ten-year low."] },
          { zh: "政府宣布了一系列抑制通膨的新措施。", en: "The government has announced a series of new measures to curb inflation.", alt: ["The government announced a series of new measures to curb inflation.", "The government has announced a series of new measures to fight inflation.", "The government announced a series of new measures to rein in inflation."] },
          { zh: "這項法案在國會引發了激烈的辯論。", en: "The bill sparked a heated debate in Congress.", alt: ["The bill has sparked a heated debate in Congress.", "The bill sparked a heated debate in parliament.", "The bill triggered a fierce debate in Congress.", "The bill sparked a heated debate in the legislature."] },
          { zh: "據報導，雙方已同意停火。", en: "Both sides have reportedly agreed to a ceasefire.", alt: ["Reportedly, both sides have agreed to a ceasefire.", "According to reports, both sides have agreed to a ceasefire.", "It is reported that both sides have agreed to a ceasefire.", "The two sides have reportedly agreed to a ceasefire."] },
          { zh: "專家警告，極端天氣將變得越來越頻繁。", en: "Experts warn that extreme weather will become increasingly frequent.", alt: ["Experts warn that extreme weather will become more and more frequent.", "Experts have warned that extreme weather will become increasingly frequent.", "Experts warn that extreme weather events will become increasingly frequent."] },
          { zh: "這起醜聞嚴重損害了公司的聲譽。", en: "The scandal has seriously damaged the company's reputation.", alt: ["The scandal seriously damaged the company's reputation.", "The scandal has severely damaged the company's reputation.", "The scandal has done serious damage to the company's reputation."] },
          { zh: "調查仍在進行中，細節尚未公布。", en: "The investigation is still ongoing, and the details have yet to be released.", alt: ["The investigation is still ongoing and details have not yet been released.", "The investigation is still underway, and the details have not been released yet.", "The investigation is ongoing, and details have yet to be released."] },
          { zh: "這項政策的長期影響仍有待觀察。", en: "The long-term impact of this policy remains to be seen.", alt: ["The long-term effects of this policy remain to be seen.", "The long-term impact of the policy remains to be seen.", "The long-term effects of the policy remain to be seen."] },
          { zh: "抗議者聚集在市政府外，要求市長下台。", en: "Protesters gathered outside City Hall, demanding the mayor's resignation.", alt: ["Protesters gathered outside City Hall, demanding that the mayor resign.", "Protesters gathered outside City Hall to demand the mayor's resignation.", "Protesters gathered outside City Hall, calling for the mayor to step down.", "Protesters gathered outside City Hall, demanding the mayor step down."] },
          { zh: "儘管經濟放緩，消費者信心依然強勁。", en: "Despite the economic slowdown, consumer confidence remains strong.", alt: ["Consumer confidence remains strong despite the economic slowdown.", "Despite the slowdown in the economy, consumer confidence remains strong.", "Despite the economic slowdown, consumer confidence is still strong."] },
          { zh: "該公司否認所有指控，並表示將採取法律行動。", en: "The company denied all the allegations and said it would take legal action.", alt: ["The company denied all allegations and said it would take legal action.", "The company has denied all the allegations and says it will take legal action.", "The company has denied all allegations and said it will take legal action."] },
          { zh: "這場危機暴露了醫療體系長期存在的缺陷。", en: "The crisis has exposed long-standing flaws in the healthcare system.", alt: ["The crisis exposed long-standing flaws in the healthcare system.", "The crisis has exposed longstanding flaws in the healthcare system.", "The crisis has exposed long-standing flaws in the health care system.", "The crisis has exposed long-standing weaknesses in the healthcare system."] }
        ]
      },
      {
        id: "5-6", name: "經濟金融", en: "Economics & Finance",
        items: [
          { zh: "央行決定維持利率不變。", en: "The central bank decided to keep interest rates unchanged.", alt: ["The central bank has decided to keep interest rates unchanged.", "The central bank decided to leave interest rates unchanged.", "The central bank decided to hold interest rates steady."] },
          { zh: "我們不應該把所有雞蛋放在同一個籃子裡。", en: "We shouldn't put all our eggs in one basket.", alt: ["We shouldn't put all of our eggs in one basket.", "We shouldn't put all our eggs in the same basket."] },
          { zh: "分散投資可以降低整體風險。", en: "Diversification can reduce overall risk.", alt: ["Diversifying your investments can reduce overall risk.", "Diversifying investments can reduce the overall risk.", "Diversification can lower overall risk."] },
          { zh: "通膨侵蝕了一般家庭的購買力。", en: "Inflation has eroded the purchasing power of ordinary households.", alt: ["Inflation eroded the purchasing power of ordinary households.", "Inflation has eroded ordinary households' purchasing power.", "Inflation has eaten into the purchasing power of ordinary households.", "Inflation has eroded the purchasing power of ordinary families."] },
          { zh: "消息一公布，股市就應聲下跌。", en: "The stock market fell as soon as the news broke.", alt: ["Stocks fell as soon as the news broke.", "The stock market dropped as soon as the news was announced.", "The stock market fell as soon as the news was announced."] },
          { zh: "這家新創公司在最近一輪融資中募得五千萬美元。", en: "The startup raised $50 million in its latest funding round.", alt: ["The startup raised fifty million dollars in its latest funding round.", "The startup raised $50 million in its latest round of funding.", "The startup raised 50 million dollars in its latest funding round.", "The start-up raised $50 million in its latest funding round.", "The startup raised $50 million in its most recent funding round."] },
          { zh: "供應鏈中斷推高了生產成本。", en: "Supply chain disruptions have driven up production costs.", alt: ["Supply chain disruptions have pushed up production costs.", "Supply chain disruptions drove up production costs.", "Disruptions in the supply chain have driven up production costs."] },
          { zh: "高槓桿的投資策略風險極高。", en: "Highly leveraged investment strategies are extremely risky.", alt: ["A highly leveraged investment strategy is extremely risky.", "Highly leveraged investment strategies carry extremely high risk."] },
          { zh: "這家公司的現金流不足以償還債務。", en: "The company's cash flow is insufficient to repay its debts.", alt: ["The company's cash flow is not enough to repay its debts.", "The company doesn't have enough cash flow to pay off its debts.", "The company's cash flow is insufficient to repay its debt.", "The company's cash flow is insufficient to service its debt."] },
          { zh: "經濟學家預測明年將出現溫和的衰退。", en: "Economists predict a mild recession next year.", alt: ["Economists are predicting a mild recession next year.", "Economists forecast a mild recession next year.", "Economists predict that there will be a mild recession next year."] },
          { zh: "貨幣貶值雖然有利出口，卻會推高進口成本。", en: "Although currency depreciation benefits exports, it drives up the cost of imports.", alt: ["Although currency depreciation helps exports, it raises the cost of imports.", "While currency depreciation benefits exports, it pushes up import costs.", "Currency depreciation benefits exports, but it drives up the cost of imports.", "Although a weaker currency benefits exports, it raises the cost of imports."] },
          { zh: "要不是政府及時介入，整個金融體系可能早就崩潰了。", en: "Had the government not intervened in time, the entire financial system might have collapsed.", alt: ["If the government hadn't intervened in time, the entire financial system might have collapsed.", "If the government had not stepped in in time, the whole financial system could have collapsed.", "Had the government not stepped in in time, the entire financial system might have collapsed.", "If it hadn't been for the government's timely intervention, the whole financial system might have collapsed."] }
        ]
      },
      {
        id: "5-7", name: "學術研究", en: "Academic English",
        items: [
          { zh: "相關性並不代表因果關係。", en: "Correlation does not imply causation.", alt: ["Correlation is not causation.", "Correlation does not equal causation.", "Correlation doesn't mean causation."] },
          { zh: "這項發現與先前的研究結果一致。", en: "This finding is consistent with previous research.", alt: ["This finding is consistent with the results of previous studies.", "This finding is in line with previous research.", "These findings are consistent with previous research."] },
          { zh: "樣本數太小，無法得出明確的結論。", en: "The sample size is too small to draw definitive conclusions.", alt: ["The sample size is too small to draw any definitive conclusions.", "The sample is too small to draw firm conclusions.", "The sample size is too small to draw clear conclusions."] },
          { zh: "本研究旨在探討社群媒體對青少年心理健康的影響。", en: "This study aims to examine the impact of social media on adolescents' mental health.", alt: ["This study aims to examine the impact of social media on the mental health of adolescents.", "This study aims to explore the effects of social media on teenagers' mental health.", "The aim of this study is to examine the impact of social media on adolescent mental health.", "This study aims to investigate the impact of social media on adolescents' mental health."] },
          { zh: "我們需要控制其他可能的干擾變項。", en: "We need to control for other potential confounding variables.", alt: ["We need to control for other possible confounding variables.", "We need to control for other potential confounders."] },
          { zh: "這個理論在學術界仍極具爭議。", en: "The theory remains highly controversial in academia.", alt: ["This theory remains highly controversial in academia.", "The theory is still highly controversial in academia.", "The theory remains highly controversial in the academic world."] },
          { zh: "這篇論文的研究方法有幾個明顯的缺陷。", en: "The paper's methodology has several obvious flaws.", alt: ["There are several obvious flaws in the paper's methodology.", "The methodology of this paper has several obvious flaws.", "The paper's methodology has several clear flaws."] },
          { zh: "本研究的局限性將於下一節討論。", en: "The limitations of this study will be discussed in the next section.", alt: ["The limitations of this study are discussed in the next section.", "The limitations of this study will be discussed in the following section.", "This study's limitations will be discussed in the next section."] },
          { zh: "這些數據顯示兩者之間存在顯著的正相關。", en: "The data show a significant positive correlation between the two.", alt: ["The data shows a significant positive correlation between the two.", "These data show a significant positive correlation between the two.", "The data indicate a significant positive correlation between the two."] },
          { zh: "換言之，這個假設並未獲得實證支持。", en: "In other words, the hypothesis is not supported by empirical evidence.", alt: ["In other words, this hypothesis is not supported by empirical evidence.", "In other words, the hypothesis lacks empirical support.", "In other words, the hypothesis has not been empirically supported."] },
          { zh: "未來的研究應納入更多元的樣本。", en: "Future research should include a more diverse sample.", alt: ["Future research should include more diverse samples.", "Future studies should include a more diverse sample.", "Future studies should include more diverse samples."] },
          { zh: "若將文化因素納入考量，結果可能會截然不同。", en: "If cultural factors were taken into account, the results might be completely different.", alt: ["If cultural factors are taken into account, the results may be completely different.", "If cultural factors were taken into consideration, the results might be completely different.", "If we took cultural factors into account, the results might be entirely different.", "If cultural factors were taken into account, the results could be entirely different."] }
        ]
      },
      {
        id: "5-8", name: "外交辭令", en: "Diplomatic Language",
        items: [
          { zh: "我們對此深表關切。", en: "We are deeply concerned about this.", alt: ["We're deeply concerned about this.", "We are gravely concerned about this.", "We have serious concerns about this."] },
          { zh: "這或許不是最理想的時機。", en: "This may not be the ideal time.", alt: ["This might not be the ideal time.", "This may not be the best time.", "Perhaps this isn't the ideal time.", "This may not be the ideal timing."] },
          { zh: "恐怕我們無法接受這個提案。", en: "I'm afraid we're unable to accept this proposal.", alt: ["I'm afraid we can't accept this proposal.", "I'm afraid we are not able to accept this proposal.", "I'm afraid we're not in a position to accept this proposal."] },
          { zh: "請容我提出不同的看法。", en: "Allow me to offer a different perspective.", alt: ["Allow me to offer a different point of view.", "Let me offer a different perspective.", "Allow me to offer a different view.", "Allow me to present a different perspective."] },
          { zh: "這件事恐怕需要從長計議。", en: "I'm afraid this will require more careful consideration.", alt: ["I'm afraid this requires more careful consideration.", "I'm afraid this needs more careful consideration.", "I'm afraid this will need more careful thought.", "I'm afraid we'll need to give this more careful thought."] },
          { zh: "若有任何誤會，還請見諒。", en: "Please accept our apologies for any misunderstanding.", alt: ["Please accept my apologies for any misunderstanding.", "We apologize for any misunderstanding.", "Please forgive any misunderstanding.", "I apologize for any misunderstanding."] },
          { zh: "坦白說，這樣的結果相當令人失望。", en: "Frankly, this outcome is rather disappointing.", alt: ["Frankly, the outcome is rather disappointing.", "To be frank, this outcome is rather disappointing.", "Frankly, this result is quite disappointing.", "To be frank, the result is quite disappointing."] },
          { zh: "雙方在若干議題上仍存在分歧。", en: "The two sides remain divided on a number of issues.", alt: ["The two sides remain divided on several issues.", "The two sides still differ on a number of issues.", "The two sides still disagree on several issues.", "Both sides remain divided on a number of issues."] },
          { zh: "我理解您的立場，但我們必須從大局考量。", en: "I understand your position, but we have to consider the bigger picture.", alt: ["I understand your position, but we need to consider the bigger picture.", "I understand your position, but we have to look at the bigger picture.", "I understand your position, but we must consider the bigger picture."] },
          { zh: "我們會認真考慮您的建議，並盡快回覆。", en: "We will give your suggestion serious consideration and get back to you as soon as possible.", alt: ["We'll give your suggestion serious consideration and get back to you as soon as possible.", "We will seriously consider your suggestion and get back to you as soon as possible.", "We will give your suggestion serious consideration and respond as soon as possible."] },
          { zh: "我們並不是反對這個構想，而是對執行方式有所保留。", en: "It's not that we oppose the idea; we just have reservations about how it will be implemented.", alt: ["We're not against the idea; we just have reservations about how it will be implemented.", "We are not opposed to the idea, but we have reservations about how it will be implemented.", "It's not that we're against the idea, but we have reservations about its implementation.", "We don't oppose the idea itself; we just have reservations about how it will be carried out."] },
          { zh: "倘若貴方能在價格上展現更多彈性，我們樂於重新考慮。", en: "Should you be able to show more flexibility on price, we would be happy to reconsider.", alt: ["If you could show more flexibility on price, we would be happy to reconsider.", "If you could be more flexible on price, we'd be happy to reconsider.", "Should you show more flexibility on price, we would be glad to reconsider.", "If you can show more flexibility on the price, we would be happy to reconsider."] }
        ]
      }
    ]
  }
];
