import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

// zamiast w konstruktorze posts.service wstrzykiwac metode z authservice getToken() i ustawiac headers w kazdym post requescie
// uzywamy interceptora, ktory jest serwisem
//provideujemy go w app.modules
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken= this.authService.getToken();
        const authReq= req.clone({  //musimy sklonowac request ktoory bedziemy modyfikowac coby nie namieszac
            headers: req.headers.set('Authorization', 'Bearer '+ authToken)
        });       

        return next.handle(authReq);  }
}