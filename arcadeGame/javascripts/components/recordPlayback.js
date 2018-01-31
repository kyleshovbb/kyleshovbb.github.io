"use strict";
class RecordPlayback {
    constructor(index) {
        this.playbackArray = JSON.parse(localStorage["players"])[index][3];
        this.playbackGameContainer = document.createElement("div");
        this.playbackGameContainer.setAttribute("id", "paybackGame");
        document.body.appendChild(this.playbackGameContainer);
        this.playingGame = true;
        this.initPlayback();
    }

    initPlayback() {
        this.createRange();
        this.createPlaybackGameArea();
        this.updatePlaybackGameArea();
    }

    createRange() {
        this.areaUpdateDelay = document.createElement("input");
        this.areaUpdateDelay.setAttribute("id", "areaUpdateDelay");
        this.areaUpdateDelay.setAttribute("type", "range");
        this.areaUpdateDelay.setAttribute("min", "1");
        this.areaUpdateDelay.setAttribute("max", "10");
        document.body.appendChild(this.areaUpdateDelay);
    }

    createPlaybackGameArea() {
        this.playback = new GameArea(this.playbackGameContainer, this.playbackArray);
    }

    updatePlaybackGameArea() {
        let timer = setInterval(() => {
            ++this.playback.gameStage;
            this.playback.getCurrentPersonageArray(this.playbackArray);
            this.playback.createCanvasArea();
            if (this.playbackArray.length - 1 === this.playback.gameStage) clearInterval(timer);
        }, 25)
    }
}