import { heart, club, spade, diamond } from './suits.js';

class PlayingCard extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(PlayingCard.template.content.cloneNode(true));

        this.mouseDragStart = null;
        this.mouseUpEventRef = null;
        // Used for removing the other style listeners if chaning card style without reload
        this.cardStyleEventListenerRemover = null;
    }

    connectedCallback() {
        if (this.flippable) {
            this._addFlippableListeners();
        }
        if (this.peekable) {
            this._addPeekableListeners();
        }
    }

    _addFlippableListeners() {
        this.addEventListener('click', this.flip);
        this.cardStyleEventListenerRemover = () => {
            this.removeEventListener('click', this.flip);
        };
    }

    flip() {
        this.setHidden(!this.hasAttribute('hidden'));
    }

    peek(e) {
        this.mouseDragStart = e.y;
        this.mouseUpEventRef = this._handleDragEnd.bind(this); // so that it can be removed later
        this.addEventListener('mousemove', this._handlePeekableDrag);
        document.addEventListener('mouseup', this.mouseUpEventRef);
    }

    _addPeekableListeners() {
        this.setHidden(true);
        this.addEventListener('mousedown', this.peek);
        this.cardStyleEventListenerRemover = () => this.removeEventListener('mousedown', this.peek);
    }

    _handleDragEnd() {
        this.removeEventListener('mousemove', this._handlePeekableDrag);
        document.removeEventListener('mouseup', this.mouseUpEventRef);
        this.mouseDragStart = null;
        this.style.borderRadius = this.originalBorderRadius;
        this.removeAttribute('style');
    }

    _handlePeekableDrag(e) {
        const showPercentage = (this.mouseDragStart - e.y) / 2;
        this.style.borderRadius = `var(--card-border-radius) var(--card-border-radius) ${showPercentage}% var(--card-border-radius)`;
    }

    setHidden(isHidden) {
        if (isHidden) {
            this.setAttribute('hidden', '');
        } else {
            this.removeAttribute('hidden');
        }
    }

    /**
     * @param {any} value
     */
    set peekable(value) {
        if (this.cardStyleEventListenerRemover) {
            this.cardStyleEventListenerRemover.call(this);
        }
        if (value) {
            this._addPeekableListeners();
        } else {
            this._addFlippableListeners();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        this[name] = newValue === '' ? true : newValue;
        this.render();
    }

    render() {
        // Set ranks
        this.shadowRoot.querySelectorAll('.card-rank').forEach((rankElem) => (rankElem.innerText = this.rank));

        // Set legend are according to the rank
        const legend = this.shadowRoot.querySelector('.card-legend');
        const docFrag = document.createDocumentFragment();
        const rankValue = this._getRankValue(this.rank);
        if (rankValue <= 10) {
            for (let i = 0; i < rankValue; i++) {
                const iconElem = document.createElement('span');
                iconElem.innerHTML = PlayingCard.icon;
                docFrag.appendChild(iconElem);
            }
        } else {
            const rankElem = document.createElement('span');
            const rankText = document.createElement('p');
            rankText.innerText = this.rank;
            rankElem.appendChild(rankText);
            docFrag.appendChild(rankElem);
        }

        legend.innerHTML = '';
        legend.appendChild(docFrag);
    }

    _getRankValue(rank) {
        const vals = {
            A: 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            J: 11,
            Q: 12,
            K: 13,
        };

        return vals[rank];
    }

    static get icon() {
        return `
            <svg viewBox="0 0 525 475">
                <path></path>
            </svg>
        `;
    }

    static get observedAttributes() {
        return ['rank', 'suit', 'flippable', 'peekable', 'hidden'];
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `
        ${PlayingCard.styles}

        <div class="card-face">
            <div class="corner-marker top-left">
                <p class="card-rank">5</p>
                ${PlayingCard.icon}
            </div>
            <div class="corner-marker bottom-right">
                <p class="card-rank">5</p>
                ${PlayingCard.icon}
            </div>
            <div class="card-legend">
            </div>
        </div>
        `;
        return template;
    }

    static get styles() {
        return `
<style>
    :host {
        --card-size: 4rem;

        --red-color: #e31b23;
        --black-color: #000;

        --card-font-size: 0.55;
        --corner-suit-size: 0.45;
        --legend-suit-size: 0.5;
        --card-border-radius: 4px;

        display: block;
        width: calc(var(--card-size) * 2.5);
        height: calc(var(--card-size) * 3.5);
        border-radius: var(--card-border-radius);
        position: relative;
        box-shadow: 0px 0px 4px 1px #484848;
        cursor: pointer;

        transition: transform 300ms ease-in-out;
        transform-style: preserve-3d;
        will-change: transform;

        user-select: none;

    }

    :host([hidden]) {
        transform: rotateY(180deg);
    }

    :host::after {
        content: '';
        height: 100%;
        width: 100%;
        box-shadow: 0px 0px 8px 1px #484848;
        border-radius: var(--card-border-radius);
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        transition: 100ms ease-in-out;
        opacity: 0;
    }

    :host(:hover):after,
    :host(:active):after
    {
        opacity: 1;
    }

    .card-face {
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        background: #FFF;
        border-radius: var(--card-border-radius);
    }

    :host([hidden][peekable]) .card-face::after {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #FFF;
        border-radius: var(--card-border-radius);
        transform: translateZ(2px); // Wow this is hacky
    }

    :host([hidden][peekable]) .bottom-right {
        transform: rotateY(180deg) translateZ(-1px);// Just below the cover, just above the bottom
    }

    .corner-marker {
        display: flex;
        flex-direction: column;
        align-items: center;
        position:absolute;
        padding: 0.25rem;
        backface-visibility: visible;
        z-index: 1;
    }

    .corner-marker p {
        color: inherit;
    }

    .corner-marker svg {
        fill: inherit;
        width: calc(var(--corner-suit-size) * var(--card-size));
        height: calc(var(--corner-suit-size) * var(--card-size));
    }

    .card-rank {
        font-size: calc(var(--card-font-size) * var(--card-size));
        margin: 0;
    }

    .card-legend {
        width: 100%;
        height: 100%;
        padding: calc(var(--card-font-size) * var(--card-size) * 0.8);
        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .card-legend * {
        text-align: center;
    }
    
    .card-legend svg {
        width: calc(var(--legend-suit-size) * var(--card-size));
        height: calc(var(--legend-suit-size) * var(--card-size));
    }

    .card-legend span {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-basis: 50%;
    }

    .top-left {
        top: 0;
        left: 0;
    }

    .bottom-left {
        bottom: 0;
        left: 0;
        transform: rotate(180deg);
    }

    .top-right {
        top: 0;
        right: 0;
    }

    .bottom-right {
        bottom: 0;
        right: 0;
        transform: rotate(180deg);
    }

    :host([rank="2"]) .card-legend *,
    :host([rank="3"]) .card-legend *
    {
        flex: 1 1 100%;
        text-align: center;
    }

    :host([rank="5"]) .card-legend *:nth-child(3),
    :host([rank="7"]) .card-legend *:nth-child(3),
    :host([rank="9"]) .card-legend *:nth-child(3),
    :host([rank="10"]) .card-legend *:nth-child(3),
    :host([rank="10"]) .card-legend *:nth-child(8)
    {
        flex-basis: 100%;
        height: calc(var(--legend-suit-size) * var(--card-size) / 2);
        margin-top: calc(var(--legend-suit-size) * var(--card-size) / 2 * -1);
    }

    :host([rank="J"]) .card-legend p,
    :host([rank="Q"]) .card-legend p,
    :host([rank="K"]) .card-legend p {
        font-size: calc(var(--card-font-size) * var(--card-size) * 2.5);
        margin: 0;
    }

    :host([rank="A"]) .card-legend svg {
        width: calc(var(--legend-suit-size) * var(--card-size) * 2);
    }

    :host([suit="D"]) .card-legend,
    :host([suit="H"]) .card-legend,
    :host([suit="D"]) .corner-marker,
    :host([suit="H"]) .corner-marker {
        color: var(--red-color);
        fill: var(--red-color);
    }

    :host([suit="C"]) .card-legend,
    :host([suit="S"]) .card-legend,
    :host([suit="C"]) .corner-marker,
    :host([suit="S"]) .corner-marker {
        color: var(--black-color);
        fill: var(--black-color);
    }

    :host([suit="D"]) path {
        d: path("${diamond}");
        color: var(--red-color);
    }

    :host([suit="H"]) path {
        d: path("${heart}");
        color: var(--red-color);
    }

    :host([suit="C"]) path {
        d: path("${club}");
    }

    :host([suit="S"]) path {
        d: path("${spade}");
    }
    
</style>
    `;
    }
}

if (!customElements.get('playing-card')) {
    customElements.define('playing-card', PlayingCard);
}
