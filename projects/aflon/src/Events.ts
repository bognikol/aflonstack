/** A DOM event name carrying its listener's event type. */
export interface EventDescriptor<TEvent extends Event> {
    readonly name: string;
    readonly eventType?: TEvent;
}

export type NativeEvent = HTMLElementEventMap & WindowEventMap;
export type NativeEventName = keyof NativeEvent;

/** Creates typed identifiers for native and custom DOM events. */
export class Events {
    static native<TName extends NativeEventName>(name: TName): EventDescriptor<NativeEvent[TName]> {
        return { name };
    }

    static custom<TPayload = void>(name: string): EventDescriptor<CustomEvent<TPayload>> {
        return { name };
    }
}
