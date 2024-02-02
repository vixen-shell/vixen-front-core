import { Hypr } from '../library'

export function setupHyprEvents(element: HTMLButtonElement) {
    let hyprEventsIsActive: boolean

    const setHyprEvents = (isActive: boolean) => {
        hyprEventsIsActive = isActive

        element.innerHTML = hyprEventsIsActive
            ? 'Stop Hypr events listening'
            : 'Start Hypr events listening'

        const showEvents = (data: object) => {
            console.log(data)
        }

        if (hyprEventsIsActive) {
            Hypr.addEventListener('all', showEvents)
        } else {
            Hypr.removeEventListener('all', showEvents)
        }
    }

    element.addEventListener('click', () => setHyprEvents(!hyprEventsIsActive))
    setHyprEvents(false)
}
