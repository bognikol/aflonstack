import * as aflon from "aflon";
import AflonStudio from "aflon-studio";

import LogInControl from "./controls/LogInControl";

export default class DemoApp extends aflon.Div 
{
    private aflonTitle: aflon.Div;
    private logInControl: LogInControl;

    constructor() {
        super();

        this.append([
            (this.aflonTitle = new aflon.Div())
                .setText("Aflon"),
            (this.logInControl = new LogInControl())
        ]);
    }
}

DemoApp.style = {
    "_": {
        "display": "flex",
        "justifyContent": "center",
        "background": "#C4C4C4",
        "height": "100%",
        "alignItems": "center"
    },
    "aflonTitle": {
        "position": "absolute",
        "left": "10px",
        "top": "10px",
        "color": "white",
        "fontSize": "30px",
        "fontFamily": "'Source Serif Pro', serif"
    },
    "logInControl": {
        "width": "300px"
    }
};

AflonStudio.register({
    class: DemoApp,
    viewportSize: {
        width: "100%",
        height: "100%"
    }
});
