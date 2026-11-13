import { u as noChange } from "./chunk.AOKMSJXD-DGbyRsIz.js";
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.RWNXKUCF.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var HasSlotController = class {
	constructor(host, ...slotNames) {
		this.slotNames = [];
		this.handleSlotChange = (event) => {
			const slot = event.target;
			if (this.slotNames.includes("[default]") && !slot.name || slot.name && this.slotNames.includes(slot.name)) this.host.requestUpdate();
		};
		(this.host = host).addController(this);
		this.slotNames = slotNames;
	}
	hasDefaultSlot() {
		if (!this.host.childNodes) return false;
		return [...this.host.childNodes].some((node) => {
			if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") return true;
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node;
				if (el.tagName.toLowerCase() === "wa-visually-hidden") return false;
				if (!el.hasAttribute("slot")) return true;
			}
			return false;
		});
	}
	hasNamedSlot(name) {
		return this.host.querySelector?.(`:scope > [slot="${name}"]`) !== null;
	}
	/**
	* @param slotName     - Name of the slot to look for
	* @param propertyName - Generally we infer via `withHeader` property on the host, but in cases where its different, you can specify a manual property name.
	*/
	test(slotName, propertyName) {
		if (propertyName && this.host.didSSR && !this.host.hasUpdated) return Boolean(this.host[propertyName]);
		return slotName === "[default]" ? this.hasDefaultSlot() : this.hasNamedSlot(slotName);
	}
	hostConnected() {
		const shadowRoot = this.host.shadowRoot;
		if (shadowRoot && "addEventListener" in shadowRoot) shadowRoot.addEventListener("slotchange", this.handleSlotChange);
	}
	hostDisconnected() {
		const shadowRoot = this.host.shadowRoot;
		if (shadowRoot && "removeEventListener" in shadowRoot) shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
	}
};
// node_modules/lit-html/development/directive.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var PartType = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
};
/**
* Creates a user-facing directive function from a Directive class. This
* function has the same parameters as the directive's render() method.
*/
var directive = (c) => (...values) => ({
	["_$litDirective$"]: c,
	values
});
/**
* Base class for creating custom directives. Users should extend this class,
* implement `render` and/or `update`, and then pass their subclass to
* `directive`.
*/
var Directive = class {
	constructor(_partInfo) {}
	get _$isConnected() {
		return this._$parent._$isConnected;
	}
	/** @internal */
	_$initialize(part, parent, attributeIndex) {
		this.__part = part;
		this._$parent = parent;
		this.__attributeIndex = attributeIndex;
	}
	/** @internal */
	_$resolve(part, props) {
		return this.update(part, props);
	}
	update(_part, props) {
		return this.render(...props);
	}
};
// node_modules/lit-html/development/directives/class-map.js
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var ClassMapDirective = class extends Directive {
	constructor(partInfo) {
		super(partInfo);
		if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== "class" || partInfo.strings?.length > 2) throw new Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(classInfo) {
		return " " + Object.keys(classInfo).filter((key) => classInfo[key]).join(" ") + " ";
	}
	update(part, [classInfo]) {
		if (this._previousClasses === void 0) {
			this._previousClasses = /* @__PURE__ */ new Set();
			if (part.strings !== void 0) this._staticClasses = new Set(part.strings.join(" ").split(/\s/).filter((s) => s !== ""));
			for (const name in classInfo) if (classInfo[name] && !this._staticClasses?.has(name)) this._previousClasses.add(name);
			return this.render(classInfo);
		}
		const classList = part.element.classList;
		for (const name of this._previousClasses) if (!(name in classInfo)) {
			classList.remove(name);
			this._previousClasses.delete(name);
		}
		for (const name in classInfo) {
			const value = !!classInfo[name];
			if (value !== this._previousClasses.has(name) && !this._staticClasses?.has(name)) {
				if (value) {
					classList.add(name);
					this._previousClasses.add(name);
				} else {
					classList.remove(name);
					this._previousClasses.delete(name);
				}
			}
		}
		return noChange;
	}
};
/**
* A directive that applies dynamic CSS classes.
*
* This must be used in the `class` attribute and must be the only part used in
* the attribute. It takes each property in the `classInfo` argument and adds
* the property name to the element's `classList` if the property value is
* truthy; if the property value is falsy, the property name is removed from
* the element's `class`.
*
* For example `{foo: bar}` applies the class `foo` if the value of `bar` is
* truthy.
*
* @param classInfo
*/
var classMap = directive(ClassMapDirective);
export { HasSlotController as n, classMap as t };
