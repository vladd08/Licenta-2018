import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';

@Injectable()
export class AuthService {
  error = '';
  loading: Boolean = false;
  testPath = '';
  loginPath = '';
  tfaPath = '';
  token = '';
  constructor(private httpService: HttpService,
              private http: HttpClient,
              private router: Router) {
      this.http.get('../../assets/config.json').subscribe(
        data  => {
          this.testPath = data['test'];
          this.loginPath = data['login'];
          this.tfaPath = data['2fa'];
        },
        err => { console.log(err); }
      );
  }

  login(username: string, password: string) {
    this.loading = true;
    this.error = '';
    const body = { 'username' : username , 'password' : password };
    this.httpService.post(this.loginPath, '', body).subscribe(
      (data: User) => {
        this.error = '';
        localStorage.setItem('token', (this.token = data.token));
        this.loading = false;
        localStorage.setItem('name' , data.firstname + ' ' + data.lastname);
        this.router.navigateByUrl('/2fa');
      },
      err => {
        console.log(err);
        this.error = err;
        this.loading = false;
       }
    );
  }

  authenticate(code: string) {
    if (!localStorage.getItem('token')) {
      return;
    }
    const body = { 'tfaCode' : code };
    this.httpService.post(this.tfaPath, localStorage.getItem('token'), body).subscribe(
      (data: any) => {
        this.error = '';
        localStorage.removeItem('token');
        this.token = data.token;
        localStorage.setItem('tfatoken', data.token);
        localStorage.setItem('role', data.role);
        this.router.navigateByUrl('/main');
      },
      err => {
        this.error = err;
        console.log(err);
      }
    );
  }

  logout() {
    localStorage.removeItem('tfatoken');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    this.token = '';
    this.router.navigateByUrl('/login');
  }

  isAuthenticated() {
    return localStorage.getItem('tfatoken') != null;
  }
}
