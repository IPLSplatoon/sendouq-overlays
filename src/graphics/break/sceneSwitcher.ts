import { activeBreakScene } from "../helpers/replicants";
import { ActiveBreakScene } from "../../../../ipl-overlay-controls/src/types/schemas";
import { gsap } from "gsap";

const sceneSwitcherTL = gsap.timeline();

export function initSceneSwitcher() {
    const e = {
        main: {
            wrapper: document.querySelector("main-scene") as HTMLElement,
            sceneSwitch: document.querySelector("main-scene").querySelectorAll(".scene-switch") as NodeListOf<HTMLElement>,
        },
        teams: {
            wrapper: document.querySelector("teams-scene") as HTMLElement,
            sceneSwitch: document.querySelector("teams-scene").querySelectorAll(".scene-switch") as NodeListOf<HTMLElement>,
        }   
    }

    NodeCG.waitForReplicants(activeBreakScene).then(() => {
        activeBreakScene.on("change", (newVal: ActiveBreakScene, oldVal: ActiveBreakScene) => {
            if (oldVal === undefined) {
                switch(newVal) {
                    case "main":
                        e.teams.wrapper.style.display = "none";
                        break;
                    case "teams":
                        e.main.wrapper.style.display = "none";
                        break;
                }
                return;
            }

            if (newVal == oldVal) return;

            if (oldVal === "main") {
                mainOut(e);
            } else if (oldVal === "teams") {    
                teamsOut(e);
            }

            if (newVal === "main") {
                mainIn(e);
            } else if (newVal === "teams") {
                teamsIn(e);
            }
        });
    });
}   

function mainOut(e) {
    sceneSwitcherTL.to(e.main.sceneSwitch, {
        opacity: 0,
        duration: .75,
        x: -150,
        stagger: .075,
        ease: "power2.in"
    })
    .set(e.main.wrapper, {
        display: "none",
    });
}

function mainIn(e) {
    sceneSwitcherTL.set(e.main.wrapper, {
        display: "flex",
    })
    .fromTo(e.main.sceneSwitch, {
        opacity: 0,
        x: 150
    }, {
        opacity: 1,
        duration: .75,
        x: 0,
        stagger: .075,
        ease: "power2.out"
    });
}

function teamsOut(e) {
    sceneSwitcherTL.to(e.teams.sceneSwitch, {
        opacity: 0,
        duration: .75,
        x: -150,
        stagger: .075,
        ease: "power2.in"
    })
    .set(e.teams.wrapper, {
        display: "none",
    });
}

function teamsIn(e) {
    sceneSwitcherTL.set(e.teams.wrapper, {
        display: "flex",
    })
    .fromTo(e.teams.sceneSwitch, {
        opacity: 0,
        x: 150
    }, {
        opacity: 1,
        duration: .75,
        x: 0,
        stagger: .075,
        ease: "power2.out"
    });
}
