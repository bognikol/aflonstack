import { style, media, cssRaw, cssRule } from "typestyle";
import * as typestyleTypes from "typestyle/lib/types";

/** JavaScript object representation of CSS. */
export type CSSProperties = typestyleTypes.CSSProperties | typestyleTypes.NestedCSSSelectors;

export type NestedCSSProperties = typestyleTypes.NestedCSSProperties;
export type MediaQuery = typestyleTypes.MediaQuery;

/** Utility class which groups collection of static functions. */
export class CSS {

    /**
     * Takes CSSProperties, registerd CSS style with properties from it,
     * and returns name of the registered class.
     *
     * @remarks
     * This function is a proxy for typestyle.style function.
     * View typestyle documentation for details.
     *
     * @param css - CSSProperties object which defines
     * CSS style to be registered as a CSS class.
     */
    static class(css: CSSProperties): string {
        return style(css as typestyleTypes.CSSProperties);
    }

    /**
     * @alpha
     */
    static media(mediaQuery: MediaQuery, ...css: NestedCSSProperties[]): NestedCSSProperties {
        return media(mediaQuery, ...css);
    }

    /**
     * Imports CSS document from given url.
     *
     * @param url - Url of CSS document.
     */
    static import(url: string): void {
        cssRaw(`@import url('${url}');`);
    }

    /**
     * Creates a CSS rule from CSSProperties.
     *
     * @param selector - CSS selector of the rule to be created.
     * @param css - NestedCSSProperties object which represents style of the rule.
     */
    static createRule(selector: string, css: NestedCSSProperties): void {
        cssRule(selector, css);
    }

    static extendAflonCss(baseStyle: AflonCss, extensionStyle: AflonCss): AflonCss {
        let allKeys = new Set([ ...Object.keys(baseStyle), ...Object.keys(extensionStyle) ]);

        let newAflonCss: AflonCss = {};

        for (let key of allKeys) {
            newAflonCss[key] = { ...baseStyle[key], ...extensionStyle[key] };
        }

        return newAflonCss;
    }
}

/**
 * Style definition of a component, set to its static style field.
 *
 * @remarks
 * AflonCss is a string record of CSSProperties.
 */
export type AflonCss = Record<string, CSSProperties>;
