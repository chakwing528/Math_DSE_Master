// js/topics/polynomial_operations.js
// 多項式的運算（6.1 概念｜6.2 加減｜6.3 乘法）
// 每程度 12 款題型。程度1 一步｜程度2 兩步｜程度3 多變數/TSA/DSE入門｜程度4 高中/DSE

// ==========================================
// 錯誤提示訊息
// ==========================================
const msgPoConcept = `<div class="text-red-600 font-bold text-lg mb-1">❗ 概念判斷錯誤</div><div class="text-sm text-slate-500 mb-2">單項式：數字與變數的乘積（變數指數為非負整數，分母不含變數）；多項式：若干單項式之和。</div>`;
const msgPoDegree = `<div class="text-red-600 font-bold text-lg mb-1">❗ 次數判斷錯誤</div><div class="text-sm text-slate-500 mb-2">單項式次數＝各變數指數之和；多項式次數＝最高次數的項的次數。</div>`;
const msgPoCoef = `<div class="text-red-600 font-bold text-lg mb-1">❗ 係數／常數項錯誤</div>`;
const msgPoCombine = `<div class="text-red-600 font-bold text-lg mb-1">❗ 合併同類項錯誤</div><div class="text-sm text-slate-500 mb-2">只有同類項（變數及指數完全相同）才可合併，係數相加減。</div>`;
const msgPoSign = `<div class="text-red-600 font-bold text-lg mb-1">❗ 正負號錯誤</div><div class="text-sm text-slate-500 mb-2">減去括號時，括號內每一項都要變號。</div>`;
const msgPoExpand = `<div class="text-red-600 font-bold text-lg mb-1">❗ 展開（分配律）錯誤</div>`;
const msgPoCalc = `<div class="text-red-600 font-bold text-lg mb-1">❗ 計算錯誤</div>`;

// ─── 格式化輔助 ───────────────────────────
function _poPoly(terms) {
    let s = "", first = true;
    for (const t of terms) {
        if (!t || t.c === 0) continue;
        const mag = Math.abs(t.c);
        const coefStr = (mag === 1 && t.v) ? '' : mag;
        const body = coefStr + (t.v || '');
        if (first) { s += (t.c < 0 ? '-' : '') + body; first = false; }
        else { s += (t.c < 0 ? ' - ' : ' + ') + body; }
    }
    return first ? '0' : s;
}
function _poVp(v, d) { return d === 0 ? '' : d === 1 ? v : `${v}^${d > 9 ? `{${d}}` : d}`; }
function _poVp2(v1, e1, v2, e2) {
    let s = '';
    if (e1 > 0) s += e1 === 1 ? v1 : `${v1}^${e1 > 9 ? `{${e1}}` : e1}`;
    if (e2 > 0) s += e2 === 1 ? v2 : `${v2}^${e2 > 9 ? `{${e2}}` : e2}`;
    return s;
}
function _poAligned(eqs) {
    const lines = eqs.map(eq => {
        const m = eq.match(/^([\s\S]*?)\s*=\s*([\s\S]*)$/);
        return m ? `${m[1]} &= ${m[2]}` : `& ${eq}`;
    });
    return `\\[ \\begin{aligned} ${lines.join(' \\\\ ')} \\end{aligned} \\]`;
}
function _poDetails(inner) {
    return `
    <details class="group my-2">
        <summary class="cursor-pointer text-indigo-500 hover:text-indigo-700 font-bold text-sm select-none flex items-center gap-1 outline-none ml-1">
            <svg class="w-5 h-5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            查看詳細步驟
        </summary>
        <div class="mt-2 pl-5 border-l-2 border-indigo-200 overflow-x-auto math-scroll">${inner}</div>
    </details>`;
}

// ==========================================
// 題目生成器：多項式的運算
// ==========================================
function generatePolynomialOpsQuestions(num, levelPref) {
    const bank = [];
    const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const rnz = (a, b) => { let x = 0; while (x === 0) x = ri(a, b); return x; };
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const sv = ['x', 'y', 'a', 'm', 'p', 't'];
    const W = s => `\\( ${s} \\)`;

    const typeCount = { '1': 12, '2': 12, '3': 12, '4': 12 };
    const typeCounter = {};

    function finalize(qObj, correct, wrongs, stepHtml) {
        let opts = [{ text: correct, isCorrect: true, hint: wrapHint(msgCorrect, stepHtml) }];
        wrongs.forEach(w => opts.push({ text: w.s, isCorrect: false, hint: wrapHint(w.m || msgPoCalc, stepHtml) }));
        let seen = new Set(), uniq = [];
        for (const o of opts) { if (!seen.has(o.text) && !/NaN|undefined|Infinity/.test(o.text)) { seen.add(o.text); uniq.push(o); } }
        let bump = 1;
        while (uniq.length < 4) {
            let m = correct.match(/-?\d+/), t = m ? correct.replace(/-?\d+/, String(parseInt(m[0]) + bump)) : `\\( ${bump} \\)`;
            if (!seen.has(t)) { seen.add(t); uniq.push({ text: t, isCorrect: false, hint: wrapHint(msgPoCalc, stepHtml) }); }
            bump++;
        }
        qObj.options = shuffleArray(uniq).map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) }));
    }
    function ask(qObj, text, extra) {
        qObj.question = `
        <div class="mb-4 text-base sm:text-lg text-slate-600">${text}</div>
        ${extra ? `<div class="text-xl font-bold text-indigo-700 py-2 overflow-x-auto math-scroll">${extra}</div>` : ''}`;
    }
    // 單變數隨機多項式：回傳 [{c,d}]（次數互異）
    function genSingle(v, degs) {
        return degs.map(d => ({ c: rnz(-9, 9), d, v: _poVp(v, d) }));
    }
    const evalSingle = (terms, x) => terms.reduce((s, t) => s + t.c * Math.pow(x, t.d), 0);

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref);
        if (levelPref === 'mixed') lvl = pick(['1', '2', '3', '4']);
        const TC = typeCount[lvl] || 12;
        typeCounter[lvl] = (typeCounter[lvl] || 0);
        const type = typeCounter[lvl] % TC;
        typeCounter[lvl]++;

        let qObj = { id: i + 1, topic: "多項式的運算" };
        const v = pick(sv);

        // ════════════ 程度 1（12 款，1 步） ════════════
        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";

            if (type === 0) {
                // 判斷單項式（揀「不是」）
                let mono = shuffleArray(['9x^5', '50', '\\frac{x}{2}', '-2x^3', '4ab', '7', 'x^{24}', '3m^2n']).slice(0, 3);
                let non = pick(['1 + 2x', '\\frac{2x}{y}', '\\frac{5}{a}', 'x^2 + 3', '2^x', 'x + y']);
                ask(qObj, '下列何者<b>不是</b>單項式？');
                finalize(qObj, W(non), mono.map(m => ({ s: W(m), m: msgPoConcept })), _poDetails(`<div>${W(non)} 含加減或分母含變數，並非單項式。</div>`));

            } else if (type === 1) {
                // 判斷多項式（揀「不是」）
                let poly = shuffleArray(['2x - 4x^3 + 5x^7', 'x^2 + 2x - 5', '8', 'x^4 + 3xy + y^3', 'x^2 + 3x - 1']).slice(0, 3);
                let non = pick(['\\frac{2}{y^2} + 3y + 1', '4^x + 3^y', 'x^2 + 3x^{-1}', '\\frac{2}{x+1}']);
                ask(qObj, '下列何者<b>不是</b>多項式？');
                finalize(qObj, W(non), poly.map(p => ({ s: W(p), m: msgPoConcept })), _poDetails(`<div>${W(non)} 含負指數或分母含變數，並非多項式。</div>`));

            } else if (type === 2) {
                // 求單項式次數
                let d = ri(2, 9), c = rnz(-9, 9);
                let mono = _poPoly([{ c, v: _poVp(v, d) }]);
                ask(qObj, `求單項式 ${W(mono)} 的次數。`);
                finalize(qObj, W(d), [{ s: W(c), m: msgPoDegree }, { s: W(d + 1), m: msgPoDegree }, { s: W(1), m: msgPoDegree }], _poDetails(`<div>單項式次數＝變數指數＝ ${W(d)}。</div>`));

            } else if (type === 3) {
                // 求單項式係數
                let d = ri(1, 7), c = rnz(-9, 9);
                let mono = _poPoly([{ c, v: _poVp(v, d) }]);
                ask(qObj, `求單項式 ${W(mono)} 的係數。`);
                finalize(qObj, W(c), [{ s: W(d), m: msgPoCoef }, { s: W(-c), m: msgPoSign }, { s: W(Math.abs(c)), m: msgPoCoef }], _poDetails(`<div>係數即變數前的數字 ${W(c)}。</div>`));

            } else if (type === 4) {
                // 求常數項
                let terms = genSingle(v, [ri(3, 5), ri(1, 2)]); let k = rnz(-9, 9);
                terms.push({ c: k, d: 0, v: '' });
                let poly = _poPoly(terms);
                ask(qObj, `求多項式 ${W(poly)} 的常數項。`);
                finalize(qObj, W(k), [{ s: W(-k), m: msgPoSign }, { s: W(0), m: msgPoCoef }, { s: W(terms[0].c), m: msgPoCoef }], _poDetails(`<div>常數項即不含變數的項 ${W(k)}。</div>`));

            } else if (type === 5) {
                // 求項數
                let n = ri(3, 5);
                let degs = shuffleArray([0, 1, 2, 3, 4, 5]).slice(0, n);
                let terms = degs.map(d => ({ c: rnz(-9, 9), d, v: _poVp(v, d) }));
                let poly = _poPoly(terms);
                ask(qObj, `求多項式 ${W(poly)} 的項數。`);
                finalize(qObj, W(n), [{ s: W(n + 1), m: msgPoConcept }, { s: W(n - 1), m: msgPoConcept }, { s: W(Math.max(...degs)), m: msgPoDegree }], _poDetails(`<div>數一數共有 ${W(n)} 個項。</div>`));

            } else if (type === 6) {
                // 求變數
                let d = ri(2, 8), terms = genSingle(v, [d, 1]); terms.push({ c: rnz(-9, 9), d: 0, v: '' });
                let poly = _poPoly(terms);
                let others = shuffleArray(sv.filter(x => x !== v)).slice(0, 3);
                ask(qObj, `多項式 ${W(poly)} 的變數是甚麼？`);
                finalize(qObj, W(v), others.map(o => ({ s: W(o), m: msgPoConcept })), _poDetails(`<div>該多項式只含變數 ${W(v)}。</div>`));

            } else if (type === 7) {
                // 最高次數的項
                let degs = shuffleArray([1, 2, 3, 4, 5]).slice(0, 3);
                let terms = degs.map(d => ({ c: rnz(-9, 9), d, v: _poVp(v, d) }));
                let maxd = Math.max(...degs), top = terms.find(t => t.d === maxd);
                let poly = _poPoly(shuffleArray(terms.slice()));
                let topStr = _poPoly([top]);
                ask(qObj, `寫出多項式 ${W(poly)} 中最高次數的項。`);
                let ws = terms.filter(t => t.d !== maxd).map(t => ({ s: W(_poPoly([t])), m: msgPoDegree }));
                finalize(qObj, W(topStr), ws, _poDetails(`<div>最高次數的項是次數最大的 ${W(topStr)}。</div>`));

            } else if (type === 8) {
                // 合併同類項（兩項）
                let d = ri(1, 4), a = rnz(2, 9), b = rnz(-9, 9);
                while (a + b === 0) b = rnz(-9, 9);
                let q = _poPoly([{ c: a, v: _poVp(v, d) }, { c: b, v: _poVp(v, d) }]);
                let ans = _poPoly([{ c: a + b, v: _poVp(v, d) }]);
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [{ s: W(_poPoly([{ c: a - b, v: _poVp(v, d) }])), m: msgPoSign }, { s: W(_poPoly([{ c: a + b, v: _poVp(v, 2 * d) }])), m: msgPoCombine }, { s: W(`${a + b}`), m: msgPoCombine }], _poDetails(_poAligned([`${q} = (${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)})${_poVp(v, d)}`, `= ${ans}`])));

            } else if (type === 9) {
                // 指數律 a^m × a^n
                let m1 = ri(2, 8), n1 = ri(1, 8);
                ask(qObj, `化簡：`, W(`${_poVp(v, m1)} \\times ${_poVp(v, n1)}`));
                finalize(qObj, W(_poVp(v, m1 + n1)), [{ s: W(_poVp(v, m1 * n1)), m: msgPoCalc }, { s: W(`${_poVp(v, m1 + n1)}`).replace(/\^.*/, `^{${m1 + n1 + 1}}`), m: msgPoCalc }, { s: W(_poVp(v, Math.abs(m1 - n1))), m: msgPoCalc }], _poDetails(_poAligned([`${_poVp(v, m1)} \\times ${_poVp(v, n1)} = ${v}^{${m1} + ${n1}}`, `= ${_poVp(v, m1 + n1)}`])));

            } else if (type === 10) {
                // 單項式 × 單項式
                let c1 = rnz(2, 6), c2 = rnz(-6, 6), d1 = ri(1, 4), d2 = ri(1, 4);
                let q = `${_poPoly([{ c: c1, v: _poVp(v, d1) }])} \\times ${_poPoly([{ c: c2, v: _poVp(v, d2) }])}`;
                let ans = _poPoly([{ c: c1 * c2, v: _poVp(v, d1 + d2) }]);
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [{ s: W(_poPoly([{ c: c1 * c2, v: _poVp(v, d1 * d2) }])), m: msgPoCalc }, { s: W(_poPoly([{ c: c1 + c2, v: _poVp(v, d1 + d2) }])), m: msgPoCalc }, { s: W(_poPoly([{ c: -c1 * c2, v: _poVp(v, d1 + d2) }])), m: msgPoSign }], _poDetails(_poAligned([`${q} = ${c1 * c2}${v}^{${d1} + ${d2}}`, `= ${ans}`])));

            } else {
                // 最高次項的係數
                let degs = shuffleArray([1, 2, 3, 4, 5]).slice(0, 3);
                let terms = degs.map(d => ({ c: rnz(-9, 9), d, v: _poVp(v, d) }));
                let maxd = Math.max(...degs), top = terms.find(t => t.d === maxd);
                let poly = _poPoly(shuffleArray(terms.slice()));
                ask(qObj, `求多項式 ${W(poly)} 中最高次數的項的係數。`);
                let ws = terms.filter(t => t.d !== maxd).map(t => ({ s: W(`${t.c}`), m: msgPoDegree }));
                ws.push({ s: W(`${-top.c}`), m: msgPoSign });
                finalize(qObj, W(`${top.c}`), ws, _poDetails(`<div>最高次項是 ${W(_poPoly([top]))}，係數為 ${W(top.c)}。</div>`));
            }

        // ════════════ 程度 2（12 款，2 步） ════════════
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";

            if (type === 0) {
                // 合併同類項（多項，單變數）
                let a1 = rnz(2, 8), a2 = rnz(-8, 8), b = rnz(-8, 8);
                while (a1 + a2 === 0) a2 = rnz(-8, 8);
                let q = _poPoly([{ c: a1, v: _poVp(v, 2) }, { c: b, v: v }, { c: a2, v: _poVp(v, 2) }]);
                let ans = _poPoly([{ c: a1 + a2, v: _poVp(v, 2) }, { c: b, v: v }]);
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: a1 - a2, v: _poVp(v, 2) }, { c: b, v: v }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: a1 + a2 + b, v: _poVp(v, 2) }])), m: msgPoCombine },
                    { s: W(_poPoly([{ c: a1 + a2, v: _poVp(v, 2) }, { c: -b, v: v }])), m: msgPoSign }
                ], _poDetails(_poAligned([`${q} = (${a1} ${a2 < 0 ? '-' : '+'} ${Math.abs(a2)})${_poVp(v, 2)} ${b < 0 ? '-' : '+'} ${Math.abs(b)}${v}`, `= ${ans}`])));

            } else if (type === 1) {
                // 合併同類項（雙變數）
                let [v1, v2] = shuffleArray(['m', 'n', 'a', 'b', 'x', 'y']).slice(0, 2);
                let a1 = rnz(2, 8), a2 = rnz(-7, 7), b = rnz(-8, 8), c = rnz(-8, 8);
                while (a1 + a2 === 0) a2 = rnz(-7, 7);
                let mn = v1 + v2;
                let q = _poPoly([{ c: a1, v: mn }, { c: b, v: v1 }, { c: a2, v: mn }, { c: c, v: v2 }]);
                let ans = _poPoly([{ c: a1 + a2, v: mn }, { c: b, v: v1 }, { c: c, v: v2 }]);
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: a1 - a2, v: mn }, { c: b, v: v1 }, { c: c, v: v2 }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: a1 + a2, v: mn }, { c: b + c, v: v1 }])), m: msgPoCombine },
                    { s: W(_poPoly([{ c: a1 + a2 + b + c, v: mn }])), m: msgPoCombine }
                ], _poDetails(_poAligned([`${q} = (${a1} ${a2 < 0 ? '-' : '+'} ${Math.abs(a2)})${mn} ${b < 0 ? '-' : '+'} ${Math.abs(b)}${v1} ${c < 0 ? '-' : '+'} ${Math.abs(c)}${v2}`, `= ${ans}`])));

            } else if (type === 2) {
                // 求某項係數
                let terms = [{ c: rnz(2, 6), d: 2 }, { c: rnz(-6, 6), d: 1 }, { c: rnz(-6, 6), d: 0 }].map(t => ({ ...t, v: _poVp(v, t.d) }));
                let poly = _poPoly(terms);
                let target = pick([1, 2]); let tt = terms.find(t => t.d === target);
                ask(qObj, `求多項式 ${W(poly)} 中 ${W(_poVp(v, target))} 的係數。`);
                finalize(qObj, W(`${tt.c}`), [{ s: W(`${-tt.c}`), m: msgPoSign }, { s: W(`${target}`), m: msgPoCoef }, { s: W(`${terms.find(t => t.d === 0).c}`), m: msgPoCoef }], _poDetails(`<div>${W(_poVp(v, target))} 的係數為 ${W(tt.c)}。</div>`));

            } else if (type === 3) {
                // 代入求值（單變數整數）
                let terms = genSingle(v, [3, 2, 1]); terms.push({ c: rnz(-9, 9), d: 0, v: '' });
                let x = pick([-2, -1, 2, 3]);
                let val = evalSingle(terms, x);
                let poly = _poPoly(terms);
                ask(qObj, `求多項式 ${W(poly)} 在 ${W(`${v} = ${x}`)} 時的值。`);
                finalize(qObj, W(`${val}`), [{ s: W(`${evalSingle(terms, -x)}`), m: msgPoCalc }, { s: W(`${val + ri(2, 9)}`), m: msgPoCalc }, { s: W(`${-val}`), m: msgPoSign }], _poDetails(_poAligned([`\\text{當 } ${v} = ${x}`, `\\text{值} = ${val}`])));

            } else if (type === 4) {
                // 升／降冪排列
                let degs = shuffleArray([0, 1, 2, 3, 4]).slice(0, 4);
                let terms = degs.map(d => ({ c: rnz(-9, 9), d, v: _poVp(v, d) }));
                let q = _poPoly(shuffleArray(terms.slice()));
                let desc = Math.random() > 0.5;
                let sorted = terms.slice().sort((a, b) => desc ? b.d - a.d : a.d - b.d);
                let ans = _poPoly(sorted);
                ask(qObj, `把多項式 ${W(q)} 按 ${W(v)} 的${desc ? '降冪' : '升冪'}次序排列。`);
                finalize(qObj, W(ans), [{ s: W(_poPoly(terms.slice().sort((a, b) => desc ? a.d - b.d : b.d - a.d))), m: msgPoDegree }], _poDetails(`<div>按次數${desc ? '由大到小' : '由小到大'}排列：${W(ans)}。</div>`));

            } else if (type === 5) {
                // 單項式 × 多項式（分配律）
                let c0 = rnz(2, 6), d0 = ri(1, 2), a = rnz(2, 6), b = rnz(-9, 9);
                let mono = _poPoly([{ c: c0, v: _poVp(v, d0) }]);
                let q = `${mono}(${_poPoly([{ c: a, v: v }, { c: b, v: '' }])})`;
                let ans = _poPoly([{ c: c0 * a, v: _poVp(v, d0 + 1) }, { c: c0 * b, v: _poVp(v, d0) }]);
                ask(qObj, `展開：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: c0 * a, v: _poVp(v, d0 + 1) }, { c: b, v: _poVp(v, d0) }])), m: msgPoExpand },
                    { s: W(_poPoly([{ c: c0 * a, v: _poVp(v, d0 + 1) }, { c: -c0 * b, v: _poVp(v, d0) }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: c0 + a, v: _poVp(v, d0 + 1) }, { c: c0 * b, v: _poVp(v, d0) }])), m: msgPoExpand }
                ], _poDetails(_poAligned([`${q} = ${c0}${_poVp(v, d0)}(${a}${v}) + ${c0}${_poVp(v, d0)}(${b})`, `= ${ans}`])));

            } else if (type === 6) {
                // 多項式 × 單項式
                let a = rnz(2, 6), b = rnz(-9, 9), c0 = rnz(-6, 6), d0 = ri(1, 2);
                let mono = _poPoly([{ c: c0, v: _poVp(v, d0) }]);
                let q = `(${_poPoly([{ c: a, v: v }, { c: b, v: '' }])})${mono.startsWith('-') ? `(${mono})` : mono}`;
                let ans = _poPoly([{ c: a * c0, v: _poVp(v, d0 + 1) }, { c: b * c0, v: _poVp(v, d0) }]);
                ask(qObj, `展開：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: a * c0, v: _poVp(v, d0 + 1) }, { c: -b * c0, v: _poVp(v, d0) }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: a * c0, v: _poVp(v, d0 + 1) }, { c: b, v: _poVp(v, d0) }])), m: msgPoExpand }
                ], _poDetails(_poAligned([`${q} = ${ans}`])));

            } else if (type === 7) {
                // 整式相加（括號）
                let [v1, v2] = shuffleArray(['x', 'y', 'a', 'b']).slice(0, 2);
                let A = [rnz(1, 6), rnz(1, 6), rnz(-8, 8)], B = [rnz(-6, 6), rnz(-6, 6), rnz(-8, 8)];
                let q = `(${_poPoly([{ c: A[0], v: v1 }, { c: A[1], v: v2 }, { c: A[2], v: '' }])}) + (${_poPoly([{ c: B[0], v: v1 }, { c: B[1], v: v2 }, { c: B[2], v: '' }])})`;
                let ans = _poPoly([{ c: A[0] + B[0], v: v1 }, { c: A[1] + B[1], v: v2 }, { c: A[2] + B[2], v: '' }]);
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: A[0] - B[0], v: v1 }, { c: A[1] - B[1], v: v2 }, { c: A[2] - B[2], v: '' }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: A[0] + B[0], v: v1 }, { c: A[1] + B[1], v: v2 }, { c: A[2] - B[2], v: '' }])), m: msgPoCalc }
                ], _poDetails(_poAligned([`${q} = ${ans}`])));

            } else if (type === 8) {
                // 整式相減（括號）
                let [v1, v2] = shuffleArray(['x', 'y', 'a', 'b']).slice(0, 2);
                let A = [rnz(1, 6), rnz(-6, 6)], B = [rnz(1, 6), rnz(-6, 6)];
                let mn = v1 + v2;
                let q = `(${_poPoly([{ c: A[0], v: v1 }, { c: A[1], v: mn }])}) - (${_poPoly([{ c: B[0], v: v1 }, { c: B[1], v: mn }])})`;
                let ans = _poPoly([{ c: A[0] - B[0], v: v1 }, { c: A[1] - B[1], v: mn }]);
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: A[0] - B[0], v: v1 }, { c: A[1] + B[1], v: mn }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: A[0] + B[0], v: v1 }, { c: A[1] + B[1], v: mn }])), m: msgPoSign }
                ], _poDetails(_poAligned([`${q} = ${_poPoly([{ c: A[0], v: v1 }, { c: A[1], v: mn }])} - ${_poPoly([{ c: B[0], v: v1 }])} ${(-B[1]) < 0 ? '-' : '+'} ${Math.abs(B[1])}${mn}`, `= ${ans}`])));

            } else if (type === 9) {
                // 多項式次數
                let degs = shuffleArray([1, 2, 3, 4, 5, 6]).slice(0, 3);
                let terms = degs.map(d => ({ c: rnz(-9, 9), d, v: _poVp(v, d) }));
                let poly = _poPoly(shuffleArray(terms.slice()));
                let maxd = Math.max(...degs);
                ask(qObj, `求多項式 ${W(poly)} 的次數。`);
                finalize(qObj, W(`${maxd}`), [{ s: W(`${maxd + 1}`), m: msgPoDegree }, { s: W(`${degs.reduce((a, b) => a + b, 0)}`), m: msgPoDegree }, { s: W(`${terms.length}`), m: msgPoDegree }], _poDetails(`<div>最高次數的項次數為 ${W(maxd)}。</div>`));

            } else if (type === 10) {
                // 單項式 × 單項式（負/雙變數）
                let [v1, v2] = shuffleArray(['x', 'y', 'a', 'b']).slice(0, 2);
                let c1 = rnz(-6, 6), c2 = rnz(-6, 6), e1 = ri(1, 4), e2 = ri(1, 4);
                let q = `${_poPoly([{ c: c1, v: _poVp(v1, e1) }])} \\times ${_poPoly([{ c: c2, v: _poVp(v2, e2) }])}`;
                let ans = _poPoly([{ c: c1 * c2, v: _poVp2(v1, e1, v2, e2) }]);
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [{ s: W(_poPoly([{ c: -c1 * c2, v: _poVp2(v1, e1, v2, e2) }])), m: msgPoSign }, { s: W(_poPoly([{ c: c1 + c2, v: _poVp2(v1, e1, v2, e2) }])), m: msgPoCalc }], _poDetails(_poAligned([`${q} = ${ans}`])));

            } else {
                // 直式加法
                let A = [rnz(-5, 5), rnz(-8, 8), rnz(-9, 9)], B = [rnz(-5, 5), rnz(-8, 8), rnz(-9, 9)];
                let pa = _poPoly([{ c: A[0], v: _poVp(v, 2) }, { c: A[1], v: v }, { c: A[2], v: '' }]);
                let pb = _poPoly([{ c: B[0], v: _poVp(v, 2) }, { c: B[1], v: v }, { c: B[2], v: '' }]);
                let ans = _poPoly([{ c: A[0] + B[0], v: _poVp(v, 2) }, { c: A[1] + B[1], v: v }, { c: A[2] + B[2], v: '' }]);
                ask(qObj, `求兩多項式之和：`, W(`(${pa}) + (${pb})`));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: A[0] - B[0], v: _poVp(v, 2) }, { c: A[1] - B[1], v: v }, { c: A[2] - B[2], v: '' }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: A[0] + B[0], v: _poVp(v, 2) }, { c: A[1] + B[1], v: v }, { c: A[2] - B[2], v: '' }])), m: msgPoCalc }
                ], _poDetails(_poAligned([`(${pa}) + (${pb}) = ${ans}`])));
            }

        // ════════════ 程度 3（12 款，多變數 / TSA / DSE 入門） ════════════
        } else if (lvl === '3') {
            qObj.level = "⭐⭐⭐ 程度 3";
            const [v1, v2] = shuffleArray(['x', 'y', 'a', 'b', 'm', 'n']).slice(0, 2);

            if (type === 0) {
                // 多變數單項式次數（指數和）
                let c = rnz(2, 6), e1 = ri(1, 4), e2 = ri(1, 4);
                let mono = _poPoly([{ c, v: _poVp2(v1, e1, v2, e2) }]);
                ask(qObj, `求單項式 ${W(mono)} 的次數。`);
                finalize(qObj, W(`${e1 + e2}`), [{ s: W(`${Math.max(e1, e2)}`), m: msgPoDegree }, { s: W(`${e1 * e2}`), m: msgPoDegree }, { s: W(`${c}`), m: msgPoDegree }], _poDetails(`<div>次數＝各變數指數之和 ＝ ${e1} + ${e2} ＝ ${W(`${e1 + e2}`)}。</div>`));

            } else if (type === 1) {
                // 多變數多項式次數 + 最高次項
                let tms = [{ c: rnz(2, 5), e1: ri(2, 3), e2: ri(2, 3) }, { c: rnz(-5, 5), e1: 1, e2: 2 }, { c: rnz(-5, 5), e1: 2, e2: 0 }, { c: rnz(-8, 8), e1: 0, e2: 0 }];
                let terms = tms.map(t => ({ c: t.c, v: _poVp2(v1, t.e1, v2, t.e2), deg: t.e1 + t.e2 }));
                let maxd = Math.max(...terms.map(t => t.deg)), top = terms.find(t => t.deg === maxd);
                let poly = _poPoly(shuffleArray(terms.slice()));
                ask(qObj, `求多項式 ${W(poly)} 的次數。`);
                finalize(qObj, W(`${maxd}`), [{ s: W(`${maxd + 1}`), m: msgPoDegree }, { s: W(`${maxd - 1}`), m: msgPoDegree }, { s: W(`${terms.length}`), m: msgPoDegree }], _poDetails(`<div>最高次數的項是 ${W(_poPoly([top]))}，次數 ＝ ${W(`${maxd}`)}。</div>`));

            } else if (type === 2) {
                // 多變數最高次項係數
                let tms = [{ c: rnz(2, 5), e1: 3, e2: ri(1, 3) }, { c: rnz(-6, 6), e1: 0, e2: 5 }, { c: rnz(-6, 6), e1: 4, e2: 0 }];
                let terms = tms.map(t => ({ c: t.c, v: _poVp2(v1, t.e1, v2, t.e2), deg: t.e1 + t.e2 }));
                let maxd = Math.max(...terms.map(t => t.deg)), top = terms.find(t => t.deg === maxd);
                let poly = _poPoly(shuffleArray(terms.slice()));
                ask(qObj, `求多項式 ${W(poly)} 中最高次數的項的係數。`);
                finalize(qObj, W(`${top.c}`), [{ s: W(`${-top.c}`), m: msgPoSign }, { s: W(`${maxd}`), m: msgPoCoef }, { s: W(`${terms.find(t => t !== top).c}`), m: msgPoDegree }], _poDetails(`<div>最高次項 ${W(_poPoly([top]))}，係數 ${W(`${top.c}`)}。</div>`));

            } else if (type === 3) {
                // 多變數合併同類項
                let mn = v1 + v2, m2n = `${v1}^2${v2}`;
                let a1 = rnz(2, 8), a2 = rnz(-7, 7), b = rnz(-6, 6), c = rnz(-6, 6);
                while (a1 + a2 === 0) a2 = rnz(-7, 7);
                let q = _poPoly([{ c: a1, v: mn }, { c: b, v: m2n }, { c: a2, v: mn }, { c: c, v: m2n }]);
                let ans = _poPoly([{ c: a1 + a2, v: mn }, { c: b + c, v: m2n }]);
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: a1 - a2, v: mn }, { c: b + c, v: m2n }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: a1 + a2 + b + c, v: mn }])), m: msgPoCombine },
                    { s: W(_poPoly([{ c: a1 + a2, v: mn }, { c: b - c, v: m2n }])), m: msgPoSign }
                ], _poDetails(_poAligned([`${q} = (${a1} ${a2 < 0 ? '-' : '+'} ${Math.abs(a2)})${mn} + (${b} ${c < 0 ? '-' : '+'} ${Math.abs(c)})${m2n}`, `= ${ans}`])));

            } else if (type === 4) {
                // 多變數升降冪排列（按 v1）
                let tms = [{ c: rnz(-6, 6), e1: 3 }, { c: rnz(-6, 6), e1: 2 }, { c: rnz(-6, 6), e1: 1 }, { c: rnz(-8, 8), e1: 0 }];
                let terms = tms.map(t => ({ c: t.c, v: _poVp2(v1, t.e1, v2, t.e1 === 0 ? 0 : 1), deg: t.e1 }));
                let q = _poPoly(shuffleArray(terms.slice()));
                let desc = Math.random() > 0.5;
                let ans = _poPoly(terms.slice().sort((a, b) => desc ? b.deg - a.deg : a.deg - b.deg));
                ask(qObj, `把多項式 ${W(q)} 按 ${W(v1)} 的${desc ? '降冪' : '升冪'}次序排列。`);
                finalize(qObj, W(ans), [{ s: W(_poPoly(terms.slice().sort((a, b) => desc ? a.deg - b.deg : b.deg - a.deg))), m: msgPoDegree }], _poDetails(`<div>按 ${W(v1)} 次數${desc ? '由大到小' : '由小到大'}排列。</div>`));

            } else if (type === 5) {
                // 多變數代入求值
                let terms = [{ c: rnz(2, 5), e1: 1, e2: 0 }, { c: rnz(-5, 5), e1: 0, e2: 2 }, { c: rnz(-5, 5), e1: 1, e2: 1 }];
                let x = pick([-3, -2, 2, 3]), y = pick([-2, 2, 3]);
                let poly = _poPoly(terms.map(t => ({ c: t.c, v: _poVp2(v1, t.e1, v2, t.e2) })));
                let val = terms.reduce((s, t) => s + t.c * Math.pow(x, t.e1) * Math.pow(y, t.e2), 0);
                ask(qObj, `求多項式 ${W(poly)} 在 ${W(`${v1} = ${x}, ${v2} = ${y}`)} 時的值。`);
                finalize(qObj, W(`${val}`), [{ s: W(`${-val}`), m: msgPoSign }, { s: W(`${val + ri(2, 9)}`), m: msgPoCalc }, { s: W(`${val - ri(2, 9)}`), m: msgPoCalc }], _poDetails(_poAligned([`\\text{當 } ${v1} = ${x}, ${v2} = ${y}`, `\\text{值} = ${val}`])));

            } else if (type === 6) {
                // 二項式 × 二項式
                let a = rnz(-9, 9), b = rnz(-9, 9);
                let q = `(${_poPoly([{ c: 1, v: v }, { c: a, v: '' }])})(${_poPoly([{ c: 1, v: v }, { c: b, v: '' }])})`;
                let ans = _poPoly([{ c: 1, v: _poVp(v, 2) }, { c: a + b, v: v }, { c: a * b, v: '' }]);
                ask(qObj, `展開：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: 1, v: _poVp(v, 2) }, { c: a + b, v: v }, { c: -a * b, v: '' }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: 1, v: _poVp(v, 2) }, { c: a * b, v: v }, { c: a + b, v: '' }])), m: msgPoExpand },
                    { s: W(_poPoly([{ c: 1, v: _poVp(v, 2) }, { c: a * b, v: '' }])), m: msgPoExpand }
                ], _poDetails(_poAligned([`${q} = ${v}^2 ${a < 0 ? '-' : '+'} ${Math.abs(a)}${v} ${b < 0 ? '-' : '+'} ${Math.abs(b)}${v} ${a * b < 0 ? '-' : '+'} ${Math.abs(a * b)}`, `= ${ans}`])));

            } else if (type === 7) {
                // 二項式 × 二項式 + 排列
                let p = rnz(2, 4), a = rnz(-9, 9), b = rnz(-9, 9);
                let q = `(${_poPoly([{ c: p, v: v }, { c: a, v: '' }])})(${_poPoly([{ c: 1, v: v }, { c: b, v: '' }])})`;
                let ans = _poPoly([{ c: p, v: _poVp(v, 2) }, { c: p * b + a, v: v }, { c: a * b, v: '' }]);
                ask(qObj, `展開並按 ${W(v)} 的降冪排列：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: p, v: _poVp(v, 2) }, { c: p * b + a, v: v }, { c: -a * b, v: '' }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: p, v: _poVp(v, 2) }, { c: a * b, v: v }, { c: p * b + a, v: '' }])), m: msgPoExpand }
                ], _poDetails(_poAligned([`${q} = ${ans}`])));

            } else if (type === 8) {
                // 雙變數二項式相乘
                let a = rnz(2, 5), b = rnz(-6, 6);
                let q = `(${_poPoly([{ c: 1, v: v1 }, { c: 1, v: v2 }])})(${_poPoly([{ c: a, v: v1 }, { c: b, v: v2 }])})`;
                let ans = _poPoly([{ c: a, v: _poVp(v1, 2) }, { c: b + a, v: v1 + v2 }, { c: b, v: _poVp(v2, 2) }]);
                ask(qObj, `展開：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: a, v: _poVp(v1, 2) }, { c: b + a, v: v1 + v2 }, { c: -b, v: _poVp(v2, 2) }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: a, v: _poVp(v1, 2) }, { c: b, v: _poVp(v2, 2) }])), m: msgPoExpand }
                ], _poDetails(_poAligned([`${q} = ${ans}`])));

            } else if (type === 9) {
                // 加減後排列
                let degs = [2, 1, 0];
                let A = degs.map(d => ({ c: rnz(-5, 5), d })), B = degs.map(d => ({ c: rnz(-5, 5), d }));
                let pa = _poPoly(A.map(t => ({ c: t.c, v: _poVp(v, t.d) })));
                let pb = _poPoly(B.map(t => ({ c: t.c, v: _poVp(v, t.d) })));
                let res = degs.map(d => ({ c: A.find(t => t.d === d).c + B.find(t => t.d === d).c, d }));
                let ans = _poPoly(res.map(t => ({ c: t.c, v: _poVp(v, t.d) })));
                ask(qObj, `化簡並按 ${W(v)} 的降冪排列：`, W(`(${pa}) + (${pb})`));
                finalize(qObj, W(ans), [{ s: W(_poPoly(res.map(t => ({ c: t.c, v: _poVp(v, t.d) })).reverse())), m: msgPoDegree }, { s: W(_poPoly(degs.map(d => ({ c: A.find(t => t.d === d).c - B.find(t => t.d === d).c, v: _poVp(v, d) })))), m: msgPoSign }], _poDetails(_poAligned([`(${pa}) + (${pb}) = ${ans}`])));

            } else if (type === 10) {
                // 直式減法
                let A = [rnz(-5, 5), rnz(-8, 8), rnz(-9, 9)], B = [rnz(-5, 5), rnz(-8, 8), rnz(-9, 9)];
                let pa = _poPoly([{ c: A[0], v: _poVp(v, 2) }, { c: A[1], v: v }, { c: A[2], v: '' }]);
                let pb = _poPoly([{ c: B[0], v: _poVp(v, 2) }, { c: B[1], v: v }, { c: B[2], v: '' }]);
                let ans = _poPoly([{ c: A[0] - B[0], v: _poVp(v, 2) }, { c: A[1] - B[1], v: v }, { c: A[2] - B[2], v: '' }]);
                ask(qObj, `求兩多項式之差：`, W(`(${pa}) - (${pb})`));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: A[0] + B[0], v: _poVp(v, 2) }, { c: A[1] + B[1], v: v }, { c: A[2] + B[2], v: '' }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: A[0] - B[0], v: _poVp(v, 2) }, { c: A[1] - B[1], v: v }, { c: A[2] + B[2], v: '' }])), m: msgPoSign }
                ], _poDetails(_poAligned([`(${pa}) - (${pb}) = ${ans}`])));

            } else {
                // 化簡含括號（展開 + 合併）
                let c0 = rnz(2, 4), a = rnz(2, 5), b = rnz(-6, 6), k = rnz(-8, 8);
                let q = `${c0}${v}(${_poPoly([{ c: a, v: v }, { c: b, v: '' }])}) - (${_poPoly([{ c: c0 * a - rnz(1, 3), v: _poVp(v, 2) }, { c: k, v: '' }])})`;
                // 為保證可控，直接逐步計算
                let t1 = { c2: c0 * a, c1: c0 * b }; // c0 x (a x + b) = c0 a x^2 + c0 b x
                let sub2 = c0 * a - rnz(1, 3); // 第二括號 x^2 係數
                let ans = _poPoly([{ c: t1.c2 - sub2, v: _poVp(v, 2) }, { c: t1.c1, v: v }, { c: -k, v: '' }]);
                let qStr = `${c0}${v}(${_poPoly([{ c: a, v: v }, { c: b, v: '' }])}) - (${_poPoly([{ c: sub2, v: _poVp(v, 2) }, { c: k, v: '' }])})`;
                ask(qObj, `化簡：`, W(qStr));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: t1.c2 - sub2, v: _poVp(v, 2) }, { c: t1.c1, v: v }, { c: k, v: '' }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: t1.c2 + sub2, v: _poVp(v, 2) }, { c: t1.c1, v: v }, { c: -k, v: '' }])), m: msgPoSign }
                ], _poDetails(_poAligned([`${qStr} = ${_poPoly([{ c: t1.c2, v: _poVp(v, 2) }, { c: t1.c1, v: v }])} - ${sub2}${_poVp(v, 2)} ${(-k) < 0 ? '-' : '+'} ${Math.abs(k)}`, `= ${ans}`])));
            }

        // ════════════ 程度 4（12 款，高中 / DSE） ════════════
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4";

            if (type === 0 || type === 1) {
                // 揀 x 使值最大 / 最小
                const wantMax = (type === 0);
                let terms = [{ c: rnz(-3, 3) || -2, d: 3 }, { c: rnz(-4, 4), d: 2 }, { c: rnz(-5, 5), d: 1 }, { c: rnz(-6, 6), d: 0 }];
                if (terms[0].c === 0) terms[0].c = -2;
                let xs = [-5, -3, 3, 5];
                let vals = xs.map(x => ({ x, val: terms.reduce((s, t) => s + t.c * Math.pow(x, t.d), 0) }));
                let best = vals.reduce((a, b) => (wantMax ? (b.val > a.val ? b : a) : (b.val < a.val ? b : a)));
                let poly = _poPoly(terms.map(t => ({ c: t.c, v: _poVp(v, t.d) })));
                ask(qObj, `下列哪個情況下，多項式 ${W(poly)} 的值為<b>${wantMax ? '最大' : '最小'}</b>？`);
                let wrongs = vals.filter(o => o.x !== best.x).map(o => ({ s: W(`${v} = ${o.x}`), m: msgPoCalc }));
                finalize(qObj, W(`${v} = ${best.x}`), wrongs, _poDetails(_poAligned(vals.map(o => `\\text{當 } ${v} = ${o.x}, \\text{值} = ${o.val}`))));

            } else if (type === 2) {
                // 多變數代入揀情況（= 目標值）
                let terms = [{ c: rnz(2, 5), e1: 2, e2: 2 }, { c: rnz(2, 4), e1: 1, e2: 1 }, { c: -1, e1: 3, e2: 0 }, { c: -1, e1: 0, e2: 0 }];
                const [a, b] = ['x', 'y'];
                let cases = [{ x: 1, y: 2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: -1, y: -2 }];
                let evald = cases.map(c => ({ ...c, val: terms.reduce((s, t) => s + t.c * Math.pow(c.x, t.e1) * Math.pow(c.y, t.e2), 0) }));
                let target = pick(evald);
                let poly = _poPoly(terms.map(t => ({ c: t.c, v: _poVp2(a, t.e1, b, t.e2) })));
                // 確保 target 值唯一
                let sameVal = evald.filter(e => e.val === target.val);
                if (sameVal.length === 1) {
                    ask(qObj, `下列哪個情況下，多項式 ${W(poly)} 的值為 ${W(`${target.val}`)}？`);
                    let wrongs = evald.filter(e => e.val !== target.val).map(e => ({ s: W(`${a} = ${e.x}, ${b} = ${e.y}`), m: msgPoCalc }));
                    finalize(qObj, W(`${a} = ${target.x}, ${b} = ${target.y}`), wrongs, _poDetails(_poAligned(evald.map(e => `\\text{當 } ${a}=${e.x}, ${b}=${e.y}, \\text{值}=${e.val}`))));
                } else {
                    // 退化情況：改問代入求值
                    let c = cases[0], val = evald[0].val;
                    ask(qObj, `求多項式 ${W(poly)} 在 ${W(`${a}=${c.x}, ${b}=${c.y}`)} 時的值。`);
                    finalize(qObj, W(`${val}`), [{ s: W(`${-val}`), m: msgPoSign }, { s: W(`${val + 3}`), m: msgPoCalc }, { s: W(`${val - 3}`), m: msgPoCalc }], _poDetails(_poAligned([`\\text{值} = ${val}`])));
                }

            } else if (type === 3) {
                // TSA I/II/III 判斷
                let degs = shuffleArray([2, 3, 4, 5]).slice(0, 3);
                let terms = degs.map(d => ({ c: rnz(-6, 6), d, v: _poVp(v, d) }));
                terms.push({ c: rnz(-8, 8), d: 0, v: '' });
                let poly = _poPoly(shuffleArray(terms.slice()));
                let maxd = Math.max(...degs), top = terms.find(t => t.d === maxd), konst = terms.find(t => t.d === 0);
                // 三個陳述（隨機真假）
                let s1 = { txt: `該多項式的次數是 ${maxd}`, ok: true };
                let s2 = { txt: `常數項是 ${konst.c}`, ok: true };
                let s3 = { txt: `最高次數的項的係數是 ${-top.c}`, ok: false };
                ask(qObj, `關於多項式 ${W(poly)}，下列哪些陳述<b>正確</b>？<br>I. ${W(`\\text{次數是 } ${maxd}`)}<br>II. ${W(`\\text{常數項是 } ${konst.c}`)}<br>III. ${W(`\\text{最高次項係數是 } ${-top.c}`)}`);
                finalize(qObj, `只有 I 及 II`, [{ s: `I、II 及 III`, m: msgPoConcept }, { s: `只有 I 及 III`, m: msgPoConcept }, { s: `只有 II 及 III`, m: msgPoConcept }], _poDetails(`<div>次數 ${W(`${maxd}`)}（I 對）；常數項 ${W(`${konst.c}`)}（II 對）；最高次項係數實為 ${W(`${top.c}`)} 而非 ${W(`${-top.c}`)}（III 錯）。</div>`));

            } else if (type === 4) {
                // 帶分數代入求值
                let A = rnz(2, 8), B = rnz(-9, 9), C = rnz(-9, 9);
                let den = pick([2, 3]); let xnum = 1;
                let poly = _poPoly([{ c: A, v: _poVp(v, 2) }, { c: B, v: v }, { c: C, v: '' }]);
                let val = A * (xnum / den) ** 2 + B * (xnum / den) + C;
                let valTex = (Math.round(val * 36) % 36 === 0) ? `${Math.round(val)}` : `\\frac{${Math.round(val * den * den)}}{${den * den}}`;
                // 用分數精確值
                let numEx = A * xnum * xnum + B * xnum * den + C * den * den, denEx = den * den;
                let g = gcd(Math.abs(numEx), denEx) || 1; let nn = numEx / g, dd = denEx / g;
                let ansTex = dd === 1 ? `${nn}` : `\\frac{${nn}}{${dd}}`;
                ask(qObj, `求多項式 ${W(poly)} 在 ${W(`${v} = \\frac{1}{${den}}`)} 時的值。`);
                finalize(qObj, W(ansTex), [{ s: W(`${A + B + C}`), m: msgPoCalc }, { s: W(dd === 1 ? `${-nn}` : `\\frac{${-nn}}{${dd}}`), m: msgPoSign }, { s: W(`${C}`), m: msgPoCalc }], _poDetails(_poAligned([`\\text{值} = ${A}(\\tfrac{1}{${den}})^2 ${B < 0 ? '-' : '+'} ${Math.abs(B)}(\\tfrac{1}{${den}}) ${C < 0 ? '-' : '+'} ${Math.abs(C)}`, `= ${ansTex}`])));

            } else if (type === 5) {
                // 雙變數二項式相乘（較難）+ 排列
                const [a, b] = shuffleArray(['x', 'y', 'a', 'b']).slice(0, 2);
                let p = rnz(2, 5), q1 = rnz(-5, 5), r = rnz(2, 5), s = rnz(-5, 5);
                let f1 = _poPoly([{ c: p, v: a }, { c: q1, v: b }]), f2 = _poPoly([{ c: r, v: a }, { c: s, v: b }]);
                let ans = _poPoly([{ c: p * r, v: _poVp(a, 2) }, { c: p * s + q1 * r, v: a + b }, { c: q1 * s, v: _poVp(b, 2) }]);
                ask(qObj, `展開：`, W(`(${f1})(${f2})`));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: p * r, v: _poVp(a, 2) }, { c: p * s + q1 * r, v: a + b }, { c: -q1 * s, v: _poVp(b, 2) }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: p * r, v: _poVp(a, 2) }, { c: q1 * s, v: _poVp(b, 2) }])), m: msgPoExpand }
                ], _poDetails(_poAligned([`(${f1})(${f2}) = ${ans}`])));

            } else if (type === 6) {
                // 多項式 × 多項式（3項 × 2項）
                let A = rnz(1, 4), B = rnz(-5, 5), C = rnz(-6, 6), k = rnz(2, 5);
                // (A x^2 + B x + C)(x + k)
                let ans = _poPoly([{ c: A, v: _poVp(v, 3) }, { c: A * k + B, v: _poVp(v, 2) }, { c: B * k + C, v: v }, { c: C * k, v: '' }]);
                let q = `(${_poPoly([{ c: A, v: _poVp(v, 2) }, { c: B, v: v }, { c: C, v: '' }])})(${_poPoly([{ c: 1, v: v }, { c: k, v: '' }])})`;
                ask(qObj, `展開：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: A, v: _poVp(v, 3) }, { c: A * k + B, v: _poVp(v, 2) }, { c: B * k + C, v: v }, { c: -C * k, v: '' }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: A, v: _poVp(v, 3) }, { c: B, v: _poVp(v, 2) }, { c: C, v: v }, { c: C * k, v: '' }])), m: msgPoExpand }
                ], _poDetails(_poAligned([`${q} = ${ans}`])));

            } else if (type === 7) {
                // 化簡綜合（乘 + 加減混合）
                let c0 = rnz(2, 4), a = rnz(2, 5), b = rnz(-6, 6), s2 = rnz(1, 3), k = rnz(-8, 8);
                // c0 x (a x + b) - (s2 x^2 + k) = (c0 a - s2) x^2 + c0 b x - k
                let ans = _poPoly([{ c: c0 * a - s2, v: _poVp(v, 2) }, { c: c0 * b, v: v }, { c: -k, v: '' }]);
                let q = `${c0}${v}(${_poPoly([{ c: a, v: v }, { c: b, v: '' }])}) - (${_poPoly([{ c: s2, v: _poVp(v, 2) }, { c: k, v: '' }])})`;
                ask(qObj, `化簡：`, W(q));
                finalize(qObj, W(ans), [
                    { s: W(_poPoly([{ c: c0 * a - s2, v: _poVp(v, 2) }, { c: c0 * b, v: v }, { c: k, v: '' }])), m: msgPoSign },
                    { s: W(_poPoly([{ c: c0 * a + s2, v: _poVp(v, 2) }, { c: c0 * b, v: v }, { c: -k, v: '' }])), m: msgPoSign }
                ], _poDetails(_poAligned([`${q} = ${_poPoly([{ c: c0 * a, v: _poVp(v, 2) }, { c: c0 * b, v: v }])} - ${s2}${_poVp(v, 2)} ${(-k) < 0 ? '-' : '+'} ${Math.abs(k)}`, `= ${ans}`])));

            } else if (type === 8) {
                // 求展開式中某項係數
                let p = rnz(2, 4), a = rnz(-9, 9), b = rnz(-9, 9);
                // (p x + a)(x + b) = p x^2 + (pb + a) x + ab；求 x 係數
                let coef = p * b + a;
                let q = `(${_poPoly([{ c: p, v: v }, { c: a, v: '' }])})(${_poPoly([{ c: 1, v: v }, { c: b, v: '' }])})`;
                ask(qObj, `求展開式 ${W(q)} 中 ${W(v)} 的係數。`);
                finalize(qObj, W(`${coef}`), [{ s: W(`${-coef}`), m: msgPoSign }, { s: W(`${a * b}`), m: msgPoExpand }, { s: W(`${p}`), m: msgPoCoef }], _poDetails(_poAligned([`${q} = ${p}${_poVp(v, 2)} ${coef < 0 ? '-' : '+'} ${Math.abs(coef)}${v} ${a * b < 0 ? '-' : '+'} ${Math.abs(a * b)}`, `\\therefore ${v} \\text{ 的係數} = ${coef}`])));

            } else if (type === 9) {
                // 逆向求係數：(x + a)(x + b) = x^2 + px + q，已知 p,q 求 a 或 b 之一（給其中一根）
                let a = rnz(-9, 9), b = rnz(-9, 9); while (a === b) b = rnz(-9, 9);
                let p = a + b, qq = a * b;
                let polyTex = _poPoly([{ c: 1, v: _poVp(v, 2) }, { c: p, v: v }, { c: qq, v: '' }]);
                ask(qObj, `已知 ${W(`${polyTex} = (${v} ${a < 0 ? '-' : '+'} ${Math.abs(a)})(${v} + k)`)}，求 ${W('k')}。`);
                finalize(qObj, W(`${b}`), [{ s: W(`${-b}`), m: msgPoSign }, { s: W(`${a}`), m: msgPoCalc }, { s: W(`${p}`), m: msgPoCalc }], _poDetails(_poAligned([`(${v} ${a < 0 ? '-' : '+'} ${Math.abs(a)})(${v} + k) = ${polyTex}`, `\\text{比較常數項：} ${a}k = ${qq} \\implies k = ${b}`])));

            } else if (type === 10) {
                // 升降冪 + 次數綜合（多變數）
                const [a, b] = shuffleArray(['x', 'y', 'a', 'b']).slice(0, 2);
                let tms = [{ c: rnz(-6, 6), e1: 3, e2: 1 }, { c: rnz(-6, 6), e1: 1, e2: 3 }, { c: rnz(-6, 6), e1: 2, e2: 2 }, { c: rnz(-6, 6), e1: 1, e2: 0 }];
                let terms = tms.map(t => ({ c: t.c, v: _poVp2(a, t.e1, b, t.e2), deg: t.e1 + t.e2 }));
                let maxd = Math.max(...terms.map(t => t.deg));
                let poly = _poPoly(shuffleArray(terms.slice()));
                ask(qObj, `求多項式 ${W(poly)} 的次數。`);
                finalize(qObj, W(`${maxd}`), [{ s: W(`${maxd + 1}`), m: msgPoDegree }, { s: W(`${maxd - 1}`), m: msgPoDegree }, { s: W(`${terms.length}`), m: msgPoDegree }], _poDetails(`<div>各項次數取最大者 ＝ ${W(`${maxd}`)}。</div>`));

            } else {
                // 代入求值（多變數，含負數，較繁）
                let terms = [{ c: rnz(2, 4), e1: 2, e2: 1 }, { c: rnz(-5, 5), e1: 1, e2: 2 }, { c: rnz(-6, 6), e1: 1, e2: 1 }, { c: rnz(-8, 8), e1: 0, e2: 0 }];
                const [a, b] = shuffleArray(['x', 'y']).slice(0, 2);
                let x = pick([-2, -1, 2]), y = pick([-2, 2, 3]);
                let poly = _poPoly(terms.map(t => ({ c: t.c, v: _poVp2(a, t.e1, b, t.e2) })));
                let val = terms.reduce((s, t) => s + t.c * Math.pow(x, t.e1) * Math.pow(y, t.e2), 0);
                ask(qObj, `求多項式 ${W(poly)} 在 ${W(`${a} = ${x}, ${b} = ${y}`)} 時的值。`);
                finalize(qObj, W(`${val}`), [{ s: W(`${-val}`), m: msgPoSign }, { s: W(`${val + ri(3, 9)}`), m: msgPoCalc }, { s: W(`${val - ri(3, 9)}`), m: msgPoCalc }], _poDetails(_poAligned([`\\text{當 } ${a}=${x}, ${b}=${y}`, `\\text{值} = ${val}`])));
            }
        }

        bank.push(qObj);
    }
    return bank;
}
