// js/topics/pricing.js

// ==========================================
// 成本/售價/標價 專用錯誤提示訊息
// ==========================================
const msgPricing1 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 錯誤：百分數不能直接相加減</div>`;
const msgPricing2 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 錯誤：盈利與虧蝕的基準是「成本」而非「售價」</div>`;
const msgPricing3 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 錯誤：方程建立錯誤，標價 = 成本 × (1 + 百分數)</div>`;

// 輔助函數：將折扣百分比轉為中文「折」 (例如 25% off -> 七五折)
function getDiscountText(discountPercent) {
    let remain = 100 - discountPercent; 
    let tens = Math.floor(remain / 10);
    let units = remain % 10;
    let zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    if (units === 0) return zh[tens] + "折";
    return zh[tens] + zh[units] + "折";
}

// ==========================================
// 題目生成器：成本 / 售價 / 標價
// ==========================================
function generatePricingQuestions(num, levelPref) {
    const bank = [];
    
    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref);
        if (levelPref === 'mixed') {
            lvl = ['1', '2', '3'][Math.floor(Math.random() * 3)];
        }

        let qObj = { id: i + 1, topic: "成本 / 售價 / 標價" };
        let questionMathStr = "";
        let options = [];
        let steps = [];

        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";
            // 題型：A 賣給 B (獲利 p1%)，B 賣出 (獲利/虧蝕 p2%)
            let C = getRandomInt(10, 50) * 100; // 1000 ~ 5000
            let p1 = getRandomInt(1, 5) * 10;   // 10, 20, 30, 40
            let p2 = getRandomInt(1, 4) * 10;   // 10, 20, 30
            let isProfit2 = Math.random() > 0.3; // B 的交易大多是獲利，偶爾虧蝕

            let p2Text = isProfit2 ? "獲利" : "虧蝕";
            let p2Sign = isProfit2 ? "+" : "-";
            let p2Multiplier = isProfit2 ? (1 + p2/100) : (1 - p2/100);

            questionMathStr = `偉明以 \\( \\$${C} \\) 購入某物品，之後他將該物品售予素珊並獲利 \\( ${p1}\\% \\)。素珊應以甚麼價錢出售該物品才可${p2Text} \\( ${p2}\\% \\)？`;

            let sp1 = C * (1 + p1/100);
            let finalSP = sp1 * p2Multiplier;

            steps.push({ text: `\\text{素珊的買入價 (即偉明的售價)} = \\$${C} \\times (1 + ${p1}\\%) = \\$${sp1}`, hide: false });
            steps.push({ text: `\\text{素珊的最終售價} = \\$${sp1} \\times (1 ${p2Sign} ${p2}\\%)`, hide: false });
            steps.push({ text: `= \\$${finalSP}`, hide: false });

            let correctStr = `\\( \\$${finalSP} \\)`;
            let w1 = `\\( \\$${C * (1 + (isProfit2 ? p1+p2 : p1-p2)/100)} \\)`; // 錯誤相加
            let w2 = `\\( \\$${C * (1 + p1/100) * (isProfit2 ? (1-p2/100) : (1+p2/100))} \\)`; // 獲利/虧蝕搞反
            let w3 = `\\( \\$${C * (1 + p1/100 + (isProfit2 ? p2/100 : -p2/100) + 0.1)} \\)`; // 隨機干擾

            options = [
                { text: correctStr, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: w1, isCorrect: false, hint: wrapHint(msgPricing1 + "<div class='text-sm text-slate-500 mb-2'>(提示：必須先算出素珊的買入價，不能將百分比直接相加)</div>", buildEq(steps)) },
                { text: w2, isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg mb-1">❗ 錯誤：獲利是加，虧蝕是減</div>`, buildEq(steps)) },
                { text: w3, isCorrect: false, hint: wrapHint(msgPricing1, buildEq(steps)) }
            ];
            
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";
            // 題型：兩個物品同售價，一個賺 p%，一個蝕 p%
            let configs = [
                { p: 20, mults: [10, 20, 50, 100], lcm: 24 },
                { p: 30, mults: [10, 20, 50, 100], lcm: 91 },
                { p: 25, mults: [10, 20, 40, 100], lcm: 15 }
            ];
            let conf = configs[getRandomInt(0, configs.length)];
            let S = conf.lcm * conf.mults[getRandomInt(0, conf.mults.length)];

            questionMathStr = `小麗售出兩個手袋，每個手袋的售價均為 \\( \\$${S} \\)，其中一個獲利 \\( ${conf.p}\\% \\)，而另一個則虧蝕 \\( ${conf.p}\\% \\)。完成該兩項交易後，小麗：`;

            let c1 = S / (1 + conf.p/100);
            let c2 = S / (1 - conf.p/100);
            let totalS = S * 2;
            let totalC = c1 + c2;
            let diff = totalS - totalC; // 必定小於 0 (虧蝕)
            let lossAmt = Math.abs(diff);

            steps.push({ text: `\\text{總售價} = \\$${S} \\times 2 = \\$${totalS}`, hide: false });
            steps.push({ text: `\\text{獲利物品的成本} = \\frac{\\$${S}}{1 + ${conf.p}\\%} = \\$${c1}`, hide: false });
            steps.push({ text: `\\text{虧蝕物品的成本} = \\frac{\\$${S}}{1 - ${conf.p}\\%} = \\$${c2}`, hide: false });
            steps.push({ text: `\\text{總成本} = \\$${c1} + \\$${c2} = \\$${totalC}`, hide: false });
            steps.push({ text: `\\text{整體結果} = \\text{總售價} - \\text{總成本} = ${totalS} - ${totalC} = -${lossAmt}`, hide: false });
            steps.push({ text: `\\therefore \\text{虧蝕 } \\$${lossAmt}`, hide: false });

            let correctStr = `\\( \\text{虧蝕 } \\$${lossAmt} \\)`;
            let w1 = `\\( \\text{既無獲利，又無虧蝕} \\)`;
            let w2 = `\\( \\text{獲利 } \\$${lossAmt} \\)`;
            let fakeLoss = (totalS * (conf.p/100)).toFixed(0);
            let w3 = `\\( \\text{虧蝕 } \\$${fakeLoss} \\)`;

            options = [
                { text: correctStr, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: w1, isCorrect: false, hint: wrapHint(msgPricing2 + "<div class='text-sm text-slate-500 mb-2'>(提示：雖然百分比相同，但計算的基準「成本」不同，因此不會互相抵銷)</div>", buildEq(steps)) },
                { text: w2, isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg mb-1">❗ 錯誤：這種情況必定為虧蝕</div>`, buildEq(steps)) },
                { text: w3, isCorrect: false, hint: wrapHint(msgPricing2, buildEq(steps)) }
            ];

        } else {
            qObj.level = "⭐⭐⭐ 程度 3";
            // 題型：標價較成本高 m%，以折扣 d% 售出，獲利 $P，求成本。
            let scenarios = [
                { m: 60, d: 25, rate: 0.20 }, // 1.6 * 0.75 = 1.2
                { m: 50, d: 20, rate: 0.20 }, // 1.5 * 0.8 = 1.2
                { m: 40, d: 10, rate: 0.26 }, // 1.4 * 0.9 = 1.26
                { m: 75, d: 20, rate: 0.40 }, // 1.75 * 0.8 = 1.4
                { m: 80, d: 25, rate: 0.35 }  // 1.8 * 0.75 = 1.35
            ];
            let sc = scenarios[getRandomInt(0, scenarios.length)];
            let C = getRandomInt(30, 80) * 10; // 成本 300 ~ 800
            
            // 確保利潤為整數
            let P = Math.round(C * sc.rate);
            
            let discountText = getDiscountText(sc.d);
            
            questionMathStr = `某外套的標價較其成本高 \\( ${sc.m}\\% \\)。該外套以其標價${discountText}售出並獲利 \\( \\$${P} \\)。求該外套的成本。`;

            steps.push({ text: `\\text{設成本為 } x`, hide: false });
            steps.push({ text: `\\text{標價} = x(1 + ${sc.m}\\%) = ${1 + sc.m/100}x`, hide: false });
            steps.push({ text: `\\text{售價} = \\text{標價} \\times (1 - ${sc.d}\\%)`, hide: false });
            steps.push({ text: `\\text{售價} = ${1 + sc.m/100}x \\times ${(1 - sc.d/100)} = ${(1 + sc.rate).toFixed(2)}x`, hide: false });
            steps.push({ text: `\\text{盈利} = \\text{售價} - \\text{成本}`, hide: false });
            steps.push({ text: `${P} = ${(1 + sc.rate).toFixed(2)}x - x`, hide: false });
            steps.push({ text: `${P} = ${sc.rate.toFixed(2)}x`, hide: false });
            steps.push({ text: `x = ${C}`, hide: false });

            let correctStr = `\\( \\$${C} \\)`;
            let w1 = `\\( \\$${Math.round(P / (sc.m/100 - sc.d/100))} \\)`; // 錯誤方程式
            let w2 = `\\( \\$${Math.round(C * (1 + sc.rate))} \\)`; // 誤算為售價
            let w3 = `\\( \\$${C + 120} \\)`; // 隨機干擾

            options = [
                { text: correctStr, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: w1, isCorrect: false, hint: wrapHint(msgPricing3 + "<div class='text-sm text-slate-500 mb-2'>(提示：售價應為 標價 × 折扣，而非將百分比直接相減)</div>", buildEq(steps)) },
                { text: w2, isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg mb-1">❗ 錯誤：題目要求的是「成本」而非「售價」</div>`, buildEq(steps)) },
                { text: w3, isCorrect: false, hint: wrapHint(msgPricing3, buildEq(steps)) }
            ];
        }

        // 確保選項去重並滿足4個
        let texts = [];
        let finalOptions = [];
        options.forEach(opt => {
            if (!texts.includes(opt.text) && opt.text !== `\\$NaN` && opt.text !== `\\$Infinity`) {
                texts.push(opt.text);
                finalOptions.push(opt);
            }
        });
        
        let fallbackAmt = 50;
        while(finalOptions.length < 4) {
            let altText = `\\( \\$${parseInt(correctStr.replace(/[^0-9]/g, '')) + fallbackAmt} \\)`;
            if (!texts.includes(altText)) {
                texts.push(altText);
                finalOptions.push({ text: altText, isCorrect: false, hint: wrapHint(msgPricing1, buildEq(steps)) });
            }
            fallbackAmt += 50;
        }

        qObj.options = shuffleArray(finalOptions).map((opt, idx) => ({ ...opt, id: String.fromCharCode(65 + idx) }));
        
        qObj.question = `
        <div class="mb-4 text-base sm:text-lg text-slate-600">解答以下百分數應用題：</div>
        <div class="text-base sm:text-lg font-bold text-indigo-700 py-4 w-full leading-relaxed whitespace-normal break-words" style="line-height: 1.9; word-break: break-word; white-space: normal !important; max-width: 100%; overflow-wrap: break-word;">
            ${questionMathStr}
        </div>`;
        
        bank.push(qObj);
    }
    return bank;
}