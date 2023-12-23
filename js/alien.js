'use strict'

var gAlienSpeed = 500
var gIntervalAliens
var gAliensTopRowIdx = 0 
var gAliensBottomRowIdx = 2
var gIsAlienFreeze = false


function createAliens(board, level=24) {
    
    if (level === 24 || level === 32){
        var startCol = 3
        var endCol = 10
    }
   
    if (level === 40){
        startCol = 2
        endCol = 11
    }

    for (var j = startCol; j <= endCol; j++){
        board[1][j] = createCell(ALIEN, ALIEN1)
        board[2][j] = createCell(ALIEN, ALIEN2)
        board[3][j] = createCell(ALIEN, ALIEN3)

        if (level === 32 || level === 40){
            board[4][j] = createCell(ALIEN, ALIEN4)
        }

    }

    gAliensTopRowIdx = updateTopRowIdx(gBoard)
    gAliensBottomRowIdx = updateBottomRowIdx(gBoard)
    alienCount()
    
 
} 

function handleAlienHit(pos) {
    resetLaserInterval()
    
    updateCell(pos, SKY, EMPTY)

    alienCount()
    updateScore(ALIEN)

    updateBottomRowIdx(gBoard) //updating global top and bottom row variables
    updateTopRowIdx(gBoard) 

    if(!gGame.alienCount) gameOver()
}

function shiftBoardRight(board, fromI, toI) { //The Idea is to scan each column that's why I switched the loop order
    if(gIsAlienFreeze) return
    if(!gGame.alienCount){
        gameOver()
        return
    } 

    const size = board.length

    for(var j = size - 1; j >= 0; j--){
        for(var i = fromI ; i <= toI; i++){
            var currCell = board[i][j] 
           
            if(j===size-1 && currCell.type === ALIEN ||
                j===size-1 && currCell.type === CANDY){//If aliens reached the right wall
                clearInterval(gIntervalAliens)
                gIntervalAliens = 0
                return false 
            } 

            if(j===0){
                currCell.type = SKY
                currCell.gameObject = EMPTY
            } 

            else{
                var cellOnTheLeft = board[i][j-1]

                if (cellOnTheLeft.gameObject === LASER){
                    currCell.type = SKY
                    currCell.gameObject = EMPTY
                }
                else{
                    currCell.gameObject = cellOnTheLeft.gameObject
                    currCell.type = cellOnTheLeft.type
                }
   
            }

        }

    }
    renderBoard(board)
    return true
}

function shiftBoardLeft(board, fromI, toI) { //The Idea is to scan each column that's why I switched the loop order
    if(gIsAlienFreeze) return
    if(!gGame.alienCount){
        gameOver()
        return
    } 
    const size = board.length

    for(var j = 0; j < size ; j++){
        for(var i = fromI ; i <= toI; i++){
            var currCell = board[i][j]

            if(j===0 && currCell.type === ALIEN ||
                j===0 && currCell.type === CANDY){//If aliens reached the left wall
                clearInterval(gIntervalAliens)
                gIntervalAliens = 0
                return false
            }

            if(j===size-1){
                currCell.type = SKY
                currCell.gameObject = EMPTY
            } 

            else{
                var cellOnTheRight = board[i][j+1]

                if (cellOnTheRight.gameObject === LASER){
                    currCell.type = SKY
                    currCell.gameObject = EMPTY
                }
                else{
                    currCell.gameObject = cellOnTheRight.gameObject
                    currCell.type = cellOnTheRight.type
                }

            }

        }
    }

    renderBoard(board)
    return true
}

function shiftBoardDown(board, fromI, toI) { //Here I want to scan each row starting from the bottom row
    if(gIsAlienFreeze) return
    if(!gGame.alienCount){
        gameOver()
        return
    } 

    const size = board.length

    const bunkerTopRowIdx = findBunkerTopRowIdx()
    
    if(gAliensBottomRowIdx === gHero.pos.i - 1){ //Aliens reached the hero or the bunkers
    // if(gAliensBottomRowIdx === gHero.pos.i - 1 ||
    //     gAliensBottomRowIdx === bunkerTopRowIdx - 1){ //Aliens reached the hero or the bunkers
        clearInterval(gIntervalAliens)
        gameOver()
        return
    }
    
    for(var i = toI ; i >= fromI-1; i--){
        for(var j = 0; j <= size-1; j++){

            var currCell = board[i][j]

            if(i===fromI-1){
                var cellUnder = board[i+1][j]
                cellUnder.type = SKY
                cellUnder.gameObject = EMPTY
                
            }
            

            else{
                cellUnder = board[i+1][j]
                if (cellUnder.gameObject === LASER){
                    currCell.type = SKY
                    currCell.gameObject = EMPTY
                    
                }
                else{
                    
                    cellUnder.gameObject = currCell.gameObject
                    cellUnder.type = currCell.type
                    
                }

            }
            
        }
    }
    renderBoard(board)
    updateBottomRowIdx(board) //updating global top and bottom row variables
    updateTopRowIdx(board)

    return true
}
 
function moveAliensRight(){
    if(gIsAlienFreeze) return
    if(!gGame.alienCount){
        gameOver()
        return
    } 
    console.log('moving right now')
    console.log(gAliensTopRowIdx, gAliensBottomRowIdx)

    gIntervalAliens = setInterval (() => {
        
        shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        if(!gIntervalAliens){
             console.log('time to go down')
             updateBottomRowIdx(gBoard)
             updateTopRowIdx(gBoard)
             shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
             gIntervalAliens = 1
             moveAliensLeft(gAliensTopRowIdx, gAliensBottomRowIdx)
             return 
             
        }
    }, gAlienSpeed)

}

function moveAliensLeft(){
    if(gIsAlienFreeze) return
    if(!gGame.alienCount){
        gameOver()
        return
    } 
    console.log('moving left now')
    console.log(gAliensTopRowIdx, gAliensBottomRowIdx)

    gIntervalAliens = setInterval (() => {
        
        shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        if(!gIntervalAliens){
             console.log('time to go down')
             updateBottomRowIdx(gBoard)
             updateTopRowIdx(gBoard)
             shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
            
             gIntervalAliens = 1
             moveAliensRight(gAliensTopRowIdx, gAliensBottomRowIdx)
             return 
             
        }
    }, gAlienSpeed)

}

function updateBottomRowIdx(board){
    const size = board.length

    for (var i = 12; i >=0; i--){
        for(var j=0; j<size; j++){
            var currCell = board[i][j]

            if(currCell.type === ALIEN || currCell.type === CANDY ){
                gAliensBottomRowIdx = i
                return i
            }
        }
    }
    
    return null
}

function updateTopRowIdx(board){
    const size = board.length

    for(var i = gAliensTopRowIdx; i <= size-2; i++){

        for(var j = 0; j < size; j++){
            var currCell = board[i][j]
    
                if(currCell.type === ALIEN){
                    gAliensTopRowIdx = i
                    return i
                }
        }

    }

    return null

}

function alienCount(){
    const size = gBoard.length
    const botRowIdx = gAliensBottomRowIdx
    const topRowIdx = gAliensTopRowIdx
    var count = 0

    for(var i = botRowIdx; i>= topRowIdx; i--){
        for(var j = 0; j < size; j++){
            var currCell = gBoard[i][j]
            if(currCell.type === ALIEN) count++
        }
    }

    gGame.alienCount = count
    return count

}





