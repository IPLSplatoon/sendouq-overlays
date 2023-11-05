//packages
import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import 'fitted-text';

import {initLinks, initMainScene, initNextMatch, initSceneSwitcher} from './break/exports';

//static assets
import sendouQLogo from './assets/sendouqlogo.png'; 
import topBarIcons from './assets/topbaricons.svg';
import globeIcon from './assets/globe.svg';
import micIcon from './assets/mic.svg';
import musicIcon from './assets/music.svg';
import iplStreamed from './assets/ipl-streamed.png';

//styles
import './styles/global.css';
import './styles/break/break.css';
import './styles/break/topBar.css';
import './styles/break/bottomBar.css';
import './styles/break/mainScene.css';
import './styles/break/teamsScene.css';


@customElement('nodecg-graphic')
export class Break extends LitElement {

    render() {
        return html`
            ${this.getTopBar()}
            ${this.getBottomBar()}
            ${this.getMainScene()}
            ${this.getTeamsScene()}  
        `;
    }

    firstUpdated() {
        initLinks();
        initNextMatch();
        initMainScene();
        initSceneSwitcher();
    }

    createRenderRoot(): Break {
        return this; // no shadow dom, allows styles to be applied to children
    }

    private getTopBar(): TemplateResult {
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

    private getBottomBar(): TemplateResult {
        return html`
        <bottom-bar>
            ${this.getBottomBarCard(globeIcon, "links")}
            ${this.getBottomBarCard(micIcon, "casters")}
            ${this.getBottomBarCard(musicIcon, "music")}
        </bottom-bar>
        `
    }

    private getBottomBarCard(iconSrc: string, id: string): TemplateResult {
        return html`
        <div class="card">
            <img class="icon" src="${iconSrc}">
            <div class="text-wrapper">
                <fitted-text class="title" max-width="325" id="${id}-title"></fitted-text>
                <fitted-text class="subtitle" max-width="325" id="${id}-subtitle"></fitted-text>
            </div>
        </div>
        `
    }

    private getMainScene(): TemplateResult {
        return html`
        <main-scene class="scene">
            <div class="stretch-wrapper">
                <div class="container title scene-switch" id="title-wrapper">
                    <img class="icon" src=${sendouQLogo}>
                    <div class="text" id="break-title"></div>
                </div>
                <div class="container pink break-text scene-switch" id="flavor-wrapper">
                    <fitted-text align="center" max-width="1200" id="break-flavor-text"></fitted-text>
                </div>
                <div class="next-wrapper scene-switch" id="next-match-wrapper">
                    <div class="container pink next">Next</div> 
                    <div class="container match">
                        <fitted-text class="name" max-width="800" id="next-match-name"></fitted-text>
                        <fitted-text class="teams" max-width="800" id="next-match-teams"></fitted-text>
                    </div>
                </div>
            </div>
            <img class="ipl-streamed scene-switch" src=${iplStreamed}>
        </main-scene>
        `;
    }

    private getTeamsScene(): TemplateResult {
        return html`
        <teams-scene class="scene">
            <div class="teams-wrapper">
                ${this.getTeamCard("left")}
                <div class="vs container pink scene-switch">VS</div>
                ${this.getTeamCard("right")}
            </div>
            <div class="info-wrapper">
                <div class="score left container pink scene-switch">0</div>
                <div class="next-wrapper container scene-switch">
                    <span class='next'>Next:</span>
                </div>
                <div class="score right container pink scene-switch">0</div>
            </div>
        </teams-scene>
        `
    }

    private getTeamCard(side: "left" | "right"): TemplateResult {
        return html`
        <div class="team-card ${side} container scene-switch">
            <div class="name">
                <fitted-text id="team-${side}-name" max-width="476" text="Team Name"></fitted-text>
            </div>
            <div class="players" id="team-${side}-players">
                <fitted-text max-width="476" text="player 1"></fitted-text>
                <fitted-text max-width="476" text="player 2"></fitted-text>
                <fitted-text max-width="476" text="player 3"></fitted-text>
                <fitted-text max-width="476" text="player 4"></fitted-text>
                <fitted-text max-width="476" text="player 5"></fitted-text>
                <fitted-text max-width="476" text="player 6"></fitted-text>
                <fitted-text max-width="476" text="player 7"></fitted-text>
                <fitted-text max-width="476" text="player 8"></fitted-text>
            </div>
        `;
    }
}