import * as aflon from "aflon";
import AflonStudio from "aflon-studio";

import LabeledTextBox from "./LabeledTextBox";

export default class LogInControl extends aflon.Div
{
    private title: aflon.Div;
    private usernameTextBox: LabeledTextBox;
    private passwordTextBox: LabeledTextBox;
    private submitButton: aflon.Button;

    constructor()
    {
        super();

        this.append([
            (this.title = new aflon.Div())
                .setText("Log In"),
            (this.usernameTextBox = new LabeledTextBox())
                .setPlaceholder("Username"),
            (this.passwordTextBox = new LabeledTextBox())
                .setPlaceholder("Password"),
            (this.submitButton = new aflon.Button())
                .setText("Submit")
        ]);
    }
}

LogInControl.style = {
    "_": {
        "display": "flex",
        "flexFlow": "column nowrap",
        "maxWidth": "300px"
    },
    "title": {
        "fontFamily": "'Source Sans Pro', sans-serif",
        "fontSize": "26px",
        "fontWeight": 300,
        "marginBottom": "50px",
        "color": "white"
    },
    "usernameTextBox": {
        "marginBottom": "15px"
    },
    "passwordTextBox": {
        "marginBottom": "50px"
    },
    "submitButton": {
        "alignSelf": "flex-end"
    }
};

AflonStudio.register({
    class: LogInControl,
    backgroundColor: "#C4C4C4"
});
