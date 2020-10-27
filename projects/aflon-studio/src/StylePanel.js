import * as aflon from "aflon";
import * as common from "./CommonControls";

export class NameValuePair extends aflon.Element {
    constructor() {
        super();

        this.append([
            (this.name  = new aflon.TextBox())
                .on("change", () => this.raise("nameValueChange"))
                .setPlaceholder("..."),
            (this.value = new aflon.TextBox())
                .on("change", () => this.raise("nameValueChange"))
        ]);
    }

    setNameValue(nameValue) {
        this.name.setText(nameValue.name);
        this.value.setText(nameValue.value);
        return this;
    }

    getNameValue() {
        return {
            name: this.name.getText(),
            value: this.value.getText()
        };
    }
}

NameValuePair.style = {
    "_": {
        "display": "flex",
        "flexFlow": "row nowrap"
    },
    "name": {
        "flex": "1 1 40%",
        "minWidth": "0",
        "maxWidth": "100px",
        "fontFamily": "'Source Code Pro', monospace",
        "fontSize": "11px",
        "color": "brown",
        "border": "0",
        "outline": "0",
        "background": "0",
        "paddingLeft": "5px",
        "padingRight": "5px",
        "paddingTop": "1px",
        "paddingBottom": "1px"
    },
    "value": {
        "flex": "1 1 60%",
        "minWidth": "0",
        "fontFamily": "'Source Code Pro', monospace",
        "fontSize": "11px",
        "color": "gray",
        "border": "0",
        "outline": "0",
        "background": "0",
        "paddingLeft": "5px",
        "paddingRight": "5px",
        "paddingTop": "1px",
        "paddingBottom": "1px"
    }
};

export class NameValuePanel extends aflon.Element {
    constructor() {
        super();

        this.append([
            new NameValuePair()
                .on("nameValueChange", e => this.onNameValueChange(e)) 
        ])
    }

    onNameValueChange(e) {
        this.raise("nameValuesChange");

        if (this.children()[this.children().length - 1] == e.target.aflonElement) {
            this.append([
                new NameValuePair()
                    .on("nameValueChange", e => this.onNameValueChange(e))
            ]);
            return;
        }

        const pair = e.target.aflonElement.getNameValue();

        if (pair.name == "" && pair.value == "")
            this.removeChild(e.target.aflonElement);
    }

    setNameValues(dictionary) {
        let nameValueControls = Object.keys(dictionary).map(
            key => new NameValuePair()
                .setNameValue({ name: key, value: dictionary[key]})
                .on("nameValueChange", e => this.onNameValueChange(e))
        );

        nameValueControls.push(new NameValuePair().on("nameValueChange", e => this.onNameValueChange(e)));
        
        this
            .empty()
            .append(nameValueControls);
        
        return this;
    }

    getNameValues() {
        const nameValues = {};

        this.children().forEach(nv => {
            const pair = nv.getNameValue();
            if (!pair.name) return;
            nameValues[pair.name] = pair.value;
        })

        return nameValues;
    }

    clear() {
        this.empty();

        this.append([
            new NameValuePair()
                .on("nameValueChange", e => this.onNameValueChange(e)) 
        ])
    }
}

NameValuePanel.style = {
    "_": {
        "display": "flex",
        "flexFlow": "column nowrap",
        "paddingTop": "5px",
        "paddingBottom": "5px"
    }
};

export class SimpleStylePanel extends aflon.Element {
    constructor() {
        super();

        this.default = false;
        this.expanded = true;

        this.append([
            (this.pseudoSelector = new aflon.Div())
                .append([
                    (this.expandButton = new aflon.Div())
                        .setText("▶")
                        .on("click", () => this.onExpandToggle()),
                    (this.pseudoSelectorTextBox = new aflon.TextBox())
                        .setPlaceholder("...")
                        .on("change", () => this.raise("simpleStyleChange")),
                    (this.deleteButton = new aflon.Div())
                        .setText("×")
                        .on("click", () => this.raise("deleteRequested"))
                ]),
            (this.style = new NameValuePanel())
                .on("nameValuesChange", () => this.raise("simpleStyleChange"))
        ]);
    }

    onExpandToggle() {
        this.expanded = !this.expanded;

        if (this.expanded) {
            this.expandButton.setInlineCss({ transform: "rotate(90deg)" });
            this.style.setInlineCss({ display: "flex" });
        } else {
            this.expandButton.setInlineCss({ transform: "rotate(0deg)" });
            this.style.setInlineCss({ display: "none" });
        }
    }

    setDefault() {
        this.default = true;
        this.pseudoSelectorTextBox
            .setText("normal")
            .setReadOnly(true);
        return this;
    }

    isDefault() {
        return this.default;
    }

    setSimpleStyle(style, selector = "normal") {
        if (selector.startsWith("&"))
            selector = selector.substr(1);

        if (selector == "normal") {
            if (!this.default)
                throw new Error("You cannot assign pseudoselector other then 'normal' to default SimpleStyleControl.");
        }
        else {
            if (this.default)
                throw new Error("You cannot assign pseudoselector other then 'normal' to default SimpleStyleControl.");
            this.pseudoSelectorTextBox.setText(selector);
        }

        this.style.setNameValues(style);
        return this;
    }

    getSimpleStyle() {
        if (!this.pseudoSelectorTextBox.getText()) return {};
        if (this.pseudoSelectorTextBox.getText() == "normal") return this.style.getNameValues();

        let simpleStyle = {};
        simpleStyle[`&${this.pseudoSelectorTextBox.getText()}`] = this.style.getNameValues();
        return simpleStyle;
    }

    clear() {
        this.style.clear();

        if (!this.default)
            this.pseudoSelectorTextBox.setText("");
    }
}

SimpleStylePanel.style = {
    "_": {
        "display": "flex",
        "flexFlow": "column nowrap"
    },
    "pseudoSelector": {
        "display": "flex",
        "flexFlow": "row nowrap",
        "height": "20px",
        "background": "lightgray",
        "borderRadius": "3px",
        "color": "#777",
        "margin": "5px",
        "marginBottom": "0px",
        "boxShadow": "0px 1px 2px 0px rgba(0,0,0,0.3)"
    },
    "expandButton": {
        "flex": "0 0 20px",
        "height": "20px",
        "lineHeight": "20px",
        "textAlign": "center",
        "fontSize": "9px",
        "cursor": "pointer",
        "transform": "rotate(90deg)",
        "position": "relative",
        "top": "1px",
        "&:hover": {
            "color": "black"
        }
    },
    "pseudoSelectorTextBox": {
        "padding": "0",
        "flex": "1 1 100px",
        "background": "0",
        "border": "0",
        "outline": "0",
        "fontFamily": "'Source Code Pro', monospace",
        "fontSize": "11px",
        "color": "#777"
    },
    "deleteButton": {
        "flex": "0 0 20px",
        "height": "20px",
        "lineHeight": "20px",
        "textAlign": "center",
        "fontSize": "16px",
        "cursor": "pointer",
        "&:hover": {
            "color": "black"
        }
    },
    "style": {
        "marginLeft": "20px"
    }
};

export class CompositeStylePanel extends aflon.Element {
    constructor() {
        super();

        this.append([
            (this.defaultSimpleStylePanel = new SimpleStylePanel())
                .setDefault()
                .on("simpleStyleChange", e => this.onSimpleStyleChange(e))
                .on("deleteRequested",   e => this.onDeleteRequested(e)),
            new SimpleStylePanel()
                .on("simpleStyleChange", e => this.onSimpleStyleChange(e))
                .on("deleteRequested",   e => this.onDeleteRequested(e))
        ]);
    }

    onSimpleStyleChange(e) {
        this.raise("compositeStyleChange");

        if (this.children()[this.children().length - 1] == e.target.aflonElement) {
            this.append([
                new SimpleStylePanel()
                    .on("simpleStyleChange", e => this.onSimpleStyleChange(e))
                    .on("deleteRequested",   e => this.onDeleteRequested(e))
            ]);
            return;
        }
    }

    onDeleteRequested(e) {
        if (this.children()[this.children().length - 1] == e.target.aflonElement || 
            e.target.aflonElement.isDefault()) {
            e.target.aflonElement.clear();
        } else {
            this.removeChild(e.target.aflonElement);
        }
        
        this.raise("compositeStyleChange");
    }

    setCompositeStyle(style) {
        this.empty();

        let styleCopy = { ...style };

        let simpleStyles = [];

        for (let key in styleCopy) {
            if (typeof styleCopy[key] !== "object") continue;

            simpleStyles.push(
                new SimpleStylePanel()
                    .on("simpleStyleChange", e => this.onSimpleStyleChange(e))
                    .on("deleteRequested",   e => this.onDeleteRequested(e))
                    .setSimpleStyle(style[key], key));
                    
            delete styleCopy[key];
        }

        this.append([
            (this.defaultSimpleStylePanel = new SimpleStylePanel())
                .setDefault()
                .on("simpleStyleChange", e => this.onSimpleStyleChange(e))
                .on("deleteRequested",   e => this.onDeleteRequested(e))
                .setSimpleStyle(styleCopy, "normal")
        ]);

        this.append(simpleStyles);

        this.append([
            new SimpleStylePanel()
                .on("simpleStyleChange", e => this.onSimpleStyleChange(e))
                .on("deleteRequested",   e => this.onDeleteRequested(e))
        ]);
    
        return this;
    }

    getCompositeStyle() {
        let style = {};

        this.children().forEach(nv => {
            style = { ...style, ...nv.getSimpleStyle() };
        });

        return style;
    }
}

CompositeStylePanel.style = {
    _: {
        display: "flex",
        flexFlow: "column nowrap"
    }
};

export class ElementStylePanel extends aflon.Element {
    constructor() {
        super();

        this.expanded = true;

        this.append([
            (this.elementName = new aflon.Div())
                .append([
                    (this.expandButton = new aflon.Div())
                        .setText("▶"),
                    (this.elementNameTextBox = new aflon.TextBox())
                        .setReadOnly(true)
                        .on("mouseenter", () => 
                            this.raise("signifyElementStart", { elementName: this.elementNameTextBox.getText() }))
                        .on("mouseleave",  () => 
                            this.raise("signifyElementStop", { elementName: this.elementNameTextBox.getText() })),
                ])
                .on("click", () => this.onExpandToggle()),
            (this.style = new CompositeStylePanel())
                .on("compositeStyleChange", () => this.raise("elementStyleChange"))
        ]);
    }

    onExpandToggle() {
        this.expanded = !this.expanded;

        if (this.expanded) {
            this.style.setInlineCss({ display: "flex" });
            this.expandButton.setInlineCss({ transform: "rotate(90deg)" });
        } else {
            this.style.setInlineCss({ display: "none" });
            this.expandButton.setInlineCss({ transform: "rotate(0deg)" });
        }
    }

    setElementStyle(style, elementName) {
        this.style
            .setCompositeStyle(style)

        let actualElementName = elementName;
        if (actualElementName == "_")
            actualElementName = "root";

        this.elementNameTextBox.setText(actualElementName);
        return this;
    }

    getElementStyle() {
        const elementStyle = {};

        let key = this.elementNameTextBox.getText();
        if (key == "root") key = "_";

        elementStyle[key] = this.style.getCompositeStyle();

        return elementStyle;
    }
}

ElementStylePanel.style = {
    _: {
        display: "flex",
        flexFlow: "column nowrap"
    },
    elementName: {
        "display": "flex",
        "flexFlow": "row nowrap",
        "height": "20px",
        "background": "#777",
        "borderRadius": "3px",
        "color": "#EEE",
        "margin": "5px",
        "marginBottom": "0px",
        "boxShadow": "0px 1px 2px 0px rgba(0,0,0,0.4)",
        "cursor": "pointer"
    },
    expandButton: {
        "flex": "0 0 20px",
        "height": "20px",
        "lineHeight": "20px",
        "textAlign": "center",
        "fontSize": "9px",
        "transform": "rotate(90deg)",
        "position": "relative",
        "top": "1px",
        "&:hover": {
            "color": "white"
        }
    },
    elementNameTextBox: {
        "padding": "0",
        "flex": "1 1 100px",
        "background": "0",
        "border": "0",
        "outline": "0",
        "fontFamily": "'Source Code Pro', monospace",
        "fontSize": "11px",
        "color": "white",
        "cursor": "pointer"
    },
    style: {
        marginLeft: "20px"
    }
};

export default class AflonStylePanel extends aflon.Element {
    constructor() {
        super();

        this.append([
            (this.header = new aflon.Div())
                .append([
                    (this.title = new aflon.Div())
                        .setText("Style"),
                    (this.copyButton = new common.TypiconButton())
                        .setTypicon("clipboard")
                        .setInlineCss({ height: "28px" })
                        .on("click", () => this.onCopyButtonClicked())
                ]),
            (this.elementStyles = new aflon.Div())
        ])
    }

    onCopyButtonClicked() {
        const blob = new Blob([JSON.stringify(this.getAflonStyle(), "", 4)], { type: "text/plain" });
        const data = [new ClipboardItem({ "text/plain": blob })];
        navigator.clipboard.write(data);
    }

    setAflonStyle(aflonStyle) {
        this.elementStyles.empty();

        for (let key in aflonStyle) {
            this.elementStyles.append([
                new ElementStylePanel()
                    .setElementStyle(aflonStyle[key], key)
                    .on("elementStyleChange", () => this.raise("aflonStyleChange"))
                    .on("signifyElementStart", e => this.raise("signifyElementStart", e.detail))
                    .on("signifyElementStop",  e => this.raise("signifyElementStop", e.detail))
            ]);
        }

        return this;
    }

    getAflonStyle() {
        let aflonStyle = {};

        this.elementStyles.children().forEach(elementStylePanel => {
            aflonStyle = { ...aflonStyle, ...elementStylePanel.getElementStyle() };
        });

        return aflonStyle;
    }
}

AflonStylePanel.style = {
    _: {
        display: "flex",
        flexFlow: "column nowrap",
        background: "#F8F8F8"
    },
    header: {
        flex: "0 0 30px",
        borderBottom: "solid 1px lightGray",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center"
    },
    title: {
        flex: "1 1 auto",
        fontFamily: "'Source Sans Pro', sans-serif",
        fontSize: "13px",
        marginLeft: "5px"
    },
    elementStyles: {
        flex: "1 0 100px",
        display: "flex",
        flexFlow: "column nowrap",
        overflowY: "auto"
    }
};
