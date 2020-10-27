import { Div } from "aflon";
import AflonStudio from "aflon-studio";

export default class BlaControl extends Div
{
    constructor()
    {
        super();
        this.setText("Hello world bla hhahahaha!");
    }
}

BlaControl.style = {
    _: {
        color: "red",
        background: "blue",
        "&:hover": {
            background: "green"
        }
    }
};

AflonStudio.register({
    class: BlaControl
});
