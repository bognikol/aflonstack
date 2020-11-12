import * as aflon from "aflon";

import * as common from "./CommonControls";
import AflonStylePanel from "./StylePanel";
import { AflonAnimationPanel, NamedTextBox, NamedSelectBox, PrimitiveAnimationPanel } from "./AnimationPanel";

class AflonPreviewer extends aflon.Div {
    constructor() {
        super();

        this.expanded = false;
        this.previewElementConfig = null;
        this.previewElement = null;

        this.signifiedElement = null;
        this.signifyClass = null;

        this.append([
            (this.container = new aflon.Div()),
            (this.configurator = new aflon.Div())
                .append([
                    (this.widthTextBox = new aflon.TextBox())
                        .on("focusout", () => this.container.setInlineCss({ width: this.widthTextBox.getText() })),
                    (this.times = new aflon.Div())
                        .setText("×"),
                    (this.heightTextBox = new aflon.TextBox())
                        .on("focusout", () => this.container.setInlineCss({ height: this.heightTextBox.getText() })),
                    (this.expandButton = new aflon.Div())
                        .setText("‹")
                        .on("click", () => {
                            if (!this.expanded) {
                                this.widthTextBox.setText(this.container.getInlineCss().width);
                                this.heightTextBox.setText(this.container.getInlineCss().height);
                                this.animations("expand").start();
                                this.expanded = true;
                            } else {
                                this.animations("contract").start();
                                this.expanded = false;
                            }
                        })
                ])
        ]);
    }

    setPreviewConfig(config) {
        this.previewElementConfig = config;
        this.setViewportSize(this.previewElementConfig.viewportSize);

        if (this.previewElementConfig.backgroundColor)
            this.setInlineCss({ backgroundColor: this.previewElementConfig.backgroundColor });
        else
            this.setInlineCss({ backgroundColor: "white" });

        this.update();
        return this;
    }

    update() {
        this.container.empty();

        let element = new this.previewElementConfig.class();

        if (this.previewElementConfig.initializer)
            this.previewElementConfig.initializer(element);
        this.container.append([ element ]);

        this.previewElement = element;

        return this;
    }

    runAnimationCommand(animationName, command) {
        if (command == "start")
            this.previewElement.animations(animationName).start();
        else if (command == "stop")
            this.previewElement.animations(animationName).stop();
    }

    signifyElement(elementName) {
        if (elementName == "root") 
            this.signifiedElement = this.previewElement;
        else if (this.previewElement[elementName]) 
            this.signifiedElement = this.previewElement[elementName];

        if (!this.signifiedElement) return;

        if (!this.signifyClass)
            this.signifyClass = aflon.CSS.class({
                zIndex: "1000000", 
                outline: "solid 1px dodgerblue",
                outlineOffset: "3px"
        });

        this.signifiedElement.addClass(this.signifyClass);
    }

    resetSignify() {
        if (!this.signifiedElement) return;
        this.signifiedElement.removeClass(this.signifyClass);
        this.signifiedElement = null;
    }

    setViewportSize(viewportSize) {
        viewportSize = { width: "600px", height: "400px", ...viewportSize };

        this.container.setInlineCss({
            width: viewportSize.width,
            height: viewportSize.height
        });

        this.widthTextBox.setText(viewportSize.width);
        this.heightTextBox.setText(viewportSize.height);
    }
}


AflonPreviewer.style = {
    _: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto"
    },
    container: {
        width: "600px",
        height: "400px",
        border: "dotted 1px lightgray"
    },
    configurator: {
        position: "absolute",
        top: "5px",
        right: "5px",
        height: "20px",
        width: "20px",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        borderRadius: "10px",
        "background": "lightgray",
        "boxShadow": "0px 1px 2px 0px rgba(0,0,0,0.3)"
    },
    widthTextBox: {
        width: "50px",
        margin: "0 5px",
        background: "white",
        borderRadius: "3px",
        border: "1px solid darkgray",
        "fontFamily": "'Source Code Pro', monospace",
        "fontSize": "11px",
        "paddingLeft": "3px",
        "color": "#777",
        outline: "0",
        opacity: "0"
    },
    times: {
        color: "#777",
        opacity: "0"
    },
    heightTextBox: {
        width: "50px",
        margin: "0 5px",
        background: "white",
        borderRadius: "3px",
        border: "1px solid darkgray",
        "fontFamily": "'Source Code Pro', monospace",
        "fontSize": "11px",
        "paddingLeft": "3px",
        "color": "#777",
        outline: "0",
        opacity: "0"
    },
    fullButton: {

    },
    expandButton: {
        color: "#777",
        lineHeight: "20px",
        position: "absolute",
        right: "7px",
        height: "100%",
        fontSize: "25px",
        padding: "0",
        top: "-2px",
        cursor: "pointer",
        userSelect: "none"
    }
};

AflonPreviewer.animations = {
    expand: {
        animations: [
            { target: "configurator", track: "width", to: "150px" },
            { target: "configurator", track: "height", to: "26px" },
            { target: "configurator", track: "borderRadius", to: "3px" },
            { target: "expandButton", track: "rotate", to: "-180" },
            { target: "expandButton", track: "top", to: "0" },
            { target: "widthTextBox", track: "opacity", to: "1"},
            { target: "times", track: "opacity", to: "1"},
            { target: "heightTextBox", track: "opacity", to: "1"}
        ]
    },
    contract: {
        animations: [
            { target: "configurator", track: "width", to: "20px" },
            { target: "configurator", track: "height", to: "20px" },
            { target: "configurator", track: "borderRadius", to: "10px" },
            { target: "expandButton", track: "rotate", to: "0" },
            { target: "expandButton", track: "top", to: "-2px" },
            { target: "widthTextBox", track: "opacity", to: "0"},
            { target: "times", track: "opacity", to: "0"},
            { target: "heightTextBox", track: "opacity", to: "0"}
        ]
    }
};

export default class AflonStudio extends aflon.Div {
    static register(config) {
        AflonStudio.configurations.push(config);
    }

    static run() {
        aflon.App.run(new AflonStudio(AflonStudio.configurations));
    }

    constructor(configurations) {
        super();

        this.configurations = configurations;
        this.selectedIndex = 0;

        this.configurations.forEach(config => {
            config.originalStyle = config.class.style;
            config.originalAnimations = config.class.animations;
            const rawStyle = localStorage.getItem(`${config.class.name}_style`);
            if (rawStyle)
                config.class.style = JSON.parse(rawStyle);
            const rawAnimations = localStorage.getItem(`${config.class.name}_animations`);
            if (rawAnimations)
                config.class.animations = JSON.parse(rawAnimations);
        });

        this.append([
            (this.header = new aflon.Div())
                .append([
                    (this.title = new aflon.Span())
                        .setText("Aflon Studio"),
                    (this.elementTypeLabel = new aflon.Span())
                        .setText("Select element to configure:"),
                    (this.elementTypeSelectBox = new common.SelectBox())
                        .insertOptions(this.configurations.map((configuration, index) => 
                            ({ text: configuration.class.name, value: index })))
                        .on("change", (e) => this.onSelectedElementChange(e)),
                    (this.resetButton = new common.TypiconButton())
                        .setTypicon("arrow-back")
                        .on("click", () => this.onResetButtonClick()),
                    (this.copyAllButton = new common.TypiconButton())
                        .setTypicon("clipboard")
                        .on("click", () => this.onCopyAllButtonClick())
                ]),
            (this.previewer = new AflonPreviewer()),
            (this.styleCP = new AflonStylePanel())
                .on("aflonStyleChange", () => this.onAflonStyleChange())
                .on("signifyElementStart", e => this.previewer.signifyElement(e.detail.elementName))
                .on("signifyElementStop",  () => this.previewer.resetSignify()),
            (this.animationCP = new AflonAnimationPanel())
                .on("commandRequested", e => this.onAnimationCommandRequested(e))
                .on("aflonAnimationChange", e => this.onAflonAnimationChange())
        ]);

        const config = this.configurations[0];
        this.setPreviewElement(config); 

        window.addEventListener("beforeunload", () => {
            this.configurations.forEach(cofig => {
                if (cofig.class.style)
                    localStorage.setItem(`${cofig.class.name}_style`, JSON.stringify(cofig.class.style));
                if (cofig.class.animations)
                    localStorage.setItem(`${cofig.class.name}_animations`, JSON.stringify(cofig.class.animations));
            })
        });
    }

    onResetButtonClick() {
        const currentConfig = this.configurations[this.selectedIndex];
        localStorage.removeItem(`${currentConfig.class.name}_style`);
        localStorage.removeItem(`${currentConfig.class.name}_animations`);
        currentConfig.class.style = currentConfig.originalStyle;
        currentConfig.class.animations = currentConfig.originalAnimations;
        this.styleCP.setAflonStyle(currentConfig.class.style);
        this.animationCP.setAflonAnimationDefinition(currentConfig.class.animations);
        this.previewer.update();
    }

    onCopyAllButtonClick() {
        const currentConfig = this.configurations[this.selectedIndex];
        const output = 
            `${currentConfig.class.name}.style = ${JSON.stringify(currentConfig.class.style, "", 4)};\n\n` + 
            `${currentConfig.class.name}.animations = ${JSON.stringify(currentConfig.class.animations, "", 4)};\n\n`;
        const blob = new Blob([ output ], { type: "text/plain" });
        const data = [ new ClipboardItem({ "text/plain": blob }) ];
        navigator.clipboard.write(data);
    }

    onSelectedElementChange(e) {
        this.selectedIndex = e.target.aflonElement.getSelectedOption().value;
        const currentConfig = this.configurations[this.selectedIndex];
        this.setPreviewElement(currentConfig); 
    }

    onAnimationCommandRequested(e) {
        this.previewer.runAnimationCommand(e.detail.animation, e.detail.command);
    }

    onAflonAnimationChange() {
        const currentConfig = this.configurations[this.selectedIndex];              
        currentConfig.class.animations = this.animationCP.getAflonAnimationDefinition();
        this.previewer.update();
    }

    onAflonStyleChange() {
        const currentConfig = this.configurations[this.selectedIndex];
        currentConfig.class.style = this.styleCP.getAflonStyle();
        this.previewer.update();
    }

    setPreviewElement(config) {

        let autoInitialStyle = {
            _: {
            }
        };

        const instance = new config.class();
        for (var key in instance) {
            if (aflon.isAflonElement(instance[key])) {
                autoInitialStyle[key] = { };
            }
        }

        config.class.style = { ...autoInitialStyle, ...config.class.style };

        this.previewer.setPreviewConfig(config);
        this.styleCP.setAflonStyle(config.class.style);
        this.animationCP.setAflonAnimationDefinition(config.class.animations)

        return this;
    }
}

AflonStudio.configurations = [];

AflonStudio.style = {
    _: {
        display: "grid",
        grid: 
          `"header    style animation" 30px
           "previewer style animation" auto
          / auto      300px 300px`,
        flexFlow: "row nowrap",
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    header: {
        gridArea: "header",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
        padding: "5px",
        paddingRight: "0px",
        fontFamily: "'Source Sans Pro', sans-serif",
        borderBottom: "solid 1px lightgray",
        background: "#F8F8F8"
    },
    title: {
        flex: "1 1 auto",
        marginLeft: "5px"
    },
    elementTypeLabel: {
        fontSize: "12px",
        marginRight: "10px"
    },
    elementTypeSelectBox: {
        flex: "0 0 400px",
        marginRight: "5px"
    },
    previewer: {
        flex: "1 1 1px",
        gridArea: "previewer"
    },
    styleCP: {
        height: "100%",
        flex: "0 0 400px",
        gridArea: "style",
        borderLeft: "solid 1px lightgray"
    },
    animationCP: {
        height: "100%",
        flex: "0 0 400px",
        gridArea: "animation",
        borderLeft: "solid 1px lightgray"
    }
};
