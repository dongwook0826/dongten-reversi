export default class Reversi {

    #boardSize = 8
    // game board
    #board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0,-1, 1, 0, 0, 0],
        [0, 0, 0, 1,-1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]
    // moves by each players
    #legalMovesArray = []
    #moves = []
    // 1 for black, -1 for white
    #turn = 1
    #num = 1
    #moveAvailable = false // if movable, then must be kept true
    #pieceNum = [0, 0]

    #vectors = [
        [0, 1], [1, 1], [1, 0], [1, -1],
        [0, -1], [-1, -1], [-1, 0], [-1, 1]
    ]

    constructor() {
        // generate 3D array #legalMovesArray
        let zeroArr = [0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < this.#boardSize; ++i) {
            let rowArr = []
            for (let j = 0; j < this.#boardSize; ++j) {
                rowArr[j] = [...zeroArr]
            }
            this.#legalMovesArray[i] = rowArr
        }

        this.init()
    }

    init() {
        let zeroArr = [0, 0, 0, 0, 0, 0, 0, 0]
        for (let r = 0; r < this.#boardSize; ++r) {
            this.#board[r].fill(0)
            for (let f = 0; f < this.#boardSize; ++f) {
                this.#legalMovesArray[r][f].fill(0)
            }
        }
        this.#board[3][4] = this.#board[4][3] = 1
        this.#board[3][3] = this.#board[4][4] = -1

        this.#moves = []

        this.#turn = 1
        this.#num = 1

        this.#pieceNum[0] = 2
        this.#pieceNum[1] = 2

        this.#generateLegalMoves()
    }

    // getters
    boardSize() {
        return this.#boardSize
    }
    getBoard() {
        return this.#board
    }
    getMoves() {
        return this.#moves
    }
    getTurn() {
        return this.#turn
    }
    getNum() {
        return this.#num
    }
    getPieceNum() {
        return this.#pieceNum
    }

    // game logic functions
    #onBoard(r, f) {
        return 0 <= r && r < this.#boardSize
            && 0 <= f && f < this.#boardSize
    }

    #generateLegalMove(r, f) {

        if (this.#board[r][f] !== 0) {
            for (let i = 0; i < this.#boardSize; ++i) {
                this.#legalMovesArray[r][f][i] = 0
            }
            return
        }

        let turn = this.#turn
        let oppo = turn * -1
        let rd = 0, fd = 0, d = 0
        let vec
        for (let i = 0; i < this.#vectors.length; ++i) {
            vec = this.#vectors[i]
            rd = r + vec[0]
            fd = f + vec[1]
            d = 0
            do {
                if (this.#onBoard(rd, fd)) {
                    if (this.#board[rd][fd] === oppo) {
                        rd += vec[0]
                        fd += vec[1]
                        ++d
                    } else {
                        if (this.#board[rd][fd] === turn) {
                            this.#legalMovesArray[r][f][i] = d
                            if (d > 0) {
                                this.#moveAvailable = true
                            }
                        } else { // ~~~ === 0
                            this.#legalMovesArray[r][f][i] = 0
                        }
                        break
                    }
                } else { // out of board
                    this.#legalMovesArray[r][f][i] = 0
                    break
                }
            } while (true)
        }
    }

    #generateLegalMoves() {
        this.#moveAvailable = false
        for (let r = 0; r < this.#boardSize; ++r) {
            for (let f = 0; f < this.#boardSize; ++f) {
                this.#generateLegalMove(r, f)
            }
        }
    }

    isMovable(r, f) {
        return this.#legalMovesArray[r][f].filter(d => d !== 0).length !== 0
    }

    moveResult(r, f) { // returns int; 0 for do-nothing, +-1 for move, +-2 for win, +-3 for draw

        if (!this.#onBoard(r, f)) {
            // console.log("out of range")
            return 0
        }

        if (!this.isMovable(r, f)) {
            // console.log("move not available: no flippable piece")
            return 0
        }

        let turnI = this.#turn === 1 ? 0 : 1
        let oppoI = 1 - turnI
        this.#pieceNum[turnI]++
        this.#moves.push({
            turn: this.#turn,
            num: this.#num,
            move: [r, f],
            flip: [...this.#legalMovesArray[r][f]]
        })

        this.#board[r][f] = this.#turn
        let rd = 0, fd = 0
        let vec
        for (let i = 0; i < this.#vectors.length; ++i) {
            this.#pieceNum[turnI] += this.#legalMovesArray[r][f][i]
            this.#pieceNum[oppoI] -= this.#legalMovesArray[r][f][i]
            vec = this.#vectors[i]
            rd = r
            fd = f
            for (let s = 1; s <= this.#legalMovesArray[r][f][i]; ++s) {
                rd += vec[0]
                fd += vec[1]
                this.#board[rd][fd] = this.#turn // flip
            }
        }

        this.#turn *= -1
        ++this.#num
        this.#generateLegalMoves()
        if (!this.#moveAvailable) { // skip opponent's turn
            this.#turn *= -1
            this.#generateLegalMoves()
        } else { // opponent continues
            return this.#turn
        }

        if (!this.#moveAvailable) { // game finishes
            let diff = this.#pieceNum[0] - this.#pieceNum[1]
            if (diff > 0) { // black wins
                return 2
            } else if (diff < 0) { // white wins
                return -2
            } else { // draws
                return 3 * this.#turn
            }
        } else { // the player makes move again
            return this.#turn
        }
    }
}
