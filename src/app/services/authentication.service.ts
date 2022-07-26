import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')as string));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(login: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { login, password })
            .pipe(map(user => {
                // хранить данные пользователя и токен jwt в локальном хранилище, чтобы пользователь оставался в системе между обновлениями страницы
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // удалить пользователя из локального хранилища, чтобы выйти из системы
        localStorage.removeItem('currentUser');

        // get the user nulled - typescript won't care
     this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
     this.currentUser = this.currentUserSubject.asObservable();
    }
}
