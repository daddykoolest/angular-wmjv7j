import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        if (request.url.indexOf('/user/login') !== -1) {
            return next.handle(request);
        }

        if (localStorage.getItem('token') !== null) {
            const token: string = localStorage.getItem('token').replace(/['"]+/g, '');
            if (token) {
                request = request.clone({headers: request.headers.set('X-SMART-Auth', token)});
            }
        }
        return next.handle(request);
    }
}
