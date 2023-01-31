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

const displayTie = () => {
    alert.style.display = "block";
    img.setAttribute('src', 'cat.svg');
    img.style.width = "200px";
    p.innerHTML = "Cat's game!";
    p.style.fontSize = "2rem";
    alert.prepend(p);
    alert.prepend(img);
}

// hover effects
const addHover = (e) => {
    e.target.classList.add(`hover-${player}`);
}

const removeHover = (e) => {
    e.target.classList.remove(`hover-${player}`);
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


// the core of the game - both modes start out this way
const playGame = (e) => {
    console.log(`player is: ${player}`);
    console.log(`we are in the classic rules`);
    if (!win) {
        let index = arraySquares.indexOf(e.target);
        if (e.target.innerHTML === '') {
            numPlays += 1;
            player === "X" ? countX += 1 : countO += 1;

            // setting the innerHTML and color styles
            e.target.innerHTML = player;
            e.target.classList.add(`selected-${player}`)

            // remove hover effect for boxes already selected
            if (e.target.classList.contains("selected-X") || e.target.classList.contains("selected-O")) {
                e.target.removeEventListener('mouseenter', addHover)
                e.target.removeEventListener('mouseleave', removeHover)
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
                displayTie();
            }

            // change player
            player = (player === "X") ? "O" : "X"

            // exit and change to new rules after 3rd play in Play to Win mode
            if (mode === "playToWin" && !win) {
                if (player === "X" && countX === 3 || player === "O" && countO === 3) {
                    newRules();
                }
            }
        }
    }
}


// the game
for (let arraySquare of arraySquares) {
    arraySquare.addEventListener('mouseenter', addHover)
    arraySquare.addEventListener('mouseleave', removeHover)
    arraySquare.addEventListener('click', playGame)
}

let playerSquares = [];
let emptySquares = [];

// rules after 3rd marker has been placed in Play to Win mode
const newRules = (e) => {
    console.log("we are in the new rules");
    for (let arraySquare of arraySquares) {
        arraySquare.removeEventListener('click', playGame)
        arraySquare.removeEventListener('mouseenter', addHover)
        arraySquare.removeEventListener('mouseleave', removeHover)
    }
    // highlight current player squares, add new event listeners to clear square
    playerSquares = arraySquares.filter(arraySquare => arraySquare.innerHTML === player);
    for (let playerSquare of playerSquares) {
        playerSquare.classList.add("highlighted");
        playerSquare.addEventListener('click', clearSquare);
    }
}

let oldSquare;

const clearSquare = (e) => {
    // e.target.innerHTML = '';
    console.log("clearing square")
    e.target.classList.remove(`selected-${player}`);
    e.target.classList.remove(`hover-${player}`);
    e.target.classList.add("inactive");
    oldSquare = e.target;

    playerSquares = arraySquares.filter(arraySquare => arraySquare.innerHTML === player);

    emptySquares = arraySquares.filter(arraySquare => arraySquare.innerHTML === '');
    for (emptySquare of emptySquares) {
        emptySquare.classList.add("highlighted");
        emptySquare.addEventListener('mouseenter', addHover)
        emptySquare.addEventListener('mouseleave', removeHover)
        emptySquare.addEventListener('click', selectNew)
    }
    for (let playerSquare of playerSquares) {
        playerSquare.classList.remove("highlighted");
        playerSquare.removeEventListener('click', clearSquare);
    }
    e.target.classList.remove("highlighted");
    e.target.innerHTML = '';

    // e.target.removeEventListener('click', selectNew)
}

const selectNew = (e) => {
    console.log("selecting new square");
    // updating styles
    e.target.innerHTML = player;
    e.target.classList.add(`selected-${player}`);
    oldSquare.classList.remove("inactive");

    // update the matrix to reflect status of game
    let index = arraySquares.indexOf(e.target);
    let rowIndex = Math.floor(index / 3);
    let colIndex = index % 3;
    ticTacToe[rowIndex][colIndex] = player;
    index = arraySquares.indexOf(oldSquare);
    rowIndex = Math.floor(index / 3);
    colIndex = index % 3;
    ticTacToe[rowIndex][colIndex] = '';

    // removing hightlights
    emptySquares = arraySquares.filter(arraySquare => arraySquare.innerHTML === '');
    for (emptySquare of emptySquares) {
        emptySquare.classList.remove("highlighted");
        emptySquare.removeEventListener('click', selectNew)
        emptySquare.removeEventListener('mouseenter', addHover)
        emptySquare.removeEventListener('mouseleave', removeHover)
    }
    e.target.classList.remove("highlighted");
    e.target.removeEventListener('click', selectNew)
    e.target.removeEventListener('mouseenter', addHover)
    e.target.removeEventListener('mouseleave', removeHover)


    // check if anyone has won
    checkRow();
    checkCol();
    checkDiagonal();

    // change player 
    player = (player === "X") ? "O" : "X";

    // highlight current player squares, add new event listener to clear square
    playerSquares = arraySquares.filter(arraySquare => arraySquare.innerHTML === player);
    console.log(`playerSquares is: ${playerSquares}`)
    for (let playerSquare of playerSquares) {
        playerSquare.classList.add("highlighted");
        playerSquare.addEventListener('click', clearSquare);
    }

}


// reset the game
const replayBtn = document.querySelector('.replay');

replayBtn.addEventListener('click', () => {
    for (let arraySquare of arraySquares) {
        arraySquare.innerHTML = '';
        arraySquare.classList.remove("selected-X");
        arraySquare.classList.remove("selected-O");
        arraySquare.classList.remove("hover-X");
        arraySquare.classList.remove("hover-O");
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





