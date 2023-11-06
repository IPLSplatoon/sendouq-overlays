import { musicShown, nowPlaying } from "../helpers/replicants";
import { MusicShown, NowPlaying } from "schemas";
import { gsap } from "gsap";
import * as _ from "lodash";

export function initMusic() {
    const e = {
        card: document.getElementById("bottom-card-music") as HTMLElement,
        title: document.getElementById("music-title") as HTMLElement,
        subtitle: document.getElementById("music-subtitle") as HTMLElement
    }

    NodeCG.waitForReplicants(musicShown, nowPlaying).then(() => {   
        musicShown.on("change", (newVal: MusicShown, oldVal: MusicShown) => {
            if (oldVal === undefined) {
                if (!newVal) {
                    hideMusic(e.card);
                }
                return;
            }

            if (newVal !== oldVal) {
                if (newVal) {
                    showMusic(e.card);
                } else {
                    hideMusic(e.card);
                }
            }
        });

        nowPlaying.on("change", (newVal: NowPlaying, oldVal: NowPlaying) => {
            if (oldVal === undefined) {
                setMusic(e, newVal.artist, newVal.song);
                return;
            }

            if (!_.isEqual(newVal, oldVal)) {
                setMusic(e, newVal.artist, newVal.song);
            }
        });
    });
}

function showMusic(element: HTMLElement) {
    const tl = gsap.timeline();
    tl.to(element, {
        width: 450,
        marginLeft: 10,
        marginRight: 10,
        duration: .5,
        ease: "power2.inOut",   
    })
    .to(element, {
        opacity: 1,
        duration: .5,
        ease: "power2.out",
    });
}

function hideMusic(element: HTMLElement) {
    const tl = gsap.timeline();
    tl.to(element, {
        opacity: 0,
        duration: .5,
        ease: "power2.in",
    })
    .to(element, {
        width: 0,
        marginLeft: 0,
        marginRight: 0,
        duration: .5,
        ease: "power2.inOut",
    });
}

function setMusic(e, artist: string, title: string){
    const tl = gsap.timeline();
    tl.to([e.title, e.subtitle], {
        opacity: 0,
        duration: .5,
        ease: "power2.in",
        onComplete: function() {
            e.title.text = title;
            e.subtitle.text = artist;
        }
    })
    .to([e.title, e.subtitle], {
        opacity: 1,
        duration: .5,
        ease: "power2.out",
    });
}