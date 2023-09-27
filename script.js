window.onload = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let squares = [];
    gridSize = 64;
    for (let i = 0; i < gridSize; i++) {
        squares[i] = new Square(ctx, Math.floor(i / 8), i % 8);
    }
    squares[27].place("white");
    squares[28].place("black");
    squares[36].place("white");
    squares[35].place("black");

    let turn = "black";
    canvas.onclick = function (e) {
        let coordinates = canvas.getBoundingClientRect();
        x = Math.floor((e.x - coordinates.left - 5) / 100);
        y = Math.floor((e.y - coordinates.top - 5) / 100);
        if(squares[x * 8 + y].place(turn)){
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

    place(color) {
        if (this.color == "none") {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(this.x * 100 + 50, this.y * 100 + 50, this.size / 2, 0, 2 * Math.PI);
            this.ctx.fill();
            this.color = color;
            this.check();
            return true;
        }
        else 
            return false;
    }

    check() {
        
    }
}