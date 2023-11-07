import { casters } from "../helpers/replicants"
import { Caster, Casters } from "schemas"
import { gsap } from "gsap"
import * as _ from "lodash"

const casterTl = gsap.timeline({repeat: -1});

export function initCasters(){
    const e = {
        card: document.getElementById("bottom-card-casters") as HTMLElement,    
        title: document.getElementById("casters-title") as HTMLElement,
        subtitle: document.getElementById("casters-subtitle") as HTMLElement,
    }

    NodeCG.waitForReplicants(casters).then(() => {
        casters.on("change", (newVal: Casters, oldVal: Casters) => {
            const num = getNumCasters(newVal);
            if (num === 0) {
                hideCasters(e.card);
            }

            if (oldVal === undefined) {
                setCaster(newVal, e);
                return;
            }

            const oldNum = getNumCasters(oldVal);
            if (oldNum === 0 && num > 0) {
                showCasters(e.card);
            }   

            if (!_.isEqual(newVal, oldVal)) {
                setCaster(newVal, e);
            }
        });
    });
}

function setCaster(casters: Casters, e) {
    casterTl.pause();
    casterTl.clear();

    const castersArray: Caster[] = _.toArray(casters);

    gsap.to([e.title, e.subtitle], {
        opacity: 0,
        duration: .5,
        ease: "power2.in",
        onComplete: function() {
            casterTl.repeat(castersArray.length === 1 ? 0 : -1);

            castersArray.forEach((caster) => {
                let casterSub: string = "";
                if (caster.twitter.length > 0 && caster.pronouns.length > 0) {
                    casterSub = `${caster.twitter} - ${caster.pronouns}`;  
                } else if (caster.twitter.length > 0) {
                    casterSub = `${caster.twitter}`;
                } else if (caster.pronouns.length > 0) {
                    casterSub = `${caster.pronouns}`;
                }

                casterTl.to([e.title, e.subtitle], {
                    onStart: function() {
                        e.title.text = caster.name;
                        e.subtitle.text = casterSub;
                    },
                    opacity: 1,
                    duration: .5,
                    ease: "power2.out"
                })
                if (castersArray.length > 1) {
                    casterTl.to([e.title, e.subtitle], {
                        opacity: 0,
                        duration: .5,
                        ease: "power2.in",
                    }, "+=7");
                }
            });
            casterTl.play();
        }
    })
}

function getNumCasters(casters: Casters): number {
    return _.toArray(casters).length;
}

function hideCasters(element: HTMLElement) {
    const tl = gsap.timeline();
    tl.to(element, {
        y: 80,
        duration: .5,
        ease: "power2.in",
    })
    .to(element, {
        width: 0,
        marginLeft: 0,
        marginRight: 0,
        duration: .75,
        ease: "power2.inOut",
    });
}

function showCasters(element: HTMLElement) {
    const tl = gsap.timeline();
    tl.to(element, {
        width: 450,
        marginLeft: 10,
        marginRight: 10,
        duration: .75,
        ease: "power2.inOut",   
    })
    .to(element, {
        y: 0,
        duration: .5,
        ease: "power2.out",
    });
}