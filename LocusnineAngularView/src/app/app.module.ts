import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './view/users/users.component';
import { UserService } from './service/user.service';
import { UserServiceImpl } from './service/user.service.impl';
import { NavbarComponent } from './view/navbar/navbar.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [
    {provide: UserService, useClass: UserServiceImpl},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
