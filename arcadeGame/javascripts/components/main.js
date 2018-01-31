'use strict';

window.onload = () => {

    let router = new Router({
        routes: [{
            name: 'index',
            match: '',
            onBeforeEnter: () => {
            },
            onEnter: () => {
            },
            onLeave: () => {
            }
        }, {
            name: 'Game',
            match: /Game/,
            onEnter: () => {
                let containGame = document.querySelector("#contain");
                containGame.style.display = "block";
                let game = document.querySelector("#game");
                if (!game) {
                    let contain = document.querySelector("#contain");
                    new GameArea(contain);
                }
            },
            onLeave: () => {
                let containGame = document.querySelector("#contain");
                containGame.style.display = "none";
            }
        }, {
            name: 'Records',
            match: /Records/,
            onEnter: () => {
                new Records();
            },
            onLeave: () => {
                document.querySelector("#tableContain").innerHTML = "";
            }
        }, {
            name: 'playbackUser',
            match: /playbackUser=(.+)/,
            onEnter: (index) => {
                new RecordPlayback(index);
            },
            onLeave: () => {
                let containGame = document.querySelector("#paybackGame");
                containGame.style.display = "none";
            }
        }, {
            name: 'About',
            match: /About/,
            onEnter: () => {
                let aboutDiv = document.querySelector("#aboutDiv");
                if (!aboutDiv) {
                    addAbout();
                } else {
                    aboutDiv.style.display = "block";
                }
            },
            onLeave: () => {
                let aboutDiv = document.querySelector("#aboutDiv");
                aboutDiv.style.display = "none";
            }
        }
        ]
    });
};