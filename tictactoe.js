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

// buttons to select game mode
const selectClassic = document.querySelector('.classic');
const selectPlayToWin = document.querySelector('.play-to-win');
const instructionsClassic = document.querySelector('.instructions-classic');
const instructionsPlayToWin = document.querySelector('.instructions-playtowin');

const selectMode = (setMode) => {
    if (setMode === "classic") {
        mode = "classic";
        console.log(`mode is ${mode}`)
        selectClassic.classList.add("selected-mode")
        selectPlayToWin.classList.remove("selected-mode")
        instructionsClassic.classList.remove("hide")
        instructionsPlayToWin.classList.add("hide")
    } else {
        mode = "playToWin";
        console.log(`mode is ${mode}`)
        selectPlayToWin.classList.add("selected-mode")
        selectClassic.classList.remove("selected-mode")
        instructionsPlayToWin.classList.remove("hide")
        instructionsClassic.classList.add("hide")
    }
}

selectClassic.addEventListener('click', () => {
    selectMode("classic")
})
selectPlayToWin.addEventListener('click', () => {
    selectMode("playToWin")
})


// hover effects
const addHover = (e) => {
    e.target.classList.add(`hover-${player}`);
}

const removeHover = (e) => {
    e.target.classList.remove(`hover-${player}`);
}

// the core of the game - both modes start out this way
const playGame = (e) => {
    console.log(`player is: ${player}`);
    console.log(`we are in the classic rules`);
    if (!win) {
        let index = arraySquares.indexOf(e.target);
        if (e.target.innerHTML === '') {
            numPlays += 1;

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
            checkWin();

            // check if tie game
            if (!win && numPlays == 9) {
                displayAlert("tie");
            }

            // change player
            player = (player === "X") ? "O" : "X"

            // exit and change to new rules after 3rd play in Play to Win mode
            if (mode === "playToWin" && !win && numPlays === 6) {
                newRules();
            }
        }
    }
}

// initiate the game
for (let arraySquare of arraySquares) {
    arraySquare.addEventListener('mouseenter', addHover)
    arraySquare.addEventListener('mouseleave', removeHover)
    arraySquare.addEventListener('click', playGame)
}

// new rules after 3rd marker has been placed in Play to Win mode
let playerSquares = [];
let emptySquares = [];

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

// player clicks square to clear it
let oldSquare;

const clearSquare = (e) => {
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
}

// player clicks new square to select it
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
    transposed[colIndex][rowIndex] = player;
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
    e.target.removeEventListener('click', clearSquare)
    e.target.removeEventListener('mouseenter', addHover)
    e.target.removeEventListener('mouseleave', removeHover)


    // check if anyone has won
    checkWin();

    if (!win) {

        // change player 
        console.log("changing player...")
        player = (player === "X") ? "O" : "X";
        console.log(`player is: ${player}`)

        // highlight current player squares, add new event listener to clear square
        playerSquares = arraySquares.filter(arraySquare => arraySquare.innerHTML === player);
        for (let playerSquare of playerSquares) {
            playerSquare.classList.add("highlighted");
            playerSquare.addEventListener('click', clearSquare);
        }
    }
}

// check all win possibilities
const checkWin = () => {
    checkRow();
    checkCol();
    checkDiagonal();
}

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
        displayAlert("win")
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
        displayAlert("win")
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
            // const alertWin = new Alert('win', player);

            displayAlert("win")
        }
    }
    diagonalVals = [];
    diagonalVals2 = [];
}

// when game is over
const alert = document.querySelector('.alert');
p = document.createElement('p');
const img = document.createElement('img');

const displayAlert = (result) => {
    alert.classList.add("alert-visible");
    switch (result) {
        case "win":
            p.innerHTML = `${player} wins!`;
            player === "X" ? img.setAttribute('src', 'happy.svg') : img.setAttribute('src', 'party.svg');
            break;
        case "tie":
            img.setAttribute('src', 'cat.svg');
            p.innerHTML = "Cat's game!";
            break;
    }
    alert.prepend(p);
    alert.prepend(img);
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
        arraySquare.classList.remove("highlighted");
        arraySquare.addEventListener('mouseenter', addHover);
        arraySquare.addEventListener('mouseleave', removeHover);
        arraySquare.addEventListener('click', playGame)
    }
    alert.classList.remove("alert-visible");
    win = false;
    numPlays = 0;

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            ticTacToe[i][j] = '';
            transposed[i][j] = '';
        }
    }
})

// const displayWin = () => {
//     alert.classList.add("alert-visible");
//     p.innerHTML = `${player} wins!`;
//     player === "X" ? img.setAttribute('src', 'happy.svg') : img.setAttribute('src', 'party.svg');
//     alert.prepend(p);
//     alert.prepend(img);
// }

// const displayTie = () => {
//     alert.classList.add("alert-visible");
//     img.setAttribute('src', 'cat.svg');
//     p.innerHTML = "Cat's game!";
//     alert.prepend(p);
//     alert.prepend(img);
// }





