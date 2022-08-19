import Reversi from "./reversi/game.js"

const fileCoord = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
]
const reversi = new Reversi()

const boardTable = document.getElementById('game-board-table')
const diskNumCell = [
    document.getElementById('black-disk-num'),
    document.getElementById('white-disk-num')
]
const moveTable = document.getElementById('game-move-table').querySelector('table')
const moveTableHeader = moveTable.rows[0].cloneNode(true)
const resetButton = document.getElementById('replay-button')
const undoButton = document.getElementById('back-button')

// array containing svg nodes for pieces
const piecesArray = []

const svgURI = "http://www.w3.org/2000/svg"
const blackPiece = document.createElementNS(svgURI, 'svg')
const blackSide = document.createElementNS(svgURI, 'circle')
blackSide.setAttributeNS(null, 'cx', '31')
blackSide.setAttributeNS(null, 'cy', '31')
blackSide.setAttributeNS(null, 'r', '25')
blackSide.setAttributeNS(null, 'stroke', 'white')
blackSide.setAttributeNS(null, 'stroke-width', '3')
blackSide.setAttributeNS(null, 'fill', 'black')

blackPiece.appendChild(blackSide)
blackPiece.setAttribute('class', 'board-disk-side')

const whitePiece = document.createElementNS(svgURI, 'svg')
const whiteSide = document.createElementNS(svgURI, 'circle')
whiteSide.setAttributeNS(null, 'cx', '31')
whiteSide.setAttributeNS(null, 'cy', '31')
whiteSide.setAttributeNS(null, 'r', '25')
whiteSide.setAttributeNS(null, 'stroke', 'black')
whiteSide.setAttributeNS(null, 'stroke-width', '3')
whiteSide.setAttributeNS(null, 'fill', 'white')

whitePiece.appendChild(whiteSide)
whitePiece.setAttribute('class', 'board-disk-side')

// display logic functions

function displayBoard() {
    for (let r = 0; r < reversi.boardSize(); ++r) {
        for (let f = 0; f < reversi.boardSize(); ++f) {
            switch (reversi.getBoard()[r][f]) {
                case 1:
                    piecesArray[r][f][0].style.opacity = '1'
                    piecesArray[r][f][1].style.opacity = '0'
                    break
                case -1:
                    piecesArray[r][f][1].style.opacity = '1'
                    piecesArray[r][f][0].style.opacity = '0'
                    break
                case 0:
                    piecesArray[r][f][0].style.opacity = '0'
                    piecesArray[r][f][1].style.opacity = '0'
                    break
            }
        }
    }
}

function displayOpaqueDisk(r, f, turn, isEnter) {
    piecesArray[r][f][turn > 0 ? 0 : 1].style.opacity = isEnter ? '0.3' : '0'
}

function displayDiskNum() {
    let pieceNum = reversi.getPieceNum()
    diskNumCell[0].innerText = pieceNum[0]
    diskNumCell[1].innerText = pieceNum[1]
}

function initMoveTable() {
    moveTable.innerHTML = ''
    moveTable.append(moveTableHeader)
}

function moveResultAction(r, f) {
    let turn = reversi.getTurn()
    let num = reversi.getNum()
    let moveResult = reversi.moveResult(r, f)
    switch (moveResult) {
        case 0: return
        case turn: // the player moves again
            if (turn > 0) { // black
                let newMoveRow = moveTable.insertRow()
                newMoveRow.insertCell().innerText = num
                newMoveRow.insertCell().innerText = fileCoord[0][f] + (r+1)
                let passCell = newMoveRow.insertCell()
                passCell.innerText = 'passed'
                passCell.style.color = 'gray'
            } else { // white
                let moveRow = moveTable.rows[moveTable.rows.length - 1]
                moveRow.insertCell().innerText = fileCoord[1][f] + (r+1)
                let newMoveRow = moveTable.insertRow()
                newMoveRow.insertCell().innerText = num + 1
                let passCell = newMoveRow.insertCell()
                passCell.innerText = 'passed'
                passCell.style.color = 'gray'
            }
            break
        case -turn: // opponent moves
            if (turn > 0) { // black
                let newMoveRow = moveTable.insertRow()
                newMoveRow.insertCell().innerText = num
                newMoveRow.insertCell().innerText = fileCoord[0][f] + (r+1)
            } else { // white
                let moveRow = moveTable.rows[moveTable.rows.length - 1]
                moveRow.insertCell().innerText = fileCoord[1][f] + (r+1)
            }
            break
        case 2:
            displayBoard()
            displayDiskNum()
            alert("Game's finished. Black's win!")
            return
        case -2:
            displayBoard()
            displayDiskNum()
            alert("Game's finished. White's win!")
            return
        default: // draw
            alert("Game's finished. It's a draw!")
            return
    }
    displayBoard()
    displayDiskNum()
}
/*
function undo() {

}*/

for (let r = 0; r < reversi.boardSize(); ++r) {
    piecesArray[r] = []
    for (let f = 0; f < reversi.boardSize(); ++f) {
        let cell = boardTable.rows[r + 1].cells[f + 1]
        let bp = blackPiece.cloneNode(true)
        let wp = whitePiece.cloneNode(true)
        cell.appendChild(bp)
        cell.appendChild(wp)

        piecesArray[r][f] = [bp, wp]
        cell.onclick = () => {
            moveResultAction(r, f)
        }
        cell.onmouseenter = () => {
            if (reversi.isMovable(r, f)) {
                displayOpaqueDisk(r, f, reversi.getTurn(), true)
            }
        }
        cell.onmouseleave = () => {
            if (reversi.isMovable(r, f)) {
                displayOpaqueDisk(r, f, reversi.getTurn(), false)
            }
        }
    }
}
resetButton.onclick = () => {
    let resetting = confirm('Reset the game? Current process will not be saved.')
    if (resetting) {
        reversi.init()
        displayBoard()
        displayDiskNum()
        initMoveTable()
    }
}
undoButton.onclick = () => {
    alert('Not yet implemented...')
}

displayBoard()
displayDiskNum()
initMoveTable()
