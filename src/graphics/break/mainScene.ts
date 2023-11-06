import { mainFlavorText, tournamentData } from "../helpers/replicants";
import { gsap } from "gsap";
import { TextPlugin } from 'gsap/TextPlugin';
import { TournamentData } from "schemas";
gsap.registerPlugin(TextPlugin);

const flavorTextTL: gsap.core.Timeline = gsap.timeline();
const titleTL: gsap.core.Timeline = gsap.timeline();

export function initMainScene(){
    const e: Record<string, HTMLElement> = {
        flavorText: document.getElementById("break-flavor-text") as HTMLElement,
        flavorWrapper: document.getElementById("flavor-wrapper") as HTMLElement,
        title: document.getElementById("break-title") as HTMLElement,
        titleWrapper: document.getElementById("title-wrapper") as HTMLElement,
    }

    NodeCG.waitForReplicants(mainFlavorText, tournamentData).then(() => {
        tournamentData.on("change", (newVal: TournamentData, oldVal: TournamentData) => {
            if (oldVal === undefined) {
                changeTourneyName(newVal.meta.shortName, e.title, e.titleWrapper);
                return;
            }
            if (newVal.meta.shortName !== oldVal.meta.shortName) {
                changeTourneyName(newVal.meta.shortName, e.title, e.titleWrapper);
            }   
        });

        mainFlavorText.on("change", (newVal: string, oldVal: string) => {
            if (oldVal === undefined) {
                changeFlavorText(newVal, e.flavorText, e.flavorWrapper);
                return;
            }
            if (newVal !== oldVal) {
                changeFlavorText(newVal, e.flavorText, e.flavorWrapper);
            }
        }); 
    });
}

function changeTourneyName(text: string, textElement: HTMLElement, wrapper: HTMLElement) {
    text = text.replace("SendouQ", "SendouQ<br>");
    titleTL.set(wrapper, {
        width: wrapper.offsetWidth - 60,
    })
    .to(textElement, {
        opacity: 0,
        duration: .5,
        ease: "power2.in"
    })
    .set(textElement, {
        text: text,
    })
    .to(wrapper, {
        width: "auto",
        duration: 1,
        ease: "power2.inOut",
    })
    .to(textElement, {
        opacity: 1,
        duration: .5,
        ease: "power2.out",
    })
}

function changeFlavorText(text: string, textElement: HTMLElement, wrapper: HTMLElement) {
    flavorTextTL.set(wrapper, {
        width: wrapper.offsetWidth - 60,
    })
    .to(textElement, {
        opacity: 0,
        duration: .5,
        ease: "power2.in",
        onComplete: function() {
            (textElement as any).text = text;
        }
    })
    .to(wrapper, {
        width: "auto",
        duration: 1,
        ease: "power2.inOut",
    })
    .to(textElement, {
        opacity: 1,
        duration: .5,
        ease: "power2.out",
    })
}
