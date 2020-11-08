import * as aflon from "aflon";

export class TypiconButton extends aflon.Element {
    setTypicon(typiconId) {
        this.addClasses(["typcn", `typcn-${typiconId}`]);
        return this;
    }
}

TypiconButton.style = {
    "_": {
        "width": "30px",
        "height": "30px",
        "lineHeight": "30px",
        "textAlign": "center",
        "fontSize": "18px",
        "color": "#444",
        "cursor": "pointer",
        "&:hover": {
            "background": "lightgray"
        },
        "&:active": {
            "paddingTop": "1px"
        },
        "&[disabled]": {
            "color": "#999"
        }
    }
};

export class TextBox extends aflon.TextBox { }

TextBox.style = {
    _: {
        "outline": "0",
        "border": "solid 1px lightgray",
        "fontFamily": "'Source Code Pro', monospace",
        "fontSize": "10px",
        "padding": "0 5px",
        "borderRadius": "3px",
        "color": "#777",
        height: "20px",
        "&::placeholder": {
            "color": "#AAA",
            "fontStyle": "italic"
        }
    }
};

export class SelectBox extends aflon.SelectBox { }

SelectBox.style = {
    "_": {
        "height": "20px",
        "border": "0",
        "background": "lightGray",
        "borderRadius": "3px",
        "fontFamily": "'Source Code Pro', monospace",
        "fontSize": "11px",
        "paddingLeft": "3px",
        "color": "#777",
        "outline": "0",
        "boxShadow": "0px 1px 2px 0px rgba(0,0,0,0.3)"
    },
};
