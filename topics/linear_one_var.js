// js/topics/linear_one_var.js
// 一元一次方程（4.1 解方程｜4.2 列方程解應用題）
// 每程度 12 款。程度1 一步｜程度2 兩步｜程度3 雙邊/分式/應用(2-4步)｜程度4 高中/DSE
// 含 SVG 圖形生成（長方形面積/周界、三角形面積）

// ==========================================
// 錯誤提示訊息
// ==========================================
const msgLeMove = `<div class="text-red-600 font-bold text-lg mb-1">❗ 移項錯誤</div><div class="text-sm text-slate-500 mb-2">把一項移到等號另一邊時，要變號（加變減、減變加）。</div>`;
const msgLeDiv = `<div class="text-red-600 font-bold text-lg mb-1">❗ 同除係數錯誤</div><div class="text-sm text-slate-500 mb-2">同除以負係數時數值的正負號要正確。</div>`;
const msgLeBracket = `<div class="text-red-600 font-bold text-lg mb-1">❗ 展開括號錯誤</div><div class="text-sm text-slate-500 mb-2">展開時括號外的數要乘進每一項；前面是負號時各項都要變號。</div>`;
const msgLeFrac = `<div class="text-red-600 font-bold text-lg mb-1">❗ 處理分母錯誤</div><div class="text-sm text-slate-500 mb-2">同乘分母時，整條等式（包括另一邊每一項）都要乘。</div>`;
const msgLeSetup = `<div class="text-red-600 font-bold text-lg mb-1">❗ 列方程錯誤</div><div class="text-sm text-slate-500 mb-2">先用未知數表示各數量，再根據題意建立等式。</div>`;
const msgLeCalc = `<div class="text-red-600 font-bold text-lg mb-1">❗ 計算錯誤</div>`;

// ─── 格式化輔助 ───
function _le1Fr(n, d) {
    if (d < 0) { n = -n; d = -d; }
    let g = gcd(Math.abs(n), Math.abs(d)) || 1; n /= g; d /= g;
    return d === 1 ? `${n}` : `\\frac{${n}}{${d}}`;
}
function _le1Aligned(eqs) {
    const lines = eqs.map(eq => {
        const m = eq.match(/^([\s\S]*?)\s*=\s*([\s\S]*)$/);
        return m ? `${m[1]} &= ${m[2]}` : `& ${eq}`;
    });
    return `\\[ \\begin{aligned} ${lines.join(' \\\\ ')} \\end{aligned} \\]`;
}
function _le1Details(inner) {
    return `
    <details class="group my-2">
        <summary class="cursor-pointer text-indigo-500 hover:text-indigo-700 font-bold text-sm select-none flex items-center gap-1 outline-none ml-1">
            <svg class="w-5 h-5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            查看詳細步驟
        </summary>
        <div class="mt-2 pl-5 border-l-2 border-indigo-200 overflow-x-auto math-scroll">${inner}</div>
    </details>`;
}
// 長方形 SVG（底邊標籤、右邊標籤）
function _le1Rect(wLabel, hLabel) {
    return `<div class="flex justify-center my-3"><svg width="200" height="130" viewBox="0 0 200 130">
        <rect x="40" y="14" width="100" height="82" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
        <text x="90" y="114" font-size="13" text-anchor="middle" fill="#334155">${wLabel}</text>
        <text x="150" y="60" font-size="13" text-anchor="start" fill="#334155">${hLabel}</text>
    </svg></div>`;
}
// 直角三角形 SVG（底、高標籤）
function _le1Tri(baseLabel, hLabel) {
    return `<div class="flex justify-center my-3"><svg width="200" height="130" viewBox="0 0 200 130">
        <polygon points="40,100 150,100 40,22" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"/>
        <rect x="40" y="86" width="14" height="14" fill="none" stroke="#4f46e5" stroke-width="1.2"/>
        <text x="95" y="118" font-size="13" text-anchor="middle" fill="#334155">${baseLabel}</text>
        <text x="20" y="62" font-size="13" text-anchor="middle" fill="#334155">${hLabel}</text>
    </svg></div>`;
}

// ==========================================
// 題目生成器：一元一次方程
// ==========================================
function generateLinearOneVarQuestions(num, levelPref) {
    const bank = [];
    const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const rnz = (a, b) => { let x = 0; while (x === 0) x = ri(a, b); return x; };
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const vars = ['x', 'y', 'm', 'n', 'a', 'k', 'p', 'r', 's', 't'];
    const W = s => `\\( ${s} \\)`;
    const lin = b => b >= 0 ? `+ ${b}` : `- ${-b}`;
    // 顯示係數×變數（處理 ±1）
    const cv = (c, v) => c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`;

    const typeCount = { '1': 12, '2': 12, '3': 12, '4': 12 };
    const typeCounter = {};

    function finalize(qObj, correct, wrongs, stepHtml) {
        let opts = [{ text: correct, isCorrect: true, hint: wrapHint(msgCorrect, stepHtml) }];
        wrongs.forEach(w => opts.push({ text: w.s, isCorrect: false, hint: wrapHint(w.m || msgLeCalc, stepHtml) }));
        let seen = new Set(), uniq = [];
        for (const o of opts) { if (!seen.has(o.text) && !/NaN|Infinity|undefined/.test(o.text)) { seen.add(o.text); uniq.push(o); } }
        let bump = 1;
        while (uniq.length < 4) {
            let m = correct.match(/-?\d+/), t = m ? correct.replace(/-?\d+/, String(parseInt(m[0]) + bump)) : `\\( ${bump} \\)`;
            if (!seen.has(t)) { seen.add(t); uniq.push({ text: t, isCorrect: false, hint: wrapHint(msgLeCalc, stepHtml) }); }
            bump++;
        }
        qObj.options = shuffleArray(uniq).map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) }));
    }
    function ask(qObj, lead, eqTex, fig) {
        qObj.question = `
        <div class="mb-3 text-base sm:text-lg text-slate-600">${lead}</div>
        ${fig || ''}
        ${eqTex ? `<div class="text-xl font-bold text-indigo-700 py-2 overflow-x-auto math-scroll">${W(eqTex)}</div>` : ''}`;
    }
    // 由解 r 出發顯示「v = r」答案
    const ansEq = (v, r) => W(`${v} = ${r}`);

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref);
        if (levelPref === 'mixed') lvl = pick(['1', '2', '3', '4']);
        const TC = typeCount[lvl] || 12;
        typeCounter[lvl] = (typeCounter[lvl] || 0);
        const type = typeCounter[lvl] % TC;
        typeCounter[lvl]++;

        let qObj = { id: i + 1, topic: "一元一次方程" };
        const v = pick(vars);

        // 通用：解 ax + b = cx + d（顯示用，運算用係數）
        const solveAB = (A, B, C, D) => (D - B) / (A - C);

        // ════════════ 程度 1（12 款，1 步） ════════════
        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";

            if (type === 0) {
                // 判斷 x=k 是哪個方程的解
                let k = ri(-5, 6);
                let cands = [], guard = 0;
                while (cands.length < 10 && guard < 200) {
                    guard++;
                    let a = pick([1, 1, 2, -1, 3]), b = ri(-9, 9), c = ri(-12, 12);
                    let truth = a * k + b === c;
                    let tex = `${cv(a, v)} ${lin(b)} = ${c}`;
                    if (!cands.some(x => x.tex === tex)) cands.push({ tex, truth });
                }
                let T = cands.filter(c => c.truth), F = cands.filter(c => !c.truth);
                if (T.length === 0) { let a = pick([1, 2]); F = F.slice(0, 3); T = [{ tex: `${cv(a, v)} ${lin(3)} = ${a * k + 3}`, truth: true }]; }
                let correct = pick(T), three = shuffleArray(F).slice(0, 3);
                ask(qObj, `${W(`${v} = ${k}`)} 是下列哪一個方程的解？`);
                finalize(qObj, W(correct.tex), three.map(c => ({ s: W(c.tex), m: msgLeCalc })), _le1Details(`<div>把 ${W(`${v} = ${k}`)} 代入，只有 ${W(correct.tex)} 兩邊相等。</div>`));

            } else if (type === 1) {
                let r = rnz(-12, 12), a = rnz(2, 14); // x + a = b
                ask(qObj, '解下列方程：', `${v} + ${a} = ${r + a}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, r + 2 * a), m: msgLeMove }, { s: ansEq(v, -r), m: msgLeCalc }], _le1Details(_le1Aligned([`${v} + ${a} = ${r + a}`, `${v} = ${r + a} - ${a}`, `${v} = ${r}`])));

            } else if (type === 2) {
                let r = rnz(-12, 12), a = rnz(2, 14); // x - a = b
                ask(qObj, '解下列方程：', `${v} - ${a} = ${r - a}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, r - 2 * a), m: msgLeMove }, { s: ansEq(v, -r), m: msgLeCalc }], _le1Details(_le1Aligned([`${v} - ${a} = ${r - a}`, `${v} = ${r - a} + ${a}`, `${v} = ${r}`])));

            } else if (type === 3) {
                let r = rnz(-12, 12), a = rnz(2, 14); // a + x = b
                ask(qObj, '解下列方程：', `${a} + ${v} = ${r + a}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, r + 2 * a), m: msgLeMove }, { s: ansEq(v, a - r), m: msgLeCalc }], _le1Details(_le1Aligned([`${a} + ${v} = ${r + a}`, `${v} = ${r + a} - ${a}`, `${v} = ${r}`])));

            } else if (type === 4) {
                let r = rnz(-10, 10), a = rnz(2, 16); // a - x = b → x = a - b
                let b = a - r;
                ask(qObj, '解下列方程：', `${a} - ${v} = ${b}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeMove }, { s: ansEq(v, a + b), m: msgLeMove }], _le1Details(_le1Aligned([`${a} - ${v} = ${b}`, `-${v} = ${b} - ${a}`, `${v} = ${r}`])));

            } else if (type === 5) {
                let r = rnz(-9, 9), a = rnz(2, 9); // ax = b
                ask(qObj, '解下列方程：', `${cv(a, v)} = ${a * r}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, a * r), m: msgLeDiv }, { s: ansEq(v, -r), m: msgLeCalc }], _le1Details(_le1Aligned([`${cv(a, v)} = ${a * r}`, `${v} = \\frac{${a * r}}{${a}}`, `${v} = ${r}`])));

            } else if (type === 6) {
                let r = rnz(-9, 9), a = rnz(2, 9); // -ax = b
                ask(qObj, '解下列方程：', `${cv(-a, v)} = ${a * r}`);
                finalize(qObj, ansEq(v, -r), [{ s: ansEq(v, r), m: msgLeDiv }, { s: ansEq(v, a * r), m: msgLeDiv }], _le1Details(_le1Aligned([`${cv(-a, v)} = ${a * r}`, `${v} = \\frac{${a * r}}{-${a}}`, `${v} = ${-r}`])));

            } else if (type === 7) {
                let r = rnz(-12, 12), a = rnz(2, 9); // x/a = b
                ask(qObj, '解下列方程：', `\\frac{${v}}{${a}} = ${r}`);
                finalize(qObj, ansEq(v, a * r), [{ s: ansEq(v, r), m: msgLeFrac }, { s: ansEq(v, Math.round(r / a) || 0), m: msgLeFrac }], _le1Details(_le1Aligned([`\\frac{${v}}{${a}} = ${r}`, `${v} = ${r} \\times ${a}`, `${v} = ${a * r}`])));

            } else if (type === 8) {
                let r = rnz(-9, 9), a = rnz(2, 9); // -x/a = b
                let b = r; // -x/a = b → x = -ab... let -x/a = b, x = -a b
                ask(qObj, '解下列方程：', `-\\frac{${v}}{${a}} = ${b}`);
                finalize(qObj, ansEq(v, -a * b), [{ s: ansEq(v, a * b), m: msgLeDiv }, { s: ansEq(v, -b), m: msgLeFrac }], _le1Details(_le1Aligned([`-\\frac{${v}}{${a}} = ${b}`, `${v} = ${b} \\times (-${a})`, `${v} = ${-a * b}`])));

            } else if (type === 9) {
                let r = rnz(-12, 12), a = rnz(2, 14); // b = x + a
                ask(qObj, '解下列方程：', `${r + a} = ${v} + ${a}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, r + 2 * a), m: msgLeMove }, { s: ansEq(v, r + a), m: msgLeMove }], _le1Details(_le1Aligned([`${r + a} = ${v} + ${a}`, `${r + a} - ${a} = ${v}`, `${v} = ${r}`])));

            } else if (type === 10) {
                let r = rnz(-9, 9), a = rnz(2, 9); // b = ax
                ask(qObj, '解下列方程：', `${a * r} = ${cv(a, v)}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, a * r), m: msgLeDiv }, { s: ansEq(v, -r), m: msgLeCalc }], _le1Details(_le1Aligned([`${a * r} = ${cv(a, v)}`, `${v} = \\frac{${a * r}}{${a}}`, `${v} = ${r}`])));

            } else {
                let r = -ri(2, 12), a = rnz(2, 9); // ax = b（負解）
                ask(qObj, '解下列方程：', `${cv(a, v)} = ${a * r}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeDiv }, { s: ansEq(v, a * r), m: msgLeDiv }], _le1Details(_le1Aligned([`${cv(a, v)} = ${a * r}`, `${v} = \\frac{${a * r}}{${a}}`, `${v} = ${r}`])));
            }

        // ════════════ 程度 2（12 款，2 步） ════════════
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";

            if (type === 0) {
                let r = rnz(-9, 9), a = rnz(2, 9), b = rnz(-9, 9); // ax + b = c
                ask(qObj, '解下列方程：', `${cv(a, v)} ${lin(b)} = ${a * r + b}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, (a * r + b + b) / a % 1 === 0 ? (a * r + 2 * b) / a : -r), m: msgLeMove }, { s: ansEq(v, -r), m: msgLeCalc }], _le1Details(_le1Aligned([`${cv(a, v)} ${lin(b)} = ${a * r + b}`, `${cv(a, v)} = ${a * r + b} ${lin(-b)}`, `${cv(a, v)} = ${a * r}`, `${v} = ${r}`])));

            } else if (type === 1) {
                let r = rnz(-9, 9), a = rnz(2, 9), b = rnz(2, 9); // ax - b = c
                ask(qObj, '解下列方程：', `${cv(a, v)} - ${b} = ${a * r - b}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, r - 1), m: msgLeMove }, { s: ansEq(v, -r), m: msgLeCalc }], _le1Details(_le1Aligned([`${cv(a, v)} - ${b} = ${a * r - b}`, `${cv(a, v)} = ${a * r - b} + ${b}`, `${cv(a, v)} = ${a * r}`, `${v} = ${r}`])));

            } else if (type === 2) {
                let r = rnz(-9, 9), a = rnz(2, 6), b = rnz(2, 16); // b - ax = c
                ask(qObj, '解下列方程：', `${b} - ${cv(a, v)} = ${b - a * r}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeDiv }, { s: ansEq(v, r + 1), m: msgLeMove }], _le1Details(_le1Aligned([`${b} - ${cv(a, v)} = ${b - a * r}`, `-${cv(a, v)} = ${b - a * r} - ${b}`, `${cv(-a, v)} = ${-a * r}`, `${v} = ${r}`])));

            } else if (type === 3) {
                let r = rnz(-9, 9), a = rnz(2, 6), b = rnz(2, 30); // -b - ax = c
                ask(qObj, '解下列方程：', `-${b} - ${cv(a, v)} = ${-b - a * r}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeDiv }, { s: ansEq(v, r - 1), m: msgLeMove }], _le1Details(_le1Aligned([`-${b} - ${cv(a, v)} = ${-b - a * r}`, `-${cv(a, v)} = ${-b - a * r} + ${b}`, `${cv(-a, v)} = ${-a * r}`, `${v} = ${r}`])));

            } else if (type === 4) {
                let r = rnz(-9, 9), a = rnz(2, 8), b = rnz(-9, 9); // x/a + b = c
                ask(qObj, '解下列方程：', `\\frac{${v}}{${a}} ${lin(b)} = ${r + b}`);
                finalize(qObj, ansEq(v, a * r), [{ s: ansEq(v, r), m: msgLeFrac }, { s: ansEq(v, a * (r + 2 * b)), m: msgLeMove }], _le1Details(_le1Aligned([`\\frac{${v}}{${a}} ${lin(b)} = ${r + b}`, `\\frac{${v}}{${a}} = ${r}`, `${v} = ${r} \\times ${a}`, `${v} = ${a * r}`])));

            } else if (type === 5) {
                let r = rnz(-9, 9), a = rnz(2, 8), b = rnz(2, 12); // x/a - b = c
                ask(qObj, '解下列方程：', `\\frac{${v}}{${a}} - ${b} = ${r - b}`);
                finalize(qObj, ansEq(v, a * r), [{ s: ansEq(v, r), m: msgLeFrac }, { s: ansEq(v, a * r - b), m: msgLeFrac }], _le1Details(_le1Aligned([`\\frac{${v}}{${a}} - ${b} = ${r - b}`, `\\frac{${v}}{${a}} = ${r}`, `${v} = ${a * r}`])));

            } else if (type === 6) {
                let r = rnz(-9, 9), a = rnz(2, 8), b = rnz(2, 12); // b - x/a = c
                ask(qObj, '解下列方程：', `${b} - \\frac{${v}}{${a}} = ${b - r}`);
                finalize(qObj, ansEq(v, a * r), [{ s: ansEq(v, -a * r), m: msgLeDiv }, { s: ansEq(v, r), m: msgLeFrac }], _le1Details(_le1Aligned([`${b} - \\frac{${v}}{${a}} = ${b - r}`, `-\\frac{${v}}{${a}} = ${-r}`, `${v} = ${a * r}`])));

            } else if (type === 7) {
                let r = rnz(-9, 9), a = rnz(2, 9), b = rnz(-9, 9); // c = ax + b
                ask(qObj, '解下列方程：', `${a * r + b} = ${cv(a, v)} ${lin(b)}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeCalc }, { s: ansEq(v, r + 1), m: msgLeMove }], _le1Details(_le1Aligned([`${a * r + b} = ${cv(a, v)} ${lin(b)}`, `${a * r} = ${cv(a, v)}`, `${v} = ${r}`])));

            } else if (type === 8) {
                let r = rnz(-8, 8), a = rnz(2, 6), b = rnz(-6, 6); // a(x+b)=c
                ask(qObj, '解下列方程：', `${a}(${v} ${lin(b)}) = ${a * (r + b)}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, r + b), m: msgLeBracket }, { s: ansEq(v, a * (r + b) - b), m: msgLeBracket }], _le1Details(_le1Aligned([`${a}(${v} ${lin(b)}) = ${a * (r + b)}`, `${v} ${lin(b)} = ${r + b}`, `${v} = ${r}`])));

            } else if (type === 9) {
                let r = rnz(-8, 8), a = rnz(2, 9), b = rnz(-6, 6); // -a(x+b)=c
                ask(qObj, '解下列方程：', `-${a}(${v} ${lin(b)}) = ${-a * (r + b)}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeBracket }, { s: ansEq(v, r + b), m: msgLeBracket }], _le1Details(_le1Aligned([`-${a}(${v} ${lin(b)}) = ${-a * (r + b)}`, `${v} ${lin(b)} = ${r + b}`, `${v} = ${r}`])));

            } else if (type === 10) {
                let r = rnz(-8, 8), a = rnz(2, 9), c = rnz(2, 6), d = rnz(-9, 9); // (ax+b)/c=d
                let b = c * d - a * r;
                ask(qObj, '解下列方程：', `\\frac{${cv(a, v)} ${lin(b)}}{${c}} = ${d}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeFrac }, { s: ansEq(v, (d - b) / a % 1 === 0 ? (d - b) / a : r + 1), m: msgLeFrac }], _le1Details(_le1Aligned([`\\frac{${cv(a, v)} ${lin(b)}}{${c}} = ${d}`, `${cv(a, v)} ${lin(b)} = ${c * d}`, `${cv(a, v)} = ${a * r}`, `${v} = ${r}`])));

            } else {
                let r = rnz(-7, 7), c = rnz(2, 6), d = rnz(3, 12); // a/b = (c - x)/d  → 取 e/f = (g - x)/d
                let e = rnz(2, 8), f = rnz(2, 8); // e/f = (g - x)/d  ; (g-x) = d*e/f 需整數 → 直接設左方=K
                let K = (d * e) % f === 0 ? (d * e / f) : null;
                if (K === null) { e = 2; f = 1; K = d * 2; }
                let g = r + K; // g - x = K → x = g - K = r
                ask(qObj, '解下列方程：', `\\frac{${e}}{${f}} = \\frac{${g} - ${v}}{${d}}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeMove }, { s: ansEq(v, g + K), m: msgLeMove }], _le1Details(_le1Aligned([`\\frac{${e}}{${f}} = \\frac{${g} - ${v}}{${d}}`, `\\frac{${e}}{${f}} \\times ${d} = ${g} - ${v}`, `${K} = ${g} - ${v}`, `${v} = ${r}`])));
            }

        // ════════════ 程度 3（12 款，雙邊/分式/應用） ════════════
        } else if (lvl === '3') {
            qObj.level = "⭐⭐⭐ 程度 3";

            if (type === 0) {
                // 雙邊變數 ax+b = cx+d
                let r, A, B, C, D;
                do { A = rnz(2, 8); C = rnz(-6, 6); r = rnz(-8, 8); B = rnz(-9, 9); D = (A - C) * r + B; } while (A === C || Math.abs(D) > 40);
                ask(qObj, '解下列方程：', `${cv(A, v)} ${lin(B)} = ${cv(C, v)} ${lin(D)}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeMove }, { s: ansEq(v, r + 1), m: msgLeMove }], _le1Details(_le1Aligned([`${cv(A, v)} ${lin(B)} = ${cv(C, v)} ${lin(D)}`, `${cv(A - C, v)} = ${D - B}`, `${v} = ${r}`])));

            } else if (type === 1 || type === 2 || type === 3) {
                // 雙邊 + 括號：先揀根 r，再解出自由常數 e，保證顯示與答案一致
                let a, b, c, d, e, r, A, B, C, D, guard = 0;
                do {
                    guard++;
                    a = rnz(2, 5); c = rnz(2, 5); d = rnz(2, 4); b = rnz(-6, 6); r = rnz(-8, 8);
                    if (type === 1) { A = a; B = a * b; C = c * d; }       // a(x+b) = c(dx+e)
                    else if (type === 2) { A = -a; B = -a * b; C = c * d; } // -a(x+b) = c(dx+e)
                    else { A = a * d; B = a * b; C = c; }                   // a(dx+b) = c(x+e)
                    let need = r * (A - C) + B;                             // = c·e
                    if (A !== C && need % c === 0) { e = need / c; D = c * e; } else { e = null; }
                } while (e === null || Math.abs(e) > 30 || guard > 300);
                let qStr = (type === 1) ? `${a}(${v} ${lin(b)}) = ${c}(${cv(d, v)} ${lin(e)})`
                    : (type === 2) ? `-${a}(${v} ${lin(b)}) = ${c}(${cv(d, v)} ${lin(e)})`
                        : `${a}(${cv(d, v)} ${lin(b)}) = ${c}(${v} ${lin(e)})`;
                ask(qObj, '解下列方程：', qStr);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeBracket }, { s: ansEq(v, r + 1), m: msgLeMove }], _le1Details(_le1Aligned([qStr, `${cv(A, v)} ${lin(B)} = ${cv(C, v)} ${lin(D)}`, `${cv(A - C, v)} = ${D - B}`, `${v} = ${r}`])));

            } else if (type === 4) {
                // 分式 (ax+b)/c = d（TSA）
                let r = rnz(-8, 8), a = rnz(2, 6), c = rnz(2, 5), d = rnz(-6, 6), b = c * d - a * r;
                ask(qObj, '解下列方程：', `\\frac{${cv(a, v)} ${lin(b)}}{${c}} = ${d}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeFrac }, { s: ansEq(v, r + 2), m: msgLeMove }], _le1Details(_le1Aligned([`\\frac{${cv(a, v)} ${lin(b)}}{${c}} = ${d}`, `${cv(a, v)} ${lin(b)} = ${c * d}`, `${v} = ${r}`])));

            } else if (type === 5) {
                // 分式 = 分式：先揀根 r，解出右分子常數 e，保證一致
                let r, a, b, c, d, e, f, A, B, C, D, guard = 0;
                do {
                    guard++; a = rnz(2, 5); c = rnz(2, 4); d = rnz(2, 5); f = rnz(2, 4); r = rnz(-6, 6); b = rnz(-6, 6);
                    A = f * a; C = c * d; B = f * b; D = (A - C) * r + B; e = D / c;
                } while (A === C || !Number.isInteger(e) || Math.abs(e) > 20 || guard > 200);
                ask(qObj, '解下列方程：', `\\frac{${cv(a, v)} ${lin(b)}}{${c}} = \\frac{${cv(d, v)} ${lin(e)}}{${f}}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeFrac }, { s: ansEq(v, r + 1), m: msgLeMove }], _le1Details(_le1Aligned([`\\frac{${cv(a, v)} ${lin(b)}}{${c}} = \\frac{${cv(d, v)} ${lin(e)}}{${f}}`, `${f}(${cv(a, v)} ${lin(b)}) = ${c}(${cv(d, v)} ${lin(e)})`, `${cv(A - C, v)} = ${D - B}`, `${v} = ${r}`])));

            } else if (type === 6) {
                // 公式代入求未知 r=(s-7)/4
                let a = rnz(2, 6), b = rnz(-9, 9), rv = rnz(-6, 6); // r = (s + b)/a → s = a r - b
                let s = a * rv - b;
                ask(qObj, `已知公式 ${W(`R = \\frac{S ${lin(b)}}{${a}}`)}。若 ${W(`R = ${rv}`)}，求 ${W('S')} 的值。`);
                finalize(qObj, W(`S = ${s}`), [{ s: W(`S = ${a * rv + b}`), m: msgLeMove }, { s: W(`S = ${rv}`), m: msgLeFrac }], _le1Details(_le1Aligned([`${rv} = \\frac{S ${lin(b)}}{${a}}`, `${rv} \\times ${a} = S ${lin(b)}`, `S = ${s}`])));

            } else if (type === 7) {
                // 應用：找錢 1000 - x = change
                let pay = pick([100, 200, 500, 1000]), change = ri(20, pay - 20), cost = pay - change;
                ask(qObj, `${pick(['雪鈴', '志浩', '文欣'])}以一張 ${W(`\\$${pay}`)} 紙幣購物並找回 ${W(`\\$${change}`)}。求所購物品的價錢。`);
                finalize(qObj, W(`\\$${cost}`), [{ s: W(`\\$${pay + change}`), m: msgLeMove }, { s: W(`\\$${change}`), m: msgLeSetup }], _le1Details(_le1Aligned([`\\text{設價錢為 } x`, `${pay} - x = ${change}`, `x = ${pay} - ${change} = ${cost}`])));

            } else if (type === 8) {
                // 應用：比例/分數 (p/q)x = n
                let q = pick([15, 12, 10, 20]), p = rnz(2, q - 1); let g = gcd(p, q); let pp = p / g, qq = q / g;
                let xVal = pick([2, 3, 4, 5]) * qq, n = pp * xVal / qq * 1; n = pp * (xVal / qq);
                // 確保整數
                xVal = qq * ri(3, 9); n = pp * (xVal / qq);
                ask(qObj, `某盒物件中，有 ${W(`\\frac{${pp}}{${qq}}`)} 未通過檢測。若有 ${W(`${n}`)} 件未通過，求盒中物件總數。`);
                finalize(qObj, W(`${xVal}`), [{ s: W(`${n}`), m: msgLeSetup }, { s: W(`${Math.round(n * pp / qq)}`), m: msgLeFrac }], _le1Details(_le1Aligned([`\\frac{${pp}}{${qq}}x = ${n}`, `x = ${n} \\times \\frac{${qq}}{${pp}}`, `x = ${xVal}`])));

            } else if (type === 9) {
                // 應用：距離倍數 3x - 2 = total
                let r = ri(2, 12), a = ri(2, 4), b = ri(1, 5), total = a * r - b;
                ask(qObj, `${pick(['志峰', '小明'])}跑了 ${W(`${v}`)} km。${pick(['子浩', '阿強'])}所跑的距離比${pick(['前者'])}的 ${W(`${a}`)} 倍少 ${W(`${b}`)} km。若後者跑了 ${W(`${total}`)} km，求 ${W(v)} 的值。`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, (total - b) / a % 1 === 0 ? (total - b) / a : r + 1), m: msgLeSetup }, { s: ansEq(v, total), m: msgLeSetup }], _le1Details(_le1Aligned([`${cv(a, v)} - ${b} = ${total}`, `${cv(a, v)} = ${total + b}`, `${v} = ${r}`])));

            } else if (type === 10) {
                // 公式代入求值 y = ax + b（求 y）
                let a = rnz(2, 8), b = rnz(-9, 9), xv = rnz(-6, 6), yv = a * xv + b;
                ask(qObj, `已知公式 ${W(`Y = ${cv(a, 'X')} ${lin(b)}`)}。若 ${W(`X = ${xv}`)}，求 ${W('Y')} 的值。`);
                finalize(qObj, W(`Y = ${yv}`), [{ s: W(`Y = ${a * xv - b}`), m: msgLeCalc }, { s: W(`Y = ${a + xv + b}`), m: msgLeCalc }], _le1Details(_le1Aligned([`Y = ${cv(a, 'X')} ${lin(b)}`, `Y = ${a}(${xv}) ${lin(b)}`, `Y = ${yv}`])));

            } else {
                // 🖼️ 圖形：長方形面積 A=(x-b)·y
                let b = ri(2, 8), y = ri(6, 14), w = ri(2, 12), x = w + b, A = w * y;
                ask(qObj, `下圖長方形的長度為 ${W(`${y}`)} cm、闊度為 ${W(`(${v} - ${b})`)} cm，面積為 ${W(`${A} \\text{ cm}^2`)}。求 ${W(v)} 的值。`, '', _le1Rect(`(${v} − ${b}) cm`, `${y} cm`));
                finalize(qObj, ansEq(v, x), [{ s: ansEq(v, w), m: msgLeSetup }, { s: ansEq(v, A / y - b + 2 * b), m: msgLeMove }], _le1Details(_le1Aligned([`(${v} - ${b}) \\times ${y} = ${A}`, `${v} - ${b} = ${w}`, `${v} = ${x}`])));
            }

        // ════════════ 程度 4（12 款，高中/DSE） ════════════
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4";

            if (type === 0) {
                // 應用：比賽得分 5x + 3(n - x) = total
                let win = ri(8, 16), draw = ri(3, 12), n = win + draw, total = 5 * win + 3 * draw;
                ask(qObj, `在一個比賽中，勝出一局得 ${W('5')} 分、平手得 ${W('3')} 分、輸掉得 ${W('0')} 分。一名勝出者玩了 ${W(`${n}`)} 局並共得 ${W(`${total}`)} 分（沒有輸掉任何一局）。求勝出的局數。`);
                finalize(qObj, W(`${win}`), [{ s: W(`${draw}`), m: msgLeSetup }, { s: W(`${n - win}`), m: msgLeSetup }], _le1Details(_le1Aligned([`5x + 3(${n} - x) = ${total}`, `5x + ${3 * n} - 3x = ${total}`, `2x = ${total - 3 * n}`, `x = ${win}`])));

            } else if (type === 1) {
                // 應用：物件轉移後相等
                let total = pick([100, 150, 200, 270]), give = ri(15, 40);
                let x = (total - 2 * give) / 2; // (total - x) - give = x + give → x = (total - 2give)/2
                if (!Number.isInteger(x)) { give = 2 * Math.floor(give / 2); x = (total - 2 * give) / 2; }
                let other = total - x;
                ask(qObj, `甲乙兩人共有 ${W(`${total}`)} 件物品。若甲給了乙 ${W(`${give}`)} 件後，二人的數目相同。求甲原有的件數。`);
                finalize(qObj, W(`${other}`), [{ s: W(`${x}`), m: msgLeSetup }, { s: W(`${total / 2}`), m: msgLeSetup }], _le1Details(_le1Aligned([`\\text{設乙原有 } x \\text{ 件，甲有 } ${total} - x`, `(${total} - x) - ${give} = x + ${give}`, `${total - 2 * give} = 2x`, `x = ${x}, \\text{甲} = ${other}`])));

            } else if (type === 2) {
                // 應用：年齡列式（TSA MC，揀正確方程）
                let frac = pick([['3', '8'], ['5', '9'], ['2', '7']]), yrs = ri(4, 8), age = ri(15, 25);
                ask(qObj, `${pick(['偉豪', '家琪'])}的爸爸現年 ${W('p')} 歲。${W(`${yrs}`)} 年後，他/她的年齡是爸爸的 ${W(`\\frac{${frac[0]}}{${frac[1]}}`)}。若他/她現年 ${W(`${age}`)} 歲，下列哪一個方程可求出 ${W('p')}？`);
                let correct = `\\frac{${frac[0]}}{${frac[1]}}(p + ${yrs}) - ${yrs} = ${age}`;
                finalize(qObj, W(correct), [
                    { s: W(`\\frac{${frac[0]}}{${frac[1]}}p + ${yrs} = ${age}`), m: msgLeSetup },
                    { s: W(`\\frac{${frac[0]}}{${frac[1]}}(p + ${yrs}) = ${age}`), m: msgLeSetup },
                    { s: W(`\\frac{${frac[0]}}{${frac[1]}}(p - ${yrs}) - ${yrs} = ${age}`), m: msgLeSetup }
                ], _le1Details(`<div>${W(`${yrs}`)} 年後爸爸 ${W(`(p + ${yrs})`)} 歲，其 ${W(`\\frac{${frac[0]}}{${frac[1]}}`)} 即該人 ${W(`${yrs}`)} 年後年齡；減回 ${W(`${yrs}`)} 得現齡 ${W(`${age}`)}。</div>`));

            } else if (type === 3) {
                // 公式代入（含 π 分數）半圓周界 P=(π+2)r，π=22/7
                let r = pick([7, 14, 21, 28]), P = (22 / 7 + 2) * r; // = 36/7 * r
                P = 36 * r / 7;
                ask(qObj, `半徑為 ${W('r')} cm 的半圓周界 ${W('P')} cm 由 ${W('P = (\\pi + 2)r')} 求得。若 ${W(`P = ${P}`)} cm，求 ${W('r')}（取 ${W('\\pi = \\frac{22}{7}')}）。`);
                finalize(qObj, W(`r = ${r}`), [{ s: W(`r = ${Math.round(P / 2)}`), m: msgLeFrac }, { s: W(`r = ${P}`), m: msgLeSetup }], _le1Details(_le1Aligned([`${P} = (\\frac{22}{7} + 2)r`, `${P} = \\frac{36}{7}r`, `r = ${P} \\times \\frac{7}{36}`, `r = ${r}`])));

            } else if (type === 4) {
                // 🖼️ 圖形：長方形周界 2(x + W) = P
                let W2 = ri(3, 12), x = ri(5, 18), P = 2 * (x + W2);
                ask(qObj, `下圖長方形的長為 ${W(`${v}`)} cm、闊為 ${W(`${W2}`)} cm，周界為 ${W(`${P}`)} cm。求 ${W(v)} 的值。`, '', _le1Rect(`${v} cm`, `${W2} cm`));
                finalize(qObj, ansEq(v, x), [{ s: ansEq(v, P / 2), m: msgLeBracket }, { s: ansEq(v, P - W2), m: msgLeSetup }], _le1Details(_le1Aligned([`2(${v} + ${W2}) = ${P}`, `${v} + ${W2} = ${P / 2}`, `${v} = ${x}`])));

            } else if (type === 5) {
                // 雙邊含分式 (ax+b)/c = (dx+e)/f
                let r, a, b, c, d, e, f, guard = 0, A, B, C, D;
                do {
                    guard++; a = rnz(2, 5); c = rnz(2, 4); d = rnz(2, 5); f = rnz(2, 4); r = rnz(-6, 6); b = rnz(-6, 6);
                    A = f * a; C = c * d; B = f * b;
                    D = (A - C) * r + B; e = D / c;
                } while (A === C || !Number.isInteger(e) || guard > 200);
                ask(qObj, '解下列方程：', `\\frac{${cv(a, v)} ${lin(b)}}{${c}} = \\frac{${cv(d, v)} ${lin(e)}}{${f}}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeFrac }, { s: ansEq(v, r + 1), m: msgLeMove }], _le1Details(_le1Aligned([`\\frac{${cv(a, v)} ${lin(b)}}{${c}} = \\frac{${cv(d, v)} ${lin(e)}}{${f}}`, `${f}(${cv(a, v)} ${lin(b)}) = ${c}(${cv(d, v)} ${lin(e)})`, `${cv(A - C, v)} = ${D - B}`, `${v} = ${r}`])));

            } else if (type === 6) {
                // 多分式通分 x/a + x/b = c
                let a = pick([2, 3, 4]), b = pick([3, 4, 6]); while (b === a) b = pick([3, 4, 6]);
                let L = a * b / gcd(a, b), coef = L / a + L / b; // (x)(1/a+1/b)= c ; x*(L/a+L/b)/L = c
                let r = rnz(-6, 6) * L / gcd(L, coef); // 確保整數
                let xVal = L * rnz(1, 4); // 取 x 為 L 的倍數確保整除
                let cVal = xVal / a + xVal / b;
                ask(qObj, '解下列方程：', `\\frac{${v}}{${a}} + \\frac{${v}}{${b}} = ${cVal}`);
                finalize(qObj, ansEq(v, xVal), [{ s: ansEq(v, cVal), m: msgLeFrac }, { s: ansEq(v, xVal + L), m: msgLeCalc }], _le1Details(_le1Aligned([`\\frac{${v}}{${a}} + \\frac{${v}}{${b}} = ${cVal}`, `\\frac{${L / a}${v} + ${L / b}${v}}{${L}} = ${cVal}`, `${coef}${v} = ${cVal * L}`, `${v} = ${xVal}`])));

            } else if (type === 7) {
                // 應用：連續整數
                let n = ri(8, 30), sum = n + (n + 1) + (n + 2);
                ask(qObj, `三個連續整數之和為 ${W(`${sum}`)}。求最小的整數。`);
                finalize(qObj, W(`${n}`), [{ s: W(`${n + 1}`), m: msgLeSetup }, { s: W(`${Math.round(sum / 3)}`), m: msgLeSetup }], _le1Details(_le1Aligned([`x + (x+1) + (x+2) = ${sum}`, `3x + 3 = ${sum}`, `x = ${n}`])));

            } else if (type === 8) {
                // 含雙層括號 a[b(x+c)+d]=e
                let r = rnz(-5, 5), a = rnz(2, 3), b = rnz(2, 3), c = rnz(-4, 4), d = rnz(-6, 6);
                let e = a * (b * (r + c) + d);
                ask(qObj, '解下列方程：', `${a}[${b}(${v} ${lin(c)}) ${lin(d)}] = ${e}`);
                finalize(qObj, ansEq(v, r), [{ s: ansEq(v, -r), m: msgLeBracket }, { s: ansEq(v, r + 1), m: msgLeBracket }], _le1Details(_le1Aligned([`${a}[${b}(${v} ${lin(c)}) ${lin(d)}] = ${e}`, `${b}(${v} ${lin(c)}) ${lin(d)} = ${e / a}`, `${b}(${v} ${lin(c)}) = ${e / a - d}`, `${v} ${lin(c)} = ${r + c}`, `${v} = ${r}`])));

            } else if (type === 9) {
                // 逆向：已知解求係數 ax + b = c，解為 k，求 a
                let k = rnz(-6, 6), a = rnz(2, 9), b = rnz(-9, 9), c = a * k + b;
                ask(qObj, `已知方程 ${W(`${v}x ${lin(b)} = ${c}`.replace(`${v}x`, `a${v}`))} 的解為 ${W(`${v} = ${k}`)}（其中 ${W('a')} 為常數）。求 ${W('a')} 的值。`);
                // 修正顯示
                ask(qObj, `已知方程 ${W(`a${v} ${lin(b)} = ${c}`)} 的解為 ${W(`${v} = ${k}`)}（${W('a')} 為常數）。求 ${W('a')} 的值。`);
                finalize(qObj, W(`a = ${a}`), [{ s: W(`a = ${-a}`), m: msgLeDiv }, { s: W(`a = ${c - b}`), m: msgLeSetup }], _le1Details(_le1Aligned([`a(${k}) ${lin(b)} = ${c}`, `${k}a = ${c - b}`, `a = ${a}`])));

            } else if (type === 10) {
                // 應用：混合分配（兩種票價）
                let pA = pick([20, 30, 50]), pB = pick([60, 80, 100]); while (pB <= pA) pB = pick([60, 80, 100]);
                let nTotal = ri(20, 50), nA = ri(5, nTotal - 5), nB = nTotal - nA, totalCost = pA * nA + pB * nB;
                ask(qObj, `某場共售出 ${W(`${nTotal}`)} 張票，每張票售 ${W(`\\$${pA}`)} 或 ${W(`\\$${pB}`)}，總收入為 ${W(`\\$${totalCost}`)}。求售出 ${W(`\\$${pA}`)} 票的張數。`);
                finalize(qObj, W(`${nA}`), [{ s: W(`${nB}`), m: msgLeSetup }, { s: W(`${nTotal - nA - 2}`), m: msgLeCalc }], _le1Details(_le1Aligned([`${pA}x + ${pB}(${nTotal} - x) = ${totalCost}`, `${pA - pB}x = ${totalCost - pB * nTotal}`, `x = ${nA}`])));

            } else {
                // 🖼️ 圖形：三角形面積 ½ · x · h = A
                let h = pick([4, 6, 8, 10]), x = ri(4, 16); let A = x * h / 2;
                ask(qObj, `下圖直角三角形的底為 ${W(`${v}`)} cm、高為 ${W(`${h}`)} cm，面積為 ${W(`${A} \\text{ cm}^2`)}。求 ${W(v)} 的值。`, '', _le1Tri(`${v} cm`, `${h} cm`));
                finalize(qObj, ansEq(v, x), [{ s: ansEq(v, A / h), m: msgLeBracket }, { s: ansEq(v, 2 * A), m: msgLeSetup }], _le1Details(_le1Aligned([`\\frac{1}{2} \\times ${v} \\times ${h} = ${A}`, `${h / 2}${v} = ${A}`, `${v} = ${x}`])));
            }
        }

        bank.push(qObj);
    }
    return bank;
}
