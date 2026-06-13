// js/topics/change_of_subject.js

// ==========================================
// 主項轉換專用錯誤提示訊息
// ==========================================
const msgSubj1 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 移項時忘記變號或正負號錯誤</div>`;
const msgSubj2 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 交叉相乘或合併同類項時出錯</div>`;
const msgSubj3 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 提取公因式或展開時發生錯誤</div>`;
const msgSubj4 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 分母處理錯誤：通分母或倒數時出錯</div>`;
const msgSubj5 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 主項出現多次時，未有正確提取公因式</div>`;

// 🌟 將多個方程式步驟合併為單一 aligned 區塊（自動於第一個 = 對齊）
function _subjAligned(eqs) {
    const lines = eqs.map(eq => {
        const m = eq.match(/^([\s\S]*?)\s*=\s*([\s\S]*)$/);
        return m ? `${m[1]} &= ${m[2]}` : eq;
    });
    return `\\begin{aligned} ${lines.join(' \\\\ ')} \\end{aligned}`;
}

// ─── 格式化輔助函數 ───────────────────────
// 係數 × 變數 (處理 ±1)
function _subjCv(c, v) {
    if (c === 1) return v;
    if (c === -1) return "-" + v;
    return c + v;
}
// 線性式：c·v + k （主項在前）
function _subjLin(c, k, v) {
    let s = "";
    if (c !== 0) s = _subjCv(c, v);
    if (k > 0) s += (s ? " + " : "") + k;
    else if (k < 0) s += (s ? " - " : "-") + Math.abs(k);
    return s === "" ? "0" : s;
}
// 線性式：k + c·v （常數在前，方便分母如 "5 - 3x"）
function _subjLinCF(k, c, v) {
    let s = "" + k;
    if (c > 0) s += " + " + _subjCv(c, v);
    else if (c < 0) s += " - " + _subjCv(Math.abs(c), v);
    return s;
}
// 二次數式：a·v^2 + b·v
function _subjQuad(a, b, v) {
    let s = (a === 1 ? `${v}^2` : a === -1 ? `-${v}^2` : `${a}${v}^2`);
    if (b > 0) s += " + " + _subjCv(b, v);
    else if (b < 0) s += " - " + _subjCv(Math.abs(b), v);
    return s;
}
// 分數（整數分母）：分母為 1 時直接回傳分子
function _subjFrac(numStr, den) {
    if (den === 1) return numStr;
    if (den === -1) return `-(${numStr})`;
    return `\\frac{${numStr}}{${den}}`;
}
// 約簡「線性分子 / 整數分母」：回傳 [coefV, cons, den]（分母恆正）
function _subjReduce(coefV, cons, den) {
    let g = gcd(gcd(Math.abs(coefV), Math.abs(cons)), Math.abs(den));
    if (g > 1) { coefV /= g; cons /= g; den /= g; }
    if (den < 0) { coefV = -coefV; cons = -cons; den = -den; }
    return [coefV, cons, den];
}

// ==========================================
// 題目生成器：主項轉換 (Change of Subject)
// 難度已整體上調：每個程度提供 5 款題型
// ==========================================
function generateSubjectQuestions(num, levelPref) {
    const bank = [];
    const varPairs = [['x', 'y'], ['m', 'n'], ['a', 'b'], ['u', 'v'], ['c', 'd'], ['p', 'q']];
    const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    // 由 correctStr + 3 個干擾項 + 提示訊息 組裝選項
    function makeOpts(correctStr, wrongs, steps) {
        const opts = [{
            text: `\\( \\displaystyle ${correctStr} \\)`,
            isCorrect: true,
            hint: wrapHint(msgCorrect, buildEq(steps))
        }];
        wrongs.forEach(w => opts.push({
            text: `\\( \\displaystyle ${w.s} \\)`,
            isCorrect: false,
            hint: wrapHint(w.msg || msgSubj1, buildEq(steps))
        }));
        return opts;
    }

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref);
        if (levelPref === 'mixed') lvl = ['1', '2', '3'][Math.floor(Math.random() * 3)];

        let qObj = { id: i + 1, topic: "主項轉換 (Change of Subject)" };

        let pair = varPairs[Math.floor(Math.random() * varPairs.length)];
        let t, o;
        if (Math.random() > 0.5) { t = pair[0]; o = pair[1]; }
        else { t = pair[1]; o = pair[0]; }

        let questionMathStr = "", correctStr = "", steps = [], options = [];

        // ════════════════════════════════════════
        // 程度 1（已升級：交叉相乘 / 分式 / 兩邊主項）
        // ════════════════════════════════════════
        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";
            const type = ri(0, 4);

            if (type === 0) {
                // T1：(t + A)/B = (o + C)/D  交叉相乘
                let A = ri(2, 8), B = ri(2, 6), C = ri(2, 8), D = ri(2, 6);
                questionMathStr = `\\text{若 } \\frac{${t} + ${A}}{${B}} = \\frac{${o} + ${C}}{${D}} \\text{ ，則 } ${t} =`;
                let kConst = B * C - D * A;            // Dt = Bo + (BC - DA)
                let [cv, cc, cd] = _subjReduce(B, kConst, D);
                correctStr = _subjFrac(_subjLin(cv, cc, o), cd);
                steps.push({ text: _subjAligned([
                    `\\frac{${t} + ${A}}{${B}} = \\frac{${o} + ${C}}{${D}}`,
                    `${D}(${t} + ${A}) = ${B}(${o} + ${C})`,
                    `${_subjCv(D, t)} + ${D * A} = ${_subjCv(B, o)} + ${B * C}`,
                    `${_subjCv(D, t)} = ${_subjLin(B, kConst, o)}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                let [w1a, w1b, w1c] = _subjReduce(B, -kConst, D);
                let [w2a, w2b, w2c] = _subjReduce(D, D * A - B * C, B);
                options = makeOpts(correctStr, [
                    { s: _subjFrac(_subjLin(w1a, w1b, o), w1c), msg: msgSubj1 },
                    { s: _subjFrac(_subjLin(w2a, w2b, o), w2c), msg: msgSubj2 },
                    { s: _subjFrac(_subjLin(B, B * C + D * A, o), D), msg: msgSubj1 }
                ], steps);

            } else if (type === 1) {
                // T2：At + B = C(t - Do)  兩邊有主項 → 提公因式
                let A, C; do { A = ri(3, 8); C = ri(2, 6); } while (A === C);
                let B = ri(2, 8), D = ri(2, 6);
                questionMathStr = `\\text{若 } ${_subjCv(A, t)} + ${B} = ${C}(${t} - ${_subjCv(D, o)}) \\text{ ，則 } ${t} =`;
                // (A - C)t = -CD·o - B
                let denom = A - C, coO = -C * D, con = -B;
                let [cv, cc, cd] = _subjReduce(coO, con, denom);
                correctStr = _subjFrac(_subjLin(cv, cc, o), cd);
                steps.push({ text: _subjAligned([
                    `${_subjCv(A, t)} + ${B} = ${C}(${t} - ${_subjCv(D, o)})`,
                    `${_subjCv(A, t)} + ${B} = ${_subjCv(C, t)} - ${_subjCv(C * D, o)}`,
                    `${_subjCv(A, t)} - ${_subjCv(C, t)} = ${_subjLin(-C * D, -B, o)}`,
                    `${_subjCv(A - C, t)} = ${_subjLin(-C * D, -B, o)}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                let [w1a, w1b, w1c] = _subjReduce(-coO, con, denom);
                let [w2a, w2b, w2c] = _subjReduce(coO, -con, denom);
                options = makeOpts(correctStr, [
                    { s: _subjFrac(_subjLin(w1a, w1b, o), w1c), msg: msgSubj1 },
                    { s: _subjFrac(_subjLin(w2a, w2b, o), w2c), msg: msgSubj1 },
                    { s: _subjFrac(_subjLin(C * D, -B, o), A + C), msg: msgSubj5 }
                ], steps);

            } else if (type === 2) {
                // T3：(At + Bo)/C = D  清分母
                let A = ri(2, 7), B = ri(2, 7), C = ri(2, 6), D = ri(2, 8);
                questionMathStr = `\\text{若 } \\frac{${_subjCv(A, t)} + ${_subjCv(B, o)}}{${C}} = ${D} \\text{ ，則 } ${t} =`;
                let [cv, cc, cd] = _subjReduce(-B, C * D, A);
                correctStr = _subjFrac(_subjLinCF(cc, cv, o), cd);
                steps.push({ text: _subjAligned([
                    `\\frac{${_subjCv(A, t)} + ${_subjCv(B, o)}}{${C}} = ${D}`,
                    `${_subjCv(A, t)} + ${_subjCv(B, o)} = ${C * D}`,
                    `${_subjCv(A, t)} = ${_subjLinCF(C * D, -B, o)}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                let [w1a, w1b, w1c] = _subjReduce(B, C * D, A);
                let [w2a, w2b, w2c] = _subjReduce(-B, D, A);
                options = makeOpts(correctStr, [
                    { s: _subjFrac(_subjLinCF(w1b, w1a, o), w1c), msg: msgSubj1 },
                    { s: _subjFrac(_subjLinCF(w2b, w2a, o), w2c), msg: msgSubj4 },
                    { s: _subjFrac(_subjLinCF(C * D, -B, o), B), msg: msgSubj2 }
                ], steps);

            } else if (type === 3) {
                // T4：o = At/B + C  分數係數
                let A, B; do { A = ri(2, 6); B = ri(2, 6); } while (A === B);
                let C = ri(2, 8);
                questionMathStr = `\\text{若 } ${o} = \\frac{${_subjCv(A, t)}}{${B}} + ${C} \\text{ ，則 } ${t} =`;
                // t = B(o - C)/A = (Bo - BC)/A
                let [cv, cc, cd] = _subjReduce(B, -B * C, A);
                correctStr = _subjFrac(_subjLin(cv, cc, o), cd);
                steps.push({ text: _subjAligned([
                    `${o} = \\frac{${_subjCv(A, t)}}{${B}} + ${C}`,
                    `${o} - ${C} = \\frac{${_subjCv(A, t)}}{${B}}`,
                    `${B}(${o} - ${C}) = ${_subjCv(A, t)}`,
                    `${_subjLin(B, -B * C, o)} = ${_subjCv(A, t)}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                let [w1a, w1b, w1c] = _subjReduce(B, B * C, A);
                options = makeOpts(correctStr, [
                    { s: _subjFrac(_subjLin(w1a, w1b, o), w1c), msg: msgSubj1 },
                    { s: _subjFrac(_subjLin(1, -C, o), A), msg: msgSubj4 },
                    { s: _subjFrac(_subjLin(B, -B * C, o), B), msg: msgSubj2 }
                ], steps);

            } else {
                // T5：(Ao + B)/t = C  主項在分母
                let A = ri(2, 7), B = ri(2, 8), C = ri(2, 6);
                questionMathStr = `\\text{若 } \\frac{${_subjCv(A, o)} + ${B}}{${t}} = ${C} \\text{ ，則 } ${t} =`;
                correctStr = _subjFrac(_subjLin(A, B, o), C);
                steps.push({ text: _subjAligned([
                    `\\frac{${_subjCv(A, o)} + ${B}}{${t}} = ${C}`,
                    `${_subjCv(A, o)} + ${B} = ${_subjCv(C, t)}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: _subjFrac(_subjLin(A, -B, o), C), msg: msgSubj1 },
                    { s: _subjFrac(_subjCv(C, o), 1) + ` - ${B}`, msg: msgSubj4 },
                    { s: _subjFrac(_subjLin(A, B, o), A), msg: msgSubj2 }
                ], steps);
            }

        // ════════════════════════════════════════
        // 程度 2（已升級：分母含主項 / 1/x + 1/y / 兩邊主項分式）
        // ════════════════════════════════════════
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";
            const type = ri(0, 4);

            if (type === 0) {
                // T1：o = A - B/(t + C)
                let A = ri(2, 6), B = ri(3, 9), C = ri(2, 6);
                questionMathStr = `\\text{若 } ${o} = ${A} - \\frac{${B}}{${t} + ${C}} \\text{ ，則 } ${t} =`;
                // t = B/(A - o) - C = (B - C(A - o))/(A - o) = (Co + (B - CA))/(A - o)
                let numCoef = C, numCons = B - C * A;
                correctStr = `\\frac{${_subjLin(numCoef, numCons, o)}}{${_subjLinCF(A, -1, o)}}`;
                steps.push({ text: _subjAligned([
                    `${o} = ${A} - \\frac{${B}}{${t} + ${C}}`,
                    `\\frac{${B}}{${t} + ${C}} = ${_subjLinCF(A, -1, o)}`,
                    `${t} + ${C} = \\frac{${B}}{${_subjLinCF(A, -1, o)}}`,
                    `${t} = \\frac{${B}}{${_subjLinCF(A, -1, o)}} - ${C}`,
                    `${t} = \\frac{${B} - ${C}(${_subjLinCF(A, -1, o)})}{${_subjLinCF(A, -1, o)}}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: `\\frac{${_subjLin(numCoef, numCons + 2 * B, o)}}{${_subjLinCF(A, -1, o)}}`, msg: msgSubj2 },
                    { s: `\\frac{${_subjLin(numCoef, numCons, o)}}{${_subjLinCF(A, 1, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjLin(-numCoef, numCons, o)}}{${_subjLinCF(A, -1, o)}}`, msg: msgSubj1 }
                ], steps);

            } else if (type === 1) {
                // T2：Ao + B/t = C  主項在分母（單分式）
                let A = ri(2, 6), B = ri(3, 9), C; do { C = ri(4, 14); } while (C === A);
                questionMathStr = `\\text{若 } ${_subjCv(A, o)} + \\frac{${B}}{${t}} = ${C} \\text{ ，則 } ${t} =`;
                correctStr = `\\frac{${B}}{${_subjLinCF(C, -A, o)}}`;
                steps.push({ text: _subjAligned([
                    `${_subjCv(A, o)} + \\frac{${B}}{${t}} = ${C}`,
                    `\\frac{${B}}{${t}} = ${_subjLinCF(C, -A, o)}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: `\\frac{${B}}{${_subjLinCF(-C, A, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${B}}{${_subjLinCF(C, A, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjLinCF(C, -A, o)}}{${B}}`, msg: msgSubj4 }
                ], steps);

            } else if (type === 2) {
                // T3：A/t + B/o = C  → t = Ao/(Co - B)
                let A = ri(2, 8), B = ri(2, 8), C = ri(2, 6);
                questionMathStr = `\\text{若 } \\frac{${A}}{${t}} + \\frac{${B}}{${o}} = ${C} \\text{ ，則 } ${t} =`;
                correctStr = `\\frac{${_subjCv(A, o)}}{${_subjLin(C, -B, o)}}`;
                steps.push({ text: _subjAligned([
                    `\\frac{${A}}{${t}} + \\frac{${B}}{${o}} = ${C}`,
                    `\\frac{${A}}{${t}} = ${C} - \\frac{${B}}{${o}}`,
                    `\\frac{${A}}{${t}} = \\frac{${_subjLin(C, -B, o)}}{${o}}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: `\\frac{${_subjCv(A, o)}}{${_subjLin(C, B, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjLin(C, -B, o)}}{${_subjCv(A, o)}}`, msg: msgSubj4 },
                    { s: `\\frac{${A}}{${_subjLin(C, -B, o)}}`, msg: msgSubj2 }
                ], steps);

            } else if (type === 3) {
                // T4：(At + B)/(t + Co) = D  → 兩邊有主項（含另一變數）
                let A, D; do { A = ri(3, 8); D = ri(2, 6); } while (A === D);
                let B = ri(2, 8), C = ri(2, 6);
                questionMathStr = `\\text{若 } \\frac{${_subjCv(A, t)} + ${B}}{${t} + ${_subjCv(C, o)}} = ${D} \\text{ ，則 } ${t} =`;
                // t(A - D) = DC·o - B
                let [cv, cc, cd] = _subjReduce(D * C, -B, A - D);
                correctStr = _subjFrac(_subjLin(cv, cc, o), cd);
                steps.push({ text: _subjAligned([
                    `\\frac{${_subjCv(A, t)} + ${B}}{${t} + ${_subjCv(C, o)}} = ${D}`,
                    `${_subjCv(A, t)} + ${B} = ${D}(${t} + ${_subjCv(C, o)})`,
                    `${_subjCv(A, t)} + ${B} = ${_subjCv(D, t)} + ${_subjCv(D * C, o)}`,
                    `${_subjCv(A, t)} - ${_subjCv(D, t)} = ${_subjLin(D * C, -B, o)}`,
                    `${_subjCv(A - D, t)} = ${_subjLin(D * C, -B, o)}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                let [e1, e2, e3] = _subjReduce(D * C, B, A - D);
                let [f1, f2, f3] = _subjReduce(-D * C, -B, A - D);
                options = makeOpts(correctStr, [
                    { s: _subjFrac(_subjLin(e1, e2, o), e3), msg: msgSubj1 },
                    { s: _subjFrac(_subjLin(f1, f2, o), f3), msg: msgSubj1 },
                    { s: _subjFrac(_subjLin(D * C, -B, o), A + D), msg: msgSubj5 }
                ], steps);

            } else {
                // T5：o = At/(B - t)  → 主項同時在分子與分母
                let A = ri(2, 7), B = ri(3, 9);
                questionMathStr = `\\text{若 } ${o} = \\frac{${_subjCv(A, t)}}{${B} - ${t}} \\text{ ，則 } ${t} =`;
                // o(B - t) = At → oB = t(A + o) → t = Bo/(A + o)
                correctStr = `\\frac{${_subjCv(B, o)}}{${_subjLinCF(A, 1, o)}}`;
                steps.push({ text: _subjAligned([
                    `${o} = \\frac{${_subjCv(A, t)}}{${B} - ${t}}`,
                    `${o}(${B} - ${t}) = ${_subjCv(A, t)}`,
                    `${_subjCv(B, o)} - ${o}${t} = ${_subjCv(A, t)}`,
                    `${_subjCv(B, o)} = ${_subjCv(A, t)} + ${o}${t}`,
                    `${_subjCv(B, o)} = ${t}(${A} + ${o})`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: `\\frac{${_subjCv(B, o)}}{${_subjLinCF(A, -1, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjCv(B, o)}}{${_subjLinCF(-A, 1, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjLinCF(A, 1, o)}}{${_subjCv(B, o)}}`, msg: msgSubj4 }
                ], steps);
            }

        // ════════════════════════════════════════
        // 程度 3（最高階：主項多次出現 / 多重分式 / 二次）
        // ════════════════════════════════════════
        } else {
            qObj.level = "⭐⭐⭐ 程度 3";
            const type = ri(0, 4);

            if (type === 0) {
                // T1：(At + 1)(o - B) = Co(Et - 1)
                let A, B, C, E; do {
                    A = ri(2, 5); B = ri(2, 5); C = ri(2, 5); E = ri(2, 5);
                } while (A === C * E);
                questionMathStr = `\\text{若 } (${_subjCv(A, t)} + 1)(${o} - ${B}) = ${_subjCv(C, o)}(${_subjCv(E, t)} - 1) \\text{ ，則 } ${t} =`;
                let numCoef = -(C + 1), numCons = B, denCoef = A - C * E, denCons = -A * B;
                if (denCoef < 0) { numCoef = -numCoef; numCons = -numCons; denCoef = -denCoef; denCons = -denCons; }
                let gAll = gcd(gcd(Math.abs(numCoef), Math.abs(numCons)), gcd(Math.abs(denCoef), Math.abs(denCons)));
                if (gAll > 1) { numCoef /= gAll; numCons /= gAll; denCoef /= gAll; denCons /= gAll; }
                correctStr = `\\frac{${_subjLin(numCoef, numCons, o)}}{${_subjLin(denCoef, denCons, o)}}`;
                let rawCorrect = `\\frac{${_subjLin(-(C + 1), B, o)}}{${_subjLin(A - C * E, -A * B, o)}}`;
                let eqs3 = [
                    `(${_subjCv(A, t)} + 1)(${o} - ${B}) = ${_subjCv(C, o)}(${_subjCv(E, t)} - 1)`,
                    `${A}${t}${o} - ${_subjCv(A * B, t)} + ${o} - ${B} = ${C * E}${t}${o} - ${_subjCv(C, o)}`,
                    `${A}${t}${o} - ${C * E}${t}${o} - ${_subjCv(A * B, t)} = ${_subjLin(-(C + 1), B, o)}`,
                    `${_subjCv(A - C * E, "")}${t}${o} - ${_subjCv(A * B, t)} = ${_subjLin(-(C + 1), B, o)}`,
                    `${t}(${_subjLin(A - C * E, -A * B, o)}) = ${_subjLin(-(C + 1), B, o)}`,
                    `${t} = ${rawCorrect}`
                ];
                if (rawCorrect !== correctStr) eqs3.push(`${t} = ${correctStr}`);
                steps.push({ text: _subjAligned(eqs3), hide: false });
                options = makeOpts(correctStr, [
                    { s: `\\frac{${_subjLin(numCoef, numCons, o)}}{${_subjLin(denCoef, Math.abs(denCons), o)}}`, msg: msgSubj2 },
                    { s: `\\frac{${_subjLin(Math.abs(numCoef), numCons, o)}}{${_subjLin(denCoef, denCons, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjLin(-numCoef, numCons, o)}}{${_subjLin(denCoef, denCons, o)}}`, msg: msgSubj3 }
                ], steps);

            } else if (type === 1) {
                // T2：o(o - At) = B(o + t)  → 二次分子
                let A = ri(2, 6), B = ri(2, 7);
                questionMathStr = `\\text{若 } ${o}(${o} - ${_subjCv(A, t)}) = ${B}(${o} + ${t}) \\text{ ，則 } ${t} =`;
                // o^2 - Aot = Bo + Bt → o^2 - Bo = t(Ao + B) → t = (o^2 - Bo)/(Ao + B)
                correctStr = `\\frac{${_subjQuad(1, -B, o)}}{${_subjLin(A, B, o)}}`;
                steps.push({ text: _subjAligned([
                    `${o}(${o} - ${_subjCv(A, t)}) = ${B}(${o} + ${t})`,
                    `${o}^2 - ${_subjCv(A, o)}${t} = ${_subjCv(B, o)} + ${_subjCv(B, t)}`,
                    `${o}^2 - ${_subjCv(B, o)} = ${_subjCv(A, o)}${t} + ${_subjCv(B, t)}`,
                    `${_subjQuad(1, -B, o)} = ${t}(${_subjLin(A, B, o)})`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: `\\frac{${_subjQuad(1, B, o)}}{${_subjLin(A, B, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjQuad(1, -B, o)}}{${_subjLin(A, -B, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjLin(A, B, o)}}{${_subjQuad(1, -B, o)}}`, msg: msgSubj4 }
                ], steps);

            } else if (type === 2) {
                // T3：(At + Bo)/(Ct + Do) = E/F  → 交叉相乘、主項兩邊
                let A, B, C, D, E, F;
                do {
                    A = ri(2, 5); B = ri(2, 5); C = ri(2, 5); D = ri(2, 5); E = ri(2, 5); F = ri(2, 5);
                } while (F * A === E * C);
                questionMathStr = `\\text{若 } \\frac{${_subjCv(A, t)} + ${_subjCv(B, o)}}{${_subjCv(C, t)} + ${_subjCv(D, o)}} = \\frac{${E}}{${F}} \\text{ ，則 } ${t} =`;
                // (FA - EC)t = (ED - FB)o
                let denCoef = F * A - E * C, numCoef = E * D - F * B;
                let g = gcd(Math.abs(numCoef), Math.abs(denCoef)) || 1;
                let nC = numCoef / g, dC = denCoef / g;
                if (dC < 0) { nC = -nC; dC = -dC; }
                correctStr = _subjFrac(_subjCv(nC, o), dC);
                steps.push({ text: _subjAligned([
                    `\\frac{${_subjCv(A, t)} + ${_subjCv(B, o)}}{${_subjCv(C, t)} + ${_subjCv(D, o)}} = \\frac{${E}}{${F}}`,
                    `${F}(${_subjCv(A, t)} + ${_subjCv(B, o)}) = ${E}(${_subjCv(C, t)} + ${_subjCv(D, o)})`,
                    `${_subjCv(F * A, t)} + ${_subjCv(F * B, o)} = ${_subjCv(E * C, t)} + ${_subjCv(E * D, o)}`,
                    `${_subjCv(F * A, t)} - ${_subjCv(E * C, t)} = ${_subjLin(E * D, 0, o)} - ${_subjCv(F * B, o)}`,
                    `${_subjCv(F * A - E * C, t)} = ${_subjCv(E * D - F * B, o)}`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: _subjFrac(_subjCv(-nC, o), dC), msg: msgSubj1 },
                    { s: _subjFrac(_subjCv(E * D - F * B, o), F * A + E * C), msg: msgSubj5 },
                    { s: _subjFrac(_subjCv(dC, o), Math.abs(nC) || 1), msg: msgSubj4 }
                ], steps);

            } else if (type === 3) {
                // T4：o = At/(Bt + Co)  → 主項在分子與分母 + 二次
                let A, B, C; do { A = ri(2, 7); B = ri(2, 6); C = ri(2, 6); } while (A === 0);
                questionMathStr = `\\text{若 } ${o} = \\frac{${_subjCv(A, t)}}{${_subjCv(B, t)} + ${_subjCv(C, o)}} \\text{ ，則 } ${t} =`;
                // o(Bt + Co) = At → Bot + Co^2 = At → Co^2 = t(A - Bo) → t = Co^2/(A - Bo)
                let numStr = (C === 1 ? `${o}^2` : `${C}${o}^2`);
                correctStr = `\\frac{${numStr}}{${_subjLinCF(A, -B, o)}}`;
                steps.push({ text: _subjAligned([
                    `${o} = \\frac{${_subjCv(A, t)}}{${_subjCv(B, t)} + ${_subjCv(C, o)}}`,
                    `${o}(${_subjCv(B, t)} + ${_subjCv(C, o)}) = ${_subjCv(A, t)}`,
                    `${_subjCv(B, o)}${t} + ${numStr} = ${_subjCv(A, t)}`,
                    `${numStr} = ${_subjCv(A, t)} - ${_subjCv(B, o)}${t}`,
                    `${numStr} = ${t}(${_subjLinCF(A, -B, o)})`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: `\\frac{${numStr}}{${_subjLinCF(A, B, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${(C === 1 ? o : C + o)}}{${_subjLinCF(A, -B, o)}}`, msg: msgSubj3 },
                    { s: `\\frac{${_subjLinCF(A, -B, o)}}{${numStr}}`, msg: msgSubj4 }
                ], steps);

            } else {
                // T5：A/t - B/o = C/D  → 多重分式通分母
                let A = ri(2, 8), B = ri(2, 6), C = ri(2, 5), D = ri(2, 6);
                questionMathStr = `\\text{若 } \\frac{${A}}{${t}} - \\frac{${B}}{${o}} = \\frac{${C}}{${D}} \\text{ ，則 } ${t} =`;
                // A/t = C/D + B/o = (Co + BD)/(Do) → t = ADo/(Co + BD)
                correctStr = `\\frac{${_subjCv(A * D, o)}}{${_subjLin(C, B * D, o)}}`;
                steps.push({ text: _subjAligned([
                    `\\frac{${A}}{${t}} - \\frac{${B}}{${o}} = \\frac{${C}}{${D}}`,
                    `\\frac{${A}}{${t}} = \\frac{${C}}{${D}} + \\frac{${B}}{${o}}`,
                    `\\frac{${A}}{${t}} = \\frac{${_subjLin(C, B * D, o)}}{${_subjCv(D, o)}}`,
                    `${_subjCv(A, "")}${_subjCv(D, o)} = ${t}(${_subjLin(C, B * D, o)})`,
                    `${t} = ${correctStr}`
                ]), hide: false });
                options = makeOpts(correctStr, [
                    { s: `\\frac{${_subjCv(A * D, o)}}{${_subjLin(C, -B * D, o)}}`, msg: msgSubj1 },
                    { s: `\\frac{${_subjCv(A, o)}}{${_subjLin(C, B * D, o)}}`, msg: msgSubj4 },
                    { s: `\\frac{${_subjLin(C, B * D, o)}}{${_subjCv(A * D, o)}}`, msg: msgSubj4 }
                ], steps);
            }
        }

        // ─── 去除重複選項，補足至 4 個 ───
        let texts = [], finalOptions = [];
        options.forEach(opt => {
            if (!texts.includes(opt.text)) { texts.push(opt.text); finalOptions.push(opt); }
        });
        while (finalOptions.length < 4) {
            let k = ri(2, 9), m = ri(2, 9);
            let altText = `\\( \\displaystyle \\frac{${_subjLin(1, k, o)}}{${_subjLin(2, -m, o)}} \\)`;
            if (!texts.includes(altText)) {
                texts.push(altText);
                finalOptions.push({ text: altText, isCorrect: false, hint: wrapHint(msgSubj2, buildEq(steps)) });
            }
        }

        qObj.options = shuffleArray(finalOptions).map((opt, idx) => ({ ...opt, id: String.fromCharCode(65 + idx) }));

        qObj.question = `
        <div class="mb-4 text-base sm:text-lg text-slate-600">求出指定變數（主項）：</div>
        <div class="text-xl sm:text-2xl font-bold text-indigo-700 py-4 overflow-x-auto math-scroll whitespace-nowrap w-full">
            \\( \\displaystyle ${questionMathStr} \\)
        </div>`;

        bank.push(qObj);
    }
    return bank;
}
