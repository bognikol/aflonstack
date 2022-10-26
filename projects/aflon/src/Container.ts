import { Div, Element } from "./Element";

/**
 * Container is a Div whose all children are of same Aflon type.
 *
 * Container facilitates strongly-typed syntax when working with
 * direct children.
 */
export class Container<TChild extends Element> extends Div {
    /**
     * Appends Array of TChildren to children, where TChild is
     * Container's children type.
     *
     * @param children - Array of TChildren to be appended.
     */
    public append(children: TChild[]): this {
        super.append(children);
        return this;
    }

    /**
     * Prepends Array of TChildren to children, where TChild is
     * Container's children type.
     *
     * @param children - Array of TChildren to be appended.
     */
    public prepend(children: TChild[]): this {
        super.prepend(children);
        return this;
    }

    /**
     * Returns Array of TChildren which represent children of
     * this aflon.Container, where TChild is the Container's
     * children type.
     *
     * Only children created by aflon will be returned. If a
     * child is added using native DOM manipulation, it will
     * be skipped.
     */
    public children(): Array<TChild> {
        return super.children().map(child => <TChild>child);
    }

    /**
     * Removes TChild from list of its children, where TChild is
     * Container's children type.
     *
     * @param child - TChild to be removed.
     */
    public removeChild(child: TChild): this {
        this.removeChild(child);
        return this;
    }
}
