import { a as customElement, c as html$1, d as nothing, i as property, n as query, o as __decorateClass, p as css, r as state, t as WebAwesomeElement } from "./chunk.AOKMSJXD-DGbyRsIz.js";
import { t as warnDeprecatedSize } from "./chunk.RPQJAXXR-Cjp2H-XT.js";
import { n as HasSlotController, t as classMap } from "./class-map-DXAFzh3k.js";
import { t as size_styles_default } from "./chunk.G5ZZIGWB-DGGZPKRs.js";
import { t as variants_styles_default } from "./chunk.XNTP7DEQ-5LBodkYq.js";
import { t as watch } from "./chunk.PZAN6FPN-C7tn_Lsq.js";
import { n as LocalizeController } from "./chunk.EGBUT3HG-DHVlSBRs.js";
import "./chunk.JAAVYFGY-DeNP6tCd.js";
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.R7QX4M6R.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var MirrorValidator = () => {
	return { checkValidity(element) {
		const formControl = element.input;
		const validity = {
			message: "",
			isValid: true,
			invalidKeys: []
		};
		if (!formControl) return validity;
		let isValid = true;
		if ("checkValidity" in formControl) isValid = formControl.checkValidity();
		if (isValid) return validity;
		validity.isValid = false;
		if ("validationMessage" in formControl) validity.message = formControl.validationMessage;
		if (!("validity" in formControl)) {
			validity.invalidKeys.push("customError");
			return validity;
		}
		for (const key in formControl.validity) {
			if (key === "valid") continue;
			const checkedKey = key;
			if (formControl.validity[checkedKey]) validity.invalidKeys.push(checkedKey);
		}
		return validity;
	} };
};
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.VC3BPUZJ.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var WaInvalidEvent = class extends Event {
	constructor() {
		super("wa-invalid", {
			bubbles: true,
			cancelable: false,
			composed: true
		});
	}
};
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.KBXNFZQL.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var CustomErrorValidator = () => {
	return {
		observedAttributes: ["custom-error"],
		checkValidity(element) {
			const validity = {
				message: "",
				isValid: true,
				invalidKeys: []
			};
			if (element.customError) {
				validity.message = element.customError;
				validity.isValid = false;
				validity.invalidKeys = ["customError"];
			}
			return validity;
		}
	};
};
var WebAwesomeFormAssociatedElement = class extends WebAwesomeElement {
	constructor() {
		super();
		this.name = null;
		this.disabled = false;
		this.required = false;
		this.assumeInteractionOn = ["input"];
		this.validators = [];
		this.valueHasChanged = false;
		this.hasInteracted = false;
		this.customError = null;
		this.emittedEvents = [];
		this.emitInvalid = (e) => {
			if (e.target !== this) return;
			this.hasInteracted = true;
			this.dispatchEvent(new WaInvalidEvent());
		};
		this.handleInteraction = (event) => {
			const emittedEvents = this.emittedEvents;
			if (!emittedEvents.includes(event.type)) emittedEvents.push(event.type);
			if (emittedEvents.length === this.assumeInteractionOn?.length) this.hasInteracted = true;
		};
		if ("addEventListener" in this) this.addEventListener("invalid", this.emitInvalid);
	}
	/**
	* Validators are static because they have `observedAttributes`, essentially attributes to "watch"
	* for changes. Whenever these attributes change, we want to be notified and update the validator.
	*/
	static get validators() {
		return [CustomErrorValidator()];
	}
	static get observedAttributes() {
		const parentAttrs = new Set(super.observedAttributes || []);
		for (const validator of this.validators) {
			if (!validator.observedAttributes) continue;
			for (const attr of validator.observedAttributes) parentAttrs.add(attr);
		}
		return [...parentAttrs];
	}
	connectedCallback() {
		super.connectedCallback();
		if (this.didSSR && !this.hasUpdated) this.updateComplete.then(() => {
			this.updateValidity();
		});
		else this.updateValidity();
		this.assumeInteractionOn.forEach((event) => {
			this.addEventListener?.(event, this.handleInteraction);
		});
	}
	firstUpdated(...args) {
		super.firstUpdated(...args);
		this.updateValidity();
	}
	willUpdate(changedProperties) {
		if (changedProperties.has("customError")) {
			if (!this.customError) this.customError = null;
			this.setCustomValidity(this.customError || "");
		}
		if (changedProperties.has("value") || changedProperties.has("disabled") || changedProperties.has("defaultValue")) {
			const value = this.value;
			this.updateFormValue(value);
		}
		if (changedProperties.has("disabled")) {
			this.customStates.set("disabled", this.disabled);
			if (this.hasAttribute("disabled") || !this.matches(":disabled")) this.toggleAttribute("disabled", this.disabled);
		}
		super.willUpdate(changedProperties);
		if (this.didSSR && !this.hasUpdated) this.updateComplete.then(() => this.updateValidity());
		else this.updateValidity();
	}
	/**
	* @internal
	*/
	updateFormValue(value) {
		if (Array.isArray(value)) {
			if (this.name) {
				const formData = new FormData();
				for (const val of value) formData.append(this.name, val);
				this.setValue(formData, formData);
			}
		} else this.setValue(value, value);
	}
	get labels() {
		return this.internals.labels;
	}
	getForm() {
		return this.internals.form;
	}
	/**
	* By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
	* to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
	* the same document or shadow root for this to work.
	*/
	set form(val) {
		if (val) this.setAttribute("form", val);
		else this.removeAttribute("form");
	}
	get form() {
		return this.internals.form;
	}
	get validity() {
		return this.internals.validity;
	}
	get willValidate() {
		return this.internals.willValidate;
	}
	get validationMessage() {
		return this.internals.validationMessage;
	}
	checkValidity() {
		this.updateValidity();
		return this.internals.checkValidity();
	}
	reportValidity() {
		this.updateValidity();
		this.hasInteracted = true;
		return this.internals.reportValidity();
	}
	/**
	* Override this to change where constraint validation popups are anchored.
	*/
	get validationTarget() {
		return this.input || void 0;
	}
	setValidity(...args) {
		const flags = args[0];
		const message = args[1];
		let anchor = args[2];
		if (!anchor) anchor = this.validationTarget;
		this.internals.setValidity(flags, message, anchor || void 0);
		this.requestUpdate("validity");
		this.setCustomStates();
	}
	setCustomStates() {
		const required = Boolean(this.required);
		const isValid = this.internals.validity.valid;
		const hasInteracted = this.hasInteracted;
		this.customStates.set("required", required);
		this.customStates.set("optional", !required);
		this.customStates.set("invalid", !isValid);
		this.customStates.set("valid", isValid);
		this.customStates.set("user-invalid", !isValid && hasInteracted);
		this.customStates.set("user-valid", isValid && hasInteracted);
	}
	/**
	* Do not use this when creating a "Validator". This is intended for end users of components.
	* We track manually defined custom errors so we don't clear them on accident in our validators.
	*
	*/
	setCustomValidity(message) {
		if (!message) {
			this.customError = null;
			this.setValidity({});
			return;
		}
		this.customError = message;
		this.setValidity({ customError: true }, message, this.validationTarget);
	}
	formResetCallback() {
		this.resetValidity();
		this.hasInteracted = false;
		this.valueHasChanged = false;
		this.emittedEvents = [];
		this.updateValidity();
	}
	formDisabledCallback(isDisabled) {
		this.disabled = isDisabled;
		this.updateValidity();
	}
	/**
	* Called when the browser is trying to restore element’s state to state in which case reason is "restore", or when
	* the browser is trying to fulfill autofill on behalf of user in which case reason is "autocomplete". In the case of
	* "restore", state is a string, File, or FormData object previously set as the second argument to setFormValue.
	*/
	formStateRestoreCallback(state, reason) {
		if (this.didSSR && !this.hasUpdated) this.updateComplete.then(() => {
			this.value = state;
			if (reason === "restore") this.resetValidity();
			this.updateValidity();
		});
		else {
			this.value = state;
			if (reason === "restore") this.resetValidity();
			this.updateValidity();
		}
	}
	setValue(...args) {
		const [value, state] = args;
		this.internals.setFormValue(value, state);
	}
	get allValidators() {
		const staticValidators = this.constructor.validators || [];
		const validators = this.validators || [];
		return [...staticValidators, ...validators];
	}
	/**
	* Reset validity is a way of removing manual custom errors and native validation.
	*/
	resetValidity() {
		this.setCustomValidity("");
		this.setValidity({});
	}
	updateValidity() {
		if (this.disabled || this.hasAttribute("disabled") || !this.willValidate) {
			this.resetValidity();
			return;
		}
		const validators = this.allValidators;
		if (!validators?.length) return;
		const flags = { customError: Boolean(this.customError) };
		const formControl = this.validationTarget || this.input || void 0;
		let finalMessage = "";
		for (const validator of validators) {
			const { isValid, message, invalidKeys } = validator.checkValidity(this);
			if (isValid) continue;
			if (!finalMessage) finalMessage = message;
			if (invalidKeys?.length >= 0) invalidKeys.forEach((str) => flags[str] = true);
		}
		if (!finalMessage) finalMessage = this.validationMessage;
		this.setValidity(flags, finalMessage, formControl);
	}
};
WebAwesomeFormAssociatedElement.formAssociated = true;
__decorateClass([property({ reflect: true })], WebAwesomeFormAssociatedElement.prototype, "name", 2);
__decorateClass([property({ type: Boolean })], WebAwesomeFormAssociatedElement.prototype, "disabled", 2);
__decorateClass([property({
	state: true,
	attribute: false
})], WebAwesomeFormAssociatedElement.prototype, "valueHasChanged", 2);
__decorateClass([property({
	state: true,
	attribute: false
})], WebAwesomeFormAssociatedElement.prototype, "hasInteracted", 2);
__decorateClass([property({
	attribute: "custom-error",
	reflect: true
})], WebAwesomeFormAssociatedElement.prototype, "customError", 2);
__decorateClass([property({
	attribute: false,
	state: true,
	type: Object
})], WebAwesomeFormAssociatedElement.prototype, "validity", 1);
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.S35PLDPD.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var button_styles_default = css`
  @layer wa-component {
    :host {
      display: inline-block;

      /* Workaround because Chrome doesn't like :host(:has()) below
       * https://issues.chromium.org/issues/40062355
       * Firefox doesn't like this nested rule, so both are needed */
      &:has(wa-badge) {
        position: relative;
      }
    }

    /* Apply relative positioning only when needed to position wa-badge
     * This avoids creating a new stacking context for every button */
    :host(:has(wa-badge)) {
      position: relative;
    }
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    transition-property: background, border, box-shadow, color, opacity, transform;
    transition-duration: var(--wa-transition-fast);
    transition-timing-function: var(--wa-transition-easing);
    transform-origin: center;
    cursor: pointer;
    padding: 0 var(--wa-form-control-padding-inline);
    font-family: inherit;
    font-size: inherit;
    font-weight: var(--wa-font-weight-action);
    height: var(--wa-form-control-height);
    width: 100%;

    background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));

    border-color: transparent;
    color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-form-control-border-radius));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-form-control-border-radius));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-form-control-border-radius));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-form-control-border-radius));
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
  }

  /* Hover and active transforms */
  .button:not(.disabled):not(.loading) {
    @media (hover: hover) {
      &:hover {
        transform: var(--wa-button-transform-hover);
      }
    }
    &:active {
      transform: var(--wa-button-transform-active);
    }

    @media (prefers-reduced-motion: reduce) {
      &:hover,
      &:active {
        transform: none;
      }
    }
  }

  /* Appearance modifiers */
  :host([appearance='plain']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: var(--wa-color-border-loud, var(--wa-color-neutral-border-loud));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled-outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='accent']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
      background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
        var(--wa-color-mix-active)
      );
    }
  }

  /* Focus states */
  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled state */
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;

    /* When disabled, prevent mouse events from bubbling up from children */
    .button {
      pointer-events: none;
    }
  }

  /* Keep it last so Safari doesn't stop parsing this block */
  .button::-moz-focus-inner {
    border: 0;
  }

  /* Icon buttons */
  .button.is-icon-button {
    outline-offset: 2px;
    width: var(--wa-form-control-height);
    aspect-ratio: 1;
  }

  /* Icon buttons with a caret need to grow to fit both the icon and the caret */
  .button.is-icon-button.caret {
    width: auto;
    aspect-ratio: auto;
    min-width: var(--wa-form-control-height);
  }

  /* Pill modifier */
  :host([pill]) .button {
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-border-radius-pill));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-border-radius-pill));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-border-radius-pill));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-border-radius-pill));
  }

  /*
   * Label
   */

  .start,
  .end {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .label {
    display: inline-block;
  }

  .is-icon-button .label {
    display: flex;
    justify-content: center;
  }

  .label::slotted(wa-icon) {
    align-self: center;
  }

  /*
   * Caret modifier
   */

  wa-icon[part='caret'] {
    display: flex;
    align-self: center;
    align-items: center;

    &::part(svg) {
      width: 0.875em;
      height: 0.875em;
    }

    .button:has(&) .end {
      display: none;
    }
  }

  /*
   * Loading modifier
   */

  .loading {
    position: relative;
    cursor: wait;

    .start,
    .label,
    .end,
    .caret {
      /* Hidden with opacity, not visibility, so the label stays in the accessibility tree */
      opacity: 0;

      /* Unlike visibility: hidden, opacity leaves the content clickable */
      pointer-events: none;
    }

    wa-spinner {
      --indicator-color: currentColor;
      --track-color: color-mix(in oklab, currentColor, transparent 90%);

      position: absolute;
      font-size: 1em;
      height: 1em;
      width: 1em;
      top: calc(50% - 0.5em);
      left: calc(50% - 0.5em);
    }
  }

  /*
   * Badges
   */

  .button ::slotted(wa-badge) {
    border-color: var(--wa-color-surface-default);
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  :host(:dir(rtl)) ::slotted(wa-badge) {
    translate: -50% -50%;
  }

  /*
  * Button spacing
  */

  slot[name='start']::slotted(*) {
    margin-inline-end: 0.75em;
  }

  slot[name='end']::slotted(*),
  .button:not(.visually-hidden-label) [part='caret'] {
    margin-inline-start: 0.75em;
  }
`;
// node_modules/lit-html/development/directives/if-defined.js
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* For AttributeParts, sets the attribute if the value is defined and removes
* the attribute if the value is undefined.
*
* For other part types, this directive is a no-op.
*/
var ifDefined = (value) => value ?? nothing;
// node_modules/lit-html/development/static.js
/**
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* Prevents JSON injection attacks.
*
* The goals of this brand:
*   1) fast to check
*   2) code is small on the wire
*   3) multiple versions of Lit in a single page will all produce mutually
*      interoperable StaticValues
*   4) normal JSON.parse (without an unusual reviver) can not produce a
*      StaticValue
*
* Symbols satisfy (1), (2), and (4). We use Symbol.for to satisfy (3), but
* we don't care about the key, so we break ties via (2) and use the empty
* string.
*/
var brand = Symbol.for("");
/** Safely extracts the string part of a StaticValue. */
var unwrapStaticValue = (value) => {
	if (value?.r !== brand) return;
	return value?.["_$litStatic$"];
};
var textFromStatic = (value) => {
	if (value["_$litStatic$"] !== void 0) return value["_$litStatic$"];
	else throw new Error(`Value passed to 'literal' function must be a 'literal' result: ${value}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
};
/**
* Tags a string literal so that it behaves like part of the static template
* strings instead of a dynamic value.
*
* The only values that may be used in template expressions are other tagged
* `literal` results or `unsafeStatic` values (note that untrusted content
* should never be passed to `unsafeStatic`).
*
* Users must take care to ensure that adding the static string to the template
* results in well-formed HTML, or else templates may break unexpectedly.
*
* Static values can be changed, but they will cause a complete re-render since
* they effectively create a new template.
*/
var literal = (strings, ...values) => ({
	["_$litStatic$"]: values.reduce((acc, v, idx) => acc + textFromStatic(v) + strings[idx + 1], strings[0]),
	r: brand
});
var stringsCache = /* @__PURE__ */ new Map();
/**
* Wraps a lit-html template tag (`html` or `svg`) to add static value support.
*/
var withStatic = (coreTag) => (strings, ...values) => {
	const l = values.length;
	let staticValue;
	let dynamicValue;
	const staticStrings = [];
	const dynamicValues = [];
	let i = 0;
	let hasStatics = false;
	let s;
	while (i < l) {
		s = strings[i];
		while (i < l && (dynamicValue = values[i], staticValue = unwrapStaticValue(dynamicValue)) !== void 0) {
			s += staticValue + strings[++i];
			hasStatics = true;
		}
		if (i !== l) dynamicValues.push(dynamicValue);
		staticStrings.push(s);
		i++;
	}
	if (i === l) staticStrings.push(strings[l]);
	if (hasStatics) {
		const key = staticStrings.join("$$lit$$");
		strings = stringsCache.get(key);
		if (strings === void 0) {
			staticStrings.raw = staticStrings;
			stringsCache.set(key, strings = staticStrings);
		}
		values = dynamicValues;
	}
	return coreTag(strings, ...values);
};
/**
* Interprets a template literal as an HTML template that can efficiently
* render to and update a container.
*
* Includes static value support from `lit-html/static.js`.
*/
var html = withStatic(html$1);
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.LXLE4T4D.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var WaButton = class extends WebAwesomeFormAssociatedElement {
	constructor() {
		super(...arguments);
		this.assumeInteractionOn = ["click"];
		this.hasSlotController = new HasSlotController(this, "[default]", "start", "end");
		this.localize = new LocalizeController(this);
		this.invalid = false;
		this.isIconButton = false;
		this.title = "";
		this.variant = "neutral";
		this.appearance = "accent";
		this.size = "m";
		this.withCaret = false;
		this.withStart = false;
		this.withEnd = false;
		this.disabled = false;
		this.loading = false;
		this.pill = false;
		this.type = "button";
	}
	static get validators() {
		return [...super.validators, MirrorValidator()];
	}
	handleSizeChange() {
		warnDeprecatedSize(this.localName, this.size);
	}
	constructLightDOMButton() {
		const button = document.createElement("button");
		for (const attribute of this.attributes) {
			if (attribute.name === "style") continue;
			button.setAttribute(attribute.name, attribute.value);
		}
		button.type = this.type;
		button.style.position = "absolute !important";
		button.style.width = "0 !important";
		button.style.height = "0 !important";
		button.style.clipPath = "inset(50%) !important";
		button.style.overflow = "hidden !important";
		button.style.whiteSpace = "nowrap !important";
		if (this.name) button.name = this.name;
		button.value = this.value || "";
		return button;
	}
	handleClick(event) {
		if (this.disabled || this.loading) {
			event.preventDefault();
			event.stopImmediatePropagation();
			return;
		}
		if (this.type !== "submit" && this.type !== "reset") return;
		if (!this.getForm()) return;
		const lightDOMButton = this.constructLightDOMButton();
		this.parentElement?.append(lightDOMButton);
		lightDOMButton.click();
		lightDOMButton.remove();
	}
	handleInvalid() {
		this.dispatchEvent(new WaInvalidEvent());
	}
	handleLabelSlotChange() {
		const nodes = this.labelSlot.assignedNodes({ flatten: true });
		let hasIconLabel = false;
		let hasIcon = false;
		let hasText = false;
		let hasOtherElements = false;
		[...nodes].forEach((node) => {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const element = node;
				if (element.localName === "wa-icon") {
					hasIcon = true;
					if (!hasIconLabel) hasIconLabel = element.label !== void 0;
				} else hasOtherElements = true;
			} else if (node.nodeType === Node.TEXT_NODE) {
				if ((node.textContent?.trim() || "").length > 0) hasText = true;
			}
		});
		this.isIconButton = hasIcon && !hasText && !hasOtherElements;
		this.customStates.set("icon-button", this.isIconButton);
		if (this.isIconButton && !hasIconLabel) console.warn("Icon buttons must have a label for screen readers. Add <wa-icon label=\"...\"> to remove this warning.", this);
	}
	isButton() {
		return this.href ? false : true;
	}
	isLink() {
		return this.href ? true : false;
	}
	handleDisabledChange() {
		this.customStates.set("disabled", this.disabled);
		this.updateValidity();
	}
	handleHrefChange() {
		this.customStates.set("link", this.isLink());
	}
	handleLoadingChange() {
		this.customStates.set("loading", this.loading);
	}
	setValue(..._args) {}
	/** Simulates a click on the button. */
	click() {
		this.button.click();
	}
	/** Sets focus on the button. */
	focus(options) {
		this.button.focus(options);
	}
	/** Removes focus from the button. */
	blur() {
		this.button.blur();
	}
	render() {
		const isLink = this.isLink();
		const tag = isLink ? literal`a` : literal`button`;
		return html`
      <${tag}
        part="base button"
        class=${classMap({
			button: true,
			caret: this.withCaret,
			disabled: this.disabled,
			loading: this.loading,
			rtl: this.localize.dir() === "rtl",
			"has-label": this.hasSlotController.test("[default]"),
			"has-start": this.hasSlotController.test("start", "withStart"),
			"has-end": this.hasSlotController.test("end", "withEnd"),
			"is-icon-button": this.isIconButton
		})}
        ?disabled=${ifDefined(isLink ? void 0 : this.disabled)}
        type=${ifDefined(isLink ? void 0 : this.type)}
        title=${this.title}
        name=${ifDefined(isLink ? void 0 : this.name)}
        value=${ifDefined(isLink ? void 0 : this.value)}
        href=${ifDefined(isLink ? this.href : void 0)}
        target=${ifDefined(isLink ? this.target : void 0)}
        download=${ifDefined(isLink ? this.download : void 0)}
        rel=${ifDefined(isLink && this.rel ? this.rel : void 0)}
        role=${ifDefined(isLink ? void 0 : "button")}
        aria-disabled=${ifDefined(isLink && this.disabled ? "true" : void 0)}
        aria-busy=${this.loading ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="start" part="start" class="start"></slot>
        <slot part="label" class="label" @slotchange=${this.handleLabelSlotChange}></slot>
        <slot name="end" part="end" class="end"></slot>
        ${this.withCaret ? html`
                <wa-icon part="caret" class="caret" library="system" name="chevron-down" variant="solid"></wa-icon>
              ` : ""}
        ${this.loading ? html`<wa-spinner part="spinner"></wa-spinner>` : ""}
      </${tag}>
    `;
	}
};
WaButton.shadowRootOptions = {
	...WebAwesomeFormAssociatedElement.shadowRootOptions,
	delegatesFocus: true
};
WaButton.css = [
	button_styles_default,
	variants_styles_default,
	size_styles_default
];
__decorateClass([query(".button")], WaButton.prototype, "button", 2);
__decorateClass([query("slot:not([name])")], WaButton.prototype, "labelSlot", 2);
__decorateClass([state()], WaButton.prototype, "invalid", 2);
__decorateClass([state()], WaButton.prototype, "isIconButton", 2);
__decorateClass([property()], WaButton.prototype, "title", 2);
__decorateClass([property({ reflect: true })], WaButton.prototype, "variant", 2);
__decorateClass([property({ reflect: true })], WaButton.prototype, "appearance", 2);
__decorateClass([property({ reflect: true })], WaButton.prototype, "size", 2);
__decorateClass([watch("size")], WaButton.prototype, "handleSizeChange", 1);
__decorateClass([property({
	attribute: "with-caret",
	type: Boolean,
	reflect: true
})], WaButton.prototype, "withCaret", 2);
__decorateClass([property({
	attribute: "with-start",
	type: Boolean
})], WaButton.prototype, "withStart", 2);
__decorateClass([property({
	attribute: "with-end",
	type: Boolean
})], WaButton.prototype, "withEnd", 2);
__decorateClass([property({ type: Boolean })], WaButton.prototype, "disabled", 2);
__decorateClass([property({
	type: Boolean,
	reflect: true
})], WaButton.prototype, "loading", 2);
__decorateClass([property({
	type: Boolean,
	reflect: true
})], WaButton.prototype, "pill", 2);
__decorateClass([property()], WaButton.prototype, "type", 2);
__decorateClass([property({ reflect: true })], WaButton.prototype, "name", 2);
__decorateClass([property({ reflect: true })], WaButton.prototype, "value", 2);
__decorateClass([property({ reflect: true })], WaButton.prototype, "href", 2);
__decorateClass([property()], WaButton.prototype, "target", 2);
__decorateClass([property()], WaButton.prototype, "rel", 2);
__decorateClass([property()], WaButton.prototype, "download", 2);
__decorateClass([property({ attribute: "formaction" })], WaButton.prototype, "formAction", 2);
__decorateClass([property({ attribute: "formenctype" })], WaButton.prototype, "formEnctype", 2);
__decorateClass([property({ attribute: "formmethod" })], WaButton.prototype, "formMethod", 2);
__decorateClass([property({
	attribute: "formnovalidate",
	type: Boolean
})], WaButton.prototype, "formNoValidate", 2);
__decorateClass([property({ attribute: "formtarget" })], WaButton.prototype, "formTarget", 2);
__decorateClass([watch("disabled", { waitUntilFirstUpdate: true })], WaButton.prototype, "handleDisabledChange", 1);
__decorateClass([watch("href")], WaButton.prototype, "handleHrefChange", 1);
__decorateClass([watch("loading", { waitUntilFirstUpdate: true })], WaButton.prototype, "handleLoadingChange", 1);
WaButton = __decorateClass([customElement("wa-button")], WaButton);
WaButton.disableWarning?.("change-in-update");
// node_modules/@awesome.me/webawesome/dist/components/button/button.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
export { WaButton as default };
