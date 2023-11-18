import { gsap } from "gsap";
import { activeBreakScene, activeRound } from "../helpers/replicants";
import { ActiveBreakScene, ActiveRound } from "schemas";

const topBarTL = gsap.timeline();

export function initTopBar(){
    const e = {
        topBar: document.querySelector("top-bar") as HTMLElement,
        dynamic: document.querySelector("top-bar").querySelectorAll(".dynamic") as NodeListOf<HTMLElement>,
        stage: document.getElementById("top-bar-stage") as HTMLElement, 
        game: document.getElementById("top-bar-game") as HTMLElement,   
    }
    
    NodeCG.waitForReplicants(activeBreakScene, activeRound).then(() => {
        activeBreakScene.on("change", (newVal: ActiveBreakScene, oldVal: ActiveBreakScene) => {
            if (oldVal === undefined) {
                switch(newVal) {
                    case "main":
                        textOut(e.dynamic);
                        break;
                    case "teams":
                    case "stages":
                        textIn(e.dynamic);
                        break;
                }
                return;
            }

            if (newVal === oldVal) return;

            if (oldVal === "main" && (newVal === "teams" || newVal === "stages")) {
                textIn(e.dynamic);
            }

            if ((oldVal === "teams" || oldVal === "stages") && newVal === "main") {
                textOut(e.dynamic);
            }
        });

        activeRound.on("change", (newVal: ActiveRound) => {
            e.stage.innerText = newVal.match.name
            
            let gameNum = 1;
            newVal.games.forEach(game => {
                if (game.winner !== "none") gameNum++;
            });

            if (newVal.match.type === "PLAY_ALL"){
                let gameText = gameNum > newVal.games.length ? "Match Complete" : `Game ${gameNum}`;
                e.game.innerText = gameText;
            } else {
                let targetWins = Math.ceil(newVal.games.length / 2);
                let teamAWins = 0;
                let teamBWins = 0;
                newVal.games.forEach(game => {
                    if (game.winner === "alpha") teamAWins++;
                    if (game.winner === "bravo") teamBWins++;
                });
                if (teamAWins >= targetWins || teamBWins >= targetWins) {
                    e.game.innerText = "Match Complete";
                } else {
                    e.game.innerText = `Game ${gameNum}`;
                }
            }
        });
    });
}

function textIn(elements: NodeListOf<HTMLElement>) {
    topBarTL.to(elements, {
        duration: .65,
        x: 0,
        opacity: 1,
        stagger: {
            each: .115,
            from: "start"
        },
        ease: "power2.out"
    }, "+=1");
}

function textOut(elements: NodeListOf<HTMLElement>) {
    topBarTL.to(elements, {
        duration: .65,
        x: 150,
        opacity: 0,
        stagger: {
            each: .115,
            from: "end"
        },
        ease: "power2.in"
    });
}