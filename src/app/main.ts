import { PlatformRef } from '@angular/core/src/application_ref';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';


const platform: PlatformRef = platformBrowserDynamic();
platform.bootstrapModule(AppModule);