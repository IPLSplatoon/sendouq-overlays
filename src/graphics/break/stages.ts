import { activeRound, assetPaths } from "../helpers/replicants";
import { ActiveRound } from "schemas";
import { gsap } from "gsap";
import * as _ from "lodash"

import blank from "../assets/blank.png";
import counterStage from "../assets/counter-stage.png";
import { getModeIcon } from "../helpers/modeIcon";

export function initStages(){
    const e = {
        stagesWrapper: document.getElementById("stages-wrapper") as HTMLElement,
        nextStage: document.getElementById("next-stage") as HTMLElement,
    }

    NodeCG.waitForReplicants(activeRound, assetPaths).then(() => {
        activeRound.on("change", (newVal: ActiveRound, oldVal: ActiveRound) => {
            // console.log(JSON.parse(JSON.stringify(newVal)));

            if (oldVal === undefined) {
                setStages(e.stagesWrapper, newVal.games, newVal.teamA.name, newVal.teamB.name);
                setNextStageTeamsScene(e.nextStage, newVal.games, newVal.match);
                return;
            }

            let numChanged = 0;
            let lastChanged;
            newVal.games.forEach((game, i) => {
                if (!_.isEqual(game, oldVal.games[i])) {
                    numChanged++;
                    lastChanged = game;
                }
            });

            if (numChanged == 1) {
                const changedGameElement = e.stagesWrapper.children[newVal.games.indexOf(lastChanged)] as HTMLElement;
                const size = getStageSize(newVal.games.length);
                let winner = null;
                if (lastChanged.winner !== "none") {
                    winner = lastChanged.winner === "alpha" ? newVal.teamA.name : newVal.teamB.name;
                }

                changeSingleStage(changedGameElement, lastChanged.stage, lastChanged.mode, winner);
                setNextStageTeamsScene(e.nextStage, newVal.games, newVal.match);
                
                return;
            }
            

            setStages(e.stagesWrapper, newVal.games, newVal.teamA.name, newVal.teamB.name);
        });
    });
}

function setStages (element: HTMLElement, stages: ActiveRound["games"], teamAName: string, teamBName: string) {
    const tl = gsap.timeline();

    tl.to(element, {
        opacity: 0,
        duration: .75,
        ease: "power2.in",
        onComplete: function() {
            element.innerHTML = ""; 
            let size = getStageSize(stages.length);
        
            stages.forEach(stage => {
                let winner = null;
                if (stage.winner !== "none") {
                    winner = stage.winner === "alpha" ? teamAName : teamBName;
                }
                
                const stageName = stage.stage === "Unknown Stage" ? "" : stage.stage;
        
                element.innerHTML += getStageHTML(stageName, stage.mode, size, winner);
            });
        }
    })
    .to(element, {
        opacity: 1,
        duration: .75,
        ease: "power2.out"
    }, "+=.5"); 
}

function getStageHTML(stage: string, mode: string, size: number, winner: string | null, getInnerHTML: boolean = false): string {
    const fontsize = size >= 330 ? 30 : 26;
    let stagePath = assetPaths.value.stageImages[stage]
    if (stagePath === undefined) stagePath = counterStage;
    let winnerHTML = "";
    let background = `url(${stagePath})`
    let finishedClass = "";

    if (winner !== null) {
        winnerHTML = `<div class="winner">${winner}</div>`;
        background = `url(${stagePath})`;
        finishedClass = "finished";
    }

    return `
    ${getInnerHTML ? "" : `<div class="stage scene-switch ${finishedClass}" style="--width: ${size}px; --background: ${background}">`}
        <div class="info-wrapper" style="font-size: ${fontsize}px">
            <div class="name">${stage}</div>   
        </div>
        ${winnerHTML}
    ${getInnerHTML ? "" : "</div>"}
    `
}

function setNextStageTeamsScene(element: HTMLElement, games: ActiveRound["games"], match: ActiveRound["match"]){
    const tl = gsap.timeline();
    tl.to(element, {
        opacity: 0,
        duration: .75,
        width: element.offsetWidth - 40,
        ease: "power2.in",
        onComplete: function() {
            const nextGame = games.find(game => game.winner === "none");

            let teamAScore = 0;
            let teamBScore = 0;
            games.forEach(game => {
                if (game.winner === "alpha") teamAScore++;
                if (game.winner === "bravo") teamBScore++;
            });
            let targetScore = Math.ceil(games.length / 2);

            if (match.type === "PLAY_ALL") {
                if (nextGame === undefined) {
                    element.innerHTML = "<div>Match Complete</div>";
                    return;
                }
            } else {
                if (teamAScore === targetScore || teamBScore === targetScore) {
                    element.innerHTML = "<div>Match Complete</div>";
                    return;
                }
                if (nextGame === undefined) {
                    element.innerHTML = "<div>Match Complete</div>";
                    return;
                }
            }

            let modeIcon = getModeIcon(nextGame.mode);
            if (nextGame.stage === "Unknown Stage"){
                modeIcon = blank;
            }
        
            let stageName = nextGame.stage;
        
            element.innerHTML = `
            <span class='next'>Next:</span>
            <div>${stageName}</div>
            `
        }
    })
    .to(element, {
        width: "auto",
        duration: .75,
        opacity: 1,
        ease: "power2.inOut"
    }, "+=.1")
}

function changeSingleStage(element: HTMLElement, stage: string, mode: string, winner: string | null) {   
    const tl = gsap.timeline();
    tl.to(element, {
        height: 300,
        duration: .5,  
        opacity: 0,
        ease: "power2.in",
        onComplete: function() {
            const size = parseInt(element.style.getPropertyValue("--width"));
            const stageName = stage === "Unknown Stage" ? "" : stage;
            element.innerHTML = getStageHTML(stageName, mode, size, winner, true);
            
            if (stage !== "Unknown Stage") {
                element.style.setProperty("--background", `url(${assetPaths.value.stageImages[stage]})`);
            } else {
                element.style.setProperty("--background", `url(${counterStage})`);
            }
            
            if (winner !== null) {
                element.classList.add("finished");
            } else {
                element.classList.remove("finished");
            }
        }
    })
    .to(element, {
        height: 580,
        opacity: 1,
        duration: .5,
        ease: "power2.out"
    }, "+=.25")
}

function getStageSize(numStages: number): number {
    if (numStages <= 3) {
        return 400;
    } else if (numStages <= 5) {
        return 330;
    } else {
        return 250;
    }
}