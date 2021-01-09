import * as aflon from "aflon";
import AflonStudio from "aflon-studio";

import RegisterControl from "./controls/RegisterControl";

export default class DemoApp extends aflon.Div 
{
    private aflonTitle: aflon.Div;
    private logInControl: RegisterControl;

    private currentScale: number = 1.0;

    constructor() {
        super();

        this.append([
            (this.aflonTitle = new aflon.Div())
                .setText("Aflon"),
            (this.logInControl = new RegisterControl())
                .on(this.logInControl.eventSubmit, () => this.onSubmited())
        ])
        .on("wheel", (e: Event) => this.onMouseWheel(e));
    }

    onSubmited() {
        let user = this.logInControl.getUserRecord();

        alert(`FIRST NAME: ${user.firstName}; LAST NAME: ${user.lastName}; EMAIL: ${user.email}; ADDRESS: ${user.address}`);
    }

    async onMouseWheel(e: Event) {
        let eventWheel: WheelEvent = e as WheelEvent;

        let currentScaleString = `scale(${this.currentScale}, ${this.currentScale})`;

        if (eventWheel.deltaY > 0)
            this.currentScale += 0.2;
        else
            this.currentScale *= 0.8;

        let newScaleString = `scale(${this.currentScale}, ${this.currentScale})`;

        aflon.animate(this.logInControl, {
            track: "transform", to: newScaleString, from: currentScaleString, ease: "circOut"
        });
    }
}

DemoApp.style = {
    _: {
        "display": "flex",
        "justifyContent": "center",
        "background": "#C4C4C4",
        "height": "100%",
        "alignItems": "center"
    },
    aflonTitle: {
        "position": "absolute",
        "left": "10px",
        "top": "10px",
        "color": "white",
        "fontSize": "30px",
        "fontFamily": "'Source Serif Pro', serif"
    },
    logInControl: {
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
