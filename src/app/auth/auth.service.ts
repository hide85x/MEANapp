import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { };
    private isAuth = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: NodeJS.Timer;
    private userId: string;

    getUserId() {
        return this.userId
    }
    getToken() {
        return this.token
    }
    getAuthStatusListener() {
        return this.authStatusListener.asObservable()
    }
    getIsAuth() {
        return this.isAuth
    }

    //signup
    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post("http://localhost:3000/api/users/signup", authData)
            .subscribe(result => {
                console.log(result)
                this.router.navigate(["/login"]);
            }, error=> {
                this.authStatusListener.next(false)
            })
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };

        this.http.post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/users/login", authData, {
        })
            .subscribe(result => {

                const token = result.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = result.expiresIn;
                    this.userId= result.userId;
                    console.log(expiresInDuration);
                    this.setAuthTimer(expiresInDuration);
                    this.isAuth = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    console.log(`token expires on  ${expirationDate}s`)
                    this.saveAuthData(token, expirationDate, this.userId)
                    this.router.navigate(['/'])
                }
                // console.log(result,  " shit straight from authService")
            }, err => {
                this.authStatusListener.next(false)
                 // w razie blednych credentials emitujemy nasz subject, do ktorego sie subskrybujemy
                 // w comp. sign i login i usywamy spinnery
            })

    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo) {
            return
        }
        const now = new Date()
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime(); // mamy czas w milisekundach, bo takie czas podaje na JS
        console.log(expiresIn);
        if (expiresIn > 0) {
            this.token = authInfo.token,
            this.isAuth = true;
            this.userId= authInfo.userId;
            this.setAuthTimer(expiresIn / 1000) // setAuthTimer dziala na sekundach wiec dzielimy
            this.authStatusListener.next(true)
        }
    }

    logout() {
        this.token = null;
        this.isAuth = false;
        clearTimeout(this.tokenTimer)
        this.authStatusListener.next(false);
        this.clearAuthData()
        this.userId= null ; // musimy resetowac nasz user id po wylogowaniu
        this.router.navigate(['/login']);

    }
    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token)
        localStorage.setItem('expiration', expirationDate.toString());
        localStorage.setItem('userId' , this.userId)
        console.log(localStorage)
    }
    private clearAuthData() {
        localStorage.removeItem('token')
        localStorage.removeItem('expiration')
        localStorage.removeItem('userId')
    }
    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        
        if (!token || !expirationDate) {
            return
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId:userId
        }
    }

    private setAuthTimer(duration: number) {
        console.log(`Setting timer to : ${duration}s`)
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);


    }
}