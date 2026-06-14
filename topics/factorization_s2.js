// js/topics/factorization_s2.js
// S2 因式分解（中二，無十字相乘）
// 程度1 提取公因式｜程度2 二項式公因式+分組｜程度3 平方差+完全平方(基礎)｜程度4 平方差+完全平方(進階)

// ==========================================
// 專屬錯誤提示訊息
// ==========================================
const msgFacS2_common = `<div class="text-red-600 font-bold text-lg mb-1">❗ 未完全提出公因式</div>`;
const msgFacS2_sign   = `<div class="text-red-600 font-bold text-lg mb-1">❗ 正負號錯誤</div>`;
const msgFacS2_iden   = `<div class="text-red-600 font-bold text-lg mb-1">❗ 平方差／完全平方恆等式運用錯誤</div>`;
const msgFacS2_group  = `<div class="text-red-600 font-bold text-lg mb-1">❗ 分組分解時配對或變號錯誤</div>`;

// ─── 格式化輔助 ───────────────────────────
// 多項式：terms = [{c:係數, v:'變數部分'}]，自動處理 ±1 與正負連接
function _facPoly(terms) {
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
// 線性式：變數 v 加上帶符號常數 k（k=0 時只回傳 v）
function _facLin(v, k) {
    if (k === 0) return v;
    return k > 0 ? `${v} + ${k}` : `${v} - ${Math.abs(k)}`;
}
// 詳細步驟摺疊區（首行原式，其後每行加「= 」）
function _facSteps(lines) {
    const body = lines.map((l, i) =>
        `<div class="my-1">${i === 0 ? '' : '= '}\\( \\displaystyle ${l} \\)</div>`).join('');
    return `
    <details class="group my-2">
        <summary class="cursor-pointer text-indigo-500 hover:text-indigo-700 font-bold text-sm select-none flex items-center gap-1 outline-none ml-1">
            <svg class="w-5 h-5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            查看詳細步驟
        </summary>
        <div class="mt-2 pl-5 border-l-2 border-indigo-200">${body}</div>
    </details>`;
}
const _facWrap = s => `\\( \\displaystyle ${s} \\)`;

// ==========================================
// 主生成器
// ==========================================
function generateFactorizationS2Questions(num, levelPref) {
    const bank = [];
    const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const sgn = () => (Math.random() < 0.5 ? 1 : -1);
    const singleVars = ['x', 'y', 'a', 'b', 'm', 'n', 'p', 'q'];
    const triPairs = [['m', 'n', 'p'], ['x', 'y', 'z'], ['a', 'b', 'c'], ['p', 'q', 'r']];
    const duoPairs = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['s', 't'], ['u', 'v']];

    function distinct2() { let p = pick(duoPairs); return Math.random() < 0.5 ? [p[0], p[1]] : [p[1], p[0]]; }

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref).toLowerCase();
        if (lvl === 'mixed') lvl = pick(['1', '2', '3', '4']);

        let qObj = { id: i + 1, topic: "S2 因式分解" };
        let q = "", ans = "", wrongs = [], steps = [];

        // ════════════ 程度 1：提取公因式 ════════════
        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";
            const type = ri(0, 4);

            if (type === 0) {
                // T1 兩項・數字公因式：5p − 20q → 5(p − 4q)
                let g = ri(2, 9), d, e;
                do { d = ri(1, 6); e = ri(1, 6); } while (gcd(d, e) !== 1);
                let s1 = sgn(), s2 = sgn();
                let [u, w] = distinct2();
                q = _facPoly([{ c: g * d * s1, v: u }, { c: g * e * s2, v: w }]);
                let inner = _facPoly([{ c: d * s1, v: u }, { c: e * s2, v: w }]);
                ans = `${g}(${inner})`;
                steps = [q, ans];
                wrongs = [
                    { s: `${g}(${_facPoly([{ c: d * s1, v: u }, { c: -e * s2, v: w }])})`, m: msgFacS2_sign },
                    { s: `${g}(${_facPoly([{ c: -d * s1, v: u }, { c: e * s2, v: w }])})`, m: msgFacS2_sign },
                    { s: `${g}(${_facPoly([{ c: -d * s1, v: u }, { c: -e * s2, v: w }])})`, m: msgFacS2_sign }
                ];

            } else if (type === 1) {
                // T2 三項・含變數公因式：20m + 15mn − 25mp → 5m(4 + 3n − 5p)
                let [m, n, p] = pick(triPairs);
                let k = ri(2, 6), i1, i2, i3;
                do { i1 = ri(1, 6); i2 = ri(1, 6) * sgn(); i3 = ri(1, 6) * sgn(); }
                while (gcd(gcd(i1, Math.abs(i2)), Math.abs(i3)) !== 1);
                q = _facPoly([{ c: k * i1, v: m }, { c: k * i2, v: m + n }, { c: k * i3, v: m + p }]);
                let inner = _facPoly([{ c: i1, v: "" }, { c: i2, v: n }, { c: i3, v: p }]);
                ans = `${k}${m}(${inner})`;
                steps = [q, ans];
                wrongs = [
                    { s: `${k}${m}(${_facPoly([{ c: -i1, v: "" }, { c: i2, v: n }, { c: i3, v: p }])})`, m: msgFacS2_sign },
                    { s: `${k}${m}(${_facPoly([{ c: i1, v: "" }, { c: -i2, v: n }, { c: i3, v: p }])})`, m: msgFacS2_sign },
                    { s: `${k}${m}(${_facPoly([{ c: i1, v: "" }, { c: i2, v: n }, { c: -i3, v: p }])})`, m: msgFacS2_sign }
                ];

            } else if (type === 2) {
                // T3 提取負號：−4a + 8b − 16c → −4(a − 2b + 4c)
                let [a, b, c] = pick(triPairs);
                let g = ri(2, 6), e1, e2, e3;
                do { e1 = ri(1, 5); e2 = ri(1, 5) * sgn(); e3 = ri(1, 5) * sgn(); }
                while (gcd(gcd(e1, Math.abs(e2)), Math.abs(e3)) !== 1);
                q = _facPoly([{ c: -g * e1, v: a }, { c: -g * e2, v: b }, { c: -g * e3, v: c }]);
                let inner = _facPoly([{ c: e1, v: a }, { c: e2, v: b }, { c: e3, v: c }]);
                ans = `-${g}(${inner})`;
                steps = [q, ans];
                wrongs = [
                    { s: `${g}(${inner})`, m: msgFacS2_sign },
                    { s: `-${g}(${_facPoly([{ c: e1, v: a }, { c: -e2, v: b }, { c: e3, v: c }])})`, m: msgFacS2_sign },
                    { s: `-${g}(${_facPoly([{ c: e1, v: a }, { c: e2, v: b }, { c: -e3, v: c }])})`, m: msgFacS2_sign }
                ];

            } else if (type === 3) {
                // T4 含次方公因式：ac² + bc³ − 2c⁴ → c²(a + bc − 2c²)
                let [u, w, z] = pick(triPairs);
                let k2 = ri(2, 4) * sgn(), k1 = sgn();
                q = _facPoly([
                    { c: 1, v: `${u}${w}^2` },
                    { c: k1, v: `${z}${w}^3` },
                    { c: k2, v: `${w}^4` }
                ]);
                let inner = _facPoly([
                    { c: 1, v: u },
                    { c: k1, v: `${z}${w}` },
                    { c: k2, v: `${w}^2` }
                ]);
                ans = `${w}^2(${inner})`;
                steps = [q, ans];
                wrongs = [
                    { s: `${w}^2(${_facPoly([{ c: 1, v: u }, { c: -k1, v: `${z}${w}` }, { c: k2, v: `${w}^2` }])})`, m: msgFacS2_sign },
                    { s: `${w}^2(${_facPoly([{ c: 1, v: u }, { c: k1, v: `${z}${w}` }, { c: -k2, v: `${w}^2` }])})`, m: msgFacS2_sign },
                    { s: `${w}^2(${_facPoly([{ c: 1, v: u }, { c: -k1, v: `${z}${w}` }, { c: -k2, v: `${w}^2` }])})`, m: msgFacS2_sign }
                ];

            } else {
                // T5 多變數高次：p⁴q + p³q − p⁵q² → p³q(p + 1 − p²q)
                let [u, w] = distinct2();
                let k = ri(2, 3) * sgn();
                q = _facPoly([
                    { c: 1, v: `${u}^4${w}` },
                    { c: 1, v: `${u}^3${w}` },
                    { c: k, v: `${u}^5${w}^2` }
                ]);
                let inner = _facPoly([
                    { c: 1, v: u },
                    { c: 1, v: "" },
                    { c: k, v: `${u}^2${w}` }
                ]);
                ans = `${u}^3${w}(${inner})`;
                steps = [q, ans];
                wrongs = [
                    { s: `${u}^3${w}(${_facPoly([{ c: -1, v: u }, { c: 1, v: "" }, { c: k, v: `${u}^2${w}` }])})`, m: msgFacS2_sign },
                    { s: `${u}^3${w}(${_facPoly([{ c: 1, v: u }, { c: -1, v: "" }, { c: k, v: `${u}^2${w}` }])})`, m: msgFacS2_sign },
                    { s: `${u}^3${w}(${_facPoly([{ c: 1, v: u }, { c: 1, v: "" }, { c: -k, v: `${u}^2${w}` }])})`, m: msgFacS2_sign }
                ];
            }

        // ════════════ 程度 2：二項式公因式 + 分組分解 ════════════
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";
            const type = ri(0, 4);

            if (type === 0) {
                // T1 二項式公因式：x(y+1) + 8(y+1) → (y+1)(x+8)
                let [u, v] = distinct2();
                let a = ri(1, 6) * sgn(), b = ri(2, 9) * sgn();
                let binom = _facLin(v, a);
                q = `${u}(${binom}) ${b < 0 ? '-' : '+'} ${Math.abs(b)}(${binom})`;
                ans = `(${binom})(${_facLin(u, b)})`;
                steps = [q, ans];
                wrongs = [
                    { s: `(${_facLin(v, -a)})(${_facLin(u, b)})`, m: msgFacS2_sign },
                    { s: `(${binom})(${_facLin(u, -b)})`, m: msgFacS2_sign },
                    { s: `(${_facLin(v, -a)})(${_facLin(u, -b)})`, m: msgFacS2_sign }
                ];

            } else if (type === 1) {
                // T2 含負號二項式：−s(s+3) − 4t(s+3) → −(s+3)(s+4t)
                let [u, w] = distinct2();
                let a = ri(1, 5) * sgn();
                let binom = _facLin(u, a);
                let c1 = sgn(), c2 = ri(2, 5) * sgn();
                let m1 = _facPoly([{ c: c1, v: u }]);
                let m2str = (c2 < 0 ? " - " : " + ") + _facPoly([{ c: Math.abs(c2), v: w }]);
                q = `${m1}(${binom})${m2str}(${binom})`;
                let innerPoly = _facPoly([{ c: c1, v: u }, { c: c2, v: w }]);
                ans = c1 < 0
                    ? `-(${binom})(${_facPoly([{ c: -c1, v: u }, { c: -c2, v: w }])})`
                    : `(${binom})(${innerPoly})`;
                steps = [q, `(${binom})(${innerPoly})`, ans];
                wrongs = [
                    { s: `(${binom})(${_facPoly([{ c: c1, v: u }, { c: -c2, v: w }])})`, m: msgFacS2_sign },
                    { s: `(${_facLin(u, -a)})(${innerPoly})`, m: msgFacS2_sign },
                    { s: `(${binom})(${_facPoly([{ c: -c1, v: u }, { c: c2, v: w }])})`, m: msgFacS2_sign }
                ];

            } else if (type === 2) {
                // T3 四項分組（兩組皆正）：px − qx + 3p − 3q → (p − q)(x + 3)
                let [u, w] = distinct2();
                let z = pick(singleVars.filter(x => x !== u && x !== w));
                let s1 = 1, s2 = -1, cc = ri(2, 6);
                q = _facPoly([
                    { c: s1, v: `${u}${z}` }, { c: s2, v: `${w}${z}` },
                    { c: s1 * cc, v: u }, { c: s2 * cc, v: w }
                ]);
                ans = `(${_facPoly([{ c: s1, v: u }, { c: s2, v: w }])})(${_facLin(z, cc)})`;
                steps = [
                    q,
                    `${u}(${_facLin(z, cc)}) ${s2 < 0 ? '-' : '+'} ${w}(${_facLin(z, cc)})`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facPoly([{ c: s1, v: u }, { c: -s2, v: w }])})(${_facLin(z, cc)})`, m: msgFacS2_sign },
                    { s: `(${_facPoly([{ c: s1, v: u }, { c: s2, v: w }])})(${_facLin(z, -cc)})`, m: msgFacS2_sign },
                    { s: `(${_facPoly([{ c: s1, v: u }, { c: -s2, v: w }])})(${_facLin(z, -cc)})`, m: msgFacS2_sign }
                ];

            } else if (type === 3) {
                // T4 四項分組（需變號）：ay + by − a − b → (a + b)(y − 1)
                let [u, w] = distinct2();
                let z = pick(singleVars.filter(x => x !== u && x !== w));
                q = _facPoly([
                    { c: 1, v: `${u}${z}` }, { c: 1, v: `${w}${z}` },
                    { c: -1, v: u }, { c: -1, v: w }
                ]);
                ans = `(${_facPoly([{ c: 1, v: u }, { c: 1, v: w }])})(${_facLin(z, -1)})`;
                steps = [
                    q,
                    `${z}(${_facPoly([{ c: 1, v: u }, { c: 1, v: w }])}) - (${_facPoly([{ c: 1, v: u }, { c: 1, v: w }])})`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facPoly([{ c: 1, v: u }, { c: -1, v: w }])})(${_facLin(z, -1)})`, m: msgFacS2_sign },
                    { s: `(${_facPoly([{ c: 1, v: u }, { c: 1, v: w }])})(${_facLin(z, 1)})`, m: msgFacS2_sign },
                    { s: `(${_facPoly([{ c: 1, v: u }, { c: -1, v: w }])})(${_facLin(z, 1)})`, m: msgFacS2_sign }
                ];

            } else {
                // T5 四項分組（需重排，含係數）：5kx − 2y − 10x + ky → (k − 2)(5x + y)
                let [u, w] = distinct2();
                let z = pick(singleVars.filter(x => x !== u && x !== w));
                let a1 = ri(2, 5), a2 = 1, cc = ri(2, 5);
                let T = [
                    { c: a1, v: `${u}${z}` },
                    { c: a2, v: `${w}${z}` },
                    { c: -a1 * cc, v: u },
                    { c: -a2 * cc, v: w }
                ];
                q = _facPoly([T[0], T[3], T[2], T[1]]);
                ans = `(${_facLin(z, -cc)})(${_facPoly([{ c: a1, v: u }, { c: a2, v: w }])})`;
                steps = [
                    q,
                    `${a1}${u}(${_facLin(z, -cc)}) + ${w}(${_facLin(z, -cc)})`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facLin(z, cc)})(${_facPoly([{ c: a1, v: u }, { c: a2, v: w }])})`, m: msgFacS2_sign },
                    { s: `(${_facLin(z, -cc)})(${_facPoly([{ c: a1, v: u }, { c: -a2, v: w }])})`, m: msgFacS2_sign },
                    { s: `(${_facLin(z, cc)})(${_facPoly([{ c: a1, v: u }, { c: -a2, v: w }])})`, m: msgFacS2_sign }
                ];
            }

        // ════════════ 程度 3：平方差 + 完全平方（基礎） ════════════
        } else if (lvl === '3') {
            qObj.level = "⭐⭐⭐ 程度 3";
            const type = ri(0, 5);

            if (type === 0) {
                // T1 基本平方差：x² − 36 → (x+6)(x−6)
                let v = pick(singleVars), n = ri(2, 12);
                q = `${v}^2 - ${n * n}`;
                ans = `(${_facLin(v, n)})(${_facLin(v, -n)})`;
                steps = [q, `${v}^2 - ${n}^2`, ans];
                wrongs = [
                    { s: `(${_facLin(v, n)})^2`, m: msgFacS2_iden },
                    { s: `(${_facLin(v, -n)})^2`, m: msgFacS2_iden },
                    { s: `(${_facLin(v, n * n)})(${_facLin(v, -n * n)})`, m: msgFacS2_iden }
                ];

            } else if (type === 1) {
                // T2 完全平方（單變數，加）：x² + 16x + 64 → (x+8)²
                let v = pick(singleVars), n = ri(2, 9);
                q = _facPoly([{ c: 1, v: `${v}^2` }, { c: 2 * n, v: v }, { c: n * n, v: "" }]);
                ans = `(${_facLin(v, n)})^2`;
                steps = [q, `${v}^2 + 2(${v})(${n}) + ${n}^2`, ans];
                wrongs = [
                    { s: `(${_facLin(v, -n)})^2`, m: msgFacS2_sign },
                    { s: `(${_facLin(v, n)})(${_facLin(v, -n)})`, m: msgFacS2_iden },
                    { s: `(${_facLin(v, 2 * n)})^2`, m: msgFacS2_iden }
                ];

            } else if (type === 2) {
                // T3 雙變數平方差：9a² − 49b² → (3a+7b)(3a−7b)
                let [u, w] = distinct2();
                let p, r; do { p = ri(2, 9); r = ri(2, 9); } while (gcd(p, r) !== 1);
                q = `${p * p}${u}^2 - ${r * r}${w}^2`;
                ans = `(${_facPoly([{ c: p, v: u }, { c: r, v: w }])})(${_facPoly([{ c: p, v: u }, { c: -r, v: w }])})`;
                steps = [q, `(${p}${u})^2 - (${r}${w})^2`, ans];
                wrongs = [
                    { s: `(${_facPoly([{ c: p, v: u }, { c: r, v: w }])})^2`, m: msgFacS2_iden },
                    { s: `(${_facPoly([{ c: p, v: u }, { c: -r, v: w }])})^2`, m: msgFacS2_iden },
                    { s: `(${_facPoly([{ c: p * p, v: u }, { c: r * r, v: w }])})(${_facPoly([{ c: p * p, v: u }, { c: -r * r, v: w }])})`, m: msgFacS2_iden }
                ];

            } else if (type === 3) {
                // T4 係數平方差：p²q² − 324 → (pq+18)(pq−18)
                let [u, w] = distinct2();
                let n = ri(3, 20);
                q = `${u}^2${w}^2 - ${n * n}`;
                ans = `(${_facLin(`${u}${w}`, n)})(${_facLin(`${u}${w}`, -n)})`;
                steps = [q, `(${u}${w})^2 - ${n}^2`, ans];
                wrongs = [
                    { s: `(${_facLin(`${u}${w}`, n)})^2`, m: msgFacS2_iden },
                    { s: `(${_facLin(`${u}${w}`, -n)})^2`, m: msgFacS2_iden },
                    { s: `(${_facLin(`${u}${w}`, n * n)})(${_facLin(`${u}${w}`, -n * n)})`, m: msgFacS2_iden }
                ];

            } else if (type === 4) {
                // T5 完全平方（單變數，減）：4y² − 12y + 9 → (2y−3)²
                let v = pick(singleVars), p, n;
                do { p = ri(2, 6); n = ri(2, 9); } while (gcd(p, n) !== 1);
                q = _facPoly([{ c: p * p, v: `${v}^2` }, { c: -2 * p * n, v: v }, { c: n * n, v: "" }]);
                ans = `(${_facPoly([{ c: p, v: v }, { c: -n, v: "" }])})^2`;
                steps = [q, `(${p}${v})^2 - 2(${p}${v})(${n}) + ${n}^2`, ans];
                wrongs = [
                    { s: `(${_facPoly([{ c: p, v: v }, { c: n, v: "" }])})^2`, m: msgFacS2_sign },
                    { s: `(${_facPoly([{ c: p, v: v }, { c: n, v: "" }])})(${_facPoly([{ c: p, v: v }, { c: -n, v: "" }])})`, m: msgFacS2_iden },
                    { s: `(${_facPoly([{ c: p, v: v }, { c: -2 * n, v: "" }])})^2`, m: msgFacS2_iden }
                ];

            } else {
                // T6 雙變數完全平方：16x² + 40xy + 25y² → (4x+5y)²
                let [u, w] = distinct2();
                let p, r; do { p = ri(2, 6); r = ri(2, 6); } while (gcd(p, r) !== 1);
                let s = sgn();
                q = _facPoly([{ c: p * p, v: `${u}^2` }, { c: 2 * p * r * s, v: `${u}${w}` }, { c: r * r, v: `${w}^2` }]);
                ans = `(${_facPoly([{ c: p, v: u }, { c: r * s, v: w }])})^2`;
                steps = [q, `(${p}${u})^2 ${s > 0 ? '+' : '-'} 2(${p}${u})(${r}${w}) + (${r}${w})^2`, ans];
                wrongs = [
                    { s: `(${_facPoly([{ c: p, v: u }, { c: -r * s, v: w }])})^2`, m: msgFacS2_sign },
                    { s: `(${_facPoly([{ c: p, v: u }, { c: r * s, v: w }])})(${_facPoly([{ c: p, v: u }, { c: -r * s, v: w }])})`, m: msgFacS2_iden },
                    { s: `(${_facPoly([{ c: p * p, v: u }, { c: r * r * s, v: w }])})^2`, m: msgFacS2_iden }
                ];
            }

        // ════════════ 程度 4：平方差 + 完全平方（進階變化） ════════════
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4";
            const type = ri(0, 5);

            if (type === 0) {
                // T1 顛倒次序平方差：−169 + y² → (y+13)(y−13)
                let v = pick(singleVars), n = ri(2, 14);
                q = `-${n * n} + ${v}^2`;
                ans = `(${_facLin(v, n)})(${_facLin(v, -n)})`;
                steps = [q, `${v}^2 - ${n}^2`, ans];
                wrongs = [
                    { s: `(${_facLin(v, n)})^2`, m: msgFacS2_iden },
                    { s: `(${_facLin(v, -n)})^2`, m: msgFacS2_iden },
                    { s: `-(${_facLin(v, n)})(${_facLin(v, -n)})`, m: msgFacS2_sign }
                ];

            } else if (type === 1) {
                // T2 括號平方差：(x+1)² − 25 → (x+6)(x−4)
                let v = pick(singleVars);
                let a = ri(1, 6) * sgn(), n = ri(2, 9);
                if (Math.abs(a) === n) n += 1;
                let binom = _facLin(v, a);
                q = `(${binom})^2 - ${n * n}`;
                ans = `(${_facLin(v, a + n)})(${_facLin(v, a - n)})`;
                steps = [q, `(${binom})^2 - ${n}^2`, `(${_facLin(binom, n)})(${_facLin(binom, -n)})`, ans];
                wrongs = [
                    { s: `(${binom})^2 - ${n}`, m: msgFacS2_iden },
                    { s: `(${_facLin(v, a + n)})^2`, m: msgFacS2_iden },
                    { s: `(${_facLin(v, a - n)})^2`, m: msgFacS2_iden }
                ];

            } else if (type === 2) {
                // T3 顛倒重排完全平方：a² + 49 + 14a → (a+7)²
                let v = pick(singleVars), n = ri(2, 9), s = sgn();
                let midC = 2 * n * s;
                q = `${v}^2 + ${n * n} ${midC > 0 ? '+' : '-'} ${Math.abs(midC)}${v}`;
                ans = `(${_facPoly([{ c: 1, v: v }, { c: n * s, v: "" }])})^2`;
                steps = [
                    q,
                    _facPoly([{ c: 1, v: `${v}^2` }, { c: midC, v: v }, { c: n * n, v: "" }]),
                    `${v}^2 ${s > 0 ? '+' : '-'} 2(${v})(${n}) + ${n}^2`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facPoly([{ c: 1, v: v }, { c: -n * s, v: "" }])})^2`, m: msgFacS2_sign },
                    { s: `(${_facPoly([{ c: 1, v: v }, { c: n * s, v: "" }])})(${_facPoly([{ c: 1, v: v }, { c: -n * s, v: "" }])})`, m: msgFacS2_iden },
                    { s: `(${_facPoly([{ c: 1, v: v }, { c: 2 * n * s, v: "" }])})^2`, m: msgFacS2_iden }
                ];

            } else if (type === 3) {
                // T4 嵌套完全平方：(x−1)² − 8(x−1) + 16 → (x−5)²
                let v = pick(singleVars);
                let a = ri(1, 5) * sgn();
                let n = ri(2, 7), s = sgn();
                let binom = _facLin(v, a);
                let midC = 2 * n * s;
                q = `(${binom})^2 ${midC > 0 ? '+' : '-'} ${Math.abs(midC)}(${binom}) + ${n * n}`;
                let innerConst = a + n * s;
                ans = `(${_facLin(v, innerConst)})^2`;
                steps = [
                    q,
                    `(${binom})^2 ${s > 0 ? '+' : '-'} 2(${binom})(${n}) + ${n}^2`,
                    `(${_facLin(binom, n * s)})^2`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facLin(v, a - n * s)})^2`, m: msgFacS2_sign },
                    { s: `(${_facLin(binom, n * s)})(${_facLin(binom, -n * s)})`, m: msgFacS2_iden },
                    { s: `(${_facLin(v, a + 2 * n * s)})^2`, m: msgFacS2_iden }
                ];

            } else if (type === 4) {
                // T5 先提公因式再完全平方：2x² + 12x + 18 → 2(x+3)²
                let v = pick(singleVars), k = ri(2, 5), n = ri(2, 7), s = sgn();
                q = _facPoly([{ c: k, v: `${v}^2` }, { c: k * 2 * n * s, v: v }, { c: k * n * n, v: "" }]);
                ans = `${k}(${_facPoly([{ c: 1, v: v }, { c: n * s, v: "" }])})^2`;
                steps = [
                    q,
                    `${k}(${_facPoly([{ c: 1, v: `${v}^2` }, { c: 2 * n * s, v: v }, { c: n * n, v: "" }])})`,
                    `${k}(${v}^2 ${s > 0 ? '+' : '-'} 2(${v})(${n}) + ${n}^2)`,
                    ans
                ];
                wrongs = [
                    { s: `(${_facPoly([{ c: k, v: v }, { c: n * s, v: "" }])})^2`, m: msgFacS2_common },
                    { s: `${k}(${_facPoly([{ c: 1, v: v }, { c: -n * s, v: "" }])})^2`, m: msgFacS2_sign },
                    { s: `${k}(${_facPoly([{ c: 1, v: v }, { c: n * s, v: "" }])})(${_facPoly([{ c: 1, v: v }, { c: -n * s, v: "" }])})`, m: msgFacS2_iden }
                ];

            } else {
                // T6 先提公因式再平方差：2x² − 32 → 2(x+4)(x−4)；3a² − 12b² → 3(a+2b)(a−2b)
                let k = ri(2, 5);
                if (Math.random() < 0.5) {
                    let v = pick(singleVars), n = ri(2, 9);
                    q = `${k}${v}^2 - ${k * n * n}`;
                    ans = `${k}(${_facLin(v, n)})(${_facLin(v, -n)})`;
                    steps = [q, `${k}(${v}^2 - ${n * n})`, `${k}(${v}^2 - ${n}^2)`, ans];
                    wrongs = [
                        { s: `(${_facLin(`${k}${v}`, n)})(${_facLin(`${k}${v}`, -n)})`, m: msgFacS2_common },
                        { s: `${k}(${_facLin(v, n)})^2`, m: msgFacS2_iden },
                        { s: `${k}(${_facLin(v, n * n)})(${_facLin(v, -n * n)})`, m: msgFacS2_iden }
                    ];
                } else {
                    let [u, w] = distinct2(), r = ri(2, 6);
                    q = `${k}${u}^2 - ${k * r * r}${w}^2`;
                    ans = `${k}(${_facPoly([{ c: 1, v: u }, { c: r, v: w }])})(${_facPoly([{ c: 1, v: u }, { c: -r, v: w }])})`;
                    steps = [q, `${k}(${u}^2 - ${r * r}${w}^2)`, `${k}(${u}^2 - (${r}${w})^2)`, ans];
                    wrongs = [
                        { s: `(${_facPoly([{ c: k, v: u }, { c: r, v: w }])})(${_facPoly([{ c: k, v: u }, { c: -r, v: w }])})`, m: msgFacS2_common },
                        { s: `${k}(${_facPoly([{ c: 1, v: u }, { c: r, v: w }])})^2`, m: msgFacS2_iden },
                        { s: `${k}(${_facPoly([{ c: 1, v: u }, { c: r * r, v: w }])})(${_facPoly([{ c: 1, v: u }, { c: -r * r, v: w }])})`, m: msgFacS2_iden }
                    ];
                }
            }
        }

        // ─── 組裝選項：正解 + 干擾項，去重補足至 4 個 ───
        let stepHtml = _facSteps(steps);
        let optList = [{ text: _facWrap(ans), isCorrect: true, hint: wrapHint(msgCorrect, stepHtml) }];
        wrongs.forEach(w => optList.push({ text: _facWrap(w.s), isCorrect: false, hint: wrapHint(w.m, stepHtml) }));

        let seen = [], finalOpts = [];
        optList.forEach(o => { if (!seen.includes(o.text)) { seen.push(o.text); finalOpts.push(o); } });
        let guardN = 2;
        while (finalOpts.length < 4) {
            let alt = _facWrap(`${guardN}(${ans})`);
            if (!seen.includes(alt)) { seen.push(alt); finalOpts.push({ text: alt, isCorrect: false, hint: wrapHint(msgFacS2_common, stepHtml) }); }
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
