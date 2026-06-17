// js/topics/simple_inequalities.js
// 簡單不等式（8.1 簡易不等式｜8.2 解一元一次不等式）
// 程度1 概念(1步)｜程度2 基礎解(2步)｜程度3 括號/分式/雙邊(2-4步)｜程度4 高中/DSE

// ==========================================
// 錯誤提示訊息
// ==========================================
const msgSimpleIneqSign = `<div class="text-red-600 font-bold text-lg mb-1">❗ 負數變號錯誤</div><div class="text-sm text-slate-500 mb-2">當不等式兩邊同時乘以或除以一個負數時，不等號的方向必須反轉（例如：\\(>\\) 變成 \\(<\\)）。</div>`;
const msgIneqFrac = `<div class="text-red-600 font-bold text-lg mb-1">❗ 分數展開或移項錯誤</div><div class="text-sm text-slate-500 mb-2">同乘公倍數消去分母時，每一項都要乘到；分子有負號，展開時括號內每一項都要變號。</div>`;
const msgIneqProp = `<div class="text-red-600 font-bold text-lg mb-1">❗ 不等式性質理解錯誤</div><div class="text-sm text-slate-500 mb-2">同乘/除負數要變號；倒數及平方性質在負數時方向可能改變。</div>`;
const msgIneqInt = `<div class="text-red-600 font-bold text-lg mb-1">❗ 極值整數選取錯誤</div><div class="text-sm text-slate-500 mb-2">尋找最大/最小整數時，留意不等號是否含等號（\\(\\le / \\ge\\)）。</div>`;
const msgIneqSymbol = `<div class="text-red-600 font-bold text-lg mb-1">❗ 不等號意義錯誤</div><div class="text-sm text-slate-500 mb-2">大於 \\(>\\)、小於 \\(<\\)、不大於/至多 \\(\\le\\)、不小於/至少 \\(\\ge\\)、超過 \\(>\\)、低於 \\(<\\)。</div>`;
const msgIneqMove = `<div class="text-red-600 font-bold text-lg mb-1">❗ 移項或計算錯誤</div><div class="text-sm text-slate-500 mb-2">移項時記得變號；同除係數時數值要計算正確。</div>`;

function _siShuffle(array) {
    let c = array.length, r;
    while (c !== 0) { r = Math.floor(Math.random() * c); c--; [array[c], array[r]] = [array[r], array[c]]; }
    return array;
}

// 步驟 → 不等號左對齊 aligned
function _siBuildEq(steps) {
    const INEQ_REGEX = /\\le|\\ge|\\neq|<|>|=/;
    const rows = [], fallback = [];
    for (const s of steps) {
        const text = String(s.text);
        const colonIdx = text.indexOf('：');
        let label = '', mathPart = text;
        if (colonIdx >= 0) { label = text.substring(0, colonIdx); mathPart = text.substring(colonIdx + 1); }
        const mathMatch = mathPart.match(/\\\(\s*(.+?)\s*\\\)/);
        if (!mathMatch) { fallback.push(`<div class="my-1">${text}</div>`); continue; }
        const math = mathMatch[1].trim();
        const opMatch = INEQ_REGEX.exec(math);
        if (!opMatch) { fallback.push(`<div class="my-1">${text}</div>`); continue; }
        const op = opMatch[0];
        const lhs = math.substring(0, opMatch.index).trim();
        const rhs = math.substring(opMatch.index + op.length).trim();
        const cleanLabel = label.replace(/<[^>]+>/g, '').trim();
        const labelTex = cleanLabel ? ` && \\text{${cleanLabel}}` : '';
        rows.push(`${lhs} &${op} ${rhs}${labelTex}`);
    }
    if (rows.length === 0) return fallback.join('');
    const aligned = `\\[ \\begin{aligned} ${rows.join(' \\\\ ')} \\end{aligned} \\]`;
    return `<div class="my-2 text-center overflow-x-auto math-scroll">${aligned}</div>` + fallback.join('');
}

function _siWrapHint(msg, stepsHtml) {
    return `
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
            ${msg}
            <details class="mt-2 text-sm text-slate-600">
                <summary class="cursor-pointer text-indigo-600 font-semibold hover:underline">查看詳細解題步驟</summary>
                <div class="mt-2 pl-3 border-l-2 border-indigo-500 space-y-1 bg-white p-2 rounded">${stepsHtml}</div>
            </details>
        </div>`;
}

// 數線 SVG（dir: 'right'/'left'；closed: 實心=含等號）
function _siNumLine(val, dir, closed) {
    const cx = 120, y = 32;
    const ray = dir === 'right'
        ? `<line x1="${cx}" y1="${y}" x2="225" y2="${y}" stroke="#16a34a" stroke-width="3"/><polygon points="225,${y - 5} 234,${y} 225,${y + 5}" fill="#16a34a"/>`
        : `<line x1="${cx}" y1="${y}" x2="35" y2="${y}" stroke="#16a34a" stroke-width="3"/><polygon points="35,${y - 5} 26,${y} 35,${y + 5}" fill="#16a34a"/>`;
    const dot = closed
        ? `<circle cx="${cx}" cy="${y}" r="6" fill="#16a34a"/>`
        : `<circle cx="${cx}" cy="${y}" r="6" fill="white" stroke="#16a34a" stroke-width="2.5"/>`;
    return `<div class="flex justify-center my-3"><svg width="260" height="58" viewBox="0 0 260 58">
        <line x1="12" y1="${y}" x2="248" y2="${y}" stroke="#64748b" stroke-width="1.5"/>
        <polygon points="248,${y - 4} 256,${y} 248,${y + 4}" fill="#64748b"/>
        <polygon points="12,${y - 4} 4,${y} 12,${y + 4}" fill="#64748b"/>
        ${ray}${dot}
        <text x="${cx}" y="${y + 21}" font-size="14" text-anchor="middle" fill="#334155">${val}</text>
    </svg></div>`;
}

// ==========================================
// 題目生成器：簡單不等式
// ==========================================
function generateSimpleInequalitiesQuestions(num, levelPref) {
    const bank = [];
    const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const vars = ['x', 'y', 'm', 'n', 'a', 'p'];
    const ops = ['>', '<', '\\ge', '\\le'];
    const flip = op => ({ '>': '<', '<': '>', '\\ge': '\\le', '\\le': '\\ge' })[op] || op;
    const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } let g = gcd(Math.abs(n), Math.abs(d)) || 1; n /= g; d /= g; return d === 1 ? `${n}` : `\\frac{${n}}{${d}}`; };
    const W = s => `\\( ${s} \\)`;
    const lin = (b) => b === 0 ? '' : (b > 0 ? `+ ${b}` : `- ${-b}`);
    const rnz = (a, b) => { let x = 0; while (x === 0) x = ri(a, b); return x; }; // 非零隨機

    const typeCount = { '1': 5, '2': 5, '3': 5, '4': 5 };
    const typeCounter = {};

    function finalize(qObj, opts, steps) {
        // 保留首次出現（正解永遠排第一，不會被同文字干擾項覆蓋）
        let seen = new Set(), uniq = [];
        for (const o of opts) { if (!seen.has(o.text)) { seen.add(o.text); uniq.push(o); } }
        let bump = 1;
        while (uniq.length < 4) {
            let base = uniq[0].text, m = base.match(/-?\d+/), t;
            t = m ? base.replace(/-?\d+/, String(parseInt(m[0]) + bump)) : `\\( x > ${bump} \\)`;
            if (!seen.has(t)) { seen.add(t); uniq.push({ text: t, isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps || [])) }); }
            bump++;
        }
        qObj.options = _siShuffle(uniq).map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) }));
    }

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref);
        if (levelPref === 'mixed') lvl = pick(['1', '2', '3', '4']);
        const TC = typeCount[lvl] || 5;
        typeCounter[lvl] = (typeCounter[lvl] || 0);
        const type = typeCounter[lvl] % TC;
        typeCounter[lvl]++;

        let qObj = { id: i + 1, topic: "簡單不等式" };
        const v = pick(vars);
        let steps = [], opts = [];

        // ════════════ 程度 1：概念（1 步） ════════════
        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";

            if (type === 0) {
                // T1 譯句 → 不等式
                let phr = pick([{ w: '大於', o: '>' }, { w: '小於', o: '<' }, { w: '大於或等於', o: '\\ge' }, { w: '小於或等於', o: '\\le' }, { w: '不等於', o: '\\neq' }]);
                let nbr = ri(-9, 9);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">以不等式表示：${v} ${phr.w} ${nbr}。</div>`;
                steps = [{ text: `「${phr.w}」對應符號 \\( ${phr.o} \\)，即 \\( ${v} ${phr.o} ${nbr} \\)`, hide: false }];
                let allOps = ['>', '<', '\\ge', '\\le', '\\neq'].filter(o => o !== phr.o);
                opts = [{ text: W(`${v} ${phr.o} ${nbr}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) }];
                _siShuffle(allOps).slice(0, 3).forEach(o => opts.push({ text: W(`${v} ${o} ${nbr}`), isCorrect: false, hint: _siWrapHint(msgIneqSymbol, _siBuildEq(steps)) }));

            } else if (type === 1) {
                // T2 詞語意義（不大於/至少/超過…）
                let phr = pick([
                    { w: '不大於', o: '\\le' }, { w: '不小於', o: '\\ge' }, { w: '至少為', o: '\\ge' },
                    { w: '至多為', o: '\\le' }, { w: '超過', o: '>' }, { w: '低於', o: '<' }, { w: '高於', o: '>' }
                ]);
                let ctx = pick([['一本書的頁數', 'n'], ['一座山的高度（m）', 'h'], ['一支筆的售價（$）', 'p'], ['一名男子的身高（cm）', 'h'], ['一輛汽車的速率（km/h）', 's']]);
                let nbr = ri(2, 50) * 10;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">以不等式表示：${ctx[0]}（\\( ${ctx[1]} \\)）${phr.w} ${nbr}。</div>`;
                steps = [{ text: `「${phr.w}」對應符號 \\( ${phr.o} \\)，即 \\( ${ctx[1]} ${phr.o} ${nbr} \\)`, hide: false }];
                let allOps = ['>', '<', '\\ge', '\\le'].filter(o => o !== phr.o);
                opts = [{ text: W(`${ctx[1]} ${phr.o} ${nbr}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) }];
                _siShuffle(allOps).slice(0, 3).forEach(o => opts.push({ text: W(`${ctx[1]} ${o} ${nbr}`), isCorrect: false, hint: _siWrapHint(msgIneqSymbol, _siBuildEq(steps)) }));

            } else if (type === 2) {
                // T3 比較大小（揀正確一項）
                let trueP = pick([
                    '\\frac{37}{4} < 10', '-\\frac{13}{5} < -2', '\\frac{7}{4} = 1.75', '8.3 < \\frac{25}{3}',
                    '-\\frac{5}{2} = -2.5', '\\frac{3}{4} > 0.7', '-3 < -\\frac{5}{2}', '\\frac{9}{4} > 2', '-0.3 > -\\frac{1}{2}'
                ]);
                let falseP = _siShuffle([
                    '\\frac{37}{4} > 10', '-3 > -2', '0.5 > \\frac{2}{3}', '\\frac{9}{2} < 4', '-\\frac{5}{2} > -2',
                    '\\frac{3}{4} < 0.5', '2.5 < \\frac{7}{3}', '-\\frac{13}{5} > -2', '1.75 > \\frac{7}{4}', '\\frac{1}{3} > 0.5'
                ]).slice(0, 3);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">下列哪一項<b>正確</b>？</div>`;
                steps = [{ text: `把分數化成小數再比較，可知 \\( ${trueP} \\) 正確。`, hide: false }];
                opts = [{ text: W(trueP), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) }];
                falseP.forEach(p => opts.push({ text: W(p), isCorrect: false, hint: _siWrapHint(msgIneqSymbol, _siBuildEq(steps)) }));

            } else if (type === 3) {
                // T4 驗證解：x = k 是下列哪個不等式的解？
                let k = ri(2, 6);
                let cands = [], guard = 0;
                while (cands.length < 12 && guard < 200) {
                    guard++;
                    let a = pick([1, 1, 2, 3, -1, -2]);
                    let op = pick(ops);
                    let c = ri(-6, 12);
                    let lhsVal = a * k;
                    let truth = op === '>' ? lhsVal > c : op === '<' ? lhsVal < c : op === '\\ge' ? lhsVal >= c : lhsVal <= c;
                    let tex = `${a === 1 ? '' : a === -1 ? '-' : a}${v} ${op} ${c}`;
                    if (!cands.some(x => x.tex === tex)) cands.push({ tex, truth });
                }
                let trues = cands.filter(x => x.truth), falses = cands.filter(x => !x.truth);
                let correct = pick(trues);
                let three = _siShuffle(falses).slice(0, 3);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">\\( ${v} = ${k} \\) 是下列哪一個不等式的解？</div>`;
                steps = [{ text: `把 \\( ${v} = ${k} \\) 代入各式，只有 \\( ${correct.tex} \\) 成立。`, hide: false }];
                opts = [{ text: W(correct.tex), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) }];
                three.forEach(c => opts.push({ text: W(c.tex), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }));

            } else {
                // T5 由數線寫不等式
                let val = ri(-9, 9);
                let dir = pick(['right', 'left']);
                let closed = Math.random() > 0.5;
                let op = dir === 'right' ? (closed ? '\\ge' : '>') : (closed ? '\\le' : '<');
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">下圖為某不等式的解。寫出對應的不等式（以 \\( ${v} \\) 為未知數）。</div>${_siNumLine(val, dir, closed)}`;
                steps = [
                    { text: `空心圈表示不含端點（\\(>\\) 或 \\(<\\)），實心圈表示含端點（\\(\\ge\\) 或 \\(\\le\\)）。`, hide: false },
                    { text: `箭咀向${dir === 'right' ? '右' : '左'}，故 \\( ${v} ${op} ${val} \\)`, hide: false }
                ];
                let wrongs = [
                    `${v} ${flip(op)} ${val}`,
                    `${v} ${dir === 'right' ? (closed ? '>' : '\\ge') : (closed ? '<' : '\\le')} ${val}`,
                    `${v} ${op} ${val + pick([-2, 2, 3])}`
                ];
                opts = [{ text: W(`${v} ${op} ${val}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) }];
                wrongs.forEach(w => opts.push({ text: W(w), isCorrect: false, hint: _siWrapHint(msgIneqSymbol, _siBuildEq(steps)) }));
            }

        // ════════════ 程度 2：基礎解（2 步） ════════════
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";
            let op = pick(ops);

            if (type === 0) {
                // T1 一步移項：x + b op c
                let b = ri(-12, 12) || 3, c = ri(-12, 12), ansV = c - b;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( ${v} ${lin(b)} ${op} ${c} \\)</div>`;
                steps = [
                    { text: `原式：\\( ${v} ${lin(b)} ${op} ${c} \\)`, hide: false },
                    { text: `移項：\\( ${v} ${op} ${c} ${lin(-b)} \\)`, hide: false },
                    { text: `求解：\\( ${v} ${op} ${ansV} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${op} ${ansV}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${flip(op)} ${ansV}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                    { text: W(`${v} ${op} ${c + b}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }
                ];

            } else if (type === 1) {
                // T2 ×÷正數
                if (Math.random() < 0.5) {
                    let a = ri(2, 6), root = ri(-6, 6), c = a * root;
                    qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( ${a}${v} ${op} ${c} \\)</div>`;
                    steps = [
                        { text: `原式：\\( ${a}${v} ${op} ${c} \\)`, hide: false },
                        { text: `兩邊同除以 ${a}：\\( ${v} ${op} ${root} \\)`, hide: false }
                    ];
                    opts = [
                        { text: W(`${v} ${op} ${root}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                        { text: W(`${v} ${flip(op)} ${root}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                        { text: W(`${v} ${op} ${c * a}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }
                    ];
                } else {
                    let a = ri(2, 6), c = ri(-6, 6), ansV = a * c;
                    qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( \\frac{${v}}{${a}} ${op} ${c} \\)</div>`;
                    steps = [
                        { text: `原式：\\( \\frac{${v}}{${a}} ${op} ${c} \\)`, hide: false },
                        { text: `兩邊同乘以 ${a}：\\( ${v} ${op} ${ansV} \\)`, hide: false }
                    ];
                    opts = [
                        { text: W(`${v} ${op} ${ansV}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                        { text: W(`${v} ${flip(op)} ${ansV}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                        { text: W(`${v} ${op} ${c}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }
                    ];
                }

            } else if (type === 2) {
                // T3 兩步（係數正）
                let a = ri(2, 5), b = ri(-8, 8), root = ri(-5, 6), c = a * root + b;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( ${a}${v} ${lin(b)} ${op} ${c} \\)</div>`;
                steps = [
                    { text: `原式：\\( ${a}${v} ${lin(b)} ${op} ${c} \\)`, hide: false },
                    { text: `移項：\\( ${a}${v} ${op} ${c - b} \\)`, hide: false },
                    { text: `同除以 ${a}：\\( ${v} ${op} ${root} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${op} ${root}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${flip(op)} ${root}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                    { text: W(`${v} ${op} ${fr(c + b, a)}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }
                ];

            } else if (type === 3) {
                // T4 ×÷負數變號
                let a = ri(2, 6), root = ri(-6, 6), c = -a * root;
                let newOp = flip(op);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( -${a}${v} ${op} ${c} \\)</div>`;
                steps = [
                    { text: `原式：\\( -${a}${v} ${op} ${c} \\)`, hide: false },
                    { text: `兩邊同除以負數 -${a}，<b>不等號轉向</b>：\\( ${v} ${newOp} ${root} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${newOp} ${root}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${op} ${root}`), isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: W(`${v} ${newOp} ${-root}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }
                ];

            } else {
                // T5 兩步含負係數變號
                let a = ri(2, 6), b = ri(-8, 8), root = ri(-5, 6), c = -a * root + b;
                let newOp = flip(op);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( ${b} - ${a}${v} ${op} ${c} \\)</div>`;
                steps = [
                    { text: `原式：\\( ${b} - ${a}${v} ${op} ${c} \\)`, hide: false },
                    { text: `移項：\\( -${a}${v} ${op} ${c - b} \\)`, hide: false },
                    { text: `同除以負數 -${a}，<b>不等號轉向</b>：\\( ${v} ${newOp} ${root} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${newOp} ${root}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${op} ${root}`), isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: W(`${v} ${newOp} ${fr(c + b, -a)}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }
                ];
            }

        // ════════════ 程度 3：括號 / 分式 / 雙邊（2-4 步） ════════════
        } else if (lvl === '3') {
            qObj.level = "⭐⭐⭐ 程度 3";
            let op = pick(ops);

            if (type === 0) {
                // T1 括號展開
                let a = ri(2, 5), b = ri(-5, 5) || 2, root = ri(-5, 6), c = a * (root + b);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( ${a}(${v} ${lin(b)}) ${op} ${c} \\)</div>`;
                steps = [
                    { text: `展開：\\( ${a}${v} ${lin(a * b)} ${op} ${c} \\)`, hide: false },
                    { text: `移項：\\( ${a}${v} ${op} ${c - a * b} \\)`, hide: false },
                    { text: `同除以 ${a}：\\( ${v} ${op} ${root} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${op} ${root}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${flip(op)} ${root}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                    { text: W(`${v} ${op} ${fr(c - b, a)}`), isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) }
                ];

            } else if (type === 1) {
                // T2 分式
                let a = ri(2, 5), b = ri(-6, 6), root = ri(-5, 6), c = root / a + b;
                // 確保 c 為整數
                let root2 = ri(-5, 6) * a; let cc = root2 / a + b; let rootAns = root2;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( \\frac{${v}}{${a}} ${lin(b)} ${op} ${cc} \\)</div>`;
                steps = [
                    { text: `移項：\\( \\frac{${v}}{${a}} ${op} ${cc - b} \\)`, hide: false },
                    { text: `同乘以 ${a}：\\( ${v} ${op} ${rootAns} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${op} ${rootAns}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${flip(op)} ${rootAns}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                    { text: W(`${v} ${op} ${(cc - b)}`), isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) }
                ];

            } else if (type === 2) {
                // T3 雙邊變數
                let a = ri(3, 6), c = ri(1, a - 2), b = ri(-6, 6), root = ri(-5, 6);
                // a x + b op c x + d，令 (a-c)x op d-b，x op root
                let d = (a - c) * root + b;
                let cf = (k) => k === 1 ? v : k === -1 ? `-${v}` : `${k}${v}`;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( ${a}${v} ${lin(b)} ${op} ${cf(c)} ${lin(d)} \\)</div>`;
                steps = [
                    { text: `把含 ${v} 的項移到左方：\\( ${cf(a - c)} ${op} ${d - b} \\)`, hide: false },
                    { text: `同除以 ${a - c}：\\( ${v} ${op} ${root} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${op} ${root}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${flip(op)} ${root}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                    { text: W(`${v} ${op} ${root + pick([-2, 2])}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }
                ];

            } else if (type === 3) {
                // T4 含負分式變號：(b - a x)/k op c
                let k = ri(2, 4), a = ri(2, 5), b = ri(-6, 6), root = ri(-5, 5), c = (b - a * root) / k;
                // 確保 c 整數
                let rootN = ri(-5, 5); let cN = (b - a * rootN); if (cN % k !== 0) { /* 調整 b */ }
                // 重新建構保證整除
                let cc = ri(-5, 5); let bb = cc * k + a * root; // (bb - a root)/k = cc
                let newOp = flip(op);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解下列不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( \\frac{${bb} - ${a}${v}}{${k}} ${op} ${cc} \\)</div>`;
                steps = [
                    { text: `同乘以 ${k}：\\( ${bb} - ${a}${v} ${op} ${cc * k} \\)`, hide: false },
                    { text: `移項：\\( -${a}${v} ${op} ${cc * k - bb} \\)`, hide: false },
                    { text: `同除以負數 -${a}，<b>轉向</b>：\\( ${v} ${newOp} ${root} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${newOp} ${root}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${op} ${root}`), isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: W(`${v} ${newOp} ${fr(cc * k - bb, a)}`), isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) }
                ];

            } else {
                // T5 求最大/最小整數解（簡單型）
                let a = ri(2, 4), root = ri(2, 8), b = ri(-6, 6), c = a * root + b;
                let askMax = (op === '<' || op === '\\le');
                let ansInt = op === '<' ? root - 1 : op === '\\le' ? root : op === '>' ? root + 1 : root;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求滿足不等式 \\( ${a}${v} ${lin(b)} ${op} ${c} \\) 的<b>${askMax ? '最大' : '最小'}整數</b>。</div>`;
                steps = [
                    { text: `移項：\\( ${a}${v} ${op} ${c - b} \\)`, hide: false },
                    { text: `同除以 ${a}：\\( ${v} ${op} ${root} \\)`, hide: false },
                    { text: `${askMax ? '最大' : '最小'}整數為 ${ansInt}。`, hide: false }
                ];
                opts = [
                    { text: W(`${ansInt}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${root}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: W(`${ansInt + (askMax ? 1 : -1)}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: W(`${ansInt + (askMax ? -1 : 1)}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) }
                ];
            }

        // ════════════ 程度 4：高中 / DSE ════════════
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4";

            if (type === 0) {
                // T1 幾何應用：周界建立不等式求範圍
                let shape = pick([{ n: 3, name: '等邊三角形' }, { n: 4, name: '正方形' }]);
                let cond = pick([{ w: '至少為', o: '\\ge' }, { w: '不超過', o: '\\le' }, { w: '超過', o: '>' }, { w: '少於', o: '<' }]);
                let root = ri(2, 9), k = shape.n * root;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">一個${shape.name}的周界${cond.w} \\( ${k} \\) cm。設每邊長度為 \\( ${v} \\) cm，求 \\( ${v} \\) 的取值範圍。</div>`;
                steps = [
                    { text: `周界 \\( = ${shape.n}${v} \\)`, hide: false },
                    { text: `建立不等式：\\( ${shape.n}${v} ${cond.o} ${k} \\)`, hide: false },
                    { text: `同除以 ${shape.n}：\\( ${v} ${cond.o} ${root} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} ${cond.o} ${root}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} ${flip(cond.o)} ${root}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                    { text: W(`${v} ${cond.o} ${k}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) },
                    { text: W(`${v} ${cond.o} ${shape.n * k}`), isCorrect: false, hint: _siWrapHint(msgIneqMove, _siBuildEq(steps)) }
                ];

            } else if (type === 1) {
                // T2 不等式性質推導判斷
                let variant = ri(0, 2);
                if (variant === 0) {
                    qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">已知 \\( a > b \\) 且 \\( k < 0 \\)，下列何者<b>必為正確</b>？<br>I. \\( \\frac{a}{k} < \\frac{b}{k} \\)<br>II. \\( a - k > b - k \\)<br>III. \\( ak^2 > bk^2 \\)</div>`;
                    steps = [
                        { text: `I：同除負數 \\( k \\) 要變號，\\( \\frac{a}{k} < \\frac{b}{k} \\) 正確。`, hide: false },
                        { text: `II：兩邊同減 \\( k \\) 不變號，\\( a - k > b - k \\) 正確。`, hide: false },
                        { text: `III：\\( k^2 > 0 \\)，同乘正數不變號，\\( ak^2 > bk^2 \\) 正確。`, hide: false }
                    ];
                    opts = [
                        { text: `I、II 及 III`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                        { text: `只有 I 及 II`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                        { text: `只有 II 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                        { text: `只有 I 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) }
                    ];
                } else if (variant === 1) {
                    qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">已知 \\( a < b < 0 \\)，下列何者<b>必為正確</b>？<br>I. \\( a^2 > b^2 \\)<br>II. \\( \\frac{1}{a} > \\frac{1}{b} \\)<br>III. \\( a + b > 0 \\)</div>`;
                    steps = [
                        { text: `I：負數中絕對值較大者平方較大，\\( a^2 > b^2 \\) 正確。`, hide: false },
                        { text: `II：同號且 \\( a < b \\)，倒數方向反轉，\\( \\frac{1}{a} > \\frac{1}{b} \\) 正確。`, hide: false },
                        { text: `III：兩負數之和必為負，\\( a + b < 0 \\)，III 錯誤。`, hide: false }
                    ];
                    opts = [
                        { text: `只有 I 及 II`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                        { text: `只有 I 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                        { text: `只有 II 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                        { text: `I、II 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) }
                    ];
                } else {
                    qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">已知 \\( x > y > 0 \\)，下列何者<b>必為正確</b>？<br>I. \\( -x < -y \\)<br>II. \\( x^2 > y^2 \\)<br>III. \\( \\frac{1}{x} < \\frac{1}{y} \\)</div>`;
                    steps = [
                        { text: `I：同乘 -1 變號，\\( -x < -y \\) 正確。`, hide: false },
                        { text: `II：正數中較大者平方較大，\\( x^2 > y^2 \\) 正確。`, hide: false },
                        { text: `III：同號正數倒數方向反轉，\\( \\frac{1}{x} < \\frac{1}{y} \\) 正確。`, hide: false }
                    ];
                    opts = [
                        { text: `I、II 及 III`, isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                        { text: `只有 I 及 II`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                        { text: `只有 II 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) },
                        { text: `只有 I 及 III`, isCorrect: false, hint: _siWrapHint(msgIneqProp, _siBuildEq(steps)) }
                    ];
                }

            } else if (type === 2) {
                // T3 求極端整數解（雙邊）
                let c = ri(2, 4), a = c + pick([1, 2]), b = ri(6, 15), d = ri(1, 5);
                let L = (b - d) / (a - c), guard = 0;
                while ((L <= 1.5 || L >= 9) && guard < 50) { b = ri(6, 15); d = ri(1, 5); L = (b - d) / (a - c); guard++; }
                let maxInt = Number.isInteger(L) ? L - 1 : Math.floor(L);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求滿足不等式 \\( ${a}${v} - ${b} < ${c}${v} - ${d} \\) 的<b>最大整數</b>。</div>`;
                steps = [
                    { text: `移項：\\( ${a - c}${v} < ${b - d} \\)`, hide: false },
                    { text: `同除以 ${a - c}：\\( ${v} < ${fr(b - d, a - c)} \\)`, hide: false },
                    { text: `最大整數為 ${maxInt}。`, hide: false }
                ];
                opts = [
                    { text: W(`${maxInt}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${maxInt + 1}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: W(`${maxInt - 1}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: W(`${maxInt + 2}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) }
                ];

            } else if (type === 3) {
                // T4 三個分式不等式
                let dSet = pick([{ d1: 2, d2: 3, d3: 4, L: 12 }, { d1: 3, d2: 4, d3: 6, L: 12 }, { d1: 2, d2: 5, d3: 10, L: 10 }]);
                let m1 = dSet.L / dSet.d1, m2 = dSet.L / dSet.d2, m3 = dSet.L / dSet.d3;
                let A = ri(1, 2), C = ri(2, 3), E = ri(1, 2);
                while (m1 * A - m2 * C - m3 * E >= 0) C++;
                let coeffX = m1 * A - m2 * C - m3 * E;
                let B = ri(1, 5), D = ri(1, 5), F = ri(1, 5);
                let isP1 = Math.random() > 0.5, isP3 = Math.random() > 0.5;
                let s1 = isP1 ? '+' : '-', s3 = isP3 ? '+' : '-';
                let strF1 = A === 1 ? `\\frac{${v} ${s1} ${B}}{${dSet.d1}}` : `\\frac{${A}${v} ${s1} ${B}}{${dSet.d1}}`;
                let strF2 = C === 1 ? `\\frac{${v} - ${D}}{${dSet.d2}}` : `\\frac{${C}${v} - ${D}}{${dSet.d2}}`;
                let strF3 = E === 1 ? `\\frac{${v} ${s3} ${F}}{${dSet.d3}}` : `\\frac{${E}${v} ${s3} ${F}}{${dSet.d3}}`;
                let B_term = isP1 ? m1 * B : -m1 * B, D_term = m2 * D, F_term = isP3 ? m3 * F : -m3 * F;
                let rhsConst = F_term - B_term - D_term;
                let num = rhsConst, den = coeffX;
                if (den < 0) { num = -num; den = -den; }
                let g = gcd(Math.abs(num), Math.abs(den)) || 1; num /= g; den /= g;
                let ansStr = den === 1 ? `${num}` : `\\frac{${num}}{${den}}`;
                let wrongRhs = F_term - B_term - (-m2 * D), wNum = wrongRhs, wDen = coeffX;
                if (wDen < 0) { wNum = -wNum; wDen = -wDen; } let wg = gcd(Math.abs(wNum), Math.abs(wDen)) || 1; wNum /= wg; wDen /= wg;
                let wAns = wDen === 1 ? `${wNum}` : `\\frac{${wNum}}{${wDen}}`;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">解不等式：</div><div class="text-xl font-bold text-indigo-700 py-2">\\( ${strF1} - ${strF2} \\ge ${strF3} \\)</div>`;
                steps = [
                    { text: `兩邊同乘最小公倍數 ${dSet.L}，展開（注意 \\(-(${C === 1 ? '' : C}${v}-${D})\\) 的負號分配）。`, hide: false },
                    { text: `化簡：\\( ${coeffX}${v} \\ge ${rhsConst} \\)`, hide: false },
                    { text: `同除以負數 ${coeffX}，<b>轉向</b>：\\( ${v} \\le ${ansStr} \\)`, hide: false }
                ];
                opts = [
                    { text: W(`${v} \\le ${ansStr}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${v} \\ge ${ansStr}`), isCorrect: false, hint: _siWrapHint(msgSimpleIneqSign, _siBuildEq(steps)) },
                    { text: W(`${v} \\le ${wAns}`), isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) },
                    { text: W(`${v} \\ge ${wAns}`), isCorrect: false, hint: _siWrapHint(msgIneqFrac, _siBuildEq(steps)) }
                ];

            } else {
                // T5 生活應用：預算最多件數
                let p = pick([7, 8, 12, 15, 18, 24, 35]), nMax = ri(5, 15), M = p * nMax + ri(1, p - 1);
                let ans = Math.floor(M / p);
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">${pick(['小明', '小麗', '志強'])}有 \\( \\$${M} \\)。若每件物品售價為 \\( \\$${p} \\)，他最多可購買多少件物品？</div>`;
                steps = [
                    { text: `設購買 \\( ${v} \\) 件：\\( ${p}${v} \\le ${M} \\)`, hide: false },
                    { text: `同除以 ${p}：\\( ${v} \\le ${fr(M, p)} \\)`, hide: false },
                    { text: `最多可購買 ${ans} 件。`, hide: false }
                ];
                opts = [
                    { text: W(`${ans}`), isCorrect: true, hint: _siWrapHint(msgCorrect, _siBuildEq(steps)) },
                    { text: W(`${ans + 1}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: W(`${Math.ceil(M / p)}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) },
                    { text: W(`${ans - 1}`), isCorrect: false, hint: _siWrapHint(msgIneqInt, _siBuildEq(steps)) }
                ];
            }
        }

        finalize(qObj, opts, steps);
        bank.push(qObj);
    }
    return bank;
}
