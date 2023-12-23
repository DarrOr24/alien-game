'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

//GAME OBJECTS
var HERO = '♆'
const ALIEN1 = '👽'
const ALIEN2 = '👾'
const ALIEN3 = '😈'
const ALIEN4 = '👹'
const ALIEN = 'ALIEN'
const LASER = '⤊'
const SUPER_LASER = '^'
const SPACE_CANDY = '🍬'
const SHIELD = '🛡️'
const BUNKER = '🧱'

//TYPES
const FIGHTER = 'FIGHTER'
const CANDY = 'CANDY'
const EMPTY = ''
const SKY = 'SKY'
const GROUND = 'GROUND'
const SAFETY = 'SAFETY'

var gBoard
var gGame = {
    isOn: false,
    alienCount: 24
    }
var gScore = 0
var gLevel = 24
var gNumOfBunkers = 2
       
function init() {
    gIsAlienFreeze = true
    gGame.isOn = false
    gGame.alienCount = 24
    gHero.superMode = 3
    gHero.superAttacks = 3
    gScore = 0
    gNumOfBunkers 
    
    gBoard = createBoard()
    createHero(gBoard)
    createAliens(gBoard, gLevel)
    createBunkers(gBoard, gNumOfBunkers)
    renderBoard(gBoard)

    createKeyMapBox()
    
    gAliensTopRowIdx = 1 
    // gAliensBottomRowIdx = 3

}

function levelSelect(elLevelBtn, level){
    if(!gIsAlienFreeze) return
    if(gGame.isOn) return

    const elLevelBtns = document.querySelectorAll('.level-buttons')
    for (var i=0; i<3; i++){

        if(elLevelBtns[i].classList.contains('selected')){
            elLevelBtns[i].classList.remove('selected')
        }
    }
    
    elLevelBtn.classList.add('selected')
    gBoard = createBoard()
    createAliens(gBoard, level)
    createHero(gBoard)
    createBunkers(gBoard, gNumOfBunkers)
    renderBoard(gBoard)

    alienCount()

    gAliensTopRowIdx = updateTopRowIdx(gBoard) 
    gAliensBottomRowIdx = updateBottomRowIdx(gBoard) 

    if (level === 24) gAlienSpeed = 500
    if (level === 32) gAlienSpeed = 450
    if (level === 40) gAlienSpeed = 400
    gLevel = level
}

function start(elStartBtn){
    gIsAlienFreeze = false
    gGame.isOn = true
    elStartBtn.classList.add('hide')
    moveAliensRight()
    renderSpaceCandies()
    aliensThrowingRocks()

    const elSettingsBtn = document.querySelector('.settings-btn')
    elSettingsBtn.classList.add('hide')

    const elSettingsBox = document.querySelector('.settings')
    if(!elSettingsBox.classList.contains('hide')) elSettingsBox.classList.add('hide')
    
    const elResetBtn = document.querySelector('.reset-button')
    elResetBtn.classList.remove('hide')
}

function reset(elResetBtn){
    gameOver()

    const elSettingsBox = document.querySelector('.settings-btn')
    elSettingsBox.classList.remove('hide')

    const elStartBtn = document.querySelector('.start-button')
    elStartBtn.classList.remove('hide')
    
    const elVictoryMsg = document.querySelector('.victory')
    if(!elVictoryMsg.classList.contains('hide')) elVictoryMsg.classList.add('hide')
    
    const elLossMsg = document.querySelector('.loss')
    if(!elLossMsg.classList.contains('hide')) elLossMsg.classList.add('hide') 

    const elSuperModeMsg = document.querySelector('.super-mode')
    elSuperModeMsg.innerHTML = 3

    const elScoreDisplay = document.querySelector('.score-count')
    elScoreDisplay.innerHTML = 0

    const elLifeCountDisplay = document.querySelector('.life-count')
    elLifeCountDisplay.innerHTML = ` ♆ ♆ ♆ `

    init()
}

function gameOver(){
    gGame.isOn = false
    gIsAlienFreeze = true

    clearInterval(gIntervalAliens)
    clearInterval(gIntervalCandy)
    clearInterval(gAliensThrowingRocksInterval)
    clearInterval(gRockInterval)
    resetLaserInterval()

    

    console.log('GAME OVER')
    if(isVictory()){
        const elVictoryMsg = document.querySelector('.victory')
        elVictoryMsg.classList.remove('hide')
    }
    else{
        const elLossMsg = document.querySelector('.loss')
        elLossMsg.classList.remove('hide')
    }
}

function createBoard() {
    const size = 14
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            if(i === size - 1) board[i][j] = createCell(GROUND, EMPTY)
            else board[i][j] = createCell(SKY, EMPTY) 
        }
    }
    return board  
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j].gameObject
            var className = `cell`

            if(board[i][j].type === GROUND){
                className += ' ground'
            }

            strHTML += `\t<td class="${className}" 
                        data-i="${i}" data-j="${j}" >${cell}</td>\n`
        }
        strHTML += '</tr>\n'
        
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function createCell(type, gameObject = null) {
    return {
    type: type,
    gameObject: gameObject
    }
}

function updateCell(pos, type, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    gBoard[pos.i][pos.j].type = type
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject
}

function updateScore(target){
    // Can be either ALIEN or SPACE_CANDY
    target === ALIEN ? gScore +=10 : gScore+=50

    alienCount()
    const elScoreDisplay = document.querySelector('.score-count')
    elScoreDisplay.innerHTML = `${gScore}`
}

function isVictory(){
    alienCount()
    return (gGame.alienCount===0)
}

