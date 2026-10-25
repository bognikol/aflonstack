import { EventDescriptor } from "./Events";

/** A custom event raised on behalf of an arbitrary object. */
export class SimpleEvent<TPayload = void> extends CustomEvent<TPayload> {
    constructor(name: string, public readonly sender: object, detail: TPayload) {
        super(name, { detail });
    }
}

/** Handles custom events without requiring a DOM element. */
export interface ISimpleEventable {
    on<TPayload>(eventName: EventDescriptor<CustomEvent<TPayload>>, handler: (event: SimpleEvent<TPayload>) => void, options?: boolean | AddEventListenerOptions): this;
    on(eventName: string, handler: SimpleEventListener, options?: boolean | AddEventListenerOptions): this;
    off<TPayload>(eventName: EventDescriptor<CustomEvent<TPayload>>, handler: (event: SimpleEvent<TPayload>) => void, options?: boolean | EventListenerOptions): this;
    off(eventName: string, handler: SimpleEventListener, options?: boolean | EventListenerOptions): this;
    raise<TPayload>(eventName: EventDescriptor<CustomEvent<TPayload>>, ...args: [TPayload] extends [void] ? [args?: NoInfer<TPayload>] : [args: NoInfer<TPayload>]): this;
    raise(eventName: string, args?: Record<string, unknown>): this;
}

/** Handles a string-identified broker event. */
export type SimpleEventListener = (event: SimpleEvent<Record<string, unknown>>) => void;

/** Dispatches owner-aware custom events through a standalone EventTarget. */
export class SimpleEventBroker implements ISimpleEventable {
    private readonly _target = new EventTarget();

    constructor(private readonly _owner: object) {}

    on<TPayload>(eventName: EventDescriptor<CustomEvent<TPayload>>, handler: (event: SimpleEvent<TPayload>) => void, options?: boolean | AddEventListenerOptions): this;
    on(eventName: string, handler: SimpleEventListener, options?: boolean | AddEventListenerOptions): this;
    on(eventName: string | EventDescriptor<Event>, handler: SimpleEventListener, options?: boolean | AddEventListenerOptions): this {
        this._target.addEventListener(typeof eventName === "string" ? eventName : eventName.name, handler as EventListener, options);
        return this;
    }

    off<TPayload>(eventName: EventDescriptor<CustomEvent<TPayload>>, handler: (event: SimpleEvent<TPayload>) => void, options?: boolean | EventListenerOptions): this;
    off(eventName: string, handler: SimpleEventListener, options?: boolean | EventListenerOptions): this;
    off(eventName: string | EventDescriptor<Event>, handler: SimpleEventListener, options?: boolean | EventListenerOptions): this {
        this._target.removeEventListener(typeof eventName === "string" ? eventName : eventName.name, handler as EventListener, options);
        return this;
    }

    raise<TPayload>(eventName: EventDescriptor<CustomEvent<TPayload>>, ...args: [TPayload] extends [void] ? [args?: NoInfer<TPayload>] : [args: NoInfer<TPayload>]): this;
    raise(eventName: string, args?: Record<string, unknown>): this;
    raise(eventName: string | EventDescriptor<Event>, args?: unknown): this {
        this._target.dispatchEvent(new SimpleEvent(typeof eventName === "string" ? eventName : eventName.name, this._owner, typeof eventName === "string" && args === undefined ? {} : args));
        return this;
    }
}
