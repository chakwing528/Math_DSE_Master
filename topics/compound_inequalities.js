// js/topics/inequalities.js

// ==========================================
// 不等式課題專屬錯誤提示訊息
// ==========================================
const msgIneqSign = `<div class="text-red-600 font-bold text-lg mb-1">❗ 不等號方向錯誤 (乘除負數忘記變號)</div><div class="text-sm text-slate-500 mb-2">當不等式兩邊同時乘以或除以一個負數時，不等號的方向必須反轉（例如 ＞ 變 ＜）。這是 DSE 最常見的失分點！</div>`;
const msgAndOr = `<div class="text-red-600 font-bold text-lg mb-1">❗ 「及 (AND)」與「或 (OR)」概念混淆</div><div class="text-sm text-slate-500 mb-2"><b>及 (AND)</b>：尋找兩個解區域的<b>交疊部分</b>（共同範圍）。若無交疊則為無解。<br><b>或 (OR)</b>：將兩個解區域<b>合併</b>。只要滿足其中一個部分即可，通常會融合成一個較大的區間或全體實數。</div>`;
const msgProp = `<div class="text-red-600 font-bold text-lg mb-1">❗ 不等式性質推導錯誤</div><div class="text-sm text-slate-500 mb-2">對於未知正負號的變數（如 $a^2 > b^2$），不能隨意去平方，因為負數的平方可能會變大（例如 $1 > -2$ 但 $1^2 < (-2)^2$）。必須利用極端數值法或嚴謹代數性質驗證。</div>`;
const msgQuad = `<div class="text-red-600 font-bold text-lg mb-1">❗ 二次不等式解區間錯誤</div><div class="text-sm text-slate-500 mb-2">對於 $(x-a)(x-b) < 0$（設 $a < b$），解為兩根之間：$a < x < b$。<br>對於 $(x-a)(x-b) > 0$，解為兩邊分散：$x < a$ 或 $x > b$。請勿與一次不等式的移項混淆。</div>`;

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function buildEq(steps) {
    return steps.map(s => `<div class="my-1">${s.text}</div>`).join('');
}

function wrapHint(msg, stepsHtml) {
    return `
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            ${msg}
            <details class="mt-2 text-sm text-slate-600">
                <summary class="cursor-pointer text-indigo-600 font-semibold hover:underline">查看詳細解題步驟</summary>
                <div class="mt-2 pl-3 border-l-2 border-indigo-500 space-y-1 bg-white p-2 rounded">
                    ${stepsHtml}
                </div>
            </details>
        </div>
    `;
}

// ==========================================
// 主題目生成器：不等式 (Inequalities)
// ==========================================
function generateInequalitiesQuestions(num, levelPref) {
    const bank = [];
    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "不等式 (Inequalities)" };
        let options = [];
        let steps = [];
        let subType = Math.floor(Math.random() * 3);

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎一元一次不等式與性質判斷 (建基補底)";
            
            if (subType === 0) {
                // Type 0: 移項與負數變號 
                let a = Math.floor(Math.random() * 8) + 5;  
                let b = Math.floor(Math.random() * 4) + 2;  
                let c = Math.floor(Math.random() * 10) + 15; 
                let numDiff = a - c;
                let ansBoundary = numDiff / b;
                let ansStr = ansBoundary % 1 === 0 ? `${ansBoundary}` : `\\frac{${numDiff}}{${b}}`;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式 \\( ${a} - ${b}x < ${c} \\)。</div>`;
                
                steps = [
                    { text: `將常數項 \\( ${a} \\) 移至右邊：\\( -${b}x < ${c} - ${a} \\)` },
                    { text: `化簡右邊得：\\( -${b}x < ${numDiff} \\)` },
                    { text: `兩邊同除以負數 \\( -${b} \\)，<b>注意：不等號方向必須反轉！</b>` },
                    { text: `因此得 \\( x > ${ansStr} \\)。` }
                ];

                options = [
                    { text: `\\( x > ${ansStr} \\)`, isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: `\\( x < ${ansStr} \\)`, isCorrect: false, hint: wrapHint(msgIneqSign, buildEq(steps)) },
                    { text: `\\( x > \\frac{${a+c}}{${b}} \\)`, isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg">❗ 移項正負號錯誤</div>`, buildEq(steps)) },
                    { text: `\\( x < \\frac{${a+c}}{${b}} \\)`, isCorrect: false, hint: wrapHint(msgIneqSign, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 不等式性質的真假值判斷 (仿 2014 Q6)
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( a > b \\) 及 \\( k < 0 \\)，則下列何者必為正確？<br>I. \\( a^2 > b^2 \\)<br>II. \\( a + k > b + k \\)<br>III. \\( ak^2 > bk^2 \\)</div>`;
                
                steps = [
                    { text: `對於 I：若 \\( a = 1, b = -2 \\)，滿足 \\( a > b \\)。但 \\( 1^2 = 1 \\) 而 \\( (-2)^2 = 4 \\)，此時 \\( 1 < 4 \\)，故 I 不一定正確。` },
                    { text: `對於 II：不等式兩邊同時加上同一個實數 \\( k \\)，不等號方向不變。因此 \\( a + k > b + k \\) 必為正確。` },
                    { text: `對於 III：因為 \\( k < 0 \\)，所以 \\( k^2 > 0 \\)（負數的平方必定是正數）。不等式兩邊同時乘以正數 \\( k^2 \\)，不等號方向不變。因此 \\( ak^2 > bk^2 \\) 必為正確。` }
                ];

                options = [
                    { text: "只有 II 及 III", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "只有 I 及 II", isCorrect: false, hint: wrapHint(msgProp + "<div class='text-sm text-slate-500'>提示：考慮 a 為正數而 b 為負數的極端情況（如 1 > -2）。</div>", buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgProp, buildEq(steps)) },
                    { text: "I、II 及 III", isCorrect: false, hint: wrapHint(msgProp, buildEq(steps)) }
                ];
            } else {
                // Type 2: 簡單連貫鏈狀不等式 (仿 2014 Q7)
                let b = Math.floor(Math.random() * 3) + 2; 
                let val1 = b * -2; 
                let val2 = b * 3;  
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求連貫不等式 \\( ${val1} < ${b}x < ${val2} \\) 的解。</div>`;
                
                steps = [
                    { text: `鏈狀不等式 \\( ${val1} < ${b}x < ${val2} \\) 代表需要同時滿足兩個條件：\\( ${val1} < ${b}x \\) 及 \\( ${b}x < ${val2} \\)。` },
                    { text: `解左半部分：\\( ${val1} < ${b}x \\implies x > -2 \\)` },
                    { text: `解右半部分：\\( ${b}x < ${val2} \\implies x < 3 \\)` },
                    { text: `合併共同範圍（及 / AND），得到最終解：\\( -2 < x < 3 \\)。` }
                ];

                options = [
                    { text: "\\( -2 < x < 3 \\)", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "\\( x > -2 \\)", isCorrect: false, hint: wrapHint(msgAndOr + "<div class='text-sm text-slate-500'>提示：這只是其中一邊的解，必須與另一邊取共同範圍。</div>", buildEq(steps)) },
                    { text: "\\( x < 3 \\)", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) },
                    { text: "無解", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) }
                ];
            }

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：複合不等式與數軸交疊處理 (常考核心)";
            
            if (subType === 0) {
                // Type 0: 「及 (AND)」複合不等式 (仿 2012SP Q9, 2016 Q7)
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求 \\( -5x > 21 - 2x \\) 及 \\( 6x - 18 < 0 \\) 的解。</div>`;
                
                steps = [
                    { text: `解第一個不等式：\\( -5x > 21 - 2x \\)` },
                    { text: `移項得：\\( -3x > 21 \\)` },
                    { text: `兩邊同除以 -3 (記得變號)：\\( x < -7 \\)` },
                    { text: `解第二個不等式：\\( 6x - 18 < 0 \\implies 6x < 18 \\implies x < 3 \\)` },
                    { text: `題目要求是「及 (AND)」，所以要找兩者的<b>交疊部分</b>：` },
                    { text: `在數軸上，\\( x < -7 \\) 與 \\( x < 3 \\) 的共同範圍是 \\( x < -7 \\)。` }
                ];

                options = [
                    { text: "\\( x < -7 \\)", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "\\( x < 3 \\)", isCorrect: false, hint: wrapHint(msgAndOr + "<div class='text-sm text-slate-500'>提示：x < 3 包含了不屬於 x < -7 的區域，並非交疊共同範圍。</div>", buildEq(steps)) },
                    { text: "\\( -7 < x < 3 \\)", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) },
                    { text: "\\( x < -7 \\) 或 \\( x > 3 \\)", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 「或 (OR)」複合不等式 (仿 2012PP Q9, 2012 Q7, 2015 Q6, 2017 Q5)
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求 \\( 15 + 4x < 3 \\) 或 \\( 9 - 2x > 1 \\) 的解。</div>`;
                
                steps = [
                    { text: `解第一個不等式：\\( 15 + 4x < 3 \\implies 4x < -12 \\implies x < -3 \\)` },
                    { text: `解第二個不等式：\\( 9 - 2x > 1 \\implies -2x > -8 \\)` },
                    { text: `兩邊同除以 -2 (記得變號)：\\( x < 4 \\)` },
                    { text: `題目要求是「或 (OR)」，所以要將兩個解區域<b>合併</b>。` },
                    { text: `在數軸上，所有小於 -3 的數值都已經包含在小於 4 的範圍內（即 \\( x < -3 \\) 是 \\( x < 4 \\) 的子集）。` },
                    { text: `合併後的完整範圍就是 \\( x < 4 \\)。` }
                ];

                options = [
                    { text: "\\( x < 4 \\)", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "\\( x < -3 \\)", isCorrect: false, hint: wrapHint(msgAndOr + "<div class='text-sm text-slate-500'>提示：這是「或 (OR)」，需要取聯集(合併)，不是取交集。</div>", buildEq(steps)) },
                    { text: "\\( -3 < x < 4 \\)", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) },
                    { text: "全體實數", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) }
                ];
            } else {
                // Type 2: 特殊解 (無解 / 全體實數) 陷阱題
                let k = Math.floor(Math.random() * 3) + 2; 
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求複合不等式 \\( x + ${k} < 0 \\) 及 \\( 2x - 4 > 0 \\) 的解。</div>`;
                
                steps = [
                    { text: `解第一個不等式：\\( x + ${k} < 0 \\implies x < -${k} \\)` },
                    { text: `解第二個不等式：\\( 2x - 4 > 0 \\implies 2x > 4 \\implies x > 2 \\)` },
                    { text: `題目關鍵字為「及 (AND)」，要求尋找兩者的交疊部分。` },
                    { text: `數軸上，沒有任何數字能同時小於 \\( -${k} \\) 且大於 2。` },
                    { text: `因此，這組複合不等式<b>無解</b>。` }
                ];

                options = [
                    { text: "無解", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: `\\( -${k} < x < 2 \\)`, isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) },
                    { text: `\\( x < -${k} \\) 或 \\( x > 2 \\)`, isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) },
                    { text: "全體實數", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) }
                ];
            }

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：含分數與複雜代數變形的不等式 (補強拔尖)";
            
            if (subType === 0) {
                // Type 0: 含分數的複合不等式 (仿 2013 Q5 經典真題)
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求 \\( x - \\frac{x - 1}{2} > 5 \\) 或 \\( 1 < x - 11 \\) 的解。</div>`;
                
                steps = [
                    { text: `解第一個含分數不等式。兩邊同乘以 2 以消去分母：` },
                    { text: `\\( 2x - (x - 1) > 10 \\) （<b>注意：減去整個分子時，分子必須加括號！</b>）` },
                    { text: `展開括號：\\( 2x - x + 1 > 10 \\implies x + 1 > 10 \\implies x > 9 \\)` },
                    { text: `解第二個不等式：\\( 1 < x - 11 \\implies 12 < x \\)，即 \\( x > 12 \\)` },
                    { text: `題目要求是「或 (OR)」，需要將兩個解合併：` },
                    { text: `在數軸上，大於 12 的所有數值都已經包含在大於 9 的範圍內。合併後最終解為 \\( x > 9 \\)。` }
                ];

                options = [
                    { text: "\\( x > 9 \\)", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "\\( x > 12 \\)", isCorrect: false, hint: wrapHint(msgAndOr + "<div class='text-sm text-slate-500'>提示：這是「或 (OR)」，大於 9 的數（如 10）也是合法的解，不應被排除。</div>", buildEq(steps)) },
                    { text: "\\( 9 < x < 12 \\)", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) },
                    { text: "\\( x > 11 \\)", isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg">❗ 分式展開負號錯誤</div>`, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 雙邊分數交叉相乘
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式 \\( \\frac{2x + 3}{5} \\ge \\frac{3x - 1}{4} \\)。</div>`;
                
                steps = [
                    { text: `由於分母 5 和 4 都是正數，我們可以將不等式兩邊同乘以其最小公倍數 20：` },
                    { text: `\\( 4(2x + 3) \\ge 5(3x - 1) \\)` },
                    { text: `展開括號：\\( 8x + 12 \\ge 15x - 5 \\)` },
                    { text: `移項項：\\( 8x - 15x \\ge -5 - 12 \\implies -7x \\ge -17 \\)` },
                    { text: `兩邊同除以 -7，<b>不等號方向轉向</b>：\\( x \\le \\frac{17}{7} \\)。` }
                ];

                options = [
                    { text: "\\( x \\le \\frac{17}{7} \\)", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "\\( x \\ge \\frac{17}{7} \\)", isCorrect: false, hint: wrapHint(msgIneqSign, buildEq(steps)) },
                    { text: "\\( x \\le \\frac{7}{7} \\)", isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg">❗ 括號展開常數項未乘係數</div>`, buildEq(steps)) },
                    { text: "\\( x \\ge 1 \\)", isCorrect: false, hint: wrapHint(msgIneqSign, buildEq(steps)) }
                ];
            } else {
                // Type 2: 複雜括號與移項的「及 (AND)」
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求 \\( 3(2 - x) \\ge 12 \\) 及 \\( 4x - 2 < 2(x + 5) \\) 的解。</div>`;
                
                steps = [
                    { text: `解第一個不等式：\\( 6 - 3x \\ge 12 \\implies -3x \\ge 6 \\implies x \\le -2 \\) (除以負數變號)` },
                    { text: `解第二個不等式：\\( 4x - 2 < 2x + 10 \\implies 2x < 12 \\implies x < 6 \\)` },
                    { text: `題目要求是「及 (AND)」，找數軸上的交疊部分：` },
                    { text: `\\( x \\le -2 \\) 與 \\( x < 6 \\) 的交集就是 \\( x \\le -2 \\)。` }
                ];

                options = [
                    { text: "\\( x \\le -2 \\)", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "\\( x < 6 \\)", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) },
                    { text: "\\( -2 \\le x < 6 \\)", isCorrect: false, hint: wrapHint(msgAndOr, buildEq(steps)) },
                    { text: "\\( x \\ge -2 \\)", isCorrect: false, hint: wrapHint(msgIneqSign, buildEq(steps)) }
                ];
            }
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：進階推推論、整數解計數與二次不等式 (拔尖挑戰)";
            
            if (subType === 0) {
                // Type 0: 一元二次不等式
                let r1 = Math.floor(Math.random() * 3) + 2; 
                let r2 = r1 + Math.floor(Math.random() * 3) + 3; 
                let sum = r1 + r2;
                let prod = r1 * r2;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解二次不等式 \\( x^2 - ${sum}x + ${prod} > 0 \\)。</div>`;
                
                steps = [
                    { text: `首先對二次式進行因式分解（可以使用計算機十字相乘功能）：` },
                    { text: `\\( (x - ${r1})(x - ${r2}) > 0 \\)` },
                    { text: `對應的方程兩根為 \\( x = ${r1} \\) 及 \\( x = ${r2} \\)。` },
                    { text: `因為不等號為「大於 (＞)」，且二次項係數為正（開口向上），解區域位於兩邊分散：` },
                    { text: `因此解為 \\( x < ${r1} \\) 或 \\( x > ${r2} \\)。` }
                ];

                options = [
                    { text: `\\( x < ${r1} \\) 或 \\( x > ${r2} \\)`, isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: `\\( ${r1} < x < ${r2} \\)`, isCorrect: false, hint: wrapHint(msgQuad, buildEq(steps)) },
                    { text: `\\( x > ${r2} \\)`, isCorrect: false, hint: wrapHint(msgQuad, buildEq(steps)) },
                    { text: `\\( x < ${r1} \\)`, isCorrect: false, hint: wrapHint(msgQuad, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 不等式的整數解計數文字題
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若同時滿足 \\( 2x - 5 > 0 \\) 及 \\( 3x - k < 0 \\) 的<b>正整數</b> \\( x \\) 的個數恰好為 3 個，求常數 \\( k \\) 的取值範圍。</div>`;
                
                steps = [
                    { text: `解第一個不等式：\\( 2x > 5 \\implies x > 2.5 \\)` },
                    { text: `解第二個不等式：\\( 3x < k \\implies x < \\frac{k}{3} \\)` },
                    { text: `要滿足條件，\\( x \\) 必須符合 \\( 2.5 < x < \\frac{k}{3} \\)。` },
                    { text: `題目指出符合條件的「正整數」恰好有 3 個。大於 2.5 的前三個正整數分別是：3, 4, 5。` },
                    { text: `這意味著 5 必須包含在解內，而下一個正整數 6 必須被排除在外。` },
                    { text: `因此，上邊界 \\( \\frac{k}{3} \\) 必須落在 5 和 6 之間。` },
                    { text: `考慮邊界等號：\\( \\frac{k}{3} \\) 可以等於 6（因為 \\( x < 6 \\) 不包含 6），但不能等於 5。` },
                    { text: `所以有 \\( 5 < \\frac{k}{3} \\le 6 \\)，同乘以 3 得：\\( 15 < k \\le 18 \\)。` }
                ];

                options = [
                    { text: "\\( 15 < k \\le 18 \\)", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "\\( 15 \\le k < 18 \\)", isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg">❗ 邊界等號判斷錯誤</div>`, buildEq(steps)) },
                    { text: "\\( 9 < k \\le 12 \\)", isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg">❗ 整數解選取錯誤</div>`, buildEq(steps)) },
                    { text: "\\( 15 < k < 18 \\)", isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg">❗ 漏掉邊界等號</div>`, buildEq(steps)) }
                ];
            } else {
                // Type 2: 結合判別式與二次方程的不等式推論 (仿 2012SP Q7)
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求 \\( k \\) 的取值範圍使得二次方程 \\( x^2 - 6x = 2 - k \\) 沒有實根。</div>`;
                
                steps = [
                    { text: `將二次方程寫成標準式 \\( ax^2 + bx + c = 0 \\)：` },
                    { text: `\\( x^2 - 6x + (k - 2) = 0 \\)，其中 \\( a = 1, b = -6, c = k - 2 \\)。` },
                    { text: `方程「沒有實根」代表其判別式小於 0：\\( \\Delta < 0 \\)` },
                    { text: `代入公式 \\( b^2 - 4ac < 0 \\)：` },
                    { text: `\\( (-6)^2 - 4(1)(k - 2) < 0 \\)` },
                    { text: `\\( 36 - 4k + 8 < 0 \\implies 44 - 4k < 0 \\implies -4k < -44 \\)` },
                    { text: `兩邊同除以 -4，<b>記得轉向不等號</b>：\\( k > 11 \\)。` }
                ];

                options = [
                    { text: "\\( k > 11 \\)", isCorrect: true, hint: wrapHint(`<div class="text-green-600 font-bold text-lg">解題正確！</div>`, buildEq(steps)) },
                    { text: "\\( k < 11 \\)", isCorrect: false, hint: wrapHint(msgIneqSign, buildEq(steps)) },
                    { text: "\\( k > -7 \\)", isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg">❗ 常數項正負號移項錯誤</div>`, buildEq(steps)) },
                    { text: "\\( k < -7 \\)", isCorrect: false, hint: wrapHint(msgIneqSign, buildEq(steps)) }
                ];
            }
        }

        options = [...new Map(options.map(item => [item.text, item])).values()];
        while(options.length < 4) {
            options.push({ text: `\\( x > ${options.length * 5} \\)`, isCorrect: false, hint: wrapHint(msgIneqSign, buildEq(steps)) });
        }
        qObj.options = shuffle(options).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx)
        }));

        bank.push(qObj);
    }
    return bank;
}