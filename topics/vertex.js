// js/topics/vertex.js

// ==========================================
// 頂點與二次圖像專屬錯誤提示訊息
// ==========================================
const msgVertexForm = `<div class="text-red-600 font-bold text-lg mb-1">❗ 頂點式坐標判讀錯誤</div><div class="text-sm text-slate-500 mb-2">對於頂點式 \\( y = a(x-h)^2 + k \\)，頂點坐標為 \\( (h, k) \\)。請特別留意括號內的符號：若是 \\( (x+h)^2 \\)，則頂點的 \\( x \\) 坐標為 \\( -h \\)。</div>`;
const msgOpenDir = `<div class="text-red-600 font-bold text-lg mb-1">❗ 開口方向判斷錯誤</div><div class="text-sm text-slate-500 mb-2">二次圖像的開口方向由 \\( x^2 \\) 的係數決定。係數為正數時，開口向上 (∪)；係數為負數時，開口向下 (∩)。展開式子時要小心負號。</div>`;
const msgSymmAxis = `<div class="text-red-600 font-bold text-lg mb-1">❗ 對稱軸或交點關係錯誤</div><div class="text-sm text-slate-500 mb-2">對稱軸會穿過頂點，其方程為 \\( x = h \\) 或 \\( x = -\\frac{b}{2a} \\)。若圖像與水平線交於兩點，對稱軸必定位於這兩點的正中間。</div>`;
const msgInequality = `<div class="text-red-600 font-bold text-lg mb-1">❗ 係數不等式推導錯誤</div><div class="text-sm text-slate-500 mb-2">在推導如 \\( ab < 1 \\) 或判別式符號時，必須結合「開口方向」、「頂點坐標位置 (正負)」及「\\( y \\) 截距」三個線索，並留意不等式同乘/除負數時需要變號。</div>`;

// ==========================================
// 輔助函數：動態生成 SVG 圖像線條
// ==========================================
function _vtxWrapSvg(content) {
    return `
    <div class="flex justify-center my-4">
        <svg width="200" height="200" viewBox="0 0 200 200" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 10 5 L 0 8 z" fill="#64748b" />
                </marker>
            </defs>
            <line x1="10" y1="100" x2="190" y2="100" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)" />
            <line x1="100" y1="190" x2="100" y2="10" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)" />
            <text x="185" y="115" font-size="12" fill="#64748b" font-family="sans-serif">x</text>
            <text x="110" y="20" font-size="12" fill="#64748b" font-family="sans-serif">y</text>
            <text x="88" y="114" font-size="11" fill="#64748b" font-family="sans-serif">O</text>
            ${content}
        </svg>
    </div>`;
}

function drawParabola(vx, vy, a, color="#3b82f6") {
    let path = ``;
    let first = true;
    for(let i = -150; i <= 150; i+=10) {
        let px = vx + i;
        let py = vy - a * (i * i);
        if (first) { path += `M ${px},${py} `; first = false; }
        else { path += `L ${px},${py} `; }
    }
    return `<path d="${path}" fill="none" stroke="${color}" stroke-width="2" />`;
}

function _vtxShuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// ==========================================
// 主題目生成器：頂點與二次圖像
// ==========================================
function generateVertexQuestions(num, levelPref) {
    const bank = [];
    for (let i = 0; i < num; i++) {
        let levelType = levelPref;
        if (levelPref === 'mixed') {
            const types = ['1', '2', '3', '4'];
            levelType = types[Math.floor(Math.random() * types.length)];
        } else {
            levelType = String(levelPref);
        }

        let qObj = { id: i + 1, topic: "頂點與二次圖像" };
        let options = [];
        let steps = [];
        let subType = Math.floor(Math.random() * 3);

        if (levelType === '1') {
            qObj.level = "⭐ 程度 1：基礎圖像特徵判讀 (補底基本功)";
            
            if (subType === 0) {
                // Type 0: 代數形式 y = C - (x-H)^2 仿 2018 Q5
                let H = Math.floor(Math.random() * 4) + 3; // 3 to 6
                let C = Math.floor(Math.random() * 10) + 10; // 10 to 19
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">下列有關 \\( y = ${C} - (x - ${H})^2 \\) 的圖像之敍述，何者正確？</div>`;
                
                steps = [
                    { text: `將方程重新排列：\\( y = -(x - ${H})^2 + ${C} \\)。`, hide: false },
                    { text: `\\( x^2 \\) 的係數為負數 (\\( -1 \\))，因此該圖像開口向下。`, hide: true },
                    { text: `頂點坐標為 \\( (${H}, ${C}) \\)。因為開口向下且頂點的 \\( y \\) 坐標為正數 (\\( ${C} > 0 \\))，圖像必定與 \\( x \\) 軸相交。`, hide: true },
                    { text: `代入 \\( x = 0 \\)，求 \\( y \\) 截距：\\( y = ${C} - (0 - ${H})^2 = ${C} - ${H*H} = ${C - H*H} \\)。`, hide: false }
                ];

                options = [
                    { text: "該圖像與 \\( x \\) 軸相交。", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "該圖像開口向上。", isCorrect: false, hint: wrapHint(msgOpenDir, buildEq(steps)) },
                    { text: `該圖像的 \\( y \\) 截距為 \\( ${C} \\)。`, isCorrect: false, hint: wrapHint(msgVertexForm + "<div class='text-sm text-slate-500'>提示：y 截距必須代入 x=0 計算，並非直接看頂點的 y 坐標。</div>", buildEq(steps)) },
                    { text: "該圖像通過原點。", isCorrect: false, hint: wrapHint(msgVertexForm, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 代數形式 y = (A-x)(x+B)+C 仿 2019 Q10
                let A = Math.floor(Math.random() * 3) + 2; // 2,3,4
                let B = Math.floor(Math.random() * 3) + 2; // 2,3,4
                let C = Math.floor(Math.random() * 5) + 3; // 3 to 7
                let x_test = 1;
                let y_test = (A - x_test) * (x_test + B) + C;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">下列有關 \\( y = (${A} - x)(x + ${B}) + ${C} \\) 的圖像之敍述，何者正確？<br>I. 該圖像開口向下。<br>II. 該圖像通過點 \\( (${x_test}, ${y_test}) \\)。<br>III. 該圖像的 \\( x \\) 截距為 \\( ${A} \\) 及 \\( -${B} \\)。</div>`;
                
                steps = [
                    { text: `I 正確：展開最高次項，\\( (-x)(x) = -x^2 \\)，係數為負數，所以開口向下。`, hide: false },
                    { text: `II 正確：代入 \\( x = ${x_test} \\)，\\( y = (${A} - ${x_test})(${x_test} + ${B}) + ${C} = (${A-x_test})(${x_test+B}) + ${C} = ${y_test} \\)。`, hide: false },
                    { text: `III 錯誤：要找 \\( x \\) 截距需令 \\( y = 0 \\)。\\( (${A} - x)(x + ${B}) + ${C} = 0 \\) 的解並非直接是括號內的數值，因為後面還有 \\( +${C} \\) 影響。`, hide: true }
                ];

                options = [
                    { text: "只有 I 及 II", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgVertexForm + "<div class='text-sm text-slate-500'>提示：若沒有後面的常數 C，截距才會是那兩個數。</div>", buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgOpenDir, buildEq(steps)) },
                    { text: "I、II 及 III", isCorrect: false, hint: wrapHint(msgVertexForm, buildEq(steps)) }
                ];
            } else {
                // Type 2: 代數形式 y = (m-x)^2+n 仿 2021 Q14
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">設 \\( m \\) 及 \\( n \\) 均為實常數。下列有關 \\( y = (m - x)^2 + n \\) 的圖像之敍述，何者必為正確？<br>I. 該圖像開口向上。<br>II. 該圖像的 \\( y \\) 截距為正值。<br>III. 該圖像通過點 \\( (n, m) \\)。</div>`;
                
                steps = [
                    { text: `I 正確：展開式子得 \\( y = (x - m)^2 + n = x^2 - 2mx + m^2 + n \\)。\\( x^2 \\) 係數為正數 (\\( 1 \\))，開口必向上。`, hide: false },
                    { text: `II 錯誤：代入 \\( x = 0 \\) 得 \\( y \\) 截距為 \\( m^2 + n \\)。因為 \\( n \\) 可以是負數且絕對值大於 \\( m^2 \\)，故不一定為正值。`, hide: true },
                    { text: `III 錯誤：圖像的頂點是 \\( (m, n) \\)（因為 \\( (m-x)^2 = (x-m)^2 \\)），而不是 \\( (n, m) \\)。`, hide: true }
                ];
                
                options = [
                    { text: "只有 I", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 II", isCorrect: false, hint: wrapHint(msgOpenDir, buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgVertexForm, buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgVertexForm, buildEq(steps)) }
                ];
            }

        } else if (levelType === '2') {
            qObj.level = "⭐⭐ 程度 2：頂點式參數符號判讀 (建基)";
            
            if (subType === 0) {
                // Type 0: 圖形 y = a(x+b)^2 仿 2012 Q6
                let svgHtml = _vtxWrapSvg(`
                    ${drawParabola(60, 100, 0.015, "#ef4444")}
                    <text x="45" y="115" font-size="10" fill="#000">(-b, 0)</text>
                    <circle cx="60" cy="100" r="3" fill="#000" />
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為 \\( y = a(x + b)^2 \\) 的圖像，其中 \\( a \\) 及 \\( b \\) 均為常數。下列何者正確？</div>`;
                
                steps = [
                    { text: `由圖可見，圖像開口向上，因此 \\( x^2 \\) 的係數必須為正數，即 \\( a > 0 \\)。`, hide: false },
                    { text: `根據方程 \\( y = a(x + b)^2 \\)，頂點坐標為 \\( (-b, 0) \\)。`, hide: true },
                    { text: `由圖可見，頂點位於 \\( x \\) 軸的負半部分，這意味著 \\( -b < 0 \\)。`, hide: true },
                    { text: `將不等式兩邊同乘以 \\( -1 \\) 並變號，得到 \\( b > 0 \\)。`, hide: false }
                ];

                options = [
                    { text: "\\( a > 0 \\) 及 \\( b > 0 \\)", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "\\( a > 0 \\) 及 \\( b < 0 \\)", isCorrect: false, hint: wrapHint(msgVertexForm + "<div class='text-sm text-slate-500'>提示：括號內是 (x+b)，所以對應的 x 坐標是 -b。位於左方代表 -b < 0。</div>", buildEq(steps)) },
                    { text: "\\( a < 0 \\) 及 \\( b > 0 \\)", isCorrect: false, hint: wrapHint(msgOpenDir, buildEq(steps)) },
                    { text: "\\( a < 0 \\) 及 \\( b < 0 \\)", isCorrect: false, hint: wrapHint(msgOpenDir + msgVertexForm, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 圖形 y = (px+5)^2+q 仿 2017 Q6
                let svgHtml = _vtxWrapSvg(`
                    ${drawParabola(140, 160, -0.015, "#8b5cf6")}
                    <circle cx="140" cy="160" r="3" fill="#000" />
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為 \\( y = -(px - 5)^2 + q \\) 的圖像，其中 \\( p \\) 及 \\( q \\) 均為非零常數。下列何者正確？</div>`;
                
                steps = [
                    { text: `圖像的頂點式為 \\( y = -(px - 5)^2 + q \\)，令 \\( px - 5 = 0 \\implies x = \\frac{5}{p} \\)，所以頂點為 \\( (\\frac{5}{p}, q) \\)。`, hide: false },
                    { text: `由圖可見，頂點位於第四象限 (右下方)，即 \\( x \\) 坐標為正數，\\( y \\) 坐標為負數。`, hide: true },
                    { text: `對於 \\( x \\) 坐標：\\( \\frac{5}{p} > 0 \\implies p > 0 \\)。`, hide: true },
                    { text: `對於 \\( y \\) 坐標：\\( q < 0 \\)。因此，\\( p > 0 \\) 及 \\( q < 0 \\)。`, hide: false }
                ];
                options = [
                    { text: "\\( p > 0 \\) 及 \\( q < 0 \\)", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "\\( p < 0 \\) 及 \\( q < 0 \\)", isCorrect: false, hint: wrapHint(msgVertexForm, buildEq(steps)) },
                    { text: "\\( p > 0 \\) 及 \\( q > 0 \\)", isCorrect: false, hint: wrapHint(msgVertexForm, buildEq(steps)) },
                    { text: "\\( p < 0 \\) 及 \\( q > 0 \\)", isCorrect: false, hint: wrapHint(msgVertexForm, buildEq(steps)) }
                ];
            } else {
                // Type 2: 圖形 y = ax^2+bx+c 的係數
                let svgHtml = _vtxWrapSvg(`
                    ${drawParabola(130, 40, 0.012, "#10b981")}
                `);
                // 頂點在第一象限 (130, 40)。 a > 0。 x = -b/2a > 0 => b < 0。 c 是 y截距, x=0, px=130, i=-130. y = 40 + a*130^2 = positive. 
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為 \\( y = ax^2 + bx + c \\) 的圖像。下列何者正確？<br>I. \\( a > 0 \\)<br>II. \\( c > 0 \\)<br>III. \\( b < 0 \\)</div>`;
                steps = [
                    { text: `I 正確：圖像開口向上，因此二次項係數 \\( a > 0 \\)。`, hide: false },
                    { text: `II 正確：圖像與 \\( y \\) 軸的交點（即 \\( c \\)）位於 \\( x \\) 軸的上方，因此 \\( c > 0 \\)。`, hide: true },
                    { text: `III 正確：對稱軸公式為 \\( x = -\\frac{b}{2a} \\)。由圖可見對稱軸在 \\( y \\) 軸右方，即 \\( -\\frac{b}{2a} > 0 \\)。`, hide: true },
                    { text: `因為已知 \\( a > 0 \\)，所以分母為正數。故分子 \\( -b \\) 必須大於 0，即 \\( b < 0 \\)。`, hide: false }
                ];
                options = [
                    { text: "I、II 及 III", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 II", isCorrect: false, hint: wrapHint(msgSymmAxis + "<div class='text-sm text-slate-500'>提示：利用對稱軸 -b/(2a) 與 a 的正負號，可以完美推導出 b 的正負號。</div>", buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgInequality, buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgOpenDir, buildEq(steps)) }
                ];
            }

        } else if (levelType === '3') {
            qObj.level = "⭐⭐⭐ 程度 3：對稱軸與交點 (進階)";
            
            if (subType === 0) {
                // Type 0: 交水平線求對稱軸 仿 2012SP Q8
                let svgHtml = _vtxWrapSvg(`
                    ${drawParabola(100, 160, -0.015, "#f59e0b")}
                    <line x1="10" y1="60" x2="190" y2="60" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4" />
                    <circle cx="50" cy="60" r="3" fill="#000" />
                    <circle cx="150" cy="60" r="3" fill="#000" />
                    <text x="180" y="55" fill="#0ea5e9" font-size="12">L</text>
                    <text x="35" y="75" font-size="10">A(-2, k)</text>
                    <text x="145" y="75" font-size="10">B(6, k)</text>
                `);
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中，二次圖像 \\( y = f(x) \\) 與水平直線 \\( L: y = k \\) 相交於 \\( A(-2, k) \\) 及 \\( B(6, k) \\)。下列何者正確？<br>I. 不等式 \\( f(x) > k \\) 的解為 \\( -2 < x < 6 \\)。<br>II. 方程 \\( f(x) = k \\) 的根為 \\( -2 \\) 及 \\( 6 \\)。<br>III. 該二次圖像的對稱軸的方程為 \\( x = 4 \\)。</div>`;
                
                steps = [
                    { text: `I 正確：由圖可見，介於 \\( A \\) 和 \\( B \\) 之間時，曲線 \\( f(x) \\) 位於直線 \\( y = k \\) 的上方，因此 \\( f(x) > k \\) 在 \\( -2 < x < 6 \\) 時成立。`, hide: false },
                    { text: `II 正確：\\( f(x) \\) 與 \\( y=k \\) 的交點之 \\( x \\) 坐標就是方程的根，即 \\( -2 \\) 和 \\( 6 \\)。`, hide: false },
                    { text: `III 錯誤：拋物線具有對稱性，對稱軸必過兩交點的中間。中點 \\( x \\) 坐標為 \\( \\frac{-2 + 6}{2} = 2 \\)，故對稱軸應為 \\( x = 2 \\)。`, hide: true }
                ];

                options = [
                    { text: "只有 I 及 II", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgSymmAxis + "<div class='text-sm text-slate-500'>提示：對稱軸應為兩點的平均值，而不是相加。</div>", buildEq(steps)) },
                    { text: "只有 II 及 III", isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) },
                    { text: "I、II 及 III", isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 代數配方法找頂點
                let a = (Math.floor(Math.random() * 3) + 2) * -1; // -2, -3, -4
                let h = Math.floor(Math.random() * 3) + 2; 
                let k = Math.floor(Math.random() * 5) + 3;
                // y = a(x-h)^2 + k = ax^2 - 2ahx + ah^2 + k
                let b = -2 * a * h;
                let c = a * h * h + k;
                let eqStr = `${a}x^2 + ${b}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">求二次函數 \\( y = ${eqStr} \\) 的頂點坐標。</div>`;
                steps = [
                    { text: `方法一：利用對稱軸公式 \\( x = -\\frac{b}{2a} \\)。`, hide: false },
                    { text: `代入係數：\\( x = -\\frac{${b}}{2(${a})} = -\\frac{${b}}{${2*a}} = ${h} \\)。`, hide: true },
                    { text: `將 \\( x = ${h} \\) 代回函數求 \\( y \\)：\\( y = ${a}(${h})^2 + ${b}(${h}) ${c >= 0 ? '+ ' + c : c} = ${k} \\)。`, hide: true },
                    { text: `因此頂點坐標為 \\( (${h}, ${k}) \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( (${h}, ${k}) \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( (-${h}, ${k}) \\)`, isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) },
                    { text: `\\( (${h}, ${c}) \\)`, isCorrect: false, hint: wrapHint(msgSymmAxis + "<div class='text-sm text-slate-500'>提示：這不是 y 截距，必須將 x 代回原式計算 y。</div>", buildEq(steps)) },
                    { text: `\\( (-${h}, ${c}) \\)`, isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) }
                ];
            } else {
                // Type 2: 圖像代數特徵綜合 (Delta 與 對稱軸)
                let svgHtml = _vtxWrapSvg(`
                    ${drawParabola(60, 60, 0.012, "#ec4899")}
                `);
                // 頂點在第二象限 (60, 60), 原點在(100, 100), 所以 x<0, y>0.
                // a>0, -b/2a < 0 => b>0. 圖像沒有接觸x軸(因為a>0且頂點y>0) => Delta < 0.
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為 \\( y = px^2 + qx + r \\) 的圖像。下列何者正確？<br>I. \\( q < 0 \\)<br>II. \\( r > 0 \\)<br>III. \\( q^2 - 4pr < 0 \\)</div>`;
                steps = [
                    { text: `圖像開口向上 \\( \\implies p > 0 \\)。對稱軸在左方 \\( \\implies -\\frac{q}{2p} < 0 \\implies q > 0 \\) (I 錯誤)。`, hide: false },
                    { text: `圖像與 \\( y \\) 軸交於正半部分 \\( \\implies r > 0 \\) (II 正確)。`, hide: true },
                    { text: `圖像與 \\( x \\) 軸沒有交點，代表方程 \\( px^2 + qx + r = 0 \\) 沒有實根。`, hide: true },
                    { text: `因此其判別式 \\( \\Delta < 0 \\)，即 \\( q^2 - 4pr < 0 \\) (III 正確)。`, hide: false }
                ];
                options = [
                    { text: "只有 II 及 III", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 II", isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) },
                    { text: "只有 I 及 III", isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) },
                    { text: "I、II 及 III", isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) }
                ];
            }

        } else {
            qObj.level = "⭐⭐⭐⭐ 程度 4：綜合高階推論與代數幾何轉換 (拔尖挑戰)";
            
            if (subType === 0) {
                // Type 0: 頂點條件推導 a,b,c 不等式 仿 2012PP Q8 (超級經典題)
                let svgHtml = _vtxWrapSvg(`
                    ${drawParabola(140, 40, -0.015, "#14b8a6")}
                `);
                // 開口向下 a<0. 頂點在 Q1 (140, 40). y = ax^2 + 4x + c.
                // 對稱軸 x = -4/2a = -2/a > 0 => a<0.
                // 頂點 y = c - 4/a > 0 => c > 4/a. 由於 a<0, 兩邊乘 a 需變號: ac < 4.
                qObj.question = `${svgHtml}<div class="mb-4 text-base sm:text-lg text-slate-600">圖中所示為 \\( y = ax^2 + 4x + c \\) 的圖像，其中 \\( a \\) 及 \\( c \\) 均為常數。下列何者正確？<br>I. \\( a > 0 \\)<br>II. \\( c > 0 \\)<br>III. \\( ac < 4 \\)</div>`;
                
                steps = [
                    { text: `I 錯誤：圖像開口向下，所以 \\( a < 0 \\)。`, hide: false },
                    { text: `II 正確：圖像與 \\( y \\) 軸的交點在正半軸，所以 \\( c > 0 \\)。`, hide: true },
                    { text: `III 正確：這是最難的部分。利用頂點坐標！對稱軸 \\( x = -\\frac{4}{2a} = -\\frac{2}{a} \\)。`, hide: true },
                    { text: `將其代入求頂點的 \\( y \\) 坐標：\\( y = a(-\\frac{2}{a})^2 + 4(-\\frac{2}{a}) + c = \\frac{4}{a} - \\frac{8}{a} + c = c - \\frac{4}{a} \\)。`, hide: true },
                    { text: `由圖可見頂點在 \\( x \\) 軸上方，故 \\( y > 0 \\implies c - \\frac{4}{a} > 0 \\implies c > \\frac{4}{a} \\)。`, hide: true },
                    { text: `由於我們已知 \\( a < 0 \\)，將不等式兩邊同乘以負數 \\( a \\) 時，不等號必須轉向！得 \\( ac < 4 \\)。`, hide: false }
                ];

                options = [
                    { text: "只有 II 及 III", isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: "只有 I 及 II", isCorrect: false, hint: wrapHint(msgInequality, buildEq(steps)) },
                    { text: "只有 III", isCorrect: false, hint: wrapHint(msgInequality, buildEq(steps)) },
                    { text: "I、II 及 III", isCorrect: false, hint: wrapHint(msgInequality, buildEq(steps)) }
                ];
            } else if (subType === 1) {
                // Type 1: 二次函數的平移與反射
                let h = Math.floor(Math.random() * 4) + 2; 
                let k = Math.floor(Math.random() * 4) + 2;
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">已知二次函數 \\( y = f(x) \\) 的頂點為 \\( (${h}, ${k}) \\)。求 \\( y = -f(x - 3) + 2 \\) 的頂點坐標。</div>`;
                
                steps = [
                    { text: `需要逐步拆解圖像變換對頂點坐標 \\( (x, y) \\) 的影響。原本頂點為 \\( (${h}, ${k}) \\)。`, hide: false },
                    { text: `第一步：\\( f(x - 3) \\) 代表圖像向右平移 3 單位。新的 \\( x \\) 坐標變成 \\( ${h} + 3 = ${h+3} \\)。`, hide: true },
                    { text: `第二步：\\( -f(...) \\) 代表圖像對 \\( x \\) 軸反射，\\( y \\) 坐標反號，變成 \\( -${k} \\)。`, hide: true },
                    { text: `第三步：\\( + 2 \\) 代表圖像向上平移 2 單位。最終的 \\( y \\) 坐標變成 \\( -${k} + 2 = ${-k+2} \\)。`, hide: true },
                    { text: `因此，新的頂點坐標為 \\( (${h+3}, ${-k+2}) \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( (${h+3}, ${-k+2}) \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( (${h-3}, ${-k+2}) \\)`, isCorrect: false, hint: wrapHint(msgVertexForm + "<div class='text-sm text-slate-500'>提示：f(x-3) 是向右平移，x 坐標應該加 3 而非減 3。</div>", buildEq(steps)) },
                    { text: `\\( (${h+3}, ${-k-2}) \\)`, isCorrect: false, hint: wrapHint(msgInequality, buildEq(steps)) },
                    { text: `\\( (${h-3}, ${k+2}) \\)`, isCorrect: false, hint: wrapHint(msgInequality, buildEq(steps)) }
                ];
            } else {
                // Type 2: 頂點位於特定直線上
                let p = Math.floor(Math.random() * 3) + 2; 
                let p2 = 2 * p; // y = x^2 - p2 x + c
                // vertex x = p
                // line y = 2x - 3 => vertex y = 2p - 3
                // vertex y = p^2 - p2(p) + c = -p^2 + c = 2p - 3 => c = p^2 + 2p - 3
                let c = p*p + 2*p - 3;
                let eqStr = `x^2 - ${p2}x + k`;
                
                qObj.question = `<div class="mb-4 text-base sm:text-lg text-slate-600">若二次函數 \\( y = ${eqStr} \\) 的頂點位於直線 \\( y = 2x - 3 \\) 上，求常數 \\( k \\) 的值。</div>`;
                steps = [
                    { text: `首先找出二次函數的頂點坐標（以 \\( k \\) 表示）。`, hide: false },
                    { text: `對稱軸 \\( x = -\\frac{-${p2}}{2(1)} = ${p} \\)。`, hide: true },
                    { text: `將 \\( x = ${p} \\) 代入求 \\( y \\) 坐標：\\( y = (${p})^2 - ${p2}(${p}) + k = ${p*p} - ${p2*p} + k = k - ${p*p} \\)。頂點為 \\( (${p}, k - ${p*p}) \\)。`, hide: true },
                    { text: `因為頂點位於直線 \\( y = 2x - 3 \\) 上，將點代入直線方程：`, hide: true },
                    { text: `\\( k - ${p*p} = 2(${p}) - 3 = ${2*p - 3} \\implies k = ${2*p - 3} + ${p*p} = ${c} \\)。`, hide: false }
                ];
                options = [
                    { text: `\\( ${c} \\)`, isCorrect: true, hint: wrapHint(msgCorrect, buildEq(steps)) },
                    { text: `\\( ${c + 4} \\)`, isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) },
                    { text: `\\( ${p*p - 2*p + 3} \\)`, isCorrect: false, hint: wrapHint(msgSymmAxis + "<div class='text-sm text-slate-500'>提示：計算 y 坐標或代入直線方程時，留意移項的符號。</div>", buildEq(steps)) },
                    { text: `\\( ${c - 2} \\)`, isCorrect: false, hint: wrapHint(msgSymmAxis, buildEq(steps)) }
                ];
            }
        }

        // 去重並封裝選項
        options = [...new Map(options.map(item => [item.text, item])).values()];
        let loopProtect = 1;
        while(options.length < 4) {
            options.push({ text: `\\( ${loopProtect * 7} \\)`, isCorrect: false, hint: wrapHint(msgInequality, buildEq(steps)) });
            loopProtect++;
            options = [...new Map(options.map(item => [item.text, item])).values()];
        }
        options = options.slice(0, 4);

        qObj.options = _vtxShuffle(options).map((opt, idx) => ({
            ...opt,
            id: String.fromCharCode(65 + idx)
        }));

        bank.push(qObj);
    }
    return bank;
}
