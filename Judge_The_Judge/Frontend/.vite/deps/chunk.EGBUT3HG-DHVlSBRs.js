import { a as customElement, c as html, o as __decorateClass, p as css, t as WebAwesomeElement } from "./chunk.AOKMSJXD-DGbyRsIz.js";
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.W7A2VLCT.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var spinner_styles_default = css`
  :host {
    --track-width: 2px;
    --track-color: var(--wa-color-neutral-fill-normal);
    --indicator-color: var(--wa-color-brand-fill-loud);
    --speed: 2s;
    --size: 1em;

    /*
      Resizing a spinner element using anything but font-size will break the animation because the animation uses em
      units. Therefore, if a spinner is used in a flex container without \`flex: none\` applied, the spinner can
      grow/shrink and break the animation. The use of \`flex: none\` on the host element prevents this by always having
      the spinner sized according to its actual dimensions.
    */
    flex: none;
    display: inline-flex;
    width: var(--size);
    height: var(--size);
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    animation: spin var(--speed) linear infinite;
  }

  .track,
  .indicator {
    --radius: calc(var(--size) / 2 - var(--track-width) / 2);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
    r: var(--radius);
    fill: none;
    stroke-width: var(--track-width);
  }

  .track {
    stroke: var(--track-color);
  }

  .indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: calc(0.597 * var(--circumference)), calc(0.796 * var(--circumference));
    stroke-dashoffset: calc(-0.04 * var(--circumference));
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: calc(0.008 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.278 * var(--circumference));
    }
    100% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.987 * var(--circumference));
    }
  }
`;
// node_modules/@shoelace-style/localize/dist/index.js
var connectedElements = /* @__PURE__ */ new Set();
var translations = /* @__PURE__ */ new Map();
var fallback;
var documentDirection = "ltr";
var documentLanguage = "en";
var isClient = typeof MutationObserver !== "undefined" && typeof document !== "undefined" && typeof document.documentElement !== "undefined";
if (isClient) {
	const documentElementObserver = new MutationObserver(update);
	documentDirection = document.documentElement.dir || "ltr";
	documentLanguage = document.documentElement.lang || navigator.language;
	documentElementObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["dir", "lang"]
	});
}
function registerTranslation(...translation) {
	translation.map((t) => {
		const code = t.$code.toLowerCase();
		if (translations.has(code)) translations.set(code, Object.assign(Object.assign({}, translations.get(code)), t));
		else translations.set(code, t);
		if (!fallback) fallback = t;
	});
	update();
}
function update() {
	if (isClient) {
		documentDirection = document.documentElement.dir || "ltr";
		documentLanguage = document.documentElement.lang || navigator.language;
	}
	[...connectedElements.keys()].map((el) => {
		if (typeof el.requestUpdate === "function") el.requestUpdate();
	});
}
var LocalizeController$1 = class {
	constructor(host) {
		this.host = host;
		this.host.addController(this);
	}
	hostConnected() {
		connectedElements.add(this.host);
	}
	hostDisconnected() {
		connectedElements.delete(this.host);
	}
	dir() {
		return `${this.host.dir || documentDirection}`.toLowerCase();
	}
	lang() {
		const lang = `${this.host.lang || documentLanguage}`.toLowerCase().replace(/_/g, "-");
		try {
			new Intl.Locale(lang);
			return lang;
		} catch (_a) {
			return fallback ? fallback.$code.toLowerCase() : "en";
		}
	}
	getTranslationData(lang) {
		var _a, _b;
		let locale;
		try {
			locale = new Intl.Locale(lang.replace(/_/g, "-"));
		} catch (_c) {
			return {
				locale: void 0,
				language: "",
				region: "",
				primary: void 0,
				secondary: void 0
			};
		}
		const language = locale.language.toLowerCase();
		const region = (_b = (_a = locale.region) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
		const primary = translations.get(`${language}-${region}`);
		const secondary = translations.get(language);
		return {
			locale,
			language,
			region,
			primary,
			secondary
		};
	}
	exists(key, options) {
		var _a;
		const { primary, secondary } = this.getTranslationData((_a = options.lang) !== null && _a !== void 0 ? _a : this.lang());
		options = Object.assign({ includeFallback: false }, options);
		if (primary && primary[key] || secondary && secondary[key] || options.includeFallback && fallback && fallback[key]) return true;
		return false;
	}
	term(key, ...args) {
		const { primary, secondary } = this.getTranslationData(this.lang());
		let term;
		if (primary && primary[key]) term = primary[key];
		else if (secondary && secondary[key]) term = secondary[key];
		else if (fallback && fallback[key]) term = fallback[key];
		else {
			console.error(`No translation found for: ${String(key)}`);
			return String(key);
		}
		if (typeof term === "function") return term(...args);
		return term;
	}
	date(dateToFormat, options) {
		dateToFormat = new Date(dateToFormat);
		return new Intl.DateTimeFormat(this.lang(), options).format(dateToFormat);
	}
	number(numberToFormat, options) {
		numberToFormat = Number(numberToFormat);
		return isNaN(numberToFormat) ? "" : new Intl.NumberFormat(this.lang(), options).format(numberToFormat);
	}
	relativeTime(value, unit, options) {
		return new Intl.RelativeTimeFormat(this.lang(), options).format(value, unit);
	}
};
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.M45NRQFW.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var translation = {
	$code: "en",
	$name: "English",
	$dir: "ltr",
	allTagsRemoved: "All tags removed",
	am: "AM",
	autosizeColumn: "Autosize column",
	captions: "Captions",
	carousel: "Carousel",
	chooseDate: "Choose date",
	chooseDecade: "Choose decade",
	chooseMonth: "Choose month",
	chooseTime: "Choose time",
	chooseYear: "Choose year",
	clearEntry: "Clear entry",
	clearFilter: "Clear filter",
	clearSort: "Clear sort",
	close: "Close",
	closeCalendar: "Close calendar",
	closeTimeInput: "Close time picker",
	collapseRow: "Collapse row",
	columnMenu: "Column options",
	columnMovedToPosition: (label, position, total) => `${label} moved to position ${position} of ${total}`,
	columns: "Columns",
	compactPageXOfY: (page, total) => `${page} of ${total}`,
	completed: "Completed",
	copied: "Copied",
	copy: "Copy",
	createOption: (value) => `Create "${value}"`,
	currentlyPlaying: "currently playing",
	currentValue: "Current value",
	date: "Date",
	datePickerKeyboardHelp: "Use arrow keys to change values; press Alt+Down Arrow to open the calendar.",
	day: "Day",
	dayPeriod: "AM/PM",
	decrement: "Decrement",
	deselectAllRows: "Deselect all rows",
	disabled: "Disabled",
	dropFileHere: "Drop file here or click to browse",
	dropFilesHere: "Drop files here or click to browse",
	empty: "Empty",
	endDate: "End date",
	enterFullscreen: "Enter fullscreen",
	error: "Error",
	exitFullscreen: "Exit fullscreen",
	expandRow: "Expand row",
	filterByColumn: (label) => `Filter by ${label}`,
	filterFrom: "From",
	filterMax: "Max",
	filterMin: "Min",
	filterTo: "To",
	firstPage: "First page",
	goToSlide: (slide, count) => `Go to slide ${slide} of ${count}`,
	hideColumn: "Hide column",
	hidePassword: "Hide password",
	hour: "Hour",
	incompleteDate: "Enter a valid date.",
	increment: "Increment",
	jumpBackwardX: (count) => `Jump back ${count} pages`,
	jumpForwardX: (count) => `Jump forward ${count} pages`,
	lastPage: "Last page",
	loading: "Loading",
	locked: "Locked",
	minute: "Minute",
	month: "Month",
	moreOptions: "More Options",
	mute: "Mute",
	nextDecade: "Next decade",
	nextMonth: "Next month",
	nextPage: "Next page",
	nextSlide: "Next slide",
	nextVideo: "Next Video",
	nextYear: "Next year",
	noData: "No data",
	noOptions: "No options",
	noResults: "No matching results",
	notCompleted: "Not completed",
	now: "Now",
	numCharacters: (num) => {
		if (num === 1) return "1 character";
		return `${num} characters`;
	},
	numCharactersRemaining: (num) => {
		if (num === 1) return "1 character remaining";
		return `${num} characters remaining`;
	},
	numOptionsAvailable: (num) => {
		if (num === 0) return "No options available";
		if (num === 1) return "1 option available";
		return `${num} options available`;
	},
	numOptionsSelected: (num) => {
		if (num === 0) return "No options selected";
		if (num === 1) return "1 option selected";
		return `${num} options selected`;
	},
	numRowsCopied: (num) => num === 1 ? "1 row copied" : `${num} rows copied`,
	numRowsSelected: (num) => num === 1 ? "1 row selected" : `${num} rows selected`,
	optionPosition: (label, position, total) => `${label}, ${position} of ${total}`,
	optionsLoadError: "Options could not be loaded",
	pageXOfY: (page, total) => `Page ${page} of ${total}`,
	pagination: "Pagination",
	pause: "Pause",
	pauseAnimation: "Pause animation",
	pictureInPicture: "Picture in picture",
	pinLeft: "Pin left",
	pinRight: "Pin right",
	play: "Play",
	playAnimation: "Play animation",
	playbackSpeed: "Playback speed",
	playlist: "Playlist",
	pm: "PM",
	previousDecade: "Previous decade",
	previousMonth: "Previous month",
	previousPage: "Previous page",
	previousSlide: "Previous slide",
	previousVideo: "Previous video",
	previousYear: "Previous year",
	progress: "Progress",
	rangeTooLong: (max) => {
		if (max === 1) return "Select a range no longer than 1 day";
		return `Select a range no longer than ${max} days`;
	},
	rangeTooShort: (min) => {
		if (min === 1) return "Select a range at least 1 day long";
		return `Select a range at least ${min} days long`;
	},
	readonly: "Read-only",
	remove: "Remove",
	resetColumns: "Reset columns",
	resize: "Resize",
	resizeColumn: "Resize column",
	rowsPerPage: "Rows per page",
	scrollableRegion: "Scrollable region",
	scrollToEnd: "Scroll to end",
	scrollToStart: "Scroll to start",
	search: "Search",
	second: "Second",
	seek: "Seek",
	seekProgress: (current, duration) => `${current} of ${duration}`,
	selectAColorFromTheScreen: "Select a color from the screen",
	selectAllRows: "Select all rows",
	selected: "Selected",
	selectedDateLabel: (date) => `Selected: ${date}`,
	selectedRangeLabel: (range) => `Selected range: ${range}`,
	selectGroup: "Select group",
	selectionCleared: "Selection cleared",
	selectRow: "Select row",
	showingNofMRows: (shown, total) => `Showing ${shown} of ${total} rows`,
	showingXtoYofZ: (start, end, total) => `${start}\u2013${end} of ${total}`,
	showPassword: "Show password",
	slideNum: (slide) => `Slide ${slide}`,
	sortAscending: "Sort ascending",
	sortColumn: "Sort column",
	sortDescending: "Sort descending",
	startDate: "Start date",
	steps: "Steps",
	stepXOfY: (step, total) => `Step ${step} of ${total}`,
	tagAdded: (tag) => `${tag} added`,
	tagAlreadyAdded: (tag) => `${tag} is already added`,
	tagInputKeyboardHelp: "Press Backspace or Delete to remove this tag.",
	tagRemoved: (tag) => `${tag} removed`,
	time: "Time",
	timeInputKeyboardHelp: "Use arrow keys to change values; press Alt+Down Arrow to open the time picker.",
	today: "Today",
	toggleColorFormat: "Toggle color format",
	tooFewTags: (min) => min === 1 ? "Add at least 1 tag" : `Add at least ${min} tags`,
	tooManyTags: (max) => max === 1 ? "Add no more than 1 tag" : `Add no more than ${max} tags`,
	unmute: "Unmute",
	unpin: "Unpin",
	unpinColumn: "Unpin column",
	videoPlayer: "Video player",
	volume: "Volume",
	year: "Year",
	zoomIn: "Zoom in",
	zoomOut: "Zoom out"
};
registerTranslation(translation);
var en_default = translation;
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.S67PIWQL.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var LocalizeController = class extends LocalizeController$1 {
	lang() {
		if (this.host.didSSR && !this.host.hasUpdated) return this.host.lang || "en";
		return super.lang();
	}
};
registerTranslation(en_default);
// node_modules/@awesome.me/webawesome/dist/chunks/chunk.EGBUT3HG.js
/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */
var WaSpinner = class extends WebAwesomeElement {
	constructor() {
		super(...arguments);
		this.localize = new LocalizeController(this);
	}
	render() {
		return html`
      <svg
        part="base spinner"
        role="progressbar"
        aria-label=${this.localize.term("loading")}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="track" />
        <circle class="indicator" />
      </svg>
    `;
	}
};
WaSpinner.css = spinner_styles_default;
WaSpinner = __decorateClass([customElement("wa-spinner")], WaSpinner);
export { LocalizeController as n, WaSpinner as t };
