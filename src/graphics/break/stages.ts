import { activeRound, assetPaths } from "../helpers/replicants";
import { ActiveRound } from "schemas";
import { gsap } from "gsap";
import * as _ from "lodash"

import SZ from "../assets/SZ.avif";
import TC from "../assets/TC.avif";
import RM from "../assets/RM.avif";
import CB from "../assets/CB.avif";
import counter from "../assets/Counter.avif"
import blank from "../assets/blank.png";

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
                setNextStageTeamsScene(e.nextStage, newVal.games);
                return;
            }

            if (!_.isEqual(newVal.games.find(game => game.winner === "none"), oldVal.games.find(game => game.winner === "none"))){
                setNextStageTeamsScene(e.nextStage, newVal.games);
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

                changeSingleStage(changedGameElement, lastChanged.stage, lastChanged.mode, newVal.teamA.name, newVal.teamB.name, winner);
                
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
                
                const stageName = stage.stage === "Unknown Stage" ? "Counterpick" : stage.stage;
        
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
    let modeIcon = blank;
    switch(mode) {
        case "Splat Zones":
            modeIcon = SZ;
            break;
        case "Tower Control":
            modeIcon = TC;
            break;
        case "Rainmaker":
            modeIcon = RM;
            break;
        case "Clam Blitz":
            modeIcon = CB;
            break;
        case "Unknown Mode":
            modeIcon = counter;
            break;
    }

    const fontsize = size >= 330 ? 30 : 26;
    let stagePath = assetPaths.value.stageImages[stage];
    if (stagePath === undefined) stagePath = blank;
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
            <img class="icon" src="${modeIcon}">
            <div class="name">${stage}</div>   
        </div>
        ${winnerHTML}
    ${getInnerHTML ? "" : "</div>"}
    `
}

function setNextStageTeamsScene(element: HTMLElement, games: ActiveRound["games"]){
    const tl = gsap.timeline();
    tl.to(element, {
        opacity: 0,
        duration: .75,
        width: element.offsetWidth - 40,
        ease: "power2.in",
        onComplete: function() {
            const nextGame = games.find(game => game.winner === "none");  

            let modeIcon = blank;
            switch(nextGame.mode) {
                case "Splat Zones":
                    modeIcon = SZ;
                    break;
                case "Tower Control":
                    modeIcon = TC;
                    break;
                case "Rainmaker":
                    modeIcon = RM;
                    break;
                case "Clam Blitz":
                    modeIcon = CB;
                    break;
            }
        
            let stageName = nextGame.stage;
            let modeHTML = `<img src=${modeIcon}>`;
            if (nextGame.stage === "Unknown Stage"){
                stageName = "Counterpick";
                modeHTML = "";
            }
        
            element.innerHTML = `
            <span class='next'>Next:</span>
            ${modeHTML}
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

function changeSingleStage(element: HTMLElement, stage: string, mode: string, teamAName: string, teamBName: string, winner: string | null) {   
    const tl = gsap.timeline();
    tl.to(element, {
        height: 200,
        duration: .5,  
        opacity: 0,
        ease: "power2.in",
        onComplete: function() {
            const size = parseInt(element.style.getPropertyValue("--width"));
            element.innerHTML = getStageHTML(stage, mode, size, winner, true);
            element.style.setProperty("--background", `url(${assetPaths.value.stageImages[stage]})`);
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