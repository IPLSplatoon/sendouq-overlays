import { nextRound, assetPaths } from "../helpers/replicants";
import { gsap } from "gsap";
import { TextPlugin } from 'gsap/TextPlugin';
import { NextRound } from "../../../../ipl-overlay-controls/src/types/schemas";
gsap.registerPlugin(TextPlugin);

const visibleTL = gsap.timeline();

export function initNextMatch(){
    const e = {
        wrapper: document.getElementById("next-match-wrapper") as HTMLElement,
        name: document.getElementById("next-match-name") as HTMLElement,
        teams: document.getElementById("next-match-teams") as HTMLElement
    }

    NodeCG.waitForReplicants(nextRound, assetPaths).then(() => {
        nextRound.on("change", (newVal: NextRound, oldVal: NextRound) => {
            console.log(JSON.parse(JSON.stringify(newVal)));
            changeFittedText(newVal.round.name, e.name);
            changeFittedText(`${newVal.teamA.name} VS ${newVal.teamB.name}`, e.teams);

            if (oldVal === undefined) return;
            
            if (newVal.showOnStream && !oldVal.showOnStream) {
                nextRoundVisible(true, e.wrapper);
            }
            else if (!newVal.showOnStream && oldVal.showOnStream) {
                nextRoundVisible(false, e.wrapper);
            }

        });
    });
}

function nextRoundVisible(vis: boolean, wrapper: HTMLElement) {
    if (vis) {
        visibleTL.to(wrapper, {
            width: "auto",
            duration: .75,
            ease: "power2.inOut",
        });
    }

    visibleTL.to(wrapper, {
        height: vis ? "auto" : 0,
        duration: .75,
        ease: "power2.inOut",
        marginBottom: vis ? 0 : -20
    });

    if (!vis) {
        visibleTL.to(wrapper, {
            width: 0,
            duration: .75,
            ease: "power2.inOut",
        });
    }
}

function changeFittedText(text: string, element: HTMLElement) {
    const tl = gsap.timeline();
    tl.to(element, {
        duration: 0.5,
        opacity: 0,
        ease: "power2.in",
        onComplete: () => {
            (element as any).text = text;
        }
    })
    .to(element, {
        duration: 0.5,
        opacity: 1,
        ease: "power2.out"
    });
}