const ticTacToe = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

const transposed = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

const squares = document.querySelectorAll('.gridbox');
const arraySquares = Array.prototype.slice.call(squares); // turn NodeList into an Array so we can use indexOf

let player = "X";
let win = false;
let numPlays = 0;

// check if winner in row
const checkRow = () => {
    for (let row of ticTacToe) {
        for (let value of row) {
            if (value !== '' && row[0] === row[1] && row[1] === row[2]) {
                win = true;
            }
        }
    }
    if (win) {
        displayWin()
    }
}

// check if winner in column
const checkCol = () => {
    for (let row of transposed) {
        for (let value of row) {
            if (value !== '' && row[0] === row[1] && row[1] === row[2]) {
                win = true;
            }
        }
    }
    if (win) {
        displayWin()
    }
}

// check if winner in diagonal
const checkDiagonal = () => {
    let diagonalVals = [];
    let diagonalVals2 = [];
    for (let i = 0; i < 3; i++) {

        // check first diagonal
        let diagonalVal = ticTacToe[i][i];
        diagonalVals.push(diagonalVal);
        // console.log(diagonalVals);
        if (diagonalVal !== '' && diagonalVals[0] === diagonalVals[1] && diagonalVals[1] === diagonalVals[2]) {
            win = true;
        }

        // check second diagonal
        let diagonalVal2 = ticTacToe[i][2 - i];
        diagonalVals2.push(diagonalVal2);
        // console.log(diagonalVals2);
        if (diagonalVal2 !== '' && diagonalVals2[0] === diagonalVals2[1] && diagonalVals2[1] === diagonalVals2[2]) {
            win = true;
        }
        if (win) {
            displayWin()
        }
    }
    diagonalVals = [];
    diagonalVals2 = [];
}

// when game is over
const alert = document.querySelector('.alert');
p = document.createElement('p');

const displayWin = () => {
    alert.style.display = "block";
    p.innerHTML = `${player} wins!`;
    alert.prepend(p);
}

const addHover = (e) => {
    player === "X" ? e.target.classList.add("hover-x") : e.target.classList.add("hover-o");
}

const removeHover = (e) => {
    player === "X" ? e.target.classList.remove("hover-x") : e.target.classList.remove("hover-o");
}

for (let arraySquare of arraySquares) {
    arraySquare.addEventListener('mouseenter', addHover)
    arraySquare.addEventListener('mouseleave', removeHover)

    arraySquare.addEventListener('click', () => {
        if (!win) {
            let index = arraySquares.indexOf(arraySquare);
            if (arraySquare.innerHTML === '') {
                numPlays += 1;
                player === "X" ? arraySquare.innerHTML = "X" : arraySquare.innerHTML = "O";
                player === "X" ? arraySquare.classList.add("selected-x") : arraySquare.classList.add("selected-o");

                // remove hover effect for boxes already selected
                if (arraySquare.classList.contains("selected-x") || arraySquare.classList.contains("selected-o")) {
                    arraySquare.removeEventListener('mouseenter', addHover)
                }

                // change array to reflect status of game
                const rowIndex = Math.floor(index / 3);
                const colIndex = index % 3;
                ticTacToe[rowIndex][colIndex] = player;

                // create transposed version 
                transposed[colIndex][rowIndex] = player;

                // check if anyone has won
                checkRow();
                checkCol();
                checkDiagonal();

                // check if tie game
                if (!win && numPlays == 9) {
                    alert.style.display = "block";
                    p.innerHTML = "It's a tie!";
                    alert.prepend(p);   
                }

                // change player
                player = (player === "X") ? "O" : "X"
            }
        }
    })
}

// reset the game
const replayBtn = document.querySelector('.replay');

replayBtn.addEventListener('click', () => {
    for (let arraySquare of arraySquares) {
        arraySquare.innerHTML = '';
        arraySquare.classList.remove("selected-x");
        arraySquare.classList.remove("selected-o");
        arraySquare.classList.remove("hover-x");
        arraySquare.classList.remove("hover-o");
        arraySquare.addEventListener('mouseenter', addHover)
        arraySquare.addEventListener('mouseleave', removeHover)
    }
    alert.style.display = "none";
    win = false;
    numPlays = 0;

    for (i=0;i<3;i++){
        for (j=0;j<3;j++) {
            ticTacToe[i][j] = '';
            transposed[i][j] = '';
        }
    }
})

// play until win mode
let countX = 0;
let countO = 0;




