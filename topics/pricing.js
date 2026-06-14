// js/topics/pricing.js
// 成本 / 售價 / 標價（盈利、虧蝕與折扣）
// 程度1 一步直接套公式｜程度2 兩步｜程度3 反推(2-4步, DSE入門)｜程度4 高中/DSE應用

// ==========================================
// 專屬錯誤提示訊息
// ==========================================
const msgPrc1 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 加減方向錯誤（盈利要加、虧蝕/折扣要減）</div>`;
const msgPrc2 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 基準錯誤：盈利／虧蝕以「成本」為基準、折扣以「標價」為基準</div>`;
const msgPrc3 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 反推時應用「除法」，不能直接乘百分數</div>`;
const msgPrc4 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 百分數不能直接相加減</div>`;
const msgPrc5 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 求錯對象（成本 / 售價 / 標價搞混）</div>`;

// 折扣百分比 → 中文「折」（25% off → 七五折）
function getDiscountText(discountPercent) {
    let remain = 100 - discountPercent;
    let tens = Math.floor(remain / 10);
    let units = remain % 10;
    let zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    if (remain === 100) return "原價";
    if (units === 0) return zh[tens] + "折";
    return zh[tens] + zh[units] + "折";
}

// 將「LHS = RHS」字串組成等號左對齊的 aligned 區塊
function _prcAligned(eqs) {
    const lines = eqs.map(eq => {
        const m = eq.match(/^([\s\S]*?)\s*=\s*([\s\S]*)$/);
        return m ? `${m[1]} &= ${m[2]}` : `& ${eq}`;
    });
    return `\\[ \\begin{aligned} ${lines.join(' \\\\ ')} \\end{aligned} \\]`;
}
// 詳細步驟摺疊區
function _prcSteps(eqs) {
    return `
    <details class="group my-2">
        <summary class="cursor-pointer text-indigo-500 hover:text-indigo-700 font-bold text-sm select-none flex items-center gap-1 outline-none ml-1">
            <svg class="w-5 h-5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            查看詳細步驟
        </summary>
        <div class="mt-2 pl-5 border-l-2 border-indigo-200 overflow-x-auto math-scroll">${_prcAligned(eqs)}</div>
    </details>`;
}

// ==========================================
// 題目生成器：成本 / 售價 / 標價
// ==========================================
function generatePricingQuestions(num, levelPref) {
    const bank = [];
    const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    const names = ['偉明', '素珊', '小麗', '志超', '綺雯', '子俊', '禮謙', '雅怡', '志宏', '嘉雄', '穎珊', '陳太', '黃先生', '雪琳'];
    const items = ['一個花瓶', '一隻手錶', '一部打印機', '一個背包', '一件毛衣', '一部滑板車', '一盒拼圖', '一罐奶粉', '一個模型', '一部空氣淨化器', '一支電動牙刷', '一個鞋櫃', '一台鋼琴', '一條項鍊'];

    // 題型按順序輪流出（每程度 5 款）
    const typeCount = { '1': 5, '2': 5, '3': 5, '4': 5 };
    const typeCounter = {};

    // 組裝選項（正解 + 干擾項，去重補足 4 個）
    function makeOpts(correct, wrongs, steps) {
        const stepHtml = _prcSteps(steps);
        let opts = [{ text: correct, isCorrect: true, hint: wrapHint(msgCorrect, stepHtml) }];
        wrongs.forEach(w => opts.push({ text: w.s, isCorrect: false, hint: wrapHint(w.m || msgPrc1, stepHtml) }));
        let seen = [], final = [];
        opts.forEach(o => { if (!seen.includes(o.text) && !/NaN|Infinity|undefined/.test(o.text)) { seen.push(o.text); final.push(o); } });
        let bump = 50;
        while (final.length < 4) {
            // 由正解金額產生備用干擾項
            let base = parseInt(correct.replace(/[^0-9]/g, '')) || 100;
            let alt = correct.replace(/[0-9]+/, String(base + bump));
            if (!seen.includes(alt)) { seen.push(alt); final.push({ text: alt, isCorrect: false, hint: wrapHint(msgPrc1, stepHtml) }); }
            bump += 50;
        }
        return shuffleArray(final).map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) }));
    }
    const money = v => `\\( \\$${v} \\)`;
    const pct = v => `\\( ${v}\\% \\)`;
    const lossProfit = (amt, isProfit) => `\\( \\text{${isProfit ? '盈利' : '虧蝕'} } \\$${amt} \\)`;

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref);
        if (levelPref === 'mixed') lvl = pick(['1', '2', '3', '4']);

        const TC = typeCount[lvl] || 5;
        typeCounter[lvl] = (typeCounter[lvl] || 0);
        const type = typeCounter[lvl] % TC;
        typeCounter[lvl]++;

        let qObj = { id: i + 1, topic: "成本 / 售價 / 標價" };
        let qStr = "", options = [];
        const nm = pick(names), it = pick(items);
        const bare = it.replace(/^一[個隻部條盒罐件支台]/, ''); // 去量詞（如「一條項鍊」→「項鍊」）

        // ════════════ 程度 1：一步直接套公式 ════════════
        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";

            if (type === 0) {
                // T1 求盈利/虧蝕金額：售價 − 成本
                let C = ri(5, 80) * 10, d = ri(2, 30) * 10, isP = Math.random() > 0.4;
                let S = isP ? C + d : C - d;
                qStr = `${nm}以 ${money(C)} 購入${it}，其後以 ${money(S)} 售出。求盈利或虧蝕。`;
                let steps = [
                    `\\text{價錢的變化} = \\text{售價} - \\text{成本}`,
                    `\\text{價錢的變化} = ${S} - ${C}`,
                    `\\text{價錢的變化} = ${isP ? '+' : '-'}${d}`,
                    `\\therefore \\text{${isP ? '盈利' : '虧蝕'} } \\$${d}`
                ];
                options = makeOpts(lossProfit(d, isP), [
                    { s: lossProfit(d, !isP), m: msgPrc1 },
                    { s: lossProfit(S + C, isP), m: msgPrc1 },
                    { s: lossProfit(d + ri(1, 5) * 10, !isP), m: msgPrc1 }
                ], steps);

            } else if (type === 1) {
                // T2 求折扣金額：標價 − 售價
                let M = ri(10, 90) * 10, d = ri(1, 25) * 10, S = M - d;
                qStr = `${it}的標價是 ${money(M)}，現以 ${money(S)} 售出。求折扣。`;
                let steps = [
                    `\\text{折扣} = \\text{標價} - \\text{售價}`,
                    `\\text{折扣} = ${M} - ${S}`,
                    `\\text{折扣} = ${d}`
                ];
                options = makeOpts(money(d), [
                    { s: money(M + S), m: msgPrc1 },
                    { s: money(M), m: msgPrc5 },
                    { s: money(d + ri(1, 8) * 10), m: msgPrc1 }
                ], steps);

            } else if (type === 2) {
                // T3 求成本：售價 − 盈利（或 + 虧蝕）
                let isP = Math.random() > 0.4;
                let C = ri(8, 60) * 10, amt = ri(2, 20) * 10, S = isP ? C + amt : C - amt;
                qStr = `${nm}售出${it}並${isP ? '獲利' : '虧蝕'} ${money(amt)}，售價為 ${money(S)}。求成本。`;
                let steps = [
                    `\\text{成本} = \\text{售價} ${isP ? '-' : '+'} \\text{${isP ? '盈利' : '虧蝕'}}`,
                    `\\text{成本} = ${S} ${isP ? '-' : '+'} ${amt}`,
                    `\\text{成本} = ${C}`
                ];
                options = makeOpts(money(C), [
                    { s: money(isP ? S + amt : S - amt), m: msgPrc1 },
                    { s: money(S), m: msgPrc5 },
                    { s: money(amt), m: msgPrc5 }
                ], steps);

            } else if (type === 3) {
                // T4 求售價：成本 + 盈利（或 − 虧蝕）
                let isP = Math.random() > 0.4;
                let C = ri(8, 60) * 10, amt = ri(2, 20) * 10, S = isP ? C + amt : C - amt;
                qStr = `${nm}以 ${money(C)} 購入${it}，其後${isP ? '獲利' : '虧蝕'} ${money(amt)} 售出。求售價。`;
                let steps = [
                    `\\text{售價} = \\text{成本} ${isP ? '+' : '-'} \\text{${isP ? '盈利' : '虧蝕'}}`,
                    `\\text{售價} = ${C} ${isP ? '+' : '-'} ${amt}`,
                    `\\text{售價} = ${S}`
                ];
                options = makeOpts(money(S), [
                    { s: money(isP ? C - amt : C + amt), m: msgPrc1 },
                    { s: money(C), m: msgPrc5 },
                    { s: money(amt), m: msgPrc5 }
                ], steps);

            } else {
                // T5 求盈利金額（成本 × 盈利率）
                let C = ri(5, 40) * 100, r = pick([8, 12, 20, 24, 25, 40, 50, 76]);
                let profit = C * r / 100;
                qStr = `${nm}以 ${money(C)} 的成本製作${it}，並以 ${pct(r)} 的盈利百分率售出。求盈利。`;
                let steps = [
                    `\\text{盈利} = \\text{成本} \\times \\text{盈利百分率}`,
                    `\\text{盈利} = ${C} \\times ${r}\\%`,
                    `\\text{盈利} = ${profit}`
                ];
                options = makeOpts(money(profit), [
                    { s: money(C + profit), m: msgPrc5 },
                    { s: money(Math.round(C * r / 1000)), m: msgPrc4 },
                    { s: money(profit + ri(1, 5) * 10), m: msgPrc4 }
                ], steps);
            }

        // ════════════ 程度 2：兩步 ════════════
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";

            if (type === 0 || type === 1) {
                // T1 成本+盈利率 求售價；T2 成本+虧蝕率 求售價
                let isP = (type === 0);
                let C = ri(6, 40) * 100, r = pick([10, 15, 20, 25, 30, 40, 50]);
                let change = C * r / 100, S = isP ? C + change : C - change;
                qStr = `${nm}以 ${money(C)} 購入${it}，並以 ${pct(r)} 的${isP ? '盈利' : '虧蝕'}百分率售出。求售價。`;
                let steps = [
                    `\\text{${isP ? '盈利' : '虧蝕'}} = ${C} \\times ${r}\\% = ${change}`,
                    `\\text{售價} = \\text{成本} ${isP ? '+' : '-'} \\text{${isP ? '盈利' : '虧蝕'}}`,
                    `\\text{售價} = ${C} ${isP ? '+' : '-'} ${change} = ${S}`
                ];
                options = makeOpts(money(S), [
                    { s: money(isP ? C - change : C + change), m: msgPrc1 },
                    { s: money(C + change + (isP ? 0 : -2 * change)), m: msgPrc1 },
                    { s: money(change), m: msgPrc5 }
                ], steps);

            } else if (type === 2) {
                // T3 標價+折扣率 求售價
                let M = ri(6, 50) * 100, d = pick([10, 15, 20, 25, 30, 40]);
                let S = M * (100 - d) / 100;
                qStr = `${it}的標價是 ${money(M)}，現以 ${getDiscountText(d)}（即 ${pct(d)} 折扣）售出。求售價。`;
                let steps = [
                    `\\text{售價} = \\text{標價} \\times (1 - \\text{折扣百分率})`,
                    `\\text{售價} = ${M} \\times (1 - ${d}\\%)`,
                    `\\text{售價} = ${M} \\times ${(100 - d)}\\% = ${S}`
                ];
                options = makeOpts(money(S), [
                    { s: money(M * (100 + d) / 100), m: msgPrc1 },
                    { s: money(M - d), m: msgPrc4 },
                    { s: money(M * d / 100), m: msgPrc5 }
                ], steps);

            } else if (type === 3) {
                // T4 求盈利/虧蝕百分率
                let isP = Math.random() > 0.45;
                let C = ri(3, 40) * 100, r = pick([10, 15, 20, 25, 30, 40, 50]);
                let change = C * r / 100, S = isP ? C + change : C - change;
                qStr = `${nm}以 ${money(C)} 購入${it}，其後以 ${money(S)} 售出。求盈利或虧蝕百分率。`;
                let steps = [
                    `\\text{價錢的變化} = ${S} - ${C} = ${isP ? '+' : '-'}${change}`,
                    `\\text{${isP ? '盈利' : '虧蝕'}百分率} = \\frac{${change}}{${C}} \\times 100\\%`,
                    `\\text{${isP ? '盈利' : '虧蝕'}百分率} = ${r}\\%`
                ];
                options = makeOpts(`\\( \\text{${isP ? '盈利' : '虧蝕'} } ${r}\\% \\)`, [
                    { s: `\\( \\text{${!isP ? '盈利' : '虧蝕'} } ${r}\\% \\)`, m: msgPrc1 },
                    { s: `\\( \\text{${isP ? '盈利' : '虧蝕'} } ${Math.round(change / S * 100)}\\% \\)`, m: msgPrc2 },
                    { s: `\\( \\text{${isP ? '盈利' : '虧蝕'} } ${r + ri(2, 8)}\\% \\)`, m: msgPrc2 }
                ], steps);

            } else {
                // T5 求折扣百分率
                let M = ri(4, 50) * 100, d = pick([5, 10, 15, 20, 25, 30]);
                let S = M * (100 - d) / 100, disc = M - S;
                qStr = `${it}的標價是 ${money(M)}，現以 ${money(S)} 售出。求折扣百分率。`;
                let steps = [
                    `\\text{折扣} = ${M} - ${S} = ${disc}`,
                    `\\text{折扣百分率} = \\frac{${disc}}{${M}} \\times 100\\%`,
                    `\\text{折扣百分率} = ${d}\\%`
                ];
                options = makeOpts(pct(d), [
                    { s: pct(Math.round(disc / S * 100)), m: msgPrc2 },
                    { s: pct(100 - d), m: msgPrc5 },
                    { s: pct(d + ri(2, 8)), m: msgPrc2 }
                ], steps);
            }

        // ════════════ 程度 3：反推（2-4 步，DSE 入門） ════════════
        } else if (lvl === '3') {
            qObj.level = "⭐⭐⭐ 程度 3";

            if (type === 0 || type === 1) {
                // T1 售價÷(1+盈利%) 求成本；T2 售價÷(1−虧蝕%) 求成本
                let isP = (type === 0);
                let C = ri(3, 40) * 100, r = pick([10, 20, 25, 40, 50]);
                let S = isP ? C * (100 + r) / 100 : C * (100 - r) / 100;
                qStr = `${nm}以 ${money(S)} 售出${it}，${isP ? '盈利' : '虧蝕'}百分率為 ${pct(r)}。求成本。`;
                let factorPct = isP ? (100 + r) : (100 - r);
                let steps = [
                    `\\text{售價} = \\text{成本} \\times (1 ${isP ? '+' : '-'} ${r}\\%)`,
                    `${S} = \\text{成本} \\times ${factorPct}\\%`,
                    `\\text{成本} = ${S} \\div ${(factorPct / 100)}`,
                    `\\text{成本} = ${C}`
                ];
                options = makeOpts(money(C), [
                    { s: money(Math.round(isP ? S * (100 + r) / 100 : S * (100 - r) / 100)), m: msgPrc3 },
                    { s: money(S), m: msgPrc5 },
                    { s: money(isP ? S - r * 10 : S + r * 10), m: msgPrc4 }
                ], steps);

            } else if (type === 2) {
                // T3 售價÷(1−折扣%) 求標價
                let M = ri(5, 60) * 100, d = pick([10, 20, 25, 30, 35, 40]);
                let S = M * (100 - d) / 100;
                qStr = `${nm}購買${it}並以 ${pct(d)} 的折扣百分率購入，付出 ${money(S)}。求${it}的標價。`;
                let steps = [
                    `\\text{售價} = \\text{標價} \\times (1 - ${d}\\%)`,
                    `${S} = \\text{標價} \\times ${(100 - d)}\\%`,
                    `\\text{標價} = ${S} \\div ${((100 - d) / 100)}`,
                    `\\text{標價} = ${M}`
                ];
                options = makeOpts(money(M), [
                    { s: money(Math.round(S * (100 - d) / 100)), m: msgPrc3 },
                    { s: money(S + d), m: msgPrc4 },
                    { s: money(Math.round(S * (100 + d) / 100)), m: msgPrc3 }
                ], steps);

            } else if (type === 3) {
                // T4 盈利金額÷盈利率 求成本
                let C = ri(4, 50) * 100, r = pick([10, 16, 20, 25, 40]);
                let profit = C * r / 100;
                qStr = `售出${it}所得的盈利為 ${money(profit)}，盈利百分率是 ${pct(r)}。求${it}的成本。`;
                let steps = [
                    `\\text{盈利} = \\text{成本} \\times \\text{盈利百分率}`,
                    `${profit} = \\text{成本} \\times ${r}\\%`,
                    `\\text{成本} = ${profit} \\div ${(r / 100)}`,
                    `\\text{成本} = ${C}`
                ];
                options = makeOpts(money(C), [
                    { s: money(profit + C), m: msgPrc5 },
                    { s: money(Math.round(profit * r / 100)), m: msgPrc3 },
                    { s: money(profit), m: msgPrc5 }
                ], steps);

            } else {
                // T5 中文「折」求售價（含反推味道，2 步）
                let M = ri(3, 40) * 20, d = pick([10, 15, 20, 25, 30]);
                let S = M * (100 - d) / 100;
                qStr = `${it}的標價是 ${money(M)}。${nm}以${getDiscountText(d)}購買${it}。${nm}購買${it}的價錢是多少？`;
                let steps = [
                    `${getDiscountText(d)} \\Rightarrow \\text{售價} = \\text{標價} \\times ${(100 - d)}\\%`,
                    `\\text{售價} = ${M} \\times ${((100 - d) / 100)}`,
                    `\\text{售價} = ${S}`
                ];
                options = makeOpts(money(S), [
                    { s: money(M * d / 100), m: msgPrc5 },
                    { s: money(M - d), m: msgPrc4 },
                    { s: money(Math.round(M * (100 + d) / 100)), m: msgPrc1 }
                ], steps);
            }

        // ════════════ 程度 4：高中 / DSE 應用 ════════════
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4";

            if (type === 0) {
                // T1 連環交易：A 買入賺賣給 B，B 再賺/蝕賣出
                let C = ri(10, 50) * 100, p1 = ri(1, 4) * 10, p2 = ri(1, 3) * 10;
                let isP2 = Math.random() > 0.35;
                let sp1 = C * (100 + p1) / 100;
                let finalSP = sp1 * (isP2 ? (100 + p2) : (100 - p2)) / 100;
                qStr = `${names[0]}以 ${money(C)} 購入${it}，其後以獲利 ${pct(p1)} 售予${names[1]}。${names[1]}應以甚麼價錢出售才可${isP2 ? '獲利' : '虧蝕'} ${pct(p2)}？`;
                let steps = [
                    `\\text{${names[1]}的買入價} = ${C} \\times (1 + ${p1}\\%) = ${sp1}`,
                    `\\text{最終售價} = ${sp1} \\times (1 ${isP2 ? '+' : '-'} ${p2}\\%)`,
                    `\\text{最終售價} = ${finalSP}`
                ];
                options = makeOpts(money(finalSP), [
                    { s: money(Math.round(C * (100 + p1 + (isP2 ? p2 : -p2)) / 100)), m: msgPrc4 },
                    { s: money(Math.round(C * (100 + p1) * (isP2 ? (100 - p2) : (100 + p2)) / 10000)), m: msgPrc1 },
                    { s: money(sp1), m: msgPrc5 }
                ], steps);

            } else if (type === 1) {
                // T2 同售價一賺一蝕，求整體盈虧
                let conf = pick([{ p: 20, lcm: 24 }, { p: 25, lcm: 15 }, { p: 30, lcm: 91 }]);
                let S = conf.lcm * pick([10, 20, 50, 100]);
                let c1 = S / (1 + conf.p / 100), c2 = S / (1 - conf.p / 100);
                let loss = Math.round(c1 + c2 - 2 * S);
                qStr = `${nm}售出兩件貨品，每件售價均為 ${money(S)}，其中一件獲利 ${pct(conf.p)}，另一件則虧蝕 ${pct(conf.p)}。完成交易後，${nm}：`;
                let steps = [
                    `\\text{總售價} = ${S} \\times 2 = ${S * 2}`,
                    `\\text{總成本} = \\frac{${S}}{1 + ${conf.p}\\%} + \\frac{${S}}{1 - ${conf.p}\\%} \\approx ${Math.round(c1 + c2)}`,
                    `\\text{結果} = ${S * 2} - ${Math.round(c1 + c2)} \\approx -${loss}`,
                    `\\therefore \\text{虧蝕 } \\$${loss}`
                ];
                options = makeOpts(`\\( \\text{虧蝕 } \\$${loss} \\)`, [
                    { s: `\\( \\text{既無獲利，又無虧蝕} \\)`, m: msgPrc2 },
                    { s: `\\( \\text{獲利 } \\$${loss} \\)`, m: msgPrc1 },
                    { s: `\\( \\text{虧蝕 } \\$${Math.round(S * 2 * conf.p / 100)} \\)`, m: msgPrc2 }
                ], steps);

            } else if (type === 2) {
                // T3 標價較成本高 m%，打 d 折售出獲利 $P，求成本
                let sc = pick([
                    { m: 60, d: 25, rate: 20 }, { m: 50, d: 20, rate: 20 },
                    { m: 40, d: 10, rate: 26 }, { m: 75, d: 20, rate: 40 }, { m: 80, d: 25, rate: 35 }
                ]);
                let C = ri(3, 8) * 100, P = C * sc.rate / 100;
                qStr = `${it}的標價較其成本高 ${pct(sc.m)}。該${bare}以其標價${getDiscountText(sc.d)}售出並獲利 ${money(P)}。求成本。`;
                let factor = (100 + sc.m) * (100 - sc.d) / 10000;
                let steps = [
                    `\\text{設成本為 } x`,
                    `\\text{售價} = x \\times (1 + ${sc.m}\\%) \\times (1 - ${sc.d}\\%) = ${factor}x`,
                    `\\text{盈利} = ${factor}x - x = ${(sc.rate / 100)}x`,
                    `${(sc.rate / 100)}x = ${P}`,
                    `x = ${C}`
                ];
                options = makeOpts(money(C), [
                    { s: money(Math.round(P / ((sc.m - sc.d) / 100))), m: msgPrc4 },
                    { s: money(Math.round(C * (1 + sc.rate / 100))), m: msgPrc5 },
                    { s: money(C + ri(8, 16) * 10), m: msgPrc1 }
                ], steps);

            } else if (type === 3) {
                // T4 成本→標價(+m%)→折扣(d%)→求盈利率
                let sc = pick([
                    { m: 60, d: 25, rate: 20 }, { m: 50, d: 20, rate: 20 },
                    { m: 40, d: 10, rate: 26 }, { m: 75, d: 20, rate: 40 }, { m: 80, d: 25, rate: 35 }
                ]);
                qStr = `${it}的標價較其成本高 ${pct(sc.m)}。若該${bare}以其標價${getDiscountText(sc.d)}售出，求盈利百分率。`;
                let factor = (100 + sc.m) * (100 - sc.d) / 10000;
                let steps = [
                    `\\text{設成本為 } 100`,
                    `\\text{標價} = 100 \\times (1 + ${sc.m}\\%) = ${100 + sc.m}`,
                    `\\text{售價} = ${100 + sc.m} \\times (1 - ${sc.d}\\%) = ${factor * 100}`,
                    `\\text{盈利百分率} = \\frac{${factor * 100} - 100}{100} \\times 100\\% = ${sc.rate}\\%`
                ];
                options = makeOpts(pct(sc.rate), [
                    { s: pct(sc.m - sc.d), m: msgPrc4 },
                    { s: pct(Math.round((sc.m - sc.d) * 0.9)), m: msgPrc4 },
                    { s: pct(sc.rate + ri(3, 8)), m: msgPrc2 }
                ], steps);

            } else {
                // T5 損耗應用：買 N 件，壞 k 件，餘下賣出，求整體盈虧百分率
                let sc = pick([
                    { N: 30, c: 100, k: 4, s: 105 },  // 成本3000 收2730 → 虧9%
                    { N: 50, c: 60, k: 5, s: 80 },    // 成本3000 收3600 → 賺20%
                    { N: 25, c: 80, k: 5, s: 120 },   // 成本2000 收2400 → 賺20%
                    { N: 40, c: 50, k: 8, s: 90 }     // 成本2000 收2880 → 賺44%
                ]);
                let cost = sc.N * sc.c, rev = (sc.N - sc.k) * sc.s, diff = rev - cost;
                let isP = diff >= 0, r = Math.round(Math.abs(diff) / cost * 100);
                qStr = `${names[12]}以每件 ${money(sc.c)} 購入 ${sc.N} 件貨品。可惜有 ${sc.k} 件損壞而須丟棄。他把餘下的貨品以每件 ${money(sc.s)} 售出。求盈利或虧蝕百分率。`;
                let steps = [
                    `\\text{總成本} = ${sc.N} \\times ${sc.c} = ${cost}`,
                    `\\text{總售價} = (${sc.N} - ${sc.k}) \\times ${sc.s} = ${rev}`,
                    `\\text{${isP ? '盈利' : '虧蝕'}} = |${rev} - ${cost}| = ${Math.abs(diff)}`,
                    `\\text{${isP ? '盈利' : '虧蝕'}百分率} = \\frac{${Math.abs(diff)}}{${cost}} \\times 100\\% = ${r}\\%`
                ];
                options = makeOpts(`\\( \\text{${isP ? '盈利' : '虧蝕'} } ${r}\\% \\)`, [
                    { s: `\\( \\text{${!isP ? '盈利' : '虧蝕'} } ${r}\\% \\)`, m: msgPrc1 },
                    { s: `\\( \\text{${isP ? '盈利' : '虧蝕'} } ${Math.round(Math.abs(diff) / rev * 100)}\\% \\)`, m: msgPrc2 },
                    { s: `\\( \\text{${isP ? '盈利' : '虧蝕'} } ${Math.round(Math.abs(diff) / (sc.N * sc.s) * 100)}\\% \\)`, m: msgPrc2 }
                ], steps);
            }
        }

        qObj.options = options;
        qObj.question = `
        <div class="mb-4 text-base sm:text-lg text-slate-600">解答以下百分數應用題：</div>
        <div class="text-base sm:text-lg font-bold text-indigo-700 py-4 w-full leading-relaxed" style="line-height: 1.9; word-break: break-word; white-space: normal; overflow-wrap: break-word;">
            ${qStr}
        </div>`;

        bank.push(qObj);
    }
    return bank;
}
