// js/topics/factorization_s3.js
// S3 因式分解（中三或以上，含十字相乘）
// 程度1 重溫基礎(混合)｜程度2 十字相乘 一元二次 a=1｜程度3 十字相乘 一元二次 a>1｜程度4 十字相乘 二元二次

// ==========================================
// 專屬錯誤提示訊息（前綴 S3，避免與 S2 撞名）
// ==========================================
const msgFacS3_common = `<div class="text-red-600 font-bold text-lg mb-1">❗ 未完全提出公因式</div>`;
const msgFacS3_sign   = `<div class="text-red-600 font-bold text-lg mb-1">❗ 正負號錯誤</div>`;
const msgFacS3_cross  = `<div class="text-red-600 font-bold text-lg mb-1">❗ 十字相乘組合錯誤（中間項不符）</div>`;
const msgFacS3_iden   = `<div class="text-red-600 font-bold text-lg mb-1">❗ 平方差／完全平方恆等式運用錯誤</div>`;
const msgFacS3_group  = `<div class="text-red-600 font-bold text-lg mb-1">❗ 分組分解時配對或變號錯誤</div>`;

// ─── 格式化輔助 ───────────────────────────
function _facS3Poly(terms) {
    let s = "", first = true;
    for (const t of terms) {
        if (!t || t.c === 0) continue;
        const mag = Math.abs(t.c);
        const showCoef = !(mag === 1 && t.v && t.v.length > 0);
        const body = (showCoef ? mag : "") + (t.v || "");
        if (first) { s += (t.c < 0 ? "-" : "") + body; first = false; }
        else { s += (t.c < 0 ? " - " : " + ") + body; }
    }
    return first ? "0" : s;
}
function _facS3Lin(v, k) {
    if (k === 0) return v;
    return k > 0 ? `${v} + ${k}` : `${v} - ${Math.abs(k)}`;
}
// 單項：係數×變數（處理 ±1）
function _facS3Mono(c, v) {
    if (c === 1) return v;
    if (c === -1) return `-${v}`;
    return `${c}${v}`;
}
// 因子乘括號：c(binom)（c=1 省略、c=-1 用負號）
function _facS3Fac(c, binom) {
    if (c === 1) return `(${binom})`;
    if (c === -1) return `-(${binom})`;
    return `${c}(${binom})`;
}
// 詳細步驟摺疊區（首行原式，其後每行 = 號於左邊對齊）
function _facS3Steps(lines) {
    const rows = lines.map((l, i) => (i === 0 ? `& ${l}` : `&= ${l}`));
    const block = `\\[ \\begin{aligned} ${rows.join(' \\\\ ')} \\end{aligned} \\]`;
    return `
    <details class="group my-2">
        <summary class="cursor-pointer text-indigo-500 hover:text-indigo-700 font-bold text-sm select-none flex items-center gap-1 outline-none ml-1">
            <svg class="w-5 h-5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            查看詳細步驟
        </summary>
        <div class="mt-2 pl-5 border-l-2 border-indigo-200 overflow-x-auto math-scroll">${block}</div>
    </details>`;
}
const _facS3Wrap = s => `\\( \\displaystyle ${s} \\)`;

// ==========================================
// 主生成器
// ==========================================
function generateFactorizationS3Questions(num, levelPref) {
    const bank = [];
    const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const sgn = () => (Math.random() < 0.5 ? 1 : -1);
    const singleVars = ['x', 'a', 'm', 'p', 't', 'y'];
    const duoPairs = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['s', 't']];
    function distinct2() { let p = pick(duoPairs); return Math.random() < 0.5 ? [p[0], p[1]] : [p[1], p[0]]; }

    // 題型按順序輪流出（每程度各 5 款）
    const typeCount = { '1': 5, '2': 5, '3': 5, '4': 5 };
    const typeCounter = {};

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref).toLowerCase();
        if (lvl === 'mixed') lvl = pick(['1', '2', '3', '4']);

        const TC = typeCount[lvl] || 5;
        typeCounter[lvl] = (typeCounter[lvl] || 0);
        const type = typeCounter[lvl] % TC;
        typeCounter[lvl]++;

        let qObj = { id: i + 1, topic: "S3 因式分解" };
        let q = "", ans = "", wrongs = [], steps = [];

        // ════════════ 程度 1：重溫基礎（混合） ════════════
        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";

            if (type === 0) {
                // T1 提取公因式：7x + 28y → 7(x + 4y)
                let g = ri(2, 9), d, e;
                do { d = ri(1, 4); e = ri(2, 6); } while (gcd(d, e) !== 1);
                let s2 = sgn();
                let [u, w] = distinct2();
                q = _facS3Poly([{ c: g * d, v: u }, { c: g * e * s2, v: w }]);
                let inner = _facS3Poly([{ c: d, v: u }, { c: e * s2, v: w }]);
                ans = `${g}(${inner})`;
                steps = [q, ans];
                wrongs = [
                    { s: `${g}(${_facS3Poly([{ c: d, v: u }, { c: -e * s2, v: w }])})`, m: msgFacS3_sign },
                    { s: `${g}(${_facS3Poly([{ c: -d, v: u }, { c: e * s2, v: w }])})`, m: msgFacS3_sign },
                    { s: `${g}(${_facS3Poly([{ c: -d, v: u }, { c: -e * s2, v: w }])})`, m: msgFacS3_sign }
                ];

            } else if (type === 1) {
                // T2 分組分解：ah + bk − bh − ak → (h − k)(a − b)
                let [u, w] = distinct2();
                let z = pick(singleVars.filter(x => x !== u && x !== w));
                let s1 = 1, s2 = -1, cc = ri(2, 6) * sgn();
                // (u + s2 w)(z + cc) = uz + s2 wz + cc u + s2 cc w
                q = _facS3Poly([
                    { c: 1, v: `${u}${z}` }, { c: s2, v: `${w}${z}` },
                    { c: cc, v: u }, { c: s2 * cc, v: w }
                ]);
                ans = `(${_facS3Poly([{ c: 1, v: u }, { c: s2, v: w }])})(${_facS3Lin(z, cc)})`;
                steps = [
                    q,
                    `${u}(${_facS3Lin(z, cc)}) ${s2 < 0 ? '-' : '+'} ${w}(${_facS3Lin(z, cc)})`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facS3Poly([{ c: 1, v: u }, { c: -s2, v: w }])})(${_facS3Lin(z, cc)})`, m: msgFacS3_sign },
                    { s: `(${_facS3Poly([{ c: 1, v: u }, { c: s2, v: w }])})(${_facS3Lin(z, -cc)})`, m: msgFacS3_sign },
                    { s: `(${_facS3Poly([{ c: 1, v: u }, { c: -s2, v: w }])})(${_facS3Lin(z, -cc)})`, m: msgFacS3_group }
                ];

            } else if (type === 2) {
                // T3 平方差（雙變數）：4m² − 9n² → (2m + 3n)(2m − 3n)
                let [u, w] = distinct2();
                let p, r; do { p = ri(2, 7); r = ri(2, 7); } while (gcd(p, r) !== 1);
                q = `${p * p}${u}^2 - ${r * r}${w}^2`;
                ans = `(${_facS3Poly([{ c: p, v: u }, { c: r, v: w }])})(${_facS3Poly([{ c: p, v: u }, { c: -r, v: w }])})`;
                steps = [q, `(${p}${u})^2 - (${r}${w})^2`, ans];
                wrongs = [
                    { s: `(${_facS3Poly([{ c: p, v: u }, { c: r, v: w }])})^2`, m: msgFacS3_iden },
                    { s: `(${_facS3Poly([{ c: p, v: u }, { c: -r, v: w }])})^2`, m: msgFacS3_iden },
                    { s: `(${_facS3Poly([{ c: p * p, v: u }, { c: r * r, v: w }])})(${_facS3Poly([{ c: p * p, v: u }, { c: -r * r, v: w }])})`, m: msgFacS3_iden }
                ];

            } else if (type === 3) {
                // T4 括號平方差：16 − (x − 5y)² → (4 + x − 5y)(4 − x + 5y)
                let [u, w] = distinct2();
                let n = ri(3, 9), c2 = ri(2, 6);
                let binom = _facS3Poly([{ c: 1, v: u }, { c: -c2, v: w }]); // u - c2 w
                q = `${n * n} - (${binom})^2`;
                ans = `(${_facS3Poly([{ c: n, v: "" }, { c: 1, v: u }, { c: -c2, v: w }])})(${_facS3Poly([{ c: n, v: "" }, { c: -1, v: u }, { c: c2, v: w }])})`;
                steps = [q, `${n}^2 - (${binom})^2`, ans];
                wrongs = [
                    { s: `(${_facS3Poly([{ c: n, v: "" }, { c: 1, v: u }, { c: -c2, v: w }])})^2`, m: msgFacS3_iden },
                    { s: `(${_facS3Poly([{ c: n, v: "" }, { c: 1, v: u }, { c: -c2, v: w }])})(${_facS3Poly([{ c: n, v: "" }, { c: 1, v: u }, { c: -c2, v: w }])})`, m: msgFacS3_iden },
                    { s: `-(${_facS3Poly([{ c: n, v: "" }, { c: 1, v: u }, { c: -c2, v: w }])})(${_facS3Poly([{ c: n, v: "" }, { c: -1, v: u }, { c: c2, v: w }])})`, m: msgFacS3_sign }
                ];

            } else {
                // T5 完全平方（雙變數）：4x² − 28xy + 49y² → (2x − 7y)²
                let [u, w] = distinct2();
                let p, r; do { p = ri(2, 7); r = ri(2, 7); } while (gcd(p, r) !== 1);
                let s = sgn();
                q = _facS3Poly([{ c: p * p, v: `${u}^2` }, { c: 2 * p * r * s, v: `${u}${w}` }, { c: r * r, v: `${w}^2` }]);
                ans = `(${_facS3Poly([{ c: p, v: u }, { c: r * s, v: w }])})^2`;
                steps = [q, `(${p}${u})^2 ${s > 0 ? '+' : '-'} 2(${p}${u})(${r}${w}) + (${r}${w})^2`, ans];
                wrongs = [
                    { s: `(${_facS3Poly([{ c: p, v: u }, { c: -r * s, v: w }])})^2`, m: msgFacS3_sign },
                    { s: `(${_facS3Poly([{ c: p, v: u }, { c: r * s, v: w }])})(${_facS3Poly([{ c: p, v: u }, { c: -r * s, v: w }])})`, m: msgFacS3_iden },
                    { s: `(${_facS3Poly([{ c: p * p, v: u }, { c: r * r * s, v: w }])})^2`, m: msgFacS3_iden }
                ];
            }

        // ════════════ 程度 2：十字相乘 一元二次 (a = 1) ════════════
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";
            const x = pick(singleVars);

            // 兩個因子常數 c1、c2：(x + c1)(x + c2)
            let c1, c2;
            if (type === 0 || type === 4) { do { c1 = ri(1, 9); c2 = ri(1, 9); } while (c1 === c2); }  // 全正（T5 亦用正）
            else if (type === 1) { do { c1 = -ri(1, 9); c2 = -ri(1, 9); } while (c1 === c2); }          // 全負
            else if (type === 2) { let hi = ri(2, 9); c1 = hi; c2 = -ri(1, hi - 1); }                    // c<0, b>0
            else { let hi = ri(1, 8); c1 = hi; c2 = -ri(hi + 1, 9); }                                    // c<0, b<0

            const b = c1 + c2, c = c1 * c2;
            const xc1 = _facS3Lin(x, c1), xc2 = _facS3Lin(x, c2);

            if (type === 4) {
                // T5 先提公因式再十字：2x² + 20x + 18 → 2(x + 1)(x + 9)
                let k = ri(2, 4);
                q = _facS3Poly([{ c: k, v: `${x}^2` }, { c: k * b, v: x }, { c: k * c, v: "" }]);
                ans = `${k}(${xc1})(${xc2})`;
                steps = [
                    q,
                    `${k}(${_facS3Poly([{ c: 1, v: `${x}^2` }, { c: b, v: x }, { c: c, v: "" }])})`,
                    `${k}(${xc1})(${xc2})`
                ];
                wrongs = [
                    { s: `(${_facS3Lin(`${k}${x}`, c1)})(${xc2})`, m: msgFacS3_common },
                    { s: `${k}(${_facS3Lin(x, -c1)})(${xc2})`, m: msgFacS3_sign },
                    { s: `${k}(${xc1})(${_facS3Lin(x, -c2)})`, m: msgFacS3_sign }
                ];
            } else {
                q = _facS3Poly([{ c: 1, v: `${x}^2` }, { c: b, v: x }, { c: c, v: "" }]);
                ans = `(${xc1})(${xc2})`;
                steps = [
                    q,
                    _facS3Poly([{ c: 1, v: `${x}^2` }, { c: c1, v: x }, { c: c2, v: x }, { c: c, v: "" }]),
                    `${x}(${xc1}) ${c2 < 0 ? '-' : '+'} ${_facS3Fac(Math.abs(c2), xc1)}`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facS3Lin(x, -c1)})(${xc2})`, m: msgFacS3_cross },
                    { s: `(${xc1})(${_facS3Lin(x, -c2)})`, m: msgFacS3_cross },
                    { s: `(${_facS3Lin(x, -c1)})(${_facS3Lin(x, -c2)})`, m: msgFacS3_sign }
                ];
            }

        // ════════════ 程度 3：十字相乘 一元二次 (a > 1) ════════════
        } else if (lvl === '3') {
            qObj.level = "⭐⭐⭐ 程度 3";
            const x = pick(singleVars);
            // (p1·x + m)(p2·x + n)，a = p1·p2 > 1
            let p1, p2, m, n, a, b, c;
            do {
                if (type === 4) { p1 = ri(1, 3); p2 = ri(2, 3); }       // 先提公因式：a 仍 >1
                else if (type === 3) { p1 = ri(2, 3); p2 = ri(2, 3); }   // 較大係數
                else { p1 = 1; p2 = ri(2, 4); }
                if (type === 1) { m = ri(1, 5) * sgn(); n = ri(1, 5) * sgn(); if (m * n > 0) n = -n; } // c<0
                else if (type === 2) { m = -ri(1, 5); n = -ri(1, 5); }                                  // b<0,c>0
                else { m = ri(1, 5); n = ri(1, 5); }                                                     // 全正
                a = p1 * p2; b = p1 * n + p2 * m; c = m * n;
            } while ((p1 * n === p2 * m) || a <= 1 || b === 0 || gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c)) !== 1);

            const f1 = _facS3Poly([{ c: p1, v: x }, { c: m, v: "" }]);
            const f2 = _facS3Poly([{ c: p2, v: x }, { c: n, v: "" }]);
            const binomQ = _facS3Poly([{ c: p2, v: x }, { c: n, v: "" }]);

            if (type === 4) {
                // 先提公因式再十字：6x² + 14x + 4 → 2(3x + 1)(x + 2)
                let k = ri(2, 3);
                q = _facS3Poly([{ c: k * a, v: `${x}^2` }, { c: k * b, v: x }, { c: k * c, v: "" }]);
                ans = `${k}(${f1})(${f2})`;
                steps = [
                    q,
                    `${k}(${_facS3Poly([{ c: a, v: `${x}^2` }, { c: b, v: x }, { c: c, v: "" }])})`,
                    `${k}(${f1})(${f2})`
                ];
                wrongs = [
                    { s: `(${_facS3Poly([{ c: k * p1, v: x }, { c: m, v: "" }])})(${f2})`, m: msgFacS3_common },
                    { s: `${k}(${_facS3Poly([{ c: p1, v: x }, { c: -m, v: "" }])})(${_facS3Poly([{ c: p2, v: x }, { c: -n, v: "" }])})`, m: msgFacS3_cross },
                    { s: `${k}(${_facS3Poly([{ c: p1, v: x }, { c: -m, v: "" }])})(${f2})`, m: msgFacS3_sign }
                ];
            } else {
                q = _facS3Poly([{ c: a, v: `${x}^2` }, { c: b, v: x }, { c: c, v: "" }]);
                ans = `(${f1})(${f2})`;
                steps = [
                    q,
                    _facS3Poly([{ c: a, v: `${x}^2` }, { c: p1 * n, v: x }, { c: p2 * m, v: x }, { c: c, v: "" }]),
                    `${_facS3Mono(p1, x)}(${binomQ}) ${m < 0 ? '-' : '+'} ${_facS3Fac(Math.abs(m), binomQ)}`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facS3Poly([{ c: p1, v: x }, { c: -m, v: "" }])})(${_facS3Poly([{ c: p2, v: x }, { c: -n, v: "" }])})`, m: msgFacS3_cross },
                    { s: `(${_facS3Poly([{ c: p1, v: x }, { c: -m, v: "" }])})(${f2})`, m: msgFacS3_sign },
                    { s: `(${f1})(${_facS3Poly([{ c: p2, v: x }, { c: -n, v: "" }])})`, m: msgFacS3_sign }
                ];
            }

        // ════════════ 程度 4：十字相乘 二元二次 ════════════
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4";
            const [x, y] = distinct2();
            // (p1·x + m·y)(p2·x + n·y)
            let p1, p2, m, n, a, b, c;

            if (type === 3) {
                // 需重排變號：5y² − 6x² − 7xy → −(2x − y)(3x + 5y)
                p1 = ri(1, 2); p2 = ri(2, 3);
                do {
                    m = ri(1, 5) * sgn(); n = ri(1, 5) * sgn();
                    a = p1 * p2; b = p1 * n + p2 * m; c = m * n;
                } while ((p1 * n === p2 * m) || b === 0 || gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c)) !== 1);
                const g1 = _facS3Poly([{ c: p1, v: x }, { c: m, v: y }]);
                const g2 = _facS3Poly([{ c: p2, v: x }, { c: n, v: y }]);
                // 題目 = −E，打亂為 y² 先
                q = _facS3Poly([{ c: -c, v: `${y}^2` }, { c: -b, v: `${x}${y}` }, { c: -a, v: `${x}^2` }]);
                ans = `-(${g1})(${g2})`;
                steps = [
                    q,
                    _facS3Poly([{ c: -a, v: `${x}^2` }, { c: -b, v: `${x}${y}` }, { c: -c, v: `${y}^2` }]),
                    `-(${_facS3Poly([{ c: a, v: `${x}^2` }, { c: b, v: `${x}${y}` }, { c: c, v: `${y}^2` }])})`,
                    `-(${g1})(${g2})`
                ];
                wrongs = [
                    { s: `(${g1})(${g2})`, m: msgFacS3_sign },
                    { s: `-(${_facS3Poly([{ c: p1, v: x }, { c: -m, v: y }])})(${_facS3Poly([{ c: p2, v: x }, { c: -n, v: y }])})`, m: msgFacS3_cross },
                    { s: `-(${_facS3Poly([{ c: p1, v: x }, { c: -m, v: y }])})(${g2})`, m: msgFacS3_sign }
                ];
            } else if (type === 4) {
                // 含公因式二元二次：2x² + 14xy + 20y² → 2(x + 2y)(x + 5y)
                do { m = ri(1, 6); n = ri(1, 6); } while (m === n || gcd(m, n) !== 1);
                b = m + n; c = m * n;
                let k = ri(2, 4);
                const g1 = _facS3Poly([{ c: 1, v: x }, { c: m, v: y }]);
                const g2 = _facS3Poly([{ c: 1, v: x }, { c: n, v: y }]);
                q = _facS3Poly([{ c: k, v: `${x}^2` }, { c: k * b, v: `${x}${y}` }, { c: k * c, v: `${y}^2` }]);
                ans = `${k}(${g1})(${g2})`;
                steps = [
                    q,
                    `${k}(${_facS3Poly([{ c: 1, v: `${x}^2` }, { c: b, v: `${x}${y}` }, { c: c, v: `${y}^2` }])})`,
                    `${k}(${g1})(${g2})`
                ];
                wrongs = [
                    { s: `(${_facS3Poly([{ c: k, v: x }, { c: m, v: y }])})(${g2})`, m: msgFacS3_common },
                    { s: `${k}(${_facS3Poly([{ c: 1, v: x }, { c: -m, v: y }])})(${g2})`, m: msgFacS3_sign },
                    { s: `${k}(${_facS3Poly([{ c: 1, v: x }, { c: -m, v: y }])})(${_facS3Poly([{ c: 1, v: x }, { c: -n, v: y }])})`, m: msgFacS3_cross }
                ];
            } else {
                // T1 全正 / T2 mn<0 / T3 a>1：直接十字
                do {
                    if (type === 2) { p1 = ri(2, 3); p2 = ri(2, 3); } else { p1 = 1; p2 = 1; }
                    if (type === 1) { m = ri(1, 6) * sgn(); n = ri(1, 6) * sgn(); if (m * n > 0) n = -n; }
                    else if (type === 2) { m = ri(1, 5) * sgn(); n = ri(1, 5) * sgn(); }
                    else { m = ri(1, 8); n = ri(1, 8); }
                    a = p1 * p2; b = p1 * n + p2 * m; c = m * n;
                } while ((p1 * n === p2 * m) || b === 0 || gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c)) !== 1 || (m === n && p1 === p2));
                const f1 = _facS3Poly([{ c: p1, v: x }, { c: m, v: y }]);
                const f2 = _facS3Poly([{ c: p2, v: x }, { c: n, v: y }]);
                q = _facS3Poly([{ c: a, v: `${x}^2` }, { c: b, v: `${x}${y}` }, { c: c, v: `${y}^2` }]);
                ans = `(${f1})(${f2})`;
                steps = [q, ans];
                wrongs = [
                    { s: `(${_facS3Poly([{ c: p1, v: x }, { c: -m, v: y }])})(${_facS3Poly([{ c: p2, v: x }, { c: -n, v: y }])})`, m: msgFacS3_cross },
                    { s: `(${_facS3Poly([{ c: p1, v: x }, { c: -m, v: y }])})(${f2})`, m: msgFacS3_sign },
                    { s: `(${f1})(${_facS3Poly([{ c: p2, v: x }, { c: -n, v: y }])})`, m: msgFacS3_sign }
                ];
            }
        }

        // ─── 組裝選項：正解 + 干擾項，去重補足至 4 個 ───
        let stepHtml = _facS3Steps(steps);
        let optList = [{ text: _facS3Wrap(ans), isCorrect: true, hint: wrapHint(msgCorrect, stepHtml) }];
        wrongs.forEach(w => optList.push({ text: _facS3Wrap(w.s), isCorrect: false, hint: wrapHint(w.m, stepHtml) }));

        let seen = [], finalOpts = [];
        optList.forEach(o => { if (!seen.includes(o.text)) { seen.push(o.text); finalOpts.push(o); } });
        let guardN = 2;
        while (finalOpts.length < 4) {
            let alt = _facS3Wrap(`${guardN}(${ans})`);
            if (!seen.includes(alt)) { seen.push(alt); finalOpts.push({ text: alt, isCorrect: false, hint: wrapHint(msgFacS3_common, stepHtml) }); }
            guardN++;
        }

        qObj.options = shuffleArray(finalOpts).map((opt, idx) => ({ ...opt, id: String.fromCharCode(65 + idx) }));

        qObj.question = `
        <div class="mb-4 text-base sm:text-lg text-slate-600">對以下數式進行因式分解：</div>
        <div class="text-xl sm:text-2xl font-bold text-indigo-700 py-4 overflow-x-auto math-scroll whitespace-nowrap w-full">
            \\( \\displaystyle ${q} \\)
        </div>`;

        bank.push(qObj);
    }
    return bank;
}
