import { Element } from "./Element";

export class App {
    static run(root: Element, rootId: string = null): void {
        if (rootId == null) {
            document.body.appendChild(root.getHtmlElement());
            return;
        }

        let element = document.getElementById(rootId);
        if (element)
            element.appendChild(root.getHtmlElement());
        else
            throw new Error(`Error running Aflon application. Cannot find root element with id ${rootId}.`);
    }
}
