// js/topics/hcf_lcm.js

// ==========================================
// H.C.F. / L.C.M. 專屬錯誤提示訊息
// ==========================================
const msgHcfPower = `<div class="text-red-600 font-bold text-lg mb-1">❗ H.C.F. 指數選取錯誤</div><div class="text-sm text-slate-500 mb-2">最大公因式 (H.C.F.) 必須選取各數式中<strong>相同變數的最低次數 (Lowest power)</strong>。</div>`;
const msgLcmPower = `<div class="text-red-600 font-bold text-lg mb-1">❗ L.C.M. 指數選取錯誤</div><div class="text-sm text-slate-500 mb-2">最小公倍式 (L.C.M.) 必須選取出現過的<strong>所有變數的最高次數 (Highest power)</strong>。</div>`;
const msgNumFactor = `<div class="text-red-600 font-bold text-lg mb-1">❗ 數字常數計算錯誤</div><div class="text-sm text-slate-500 mb-2">請獨立計算各數式前數字係數的 H.C.F. 或 L.C.M.，不要與變數混淆。</div>`;
const msgReverseLogic = `<div class="text-red-600 font-bold text-lg mb-1">❗ 逆向推導邏輯錯誤</div><div class="text-sm text-slate-500 mb-2">請檢查 H.C.F. (提供最低次數要求) 與 L.C.M. (提供最高次數要求)。如果第一及第二個數式未能滿足最高或最低次數，第三個數式<strong>必須</strong>補足該次數。</div>`;

// 輔助函數：GCD
function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { let t = b; b = a % b; a = t; }
    return a;
}
function gcd3(a, b, c) { return gcd(a, gcd(b, c)); }

// 輔助函數：LCM
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
function lcm3(a, b, c) { return lcm(a, lcm(b, c)); }

// 輔助函數：格式化代數項 (處理常數 1 和指數 1, 0)
function fmtTerm(c, v1, p1, v2, p2, v3, p3) {
    let res = "";
    if (c !== 1 || (p1 === 0 && p2 === 0 && p3 === 0)) res += c;
    
    if (p1 === 1) res += v1; else if (p1 > 1) res += `${v1}^{${p1}}`;
    if (p2 === 1) res += v2; else if (p2 > 1) res += `${v2}^{${p2}}`;
    if (p3 === 1) res += v3; else if (p3 > 1) res += `${v3}^{${p3}}`;
    
    return res === "" ? "1" : res;
}

// 輔助函數：隨機生成符合邊界 [min_val, max_val] 的 3 個數字，確保 min 和 max 必定出現
function genTriplets(min_val, max_val) {
    let arr = [min_val, max_val, Math.floor(Math.random() * (max_val - min_val + 1)) + min_val];
    return arr.sort(() => Math.random() - 0.5);
}

// ==========================================
// 題目生成器：HCF / LCM
// ==========================================
function generateHcfLcmQuestions(num, levelPref) {
    const bank = [];
    
    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "H.C.F. / L.C.M." };
        let options = [];
        let steps = [];

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎 H.C.F. (補底)";
            // 參考 2014 Q31: 3x^4y^2z, 4xy^5z, 6x^2y^3 的 H.C.F.
            let c = [3, 4, 6]; 
            // 確保每次數字有變化，但保持 HCF = 1, 2, 或 3 左右
            let mult = Math.floor(Math.random() * 3) + 1;
            let c1 = c[0] * mult, c2 = c[1] * mult, c3 = c[2] * mult; // e.g. 3, 4, 6 -> gcd = 1
            
            // Randomize variables powers
            let p1 = genTriplets(1, 5); // x powers
            let p2 = genTriplets(1, 5); // y powers
            let p3 = genTriplets(0, 3); // z powers (allow 0 for missing variable trick)

            let t1 = fmtTerm(c1, 'x', p1[0], 'y', p2[0], 'z', p3[0]);
            let t2 = fmtTerm(c2, 'x', p1[1], 'y', p2[1], 'z', p3[1]);
            let t3 = fmtTerm(c3, 'x', p1[2], 'y', p2[2], 'z', p3[2]);

            let ansC = gcd3(c1, c2, c3);
            let ansX = Math.min(p1[0], p1[1], p1[2]);
            let ansY = Math.min(p2[0], p2[1], p2[2]);
            let ansZ = Math.min(p3[0], p3[1], p3[2]);
            
            let ansStr = fmtTerm(ansC, 'x', ansX, 'y', ansY, 'z', ansZ);
            
            qObj.question = `
                <div class="mb-4 text-base sm:text-lg text-slate-600">\\( ${t1} \\) 、 \\( ${t2} \\) 及 \\( ${t3} \\) 的 H.C.F. 為</div>
            `;

            steps = [
                { text: `數字部分的 H.C.F.：\\( \\gcd(${c1}, ${c2}, ${c3}) = ${ansC} \\)`, hide: false },
                { text: `變數 x 取最低次數：\\( \\min(${p1[0]}, ${p1[1]}, ${p1[2]}) = ${ansX} \\)`, hide: true },
                { text: `變數 y 取最低次數：\\( \\min(${p2[0]}, ${p2[1]}, ${p2[2]}) = ${ansY} \\)`, hide: true },
                { text: `變數 z 取最低次數：\\( \\min(${p3[0]}, ${p3[1]}, ${p3[2]}) = ${ansZ} \\)`, hide: true },
                { text: `因此，H.C.F. = \\( ${ansStr} \\)`, hide: false }
            ];

            let wrongC = lcm3(c1, c2, c3);
            let wrongX = Math.max(p1[0], p1[1], p1[2]);
            let wrongY = Math.max(p2[0], p2[1], p2[2]);
            let wrongZ = Math.max(p3[0], p3[1], p3[2]);

            let opt1 = ansStr;
            let opt2 = fmtTerm(ansC, 'x', wrongX, 'y', wrongY, 'z', Math.max(1, wrongZ)); // 錯用 LCM 次數
            let opt3 = fmtTerm(wrongC, 'x', ansX, 'y', ansY, 'z', ansZ); // 數字錯用 LCM
            let opt4 = fmtTerm(wrongC, 'x', wrongX, 'y', wrongY, 'z', Math.max(1, wrongZ)); // 全錯 (求了LCM)

            options = [
                { text: `\\( \\displaystyle ${opt1} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( \\displaystyle ${opt2} \\)`, isCorrect: false, hint: wrapHint(msgHcfPower, buildEq(steps)) },
                { text: `\\( \\displaystyle ${opt3} \\)`, isCorrect: false, hint: wrapHint(msgNumFactor, buildEq(steps)) },
                { text: `\\( \\displaystyle ${opt4} \\)`, isCorrect: false, hint: wrapHint(msgHcfPower + msgNumFactor, buildEq(steps)) }
            ];

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：基礎 L.C.M. (建基)";
            // 參考 2016 Q31: 9a^2b, 12a^4b^3, 15a^6 的 L.C.M.
            let cSet = [ [9, 12, 15], [4, 6, 8], [6, 10, 15], [3, 4, 6] ];
            let c = cSet[Math.floor(Math.random() * cSet.length)];
            
            let p1 = genTriplets(2, 6); // a powers
            let p2 = genTriplets(0, 4); // b powers (ensure one is 0 to match DSE)
            p2[Math.floor(Math.random()*3)] = 0; // force one to be 0

            let t1 = fmtTerm(c[0], 'a', p1[0], 'b', p2[0], 'c', 0);
            let t2 = fmtTerm(c[1], 'a', p1[1], 'b', p2[1], 'c', 0);
            let t3 = fmtTerm(c[2], 'a', p1[2], 'b', p2[2], 'c', 0);

            let ansC = lcm3(c[0], c[1], c[2]);
            let ansA = Math.max(p1[0], p1[1], p1[2]);
            let ansB = Math.max(p2[0], p2[1], p2[2]);
            
            let ansStr = fmtTerm(ansC, 'a', ansA, 'b', ansB, 'c', 0);
            
            qObj.question = `
                <div class="mb-4 text-base sm:text-lg text-slate-600">\\( ${t1} \\) 、 \\( ${t2} \\) 及 \\( ${t3} \\) 的 L.C.M. 為</div>
            `;

            steps = [
                { text: `數字部分的 L.C.M.：\\( \\text{lcm}(${c[0]}, ${c[1]}, ${c[2]}) = ${ansC} \\)`, hide: false },
                { text: `變數 a 取最高次數：\\( \\max(${p1[0]}, ${p1[1]}, ${p1[2]}) = ${ansA} \\)`, hide: true },
                { text: `變數 b 取最高次數：\\( \\max(${p2[0]}, ${p2[1]}, ${p2[2]}) = ${ansB} \\)`, hide: true },
                { text: `因此，L.C.M. = \\( ${ansStr} \\)`, hide: false }
            ];

            let wrongC = gcd3(c[0], c[1], c[2]);
            let wrongA = Math.min(p1[0], p1[1], p1[2]);
            let wrongB = Math.min(p2[0], p2[1], p2[2]);

            let opt1 = ansStr;
            let opt2 = fmtTerm(ansC, 'a', wrongA, 'b', wrongB, 'c', 0); // 錯用 HCF 次數
            let opt3 = fmtTerm(wrongC, 'a', ansA, 'b', ansB, 'c', 0); // 數字錯用 HCF
            let opt4 = fmtTerm(wrongC, 'a', wrongA, 'b', wrongB, 'c', 0); // 全錯 (求了HCF)

            options = [
                { text: `\\( \\displaystyle ${opt1} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( \\displaystyle ${opt2} \\)`, isCorrect: false, hint: wrapHint(msgLcmPower, buildEq(steps)) },
                { text: `\\( \\displaystyle ${opt3} \\)`, isCorrect: false, hint: wrapHint(msgNumFactor, buildEq(steps)) },
                { text: `\\( \\displaystyle ${opt4} \\)`, isCorrect: false, hint: wrapHint(msgLcmPower + msgNumFactor, buildEq(steps)) }
            ];

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：逆向推導 (單純變數)";
            // 參考 2021 Q31: HCF, LCM 已知，求第三個數式
            let hX = Math.floor(Math.random() * 2) + 1; let lX = hX + Math.floor(Math.random() * 3) + 1;
            let hY = Math.floor(Math.random() * 2) + 1; let lY = hY + Math.floor(Math.random() * 3) + 1;
            let hZ = Math.floor(Math.random() * 2) + 1; let lZ = hZ + Math.floor(Math.random() * 3) + 1;

            let pX = genTriplets(hX, lX);
            let pY = genTriplets(hY, lY);
            let pZ = genTriplets(hZ, lZ);

            let t1 = fmtTerm(1, 'x', pX[0], 'y', pY[0], 'z', pZ[0]);
            let t2 = fmtTerm(1, 'x', pX[1], 'y', pY[1], 'z', pZ[1]);
            let t3 = fmtTerm(1, 'x', pX[2], 'y', pY[2], 'z', pZ[2]); // 這是答案
            let hcf = fmtTerm(1, 'x', hX, 'y', hY, 'z', hZ);
            let lcm = fmtTerm(1, 'x', lX, 'y', lY, 'z', lZ);

            qObj.question = `
                <div class="mb-4 text-base sm:text-lg text-slate-600">三個數式的 H.C.F. 及 L.C.M. 分別為 \\( ${hcf} \\) 及 \\( ${lcm} \\)。若第一個數式及第二個數式分別為 \\( ${t1} \\) 及 \\( ${t2} \\) ，則第三個數式為</div>
            `;
            
            // 構建解題步驟
            let explainX = `對於 x：第一和第二式為 ${pX[0]} 和 ${pX[1]}。H.C.F(最低)=${hX}, L.C.M(最高)=${lX}。所以第三式的 x 次數必須是 ${pX[2]}。`;
            let explainY = `對於 y：第一和第二式為 ${pY[0]} 和 ${pY[1]}。H.C.F(最低)=${hY}, L.C.M(最高)=${lY}。所以第三式的 y 次數必須是 ${pY[2]}。`;
            let explainZ = `對於 z：第一和第二式為 ${pZ[0]} 和 ${pZ[1]}。H.C.F(最低)=${hZ}, L.C.M(最高)=${lZ}。所以第三式的 z 次數必須是 ${pZ[2]}。`;

            steps = [
                { text: `H.C.F. 指示最低次數，L.C.M. 指示最高次數。`, hide: false },
                { text: explainX, hide: true },
                { text: explainY, hide: true },
                { text: explainZ, hide: true },
                { text: `第三個數式為 \\( ${t3} \\)`, hide: false }
            ];

            // 錯誤選項設計：改變某個關鍵次數 (例如把最高變最低，或把確定次數變其他)
            let w1 = fmtTerm(1, 'x', pX[2]===hX ? lX : hX, 'y', pY[2], 'z', pZ[2]);
            let w2 = fmtTerm(1, 'x', pX[2], 'y', pY[2]===hY ? lY : hY, 'z', pZ[2]);
            let w3 = fmtTerm(1, 'x', pX[2], 'y', pY[2], 'z', pZ[2]===hZ ? lZ : hZ);

            options = [
                { text: `\\( \\displaystyle ${t3} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgReverseLogic, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgReverseLogic, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgReverseLogic, buildEq(steps)) }
            ];
            
            // 去重補足
            let allTexts = new Set(options.map(o => o.text));
            while(options.length < 4 || allTexts.size < 4) {
                let rw = fmtTerm(1, 'x', Math.random()>0.5?hX:lX, 'y', Math.random()>0.5?hY:lY, 'z', Math.random()>0.5?hZ:lZ);
                let rt = `\\( \\displaystyle ${rw} \\)`;
                if(!allTexts.has(rt)) {
                    options.push({ text: rt, isCorrect: false, hint: wrapHint(msgReverseLogic, buildEq(steps)) });
                    allTexts.add(rt);
                }
                // 修剪多餘
                if (options.length > 4) {
                    options = options.filter(o => o.isCorrect || allTexts.size > 4 ? (allTexts.delete(o.text), false) : true);
                }
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：逆向推導綜合 (拔尖)";
            // 參考 2012 Q31: HCF, LCM 已知，帶數字常數
            // 預設幾組數字，保證有唯一解
            let constSets = [
                { H: 1, L: 4, C1: 2, C2: 4, C3: 1 }, // 2012題型
                { H: 2, L: 12, C1: 4, C2: 6, C3: 2 },
                { H: 3, L: 36, C1: 9, C2: 12, C3: 3 }
            ];
            let cs = constSets[Math.floor(Math.random() * constSets.length)];

            let hA = 1, lA = 4;
            let hB = 2, lB = 5;
            let hC = 0, lC = 6;

            let pA = genTriplets(hA, lA);
            let pB = genTriplets(hB, lB);
            let pC = genTriplets(hC, lC);

            let t1 = fmtTerm(cs.C1, 'a', pA[0], 'b', pB[0], 'c', pC[0]);
            let t2 = fmtTerm(cs.C2, 'a', pA[1], 'b', pB[1], 'c', pC[1]);
            let t3 = fmtTerm(cs.C3, 'a', pA[2], 'b', pB[2], 'c', pC[2]); // 答案
            let hcf = fmtTerm(cs.H, 'a', hA, 'b', hB, 'c', hC);
            let lcm = fmtTerm(cs.L, 'a', lA, 'b', lB, 'c', lC);

            qObj.question = `
                <div class="mb-4 text-base sm:text-lg text-slate-600">三個數式的 H.C.F. 及 L.C.M. 分別為 \\( ${hcf} \\) 及 \\( ${lcm} \\)。若第一個數式及第二個數式分別為 \\( ${t1} \\) 及 \\( ${t2} \\) ，則第三個數式為</div>
            `;
            
            steps = [
                { text: `先看數字：第一、第二式係數為 ${cs.C1}, ${cs.C2}。H.C.F.=${cs.H}，L.C.M.=${cs.L}。第三式的係數必須滿足條件，故為 ${cs.C3}。`, hide: false },
                { text: `對於 a：次數為 ${pA[0]} 和 ${pA[1]}。H.C.F(最低)=${hA}, L.C.M(最高)=${lA}。第三式 a 次數為 ${pA[2]}。`, hide: true },
                { text: `對於 b：次數為 ${pB[0]} 和 ${pB[1]}。H.C.F(最低)=${hB}, L.C.M(最高)=${lB}。第三式 b 次數為 ${pB[2]}。`, hide: true },
                { text: `對於 c：次數為 ${pC[0]} 和 ${pC[1]}。H.C.F(最低)=${hC}, L.C.M(最高)=${lC}。第三式 c 次數為 ${pC[2]}。`, hide: true },
                { text: `第三個數式為 \\( ${t3} \\)`, hide: false }
            ];

            let w1 = fmtTerm(cs.C3, 'a', pA[2]===hA?lA:hA, 'b', pB[2], 'c', pC[2]);
            let w2 = fmtTerm(cs.C1, 'a', pA[2], 'b', pB[2]===hB?lB:hB, 'c', pC[2]); // 數字干擾
            let w3 = fmtTerm(cs.C2, 'a', pA[2], 'b', pB[2], 'c', pC[2]===hC?lC:hC); // 數字干擾

            options = [
                { text: `\\( \\displaystyle ${t3} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgReverseLogic, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgNumFactor + "<br>" + msgReverseLogic, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgNumFactor + "<br>" + msgReverseLogic, buildEq(steps)) }
            ];
            
            // 去重
            options = [...new Map(options.map(item => [item.text, item])).values()];
            while(options.length < 4) {
                 options.push({ text: `\\( \\displaystyle ${fmtTerm(cs.C3 === 1 ? 2 : 1, 'a', pA[2], 'b', lB, 'c', hC)} \\)`, isCorrect: false, hint: wrapHint(msgReverseLogic, buildEq(steps)) });
            }
            options = options.slice(0, 4);
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
