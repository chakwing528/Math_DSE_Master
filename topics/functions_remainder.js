// js/topics/functions_remainder.js

// ==========================================
// 函數與餘式定理專屬錯誤提示訊息
// ==========================================
const msgRemSign = `<div class="text-red-600 font-bold text-lg mb-1">❗ 代入正負號錯誤</div><div class="text-sm text-slate-500 mb-2">當除式為 \\( x+a \\) 時，應代入 \\( x = -a \\)；若除式為 \\( ax-b \\)，應代入 \\( x = \\frac{b}{a} \\)。</div>`;
const msgRemFactor = `<div class="text-red-600 font-bold text-lg mb-1">❗ 因式定理概念錯誤</div><div class="text-sm text-slate-500 mb-2">若某式為多項式的因式，則表示其餘數必定為 0，即 \\( f(a) = 0 \\)。</div>`;
const msgRemFuncExp = `<div class="text-red-600 font-bold text-lg mb-1">❗ 函數展開與正負號錯誤</div><div class="text-sm text-slate-500 mb-2">計算時請注意負號分配，以及完全平方公式 \\( (x \\pm y)^2 \\) 的正確展開。</div>`;
const msgRemTwoStep = `<div class="text-red-600 font-bold text-lg mb-1">❗ 未完成兩步計算</div><div class="text-sm text-slate-500 mb-2">請仔細閱讀題目，找出未知數後，記得將其代回原式以求出最終的函數值或餘數。</div>`;
const msgSimul = `<div class="text-red-600 font-bold text-lg mb-1">❗ 聯立方程解法錯誤</div><div class="text-sm text-slate-500 mb-2">當有兩個未知數時，必須利用兩個條件建立兩條方程式，再透過加減消元法或代入法求解。</div>`;

// 輔助函數：格式化多項式項
function formatPolyTerm(coef, power, isFirst) {
    if (coef === 0) return "";
    let sign = coef > 0 ? (isFirst ? "" : "+") : "-";
    let absCoef = Math.abs(coef);
    let coefStr = (absCoef === 1 && power !== 0) ? "" : absCoef;
    let powerStr = power === 0 ? "" : (power === 1 ? "x" : `x^${power}`);
    return `${sign}${coefStr}${powerStr}`;
}

// 輔助函數：格式化整個多項式
function formatPolynomial(coeffs) {
    let terms = [];
    let isFirst = true;
    for (let i = 0; i < coeffs.length; i++) {
        let p = coeffs.length - 1 - i;
        if (coeffs[i] !== 0) {
            terms.push(formatPolyTerm(coeffs[i], p, isFirst));
            isFirst = false;
        }
    }
    let res = terms.join("");
    return res === "" ? "0" : res;
}

// ==========================================
// 題目生成器：函數 / 餘式定理
// ==========================================
function generateFunctionsRemainderQuestions(num, levelPref) {
    const bank = [];
    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "函數與餘式定理" };
        let options = [];
        let steps = [];
        
        // 每個程度均有 3 種不同題型 (subType: 0, 1, 2)
        let subType = Math.floor(Math.random() * 3);

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎餘式定理與函數值 (直接代入)";
            
            if (subType === 0) {
                // Type 0: 除以 x-m (整數餘式定理)
                let a = Math.floor(Math.random() * 5) - 2;
                let b = Math.floor(Math.random() * 7) - 3; 
                let c = Math.floor(Math.random() * 9) - 4; 
                if (a===0 && b===0) a=2;
                let m = Math.floor(Math.random() * 3) + 1;
                let sign = Math.random() > 0.5 ? 1 : -1;
                m = m * sign;
                
                let divisor = m > 0 ? `x - ${m}` : `x + ${-m}`;
                let polyStr = formatPolynomial([1, a, b, c]);
                let ans = Math.pow(m, 3) + a * Math.pow(m, 2) + b * m + c;
                let wrongAnsSign = Math.pow(-m, 3) + a * Math.pow(-m, 2) + b * (-m) + c; 
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( f(x) = ${polyStr} \\)。當 \\( f(x) \\) 除以 \\( ${divisor} \\) 時，餘數為</div>`;
                steps = [
                    { text: `根據餘式定理，當除以 \\( ${divisor} \\) 時，餘數為 \\( f(${m}) \\)。`, hide: false },
                    { text: `\\( f(${m}) = (${m})^3 + ${a}(${m})^2 + ${b}(${m}) + (${c}) \\)`, hide: true },
                    { text: `\\( = ${ans} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${wrongAnsSign} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) },
                    { text: `\\( ${ans + 2} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) },
                    { text: `\\( ${ans - 2} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) }
                ];
                let w3 = ans + 4; let w4 = ans - 4;
                options[2].text = `\\( ${ans === wrongAnsSign ? w3 : ans + (Math.random()>0.5?2:3)} \\)`;
                options[3].text = `\\( ${ans === wrongAnsSign ? w4 : ans - (Math.random()>0.5?2:3)} \\)`;
                
            } else if (subType === 1) {
                // Type 1: 除以 ax-b (分數餘式定理)
                let a = 2; // 分母 2
                let b = Math.random() > 0.5 ? 1 : -1; // 分子 1 或 -1
                let divisor = b > 0 ? `2x - 1` : `2x + 1`;
                let m = b / a; // 1/2 或 -1/2
                
                let coef2 = (Math.floor(Math.random() * 3) + 1) * 4; // 4, 8, 12
                let coef1 = (Math.floor(Math.random() * 5) - 2) * 2; // 偶數
                let coef0 = Math.floor(Math.random() * 9) - 4;
                
                let polyStr = formatPolynomial([coef2, coef1, coef0]);
                let ans = coef2 * (m*m) + coef1 * m + coef0;
                let wrongM = -m;
                let wrongAns = coef2 * (wrongM*wrongM) + coef1 * wrongM + coef0;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( f(x) = ${polyStr} \\)。當 \\( f(x) \\) 除以 \\( ${divisor} \\) 時，餘數為</div>`;
                let fracStr = b > 0 ? `\\frac{1}{2}` : `-\\frac{1}{2}`;
                steps = [
                    { text: `令 \\( ${divisor} = 0 \\implies x = ${fracStr} \\)。根據餘式定理，餘數為 \\( f(${fracStr}) \\)。`, hide: false },
                    { text: `\\( f(${fracStr}) = ${coef2}(${fracStr})^2 + ${coef1}(${fracStr}) + (${coef0}) \\)`, hide: true },
                    { text: `\\( = ${coef2}(\\frac{1}{4}) + ${coef1 * m} + (${coef0}) = ${ans} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${wrongAns} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) },
                    { text: `\\( ${ans + 1} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) },
                    { text: `\\( ${ans - 2} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) }
                ];
                if(ans === wrongAns) options[1].text = `\\( ${ans + 3} \\)`;
                
            } else {
                // Type 2: 函數記號直接代值
                let a = Math.floor(Math.random() * 3) + 1;
                let b = Math.floor(Math.random() * 5) - 2;
                let c = Math.floor(Math.random() * 9) - 4;
                let m = Math.floor(Math.random() * 3) + 1;
                let sign = -1; // 故意考負數代入
                m = m * sign;
                
                let polyStr = formatPolynomial([a, b, c]);
                let ans = a * m * m + b * m + c;
                let wrongAns = a * (-m) * (-m) + b * (-m) + c; // 代成正數
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( f(x) = ${polyStr} \\)，則 \\( f(${m}) = \\)</div>`;
                steps = [
                    { text: `將 \\( x = ${m} \\) 直接代入函數中。`, hide: false },
                    { text: `\\( f(${m}) = ${a}(${m})^2 + ${b}(${m}) + (${c}) \\)`, hide: true },
                    { text: `\\( = ${a * m * m} + ${b * m} + (${c}) = ${ans} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${wrongAns} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) },
                    { text: `\\( ${ans + 2} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) },
                    { text: `\\( ${ans - 4} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) }
                ];
                if(ans === wrongAns) options[1].text = `\\( ${ans + 5} \\)`;
            }

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：基礎因式定理 (求未知常數與餘數)";
            
            if (subType === 0) {
                // Type 0: x-m 是因式，求 k (整數)
                let m = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
                let divisor = m > 0 ? `x - ${m}` : `x + ${-m}`;
                let a = Math.floor(Math.random() * 5) - 2;
                let c = (Math.floor(Math.random() * 6) + 1) * Math.abs(m) * (Math.random() > 0.5 ? 1 : -1);
                let k = -(Math.pow(m, 3) + a * Math.pow(m, 2) + c) / m;
                
                let polyStr = formatPolynomial([1, a, 0, c]).replace("x^2", "x^2 + kx").replace(" + +", " + ").replace("- +", "- ");
                if(a===0) polyStr = `x^3 + kx ${c>0?'+ '+c:'- '+Math.abs(c)}`;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( k \\) 為一常數使得 \\( ${polyStr} \\) 可被 \\( ${divisor} \\) 整除，則 \\( k = \\)</div>`;
                steps = [
                    { text: `設 \\( f(x) = ${polyStr} \\)。根據因式定理，\\( f(${m}) = 0 \\)。`, hide: false },
                    { text: `\\( (${m})^3 + ${a}(${m})^2 + k(${m}) + (${c}) = 0 \\)`, hide: true },
                    { text: `\\( ${Math.pow(m,3)} + ${a*m*m} + ${m}k + (${c}) = 0 \\implies k = ${k} \\)`, hide: false }
                ];
                let wrongK1 = (Math.pow(m, 3) + a * Math.pow(m, 2) + c) / m;
                options = [
                    { text: `\\( ${k} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${wrongK1} \\)`, isCorrect: false, hint: wrapHint(msgRemFactor, buildEq(steps)) },
                    { text: `\\( ${k + 2} \\)`, isCorrect: false, hint: wrapHint(msgRemFactor, buildEq(steps)) },
                    { text: `\\( ${k - 3} \\)`, isCorrect: false, hint: wrapHint(msgRemFactor, buildEq(steps)) }
                ];
                if(k === wrongK1) options[1].text = `\\( ${k + 4} \\)`;
                
            } else if (subType === 1) {
                // Type 1: x-m 是因式(求k)，再求除以 x-n 的餘數
                let m = (Math.floor(Math.random() * 2) + 1) * (Math.random() > 0.5 ? 1 : -1);
                let divisor = m > 0 ? `x - ${m}` : `x + ${-m}`;
                let n = (Math.floor(Math.random() * 2) + 1) * (Math.random() > 0.5 ? 1 : -1);
                if (Math.abs(m) === Math.abs(n)) n = m > 0 ? -2 : 2;
                let divisor2 = n > 0 ? `x - ${n}` : `x + ${-n}`;
                
                let c = (Math.floor(Math.random() * 4) + 1) * Math.abs(m);
                let k = -(Math.pow(m, 3) + c) / m;
                let polyStr = `x^3 + kx ${c>0?'+ '+c:'- '+Math.abs(c)}`;
                
                let ans = Math.pow(n, 3) + k * n + c;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( f(x) = ${polyStr} \\)，其中 \\( k \\) 為一常數。若 \\( f(x) \\) 可被 \\( ${divisor} \\) 整除，求當 \\( f(x) \\) 除以 \\( ${divisor2} \\) 時的餘數。</div>`;
                steps = [
                    { text: `第一步：利用 \\( f(${m}) = 0 \\) 求 \\( k \\)。`, hide: false },
                    { text: `\\( (${m})^3 + k(${m}) + (${c}) = 0 \\implies ${m}k = ${-(Math.pow(m,3)+c)} \\implies k = ${k} \\)`, hide: true },
                    { text: `第二步：求 \\( f(${n}) \\)。`, hide: true },
                    { text: `\\( f(${n}) = (${n})^3 + (${k})(${n}) + (${c}) = ${ans} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${k} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) },
                    { text: `\\( ${ans + 4} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) },
                    { text: `\\( ${ans - 2} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) }
                ];
                if (ans === k) options[1].text = `\\( ${ans + 5} \\)`;
                
            } else {
                // Type 2: ax-b 是因式 (分數根)，求 k
                let a = 2;
                let b = Math.random() > 0.5 ? 1 : -1;
                let m = b / a; 
                let divisor = b > 0 ? `2x - 1` : `2x + 1`;
                let fracStr = b > 0 ? `\\frac{1}{2}` : `-\\frac{1}{2}`;
                
                let coef2 = 4; // 避免分數計算太複雜
                let coef0 = Math.floor(Math.random() * 5) - 2;
                // f(m) = 4(1/8) + k(1/4) + coef0 = 0 => 1/2 + k/4 + coef0 = 0 => 2 + k + 4*coef0 = 0 => k = -2 - 4*coef0
                let k = -2 - 4 * coef0;
                
                let polyStr = `4x^3 + kx^2 ${coef0>0?'+ '+coef0:(coef0<0?'- '+Math.abs(coef0):'')}`;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( k \\) 為一常數使得 \\( ${polyStr} \\) 可被 \\( ${divisor} \\) 整除，則 \\( k = \\)</div>`;
                steps = [
                    { text: `根據因式定理，代入 \\( x = ${fracStr} \\) 使函數值為 0。`, hide: false },
                    { text: `\\( 4(${fracStr})^3 + k(${fracStr})^2 + (${coef0}) = 0 \\)`, hide: true },
                    { text: `\\( 4(\\frac{${b}}{8}) + k(\\frac{1}{4}) + (${coef0}) = 0 \\)`, hide: true },
                    { text: `同乘 4：\\( 2 + k + (${4*coef0}) = 0 \\implies k = ${k} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${k} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${-k} \\)`, isCorrect: false, hint: wrapHint(msgRemSign, buildEq(steps)) },
                    { text: `\\( ${k + 2} \\)`, isCorrect: false, hint: wrapHint(msgRemFactor, buildEq(steps)) },
                    { text: `\\( ${k - 4} \\)`, isCorrect: false, hint: wrapHint(msgRemFactor, buildEq(steps)) }
                ];
                if (k === -k) options[1].text = `\\( ${k + 6} \\)`;
            }

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：函數代入與多項式恆等特性 (進階)";
            
            if (subType === 0) {
                // Type 0: f(1+beta) - f(1-beta) 完全平方展開
                let a = (Math.floor(Math.random() * 3) + 2) * (Math.random()>0.5?1:-1); 
                let b = (Math.floor(Math.random() * 5) + 1) * (Math.random()>0.5?1:-1);
                let c = (Math.floor(Math.random() * 5) + 1) * (Math.random()>0.5?1:-1);
                let polyStr = formatPolynomial([a, b, c]);
                let coefAns = 4*a + 2*b;
                let ans = coefAns === 1 ? `\\beta` : (coefAns === -1 ? `-\\beta` : `${coefAns}\\beta`);
                if (coefAns === 0) ans = "0";
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( f(x) = ${polyStr} \\)。 若 \\( \\beta \\) 為一常數，則 \\( f(1+\\beta) - f(1-\\beta) = \\)</div>`;
                steps = [
                    { text: `\\( f(1+\\beta) = ${a}(1+\\beta)^2 + ${b}(1+\\beta) ${c>0?'+ '+c:c} \\)`, hide: false },
                    { text: `\\( = ${a}(1 + 2\\beta + \\beta^2) + ${b} + ${b}\\beta ${c>0?'+ '+c:c} \\)`, hide: true },
                    { text: `\\( = ${a} + ${2*a}\\beta + ${a}\\beta^2 + ${b} + ${b}\\beta ${c>0?'+ '+c:c} \\)`, hide: true },
                    { text: `同理 \\( f(1-\\beta) = ${a} - ${2*a}\\beta + ${a}\\beta^2 + ${b} - ${b}\\beta ${c>0?'+ '+c:c} \\)`, hide: true },
                    { text: `兩式相減：\\( (${2*a}\\beta + ${b}\\beta) - (-${2*a}\\beta - ${b}\\beta) = ${coefAns}\\beta \\)`, hide: false }
                ];
                let wrongCoef1 = 4*a; 
                let wrongCoef2 = 2*b; 
                let fmtAns = (cf) => { if (cf===0) return "0"; if (cf===1) return "\\beta"; if (cf===-1) return "-\\beta"; return `${cf}\\beta`; };
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${fmtAns(wrongCoef1)} \\)`, isCorrect: false, hint: wrapHint(msgRemFuncExp, buildEq(steps)) },
                    { text: `\\( ${fmtAns(wrongCoef2)} \\)`, isCorrect: false, hint: wrapHint(msgRemFuncExp, buildEq(steps)) },
                    { text: `\\( ${fmtAns(coefAns + 4)} \\)`, isCorrect: false, hint: wrapHint(msgRemFuncExp, buildEq(steps)) }
                ];

            } else if (subType === 1) {
                // Type 1: f(c) + f(-c) 奇偶次項對消
                let a = (Math.floor(Math.random() * 3) + 1);
                let b = (Math.floor(Math.random() * 4) + 1) * (Math.random()>0.5?1:-1);
                let d = (Math.floor(Math.random() * 5) + 1) * (Math.random()>0.5?1:-1);
                let polyStr = formatPolynomial([a, b, -a, d]); // ax^3 + bx^2 - ax + d
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( f(x) = ${polyStr} \\)。 若 \\( c \\) 為一常數，則 \\( f(c) + f(-c) = \\)</div>`;
                steps = [
                    { text: `\\( f(c) = ${a}c^3 + ${b}c^2 - ${a}c + ${d} \\)`, hide: false },
                    { text: `代入負數注意次方：\\( f(-c) = ${a}(-c)^3 + ${b}(-c)^2 - ${a}(-c) + ${d} = -${a}c^3 + ${b}c^2 + ${a}c + ${d} \\)`, hide: true },
                    { text: `將兩式相加，奇數次方項會剛好互相抵消 (對消)。`, hide: true },
                    { text: `\\( f(c) + f(-c) = 2(${b}c^2) + 2(${d}) = ${2*b}c^2 ${2*d>0?'+ '+2*d:2*d} \\)`, hide: false }
                ];
                
                let ansStr = `${2*b}c^2 ${2*d>0?'+ '+2*d:2*d}`;
                let w1 = `${2*a}c^3 ${-2*a>0?'+ '+(-2*a):-2*a}c`; // 錯算成相減
                let w2 = `${2*b}c^2 ${d>0?'+ '+d:d}`; // 常數忘了乘2
                let w3 = `${b}c^2 ${2*d>0?'+ '+2*d:2*d}`; // 平方忘了乘2
                
                options = [
                    { text: `\\( ${ansStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${w1} \\)`, isCorrect: false, hint: wrapHint(msgRemFuncExp, buildEq(steps)) },
                    { text: `\\( ${w2} \\)`, isCorrect: false, hint: wrapHint(msgRemFuncExp, buildEq(steps)) },
                    { text: `\\( ${w3} \\)`, isCorrect: false, hint: wrapHint(msgRemFuncExp, buildEq(steps)) }
                ];
                
            } else {
                // Type 2: f(0)=f(q)=V, f(x)=(x+h)(x-p)+k 求 h
                let p = Math.floor(Math.random() * 5) + 2; 
                let q = p + Math.floor(Math.random() * 4) + 1; // 確保 q > p
                let V = Math.floor(Math.random() * 5) + 1;
                // 根據推導: h = p - q
                let h = p - q; 
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( f(x) = (x+h)(x-${p}) + k \\)，其中 \\( h \\) 及 \\( k \\) 均為常數。若 \\( f(0) = f(${q}) = ${V} \\)，求 \\( h \\)。</div>`;
                steps = [
                    { text: `這題只需利用 \\( f(0) = f(${q}) \\) 即可消去 \\( k \\) 和 \\( V \\)。`, hide: false },
                    { text: `\\( f(0) = (0+h)(0-${p}) + k = -${p}h + k \\)`, hide: true },
                    { text: `\\( f(${q}) = (${q}+h)(${q}-${p}) + k = ${q-p}(${q}+h) + k = ${q*(q-p)} + ${q-p}h + k \\)`, hide: true },
                    { text: `兩式相等：\\( -${p}h + k = ${q*(q-p)} + ${q-p}h + k \\)`, hide: true },
                    { text: `消去 \\( k \\) 並移項：\\( -${p}h - ${q-p}h = ${q*(q-p)} \\implies -${q}h = ${q*(q-p)} \\implies h = ${-(q-p)} = ${h} \\)`, hide: false }
                ];
                
                options = [
                    { text: `\\( ${h} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${-h} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) },
                    { text: `\\( ${p+q} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) },
                    { text: `\\( ${h-2} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) }
                ];
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：進階定理綜合 (兩步與聯立方程拔尖)";
            
            if (subType === 0) {
                // Type 0: g(x) = ax^3 + 4ax^2 - c, 已知因式求 g(n) (同原拔尖題)
                let m = (Math.floor(Math.random() * 2) + 1) * (Math.random() > 0.5 ? 1 : -1);
                let divisor = m > 0 ? `x - ${m}` : `x + ${-m}`;
                let b = Math.floor(Math.random() * 3) + 2; 
                let a_val = (Math.floor(Math.random() * 3) + 1) * (Math.random()>0.5?1:-1);
                let c = - a_val * (Math.pow(m,3) + b * Math.pow(m,2));
                
                let polyStr = `a x^3 ${b>0?'+':'-'} ${Math.abs(b)}a x^2 ${c>0?'+ '+c:'- '+Math.abs(c)}`;
                let targetX = Math.floor(Math.random() * 3) + 1;
                if (targetX === Math.abs(m)) targetX += 1; 
                let ans = a_val * Math.pow(targetX, 3) + b * a_val * Math.pow(targetX, 2) + c;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( g(x) = ${polyStr} \\)，其中 \\( a \\) 為一常數。若 \\( ${divisor} \\) 為 \\( g(x) \\) 的因式，則 \\( g(${targetX}) = \\)</div>`;
                steps = [
                    { text: `第一步：求常數 \\( a \\)。因為 \\( ${divisor} \\) 為因式，所以 \\( g(${m}) = 0 \\)。`, hide: false },
                    { text: `\\( a(${m})^3 + ${b}a(${m})^2 + (${c}) = 0 \\implies ${Math.pow(m,3) + b*Math.pow(m,2)}a = ${-c} \\implies a = ${a_val} \\)`, hide: true },
                    { text: `第二步：代回求 \\( g(${targetX}) \\)。`, hide: true },
                    { text: `\\( g(${targetX}) = ${a_val}(${targetX})^3 + (${b*a_val})(${targetX})^2 + (${c}) = ${ans} \\)`, hide: false }
                ];
                let wrongAns2 = a_val; 
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${wrongAns2} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep + "<div class='text-sm text-slate-500'>提示：這只是常數 a 的值，題目要求的是 g(x)。</div>", buildEq(steps)) },
                    { text: `\\( ${ans + 12} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) },
                    { text: `\\( ${ans - 8} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) }
                ];
                
            } else if (subType === 1) {
                // Type 1: 聯立方程求未知數
                // f(x) = x^3 + ax^2 + bx + c. 
                let a = Math.floor(Math.random() * 5) - 2;
                let b = Math.floor(Math.random() * 5) - 2;
                let c_val = Math.floor(Math.random() * 5) + 1;
                // Divisible by x-1 => 1 + a + b + c = 0 => a+b = -(1+c)
                // Divided by x+1 rem R => -1 + a - b + c = R => a-b = R + 1 - c
                let R = -1 + a - b + c_val;
                
                let polyStr = `x^3 + ax^2 + bx + ${c_val}`;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( f(x) = ${polyStr} \\)。若 \\( f(x) \\) 可被 \\( x - 1 \\) 整除，且當 \\( f(x) \\) 除以 \\( x + 1 \\) 時的餘數為 \\( ${R} \\)，求 \\( a \\)。</div>`;
                steps = [
                    { text: `根據因式定理，\\( f(1) = 0 \\implies 1 + a + b + ${c_val} = 0 \\implies a + b = ${-(1+c_val)} \\)  --- (1)`, hide: false },
                    { text: `根據餘式定理，\\( f(-1) = ${R} \\implies -1 + a - b + ${c_val} = ${R} \\implies a - b = ${R + 1 - c_val} \\)  --- (2)`, hide: true },
                    { text: `兩式相加：\\( (a+b) + (a-b) = ${-(1+c_val)} + ${R + 1 - c_val} \\)`, hide: true },
                    { text: `\\( 2a = ${-(1+c_val) + R + 1 - c_val} \\implies a = ${a} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${a} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${b} \\)`, isCorrect: false, hint: wrapHint(msgSimul + "<div class='text-sm text-slate-500'>提示：這是 b 的值，小心看錯題目要求的未知數。</div>", buildEq(steps)) },
                    { text: `\\( ${a+2} \\)`, isCorrect: false, hint: wrapHint(msgSimul, buildEq(steps)) },
                    { text: `\\( ${a-1} \\)`, isCorrect: false, hint: wrapHint(msgSimul, buildEq(steps)) }
                ];
                if(a === b) options[1].text = `\\( ${a+3} \\)`;

            } else {
                // Type 2: 隱藏兩條件 (被 x^2 - m^2 整除)
                let m = Math.floor(Math.random() * 2) + 1; 
                let m2 = m * m;
                let c_val = (Math.floor(Math.random() * 4) + 1) * (Math.random()>0.5?1:-1) * m2; 
                let a = -c_val / m2; // 因為 a*m^2 + c = 0
                let b = Math.floor(Math.random() * 5) - 2;
                
                let polyStr = `2x^3 + ax^2 + bx ${c_val>0?'+ '+c_val:(c_val<0?'- '+Math.abs(c_val):'')}`;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( f(x) = ${polyStr} \\)。若 \\( f(x) \\) 可被 \\( x^2 - ${m2} \\) 整除，求 \\( a \\)。</div>`;
                steps = [
                    { text: `\\( x^2 - ${m2} = (x - ${m})(x + ${m}) \\)，這表示 \\( x-${m} \\) 和 \\( x+${m} \\) 都是 \\( f(x) \\) 的因式。`, hide: false },
                    { text: `由 \\( f(${m}) = 0 \\implies 2(${m})^3 + a(${m})^2 + b(${m}) + (${c_val}) = 0 \\implies ${2*Math.pow(m,3)} + ${m2}a + ${m}b + (${c_val}) = 0 \\)`, hide: true },
                    { text: `由 \\( f(-${m}) = 0 \\implies -${2*Math.pow(m,3)} + ${m2}a - ${m}b + (${c_val}) = 0 \\)`, hide: true },
                    { text: `將兩式相加，奇數次方的項互消：\\( 2(${m2}a) + 2(${c_val}) = 0 \\)`, hide: true },
                    { text: `\\( ${2*m2}a = ${-2*c_val} \\implies a = ${a} \\)`, hide: false }
                ];
                options = [
                    { text: `\\( ${a} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${-a} \\)`, isCorrect: false, hint: wrapHint(msgSimul, buildEq(steps)) },
                    { text: `\\( ${b} \\)`, isCorrect: false, hint: wrapHint(msgSimul + "<div class='text-sm text-slate-500'>提示：這是 b 的值，請重新檢視聯立相消的步驟。</div>", buildEq(steps)) },
                    { text: `\\( ${a+3} \\)`, isCorrect: false, hint: wrapHint(msgSimul, buildEq(steps)) }
                ];
                if(a === b || -a === b) options[2].text = `\\( ${a+4} \\)`;
            }
        }
        
        // 選項去重與補足 4 個
        options = [...new Map(options.map(item => [item.text, item])).values()];
        let loopProtect = 1;
        while(options.length < 4) { 
            options.push({ text: `\\( ${loopProtect * 7 - 2} \\)`, isCorrect: false, hint: wrapHint(msgRemTwoStep, buildEq(steps)) }); 
            loopProtect++;
            options = [...new Map(options.map(item => [item.text, item])).values()];
        }
        options = options.slice(0, 4);

        qObj.options = shuffleArray(options).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx)
        }));

        bank.push(qObj);
    }
    return bank;
}
