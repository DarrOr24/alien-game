'use strict'

const ROCK_SPEED = 500
const ROCK = '🪨'
var gRockInterval
var gAliensThrowingRocksInterval

function findingAlien(){
    alienCount() //if it's the last candy
    if(!gGame.alienCount) {
        gameOver()
        return
    }
    //Choosing a random shooting cell from the alien area
    const leftColIdx = findLeftBorderIdx()
    const rightColIdx = findRightBorderIdx()
    const bottomRowIdx = updateBottomRowIdx(gBoard)
    
    const rndIdx = getRandomInt(leftColIdx, rightColIdx+1)
    return {i: bottomRowIdx, j: rndIdx}
    
}

function alienShoot(){
    if(!gGame.isOn) return
    const shootingCell = findingAlien()
    
    console.log(shootingCell)
    if (!shootingCell) return

    gRockInterval = setInterval(() => {
        if(gBoard[shootingCell.i+1][shootingCell.j].type === FIGHTER){
            handleHeroHit()
            return
        }

        if(gBoard[shootingCell.i+1][shootingCell.j].gameObject === BUNKER){ //Reached the ground
            var currPos = {i: shootingCell.i+1, j: shootingCell.j}
            updateCell(currPos, SKY, EMPTY)
            clearInterval(gRockInterval)
            return
        }

        if(gBoard[shootingCell.i+1][shootingCell.j].type === GROUND){ //Reached the ground
            clearInterval(gRockInterval)
            return
        }

        blinkRock({i: shootingCell.i+1, j: shootingCell.j})
        shootingCell.i++

    }, ROCK_SPEED )

}

function blinkRock(pos) {
    updateCell(pos, SKY, ROCK)
    
    setTimeout(() => {
        updateCell(pos, SKY, EMPTY) 
    }, ROCK_SPEED)
}

function aliensThrowingRocks(){
    gAliensThrowingRocksInterval = setInterval(alienShoot, 5000)
}

function handleHeroHit(){
    if(gHero.isProtected) {
        clearInterval(gRockInterval)
        return
    }
    
    gHero.life--
    clearInterval(gRockInterval)
    updateCell(gHero.pos, SKY, ROCK)

    const elLifeCountDisplay = document.querySelector('.life-count')
    if(gHero.life === 2) var display = ' ♆ ♆   '
    if(gHero.life === 1) var display = ' ♆     '
    if(!gHero.life) var display =      '   🪦  '
    elLifeCountDisplay.innerHTML = `${display}`

    if(!gHero.life){
        gameOver()
        return
    }
    
    setTimeout(() => {
        updateCell(gHero.pos, FIGHTER, HERO) 
    }, 500)

}

function setHeroShield(){
    gHero.isProtected = true
    updateCell(gHero.pos, FIGHTER, SHIELD)
    gHero.shields--
    const elShieldsCountDisplay = document.querySelector('.shield-count')
    if(gHero.shields === 2) var display = ' 🛡️ 🛡️ '
    if(gHero.shields === 1) var display = ' 🛡️     '
    if(gHero.shields === 0) var display = '      '
    elShieldsCountDisplay.innerHTML = display
    
    setTimeout(() => {
        gHero.isProtected = false
        updateCell(gHero.pos, FIGHTER, HERO)
    }, 5000)
}

function createBunkers(board, numOfBunkers){

    if(!numOfBunkers) return

    if(numOfBunkers ===2){
        for(var j = 2; j<=4; j++){
            board[10][j] = createCell(SAFETY, BUNKER)
        }
        for(var j = 9; j<=11; j++){
            board[10][j] = createCell(SAFETY, BUNKER)
        }

        board[11][2] = createCell(SAFETY, BUNKER)
        board[11][4] = createCell(SAFETY, BUNKER)
        board[11][9] = createCell(SAFETY, BUNKER)
        board[11][11] = createCell(SAFETY, BUNKER)
    }

    if(numOfBunkers ===3){
        for(var j = 0; j<=2; j++){
            board[10][j] = createCell(SAFETY, BUNKER)
        }
        for(var j = 6; j<=8; j++){
            board[10][j] = createCell(SAFETY, BUNKER)
        }
        for(var j = 11; j<=13; j++){
            board[10][j] = createCell(SAFETY, BUNKER)
        }

        board[11][0] = createCell(SAFETY, BUNKER)
        board[11][2] = createCell(SAFETY, BUNKER)
        board[11][6] = createCell(SAFETY, BUNKER)
        board[11][8] = createCell(SAFETY, BUNKER)
        board[11][11] = createCell(SAFETY, BUNKER)
        board[11][13] = createCell(SAFETY, BUNKER)

    }
    

}

function findBunkerTopRowIdx(){
    for(var i = 10; i<=11; i++){
        for(var j=2; j<=11; j++){
            if(gBoard[i][j].gameObject === BUNKER) return i
        }
    }

    return null
}