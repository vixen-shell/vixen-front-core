import { hyprEventsHandler } from './HyprEvents'

type EventId =
    | 'workspace'
    | 'focusedmon'
    | 'activewindow'
    | 'fullscreen'
    | 'monitorremoved'
    | 'monitoradded'
    | 'createworkspace'
    | 'destroyworkspace'
    | 'moveworkspace'
    | 'activelayout'
    | 'openwindow'
    | 'closewindow'
    | 'movewindow'
    | 'openlayer'
    | 'closelayer'
    | 'submap'
    | 'changefloatingmode'
    | 'urgent'
    | 'minimize'
    | 'screencast'
    | 'windowtitle'

export namespace Hypr {
    const allEventIds: EventId[] = [
        'workspace',
        'focusedmon',
        'activewindow',
        'fullscreen',
        'monitorremoved',
        'monitoradded',
        'createworkspace',
        'destroyworkspace',
        'moveworkspace',
        'activelayout',
        'openwindow',
        'closewindow',
        'movewindow',
        'openlayer',
        'closelayer',
        'submap',
        'changefloatingmode',
        'urgent',
        'minimize',
        'screencast',
        'windowtitle',
    ]

    const eventListener = {
        add: (eventId: EventId, listener: (data: object) => any) => {
            hyprEventsHandler.addEventListener(eventId, listener)
        },
        remove: (eventId: EventId, listener: (data: object) => any) => {
            hyprEventsHandler.removeEventListener(eventId, listener)
        },
    }

    function handleEventListener(
        handleListener: (
            eventId: EventId,
            listener: (data: object) => any
        ) => void,
        eventIds: (EventId | 'all') | EventId[],
        listener: (data: object) => any
    ) {
        if (Array.isArray(eventIds)) {
            eventIds.forEach((eventId) => handleListener(eventId, listener))
        }

        if (typeof eventIds === 'string') {
            if (eventIds === 'all') {
                allEventIds.forEach((eventId) =>
                    handleListener(eventId, listener)
                )
            } else {
                handleListener(eventIds, listener)
            }
        }
    }

    export function addEventListener(
        eventIds: (EventId | 'all') | EventId[],
        listener: (data: object) => any
    ) {
        handleEventListener(eventListener.add, eventIds, listener)
    }

    export function removeEventListener(
        eventIds: (EventId | 'all') | EventId[],
        listener: (data: object) => any
    ) {
        handleEventListener(eventListener.remove, eventIds, listener)
    }

    export function startEventsListening() {
        hyprEventsHandler.startListening()
    }

    export function stopEventsListening() {
        hyprEventsHandler.stopListening()
    }
}
