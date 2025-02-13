const canvas = document.getElementById("puzzle-canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "puzzle-image.jpg";
const rows = 4, cols = 4;
let pieces = [];
let pieceWidth, pieceHeight;
let selectedPiece = null;
let touchStartPos = null;

document.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();
});

img.onload = function() {
    resizeCanvas();
    initializePuzzle();
};

function resizeCanvas() {
    const maxWidth = Math.min(window.innerWidth * 0.9, 600);
    const maxHeight = Math.min(window.innerHeight * 0.9, 1100);
    const aspectRatio = img.width / img.height;
    
    let newWidth = maxWidth;
    let newHeight = newWidth / aspectRatio;
    
    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
    }
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    pieceWidth = img.width / cols;
    pieceHeight = img.height / rows;
    
    initializePuzzle();
}

window.addEventListener("resize", resizeCanvas);

function initializePuzzle() {
    pieces = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            pieces.push({ x, y, correctX: x, correctY: y });
        }
    }
    shufflePieces();
}

function shufflePieces() {
    for (let i = pieces.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [pieces[i].x, pieces[j].x] = [pieces[j].x, pieces[i].x];
        [pieces[i].y, pieces[j].y] = [pieces[j].y, pieces[i].y];
    }
    drawPuzzle();
}

function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let piece of pieces) {
        ctx.drawImage(img, 
            piece.correctX * pieceWidth, piece.correctY * pieceHeight, pieceWidth, pieceHeight, 
            piece.x * (canvas.width / cols), piece.y * (canvas.height / rows), 
            canvas.width / cols, canvas.height / rows
        );
    }
    checkCompletion();
}

function checkCompletion() {
    if (pieces.every(p => p.x === p.correctX && p.y === p.correctY)) {
        document.getElementById("completion-message").style.display = "block";
    }
}

function getPointerPos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((event.clientX - rect.left) / (canvas.width / cols)),
        y: Math.floor((event.clientY - rect.top) / (canvas.height / rows))
    };
}

canvas.addEventListener("pointerdown", function(e) {
    e.preventDefault();
    let pos = getPointerPos(e);
    selectedPiece = pieces.find(p => p.x === pos.x && p.y === pos.y);
    touchStartPos = pos;
});

canvas.addEventListener("pointerup", function(e) {
    if (!selectedPiece) return;
    let pos = getPointerPos(e);
    let targetPiece = pieces.find(p => p.x === pos.x && p.y === pos.y);
    
    if (targetPiece && targetPiece !== selectedPiece) {
        [selectedPiece.x, targetPiece.x] = [targetPiece.x, selectedPiece.x];
        [selectedPiece.y, targetPiece.y] = [targetPiece.y, selectedPiece.y];
    }
    
    selectedPiece = null;
    drawPuzzle();
});

canvas.addEventListener("touchstart", function(e) {
    e.preventDefault();
    let touch = e.touches[0];
    canvas.dispatchEvent(new PointerEvent("pointerdown", { clientX: touch.clientX, clientY: touch.clientY }));
}, { passive: false });

canvas.addEventListener("touchend", function(e) {
    e.preventDefault();
    let touch = e.changedTouches[0];
    canvas.dispatchEvent(new PointerEvent("pointerup", { clientX: touch.clientX, clientY: touch.clientY }));
}, { passive: false });

    // Управление музыкой
    const audio = document.getElementById("bg-music");
    audio.volume = 0.5;
    
    document.getElementById("toggle-music").addEventListener("click", function() {
        if (audio.paused) {
            audio.play();
            this.textContent = "🔊";
        } else {
            audio.pause();
            this.textContent = "🔈";
        }
    });
