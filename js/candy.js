'use strict'

function renderSpaceCandy(){
    if(!gGame.isOn) return
    const bottomRowIdx = updateBottomRowIdx(gBoard)
    const leftColIdx = findLeftBorderIdx()
    const rightColIdx = findRightBorderIdx()

    const rndIdx = getRandomInt(leftColIdx, rightColIdx+1)

    const candyPos = {i: bottomRowIdx, j: rndIdx}

    const cell = gBoard[candyPos.i][candyPos.j]
    const cellGameObject = cell.gameObject
    const cellType = cell.type
    updateCell(candyPos, CANDY, SPACE_CANDY)
    
    setTimeout(() => {
        returnObject(cellType, cellGameObject)   
    }, 5000)
    
}

function returnObject(cellType, cellGameObject){
    if(!gGame.isOn) return
    const bottomRowIdx = updateBottomRowIdx(gBoard)
    const leftColIdx = findLeftBorderIdx()
    const rightColIdx = findRightBorderIdx()

    for (var j = leftColIdx; j <= rightColIdx; j++){

       if(gBoard[bottomRowIdx][j].type === CANDY){
        updateCell({i: bottomRowIdx, j}, cellType, cellGameObject)
        return 
       }  
    }
}

function renderSpaceCandies(){
    gIntervalCandy = setInterval(renderSpaceCandy, 10000)
}

function findLeftBorderIdx(){
    const size = gBoard.length
    const bottomRowIdx = updateBottomRowIdx(gBoard)
    const topRowIdx = updateTopRowIdx(gBoard)

    for (var j = 0; j < size; j++){
        for(var i = bottomRowIdx; i >= topRowIdx; i--){
            var currCell = gBoard[i][j]
            if(currCell.type === ALIEN || currCell.type === CANDY) return j
        }
    }

    return null

}

function findRightBorderIdx(){
    const size = gBoard.length
    const bottomRowIdx = updateBottomRowIdx(gBoard)
    const topRowIdx = updateTopRowIdx(gBoard)

    for (var j = size - 1; j >= 0; j--){
        for(var i = bottomRowIdx; i >= topRowIdx; i--){
            var currCell = gBoard[i][j]
            if(currCell.type === ALIEN ||currCell.type === CANDY) return j
        }
    }

    return null

}

function handleCandyHit(pos){
    resetLaserInterval()

    alienCount() //if it's the last candy
    if(!gGame.alienCount) {
        gameOver()
        return
    }

    updateBottomRowIdx(gBoard) //updating global top and bottom row variables
    updateTopRowIdx(gBoard) 

    updateCell(pos, SKY, EMPTY)  //updating cell and score
    updateScore(SPACE_CANDY)

    freezeAliens()

}

function freezeAliens(){
    clearInterval(gIntervalAliens)
    gIsAlienFreeze = true
    setTimeout(() => {
        gIsAlienFreeze = false
        moveAliensRight()
    }, 5000)
}