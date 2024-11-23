import { gsap } from "gsap";
import { activeBreakScene, activeRound, bracketData } from '../helpers/replicants';
import { ActiveBreakScene, ActiveRound } from "schemas";

const topBarTL = gsap.timeline();

export function initTopBar(){
    const e = {
        topBar: document.querySelector("top-bar") as HTMLElement,
        dynamic: document.querySelector("top-bar").querySelectorAll(".dynamic") as NodeListOf<HTMLElement>,
        stage: document.getElementById("top-bar-stage") as HTMLElement, 
        game: document.getElementById("top-bar-game") as HTMLElement,
        bracketDynamic: document.querySelectorAll('top-bar .bracket-dynamic') as NodeListOf<HTMLElement>,
        bracketName: document.getElementById('top-bar-bracket-name') as HTMLElement,
        bracketStageName: document.getElementById('top-bar-bracket-stage-name') as HTMLElement,
        bracketStageNameDivider: document.getElementById('top-bar-bracket-stage-name-divider') as HTMLElement
    }

    bracketData.on('change', newValue => {
        if (newValue != null) {
            e.bracketName.innerText = newValue.name;
            const bracketStageName = newValue.matchGroups.length === 1 ? newValue.matchGroups[0].name : null;
            if (bracketStageName != null && newValue.name !== bracketStageName) {
                e.bracketStageName.innerText = bracketStageName;
                e.bracketStageNameDivider.style.display = 'block';
            } else {
                e.bracketStageName.innerText = '';
                e.bracketStageNameDivider.style.display = 'none';
            }
        }
    });

    NodeCG.waitForReplicants(activeBreakScene, activeRound).then(() => {
        activeBreakScene.on("change", (newVal: ActiveBreakScene, oldVal: ActiveBreakScene) => {
            if (oldVal === undefined) {
                switch(newVal) {
                    case "main":
                        textOut(e.dynamic);
                        textOut(e.bracketDynamic);
                        break;
                    case "bracket":
                        textOut(e.dynamic);
                        textIn(e.bracketDynamic);
                        break;
                    case "teams":
                    case "stages":
                    case "casters":
                        textIn(e.dynamic);
                        textOut(e.bracketDynamic);
                        break;
                }
                return;
            }

            if (newVal === oldVal) return;

            if (oldVal === "bracket") {
                textOut(e.bracketDynamic);
            }

            if ((oldVal === "main" || oldVal === "bracket") && (newVal === "teams" || newVal === "stages" || newVal === "casters")) {
                textIn(e.dynamic);
            }

            if ((oldVal === "teams" || oldVal === "stages" || oldVal === "casters") && (newVal === "main" || newVal === "bracket")) {
                textOut(e.dynamic);
            }

            if (newVal === "bracket") {
                textIn(e.bracketDynamic);
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
