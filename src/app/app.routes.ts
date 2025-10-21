import { Routes } from '@angular/router';

export const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
  
    path: 'resgister',
    loadComponent: () => import('./resgister/resgister.page').then( m => m.ResgisterPage)
  },
  {
    path: 'settingns',
    loadComponent: () => import('./settingns/settingns.page').then( m => m.SettingnsPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage)
  },
];
