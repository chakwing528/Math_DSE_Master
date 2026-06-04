// js/topics/change_of_subject.js

// ==========================================
// 主項轉換專用錯誤提示訊息
// ==========================================
const msgSubj1 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 移項時忘記變號或正負號錯誤</div>`;
const msgSubj2 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 交叉相乘或合併同類項時出錯</div>`;
const msgSubj3 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 提取公因式或展開時發生錯誤</div>`;

// ==========================================
// 題目生成器：主項轉換 (Change of Subject)
// ==========================================
function generateSubjectQuestions(num, levelPref) {
    const bank = [];
    const varPairs = [['x', 'y'], ['m', 'n'], ['a', 'b'], ['u', 'v'], ['c', 'd']];

    // 輔助函數：格式化線性項 coef * v + cons
    function formatLin(coef, cons, v) {
        let res = "";
        if (coef === 1) res = v;
        else if (coef === -1) res = "-" + v;
        else if (coef !== 0) res = coef + v;

        if (cons > 0 && res !== "") res += " + " + cons;
        else if (cons > 0 && res === "") res = cons.toString();
        else if (cons < 0) res += " - " + Math.abs(cons);

        if (res === "") return "0";
        return res;
    }

    for (let i = 0; i < num; i++) {
        let lvl = String(levelPref);
        if (levelPref === 'mixed') {
            lvl = ['1', '2', '3'][Math.floor(Math.random() * 3)];
        }

        let qObj = { id: i + 1, topic: "主項轉換 (Change of Subject)" };
        
        // 隨機選擇變數組合與主項
        let pair = varPairs[Math.floor(Math.random() * varPairs.length)];
        let isV1Subject = Math.random() > 0.5;
        let targetVar = isV1Subject ? pair[0] : pair[1]; // 要找出的主項
        let otherVar = isV1Subject ? pair[1] : pair[0];  // 另一個變數

        let questionMathStr = "";
        let correctStr = "";
        let options = [];
        let steps = [];

        if (lvl === '1') {
            qObj.level = "⭐ 程度 1";
            let type = Math.floor(Math.random() * 2);
            let A, B, C;
            do {
                A = Math.floor(Math.random() * 7) + 2;
                B = Math.floor(Math.random() * 7) + 2;
                C = Math.floor(Math.random() * 7) + 2;
            } while (gcd(A, gcd(B, C)) !== 1); // 確保沒有整體公因數

            if (type === 0) {
                // 題型：Ax + By = C
                questionMathStr = `\\text{若 } ${A}${targetVar} + ${B}${otherVar} = ${C} \\text{ ，則 } ${targetVar} =`;
                correctStr = `\\frac{${C} - ${B}${otherVar}}{${A}}`;

                steps.push({ text: `${A}${targetVar} + ${B}${otherVar} = ${C}`, hide: false });
                steps.push({ text: `${A}${targetVar} = ${C} - ${B}${otherVar}`, hide: false });
                steps.push({ text: `${targetVar} = \\frac{${C} - ${B}${otherVar}}{${A}}`, hide: false });

                let w1 = `\\frac{${C} + ${B}${otherVar}}{${A}}`;
                let w2 = `\\frac{${B}${otherVar} - ${C}}{${A}}`;
                let w3 = `\\frac{${A}${otherVar} - ${C}}{${B}}`;

                options = [
                    { text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgSubj1, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgSubj1, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg mb-1">❗ 係數除法與變數搞混了</div>`, buildEq(steps)) }
                ];
            } else {
                // 題型：C - Ax = By
                questionMathStr = `\\text{若 } ${C} - ${A}${targetVar} = ${B}${otherVar} \\text{ ，則 } ${targetVar} =`;
                correctStr = `\\frac{${C} - ${B}${otherVar}}{${A}}`;

                steps.push({ text: `${C} - ${A}${targetVar} = ${B}${otherVar}`, hide: false });
                steps.push({ text: `${C} - ${B}${otherVar} = ${A}${targetVar}`, hide: false });
                steps.push({ text: `${targetVar} = \\frac{${C} - ${B}${otherVar}}{${A}}`, hide: false });

                let w1 = `\\frac{${B}${otherVar} - ${C}}{${A}}`;
                let w2 = `\\frac{${C} + ${B}${otherVar}}{${A}}`;
                let w3 = `\\frac{${A}${otherVar} - ${C}}{${B}}`;

                options = [
                    { text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgSubj1, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgSubj1, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(`<div class="text-red-600 font-bold text-lg mb-1">❗ 係數除法錯誤</div>`, buildEq(steps)) }
                ];
            }
        } else if (lvl === '2') {
            qObj.level = "⭐⭐ 程度 2";
            let type = Math.floor(Math.random() * 2);
            
            if (type === 0) {
                // 題型：y = A - B/(x+C) 
                let A = Math.floor(Math.random() * 5) + 2;
                let B = Math.floor(Math.random() * 6) + 3;
                let C = Math.floor(Math.random() * 5) + 2;

                questionMathStr = `\\text{若 } ${otherVar} = ${A} - \\frac{${B}}{${targetVar} + ${C}} \\text{ ，則 } ${targetVar} =`;

                let numCoef = C;
                let numConst = B - A*C;
                let numConstStr = numConst > 0 ? `+ ${numConst}` : (numConst < 0 ? `- ${Math.abs(numConst)}` : ``);
                
                correctStr = `\\frac{${numCoef}${otherVar} ${numConstStr}}{${A} - ${otherVar}}`;

                steps.push({ text: `${otherVar} = ${A} - \\frac{${B}}{${targetVar} + ${C}}`, hide: false });
                steps.push({ text: `\\frac{${B}}{${targetVar} + ${C}} = ${A} - ${otherVar}`, hide: false });
                steps.push({ text: `${targetVar} + ${C} = \\frac{${B}}{${A} - ${otherVar}}`, hide: false });
                steps.push({ text: `${targetVar} = \\frac{${B}}{${A} - ${otherVar}} - ${C}`, hide: false });
                steps.push({ text: `${targetVar} = \\frac{${B} - ${C}(${A} - ${otherVar})}{${A} - ${otherVar}}`, hide: false });
                steps.push({ text: `${targetVar} = \\frac{${B} - ${A*C} + ${C}${otherVar}}{${A} - ${otherVar}}`, hide: false });
                steps.push({ text: `${targetVar} = ${correctStr}`, hide: false });

                let fakeConst1 = numConst - 2*B;
                let w1ConstStr = fakeConst1 > 0 ? `+ ${fakeConst1}` : `- ${Math.abs(fakeConst1)}`;
                let w1 = `\\frac{${numCoef}${otherVar} ${w1ConstStr}}{${A} - ${otherVar}}`;
                let w2 = `\\frac{${numCoef}${otherVar} ${numConstStr}}{${A} + ${otherVar}}`;
                let w3 = `\\frac{${numCoef}${otherVar} ${w1ConstStr}}{${A} + ${otherVar}}`;

                options = [
                    { text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgSubj2, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgSubj1, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgSubj2, buildEq(steps)) }
                ];
            } else {
                // 題型：A / (x - By) = C / x
                let A = Math.floor(Math.random() * 5) + 2;
                let B = Math.floor(Math.random() * 5) + 2;
                let C = Math.floor(Math.random() * 5) + 2;
                if (A === C) C++;

                questionMathStr = `\\text{若 } \\frac{${A}}{${targetVar} - ${B}${otherVar}} = \\frac{${C}}{${targetVar}} \\text{ ，則 } ${targetVar} =`;

                let denom = C - A;
                let num = B * C;
                if (denom < 0) {
                    denom = -denom;
                    num = -num;
                }
                
                // 化簡分數
                let g = gcd(Math.abs(num), Math.abs(denom));
                num /= g; denom /= g;
                
                let numStr = num === 1 ? otherVar : (num === -1 ? "-" + otherVar : num + otherVar);
                correctStr = denom === 1 ? numStr : `\\frac{${numStr}}{${denom}}`;

                steps.push({ text: `\\frac{${A}}{${targetVar} - ${B}${otherVar}} = \\frac{${C}}{${targetVar}}`, hide: false });
                steps.push({ text: `${A}${targetVar} = ${C}(${targetVar} - ${B}${otherVar})`, hide: false });
                steps.push({ text: `${A}${targetVar} = ${C}${targetVar} - ${B*C}${otherVar}`, hide: false });
                steps.push({ text: `${B*C}${otherVar} = ${C}${targetVar} - ${A}${targetVar}`, hide: false });
                steps.push({ text: `${B*C}${otherVar} = (${C} - ${A})${targetVar}`, hide: false });
                if ((C - A) / g !== 1 && (C - A) / g !== -1) {
                    steps.push({ text: `${targetVar} = \\frac{${B*C}${otherVar}}{${C - A}}`, hide: false });
                }
                if (g > 1 || C - A < 0) {
                    steps.push({ text: `${targetVar} = ${correctStr}`, hide: false });
                }

                // 產生干擾項並化簡
                let getWrongOpt = (n, d) => {
                    let gw = gcd(Math.abs(n), Math.abs(d));
                    n /= gw; d /= gw;
                    let ns = n === 1 ? otherVar : (n === -1 ? "-" + otherVar : n + otherVar);
                    return d === 1 ? ns : `\\frac{${ns}}{${d}}`;
                };

                let w1 = getWrongOpt(B*C, C+A);
                let w2 = getWrongOpt(B, Math.abs(C-A));
                let w3 = getWrongOpt(C, C+A);

                options = [
                    { text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgSubj3, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgSubj2, buildEq(steps)) },
                    { text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgSubj2, buildEq(steps)) }
                ];
            }

        } else {
            qObj.level = "⭐⭐⭐ 程度 3";
            // 題型：(Ax + 1)(y - B) = Cy(Ex - 1)
            let A, B, C, E;
            do {
                A = Math.floor(Math.random() * 4) + 2;
                B = Math.floor(Math.random() * 4) + 2;
                C = Math.floor(Math.random() * 4) + 2;
                E = Math.floor(Math.random() * 4) + 2;
            } while (A === C * E); // 避免 x 係數抵銷為 0

            questionMathStr = `\\text{若 } (${A}${targetVar} + 1)(${otherVar} - ${B}) = ${C}${otherVar}(${E}${targetVar} - 1) \\text{ ，則 } ${targetVar} =`;

            let numCoef = -(C + 1);
            let numConst = B;
            let denCoef = A - C * E;
            let denConst = -A * B;

            if (denCoef < 0) {
                numCoef = -numCoef;
                numConst = -numConst;
                denCoef = -denCoef;
                denConst = -denConst;
            }
            
            // 約簡公因數
            let g1 = gcd(Math.abs(numCoef), Math.abs(numConst));
            let g2 = gcd(Math.abs(denCoef), Math.abs(denConst));
            let gAll = gcd(g1, g2);
            if (gAll > 1) {
                numCoef /= gAll; numConst /= gAll;
                denCoef /= gAll; denConst /= gAll;
            }

            correctStr = `\\frac{${formatLin(numCoef, numConst, otherVar)}}{${formatLin(denCoef, denConst, otherVar)}}`;

            steps.push({ text: `(${A}${targetVar} + 1)(${otherVar} - ${B}) = ${C}${otherVar}(${E}${targetVar} - 1)`, hide: false });
            steps.push({ text: `${A}${targetVar}${otherVar} - ${A*B}${targetVar} + ${otherVar} - ${B} = ${C*E}${targetVar}${otherVar} - ${C}${otherVar}`, hide: false });
            steps.push({ text: `${A}${targetVar}${otherVar} - ${C*E}${targetVar}${otherVar} - ${A*B}${targetVar} = -${C}${otherVar} - ${otherVar} + ${B}`, hide: false });
            steps.push({ text: `${A - C*E}${targetVar}${otherVar} - ${A*B}${targetVar} = ${-(C + 1)}${otherVar} + ${B}`, hide: false });
            steps.push({ text: `${targetVar}(${A - C*E}${otherVar} - ${A*B}) = ${-(C + 1)}${otherVar} + ${B}`, hide: false });
            
            let rawCorrect = `\\frac{${-(C + 1)}${otherVar} + ${B}}{${A - C*E}${otherVar} - ${A*B}}`;
            steps.push({ text: `${targetVar} = ${rawCorrect}`, hide: false });
            if (rawCorrect !== correctStr) {
                steps.push({ text: `${targetVar} = ${correctStr}`, hide: false });
            }

            let w1 = `\\frac{${formatLin(numCoef, numConst, otherVar)}}{${formatLin(denCoef, Math.abs(denConst), otherVar)}}`;
            let w2 = `\\frac{${formatLin(Math.abs(numCoef), numConst, otherVar)}}{${formatLin(denCoef, denConst, otherVar)}}`;
            let w3 = `\\frac{${formatLin(-numCoef, numConst, otherVar)}}{${formatLin(denCoef, denConst, otherVar)}}`;

            options = [
                { text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgSubj2, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgSubj1, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgSubj3, buildEq(steps)) }
            ];
        }

        let texts = [];
        let finalOptions = [];
        options.forEach(opt => {
            if (!texts.includes(opt.text)) {
                texts.push(opt.text);
                finalOptions.push(opt);
            }
        });
        
        // 確保剛好產生 4 個不同的選項
        while (finalOptions.length < 4) {
            let fakeConst = Math.floor(Math.random() * 5) + 1;
            let altText = `\\( \\displaystyle \\frac{${formatLin(1, fakeConst, otherVar)}}{${formatLin(2, -fakeConst, otherVar)}} \\)`;
            if (!texts.includes(altText)) {
                texts.push(altText);
                finalOptions.push({ text: altText, isCorrect: false, hint: wrapHint(msgSubj2, buildEq(steps)) });
            }
        }
        
        qObj.options = shuffleArray(finalOptions).map((opt, idx) => ({ ...opt, id: String.fromCharCode(65 + idx) }));
        
        qObj.question = `
        <div class="mb-4 text-base sm:text-lg text-slate-600">變換以下公式的主項：</div>
        <div class="text-xl sm:text-2xl font-bold text-indigo-700 py-4 overflow-x-auto math-scroll whitespace-nowrap w-full">
            \\( \\displaystyle ${questionMathStr} \\)
        </div>`;

        bank.push(qObj);
    }
    return bank;
}