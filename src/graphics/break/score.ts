import { activeRound } from "../helpers/replicants";
import { ActiveRound } from "schemas";
import { gsap } from "gsap";
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);

export function initScore() {
    NodeCG.waitForReplicants(activeRound).then(() => {
        activeRound.on("change", (newVal: ActiveRound) => {
            const e = {
                left: [
                    document.getElementById("teams-score-left") as HTMLElement,
                    document.getElementById("stage-team-left-score")
                ],
                right: [
                    document.getElementById("teams-score-right") as HTMLElement,
                    document.getElementById("stage-team-right-score")
                ],
            }

            gsap.set(e.left, {text: newVal.teamA.score.toString()});
            gsap.set(e.right, {text: newVal.teamB.score.toString()});
        });
    });
}