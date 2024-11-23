import { BracketRenderer, D3BracketAnimator } from '@tourneyview/renderer';
import { bracketData } from '../helpers/replicants';

export const bracketRenderer = new BracketRenderer({
    animator: new D3BracketAnimator(),
    swissOpts: {
        rowHeight: 50,
        useScrollMask: false
    },
    roundRobinOpts: {
        maxScale: 1.5,
        columnGap: 6
    },
    eliminationOpts: {
        onCellCreation(selection) {
            selection.selectAll('.match-cell__bottom-team-name').each(function() {
                const separator = document.createElement('div');
                separator.classList.add('separator');
                this.parentNode.insertBefore(separator, this);
            })
        }
    }
});

export function initBracket() {
    const wrapper = document.querySelector('bracket-scene') as HTMLElement;

    wrapper.appendChild(bracketRenderer.element);

    document.addEventListener('DOMContentLoaded', async () => {
        await document.fonts.load('500 32px Lexend');

        bracketData.on('change', newValue => {
            if (newValue != null) {
                void bracketRenderer.setData(newValue);
            }
        });
    });
}
