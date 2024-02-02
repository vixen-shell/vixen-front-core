import { hyprEventsHandler } from './HyprEvents'

export namespace Hypr {
    export enum EventIds {
        workspace = 'workspace',
        focusedmon = 'focusedmon',
        activewindow = 'activewindow',
        fullscreen = 'fullscreen',
        monitorremoved = 'monitorremoved',
        monitoradded = 'monitoradded',
        createworkspace = 'createworkspace',
        destroyworkspace = 'destroyworkspace',
        moveworkspace = 'moveworkspace',
        activelayout = 'activelayout',
        openwindow = 'openwindow',
        closewindow = 'closewindow',
        movewindow = 'movewindow',
        openlayer = 'openlayer',
        closelayer = 'closelayer',
        submap = 'submap',
        changefloatingmode = 'changefloatingmode',
        urgent = 'urgent',
        minimize = 'minimize',
        screencast = 'screencast',
        windowtitle = 'windowtitle',
    }

    export type EventId = keyof typeof EventIds

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
                for (const eventId in EventIds) {
                    handleListener(eventId as EventId, listener)
                }
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
