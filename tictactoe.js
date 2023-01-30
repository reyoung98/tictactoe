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
let mode = "classic";

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
const img = document.createElement('img');

const displayWin = () => {
    alert.style.display = "block";
    p.innerHTML = `${player} wins!`;
    p.style.fontSize = "2rem"
    player === "X" ? img.setAttribute('src', 'happy.svg') : img.setAttribute('src', 'party.svg');
    img.style.width = "200px";
    alert.prepend(p);
    alert.prepend(img);
}

// hover effects
const addHover = (e) => {
    player === "X" ? e.target.classList.add("hover-x") : e.target.classList.add("hover-o");
}

const removeHover = (e) => {
    player === "X" ? e.target.classList.remove("hover-x") : e.target.classList.remove("hover-o");
}

// play to win mode
let countX = 0;
let countO = 0;

const selectClassic = document.querySelector('.classic');
const selectPlayToWin = document.querySelector('.play-to-win');
const instructionsClassic = document.querySelector('.instructions-classic');
const instructionsPlayToWin = document.querySelector('.instructions-playtowin');

const selectMode = (setMode) => {
    if (setMode === "classic") {
        mode = "classic";
        console.log(`mode is ${mode}`)
        selectClassic.style.backgroundColor = "#70a0af";
        selectPlayToWin.style.backgroundColor = "#eceff4";
        instructionsPlayToWin.style.display = "none";
        instructionsClassic.style.display = "block";
    } else {
        mode = "playToWin";
        console.log(`mode is ${mode}`)
        selectPlayToWin.style.backgroundColor = "#70a0af";
        selectClassic.style.backgroundColor = "#eceff4";
        instructionsPlayToWin.style.display = "block";
        instructionsClassic.style.display = "none";
    }
}

selectClassic.addEventListener('click', () => {
    selectMode("classic")
})
selectPlayToWin.addEventListener('click', () => {
    selectMode("playToWin")
})

// rules after 3rd marker has been placed
const newRules = () => {
    for (let arraySquare of arraySquares){
        arraySquare.addEventListener('click', () => {
            console.log("new rules!");
        })
    }
}

// the game
for (let arraySquare of arraySquares) {
    arraySquare.addEventListener('mouseenter', addHover)
    arraySquare.addEventListener('mouseleave', removeHover)
    console.log(`countX is: ${countX}`);           

    arraySquare.addEventListener('click', () => {
        console.log(`player is: ${player}`)
        if (!win) {
            console.log("click!")
            let index = arraySquares.indexOf(arraySquare);
            if (arraySquare.innerHTML === '') {
                numPlays += 1;
                player === "X" ? countX += 1 : countO += 1;

                if (mode === "classic") {
                    player === "X" ? arraySquare.innerHTML = "X" : arraySquare.innerHTML = "O";
                    player === "X" ? arraySquare.classList.add("selected-x") : arraySquare.classList.add("selected-o");
                }
                if (mode === "playToWin") {
                    if (player === "X") {
                        if (countX <= 3) {
                            arraySquare.innerHTML = "X";
                            arraySquare.classList.add("selected-x");
                        } else {
                            console.log("please choose one of your Xs to move");
                            arraySquare.style.border = "2px solid gold";
                        }
                    } else {
                        if (countO <= 3) {
                            arraySquare.innerHTML = "O";
                            arraySquare.classList.add("selected-o");
                        } else {
                            console.log("please choose one of your Os to move");
                        }
                    }
                }

                // remove hover effect for boxes already selected
                if (arraySquare.classList.contains("selected-x") || arraySquare.classList.contains("selected-o")) {
                    arraySquare.removeEventListener('mouseenter', addHover)
                    arraySquare.removeEventListener('mouseleave', removeHover)
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

                // play to win mode?
                if (countX === 3) {
                    console.log("max moves for player X!")
                }
                if (countO === 3) {
                    console.log("max moves for player O!")
                }


                // check if tie game
                if (!win && numPlays == 9) {
                    alert.style.display = "block";
                    img.setAttribute('src', 'cat.svg');
                    img.style.width = "200px";
                    p.innerHTML = "Cat's game!";
                    p.style.fontSize = "2rem";
                    alert.prepend(p);
                    alert.prepend(img);
                }

                // change player
                player = (player === "X") ? "O" : "X"

                if (player === "X") {
                    if (countX === 3) {
                        console.log(`trigger new rules for ${player}`)  
                        newRules();
                     }
                } else {
                    if (countO === 3) {
                        console.log(`trigger new rules for ${player}`)
                    }
                } 
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
    countX = 0;
    countO = 0;

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            ticTacToe[i][j] = '';
            transposed[i][j] = '';
        }
    }
})





