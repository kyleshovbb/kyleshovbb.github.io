"use strict";
/**
 * Создаём класс для игры Пятнашки
 * @param {number} line - Количество строк для игры
 * @param {number} column - Количество столбцов для игры
 */
class Game {
    constructor(line, column) {
        this.line = line || 4;
        this.column = column || 4;
        this.finalArray = this.createGameArray(this.line, this.column);
        this.array = this.createGameArray(this.line, this.column);
        this.array = this.sortArray(this.array);
        this.table = document.createElement("table");
        this.contain = document.getElementById("contain");
        this.timer = new Date();
        this.createGameArray(this.line, this.column);
        this.writeGame();
    }

    /**
     * Создаём двумерный массив, с правильным положением всех значений
     * @param {number} line - Количество строк для игры
     * @param {number} column - Количество столбцов для игры
     */
    createGameArray(line, column) {
        let array = [];
        let count = 1;
        for (let i = 0; i < line; ++i) {
            let newRow = [];
            for (let j = 0; j < column; ++j) {
                if (line * column === count) {
                    newRow.push("");
                } else newRow.push(String(count));
                ++count;
            }
            array.push(newRow);
        }
        return array;
    }

    /**
     * Перемешиваем значения в массиве. Перемешивание происходит перемешением пустого элемента по массиву
     * @param {array} array - массив, в котором перемешиваем значения
     */
    sortArray(array) {
        let emptyElementIndex = "" + (this.line - 1) + (this.column - 1);
        let iterationsNumber = this.line * this.column * 5;
        for (let i = 0; i < iterationsNumber; i++) {
            let arrayIndex = emptyElementIndex.split("");
            let i = +arrayIndex[0];
            let j = +arrayIndex[1];
            switch (this.getRandomInt(0, 4)) {
                case 0:
                    if (i - 1 >= 0) {
                        array[i][j] = array[i - 1][j];
                        array[i - 1][j] = "";
                        emptyElementIndex = "" + (i - 1) + j;
                    }
                    break;
                case 1:
                    if (i + 1 < this.line) {
                        array[i][j] = array[i + 1][j];
                        array[i + 1][j] = "";
                        emptyElementIndex = "" + (i + 1) + j;
                    }
                    break;
                case 2:
                    if (j - 1 >= 0) {
                        array[i][j] = array[i][j - 1];
                        array[i][j - 1] = "";
                        emptyElementIndex = "" + i + (j - 1);
                    }
                    break;
                case 3:
                    if (j + 1 < this.column) {
                        array[i][j] = array[i][j + 1];
                        array[i][j + 1] = "";
                        emptyElementIndex = "" + i + (j + 1);
                    }
                    break;
            }
        }
        return array;
    }

    /**
     * Получаем случайное значение в указанном диапазоне
     * @param {number} min - минимальное значение
     * @param {number} max - максимальное значение
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Проверяем, завершена ли игра, путём сравнения массива со значениями в правильном порядке с
     * массивом, который получали в результате игры
     * @param {number} line - Количество строк для игры
     * @param {number} column - Количество столбцов для игры
     */
    finishGame(line, column) {
        for (let i = 0; i < line; ++i) {
            for (let j = 0; j < column; ++j) {
                if (this.array[i][j] !== this.finalArray[i][j]) {
                    return;
                }
            }
        }
        let finishDate = new Date();
        let solvingTime = finishDate - this.timer;
        let solvingDate = new Date(solvingTime);
        let minute = solvingDate.getMinutes();
        let sec = solvingDate.getSeconds();
        contain.innerHTML = `Ура! Вы решили головоломку за ${minute}:${sec}`;
    }

    /**
     * Перерисовываем таблицу с игрой
     */
    writeGame() {
        this.table.innerHTML = " ";
        for (let i = 0; i < this.array.length; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < this.array[0].length; j++) {
                let td = document.createElement("td");
                td.innerText = this.array[i][j];
                td.setAttribute("data-array-index", "" + i + j);
                row.appendChild(td);
            }
            this.table.appendChild(row);
        }
        this.contain.innerHTML = "";
        this.contain.appendChild(this.table);

        this.table.addEventListener("click", (event) => {
            let target = event.target;
            if (target.closest("td")) {
                let stringIndex = target.getAttribute("data-array-index");
                let arrayIndex = stringIndex.split("");
                let i = +arrayIndex[0];
                let j = +arrayIndex[1];
                let number = target.textContent;
                if (this.getAdjacentElement(i, j, number)) {
                    this.writeGame();
                    this.finishGame(this.line, this.column);
                } else return;
            }
        });
    }

    /**
     * Проверяем наличие пустого соседнего элемента и заменяем в нём значение
     */
    getAdjacentElement(horizontalIndex, verticalIndex, number) {
        for (let i = horizontalIndex - 1; i <= horizontalIndex + 1; ++i) {
            for (let j = verticalIndex - 1; j <= verticalIndex + 1; ++j) {
                if ((i < 0 || j < 0 || i > this.array.length - 1 || j > this.array[0].length - 1) ||
                    this.array[i][j]) continue;

                if ((i === horizontalIndex - 1 && j === verticalIndex) ||
                    (i === horizontalIndex + 1 && j === verticalIndex) ||
                    (j === verticalIndex - 1 && i === horizontalIndex) ||
                    (j === verticalIndex + 1 && i === horizontalIndex)) {
                    this.array[horizontalIndex][verticalIndex] = "";
                    this.array[i][j] = number;
                    return true;
                }
            }
        }
        return false;
    }
}