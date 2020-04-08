onload = function () { // загрузка окна
    //Инициализируем элементы
    let newGameButton = document.querySelector('.new-game').onclick = newGame
    let gameButtons = document.querySelectorAll(".palette > button");
    oncontextmenu = function () {
        return false;
    }
    initGameButtons(gameButtons);
    createBombs();
};

let newGame = function () {
    alert("Новая игра");
};

let initGameButtons = function (gameButtons) {
    let coordinate = 0;
    for (let gameButton of gameButtons) {
        gameButton.coordinate = coordinate++;
        gameButton.oncontextmenu = function () {
            if (gameButton.classList.contains("flag")) {
                gameButton.classList.remove("flag");
            } else {
                gameButton.classList.add("flag");
            }
            return false;
        }
        gameButton.onclick = function () {
            checkBomb(gameButton);
        }
    }
}

fieldSize = 7;
bombsCount = Math.round(fieldSize * fieldSize / 4);
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
}

let checkBomb = function (button) {
    if (button.classList.contains("flag")) return;
    let btnCoordinate = button.coordinate;
    if (bombs[btnCoordinate]) {
        explosion(button);
    } else {
        openSquare(button);
    }
};

let explosion = function (button) {
    button.classList.add("bomb");
};

let openSquare = function (button) {
    let nearBombsCount = calculateNearBombs(button.coordinate);
    button.innerText = nearBombsCount;
}

let calculateNearBombs = function (coordinate) {
    let nearBombCount = 0;
    let nearSquareCoordinates = getNearSquareCoordinates(coordinate);
    for (let coord of nearSquareCoordinates) {
        if (bombs[coord]) nearBombCount++;
    }
    return nearBombCount;
};

let getNearSquareCoordinates = function (coordinate) {
    let nearSquareCoordinates = []
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

