import { gsap } from "gsap";
import { activeRound, tournamentData, scoreboardData } from "../helpers/replicants";
import { ActiveRound, TournamentData, ScoreboardData } from "schemas";

const scoreTl = gsap.timeline();

export function initScoreboard() {
    const e = {
        teamA: {
            wrapper: document.getElementById("player-wrapper-top") as HTMLElement,
            name: document.getElementById("player-name-top") as HTMLElement,
            score: document.getElementById("player-score-top") as HTMLElement
        },
        teamB: {
            wrapper: document.getElementById("player-wrapper-bottom") as HTMLElement,
            name: document.getElementById("player-name-bottom") as HTMLElement,
            score: document.getElementById("player-score-bottom") as HTMLElement
        },
        info: {
            top: document.getElementById("info-text-top") as HTMLElement,   
            bottom: document.getElementById("info-text-bottom") as HTMLElement,
        },
        scoreContainer: document.querySelector(".score-container") as HTMLElement,
        infoContainer: document.querySelector(".info-container") as HTMLElement
    }

    NodeCG.waitForReplicants(activeRound, tournamentData, scoreboardData).then(() => {
        activeRound.on("change", (newVal: ActiveRound, oldVal: ActiveRound) => {
            changeScore(e.teamA.score, newVal.teamA.score);
            changeScore(e.teamB.score, newVal.teamB.score);

            if (oldVal === undefined) {
                changeFittedText(e.teamA.name, newVal.teamA.name);    
                changeFittedText(e.teamB.name, newVal.teamB.name);
                changeColor(e.teamA.wrapper, newVal.teamA.color);
                changeColor(e.teamB.wrapper, newVal.teamB.color);
                changeFittedText(e.info.bottom, newVal.match.name); 
                return;
            }

            if (newVal.teamA.name !== oldVal.teamA.name) {
                changeFittedText(e.teamA.name, newVal.teamA.name);
            }   
            if (newVal.teamB.name !== oldVal.teamB.name) {
                changeFittedText(e.teamB.name, newVal.teamB.name);
            }

            if (newVal.teamA.color !== oldVal.teamA.color) {
                changeColor(e.teamA.wrapper, newVal.teamA.color);
            }
            if (newVal.teamB.color !== oldVal.teamB.color) {
                changeColor(e.teamB.wrapper, newVal.teamB.color);
            }

            if (newVal.match.name !== oldVal.match.name) {
                changeFittedText(e.info.bottom, newVal.match.name);
            }
        });

        tournamentData.on("change", (newVal: TournamentData, oldVal: TournamentData) => {
            if (oldVal === undefined) {
                changeFittedText(e.info.top, newVal.meta.shortName);
                return;
            }

            if (newVal.meta.shortName !== oldVal.meta.shortName) {
                changeFittedText(e.info.top, newVal.meta.shortName);
            }
        });

        scoreboardData.on("change", (newVal: ScoreboardData, oldVal: ScoreboardData) => {
            if (oldVal === undefined) {
                if (newVal.isVisible) {
                    showScoreboard(e);
                } else {
                    hideScoreboard(e);
                }
                return;
            }

            if (newVal.isVisible !== oldVal.isVisible) {
                if (newVal.isVisible) {
                    showScoreboard(e);
                } else {
                    hideScoreboard(e);
                }
            }
        });
    });
}

function changeFittedText(e: HTMLElement, text: string) {
    const tl = gsap.timeline();
    tl.to(e, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            (e as any).text = text;
        }
    })
    .to(e, {
        opacity: 1,
        duration: 0.5,
    });
}

function changeColor(e: HTMLElement, color: string) {
    gsap.to(e, {
        "--color": color,
        duration: 0.5,
        ease: "power2.inOut"
    });
}

function changeScore(e: HTMLElement, score: number) {
    e.innerText = score.toString();
}

function showScoreboard(e) {
    scoreTl.fromTo([e.scoreContainer, e.infoContainer], {
        width: 75,
        opacity: 0,
    }, {
        width: "auto",
        opacity: 1,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out"
    })
    .fromTo([".dynamic", ".logo"], {
        x: -100,
        opacity: 0,
    }, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
    }, "<+=.25")
}

function hideScoreboard(e) {
    scoreTl.to([".dynamic", ".logo"], {
        x: -100,
        opacity: 0,
        duration: 0.5,
        stagger: {
            each: 0.1,
            from: "end"
        },
        ease: "power2.in"
    })
    scoreTl.to([e.scoreContainer, e.infoContainer], {
        width: 75,
        opacity: 0,
        duration: 0.5,
        stagger: {
            each: 0.15,
            from: "end"
        },
        ease: "power2.in"
    }, "<+=.25")

}