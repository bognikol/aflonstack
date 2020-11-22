import { Element, AflonHtmlElement } from "./Element";

export interface IInput {
    eventChange: string;
    eventInput: string;

    setEnabled(enabled: boolean): this;
    getEnabled(): boolean;
    setReadOnly(readOnly: boolean): this;
    getReadOnly(): boolean;
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
    eventChecked: string;

    setChecked(checked: boolean): this;
    getChecked(): boolean;
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
    eventSelected: string;

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

export type Validator = (input: any) => boolean;

export interface IValidateable {
    addValidators(validators: Validator[]): this;
    validate(): boolean;
}

export abstract class AbstractInput extends Element implements IInput {
    eventChange: string = "change";
    eventInput: string  = "input";

    abstract setEnabled(enabled: boolean): this;
    abstract getEnabled(): boolean;
    abstract setReadOnly(readOnly: boolean): this;
    abstract getReadOnly(): boolean;
    abstract focus(): void;
    abstract blur(): void;
}

export abstract class AbstractTextBox extends AbstractInput implements ITextBox {
    abstract setText(text: string): this;
    abstract getText(): string;
    abstract setPlaceholder(placeholderText: string): this;
    abstract getPlaceholder(): string;
}

export abstract class AbstractButton extends AbstractInput implements IButton { }

export abstract class AbstractToggableButton extends AbstractInput implements IToggableButton {
    eventChecked: string = "checked";

    abstract setChecked(checked: boolean): this;
    abstract getChecked(): boolean;
}

export abstract class AbstractRadioButton extends AbstractToggableButton implements IToggableButton {
    abstract setGroup(groupName: string): this;
    abstract getGroup(): string | null;
    abstract removeGroup(): this;
}

export abstract class AbstractSelectBox extends AbstractInput implements ISelectBox {
    eventSelected: string = "selected";

    abstract insertOption(option: ISelectOption): this;
    abstract removeOption(optionValue: string): this;
    abstract insertOptions(options: ISelectOption[]): this;
    abstract setSelectedOption(optionValue: string): this;
    abstract getSelectedOption(): ISelectOption;
    abstract getAllOptions(): ISelectOption[];
}

export abstract class Input extends Element implements IInput, AbstractInput {
    eventChange: string = "change";
    eventInput: string  = "input";
    
    setReadOnly(readOnly: boolean): this {
        if (readOnly) this.addAttr("readonly", "true");
        else this.addAttr("readonly", "false");
        return this;
    }

    getReadOnly(): boolean {
        return this.getAttr("readonly") == "true";
    }

    focus(): void {
        this._root.focus();
    }

    blur(): void {
        this._root.blur();
    }
}

export class Button extends Input implements IButton, AbstractButton {
    protected _createElement(): AflonHtmlElement {
        return document.createElement("button");
    }
}

export class TextBox extends Input implements ITextBox, AbstractTextBox {
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

    protected _createElement(): AflonHtmlElement {
        const textBox = document.createElement("input");
        textBox.setAttribute("type", "text");
        return textBox;
    }
}

export class PassBox extends TextBox implements ITextBox, AbstractTextBox {
    protected _createElement(): AflonHtmlElement {
        const passBox = document.createElement("input");
        passBox.setAttribute("type", "password");
        return passBox;
    }
}

export class CheckBox extends Input implements IToggableButton, AbstractToggableButton {
    public eventChecked = "checked";

    setChecked(checked: boolean): this {
        if (checked) {
            this.addAttr("checked", "true");
        } else {
            this.addAttr("checked", "false");
        }

        return this;
    }

    getChecked(): boolean {
        return this.getAttr("checked") == "true";
    }

    protected _createElement(): AflonHtmlElement {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener("input", () => this.raise(this.eventChecked));
        return checkbox;
    }
}

export class RadioButton extends CheckBox implements IRadioButton, AbstractRadioButton {
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

    protected _createElement(): AflonHtmlElement {
        const radioButton = document.createElement("input");
        radioButton.setAttribute("type", "radio");
        return radioButton;
    }
}

export class SelectBox extends Input implements ISelectBox, AbstractSelectBox {
    public eventSelected = "selected";

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
        const select = (<HTMLSelectElement>(this.getHtmlElement()));
        for (let i = 0; i < select.options.length; i++) {
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
        const select = (<HTMLSelectElement>(this.getHtmlElement()));
        return {
            value: select.options[select.selectedIndex].value,
            text: select.options[select.selectedIndex].text
        };
    }

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

export class TextArea extends TextBox implements ITextBox, AbstractTextBox {
    protected _createElement(): AflonHtmlElement {
        const textArea = document.createElement("textarea");
        return textArea;
    }
}
