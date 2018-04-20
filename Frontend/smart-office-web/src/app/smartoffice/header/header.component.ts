import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/authentication.service';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'so-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  role = '';
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    if (!localStorage.getItem('tfatoken')) {
      this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.authService.logout();
  }
}
