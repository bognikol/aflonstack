import * as aflon from "aflon";
import * as common from "./CommonControls";

export class NamedTextBox extends aflon.Div {
    constructor() {
        super();

        this.append([
            (this.name  = new aflon.Div()),
            (this.textBox = new common.TextBox())
                //.on("change", () => this.raise("change"))
        ]);
    }

    setName(name) {
        this.name.setText(name);
        return this;
    } 

    getName() {
        return this.name.getText();
    }

    setText(text) {
        this.textBox.setText(text);
        return this;
    }

    getText() {
        return this.textBox.getText();
    }

    getPlaceholder() {
        return this.textBox.getPlaceholder();
    }

    setPlaceholder(placeholder) {
        this.textBox.setPlaceholder(placeholder);
        return this;
    }
}

NamedTextBox.style = {
    "_": {
        "display": "flex",
        "flexFlow": "row no-wrap"
    },
    "name": {
        "fontFamily": "'Source Sans Pro', sans-serif",
        "fontSize": "12px",
        "flex": "1 1 70px"
    },
    "textBox": {
        "flex": "5 1 40px"
    }
};

export class NamedSelectBox extends aflon.Div {
    constructor() {
        super();

        this.append([
            (this.name  = new aflon.Div()),
            (this.selectBox = new common.SelectBox())
        ]);
    }

    setName(name) {
        this.name.setText(name);
        return this;
    } 

    getName() {
        return this.name.getText();
    }

    insertOption(option) {
        this.selectBox.insertOption(option);
        return this;
    }

    removeOption(optionValue) {
        this.selectBox.removeOption(optionValue);
        return this;
    }

    insertOptions(options) {
        this.selectBox.insertOptions(options);
        return this;
    }

    setSelectedOption(optionValue) {
        this.selectBox.setSelectedOption(optionValue);
        return this;
    }

    getSelectedOption() {
        return this.selectBox.getSelectedOption();
    }

    getAllOptions() {
        return this.selectBox.getAllOptions();
    }
}

NamedSelectBox.style = {
    "_": {
        "display": "flex",
        "flexFlow": "row no-wrap",
        "alignItems": "center"
    },
    "name": {
        "fontFamily": "'Source Sans Pro', sans-serif",
        "fontSize": "12px",
        "flex": "1 1 70px"
    },
    "selectBox": {
        "flex": "5 1 40px"
    }
};

export class PrimitiveAnimationPanel extends aflon.Div {
    constructor() {
        super();

        this.customFunction = null;

        this.append([
            (this.target = new NamedTextBox())
                .setName("Target")
                .on("change", () => this.onChange()),
            (this.track = new NamedTextBox())
                .setName("Track")
                .on("change", () => this.onChange()),
            (this.to = new NamedTextBox())
                .setName("To")
                .on("change", () => this.onChange()),
            (this.from = new NamedTextBox())
                .setName("From")
                .on("change", () => this.onChange()),
            (this.duration = new NamedTextBox())
                .setName("Duration")
                .on("change", () => this.onChange()),
            (this.delay = new NamedTextBox())
                .setName("Delay")
                .on("change", () => this.onChange()),
            (this.easing = new NamedSelectBox())
                .setName("Easing")
                .insertOption({ text: "default", value: "default" })
                .insertOptions(Object.keys(aflon.PredefinedEasingFuncs).map(key => ({ text: key, value: key })))
                .insertOption({ text: "customFunction", value: "customFunction" })
                .on("change", () => this.onChange()),
            (this.repeat = new NamedSelectBox())
                .setName("Repeat")
                .insertOptions([
                    { text: "No repeat", value: "norepeat" },
                    { text: "Loop",      value: "loop"     },
                    { text: "Flip",      value: "flip"     },
                    { text: "Yoyo",      value: "yoyo"     }
                ])
                .on("change", () => this.onChange()),
            /*(this.remove = new aflon.Div())
                .setText("✕")
                .on("click", () => this.raise("removeRequested"))*/
        ]);
    }

    onChange() {
        this.raise("primitiveAnimationChange");
    }

    setPrimitiveAnimationDefinition(definition) {
        if (!definition) return;

        if (definition.target)   this.target.setText  (definition.target);
        if (definition.track)    this.track.setText   (definition.track);
        if (definition.to)       this.to.setText      (definition.to);
        if (definition.from)     this.from.setText    (definition.from);
        if (definition.duration) this.duration.setText(definition.duration);
        if (definition.delay)    this.delay.setText   (definition.delay);

             if (definition.loop) this.repeat.setSelectedOption("loop");
        else if (definition.flip) this.repeat.setSelectedOption("flip");
        else if (definition.yoyo) this.repeat.setSelectedOption("yoyo");
        else                      this.repeat.setSelectedOption("norepeat");

        if (typeof(definition.ease) == "string") {
            this.easing.setSelectedOption(definition.ease);
            this.customFunction = null;
        }
        else if (typeof(definition.ease) == "function") {
            this.easing.setSelectedOption("customFunction");
            this.customFunction = definition.ease;
        }
        else {
            this.customFunction = null;
        }

        return this;
    }

    getPrimitiveAnimationDefinition() {
        const definition = {};

        if (this.target.getText())   definition["target"]   = this.target.getText();
        if (this.track.getText())    definition["track"]    = this.track.getText();
        if (this.to.getText())       definition["to"]       = this.to.getText();
        if (this.from.getText())     definition["from"]     = this.from.getText();
        if (this.duration.getText()) definition["duration"] = Number(this.duration.getText());
        if (this.delay.getText())    definition["delay"]    = Number(this.delay.getText());

        const selectedRepeat = this.repeat.getSelectedOption().value;
        if (selectedRepeat && selectedRepeat != "norepeat")
            definition[selectedRepeat] = Number.POSITIVE_INFINITY;
        
        const selectedEasing = this.easing.getSelectedOption().value;
        if (selectedEasing == "customFunction" && this.customFunction) {
            definition.ease = this.customFunction;
        } else if (selectedEasing != "default") {
            definition.ease = selectedEasing;
        }

        return definition;
    }
}

PrimitiveAnimationPanel.style = {
    "_": {
        "display": "flex",
        "flexFlow": "column nowrap",
        "padding": "10px 7px",
        "borderBottom": "solid 1px lightgray"
    },
    "target": {
        "marginBottom": "5px"
    },
    "track": {
        "marginBottom": "5px"
    },
    "to": {
        "marginBottom": "5px"
    },
    "from": {
        "marginBottom": "5px"
    },
    "duration": {
        "marginBottom": "5px"
    },
    "delay": {
        "marginBottom": "5px"
    },
    "easing": {
        "marginBottom": "5px"
    },
    "repeat": {
        "marginBottom": "5px"
    },
    "remove": {
        "marginBottom": "5px"
    }
};

export class AnimationFallbackPanel extends aflon.Div {
    constructor() {
        super();

        this.append([
            (this.duration = new NamedTextBox())
                .setName("Default Duration")
                .on("change", () => this.onChange()),
            (this.delay = new NamedTextBox())
                .setName("Default Delay")
                .on("change", () => this.onChange()),
            (this.easing = new NamedSelectBox())
                .setName("Default Easing")
                .insertOption({ text: "default", value: "default" })
                .insertOptions(Object.keys(aflon.PredefinedEasingFuncs).map(key => ({ text: key, value: key })))
                .insertOption({ text: "customFunction", value: "customFunction" })
                .on("change", () => this.onChange()),
            (this.repeat = new NamedSelectBox())
                .setName("Default Repeat")
                .insertOptions([
                    { text: "No repeat", value: "norepeat" },
                    { text: "Flip",      value: "flop"     },
                    { text: "Yoyo",      value: "yoyo"     },
                    { text: "Loop",      value: "loop"     }
                ])
                .on("change", () => this.onChange())
        ]);
    }

    onChange() {
        this.raise("fallbackAnimationChange");
    }

    clear() {
        this.duration.setText("");
        this.delay.setText("");
        this.easing.setSelectedOption("linear");
        this.repeat.setSelectedOption("norepeat");
    }

    setAnimationFallbackDefinition(definition) {
        this.clear();

        if (definition.duration) this.duration.setText (definition.duration);
        if (definition.delay)    this.delay.setText    (definition.delay);

             if (definition.loop) this.repeat.setSelectedOption("loop");
        else if (definition.flip) this.repeat.setSelectedOption("flip");
        else if (definition.yoyo) this.repeat.setSelectedOption("yoyo");
        else                      this.repeat.setSelectedOption("norepeat");

        if (definition.ease && typeof(definition.ease) == "string") {
            this.easing.setSelectedOption(definition.ease);
            this.customFunction = null;
        }
        else if (typeof(definition.ease) == "function") {
            this.easing.setSelectedOption("customFunction");
            this.customFunction = definition.ease;
        }
        else {
            this.customFunction = null;
        }

        return this;
    }

    getAnimationFallBackDefinition() {
        const definition = {};

        if (this.duration.getText()) definition["duration"] = this.duration.getText();
        if (this.delay.getText())    definition["delay"]    = this.delay.getText();

        const selectedRepeat = this.repeat.getSelectedOption().value;
        if (selectedRepeat && selectedRepeat != "norepeat")
            definition[selectedRepeat] = Number.POSITIVE_INFINITY;
        
        const selectedEasing = this.easing.getSelectedOption().value;
        if (selectedEasing == "customFunction" && this.customFunction) {
            definition.ease = this.customFunction;
        } else if (selectedEasing != "default") {
            definition.ease = selectedEasing;
        }

        return definition;
    }
}

AnimationFallbackPanel.style = {
    "_": {
        "display": "flex",
        "flexFlow": "column nowrap",
        "padding": "10px 7px"
    },
    "duration": {
        "marginBottom": "5px"
    },
    "delay": {
        "marginBottom": "5px"
    },
    "easing": {
        "marginBottom": "5px"
    }
};

export class AnimationPanel extends aflon.Div {
    constructor() {
        super();

        this.append([
            (this.defaultConfig = new AnimationFallbackPanel())
                .on("fallbackAnimationChange", () => this.onChange()),
            (this.tracks = new aflon.Div())
                .append([
                    new PrimitiveAnimationPanel()
                        .on("removeRequested", e => this.tracks.removeChild(e.target.aflonElement))
                        .on("primitiveAnimationChange",() => this.onChange())
                ])
        ]);
    }

    onChange() {
        this.raise("animationChange");
    }

    setAnimationDefinition(definition) {
        this.tracks.empty();

        if (!definition) {
            this.defaultConfig.setInlineCss({ display: "none"});
            return;
        }

        this.defaultConfig.setInlineCss({ display: "block"});
        this.defaultConfig.setAnimationFallbackDefinition(definition);

        if (!definition.animations) return;
        definition.animations.forEach(animationDef => {
            this.tracks.append([
                new PrimitiveAnimationPanel()
                    .setPrimitiveAnimationDefinition(animationDef)
                    .on("removeRequested", e => this.tracks.removeChild(e.target.aflonElement))
                    .on("primitiveAnimationChange",() => this.onChange())
            ]);
        })
    }

    getAnimationDefinition() {
        const definition = this.defaultConfig.getAnimationFallBackDefinition();

        definition.animations = [];
        this.tracks.children().forEach(child => {
            if (!(child instanceof PrimitiveAnimationPanel)) return;

            definition.animations.push(child.getPrimitiveAnimationDefinition());
        });

        return definition;
    }

    addNewPrimitiveAnimation() {
        this.tracks.append([ 
            new PrimitiveAnimationPanel()
                .on("removeRequested", e => this.tracks.removeChild(e.target.aflonElement))
                .on("primitiveAnimationChange",() => this.onChange())
        ]);
        this.raise("animationChange");
    }
}

AnimationPanel.style = {
    "_": {
        "display": "flex",
        "flexFlow": "column nowrap",
        "height": "100%"
    },
    "defaultConfig": {
        "borderBottom": "solid 1px lightgray"
    },
    "tracks": {
        "flex": "1 0 50px",
        "overflowY": "auto"
    },
    "addTrack": {
        "position": "absolute",
        "bottom": "10px",
        "left": "10px"
    }
};

export class AnimationControlBox extends aflon.Input {
    constructor() {
        super();

        this.append([
            (this.start   = new common.TypiconButton())
                .setTypicon("media-play")
                .on("click", () => this.raise("commandRequested", { command: "start" })),
            (this.pause   = new common.TypiconButton())
                .setTypicon("media-pause")
                .on("click", () => this.raise("commandRequested", { command: "stop" })),
            (this.buffer = new aflon.Div()),
            (this.addPrimitiveAnimation = new common.TypiconButton())
                .setTypicon("plus")
                .on("click", () => this.raise("commandRequested", { command: "addPrimitiveAnimation" }))
        ]);
    }

    setDisabled(disabled) {
        this.children().forEach(child => { if (child.setDisabled) child.setDisabled(disabled) });
        super.setDisabled(disabled);
    }
}

AnimationControlBox.style = {
    _: {
        "display": "flex",
        "flexFlow": "row nowrap",
        "height": "30px",
    },
    buffer: {
        flex: "1 1 1px"
    }
};

export class AflonAnimationPanel extends aflon.Div
{
    constructor() {
        super();

        this.aflonAnimationDefinition = {};
        this.lastSelectedAnimation = null;

        this.append([
            (this.header = new aflon.Div())
                .append([
                    (this.title = new aflon.Div())
                        .setText("Animations"),
                    (this.copyButton = new common.TypiconButton())
                        .setTypicon("clipboard")
                        .setInlineCss({ height: "29px" })
                        .on("click", () => this.onCopyButtonClicked())
                ]),
            (this.addAnimation = new aflon.Div())
                .append([
                    (this.addAnimNameTextBox = new common.TextBox()),
                    (this.addAnimButton = new common.TypiconButton())
                        .setTypicon("plus")
                        .on("click", () => this.onAddAnimButtonClick())
                ]),
            (this.animationSelector = new aflon.Div())
                .append([
                    (this.animationSelectBox = new common.SelectBox())
                        .on("change", e => this.onAnimationSelectBoxChanged(e)),
                    (this.deleteButton = new common.TypiconButton())
                        .setTypicon("trash")
                        .on("click", () => this.onDeleteAnimButtonClick())
                ]),
            (this.controls = new AnimationControlBox())
                .on("commandRequested", e => this.onAnimationCommandReqested(e)),
            (this.animationPanel = new AnimationPanel())
                .on("animationChange", () => this.onChange())
        ]);
    }

    onChange() {
        this.raise("aflonAnimationChange");
    }

    onCopyButtonClicked() {
        const blob = new Blob([JSON.stringify(this.getAflonAnimationDefinition(), "", 4)], { type: "text/plain" });
        const data = [new ClipboardItem({ "text/plain": blob })];
        navigator.clipboard.write(data);
    }

    onAddAnimButtonClick() {
        let newAnimName = this.addAnimNameTextBox.getText();

        if (!newAnimName) return alert("Error. Invalid animation name.");
        if (this.aflonAnimationDefinition.hasOwnProperty(newAnimName))
            return alert(`Error. Animation with name ${newAnimName} already exists.`);

        this.aflonAnimationDefinition[newAnimName] = {};
        this.setAflonAnimationDefinition(this.aflonAnimationDefinition);
        this.animationSelectBox.setSelectedOption(newAnimName);

        this.aflonAnimationDefinition[this.lastSelectedAnimation] =
            this.animationPanel.getAnimationDefinition();

        this.lastSelectedAnimation = newAnimName;
        this.animationPanel.setAnimationDefinition(this.aflonAnimationDefinition[this.lastSelectedAnimation]);

        this.addAnimNameTextBox.setText("");
        this.raise("aflonAnimationChange");
    }

    onDeleteAnimButtonClick() {
        delete this.aflonAnimationDefinition[this.animationSelectBox.getSelectedOption().value];
        this.setAflonAnimationDefinition(this.aflonAnimationDefinition);
        this.raise("aflonAnimationChange");
    }

    onAnimationSelectBoxChanged(e) {
        this.aflonAnimationDefinition[this.lastSelectedAnimation] =
            this.animationPanel.getAnimationDefinition();

        this.lastSelectedAnimation = e.target.value;
        this.animationPanel.setAnimationDefinition(this.aflonAnimationDefinition[this.lastSelectedAnimation]);
    }

    onAnimationCommandReqested(e) {
        if (e.detail.command == "addPrimitiveAnimation") {
            this.animationPanel.addNewPrimitiveAnimation();
            return;
        }

        this.aflonAnimationDefinition[this.lastSelectedAnimation] =
            this.animationPanel.getAnimationDefinition();
        this.raise("commandRequested", {animation: this.lastSelectedAnimation, command: e.detail.command});
    }

    setAflonAnimationDefinition(aflonAnimation) {
        if (!aflonAnimation) aflonAnimation = {};

        this.aflonAnimationDefinition = aflonAnimation;

        this.animationSelectBox.empty();
        
        if (!aflonAnimation || Object.keys(aflonAnimation).length == 0) {
            this.animationSelectBox.setDisabled(true);
            this.deleteButton.setDisabled(true);
            this.controls.setDisabled(true);
            this.animationPanel.setAnimationDefinition(null);
        } else {
            this.animationSelectBox.setDisabled(false);
            this.deleteButton.setDisabled(false);
            this.controls.setDisabled(false);

            for (let animation in aflonAnimation) {
                this.animationSelectBox.insertOptions([{
                    text: animation, value: animation
                }]);
            }

            this.lastSelectedAnimation = this.animationSelectBox.getSelectedOption().value;
            this.animationPanel.setAnimationDefinition(this.aflonAnimationDefinition[this.lastSelectedAnimation]);
        }
        return this;
    }

    getAflonAnimationDefinition() {
        this.aflonAnimationDefinition[this.lastSelectedAnimation] =
            this.animationPanel.getAnimationDefinition();

        return this.aflonAnimationDefinition;
    }
}

AflonAnimationPanel.style = {
    "_": {
        "display": "flex",
        "flexFlow": "column nowrap",
        "background": "#F8F8F8",
        "height": "100%"
    },
    "header": {
        flex: "0 0 30px",
        "display": "flex",
        "flexFlow": "row nowrap",
        "borderBottom": "solid lightgray 1px",
        "alignItems": "center"
    },
    "title": {
        "fontFamily": "'Source Sans Pro', sans-serif",
        "fontSize": "13px",
        "flex": "1 0 1px",
        "marginLeft": "5px"
    },
    addAnimation: {
        "flex": "0 0 30px",
        "display": "flex",
        "alignItems": "center"
    },
    addAnimNameTextBox: {
        "marginLeft": "5px",
        "flex": "1 1 150px",
        "marginRight": "5px"
    },
    addAnimButton: {

    },
    "animationSelector": {
        "flex": "0 0 30px",
        "display": "flex",
        "alignItems": "center"
    },
    "animationSelectBox": {
        "marginLeft": "5px",
        "flex": "1 1 150px",
        "marginRight": "5px"
    },
    "controls": {
        "width": "100%",
        "borderBottom": "solid lightgray 1px"
    },
    "animationPanel": {
        "flex": "1 0 1px"
    },
    "addTrack": {
        "position": "absolute",
        "bottom": "0",
        "left": "0",
        "height": "25px",
        "width": "25px",
        "textAlign": "center",
        "lineHeight": "25px",
        "background": "white",
        "border": "solid 1px black",
        "cursor": "pointer"
    }
};
