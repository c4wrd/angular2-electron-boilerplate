import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
  <div class="container">
    <h1 #myList>{{text_hello_world}} <small>{{text_small}}</small></h1>
    <input type="text" class="form-control" [(ngModel)]="text_small">
  </div>
  `
})
export class AppComponent{
  private text_hello_world: string = "Hello Angular 2!";
  private text_small: string = "Greatness awaits..."
}
