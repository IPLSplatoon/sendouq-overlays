import { casters } from "../helpers/replicants";
import { Casters, Caster } from "schemas";
import { gsap } from "gsap";
import * as _ from "lodash";

const castersTl = gsap.timeline();

export function initCasters() {
    const casterBox = document.getElementById("caster-box") as HTMLElement;

    NodeCG.waitForReplicants(casters).then(() => {
        casters.on("change", (newVal: Casters, oldVal: Casters) => {
            if (oldVal === undefined) {
                updateCastersHTML(newVal, casterBox);
                return;
            }
            if (!_.isEqual(newVal, oldVal)) {
                updateCastersHTML(newVal, casterBox);
            }
        });
    });

    nodecg.listenFor("mainShowCasters", "ipl-overlay-controls", () => {
        showCastersBox(casterBox);
    });
}

function updateCastersHTML(casters: Casters, element: HTMLElement) {
    const castersArr: Caster[] = _.toArray(casters);
    element.innerHTML = "<div>Casters</div>";
    castersArr.forEach(caster => {
        let casterSub: string = "";
        if (caster.twitter.length > 0 && caster.pronouns.length > 0) {
            casterSub = `${caster.twitter} - <span class='pink'>${caster.pronouns}</span>`;  
        } else if (caster.twitter.length > 0) {
            casterSub = `${caster.twitter}`;
        } else if (caster.pronouns.length > 0) {
            casterSub = `<span class='pink'>${caster.pronouns}</span>`;
        }

        element.innerHTML += `<div class="caster-wrapper container">
            <fitted-text class="name" max-width="290" text="${caster.name}"></fitted-text>
            <fitted-text class="info" max-width="290" use-inner-html text="${casterSub}"></fitted-text>
        </div>`;
    });
}

function showCastersBox(element: HTMLElement) {
    castersTl.fromTo(element, {
        opacity: 0,
        height: 50
    }, {
        opacity: 1,
        height: "auto",
        duration: 0.5,
        ease: "power2.out"
    })
    .to(".watermark", {
        y: -32,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
    }, "<")
    .fromTo(element.children, {
        opacity: 0,
        y: 100
    }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
    }, "<+=0.25")
    .to(element.children, {
        opacity: 0,
        y: 100,
        duration: 0.5,
        stagger: {
            each: 0.1,
            from: "end"
        },
        ease: "power2.in"
    }, "+=8")
    .to(".watermark", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.in"
    }, "<")
    .to(element, {
        opacity: 0,
        height: 50,
        duration: 0.5,
        ease: "power2.in"
    }, "-=0.2")
}