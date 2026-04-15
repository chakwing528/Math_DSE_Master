// js/topics/algebraic_fractions_mul_div.js

// ==========================================
// 專屬錯誤提示訊息
// ==========================================
const msgFracMulDiv1 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 乘除法則混淆 (除法需將後方分式倒轉)</div>`;
const msgFracMulDiv2 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 指數定律或約簡計算錯誤</div>`;
const msgFracMulDiv3 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 忘記變號：(x-y) 與 (y-x) 約簡應為 -1</div>`;
const msgFracMulDiv4 = `<div class="text-red-600 font-bold text-lg mb-1">❗ 因式分解未完全或錯誤</div>`;

// ==========================================
// 🌟 多彩紅線約簡 (對應圖片中的多色紅線畫去)
// ==========================================
const colors = ['#ef4444', '#3b82f6', '#16a34a', '#f97316', '#a855f7']; // 紅, 藍, 綠, 橘, 紫

// 畫掉整個項 (例如括號或完全消去的變數)
const cancelTerm = (str, color = '#ef4444') => `\\color{${color}}{\\cancel{\\color{black}{${str}}}}`;

// 畫掉次方數 (保留底數，例如消去平方變成一次方)
const cancelPwr = (str, oldPwr, newPwr = '', color = '#ef4444') => {
    if (newPwr === '') {
        return `${str}^{\\color{${color}}{\\cancel{\\color{black}{${oldPwr}}}}}`;
    } else {
        return `${str}^{\\overset{\\color{${color}}{${newPwr}}}{\\color{${color}}{\\cancel{\\color{black}{${oldPwr}}}}}}`;
    }
};

// 畫掉分子數字，並在上方寫上新數字 (若為 1 則直接消去不寫數字)
const cancelNum = (oldNum, newNum, color = '#ef4444') => {
    if (newNum === 1 || newNum === -1) return `\\color{${color}}{\\cancel{\\color{black}{${oldNum}}}}`;
    return `\\overset{\\color{${color}}{${newNum}}}{\\color{${color}}{\\cancel{\\color{black}{${oldNum}}}}}`;
};

// 畫掉分母數字，並在下方寫上新數字
const cancelNumDen = (oldNum, newNum, color = '#ef4444') => {
    if (newNum === 1 || newNum === -1) return `\\color{${color}}{\\cancel{\\color{black}{${oldNum}}}}`;
    return `\\underset{\\color{${color}}{${newNum}}}{\\color{${color}}{\\cancel{\\color{black}{${oldNum}}}}}`;
};

// ==========================================
// 專用強大分數排版工具 (用於最終答案顯示)
// ==========================================
function formatFracAll(numC, denC, v1, p1, v2, p2, bStr, pb) {
    let g = gcd(numC, denC);
    let nC = numC / g;
    let dC = denC / g;
    let isNeg = (nC * dC < 0);
    nC = Math.abs(nC);
    dC = Math.abs(dC);

    let numTerms = [];
    let denTerms = [];

    if (nC !== 1) numTerms.push(nC);
    if (dC !== 1) denTerms.push(dC);

    if (p1 > 0) numTerms.push(p1 === 1 ? v1 : `${v1}^{${p1}}`);
    if (p1 < 0) denTerms.push(p1 === -1 ? v1 : `${v1}^{${-p1}}`);

    if (p2 > 0) numTerms.push(p2 === 1 ? v2 : `${v2}^{${p2}}`);
    if (p2 < 0) denTerms.push(p2 === -1 ? v2 : `${v2}^{${-p2}}`);

    if (pb > 0) numTerms.push(pb === 1 ? bStr : `${bStr}^{${pb}}`);
    if (pb < 0) denTerms.push(pb === -1 ? bStr : `${bStr}^{${-pb}}`);

    let numStr = numTerms.join('') || "1";
    let denStr = denTerms.join('');

    if (denStr === "" || denStr === "1") return (isNeg ? "-" : "") + numStr;
    return (isNeg ? "-" : "") + `\\frac{${numStr}}{${denStr}}`;
}

// ==========================================
// 題目生成器：代數分式的乘除法
// ==========================================
function generateAlgFracMulDivQuestions(num, levelPref) {
    const bank = [];
    const singleVars = ['x', 'y', 'a', 'b', 'm', 'n']; 
    
    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[getRandomInt(0, types.length)];
        } else {
            levelType = String(levelPref).toLowerCase();
        }
        
        let qObj = { id: i + 1, topic: "5.2A 代數分式的乘除法" };
        let questionMathStr = "";
        let isDiv = Math.random() > 0.5; // 隨機決定是乘法還是除法
        let opStr = isDiv ? "\\div" : "\\times";

        // =====================================
        // 程度 1：單項式乘除 (指數定律與基本約簡)
        // =====================================
        if (levelType === '1') {
            qObj.level = "⭐ 程度 1";
            let v1 = singleVars[getRandomInt(0, 3)]; 
            let v2 = singleVars[getRandomInt(3, 6)]; 
            
            let A = getRandomInt(2, 8); let B = getRandomInt(2, 8);
            let C = getRandomInt(2, 8); let D = getRandomInt(2, 8);
            let p1 = getRandomInt(1, 5), q1 = getRandomInt(1, 5);
            let p2 = getRandomInt(1, 5), q2 = getRandomInt(1, 5);

            let n1Str = `${A}${v1}^{${p1}}`;
            let d1Str = `${B}${v2}^{${q1}}`;
            let n2Str, d2Str, cNum, cDen, cP, cQ;

            if (isDiv) {
                n2Str = `${D}${v1}^{${p2}}`;
                d2Str = `${C}${v2}^{${q2}}`;
                cNum = A * C; cDen = B * D;
                cP = p1 - p2; cQ = q2 - q1;
            } else {
                n2Str = `${C}${v2}^{${q2}}`;
                d2Str = `${D}${v1}^{${p2}}`;
                cNum = A * C; cDen = B * D;
                cP = p1 - p2; cQ = q2 - q1;
            }

            questionMathStr = `\\frac{${n1Str}}{${d1Str}} ${opStr} \\frac{${n2Str}}{${d2Str}}`;
            let correctStr = formatFracAll(cNum, cDen, v1, cP, v2, cQ, "", 0);

            let steps = [{text: questionMathStr, hide: false}];
            if (isDiv) steps.push({text: `\\frac{${n1Str}}{${d1Str}} \\times \\frac{${C}${v2}^{${q2}}}{${D}${v1}^{${p2}}}`, hide: false});
            
            // 🌟 合併分數並產生彩色約簡步驟
            let numC = A * C;
            let denC = B * D;
            let gNum = gcd(numC, denC);
            
            let cNumStr = numC;
            let cDenStr = denC;
            let colorIdx = 0;
            
            if (gNum > 1) {
                cNumStr = cancelNum(numC, numC / gNum, colors[colorIdx % colors.length]);
                cDenStr = cancelNumDen(denC, denC / gNum, colors[colorIdx % colors.length]);
                colorIdx++;
            }
            
            let cv1Num = p1 === 1 ? v1 : `${v1}^{${p1}}`;
            let cv1Den = p2 === 1 ? v1 : `${v1}^{${p2}}`;
            if (p1 > p2) {
                cv1Num = cancelPwr(v1, p1, p1 - p2 === 1 ? '' : p1 - p2, colors[colorIdx % colors.length]);
                cv1Den = cancelTerm(cv1Den, colors[colorIdx % colors.length]);
                colorIdx++;
            } else if (p1 < p2) {
                cv1Num = cancelTerm(cv1Num, colors[colorIdx % colors.length]);
                cv1Den = cancelPwr(v1, p2, p2 - p1 === 1 ? '' : p2 - p1, colors[colorIdx % colors.length]);
                colorIdx++;
            } else if (p1 === p2) {
                cv1Num = cancelTerm(cv1Num, colors[colorIdx % colors.length]);
                cv1Den = cancelTerm(cv1Den, colors[colorIdx % colors.length]);
                colorIdx++;
            }
            
            let cv2Num = q2 === 1 ? v2 : `${v2}^{${q2}}`;
            let cv2Den = q1 === 1 ? v2 : `${v2}^{${q1}}`;
            if (q2 > q1) {
                cv2Num = cancelPwr(v2, q2, q2 - q1 === 1 ? '' : q2 - q1, colors[colorIdx % colors.length]);
                cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                colorIdx++;
            } else if (q2 < q1) {
                cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                cv2Den = cancelPwr(v2, q1, q1 - q2 === 1 ? '' : q1 - q2, colors[colorIdx % colors.length]);
                colorIdx++;
            } else if (q2 === q1) {
                cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                colorIdx++;
            }
            
            steps.push({text: `\\frac{${numC}${v1}^{${p1}}${v2}^{${q2}}}{${denC}${v1}^{${p2}}${v2}^{${q1}}}`, hide: false});
            steps.push({text: `\\frac{${cNumStr}${cv1Num}${cv2Num}}{${cDenStr}${cv1Den}${cv2Den}}`, hide: false});
            steps.push({text: correctStr, hide: false});

            let eqCorrectHtml = wrapHint(msgCorrect, buildEq(steps));

            let w1 = formatFracAll(A*D, B*C, v1, isDiv? p1+p2 : p1-p2, v2, isDiv? q1+q2 : q2-q1, "", 0); 
            let w2 = formatFracAll(cNum, cDen, v1, p1+p2, v2, q1+q2, "", 0); 
            let w3 = formatFracAll(A+C, B+D, v1, cP, v2, cQ, "", 0); 

            let options = [
                { text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: eqCorrectHtml },
                { text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv1, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps)) },
                { text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps)) }
            ];
            
            let texts = []; let finalOptions = [];
            options.forEach(opt => { if (!texts.includes(opt.text)) { texts.push(opt.text); finalOptions.push(opt); } });
            while(finalOptions.length < 4) {
                let fakeP = cP + getRandomInt(1, 3) * (Math.random() > 0.5 ? 1 : -1);
                let altText = `\\( \\displaystyle ${formatFracAll(cNum, cDen, v1, fakeP, v2, cQ, "", 0)} \\)`;
                if (!texts.includes(altText)) { texts.push(altText); finalOptions.push({ text: altText, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps)) }); }
            }
            qObj.options = shuffleArray(finalOptions).map((opt, idx) => ({...opt, id: String.fromCharCode(65 + idx)}));

        // =====================================
        // 程度 2：二項式提公因式 / 相反數括號
        // =====================================
        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2";
            let type = getRandomInt(0, 2); // 0: 提公因式, 1: 負號相反數
            let v = singleVars[getRandomInt(0, 3)];
            let v2 = singleVars[getRandomInt(3, 6)];
            let b = getRandomInt(2, 6), c = getRandomInt(2, 6);
            let q1 = getRandomInt(1, 4), q2 = getRandomInt(1, 4);
            let k = getRandomInt(1, 6);

            let steps = []; let correctStr = ""; let bStr = "";
            let options = [];

            if (type === 0) { // 提公因式約簡
                let a = getRandomInt(2, 5), d = getRandomInt(2, 5);
                let sign = Math.random() > 0.5 ? 1 : -1;
                let n1Str = `${a}${v} ${sign > 0 ? '+' : '-'} ${a*k}`; 
                let d1Str = `${b}${v2}^{${q1}}`;
                let n2Raw = `${c}${v2}^{${q2}}`;
                let d2Raw = `${d}${v} ${sign > 0 ? '+' : '-'} ${d*k}`; 
                
                let n2Str = isDiv ? d2Raw : n2Raw;
                let d2Str = isDiv ? n2Raw : d2Raw;
                questionMathStr = `\\frac{${n1Str}}{${d1Str}} ${opStr} \\frac{${n2Str}}{${d2Str}}`;

                bStr = `(${v} ${sign > 0 ? '+' : '-'} ${k})`;
                correctStr = formatFracAll(a*c, b*d, v, 0, v2, q2-q1, "", 0);

                steps.push({text: questionMathStr, hide: false});
                if (isDiv) steps.push({text: `\\frac{${n1Str}}{${d1Str}} \\times \\frac{${n2Raw}}{${d2Raw}}`, hide: false});
                steps.push({text: `\\frac{${a}${bStr}}{${b}${v2}^{${q1}}} \\times \\frac{${c}${v2}^{${q2}}}{${d}${bStr}}`, hide: false});
                
                // 🌟 彩色約簡引擎
                let numC = a * c;
                let denC = b * d;
                let gNum = gcd(numC, denC);
                let cNumStr = numC;
                let cDenStr = denC;
                let colorIdx = 0;
                
                if (gNum > 1) {
                    cNumStr = cancelNum(numC, numC / gNum, colors[colorIdx % colors.length]);
                    cDenStr = cancelNumDen(denC, denC / gNum, colors[colorIdx % colors.length]);
                    colorIdx++;
                }
                
                let cv2Num = q2 === 1 ? v2 : `${v2}^{${q2}}`;
                let cv2Den = q1 === 1 ? v2 : `${v2}^{${q1}}`;
                if (q2 > q1) {
                    cv2Num = cancelPwr(v2, q2, q2 - q1 === 1 ? '' : q2 - q1, colors[colorIdx % colors.length]);
                    cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                    colorIdx++;
                } else if (q2 < q1) {
                    cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                    cv2Den = cancelPwr(v2, q1, q1 - q2 === 1 ? '' : q1 - q2, colors[colorIdx % colors.length]);
                    colorIdx++;
                } else if (q2 === q1) {
                    cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                    cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                    colorIdx++;
                }
                
                let cBStrNum = cancelTerm(bStr, colors[colorIdx % colors.length]);
                let cBStrDen = cancelTerm(bStr, colors[colorIdx % colors.length]);
                colorIdx++;

                steps.push({text: `\\frac{${numC}${q2===1?v2:v2+'^{'+q2+'}'}${bStr}}{${denC}${q1===1?v2:v2+'^{'+q1+'}'}${bStr}}`, hide: false});
                steps.push({text: `\\frac{${cNumStr}${cv2Num}${cBStrNum}}{${cDenStr}${cv2Den}${cBStrDen}}`, hide: false});
                steps.push({text: correctStr, hide: false});

                let w1 = formatFracAll(a*c, b*d, v, 0, v2, q1+q2, "", 0);
                let w2 = formatFracAll(a*d, b*c, v, 0, v2, q2-q1, "", 0); 
                let w3 = formatFracAll(c, b*d, v, 0, v2, q2-q1, "", 0); 
                
                let eqCorrectHtml = wrapHint(msgCorrect, buildEq(steps));
                options.push({text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: eqCorrectHtml});
                options.push({text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps))});
                options.push({text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv1, buildEq(steps))});
                options.push({text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv4, buildEq(steps))});

            } else { // 負號陷阱：(x-y) / (y-x) = -1
                let n1Str = `${v} - ${k}`;
                let d1Str = `${b}${v2}^{${q1}}`;
                let n2Raw = `${c}${v2}^{${q2}}`;
                let d2Raw = `${k} - ${v}`; 
                
                let n2Str = isDiv ? d2Raw : n2Raw;
                let d2Str = isDiv ? n2Raw : d2Raw;
                questionMathStr = `\\frac{${n1Str}}{${d1Str}} ${opStr} \\frac{${n2Str}}{${d2Str}}`;

                bStr = `(${v} - ${k})`;
                correctStr = formatFracAll(-c, b, v, 0, v2, q2-q1, "", 0);

                steps.push({text: questionMathStr, hide: false});
                if (isDiv) steps.push({text: `\\frac{${n1Str}}{${d1Str}} \\times \\frac{${n2Raw}}{${d2Raw}}`, hide: false});
                steps.push({text: `\\frac{${bStr}}{${b}${v2}^{${q1}}} \\times \\frac{${c}${v2}^{${q2}}}{-${bStr}}`, hide: false});
                
                // 🌟 彩色約簡引擎 (負號陷阱保留負號)
                let numC = c;
                let denC = b; 
                let gNum = gcd(c, b);
                let cNumStr = c;
                let cDenStr = `-${b}`;
                let colorIdx = 0;
                
                if (gNum > 1) {
                    cNumStr = cancelNum(c, c / gNum, colors[colorIdx % colors.length]);
                    let newDen = -b / gNum;
                    if (newDen === -1) {
                        cDenStr = `- \\color{${colors[colorIdx % colors.length]}}{\\cancel{\\color{black}{${b}}}}`; 
                    } else {
                        cDenStr = `\\underset{\\color{${colors[colorIdx % colors.length]}}{${newDen}}}{\\color{${colors[colorIdx % colors.length]}}{\\cancel{\\color{black}{-${b}}}}}`;
                    }
                    colorIdx++;
                }
                
                let cv2Num = q2 === 1 ? v2 : `${v2}^{${q2}}`;
                let cv2Den = q1 === 1 ? v2 : `${v2}^{${q1}}`;
                if (q2 > q1) {
                    cv2Num = cancelPwr(v2, q2, q2 - q1 === 1 ? '' : q2 - q1, colors[colorIdx % colors.length]);
                    cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                    colorIdx++;
                } else if (q2 < q1) {
                    cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                    cv2Den = cancelPwr(v2, q1, q1 - q2 === 1 ? '' : q1 - q2, colors[colorIdx % colors.length]);
                    colorIdx++;
                } else if (q2 === q1) {
                    cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                    cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                    colorIdx++;
                }
                
                let cBStrNum = cancelTerm(bStr, colors[colorIdx % colors.length]);
                let cBStrDen = cancelTerm(bStr, colors[colorIdx % colors.length]);
                colorIdx++;

                steps.push({text: `\\frac{${c}${q2===1?v2:v2+'^{'+q2+'}'}${bStr}}{-${b}${q1===1?v2:v2+'^{'+q1+'}'}${bStr}}`, hide: false});
                steps.push({text: `\\frac{${cNumStr}${cv2Num}${cBStrNum}}{${cDenStr}${cv2Den}${cBStrDen}}`, hide: false});
                steps.push({text: correctStr, hide: false});

                let w1 = formatFracAll(c, b, v, 0, v2, q2-q1, "", 0); 
                let w2 = formatFracAll(-c, b, v, 0, v2, q1+q2, "", 0); 
                let w3 = formatFracAll(c, b, v, 0, v2, q1+q2, "", 0);
                
                let eqCorrectHtml = wrapHint(msgCorrect + `<div class='text-sm text-slate-500 mb-2 font-bold'>💡 技巧：${k} - ${v} 可以抽出負號變成 -(${v} - ${k})，然後互相約簡！</div>`, buildEq(steps));
                options.push({text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: eqCorrectHtml});
                options.push({text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv3, buildEq(steps))});
                options.push({text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps))});
                options.push({text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv3, buildEq(steps))});
            }

            let texts = []; let finalOptions = [];
            options.forEach(opt => { if (!texts.includes(opt.text)) { texts.push(opt.text); finalOptions.push(opt); } });
            while(finalOptions.length < 4) {
                let fakeC = c + getRandomInt(1, 4);
                let altText = `\\( \\displaystyle ${formatFracAll(fakeC, b, v, 0, v2, q2-q1, "", 0)} \\)`;
                if (!texts.includes(altText)) { texts.push(altText); finalOptions.push({ text: altText, isCorrect: false, hint: wrapHint(msgFracMulDiv4, buildEq(steps)) }); }
            }
            qObj.options = shuffleArray(finalOptions).map((opt, idx) => ({...opt, id: String.fromCharCode(65 + idx)}));

        // =====================================
        // 程度 3：二次多項式因式分解 (平方差、完全平方公式)
        // =====================================
        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3";
            let type = getRandomInt(0, 2); // 0: 平方差, 1: 完全平方公式
            let v = singleVars[getRandomInt(0, 3)];
            let v2 = singleVars[getRandomInt(3, 6)];
            let b = getRandomInt(2, 6), c = getRandomInt(2, 6);
            let q1 = getRandomInt(1, 4), q2 = getRandomInt(1, 4);
            
            let steps = []; let correctStr = ""; let options = [];

            if (type === 0) { // 平方差
                let k = getRandomInt(2, 6);
                let n1Str = `${v}^2 - ${k*k}`;
                let d1Str = `${b}${v2}^{${q1}}`;
                
                let sign = Math.random() > 0.5 ? 1 : -1;
                let d2Raw = `${v} ${sign > 0 ? '+' : '-'} ${k}`;
                let n2Raw = `${c}${v2}^{${q2}}`;
                let n2Str = isDiv ? d2Raw : n2Raw;
                let d2Str = isDiv ? n2Raw : d2Raw;

                questionMathStr = `\\frac{${n1Str}}{${d1Str}} ${opStr} \\frac{${n2Str}}{${d2Str}}`;

                let keptSign = sign > 0 ? '-' : '+';
                let keepStr = `(${v} ${keptSign} ${k})`;
                let cancelStr = `(${v} ${sign > 0 ? '+' : '-'} ${k})`;

                correctStr = formatFracAll(c, b, v, 0, v2, q2-q1, keepStr, 1);

                steps.push({text: questionMathStr, hide: false});
                if (isDiv) steps.push({text: `\\frac{${n1Str}}{${d1Str}} \\times \\frac{${n2Raw}}{${d2Raw}}`, hide: false});
                
                let factoredN1 = `(${v}-${k})(${v}+${k})`;
                steps.push({text: `\\frac{${factoredN1}}{${b}${v2}^{${q1}}} \\times \\frac{${c}${v2}^{${q2}}}{${cancelStr}}`, hide: false});
                
                // 🌟 彩色約簡引擎
                let numC = c;
                let denC = b;
                let gNum = gcd(numC, denC);
                let cNumStr = c;
                let cDenStr = b;
                let colorIdx = 0;
                
                if (gNum > 1) {
                    cNumStr = cancelNum(numC, numC / gNum, colors[colorIdx % colors.length]);
                    cDenStr = cancelNumDen(denC, denC / gNum, colors[colorIdx % colors.length]);
                    colorIdx++;
                }
                
                let cv2Num = q2 === 1 ? v2 : `${v2}^{${q2}}`;
                let cv2Den = q1 === 1 ? v2 : `${v2}^{${q1}}`;
                if (q2 > q1) {
                    cv2Num = cancelPwr(v2, q2, q2 - q1 === 1 ? '' : q2 - q1, colors[colorIdx % colors.length]);
                    cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                    colorIdx++;
                } else if (q2 < q1) {
                    cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                    cv2Den = cancelPwr(v2, q1, q1 - q2 === 1 ? '' : q1 - q2, colors[colorIdx % colors.length]);
                    colorIdx++;
                } else if (q2 === q1) {
                    cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                    cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                    colorIdx++;
                }

                let cCancelNum = cancelTerm(cancelStr, colors[colorIdx % colors.length]);
                let cCancelDen = cancelTerm(cancelStr, colors[colorIdx % colors.length]);
                colorIdx++;

                let combinedNum = `${c}${q2===1?v2:v2+'^{'+q2+'}'}${sign > 0 ? keepStr + cancelStr : cancelStr + keepStr}`;
                let combinedDen = `${b}${q1===1?v2:v2+'^{'+q1+'}'}${cancelStr}`;
                steps.push({text: `\\frac{${combinedNum}}{${combinedDen}}`, hide: false});

                let coloredNum = `${cNumStr}${cv2Num}${sign > 0 ? keepStr + cCancelNum : cCancelNum + keepStr}`;
                let coloredDen = `${cDenStr}${cv2Den}${cCancelDen}`;
                steps.push({text: `\\frac{${coloredNum}}{${coloredDen}}`, hide: false});
                steps.push({text: correctStr, hide: false});

                let w1 = formatFracAll(c, b, v, 0, v2, q2-q1, `(${v} ${sign > 0 ? '+' : '-'} ${k})`, 1); // 留錯括號
                let w2 = formatFracAll(c, b, v, 0, v2, q1+q2, keepStr, 1);
                let w3 = formatFracAll(c, b, v, 0, v2, q2-q1, "", 0); // 忘記還有括號殘留

                let eqCorrectHtml = wrapHint(msgCorrect, buildEq(steps));
                options.push({text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: eqCorrectHtml});
                options.push({text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv4, buildEq(steps))});
                options.push({text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps))});
                options.push({text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv4, buildEq(steps))});

            } else { // 完全平方公式
                let k = getRandomInt(2, 6);
                let sign = Math.random() > 0.5 ? 1 : -1;
                let midCoef = 2 * k * sign;
                let constTerm = k * k;

                let n1Str = `${v}^2 ${midCoef > 0 ? '+' : '-'} ${Math.abs(midCoef)}${v} + ${constTerm}`;
                let d1Str = `${b}${v2}^{${q1}}`;
                
                let d2Raw = `${v} ${sign > 0 ? '+' : '-'} ${k}`;
                let n2Raw = `${c}${v2}^{${q2}}`;

                let n2Str = isDiv ? d2Raw : n2Raw;
                let d2Str = isDiv ? n2Raw : d2Raw;

                questionMathStr = `\\frac{${n1Str}}{${d1Str}} ${opStr} \\frac{${n2Str}}{${d2Str}}`;

                let bStr = `(${v} ${sign > 0 ? '+' : '-'} ${k})`;

                correctStr = formatFracAll(c, b, v, 0, v2, q2-q1, bStr, 1);

                steps.push({text: questionMathStr, hide: false});
                if (isDiv) steps.push({text: `\\frac{${n1Str}}{${d1Str}} \\times \\frac{${n2Raw}}{${d2Raw}}`, hide: false});
                steps.push({text: `\\frac{${bStr}^2}{${b}${v2}^{${q1}}} \\times \\frac{${c}${v2}^{${q2}}}{${bStr}}`, hide: false});
                
                // 🌟 彩色約簡引擎 (對應圖片：保留底數，劃掉 2 次方)
                let numC = c;
                let denC = b;
                let gNum = gcd(numC, denC);
                let cNumStr = c;
                let cDenStr = b;
                let colorIdx = 0;
                
                if (gNum > 1) {
                    cNumStr = cancelNum(numC, numC / gNum, colors[colorIdx % colors.length]);
                    cDenStr = cancelNumDen(denC, denC / gNum, colors[colorIdx % colors.length]);
                    colorIdx++;
                }
                
                let cv2Num = q2 === 1 ? v2 : `${v2}^{${q2}}`;
                let cv2Den = q1 === 1 ? v2 : `${v2}^{${q1}}`;
                if (q2 > q1) {
                    cv2Num = cancelPwr(v2, q2, q2 - q1 === 1 ? '' : q2 - q1, colors[colorIdx % colors.length]);
                    cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                    colorIdx++;
                } else if (q2 < q1) {
                    cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                    cv2Den = cancelPwr(v2, q1, q1 - q2 === 1 ? '' : q1 - q2, colors[colorIdx % colors.length]);
                    colorIdx++;
                } else if (q2 === q1) {
                    cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                    cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                    colorIdx++;
                }

                let cCancelNum = cancelPwr(bStr, 2, '', colors[colorIdx % colors.length]);
                let cCancelDen = cancelTerm(bStr, colors[colorIdx % colors.length]);
                colorIdx++;

                let combinedNum = `${c}${q2===1?v2:v2+'^{'+q2+'}'}${bStr}^2`;
                let combinedDen = `${b}${q1===1?v2:v2+'^{'+q1+'}'}${bStr}`;
                steps.push({text: `\\frac{${combinedNum}}{${combinedDen}}`, hide: false});

                let coloredNum = `${cNumStr}${cv2Num}${cCancelNum}`;
                let coloredDen = `${cDenStr}${cv2Den}${cCancelDen}`;
                steps.push({text: `\\frac{${coloredNum}}{${coloredDen}}`, hide: false});
                steps.push({text: correctStr, hide: false});

                let w1 = formatFracAll(c, b, v, 0, v2, q2-q1, `(${v} ${sign > 0 ? '-' : '+'} ${k})`, 1); 
                let w2 = formatFracAll(c, b, v, 0, v2, q1+q2, bStr, 1);
                let w3 = formatFracAll(-c, b, v, 0, v2, q2-q1, bStr, 1); 

                let eqCorrectHtml = wrapHint(msgCorrect, buildEq(steps));
                options.push({text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: eqCorrectHtml});
                options.push({text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv4, buildEq(steps))});
                options.push({text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps))});
                options.push({text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps))});
            }

            let texts = []; let finalOptions = [];
            options.forEach(opt => { if (!texts.includes(opt.text)) { texts.push(opt.text); finalOptions.push(opt); } });
            while(finalOptions.length < 4) {
                let fakeC = c + getRandomInt(1, 4);
                let altText = `\\( \\displaystyle ${formatFracAll(fakeC, b, v, 0, v2, q2-q1, "", 0)} \\)`;
                if (!texts.includes(altText)) { texts.push(altText); finalOptions.push({ text: altText, isCorrect: false, hint: wrapHint(msgFracMulDiv4, buildEq(steps)) }); }
            }
            qObj.options = shuffleArray(finalOptions).map((opt, idx) => ({...opt, id: String.fromCharCode(65 + idx)}));

        // =====================================
        // 程度 4：二次多項式因式分解 (十字相乘法)
        // =====================================
        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4";
            let v = singleVars[getRandomInt(0, 3)];
            let v2 = singleVars[getRandomInt(3, 6)];
            let b = getRandomInt(2, 6), c = getRandomInt(2, 6);
            let q1 = getRandomInt(1, 4), q2 = getRandomInt(1, 4);
            
            let steps = []; let correctStr = ""; let options = [];

            // 十字相乘法
            let m = getRandomInt(1, 5), n = getRandomInt(1, 5);
            while (m === n) n = getRandomInt(1, 5);

            let signM = Math.random() > 0.5 ? 1 : -1;
            let signN = Math.random() > 0.5 ? 1 : -1;
            m *= signM; n *= signN;

            let midCoef = m + n;
            let constTerm = m * n;

            let n1Str = `${v}^2`;
            if (midCoef === 1) n1Str += ` + ${v}`;
            else if (midCoef === -1) n1Str += ` - ${v}`;
            else if (midCoef > 0) n1Str += ` + ${midCoef}${v}`;
            else if (midCoef < 0) n1Str += ` - ${Math.abs(midCoef)}${v}`;
            if (constTerm > 0) n1Str += ` + ${constTerm}`;
            else if (constTerm < 0) n1Str += ` - ${Math.abs(constTerm)}`;

            let d1Str = `${b}${v2}^{${q1}}`;
            let d2Raw = `${v} ${m > 0 ? '+' : '-'} ${Math.abs(m)}`; // 將約減掉 (v + m)
            let n2Raw = `${c}${v2}^{${q2}}`;

            let n2Str = isDiv ? d2Raw : n2Raw;
            let d2Str = isDiv ? n2Raw : d2Raw;

            questionMathStr = `\\frac{${n1Str}}{${d1Str}} ${opStr} \\frac{${n2Str}}{${d2Str}}`;

            let cancelStr = `(${v} ${m > 0 ? '+' : '-'} ${Math.abs(m)})`;
            let keepStr = `(${v} ${n > 0 ? '+' : '-'} ${Math.abs(n)})`;

            correctStr = formatFracAll(c, b, v, 0, v2, q2-q1, keepStr, 1);

            steps.push({text: questionMathStr, hide: false});
            if (isDiv) steps.push({text: `\\frac{${n1Str}}{${d1Str}} \\times \\frac{${n2Raw}}{${d2Raw}}`, hide: false});
            steps.push({text: `\\frac{${cancelStr}${keepStr}}{${b}${v2}^{${q1}}} \\times \\frac{${c}${v2}^{${q2}}}{${cancelStr}}`, hide: false});
            
            // 🌟 彩色約簡引擎
            let numC = c;
            let denC = b;
            let gNum = gcd(numC, denC);
            let cNumStr = c;
            let cDenStr = b;
            let colorIdx = 0;
            
            if (gNum > 1) {
                cNumStr = cancelNum(numC, numC / gNum, colors[colorIdx % colors.length]);
                cDenStr = cancelNumDen(denC, denC / gNum, colors[colorIdx % colors.length]);
                colorIdx++;
            }
            
            let cv2Num = q2 === 1 ? v2 : `${v2}^{${q2}}`;
            let cv2Den = q1 === 1 ? v2 : `${v2}^{${q1}}`;
            if (q2 > q1) {
                cv2Num = cancelPwr(v2, q2, q2 - q1 === 1 ? '' : q2 - q1, colors[colorIdx % colors.length]);
                cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                colorIdx++;
            } else if (q2 < q1) {
                cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                cv2Den = cancelPwr(v2, q1, q1 - q2 === 1 ? '' : q1 - q2, colors[colorIdx % colors.length]);
                colorIdx++;
            } else if (q2 === q1) {
                cv2Num = cancelTerm(cv2Num, colors[colorIdx % colors.length]);
                cv2Den = cancelTerm(cv2Den, colors[colorIdx % colors.length]);
                colorIdx++;
            }

            let cCancelNum = cancelTerm(cancelStr, colors[colorIdx % colors.length]);
            let cCancelDen = cancelTerm(cancelStr, colors[colorIdx % colors.length]);
            colorIdx++;

            let combinedNum = `${c}${q2===1?v2:v2+'^{'+q2+'}'}${cancelStr}${keepStr}`;
            let combinedDen = `${b}${q1===1?v2:v2+'^{'+q1+'}'}${cancelStr}`;
            steps.push({text: `\\frac{${combinedNum}}{${combinedDen}}`, hide: false});

            let coloredNum = `${cNumStr}${cv2Num}${cCancelNum}${keepStr}`;
            let coloredDen = `${cDenStr}${cv2Den}${cCancelDen}`;
            steps.push({text: `\\frac{${coloredNum}}{${coloredDen}}`, hide: false});
            steps.push({text: correctStr, hide: false});

            let w1 = formatFracAll(c, b, v, 0, v2, q2-q1, `(${v} ${m > 0 ? '+' : '-'} ${Math.abs(m)})`, 1); // 留錯括號
            let w2 = formatFracAll(c, b, v, 0, v2, q1+q2, keepStr, 1);
            let w3 = formatFracAll(-c, b, v, 0, v2, q2-q1, keepStr, 1); 

            let eqCorrectHtml = wrapHint(msgCorrect, buildEq(steps));
            options.push({text: `\\( \\displaystyle ${correctStr} \\)`, isCorrect: true, hint: eqCorrectHtml});
            options.push({text: `\\( \\displaystyle ${w1} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv4, buildEq(steps))});
            options.push({text: `\\( \\displaystyle ${w2} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps))});
            options.push({text: `\\( \\displaystyle ${w3} \\)`, isCorrect: false, hint: wrapHint(msgFracMulDiv2, buildEq(steps))});
            
            let texts = []; let finalOptions = [];
            options.forEach(opt => { if (!texts.includes(opt.text)) { texts.push(opt.text); finalOptions.push(opt); } });
            while(finalOptions.length < 4) {
                let fakeC = c + getRandomInt(1, 4);
                let altText = `\\( \\displaystyle ${formatFracAll(fakeC, b, v, 0, v2, q2-q1, "", 0)} \\)`;
                if (!texts.includes(altText)) { texts.push(altText); finalOptions.push({ text: altText, isCorrect: false, hint: wrapHint(msgFracMulDiv4, buildEq(steps)) }); }
            }
            qObj.options = shuffleArray(finalOptions).map((opt, idx) => ({...opt, id: String.fromCharCode(65 + idx)}));
        }

        qObj.question = `
        <div class="mb-4 text-base sm:text-lg text-slate-600">化簡以下代數分式：</div>
        <div class="text-xl sm:text-2xl font-bold text-indigo-700 py-4 overflow-x-auto math-scroll whitespace-nowrap w-full">
            \\( \\displaystyle ${questionMathStr} \\)
        </div>`;
        
        bank.push(qObj);
    }
    return bank;
}
