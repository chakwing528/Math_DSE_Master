// js/app.js

// ==========================================
// 🚨 老師設定區：已整合專屬 Google Web App URL
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw_h7rVev1VtAuPK4BFGR4i3lLMC2dGH_X6lkeB5IHZNHWPSBcQtFGNg0U9ZEteZMs/exec"; 

// --- 100句座右銘資料庫 (沉穩自律版) ---
const motivationalQuotes = [
    "未來的你，必定感激今天努力的自己。", "默默耕耘，總有收穫。", "答應自己，每天堅持多 1 分鐘。", "今天的累積，是明天的底氣。", "不要高估一天的成就，也不要低估一年的累積。",
    "每天進步一點點，時間會看見。", "聚沙成塔，滴水穿石。", "腳踏實地，每一步都算數。", "成功沒有捷徑，只有每天的堅持。", "把簡單的事情重複做，就是不簡單。",
    "慢慢走，只要不退後就好。", "今天的汗水，是明天的養分。", "時間不會辜負每一個平靜努力的人。", "所有的質變，都來自量變的累積。", "堅持下去，時間會給你答案。",
    "每一份私下的努力，都會有倍增的回報。", "一步一腳印，走得慢也走得遠。", "今天的付出，正在為未來鋪路。", "專注當下，把每一件小事做好。", "點滴的進步，勝過停滯不前。",
    "寧願辛苦一陣子，不要後悔一輩子。", "只有行動，才能消除焦慮。", "停在原地，永遠不知道自己能走多遠。", "克服惰性的最好方法，就是立刻開始。", "既然選擇了目標，就只顧風雨兼程。",
    "想得再多，不如踏實去做。", "真正的自律，是把應該做的事變成習慣。", "做了不一定馬上看到結果，但不做一定沒有。", "讓行動代替猶豫。", "只要開始，就永遠不晚。",
    "找藉口，不如找方法。", "堅持不是一場長跑，而是無數個短跑的連接。", "踏出的每一步，都在拉近與目標的距離。", "想到就去做，別讓時間在猶豫中溜走。", "把專注力留給能改變的事情。",
    "真正的強大，是日復一日的堅持。", "別讓明天的你，抱怨今天的自己。", "機會，總會留給準備好的人。", "一點一滴的執行，好過完美的空想。", "習慣的養成，始於每一次的咬牙堅持。",
    "困難只是暫時的，成長才是永久的。", "接受自己的不完美，然後繼續努力。", "挫折不是失敗，是調整方向的契機。", "瓶頸期，往往是突破的前兆。", "耐得住寂寞，才守得住繁華。",
    "專注於過程，結果自然會來。", "別因為走得慢，就忘記了自己一直在前進。", "挑戰困難，就是擴大舒適圈的過程。", "越是艱難，越要沉住氣。", "學會和挫折做朋友，它是最好的老師。",
    "真正的成熟，是懂得在逆境中堅持。", "不要害怕犯錯，錯了就改，改了就進步。", "保持平常心，面對每一次的起伏。", "堅韌的意志，比聰明的頭腦更重要。", "把困難當作磨刀石，磨礪出更好的自己。",
    "在沒有掌聲的日子裡，也要學會自我肯定。", "內心的平靜，是戰勝一切困難的力量。", "允許自己偶爾疲憊，但絕不輕言放棄。", "每一次的跌倒，都是為了下一次站得更穩。", "堅持心中的目標，哪怕現在進度微小。",
    "靜下心來，專注於眼前的題目。", "拋開雜念，只看眼前的目標。", "少一點抱怨，多一點行動。", "你的注意力在哪裡，你的未來就在哪裡。", "遠離外界的喧囂，守住內心的寧靜。",
    "不要被別人的節奏打亂了自己的步伐。", "做好自己的事，其他的交給時間。", "深呼吸，找回屬於自己的節奏。", "簡單生活，專注學習。", "將複雜的事情簡單化，將簡單的事情重複做。",
    "學會做減法，把精力留給最重要的事。", "沉澱自己，厚積而薄發。", "保持專注，力量就會凝聚。", "屏蔽干擾，你的進度由你主宰。", "專注的過程本身，就是一種鍛鍊。",
    "讓內心保持澄澈，才能理清繁複的思緒。", "一心一意，勝過三心二意。", "把眼光收回自己身上，持續向下扎根。", "寧靜致遠，淡泊明志。", "今天的專注，會化為明天的從容。",
    "今天的你，辛苦了。", "每一次的練習，都在雕刻更好的自己。", "走過的路，都不會白費。", "相信累積的力量。", "你所經歷的訓練，終將成就你。",
    "為自己的堅持，在心裡點一個讚。", "繼續走吧，前面有更好的風景。", "只要在路上，就沒有到不了的遠方。", "你的潛力，遠比你想像的要大。", "每一天，都是全新的開始。",
    "不要辜負自己曾經吃過的苦。", "堅持下去，你會看到意想不到的自己。", "給自己多一點耐心，多一點時間。", "努力的意義，在於讓未來有更多選擇。", "相信過程，相信自己。",
    "你正在寫下屬於自己的成長軌跡。", "穩住節奏，目標就在前方。", "縱有疾風起，人生不言棄。", "感謝今天沒有放棄的自己。", "明天，也要繼續堅持。"
];

// --- 全局變數 ---
let questionBank = [];
let currentQuestionIndex = 0;
let score = 0;
let attemptsCount = 0; 
let currentLevelPref = 1; 
let currentTopic = 'indices'; 
let currentTopicName = '指數定律';
let totalQuestionsConfig = 3; // 預設為做 3 題

// --- 設定題數 ---
function setQuestionNum(num) {
    totalQuestionsConfig = num;
    
    // 更新按鈕樣式
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
        btn.classList.add('bg-transparent', 'text-slate-600');
    });
    const activeBtn = document.getElementById('btn-num-' + num);
    activeBtn.classList.remove('bg-transparent', 'text-slate-600');
    activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
    
    // 更新難度選擇畫面的文字
    document.getElementById('displayQNum').textContent = num;
}

// --- 畫面導航函數 ---
function showTopicScreen() {
    document.getElementById('topicScreen').classList.remove('hidden');
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
}

function backToLevelSelection() {
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
    selectTopic(currentTopic);
}

function backToLevelSelectionFromQuiz() {
    document.getElementById('confirmModal').classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.add('hidden');
}

function confirmBackToLevelSelection() {
    closeConfirmModal();
    backToLevelSelection();
}

function selectTopic(topic) {
    currentTopic = topic;
    document.getElementById('topicScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    
    const btnL1 = document.getElementById('btnL1');
    const btnL2 = document.getElementById('btnL2');
    const btnL3 = document.getElementById('btnL3');
    const btnL2A = document.getElementById('btnL2A');
    const btnL2B = document.getElementById('btnL2B');
    const btnL3A = document.getElementById('btnL3A');
    const btnL3B = document.getElementById('btnL3B');

    // 隱藏所有按鈕
    [btnL1, btnL2, btnL3, btnL2A, btnL2B, btnL3A, btnL3B].forEach(b => b.classList.add('hidden'));

    // 設定年級標籤的 HTML 字串，以避免 Tailwind JIT 阻擋動態 class
    const badges = {
        'L1_S1': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-bold">S1</span></div>',
        'L1_S2': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-bold">S2</span></div>',
        'L1_S1DSE': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-bold">S1、DSE</span></div>',
        'L1_S2DSE': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-bold">S2、DSE</span></div>',
        
        'L2_S1DSE': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-bold">S1、DSE</span></div>',
        'L2_S2': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-bold">S2</span></div>',
        'L2_S2DSE': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-bold">S2、DSE</span></div>',
        'L2_S3': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-bold">S3</span></div>',
        'L2_S4': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md font-bold">S4</span></div>',
        
        'L3_S1DSE': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-md font-bold">S1、DSE</span></div>',
        'L3_S2DSE': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-md font-bold">S2、DSE</span></div>',
        'L3_S3DSE': '<div class="mt-1"><span class="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-md font-bold">S3、DSE</span></div>'
    };

    if (topic === 'indices') {
        currentTopicName = '指數定律';
        document.getElementById('levelTitle').textContent = '指數定律 - 請選擇難度';
        
        btnL1.classList.remove('hidden');
        btnL1.querySelector('.font-bold').innerHTML = '⭐ 程度 1' + badges['L1_S1'];
        document.getElementById('descL1').innerHTML = '只有 1 個運算步驟<br>鞏固單一法則。';

        btnL2.classList.remove('hidden');
        btnL2.querySelector('.font-bold').innerHTML = '⭐⭐ 程度 2' + badges['L2_S3'];
        document.getElementById('descL2').innerHTML = '只有 2 個運算步驟<br>學習法則轉換。';

        btnL3.classList.remove('hidden');
        btnL3.querySelector('.font-bold').innerHTML = '⭐⭐⭐ 程度 3' + badges['L3_S3DSE'];
        document.getElementById('descL3').innerHTML = '包含 2 個變數<br>嚴格只有 2 步。';

    } else if (topic === 'factorization') {
        currentTopicName = '因式分解';
        document.getElementById('levelTitle').textContent = '因式分解 - 請選擇難度';
        
        btnL1.classList.remove('hidden');
        btnL1.querySelector('.font-bold').innerHTML = '⭐ 程度 1' + badges['L1_S2'];
        document.getElementById('descL1').innerHTML = '提公因式<br>學習抽出共同因子。';

        btnL2A.classList.remove('hidden');
        btnL2A.querySelector('.font-bold').innerHTML = '⭐⭐ 程度 2A' + badges['L2_S2'];
        btnL2A.lastElementChild.innerHTML = '一元二次公式分解<br>單一變數完全平方與平方差。';

        btnL2B.classList.remove('hidden');
        btnL2B.querySelector('.font-bold').innerHTML = '⭐⭐ 程度 2B' + badges['L2_S2'];
        btnL2B.lastElementChild.innerHTML = '二元二次公式分解<br>雙變數完全平方與平方差。';

        btnL3A.classList.remove('hidden');
        btnL3A.querySelector('.font-bold').innerHTML = '⭐⭐⭐ 程度 3A' + badges['L3_S3DSE'];
        btnL3A.lastElementChild.innerHTML = '一元二次因式分解<br>單變數十字相乘法。';

        btnL3B.classList.remove('hidden');
        btnL3B.querySelector('.font-bold').innerHTML = '⭐⭐⭐ 程度 3B' + badges['L3_S3DSE'];
        btnL3B.lastElementChild.innerHTML = '二元二次因式分解<br>包含雙變數的十字相乘。';
        
    } else if (topic === 'rounding') {
        currentTopicName = '近似值與捨入';
        document.getElementById('levelTitle').textContent = '近似值與捨入 - 請選擇難度';
        
        btnL1.classList.remove('hidden');
        btnL1.querySelector('.font-bold').innerHTML = '⭐ 程度 1' + badges['L1_S1DSE'];
        document.getElementById('descL1').innerHTML = '基本捨入<br>小數點與有效數字的基本四捨五入。';
        
        btnL2.classList.remove('hidden');
        btnL2.querySelector('.font-bold').innerHTML = '⭐⭐ 程度 2' + badges['L2_S1DSE'];
        document.getElementById('descL2').innerHTML = '上捨入與下捨入<br>進階要求：強制進位或捨去。';
        
        btnL3.classList.remove('hidden');
        btnL3.querySelector('.font-bold').innerHTML = '⭐⭐⭐ 程度 3' + badges['L3_S1DSE'];
        document.getElementById('descL3').innerHTML = '綜合應用<br>包含前導零小數及大整數陷阱。';

    } else if (topic === 'identities') {
        currentTopicName = '恆等式';
        document.getElementById('levelTitle').textContent = '恆等式 - 請選擇難度';
        
        btnL1.classList.remove('hidden');
        btnL1.querySelector('.font-bold').innerHTML = '⭐ 程度 1' + badges['L1_S2'];
        document.getElementById('descL1').innerHTML = '展開與比較係數<br>基礎一元一次恆等式。';
        
        btnL2.classList.remove('hidden');
        btnL2.querySelector('.font-bold').innerHTML = '⭐⭐ 程度 2' + badges['L2_S2DSE'];
        document.getElementById('descL2').innerHTML = '二次恆等式<br>進階代入與比較係數。';
        
        btnL3.classList.remove('hidden');
        btnL3.querySelector('.font-bold').innerHTML = '⭐⭐⭐ 程度 3' + badges['L3_S2DSE'];
        document.getElementById('descL3').innerHTML = '比例問題<br>求取多個未知數的比例。';

    } else if (topic === 'fractions') {
        currentTopicName = '通分母';
        document.getElementById('levelTitle').textContent = '通分母 - 請選擇難度';
        
        btnL1.classList.remove('hidden');
        btnL1.querySelector('.font-bold').innerHTML = '⭐ 程度 1' + badges['L1_S2DSE'];
        document.getElementById('descL1').innerHTML = '分母為一元一次<br>分子為常數。';
        
        btnL2.classList.remove('hidden');
        btnL2.querySelector('.font-bold').innerHTML = '⭐⭐ 程度 2' + badges['L2_S4'];
        document.getElementById('descL2').innerHTML = '分母為一元二次<br>需先因式分解再通分母。';
    }
}

function startGame(levelPref) {
    currentLevelPref = levelPref;
    
    // 隱藏共用的題目指示，改為在每個生成器中自定義更美觀的題目排版
    document.getElementById('questionInstruction').classList.add('hidden');
    
    // 呼叫對應課題的題庫生成函數 (需確保其他 topics js 檔案已載入)
    if (currentTopic === 'indices') {
        questionBank = generateIndicesQuestions(totalQuestionsConfig, currentLevelPref); 
    } else if (currentTopic === 'factorization') {
        questionBank = generateFactorizationQuestions(totalQuestionsConfig, currentLevelPref); 
    } else if (currentTopic === 'rounding') {
        questionBank = generateRoundingQuestions(totalQuestionsConfig, currentLevelPref);
    } else if (currentTopic === 'identities') {
        questionBank = generateIdentitiesQuestions(totalQuestionsConfig, currentLevelPref);
    } else if (currentTopic === 'fractions') {
        questionBank = generateFractionsQuestions(totalQuestionsConfig, currentLevelPref);
    }
    
    currentQuestionIndex = 0;
    score = 0;
    updateScoreDisplay();
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    
    const btn = document.getElementById('submitRecordBtn');
    btn.disabled = false;
    btn.textContent = "傳送成績";
    btn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-slate-400');
    btn.classList.add('bg-green-600', 'hover:bg-green-700');
    document.getElementById('submitStatus').classList.add('hidden');
    
    loadQuestion();
}

function loadQuestion() {
    attemptsCount = 0; 
    const q = questionBank[currentQuestionIndex];
    
    document.getElementById('topicBadge').textContent = q.topic;
    document.getElementById('levelBadge').innerHTML = `難度: ${q.level}`;
    document.getElementById('progressText').textContent = `完成 ${currentQuestionIndex}/${questionBank.length}`;

    hideFeedback();

    const questionContainer = document.getElementById('questionText');
    questionContainer.innerHTML = q.question;

    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = ''; 
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn relative p-3 sm:p-4 bg-white border-2 border-slate-200 rounded-xl text-base sm:text-lg text-slate-700 font-medium hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 flex items-center gap-3 text-left w-full overflow-hidden';
        btn.onclick = () => handleAnswer(opt, btn);
        
        const label = document.createElement('span');
        label.className = 'w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0';
        label.textContent = opt.id;
        
        const mathContent = document.createElement('span');
        mathContent.className = 'overflow-x-auto math-scroll max-w-full flex-1 py-1';
        mathContent.innerHTML = opt.text;

        btn.appendChild(label);
        btn.appendChild(mathContent);
        optionsGrid.appendChild(btn);
    });

    // 同步渲染題目與選項，零延遲
    renderMath();
}

function handleAnswer(selectedOption, buttonElement) {
    attemptsCount++;
    const isCorrect = selectedOption.isCorrect === true;

    if (isCorrect) {
        buttonElement.classList.remove('border-slate-200', 'hover:border-indigo-400');
        buttonElement.classList.add('border-green-500', 'bg-green-50');
        buttonElement.querySelector('span').classList.replace('bg-slate-100', 'bg-green-500');
        buttonElement.querySelector('span').classList.replace('text-slate-500', 'text-white');
        
        document.getElementById('progressText').textContent = `完成 ${currentQuestionIndex + 1}/${questionBank.length}`;
        
        if (attemptsCount === 1) {
            score += 10;
            updateScoreDisplay();
        }

        showFeedback('correct', selectedOption.hint, true);
        disableAllButtons();
        
    } else {
        buttonElement.classList.remove('border-slate-200');
        buttonElement.classList.add('border-red-300', 'bg-red-50');
        buttonElement.disabled = true;

        showFeedback('incorrect', selectedOption.hint, false);
    }
}

function showFeedback(type, message, showNextBtn) {
    const feedbackArea = document.getElementById('feedbackArea');
    const feedbackBox = document.getElementById('feedbackBox');
    const messageEl = document.getElementById('feedbackMessage');
    const nextBtn = document.getElementById('nextBtn');

    feedbackArea.classList.remove('hidden');

    if (type === 'correct') {
        feedbackBox.className = 'p-4 rounded-xl border bg-green-50 border-green-200 w-full overflow-hidden';
    } else {
        feedbackBox.className = 'p-4 rounded-xl border bg-orange-50 border-orange-200 w-full overflow-hidden';
    }

    messageEl.innerHTML = message;

    if (showNextBtn) {
        nextBtn.classList.remove('hidden');
        nextBtn.onclick = goToNext;
    } else {
        nextBtn.classList.add('hidden');
    }

    // 同步渲染解答區域，零延遲
    renderMath();
}

function hideFeedback() {
    document.getElementById('feedbackArea').classList.add('hidden');
}

function disableAllButtons() {
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(btn => {
        if (!btn.classList.contains('border-green-500')) {
            btn.disabled = true;
        }
    });
}

function goToNext() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionBank.length) {
        loadQuestion();
    } else {
        showEndScreen();
    }
}

function showEndScreen() {
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('endScreen').classList.remove('hidden');
    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalQuestions').textContent = questionBank.length * 10;
    
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivationalQuote').textContent = randomQuote;
}

function updateScoreDisplay() {
    document.getElementById('scoreDisplay').textContent = score;
}

// --- 提交成績至 Google Sheet ---
function submitToGoogleSheet() {
    const btn = document.getElementById('submitRecordBtn');
    const statusText = document.getElementById('submitStatus');
    const className = document.getElementById('className').value.trim();
    const classNumber = document.getElementById('classNumber').value.trim();
    const studentName = document.getElementById('studentName').value.trim();

    if (!className || !classNumber || !studentName) {
        statusText.textContent = "⚠️ 請填寫所有資料（班別、學號、姓名）";
        statusText.className = "text-center text-sm font-bold mt-3 text-red-500 block";
        return;
    }

    if (GOOGLE_SCRIPT_URL === "請在此貼上你全新的_GOOGLE_WEB_APP_URL" || GOOGLE_SCRIPT_URL === "") {
        statusText.textContent = "⚠️ 系統尚未綁定 Google Sheet，請聯絡老師。";
        statusText.className = "text-center text-sm font-bold mt-3 text-orange-500 block";
        return;
    }

    btn.disabled = true;
    btn.textContent = "傳送中...";
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    statusText.classList.add('hidden');
    
    let displayLevel = currentLevelPref === 'mixed' ? '綜合挑戰' : currentLevelPref.toString().toUpperCase();
    let levelText = `程度 ${displayLevel}`;

    // 計算滿分與百分比
    let totalScoreVal = totalQuestionsConfig * 10;
    let percentageVal = ((score / totalScoreVal) * 100).toFixed(0) + "%";

    // 資料已拆分為：課題 (topic) 與 程度 (level)
    document.getElementById('form_className').value = className;
    document.getElementById('form_classNumber').value = classNumber;
    document.getElementById('form_studentName').value = studentName;
    document.getElementById('form_topic').value = currentTopicName; 
    document.getElementById('form_level').value = levelText;
    document.getElementById('form_score').value = score;
    document.getElementById('form_totalScore').value = totalScoreVal;
    document.getElementById('form_percentage').value = percentageVal;

    document.getElementById('googleForm').action = GOOGLE_SCRIPT_URL; 
    document.getElementById('googleForm').submit();

    setTimeout(() => {
        showSubmitSuccess();
    }, 1500);
}

function showSubmitSuccess() {
    const btn = document.getElementById('submitRecordBtn');
    const statusText = document.getElementById('submitStatus');
    
    btn.textContent = "✅ 已成功傳送！";
    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
    btn.classList.add('bg-slate-400');
    statusText.textContent = "成績已成功傳送給老師，謝謝！";
    statusText.className = "text-center text-sm font-bold mt-3 text-green-600 block";
}

// 極速局部渲染，解決延遲及防禦外部代碼干擾
function renderMath() {
    if (typeof renderMathInElement !== 'undefined') {
        const config = {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
        };
        
        // 針對特定區塊進行同步渲染，速度最快且不會影響版面
        const qText = document.getElementById('questionText');
        const optGrid = document.getElementById('optionsGrid');
        const fbArea = document.getElementById('feedbackArea');
        
        if (qText) renderMathInElement(qText, config);
        if (optGrid) renderMathInElement(optGrid, config);
        if (fbArea) renderMathInElement(fbArea, config);
    }
}

// 網頁載入時啟動首頁
window.onload = showTopicScreen;
