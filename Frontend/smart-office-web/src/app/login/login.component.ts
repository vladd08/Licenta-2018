import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  selector: 'so-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginform: FormGroup;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'linear-gradient(to top, #1e3c72, #2a5298)';
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

}
