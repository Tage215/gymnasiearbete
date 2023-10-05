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
        this.ctx.strokeRect(this.x * 100, this.y * 100, this.size, this.size);
    }

    place(color, squares) {
        if (this.color == "none") {
            this.draw(color);
            this.check(squares);
            return true;
        }
        else
            return false;
    }

    draw(color){
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(this.x * 100 + 50, this.y * 100 + 50, this.size / 2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.color = color;
    }

    check(squares) {
        let enemies = this.checkEnemies(squares, this.x, this.y);
        let turnedEnemies = [];
        for(let i = 0; i < enemies.length; i++){
            for(let j = 1; j < 8; j++) {
                let index = this.x + enemies[i][0] * j + (this.y + enemies[i][1] * j) * 8;
                if(index < 64 && index >= 0){
                    let square = squares[index];

                    if(square.color == this.color) {
                        for(let k = 0; k < turnedEnemies.length; k++){
                            squares[turnedEnemies[k]].draw(this.color);
                            return true;
                        }
                        break;
                    }
                    else if(square.color == this.enemyColor()){
                        turnedEnemies[j-1] = square.x + square.y * 8;
                    }
                    else
                        break;
                }
                
            }
        }
        return false;
    }

    checkEnemies(squares, x, y) {
        let enemies = [];
        let index = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let square = x + j + (y + i) * 8;
                if(square >= 0 && square < 64) {
                    if(squares[square].color == this.enemyColor()){
                        enemies[index] = [j, i];
                        index++;
                    }
                }
            }
        }
        return enemies;
    }

    enemyColor(){
        if (this.color == "black")
            return "white";
        if (this.color == "white")
            return "black"
        
        return "none"
    }
}