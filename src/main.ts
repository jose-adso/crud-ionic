import { initializeApp, getApps } from 'firebase/app';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
 
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
 
// Inicializar Firebase de forma centralizada antes de bootstrap para evitar
// errores en servicios que llaman a getAuth() o getFirestore() en su constructor.
if (getApps().length === 0) {
  initializeApp(environment.firebase);
  console.log('Firebase inicializado en main.ts');
}
 
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
