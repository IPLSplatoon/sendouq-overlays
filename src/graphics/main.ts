import { LitElement, TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";
import { initCasters, initScoreboard } from "./main/exports"
import 'fitted-text';

import sendouQlogo from './assets/sendouqlogo.png';
import watermark from './assets/watermark.svg';

import './styles/global.css';
import './styles/main/main.css';
import './styles/main/scoreboard.css';
import './styles/main/casterBox.css';

@customElement("nodecg-graphic")
export class Main extends LitElement {

    render(){
        return html`
            ${this.getScoreboard()}
            ${this.getCasterBox()}
            <img class="watermark" src="${watermark}">
        `;
    }

    firstUpdated(){
        initScoreboard();
        initCasters();
    }

    createRenderRoot(): Main {
        return this;
    }

    private getScoreboard(): TemplateResult {
        return html`
        <main-scoreboard class="shadow">
            <div class="score-container">
                ${this.getScoreboardPlayer("top")}
                ${this.getScoreboardPlayer("bottom")}
            </div>
            <div class="info-container">
                <img class="logo" src="${sendouQlogo}">
                <div class="text-wrapper dynamic">
                    <fitted-text class="bold" id="info-text-top" max-width="293" text="The info text"></fitted-text>
                    <fitted-text id="info-text-bottom" max-width="293" text="The info text"></fitted-text>
                </div>
            </div>
        </main-scoreboard>
        `
    }

    private getScoreboardPlayer(pos: "top" | "bottom"): TemplateResult {
        return html`
        <div class="player-wrapper dynamic" id="player-wrapper-${pos}">
            <div class="name-wrapper">
                <fitted-text id="player-name-${pos}" max-width="290"></fitted-text>
            </div>
            <div class="score" id="player-score-${pos}">0</div>
        </div>
        `;
    }

    private getCasterBox(): TemplateResult {    
        return html`
        <caster-box class="shadow" id="caster-box">
        </caster-box>
        `
    }
}