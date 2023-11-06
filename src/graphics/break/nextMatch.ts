import { nextRound, assetPaths } from "../helpers/replicants";
import { gsap } from "gsap";
import { TextPlugin } from 'gsap/TextPlugin';
import { NextRound } from "schemas";
import * as _ from 'lodash';
gsap.registerPlugin(TextPlugin);

import sz from '../assets/SZ.avif';
import tc from '../assets/TC.avif';
import rm from '../assets/RM.avif';
import cb from '../assets/CB.avif';
import counter from '../assets/Counter.avif';
import blank from '../assets/blank.png';

const visibleTL = gsap.timeline();

export function initNextMatch(){
    const e = {
        wrapper: document.getElementById("next-match-wrapper") as HTMLElement,
        name: document.getElementById("next-match-name") as HTMLElement,
        teams: document.getElementById("next-match-teams") as HTMLElement,
        stageWrapper: document.getElementById("next-match-stages") as HTMLElement
    }

    NodeCG.waitForReplicants(nextRound, assetPaths).then(() => {
        nextRound.on("change", (newVal: NextRound, oldVal: NextRound) => {
            if (oldVal === undefined) {
                changeNextMatch(newVal, e, newVal.showOnStream);
                nextRoundVisible(newVal.showOnStream, e.wrapper);
                return;
            }

            if (newVal.showOnStream && !oldVal.showOnStream) {
                nextRoundVisible(true, e.wrapper);
                return;
            }
            else if (!newVal.showOnStream && oldVal.showOnStream) {
                nextRoundVisible(false, e.wrapper);
                return;
            }

            if (!_.isEqual(newVal, oldVal)) {
                changeNextMatch(newVal, e, newVal.showOnStream);
            }
        });
    });
}

function nextRoundVisible(vis: boolean, wrapper: HTMLElement) {
    visibleTL.to(wrapper, {
        height: vis ? "auto" : 0,
        duration: .75,
        ease: "power2.inOut",
        marginBottom: vis ? 0 : -20,
        width: vis ? "auto" : 560,
        opacity: vis ? 1 : 0,
    });
}

function changeNextMatch(round: NextRound, e, changeWidth: boolean) {
    const tl = gsap.timeline();
    tl.to(e.wrapper, {
        opacity: 0,
        duration: .75,
        ease: "power2.in",
        onComplete: function() {
            e.name.text = round.round.name;
            e.teams.text = `${round.teamA.name} VS ${round.teamB.name}`;
            setNextStages(round.games, e.stageWrapper);
        }
    })
    
    if (changeWidth) {
        tl.to(e.wrapper, {
            width: e.wrapper.offsetWidth,
            duration: .75,
            ease: "power2.in"
        }, "<")
        
        .to(e.wrapper, {
            width: "auto",
            duration: .75,
            ease: "power2.inOut"
        })
    }

    tl.to(e.wrapper, {
        opacity: 1,
        duration: .75,
        ease: "power2.out"
    }, changeWidth ? "<+=.1" : "");
}

function setNextStages(stages: NextRound["games"], wrapper: HTMLElement) {
    wrapper.innerHTML = "";
    stages.forEach((stage) => {
        wrapper.innerHTML += getStageElem(stage.stage, stage.mode);
    });
}

function getStageElem(stage: string, mode: string): string {
    let modeAsset: string;
    switch (mode) {  
        case "Splat Zones":
            modeAsset = sz;
            break;
        case "Tower Control":
            modeAsset = tc;
            break;
        case "Rainmaker":
            modeAsset = rm;
            break;
        case "Clam Blitz":
            modeAsset = cb;
            break;
        default:
            modeAsset = counter;
            break;
    }

    let stageImage = assetPaths.value.stageImages[stage];
    if (!stageImage) stageImage = blank;

    return `
    <div class="stage" style="
        background-image: linear-gradient(0deg, rgba(34, 28, 74, 0.70) 0%, rgba(34, 28, 74, 0.70) 100%), url(${stageImage});
    ">
        <img class="mode" src="${modeAsset}">
    </div> 
    `
}