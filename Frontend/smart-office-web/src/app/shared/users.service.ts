import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';

@Injectable()
export class UserService {
  getAllPath = '';
  createUserPath = '';
  editDeleteUserPath = '';
  constructor(private httpService: HttpService,
    private http: HttpClient,
    private router: Router) {
    this.http.get('../../assets/config.json').subscribe(
      data => {
        this.getAllPath = data['getAllUsers'];
        this.createUserPath = data['createUser'];
        this.editDeleteUserPath = data['editDeleteUser'];
      },
      err => { console.log(err); }
    );
  }

  getAllUsers() {
    return this.httpService.get(this.getAllPath, localStorage.getItem('tfatoken'));
  }

  createUser(data) {
    const body = {
      firstname : data.firstname,
      lastname : data.lastname,
      username : data.username,
      password: data.password,
      sex : data.sex,
      age : data.age,
      email : data.email,
      address : data.address,
      position : data.position,
      accessCard : data.accesscode,
      role : data.role,
      cnp : data.cnp
    };
    console.log(body);
    return this.httpService.post(this.createUserPath, localStorage.getItem('tfatoken'), body);
  }

  deleteUser(id, data) {
    const body = {
      username: data.username
    };
    return this.httpService.delete(this.editDeleteUserPath, localStorage.getItem('tfatoken'), body, id);
  }

  editUser(id, data) {
    return this.httpService.put(this.editDeleteUserPath, id, localStorage.getItem('tfatoken'), data);
  }
}
