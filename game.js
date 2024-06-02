document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("board");
    const fenInput = document.getElementById("fen");
    const setFenButton = document.getElementById("setFen");
    const resetButton = document.getElementById("reset");

    let board = [
        ["r", "n", "b", "a", "k", "a", "b", "n", "r"],
        ["", "", "", "", "", "", "", "", ""],
        ["", "c", "", "", "", "", "", "c", ""],
        ["p", "", "p", "", "p", "", "p", "", "p"],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["P", "", "P", "", "P", "", "P", "", "P"],
        ["", "C", "", "", "", "", "", "C", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["R", "N", "B", "A", "K", "A", "B", "N", "R"]
    ];

    const initialFen = boardToFen(board);

    function createBoard() {
        boardElement.innerHTML = "";
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const square = document.createElement("div");
                square.dataset.row = row;
                square.dataset.col = col;
                if (board[row][col]) {
                    square.textContent = board[row][col];
                }
                boardElement.appendChild(square);
            }
        }
    }

    function boardToFen(board) {
        return board.map(row => row.map(piece => piece || "1").join("")).join("/");
    }

    function fenToBoard(fen) {
        return fen.split("/").map(row => row.replace(/1/g, "").split(""));
    }

    function setBoardFromFen(fen) {
        board = fenToBoard(fen);
        createBoard();
    }

    boardElement.addEventListener("click", (e) => {
        const square = e.target;
        const row = square.dataset.row;
        const col = square.dataset.col;
        if (square.textContent) {
            console.log(`Clicked on piece at ${row}, ${col}: ${square.textContent}`);
        } else {
            console.log(`Clicked on empty square at ${row}, ${col}`);
        }
    });

    setFenButton.addEventListener("click", () => {
        setBoardFromFen(fenInput.value);
    });

    resetButton.addEventListener("click", () => {
        fenInput.value = initialFen;
        setBoardFromFen(initialFen);
    });

    // Initialize board
    createBoard();
});
