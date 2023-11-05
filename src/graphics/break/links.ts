import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);

export function initLinks(){
    const e = {
        title: document.getElementById("links-title") as HTMLDivElement,
        subtitle: document.getElementById("links-subtitle") as HTMLDivElement,
    }

    const tl: gsap.core.Timeline = gsap.timeline({
        repeat: -1, 
    });

    tl.set(e.title, {
        text: "sendou.ink",
    })
    .set(e.subtitle, {
        text: "@sendouink",
    })    
    .fromTo([e.title, e.subtitle], {
        opacity: 0
    }, {
        opacity: 1,
        duration: .5,
        ease: "power2.out"
    })
    .to([e.title, e.subtitle], {
        opacity: 0,
        duration: .5,
        ease: "power2.in"  
    }, "+=7")

    .set(e.title, {
        text: "iplabs.ink"
    })  
    .set(e.subtitle, {
        text: "@IPLSplatoon",
    })
    .to([e.title, e.subtitle], {
        opacity: 1,
        duration: .5,
        ease: "power2.out"
    })
    .to([e.title, e.subtitle], {
        opacity: 0,
        duration: .5,
        ease: "power2.in"  
    }, "+=7")
}