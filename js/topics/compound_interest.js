// js/topics/compound_interest.js

// ==========================================
// 複利息專屬錯誤提示訊息
// ==========================================
const msgCiPeriod = `<div class="text-red-600 font-bold text-lg mb-1">❗ 結息期轉換錯誤</div><div class="text-sm text-slate-500 mb-2">常見錯誤：忘記根據結息期（如每半年、每季、每月）調整利率和期數。年利率必須除以結息次數，而年數必須乘以結息次數。</div>`;
const msgCiInterest = `<div class="text-red-600 font-bold text-lg mb-1">❗ 混淆本利和與利息</div><div class="text-sm text-slate-500 mb-2">注意題目要求的是「本利和 (Amount)」還是「利息 (Interest)」。利息 = 本利和 - 本金。</div>`;
const msgCiFormula = `<div class="text-red-600 font-bold text-lg mb-1">❗ 複利息公式運用錯誤</div><div class="text-sm text-slate-500 mb-2">請確保使用的是複利息公式 \\( A = P(1 + \\frac{r}{n})^{nt} \\)，而不是單利息公式。</div>`;
const msgCiAnnuity = `<div class="text-red-600 font-bold text-lg mb-1">❗ 忽略每月遞增的期數 (年金計算)</div><div class="text-sm text-slate-500 mb-2">這不是一次性存款！每月初存款，每筆錢在戶口內的時間不同。必須利用等比數列 (Geometric Sequence) 求和公式計算總和。</div>`;

// ==========================================
// 題目生成器：複利息 (Compound Interest)
// ==========================================
function generateCompoundInterestQuestions(num, levelPref) {
    const bank = [];
    
    // 結息期設定
    const periodTypes = [
        { name: "一年", n: 1 },
        { name: "半年", n: 2 },
        { name: "季", n: 4 },
        { name: "月", n: 12 }
    ];

    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "複利息 (Compound Interest)" };
        let options = [];
        let steps = [];

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎本利和計算 (Amount)";
            // 題型：給定 P, r, t, n 求 A (參照 2015 Q10)
            let P = (Math.floor(Math.random() * 8) + 2) * 10000; // 20000 to 90000
            let r = Math.floor(Math.random() * 6) + 3; // 3% to 8%
            let t = Math.floor(Math.random() * 4) + 2; // 2 to 5 years
            
            // 排除 n=1 讓題目具備基本 DSE 難度
            let pt = periodTypes[Math.floor(Math.random() * 3) + 1]; 
            
            let ratePerPeriod = r / pt.n;
            let totalPeriods = t * pt.n;
            let A = P * Math.pow(1 + r / (100 * pt.n), totalPeriods);
            let ans = Math.round(A);
            
            // 錯誤計算
            let wrongPeriodA = Math.round(P * Math.pow(1 + r/100, t)); // 忘記轉換 n
            let simpleInterestA = Math.round(P * (1 + (r/100) * t)); // 錯用單利息
            let wrongInterest = Math.round(A - P); // 求了利息

            qObj.question = `
                <div class="mb-4 text-base sm:text-lg text-slate-600">存款 $${P} ，年利率 ${r}% ，年期 ${t} 年，複利計算，每${pt.name}一結。求本利和準確至最接近的元。</div>
            `;

            steps = [
                { text: `本金 \\( P = $${P} \\)`, hide: false },
                { text: `每期利率 \\( = \\frac{${r}\%}{${pt.n}} = ${ratePerPeriod}\% \\) ，總期數 \\( = ${t} \\times ${pt.n} = ${totalPeriods} \\)`, hide: true },
                { text: `本利和 \\( A = P(1 + r\%)^{n} \\)`, hide: true },
                { text: `\\( A = ${P}(1 + ${ratePerPeriod}\%)^{${totalPeriods}} \\)`, hide: true },
                { text: `\\( A \\approx $${ans} \\)`, hide: false }
            ];

            options = [
                { text: `\\( \$${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( \$${wrongPeriodA} \\)`, isCorrect: false, hint: wrapHint(msgCiPeriod, buildEq(steps)) },
                { text: `\\( \$${simpleInterestA} \\)`, isCorrect: false, hint: wrapHint(msgCiFormula, buildEq(steps)) },
                { text: `\\( \$${wrongInterest} \\)`, isCorrect: false, hint: wrapHint(msgCiInterest, buildEq(steps)) }
            ];

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：複利息計算 (Interest)";
            // 題型：給定 P, r, t, n 求 利息 I (參照 2013 Q11, 2017 Q10)
            let P = (Math.floor(Math.random() * 9) + 1) * 5000; 
            let r = Math.floor(Math.random() * 6) + 4; 
            let t = Math.floor(Math.random() * 3) + 1; 
            let pt = periodTypes[Math.floor(Math.random() * 3) + 1]; 
            
            let ratePerPeriod = r / pt.n;
            let totalPeriods = t * pt.n;
            let A = P * Math.pow(1 + r / (100 * pt.n), totalPeriods);
            let I = A - P;
            let ans = Math.round(I);
            
            // 錯誤計算
            let wrongAmount = Math.round(A); // 錯求本利和
            let wrongPeriodI = Math.round(P * Math.pow(1 + r/100, t) - P); // 忘記轉換 n
            let simpleInterest = Math.round(P * (r/100) * t); // 單利息

            qObj.question = `
                <div class="mb-4 text-base sm:text-lg text-slate-600">存款 $${P} ，年利率 ${r}% ，年期 ${t} 年，複利計算，每${pt.name}一結。求利息準確至最接近的元。</div>
            `;

            steps = [
                { text: `每期利率 \\( = \\frac{${r}\%}{${pt.n}} = ${ratePerPeriod}\% \\) ，總期數 \\( = ${t} \\times ${pt.n} = ${totalPeriods} \\)`, hide: false },
                { text: `本利和 \\( A = ${P}(1 + ${ratePerPeriod}\%)^{${totalPeriods}} \\)`, hide: true },
                { text: `\\( A \\approx $${Math.round(A)} \\)`, hide: true },
                { text: `利息 \\( I = A - P = ${Math.round(A)} - ${P} \\)`, hide: true },
                { text: `\\( I \\approx $${ans} \\)`, hide: false }
            ];

            options = [
                { text: `\\( \$${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( \$${wrongAmount} \\)`, isCorrect: false, hint: wrapHint(msgCiInterest + "<div class='text-sm text-slate-500'>提示：這是本利和，別忘記減去本金。</div>", buildEq(steps)) },
                { text: `\\( \$${wrongPeriodI} \\)`, isCorrect: false, hint: wrapHint(msgCiPeriod, buildEq(steps)) },
                { text: `\\( \$${simpleInterest} \\)`, isCorrect: false, hint: wrapHint(msgCiFormula, buildEq(steps)) }
            ];

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：逆向求本金";
            // 題型：已知利息/本利和求本金 P
            let isInterestType = Math.random() > 0.5;
            let P_real = (Math.floor(Math.random() * 5) + 2) * 10000;
            let r = Math.floor(Math.random() * 5) + 3;
            let t = Math.floor(Math.random() * 3) + 2;
            let pt = periodTypes[Math.floor(Math.random() * 3) + 1];

            let multiplier = Math.pow(1 + r / (100 * pt.n), t * pt.n);
            let GivenValue, qText;
            
            if (isInterestType) {
                GivenValue = Math.round(P_real * (multiplier - 1));
                qText = `某存款以年利率 ${r}% 複利計算，每${pt.name}一結。若 ${t} 年後的利息為 $${GivenValue}，求本金準確至最接近的百元。`;
            } else {
                GivenValue = Math.round(P_real * multiplier);
                qText = `某存款以年利率 ${r}% 複利計算，每${pt.name}一結。若 ${t} 年後的本利和為 $${GivenValue}，求本金準確至最接近的百元。`;
            }

            let ansP = P_real;
            
            // 錯誤選項計算
            let wrongP_period;
            if (isInterestType) {
                wrongP_period = Math.round(GivenValue / (Math.pow(1 + r/100, t) - 1));
            } else {
                wrongP_period = Math.round(GivenValue / Math.pow(1 + r/100, t));
            }
            
            let simpleP;
            if (isInterestType) {
                simpleP = Math.round(GivenValue / ((r/100) * t));
            } else {
                simpleP = Math.round(GivenValue / (1 + (r/100) * t));
            }
            
            let rndP = ansP + (Math.random() > 0.5 ? 500 : -500);

            // 修整到百位
            ansP = Math.round(ansP / 100) * 100;
            wrongP_period = Math.round(wrongP_period / 100) * 100;
            simpleP = Math.round(simpleP / 100) * 100;
            
            qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">${qText}</div>`;

            steps = [
                { text: `設本金為 \\( P \\)`, hide: false },
                { text: `每期利率 \\( = \\frac{${r}\%}{${pt.n}} \\)，總期數 \\( = ${t} \\times ${pt.n} = ${t * pt.n} \\)`, hide: true },
            ];
            
            if (isInterestType) {
                steps.push({ text: `利息方程式：\\( P(1 + \\frac{${r}\%}{${pt.n}})^{${t * pt.n}} - P = ${GivenValue} \\)`, hide: true });
                steps.push({ text: `\\( P[ (1 + \\frac{${r}\%}{${pt.n}})^{${t * pt.n}} - 1 ] = ${GivenValue} \\)`, hide: true });
                steps.push({ text: `\\( P = \\frac{${GivenValue}}{ ${ (multiplier - 1).toFixed(4)} } \\)`, hide: true });
            } else {
                steps.push({ text: `本利和方程式：\\( P(1 + \\frac{${r}\%}{${pt.n}})^{${t * pt.n}} = ${GivenValue} \\)`, hide: true });
                steps.push({ text: `\\( P = \\frac{${GivenValue}}{ (1 + \\frac{${r}\%}{${pt.n}})^{${t * pt.n}} } \\)`, hide: true });
            }
            steps.push({ text: `\\( P \\approx $${ansP} \\)`, hide: false });

            // 確保選項不重複
            let optVals = new Set([ansP]);
            options.push({ text: `\\( \$${ansP} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) });
            
            if (!optVals.has(wrongP_period)) {
                options.push({ text: `\\( \$${wrongP_period} \\)`, isCorrect: false, hint: wrapHint(msgCiPeriod, buildEq(steps)) });
                optVals.add(wrongP_period);
            }
            if (!optVals.has(simpleP)) {
                options.push({ text: `\\( \$${simpleP} \\)`, isCorrect: false, hint: wrapHint(msgCiFormula, buildEq(steps)) });
                optVals.add(simpleP);
            }
            
            // 補足4個選項
            let dummy = [rndP, ansP + 1000, ansP - 1000, ansP + 200];
            let dummyIdx = 0;
            while(options.length < 4) {
                let v = Math.round(dummy[dummyIdx]/100)*100;
                if (!optVals.has(v)) {
                    options.push({ text: `\\( \$${v} \\)`, isCorrect: false, hint: wrapHint(msgCiFormula, buildEq(steps)) });
                    optVals.add(v);
                }
                dummyIdx++;
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：等比年金逆向推導 (拔尖)";
            // 題型：每月初存款 P，年終得款 A，求 P (參照 2012SP Q39)
            // 公式：A = P(1+i) + P(1+i)^2 + ... + P(1+i)^12 = P * (1+i)[(1+i)^12 - 1] / i
            let A = (Math.floor(Math.random() * 5) + 1) * 10000; // 10000 to 50000
            let r_options = [6, 12, 18, 24]; // 讓月利率容易算
            let r = r_options[Math.floor(Math.random() * r_options.length)];
            let i = r / 1200; // 月利率小數
            
            let factor = (1 + i) * (Math.pow(1 + i, 12) - 1) / i;
            let P = A / factor;
            let ans = P.toFixed(2);
            
            // 常見錯誤
            // 1. 當作單一筆存款：P(1+r/12)^12 = A
            let w1 = (A / Math.pow(1 + i, 12)).toFixed(2);
            // 2. 公式少乘了頭一個 (1+i)，以為是月底存款
            let factor_end = (Math.pow(1 + i, 12) - 1) / i;
            let w2 = (A / factor_end).toFixed(2);
            // 3. 簡單除以 12 加上單利息干擾
            let w3 = (A / 12 * (1 - r/100)).toFixed(2);

            qObj.question = `
                <div class="mb-4 text-base sm:text-lg text-slate-600">偉明於某年每月初存款 $P ，年利率 ${r}% ，複利計算，每月一結。若他於年終時得款 $${A} ，求 P 準確至二位小數。</div>
            `;

            steps = [
                { text: `此為等比數列求和 (年金) 問題，不能直接當作單筆存款計算。`, hide: false },
                { text: `月利率 \\( i = \\frac{${r}\%}{12} = ${i} \\)`, hide: true },
                { text: `第一個月的存款在年終有 12 個月利息：\\( P(1+i)^{12} \\)`, hide: true },
                { text: `最後一個月（第12個月）的存款在年終有 1 個月利息：\\( P(1+i)^{1} \\)`, hide: true },
                { text: `總本利和 \\( A = P(1+i)^1 + P(1+i)^2 + ... + P(1+i)^{12} \\)`, hide: true },
                { text: `運用等比數列求和公式：\\( S = \\frac{a(r^n - 1)}{r - 1} \\)`, hide: true },
                { text: `\\( ${A} = \\frac{P(1+i)[(1+i)^{12} - 1]}{(1+i) - 1} = \\frac{P(${1+i})[(${1+i})^{12} - 1]}{${i}} \\)`, hide: true },
                { text: `\\( P = \\frac{${A} \\times ${i}}{${1+i}[${Math.pow(1+i, 12).toFixed(4)} - 1]} \\approx ${ans} \\)`, hide: false }
            ];

            options = [
                { text: `\\( ${ans} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( ${w1} \\)`, isCorrect: false, hint: wrapHint(msgCiAnnuity + "<div class='text-sm text-slate-500 mb-2'>提示：這是把所有錢當作年初一次過存入的錯誤算法。</div>", buildEq(steps)) },
                { text: `\\( ${w2} \\)`, isCorrect: false, hint: wrapHint(msgCiAnnuity + "<div class='text-sm text-slate-500 mb-2'>提示：這是在每「月尾」存款的公式，但題目是「月初」。</div>", buildEq(steps)) },
                { text: `\\( ${w3} \\)`, isCorrect: false, hint: wrapHint(msgCiFormula, buildEq(steps)) }
            ];
        }

        // 隨機打亂選項
        qObj.options = shuffleArray(options).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx)
        }));

        bank.push(qObj);
    }
    return bank;
}
