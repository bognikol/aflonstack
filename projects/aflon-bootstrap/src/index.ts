// index.ts is the entry point of sample application.

import * as aflon from "aflon";

// File 'defaults.ts' contains default styling of standard 
// Aflon elements and imputs.
import "./defaults";

// DemoApp.ts contains DemoApp component which is our
// actual application.
import DemoApp from "./DemoApp";

// App.run starts the application by clearing the body and then
// insering aflon.Element suplied as first argument to body.
// Second argument which is optional is an id of existing
// html element where first argument aflon.Element should be
// inserted.
aflon.App.run(new DemoApp());
