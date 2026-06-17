// js/topics/measurement_error.js
// 量度的誤差（6.1 四捨五入/有效數字｜6.2 絕對誤差與最大絕對誤差｜6.3 相對誤差與百分誤差）
// 程度1 一步基礎｜程度2 兩步｜程度3 反推/百分誤差(2-4步)｜程度4 高中/DSE 範圍判斷

// ==========================================
// 錯誤提示訊息
// ==========================================
const msgMeRound = `<div class="text-red-600 font-bold text-lg mb-1">❗ 捨入錯誤</div><div class="text-sm text-slate-500 mb-2">四捨五入：看下一位數字 ≥5 進位，<5 捨去；留意捨入的位值。</div>`;
const msgMeHalf = `<div class="text-red-600 font-bold text-lg mb-1">❗ 忘記「最大絕對誤差 = ½ × 精確度」</div>`;
const msgMeBase = `<div class="text-red-600 font-bold text-lg mb-1">❗ 基準錯誤</div><div class="text-sm text-slate-500 mb-2">相對誤差 = 絕對誤差 ÷ 真確值 = 最大絕對誤差 ÷ 量度值；勿用錯分母。</div>`;
const msgMePct = `<div class="text-red-600 font-bold text-lg mb-1">❗ 百分誤差 = 相對誤差 × 100%</div>`;
const msgMeRange = `<div class="text-red-600 font-bold text-lg mb-1">❗ 真確值範圍錯誤</div><div class="text-sm text-slate-500 mb-2">下限 = 量度值 − 最大絕對誤差，上限 = 量度值 + 最大絕對誤差（下限 ≤ 真確值 < 上限）。</div>`;

// ─── 輔助 ───────────────────────────────
function _meFmt(x) {
    let r = Math.round(x * 1e6) / 1e6;
    return String(r);
}
function _meRoundSig(x, sf) {
    if (x === 0) return 0;
    let d = Math.ceil(Math.log10(Math.abs(x)));
    let p = sf - d, f = Math.pow(10, p);
    return Math.round(x * f) / f;
}
function _meAligned(eqs) {
    const lines = eqs.map(eq => {
        const m = eq.match(/^([\s\S]*?)\s*=\s*([\s\S]*)$/);
        return m ? `${m[1]} &= ${m[2]}` : `& ${eq}`;
    });
    return `\\[ \\begin{aligned} ${lines.join(' \\\\ ')} \\end{aligned} \\]`;
}
function _meSteps(eqs) {
    return `
    <details class="group my-2">
        <summary class="cursor-pointer text-indigo-500 hover:text-indigo-700 font-bold text-sm select-none flex items-center gap-1 outline-none ml-1">
            <svg class="w-5 h-5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            查看詳細步驟
        </summary>
        <div class="mt-2 pl-5 border-l-2 border-indigo-200 overflow-x-auto math-scroll">${_meAligned(eqs)}</div>
    </details>`;
}

// ==========================================
// 題目生成器：量度的誤差
// ==========================================
function generateMeasurementErrorQuestions(num, levelPref) {
    const bank = [];
    const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const units = [['長度', 'cm'], ['重量', 'g'], ['體積', 'mL'], ['容量', 'L'], ['時間', 's'], ['溫度', '°C']];
    const W = s => `\\( ${s} \\)`;
    const fmt = _meFmt;

    const typeCount = { '1': 5, '2': 5, '3': 5, '4': 5 };
    const typeCounter = {};

    function finalize(qObj, correct, wrongs, eqs) {
        const stepHtml = _meSteps(eqs);
        let opts = [{ text: correct, isCorrect: true, hint: wrapHint(msgCorrect, stepHtml) }];
        wrongs.forEach(w => opts.push({ text: w.s, isCorrect: false, hint: wrapHint(w.m, stepHtml) }));
        let seen = new Set(), uniq = [];
        for (const o of opts) { if (!seen.has(o.text) && !/NaN|Infinity|undefined/.test(o.text)) { seen.add(o.text); uniq.push(o); } }
        let bump = 1;
        while (uniq.length < 4) {
            let m = correct.match(/-?\d+(\.\d+)?/), t = m ? correct.replace(/-?\d+(\.\d+)?/, fmt(parseFloat(m[0]) + bump)) : `\\( ${bump} \\)`;
            if (!seen.has(t)) { seen.add(t); uniq.push({ text: t, isCorrect: false, hint: wrapHint(msgMeBase, stepHtml) }); }
            bump++;
        }
        qObj.options = shuffleArray(uniq).map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) }));
    }
    function ask(qObj, text) {
        qObj.question = `
        <div class="mb-4 text-base sm:text-lg text-slate-600">解答以下量度的誤差題目：</div>
        <div class="text-base sm:text-lg font-bold text-indigo-700 py-4 w-full leading-relaxed" style="line-height: 1.9; word-break: break-word; white-space: normal; overflow-wrap: break-word;">${text}</div>`;
    }

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref);
        if (levelPref === 'mixed') lvl = pick(['1', '2', '3', '4']);
        const TC = typeCount[lvl] || 5;
        typeCounter[lvl] = (typeCounter[lvl] || 0);
        const type = typeCounter[lvl] % TC;
        typeCounter[lvl]++;

        let qObj = { id: i + 1, topic: "量度的誤差" };

        // ════════════ 程度 1：一步基礎 ════════════
        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";

            if (type === 0) {
                // T1 四捨五入至指定位值
                let place = pick([{ v: 10, n: '十位' }, { v: 100, n: '百位' }, { v: 1000, n: '千位' }]);
                let N; do { N = ri(12, 99) * place.v + ri(1, place.v - 1); } while (N % place.v === 0);
                let ans = Math.round(N / place.v) * place.v;
                ask(qObj, `把 ${W(N)} 捨入至最接近的${place.n}。`);
                finalize(qObj, W(fmt(ans)), [
                    { s: W(fmt(Math.floor(N / place.v) * place.v)), m: msgMeRound },
                    { s: W(fmt(Math.ceil(N / place.v) * place.v)), m: msgMeRound },
                    { s: W(fmt(Math.round(N / (place.v * 10)) * place.v * 10)), m: msgMeRound }
                ], [`${N} \\approx ${ans} \\text{（捨入至${place.n}）}`]);

            } else if (type === 1) {
                // T2 捨入至指定有效數字
                let sf = pick([2, 3]);
                let N = ri(1000, 99999);
                let ans = _meRoundSig(N, sf);
                ask(qObj, `把 ${W(N)} 捨入至 ${W(sf)} 位有效數字。`);
                finalize(qObj, W(fmt(ans)), [
                    { s: W(fmt(_meRoundSig(N, sf + 1))), m: msgMeRound },
                    { s: W(fmt(_meRoundSig(N, sf - 1) || _meRoundSig(N, 1))), m: msgMeRound },
                    { s: W(fmt(Math.floor(ans / Math.pow(10, String(ans).length - sf)) * Math.pow(10, String(ans).length - sf))), m: msgMeRound }
                ], [`${N} \\approx ${ans} \\text{（${sf} 位有效數字）}`]);

            } else if (type === 2) {
                // T3 求絕對誤差
                let u = pick(units), M = ri(20, 90) * 10, e = ri(1, 9) * pick([1, 2]);
                let T = Math.random() > 0.5 ? M + e : M - e;
                ask(qObj, `某物的${u[0]}量度值為 ${W(M + '\\text{ ' + u[1] + '}')}，真確值為 ${W(T + '\\text{ ' + u[1] + '}')}。求絕對誤差。`);
                finalize(qObj, W(`${Math.abs(T - M)}\\text{ ${u[1]}}`), [
                    { s: W(`${M + T}\\text{ ${u[1]}}`), m: msgMeBase },
                    { s: W(`${Math.abs(T - M) + e}\\text{ ${u[1]}}`), m: msgMeBase },
                    { s: W(`${Math.round(Math.abs(T - M) / 2)}\\text{ ${u[1]}}`), m: msgMeHalf }
                ], [`\\text{絕對誤差} = |${T} - ${M}| = ${Math.abs(T - M)} \\text{ ${u[1]}}`]);

            } else if (type === 3) {
                // T4 求最大絕對誤差（已知精確度）
                let u = pick(units), prec = pick([0.1, 0.2, 0.5, 1, 2, 5]);
                let ans = prec / 2;
                ask(qObj, `某量度工具的精確度為 ${W(prec + '\\text{ ' + u[1] + '}')}。求使用該工具所得讀數的最大絕對誤差。`);
                finalize(qObj, W(`${fmt(ans)}\\text{ ${u[1]}}`), [
                    { s: W(`${fmt(prec)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(prec * 2)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(prec / 4)}\\text{ ${u[1]}}`), m: msgMeHalf }
                ], [`\\text{最大絕對誤差} = \\frac{1}{2} \\times ${prec} = ${fmt(ans)} \\text{ ${u[1]}}`]);

            } else {
                // T5 由「準確至最接近的 X」求最大絕對誤差
                let u = pick(units), prec = pick([1, 2, 5, 10, 0.1, 0.5]);
                let ans = prec / 2;
                ask(qObj, `某量度準確至最接近的 ${W(prec + '\\text{ ' + u[1] + '}')}。求最大絕對誤差。`);
                finalize(qObj, W(`${fmt(ans)}\\text{ ${u[1]}}`), [
                    { s: W(`${fmt(prec)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(prec * 2)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(prec / 4)}\\text{ ${u[1]}}`), m: msgMeHalf }
                ], [`\\text{最大絕對誤差} = \\frac{1}{2} \\times ${prec} = ${fmt(ans)} \\text{ ${u[1]}}`]);
            }

        // ════════════ 程度 2：兩步 ════════════
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";

            if (type === 0) {
                // T1 求真確值範圍
                let u = pick(units), prec = pick([2, 5, 10, 0.1, 0.2, 0.5]), M = ri(20, 80) * (prec >= 1 ? prec : 10);
                let me = prec / 2, lo = M - me, hi = M + me;
                ask(qObj, `某物的${u[0]}量得 ${W(M + '\\text{ ' + u[1] + '}')}（準確至最接近的 ${W(prec + '\\text{ ' + u[1] + '}')}）。求真確值的範圍。`);
                finalize(qObj, W(`${fmt(lo)} \\le \\text{真確值} < ${fmt(hi)}\\text{ ${u[1]}}`), [
                    { s: W(`${fmt(M - prec)} \\le \\text{真確值} < ${fmt(M + prec)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(hi)} \\le \\text{真確值} < ${fmt(lo)}\\text{ ${u[1]}}`), m: msgMeRange },
                    { s: W(`${fmt(lo)} \\le \\text{真確值} < ${fmt(M)}\\text{ ${u[1]}}`), m: msgMeRange }
                ], [
                    `\\text{最大絕對誤差} = \\frac{1}{2} \\times ${prec} = ${fmt(me)}`,
                    `\\text{下限} = ${M} - ${fmt(me)} = ${fmt(lo)}`,
                    `\\text{上限} = ${M} + ${fmt(me)} = ${fmt(hi)}`
                ]);

            } else if (type === 1) {
                // T2 由量度值 + 絕對誤差求真確值（兩個可能值）
                let u = pick(units), M = ri(20, 80), e = pick([1.5, 2, 2.5, 3, 4]);
                ask(qObj, `某物的${u[0]}量得 ${W(M + '\\text{ ' + u[1] + '}')}，絕對誤差為 ${W(e + '\\text{ ' + u[1] + '}')}。求可能的真確值。`);
                finalize(qObj, W(`${fmt(M - e)} \\text{ 或 } ${fmt(M + e)}\\text{ ${u[1]}}`), [
                    { s: W(`${fmt(M + e)}\\text{ ${u[1]}}`), m: msgMeRange },
                    { s: W(`${fmt(M - 2 * e)} \\text{ 或 } ${fmt(M + 2 * e)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(M)} \\text{ 或 } ${fmt(M + e)}\\text{ ${u[1]}}`), m: msgMeRange }
                ], [
                    `\\text{情況一：真確值} = ${M} - ${e} = ${fmt(M - e)}`,
                    `\\text{情況二：真確值} = ${M} + ${e} = ${fmt(M + e)}`
                ]);

            } else if (type === 2) {
                // T3 求相對誤差（絕對誤差 ÷ 真確值）
                let d = pick([{ T: 125, e: 10, r: 0.08 }, { T: 200, e: 8, r: 0.04 }, { T: 50, e: 1, r: 0.02 }, { T: 250, e: 5, r: 0.02 }, { T: 400, e: 6, r: 0.015 }]);
                let u = pick(units);
                ask(qObj, `某物的${u[0]}真確值為 ${W(d.T + '\\text{ ' + u[1] + '}')}，絕對誤差為 ${W(d.e + '\\text{ ' + u[1] + '}')}。求相對誤差。`);
                finalize(qObj, W(`${fmt(d.r)}`), [
                    { s: W(`${fmt(_meRoundSig(d.e / (d.T + d.e), 3))}`), m: msgMeBase },
                    { s: W(`${fmt(d.r * 100)}`), m: msgMePct },
                    { s: W(`${fmt(_meRoundSig(d.T / d.e, 3))}`), m: msgMeBase }
                ], [`\\text{相對誤差} = \\frac{${d.e}}{${d.T}} = ${fmt(d.r)}`]);

            } else if (type === 3) {
                // T4 求相對誤差（最大絕對誤差 ÷ 量度值）
                let d = pick([{ M: 50, m: 1, r: 0.02 }, { M: 80, m: 2, r: 0.025 }, { M: 200, m: 5, r: 0.025 }, { M: 125, m: 5, r: 0.04 }, { M: 250, m: 10, r: 0.04 }]);
                let u = pick(units);
                ask(qObj, `某物的${u[0]}量度值為 ${W(d.M + '\\text{ ' + u[1] + '}')}，最大絕對誤差為 ${W(d.m + '\\text{ ' + u[1] + '}')}。求相對誤差。`);
                finalize(qObj, W(`${fmt(d.r)}`), [
                    { s: W(`${fmt(d.r * 100)}`), m: msgMePct },
                    { s: W(`${fmt(_meRoundSig(d.M / d.m, 3))}`), m: msgMeBase },
                    { s: W(`${fmt(_meRoundSig(d.m / (d.M - d.m), 3))}`), m: msgMeBase }
                ], [`\\text{相對誤差} = \\frac{${d.m}}{${d.M}} = ${fmt(d.r)}`]);

            } else {
                // T5 求百分誤差（最大絕對誤差 ÷ 量度值 ×100%）
                let d = pick([{ M: 50, m: 1, p: 2 }, { M: 80, m: 2, p: 2.5 }, { M: 200, m: 5, p: 2.5 }, { M: 125, m: 5, p: 4 }, { M: 250, m: 10, p: 4 }]);
                let u = pick(units);
                ask(qObj, `某物的${u[0]}量度值為 ${W(d.M + '\\text{ ' + u[1] + '}')}，最大絕對誤差為 ${W(d.m + '\\text{ ' + u[1] + '}')}。求百分誤差。`);
                finalize(qObj, W(`${fmt(d.p)}\\%`), [
                    { s: W(`${fmt(d.p / 100)}\\%`), m: msgMePct },
                    { s: W(`${fmt(_meRoundSig(d.M / d.m, 3))}\\%`), m: msgMeBase },
                    { s: W(`${fmt(d.p * 2)}\\%`), m: msgMeHalf }
                ], [
                    `\\text{相對誤差} = \\frac{${d.m}}{${d.M}} = ${fmt(d.p / 100)}`,
                    `\\text{百分誤差} = ${fmt(d.p / 100)} \\times 100\\% = ${fmt(d.p)}\\%`
                ]);
            }

        // ════════════ 程度 3：反推 / 百分誤差（2-4 步） ════════════
        } else if (lvl === '3') {
            qObj.level = "⭐⭐⭐ 程度 3";

            if (type === 0) {
                // T1 求百分誤差（由精確度，3 sig fig）
                let u = pick(units), prec = pick([5, 10, 2, 0.1, 0.5]), M = ri(13, 95) * (prec >= 1 ? prec : 10) + ri(1, 9);
                let me = prec / 2, p = _meRoundSig(me / M * 100, 3);
                ask(qObj, `某物的${u[0]}量得 ${W(M + '\\text{ ' + u[1] + '}')}，所用工具的精確度為 ${W(prec + '\\text{ ' + u[1] + '}')}。求百分誤差（準確至三位有效數字）。`);
                finalize(qObj, W(`${fmt(p)}\\%`), [
                    { s: W(`${fmt(_meRoundSig(prec / M * 100, 3))}\\%`), m: msgMeHalf },
                    { s: W(`${fmt(_meRoundSig(me / M, 3))}\\%`), m: msgMePct },
                    { s: W(`${fmt(_meRoundSig(me / M * 100 * 2, 3))}\\%`), m: msgMeHalf }
                ], [
                    `\\text{最大絕對誤差} = \\frac{1}{2} \\times ${prec} = ${fmt(me)}`,
                    `\\text{百分誤差} = \\frac{${fmt(me)}}{${M}} \\times 100\\% = ${fmt(p)}\\%`
                ]);

            } else if (type === 1) {
                // T2 求百分誤差（由「準確至」，3 sig fig）
                let u = pick(units), prec = pick([1, 2, 0.1, 0.2]), M = ri(13, 95) + (prec < 1 ? ri(1, 9) / 10 : 0);
                let me = prec / 2, p = _meRoundSig(me / M * 100, 3);
                ask(qObj, `某物的${u[0]}量得 ${W(fmt(M) + '\\text{ ' + u[1] + '}')}（準確至最接近的 ${W(prec + '\\text{ ' + u[1] + '}')}）。求百分誤差（準確至三位有效數字）。`);
                finalize(qObj, W(`${fmt(p)}\\%`), [
                    { s: W(`${fmt(_meRoundSig(prec / M * 100, 3))}\\%`), m: msgMeHalf },
                    { s: W(`${fmt(_meRoundSig(me / M, 3))}\\%`), m: msgMePct },
                    { s: W(`${fmt(_meRoundSig(me / M * 100 + 0.5, 3))}\\%`), m: msgMeBase }
                ], [
                    `\\text{最大絕對誤差} = \\frac{1}{2} \\times ${prec} = ${fmt(me)}`,
                    `\\text{百分誤差} = \\frac{${fmt(me)}}{${fmt(M)}} \\times 100\\% = ${fmt(p)}\\%`
                ]);

            } else if (type === 2) {
                // T3 逆向：已知相對誤差求最大絕對誤差
                let u = pick(units), k = pick([26, 50, 25, 40, 20]), M = k * pick([3, 4, 5, 6]);
                let me = M / k;
                ask(qObj, `某物的${u[0]}量得 ${W(M + '\\text{ ' + u[1] + '}')}，相對誤差為 ${W('\\frac{1}{' + k + '}')}。求最大絕對誤差。`);
                finalize(qObj, W(`${fmt(me)}\\text{ ${u[1]}}`), [
                    { s: W(`${fmt(M * k)}\\text{ ${u[1]}}`), m: msgMeBase },
                    { s: W(`${fmt(k / M)}\\text{ ${u[1]}}`), m: msgMeBase },
                    { s: W(`${fmt(me * 2)}\\text{ ${u[1]}}`), m: msgMeHalf }
                ], [
                    `\\text{相對誤差} = \\frac{\\text{最大絕對誤差}}{\\text{量度值}}`,
                    `\\frac{1}{${k}} = \\frac{x}{${M}} \\implies x = ${fmt(me)} \\text{ ${u[1]}}`
                ]);

            } else if (type === 3) {
                // T4 逆向：已知百分誤差求最大絕對誤差 + 真確值範圍
                let u = pick(units), p = pick([0.05, 0.1, 0.2, 0.5, 0.25]), M = pick([200, 400, 500, 800, 1000]);
                let me = p / 100 * M, lo = M - me, hi = M + me;
                ask(qObj, `某物的${u[0]}量得 ${W(M + '\\text{ ' + u[1] + '}')}，百分誤差為 ${W(p + '\\%')}。求真確值的範圍。`);
                finalize(qObj, W(`${fmt(lo)} \\le \\text{真確值} < ${fmt(hi)}\\text{ ${u[1]}}`), [
                    { s: W(`${fmt(M - me * 2)} \\le \\text{真確值} < ${fmt(M + me * 2)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(hi)} \\le \\text{真確值} < ${fmt(lo)}\\text{ ${u[1]}}`), m: msgMeRange },
                    { s: W(`${fmt(M - p)} \\le \\text{真確值} < ${fmt(M + p)}\\text{ ${u[1]}}`), m: msgMePct }
                ], [
                    `\\text{最大絕對誤差} = ${p}\\% \\times ${M} = ${fmt(me)}`,
                    `\\text{下限} = ${M} - ${fmt(me)} = ${fmt(lo)}`,
                    `\\text{上限} = ${M} + ${fmt(me)} = ${fmt(hi)}`
                ]);

            } else {
                // T5 逆向：已知相對誤差求最大絕對誤差 + 真確值範圍
                let u = pick(units), k = pick([20, 25, 40, 50]), M = k * pick([4, 6, 8]);
                let me = M / k, lo = M - me, hi = M + me;
                ask(qObj, `某物的${u[0]}量得 ${W(M + '\\text{ ' + u[1] + '}')}，相對誤差為 ${W('\\frac{1}{' + k + '}')}。求真確值的範圍。`);
                finalize(qObj, W(`${fmt(lo)} \\le \\text{真確值} < ${fmt(hi)}\\text{ ${u[1]}}`), [
                    { s: W(`${fmt(M - me * 2)} \\le \\text{真確值} < ${fmt(M + me * 2)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(hi)} \\le \\text{真確值} < ${fmt(lo)}\\text{ ${u[1]}}`), m: msgMeRange },
                    { s: W(`${fmt(lo)} \\le \\text{真確值} < ${fmt(M)}\\text{ ${u[1]}}`), m: msgMeRange }
                ], [
                    `\\text{最大絕對誤差} = \\frac{1}{${k}} \\times ${M} = ${fmt(me)}`,
                    `\\text{下限} = ${M} - ${fmt(me)} = ${fmt(lo)}`,
                    `\\text{上限} = ${M} + ${fmt(me)} = ${fmt(hi)}`
                ]);
            }

        // ════════════ 程度 4：高中 / DSE 範圍判斷 ════════════
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4";

            if (type === 0) {
                // T1 讀數求百分誤差（磅/量器精確度）
                let u = pick(units), prec = pick([2, 5, 10, 20, 0.2]), M = prec * ri(8, 40);
                let me = prec / 2, p = _meRoundSig(me / M * 100, 3);
                ask(qObj, `某${u[0]}量度工具的精確度為 ${W(prec + '\\text{ ' + u[1] + '}')}，讀數為 ${W(M + '\\text{ ' + u[1] + '}')}。求百分誤差（準確至三位有效數字）。`);
                finalize(qObj, W(`${fmt(p)}\\%`), [
                    { s: W(`${fmt(_meRoundSig(prec / M * 100, 3))}\\%`), m: msgMeHalf },
                    { s: W(`${fmt(_meRoundSig(me / M, 3))}\\%`), m: msgMePct },
                    { s: W(`${fmt(_meRoundSig(me / M * 100 * 2, 3))}\\%`), m: msgMeHalf }
                ], [
                    `\\text{最大絕對誤差} = \\frac{1}{2} \\times ${prec} = ${fmt(me)}`,
                    `\\text{百分誤差} = \\frac{${fmt(me)}}{${M}} \\times 100\\% = ${fmt(p)}\\%`
                ]);

            } else if (type === 1) {
                // T2 由相對誤差求真確值介乎範圍
                let u = pick(units), k = pick([60, 50, 40, 30]), M = k * pick([2, 3, 5]);
                let me = M / k, lo = M - me, hi = M + me;
                ask(qObj, `某物的${u[0]}量得 ${W(M + '\\text{ ' + u[1] + '}')}，相對誤差為 ${W('\\frac{1}{' + k + '}')}。則真確值必定介乎甚麼範圍？`);
                finalize(qObj, W(`${fmt(lo)} \\text{ 與 } ${fmt(hi)} \\text{ ${u[1]} 之間}`), [
                    { s: W(`${fmt(M - me * 2)} \\text{ 與 } ${fmt(M + me * 2)} \\text{ ${u[1]} 之間}`), m: msgMeHalf },
                    { s: W(`${fmt(M - me / 2)} \\text{ 與 } ${fmt(M + me / 2)} \\text{ ${u[1]} 之間}`), m: msgMeRange },
                    { s: W(`${fmt(lo)} \\text{ 與 } ${fmt(M)} \\text{ ${u[1]} 之間}`), m: msgMeRange }
                ], [
                    `\\text{最大絕對誤差} = \\frac{1}{${k}} \\times ${M} = ${fmt(me)}`,
                    `\\text{真確值介乎 } ${fmt(lo)} \\text{ 與 } ${fmt(hi)}`
                ]);

            } else if (type === 2 || type === 3) {
                // T3 哪個可以是真確值 / T4 哪個不可以是真確值
                const askPossible = (type === 2);
                let u = pick(units), p = pick([0.4, 0.1, 0.2, 0.5]), M = pick([12.5, 50, 125, 250, 500]);
                let me = _meRoundSig(p / 100 * M, 4), lo = M - me, hi = M + me;
                const roman = ['I', 'II', 'III'];
                let inside = _meRoundSig(M + (Math.random() > 0.5 ? me * 0.4 : -me * 0.4), 5);
                let below = _meRoundSig(lo - me * 0.6, 5), above = _meRoundSig(hi + me * 0.6, 5);
                let cands, correctIdx;
                if (askPossible) {
                    // 只有一個在範圍內
                    cands = shuffleArray([{ v: inside, in: true }, { v: below, in: false }, { v: above, in: false }]);
                    correctIdx = cands.findIndex(c => c.in);
                } else {
                    // 只有一個不在範圍內
                    let inside2 = _meRoundSig(M - (inside - M), 5);
                    cands = shuffleArray([{ v: inside, in: true }, { v: inside2, in: true }, { v: pick([below, above]), in: false }]);
                    correctIdx = cands.findIndex(c => !c.in);
                }
                let listHtml = cands.map((c, idx) => `${roman[idx]}. ${W(fmt(c.v) + '\\text{ ' + u[1] + '}')}`).join('<br>');
                ask(qObj, `某物的${u[0]}量得 ${W(M + '\\text{ ' + u[1] + '}')}，百分誤差為 ${W(p + '\\%')}。下列何者<b>${askPossible ? '可以' : '不可以'}</b>是該物的真確${u[0]}？<br>${listHtml}`);
                let correctRoman = roman[correctIdx];
                let wrongRomans = roman.filter(r => r !== correctRoman);
                finalize(qObj, `只有 ${correctRoman}`, [
                    { s: `只有 ${wrongRomans[0]}`, m: msgMeRange },
                    { s: `只有 ${wrongRomans[1]}`, m: msgMeRange },
                    { s: `I、II 及 III`, m: msgMeRange }
                ], [
                    `\\text{最大絕對誤差} = ${p}\\% \\times ${M} = ${fmt(me)}`,
                    `\\text{真確值範圍：} ${fmt(lo)} \\le \\text{真確值} < ${fmt(hi)}`
                ]);

            } else {
                // T5 求最小可能值
                let u = pick(units), p = pick([0.25, 0.1, 0.2, 0.5]), M = pick([2.00, 5.00, 4.00, 8.00, 10.00]);
                let me = _meRoundSig(p / 100 * M, 4), lo = _meRoundSig(M - me, 5);
                ask(qObj, `某物的${u[0]}量得 ${W(fmt(M) + '\\text{ ' + u[1] + '}')}，百分誤差為 ${W(p + '\\%')}。求該物的最小可能${u[0]}。`);
                finalize(qObj, W(`${fmt(lo)}\\text{ ${u[1]}}`), [
                    { s: W(`${fmt(M + me)}\\text{ ${u[1]}}`), m: msgMeRange },
                    { s: W(`${fmt(M - me * 2)}\\text{ ${u[1]}}`), m: msgMeHalf },
                    { s: W(`${fmt(M - p)}\\text{ ${u[1]}}`), m: msgMePct }
                ], [
                    `\\text{最大絕對誤差} = ${p}\\% \\times ${fmt(M)} = ${fmt(me)}`,
                    `\\text{最小可能值} = ${fmt(M)} - ${fmt(me)} = ${fmt(lo)}`
                ]);
            }
        }

        bank.push(qObj);
    }
    return bank;
}
