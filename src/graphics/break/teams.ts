import { activeRound } from "../helpers/replicants";
import { ActiveRound, Player } from "schemas";
import { gsap } from "gsap";
import { limitString } from "../helpers/string";

export function initTeams() {
    const e = {
        a: {
            card: document.getElementById("team-card-left") as HTMLElement,
            name: document.getElementById("team-left-name") as HTMLElement,
            stageName: document.getElementById("stage-team-left-name") as HTMLElement,
            playersWrapper: document.getElementById("team-left-players") as HTMLElement,
            image: document.getElementById("team-left-icon") as HTMLImageElement
        },
        b: {
            card: document.getElementById("team-card-right") as HTMLElement,
            name: document.getElementById("team-right-name") as HTMLElement,
            stageName: document.getElementById("stage-team-right-name") as HTMLElement,
            playersWrapper: document.getElementById("team-right-players") as HTMLElement,
            image: document.getElementById("team-right-icon") as HTMLImageElement
        }
    }

    NodeCG.waitForReplicants(activeRound).then(() => {
        activeRound.on("change", (newVal: ActiveRound, oldVal: ActiveRound) => {
            console.log(JSON.parse(JSON.stringify(newVal.teamA)));
            if (oldVal === undefined) {
                setTeams(e, newVal.teamA, newVal.teamB);
                return;
            }   
            if (newVal.teamA.name !== oldVal.teamA.name || newVal.teamB.name !== oldVal.teamB.name){
                setTeams(e, newVal.teamA, newVal.teamB);
            }
        });
    });
}

function setTeams(e, teamA: ActiveRound["teamA"], teamB: ActiveRound["teamB"]) {
    const tl = gsap.timeline();

    tl.to([e.a.card, e.b.card], {
        duration: 0.75,
        opacity: 0,
        height: 200,
        marginBottom: 200,
        marginTop: 200,
        ease: "power2.in",
        onComplete: function() {
            e.a.name.text = limitString(teamA.name);
            e.b.name.text = limitString(teamB.name);
            e.a.stageName.text = limitString(teamA.name, 22);
            e.b.stageName.text = limitString(teamB.name, 22);

            e.a.playersWrapper.innerHTML = getPlayersHTML(teamA.players);
            e.b.playersWrapper.innerHTML = getPlayersHTML(teamB.players);

            if (teamA.hasOwnProperty("logoUrl")) {
                e.a.image.src = teamA.logoUrl;
                e.a.image.style.opacity = "1";
            } else {
                e.a.image.style.opacity = "0";
            }

            if (teamB.hasOwnProperty("logoUrl")) {
                e.b.image.src = teamB.logoUrl;
                e.b.image.style.opacity = "1";
            } else {
                e.b.image.style.opacity = "0";
            }
        }
    })
    .to([e.a.card, e.b.card], {
        duration: 0.75,
        height: 600,
        marginBottom: 0,
        marginTop: 0,  
        opacity: 1,
        ease: "power2.out"
    }, "+=0.25")
}

function getPlayersHTML(players: Player[]) {
    return players.map(player => {
        return `<fitted-text max-width="476" text="${player.name}"></fitted-text>`
    }).join("");
}