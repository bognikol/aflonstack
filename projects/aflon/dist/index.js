"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.TextArea = exports.SelectBox = exports.RadioButton = exports.CheckBox = exports.PassBox = exports.TextBox = exports.Button = exports.Input = exports.Image = exports.P = exports.H6 = exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = exports.Span = exports.Div = exports.Element = exports.Easing = exports.CSS = void 0;
const typestyle_1 = require("typestyle");
const popmotion = __importStar(require("popmotion"));
class CSS {
    static class(css) {
        return typestyle_1.style(css);
    }
    static media(mediaQuery, ...css) {
        return typestyle_1.media(mediaQuery, ...css);
    }
    static importUrl(url) {
        typestyle_1.cssRaw(`@import url('${url}');`);
    }
}
exports.CSS = CSS;
exports.Easing = {
    linear: popmotion.easing.linear,
    easeIn: popmotion.easing.easeIn,
    easeOut: popmotion.easing.easeOut,
    easeInOut: popmotion.easing.easeInOut,
    circIn: popmotion.easing.circIn,
    circOut: popmotion.easing.circOut,
    circInOut: popmotion.easing.circInOut,
    backIn: popmotion.easing.backIn,
    backOut: popmotion.easing.backOut,
    backInOut: popmotion.easing.backInOut,
    anticipate: popmotion.easing.anticipate,
    bounceOut: popmotion.easing.bounceOut,
    bounceIn: popmotion.easing.bounceIn,
    bounceInOut: popmotion.easing.bounceInOut
};
class PrimitiveAnimation {
    constructor(animationDefinition, context, durationWithAfterDelay = 0) {
        this._prepeared = false;
        this._animationDefinition = animationDefinition;
        this._context = context;
        this._durationWithAfterDelay = durationWithAfterDelay;
    }
    _prepeare() {
        if (this._prepeared)
            return;
        if (this._animationDefinition.target === undefined ||
            this._animationDefinition.target === "")
            this._styler = this._context.getHtmlElement().styler;
        else
            this._styler = this._context[this._animationDefinition.target].getHtmlElement().styler;
        if (this._animationDefinition.from === undefined)
            this._animationDefinition.from = this._styler.get(this._animationDefinition.track);
    }
    start() {
        this._prepeare();
        if (this._tweenAnimation != null) {
            this._tweenAnimation.resume();
            return;
        }
        let totalDuration = this._animationDefinition.duration + this._animationDefinition.delay;
        if (totalDuration < this._durationWithAfterDelay)
            totalDuration = this._durationWithAfterDelay;
        this._tweenAnimation =
            popmotion.keyframes({
                values: [
                    this._animationDefinition.from,
                    this._animationDefinition.from,
                    this._animationDefinition.to,
                    this._animationDefinition.to
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
                .start((v) => this._styler.set(this._animationDefinition.track, v));
    }
    pause() {
        if (!this._tweenAnimation)
            return;
        this._tweenAnimation.pause();
    }
    reset() {
        if (!this._tweenAnimation)
            return;
        this._tweenAnimation.pause();
        this._tweenAnimation.seek(0);
    }
    reverse() {
        if (!this._tweenAnimation)
            return;
        this._tweenAnimation.seek(1 - this._tweenAnimation.getProgress());
        this._tweenAnimation.reverse();
    }
    getElapsed() {
        if (!this._tweenAnimation)
            return 0;
        return this._tweenAnimation.getElapsed();
    }
    getProgress() {
        if (!this._tweenAnimation)
            return 0;
        return this._tweenAnimation.getProgress();
    }
}
class Animation {
    constructor(animationDefinition, context) {
        this._primitiveAnimations = [];
        const fallbackAnimationDefinition = {
            ease: popmotion.easing.linear,
            duration: 300,
            delay: 0,
            elapsed: 0,
            loop: 0,
            flip: 0,
            yoyo: 0
        };
        if (animationDefinition.target)
            fallbackAnimationDefinition.target = animationDefinition.target;
        if (animationDefinition.ease)
            fallbackAnimationDefinition.ease = animationDefinition.ease;
        if (animationDefinition.duration)
            fallbackAnimationDefinition.duration = animationDefinition.duration;
        if (animationDefinition.delay)
            fallbackAnimationDefinition.delay = animationDefinition.delay;
        if (animationDefinition.elapsed)
            fallbackAnimationDefinition.elapsed = animationDefinition.elapsed;
        if (animationDefinition.loop)
            fallbackAnimationDefinition.loop = animationDefinition.loop;
        if (animationDefinition.flip)
            fallbackAnimationDefinition.flip = animationDefinition.flip;
        if (animationDefinition.yoyo)
            fallbackAnimationDefinition.yoyo = animationDefinition.yoyo;
        const primitiveAnimationDefinitions = animationDefinition.animations.map(animation => (Object.assign(Object.assign({}, fallbackAnimationDefinition), animation)));
        let maxDuration = 0;
        primitiveAnimationDefinitions.forEach(animation => {
            const fullDuration = +animation.delay + animation.duration;
            if (maxDuration < fullDuration)
                maxDuration = fullDuration;
        });
        this._primitiveAnimations =
            primitiveAnimationDefinitions.map(animDefinition => new PrimitiveAnimation(animDefinition, context, maxDuration));
    }
    start() {
        this._primitiveAnimations.forEach(animation => animation.start());
    }
    pause() {
        this._primitiveAnimations.forEach(animation => animation.pause());
    }
    reset() {
        this._primitiveAnimations.forEach(animation => animation.reset());
    }
    reverse() {
        this._primitiveAnimations.forEach(animation => animation.reverse());
    }
    getElapsed() {
        if (this._primitiveAnimations.length == 0)
            return 0;
        return this._primitiveAnimations[0].getElapsed();
    }
    getProgress() {
        if (this._primitiveAnimations.length == 0)
            return 0;
        return this._primitiveAnimations[0].getProgress();
    }
}
class Element {
    constructor() {
        this._root = this._createElement();
        this._root.aflonElement = this;
        this._root.styler = popmotion.styler(this._root);
        this._setAflonStyle();
        this._setAflonAnimations();
        setTimeout(() => this._applyAflonStyle(), 0);
    }
    _createElement() {
        return document.createElement("div");
    }
    _applyAflonStyle() {
        if (!this._style)
            return this;
        for (let key in this._style) {
            if (key == "_") {
                this.addCssClass(this._style[key]);
                continue;
            }
            if (!this.hasOwnProperty(key))
                continue;
            let element = this[key];
            if (!element.getHtmlElement ||
                !element.getHtmlElement())
                continue;
            element.addCssClass(this._style[key]);
        }
        return this;
    }
    _setAflonStyle() {
        this._style = this.constructor["style"];
    }
    ;
    _setAflonAnimations() {
        this._animations = this.constructor["animations"];
        for (var animDef in this._animations) {
            this[animDef] = new Animation(this._animations[animDef], this);
        }
    }
    getHtmlElement() {
        return this._root;
    }
    append(children) {
        children.forEach(child => this._root.appendChild(child._root));
        return this;
    }
    prepend(children) {
        children.reverse().forEach(child => this._root.prepend(child._root));
        return this;
    }
    removeChild(child) {
        this._root.removeChild(child._root);
        return this;
    }
    insertAfter(elem) {
        this._root.insertBefore(elem._root, this._root.nextElementSibling);
        return this;
    }
    insertBefore(elem) {
        this._root.insertBefore(elem._root, this._root);
        return this;
    }
    children() {
        let children = [];
        this._root.childNodes.forEach(child => {
            const aflonElement = child.aflonElement;
            if (aflonElement)
                children.push(aflonElement);
        });
        return children;
    }
    empty() {
        this._root.innerHTML = "";
        return this;
    }
    getChildrenNumber() {
        return this._root.children.length;
    }
    setText(text) {
        this._root.textContent = text;
        return this;
    }
    getText() {
        if (this._root.textContent == null)
            return "";
        return this._root.textContent;
    }
    addAttr(attributeName, value = "") {
        this._root.setAttribute(attributeName, value);
        return this;
    }
    getAttr(attributeName) {
        return this._root.getAttribute(attributeName);
    }
    getStringAttr(attributeName) {
        const attrValue = this._root.getAttribute(attributeName);
        if (attrValue == null)
            return "";
        return attrValue;
    }
    removeAttr(attributeName) {
        this._root.removeAttribute(attributeName);
        return this;
    }
    hasAttr(attributeName) {
        return this._root.hasAttribute(attributeName);
    }
    disable() {
        this.setInlineCss({ pointerEvents: "none" });
        this.addAttr("disabled");
        return this;
    }
    enable() {
        this.setInlineCss({ pointerEvents: "auto" });
        this.removeAttr("disabled");
        return this;
    }
    isEnabled() {
        return !this.hasAttr("disabled");
    }
    addClass(className) {
        this._root.classList.add(className);
        return this;
    }
    addCssClass(css) {
        this.addClass(CSS.class(css));
        return this;
    }
    addClasses(classNames) {
        classNames.forEach(className => this.addClass(className));
        return this;
    }
    removeClass(className) {
        this._root.classList.remove(className);
        return this;
    }
    clearClasses() {
        this._root.className = "";
        return this;
    }
    setId(id) {
        this._root.id = id;
        return this;
    }
    removeId() {
        this.removeAttr("id");
        return this;
    }
    getInlineCss() {
        return this._root.style;
    }
    setInlineCss(css) {
        for (let key in css) {
            this._root.style[key] = css[key];
        }
        return this;
    }
    on(eventName, handler) {
        this.getHtmlElement().addEventListener(eventName, handler);
        return this;
    }
    off(eventName, handler) {
        this.getHtmlElement().removeEventListener(eventName, handler);
        return this;
    }
    raise(eventName, args = {}, bubbles = false) {
        this.getHtmlElement().dispatchEvent(new CustomEvent(eventName, { bubbles: bubbles, detail: args }));
        return this;
    }
}
exports.Element = Element;
class Div extends Element {
}
exports.Div = Div;
class Span extends Element {
    _createElement() {
        return document.createElement("span");
    }
}
exports.Span = Span;
class H1 extends Element {
    _createElement() {
        return document.createElement("h1");
    }
}
exports.H1 = H1;
class H2 extends Element {
    _createElement() {
        return document.createElement("h2");
    }
}
exports.H2 = H2;
class H3 extends Element {
    _createElement() {
        return document.createElement("h3");
    }
}
exports.H3 = H3;
class H4 extends Element {
    _createElement() {
        return document.createElement("h4");
    }
}
exports.H4 = H4;
class H5 extends Element {
    _createElement() {
        return document.createElement("h5");
    }
}
exports.H5 = H5;
class H6 extends Element {
    _createElement() {
        return document.createElement("h6");
    }
}
exports.H6 = H6;
class P extends Element {
    _createElement() {
        return document.createElement("p");
    }
}
exports.P = P;
class Image extends Element {
    _createElement() {
        return document.createElement("img");
    }
    setSource(source) {
        this.addAttr("src", source);
        return this;
    }
    getSource() {
        return this.getAttr("src");
    }
}
exports.Image = Image;
class Input extends Element {
    setReadOnly(readOnly) {
        if (readOnly)
            this.addAttr("readonly", "true");
        else
            this.addAttr("readonly", "false");
        return this;
    }
    isReadOnly() {
        return this.getAttr("readonly") == "true";
    }
}
exports.Input = Input;
class Button extends Input {
    _createElement() {
        return document.createElement("button");
    }
}
exports.Button = Button;
class TextBox extends Input {
    _createElement() {
        const textBox = document.createElement("input");
        textBox.setAttribute("type", "text");
        return textBox;
    }
    setText(text) {
        this._root.value = text;
        return this;
    }
    getText() {
        return this._root.value;
    }
    setPlaceholder(placeholderText) {
        this.addAttr("placeholder", placeholderText);
        return this;
    }
    getPlaceholder() {
        return this.getStringAttr("placeholder");
    }
}
exports.TextBox = TextBox;
class PassBox extends TextBox {
    _createElement() {
        const passBox = document.createElement("input");
        passBox.setAttribute("type", "password");
        return passBox;
    }
}
exports.PassBox = PassBox;
class CheckBox extends Input {
    _createElement() {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        return checkbox;
    }
    check() {
        this.addAttr("checked", "true");
        return this;
    }
    uncheck() {
        this.addAttr("checked", "false");
        return this;
    }
    isChecked() {
        return this.getAttr("checked") == "true";
    }
}
exports.CheckBox = CheckBox;
class RadioButton extends CheckBox {
    _createElement() {
        const radioButton = document.createElement("input");
        radioButton.setAttribute("type", "radio");
        return radioButton;
    }
    constructor(groupName) {
        super();
        if (groupName)
            this.addAttr("name", groupName);
    }
    setGroup(groupName) {
        this.addAttr("name", groupName);
        return this;
    }
    getGroup() {
        return this.getAttr("name");
    }
    removeGroup() {
        this.removeAttr("name");
        return this;
    }
}
exports.RadioButton = RadioButton;
class SelectBox extends Input {
    _createElement() {
        const select = document.createElement("select");
        return select;
    }
    constructor(options) {
        super();
        if (options)
            options.forEach((e) => {
                this.insertOption(e);
            });
    }
    insertOption(option) {
        const optionElement = document.createElement("option");
        optionElement.text = option.text;
        optionElement.setAttribute("value", option.value);
        this.getHtmlElement().append(optionElement);
        return this;
    }
    removeOption(optionValue) {
        let selectIndex = -1;
        const select = this.getHtmlElement();
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value == optionValue)
                selectIndex = i;
        }
        if (selectIndex != -1)
            select.remove(selectIndex);
        return this;
    }
    insertOptions(options) {
        options.forEach((e) => {
            this.insertOption(e);
        });
        return this;
    }
    setSelectedOption(optionValue) {
        this._root.value = optionValue;
        return this;
    }
    getSelectedOption() {
        const select = this.getHtmlElement();
        return {
            value: select.options[select.selectedIndex].value,
            text: select.options[select.selectedIndex].text
        };
    }
    getAllOptions() {
        let options = [];
        const select = this.getHtmlElement();
        for (let i = 0; i < select.options.length; i++) {
            options.push({
                value: select.options[i].value,
                text: select.options[i].text
            });
        }
        return options;
    }
}
exports.SelectBox = SelectBox;
class TextArea extends TextBox {
    _createElement() {
        const textArea = document.createElement("textarea");
        return textArea;
    }
}
exports.TextArea = TextArea;
class App {
    static run(root) {
        document.body.appendChild(root.getHtmlElement());
    }
}
exports.App = App;
//# sourceMappingURL=index.js.map