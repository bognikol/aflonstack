import { Element } from "./Element";

/**
 * Represents an Aflon application.
 */
export class App {
    /**
     * Runs an Aflon application.
     *
     * @param root - aflon.Element which should be run as an application.
     * @param rootId - id of HTML element where root Element should be inserted.
     *
     * @remarks
     * If rootId is not provided, root will be appended to existing body element.
     * If rootIt is provided and existent, root will be appended to it.
     * If rootId is provided but non-existent, an Error will be thrown.
     */
    static run(root: Element, rootId: string = null): void {
        if (rootId == null) {
            document.body.appendChild(root.getHtmlElement());
            <any>root["_reportDomChange"](true);
            return;
        }

        let element = document.getElementById(rootId);
        if (element) {
            element.appendChild(root.getHtmlElement());
            <any>root["_reportDomChange"](true);
        } else {
            throw new Error(`Error running Aflon application. Cannot find root element with id ${rootId}.`);
        }
    }
}
