import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/authentication.service';
import { Router, RouterLinkActive } from '@angular/router';
import { HourService } from '../../shared/hours.service';

@Component({
  selector: 'so-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  role = '';
  requests: any[] = [];
  requestExists: Boolean = false;
  constructor(private authService: AuthService,
    private router: Router,
    private hourService: HourService) { }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    if (this.role === 'admin') {
      setTimeout(() => {
        this.hourService.getRequests('5ad8c5046de36700213be4e0').subscribe((data: any) => {
          this.requests = data.result;
          if (this.requests.length !== 0) {
            this.hourService.requests = this.requests;
            this.requestExists = true;
          }
        }, (err: any) => {
          console.log(err);
        });
      }, 2000);
    }
    if (!localStorage.getItem('tfatoken')) {
      this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.authService.logout();
  }
}
