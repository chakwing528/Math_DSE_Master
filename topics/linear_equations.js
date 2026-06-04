// js/topics/linear_equations.js

// ==========================================
// 直線方程專屬錯誤提示訊息 (針對 DSE 考點)
// ==========================================
const msgLineSlope = `<div class="text-red-600 font-bold text-lg mb-1">❗ 斜率正負號 / 公式逆轉錯誤</div><div class="text-sm text-slate-500 mb-2">直線 \\( ax+by+c=0 \\) 的斜率為 \\( -\\frac{a}{b} \\)。當直線向右上傾斜時，斜率為正；向右下傾斜時，斜率為負。請勿混淆。</div>`;
const msgLineIntercept = `<div class="text-red-600 font-bold text-lg mb-1">❗ 截距位置判讀錯誤</div><div class="text-sm text-slate-500 mb-2">\\( x \\) 截距是直線與 \\( x \\) 軸交點的 \\( x \\) 坐標（代 \\( y=0 \\)）；\\( y \\) 截距是與 \\( y \\) 軸交點的 \\( y \\) 坐標（代 \\( x=0 \\)）。在正半軸則為正，負半軸則為負。</div>`;
const msgLineInequality = `<div class="text-red-600 font-bold text-lg mb-1">❗ 不等式比較與變號錯誤</div><div class="text-sm text-slate-500 mb-2">當比較兩個負數（例如斜率 \\( m_1 < m_2 < 0 \\)）時，直線越陡峭，其負值越小（即絕對值越大，數值越小）。在不等式兩邊同除以負數時，切記要改變不等號方向。</div>`;
const msgLineCrossProduct = `<div class="text-red-600 font-bold text-lg mb-1">❗ 交叉乘積/高階不等式推導錯誤</div><div class="text-sm text-slate-500 mb-2">考核如 \\( ad > bc \\) 這種 Section B 常見考題時，必須先明確寫出各係數的獨立正負號，再將已知的不等式（如斜率比較）兩邊同乘以可能為負數的常數，此時必須極度小心是否需要變號。</div>`;

// ==========================================
// 輔助函數：動態生成 SVG 圖像線條
// ==========================================
function createSvgAxis() {
    return `
    <line x1="10" y1="100" x2="190" y2="100" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)" />
    <line x1="100" y1="190" x2="100" y2="10" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="185" y="115" font-size="12" fill="#64748b" font-family="sans-serif">x</text>
    <text x="110" y="20" font-size="12" fill="#64748b" font-family="sans-serif">y</text>
    <text x="88" y="114" font-size="11" fill="#64748b" font-family="sans-serif">O</text>
    `;
}

function _linWrapSvg(content) {
    return `
    <div class="flex justify-center my-4">
        <svg width="200" height="200" viewBox="0 0 200 200" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 10 5 L 0 8 z" fill="#64748b" />
                </marker>
            </defs>
            ${createSvgAxis()}
            ${content}
        </svg>
    </div>`;
}

function _linShuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// ==========================================
// 主題目生成器：直線方程
// ==========================================
function generateLinearQuestions(num, levelPref) {
    const bank = [];
    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "直線方程" };
        let options = [];
        let steps = [];
        let subType = Math.floor(Math.random() * 3);

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎截距與幾何判讀 (補底基本功)";
            
            if (subType === 0) {
                // Type 0: 共有截距求直線方程與點 仿 2012PP Q7
                let x_int = Math.floor(Math.random() * 4) + 3; // 3 to 6
                let y_int = Math.floor(Math.random() * 3) + 2; // 2 to 4
                
                // L1: x = x_int, L2: ax+by=c sharing intercepts
                let svgHtml = _linWrapSvg(`
                    <line x1="${100 + x_int*15}" y1="20" x2="${100 + x_int*15}" y2="180" stroke="#ef4444" stroke-width="2" />
                    <line x1="20" y1="${100 + y_int*18}" x2="${100 + x_int*18}" y2="20" stroke="#3b82f6" stroke-width="2" />
                    <text x="${100 + x_int*15 + 5}" y="40" fill="#ef4444" font-size="12">L₁</text>
                    <text x="40" y="${100 + y_int*18 - 10}" fill="#3b82f6" font-size="12">L₂</text>
                    <circle cx="${100 + x_int*15}" cy="100" r="3" fill="#000" />
                    <circle cx="100" cy="${100 - y_int*15}" r="3" fill="#000" />
                    <text x="${100 + x_int*15 - 12}" y="115" font-size="10">${x_int}</text>
                    <text x="88" y="${100 - y_int*15 + 12}" font-size="10">${y_int}</text>
                `);

                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中，直線 \\( L_1 \\) 及 直線 \\( L_2 \\) 的 \\( x \\) 截距均為 \\( ${x_int} \\)，而 \\( L_2 \\) 的 \\( y \\) 截距為 \\( ${y_int} \\)。下列何者正確？<br>I. \\( L_1 \\) 的方程為 \\( x = ${x_int} \\)<br>II. \\( L_2 \\) 的斜率為 \\( -\\frac{${y_int}}{${x_int}} \\)<br>III. 點 \\( (${x_int}, ${y_int}) \\) 在 \\( L_2 \\) 上</div>`;
                
                steps = [
                    { text: `I 正確：\\( L_1 \\) 是一條垂直線，且通過 \\( x = ${x_int} \\)，所以其方程為 \\( x = ${x_int} \\)。`, hide: false },
                    { text: `II 正確：\\( L_2 \\) 通過 \\( (${x_int}, 0) \\) 及 \\( (0, ${y_int}) \\)。斜率 \\( m = \\frac{${y_int} - 0}{0 - ${x_int}} = -\\frac{${y_int}}{${x_int}} \\)。`, hide: false },
                    { text: `III 錯誤：\\( L_2 \\) 的方程為 \\( \\frac{x}{${x_int}} + \\frac{y}{${y_int}} = 1 \\)。將 \\( (${x_int}, ${y_int}) \\) 代入左邊得 \\( \\frac{${x_int}}{${x_int}} + \\frac{${y_int}}{${y_int}} = 1 + 1 = 2 \\neq 1 \\)，故不在線上。`, hide: true }
                ];

                options = [
                    { text: "只有 I 及 II", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) },
                    { text: "I、II 及 III", isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 水平線與垂直線的方程判斷
                let k = Math.floor(Math.random() * 3) + 3; // 3,4,5
                let svgHtml = _linWrapSvg(`
                    <line x1="10" y1="${100 + k*15}" x2="190" y2="${100 + k*15}" stroke="#ef4444" stroke-width="2" />
                    <text x="20" y="${100 + k*15 - 8}" fill="#ef4444" font-size="12">L</text>
                    <circle cx="100" cy="${100 + k*15}" r="3" fill="#000" />
                    <text x="85" y="${100 + k*15 - 5}" font-size="10">-${k}</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為直線 \\( L \\) 的圖像。求 \\( L \\) 的方程。</div>`;
                steps = [
                    { text: `觀察圖像，\\( L \\) 是一條水平線。`, hide: false },
                    { text: `水平線上所有點的 \\( y \\) 坐標皆相同。`, hide: true },
                    { text: `該直線穿過 \\( y \\) 軸的負半部分，交點為 \\( (0, -${k}) \\)，因此其方程為 \\( y = -${k} \\)（亦即 \\( y + ${k} = 0 \\)）。`, hide: false }
                ];
                options = [
                    { text: `\\( y + ${k} = 0 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( x + ${k} = 0 \\)`, isCorrect: false, hint: wrapHint(msgLineIntercept + "<div class='text-sm text-slate-500'>提示：垂直線的方程才是 x = 常數，水平線是 y = 常數。</div>", buildEq(steps)) },
                    { text: `\\( y - ${k} = 0 \\)`, isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) },
                    { text: `\\( x - ${k} = 0 \\)`, isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) }
                ];
            } else {
                // Type 2: 已知兩點求斜率的圖形驗證
                let svgHtml = _linWrapSvg(`
                    <line x1="30" y1="150" x2="170" y2="40" stroke="#10b981" stroke-width="2" />
                    <circle cx="60" cy="126" r="3" fill="#000" />
                    <circle cx="140" cy="64" r="3" fill="#000" />
                    <text x="45" y="120" font-size="10">A(-2, -2)</text>
                    <text x="135" y="55" font-size="10">B(4, 3)</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中直線通過 \\( A(-2, -2) \\) 及 \\( B(4, 3) \\) 兩點。求該直線的斜率。</div>`;
                steps = [
                    { text: `應用斜率公式：\\( m = \\frac{y_2 - y_1}{x_2 - x_1} \\)。`, hide: false },
                    { text: `代入坐標：\\( m = \\frac{3 - (-2)}{4 - (-2)} \\)`, hide: true },
                    { text: `計算分子與分母：\\( m = \\frac{3 + 2}{4 + 2} = \\frac{5}{6} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( \\frac{5}{6} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( \\frac{6}{5} \\)`, isCorrect: false, hint: wrapHint(msgLineSlope + "<div class='text-sm text-slate-500'>提示：斜率公式是 y 的改變量除以 x 的改變量，別上下顛倒了。</div>", buildEq(steps)) },
                    { text: `\\( -\\frac{5}{6} \\)`, isCorrect: false, hint: wrapHint(msgLineSlope + "<div class='text-sm text-slate-500'>提示：直線向右上傾斜，斜率必定是正數。</div>", buildEq(steps)) },
                    { text: `\\( \\frac{1}{2} \\)`, isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) }
                ];
            }

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：單一圖像之係數正負號判別 (穩固中游)";
            
            if (subType === 0) {
                // Type 0: x + ay + b = 0 類型 仿 2013 Q14
                let svgHtml = _linWrapSvg(`
                    <line x1="20" y1="40" x2="160" y2="180" stroke="#3b82f6" stroke-width="2" />
                    <text x="140" y="150" fill="#3b82f6" font-size="12">L</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為直線 \\( L: x + ay + b = 0 \\) 的圖像。下列何者正確？<br>I. \\( a < 0 \\)<br>II. \\( b < 0 \\)<br>III. \\( a < b \\)</div>`;
                
                steps = [
                    { text: `將方程改寫為斜截式：\\( ay = -x - b \\implies y = -\\frac{1}{a}x - \\frac{b}{a} \\)。`, hide: false },
                    { text: `由圖可知，直線向右下傾斜，斜率為負：\\( -\\frac{1}{a} < 0 \\implies a > 0 \\)。由此可知 I 錯誤。`, hide: false },
                    { text: `直線與 \\( y \\) 軸相交於正半部分，\\( y \\) 截距為正：\\( -\\frac{b}{a} > 0 \\)。`, hide: true },
                    { text: `因為 已求得 \\( a > 0 \\)，所以 \\( -b > 0 \\implies b < 0 \\)。由此可知 II 正確。`, hide: true },
                    { text: `由於 \\( a > 0 \\) 且 \\( b < 0 \\)，正數必然大於負數，故 \\( a > b \\)，III 錯誤。`, hide: false }
                ];

                options = [
                    { text: "只有 II", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 II", isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgLineInequality, buildEq(steps)) },
                    { text: "I、II 及 III", isCorrect: false, hint: wrapHint(msgLineSlope + msgLineIntercept, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: ax + by = 1 圖像判讀正負
                let svgHtml = _linWrapSvg(`
                    <line x1="30" y1="40" x2="180" y2="140" stroke="#8b5cf6" stroke-width="2" />
                    <text x="160" y="110" fill="#8b5cf6" font-size="12">L</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為直線 \\( L: ax + by = 1 \\) 的圖像。判斷 \\( a \\) 和 \\( b \\) 的正負號。</div>`;
                steps = [
                    { text: `尋找截距法最快：當 \\( y = 0 \\) 時，\\( ax = 1 \\implies x \\text{ 截距} = \\frac{1}{a} \\)。`, hide: false },
                    { text: `當 \\( x = 0 \\) 時，\\( by = 1 \\implies y \\text{ 截距} = \\frac{1}{b} \\)。`, hide: true },
                    { text: `從圖中看，直線與 \\( x \\) 軸交於負半軸 \\( \\implies \\frac{1}{a} < 0 \\implies a < 0 \\)。`, hide: true },
                    { text: `直線與 \\( y \\) 軸交於正半軸 \\( \\implies \\frac{1}{b} > 0 \\implies b > 0 \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( a < 0 \\text{ 且 } b > 0 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( a > 0 \\text 且 } b > 0 \\)`, isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) },
                    { text: `\\( a < 0 \\text{ 且 } b < 0 \\)`, isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) },
                    { text: `\\( a > 0 \\text{ 且 } b < 0 \\)`, isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) }
                ];
            } else {
                // Type 2: y = mx + c 的反向圖像選擇
                let svgHtml = _linWrapSvg(`
                    <line x1="20" y1="160" x2="180" y2="60" stroke="#f59e0b" stroke-width="2" />
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">若常數 \\( m > 0 \\) 且 \\( c < 0 \\)，上圖最可能是下列哪條直線的圖像？</div>`;
                steps = [
                    { text: `分析給定條件的特徵：\\( m > 0 \\) 代表直線斜率為正，即向右上傾斜。`, hide: false },
                    { text: `\\( c < 0 \\) 代表 \\( y \\) 截距為負，即直線穿過 \\( y \\) 軸的下方（負半軸）。`, hide: true },
                    { text: `對比圖像：上圖向右上傾斜（斜率為正），且與 \\( y \\) 軸相交於原點下方（截距為負），完美符合 \\( y = mx + c \\) 的型態。`, hide: false }
                ];
                options = [
                    { text: `\\( y = mx + c \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( y = -mx + c \\)`, isCorrect: false, hint: wrapHint(msgLineSlope + "<div class='text-sm text-slate-500'>提示：-mx 的斜率會變成負數，圖像應該向右下傾斜。</div>", buildEq(steps)) },
                    { text: `\\( y = mx - c \\)`, isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) },
                    { text: `\\( y = -mx - c \\)`, isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) }
                ];
            }

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：雙線圖像與係數比較 (拉分進階)";
            
            if (subType === 0) {
                // Type 0: 兩線交於正y軸 仿 2014 Q25
                let svgHtml = _linWrapSvg(`
                    <line x1="20" y1="40" x2="180" y2="160" stroke="#ef4444" stroke-width="2" />
                    <line x1="20" y1="160" x2="180" y2="40" stroke="#3b82f6" stroke-width="2" />
                    <text x="160" y="150" fill="#ef4444" font-size="12">L₁</text>
                    <text x="160" y="55" fill="#3b82f6" font-size="12">L₂</text>
                    <circle cx="100" cy="100" r="3" fill="#000" />
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中，直線 \\( L_1: y = ax + b \\) 與 \\( L_2: y = cx + d \\) 相交於正 \\( y \\) 軸上的一點。下列何者正確？<br>I. \\( a < 0 \\)<br>II. \\( c > 0 \\)<br>III. \\( b = d \\)</div>`;
                
                steps = [
                    { text: `I 正確：\\( L_1 \\) 向右下傾斜，其斜率 \\( a < 0 \\)。`, hide: false },
                    { text: `II 正確：\\( L_2 \\) 向右上傾斜，其斜率 \\( c > 0 \\)。`, hide: false },
                    { text: `III 正確：兩條直線相交於 \\( y \\) 軸，意味著它們在 \\( x=0 \\) 時有相同的 \\( y \\) 值，即兩者的 \\( y \\) 截距相等。因此 \\( b = d \\)。`, hide: true }
                ];

                options = [
                    { text: "I、II 及 III", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 II", isCorrect: false, hint: wrapHint(msgLineIntercept + "<div class='text-sm text-slate-500'>提示：既然相交在 y 軸上，它們的 y 截距（常數項）必然完全相同。</div>", buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 垂直線與斜線比較 仿 2015 Q25
                let svgHtml = _linWrapSvg(`
                    <line x1="60" y1="10" x2="60" y2="190" stroke="#ef4444" stroke-width="2" />
                    <line x1="20" y1="150" x2="160" y2="20" stroke="#3b82f6" stroke-width="2" />
                    <text x="45" y="30" fill="#ef4444" font-size="12">L₁</text>
                    <text x="140" y="45" fill="#3b82f6" font-size="12">L₂</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中，直線 \\( L_1 \\) 及直線 \\( L_2 \\) 的方程分別為 \\( ax = 1 \\) 及 \\( bx + cy = 1 \\)。下列何者正確？<br>I. \\( a < 0 \\)<br>II. \\( a < b \\)<br>III. \\( c > 0 \\)</div>`;
                
                steps = [
                    { text: `對於 \\( L_1: x = \\frac{1}{a} \\)，這是一條垂直線，交於負 \\( x \\) 軸 \\( \\implies \\frac{1}{a} < 0 \\implies a < 0 \\) (I 正確)。`, hide: false },
                    { text: `對於 \\( L_2 \\)，令 \\( y = 0 \\) 得 \\( x \\text{ 截距} = \\frac{1}{b} \\)。從圖中可看其交於正 \\( x \\) 軸 \\( \\implies b > 0 \\)。`, hide: true },
                    { text: `因為 \\( a < 0 \\) 且 \\( b > 0 \\)，所以 \\( a < b \\) (II 正確)。`, hide: true },
                    { text: `令 \\( x = 0 \\) 得 \\( L_2 \\) 的 \\( y \\text{ 截距} = \\frac{1}{c} \\)。從圖中看其交於正 \\( y \\) 軸 \\( \\implies c > 0 \\) (III 正確)。`, hide: false }
                ];
                options = [
                    { text: "I、II 及 III", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 II", isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) }
                ];
            } else {
                // Type 2: 兩條平行斜線的係數比較
                let svgHtml = _linWrapSvg(`
                    <line x1="20" y1="120" x2="160" y2="20" stroke="#10b981" stroke-width="2" />
                    <line x1="50" y1="170" x2="190" y2="70" stroke="#f59e0b" stroke-width="2" />
                    <text x="140" y="55" fill="#10b981" font-size="12">L₁</text>
                    <text x="170" y="105" fill="#f59e0b" font-size="12">L₂</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中兩條直線互相平行，方程分別為 \\( L_1: y = px + q \\) 和 \\( L_2: y = rx + s \\)。下列何者正確？</div>`;
                steps = [
                    { text: `兩線平行代表斜率相等，故 \\( p = r \\)。`, hide: false },
                    { text: `觀察 \\( y \\) 截距：\\( L_1 \\) 的交點明顯高於 \\( L_2 \\) 的交點，因此 \\( q > s \\)。`, hide: true },
                    { text: `綜合得出結論：\\( p = r \\text{ 且 } q > s \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( p = r \\text{ 且 } q > s \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( p > r \\text{ 且 } q > s \\)`, isCorrect: false, hint: wrapHint(msgLineSlope + "<div class='text-sm text-slate-500'>提示：幾何上『平行』的直線，在代數上斜率必然完全相等。</div>", buildEq(steps)) },
                    { text: `\\( p = r \\text{ 且 } q < s \\)`, isCorrect: false, hint: wrapHint(msgLineIntercept, buildEq(steps)) },
                    { text: `\\( p < r \\text{ 且 } q = s \\)`, isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) }
                ];
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：高階代數不等式與交叉相乘 (拔尖挑戰)";
            
            if (subType === 0) {
                // Type 0: ax+y=b 與 cx+y=d 交叉相乘 仿 2012 Q25
                let svgHtml = _linWrapSvg(`
                    <line x1="20" y1="50" x2="180" y2="130" stroke="#ef4444" stroke-width="2" />
                    <line x1="20" y1="30" x2="150" y2="180" stroke="#3b82f6" stroke-width="2" />
                    <text x="160" y="110" fill="#ef4444" font-size="12">L₁</text>
                    <text x="140" y="150" fill="#3b82f6" font-size="12">L₂</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中，直線 \\( L_1: ax + y = b \\) 與 \\( L_2: cx + y = d \\) 的圖像。下列何者正確？<br>I. \\( a < c \\)<br>II. \\( b > d \\)<br>III. \\( ad > bc \\)</div>`;
                
                steps = [
                    { text: `先求出基本元素：\\( L_1 \\) 斜率為 \\( -a \\)，\\( y \\text{ 截距為 } b \\)；\\( L_2 \\) 斜率為 \\( -c \\)，\\( y \\text{ 截距為 } d \\)。`, hide: false },
                    { text: `由圖可知，兩線皆向右下傾斜且 \\( L_2 \\) 更陡峭 \\( \\implies -c < -a < 0 \\implies c > a > 0 \\)，所以 \\( a < c \\) 正確 (I 正確)。`, hide: true },
                    { text: `\\( L_1 \\) 的 \\( y \\) 軸交點高於 \\( L_2 \\) \\( \\implies b > d > 0 \\)，所以 \\( b > d \\) 正確 (II 正確)。`, hide: true },
                    { text: `現在推導 \\( ad \\) 與 \\( bc \\)：已知 \\( c > a \\) 且 \\( b > d \\)（全為正數）。將 \\( a < c \\) 兩邊同乘正數 \\( d \\) 得 \\( ad < cd \\)；無法直接得出 \\( ad > bc \\) 的通用關係。`, hide: true },
                    { text: `另一個高效判定法：看 \\( x \\text{ 截距} \\)。\\( L_1 \\) 的 \\( x \\text{ 截距} = \\frac{b}{a} \\)，\\( L_2 \\) 的 \\( x \\text{ 截距} = \\frac{d}{c} \\)。由圖可見 \\( L_1 \\) 的 \\( x \\text{ 截距} > L_2 \\) 的 \\( x \\text{ 截距} \\)。`, hide: false },
                    { text: `故 \\( \\frac{b}{a} > \\frac{d}{c} \\)。因為 \\( a \\) 和 \\( c \\) 都是正數，兩邊同乘以 \\( ac \\) 不需變號，得到 \\( bc > ad \\)，即 \\( ad < bc \\)。因此 III 錯誤。`, font-weight: "bold", hide: false }
                ];

                options = [
                    { text: "只有 I 及 II", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgLineCrossProduct, buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgLineCrossProduct, buildEq(steps)) },
                    { text: "I、II 及 III", isCorrect: false, hint: wrapHint(msgLineCrossProduct + "<div class='text-sm text-slate-500'>提示：利用 x 截距的相對位置來建立分數不等式，再移項乘開，是解第三個敘述的最佳武器！</div>", buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 係數乘積正負號的綜合推演
                let svgHtml = _linWrapSvg(`
                    <line x1="20" y1="160" x2="160" y2="20" stroke="#8b5cf6" stroke-width="2" />
                    <text x="140" y="50" fill="#8b5cf6" font-size="12">L: ax+by=1</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為直線 \\( L: ax + by = 1 \\) 的圖像。下列哪一個代數式的值必定為負數？</div>`;
                steps = [
                    { text: `首先確定 \\( a \\) 和 \\( b \\) 的正負：\\( x \\text{ 截距} = \\frac{1}{a} \\)，\\( y \\text{ 截距} = \\frac{1}{b} \\)。`, hide: false },
                    { text: `圖中直線交於正 \\( x \\) 軸及正 \\( y \\) 軸，因此 \\( \\frac{1}{a} > 0 \\implies a > 0 \\) 且 \\( \\frac{1}{b} > 0 \\implies b > 0 \\)。`, hide: true },
                    { text: `再看斜率：\\( m = -\\frac{a}{b} \\)。因為 \\( a > 0, b > 0 \\)，所以 \\( -\\frac{a}{b} \\) 的值必然是負數。`, hide: false }
                ];
                options = [
                    { text: `\\( -\\frac{a}{b} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ab \\)`, isCorrect: false, hint: wrapHint(msgLineSlope + "<div class='text-sm text-slate-500'>提示：a 和 b 都大於 0，所以它们的乘積 ab 必定是正數。</div>", buildEq(steps)) },
                    { text: `\\( a + b \\)`, isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) },
                    { text: `\\( a^2b \\)`, isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) }
                ];
            } else {
                // Type 2: 垂直線與變量斜率的乘積關係
                let svgHtml = _linWrapSvg(`
                    <line x1="140" y1="10" x2="140" y2="190" stroke="#ef4444" stroke-width="2" />
                    <line x1="20" y1="160" x2="180" y2="40" stroke="#3b82f6" stroke-width="2" />
                    <text x="145" y="30" fill="#ef4444" font-size="12">L₁: px=1</text>
                    <text x="150" y="65" fill="#3b82f6" font-size="12">L₂: qx+y=1</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中，直線 \\( L_1: px = 1 \\) 與 \\( L_2: qx + y = 1 \\)。下列何者正確？</div>`;
                steps = [
                    { text: `分析 \\( L_1 \\)：垂直線交於正 \\( x \\) 軸 \\( \\implies \\frac{1}{p} > 0 \\implies p > 0 \\)。`, hide: false },
                    { text: `分析 \\( L_2 \\)：\\( y = -qx + 1 \\)，向右上傾斜 \\( \\implies \\text{斜率 } -q > 0 \\implies q < 0 \\)。`, hide: true },
                    { text: `由此可知 \\( p \\) 是正數，\\( q \\) 是負數，故 \\( pq < 0 \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( pq < 0 \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( pq > 0 \\)`, isCorrect: false, hint: wrapHint(msgLineSlope + "<div class='text-sm text-slate-500'>提示：注意 L2 方程的斜率是 -q。因為向右上傾斜，所以 -q > 0，從而 q < 0。</div>", buildEq(steps)) },
                    { text: `\\( p + q < 0 \\)`, isCorrect: false, hint: wrapHint(msgLineInequality, buildEq(steps)) },
                    { text: `\\( p < -q \\)`, isCorrect: false, hint: wrapHint(msgLineInequality, buildEq(steps)) }
                ];
            }
        }

        // 去重並封裝選項
        options = [...new Map(options.map(item => [item.text, item])).values()];
        while(options.length < 4) {
            options.push({ text: `無法判定`, isCorrect: false, hint: wrapHint(msgLineSlope, buildEq(steps)) });
            options = [...new Map(options.map(item => [item.text, item])).values()];
        }
        options = options.slice(0, 4);

        qObj.options = _linShuffle(options).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx)
        }));

        bank.push(qObj);
    }
    return bank;
}
