import * as stylefire from "stylefire";
import * as popmotion from "popmotion";

import { AflonCss, CSS, CSSProperties } from "./Css";
import { AflonAnimationDefinition, Animation } from "./Animation";

/**
 * Extension of HTMLElement which contains reference to aflon.Element owner.
 *
 * @remarks
 * When aflon.Element creates underlining HTMLElement, it appends to it property
 * aflonElement which contains reference aflon.Element owner. This way HTML element and
 * aflon.Element are tightly coupled as both have single reference to each
 * other.
 */
export interface AflonHtmlElement extends HTMLElement {
    /** Reference to aflon.Element owner. */
    aflonElement?: Element;
    /** Internal. Not to be used. */
    styler?: stylefire.Styler;
}

/**
 * Returns true if object is an aflon.Element. Otherwise returns false.
 * @param object - arbitrary variable to be checked if it is an aflon.Element.
 */
export function isAflonElement(object: any): boolean {
    if (!object || !object.constructor) return false;
    let aflonElementTag = object.constructor["_aflonElementTag"];
    if (!aflonElementTag) return false;
    return String(aflonElementTag) == "u44qfkX2EK";
}

/**
 * Extracts aflon.Element that raised event from Event object, if any.
 * If missing returns null.
 * @param e - Event object
 */
export function getAflonTarget(e: Event): Element {
    if (!e.target.hasOwnProperty("aflonElement")) return null;
    return <Element>(<AflonHtmlElement>(e.target)).aflonElement;
}

/**
 * Extracts aflon.Element that raised event from Event object, if it is present
 * and if it is of type T. Otherwise returns null.
 * @param e - Event object
 */
export function typeAflonTarget<T extends Element = Element>(e: Event, elementType: new(...args: Array<any>) => T): T {
    if (!e.target.hasOwnProperty("aflonElement")) return null;
    let element = (<AflonHtmlElement>(e.target)).aflonElement;
    if (element instanceof elementType) return element;
    return null;
}

/**
 * Represents an entity which can raise events.
 */
export interface IEventable {
    /**
     * Subscribes EventListener to be called when event with eventName name is raised.
     * @param eventName - string identifier of event type.
     * @param handler - EventListener to be called when event is raised.
     */
    on(eventName: string, handler: EventListener): this;
    /**
     * Unsubscribes EventListener to be called when event with eventName name is raised.
     * @param eventName - string identifier of event.
     * @param handler - EventListener to be unsubscribed. EventListener needs to be
     * a function with identity and proper binding, eg. not an unnamed function.
     */
    off(eventName: string, handler: EventListener): this;
    /**
     * Raises an event.
     * @param eventName - string identifier of event type.
     * @param args - Additional parameters of custom event.
     * @param bubbles - Specifies if event should bubble up.
     */
    raise(eventName: string, args: Record<string, unknown>, bubbles: boolean): this;
}

/**
 * Represents UI component.
 *
 * @remarks
 * aflon.Element is an abstract class which represent a UI component. It is tightly
 * coupled with underlying wrapped HTMLElement. In further text, term 'associated HTMLElement'
 * refers to this HTMLElement.
 */
export abstract class Element implements IEventable {

    public static style: AflonCss = {};
    public static animations: AflonAnimationDefinition;

    private static _aflonElementTag: string = "u44qfkX2EK";

    //#region EVENT VARIABLES
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
    //#endregion

    private _root: AflonHtmlElement;
    private _style: AflonCss = {};
    private _activeClasses: Record<string, string> = {};
    private _animations: Record<string, Animation> = {};
    private _inDom: boolean = false;
    private _inlineStyleDisplayToRestore: string = null;

    constructor() {
        this._root = this._createElement();
        this._root.aflonElement = this;
        this._root.styler = popmotion.styler(this._root);

        this._setAflonAnimations();
        this._setAflonStyle();
        this._applyAflonStyleToOwner();
    }

    /**
     * Returns HTMLElement associated with this aflon.Element.
     */
    getHtmlElement(): HTMLElement {
        return this._root;
    }

    /**
     * Returns Animation object generated from Element.animation definition.
     * @param animationName - string identifier of animation as specified in definition.
     *
     * @remarks
     * If Animation with given name is not found, an Error is thrown. This function
     * always returns same object for same string animation name.
     */
    animations(animationName: string): Animation {
        if (!(animationName in this._animations))
            throw new Error(`Animation with name ${animationName} does not exist at ${this.constructor.name}.`);

        return this._animations[animationName];
    }

    /**
     * Appends Array of aflon.Elements to children.
     * @param children - Array of aflon.Elements to be appended.
     */
    append(children: Array<Element>): this {
        children.forEach(child => this._root.appendChild(child._root));
        this._applyAflonStyleToChildren();
        children.forEach(child => child._reportDomChange(this._inDom));
        return this;
    }

    /**
     * Prepends Array of aflon.Elements to children.
     * @param children - Array of aflon.Elements to be prepended.
     */
    prepend(children: Array<Element>): this {
        children.reverse().forEach(child => this._root.prepend(child._root));
        this._applyAflonStyleToChildren();
        children.forEach(child => child._reportDomChange(this._inDom));
        return this;
    }

    /**
     * Removes aflon.Element from list of its children.
     * @param child - aflon.Element to be removed.
     */
    removeChild(child: Element): this {
        this._root.removeChild(child._root);
        this._removeAflonStyleFromChild(child);
        child._reportDomChange(false);
        return this;
    }

    /**
     * Inserts aflon.Element as a sibling after this element.
     * @param elem - aflon.Element to be inserted.
     */
    insertAfter(elem: Element): this {
        let parent = this.parent();
        if (parent == null) return;
        parent._root.insertBefore(elem._root, this._root.nextElementSibling);
        parent._applyAflonStyleToChildren();
        elem._reportDomChange(parent._inDom);
        return this;
    }

    /**
     * Inserts aflon.Element as a sibling before this element.
     * @param elem - aflon.Element to be inserted.
     */
    insertBefore(elem: Element): this {
        let parent = this.parent();
        if (parent == null) return;
        parent._root.insertBefore(elem._root, this._root);
        parent._applyAflonStyleToChildren();
        elem._reportDomChange(parent._inDom);
        return this;
    }

    /**
     * Returns aflon.Element (if any) which is parent of this element.
     *
     * @remarks
     * If aflon.Element does not have a parent (eg. a root node), null is returned.
     */
    parent(): Element {
        let parentElement: AflonHtmlElement = this._root.parentElement as AflonHtmlElement;
        if (!parentElement || !parentElement.aflonElement) return null;
        return parentElement.aflonElement;
    }

    /**
     * Returns children of this aflon.Element. Only children created
     * by aflon will be returned. If a child is added using native
     * DOM manipulation, it will be skipped.
     */
    children(): Element[] {
        if (this._root.children.length == 0) return [];

        let children: Array<Element> = [];
        this._root.childNodes.forEach(child => {
            const aflonElement = (child as AflonHtmlElement).aflonElement;
            if (aflonElement)
                children.push(aflonElement);
        });

        return children;
    }

    /**
     * Removes all children and content of this aflon.Element.
     *
     * @remarks
     * Default implementation sets innerHTML property of associated HTMLElement to
     * empty string.
     */
    empty(): this {
        this.children().forEach(child => child._reportDomChange(false));
        this._root.innerHTML = "";
        return this;
    }

    /**
     * Returns number of children of this aflon.Element.
     */
    getChildrenNumber(): number {
        return this._root.children.length;
    }

    /**
     * Sets text associated with this aflon.Element.
     * @param text - Text to be set.
     *
     * @remarks
     * Default implementation sets property textContent of associated HTMLElement.
     * Some Input components have this function overridden.
     */
    setText(text: string): this {
        this._root.textContent = text;
        return this;
    }

    /**
     * Returns text associated with this aflon.Element.
     *
     * @remarks
     * Default implementation returns property textContent of associated HTMLElement.
     * Some Input components have this function overridden.
     */
    getText(): string {
        if (this._root.textContent == null)
            return "";

        return this._root.textContent;
    }

    /**
     * Adds attribute to associated HTMLElement.
     * @param attributeName - Name of attribute to be added.
     * @param value - Value of attribute. Default value is empty string.
     */
    addAttr(attributeName: string, value: string = ""): this {
        this._root.setAttribute(attributeName, value);
        return this;
    }

    /**
     * Returns value of attribute of associated HTMLElement if present, otherwise returns null.
     * @param attributeName - Name of attribute whose value to be returned.
     */
    getAttr(attributeName: string): string | null {
        return this._root.getAttribute(attributeName);
    }

    /**
     * Returns value of attribute of associated HTMLElement if present, otherwise returns empty string.
     * @param attributeName - Name of attribute whose value to be returned.
     */
    getStringAttr(attributeName: string): string {
        const attrValue = this._root.getAttribute(attributeName);
        if (attrValue == null) return "";
        return <string>attrValue;
    }

    /**
     * Removes attribute from associated HTMLElement.
     * @param attributeName - Name of attribute to be removed.
     */
    removeAttr(attributeName: string): this {
        this._root.removeAttribute(attributeName);
        return this;
    }

    /**
     * Returns true if attribute is present in associated HTMLElement.
     * @param attributeName - Name of attribute to be checked.
     */
    hasAttr(attributeName: string): boolean {
        return this._root.hasAttribute(attributeName);
    }

    /**
     * Adds class to associated HTMLElement.
     * @param className - Class name to be added.
     */
    addClass(className: string): this {
        this._root.classList.add(className);
        return this;
    }

    /**
     * Automatically creates CSS class from CSSProperties and adds class to associated HTMLElement.
     * @param css - CSSProperties object to be registered as CSS class and added.
     */
    addCssClass(css: CSSProperties): this {
        this.addClass(CSS.class(css));
        return this;
    }

    /**
     * Adds classes to associated HTMLElement.
     * @param classNames - Array of class names to be added.
     */
    addClasses(classNames: string[]): this {
        classNames.forEach(className => this.addClass(className));
        return this;
    }

    /**
     * Removes class from list of classes of associated HTMLElement.
     * @param className - Class name to be removed.
     */
    removeClass(className: string): this {
        this._root.classList.remove(className);
        return this;
    }

    /**
     * Removes all classes from associated HTMLElement.
     */
    clearClasses(): this {
        this._root.className = "";
        return this;
    }

    /**
     * Returns Array of copies of class names of associated HTMLElement.
     */
    getClasses(): Array<string> {
        let classes: Array<string> = [];
        this._root.classList.forEach(cls => classes.push(cls));
        return classes;
    }

    /**
     * Sets id attribute to associated HTMLElement.
     * @param id - String identifier to be set as id.
     */
    setId(id: string): this {
        this._root.id = id;
        return this;
    }

    /**
     * Removes id attribute from associated HTMLElement, if any.
     */
    removeId(): this {
        this.removeAttr("id");
        return this;
    }

    /**
     * Returns inline style of associated HTMLElement.
     */
    getInlineCss(): CSSStyleDeclaration {
        return this._root.style;
    }

    /**
     * Sets values from CSSProperties object to inline style of associated HTMLElement.
     * @param css - CSSProperties object to be applied to inline style.
     */
    setInlineCss(css: CSSProperties): this {
        for (let key in css) {
            this._root.style[key as any] = (css as any)[key];
        }
        return this;
    }

    /**
     * Hides or unhides aflon.Element by manipulating display property of inline CSS style.
     *
     * @param visibility - Specifies whether aflon.Element should be visible.
     *
     * @remarks
     * When visible is false, value of display property of inline CSS style is cached
     * and then set to 'none'. When visible is false, value of display property of inline
     * CSS style is restored to original value.
     *
     * Setting visibility to true does not guarantee that element will be visible,
     * only that it will undo effects of setting visibility to false.
     */
    setVisibility(visible: boolean): this {
        if (!visible) {
            let inlineDisplay = this.getInlineCss()["display"];

            if (inlineDisplay == "none") return this;

            this._inlineStyleDisplayToRestore = inlineDisplay;
            this.setInlineCss({ display: "none" });
        } else {
            if (this._inlineStyleDisplayToRestore == null) return this;

            if (this._inlineStyleDisplayToRestore == "")
                this.getInlineCss().removeProperty("display");
            else
                this.setInlineCss({ display: this._inlineStyleDisplayToRestore });

            this._inlineStyleDisplayToRestore = null;
        }

        return this;
    }

    /**
     * Gets whether aflon.Element is hidden using setHidden method.
     */
    getVisibility(): boolean {
        return this._inlineStyleDisplayToRestore == null;
    }

    /**
     * Adds EventListener for specific event which is to be raised by associated HTMLElement.
     * @param eventName - String identifier of event type.
     * @param handler - EventListener to be added.
     *
     * @remarks
     * EventListener receives single argument which the same object generated by native eventing
     * system for event.
     */
    on(eventName: string, handler: EventListener): this {
        this.getHtmlElement().addEventListener(eventName, handler);
        return this;
    }

    /**
     * Removes EventListener for specific event which is to be raised by associated HTMLElement.
     * @param eventName - String identifier of event type.
     * @param handler - EventListener to be added.
     */
    off(eventName: string, handler: EventListener): this {
        this.getHtmlElement().removeEventListener(eventName, handler);
        return this;
    }

    /**
     * Raises a custom event upon associated HTMLElement.
     * @param eventName - String identifier of event type.
     * @param args - Object represents additional data of event.
     * @param bubbles - Specifies if event should bubble up the UI tree.
     *
     * @remarks
     * This function use native mechanism for raising events upon HTMLElements.
     * EventListener receives single argument which the same object generated
     * by native eventing system for event. Additional data of custom event can
     * be accessed through this object by examining property detail of EventListener's
     * argument.
     */
    raise(eventName: string, args: Record<string, unknown> = {}, bubbles: boolean = false): this {
        this.getHtmlElement().dispatchEvent(new CustomEvent(eventName, { bubbles: bubbles, detail: args }));
        return this;
    }

    /**
     * Called just after aflon.Element is inserted in DOM of active document.
     *
     * @remarks
     * This method is called only if insertion of element is initiated via
     * Element.prepend, Element.append, Element.insertAfter or iElement.insertBefore
     * methods as well as when aflon.App.run is called.
     */
    protected _onEnteringDom(): void {
        return;
    }

    /**
     * Called just before aflon.Element is removed from DOM of active document.
     *
     * @remarks
     * This method is called only if removal of element is initiated via
     * Element.removeChild or Element.empty.
     */
    protected _onLeavingDom(): void {
        return;
    }

    private _reportDomChange(inDom: boolean): void {
        if (this._inDom == inDom) return;

        this._inDom = inDom;

        if (this._inDom)
            this._onEnteringDom();
        else
            this._onLeavingDom();

        this.children().forEach(child => child._reportDomChange(this._inDom));
    }

    private _setAflonAnimations(): void {
        let animationDefinitions = (this.constructor as any)["animations"];

        for (let animDef in animationDefinitions) {
            this._animations[animDef] = new Animation(animationDefinitions[animDef], this);
        }
    }

    private _setAflonStyle(): void {
        this._style = (this.constructor as any)["style"];
    }

    private _applyAflonStyleToOwner(): void {
        if (!this._style["_"]) return;

        let className = CSS.class(this._style["_"]);
        this.addClass(className);
    }

    private _applyAflonStyleToChildren(): void {
        for (let key in this._style) {
            if (key == "_") continue;
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

    /**
     * Creates and returns HTMLElement which is to be associated with aflon.Element.
     *
     * @remarks
     * This is the key function which is to be implemented by subclasses of aflon.Element.
     * If developer wants to implement his own specific types, he needs to provide implementation
     * for this function. This function, for example, returns HTMLElement with tag 'div' in case
     * of aflon.Div, etc.
     *
     * This function is automatically called in constructor of aflon.Element.
     */
    protected abstract _createElement(): HTMLElement;
}

/**
 * Represents div element.
 */
export class Div extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("div");
    }
}

/** Represents span element. */
export class Span extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("span");
    }
}

/** Represents h1 element. */
export class H1 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h1");
    }
}

/** Represents h2 element. */
export class H2 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h2");
    }
}

/** Represents h3 element. */
export class H3 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h3");
    }
}

/** Represents h4 element. */
export class H4 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h4");
    }
}

/** Represents h5 element. */
export class H5 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h5");
    }
}

/** Represents h6 element. */
export class H6 extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("h6");
    }
}

/** Represents p element. */
export class P extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("p");
    }
}

/** Represents br element. */
export class Br extends Element {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("br");
    }
}

/** Represents a element. */
export class A extends Element {
    /** Sets href (target url) attribute of of associated a element. */
    setHref(url: string): this {
        this.addAttr("href", url);
        return this;
    }

    /** Gets href (target url) attribute of of associated a element. */
    getHref(): string {
        return this.getAttr("href");
    }

    /** Sets whether link should be open in new window. */
    setOpenInNewWindow(openInNewWindow: boolean): this {
        if (openInNewWindow) this.addAttr("target", "_blank");
        else this.removeAttr("target");

        return this;
    }

    /** Gets whether link should be open in new window. */
    getOpenInNewWindow(): boolean {
        return this.getAttr("target") == "_blank";
    }

    protected _createElement(): AflonHtmlElement {
        return document.createElement("a");
    }
}

/** Represents img element. */
export class Image extends Element {
    /**
     * Sets 'src' attribute to associated img element.
     * @param source - Path to image source.
     */
    setSource(source: string): this {
        this.addAttr("src", source);
        return this;
    }

    /**
     * Returns 'src' attribute of associated img element if present, or null otherwise.
     */
    getSource(): string | null {
        return this.getAttr("src");
    }

    protected _createElement(): AflonHtmlElement {
        return document.createElement("img");
    }
}
