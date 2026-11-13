import { a as customElement, c as html, i as property, o as __decorateClass, p as css, t as WebAwesomeElement } from "./chunk.AOKMSJXD-DGbyRsIz.js";
import { t as warnDeprecatedSize } from "./chunk.RPQJAXXR-Cjp2H-XT.js";
import { t as size_styles_default } from "./chunk.G5ZZIGWB-DGGZPKRs.js";
import { t as variants_styles_default } from "./chunk.XNTP7DEQ-5LBodkYq.js";
import { t as watch } from "./chunk.PZAN6FPN-C7tn_Lsq.js";
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.LCEGCF5S.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var callout_styles_default = css`
  :host {
    display: flex;
    position: relative;
    align-items: stretch;
    border-radius: var(--wa-panel-border-radius);
    background-color: var(--wa-color-fill-quiet, var(--wa-color-brand-fill-quiet));
    border-color: var(--wa-color-border-quiet, var(--wa-color-brand-border-quiet));
    border-style: var(--wa-panel-border-style);
    border-width: var(--wa-panel-border-width);
    color: var(--wa-color-text-normal);
    padding: 1em;
  }

  /* Appearance modifiers */
  :host([appearance~='plain']) {
    background-color: transparent;
    border-color: transparent;
  }

  :host([appearance~='outlined']) {
    background-color: transparent;
    border-color: var(--wa-color-border-loud, var(--wa-color-brand-border-loud));
  }

  :host([appearance~='filled']) {
    background-color: var(--wa-color-fill-quiet, var(--wa-color-brand-fill-quiet));
    border-color: transparent;
  }

  :host([appearance~='filled-outlined']) {
    border-color: var(--wa-color-border-quiet, var(--wa-color-brand-border-quiet));
  }

  :host([appearance~='accent']) {
    color: var(--wa-color-on-loud, var(--wa-color-brand-on-loud));
    background-color: var(--wa-color-fill-loud, var(--wa-color-brand-fill-loud));
    border-color: transparent;

    [part~='icon'] {
      color: currentColor;
    }
  }

  [part~='icon'] {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--wa-color-on-quiet);
    font-size: 1.25em;
  }

  ::slotted([slot='icon']) {
    margin-inline-end: var(--wa-form-control-padding-inline);
  }

  [part~='message'] {
    flex: 1 1 auto;
    display: block;
    overflow: hidden;
  }
`;
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.C6MKRB3S.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var WaCallout = class extends WebAwesomeElement {
	constructor() {
		super(...arguments);
		this.variant = "brand";
		this.size = "m";
	}
	handleSizeChange() {
		warnDeprecatedSize(this.localName, this.size);
	}
	render() {
		return html`
      <div part="icon">
        <slot name="icon"></slot>
      </div>

      <div part="message">
        <slot></slot>
      </div>
    `;
	}
};
WaCallout.css = [
	callout_styles_default,
	variants_styles_default,
	size_styles_default
];
__decorateClass([property({ reflect: true })], WaCallout.prototype, "variant", 2);
__decorateClass([property({ reflect: true })], WaCallout.prototype, "appearance", 2);
__decorateClass([property({ reflect: true })], WaCallout.prototype, "size", 2);
__decorateClass([watch("size")], WaCallout.prototype, "handleSizeChange", 1);
WaCallout = __decorateClass([customElement("wa-callout")], WaCallout);
// node_modules/@awesome.me/webawesome/dist/components/callout/callout.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
export { WaCallout as default };
