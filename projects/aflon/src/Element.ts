import { AflonCss, CSS, CSSProperties } from "./Css";
import { AflonAnimationDefinition, Animation } from "./Animation";
import { Styler } from "stylefire";
import * as popmotion from "popmotion";


export interface AflonHtmlElement extends HTMLElement {
    aflonElement?: Element;
    styler?: Styler;
}

export function isAflonElement(object: any)
{
    if (!object || !object.constructor) return false;
    let aflonElementTag = object.constructor["_aflonElementTag"];
    if (!aflonElementTag) return false;
    return String(aflonElementTag) == "u44qfkX2EK";
}

export abstract class Element {

    private static _aflonElementTag: string = "u44qfkX2EK";

    public static style: AflonCss = {};
    public static animations: AflonAnimationDefinition;

    protected _root: AflonHtmlElement;
    protected _style: AflonCss = {};
    protected _activeClasses: Record<string, string> = {};
    protected _animations: Record<string, Animation> = {};

    constructor() {
        this._root = this._createElement();
        this._root.aflonElement = this;
        this._root.styler = popmotion.styler(this._root);

        this._setAflonAnimations();
        this._setAflonStyle();
        this._applyAflonStyleToOwner();
    }

    protected _createElement(): HTMLElement {
        return document.createElement("div");
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

    protected _setAflonAnimations(): void {
        let animationDefinitions = (this.constructor as any)["animations"];

        for (var animDef in animationDefinitions) {
            this._animations[animDef] = new Animation(animationDefinitions[animDef], this);
        }
    }

    protected _setAflonStyle(): void {
        this._style = (this.constructor as any)["style"];
    }

    animations(animationName: string): Animation
    {
        if (!(animationName in this._animations))
            throw new Error(`Animation with name ${animationName} does not exist at ${this.constructor.name}.`);

        return this._animations[animationName];
    }

    getHtmlElement(): HTMLElement {
        return this._root;
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
                children.push(aflonElement)
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

    disable(): this {
        this.setInlineCss({ pointerEvents: "none" });
        this.addAttr("disabled");
        return this;
    }

    enable(): this {
        this.setInlineCss({ pointerEvents: "auto" });
        this.removeAttr("disabled");
        return this;
    }

    isEnabled(): boolean {
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

    removeId() {
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

    raise(eventName: string, args: Object = {}, bubbles: boolean = false): this {
        this.getHtmlElement().dispatchEvent(new CustomEvent(eventName, { bubbles: bubbles, detail: args }));
        return this;
    }
}

export class Div extends Element { }

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

export class Image extends Element
{
    protected _createElement(): AflonHtmlElement {
        return document.createElement("img");
    }

    setSource(source: string): this {
        this.addAttr("src", source); 
        return this;           
    }

    getSource(): string | null {
        return this.getAttr("src");
    }
}

export interface IInput {
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    setReadOnly(readOnly: boolean): this;
    isReadOnly(): boolean;
    focus(): void;
    blur(): void;
}

export interface ITextBox extends IInput {
    setText(text: string): this;
    getText(): string;
    setPlaceholder(placeholderText: string): this;
    getPlaceholder(): string;
}

export interface IButton extends IInput { }

export interface IToggableButton extends IButton {
    check(): this;
    uncheck(): this;
    isChecked(): boolean;
}

export interface IRadioButton extends IToggableButton {
    setGroup(groupName: string): this;
    getGroup(): string | null;
    removeGroup(): this;
}

export interface ISelectOption {
    value: string;
    text: string;
}

export interface ISelectBox extends IInput {
    insertOption(option: ISelectOption): this;
    removeOption(optionValue: string): this;
    insertOptions(options: ISelectOption[]): this;
    setSelectedOption(optionValue: string): this;
    getSelectedOption(): ISelectOption;
    getAllOptions(): ISelectOption[];
}

export interface ILabeled {
    setLabel(label: string): this;
    getLabel(): string;
}

type ILabeledTextBox        = ITextBox           & ILabeled
type ILabeledButton         = IButton            & ILabeled
type ILabeledToggableButton = IToggableButton    & ILabeled
type ILabeledRadioButton    = IRadioButton       & ILabeled
type ILabeledSelectBox      = IDBCursorWithValue & ILabeled


export abstract class Input extends Element implements IInput
{
    setReadOnly(readOnly: boolean): this {
        if (readOnly) this.addAttr("readonly", "true");          
        else this.addAttr("readonly", "false"); 
        return this;         
    }

    isReadOnly(): boolean {
        return this.getAttr("readonly") == "true";
    }

    focus() {
        this._root.focus();
    }

    blur() {
        this._root.blur();
    }
}

export class Button extends Input implements IButton {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("button");
    }
}

export class TextBox extends Input implements ITextBox {
    protected _createElement(): AflonHtmlElement {
        const textBox = document.createElement("input");
        textBox.setAttribute("type", "text");
        return textBox;
    }

    setText(text: string): this {
        (this._root as HTMLInputElement).value = text;
        return this;
    }

    getText(): string {
        return (this._root as HTMLInputElement).value;    
    }

    setPlaceholder(placeholderText: string): this {
        this.addAttr("placeholder", placeholderText);
        return this;          
    }

    getPlaceholder(): string {
        return this.getStringAttr("placeholder");     
    }
}

export class PassBox extends TextBox implements ITextBox {
    protected _createElement(): AflonHtmlElement {
        const passBox = document.createElement("input");
        passBox.setAttribute("type", "password");
        return passBox;
    }
}

export class CheckBox extends Input implements IToggableButton {
    protected _createElement(): AflonHtmlElement {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        return checkbox;
    }

    check(): this {
        this.addAttr("checked", "true");
        return this;          
    }

    uncheck(): this {
        this.addAttr("checked", "false");
        return this;                        
    }

    isChecked(): boolean {
        return this.getAttr("checked") == "true";
    }
}

export class RadioButton extends CheckBox implements IRadioButton {
    protected _createElement(): AflonHtmlElement {
        const radioButton = document.createElement("input");
        radioButton.setAttribute("type", "radio");
        return radioButton;
    }

    constructor(groupName?: string) {
        super();

        if (groupName)
            this.addAttr("name", groupName);            
    }

    setGroup(groupName: string): this {
        this.addAttr("name", groupName);
        return this;
    }

    getGroup(): string | null {
        return this.getAttr("name");
    }

    removeGroup(): this {
        this.removeAttr("name");
        return this;
    }
}

export class SelectBox extends Input implements ISelectBox {
    protected _createElement(): AflonHtmlElement {
        const select = document.createElement("select");     
        return select;
    }

    constructor(options?: ISelectOption[]) {
        super();

        if (options)
            options.forEach((e) => {
                this.insertOption(e);
            });
    }

    insertOption(option: ISelectOption): this {
        const optionElement = document.createElement("option");
        optionElement.text = option.text;
        optionElement.setAttribute("value", option.value);
        this.getHtmlElement().append(optionElement);
        return this;           
    }

    removeOption(optionValue: string): this {
        let selectIndex = -1;
        const select = (<HTMLSelectElement>this.getHtmlElement());
        for (let i = 0; i < select.options.length; i++){
            if (select.options[i].value == optionValue) 
                selectIndex = i;
        }
        if (selectIndex != -1)
            select.remove(selectIndex);
        return this;
    }

    insertOptions(options: ISelectOption[]): this {
        options.forEach((e) => {
            this.insertOption(e);
        });
        return this;
    }

    setSelectedOption(optionValue: string): this {
        (this._root as HTMLInputElement).value = optionValue;
        return this;
    }

    getSelectedOption(): ISelectOption {
        const select = (<HTMLSelectElement>this.getHtmlElement());
        return {
            value: select.options[select.selectedIndex].value,
            text: select.options[select.selectedIndex].text
        };
    }

    getAllOptions(): ISelectOption[] {
        let options: ISelectOption[] = [];
        const select = (<HTMLSelectElement>this.getHtmlElement());
        for (let i = 0; i < select.options.length; i++){
            options.push({
                value: select.options[i].value,
                text: select.options[i].text
            });
        }
        return options;
    }
}

export class TextArea extends TextBox implements ITextBox {
    protected _createElement(): AflonHtmlElement {
        const textArea = document.createElement("textarea");
        return textArea;
    }
}
