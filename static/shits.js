class Sudoku {
    static isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num) return false;
        }
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    static solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    for (let i = numbers.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
                    }

                    for (let num of numbers) {
                        if (this.isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.solve(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    static generateCompleteBoard() {
        let board = Array.from({ length: 9 }, () => Array(9).fill(0));
        this.solve(board);
        return board;
    }

    static countSolutions(board) {
        let count = 0;

        function solveAndCount() {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (Sudoku.isValid(board, row, col, num)) {
                                board[row][col] = num;
                                solveAndCount();
                                board[row][col] = 0;
                            }
                        }
                        return;
                    }
                }
            }
            count++;
        }

        solveAndCount();
        return count;
    }

    static isUniqueSolution(board) {
        return this.countSolutions(board) === 1;
    }

    static removeNumbers(board, attempts = 50) {
        board = board.map(row => [...row]);

        let count = 0;
        while (attempts > 0 && count < 81) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            while (board[row][col] === 0) {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            }

            let backup = board[row][col];
            board[row][col] = 0;

            if (!this.isUniqueSolution(board)) {
                board[row][col] = backup;
                attempts--;
            }

            count++;
        }

        return board;
    }

    static generatePuzzle() {
        let completeBoard = this.generateCompleteBoard();
        return this.removeNumbers(completeBoard);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("board");
    const solveButton = document.getElementById("solve");
    const generateButton = document.getElementById("generate");
    const messageElement = document.getElementById("message"); 
    let board = Sudoku.generatePuzzle();
    let solutionBoard = Sudoku.generateCompleteBoard();

    const comments = [
        "Your getting old",
        "Correct! - Not",
        "Try again, or not!",
        "Solving this doesn't give your browny points",
        "You Infuriated Yet?",
        "Nuclear? More Like Unclear",
        "You had more luck splitting atoms",
        "If you did this on the job we would have another 3 mile",
        "Not gonna lie I would've missed that too",
        "Error: 9x00235 Codename: Chernobyl",
        "Shrodinger Would be disappointed",
        "If you give up the button is below",
        "Every 60 seconds a minute passes in Africa",
        "Play arms of a angel, might help",
        "ALERT! Your wrong.",
        "Fred, check your numbers",
        "Might want to call life alert",
        "You had 9 guesses and you chose wrong",
        ""
    ];

    function renderBoard() {
        boardElement.innerHTML = "";
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let cell = document.createElement("input");
                cell.type = "text";
                cell.maxLength = 1;
                cell.value = board[row][col] !== 0 ? board[row][col] : "";
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                let index = row * 9 + col;
                if ((col + 1) % 3 === 0 && col !== 8) cell.style.borderRight = "3px solid black";
                if ((row + 1) % 3 === 0 && row !== 8) cell.style.borderBottom = "3px solid black";
    
                if (board[row][col] !== 0) {
                    cell.disabled = true;
                    cell.style.fontWeight = "bold";
                } else {
                    cell.addEventListener("input", (e) => validateInput(e, row, col));
                }
    
                boardElement.appendChild(cell);
            }
        }
    }
    

    function validateInput(e, row, col) {
        let val = parseInt(e.target.value);
        if (val >= 1 && val <= 9) {
            board[row][col] = val;
            if (val === solutionBoard[row][col]) {
                e.target.style.backgroundColor = "#c8e6c9";
                messageElement.textContent = "";
            } else {
                e.target.style.backgroundColor = "#ffcdd2";
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                messageElement.textContent = randomComment;
            }
        } else {
            e.target.value = "";
            board[row][col] = 0;
            e.target.style.backgroundColor = "white";
            messageElement.textContent = "------------";
        }
    }

    solveButton.addEventListener("click", () => {
        if (Sudoku.solve(board)) {
            renderBoard();
        }
    });

    generateButton.addEventListener("click", () => {
        board = Sudoku.generatePuzzle();
        solutionBoard = JSON.parse(JSON.stringify(board));
        Sudoku.solve(solutionBoard);
        renderBoard();
    });

    renderBoard();
});


