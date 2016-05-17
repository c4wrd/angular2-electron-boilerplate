import {Component} from '@angular/core';  

@Component({
  selector: 'my-app',
  template: `<h1>Hi!</h1>`
})
export class AppComponent{  
  private hello_world: string = "Hello Angular 2";
}