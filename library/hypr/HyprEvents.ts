class EventAccumulator {
    id: string

    private _eventStatus: { [key: string]: boolean } = {}
    private _data: {} = {}
    private _listeners: Array<(data: object) => any> = []

    constructor(id: string, eventIds: string[]) {
        this.id = id
        eventIds.forEach((id) => {
            this._eventStatus[id] = false
        })
    }

    private get _state() {
        const values = Object.values(this._eventStatus)
        return values.every((value) => value === true)
    }

    private _reset() {
        for (const key in this._eventStatus) {
            this._eventStatus[key] = false
        }
        this._data = {}
    }

    private _getEventListenerIndex(listener: (data: object) => any) {
        let index: number = -1

        for (let i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i].name === listener.name) {
                index = i
                break
            }
        }

        return index
    }

    has(eventId: string) {
        return eventId in this._eventStatus
    }

    update(eventId: string, data: {}) {
        this._eventStatus[eventId] = !this._eventStatus[eventId]
        this._data = { ...this._data, ...data }

        if (this._state) {
            this._listeners.forEach((listener) => {
                listener({ id: this.id, ...this._data })
            })
            this._reset()
        }
    }

    addListener(listener: (data: object) => any) {
        const index = this._getEventListenerIndex(listener)

        if (index) {
            this._listeners.push(listener)
        } else {
            console.error(
                `Listener ${listener.name} already exists on ${this.id} event!`
            )
        }
    }

    removeListener(listener: (data: object) => any) {
        const index = this._getEventListenerIndex(listener)

        if (index !== -1) {
            this._listeners.splice(index, 1)
        }
    }
}

class HyprEventsHandler {
    private _webSocket: WebSocket | null = null
    private _listeners: Map<string, Array<(data: object) => any>> = new Map()
    private _eventAccumulators: EventAccumulator[] = []

    private _getEventListenerIndex(
        eventListeners: ((data: object) => any)[],
        listener: (data: object) => any
    ) {
        let index: number = -1

        for (let i = 0; i < eventListeners.length; i++) {
            if (eventListeners[i].name === listener.name) {
                index = i
                break
            }
        }

        return index
    }

    addEventAccumulator(eventAccumulator: EventAccumulator) {
        this._eventAccumulators.push(eventAccumulator)
    }

    addEventListener(eventId: string, listener: (data: object) => any) {
        let isEventAccumulator = false

        this._eventAccumulators.forEach((eventAccumulator) => {
            if (eventAccumulator.id === eventId) {
                isEventAccumulator = true
                eventAccumulator.addListener(listener)
            }
        })

        if (!isEventAccumulator) {
            if (this._listeners.has(eventId)) {
                const eventListeners = this._listeners.get(eventId)
                const index = this._getEventListenerIndex(
                    eventListeners!,
                    listener
                )

                if (index === -1) {
                    eventListeners!.push(listener)
                } else {
                    console.error(
                        `Listener ${listener.name} already exists on ${eventId} event!`
                    )
                }
            } else {
                this._listeners.set(eventId, [listener])
            }
        }
    }

    removeEventListener(eventId: string, listener: (data: object) => any) {
        let isEventAccumulator = false

        this._eventAccumulators.forEach((eventAccumulator) => {
            if (eventAccumulator.id === eventId) {
                isEventAccumulator = true
                eventAccumulator.removeListener(listener)
            }
        })

        if (!isEventAccumulator) {
            if (this._listeners.has(eventId)) {
                const eventListeners = this._listeners.get(eventId)
                if (eventListeners) {
                    const index = this._getEventListenerIndex(
                        eventListeners,
                        listener
                    )

                    if (index !== -1) {
                        eventListeners.splice(index, 1)
                    }
                    if (eventListeners.length === 0) {
                        this._listeners.delete(eventId)
                    }
                }
            }
        }
    }

    startListening() {
        if (!this._webSocket) {
            this._webSocket = new WebSocket('ws://127.0.0.1:6481/hypr/events')

            this._webSocket.onmessage = (e) => {
                const data = JSON.parse(e.data)

                this._eventAccumulators.forEach((eventAccumulator) => {
                    if (eventAccumulator.has(data.id))
                        eventAccumulator.update(data.id, data.data)
                })

                if (this._listeners.has(data.id)) {
                    const listeners = this._listeners.get(data.id)

                    if (Array.isArray(listeners)) {
                        listeners.forEach((listener) => {
                            listener({ id: data.id, ...data.data })
                        })
                    }
                }
            }
        }
    }

    stopListening() {
        if (this._webSocket) {
            this._webSocket.close()
            this._webSocket = null
        }
    }
}

const activeWindowAccumulator = new EventAccumulator('activewindow', [
    'activewindow',
    'activewindowv2',
])

const hyprEventsHandler = new HyprEventsHandler()
hyprEventsHandler.addEventAccumulator(activeWindowAccumulator)

export { hyprEventsHandler }
