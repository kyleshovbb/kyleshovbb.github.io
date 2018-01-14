document.addEventListener("DOMContentLoaded", ready);
let line = document.querySelector("#selectLine");
let column = document.querySelector("#selectColumn");
let controls = document.querySelector("#controls");

/**
 * Отрисовка игры и подпись на событие изменения полей для редактирования строк и столбцов в таблице
 */
function ready() {
    new Game(line.value, column.value);
    controls.addEventListener("change", changeControls);
}

/**
 * При изменении значений в полях, отрисовывать новую игру, при этом, не давать выходить за пределы
 * допустимых значений
 */
function changeControls(ev) {
    let target = event.target;
    if (target.closest("#selectColumn") || target.closest("#selectLine")) {
        if (line.value > 10){
            line.value = 10;
        } else if (line.value < 3){
            line.value = 3;
        }
        if (column.value > 10){
            column.value = 10;
        } else if (column.value < 3){
            column.value = 3;
        }
        new Game(line.value, column.value);
    }
}