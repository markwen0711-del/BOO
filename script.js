// script.js

// 取得 HTML 元素
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayDesc = document.getElementById('overlay-desc');
const finalScoreEl = document.getElementById('final-score');
const finalScoreSp = finalScoreEl.querySelector('span');
const container = document.getElementById('balloon-container');

// 遊戲狀態變數
let score = 0;
let time = 30; // 30 秒遊戲時間
let gameInterval = null;
let timerInterval = null;
let isPlaying = false;

// 鮮豔的氣球顏色（小孩子會喜歡的明亮色彩）
const balloonColors = [
    '#ff4d4d', // 紅
    '#ff9f43', // 橘
    '#feca57', // 黃
    '#1dd1a1', // 綠
    '#48dbfb', // 淺藍
    '#5f27cd', // 紫
    '#ff9ff3', // 粉紅
    '#00d2d3'  // 湖水綠
];

// 初始化與重置
function initGame() {
    score = 0;
    time = 30;
    isPlaying = true;
    scoreEl.innerText = score;
    timerEl.innerText = time;
    container.innerHTML = '';
    
    overlay.classList.remove('active');
    finalScoreEl.classList.add('hidden');
    overlayTitle.innerText = "彩色氣球派對 🎈";
    overlayTitle.style.animation = "none"; // 遊戲中暫停主標題動畫
    
    // 開始計時
    timerInterval = setInterval(updateTimer, 1000);
    
    // 開始不斷產生氣球
    gameInterval = setInterval(createBalloon, 600);
}

// 結束遊戲
function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    
    // 移除所有正在飄浮的氣球
    container.innerHTML = '';
    
    // 顯示結束畫面
    overlayTitle.innerText = "時間到！ 🎈";
    overlayTitle.style.animation = "bounce 2s infinite ease-in-out";
    overlayDesc.innerText = "你太棒了！準備好再來一次了嗎？";
    finalScoreSp.innerText = score;
    finalScoreEl.classList.remove('hidden');
    startBtn.innerText = "再玩一次！";
    overlay.classList.add('active');
}

// 更新計時器
function updateTimer() {
    time--;
    timerEl.innerText = time;
    if (time <= 0) {
        endGame();
    }
}

// 產生隨機顏色的氣球
function createBalloon() {
    if (!isPlaying) return;

    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    
    // 隨機顏色
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.backgroundColor = color;
    balloon.style.borderBottomColor = color; // 讓氣球的結顏色一致

    // 隨機 X 軸位置 (限制在畫布內)
    const containerWidth = window.innerWidth;
    // 氣球寬度約 80，保留一些邊距
    const randomX = Math.random() * (containerWidth - 100); 
    balloon.style.left = `${randomX}px`;

    // 隨機飄浮速度 (動畫時間)
    const floatDuration = Math.random() * 3 + 3; // 3 到 6 秒
    balloon.style.animationDuration = `${floatDuration}s`;

    // 新增氣球的線
    const string = document.createElement('div');
    string.classList.add('string');
    // 把線放在氣球的正下方居中
    string.style.left = '50%';
    string.style.transform = 'translateX(-50%)';
    balloon.appendChild(string);

    // 點擊事件 (支援滑鼠與觸控)
    balloon.addEventListener('pointerdown', () => popBalloon(balloon, color, randomX));

    // 自動移除飛出視窗的氣球
    balloon.addEventListener('animationend', () => {
        if (balloon.parentElement === container) {
            container.removeChild(balloon);
        }
    });

    container.appendChild(balloon);
}

// 戳破氣球
function popBalloon(balloon, color, xPos) {
    if (!isPlaying) return;
    
    // 播放一個簡單的音效 (小知識：瀏覽器需要使用者的互動才能播音效，這裡直接用視覺效果代替讓遊戲更順暢)
    // 增加分數
    score++;
    scoreEl.innerText = score;

    // 獲取氣球當前的位置 (Y軸可能會因為動畫變動，我們抓螢幕上的真實位置)
    const rect = balloon.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // 產生粒子特效
    createParticles(x, y, color);

    // 移除氣球
    if (balloon.parentElement === container) {
        container.removeChild(balloon);
    }
    
    // 動態放大分數 (視覺回饋)
    scoreEl.style.transform = 'scale(1.5)';
    setTimeout(() => {
        scoreEl.style.transform = 'scale(1)';
        scoreEl.style.transition = 'transform 0.2s ease';
    }, 150);
}

// 產生粒子爆炸效果
function createParticles(x, y, color) {
    const particleCount = 8; // 產生 8 個小碎片
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.backgroundColor = color;
        
        // 設定初始位置
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        container.appendChild(particle);
        
        // 隨機噴射方向
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 50 + 50; // 擴散距離
        const animateX = Math.cos(angle) * velocity;
        const animateY = Math.sin(angle) * velocity;
        
        // 使用 Web Animations API 直接套用動畫
        const animation = particle.animate([
            { transform: `translate(0, 0) scale(1)`, opacity: 1 },
            { transform: `translate(${animateX}px, ${animateY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 400,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });
        
        // 動畫結束後移除粒子
        animation.onfinish = () => {
            if (particle.parentElement === container) {
                container.removeChild(particle);
            }
        };
    }
}

// 綁定開始按鈕事件
startBtn.addEventListener('click', initGame);
