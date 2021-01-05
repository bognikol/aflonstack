import { Element, AflonHtmlElement } from "./Element";

/**
 * IInput represent general-purpose input.
 */
export interface IInput {
    eventChange: string;
    eventInput: string;

    setText(text: string): this;
    getText(): string;
    setDisabled(enabled: boolean): this;
    getDisabled(): boolean;
    focus(): void;
    blur(): void;
}

/**
 * ITextBox represent a text box or similar text input.
 */
export interface ITextBox extends IInput {
    setReadOnly(readOnly: boolean): this;
    getReadOnly(): boolean;
    setPlaceholder(placeholderText: string): this;
    getPlaceholder(): string;
}

/**
 * IButton represent a clickable button.
 */
export interface IButton extends IInput { }

/**
 * IToggalbeButton represents a switch which can be
 * turned on of off.
 */
export interface IToggableButton extends IButton {
    eventChecked: string;

    setChecked(checked: boolean): this;
    getChecked(): boolean;
}

/**
 * IRadioButton represents a switch in group of other
 * IRadioButtons of which only single can be turned on.
 */
export interface IRadioButton extends IToggableButton {
    setGroup(groupName: string): this;
    getGroup(): string | null;
    removeGroup(): this;
}

/**
 * ISelectOption represent single option in ISelectBox.
 */
export interface ISelectOption {
    value: string;
    text: string;
}

/**
 * ISelectBox represents a list of selectable options
 * (similar to radio button).
 */
export interface ISelectBox extends IInput {
    eventSelected: string;

    insertOption(option: ISelectOption): this;
    removeOption(optionValue: string): this;
    insertOptions(options: ISelectOption[]): this;
    setSelectedOption(optionValue: string): this;
    getSelectedOption(): ISelectOption;
    getAllOptions(): ISelectOption[];
}

/**
 * Represents a component which has name.
 */
export interface ILabeled {
    setLabel(label: string): this;
    getLabel(): string;
}

/**
 * Represents a function which can validate some data.
 */
export type Validator = (input: any) => boolean;

/**
 * Represents an input that can be validated.
 */
export interface IValidateable {
    addValidators(validators: Validator[]): this;
    validate(): boolean;
}

/**
 * AbstractInput is an abstract aflon.Element that inherits IInput.
 */
export abstract class AbstractInput extends Element implements IInput {
    eventChange: string = "change";
    eventInput: string  = "input";

    abstract setText(text: string): this;
    abstract getText(): string;
    abstract setDisabled(enabled: boolean): this;
    abstract getDisabled(): boolean;
    abstract focus(): void;
    abstract blur(): void;
}

/**
 * AbstractTextBox is an abstract aflon.Element that inherits ITextBox.
 */
export abstract class AbstractTextBox extends AbstractInput implements ITextBox {
    abstract setReadOnly(readOnly: boolean): this;
    abstract getReadOnly(): boolean;
    abstract setPlaceholder(placeholderText: string): this;
    abstract getPlaceholder(): string;
}

/**
 * AbstractButton is an abstract aflon.Element that inherits IButton.
 */
export abstract class AbstractButton extends AbstractInput implements IButton { }

/**
 * AbstractToggableButton is an abstract aflon.Element that inherits IToggableButton.
 */
export abstract class AbstractToggableButton extends AbstractInput implements IToggableButton {
    eventChecked: string = "checked";

    abstract setChecked(checked: boolean): this;
    abstract getChecked(): boolean;
}

/**
 * AbstractRadioButton is an abstract aflon.Element that inherits IToggableButton.
 */
export abstract class AbstractRadioButton extends AbstractToggableButton implements IToggableButton {
    abstract setGroup(groupName: string): this;
    abstract getGroup(): string | null;
    abstract removeGroup(): this;
}

/**
 * AbstractSelectBox is an abstract aflon.Element that inherits ISelectBox.
 */
export abstract class AbstractSelectBox extends AbstractInput implements ISelectBox {
    eventSelected: string = "selected";

    abstract insertOption(option: ISelectOption): this;
    abstract removeOption(optionValue: string): this;
    abstract insertOptions(options: ISelectOption[]): this;
    abstract setSelectedOption(optionValue: string): this;
    abstract getSelectedOption(): ISelectOption;
    abstract getAllOptions(): ISelectOption[];
}

/**
 * Represents an Element which is intended to be used as an input.
 *
 * @remarks
 * Input is used to represent HTML input elements like button, text or password input.
 * However, it can represent any Element which is intended to be an Input.
 * Difference between non-Input and Input elements is that Inputs have functions
 * for controling whether they are enabled or not (when Input is disabled it cannot
 * react to mouse events and cannot obtain focus) and functions for granting focus
 * (when input is focused it receives keyboard events). Also, Inputs have two additional
 * events: eventChange and eventInput.
 *
 * When creating your own composite input components, feel free to extend Input class.
 * Input, as base class, creates div element beneath. Be aware, though, that you might
 * need to override Input's functions in order to make use of them.
 */
export class Input extends Element implements IInput, AbstractInput {
    eventChange: string = "change";
    eventInput: string  = "input";

    /**
     * Sets input's text.
     *
     * @remarks
     * Different inputs have this function implemented differently.
     * Base implementation sets value property of associated HTMLElement.
     *
     * @param text - String to be set.
     */
    setText(text: string): this {
        (this.getHtmlElement() as HTMLInputElement).value = text;
        return this;
    }

    /**
     * Gets input's text.
     */
    getText(): string {
        return (this.getHtmlElement() as HTMLInputElement).value;
    }

    /**
     * Enables or disables input.
     *
     * @remarks
     * Default implementation just adds or removes attribute disabled
     * to associated HTMLElement. Derived classes might need to provide
     * their own implementation.
     */
    setDisabled(enabled: boolean): this {
        if (enabled) this.removeAttr("disabled");
        else         this.addAttr("disabled");

        return this;
    }

    /**
     * Returns if input is enabled.
     */
    getDisabled(): boolean {
        return !this.hasAttr("disabled");
    }

    /**
     * Sets focus to input.
     *
     * @remarks
     * If element is in focus, then it receives keyboard events.
     * Note that not every element can be focussable. CSS property
     * 'tab-index' needs to be set if non-input HTMLElement is to be
     * focusable.
     */
    focus(): void {
        this.getHtmlElement().focus();
    }

    /**
     * Removes focus from input.
     *
     * @remarks
     * If element is in focus, then it receives keyboard events.
     * Note that not every element can be focussable. CSS property
     * 'tab-index' needs to be set if non-input HTMLElement is to be
     * focusable.
     */
    blur(): void {
        this.getHtmlElement().blur();
    }

    protected _createElement(): AflonHtmlElement {
        return document.createElement("div");
    }
}

/**
 * Represents button element.
 */
export class Button extends Input implements IButton, AbstractButton {
    setText(text: string): this {
        this.getHtmlElement().textContent = text;
        return this;
    }

    getText(): string {
        if (this.getHtmlElement().textContent == null)
            return "";

        return this.getHtmlElement().textContent;
    }

    protected _createElement(): AflonHtmlElement {
        return document.createElement("button");
    }
}

/** Represents input of type text. */
export class TextBox extends Input implements ITextBox, AbstractTextBox {

    /**
     * Sets placeholder attribute.
     * @param placeholderText - attribute value
     */
    setPlaceholder(placeholderText: string): this {
        this.addAttr("placeholder", placeholderText);
        return this;
    }

    /** Returns value of placeholder attribute. */
    getPlaceholder(): string {
        return this.getStringAttr("placeholder");
    }

    /**
     * Sets or removes readonly attribute.
     *
     * @remarks
     * Readonly attribute is applicable on a subset of HTML input elements.
     * Read-only elements cannot be modified, but, oposed to disabled, can be focussed.
     */
    setReadOnly(readOnly: boolean): this {
        if (readOnly) this.addAttr("readonly");
        else          this.removeAttr("readonly");
        return this;
    }

    /** Returns whether TextBox is readonly. */
    getReadOnly(): boolean {
        return this.hasAttr("readonly");
    }

    protected _createElement(): AflonHtmlElement {
        const textBox = document.createElement("input");
        textBox.setAttribute("type", "text");
        return textBox;
    }
}

/** Represent input of type password. */
export class PassBox extends TextBox implements ITextBox, AbstractTextBox {
    protected _createElement(): AflonHtmlElement {
        const passBox = document.createElement("input");
        passBox.setAttribute("type", "password");
        return passBox;
    }
}

/** Represents input of type checkbox. */
export class CheckBox extends Input implements IToggableButton, AbstractToggableButton {

    /**
     * Indicates that CheckBox has chanaged its checked state.
     *
     * @remarks
     * This event is added in order to deferentiate ToggleButton from generic Input.
     */
    public eventChecked = "checked";

    /** Sets whether the CheckBox is checked or not. */
    setChecked(checked: boolean): this {
        (this.getHtmlElement() as HTMLInputElement).checked = checked;
        return this;
    }

    /** Gets whether the CheckBox is checked or not. */
    getChecked(): boolean {
        return (this.getHtmlElement() as HTMLInputElement).checked ;
    }

    protected _createElement(): AflonHtmlElement {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener("input", () => this.raise(this.eventChecked));
        return checkbox;
    }
}

/** Represents input of type radio.*/
export class RadioButton extends CheckBox implements IRadioButton, AbstractRadioButton {
    constructor(groupName?: string) {
        super();

        if (groupName)
            this.addAttr("name", groupName);
    }

    /**
     * Sets name of radio group. Only sinlge radio button in
     * single radio group can be chacked at time.
     * @param groupName - name of radio group to be set
     */
    setGroup(groupName: string): this {
        this.addAttr("name", groupName);
        return this;
    }

    /** Gets name of radio group or null if not set.*/
    getGroup(): string | null {
        return this.getAttr("name");
    }

    /** Removes radio group from this radio button. */
    removeGroup(): this {
        this.removeAttr("name");
        return this;
    }

    protected _createElement(): AflonHtmlElement {
        const radioButton = document.createElement("input");
        radioButton.setAttribute("type", "radio");
        radioButton.addEventListener("input", () => this.raise(this.eventChecked));
        return radioButton;
    }
}

/** Represents select HTML element. */
export class SelectBox extends Input implements ISelectBox, AbstractSelectBox {
    public eventSelected = "selected";

    /**
     * Creates SelectBox.
     * @param options - list of ISelectOptions to be inserted
     * during creation.
     */
    constructor(options?: ISelectOption[]) {
        super();

        if (options)
            options.forEach((e) => {
                this.insertOption(e);
            });
    }

    /**
     * Inserts single ISelectOption to SelectBox.
     * @param option - ISelectOption to be added.
     */
    insertOption(option: ISelectOption): this {
        const optionElement = document.createElement("option");
        optionElement.text = option.text;
        optionElement.setAttribute("value", option.value);
        this.getHtmlElement().append(optionElement);
        return this;
    }

    /**
     * Removes option with value optionValue from SelectBox.
     * @param optionValue - value of ISelectOption to be removed.
     */
    removeOption(optionValue: string): this {
        let selectIndex = -1;
        const select = (<HTMLSelectElement>(this.getHtmlElement()));
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value == optionValue)
                selectIndex = i;
        }
        if (selectIndex != -1)
            select.remove(selectIndex);
        return this;
    }

    /**
     * Inserts list of ISelectOptions to SelectBox.
     * @param options - list of ISelectOptions to be inserted.
     */
    insertOptions(options: ISelectOption[]): this {
        options.forEach((e) => {
            this.insertOption(e);
        });
        return this;
    }

    /**
     * Sets option to be selected in SelectBox.
     * @param optionValue - value of ISelectOption to be selected.
     */
    setSelectedOption(optionValue: string): this {
        (this.getHtmlElement() as HTMLInputElement).value = optionValue;
        return this;
    }

    /**
     * Returns selected ISelectOption.
     */
    getSelectedOption(): ISelectOption {
        const select = (<HTMLSelectElement>(this.getHtmlElement()));
        return {
            value: select.options[select.selectedIndex].value,
            text: select.options[select.selectedIndex].text
        };
    }

    /**
     * Returns all options in SelectBox.
     */
    getAllOptions(): ISelectOption[] {
        let options: ISelectOption[] = [];
        const select = (<HTMLSelectElement>(this.getHtmlElement()));
        for (let i = 0; i < select.options.length; i++) {
            options.push({
                value: select.options[i].value,
                text: select.options[i].text
            });
        }
        return options;
    }

    protected _createElement(): AflonHtmlElement {
        const select = document.createElement("select");
        select.addEventListener("change", () => this.raise(this.eventSelected));
        return select;
    }
}

/** Represents textarea HTML element. */
export class TextArea extends TextBox implements ITextBox, AbstractTextBox {
    protected _createElement(): AflonHtmlElement {
        const textArea = document.createElement("textarea");
        return textArea;
    }
}
