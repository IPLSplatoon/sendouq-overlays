import { customElement } from 'lit/decorators.js';
import { html, LitElement, TemplateResult } from 'lit';
import { ActiveBreakScene } from 'schemas';

const activeBreakScene = nodecg.Replicant<ActiveBreakScene>('activeBreakScene', 'ipl-overlay-controls');

function initSceneSwitcher() {
    const e = {
        bracket: document.getElementById('scene-button-bracket') as HTMLButtonElement,
        casters: document.getElementById('scene-button-casters') as HTMLButtonElement
    };

    NodeCG.waitForReplicants(activeBreakScene).then(() => {
        activeBreakScene.on('change', newValue => {
            e.bracket.disabled = newValue === 'bracket';
            e.casters.disabled = newValue === 'casters';
        });
    });
}

@customElement('nodecg-panel')
export class Scenes extends LitElement {

    render(): TemplateResult {
        return html`
            <button id="scene-button-bracket" @click="${this.setActiveBreakScene('bracket')}">Bracket</button>
            <button id="scene-button-casters" @click="${this.setActiveBreakScene('casters')}">Casters</button>
        `;
    }

    createRenderRoot(): Scenes {
        return this;
    }

    setActiveBreakScene(newValue: string) {
        return () => activeBreakScene.value = newValue;
    }

    firstUpdated() {
        initSceneSwitcher();
    }
}
