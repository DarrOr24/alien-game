'use strict'

const LASER_SPEED = 80
var gLaserInterval = []
var gIntervalCandy

var gHero = {pos: {i:12, j: 5}, isProtected: false, isSuper: false, superMode: 3, superAttacks: 3, life: 3, shields: 3}

function createHero(board) {
    board[gHero.pos.i][gHero.pos.j] = createCell(FIGHTER, HERO) 
}

function onKeyDown(ev) {
    if(!gGame.isOn) return
    
    const size = gBoard.length

    switch(ev.key){
        case 'ArrowLeft':
            var dir = -1
            if(gHero.pos.j + dir < 0) return
            moveHero(dir)
            return
            
        case 'ArrowRight':
            dir = 1
            if(gHero.pos.j + dir > size-1) return
            moveHero(dir)
            return

        case ' ':
            if(gHero.isSuper)shoot(gHero.pos, LASER_SPEED, LASER) //if Super can shoot continuously
            if(gLaserInterval.length) return
            shoot(gHero.pos, LASER_SPEED, LASER)
            return

        case 'n':
            const laserPos = findLaserPos()
            if(laserPos) blowUpNgs(laserPos)
            return

        case 'x': //Because ORDER DOES MATTER
            if (gHero.superMode === 0) return
            gHero.superMode--
            superMode()
            return
        
        case 's': //After using this function once Hero is not able to shoot at all 🤔😧
            if (gHero.superAttacks === 0) return
            settingSuperAttacks()
            
            // if (!gSuperAttacksInterval.length) settingSuperAttacks()
            // gSuperAttacksInterval.push(shoot(gHero.pos, LASER_SPEED, LASER)) 
            return

        case 'z': 
            if (!gHero.shields) return
            setHeroShield()
            return
        
            default:
                return null
    
    }
}

function moveHero(dir) {
    const nextHeroPos = {}
    nextHeroPos.i = gHero.pos.i
    nextHeroPos.j = gHero.pos.j + dir

    updateCell(gHero.pos, SKY, EMPTY)
    
    gHero.pos = nextHeroPos
    
    if(gHero.isProtected) updateCell(gHero.pos, FIGHTER, SHIELD)
    else updateCell(gHero.pos, FIGHTER, HERO)  
}

function shoot(pos, speed, symbol) {

    var shootingCell = {}
    shootingCell.i = pos.i 
    shootingCell.j = pos.j 
    var laserInterval = setInterval(() => {
        gLaserInterval.push(laserInterval)
        if(gBoard[shootingCell.i-1][shootingCell.j].type === ALIEN){
            handleAlienHit({i: shootingCell.i-1, j: shootingCell.j})
            resetLaserInterval()
            return
        }

        if(gBoard[shootingCell.i-1][shootingCell.j].gameObject === SPACE_CANDY){
            handleCandyHit({i: shootingCell.i-1, j: shootingCell.j})
            resetLaserInterval()   
            return
        }

        if(gBoard[shootingCell.i-1][shootingCell.j].gameObject === BUNKER){
            updateCell({i: shootingCell.i-1, j: shootingCell.j}, SKY, EMPTY)
            resetLaserInterval()   
            return
        }

        if(shootingCell.i-1 === 0){ //Reached the top
            resetLaserInterval()
            return
        }

        blinkLaser({i: shootingCell.i-1, j: shootingCell.j}, symbol)
        shootingCell.i--

    }, speed)

} 

function blinkLaser(pos, symbol) {
    updateCell(pos, SKY, symbol )
    
    setTimeout(() => {
        updateCell(pos, SKY, EMPTY)
    }, LASER_SPEED)
}

function resetLaserInterval(){
    for(var i = 0; i < gLaserInterval.length; i++){
        var interval = gLaserInterval[i]
        clearInterval(interval)
        }
    gLaserInterval = []
}

function findLaserPos(){
    
    const size = gBoard.length
    for (var i = size-3 ; i >= 0 ; i--){
        for(var j=0; j<size; j++){
            var currCell = gBoard[i][j]
            if(currCell.gameObject === LASER) return {i, j}
        }
    }

    return null
}

function blowUpNgs(pos){

    for(var i = pos.i - 1; i <= pos.i + 1; i++){
        if(i < 0 || i >= gBoard.length) continue

        for(var j = pos.j - 1; j <= pos.j + 1; j++){
            if(j < 0 || j >= gBoard[i].length) continue
            if(i === pos.i && j === pos.j) continue
            if(gBoard[i][j].type === ALIEN) handleAlienHit({i,j})
        }
    }

}

function superMode(){
    const elSuperModeMsg = document.querySelector('.super-mode')
    elSuperModeMsg.innerHTML = `${gHero.superMode}`
    const pos = findLaserPos() 
    clearInterval(gLaserInterval)
    shoot(pos, LASER_SPEED/3, '^')
    
}

function settingSuperAttacks(){
    gHero.isSuper = true

    gHero.superAttacks--
    const elSuperAttacksMsg = document.querySelector('.super-attacks')
    elSuperAttacksMsg.innerHTML = `${gHero.superAttacks}`
    
    displayTime()

    setTimeout(() => {
            gHero.isSuper = false
            for(var i = 0; i < gLaserInterval.length; i++){
                var interval = gLaserInterval[i]
                clearInterval(interval)
            }
            gLaserInterval = [] 

            var elTimer = document.querySelector('.super-attacks-timer')
            elTimer.innerHTML = '3.00'

            return    
        
    }, 3000)

}

function displayTime(){

    var startTime = new Date().getTime()
    
    for (var i = 0; i <= 3*1000; i +=100){
        setTimeout(() => {
            var currTime = new Date().getTime()
            var timeDiff = currTime - startTime
            var displayTime = Math.abs((3 - timeDiff/1000))

            var elTimer = document.querySelector('.super-attacks-timer')
            elTimer.innerHTML = `${displayTime.toFixed(2)}`

        }, i)  
    }
     
}





