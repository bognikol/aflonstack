import * as aflon from "aflon";
import AflonStudio from "aflon-studio";

import * as defaults from "../defaults";

export default class LabeledTextBox extends aflon.Input implements aflon.AbstractTextBox
{
    private textBox: aflon.AbstractTextBox;
    private placeholder: aflon.Div;

    constructor()
    {
        super();

        this.append([
            (this.placeholder = new aflon.Div()),
            (this.textBox = new defaults.TextBox())
                .on("focus", () => this.onTextBoxFocus())
                .on("blur",  () => this.onTextBoxBlur())
        ])
        .on("click", () => this.onClick())
    }
    
    onClick(): void
    {
        this.textBox.focus();
    }

    onTextBoxBlur(): void
    {
        this.animations("focusOut").start();
        if (this.textBox.getText().length == 0) {
            this.animations("toEmpty").start();
        }
    }

    onTextBoxFocus(): void
    {
        this.animations("focusIn").start();
        if (this.textBox.getText().length == 0){
            this.animations("fromEmpty").start();
        }
    }

    focus(): void
    {
        this.getHtmlElement().focus();
    }

    blur(): void
    {
        this.getHtmlElement().blur();
    }

    setReadOnly(readOnly: boolean): this
    {
        this.textBox.setReadOnly(readOnly);
        return this;
    }

    getReadOnly(): boolean
    {
        return this.textBox.getReadOnly();
    }

    setText(text: string): this
    {
        this.textBox.setText(text);
        if (!text || text.length == 0)
            this.animations("toEmpty").toEnd();
        else
            this.animations("fromEmpty").toEnd();

        return this;
    }

    getText(): string
    {
        return this.textBox.getText();
    }

    setPlaceholder(placeholderText: string): this
    {
        this.placeholder.setText(placeholderText);
        return this;
    }
    
    getPlaceholder(): string
    {
        return this.placeholder.getText();
    }
}

LabeledTextBox.style = {
    "_": {
        "fontFamily": "'Source Sans Pro', sans-serif",
        "display": "flex",
        "flexFlow": "column nowrap",
        "alignItems": "stretch",
        "height": "43px",
        "borderRadius": "10px",
        "boxShadow": "0px 2px 6px 0px rgba(0,0,0,0.1);",
        "padding": "10px",
        "background": "white",
        "cursor": "text"
    },
    "placeholder": {
        "fontSize": "15px",
        "position": "absolute",
        "zIndex": 1,
        "color": "#C4C4C4",
        "fontWeight": 300,
        "top": "12px",
        "right": "10px",
        "left": "15px"
    },
    "textBox": {
        "border": "0",
        "outline": "none",
        "borderRadius": "0",
        "position": "absolute",
        "bottom": "0",
        "fontWeight": 300,
        "fontSize": "16px",
        "color": "#AAA",
        "right": "10px",
        "left": "10px",
        "width": "90%",
        "padding": "0",
        "opacity": "0",
        "&:focus": {
            "border": "none"
        },
        "&::placeholder": {
            "color": "transparent"
        }
    }
};

LabeledTextBox.animations = {
    "focusIn": {
        "duration": 350,
        "ease": "circOut",
        "animations": [
            {
                "track": "boxShadow",
                "to": "0px 6px 14px 0px rgba(0,0,0,0.2)"
            },
            {
                "track": "transform",
                "to": "scale(1.1, 1.1)",
                "from": "scale(1.0, 1.0)"
            }
        ]
    },
    "fromEmpty": {
        "ease": "linear",
        "duration": 350,
        "animations": [
            {
                "target": "placeholder",
                "track": "top",
                "to": "4px",
                "ease": "circOut"
            },
            {
                "target": "placeholder",
                "track": "color",
                "to": "#777",
                "ease": "linear"
            },
            {
                "target": "placeholder",
                "track": "fontSize",
                "to": "11px",
                "ease": "circOut"
            },
            {
                "target": "placeholder",
                "track": "left",
                "to": "10px",
                "ease": "circOut"
            },
            {
                "target": "textBox",
                "track": "opacity",
                "to": "1",
            }
        ]
    },
    "focusOut": {
        "duration": 350,
        "ease": "easeOut",
        "animations": [
            {
                "track": "boxShadow",
                "to": "0px 2px 6px 0px rgba(0,0,0,0.2)"
            },
            {
                "track": "transform",
                "to": "scale(1.0, 1.0)",
                "from": "scale(1.1, 1.1)"
            }
        ]
    },
    "toEmpty": {
        "duration": 350,
        "ease": "circOut",
        "animations": [
            {
                "target": "placeholder",
                "track": "color",
                "to": "#C4C4C4",
                "ease": "linear"
            },
            {
                "target": "placeholder",
                "track": "top",
                "to": "12px"
            },
            {
                "target": "placeholder",
                "track": "fontSize",
                "to": "15px"
            },
            {
                "target": "placeholder",
                "track": "left",
                "to": "15px"
            },
            {
                "target": "textBox",
                "track": "opacity",
                "to": "0",
                "ease": "linear"
            }
        ]
    }
};

AflonStudio.register({
    class: LabeledTextBox,
    initializer: element => {
        element.setPlaceholder("Full name")
    }
});
