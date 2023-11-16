import { TemplateResult, html } from "lit";

import sendouQLogo from '../assets/sendouqlogo.png'; 
import topBarIcons from '../assets/topbaricons.svg';
import globeIcon from '../assets/globe.svg';
import micIcon from '../assets/mic.svg';
import musicIcon from '../assets/music.svg';

export function getTopBar(): TemplateResult {
    return html`
    <top-bar>
        <div class="left">
            <div class="text">sendou.ink</div>
            <div class="divider">/</div>
            <img class="text" src=${sendouQLogo}>
            <div class="divider dynamic">/</div>
            <div class="text dynamic" id="top-bar-stage"></div>
            <div class="divider dynamic">/</div>
            <div class="text dynamic" id="top-bar-game"></div>
        </div>
        <img class="right" src=${topBarIcons}>
    </top-bar>
    `
}

export function getBottomBar(): TemplateResult {
    return html`
    <bottom-bar>
        ${getBottomBarCard(globeIcon, "links")}
        ${getBottomBarCard(micIcon, "casters")}
        ${getBottomBarCard(musicIcon, "music")}
    </bottom-bar>
    `
}

function getBottomBarCard(iconSrc: string, id: string): TemplateResult {
    return html`
    <div class="card" id="bottom-card-${id}">
        <img class="icon" src="${iconSrc}">
        <div class="text-wrapper">
            <fitted-text class="title" max-width="335" id="${id}-title"></fitted-text>
            <fitted-text class="subtitle" max-width="335" id="${id}-subtitle"></fitted-text>
        </div>
    </div>
    `
}