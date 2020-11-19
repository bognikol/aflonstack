# Aflon

Aflon is strongly-typed object-oriented old-school UI framework for Web.

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

and then modify you entry-point file as following:

```
import * as aflon from "aflon";

aflon.App.run(new aflon.Div().setText("Hello world!"));
```

Code above is completely valid Aflon program.

We can define ```HelloWorld``` component which by default contains "Hello world" text. If we want to style HelloWorld, we can set static ```HelloWorld.style``` to appropriate ```AflonCss``` object. Aflon use typestyle in order to offer strongly-typed in-code styling experience. View documentation to get more information about ```AflonCss```.

```
import * as aflon from "aflon";

class HelloWorld extends aflon.Div() {
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

aflon.App.run(new HelloWorld());
```

## Motivation

*(This section contains only theoretical considerations.)*

From my experience, representing UI component as an object in object-oriented program is the simplest and the most efficient way of working with UI. This is old heuristic in UI development which had peek of popularity as object-oriented paradigm became widespread during late 90s. WinForms, although old and limited, is an example of such framework.

However, in further development, under influence of HTML, UI frameworks pivoted more toward declarative UI languages, as it was believed that structure of UI should be *described* rather then *constructed* in code. An example of such approach is WPF, which, still object-oriented, made huge effort to integrate declarative description of UI through XAML. This was done at the major cost: XAML became extremely verbose while integration between XAML and code behind introduced its own complexities which, in my opinion, exceeded benefits of XAML. However, this philosophy, if relentlessly practised, together with astonishing infrastructure offered by Visual Studio, enabled segregation of logic and appearance of UI components.

Modern popular Web UI frameworks, like React and Angular, continued to evolve descriptive heuristic. However, rather then being object-oriented, they pivoted toward functional programming, trying to model UI as a map of some state, automatically updating UI as state changes. Components fundamentally became stateless, acting as pure functions which transform the state to UI. While this is a noble idea, it didn't come without cost: once the component needs to cache anything, the beautiful elegant formalism of pure functions becomes polluted with work-arounds. 

The major drawback of React components, for example, is that they do not offer its state to be examined on demand by parent component (this is inevitable by design). This way, if parent component is interested in knowing what is the current text in child component, it needs to subscribe to events and track every change of text, while text itself is essentially duplicated both in child and parent component. Therefore, instead of encapsulating complexity within themselves, React components often overflow complexity toward parent components.

One of the approaches to the problem of duplicated state was to model whole UI application as a state machine. I believe this is a rather impractical approach - global state of UI application is extremely large and *public*, so hiding of internal implementations of components is rather impossible because *component-specific* fields are still exposed *publicly* in the state. That way global state becomes global cacophony of voices of every single component in the application.

Although there is always a state behind any UI (we can always implicitly calculate it), I find that it is usual more practical to consider UI as a control table which is created by wiring up smaller control devices in meaningful manner. The reason for this is that in later case interfaces between components are slimmer and encapsulation is stronger, which imidiatly yields lower complexity and higher modularity. (This not always more practical though - for example in situation where application is used to build up some kind of document (eg. MS Word), it can be very useful to understand UI as a map of state.)

Object-oriented programming allows us to model a component as a class; it can populate itself with children nodes in constructor; it can inherit generic component which gives common functionality (or any other existing component class which can be specialised); it can expose public methods; and it can raise and subscribe to events.

Inspired by old-school UI frameworks like WinForms, I wanted to see how JavaScript DOM API can be adapted to object-oriented framework, with inheritance as main mechanism for tailoring components. I also wanted to restrict the framework to pure JavaScript (TypeScript), avoid declarative syntax and compiler infrastructure which goes with it, but preserve hierarchical representation of UI **in code** (just like HTML represents UI as tree); also, I wanted to closely couple component with its style **in the same file**, so time for searching for appropriate style during development is minimised.

## Tutorial

### Building UI Tree

Aflon, in essence, is a very slim wrapper around JavaScript DOM API. Basic construct which represents an HTML node is abstract class aflon.Element. It contains a reference to a single HTMLElement which it represents, and offers a wide range of common functions for managing it. In general, DOM API should not be visible behind Aflon type system; Aflon type system is intended to represent complete abstraction of DOM API. However, HTMLElement can be accessed through aflon.Element.getHtmlElement() function for native operations.

All other HTML elements are modeled as classes inheriting aflon.Element overriding the tag name of HTML node and optionally extending its functionality. Classes Div, Span, P, H1, H2, H3, H4, H5, H6, Image all represent appropriate HTML elements. Apart from these classes, Aflon also exposes basic input types. These types inherit abstract class aflon.Input which in turn inherits aflon.Element. Basic input classes in Aflon are TextBox, PassBox, TextArea, Button, CheckBox, RadioButton and SelectBox. All of these classes represent unique HTML elements (view documentation for exact details). Developers can easily create their own classes.

Aflon components contain methods, of which some are setters and getters. Setters and getters are always functions; Aflon does not use ECMAScript properties. Setters in general start with 'set' word, and getters with 'get' word. **Every setter by convention returns ```this```.** This convention is important because it allows compact configuration of an object in code. This pattern is known as [chaining](https://en.wikipedia.org/wiki/Method_chaining). (Developers should stick with this convention when implementing their own types extended from aflon.Element.) For example, if we want to create div element witch has text "Hello world", has id "root", and reacts on click event we can write something like this:

```
	new Div()
		.setText("Hello world")
		.setId("root")
		.on("click", () => alert("Hello world"));
```

Furthermore, if we want to create red div which contains previously defined div, we can do it like this:

```
	new Div()
		.setInlineStyle({ background: "red" })
		.append([
			new Div()
				.setText("Hello world")
				.setId("root")
				.on("click", () => alert("Hello world"))
		]);
```
Using chaining we can create hierarchical representation of UI in JavaScript code without using declarative languages. This code creates DOM tree equivalent to following HTML snippet:

```
	<div style="background: red">
		<div id="root" onclick="alert('Hello world')">
			Hello world
		</div>
	</div>
```

### Creating a Custom Component and Running Application

We can take previously configured red div and make it a custom component - let's call it Reddy. Custom components are created by extending existing components. Because Reddy is essentially a red div, we will extend aflon.Div class, and configure it in the constructor:

```
class Reddy extends aflon.Div {
	constructor() {
		super();
		
		this
			.setInlineStyle({ background: "red" })
			.append([
				new aflon.Div()
					.setText("Hello world")
					.setId("root")
					.on("click", () => alert("Hello world"))
			]);
	}
}
```

Now we can introduce private (or protected) field which would hold reference to internal div, so we can easily change it in code, and add public method to Reddy to change the text "Hello world" to "Goodbye world". Let's say that we also want that clicking inner div doesn't show alert, but changes Reddy's color to green:

```
class Reddy extends aflon.Div {

	private innerDiv: aflon.Div;
	
	constructor() {
		super();
		
		this
			.setInlineStyle({ background: "red" })
			.append([
				(this.innerDiv = new aflon.Div())
					.setText("Hello world")
					.setId("root")
					.on("click", () => 
						this.setInlineStyle({ background: "green" })
					)
			]);
	}
	
	sayGoodbye() {
		this.innderDiv.setText("Goodbye world");
	}
}
```

We can now instantiate Reddy by calling its constructor. Let's say that we want to create new custom component called MultyRed which is consisted of 5 Reddys:

```
class MultyRed extends aflon.Div {
	constructor() {
		super();
		
		this.append([
			new Reddy(),
			new Reddy(),
			new Reddy(),
			new Reddy(),
			new Reddy()
		]);
	}
}
```

Let's say that MultyRed is our application. Aflon has class App which is used for starting the application:

```
aflon.App.run(new MultyRed());
```

Therefore, whole code would look like this:

```
import * as aflon from "aflon";
	
class Reddy extends aflon.Div {

private innerDiv: aflon.Div;
	
constructor() {
	super();
	
	this
		.setInlineStyle({ background: "red" })
		.append([
			(this.innerDiv = new aflon.Div())
				.setText("Hello world")
				.setId("root")
				.on("click", () => 
					this.setInlineStyle({ background: "green" })
				)
		]);
	}
	
	sayGoodbye() {
		this.innderDiv.setText("Goodbye world");
	}
}
	
class MultyRed extends aflon.Div {
	constructor() {
		super();
		
		this.append([
			new Reddy(),
			new Reddy(),
			new Reddy(),
			new Reddy(),
			new Reddy()
		]);
	}
}
	
aflon.App.run(new MultyRed());
```

### Styling Components

Aflon does not expect any particular styling strategy.

However, according to its philosophy **Everything in Javascript**, Aflon offers infrastructure for type-safe definitions of CSS rules (and in particular classes) in JavaScript code using object literals. Main type used for definition of CSS style in Aflon is ```CSSProperties```, which a type is reexposed from Aflon's dependency library [typestyle](https://typestyle.github.io/). For more information view [typestyle documentation](https://typestyle.github.io/#/core). Example of defining CSS rule in-code in Aflon is as following:

```
aflon.CSS.createRule("html, body", {
    width: "100%", height: "100%", margin: 0, padding: 0
});
```

Furthermore, as a component is the fundamental building block of Aflon applications, Aflon presumes that every component type should be coupled with unique style (which can later be redefined). In order to enable it in JavaScript, following object-oriented approach, every Aflon component has static field ```style``` which contains style information for that particular component.

Static ```style``` field (of type AflonCss) is essentially a string dictionary of CSSProperties (eg. ```Record<string, CSSProperties>```). If component class has field ```this.something``` which contains a reference to its child, then the key ```something``` in style record configures CSS of that child. Key ```_``` (underscore) configures CSS of the component itself. For example:

```
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

This way class definitions do not need to contain any reference to styling, fundamentally decoupling **appearance** from **structure and behaviour**. However, these two can never be completely decoupled (because behaviour of component might be to change its style). Therefore, for absolute decoupling, concept of CSS transitions need to be introduced, which is in Aflon done through Animations.

**Examples**

Let's consider some practical examples. Suppose that we have following CSS class rules defined somewhere:

```
.innerDivClass {
	fontSize: 20px;
	fontWeight: bold;
}

.reddyClass {
	background: red;
}
```

Now we can add ```innerDivClass``` to ```this.innerDiv``` and ```reddyClass``` to ```this```:

```
class Reddy extends aflon.Div {

	private innerDiv: aflon.Div;
	
	constructor() {
		super();
		
		this
			.addClass("reddyClass")
			.append([
				(this.innerDiv = new aflon.Div())
					.addClass("innerDivClass")
					.setText("Hello world")
					.setId("root")
					.on("click", () => 
						this.setInlineStyle({ background: "green" })
					)
			]);
	}
	...
}
```

However, Aflon's attitude is only to use JavaScript; therefore we can use simple mechanism for in-code definition of CSS classes. This functionality is based on typestyle library, which does not only generates class rules but offers strongly-typed environment for defining these rules. Previous CSS code can be equivalently defined in following manner:

```
const innerDivClass = aflon.CSS.class({
	fontSize: "20px",
	fontWeight: "bold"
});

const reddyClass = aflon.CSS.class({
	background: "red"
});

class Reddy extends aflon.Div {

	private innerDiv: aflon.Div;
		
	constructor() {
		super();
		...
		this
			.addClass(reddyClass)
			.append([
			(this.innerDiv = new aflon.Div())
				.addClass(innerDivClass)
				...
		]);
	}
	...
}
```

Note that ```innerDivClass``` and ```reddyClass``` are not names of CSS classes but variables that contain names. ```aflon.CSS.class``` returns the name of generated class which is a hash of style object. For more information view documentation of typestyle and its dependencies. 

In any case, we can notice that we have already gave name to our 'Hello World' div - ```this.innerDiv``` - and to our root Reddy div - as ```class Reddy```. Therefore exposing name of default CSS class for any element introduce redundancy and noise.

In order to simplify styling of complex components, we can use static ```style``` field of type AflonCss which represents default style of the component. This style can be overriden before any instance of component is created. Therefore, instead of creating a class and then adding class name to component, we only specify ```style``` field while rest is done in background. Following code is equivalent to previous snippets:

```
class Reddy extends aflon.Div {

	private innerDiv: aflon.Div;
		
	constructor() {
		super();
		...
		this
			.append([
				(this.innerDiv = new aflon.Div())
				...
		]);
	}
	...
}

Reddy.style = {
	_: {
		background: "red"
	},
	innerDiv: {
		fontSize: "20px",
		fontWeight: "bold"
	}
};

```
### Defining and Running Animations


### Using Aflon Studio

 
