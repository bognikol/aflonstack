import * as typestyleTypes from "typestyle/lib/types";
import { Styler } from "stylefire";
interface AflonHtmlElement extends HTMLElement {
    aflonElement?: Element;
    styler?: Styler;
}
export declare type CSSProperties = typestyleTypes.CSSProperties | typestyleTypes.NestedCSSSelectors;
export declare type NestedCSSProperties = typestyleTypes.NestedCSSProperties;
export declare type MediaQuery = typestyleTypes.MediaQuery;
export declare class CSS {
    static class(css: CSSProperties): string;
    static media(mediaQuery: MediaQuery, ...css: NestedCSSProperties[]): NestedCSSProperties;
    static importUrl(url: string): void;
}
export declare type AflonCss = Record<string, CSSProperties>;
export declare type EasingFunc = (value: number) => number;
export declare let Easing: Record<string, EasingFunc>;
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
    animations: PrimitiveAnimationDefintion[];
}
declare type AflonAnimationDefinition = Record<string, AnimationDefinition>;
export declare abstract class Element {
    static style: AflonCss;
    static animations: AflonAnimationDefinition;
    protected _root: AflonHtmlElement;
    protected _style: AflonCss;
    protected _animations: AflonAnimationDefinition;
    constructor();
    protected _createElement(): HTMLElement;
    private _applyAflonStyle;
    protected _setAflonStyle(): void;
    protected _setAflonAnimations(): void;
    getHtmlElement(): HTMLElement;
    append(children: Array<Element>): this;
    prepend(children: Array<Element>): this;
    removeChild(child: Element): this;
    insertAfter(elem: Element): this;
    insertBefore(elem: Element): this;
    children(): Element[];
    empty(): this;
    getChildrenNumber(): number;
    setText(text: string): this;
    getText(): string | null;
    addAttr(attributeName: string, value?: string): this;
    getAttr(attributeName: string): string | null;
    getStringAttr(attributeName: string): string;
    removeAttr(attributeName: string): this;
    hasAttr(attributeName: string): boolean;
    disable(): this;
    enable(): this;
    isEnabled(): boolean;
    addClass(className: string): this;
    addCssClass(css: CSSProperties): this;
    addClasses(classNames: string[]): this;
    removeClass(className: string): this;
    clearClasses(): this;
    setId(id: string): this;
    removeId(): this;
    getInlineCss(): CSSStyleDeclaration;
    setInlineCss(css: CSSProperties): this;
    on(eventName: string, handler: EventListener): this;
    off(eventName: string, handler: EventListener): this;
    raise(eventName: string, args?: Object, bubbles?: boolean): this;
}
export declare class Div extends Element {
}
export declare class Span extends Element {
    protected _createElement(): AflonHtmlElement;
}
export declare class H1 extends Element {
    protected _createElement(): AflonHtmlElement;
}
export declare class H2 extends Element {
    protected _createElement(): AflonHtmlElement;
}
export declare class H3 extends Element {
    protected _createElement(): AflonHtmlElement;
}
export declare class H4 extends Element {
    protected _createElement(): AflonHtmlElement;
}
export declare class H5 extends Element {
    protected _createElement(): AflonHtmlElement;
}
export declare class H6 extends Element {
    protected _createElement(): AflonHtmlElement;
}
export declare class P extends Element {
    protected _createElement(): AflonHtmlElement;
}
export declare class Image extends Element {
    protected _createElement(): AflonHtmlElement;
    setSource(source: string): this;
    getSource(): string | null;
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
export interface IButton extends IInput {
}
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
export declare abstract class Input extends Element implements IInput {
    setReadOnly(readOnly: boolean): this;
    isReadOnly(): boolean;
}
export declare class Button extends Input implements IButton {
    protected _createElement(): AflonHtmlElement;
}
export declare class TextBox extends Input implements ITextBox {
    protected _createElement(): AflonHtmlElement;
    setText(text: string): this;
    getText(): string;
    setPlaceholder(placeholderText: string): this;
    getPlaceholder(): string;
}
export declare class PassBox extends TextBox implements ITextBox {
    protected _createElement(): AflonHtmlElement;
}
export declare class CheckBox extends Input implements IToggableButton {
    protected _createElement(): AflonHtmlElement;
    check(): this;
    uncheck(): this;
    isChecked(): boolean;
}
export declare class RadioButton extends CheckBox implements IRadioButton {
    protected _createElement(): AflonHtmlElement;
    constructor(groupName?: string);
    setGroup(groupName: string): this;
    getGroup(): string | null;
    removeGroup(): this;
}
export declare class SelectBox extends Input implements ISelectBox {
    protected _createElement(): AflonHtmlElement;
    constructor(options?: ISelectOption[]);
    insertOption(option: ISelectOption): this;
    removeOption(optionValue: string): this;
    insertOptions(options: ISelectOption[]): this;
    setSelectedOption(optionValue: string): this;
    getSelectedOption(): ISelectOption;
    getAllOptions(): ISelectOption[];
}
export declare class TextArea extends TextBox implements ITextBox {
    protected _createElement(): AflonHtmlElement;
}
export declare class App {
    static run(root: Element): void;
}
export {};
