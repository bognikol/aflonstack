import * as stylefire from "stylefire";
import * as popmotion from "popmotion";

import { AflonCss, CSS, CSSProperties } from "./Css";
import { AflonAnimationDefinition, Animation } from "./Animation";

export interface AflonHtmlElement extends HTMLElement {
    aflonElement?: Element;
    styler?: stylefire.Styler;
}

export function isAflonElement(object: any): boolean {
    if (!object || !object.constructor) return false;
    let aflonElementTag = object.constructor["_aflonElementTag"];
    if (!aflonElementTag) return false;
    return String(aflonElementTag) == "u44qfkX2EK";
}

class ElementEvents {
    // Resource events
    public eventError        = "error";
    public eventAbort        = "abort";
    public eventLoad         = "load";
    public eventBeforeUnload = "beforeunload";
    public eventUnload       = "unload";

    // Focus events
    public eventFocus    = "focus";
    public eventBlur     = "blur";
    public eventFocusIn  = "focusin";
    public eventFocusOut = "focusout";

    // View events
    public eventFullScreenChange = "fullscreenchange";
    public eventFullScreenError  = "fullscreenerror";
    public eventResize           = "resize";
    public eventScroll           = "scroll";

    // Clipboard events
    public eventCut   = "cut";
    public eventCopy  = "copy";
    public eventPaste = "paste";

    // Keyboard events
    public eventKeyDown  = "keydown";
    public eventKeyPress = "keypress";
    public eventKeyUp    = "keyup";

    // Mouse events
    public eventAuxClick    = "auxclick";
    public eventClick       = "click";
    public eventContextMenu = "contextmenu";
    public eventDblClick    = "dblclick";	
    public eventMouseDown   = "mousedown";
    public eventMouseEnter  = "mouseenter";	
    public eventMouseLeave  = "mouseleave";
    public eventMouseMove   = "mousemove";
    public eventMouseOver   = "mouseover";	
    public eventMouseOut    = "mouseout";
    public eventMouseUp	    = "mouseup";
    public eventSelect      = "select";
    public eventWheel       = "wheel";

    // Drag & Drop events
    public eventDrag      = "drag";
    public eventDragEnd   = "dragend";
    public eventDragEnter = "dragenter";
    public eventDragStart = "dragstart";
    public eventDragLeave = "dragleave";
    public eventDragOver  = "dragover";
    public eventDrop      = "drop";
}

export interface IEventable {
    on(eventName: string, handler: EventListener): this;
    off(eventName: string, handler: EventListener): this;
    raise(eventName: string, args: Record<string, unknown>, bubbles: boolean): this;
}

export abstract class Element extends ElementEvents {

    public static style: AflonCss = {};
    public static animations: AflonAnimationDefinition;

    private static _aflonElementTag: string = "u44qfkX2EK";

    protected _root: AflonHtmlElement;
    protected _style: AflonCss = {};
    protected _activeClasses: Record<string, string> = {};
    protected _animations: Record<string, Animation> = {};

    constructor() {
        super();

        this._root = this._createElement();
        this._root.aflonElement = this;
        this._root.styler = popmotion.styler(this._root);

        this._setAflonAnimations();
        this._setAflonStyle();
        this._applyAflonStyleToOwner();
    }

    getHtmlElement(): HTMLElement {
        return this._root;
    }

    animations(animationName: string): Animation {
        if (!(animationName in this._animations))
            throw new Error(`Animation with name ${animationName} does not exist at ${this.constructor.name}.`);

        return this._animations[animationName];
    }

    append(children: Array<Element>): this {
        children.forEach(child => this._root.appendChild(child._root));
        this._applyAflonStyleToChildren();
        return this;
    }

    prepend(children: Array<Element>): this {
        children.reverse().forEach(child => this._root.prepend(child._root));
        this._applyAflonStyleToChildren();
        return this;
    }

    removeChild(child: Element): this {
        this._root.removeChild(child._root);
        this._removeAflonStyleFromChild(child);
        return this;
    }

    insertAfter(elem: Element): this {
        this._root.insertBefore(elem._root, this._root.nextElementSibling);
        let parent = this.parent();
        if (parent) parent._applyAflonStyleToChildren();
        return this;
    }

    insertBefore(elem: Element): this {
        this._root.insertBefore(elem._root, this._root);
        let parent = this.parent();
        if (parent) parent._applyAflonStyleToChildren();
        return this;
    }

    parent(): Element {
        let parentElement: AflonHtmlElement = this._root.parentElement as AflonHtmlElement;
        if (!parentElement || !parentElement.aflonElement) return null;
        return parentElement.aflonElement;
    }

    children(): Element[] {
        let children: Array<Element> = [];
        this._root.childNodes.forEach(child => {
            const aflonElement = (child as AflonHtmlElement).aflonElement;
            if (aflonElement)
                children.push(aflonElement);
        });

        return children;
    }

    empty(): this {
        this._root.innerHTML = "";
        return this;
    }

    getChildrenNumber(): number {
        return this._root.children.length;
    }

    setText(text: string): this {
        this._root.textContent = text;
        return this;
    }

    getText(): string {
        if (this._root.textContent == null)
            return "";

        return this._root.textContent;
    }

    addAttr(attributeName: string, value: string = ""): this {
        this._root.setAttribute(attributeName, value);
        return this;
    }

    getAttr(attributeName: string): string | null {
        return this._root.getAttribute(attributeName);
    }

    getStringAttr(attributeName: string): string {
        const attrValue = this._root.getAttribute(attributeName);
        if (attrValue == null) return "";
        return <string>attrValue;
    }

    removeAttr(attributeName: string): this {
        this._root.removeAttribute(attributeName);
        return this;
    }

    hasAttr(attributeName: string): boolean {
        return this._root.hasAttribute(attributeName);
    }

    setEnabled(enabled: boolean): this {
        if (enabled) {
            this.setInlineCss({ pointerEvents: "auto" });
            this.removeAttr("disabled");
        } else {
            this.setInlineCss({ pointerEvents: "none" });
            this.addAttr("disabled");
        }

        return this;
    }

    getEnabled(): boolean {
        return !this.hasAttr("disabled");
    }

    addClass(className: string): this {
        this._root.classList.add(className);
        return this;
    }

    addCssClass(css: CSSProperties): this {
        this.addClass(CSS.class(css));
        return this;
    }

    addClasses(classNames: string[]): this {
        classNames.forEach(className => this.addClass(className));
        return this;
    }

    removeClass(className: string): this {
        this._root.classList.remove(className);
        return this;
    }

    clearClasses(): this {
        this._root.className = "";
        return this;
    }

    getClasses(): Array<string> {
        let classes: Array<string> = [];
        this._root.classList.forEach(cls => classes.push(cls));
        return classes;
    }

    setId(id: string): this {
        this._root.id = id;
        return this;
    }

    removeId(): this {
        this.removeAttr("id");
        return this;
    }

    getInlineCss(): CSSStyleDeclaration {
        return this._root.style;
    }

    setInlineCss(css: CSSProperties): this {
        for (let key in css) {
            this._root.style[key as any] = (css as any)[key];
        }
        return this;
    }

    on(eventName: string, handler: EventListener): this {
        this.getHtmlElement().addEventListener(eventName, handler);
        return this;
    }

    off(eventName: string, handler: EventListener): this {
        this.getHtmlElement().removeEventListener(eventName, handler);
        return this;
    }

    raise(eventName: string, args: Record<string, unknown> = {}, bubbles: boolean = false): this {
        this.getHtmlElement().dispatchEvent(new CustomEvent(eventName, { bubbles: bubbles, detail: args }));
        return this;
    }

    protected _setAflonAnimations(): void {
        let animationDefinitions = (this.constructor as any)["animations"];

        for (let animDef in animationDefinitions) {
            this._animations[animDef] = new Animation(animationDefinitions[animDef], this);
        }
    }

    protected _setAflonStyle(): void {
        this._style = (this.constructor as any)["style"];
    }

    private _applyAflonStyleToOwner(): void {
        if (!this._style["_"]) return;

        let className = CSS.class(this._style["_"]);
        this.addClass(className);
    }

    private _applyAflonStyleToChildren(): void {
        for (let key in this._style) {
            if (!this.hasOwnProperty(key)) continue;

            let element = (this as any)[key] as Element;

            if (!element.getHtmlElement ||
                !element.getHtmlElement())
                continue;

            let className = CSS.class(this._style[key]);

            if (element.getClasses().indexOf(className) < 0) {
                element.addClass(className);
                this._activeClasses[key] = className;
            }
        }
    }

    private _removeAflonStyleFromChild(child: Element): void {
        for (let key in this._style) {
            if (!this.hasOwnProperty(key)) continue;
            if (!this._activeClasses[key]) continue;

            let element = (this as any)[key] as Element;

            if (element == child) {
                element.removeClass(this._activeClasses[key]);
                break;
            }
        }
    }

    protected abstract _createElement(): HTMLElement;
}

export class Div extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("div");
    }
}

export class Span extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("span");
    }
}

export class H1 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h1");
    }
}

export class H2 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h2");
    }
}

export class H3 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h3");
    }
}

export class H4 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h4");
    }
}

export class H5 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h5");
    }
}

export class H6 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h6");
    }
}

export class P extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("p");
    }
}

export class Image extends Element {
    setSource(source: string): this {
        this.addAttr("src", source);
        return this;
    }

    getSource(): string | null {
        return this.getAttr("src");
    }

    protected _createElement(): AflonHtmlElement {
        return document.createElement("img");
    }
}
