// js/topics/simple_inequalities.js

// ==========================================
// 基礎不等式專用錯誤提示訊息 (無 及/或 邏輯)
// ==========================================
const msgSimpleIneqSign = `<div class="text-red-600 font-bold text-lg mb-1">❗ 負數變號錯誤</div><div class="text-sm text-slate-500 mb-2">當不等式兩邊同時乘以或除以一個負數時，不等號的方向必須反轉（例如：\\(>\\) 變成 \\(<\\)）。</div>`;
const msgIneqFrac = `<div class="text-red-600 font-bold text-lg mb-1">❗ 分數展開或移項錯誤</div><div class="text-sm text-slate-500 mb-2">同乘公倍數消去分母時，請確保每一項都有乘到；若分子有負號，展開時括號內的每一項都要變號（特別注意負負得正）。</div>`;
const msgIneqProp = `<div class="text-red-600 font-bold text-lg mb-1">❗ 不等式性質理解錯誤</div><div class="text-sm text-slate-500 mb-2">請注意：<br>1. 同乘/除負數要變號。<br>2. 倒數性質：若 \\(a > b > 0\\)，則 \\(\\frac{1}{a} < \\frac{1}{b}\\)。<br>3. 平方性質：若涉及負數，平方後的大小關係可能會改變。</div>`;
const msgIneqInt = `<div class="text-red-600 font-bold text-lg mb-1">❗ 極值整數選取錯誤</div><div class="text-sm text-slate-500 mb-2">尋找最大或最小整數時，請注意不等號是否包含等號（\\(\\le\\) 或 \\(\\ge\\)）。例如 \\(x < 3\\) 的最大整數是 2，而 \\(x \\le 3\\) 的最大整數是 3。</div>`;

function _siShuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function _siBuildEq(steps) {
    return steps.map(s => `<div class="my-1">${s.text}</div>`).join('');
}

function _siWrapHint(msg, stepsHtml) {
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
// 題目生成器：基礎不等式 (Simple Inequalities)
// ==========================================
function generateSimpleInequalitiesQuestions(num, levelPref) {
    const bank = [];
    const vars = ['x', 'y', 'm', 'n'];

    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "不等式 (Inequalities)" };
        const v = vars[Math.floor(Math.random() * vars.length)];
        let steps = [];
        let options = [];
        let subType = Math.floor(Math.random() * 3);

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎一元一次不等式 (單邊移項與變號)";
            
            if (subType === 0) {
                // Type 0: ax + b > c (正係數)
                let a = Math.floor(Math.random() * 4) + 2; 
                let ans = Math.floor(Math.random() * 6) + 2; 
                let b = Math.floor(Math.random() * 10) + 1; 
                let c = a * ans + b; 
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式 \\( ${a}${v} + ${b} > ${c} \\)。</div>`;
                steps = [
                    { text: `移項：\\( ${a}${v} > ${c} - ${b} \\)`, hide: false },
                    { text: `化簡：\\( ${a}${v} > ${c - b} \\)`, hide: true },
                    { text: `兩邊同除以正數 ${a} (不變號)：\\( ${v} > ${ans} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${v} > ${ans} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${v} < ${ans} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: `\\( ${v} > ${ans + 2} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) },
                    { text: `\\( ${v} < ${ans + 2} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: b - ax >= c (負係數，需變號)
                let a = Math.floor(Math.random() * 4) + 2; 
                let ans = Math.floor(Math.random() * 6) + 2; 
                let b = Math.floor(Math.random() * 10) + 10; 
                let c = b - a * ans; // -a * ans = c - b
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式 \\( ${b} - ${a}${v} \\ge ${c} \\)。</div>`;
                steps = [
                    { text: `移項：\\( -${a}${v} \\ge ${c} - ${b} \\)`, hide: false },
                    { text: `化簡：\\( -${a}${v} \\ge ${c - b} \\)`, hide: true },
                    { text: `兩邊同除以負數 -${a} <b>(注意：必須反轉不等號)</b>：\\( ${v} \\le ${ans} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${v} \\le ${ans} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${v} \\ge ${ans} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: `\\( ${v} \\le ${ans + 1} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) },
                    { text: `\\( ${v} \\ge ${ans + 1} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) }
                ];
            } else {
                // Type 2: 基礎分數 (v/a - b < c)
                let a = Math.floor(Math.random() * 3) + 2; 
                let ans = Math.floor(Math.random() * 4) + 2; 
                let c = Math.floor(Math.random() * 5) + 1; 
                let b = Math.floor(Math.random() * 5) + 1; 
                let ans_val = a * (c + b);
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式 \\( \\frac{${v}}{${a}} - ${b} < ${c} \\)。</div>`;
                steps = [
                    { text: `移項：\\( \\frac{${v}}{${a}} < ${c} + ${b} \\)`, hide: false },
                    { text: `化簡：\\( \\frac{${v}}{${a}} < ${c + b} \\)`, hide: true },
                    { text: `兩邊同乘以正數 ${a}：\\( ${v} < ${ans_val} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${v} < ${ans_val} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${v} > ${ans_val} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: `\\( ${v} < ${c + b - a} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) },
                    { text: `\\( ${v} > ${c + b - a} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) }
                ];
            }

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：雙邊變數與括號展開";
            
            if (subType === 0) {
                // Type 0: ax - b < cx - d (需變號情況)
                let a = Math.floor(Math.random() * 3) + 2; 
                let c = a + Math.floor(Math.random() * 3) + 1; // c > a
                let ans = Math.floor(Math.random() * 5) + 2; 
                let d = Math.floor(Math.random() * 10) + 1;
                let b = d + (a - c) * ans;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式 \\( ${a}${v} - ${b} < ${c}${v} - ${d} \\)。</div>`;
                steps = [
                    { text: `將變數移至左邊，常數移至右邊：\\( ${a}${v} - ${c}${v} < ${b} - ${d} \\)`, hide: false },
                    { text: `化簡：\\( ${a-c}${v} < ${b-d} \\)`, hide: true },
                    { text: `兩邊同除以負數 ${a-c} <b>(注意變號)</b>：\\( ${v} > ${ans} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${v} > ${ans} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${v} < ${ans} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: `\\( ${v} > ${ans + 1} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) },
                    { text: `\\( ${v} < ${ans + 1} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 帶括號展開 a(x - b) >= cx - d
                let a = Math.floor(Math.random() * 3) + 3; 
                let c = a - Math.floor(Math.random() * 2) - 1; // a > c
                let ans = Math.floor(Math.random() * 5) + 2; 
                let b = Math.floor(Math.random() * 4) + 2;
                let d = a * b - (a - c) * ans;
                
                let dStr = d >= 0 ? `- ${d}` : `+ ${-d}`;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式 \\( ${a}(${v} - ${b}) \\ge ${c}${v} ${dStr} \\)。</div>`;
                steps = [
                    { text: `展開括號：\\( ${a}${v} - ${a*b} \\ge ${c}${v} ${dStr} \\)`, hide: false },
                    { text: `移項：\\( ${a}${v} - ${c}${v} \\ge ${a*b} ${dStr} \\)`, hide: true },
                    { text: `化簡：\\( ${a-c}${v} \\ge ${a*b - d} \\)`, hide: true },
                    { text: `除以正數 ${a-c}：\\( ${v} \\ge ${ans} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${v} \\ge ${ans} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${v} \\le ${ans} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: `\\( ${v} \\ge ${ans + 2} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) },
                    { text: `\\( ${v} \\le ${ans + 2} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) }
                ];
            } else {
                // Type 2: 單邊帶分數的雙邊變數 (ax - b)/c > x - d
                let c = Math.floor(Math.random() * 2) + 2; // 2 or 3
                let a = c + Math.floor(Math.random() * 2) + 1; // a > c
                let ans = Math.floor(Math.random() * 4) + 1;
                let b = Math.floor(Math.random() * 5) + 2;
                let d_val = (b - (a - c) * ans) / c;
                let d = Math.floor(d_val); 
                ans = (b - c * d) / (a - c);
                let ansStr = ans % 1 === 0 ? ans : `\\frac{${b - c * d}}{${a - c}}`;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式 \\( \\frac{${a}${v} - ${b}}{${c}} > ${v} - ${d} \\)。</div>`;
                steps = [
                    { text: `兩邊同乘 ${c} 消去分母：\\( ${a}${v} - ${b} > ${c}(${v} - ${d}) \\)`, hide: false },
                    { text: `展開：\\( ${a}${v} - ${b} > ${c}${v} - ${c*d} \\)`, hide: true },
                    { text: `移項與化簡：\\( ${a-c}${v} > ${b - c*d} \\)`, hide: true },
                    { text: `求得：\\( ${v} > ${ansStr} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${v} > ${ansStr} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${v} < ${ansStr} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: `\\( ${v} > \\frac{${b - d}}{${a - 1}} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac + "<div class='text-sm text-slate-500'>提示：右邊常數項忘記乘分母。</div>", _siBuildEq(steps)) },
                    { text: `\\( ${v} < \\frac{${b - d}}{${a - 1}} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) }
                ];
            }

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：不等式性質推導與判斷";
            
            if (subType === 0) {
                // Type 0: a > b, k < 0 (仿 DSE 常見 T/F)
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">已知 \\( a > b \\) 且 \\( k < 0 \\)，判斷下列何者<b>必為正確</b>？<br>I. \\( \\frac{a}{k} < \\frac{b}{k} \\)<br>II. \\( a - k > b - k \\)<br>III. \\( ak^2 > bk^2 \\)</div>`;
                steps = [
                    { text: `I. 因為 \\( k < 0 \\)，兩邊同除以負數必須變號，故 \\( \\frac{a}{k} < \\frac{b}{k} \\) 正確。`, hide: false },
                    { text: `II. 不等式兩邊同時減去同一個數，不等號方向不變，故 \\( a - k > b - k \\) 正確。`, hide: false },
                    { text: `III. 因為 \\( k < 0 \\)，所以平方後 \\( k^2 > 0 \\)。同乘正數不變號，故 \\( ak^2 > bk^2 \\) 正確。`, hide: false }
                ];
                options = [
                    { text: `I、II 及 III`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `只有 I 及 II`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                    { text: `只有 II 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                    { text: `只有 I 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 負數範圍 a < b < 0
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">已知 \\( a < b < 0 \\)，判斷下列何者<b>必為正確</b>？<br>I. \\( a^2 > b^2 \\)<br>II. \\( \\frac{1}{a} > \\frac{1}{b} \\)<br>III. \\( a + b > 0 \\)</div>`;
                steps = [
                    { text: `I. 兩者皆為負數且 \\( a \\) 較小（絕對值較大，如 -3 < -2），平方後 \\( (-3)^2 > (-2)^2 \\implies 9 > 4 \\)，故 \\( a^2 > b^2 \\) 正確。`, hide: false },
                    { text: `II. 倒數性質：若兩數同號且 \\( a < b \\)，則倒數後方向反轉 \\( \\frac{1}{a} > \\frac{1}{b} \\) 正確。（如 -1/3 > -1/2）`, hide: false },
                    { text: `III. 兩個負數相加必定小於零，故 \\( a + b < 0 \\)，III 錯誤。`, hide: false }
                ];
                options = [
                    { text: `只有 I 及 II`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `只有 I 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                    { text: `只有 II 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                    { text: `I、II 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) }
                ];
            } else {
                // Type 2: 正數範圍 x > y > 0
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">已知 \\( x > y > 0 \\)，判斷下列何者<b>必為正確</b>？<br>I. \\( -x < -y \\)<br>II. \\( x^2 > y^2 \\)<br>III. \\( \\frac{1}{x} < \\frac{1}{y} \\)</div>`;
                steps = [
                    { text: `I. 同乘 -1 必須變號，故 \\( -x < -y \\) 正確。`, hide: false },
                    { text: `II. 兩者皆正且 \\( x > y \\)，平方後仍維持 \\( x^2 > y^2 \\) 正確。`, hide: false },
                    { text: `III. 同號正數倒數後方向反轉，故 \\( \\frac{1}{x} < \\frac{1}{y} \\) 正確。`, hide: false }
                ];
                options = [
                    { text: `I、II 及 III`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `只有 I 及 II`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                    { text: `只有 II 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                    { text: `只有 I 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) }
                ];
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：求極端整數解與三個分式不等式 (拔尖)";
            
            if (subType === 0) {
                // Type 0: 求最大整數解 (ax - b < cx - d)
                let c = Math.floor(Math.random() * 3) + 3; 
                let a = c + Math.floor(Math.random() * 2) + 1; 
                let exact = Math.floor(Math.random() * 5) + 2.5; 
                let diff_x = a - c;
                let b = Math.floor(Math.random() * 10) + 5;
                let b_minus_d = Math.floor(exact * diff_x);
                let d = b - b_minus_d;
                
                let limit = b_minus_d / diff_x;
                let maxInt = Math.floor(limit);
                if (limit === maxInt) maxInt -= 1; 
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求滿足不等式 \\( ${a}${v} - ${b} < ${c}${v} - ${d} \\) 的<b>最大整數</b>。</div>`;
                steps = [
                    { text: `移項：\\( ${a-c}${v} < ${b-d} \\)`, hide: false },
                    { text: `除以 ${a-c}：\\( ${v} < ${limit} \\)`, hide: true },
                    { text: `小於 ${limit} 的最大整數為 ${maxInt}。`, hide: false }
                ];
                options = [
                    { text: `\\( ${maxInt} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${Math.ceil(limit)} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: `\\( ${maxInt - 1} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: `\\( ${maxInt + 2} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 求最小整數解 (分式)
                let a = Math.floor(Math.random() * 2) + 2; 
                let b = Math.floor(Math.random() * 3) + 2; 
                let exact = Math.floor(Math.random() * 4) + 1.2; 
                let limit = exact * a;
                let c = exact - b; 
                let cStr = c % 1 === 0 ? c : c.toFixed(1);
                
                let minInt = Math.ceil(limit);
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求滿足不等式 \\( \\frac{${v}}{${a}} - ${b} \\ge ${cStr} \\) 的<b>最小整數</b>。</div>`;
                steps = [
                    { text: `移項：\\( \\frac{${v}}{${a}} \\ge ${cStr} + ${b} \\)`, hide: false },
                    { text: `化簡：\\( \\frac{${v}}{${a}} \\ge ${(c + b).toFixed(1)} \\)`, hide: true },
                    { text: `乘 ${a}：\\( ${v} \\ge ${limit} \\)`, hide: true },
                    { text: `大於或等於 ${limit} 的最小整數為 ${minInt}。`, hide: false }
                ];
                options = [
                    { text: `\\( ${minInt} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${Math.floor(limit)} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: `\\( ${minInt + 1} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: `\\( ${minInt - 2} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) }
                ];
            } else {
                // Type 2: 三個分式組成的不等式 (中二拔尖：公倍數與負號分配)
                let denomSets = [
                    { d1: 2, d2: 3, d3: 4, L: 12 },
                    { d1: 3, d2: 4, d3: 6, L: 12 },
                    { d1: 2, d2: 5, d3: 10, L: 10 }
                ];
                let dSet = denomSets[Math.floor(Math.random() * denomSets.length)];
                let m1 = dSet.L / dSet.d1;
                let m2 = dSet.L / dSet.d2;
                let m3 = dSet.L / dSet.d3;

                let A = Math.floor(Math.random() * 2) + 1; 
                let C = Math.floor(Math.random() * 2) + 2; 
                let E = Math.floor(Math.random() * 2) + 1;
                
                // 確保 m1*A - m2*C - m3*E < 0 以觸發最終除以負數變號
                while (m1 * A - m2 * C - m3 * E >= 0) {
                    C++;
                }
                let coeffX = m1 * A - m2 * C - m3 * E;

                let B = Math.floor(Math.random() * 5) + 1;
                let D = Math.floor(Math.random() * 5) + 1;
                let F = Math.floor(Math.random() * 5) + 1;

                let isPlus1 = Math.random() > 0.5;
                let isPlus3 = Math.random() > 0.5;
                let sign1 = isPlus1 ? "+" : "-";
                let sign3 = isPlus3 ? "+" : "-";

                let strF1 = A === 1 ? `\\frac{${v} ${sign1} ${B}}{${dSet.d1}}` : `\\frac{${A}${v} ${sign1} ${B}}{${dSet.d1}}`;
                let strF2 = C === 1 ? `\\frac{${v} - ${D}}{${dSet.d2}}` : `\\frac{${C}${v} - ${D}}{${dSet.d2}}`;
                let strF3 = E === 1 ? `\\frac{${v} ${sign3} ${F}}{${dSet.d3}}` : `\\frac{${E}${v} ${sign3} ${F}}{${dSet.d3}}`;

                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式：</div>
                <div class="text-xl sm:text-2xl font-bold text-indigo-700 py-2">\\( ${strF1} - ${strF2} \\ge ${strF3} \\)</div>`;

                let B_term = isPlus1 ? m1 * B : -m1 * B;
                let D_term = m2 * D; // -m2 * (-D) = + m2 * D (負號分配！)
                let F_term = isPlus3 ? m3 * F : -m3 * F;

                // coeffX * v >= F_term - B_term - D_term
                let rhsConst = F_term - B_term - D_term;

                let gcdVal = function(a, b) {
                    return b === 0 ? a : gcdVal(b, a % b);
                };

                let num = rhsConst;
                let den = coeffX;
                if (den < 0) { num = -num; den = -den; }
                let g = Math.abs(gcdVal(num, den));
                num = num / g;
                den = den / g;

                // 由於 den 是負數被轉正，原來的 >= 會變成 <=
                let ansStr = den === 1 ? `${num}` : `\\frac{${num}}{${den}}`;

                // 干擾項計算：忘記分配負號給 -D，即變成 -m2 * D
                let wrongD_term = -m2 * D;
                let wrongRhsConst = F_term - B_term - wrongD_term;
                let wNum = wrongRhsConst;
                let wDen = coeffX;
                if (wDen < 0) { wNum = -wNum; wDen = -wDen; }
                let wg = Math.abs(gcdVal(wNum, wDen));
                wNum = wNum / wg;
                wDen = wDen / wg;
                let wAnsStr = wDen === 1 ? `${wNum}` : `\\frac{${wNum}}{${wDen}}`;

                steps = [
                    { text: `兩邊同乘以分母的最小公倍數 ${dSet.L}：`, hide: false },
                    { text: `\\( ${m1}(${A===1?'':A}${v} ${sign1} ${B}) - ${m2}(${C===1?'':C}${v} - ${D}) \\ge ${m3}(${E===1?'':E}${v} ${sign3} ${F}) \\)`, hide: true },
                    { text: `展開括號（<b>注意：負號分配給 -${D} 會變正數！</b>）：`, hide: true },
                    { text: `\\( ${m1*A}${v} ${isPlus1?'+':'-'} ${Math.abs(B_term)} - ${m2*C}${v} + ${m2*D} \\ge ${m3*E}${v} ${isPlus3?'+':'-'} ${Math.abs(F_term)} \\)`, hide: true },
                    { text: `移項：\\( (${m1*A} - ${m2*C} - ${m3*E})${v} \\ge ${F_term} ${B_term>0?'-':'+'} ${Math.abs(B_term)} - ${m2*D} \\)`, hide: true },
                    { text: `化簡得：\\( ${coeffX}${v} \\ge ${rhsConst} \\)`, hide: true },
                    { text: `兩邊同除以負數 ${coeffX}，<b>不等號必須轉向</b>：\\( ${v} \\le ${ansStr} \\)。`, hide: false }
                ];

                options = [
                    { text: `\\( ${v} \\le ${ansStr} \\)`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: `\\( ${v} \\ge ${ansStr} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: `\\( ${v} \\le ${wAnsStr} \\)`, isCorrect: false, hint: _siWrapHint(msgIneqFrac + "<div class='text-sm text-slate-500'>提示：展開括號時，- (Cx - D) 後面常數項應為 + D。</div>", _siBuildEq(steps)) },
                    { text: `\\( ${v} \\ge ${wAnsStr} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign + "<br>" + msgIneqFrac, _siBuildEq(steps)) }
                ];
            }
        }

        options = [...new Map(options.map(item => [item.text, item])).values()];
        while(options.length < 4) {
            options.push({ text: `\\( x > ${options.length * 5} \\)`, isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) });
        }
        qObj.options = _siShuffle(options).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx)
        }));

        bank.push(qObj);
    }
    return bank;
}
