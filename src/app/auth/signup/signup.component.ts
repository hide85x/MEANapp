import { Component, OnInit, OnDestroy } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { format } from 'util';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.css"]

})
export class SignupComponent implements OnInit, OnDestroy{
    isLoading= false;
    private authStatusSub: Subscription;
    constructor(public authService: AuthService, private router: Router) {}
    ngOnInit() {
      this.authStatusSub=  this.authService.getAuthStatusListener().subscribe(authStatus => {
            this.isLoading=false // to nam usuwa spinner kiedy zaSignupujemy sie z blednymi credentials, i nie musimy tego robic w authService
        })
    }
    onSignup(form: NgForm){   // form to nasz signupForm z html
      if (form.invalid) {
          return
      }
      this.isLoading= true;
      this.authService.createUser(form.value.email, form.value.password);
    //   this.isLoading=false;
 
}

ngOnDestroy() {
    this.authStatusSub.unsubscribe()
}
}