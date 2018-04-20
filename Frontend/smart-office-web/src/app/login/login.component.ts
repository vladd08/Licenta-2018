import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { AuthService } from '../shared/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'so-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginform: FormGroup;

  constructor(private elementRef: ElementRef,
              public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('tfatoken')) {
      this.router.navigateByUrl('/main');
    }
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'linear-gradient(to top, #1e3c72, #2a5298)';
  }

  onSubmit(form: NgForm) {
    this.authService.login(form.value.username, form.value.password);
  }
}
