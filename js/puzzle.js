const canvas = document.getElementById("puzzle-canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "puzzle-image.jpg";
const rows = 4, cols = 4;
let pieces = [];
let pieceWidth, pieceHeight;
let selectedPiece = null;

document.documentElement.style.overflowX = "hidden";
document.body.style.overflowX = "hidden";
document.documentElement.style.width = "100vw";
document.body.style.width = "100vw";

document.documentElement.style.height = "auto";
document.body.style.height = "auto";
document.body.style.minHeight = "100vh";

const header = document.getElementById("header");
if (header) {
    header.style.paddingTop = "20px";
}

document.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();
});

img.onload = function() {
    resizeCanvas();
    initializePuzzle();
};

function resizeCanvas() {
    const aspectRatio = img.width / img.height;
    const maxWidth = Math.min(window.innerWidth * 0.9, 600);
    let newWidth = maxWidth;
    let newHeight = newWidth / aspectRatio;

    const minHeight = 300;
    if (newHeight < minHeight) {
        newHeight = minHeight;
        newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas.style.marginBottom = "20px";

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
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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

function getTouchPos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor(((event.touches[0].clientX - rect.left) / canvas.width) * cols),
        y: Math.floor(((event.touches[0].clientY - rect.top) / canvas.height) * rows)
    };
}

canvas.addEventListener("pointerdown", function(e) {
    e.preventDefault();
    let pos = e.type.includes("touch") ? getTouchPos(e) : { 
        x: Math.floor(e.offsetX / (canvas.width / cols)), 
        y: Math.floor(e.offsetY / (canvas.height / rows)) 
    };
    selectedPiece = pieces.find(p => p.x === pos.x && p.y === pos.y);
});

canvas.addEventListener("pointermove", function(e) {
    if (!selectedPiece) return;
    e.preventDefault();
});

canvas.addEventListener("pointerup", function(e) {
    if (!selectedPiece) return;
    let pos = e.type.includes("touch") ? getTouchPos(e) : { 
        x: Math.floor(e.offsetX / (canvas.width / cols)), 
        y: Math.floor(e.offsetY / (canvas.height / rows)) 
    };
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
    canvas.dispatchEvent(new PointerEvent("pointerdown", e.touches[0]));
}, { passive: false });

canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    canvas.dispatchEvent(new PointerEvent("pointermove", e.touches[0]));
}, { passive: false });

canvas.addEventListener("touchend", function(e) {
    e.preventDefault();
    canvas.dispatchEvent(new PointerEvent("pointerup", e.changedTouches[0]));
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