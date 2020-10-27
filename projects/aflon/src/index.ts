import { style, media, cssRaw } from "typestyle";
import * as typestyleTypes from "typestyle/lib/types";
import * as popmotion from "popmotion";
import { Styler } from "stylefire";

interface AflonHtmlElement extends HTMLElement {
    aflonElement?: Element;
    styler?: Styler;
}

export type CSSProperties = typestyleTypes.CSSProperties | typestyleTypes.NestedCSSSelectors;

export type NestedCSSProperties = typestyleTypes.NestedCSSProperties;
export type MediaQuery = typestyleTypes.MediaQuery;


export class CSS {
    static class(css: CSSProperties): string {
        return style(css as typestyleTypes.CSSProperties);
    }

    static media(mediaQuery: MediaQuery, ...css: NestedCSSProperties[]): NestedCSSProperties {
        return media(mediaQuery, ...css);
    }

    static importUrl(url: string): void {
        cssRaw(`@import url('${url}');`);
    }
}

export type AflonCss = Record<string, CSSProperties>;

export type EasingFunc = (value: number) => number;

export let Easing: Record<string, EasingFunc> = {
    linear:      popmotion.easing.linear,
    easeIn:      popmotion.easing.easeIn,
    easeOut:     popmotion.easing.easeOut,
    easeInOut:   popmotion.easing.easeInOut,
    circIn:      popmotion.easing.circIn,
    circOut:     popmotion.easing.circOut,
    circInOut:   popmotion.easing.circInOut,
    backIn:      popmotion.easing.backIn,
    backOut:     popmotion.easing.backOut,
    backInOut:   popmotion.easing.backInOut,
    anticipate:  popmotion.easing.anticipate,
    bounceOut:   popmotion.easing.bounceOut,
    bounceIn:    popmotion.easing.bounceIn,
    bounceInOut: popmotion.easing.bounceInOut
};

export interface AnimationFallBackDefinition {
    target?: string;
    ease?: EasingFunc;
    duration?: number;
    delay?: number;
    elapsed?: number;
    loop?: number;
    flip?: number;
    yoyo?: number;
}

export declare type AnimatableValue = number | string;

export interface PrimitiveAnimationDefintion extends AnimationFallBackDefinition {
    track: keyof typestyleTypes.CSSProperties;
    to: AnimatableValue;
    from?: AnimatableValue;
}

export interface AnimationDefinition extends AnimationFallBackDefinition {
    animations: PrimitiveAnimationDefintion[]
}

class PrimitiveAnimation {
    constructor(animationDefinition: PrimitiveAnimationDefintion, context: Element, durationWithAfterDelay: number = 0) {
        this._animationDefinition = animationDefinition;
        this._context = context;
        this._durationWithAfterDelay = durationWithAfterDelay;
    }

    private _prepeared = false;
    private _animationDefinition: PrimitiveAnimationDefintion;
    private _tweenAnimation: any;
    private _styler: Styler;
    private _durationWithAfterDelay: number;
    private _context: Element;

    private _prepeare() {
        if (this._prepeared) return;

        if (this._animationDefinition.target === undefined ||
            this._animationDefinition.target === "")
            this._styler = (this._context.getHtmlElement() as AflonHtmlElement).styler;
        else
            this._styler = ((this._context as any)[this._animationDefinition.target].getHtmlElement() as AflonHtmlElement).styler;
    
            if (this._animationDefinition.from === undefined)
                this._animationDefinition.from = this._styler.get(this._animationDefinition.track);
    }

    start(): void {
        this._prepeare();

        if (this._tweenAnimation != null) {
            this._tweenAnimation.resume();
            return;
        }

        let totalDuration: number = this._animationDefinition.duration + this._animationDefinition.delay;
        if (totalDuration < this._durationWithAfterDelay)
            totalDuration = this._durationWithAfterDelay;

        this._tweenAnimation =
           popmotion.keyframes({ 
                values: [
                    this._animationDefinition.from as string,
                    this._animationDefinition.from as string,
                    this._animationDefinition.to as string,
                    this._animationDefinition.to as string
                ],
                times: [
                    0, 
                    this._animationDefinition.delay / totalDuration,
                    (this._animationDefinition.delay + this._animationDefinition.duration) / totalDuration,
                    1
                ],
                easings: [popmotion.easing.linear, this._animationDefinition.ease, popmotion.easing.linear],
                duration: totalDuration,
                elapsed: this._animationDefinition.elapsed,
                flip: this._animationDefinition.flip,
                loop: this._animationDefinition.loop,
                yoyo: this._animationDefinition.yoyo
            })
            .start((v: any) => this._styler.set(this._animationDefinition.track, v));
    }

    pause(): void {
        if (!this._tweenAnimation) return;
        this._tweenAnimation.pause();
    }

    reset(): void {
        if (!this._tweenAnimation) return;
        this._tweenAnimation.pause();
        this._tweenAnimation.seek(0);
    }

    reverse(): void {
        if (!this._tweenAnimation) return;
        this._tweenAnimation.seek(1 - this._tweenAnimation.getProgress());
        this._tweenAnimation.reverse();
    }

    getElapsed(): number {
        if (!this._tweenAnimation) return 0;
        return this._tweenAnimation.getElapsed();
    }

    getProgress(): number {
        if (!this._tweenAnimation) return 0;
        return this._tweenAnimation.getProgress();
    }
}

class Animation
{
    constructor(animationDefinition: AnimationDefinition, context: Element) 
    {
        const fallbackAnimationDefinition: AnimationFallBackDefinition = {
            ease:     popmotion.easing.linear,
            duration: 300,
            delay:    0,
            elapsed:  0,
            loop:     0,
            flip:     0,
            yoyo:     0
        };

        if (animationDefinition.target)   fallbackAnimationDefinition.target   = animationDefinition.target;
        if (animationDefinition.ease)     fallbackAnimationDefinition.ease     = animationDefinition.ease;
        if (animationDefinition.duration) fallbackAnimationDefinition.duration = animationDefinition.duration;
        if (animationDefinition.delay)    fallbackAnimationDefinition.delay    = animationDefinition.delay;
        if (animationDefinition.elapsed)  fallbackAnimationDefinition.elapsed  = animationDefinition.elapsed;
        if (animationDefinition.loop)     fallbackAnimationDefinition.loop     = animationDefinition.loop;
        if (animationDefinition.flip)     fallbackAnimationDefinition.flip     = animationDefinition.flip;
        if (animationDefinition.yoyo)     fallbackAnimationDefinition.yoyo     = animationDefinition.yoyo;

        const primitiveAnimationDefinitions: PrimitiveAnimationDefintion[] =
            animationDefinition.animations.map(
                animation => ({ ...fallbackAnimationDefinition, ...animation })
            );

        let maxDuration = 0;

        primitiveAnimationDefinitions.forEach(animation => {
            const fullDuration = + animation.delay + animation.duration;
            if (maxDuration < fullDuration)
                maxDuration = fullDuration;
        });

        this._primitiveAnimations = 
            primitiveAnimationDefinitions.map(
                animDefinition => new PrimitiveAnimation(animDefinition, context, maxDuration)
            );
    }

    private _primitiveAnimations: PrimitiveAnimation[] = [];

    start(): void {
        this._primitiveAnimations.forEach(animation => animation.start());
    }

    pause(): void {
        this._primitiveAnimations.forEach(animation => animation.pause());
    }

    reset(): void {
        this._primitiveAnimations.forEach(animation => animation.reset());
    }

    reverse(): void {
        this._primitiveAnimations.forEach(animation => animation.reverse());
    }

    getElapsed(): number {
        if (this._primitiveAnimations.length == 0)
            return 0;
        
        return this._primitiveAnimations[0].getElapsed();
    }

    getProgress(): number {
        if (this._primitiveAnimations.length == 0)
            return 0;
    
        return this._primitiveAnimations[0].getProgress();   
    }
}

type AflonAnimationDefinition = Record<string, AnimationDefinition>;

export function isAflonElement(object: any)
{
    if (!object || !object.constructor) return false;
    let aflonElementTag = object.constructor["_aflonElementTag"];
    if (!aflonElementTag) return false;
    return String(aflonElementTag) == "u44qfkX2EK";
}

export class Element {

    private static _aflonElementTag: string = "u44qfkX2EK";

    public static style: AflonCss;
    public static animations: AflonAnimationDefinition;

    protected _root: AflonHtmlElement;
    protected _style: AflonCss;
    protected _animations: AflonAnimationDefinition;

    constructor() {
        this._root = this._createElement();
        this._root.aflonElement = this;
        this._root.styler = popmotion.styler(this._root);

        this._setAflonStyle();
        this._setAflonAnimations();
        setTimeout(() => this._applyAflonStyle(), 0);
    }

    protected _createElement(): HTMLElement {
        return document.createElement("div");
    }

    private _applyAflonStyle(): this {
        if (!this._style) return this;

        for (let key in this._style) {
            if (key == "_") {
                this.addCssClass(this._style[key]);
                continue;
            }

            if (!this.hasOwnProperty(key)) continue;

            let element = (this as any)[key] as Element;

            if (!element.getHtmlElement || 
                !element.getHtmlElement())
                continue;

            element.addCssClass(this._style[key]);
        }
        return this;
    }

    protected _setAflonStyle() 
    {
        this._style = (this.constructor as any)["style"];
    };

    protected _setAflonAnimations(): void {
        this._animations = (this.constructor as any)["animations"];

        for (var animDef in this._animations) {
            (this as any)[animDef] = new Animation(this._animations[animDef], this);
        }
    }

    getHtmlElement(): HTMLElement {
        return this._root;
    }

    append(children: Array<Element>): this {
        children.forEach(child => this._root.appendChild(child._root));
        return this;
    }

    prepend(children: Array<Element>): this {
        children.reverse().forEach(child => this._root.prepend(child._root));
        return this;
    }

    removeChild(child: Element): this {
        this._root.removeChild(child._root);
        return this;
    }

    insertAfter(elem: Element): this {
        this._root.insertBefore(elem._root, this._root.nextElementSibling);
        return this;
    }
    
    insertBefore(elem: Element): this {
        this._root.insertBefore(elem._root, this._root);
        return this;
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

export class App {
    static run(root: Element, rootId: string = null): void {
        if (rootId == null)
        {
            document.body.appendChild(root.getHtmlElement());
            return;
        }

        let element = document.getElementById(rootId);
        if (element) 
            element.appendChild(root.getHtmlElement());
        else
            throw new Error(`Error running Aflon application. Cannot find root element with id ${rootId}.`);
    }
}
