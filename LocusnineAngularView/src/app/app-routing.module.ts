import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './view/users/users.component';
import { NavbarComponent } from './view/navbar/navbar.component';



const routes: Routes = [
  //{ path: 'error', component: ErrorPageComponent},
  { path: 'home', component: UsersComponent },
  { path: 'navBar', component: NavbarComponent },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
