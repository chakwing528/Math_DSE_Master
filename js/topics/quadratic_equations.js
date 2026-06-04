// js/topics/quadratic_equations.js

// ==========================================
// 二次方程專屬錯誤提示訊息
// ==========================================
const msgQuadLoseRoot = `<div class="text-red-600 font-bold text-lg mb-1">❗ 漏掉可能根 / 隨意約簡變數</div><div class="text-sm text-slate-500 mb-2">解方程時，切勿直接將含有未知數的公因式約走（例如兩邊同除以 \\( x-a \\)），這樣會漏掉 \\( x-a=0 \\) 這個根。應該將所有項移到同一邊，然後抽取公因式。</div>`;
const msgQuadDiscriminant = `<div class="text-red-600 font-bold text-lg mb-1">❗ 判別式計算錯誤</div><div class="text-sm text-slate-500 mb-2">二次方程 \\( ax^2+bx+c=0 \\) 的判別式為 \\( \\Delta = b^2 - 4ac \\)。請留意 \\( a, b, c \\) 的正負號，特別是減去負數時會變成加。</div>`;
const msgQuadInequality = `<div class="text-red-600 font-bold text-lg mb-1">❗ 不等式變號錯誤</div><div class="text-sm text-slate-500 mb-2">當解判別式的不等式（例如 \\( -4k < 12 \\)）時，若兩邊同除以或同乘以一個負數，不等號的方向必須改變（變成 \\( k > -3 \\)）。</div>`;
const msgQuadSumProduct = `<div class="text-red-600 font-bold text-lg mb-1">❗ 兩根之和/兩根之積公式錯誤</div><div class="text-sm text-slate-500 mb-2">對於 \\( ax^2+bx+c=0 \\)，兩根之和 \\( \\alpha+\\beta = -\\frac{b}{a} \\)，兩根之積 \\( \\alpha\\beta = \\frac{c}{a} \\)。請特別注意 \\( -b \\) 的負號。</div>`;
const msgQuadDisguised = `<div class="text-red-600 font-bold text-lg mb-1">❗ 未能辨識隱藏的二次方程</div><div class="text-sm text-slate-500 mb-2">當看到兩條結構完全相同的式子分別代入 \\( \\alpha \\) 和 \\( \\beta \\) 時，這代表 \\( \\alpha \\) 和 \\( \\beta \\) 都是該對應二次方程的根。請先重組出標準的二次方程 \\( ax^2+bx+c=0 \\)。</div>`;

// 輔助函數
function formatQuad(a, b, c) {
    let res = "";
    if (a === 1) res += "x^2";
    else if (a === -1) res += "-x^2";
    else if (a !== 0) res += `${a}x^2`;

    if (b > 0) res += res ? `+${b === 1 ? "" : b}x` : `${b === 1 ? "" : b}x`;
    else if (b < 0) res += `-${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;

    if (c > 0) res += res ? `+${c}` : `${c}`;
    else if (c < 0) res += `-${Math.abs(c)}`;
    
    return res === "" ? "0" : res;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// ==========================================
// 主題目生成器：二次方程
// ==========================================
function generateQuadraticQuestions(num, levelPref) {
    const bank = [];
    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "二次方程" };
        let options = [];
        let steps = [];
        let subType = Math.floor(Math.random() * 3);

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎二次方程求解 (防漏根陷阱)";
            
            if (subType === 0) {
                // Type 0: (x-a)(x-b) = (x-a) 仿 2012SP Q6
                let a = Math.floor(Math.random() * 5) + 1;
                let b = Math.floor(Math.random() * 5) + 1; 
                let b_str = `a + ${b}`;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( a \\) 為一常數。解方程 \\( (x-a)(x - a - ${b}) = (x-a) \\)。</div>`;
                let ans1 = `a`;
                let ans2 = `a + ${b + 1}`;
                let w1 = `a + ${b + 1}`; // 只答一個根
                let w2 = `a`; // 只答一個根
                let w3 = `a \\text{ 或 } a + ${b}`; // 沒把 1 移項
                
                steps = [
                    { text: `絕對不能直接將兩邊的 \\( (x-a) \\) 約掉！這會漏失根。`, hide: false },
                    { text: `正確做法是將右邊移項至左邊：\\( (x-a)(x - a - ${b}) - (x-a) = 0 \\)`, hide: true },
                    { text: `抽取公因式 \\( (x-a) \\)：\\( (x-a)[(x - a - ${b}) - 1] = 0 \\)`, hide: true },
                    { text: `\\( (x-a)(x - a - ${b + 1}) = 0 \\)`, hide: true },
                    { text: `因此 \\( x-a = 0 \\) 或 \\( x - a - ${b + 1} = 0 \\) \\( \\implies x = a \\text{ 或 } x = a + ${b + 1} \\)`, hide: false }
                ];
                
                options = [
                    { text: `\\( x = ${ans1} \\text{ 或 } x = ${ans2} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( x = ${w1} \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot, buildEq(steps)) },
                    { text: `\\( x = ${ans1} \\text{ 或 } x = a + ${b} \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot + "<div class='text-sm text-slate-500'>提示：右邊的 (x-a) 移項並抽取出來後，會剩下 -1，而非 0。</div>", buildEq(steps)) },
                    { text: `\\( x = -a \\text{ 或 } x = -a - ${b + 1} \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: (x-k)^2 = m^2 k^2 仿 2013 Q6
                let m = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
                let m2 = m * m;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( k \\) 為一常數。解方程 \\( (x-k)^2 = ${m2}k^2 \\)。</div>`;
                steps = [
                    { text: `兩邊同時開平方根，切記右邊要加上正負號 (\\( \\pm \\))。`, hide: false },
                    { text: `\\( x - k = \\pm \\sqrt{${m2}k^2} = \\pm ${m}k \\)`, hide: true },
                    { text: `情況 1：\\( x - k = ${m}k \\implies x = ${m + 1}k \\)`, hide: true },
                    { text: `情況 2：\\( x - k = -${m}k \\implies x = ${1 - m}k \\)`, hide: true },
                    { text: `所以 \\( x = ${1 - m}k \\text{ 或 } x = ${m + 1}k \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( x = ${1 - m}k \\text{ 或 } x = ${m + 1}k \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( x = ${m - 1}k \\text{ 或 } x = ${m + 1}k \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot + "<div class='text-sm text-slate-500'>提示：注意移項時符號的變化，\\(-k\\) 移過等號會變成 \\(+k\\)。</div>", buildEq(steps)) },
                    { text: `\\( x = ${m + 1}k \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot + "<div class='text-sm text-slate-500'>提示：開平方根時忘記了加上負數的可能性。</div>", buildEq(steps)) },
                    { text: `\\( x = ${1 - m2}k \\text{ 或 } x = ${1 + m2}k \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot, buildEq(steps)) }
                ];
            } else {
                // Type 2: (ax-b)^2 = b^2
                let a = Math.floor(Math.random() * 2) + 2; // 2 or 3
                let b = Math.floor(Math.random() * 4) + 1;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( c \\) 為一非零常數。解方程 \\( (${a}x - ${b}c)^2 = ${b*b}c^2 \\)。</div>`;
                let ans2 = (2 * b) + (a === 1 ? "" : "/" + a);
                if ((2 * b) % a === 0) ans2 = (2 * b) / a;
                let ansStr = ans2 === 1 ? "c" : `${ans2}c`;
                
                steps = [
                    { text: `兩邊開平方根：\\( ${a}x - ${b}c = \\pm ${b}c \\)`, hide: false },
                    { text: `情況 1：\\( ${a}x - ${b}c = ${b}c \\implies ${a}x = ${2*b}c \\implies x = ${ansStr} \\)`, hide: true },
                    { text: `情況 2：\\( ${a}x - ${b}c = -${b}c \\implies ${a}x = 0 \\implies x = 0 \\)`, hide: true },
                    { text: `所以 \\( x = 0 \\text{ 或 } x = ${ansStr} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( x = 0 \\text{ 或 } x = ${ansStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( x = ${ansStr} \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot, buildEq(steps)) },
                    { text: `\\( x = -${ansStr} \\text{ 或 } x = ${ansStr} \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot, buildEq(steps)) },
                    { text: `\\( x = 0 \\text{ 或 } x = -${ansStr} \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot, buildEq(steps)) }
                ];
            }

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：根的性質與判別式 (Δ)";
            
            if (subType === 0) {
                // Type 0: 等根 Delta = 0 仿 2012PP Q6
                let p = Math.floor(Math.random() * 3) + 2; 
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( k \\) 為一常數。若二次方程 \\( ${p}x^2 + 2kx - k = 0 \\) 有等根，則 \\( k = \\)</div>`;
                steps = [
                    { text: `有等根代表判別式 \\( \\Delta = 0 \\)。即 \\( b^2 - 4ac = 0 \\)。`, hide: false },
                    { text: `代入係數：\\( a = ${p}, b = 2k, c = -k \\)。`, hide: true },
                    { text: `\\( (2k)^2 - 4(${p})(-k) = 0 \\implies 4k^2 + ${4*p}k = 0 \\)`, hide: true },
                    { text: `抽出公因式 \\( 4k \\)：\\( 4k(k + ${p}) = 0 \\)`, hide: true },
                    { text: `\\( k = 0 \\text{ 或 } k = -${p} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( -${p} \\text{ 或 } 0 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${p} \\text{ 或 } 0 \\)`, isCorrect: false, hint: wrapHint(msgQuadDiscriminant + "<div class='text-sm text-slate-500'>提示：留意 \\( -4(${p})(-k) \\) 負負得正。</div>", buildEq(steps)) },
                    { text: `\\( -${p} \\)`, isCorrect: false, hint: wrapHint(msgQuadLoseRoot, buildEq(steps)) },
                    { text: `\\( ${p} \\)`, isCorrect: false, hint: wrapHint(msgQuadDiscriminant, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 沒有實根 Delta < 0 仿 2012SP Q7
                let b = (Math.floor(Math.random() * 4) + 2) * 2; // 偶數 4, 6, 8, 10
                let c_const = Math.floor(Math.random() * 5) + 1;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求 \\( k \\) 的取值範圍使得二次方程 \\( x^2 - ${b}x = ${c_const} - k \\) 沒有實根。</div>`;
                
                let b2 = b * b;
                // x^2 - bx + (k - c) = 0
                // b^2 - 4(1)(k - c) < 0
                // b^2 - 4k + 4c < 0 => 4k > b^2 + 4c => k > b^2/4 + c
                let ansVal = (b2 / 4) + c_const;
                
                steps = [
                    { text: `首先將方程重組為標準型式：\\( x^2 - ${b}x + (k - ${c_const}) = 0 \\)。`, hide: false },
                    { text: `沒有實根代表判別式 \\( \\Delta < 0 \\)。`, hide: true },
                    { text: `\\( (-${b})^2 - 4(1)(k - ${c_const}) < 0 \\)`, hide: true },
                    { text: `\\( ${b2} - 4k + ${4*c_const} < 0 \\implies ${b2 + 4*c_const} < 4k \\)`, hide: true },
                    { text: `\\( 4k > ${b2 + 4*c_const} \\implies k > ${ansVal} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( k > ${ansVal} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( k < ${ansVal} \\)`, isCorrect: false, hint: wrapHint(msgQuadInequality, buildEq(steps)) },
                    { text: `\\( k > ${(b2/4) - c_const} \\)`, isCorrect: false, hint: wrapHint(msgQuadDiscriminant + "<div class='text-sm text-slate-500'>提示：展開 \\( -4(1)(k - c) \\) 時注意常數項的符號。</div>", buildEq(steps)) },
                    { text: `\\( k < ${(b2/4) - c_const} \\)`, isCorrect: false, hint: wrapHint(msgQuadInequality, buildEq(steps)) }
                ];
            } else {
                // Type 2: 兩個相異實根 Delta > 0
                let b = (Math.floor(Math.random() * 4) + 1) * 2; // 2, 4, 6, 8
                let b2 = b * b;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求 \\( k \\) 的取值範圍使得二次方程 \\( x^2 + ${b}x + k = 0 \\) 妥為兩個相異的實根。</div>`;
                let ansVal = b2 / 4;
                steps = [
                    { text: `兩個相異實根代表判別式 \\( \\Delta > 0 \\)。`, hide: false },
                    { text: `\\( (${b})^2 - 4(1)(k) > 0 \\)`, hide: true },
                    { text: `\\( ${b2} - 4k > 0 \\implies 4k < ${b2} \\)`, hide: true },
                    { text: `兩邊除以 4，得 \\( k < ${ansVal} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( k < ${ansVal} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( k > ${ansVal} \\)`, isCorrect: false, hint: wrapHint(msgQuadInequality + "<div class='text-sm text-slate-500'>提示：移項或除以負數時注意不等號的方向。</div>", buildEq(steps)) },
                    { text: `\\( k \\le ${ansVal} \\)`, isCorrect: false, hint: wrapHint(msgQuadInequality + "<div class='text-sm text-slate-500'>提示：「兩個相異」實根，判別式必須嚴格大於 0（不可等於 0）。</div>", buildEq(steps)) },
                    { text: `\\( k \\ge ${ansVal} \\)`, isCorrect: false, hint: wrapHint(msgQuadInequality, buildEq(steps)) }
                ];
            }

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：兩根之和與兩根之積";
            
            if (subType === 0) {
                // Type 0: 求 alpha^2 + beta^2
                let p = Math.floor(Math.random() * 5) + 2; 
                let q = Math.floor(Math.random() * 5) + 2;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若二次方程 \\( x^2 - ${p}x + ${q} = 0 \\) 的根為 \\( \\alpha \\) 及 \\( \\beta \\) ，則 \\( \\alpha^2 + \\beta^2 = \\)</div>`;
                
                let ans = p * p - 2 * q;
                steps = [
                    { text: `根據公式：兩根之和 \\( \\alpha+\\beta = -\\frac{-${p}}{1} = ${p} \\)；兩根之積 \\( \\alpha\\beta = \\frac{${q}}{1} = ${q} \\)。`, hide: false },
                    { text: `利用恆等式：\\( \\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta \\)`, hide: true },
                    { text: `代入數值：\\( (${p})^2 - 2(${q}) = ${p*p} - ${2*q} = ${ans} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${p*p + 2*q} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct + "<div class='text-sm text-slate-500'>提示：公式是 \\( (\\alpha+\\beta)^2 - 2\\alpha\\beta \\) 而不是加。</div>", buildEq(steps)) },
                    { text: `\\( ${-p*p - 2*q} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) },
                    { text: `\\( ${p*p} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 求 1/alpha + 1/beta
                let p = (Math.floor(Math.random() * 5) + 2) * (Math.random() > 0.5 ? 1 : -1); 
                let q = (Math.floor(Math.random() * 5) + 2) * (Math.random() > 0.5 ? 1 : -1);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若二次方程 \\( x^2 + ${p}x + ${q} = 0 \\) 的根為 \\( \\alpha \\) 及 \\( \\beta \\) ，則 \\( \\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\)</div>`;
                
                let sum = -p;
                let prod = q;
                
                // 簡化分數
                let gcdVal = (a, b) => b === 0 ? a : gcdVal(b, a % b);
                let g = Math.abs(gcdVal(sum, prod));
                let num = sum / g;
                let den = prod / g;
                if (den < 0) { num = -num; den = -den; }
                
                let ansStr = den === 1 ? `${num}` : `\\frac{${num}}{${den}}`;
                let w1Str = den === 1 ? `${-num}` : `\\frac{${-num}}{${den}}`; // 忘記兩根之和的負號
                let w2Str = Math.abs(num) === 1 ? `${den}` : `\\frac{${den}}{${num}}`; // 上下顛倒
                
                steps = [
                    { text: `兩根之和 \\( \\alpha+\\beta = -\\frac{${p}}{1} = ${-p} \\)；兩根之積 \\( \\alpha\\beta = \\frac{${q}}{1} = ${q} \\)。`, hide: false },
                    { text: `通分母：\\( \\frac{1}{\\alpha} + \\frac{1}{\\beta} = \\frac{\\beta + \\alpha}{\\alpha\\beta} = \\frac{\\alpha+\\beta}{\\alpha\\beta} \\)`, hide: true },
                    { text: `代入數值：\\( \\frac{${-p}}{${q}} = ${ansStr} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( ${ansStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${w1Str} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct + "<div class='text-sm text-slate-500'>提示：兩根之和公式是 \\( -\\frac{b}{a} \\)，不要漏了負號。</div>", buildEq(steps)) },
                    { text: `\\( ${w2Str} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) },
                    { text: `\\( ${den === 1 ? num+1 : `\\frac{${num+1}}{${den}}`} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) }
                ];
            } else {
                // Type 2: (alpha-1)(beta-1)
                let p = Math.floor(Math.random() * 5) + 3; 
                let q = Math.floor(Math.random() * 5) + 3;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若二次方程 \\( x^2 - ${p}x + ${q} = 0 \\) 的根為 \\( \\alpha \\) 及 \\( \\beta \\) ，則 \\( (\\alpha-1)(\\beta-1) = \\)</div>`;
                
                let sum = p;
                let prod = q;
                let ans = prod - sum + 1;
                
                steps = [
                    { text: `兩根之和 \\( \\alpha+\\beta = ${sum} \\)；兩根之積 \\( \\alpha\\beta = ${prod} \\)。`, hide: false },
                    { text: `展開代數式：\\( (\\alpha-1)(\\beta-1) = \\alpha\\beta - \\alpha - \\beta + 1 \\)`, hide: true },
                    { text: `抽取負號：\\( = \\alpha\\beta - (\\alpha+\\beta) + 1 \\)`, hide: true },
                    { text: `代入數值：\\( = ${prod} - (${sum}) + 1 = ${ans} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${prod + sum + 1} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct + "<div class='text-sm text-slate-500'>提示：展開時，\\( -\\alpha - \\beta \\) 提取負號後是 \\( -(\\alpha + \\beta) \\)。</div>", buildEq(steps)) },
                    { text: `\\( ${prod - sum - 1} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) },
                    { text: `\\( ${ans + 2} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) }
                ];
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：高階代數變形與隱藏二次方程 (拔尖)";
            
            if (subType === 0) {
                // Type 0: alpha^3 + beta^3 仿 2012PP Q33
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若二次方程 \\( x^2 - kx + 3 = 0 \\) 的根為 \\( \\alpha \\) 及 \\( \\beta \\) ，則 \\( \\alpha^3 + \\beta^3 = \\)</div>`;
                steps = [
                    { text: `兩根之和 \\( \\alpha+\\beta = k \\)；兩根之積 \\( \\alpha\\beta = 3 \\)。`, hide: false },
                    { text: `利用立方和恆等式：\\( \\alpha^3 + \\beta^3 = (\\alpha+\\beta)(\\alpha^2 - \\alpha\\beta + \\beta^2) \\)`, hide: true },
                    { text: `將其轉化為只有和與積的形式：\\( = (\\alpha+\\beta)[(\\alpha+\\beta)^2 - 3\\alpha\\beta] \\)`, hide: true },
                    { text: `代入數值：\\( = k[k^2 - 3(3)] = k^3 - 9k \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( k^3 - 9k \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( k^3 - 3k \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct + "<div class='text-sm text-slate-500'>提示：恆等式轉換錯誤。\\( \\alpha^2+\\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta \\)，再減去一個 \\( \\alpha\\beta \\) 應為減 3 個。</div>", buildEq(steps)) },
                    { text: `\\( k^3 \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) },
                    { text: `\\( k^3 - 12k \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 隱藏二次方程 仿 2013 Q35
                let p = Math.floor(Math.random() * 4) + 2; 
                let q = Math.floor(Math.random() * 5) + 3;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( \\alpha \\neq \\beta \\) 及 \\( ${p}\\alpha = \\alpha^2 - ${q} \\) ， \\( ${p}\\beta = \\beta^2 - ${q} \\) ，則 \\( \\alpha\\beta = \\)</div>`;
                steps = [
                    { text: `觀察給定的兩條等式，結構完全相同。這意味著 \\( \\alpha \\) 和 \\( \\beta \\) 滿足同一個方程。`, hide: false },
                    { text: `該方程為：\\( ${p}x = x^2 - ${q} \\implies x^2 - ${p}x - ${q} = 0 \\)。`, hide: true },
                    { text: `因為 \\( \\alpha \\neq \\beta \\)，所以它們正是這個二次方程的兩個相異根。`, hide: true },
                    { text: `題目求 \\( \\alpha\\beta \\) (兩根之積)。根據公式 \\( \\frac{c}{a} = \\frac{-${q}}{1} = -${q} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( -${q} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${q} \\)`, isCorrect: false, hint: wrapHint(msgQuadDisguised + "<div class='text-sm text-slate-500'>提示：移項後，常數項是負數，兩根之積也是負數。</div>", buildEq(steps)) },
                    { text: `\\( ${p} \\)`, isCorrect: false, hint: wrapHint(msgQuadDisguised + "<div class='text-sm text-slate-500'>提示：這是兩根之和 (\\( \\alpha+\\beta \\))。</div>", buildEq(steps)) },
                    { text: `\\( -${p} \\)`, isCorrect: false, hint: wrapHint(msgQuadDisguised, buildEq(steps)) }
                ];
            } else {
                // Type 2: 降次打擊法 (Section B 經典) alpha^2 + m*beta
                let p = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
                let q = Math.floor(Math.random() * 5) + 2;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若二次方程 \\( x^2 - ${p}x + ${q} = 0 \\) 的根為 \\( \\alpha \\) 及 \\( \\beta \\) ，則 \\( \\alpha^2 + ${p}\\beta = \\)</div>`;
                let ans = p * p - q;
                steps = [
                    { text: `遇到不對稱的二次與一次項，應利用「根代入方程」來降次。`, hide: false },
                    { text: `因為 \\( \\alpha \\) 是方程的根，代入得：\\( \\alpha^2 - ${p}\\alpha + ${q} = 0 \\implies \\alpha^2 = ${p}\\alpha - ${q} \\)。`, hide: true },
                    { text: `將其代入原式：\\( \\alpha^2 + ${p}\\beta = (${p}\\alpha - ${q}) + ${p}\\beta \\)`, hide: true },
                    { text: `抽取公因式 \\( ${p} \\)：\\( = ${p}(\\alpha + \\beta) - ${q} \\)`, hide: true },
                    { text: `已知兩根之和 \\( \\alpha+\\beta = ${p} \\)。代入得：\\( ${p}(${p}) - ${q} = ${ans} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${p * p + q} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct + "<div class='text-sm text-slate-500'>提示：由 \\( \\alpha^2 - ${p}\\alpha + ${q} = 0 \\) 移項得 \\( \\alpha^2 = ${p}\\alpha - ${q} \\)，注意常數項的變號。</div>", buildEq(steps)) },
                    { text: `\\( ${p * p} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) },
                    { text: `\\( ${ans + 2} \\)`, isCorrect: false, hint: wrapHint(msgQuadSumProduct, buildEq(steps)) }
                ];
            }
        }

        // 去重並確保有 4 個選項
        options = [...new Map(options.map(item => [item.text, item])).values()];
        let safeCounter = 1;
        while(options.length < 4) {
            options.push({ text: `\\( ${safeCounter * 11 - 2} \\)`, isCorrect: false, hint: wrapHint(msgQuadDiscriminant, buildEq(steps)) });
            safeCounter++;
            options = [...new Map(options.map(item => [item.text, item])).values()];
        }
        options = options.slice(0, 4);

        qObj.options = shuffle(options).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx)
        }));

        bank.push(qObj);
    }
    return bank;
}
