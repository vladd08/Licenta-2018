import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/authentication.service';

@Component({
  selector: 'so-smartoffice',
  templateUrl: './smartoffice.component.html',
  styleUrls: ['./smartoffice.component.css']
})
export class SmartofficeComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef,
              private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('role') === 'admin') {
      this.router.navigateByUrl('main/users');
    } else if (localStorage.getItem('role') === 'projectmanager') {
      this.router.navigateByUrl('main/projects');
    }
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'white';
  }
}
