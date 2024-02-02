import './style.css'
import typescriptLogo from './typescript.svg'
import vixenLogo from '/vixen.svg'
import { setupHyprEvents } from './hyprEvents'
import { Hypr } from '../library'

Hypr.startEventsListening()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
        <a href="https://github.com/vixen-shell" target="_blank">
            <img src="${vixenLogo}" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
            <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
        </a>
        <h1>Vixen + TypeScript</h1>
        <div class="card">
            <button id="counter" type="button"></button>
        </div>
        <p class="read-the-docs">
            Click on the Vixen and TypeScript logos to learn more
        </p>
    </div>
`

setupHyprEvents(document.querySelector<HTMLButtonElement>('#counter')!)
