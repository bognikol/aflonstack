import * as aflon from "aflon";
import AflonStudio from "aflon-studio";

aflon.CSS.import("https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital@0;1&display=swap");
aflon.CSS.import("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap");
aflon.CSS.import("https://cdnjs.cloudflare.com/ajax/libs/typicons/2.0.9/typicons.min.css");

aflon.CSS.createRule("html, body", {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0
});

aflon.CSS.createRule("*", {
    boxSizing: "border-box",
    position: "relative"
});

aflon.TextBox.style = {
    "_": {
        "appearance": "none",
        "outline": "none",
        "border": "1px solid lightgray",
        "borderRadius": "10px",
        "height": "30px",
        "fontFamily": "'Source Sans Pro', sans-seruf",
        "color": "gray",
        "padding": "0 10px 0 10px",
        "fontSize": "14px",
        "width": "200px",
        "&:focus": {
            "border": "1px solid dodgerblue"
        }
    }
};

aflon.PassBox.style = aflon.TextBox.style;

AflonStudio.register({
    class: aflon.TextBox
});

AflonStudio.register({
    class: aflon.PassBox
});

aflon.Button.style = {
    "_": {
        "padding": "7px 20px",
        "color": "white",
        "fontFamily": "'Source Sans Pro', sans-serif",
        "background": "black",
        "outline": "0",
        "appearance": "none",
        "border": "solid 1px black",
        "borderRadius": "100px",
        "fontSize": "15px",
        "boxShadow": "0px 2px 6px 0px rgba(0,0,0,0.3)",
        "&:focus": {
            "border": "solid 1px red"
        },
        "&:active": {
            "transform": "translate(0, 1px)"
        }
    }
};

AflonStudio.register({
    class: aflon.Button,
    initializer: element => element.setText("Submit"),
    backgroundColor: "#C4C4C4"
});
