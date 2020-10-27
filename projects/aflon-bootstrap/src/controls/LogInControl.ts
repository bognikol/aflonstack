import { Div } from "aflon";
import AflonStudio from "aflon-studio";

export default class LogInControl extends Div
{
    constructor()
    {
        super();
        this.setText("LogInControl");
    }
}

LogInControl.style = {
    _: {
        
    }
};

AflonStudio.register({
    class: LogInControl
});
