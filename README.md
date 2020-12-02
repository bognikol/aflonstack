# Aflon

Aflon is strongly-typed object-oriented old-school UI framework for web.

Compared to functional/declarative UI frameworks (React, Angular), Aflon is based on **stateful** components and extensive use of inheritance and encapsulation.

Aflon ships with built-in support for styling and animation, as well as web application Aflon Studio, where every Aflon component can be independently isolated for testing and styling.

## The Table of the Contents

* Quick Start
* Motivation
* 

## Quick Start

The easiest way to create Aflon application is to download aflon-bootstrap application and modify it.

For those who already have project and infrastructure in place, following steps are short walkthrough for including Aflon.

First install Aflon:

```
npm install --save aflon
```

and then modify your entry-point file as following:

```TypeScript
import { App, Div } from "aflon";

App.run(new Div().setText("Hello world!"));
```

Code above is a valid Aflon program.

Instead of configuring inline Div component, we can define ```HelloWorld``` component which by default contains "Hello world" text. If we want to style HelloWorld, we can set static ```HelloWorld.style``` to appropriate ```AflonCss``` object.

```TypeScript
import { App, Div } from "aflon";

class HelloWorld extends Div {
    constructor() {
        super();
        this.setText("Hello world!");
    }
}

HelloWorld.style = {
    _: {
        fontSize: "20px",
        margin: "10px",
        color: "red"
    }
};

App.run(new HelloWorld());
```

View Tutorial and Documentation for more deatils.

## Motivation

*(This section contains only theoretical considerations.)*

From my experience, representing UI component as an object in object-oriented program is the simplest and the most efficient way of working with UI. This is old heuristic in UI development which had peek of popularity as object-oriented paradigm became widespread during late 90s. WinForms, although old and limited, is an example of such framework.

However, in further development, under influence of HTML, UI frameworks pivoted more toward declarative UI languages, as it was believed that structure of UI should be *described* rather then *constructed* in code. An example of such approach is WPF, which, still object-oriented, made huge effort to integrate declarative description of UI through XAML. This was done at the major cost: XAML became extremely verbose while integration between XAML and code behind introduced its own complexities which, in my opinion, exceeded benefits of XAML. However, this philosophy, if relentlessly practised, together with astonishing infrastructure offered by Visual Studio, enabled segregation of logic and appearance of UI components.

Modern popular Web UI frameworks, like React and Angular, continued to evolve descriptive heuristic. However, rather then being object-oriented, they pivoted toward functional programming, trying to model UI as a map of some state, automatically updating UI as state changes. Components fundamentally became stateless, acting as pure functions which transform the state to UI. While this is a noble idea, it didn't come without cost: once the component needs to cache anything, the beautiful elegant formalism of pure functions becomes polluted with work-arounds. 

The major drawback of React components, for example, is that they do not offer its state to be examined on demand by parent component (this is inevitable by design). This way, if parent component is interested in knowing what is the current text in child component, it needs to subscribe to events and track every change of text, while text itself is essentially duplicated both in child and parent component. Therefore, instead of encapsulating complexity within themselves, React components often overflow complexity toward parent components.

One of the approaches to the problem of duplicated state was to model whole UI application as a state machine. I believe this is a rather impractical approach - global state of UI application is extremely large and *public*, so hiding of internal implementations of components is rather impossible because *component-specific* fields are still exposed *publicly* in the state. That way global state becomes global cacophony of voices of every single component in the application.

Although there is always a state behind any UI (we can always implicitly calculate it), I find that it is usual more practical to consider UI as a control table which is created by wiring up smaller control devices in meaningful manner. The reason for this is that in later case interfaces between components are slimmer and encapsulation is stronger, which imidiatly yields lower complexity and higher modularity. (This not always more practical though - for example in situation where application is used to build up some kind of document (eg. MS Word), it can be very useful to understand UI as a map of state.)

Object-oriented programming allows us to model a component as a class; it can populate itself with children nodes in constructor; it can inherit generic component which gives common functionality (or any other existing component class which can be specialised); it can expose public methods; and it can raise and subscribe to events.

Inspired by old-school UI frameworks like WinForms, I wanted to see how JavaScript DOM API can be adapted to object-oriented framework, with inheritance as main mechanism for tailoring components. I also wanted to restrict the framework to pure TypeScript (JavaScript), avoid declarative syntax and compiler infrastructure which goes with it, but preserve hierarchical representation of UI **in code** (just like HTML represents UI as tree); also, I wanted to closely couple component with its style **in the same file**, so time for searching for appropriate style during development is minimised.

## Tutorial

### Building UI Tree

Aflon, in essence, is a very slim wrapper around JavaScript DOM API. Basic construct which represents an HTML node is abstract class aflon.Element. It contains a reference to a single HTMLElement which it represents, and offers a wide range of common functions for managing it. In general, DOM API should not be visible behind Aflon type system; Aflon type system is intended to represent complete abstraction of DOM API. However, HTMLElement can be accessed through aflon.Element.getHtmlElement() function for native operations.

All other HTML elements are modeled as classes inheriting aflon.Element, overriding the tag name of HTML node and optionally extending its functionality. Classes Div, Span, P, H1, H2, H3, H4, H5, H6, Image all represent appropriate HTML elements. Apart from these classes, Aflon also exposes basic input types. These types inherit abstract class aflon.Input which in turn inherits aflon.Element. Basic input classes in Aflon are TextBox, PassBox, TextArea, Button, CheckBox, RadioButton and SelectBox. All of these classes represent unique HTML elements (view documentation for exact details). Developers can easily create their own classes.

Aflon components contain methods, of which some are setters and getters. Setters and getters are always functions; Aflon does not use ECMAScript properties. Setters in general start with 'set' word, and getters with 'get' word. **Every setter by convention returns ```this```.** This convention is important because it allows compact configuration of an object in code. This pattern is known as [chaining](https://en.wikipedia.org/wiki/Method_chaining). (Developers should stick to this convention when implementing their own types extended from aflon.Element.) For example, if we want to create ```<input type="button" />``` which contains text "Hello world", has class "innerButton", and reacts on click event, we can write something like this:

```TypeScript
new Button()
    .setText("Hello world")
    .addClass("innerButton")
    .on("click", () => alert("Hello world"));
```

Furthermore, if we want to create red div which contains previous button, we can do it like this:

```TypeScript
new Div()
    .setInlineCss({ background: "red" })
    .append([
        new Button()
            .setText("Hello world")
            .addClass("innerButton")
            .on("click", () => alert("Hello world"))
    ]);
```
Using chaining we can create hierarchical representation of UI in TypeScript code without using declarative languages. This code creates DOM tree equivalent to following HTML snippet:

```HTML
<div 
    style="background: red">
    <input 
        type="button" 
        class="innerButton" 
        onclick="alert('Hello world')" 
        value="Hello world">
</div>
```

### Creating Custom Components and Running Application

We can take previously configured red div and make it a custom component - let's call it Reddy. Custom components are created by extending existing components. Because Reddy is essentially a red div, we will extend aflon.Div class, and configure it in the constructor:

```TypeScript
class Reddy extends Div {
    constructor() {
        super();
        
        this
            .setInlineCss({ background: "red" })
            .append([
                new Button()
                    .setText("Hello world")
                    .addClass("innerButton")
                    .on("click", () => alert("Hello world"))
            ]);
    }
}
```

Now we can introduce private (or protected) field which would hold reference to button, so we can easily reference it in code, and add public method to Reddy for changing the button textual content. Note that setText() and getText() methods are virtual methods inherited from aflon.Element. Let's say that we also want that clicking button doesn't show alert, but logs textual content of the button and changes Reddy's color to green:

```TypeScript
class Reddy extends Div {

    private innerButton: Button;
    
    constructor() {
        super();
        
        this
            .setInlineCss({ background: "red" })
            .append([
                (this.innerButton = new Button())
                    .setText("Hello world")
                    .addClass("innerButton")
                    .on("click", () => this.onInnerButtonClick())
            ]);
    }
    
    onInnerButtonClick(): void {
        console.log(this.innerButton.getText());
        this.setInlineCss({ background: "green" });
    }

    setText(text: string): this {
        this.innerButton.setText(text);
        return this;
    }

    getText(): string {
        return this.innerButton.getText();
    }
}
```

We can now instantiate Reddy by calling its constructor. Let's say that we want to create new custom component called MultyRed which is consisted of 5 Reddys:

```TypeScript
class MultyRed extends Div {
    constructor() {
        super();
        
        this.append([
            new Reddy().setText("Reddy1"),
            new Reddy().setText("Reddy2"),
            new Reddy().setText("Reddy3"),
            new Reddy().setText("Reddy4"),
            new Reddy().setText("Reddy5")
        ]);
    }
}
```

Let's say that MultyRed is our application. Aflon has class App which is used for starting the application:

```TypeScript
aflon.App.run(new MultyRed());
```

Therefore, whole code would look like this:

```TypeScript
import { Div, Button, App } from "aflon";
    
class Reddy extends Div {

    private innerButton: Button;
    
    constructor() {
        super();
        
        this
            .setInlineCss({ background: "red" })
            .append([
                (this.innerButton = new Button())
                    .setText("Hello world")
                    .addClass("innerButton")
                    .on("click", () => this.onInnerButtonClick())
            ]);
    }
    
    onInnerButtonClick(): void {
        console.log(this.innerButton.getText());
        this.setInlineCss({ background: "green" });
    }

    setText(text: string): this {
        this.innerButton.setText(text);
        return this;
    }

    getText(): string {
        return this.innerButton.getText();
    }
}
    
class MultyRed extends Div {
    constructor() {
        super();
        
        this.append([
            new Reddy().setText("Reddy1"),
            new Reddy().setText("Reddy2"),
            new Reddy().setText("Reddy3"),
            new Reddy().setText("Reddy4"),
            new Reddy().setText("Reddy5")
        ]);
    }
}
    
App.run(new MultyRed());
```

### Eventing Infrastructure

Aflon tries to offer eventing mechanism which: (1) seamlessly extend and fit into native HTML eventing infrastructure, and (2) use TypeScript's type system to offer strongly typed event handling experience for the developer.

It the nutshell, Aflon eventing mechanism is implemented through 3 methods of ```aflon.Element```: ```on```, ```off``` and ```raise```. These three methods are part of ```IEventable``` interface which ```aflon.Element``` implements.

```on``` and ```off``` methods simply add or remove event handlers for specific string-identified event which are raised by underlying ```HTMLElement```. Event handlers receive native event arguments from the eventing system (whose type depends on the type of event handled) with a single difference - property ```target``` (which contains reference to background native ```HTMLElement``` which raised the event) contains property ```aflonElement``` - a reference to an Aflon counterpart of native element. For example:

```TypeScript
class Reddy extends Div {
    private innerButton: Button;

    constructor() {
        super();
        
        this
            .setInlineCss({ background: "red" })
            .append([
                (this.innerButton = new Button())
                    ...
                    .on("click", e => this.onInnerButtonClick(e))
            ]);
    }
    
    onInnerButtonClick(e): void {
        console.log(e.target.aflonElement.getText());
        this.setInlineCss({ background: "green" });
    }
    ...
}
```

Note though that ```aflonElement``` is not present if the origin of the event is ```HTMLElement``` which is not created through Aflon, e.g. does not have corresponding ```aflon.Element```. 

```raise``` method, on the other hand, use native HTML eventing infrastructure to raise a string-identified event with custom event data; events raised this way can be handled even using ```addEventListener``` and ```removeEventListener``` methods. ```raise``` by default raises a non-bubbling event, but this can be configured. For example, if we want to raise custom event ```checked``` at the moment when our ```Reddy``` component becomes green, we can modify ```onInnerButtonClick``` in the following way:

```TypeScript
class Reddy extends Div {
    private innerButton: Button;
    
    constructor() {
        super();
        
        this
            .setInlineCss({ background: "red" })
            .append([
                (this.innerButton = new Button())
                    ...
                    .on("click", this.onInnerButtonClick)
            ]);
    }
    
    onInnerButtonClick = (e) => {
        console.log(e.target.aflonElement.getText());
        this.setInlineCss({ background: "green" });
        e.target.aflonElement.off("click", this.onInnerButtonClick);
        this.raise("checked");
    }
    ...
}
```

```checked``` event does not contain any particular additional data, only default event argument which native eventing system generated. This argument also has ```target.aflonElement``` property which contains a reference to ```Reddy``` which raised the event. Note that we also unsubscribed ```onInnerButtonClick``` from ```click``` event. We also changed how we declared ```onInnerButtonClick``` in order to be able to unsubscribe it (view JavaScript context binding rules for method declarations).

However, once we added ```checked``` event to ```Reddy``` (it became a part of its interface actually), how we can enable strong typing in situations when we are working with Reddy's instance or even subclass. There is no elegant way to do that because JavaScript (TypeScript) does not consider event to be a first-class object (like .NET languages for example). Therefore, in order to make events a part of an interface, for each event we are adding a string variable to the interface which is called ```event<actualEventName>``` and which contains event name. ```aflon.Element``` for example contains about 30 most popular events applicable to generic ```HTMLElement```; all its descendants contain them as well. However, **aflon.Element can handle any arbitrary event**; event name does not need to be a member of a component in order component to work with it. Furthermore, ```aflon.Input```, which is a subclass of ```aflon.Element``` inherits all ```aflon.Element``` events but adds two more, input-specific events: ```change``` and ```input```. To illustrate this, consider following code snippet:

```TypeScript
interface ICheckable extends IEventable {
    public eventChecked;
}

class Reddy extends Div implements ICheckable {
    public eventChecked = "checked";
    ...
    constructor() {
        this
            .append([
                (this.innerButton = new Button())
                    ...
                    .on(this.innerButton.eventClick, this.onInnerButtonClick)
            ]);
    }
    
    onInnerButtonClick = (e) => {
        ...
        e.target.aflonElement.off(this.innerButton.eventClick, this.onInnerButtonClick);
        this.raise(this.eventChecked);
    }
    ...
}

let someCheckable: ICheckable = new Reddy();
someCheckable.on(someCheckable.eventChecked, () => alert("Some checkable is checked!"));
```

### Styling Components

Aflon does not demand any particular styling strategy.

However, according to its philosophy **Everything in TypeScript**, Aflon offers infrastructure for type-safe definitions of CSS rules (and in particular classes) in TypeScript code using object literals. Main type used for definition of CSS style in Aflon is ```CSSProperties```, which is a type reexposed from Aflon's dependency library [typestyle](https://typestyle.github.io/). For more information view [typestyle documentation](https://typestyle.github.io/#/core). Example of defining CSS rule in-code in Aflon is as following:

```TypeScript
import { CSS } from "aflon";

CSS.createRule("html, body", {
    width: "100%", height: "100%", margin: 0, padding: 0
});
```

Furthermore, as a component is the fundamental building block of Aflon applications, Aflon presumes that every component type should be coupled with unique style (which can later be redefined). In order to enable it in TypeScript, following object-oriented approach, every Aflon component has static field ```style``` which contains style information for that particular component.

Static ```style``` field (of type AflonCss) is essentially a string dictionary of CSSProperties (eg. ```Record<string, CSSProperties>```). If component class has field ```this.something``` which contains a reference to its child, then the key ```something``` in style record configures CSS of that child. Key ```_``` (underscore) configures CSS of the component itself. For example:

```TypeScript
class SomeComponent extends aflon.Div {
    private element1: aflon:Div;
    private element2: aflon.Div;
    private element3: aflon.Div;
    
    constructor() {
        ...
    }
    ...
}

SomeComponenet.style = {
    _: {
        background: "red", // configures CSS of SomeComponent root
    },
    element1: { ... }, // configures CSS of element1
    element2: { ... }, // configures CSS of element2
    element3: { ... }  // ...
};

```

This way class definitions do not need to contain any reference to styling, fundamentally decoupling **appearance** from **structure and behavior**. However, these two can never be completely decoupled (because behavior of component might be to change its style). Therefore, for absolute decoupling, concept of CSS transitions need to be introduced, which is in Aflon done through Animations.

**Examples**

Let's consider some practical examples. Suppose that we have following CSS class rules defined somewhere:

```CSS
.innerButton {
    font-size: 20px;
    font-weight: bold;
    margin: 10px;
}

.reddy {
    background: red;
    display: inline-block;
    margin: 10px;
}
```

Now we have already added ```innerButton``` to ```this.innerButton``` so we only need to add ```reddy``` to ```this```:

```TypeScript
class Reddy extends Div {

    private innerButton: Button;
    
    constructor() {
        super();
        
        this
            .addClass("reddy")
            .append([
                (this.innerButton = new Button())
                    .setText("Hello world")
                    .addClass("innerButton")
                    .on(this.innerButton.eventClick, () => this.onInnerButtonClick())
            ]);
    }
    
    ...
}
```

However, Aflon's attitude is to use TypeScript only; therefore we can use simple mechanism for in-code definition of CSS classes. This functionality is based on typestyle library, which does not only generates class rules but offers strongly-typed environment for defining these rules. Previous CSS code can be equivalently defined in following manner:

```TypeScript
const innerButtonClass = CSS.class({
    fontSize: "20px",
    fontWeight: "bold",
    margin: "10px"
});

const reddyClass = CSS.class({
    background: "red",
    display: "inline-block",
    margin: "10px"
});

class Reddy extends Div {

    private innerButton: Button;
    
    constructor() {
        super();
        
        this
            .addClass(reddyClass)
            .append([
                (this.innerButton = new Button())
                    .setText("Hello world")
                    .addClass(innerButtonClass)
                    .on(this.innerButton.eventClick, () => this.onInnerButtonClick())
            ]);
    }
    
    ...
}

```

Note that ```innerButtonClass``` and ```reddyClass``` are not names of CSS classes but variables that contain names. ```aflon.CSS.class``` returns the name of generated class which is a hash of style object. For more information view documentation of typestyle and its dependencies. 

In any case, we can notice that we have already given name to our button - ```this.innerButton``` - and to our root Reddy div - as ```class Reddy```. Therefore exposing name of default CSS class for any element introduce redundancy and noise.

In order to simplify styling of complex components, we can use static ```style``` field of type AflonCss which represents default style of the component. This style can be overriden before any instance of component is created. Therefore, instead of creating a class and then adding class name to component, we only specify ```style``` field while rest is done in background. Following code is equivalent to previous snippets:

```TypeScript
class Reddy extends Div {

    private innerButton: Button;
    
    constructor() {
        super();
        
        this
            .append([
                (this.innerButton = new Button())
                ...
            ]);
    }
    
    ...
}

Reddy.style = {
    _: {
        background: "red",
        display: "inline-block",
        margin: "10px"
    },
    innerButton: {
        fontSize: "20px",
        fontWeight: "bold",
        margin: "10px"
    }
};

```

### Input Interfaces



### Defining and Running Animations


### Using Aflon Studio

 
