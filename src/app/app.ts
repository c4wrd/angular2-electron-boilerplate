import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.template.html'
})
export class AppComponent{
  private hello_world: string = "Hello Angular 2";
}
