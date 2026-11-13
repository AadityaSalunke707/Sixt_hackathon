import { a as customElement, c as html, i as property, o as __decorateClass, p as css, t as WebAwesomeElement } from "./chunk.AOKMSJXD-DGbyRsIz.js";
import { n as HasSlotController, t as classMap } from "./class-map-DXAFzh3k.js";
import { t as size_styles_default } from "./chunk.G5ZZIGWB-DGGZPKRs.js";
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.ATI2KDM5.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var card_styles_default = css`
  :host {
    --spacing: var(--wa-space-l);

    /* Internal calculated properties */
    --inner-border-radius: calc(var(--wa-panel-border-radius) - var(--wa-panel-border-width));

    display: flex;
    flex-direction: column;
    background-color: var(--wa-color-surface-default);
    border-color: var(--wa-color-surface-border);
    border-radius: var(--wa-panel-border-radius);
    border-style: var(--wa-panel-border-style);
    box-shadow: var(--wa-shadow-s);
    border-width: var(--wa-panel-border-width);
    color: var(--wa-color-text-normal);
  }

  /* Appearance modifiers */
  :host([appearance='plain']) {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }

  :host([appearance='outlined']) {
    background-color: var(--wa-color-surface-default);
    border-color: var(--wa-color-surface-border);
  }

  :host([appearance='filled']) {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-color: transparent;
  }

  :host([appearance='filled-outlined']) {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-color: var(--wa-color-surface-border);
  }

  :host([appearance='accent']) {
    color: var(--wa-color-neutral-on-loud);
    background-color: var(--wa-color-neutral-fill-loud);
    border-color: transparent;
  }

  /* Take care of top and bottom radii */
  .media,
  :host(:not([with-media])) .header,
  :host(:not([with-media], [with-header])) .body {
    border-start-start-radius: var(--inner-border-radius);
    border-start-end-radius: var(--inner-border-radius);
  }

  :host(:not([with-footer])) .body,
  .footer {
    border-end-start-radius: var(--inner-border-radius);
    border-end-end-radius: var(--inner-border-radius);
  }

  .media {
    display: flex;
    overflow: hidden;

    &::slotted(*) {
      display: block;
      width: 100%;
      border-radius: 0 !important;
    }
  }

  /* Round all corners for plain appearance */
  :host([appearance='plain']) .media {
    border-radius: var(--inner-border-radius);

    &::slotted(*) {
      border-radius: inherit !important;
    }
  }

  .header {
    display: block;
    border-block-end-style: inherit;
    border-block-end-color: var(--wa-color-surface-border);
    border-block-end-width: var(--wa-panel-border-width);
    padding: calc(var(--spacing) / 2) var(--spacing);
  }

  .body {
    display: block;
    padding: var(--spacing);
  }

  .footer {
    display: block;
    border-block-start-style: inherit;
    border-block-start-color: var(--wa-color-surface-border);
    border-block-start-width: var(--wa-panel-border-width);
    padding: var(--spacing);
  }

  /* Push slots to sides when the action slots renders */
  .has-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :host(:not([with-header])) .header,
  :host(:not([with-footer])) .footer,
  :host(:not([with-media])) .media {
    display: none;
  }

  /* Orientation Styles */
  :host([orientation='horizontal']) {
    flex-direction: row;

    .media {
      border-start-start-radius: var(--inner-border-radius);
      border-end-start-radius: var(--inner-border-radius);
      border-start-end-radius: 0;

      &::slotted(*) {
        block-size: 100%;
        inline-size: 100%;
        object-fit: cover;
      }
    }
  }

  :host([orientation='horizontal']) .body slot::slotted(*) {
    display: block;
    height: 100%;
    margin: 0;
  }

  :host([orientation='horizontal']) slot[name='actions']::slotted(*) {
    display: flex;
    align-items: center;
    padding: var(--spacing);
  }
`;
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.YKC4SGGJ.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var WaCard = class extends WebAwesomeElement {
	constructor() {
		super(...arguments);
		this.hasSlotController = new HasSlotController(this, "footer", "header", "media", "header-actions", "footer-actions", "actions");
		this.appearance = "outlined";
		this.withHeader = false;
		this.withMedia = false;
		this.withFooter = false;
		this.withHeaderActions = false;
		this.withFooterActions = false;
		this.orientation = "vertical";
	}
	willUpdate(changedProperties) {
		this.withHeader = this.hasSlotController.test("header", "withHeader");
		this.withMedia = this.hasSlotController.test("media", "withMedia");
		this.withFooter = this.hasSlotController.test("footer", "withFooter");
		super.willUpdate(changedProperties);
	}
	render() {
		if (this.orientation === "horizontal") return html`
        <slot name="media" part="media" class="media"></slot>
        <div part="body" class="body"><slot></slot></div>
        <slot name="actions" part="actions" class="actions"></slot>
      `;
		const hasHeaderActions = this.hasSlotController.test("header-actions", "withHeaderActions");
		const hasFooterActions = this.hasSlotController.test("footer-actions", "withFooterActions");
		return html`
      <slot name="media" part="media" class="media"></slot>

      <div
        part="header"
        class=${classMap({
			header: true,
			"has-actions": hasHeaderActions
		})}
      >
        <slot name="header"></slot>
        <slot name="header-actions"></slot>
      </div>

      <div part="body" class="body"><slot></slot></div>

      <div
        part="footer"
        class=${classMap({
			footer: true,
			"has-actions": hasFooterActions
		})}
      >
        <slot name="footer"></slot>
        <slot name="footer-actions"></slot>
      </div>
    `;
	}
};
WaCard.css = [size_styles_default, card_styles_default];
__decorateClass([property({ reflect: true })], WaCard.prototype, "appearance", 2);
__decorateClass([property({
	attribute: "with-header",
	type: Boolean,
	reflect: true
})], WaCard.prototype, "withHeader", 2);
__decorateClass([property({
	attribute: "with-media",
	type: Boolean,
	reflect: true
})], WaCard.prototype, "withMedia", 2);
__decorateClass([property({
	attribute: "with-footer",
	type: Boolean,
	reflect: true
})], WaCard.prototype, "withFooter", 2);
__decorateClass([property({
	attribute: "with-header-actions",
	type: Boolean,
	reflect: true
})], WaCard.prototype, "withHeaderActions", 2);
__decorateClass([property({
	attribute: "with-footer-actions",
	type: Boolean,
	reflect: true
})], WaCard.prototype, "withFooterActions", 2);
__decorateClass([property({ reflect: true })], WaCard.prototype, "orientation", 2);
WaCard = __decorateClass([customElement("wa-card")], WaCard);
WaCard.disableWarning?.("change-in-update");
// node_modules/@awesome.me/webawesome/dist/components/card/card.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
export { WaCard as default };
