/*
The replay graphic is internally considered a break graphic.
It shares a lot of the same code as the break graphic.
Just makes sense to have its code in the same folders.
*/

import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { initLinks, initTopBar, initCasters, initMusic } from './break/exports';
import { getBottomBar, getTopBar } from './helpers/breakElements';
import 'fitted-text';

import './styles/global.css';
import './styles/break/replay.css';
import './styles/break/topBar.css';
import './styles/break/bottomBar.css';

import replayFrame from './assets/replay-frame.svg'

@customElement('nodecg-graphic')
export class Replay extends LitElement {

    render(): TemplateResult {
        return html`
            ${getTopBar()}
            ${getBottomBar()}
            <img class="background" src="${replayFrame}">
        `;
    }

    firstUpdated() {
        initLinks();
        initTopBar();
        initCasters();
        initMusic();
    }

    createRenderRoot(): Replay {
        return this; // no shadow dom, allows styles to be applied to children
    }
}