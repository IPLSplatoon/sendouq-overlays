import { activeBreakScene } from "../helpers/replicants";
import { ActiveBreakScene } from "schemas";
import { gsap } from "gsap";
import { bracketRenderer } from './bracket';

const sceneSwitcherTL = gsap.timeline();
const loadingTL = gsap.timeline();

export function initSceneSwitcher() {
    NodeCG.waitForReplicants(activeBreakScene).then(() => {
        activeBreakScene.on("change", (newVal: ActiveBreakScene, oldVal: ActiveBreakScene) => {
            const e = {
                main: {
                    wrapper: document.querySelector("main-scene") as HTMLElement,
                    sceneSwitch: document.querySelector("main-scene").querySelectorAll(".scene-switch") as NodeListOf<HTMLElement>,
                },
                teams: {
                    wrapper: document.querySelector("teams-scene") as HTMLElement,
                    sceneSwitch: document.querySelector("teams-scene").querySelectorAll(".scene-switch") as NodeListOf<HTMLElement>,
                },
                stages: {
                    wrapper: document.querySelector("stage-scene") as HTMLElement,
                    sceneSwitch: document.querySelector("stage-scene").querySelectorAll(".scene-switch") as NodeListOf<HTMLElement>,
                },
                bracket: {
                    wrapper: document.querySelector('.bracket-renderer') as HTMLElement
                },
                casters: {
                    wrapper: document.querySelector('caster-scene') as HTMLElement
                }
            }

            if (oldVal === undefined) {
                if (newVal !== 'main') {
                    e.main.wrapper.style.display = 'none';
                }
                if (newVal !== 'teams') {
                    e.teams.wrapper.style.display = 'none';
                }
                if (newVal !== 'stages') {
                    e.stages.wrapper.style.display = 'none';
                }
                if (newVal !== 'bracket') {
                    e.bracket.wrapper.style.opacity = '0';
                }
                if (newVal !== 'casters') {
                    e.casters.wrapper.style.display = 'none';
                }
            }

            if (newVal === oldVal) return;

            if (oldVal === "main") {
                mainOut(e);
            } else if (oldVal === "teams") {
                teamsOut(e, newVal === "main" ? "left" : "right");
            } else if (oldVal === "stages") {
                stagesOut(e, (newVal === 'casters' || newVal === 'bracket') ? 'left' : 'right');
            } else if (oldVal === 'bracket') {
                bracketOut(e, newVal === 'casters' ? 'left' : 'right');
            } else if (oldVal === 'casters') {
                castersOut(e);
            }

            if (newVal === "main") {
                mainIn(e);
            } else if (newVal === "teams") {
                teamsIn(e, oldVal === "main" ? "right" : "left");
            } else if (newVal === "stages") {
                stagesIn(e, (oldVal === 'casters' || oldVal === 'bracket') ? 'left' : 'right');
            } else if (newVal === 'bracket') {
                bracketIn(e, oldVal === 'casters' ? 'left' : 'right');
            } else if (newVal === 'casters') {
                castersIn(e);
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
        onStart: animateLoadingBarPT1,
        ease: "power2.in",
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
        x: -150
    }, {
        opacity: 1,
        duration: 1,
        x: 0,
        stagger: .075,
        onStart: animateLoadingBarPT2,
        ease: "power2.out"
    });
}

function teamsOut(e, dir: "left" | "right") {
    const x = dir === "left" ? 150 : -150;
    const stagger = dir === "left" ? "end" : "start";

    sceneSwitcherTL.to(e.teams.sceneSwitch, {
        opacity: 0,
        duration: .75,
        x: x,
        stagger: {
            each: .075,
            from: stagger
        },
        onStart: animateLoadingBarPT1,
        ease: "power2.in"
    })
    .set(e.teams.wrapper, {
        display: "none",
    });
}

function teamsIn(e, dir: "left" | "right") {
    const x = dir === "left" ? -150 : 150;
    const stagger = dir === "left" ? "end" : "start";

    sceneSwitcherTL.set(e.teams.wrapper, {
        display: "flex",
    })
    .set(e.teams.sceneSwitch, {
        opacity: 0
    })
    .fromTo(e.teams.sceneSwitch, {
        opacity: 0,
        x: x
    }, {
        opacity: 1,
        duration: 1,
        x: 0,
        stagger: {
            each: .075,
            from: stagger
        },
        onStart: animateLoadingBarPT2,
        ease: "power2.out"
    });
}

function stagesOut(e, dir: "left" | "right") {
    sceneSwitcherTL.to(e.stages.sceneSwitch, {
        opacity: 0,
        duration: .75,
        x: dir === 'left' ? -150 : 150,
        stagger: {
            each: .075,
            from: dir === "right" ? "end" : "start"
        },
        onStart: animateLoadingBarPT1,
        ease: "power2.in"
    })
    .set(e.stages.wrapper, {
        display: "none",
    });
}

function stagesIn(e, dir: "left" | "right") {
    sceneSwitcherTL.set(e.stages.wrapper, {
        display: "flex",
    })
    .fromTo(e.stages.sceneSwitch, {
        opacity: 0,
        x: dir === 'left' ? -150 : 150
    }, {
        opacity: 1,
        duration: 1,
        x: 0,
        stagger: {
            each: .075,
            from: dir === "left" ? "end" : "start"
        },
        onStart: animateLoadingBarPT2,
        ease: "power2.out"
    });
}

function bracketOut(e, dir: "left" | "right") {
    sceneSwitcherTL.to(e.bracket.wrapper, {
        opacity: 0,
        duration: .75,
        x: dir === 'left' ? -150 : 150,
        onStart: animateLoadingBarPT1,
        ease: "power2.in"
    });
}

function bracketIn(e, dir: "left" | "right") {
    sceneSwitcherTL.add(() => {
        gsap.set(e.bracket.wrapper, { opacity: 1, x: 0 });
        bracketRenderer.beforeReveal();
        void bracketRenderer.reveal();
        animateLoadingBarPT2();
    });
}

function castersOut(e) {
    sceneSwitcherTL.to(e.casters.wrapper.querySelectorAll('.caster-wrapper'), {
        opacity: 0,
        duration: .75,
        x: 150,
        stagger: {
            each: .075,
            from: "end"

        },
        onStart: animateLoadingBarPT1,
        ease: "power2.in"
    })
    .set(e.casters.wrapper, {
        display: 'none'
    });
}

function castersIn(e) {
    sceneSwitcherTL.set(e.casters.wrapper, {
        display: 'flex'
    })
    .fromTo(e.casters.wrapper.querySelectorAll('.caster-wrapper'), {
        x: 150,
        opacity: 0
    }, {
        opacity: 1,
        duration: 1,
        x: 0,
        stagger: .075,
        onStart: animateLoadingBarPT2,
        ease: "power2.out"
    });
}

function animateLoadingBarPT1(){
    loadingTL.clear();
    loadingTL.fromTo("#loading-bar", {
        opacity: 1,
        width: 0,
    }, {
        width: 1920*.2,
        duration: .6,
        ease: "power3.inOut",
    })
    .to("#loading-bar", {
        width: 1920,
        duration: 5,
        ease: "linear"
    });
}

function animateLoadingBarPT2() {
    loadingTL.clear();
    loadingTL.to("#loading-bar", {
        width: 1920,
        duration: .6,
        ease: "power3.out",
    })
    .to("#loading-bar", {
        opacity: 0,
        duration: .25,
    }, "+=.25");
}
