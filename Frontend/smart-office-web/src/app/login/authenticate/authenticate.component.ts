import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/authentication.service';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'so-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef,
              public authService: AuthService,
              private router: Router,
              private location: PlatformLocation) { }

  ngOnInit() {
    if (localStorage.getItem('tfatoken')) {
      this.router.navigateByUrl('/main');
    }
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
    }
    this.location.onPopState(() => {
      this.authService.error = '';
    });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'linear-gradient(to top, #1e3c72, #2a5298)';
  }

  onSubmit(form: NgForm) {
    this.authService.authenticate(form.value.authCode);
  }

  onCancelPressed() {
    this.authService.error = '';
  }
}
