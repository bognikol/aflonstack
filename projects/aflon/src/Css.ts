import { style, media, cssRaw } from "typestyle";
import * as typestyleTypes from "typestyle/lib/types";

export type CSSProperties = typestyleTypes.CSSProperties | typestyleTypes.NestedCSSSelectors;

export type NestedCSSProperties = typestyleTypes.NestedCSSProperties;
export type MediaQuery = typestyleTypes.MediaQuery;


export class CSS {
    static class(css: CSSProperties): string {
        return style(css as typestyleTypes.CSSProperties);
    }

    static media(mediaQuery: MediaQuery, ...css: NestedCSSProperties[]): NestedCSSProperties {
        return media(mediaQuery, ...css);
    }

    static importUrl(url: string): void {
        cssRaw(`@import url('${url}');`);
    }
}

export type AflonCss = Record<string, CSSProperties>;