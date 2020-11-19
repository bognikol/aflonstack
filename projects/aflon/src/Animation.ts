import * as popmotion from "popmotion";
import * as stylefire from "stylefire";
import * as typestyleTypes from "typestyle/lib/types";

import { AflonHtmlElement, Element } from "./Element";

export type EasingFunc = (value: number) => number;

export type PredefinedEasing = "linear" | "anticipate" |
    "easeIn"   | "easeOut"   | "easeInOut" |
    "circIn"   | "circOut"   | "circInOut" |
    "backIn"   | "backOut"   | "backInOut" |
    "bounceIn" | "bounceOut" | "bounceInOut";

export let PredefinedEasingFuncs: Record<PredefinedEasing, EasingFunc> = {
    linear:      popmotion.easing.linear,
    easeIn:      popmotion.easing.easeIn,
    easeOut:     popmotion.easing.easeOut,
    easeInOut:   popmotion.easing.easeInOut,
    circIn:      popmotion.easing.circIn,
    circOut:     popmotion.easing.circOut,
    circInOut:   popmotion.easing.circInOut,
    backIn:      popmotion.easing.backIn,
    backOut:     popmotion.easing.backOut,
    backInOut:   popmotion.easing.backInOut,
    anticipate:  popmotion.easing.anticipate,
    bounceOut:   popmotion.easing.bounceOut,
    bounceIn:    popmotion.easing.bounceIn,
    bounceInOut: popmotion.easing.bounceInOut
};

export type Easing = PredefinedEasing | EasingFunc;

export interface AnimationFallBackDefinition {
    target?: string;
    ease?: Easing;
    duration?: number;
    delay?: number;
    elapsed?: number;
    loop?: number;
    flip?: number;
    yoyo?: number;
}

export declare type AnimatableValue = number | string;

export interface PrimitiveAnimationDefintion extends AnimationFallBackDefinition {
    track: keyof typestyleTypes.CSSProperties;
    to: AnimatableValue;
    from?: AnimatableValue;
}

export interface AnimationDefinition extends AnimationFallBackDefinition {
    animations: PrimitiveAnimationDefintion[]
}

export type AflonAnimationDefinition = Record<string, AnimationDefinition>;

class PrimitiveAnimation {

    private _autoFrom: boolean = false;
    private _animationDefinition: PrimitiveAnimationDefintion;
    private _animation: popmotion.ColdSubscription;
    private _styler: stylefire.Styler;
    private _durationWithAfterDelay: number;
    private _context: Element;
    private _ease: EasingFunc;

    constructor(animationDefinition: PrimitiveAnimationDefintion, context: Element, durationWithAfterDelay: number = 0) {
        this._animationDefinition = animationDefinition;
        this._context = context;
        this._durationWithAfterDelay = durationWithAfterDelay;
        if (animationDefinition.from === undefined)
            this._autoFrom = true;
    }

    start(onComplete?: () => void): void {
        if (this._autoFrom || !this._animation) {
            this._animation = this._createAndStartAnimation(onComplete);
        } else {
            this._animation.resume();
        }
    }

    async startAsync(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.start(() => {
                resolve();
            });
        });
    }

    stop(): void {
        if (!this._animation) return;
        this._animation.pause();
    }

    toBegining(): void {
        if (!this._autoFrom) return;

        if (!this._styler) this._prepeareStyler();
        this._styler.set(this._animationDefinition.track, this._animationDefinition.from);
    }

    toEnd(): void {
        if (!this._styler) this._prepeareStyler();
        this._styler.set(this._animationDefinition.track, this._animationDefinition.to);
    }

    getElapsed(): number {
        if (!this._animation) return 0;
        return this._animation.getElapsed();
    }

    getProgress(): number {
        if (!this._animation) return 0;
        return this._animation.getProgress();
    }

    private _prepeareStyler() {
        if (this._styler) return;

        if (this._animationDefinition.target === undefined ||
            this._animationDefinition.target === "")
            this._styler = (this._context.getHtmlElement() as AflonHtmlElement).styler;
        else
            this._styler = ((this._context as any)[this._animationDefinition.target].getHtmlElement() as AflonHtmlElement).styler;

    }

    private _createAndStartAnimation(onComplete: () => void): popmotion.ColdSubscription {
        this._prepeareStyler();

        if (typeof(this._animationDefinition.ease) == "string" &&
            PredefinedEasingFuncs[this._animationDefinition.ease]) {
            this._ease = PredefinedEasingFuncs[this._animationDefinition.ease];
        } else if (typeof(this._animationDefinition.ease) == "function") {
            this._ease = this._animationDefinition.ease;
        } else {
            this._ease = PredefinedEasingFuncs.linear;
        }

        let totalDuration: number = this._animationDefinition.duration + this._animationDefinition.delay;
        if (totalDuration < this._durationWithAfterDelay)
            totalDuration = this._durationWithAfterDelay;

        let effectiveFrom: AnimatableValue = this._animationDefinition.from;
        if (this._autoFrom)
            effectiveFrom = this._styler.get(this._animationDefinition.track);

        return popmotion.keyframes({
            values: [
                effectiveFrom as string,
                effectiveFrom as string,
                this._animationDefinition.to as string,
                this._animationDefinition.to as string
            ],
            times: [
                0,
                this._animationDefinition.delay / totalDuration,
                (this._animationDefinition.delay + this._animationDefinition.duration) / totalDuration,
                1
            ],
            easings: [popmotion.easing.linear, this._ease, popmotion.easing.linear],
            duration: totalDuration,
            elapsed: this._animationDefinition.elapsed,
            flip: this._animationDefinition.flip,
            loop: this._animationDefinition.loop,
            yoyo: this._animationDefinition.yoyo
        }).start({
            update: (v: any) => this._styler.set(this._animationDefinition.track, v),
            complete: () => {
                if (onComplete)
                    onComplete();
            }
        });
    }
}

export class Animation {

    private _primitiveAnimations: PrimitiveAnimation[] = [];

    constructor(animationDefinition: AnimationDefinition, context: Element) {
        const fallbackAnimationDefinition: AnimationFallBackDefinition = {
            ease:     PredefinedEasingFuncs.linear,
            duration: 300,
            delay:    0,
            elapsed:  0,
            loop:     0,
            flip:     0,
            yoyo:     0
        };

        if (animationDefinition.target)   fallbackAnimationDefinition.target   = animationDefinition.target;
        if (animationDefinition.ease)     fallbackAnimationDefinition.ease     = animationDefinition.ease;
        if (animationDefinition.duration) fallbackAnimationDefinition.duration = animationDefinition.duration;
        if (animationDefinition.delay)    fallbackAnimationDefinition.delay    = animationDefinition.delay;
        if (animationDefinition.elapsed)  fallbackAnimationDefinition.elapsed  = animationDefinition.elapsed;
        if (animationDefinition.loop)     fallbackAnimationDefinition.loop     = animationDefinition.loop;
        if (animationDefinition.flip)     fallbackAnimationDefinition.flip     = animationDefinition.flip;
        if (animationDefinition.yoyo)     fallbackAnimationDefinition.yoyo     = animationDefinition.yoyo;

        const primitiveAnimationDefinitions: PrimitiveAnimationDefintion[] =
            animationDefinition.animations.map(
                animation => ({ ...fallbackAnimationDefinition, ...animation })
            );

        let maxDuration = 0;

        primitiveAnimationDefinitions.forEach(animation => {
            const fullDuration = + animation.delay + animation.duration;
            if (maxDuration < fullDuration)
                maxDuration = fullDuration;
        });

        this._primitiveAnimations =
            primitiveAnimationDefinitions.map(
                animDefinition => new PrimitiveAnimation(animDefinition, context, maxDuration)
            );
    }

    start(onComlete?: () => void): void {
        let completed: boolean = false;
        this._primitiveAnimations.forEach(animation => animation.start(() => {
            if (completed) return;
            onComlete();
        }));
    }

    async startAsync(): Promise<void> {
        return new Promise<void>(resolve => {
            this.start(() => {
                resolve();
            });
        });
    }

    stop(): void {
        this._primitiveAnimations.forEach(animation => animation.stop());
    }

    toBegining(): void {
        this._primitiveAnimations.forEach(animation => animation.toBegining());
    }

    toEnd(): void {
        this._primitiveAnimations.forEach(animation => animation.toEnd());
    }

    getElapsed(): number {
        if (this._primitiveAnimations.length == 0)
            return 0;

        return this._primitiveAnimations[0].getElapsed();
    }

    getProgress(): number {
        if (this._primitiveAnimations.length == 0)
            return 0;

        return this._primitiveAnimations[0].getProgress();
    }
}

export function animate(context: Element, definition: PrimitiveAnimationDefintion, onComleted?: () => void): void {
    new PrimitiveAnimation(definition, context).start(onComleted);
}

export async function animateAsync(context: Element, definition: PrimitiveAnimationDefintion): Promise<void> {
    return new PrimitiveAnimation(definition, context).startAsync();
}

export class Anims {
    static fadeIn(element: Element, duration: number = 250, ease: Easing = "linear", onComplete?: () => void): void {
        let animation = new Animation({
            animations: [{ track: "opacity", to: "1.0", duration: duration, ease: ease }]
        }, element);
        animation.start(onComplete);
    }

    static async fadeInAsync(element: Element, duration: number = 250, ease: Easing = "linear"): Promise<void> {
        let animation = new Animation({
            animations: [{ track: "opacity", to: "1.0", duration: duration, ease: ease }]
        }, element);
        return animation.startAsync();
    }
}
