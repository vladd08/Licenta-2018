import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/users.service';
import { User } from '../../shared/user.model';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'so-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
  user: User = new User();
  loading = false;
  showAddForm = false;
  showDetailForm = false;
  unauthorized = false;
  ageInput = '';
  codeInput = '';
  ageError = false;
  showEditForm = false;
  accessCodeError = false;
  constructor(private userService: UserService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      this.getAll();
    }, 2000);
  }

  getAll() {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
      this.userService.users = this.users;
      this.loading = false;
    },
      err => {
        this.loading = false;
        this.unauthorized = true;
      });
  }

  showAddModal(edit?, index?) {
    if (edit) {
      this.showEditForm = true;
      this.user = this.users[index];
    } else {
      this.showEditForm = false;
      this.user = null;
    }
    this.showAddForm = !this.showAddForm;
  }

  onKeyPressed() {
    const regexp = new RegExp('[a-zA-Z]');
    if (regexp.test(this.ageInput)) {
      this.ageError = true;
    } else {
      this.ageError = false;
    }
  }

  onKeyPressedAccess() {
    const regexp = new RegExp('[a-zA-Z]');
    if (regexp.test(this.codeInput)) {
      this.accessCodeError = true;
    } else {
      this.accessCodeError = false;
    }
  }

  onSubmitAdd(form: NgForm, state?, userdata?) {
    if (form.value.role === '' && !this.showEditForm) {
      this.snackBar.open('Please specify the role!', 'Okay', { duration: 3000 });
    } else if (form.value.sex === '' && !this.showEditForm) {
      this.snackBar.open('Please specify the sex!', 'Okay', { duration: 3000 });
    } else if (form.value.cnp.length !== 13 && !this.showEditForm) {
      this.snackBar.open('Incorrect cnp!', 'Okay', { duration: 3000 });
    } else {
      this.showAddForm = false;
      switch (form.value.role) {
        case 'admin': form.value.role = 1; break;
        case 'projectmanager': form.value.role = 2; break;
        case 'officemanager': form.value.role = 3; break;
        case 'angajat': form.value.role = 4; break;
      }
      switch (form.value.sex) {
        case 'male': form.value.sex = 1; break;
        case 'female': form.value.sex = 0; break;
      }
      if (!this.showEditForm) {
        this.userService.createUser(form.value).subscribe((data) => {
          this.loading = true;
          this.snackBar.open('User added successfully!', 'Okay', { duration: 3000 });
          setTimeout(() => {
            this.getAll();
            this.loading = false;
          }, 2000);
        },
          (err) => {
            // tslint:disable-next-line:max-line-length
            this.snackBar.open('There was a problem creating the user. Check the console for more informations!', 'Okay', { duration: 3000 });
          });
      } else {
        this.snackBar.open('User edited successfully!', 'Okay', { duration: 3000 });
      }
    }
  }

  showProfile(index) {
    if (index !== '' || index === 0) {
      this.user = this.users[index];
    }
    this.showDetailForm = !this.showDetailForm;
  }

  deleteUser(index) {
    const body = {
      username: this.users[index].username
    };
    this.userService.deleteUser(this.users[index]._id, body).subscribe((data) => {
      this.loading = true;
      this.snackBar.open('User deleted successfully!', 'Okay', { duration: 3000 });
      setTimeout(() => {
        this.getAll();
        this.loading = false;
      }, 2000);
    },
      (err) => {
        this.snackBar.open('There was a problem deleting the user. Check the console for more informations!', 'Okay', { duration: 3000 });
      });
  }
}
