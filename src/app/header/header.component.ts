import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-header',
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
    private authListenenerSubs: Subscription;
    public userIsAuth= false ;
    private token;


    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.token= this.authService.getToken()
        console.log(this.token + " szajs z header component getToken")
        this.userIsAuth= this.authService.getIsAuth(); //
        this.authListenenerSubs = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                console.log(isAuthenticated)
                this.userIsAuth= isAuthenticated
            });
    }
    ngOnDestroy() {
        this.authListenenerSubs.unsubscribe()
    }
    onLogout() {
        this.authService.logout();
    }

}