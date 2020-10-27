import * as aflon from "aflon";
import AflonStudio from "aflon-studio";

export class TextBox extends aflon.TextBox {}

TextBox.style = {
    "_": {
        "appearance": "none",
        "outline": "none",
        "border": "1px solid lightgray",
        "borderRadius": "10px",
        "height": "30px",
        "fontFamily": "'Source Sans Pro', sans-seruf",
        "color": "gray",
        "padding": "0 10px 0 10px",
        "fontSize": "14px",
        "width": "200px",
        "&:focus": {
            "border": "1px solid dodgerblue"
        }
    }
};

AflonStudio.register({
    class: TextBox
});

export class LabeledTextBox extends aflon.Div implements aflon.ITextBox, aflon.ILabeled
{
    private textBox: TextBox;
    private label: aflon.Div;

    constructor()
    {
        super();

        this.append([
            (this.label = new aflon.Div()),
            (this.textBox = new TextBox())
        ]);

    }
    
    setReadOnly(readOnly: boolean): this
    {
        this.textBox.setReadOnly(readOnly);
        return this;
    }

    isReadOnly(): boolean
    {
        return this.textBox.isReadOnly();
    }

    setText(text: string): this
    {
        this.textBox.setText(text);
        return this;
    }

    getText(): string
    {
        return this.textBox.getText();
    }

    setPlaceholder(placeholderText: string): this
    {
        this.textBox.setPlaceholder(placeholderText);
        return this;
    }
    
    getPlaceholder(): string
    {
        return this.textBox.getPlaceholder();
    }

    setLabel(label: string): this
    {
        this.label.setText(label);
        return this;
    }

    getLabel(): string
    {
        return this.label.getText();
    }
}

LabeledTextBox.style = {};

AflonStudio.register({
    class: LabeledTextBox,
    initializer: element => {
        element.setText("Bogdan Nikolic").setLabel("Full name").setPlaceholder("Something")
    }
});
