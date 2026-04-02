// js/utils.js

// 共用的正確訊息 HTML
const msgCorrect = `<div class="text-green-700 font-bold text-lg mb-1">✅ 步驟正確！</div>`;

// 隨機整數生成器 (包含 min，不包含 max)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// 陣列洗牌函數 (用於打亂選項)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 隨機指數生成器 (排除 0, 1, -1)
function getRandomExp() {
    const choices = [-5, -4, -3, -2, 2, 3, 4, 5]; 
    return choices[Math.floor(Math.random() * choices.length)];
}

// 最大公因數 (GCD) - 兩數
function gcd(x, y) {
    x = Math.abs(x); y = Math.abs(y);
    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

// 最大公因數 (GCD) - 三數
function gcd3(x, y, z) {
    return gcd(x, gcd(y, z));
}

// 格式化常數項 (如: "+ 3", "- 5")
function fmtC(n) { 
    return n > 0 ? "+ " + n : "- " + Math.abs(n); 
}

// 格式化帶變數的項 (如: "+ 3x", "- y", "+ v")
function fmtB(n, v) { 
    if (n === 0) return ""; 
    if (n === 1) return "+ " + v; 
    if (n === -1) return "- " + v; 
    return n > 0 ? "+ " + n + v : "- " + Math.abs(n) + v; 
}

// 格式化帶變數的係數 (專用於開頭項，如: "3x", "-y")
function fmtVarCoef(n, v) {
    if (n === 1) return "+ " + v;
    if (n === -1) return "- " + v;
    if (n > 0) return "+ " + n + v;
    return "- " + Math.abs(n) + v;
}

// 格式化一元一次多項式 (如: "2x + 3", "-x - 5")
function fmtPoly1(a, b, v) {
    if (a === 0 && b === 0) return "0";
    if (a === 0) return `${b}`;
    let res = "";
    if (a === 1) res += v;
    else if (a === -1) res += "-" + v;
    else res += a + v;
    
    if (b > 0) res += " + " + b;
    else if (b < 0) res += " - " + Math.abs(b);
    return res;
}

// 過濾連續重複的算式步驟
function filterUniqueSteps(steps) {
    let res = [];
    for (let s of steps) {
        if (res.length === 0 || s.text !== res[res.length-1].text) {
            res.push(s);
        }
    }
    return res;
}

// 構建數學算式與摺疊步驟的 HTML
function buildEq(rawSteps) {
    let steps = filterUniqueSteps(rawSteps);
    if (steps.length === 1) return `\\( \\displaystyle ${steps[0].text} \\)`;
    
    let html = `<div class="text-left w-full overflow-x-auto math-scroll">`;
    let isFirst = true;
    
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].hide) {
            let foldEqs = [];
            while (i < steps.length && steps[i].hide) {
                foldEqs.push(steps[i].text);
                i++;
            }
            i--; 
            
            html += `
            <details class="group my-2">
                <summary class="cursor-pointer text-indigo-500 hover:text-indigo-700 font-bold text-sm select-none flex items-center gap-1 outline-none ml-1">
                    <svg class="w-5 h-5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    查看詳細步驟
                </summary>
                <div class="mt-2 pl-5 border-l-2 border-indigo-200 flex flex-col w-full overflow-x-auto math-scroll">
                    ${foldEqs.map(s => `<div class="my-2">\\( \\displaystyle = ${s} \\)</div>`).join('')}
                </div>
            </details>
            `;
        } else {
            let prefix = isFirst ? '' : '= ';
            html += `<div class="my-2 w-full">\\( \\displaystyle ${prefix}${steps[i].text} \\)</div>`;
            isFirst = false;
        }
    }
    html += `</div>`;
    return html;
}

// 包裝提示訊息與解答 HTML 的外框
function wrapHint(msg, eqHtml) {
    return `${msg}
    <div class="my-2 p-4 bg-white rounded-xl border border-slate-200 text-base sm:text-lg shadow-sm overflow-x-auto math-scroll max-w-full">
        ${eqHtml}
    </div>`;
}
