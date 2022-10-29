import * as aflon from "aflon";
import AflonStudio from "aflon-studio";

import * as defaults from "../defaults";
import LabeledTextBox from "./LabeledTextBox";

export interface UserRecord
{
    firstName: string;
    lastName: string;
    email: string;
    address: string;
}

export default class RegisterControl extends aflon.Div
{
    private title: aflon.Div;
    private firstNameTextBox: LabeledTextBox;
    private lastNameTextBox: LabeledTextBox;
    private emailTextBox: LabeledTextBox;
    private addressTextBox: LabeledTextBox;
    private submitButton: aflon.AbstractButton;

    public eventSubmit = "userSubmit";

    constructor()
    {
        super();

        this.append([
            (this.title = new aflon.Div())
                .setText("Register"),
            (this.firstNameTextBox = new LabeledTextBox())
                .setPlaceholder("Name"),
            (this.lastNameTextBox = new LabeledTextBox())
                .setPlaceholder("Surname"),
            (this.emailTextBox = new LabeledTextBox())
                .setPlaceholder("e-mail"),
            (this.addressTextBox = new LabeledTextBox())
                .setPlaceholder("Address"),
            (this.submitButton = new defaults.Button())
                .setText("Submit")
                .on(this.submitButton.eventClick, () => this.raise(this.eventSubmit))
        ]);
    }

    setUserRecord(record: UserRecord): this {
        this.firstNameTextBox.setText(record.firstName);
        this.lastNameTextBox .setText(record.lastName);
        this.emailTextBox    .setText(record.email);
        this.addressTextBox  .setText(record.address);

        return this;
    }

    getUserRecord(): UserRecord {
        return {
            firstName: this.firstNameTextBox.getText(),
            lastName:  this.lastNameTextBox .getText(),
            email:     this.emailTextBox    .getText(),
            address:   this.addressTextBox  .getText(),
        }
    }
}

RegisterControl.style = {
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
    "firstNameTextBox": {
        "marginBottom": "15px"
    },
    "lastNameTextBox": {
        "marginBottom": "15px"
    },
    "emailTextBox": {
        "marginBottom": "15px"
    },
    "addressTextBox": {
        "marginBottom": "50px"
    },
    "submitButton": {
        "alignSelf": "flex-end"
    }
};

AflonStudio.register({
    class: RegisterControl,
    backgroundColor: "#C4C4C4"
});
