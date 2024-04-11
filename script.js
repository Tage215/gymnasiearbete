window.onload = function () {
    // skapar en referens till canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // skapar en array som innehåller alla 64 rutor på spelplanen
    let squares = [];
    let gridSize = 64;
    for (let i = 0; i < gridSize; i++) {
        squares[i] = new Square(ctx, i % 8, Math.floor(i / 8));
    }

    // ritar ut de 4 första pjäserna
    squares[27].draw("white");
    squares[28].draw("black");
    squares[35].draw("black");
    squares[36].draw("white");

    // ger startvärde åt och placerar grafiken som visar vem som leder
    let white = 2;
    let black = 2;
    document.getElementById("whiteBar").style.left = canvas.getBoundingClientRect().left + 5 + "px";    

    let turn = "black";

    // funktionen som körs varje gång canvasen klickas
    canvas.onclick = (e) => {
        // lagrar platsen som klickats
        let coordinates = canvas.getBoundingClientRect();
        let x = Math.floor((e.x - coordinates.left - 5) / 100);
        let y = Math.floor((e.y - coordinates.top - 5) / 100);

        // kontrollerar draget med hjälp av check
        let turnedEnemies = squares[x + y * 8].check(squares, turn);
        if (turnedEnemies.length > 0) {
            // vänder pjäserna
            for (let i = 0; i < turnedEnemies.length; i++) {
                squares[turnedEnemies[i]].draw(turn);
            }
            squares[x + y * 8].draw(turn);

            // uppdaterar grafiken som visar vem som leder
            white = 0;
            black = 0;
            for (let i = 0; i < gridSize; i++) {
                if (squares[i].color == "white")
                    white++
                else if (squares[i].color == "black")
                    black++;
            }
            document.getElementById("whiteBar").style.width = (white / (black + white) * 800) + "px";

            // byter tur om den andra spelaren kan göra ett drag
            turn = checkTurnOver(gridSize, squares, turn, white, black);
        }
    }
}

function checkTurnOver(gridSize, squares, turn, white, black) {
    let temp = "";
    // byter tur
    turn = switchTurn(turn);

    // kontrollerar om det finns ett tillåtet drag
    for (let i = 0; i < gridSize; i++) {
        temp = squares[i].check(squares, turn);
        if (temp.length > 0) {
            return turn;
        }
    }

    // byter tur igen om första spelaren inte hade ett tillåtet drag
    turn = switchTurn(turn);

    // kontrollerar om den andre spelaren har ett tillåtet drag
    for (let i = 0; i < gridSize; i++) {
        temp = squares[i].check(squares, turn);
        if (temp.length > 0) {
            return turn;
        }
    }

    // avslutar spelet om ingen har tillåtet drag
    gameOver(white, black);
}

function switchTurn(turn) {
    if (turn == "black")
        turn = "white";
    else
        turn = "black";

    document.getElementById("canvas").style.borderColor = turn;
    return turn;
}

function gameOver(white, black) {
    // visar en winscreen med vinnaren av spelet
    winscreen = document.getElementById("winscreen");
    if (black > white) {
        winscreen.innerHTML = "Black wins!";
        winscreen.style.color = "black";
    }
    else if (white > black) {
        winscreen.innerHTML = "White wins!";
        winscreen.style.color = "white";
    }
    else {
        winscreen.innerHTML = "Draw!"
        winscreen.style.color = "gray";
    }
    winscreen.style.display = "block";
}

class Square {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = 100;
        this.animationframes = 10;
        this.color = "none";
        this.ctx.strokeRect(this.x * 100, this.y * 100, this.size, this.size);
    }

    draw(color) {
        // ritar ut en pjäs på rutan
        let i = this.animationframes;
        let interval = setInterval(function() {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(this.x * 100 + 50, this.y * 100 + 50, this.size / (2 * i), 0, 2 * Math.PI);
            this.ctx.fill();
            i--;
            if (i <= 0) {
                clearInterval(interval);
            }
        }.bind(this), 500 / this.animationframes);

        this.color = color;
    }

    check(squares, color) {
        // kontrollerar så att spelaren tryckt på en tom ruta
        if (this.color != "none")
            return false;
        // lagrar omringande motståndare i en array
        let enemies = this.checkEnemies(squares, color);
        let turnedEnemies = [];
        let temp = [];
        let turnedIndex = 0;

        for (let i = 0; i < enemies.length; i++) {
            // tömmer temp 
            temp = [];
            for (let j = 1; j < 8; j++) {
                // hämtar koordinaterna på pjäsen och kontrollerar så den är inom spelplanen
                let x = this.x + enemies[i][0] * j;
                let y = (this.y + enemies[i][1] * j) * 8;
                if (x < 0 || x > 7)
                    break;
                let index = x + y;
                if (index < 64 && index >= 0) {
                    let square = squares[index];
                    // lagrar pjäserna som ska vändas i en array om en pjäs av ens egen färg hittas
                    if (square.color == color && temp.length > 0) {
                        for (let k = 0; k < temp.length; k++) {
                            turnedEnemies[turnedIndex] = temp[k];
                            turnedIndex++;
                        }
                        break;
                    }
                    // lagrar motståndarens pjäser i en temporär array
                    else if (square.color == this.enemyColor(color)) {
                        temp[j - 1] = square.x + square.y * 8;
                    }
                    // avbryter om kraven inte uppfylls
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
                // hämtar koordinater för rutan
                let square = this.x + j + (this.y + i) * 8;
                // kontrollerar så rutan är inom spelplanen
                if (square >= 0 && square < 64) {
                    // lagrar rutan i en array om den är av motståndarens färg
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