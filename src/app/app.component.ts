import {
    Component,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';
const ipcRenderer = require('electron').ipcRenderer;

@Component({
    moduleId: module.id,
    selector: 'my-app',
    template: `
  <div class="container" @state="componentState">
    <h1 #myList>{{text_hello_world}} <small>{{text_small}}</small></h1>
    <input type="text" class="form-control" [(ngModel)]="text_small">
    <br/>
    <button (click)="ping()">Ping</button>
  </div>
  `,
    animations: [
        trigger("state", [
            transition("void => *", [
                style({transform: 'translateX(-100%)'}),
                animate(100)
            ])
        ])
    ]
})
export class AppComponent {
    private text_hello_world: string = "Hello Angular 2!";
    private text_small: string = "Greatness awaits..."
    private componentState: string = "active";

    constructor() {
        ipcRenderer.on('reply', (sender, arg) => {
            alert(`Reply was ${arg}`);
        });
    }

    ping() {
        ipcRenderer.send('message', 'ping');
    }
}
