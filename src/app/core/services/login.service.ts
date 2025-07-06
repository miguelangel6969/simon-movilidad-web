import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../enviroments/environment';
import {LoginRequestModel} from '../models/dto/LoginRequest.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = `${environment.apiBaseUrl}/auth/login`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequestModel): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getRolUsuario(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return '';
    }
  }

}
