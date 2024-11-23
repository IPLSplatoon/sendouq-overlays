import { activeBreakScene, casters } from '../helpers/replicants'
import { Caster, Casters } from "schemas"
import { gsap } from "gsap"
import * as _ from "lodash"
import { isBlank } from '../helpers/string';
import casterPlaceholder from '../assets/caster-placeholder.png';

const casterTl = gsap.timeline({repeat: -1});

export function initCasters(){
    const e = {
        card: document.getElementById("bottom-card-casters") as HTMLElement,    
        title: document.getElementById("casters-title") as HTMLElement,
        subtitle: document.getElementById("casters-subtitle") as HTMLElement,
        layout: document.getElementById('caster-layout') as HTMLElement,
    }

    NodeCG.waitForReplicants(casters, activeBreakScene).then(() => {
        casters.on("change", (newVal: Casters, oldVal: Casters) => {
            setBottomBarCasters(newVal, oldVal);
            setCastersScene(newVal, oldVal);
        });
    });

    function setCastersScene(newCasters: Casters, oldCasters: Casters | undefined) {
        const values = Object.values(newCasters);
        const newCasterIds = Object.keys(newCasters);
        const oldCasterIds = oldCasters == null ? null : Object.keys(oldCasters);
        const shouldRecreateCasterElements
            = oldCasterIds == null
            || newCasterIds.length !== oldCasterIds.length
            || newCasterIds.some((elem, i) => oldCasterIds[i] !== elem);

        if (shouldRecreateCasterElements) {
            const casterWidth = getCasterWidth(values.length);
            e.layout.innerHTML = values.reduce((result, elem, i) => {
                result += `
                <div
                   class="caster-wrapper"
                   style="--caster-width: ${casterWidth}px"
                   data-caster-id="${newCasterIds[i]}"
               >
                   <div class="caster-visual-wrapper">
                       ${getCasterVisual(elem)}
                   </div>
                   <div class="caster-nametag">
                       <fitted-text max-width="${casterWidth - 50}" text="${elem.name}" class="caster-name" align="right"></fitted-text>
                       <fitted-text 
                            max-width="${casterWidth - 50}" 
                            text="${elem.twitter} - <span class=&quot;caster-pronouns&quot;>${elem.pronouns}</span>" 
                            class="caster-twitter" 
                            align="right"
                            use-inner-html
                        ></fitted-text>
                   </div>
               </div>
            `;

                return result;
            }, '');
        } else {
            newCasterIds.forEach((casterId) => {
                const casterElem = document.querySelector(`[data-caster-id="${casterId}"]`);
                const caster = newCasters[casterId];
                const oldCaster = oldCasters[casterId];
                (casterElem.querySelector('.caster-name') as FittedText).text = caster.name;
                (casterElem.querySelector('.caster-twitter') as FittedText).text = `${caster.twitter} - <span class="caster-pronouns">${caster.pronouns}</span>`;

                if (
                    caster.videoUrl !== oldCaster.videoUrl
                    || (isBlank(caster.videoUrl) && caster.imageUrl !== oldCaster.imageUrl)
                ) {
                    casterElem.querySelector('.caster-visual-wrapper').innerHTML = getCasterVisual(caster);
                }
            });
        }
    }

    function setBottomBarCasters(newCasters: Casters, oldCasters: Casters | undefined) {
        const num = getNumCasters(newCasters);
        if (num === 0) {
            hideCasters(e.card);
        }

        if (oldCasters === undefined) {
            setCaster(newCasters, e);
            return;
        }

        const oldNum = getNumCasters(oldCasters);
        if (oldNum === 0 && num > 0) {
            showCasters(e.card);
        }

        if (!_.isEqual(newCasters, oldCasters)) {
            setCaster(newCasters, e);
        }
    }
}

function getCasterWidth(casterCount: number): number {
    switch (casterCount) {
        case 1:
            return 1200;
        case 2:
            return 750;
        default:
            return 625;
    }
}

function getCasterVisual(caster: Caster): string {
    if (!isBlank(caster.videoUrl)) {
        return `
           <div class="video-loader-wrapper">
               <iframe
                   allow="autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;midi;geolocation;"
                   src="${caster.videoUrl}"
                   width="1280"
                   height="720"
               ></iframe>
           </div>
        `;
    } else if (!isBlank(caster.imageUrl)) {
        return `
            <img 
                class="caster-image"
                src="${caster.imageUrl}"
            >                    
        `;
    } else {
        return `
            <img 
                class="caster-image-placeholder"
                src="${casterPlaceholder}"
            >                    
        `;
    }

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
