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
  {
   path: 'profile',
   loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
 },
 {
   path: 'cow-register',
   loadComponent: () => import('./cow-register/cow-register.page').then( m => m.CowRegisterPage)
 },
 {
   path: 'cow-list',
   loadComponent: () => import('./cow-list/cow-list.page').then( m => m.CowListPage)
 },
 {
   path: 'health-control/:cowId',
   loadComponent: () => import('./health-control/health-control.page').then( m => m.HealthControlPage)
 },
  {
    path: 'health-history',
    loadComponent: () => import('./health-history/health-history.page').then( m => m.HealthHistoryPage)
  },



];
