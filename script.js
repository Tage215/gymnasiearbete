window.onload = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    let squares = [];
    gridSize = 64;
    for (let i = 0; i < gridSize; i++) {
        squares[i] = new Square(ctx, i % 8, Math.floor(i / 8));
    }
    squares[27].place("white", squares);
    squares[28].place("black", squares);
    squares[35].place("black", squares);
    squares[36].place("white", squares);

    let turn = "black";
    canvas.onclick = function (e) {
        let coordinates = canvas.getBoundingClientRect();
        x = Math.floor((e.x - coordinates.left - 5) / 100);
        y = Math.floor((e.y - coordinates.top - 5) / 100);
        if (squares[x + y * 8].place(turn, squares)) {
            if (turn == "black")
                turn = "white";
            else
                turn = "black";
            canvas.style.borderColor = turn;
        }

    }
}

class Square {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = 100;
        this.color = "none";
        this.draw();
    }

    draw() {
        this.ctx.strokeRect(this.x * 100, this.y * 100, this.size, this.size);
    }

    place(color, squares) {
        if (this.color == "none") {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(this.x * 100 + 50, this.y * 100 + 50, this.size / 2, 0, 2 * Math.PI);
            this.ctx.fill();
            this.color = color;
            this.check(squares);
            return true;
        }
        else
            return false;
    }

    check(squares) {
        let surrounding = this.checkSurrounding(squares);
    }

    checkSurrounding(squares) {
        let surrounding = new Map();
    
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                surrounding.set((i + 1) * 3 + j + 1, squares[this.x + j + (this.y + i) * 8].color);
            }
        }
        
        return surrounding;
    }
}