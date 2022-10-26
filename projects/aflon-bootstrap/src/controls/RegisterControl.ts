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

class Hello extends aflon.Div
{
    private _text: aflon.Div;
    private _additionalText: aflon.Div;

    constructor() 
    {
        super();

        this.append([
            (this._text = new aflon.Div())
                .setText("Hello Aflon"),
            (this._additionalText = new aflon.Div())
                .setText("Additional div")
        ]);
    }
}

Hello.style = {
    _: {
        background: "red"
    },
    _text: {
        color: "blue",
        fontSize: "20px",
        fontFamily: "serif"
    },
    _additionalText: {
        color: "yellow",
        fontSize: "12px",
        fontFamily: "sans-serif",
        "&:hover": {
            fontWeight: "bold",
            color: "green"
        }
    }
};

class HelloExt extends Hello { }

HelloExt.style = {
    _: {
        background: "gray"
    }   
}

let bla = new HelloExt();

console.log(Object.getPrototypeOf(HelloExt).style);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(new HelloExt())).constructor.style);

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
                .on(this.submitButton.eventClick, () => this.raise(this.eventSubmit)),
            new Hello()
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
