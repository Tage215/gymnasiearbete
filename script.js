window.onload = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    let squares = [];
    let gridSize = 64;
    for (let i = 0; i < gridSize; i++) {
        squares[i] = new Square(ctx, i % 8, Math.floor(i / 8));
    }
    squares[27].draw("white", squares);
    squares[28].draw("black", squares);
    squares[35].draw("black", squares);
    squares[36].draw("white", squares);

    let white = 2;
    let black = 2;

    let turn = "black";
    canvas.onclick = function (e) {
        let coordinates = canvas.getBoundingClientRect();
        let x = Math.floor((e.x - coordinates.left - 5) / 100);
        let y = Math.floor((e.y - coordinates.top - 5) / 100);
        let turnedEnemies = squares[x + y * 8].check(squares, turn);
        if (turnedEnemies.length > 0) {
            for (let i = 0; i < turnedEnemies.length; i++) {
                squares[turnedEnemies[i]].draw(turn);
            }
            squares[x + y * 8].draw(turn);

            white = 0;
            black = 0;
            for(let i = 0; i < gridSize; i++){
                if(squares[i].color == "white")
                    white++
                else if(squares[i].color == "black")
                    black++;
            }
            document.getElementById("whiteCount").innerHTML = white;
            document.getElementById("blackCount").innerHTML = black;

            turn = switchTurn(turn);
            checkTurnOver(gridSize, squares, turn);
        }
    }
}

function checkTurnOver(gridSize, squares, turn) {
    let temp = "";

    for (let i = 0; i < gridSize; i++) {
        temp = squares[i].check(squares, turn);
        if (temp.length > 0) {
            return;
        }
    }

    turn = switchTurn(turn);

    for (let i = 0; i < gridSize; i++) {
        temp = squares[i].check(squares, turn);
        if (temp.length > 0) {
            return;
        }
    }
    gameOver();
}

function switchTurn(turn) {
    if (turn == "black")
        turn = "white";
    else
        turn = "black";

    return turn;
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

    draw(color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(this.x * 100 + 50, this.y * 100 + 50, this.size / 2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.color = color;
    }

    check(squares, color) {
        if (this.color != "none")
            return false;
        let enemies = this.checkEnemies(squares, color);
        let turnedEnemies = [];
        let temp = [];
        let turnedIndex = 0;

        for (let i = 0; i < enemies.length; i++) {
            temp = [];
            for (let j = 1; j < 8; j++) {
                let x = this.x + enemies[i][0] * j;
                let y = (this.y + enemies[i][1] * j) * 8;
                if (x < 0 || x > 7)
                    break;
                let index = x + y;
                if (index < 64 && index >= 0) {
                    let square = squares[index];
                    if (square.color == color && temp.length > 0) {
                        for (let k = 0; k < temp.length; k++) {
                            turnedEnemies[turnedIndex] = temp[k];
                            turnedIndex++;
                        }
                        break;
                    }
                    else if (square.color == this.enemyColor(color)) {
                        temp[j - 1] = square.x + square.y * 8;
                    }
                    else
                        break;
                }
            }
        }
        return turnedEnemies;
    }

    checkEnemies(squares, color) {
        let enemies = [];
        let index = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let square = this.x + j + (this.y + i) * 8;
                if (square >= 0 && square < 64) {
                    if (squares[square].color == this.enemyColor(color)) {
                        enemies[index] = [j, i];
                        index++;
                    }
                }
            }
        }
        return enemies;
    }

    enemyColor(color) {
        if (color == "black")
            return "white";
        if (color == "white")
            return "black"

        return "none"
    }
}