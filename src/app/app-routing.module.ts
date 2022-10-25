import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './componentes/home/home-page/home-page.component';

const routes: Routes = [
  {
    path:'',
    loadChildren:() => import('./componentes/login/login.module').then(m =>m.LoginModule),
  },
  {
    path:'registro',
    loadChildren:() => import('./componentes/registro/registro.module').then(m => m.RegistroModule),
  },
  {
    path:'home',
    loadChildren:() => import('./componentes/home/home.module').then(m => m.HomeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
