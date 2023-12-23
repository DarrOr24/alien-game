'use strict'


function showKeyMap(elKeyMapBtn){
    const elSettingsBox = document.querySelector('.settings')
    if(!elSettingsBox.classList.contains('hide')) elSettingsBox.classList.add('hide')

    const elKeyMap = document.querySelector('.key-map')
    if(elKeyMap.classList.contains('hide')) elKeyMap.classList.remove('hide')
    else elKeyMap.classList.add('hide') 
}

function customizeSettings(elSettingsBtn){

    const elKeyMap = document.querySelector('.key-map')
    if(!elKeyMap.classList.contains('hide')) elKeyMap.classList.add('hide')
    
    const elSettingsBox = document.querySelector('.settings')
    if(elSettingsBox.classList.contains('hide')) elSettingsBox.classList.remove('hide')
    else elSettingsBox.classList.add('hide') 
}

function chooseTheme(elThemeBtn, theme){

    const elThemeBtns = document.querySelectorAll('.theme-btns')
    for (var i=0; i<elThemeBtns.length; i++){
        if(elThemeBtns[i].classList.contains('selected'))elThemeBtns[i].classList.remove('selected') 
    }

    elThemeBtn.classList.add('selected')

    const elBody = document.querySelector('body')

    if(theme === 'default'){
        if(elBody.classList.contains('barbie')) elBody.classList.remove('barbie')
        if(elBody.classList.contains('retro')) elBody.classList.remove('retro')
    }
    if(theme === 'retro'){
        if(elBody.classList.contains('barbie')) elBody.classList.remove('barbie')
        if(!elBody.classList.contains('retro')) elBody.classList.add('retro')
    }
    if(theme === 'barbie'){
        if(!elBody.classList.contains('barbie')) elBody.classList.add('barbie')
        if(elBody.classList.contains('retro')) elBody.classList.remove('retro')
    }
 

}

function chooseHero(elHeroBtn, hero){
    const elHeroBtns = document.querySelectorAll('.hero-btns')
    for (var i=0; i<elHeroBtns.length; i++){
        if(elHeroBtns[i].classList.contains('selected'))elHeroBtns[i].classList.remove('selected') 
    }
    elHeroBtn.classList.add('selected')

    HERO = hero

    updateCell(gHero.pos, FIGHTER, HERO)

}

function chooseProtection(elProtectionBtn, numOfBunkers){

    gNumOfBunkers = numOfBunkers
    const elProtectionBtns = document.querySelectorAll('.bunker-btns')
    for (var i=0; i<elProtectionBtns.length; i++){
        if(elProtectionBtns[i].classList.contains('selected'))elProtectionBtns[i].classList.remove('selected') 
    }
    elProtectionBtn.classList.add('selected')

    gBoard = createBoard()
    createHero(gBoard)
    createBunkers(gBoard, numOfBunkers)
    createAliens(gBoard, gLevel)
    renderBoard(gBoard)
}

function createKeyMapBox(){
    const elKeyMapBox = document.querySelector('.key-map')
    elKeyMapBox.innerText= ` ➡️ →  MOVE RIGHT  ⬅️ →  MOVE LEFT 
    space → SHOOT
    x  →  FAST LASERS 🚀 s  →  SUPER LASERS 💫
    z  →  SHIELD 🛡️ n  →  BLOW UP SURROUNDINGS 💥`
}

