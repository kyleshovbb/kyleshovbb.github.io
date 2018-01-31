class Records {
    constructor() {
        this.tableContain = document.querySelector("#tableContain");
        this.createTableTemplate();
        this.subscribeToClickRecordPlaybackButton();
    }

    createTableTemplate() {
        this.table = document.createElement("table");
        this.table.setAttribute("id", "records");
        this.table.innerHTML = `<tr><th>Ник игрока</th><th>Минут</th><th>Секунд</th></tr>`;
        if (localStorage["players"]) {
            this.playersArray = JSON.parse(localStorage["players"]);
            this.createTable();
        }
    }

    createTable() {
        for (let i = 0; i < this.playersArray.length; ++i) {
            let tr = document.createElement("tr");
            for (let j = 0; j < this.playersArray[i].length; ++j) {
                let td = document.createElement("td");
                if (j !== this.playersArray[i].length - 1) td.innerText = this.playersArray[i][j];
                else {
                    let button = document.createElement("input");
                    button.setAttribute("type", "button");
                    button.setAttribute("class", "playRecordedGame");
                    button.setAttribute("data-index", i);
                    button.setAttribute("value", "Воспроизвести записанную игру");
                    td.appendChild(button);
                }
                tr.appendChild(td);
            }
            this.table.appendChild(tr);
        }
        this.tableContain.innerHTML = "";
        this.tableContain.appendChild(this.table);
    }

    subscribeToClickRecordPlaybackButton() {
        let wrapperRecordPlaybackGame = this.recordPlaybackGame.bind(this);
        document.querySelector("#records").addEventListener("click", wrapperRecordPlaybackGame);
    }

    recordPlaybackGame(ev) {
        let target = ev.target;
        if (target.closest(".playRecordedGame")) {
            let arrayIndex = target.getAttribute("data-index");
            window.location.hash = `playbackUser=${arrayIndex}`;
        }
    }
}