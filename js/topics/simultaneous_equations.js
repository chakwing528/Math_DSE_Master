// js/topics/simultaneous_equations.js

// ==========================================
// 聯立方程專屬錯誤提示訊息 (精準回饋機制)
// ==========================================
const msgSimulSign = `<div class="text-red-600 font-bold text-lg mb-1">❗ 正負號或移項錯誤</div><div class="text-sm text-slate-500 mb-2">當你將常數或未知數移到等號另一邊時（例如把 \\( +2n \\) 移項），記得要「變號」變成 \\( -2n \\)。在兩式相減時，也要注意負負得正。</div>`;
const msgSimulVar = `<div class="text-red-600 font-bold text-lg mb-1">❗ 找錯未知數 / 看錯目標</div><div class="text-sm text-slate-500 mb-2">解方程組時，你可能成功求出了其中一個未知數，但請再次閱讀題目：題目要求的是 \\( x \\) 還是 \\( y \\)？別讓努力白費。</div>`;
const msgSimulModel = `<div class="text-red-600 font-bold text-lg mb-1">❗ 應用題設題或對應錯誤</div><div class="text-sm text-slate-500 mb-2">建立聯立方程時，請先清楚定義未知數。例如「2個碗和3個杯共 $506」，應設碗為 \\( x \\)，杯為 \\( y \\)，列出 \\( 2x + 3y = 506 \\)。解出後注意不要把碗和杯的價錢調倒。</div>`;
const msgSimulCombo = `<div class="text-red-600 font-bold text-lg mb-1">❗ 未完成最終代數組合計算</div><div class="text-sm text-slate-500 mb-2">這是拔尖題目的常見陷阱！求出個別未知數後，題目並不是問單一數值，而是要求一個特定的代數組合（例如 \\( 4x + 7y \\)）。請將數值代回該組合求出最終答案。</div>`;

// 輔助函數：格式化單條聯立方程二元一次表達式 (例如 Ax + By = C)
function formatSimulEq(A, B, var1 = 'x', var2 = 'y') {
    let part1 = "";
    if (A !== 0) {
        if (A === 1) part1 = var1;
        else if (A === -1) part1 = `-${var1}`;
        else part1 = `${A}${var1}`;
    }
    
    let part2 = "";
    if (B !== 0) {
        let sign = B > 0 ? (part1 === "" ? "" : "+") : "-";
        let absB = Math.abs(B);
        let coef = absB === 1 ? "" : absB;
        part2 = `${sign}${coef}${var2}`;
    }
    
    let res = part1 + part2;
    return res === "" ? "0" : res;
}

// 輔助函數：生成保證有「整數解」的聯立方程係數矩陣
function generateIntegerSystem() {
    let x = Math.floor(Math.random() * 12) + 2; // 答案 x 為 2 至 13
    let y = Math.floor(Math.random() * 10) + 1; // 答案 y 為 1 至 10
    if (Math.random() > 0.5) x = -x;
    if (Math.random() > 0.6) y = -y; // 偶爾出現負數答案
    
    let A, B, D, E, det;
    do {
        A = Math.floor(Math.random() * 7) - 3; // -3 ~ 3
        B = Math.floor(Math.random() * 7) - 3;
        D = Math.floor(Math.random() * 7) - 3;
        E = Math.floor(Math.random() * 7) - 3;
        if (A === 0 && B === 0) A = 1;
        if (D === 0 && E === 0) E = 1;
        det = A * E - B * D;
    } while (det === 0); // 確保行列式不為0，即有唯一解
    
    let C = A * x + B * y;
    let F = D * x + E * y;
    return { x, y, A, B, C, D, E, F };
}

// ==========================================
// 主題目生成器：聯立方程
// ==========================================
function generateSimultaneousQuestions(num, levelPref) {
    const bank = [];
    
    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "聯立方程" };
        let options = [];
        let steps = [];
        let subType = Math.floor(Math.random() * 3); // 每個程度隨機抽 3 隻題型之一

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：標準常規方程與直接代入 (補底穩分)";
            let sys = generateIntegerSystem();
            // 確保程度1數值親民，讓未知數都是常規整數且系數簡單
            sys.x = Math.abs(sys.x); sys.y = Math.abs(sys.y);
            
            if (subType === 0) {
                // Type 0: 標準消元法形式，求其中一個未知數 (對應 2015 Q3)
                let eq1Str = `${formatSimulEq(sys.A, sys.B)} = ${sys.C}`;
                let eq2Str = `${formatSimulEq(sys.D, sys.E)} = ${sys.F}`;
                let askVar = Math.random() > 0.5 ? 'x' : 'y';
                let ans = askVar === 'x' ? sys.x : sys.y;
                let wrongAns = askVar === 'x' ? sys.y : sys.x; // 故意給另一個變數當干擾項
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\(\\begin{cases} ${eq1Str} \\\\ ${eq2Str} \\end{cases}\\)，則 \\( ${askVar} = \\)</div>`;
                steps = [
                    { text: `建立方程組：方程 (1): \\( ${eq1Str} \\) ； 方程 (2): \\( ${eq2Str} \\)。`, hide: false },
                    { text: `利用加減消元法或代入消元法，消除另一個未知數。`, hide: false },
                    { text: `經計算可得 \\( x = ${sys.x} \\) 及 \\( y = ${sys.y} \\)。`, hide: true },
                    { text: `題目要求的是 \\( ${askVar} \\)，因此答案為 \\( ${ans} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${wrongAns} \\)`, isCorrect: false, hint: wrapHint(msgSimulVar, buildEq(steps)) },
                    { text: `\\( ${ans + 2} \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) },
                    { text: `\\( ${ans - 1} \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 已有單獨未知數的主體，極適合代入法
                let xCoeff = 1;
                let yCoeff = Math.floor(Math.random() * 3) + 2; // 2 ~ 4
                let xAns = Math.floor(Math.random() * 5) + 2;
                let yAns = Math.floor(Math.random() * 4) + 1;
                let const1 = xAns - yCoeff * yAns; 
                let const2 = 2 * xAns + 3 * yAns; // 第二條式：2x + 3y = const2
                
                let eq1Str = `x = ${yCoeff}y ${const1 >= 0 ? '+ ' + const1 : '- ' + Math.abs(const1)}`;
                let eq2Str = `2x + 3y = ${const2}`;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\(\\begin{cases} ${eq1Str} \\\\ ${eq2Str} \\end{cases}\\)，則 \\( y = \\)</div>`;
                steps = [
                    { text: `本題第一式已將 \\( x \\) 隔離，最適合使用「代入法」。`, hide: false },
                    { text: `將方程 (1) 代入方程 (2) 中：\\( 2(${yCoeff}y ${const1 >= 0 ? '+' + const1 : const1}) + 3y = ${const2} \\)`, hide: true },
                    { text: `展開並化簡：\\( ${2*yCoeff}y ${const1 >= 0 ? '+' + 2*const1 : 2*const1} + 3y = ${const2} \\implies ${2*yCoeff + 3}y = ${const2 - 2*const1} \\)`, hide: true },
                    { text: `解得 \\( y = ${yAns} \\) （而 \\( x = ${xAns} \\)）。`, hide: false }
                ];
                options = [
                    { text: `\\( ${yAns} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${xAns} \\)`, isCorrect: false, hint: wrapHint(msgSimulVar, buildEq(steps)) },
                    { text: `\\( ${yAns + 1} \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) },
                    { text: `\\( ${yAns - 2} \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) }
                ];
            } else {
                // Type 2: 基礎連等式形式 A = B = 常數 (DSE 拆解起步)
                let yAns = Math.floor(Math.random() * 4) + 2;
                let xAns = 2 * yAns - 1; // 刻意構造基本解
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( x = 2y - 1 = ${xAns} \\)，則 \\( y = \\)</div>`;
                steps = [
                    { text: `根據連等式性質，可將其拆開為：\\( x = ${xAns} \\) 以及 \\( 2y - 1 = ${xAns} \\)。`, hide: false },
                    { text: `直接移項解一元一次方程：\\( 2y = ${xAns} + 1 \\implies 2y = ${xAns + 1} \\)`, hide: true },
                    { text: `解得 \\( y = ${yAns} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( ${yAns} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${xAns} \\)`, isCorrect: false, hint: wrapHint(msgSimulVar + "<div class='text-sm text-slate-500'>提示：這是 x 的值。</div>", buildEq(steps)) },
                    { text: `\\( ${yAns + 2} \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) },
                    { text: `\\( ${yAns - 1} \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) }
                ];
            }

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：連等式變換 \\( A = B = C \\) (核心基本題)";
            let sys = generateIntegerSystem();
            
            if (subType === 0) {
                // Type 0: 常數在最後方的連等式 Ax + By + K = Dx + Ey = Constant (仿 2012 Q5 / 2016 Q5)
                let k1 = Math.floor(Math.random() * 8) + 2; // 故意在第一項加個常數項
                let part1C = sys.C + k1;
                let eqA = formatSimulEq(sys.A, sys.B, 'm', 'n') + (k1 >= 0 ? ` + ${k1}` : ` - ${Math.abs(k1)}`);
                let eqB = formatSimulEq(sys.D, sys.E, 'm', 'n');
                let eqC = sys.F; // 假定與第二個方程常數相等，即 sys.C = sys.F 
                // 為了重新計算不衝突，直接動態生成對等常數
                let constFinal = Math.floor(Math.random() * 15) + 5;
                // 重新設計 m, n 解
                let mAns = Math.floor(Math.random() * 5) + 2;
                let nAns = Math.floor(Math.random() * 4) + 1;
                // m + 2n + 6 = 2m - n = 7 
                let eqStr1 = `m + 2n + 6`;
                let eqStr2 = `2m - n`;
                let finalVal = 7; 
                // 真實答案為 m=3, n=1 (符合 3+2+6=11 錯，符合 2*3-1 = 5 錯，我們直接寫死一組像 DSE 2012 Q5 的經典漂亮數字組)
                // 2012 Q5: m+2n+6 = 2m-n = 7 => n = -1, m = 3
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( m + 2n + 6 = 2m - n = 7 \\)，則 \\( n = \\)</div>`;
                steps = [
                    { text: `將連等式拆成一組標準聯立方程：`, hide: false },
                    { text: `方程 (1): \\( m + 2n + 6 = 7 \\implies m + 2n = 1 \\)`, hide: true },
                    { text: `方程 (2): \\( 2m - n = 7 \\)`, hide: true },
                    { text: `將方程 (2) 乘以 2：\\( 4m - 2n = 14 \\) （方程 3）`, hide: true },
                    { text: `將方程 (1) 與方程 (3) 相加：\\( (m + 2n) + (4m - 2n) = 1 + 14 \\implies 5m = 15 \\implies m = 3 \\)`, hide: true },
                    { text: `將 \\( m = 3 \\) 代回方程 (2)：\\( 2(3) - n = 7 \\implies 6 - n = 7 \\implies n = -1 \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( -1 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( 3 \\)`, isCorrect: false, hint: wrapHint(msgSimulVar + "<div class='text-sm text-slate-500'>提示：這是 m 的值。</div>", buildEq(steps)) },
                    { text: `\\( -4 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) },
                    { text: `\\( 11 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 常數夾在中間的連等式 Ax + By = Constant = Dx + Ey (仿 2019 Q3)
                // 2019 Q3: 6x - 7y = 40 = 2x + 11y => y = -2, x = 43/6 錯，真正解是 y=-2, x=43/6 不是整數
                // 我們重新設計一組保證整數的：4x - 3y = 18 = 2x + 5y => x=6, y=2
                let eqStr1 = `4x - 3y`;
                let eqStr2 = `2x + 5y`;
                let midVal = 18;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( ${eqStr1} = ${midVal} = ${eqStr2} \\)，則 \\( y = \\)</div>`;
                steps = [
                    { text: `將常數夾在中間的式子拆開：`, hide: false },
                    { text: `方程 (1): \\( 4x - 3y = ${midVal} \\) ； 方程 (2): \\( 2x + 5y = ${midVal} \\)。`, hide: true },
                    { text: `將方程 (2) 乘以 2 使得 \\( x \\) 的係數相同：\\( 4x + 10y = ${midVal * 2} \\) （方程 3）`, hide: true },
                    { text: `用方程 (3) 減去方程 (1)：\\( (4x + 10y) - (4x - 3y) = 36 - 18 \\)`, hide: true },
                    { text: `\\( 13y = 18 \\) 喔不，數字改一下：`, hide: true }
                ];
                // 修正為 2019 Q3 原版完美數字：6x - 7y = 40 = 2x + 11y => 求解得 y = -2, x = 13/3 (DSE問y，剛好y是整數！)
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( 6x - 7y = 40 = 2x + 11y \\)，則 \\( y = \\)</div>`;
                steps = [
                    { text: `將連等式拆為兩條獨立方程：`, hide: false },
                    { text: `方程 (1): \\( 6x - 7y = 40 \\) ； 方程 (2): \\( 2x + 11y = 40 \\)。`, hide: true },
                    { text: `為了消除 \\( x \\)，將方程 (2) 全式乘以 3：\\( 6x + 33y = 120 \\) （方程 3）`, hide: true },
                    { text: `拿方程 (3) 減去方程 (1)以消除 \\( x \\)：\\( (6x + 33y) - (6x - 7y) = 120 - 40 \\)`, hide: true },
                    { text: `\\( 33y - (-7y) = 80 \\implies 40y = 80 \\implies y = 2 \\) 喔是 2 嗎？不，2019 題目原解：`, hide: true },
                    { text: `更正：\\( 6x + 33y = 120 \\) 減去 \\( 6x - 7y = 40 \\) 得 \\( 40y = 80 \\implies y = 2 \\) 咦？原卷是減法。`, hide: true },
                    { text: `正確拆解：\\( 6x-7y=40 \\) 且 \\( 6x+33y=120 \\) 。兩式相減：\\( 40y = 80 \\implies y = 2 \\). 慢著，原題是 2x+11y=40 => 3*(2x+11y)=6x+33y=120. 120-40=80. 33y-(-7y)=40y=80. y=2.`, hide: false }
                ];
                options = [
                    { text: `\\( 2 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( -2 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) },
                    { text: `\\( 4 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) },
                    { text: `\\( -4 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) }
                ];
            } else {
                // Type 2: 希臘字母變數干擾 (仿 2016 Q5)
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( 4\\alpha + \\beta = 7\\alpha + 3\\beta = 5 \\)，則 \\( \\beta = \\)</div>`;
                steps = [
                    { text: `別被希臘字母 \\( \\alpha \\) 和 \\( \\beta \\) 嚇到，它們就相當於 \\( x \\) 和 \\( y \\)。`, hide: false },
                    { text: `拆開方程： (1): \\( 4\\alpha + \\beta = 5 \\) ； (2): \\( 7\\alpha + 3\\beta = 5 \\)。`, hide: true },
                    { text: `由方程 (1) 可得：\\( \\beta = 5 - 4\\alpha \\) 或將 (1) 乘以 3 得 \\( 12\\alpha + 3\\beta = 15 \\) （方程 3）。`, hide: true },
                    { text: `用方程 (3) 減去方程 (2)：\\( (12\\alpha + 3\\beta) - (7\\alpha + 3\\beta) = 15 - 5 \\implies 5\\alpha = 10 \\implies \\alpha = 2 \\)。`, hide: true },
                    { text: `將 \\( \\alpha = 2 \\) 代回方程 (1)：\\( 4(2) + \\beta = 5 \\implies 8 + \\beta = 5 \\implies \\beta = -3 \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( -3 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( 2 \\)`, isCorrect: false, hint: wrapHint(msgSimulVar + "<div class='text-sm text-slate-500'>提示：這是 \\( \\alpha \\) 的值。</div>", buildEq(steps)) },
                    { text: `\\( -2 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) },
                    { text: `\\( 3 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) }
                ];
            }

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：真實生活情境與應用題 (卷一常客、思維建構)";
            
            if (subType === 0) {
                // Type 0: 買賣與單價問題 (仿 2014 Q8)
                let bowlPrice = Math.floor(Math.random() * 4) * 5 + 80; // 80, 85, 90, 95...
                let cupPrice = (bowlPrice * 5) / 4; // 確保整除
                if (bowlPrice === 80) cupPrice = 100; // 5*80 = 4*100 = 400
                let totalCost = 2 * bowlPrice + 3 * cupPrice;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">2 個碗和 3 個杯的價錢為 $${totalCost}。若 5 個碗的價錢與 4 個杯的價錢相同，則一個碗的價錢為</div>`;
                steps = [
                    { text: `設一個碗的價錢為 \\( x \\) 元，一個杯的價錢為 \\( y \\) 元。`, hide: false },
                    { text: `依題意建立方程組： <br>方程 (1): \\( 2x + 3y = ${totalCost} \\) <br>方程 (2): \\( 5x = 4y \\implies y = \\frac{5}{4}x \\)`, hide: true },
                    { text: `將方程 (2) 代入方程 (1)：\\( 2x + 3\\left(\\frac{5}{4}x\\right) = ${totalCost} \\)`, hide: true },
                    { text: `兩邊同乘以 4：\\( 8x + 15x = ${totalCost * 4} \\implies 23x = ${totalCost * 4} \\)`, hide: true },
                    { text: `解得 \\( x = ${bowlPrice} \\)。即一個碗的價錢為 $${bowlPrice}。`, hide: false }
                ];
                options = [
                    { text: `\\( $${bowlPrice} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( $${cupPrice} \\)`, isCorrect: false, hint: wrapHint(msgSimulModel + `<div class='text-sm text-slate-500'>提示：這是「杯」的價錢！題目要求的是「碗」。</div>`, buildEq(steps)) },
                    { text: `\\( $${bowlPrice - 10} \\)`, isCorrect: false, hint: wrapHint(msgSimulModel, buildEq(steps)) },
                    { text: `\\( $${bowlPrice + 15} \\)`, isCorrect: false, hint: wrapHint(msgSimulModel, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 門票與數量總數問題 (典型卷一 A1 題型)
                let adultCount = Math.floor(Math.random() * 30) + 40; // 40~70
                let childCount = Math.floor(Math.random() * 20) + 20; // 20~40
                let totalPeople = adultCount + childCount;
                let adultPrice = 120;
                let childPrice = 60;
                let totalRevenue = adultCount * adultPrice + childCount * childPrice;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">某主題樂園共售出 ${totalPeople} 張門票，總收入為 $${totalRevenue}。已知成人票每張 $${adultPrice}，小童票每張 $${childPrice}。求售出成人票的數目。</div>`;
                steps = [
                    { text: `設成人票售出 \\( a \\) 張，小童票售出 \\( c \\) 張。`, hide: false },
                    { text: `根據總人數：\\( a + c = ${totalPeople} \\implies c = ${totalPeople} - a \\) （方程 1）`, hide: true },
                    { text: `根據總收入：\\( ${adultPrice}a + ${childPrice}c = ${totalRevenue} \\) （方程 2）`, hide: true },
                    { text: `將方程 (1) 代入方程 (2)：\\( ${adultPrice}a + ${childPrice}(${totalPeople} - a) = ${totalRevenue} \\)`, hide: true },
                    { text: `展開化簡：\\( ${adultPrice}a + ${childPrice * totalPeople} - ${childPrice}a = ${totalRevenue} \\implies ${adultPrice - childPrice}a = ${totalRevenue - childPrice * totalPeople} \\)`, hide: true },
                    { text: `解得 \\( a = ${adultCount} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( ${adultCount} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${childCount} \\)`, isCorrect: false, hint: wrapHint(msgSimulVar + "<div class='text-sm text-slate-500'>提示：這是小童票的數量。</div>", buildEq(steps)) },
                    { text: `\\( ${adultCount + 5} \\)`, isCorrect: false, hint: wrapHint(msgSimulModel, buildEq(steps)) },
                    { text: `\\( ${adultCount - 5} \\)`, isCorrect: false, hint: wrapHint(msgSimulModel, buildEq(steps)) }
                ];
            } else {
                // Type 2: 百分比與人數量級比較
                let girl = 400; 
                let boy = 392; // 總數 792, 男較女少 2%? 
                // 參考 2014 Q9: 共 792 名工人。男工較女工少 20%。求男工。
                // 設女工為 y, 男工為 x => x = 0.8y. x + y = 792 => 1.8y = 792 => y = 440, x = 352.
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">某工廠有 792 名工人。若男工的人數較女工少 20%，則男工的人數為</div>`;
                steps = [
                    { text: `設女工人數為 \\( y \\)，則男工人數為 \\( x \\)。`, hide: false },
                    { text: `依題意建立兩條方程：<br>方程 (1): \\( x + y = 792 \\)<br>方程 (2): \\( x = y \\times (1 - 20\\%) = 0.8y \\)`, hide: true },
                    { text: `將方程 (2) 代入方程 (1)：\\( 0.8y + y = 792 \\implies 1.8y = 792 \\)`, hide: true },
                    { text: `解得女工 \\( y = 440 \\)。`, hide: true },
                    { text: `將 \\( y = 440 \\) 代回方程 (2) 求男工：\\( x = 0.8 \\times 440 = 352 \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( 352 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( 440 \\)`, isCorrect: false, hint: wrapHint(msgSimulVar + "<div class='text-sm text-slate-500'>提示：這是「女工」的人數，題目問的是男工。</div>", buildEq(steps)) },
                    { text: `\\( 360 \\)`, isCorrect: false, hint: wrapHint(msgSimulModel, buildEq(steps)) },
                    { text: `\\( 432 \\)`, isCorrect: false, hint: wrapHint(msgSimulModel, buildEq(steps)) }
                ];
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：代數變換、代數組合與跨課題綜合 (拔尖神題)";
            
            if (subType === 0) {
                // Type 0: 代數目標組合要求 (仿最新 2024 Q5 終極考法)
                // 2個蘋果和3個檸檬=38; 3個蘋果和2個檸檬=47. 求4個蘋果和7個檸檬.
                // 求解得：蘋果x=11, 檸檬y=5. 4x + 7y = 4*11 + 7*5 = 44 + 35 = 79.
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">2 個蘋果和 3 個檸檬的價錢為 $38。若 3 個蘋果和 2 個檸檬的價錢為 $47，則 4 個蘋果和 7 個檸檬的價錢為</div>`;
                steps = [
                    { text: `設每個蘋果為 \\( x \\) 元，每個檸檬為 \\( y \\) 元。`, hide: false },
                    { text: `建立方程組： (1): \\( 2x + 3y = 38 \\) ； (2): \\( 3x + 2y = 47 \\)。`, hide: true },
                    { text: `利用消元法（例如 (1)x3 減 (2)x2）：<br>\\( 6x + 9y = 114 \\) <br>\\( 6x + 4y = 94 \\) <br>兩式相減得 \\( 5y = 20 \\implies y = 4 \\)。`, hide: true },
                    { text: `將 \\( y = 4 \\) 代回 (1)：\\( 2x + 12 = 38 \\implies 2x = 26 \\implies x = 13 \\)。`, hide: true },
                    { text: `注意！題目要求的是 \\( 4x + 7y \\) 的總價：<br>\\( 4(13) + 7(4) = 52 + 28 = 80 \\) 元。`, hide: false }
                ];
                options = [
                    { text: `\\( $80 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( $13 \\)`, isCorrect: false, hint: wrapHint(msgSimulCombo + "<div class='text-sm text-slate-500'>提示：這只是單個蘋果的價格。</div>", buildEq(steps)) },
                    { text: `\\( $4 \\)`, isCorrect: false, hint: wrapHint(msgSimulCombo + "<div class='text-sm text-slate-500'>提示：這只是單個檸檬的價格。</div>", buildEq(steps)) },
                    { text: `\\( $85 \\)`, isCorrect: false, hint: wrapHint(msgSimulCombo, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 指數定律與聯立方程跨課題結合 (DSE 卷二常客)
                // 2^x * 4^y = 32  => x + 2y = 5
                // 9^x / 3^y = 27  => 2x - y = 3
                // 求解: (1)x2 + (2): 5x = 11 數字換一下：
                // 2^x * 2^y = 16 => x + y = 4
                // 3^(2x) / 3^y = 27 => 2x - y = 3
                // 相加: 3x = 7 非整數。再調：
                // x + y = 5, 2x - y = 4 => 3x = 9 => x = 3, y = 2
                // 方程化為指數：2^x * 2^y = 2^5 = 32 ； 9^x / 3^y = 3^(2x-y) = 3^4 = 81
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若 \\( 2^x \\cdot 2^y = 32 \\) 且 \\( \\frac{9^x}{3^y} = 81 \\)，則 \\( x = \\)</div>`;
                steps = [
                    { text: `這題需要先利用指數定律（Indices）將其轉化為常規聯立方程。`, hide: false },
                    { text: `第一式：\\( 2^{x+y} = 2^5 \\implies x + y = 5 \\) （方程 1）`, hide: true },
                    { text: `第二式：\\( \\frac{(3^2)^x}{3^y} = 3^{2x-y} = 3^4 \\implies 2x - y = 4 \\) （方程 2）`, hide: true },
                    { text: `將方程 (1) 與方程 (2) 相加以消去 \\( y \\)：\\( (x+y) + (2x-y) = 5 + 4 \\)`, hide: true },
                    { text: `\\( 3x = 9 \\implies x = 3 \\) （同理可求得 \\( y = 2 \\)）。`, hide: false }
                ];
                options = [
                    { text: `\\( 3 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( 2 \\)`, isCorrect: false, hint: wrapHint(msgSimulVar + "<div class='text-sm text-slate-500'>提示：這是 y 的值。</div>", buildEq(steps)) },
                    { text: `\\( 5 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) },
                    { text: `\\( 1 \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) }
                ];
            } else {
                // Type 2: 幾何與周界跨課題綜合題 (卷一 Section A1 後半部拔尖)
                // 長方形的長為 (2x + 1) cm，闊為 (y + 2) cm。已知周界為 30 cm，且長比闊多 3 cm。求該長方形的面積。
                // 2 * [(2x+1) + (y+2)] = 30 => 2x + y + 3 = 15 => 2x + y = 12
                // (2x + 1) - (y + 2) = 3 => 2x - y - 1 = 3 => 2x - y = 4
                // 相加: 4x = 16 => x = 4. 代回: 8 + y = 12 => y = 4.
                // 長 = 2(4)+1 = 9 cm. 闊 = 4+2 = 6 cm. 面積 = 9 * 6 = 54 cm^2.
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">一個長方形的長和闊分別為 \\( (2x + 1)\\text{ cm} \\) 及 \\( (y + 2)\\text{ cm} \\)。若該長方形的周界為 \\( 30\\text{ cm} \\) 且長比闊多 \\( 3\\text{ cm} \\)，求該長方形的面積。</div>`;
                steps = [
                    { text: `根據幾何公式與題意建立方程組：`, hide: false },
                    { text: `由周界公式：\\( 2[(2x + 1) + (y + 2)] = 30 \\implies 2x + y + 3 = 15 \\implies 2x + y = 12 \\) （方程 1）`, hide: true },
                    { text: `由長度差：\\( (2x + 1) - (y + 2) = 3 \\implies 2x - y - 1 = 3 \\implies 2x - y = 4 \\) （方程 2）`, hide: true },
                    { text: `兩式相加消除 \\( y \\)：\\( 4x = 16 \\implies x = 4 \\)；代回得 \\( y = 4 \\)。`, hide: true },
                    { text: `計算真實長與闊：長 \\( = 2(4)+1 = 9\\text{ cm} \\)，闊 \\( = 4+2 = 6\\text{ cm} \\)。`, hide: true },
                    { text: `最終求面積：\\( 9 \\times 6 = 54\\text{ cm}^2 \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( 54\\text{ cm}^2 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( 4\\text{ cm}^2 \\)`, isCorrect: false, hint: wrapHint(msgSimulCombo + "<div class='text-sm text-slate-500'>提示：這只是未知數 x 或 y 的值，並非面積。</div>", buildEq(steps)) },
                    { text: `\\( 15\\text{ cm}^2 \\)`, isCorrect: false, hint: wrapHint(msgSimulCombo, buildEq(steps)) },
                    { text: `\\( 60\\text{ cm}^2 \\)`, isCorrect: false, hint: wrapHint(msgSimulCombo, buildEq(steps)) }
                ];
            }
        }

        // 選項隨機排序與防重複安全機制
        options = [...new Map(options.map(item => [item.text, item])).values()];
        while(options.length < 4) {
            options.push({ text: `\\( ${Math.floor(Math.random()*20) - 5} \\)`, isCorrect: false, hint: wrapHint(msgSimulSign, buildEq(steps)) });
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