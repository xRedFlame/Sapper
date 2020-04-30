onload = function () { // загрузка окна
    //Инициализируем элементы
    initWindow();
    initNewGame();
};

let getGameButtons = function () {
    return document.querySelectorAll(".game-field > button");
};

let getFormElems = function() {
    return document.getElementsByClassName('level');
};

let initWindow = function () {
    document.querySelector('.new-game').onclick = initNewGame;
    document.querySelector(".rules").onclick = openRules;
    document.querySelector('.settings').onclick = openSettings;
    document.querySelector('.chosen-level').onclick = choseLevel;
    document.querySelector('.width').oninput = checkRangeValue;

   for (let element of document.getElementsByClassName("new-game-again")){
       element.onclick = initNewGame;
   }
    for (let element of document.getElementsByClassName("close")){
        element.onclick = closeDialogWindows;
    }
    for (let element of document.getElementsByClassName("back-to-game")){
        element.onclick = closeDialogWindows;
    }

};

let openRules = function (){
    document.getElementsByClassName("dialog-rules")[0].show();
    document.getElementsByClassName("dialog-rules")[0].scrollTop = 0;
};

let openSettings = function () {
    document.getElementsByClassName("dialog-settings")[0].showModal()
};

let initNewGame = function () {
    generateGameField();
    bombs = [];
    clearField();
    initGameButtons();
    createBombs();
    openedSquares = [];
    checkRangeValue();
    closeDialogWindows();
};

let clearField = function () {
    for (let button of getGameButtons()) {
        button.disabled = false;
        button.classList.remove("bomb");
        button.classList.remove("flag");
        button.classList.remove("number1");
        button.classList.remove("number2");
        button.classList.remove("number3");
        button.innerText = "";
    }
};

let initGameButtons = function () {
    let coordinate = 0;
    for (let gameButton of getGameButtons()) {
        gameButton.coordinate = coordinate++;
        gameButton.oncontextmenu = function () {
            if (gameButton.classList.contains("flag")) {
                gameButton.classList.remove("flag");
            } else {
                gameButton.classList.add("flag");
            }
            return false;
        };
        gameButton.onclick = function () {
            checkBomb(gameButton);
        }
    }
};

let fieldSize = 7;
let bombsCount = Math.round(fieldSize * fieldSize / 4);
let bombs = [];

let createBombs = function () {
    let tempBombsCount = 0;
    while (tempBombsCount < bombsCount) {
        let x = randomInt(0, fieldSize * fieldSize);
        if (bombs[x] == null || bombs[x] !== true) {
            bombs[x] = true;
            tempBombsCount++;
        }
    }
};

let randomInt = function (min, max) {
    return Math.round(min + Math.random() * max);
};

let checkBomb = function (button) {
    if (button.classList.contains("flag")) return;
    let btnCoordinate = button.coordinate;
    if (bombs[btnCoordinate]) {
        explosion(button);
    } else {
        openSquare(button);
        if (openedSquares.length === fieldSize * fieldSize - bombsCount) {
            winGame();
        }
    }
};

let explosion = function (button) {
    //добавить взрыв указанной бомбы
    showBombs();
    gameOver();
};

let openedSquares = [];

let openSquare = function (button) {
    if (openedSquares.includes(button.coordinate)) return;
    openedSquares.push(button.coordinate);
    let nearBombsCount = calculateNearBombs(button.coordinate);
    if (nearBombsCount === 0) {
        let nearSquareCoordinates = getNearSquareCoordinates(button.coordinate);
        for (let coordinate of nearSquareCoordinates) {
            for (let nearButton of getGameButtons()) {
                if (nearButton.coordinate === coordinate) {
                    openSquare(nearButton);
                    break;
                }
            }
        }
    } else {
        button.innerText = nearBombsCount;
        switch (nearBombsCount) {
            case 1:
                button.classList.add("number1");
                break;
            case 2:
                button.classList.add("number2");
                break;
            default:
                button.classList.add("number3");
                break;
        }
    }

    button.disabled = true;
};

let calculateNearBombs = function (coordinate) {
    let nearBombCount = 0;
    let nearSquareCoordinates = getNearSquareCoordinates(coordinate);
    for (let coord of nearSquareCoordinates) {
        if (bombs[coord]) nearBombCount++;
    }
    return nearBombCount;
};

let getNearSquareCoordinates = function (coordinate) {
    let nearSquareCoordinates = [];
    //все левые
    if (coordinate % fieldSize !== 0) {
        nearSquareCoordinates.push(coordinate - 1);
        if (coordinate - fieldSize >= 0) {
            nearSquareCoordinates.push(coordinate - fieldSize - 1);
        }
        if (coordinate + fieldSize <= fieldSize * fieldSize - 1) {
            nearSquareCoordinates.push(coordinate + fieldSize - 1)
        }
    }
    //все правые
    if (coordinate % fieldSize !== fieldSize - 1) {
        nearSquareCoordinates.push(coordinate + 1);
        if (coordinate - fieldSize >= 0) {
            nearSquareCoordinates.push(coordinate - fieldSize + 1);
        }
        if (coordinate + fieldSize <= fieldSize * fieldSize - 1) {
            nearSquareCoordinates.push(coordinate + fieldSize + 1)
        }
    }
    //верхний
    if (coordinate - fieldSize >= 0) {
        nearSquareCoordinates.push(coordinate - fieldSize);
    }
    //нижний
    if (coordinate + fieldSize <= fieldSize * fieldSize - 1) {
        nearSquareCoordinates.push(coordinate + fieldSize)
    }
    return nearSquareCoordinates;
};

let showBombs = function () {
    let buttons = getGameButtons();
    for (let i = 0; i < buttons.length; i++) {
        if (bombs[i] === true) {
            buttons[i].classList.add("bomb");
        }
    }
};

let gameOver = function () {
    for (let button of getGameButtons()) {
        button.disabled = true;
    }
    document.getElementsByClassName("dialog-game-over")[0].showModal();
};

let winGame = function () {
    for (let button of getGameButtons()) {
        button.disabled = true;
    }
    document.getElementsByClassName("dialog-win")[0].showModal();
};
let closeDialogWindows=function(){
    document.querySelector(".dialog-win").close();
    document.querySelector(".dialog-game-over").close();
    document.querySelector(".dialog-rules").close();
    document.querySelector(".dialog-settings").close();
};



let choseLevel = function (){
    let chosenWidth=document.querySelector('.width');
    fieldSize = chosenWidth.valueAsNumber;

        if(getFormElems()[0].checked){
            bombsCount = Math.round(fieldSize * fieldSize / 6);
        }
        if(getFormElems()[1].checked){
            bombsCount = Math.round(fieldSize * fieldSize / 5);
        }
        if(getFormElems()[2].checked){
            bombsCount = Math.round(fieldSize * fieldSize / 4);
        }
        if(getFormElems()[3].checked){
        bombsCount = Math.round(fieldSize * fieldSize / 3);
        }
        if(getFormElems()[4].checked){
        bombsCount = Math.round(fieldSize * fieldSize / 2);
        }

    initNewGame();
};

let generateGameField=function () {
    let field = document.querySelector('.game-field');
    field.innerHTML = "";
    field.style.width =fieldSize*40 + 'px';
    for (let i = 1; i <= fieldSize*fieldSize; i++) {
        let gameButton = document.createElement("button");
        field.appendChild(gameButton);
    }
};

let checkRangeValue = function () {
    document.querySelector('.range-value1').value = document.querySelector('.width').value;
    document.querySelector('.range-value2').value = document.querySelector('.width').value;

};