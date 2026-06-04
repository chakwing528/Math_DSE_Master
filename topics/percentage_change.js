// js/topics/percentage_change.js

// ==========================================
// 百分變化專屬錯誤提示訊息
// ==========================================
const msgPctDirectAdd = `<div class="text-red-600 font-bold text-lg mb-1">❗ 連續百分比錯誤</div><div class="text-sm text-slate-500 mb-2">常見錯誤：直接將兩個百分比相加減（例如：增加 70% 再減少 60% 不等於增加 10%）。必須使用乘法結構：(1 + 70%)(1 - 60%)。</div>`;
const msgPctBaseError = `<div class="text-red-600 font-bold text-lg mb-1">❗ 比較基準（Base Value）錯誤</div><div class="text-sm text-slate-500 mb-2">注意「較誰增加/減少」或「是誰的百分之幾」，分母（基準）必須設定正確。例如「男工比女工少 20%」意味著 男工 = 女工 × (1 - 20%)，而不是女工是基準。</div>`;
const msgPctWeightedError = `<div class="text-red-600 font-bold text-lg mb-1">❗ 加權平均錯誤</div><div class="text-sm text-slate-500 mb-2">不能直接將兩組的百分比相加除以 2！因為兩組的總人數（權重）並不相同，必須先計算出各自的實際人數或佔全體的比例再進行加權組合。</div>`;
const msgPctEquationError = `<div class="text-red-600 font-bold text-lg mb-1">❗ 代數方程建立或化簡錯誤</div><div class="text-sm text-slate-500 mb-2">請仔細檢查題目中的條件方程（例如：外地生總人數 = 女生總人數），將各部分用未知數（如 \\( \\beta \\)）正確表達後再解方程。</div>`;

// ==========================================
// 題目生成器：百分變化 (Percentage Change)
// ==========================================
function generatePercentageQuestions(num, levelPref) {
    const bank = [];

    // 預設精確數據庫，杜絕出現「小數點人數」或不合邏輯的百分比
    const dataL1_Workers = [
        { p: 20, F: 440, M: 352, N: 792 },
        { p: 25, F: 400, M: 300, N: 700 },
        { p: 10, F: 500, M: 450, N: 950 },
        { p: 30, F: 300, M: 210, N: 510 },
        { p: 15, F: 400, M: 340, N: 740 }
    ];

    const dataL2_Salary = [
        { name1: "漢林", name2: "文俊", name3: "佩怡", p1: 25, p2: 25, H: 33360, M: 26688, P: 35584 },
        { name1: "子軒", name2: "家豪", name3: "美玲", p1: 20, p2: 10, H: 39600, M: 33000, P: 36667 },
        { name1: "偉強", name2: "麗華", name3: "志明", p1: 10, p2: 20, H: 26400, M: 24000, P: 30000 }
    ];

    const dataL2_Geometry = [
        { a: 20, b: 50, x: 25 },
        { a: 10, b: 32, x: 20 },
        { a: 25, b: 75, x: 40 },
        { a: 15, b: 38, x: 20 },
        { a: -10, b: 8, x: 20 }
    ];

    const dataL3_Company = [
        { f: 37.5, w: 80, m: 60, ans: 67.5 },
        { f: 40, w: 80, m: 60, ans: 68 },
        { f: 30, w: 90, m: 70, ans: 76 },
        { f: 50, w: 75, m: 65, ans: 70 }
    ];

    const dataL3_School = [
        { T: 33, f: 60, w: 45, x: 15 },
        { T: 35, f: 40, w: 50, x: 25 },
        { T: 28, f: 50, w: 36, x: 20 },
        { T: 42, f: 70, w: 50, x: 23.33 } // 用整數組合避開非整數
    ];
    // 修正 L3 確保全部可整除
    const dataL3_School_Fixed = [
        { T: 33, f: 60, w: 45, x: 15 },
        { T: 35, f: 40, w: 50, x: 25 },
        { T: 28, f: 50, w: 36, x: 20 },
        { T: 40, f: 30, w: 60, x: 31.42 } // 僅用前三個
    ];

    const dataL4_System = [
        { f: 40, m: 30, beta: 55 },
        { f: 50, m: 20, beta: 80 },
        { f: 25, m: 15, beta: 55 },
        { f: 30, m: 21, beta: 51 }
    ];

    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "百分變化 (Percentage Change)" };
        let options = [];
        let steps = [];

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎百分變化與數量計算";
            let subType = Math.random() > 0.5 ? 0 : 1;

            if (subType === 0) {
                // 題型 1: 連續百分比增減 (參照 2015 Q9)
                let inc = (Math.floor(Math.random() * 6) + 3) * 10; // 30% 到 80%
                let dec = (Math.floor(Math.random() * 5) + 3) * 10; // 30% 到 70%
                let netChange = Math.round(((1 + inc/100) * (1 - dec/100) - 1) * 100);
                let netStr = netChange >= 0 ? `+${netChange}%` : `${netChange}%`;

                qObj.question = `
                    <div class="mb-4 text-base sm:text-lg text-slate-600">若某紀念品的價錢增加 ${inc}% 且隨後減少 ${dec}% ，求該紀念品的價錢改變的百分數。</div>
                `;

                steps = [
                    { text: `設原價為 \\( P \\)`, hide: false },
                    { text: `新價錢 = \\( P \\times (1 + ${inc}%) \\times (1 - ${dec}%) \\)`, hide: true },
                    { text: `新價錢 = \\( P \\times ${1 + inc/100} \\times ${1 - dec/100} = ${((1 + inc/100)*(1 - dec/100)).toFixed(2)}P \\)`, hide: true },
                    { text: `改變的百分數 = \\( (${((1 + inc/100)*(1 - dec/100)).toFixed(2)} - 1) \\times 100% = ${netStr} \\)`, hide: false }
                ];

                options = [
                    { text: `\\( \\displaystyle ${netStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${(inc - dec)}% \\)`, isCorrect: false, hint: wrapHint(msgPctDirectAdd, buildEq(steps)) },
                    { text: `\\( \\displaystyle -${(inc * dec / 100)}% \\)`, isCorrect: false, hint: wrapHint(msgPctDirectAdd, buildEq(steps)) },
                    { text: `\\( \\displaystyle -${Math.abs(netChange) + 5}% \\)`, isCorrect: false, hint: wrapHint(msgPctDirectAdd, buildEq(steps)) }
                ];
            } else {
                // 題型 2: 已知百分比差距與總數求數量 (參照 2014 Q9)
                let d = dataL1_Workers[Math.floor(Math.random() * dataL1_Workers.length)];
                qObj.question = `
                    <div class="mb-4 text-base sm:text-lg text-slate-600">某工廠有 ${d.N} 名工人。若男工的人數較女工少 ${d.p}% ，則男工的人數為：</div>
                `;

                steps = [
                    { text: `設女工人數為 \\( W \\)，則男工人數為 \\( W \\times (1 - ${d.p}%) = ${(1 - d.p/100).toFixed(2)}W \\)`, hide: true },
                    { text: `總人數：\\( W + ${(1 - d.p/100).toFixed(2)}W = ${d.N} \\)`, hide: true },
                    { text: `\\( ${(2 - d.p/100).toFixed(2)}W = ${d.N} \\implies W = ${d.F} \\)`, hide: true },
                    { text: `男工人數 = \\( ${d.N} - ${d.F} = ${d.M} \\)`, hide: false }
                ];

                options = [
                    { text: `\\( \\displaystyle ${d.M} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${d.F} \\)`, isCorrect: false, hint: wrapHint(msgPctBaseError + "<div class='text-sm text-slate-500'>提示：這是女工的人數，題目要求的是男工人數。</div>", buildEq(steps)) },
                    { text: `\\( \\displaystyle ${Math.round(d.N * (1 - d.p/100))} \\)`, isCorrect: false, hint: wrapHint(msgPctBaseError + "<div class='text-sm text-slate-500'>提示：不能直接用總人數乘以百分比，因為基準值是女工人數。</div>", buildEq(steps)) },
                    { text: `\\( \\displaystyle ${d.M - 20} \\)`, isCorrect: false, hint: wrapHint(msgPctBaseError, buildEq(steps)) }
                ];
            }

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：連鎖複合關係與幾何公式變化";
            let subType = Math.random() > 0.5 ? 0 : 1;

            if (subType === 0) {
                // 題型 1: 三人連鎖百分比薪酬 (參照 2016 Q10)
                let d = dataL2_Salary[Math.floor(Math.random() * dataL2_Salary.length)];
                qObj.question = `
                    <div class="mb-4 text-base sm:text-lg text-slate-600">${d.name1}的月薪較${d.name2}高 ${d.p1}% ，而${d.name2}的月薪較${d.name3}低 ${d.p2}% 。已知${d.name1}的月薪為 $${d.H} 。求${d.name3}的月薪。</div>
                `;

                steps = [
                    { text: `設${d.name3}的月薪為 \\( P \\)`, hide: false },
                    { text: `${d.name2}的月薪 = \\( P \\times (1 - ${d.p2}%) = ${(1 - d.p2/100).toFixed(2)}P \\)`, hide: true },
                    { text: `${d.name1}的月薪 = \\( ${(1 - d.p2/100).toFixed(2)}P \\times (1 + ${d.p1}%) = $${d.H} \\)`, hide: true },
                    { text: `\\( P \\times ${(1 - d.p2/100).toFixed(2)} \\times ${(1 + d.p1/100).toFixed(2)} = ${d.H} \\)`, hide: true },
                    { text: `\\( ${( (1 - d.p2/100) * (1 + d.p1/100) ).toFixed(4)}P = ${d.H} \\implies P = ${d.P} \\)`, hide: false }
                ];

                options = [
                    { text: `\\( \\displaystyle $${d.P} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle $${d.M} \\)`, isCorrect: false, hint: wrapHint(msgPctBaseError + `<div class='text-sm text-slate-500'>提示：這是${d.name2}的月薪。</div>`, buildEq(steps)) },
                    { text: `\\( \\displaystyle $${Math.round(d.H * (1 - d.p1/100 + d.p2/100))} \\)`, isCorrect: false, hint: wrapHint(msgPctDirectAdd, buildEq(steps)) },
                    { text: `\\( \\displaystyle $${d.H} \\)`, isCorrect: false, hint: wrapHint(msgPctBaseError, buildEq(steps)) }
                ];
            } else {
                // 題型 2: 長方形二維面積百分變化求未知數 (參照 2012SP Q12)
                let d = dataL2_Geometry[Math.floor(Math.random() * dataL2_Geometry.length)];
                let lengthStr = d.a >= 0 ? `增加 ${d.a}%` : `減少 ${Math.abs(d.a)}%`;
                
                qObj.question = `
                    <div class="mb-4 text-base sm:text-lg text-slate-600">若長方形的長及闊分別${lengthStr} 及 增加 x% 使其面積增加 ${d.b}% ，則 x =</div>
                `;

                steps = [
                    { text: `長方形面積公式 = 長 \\( \\times \\) 闊`, hide: false },
                    { text: `新的面積關係式：\\( (1 + ${d.a}%) \\times (1 + x%) = 1 + ${d.b}% \\)`, hide: true },
                    { text: `\\( ${(1 + d.a/100).toFixed(2)} \\times (1 + \\frac{x}{100}) = ${(1 + d.b/100).toFixed(2)} \\)`, hide: true },
                    { text: `\\( 1 + \\frac{x}{100} = \\frac{ ${(1 + d.b/100).toFixed(2)} }{ ${(1 + d.a/100).toFixed(2)} } = ${( (1 + d.b/100)/(1 + d.a/100) ).toFixed(2)} \\)`, hide: true },
                    { text: `\\( \\frac{x}{100} = ${( (1 + d.b/100)/(1 + d.a/100) - 1 ).toFixed(2)} \\implies x = ${d.x} \\)`, hide: false }
                ];

                options = [
                    { text: `\\( \\displaystyle ${d.x} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${d.b - d.a} \\)`, isCorrect: false, hint: wrapHint(msgPctDirectAdd + "<div class='text-sm text-slate-500'>提示：不能直接把百分比加減！面積改變是長和闊改變的乘積。</div>", buildEq(steps)) },
                    { text: `\\( \\displaystyle ${d.x + 5} \\)`, isCorrect: false, hint: wrapHint(msgPctBaseError, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${d.x - 5} \\)`, isCorrect: false, hint: wrapHint(msgPctBaseError, buildEq(steps)) }
                ];
            }

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：加權百分數與二維交叉分類問題";
            let subType = Math.random() > 0.5 ? 0 : 1;

            if (subType === 0) {
                // 題型 1: 已婚僱員比例 (加權平均數) (參照 2012 Q8)
                let d = dataL3_Company[Math.floor(Math.random() * dataL3_Company.length)];
                qObj.question = `
                    <div class="mb-4 text-base sm:text-lg text-slate-600">在某公司，${d.f}% 的僱員為女性。若 ${(100 - d.f)}% 的男僱員及 ${d.w}% 的女僱員均已婚，則該公司中已婚僱員所佔的百分數為：</div>
                `;
                // 註：配合香港DSE原題語境修改數字，題目文字微調使其符合邏輯
                let malePct = d.m; 
                qObj.question = `
                    <div class="mb-4 text-base sm:text-lg text-slate-600">在某公司，${d.f}% 的僱員為女性。若 ${malePct}% 的男僱員及 ${d.w}% 的女僱員均已婚，則該公司中已婚僱員所佔的百分數為：</div>
                `;

                steps = [
                    { text: `設全公司總僱員人數為 \\( N \\)`, hide: false },
                    { text: `女僱員人數 = \\( ${d.f}% N \\)，男僱員人數 = \\( ${(100 - d.f)}% N \\)`, hide: true },
                    { text: `已婚女僱員 = \\( ${d.f}% N \\times ${d.w}% = ${(d.f * d.w / 100).toFixed(2)}% N \\)`, hide: true },
                    { text: `已婚男僱員 = \\( ${(100 - d.f)}% N \\times ${malePct}% = ${((100 - d.f) * malePct / 100).toFixed(2)}% N \\)`, hide: true },
                    { text: `已婚總人數 = \\( ${(d.f * d.w / 100).toFixed(2)}% N + ${((100 - d.f) * malePct / 100).toFixed(2)}% N = ${d.ans}% N \\)`, hide: false }
                ];

                options = [
                    { text: `\\( \\displaystyle ${d.ans}% \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${( (malePct + d.w)/2 )}% \\)`, isCorrect: false, hint: wrapHint(msgPctWeightedError + "<div class='text-sm text-slate-500'>提示：不能直接將男已婚率和女已婚率直接取平均數，因為男女員工的比例不相等。</div>", buildEq(steps)) },
                    { text: `\\( \\displaystyle ${(d.ans - 5)}% \\)`, isCorrect: false, hint: wrapHint(msgPctWeightedError, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${(d.ans + 5)}% \\)`, isCorrect: false, hint: wrapHint(msgPctWeightedError, buildEq(steps)) }
                ];
            } else {
                // 題型 2: 二維表格逆向求解男生超重率 (參照 2021 Q9)
                let d = dataL3_School_Fixed[Math.floor(Math.random() * (dataL3_School_Fixed.length - 1))]; // 確保選取前三個整數解
                qObj.question = `
                    <div class="mb-4 text-base sm:text-lg text-slate-600">在某校，${d.T}% 學生超重。已知該校中 ${d.f}% 學生為女生且 ${d.w}% 女生超重。若該校中 x% 男生超重，則 x =</div>
                `;

                let maleRatio = 100 - d.f;
                steps = [
                    { text: `設學校總人數為 \\( N \\)，則女生佔 \\( ${d.f}% \\)，男生佔 \\( ${maleRatio}% \\)`, hide: false },
                    { text: `超重學生總數 = \\( ${d.T}% N \\)`, hide: true },
                    { text: `超重女生人數 = \\( ${d.f}% N \\times ${d.w}% = ${(d.f * d.w / 100).toFixed(2)}% N \\)`, hide: true },
                    { text: `超重男生人數 = 總超重 - 女生超重 = \\( ${d.T}% N - ${(d.f * d.w / 100).toFixed(2)}% N = ${(d.T - d.f * d.w / 100).toFixed(2)}% N \\)`, hide: true },
                    { text: `男生超重百分比 x% = \\( \\frac{ ${(d.T - d.f * d.w / 100).toFixed(2)}% N }{ ${maleRatio}% N } = ${d.x}% \\)`, hide: false }
                ];

                options = [
                    { text: `\\( \\displaystyle ${d.x} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${Math.round((d.T - d.w))} \\)`, isCorrect: false, hint: wrapHint(msgPctWeightedError + "<div class='text-sm text-slate-500'>提示：百分比不可直接相減得到群組百分比。</div>", buildEq(steps)) },
                    { text: `\\( \\displaystyle ${d.x + 10} \\)`, isCorrect: false, hint: wrapHint(msgPctWeightedError, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${d.x - 5} \\)`, isCorrect: false, hint: wrapHint(msgPctWeightedError, buildEq(steps)) }
                ];
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：高階代數聯立與未知數推導（拔尖）";
            // 題型: 雙未知數平衡推導 (參照 2024 Q11)
            let d = dataL4_System[Math.floor(Math.random() * dataL4_System.length)];
            let malePct = 100 - d.f;

            qObj.question = `
                <div class="mb-4 text-base sm:text-lg text-slate-600">在某校，${d.f}% 學生為女生且 \\( \\beta% \\) 女生為外地生。已知該校中 ${d.m}% 男生為外地生。在該校，外地生人數與女生總人數相等。求 \\( \\beta \\) 。</div>
            `;

            steps = [
                { text: `設全校總學生人數為 \\( N \\)，則女生人數為 \\( ${d.f}% N = ${(d.f/100).toFixed(2)} N \\)`, hide: false },
                { text: `男生人數為 \\( ${malePct}% N = ${(malePct/100).toFixed(2)} N \\)`, hide: true },
                { text: `外地生總數 = 女生外地生 + 男生外地生 = \\( ${(d.f/100).toFixed(2)}N \\times \\frac{\\beta}{100} + ${(malePct/100).toFixed(2)}N \\times ${d.m}% \\)`, hide: true },
                { text: `根據題意（外地生人數 = 女生人數）：\\( ${(d.f/100).toFixed(2)}N \\times \\frac{\\beta}{100} + ${(malePct/100 * d.m / 100).toFixed(4)}N = ${(d.f/100).toFixed(2)}N \\)`, hide: true },
                { text: `同除以 \\( N \\) 並化簡：\\( ${(d.f/100).toFixed(2)} \\times \\frac{\\beta}{100} = ${(d.f/100).toFixed(2)} - ${(malePct/100 * d.m / 100).toFixed(4)} = ${(d.f/100 - malePct/100 * d.m / 100).toFixed(4)} \\)`, hide: true },
                { text: `\\( \\frac{\\beta}{100} = \\frac{ ${(d.f/100 - malePct/100 * d.m / 100).toFixed(4)} }{ ${(d.f/100).toFixed(2)} } = ${( (d.f/100 - malePct/100 * d.m / 100) / (d.f/100) ).toFixed(4)} \\)`, hide: true },
                { text: `\\( \\beta = ${d.beta} \\)`, hide: false }
            ];

            options = [
                { text: `\\( \\displaystyle ${d.beta} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( \\displaystyle ${d.beta - 10} \\)`, isCorrect: false, hint: wrapHint(msgPctEquationError, buildEq(steps)) },
                { text: `\\( \\displaystyle ${d.beta + 15} \\)`, isCorrect: false, hint: wrapHint(msgPctEquationError, buildEq(steps)) },
                { text: `\\( \\displaystyle ${Math.round(100 - d.beta)} \\)`, isCorrect: false, hint: wrapHint(msgPctEquationError, buildEq(steps)) }
            ];
        }

        // 隨機打亂選項順序並附加 A, B, C, D 標籤
        qObj.options = shuffleArray(options).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx)
        }));

        bank.push(qObj);
    }
    return bank;
}
