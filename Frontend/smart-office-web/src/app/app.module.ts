import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthenticateComponent } from './login/authenticate/authenticate.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/authentication.service';
import { HttpService } from './shared/http.service';
import { SmartofficeComponent } from './smartoffice/smartoffice.component';
import { HeaderComponent } from './smartoffice/header/header.component';
import { AuthGuard } from './login/authenticate/auth-guard.service';
import { UsersComponent } from './smartoffice/users/users.component';
import { UserService } from './shared/users.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Browser } from 'protractor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule } from '@angular/material';
import { ProjectsComponent } from './smartoffice/projects/projects.component';
import { ProjectService } from './shared/projects.service';
import { HoursComponent } from './smartoffice/hours/hours.component';
import { HourService } from './shared/hours.service';
import { RequestsComponent } from './smartoffice/requests/requests.component';
import { ChartsModule } from 'ng2-charts';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '2fa', component: AuthenticateComponent },
  {
    path: 'main', component: SmartofficeComponent, canActivate: [AuthGuard], children: [
      { path: 'users', component: UsersComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'hours', component: HoursComponent },
      { path: 'requests', component: RequestsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthenticateComponent,
    SpinnerComponent,
    SmartofficeComponent,
    HeaderComponent,
    UsersComponent,
    ProjectsComponent,
    HoursComponent,
    RequestsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ChartsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, HttpService, AuthGuard, UserService, ProjectService, HourService],
  bootstrap: [AppComponent]
})
export class AppModule { }
