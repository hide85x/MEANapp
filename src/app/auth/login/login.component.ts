import { Component, OnInit, OnDestroy } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]

})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading= false;
    private authStatusSub: Subscription

    constructor(public authService: AuthService) {}
    ngOnInit() {
      this.authStatusSub=  this.authService.getAuthStatusListener().subscribe(authStatus => {
            this.isLoading=false // to nam usuwa spinner kiedy zaSignupujemy sie z blednymi credentials, i nie musimy tego robic w authService
        })
    }    
    onLogin(loginForm: NgForm){ 
        if(loginForm.invalid) {
            return;
        }
        console.log(loginForm.value.email);
        this.isLoading=true ;
        this.authService.loginUser(loginForm.value.email, loginForm.value.password);
        // this.isLoading= false;
            
        

    }
    ngOnDestroy(){
        this.authStatusSub.unsubscribe()
    }
}