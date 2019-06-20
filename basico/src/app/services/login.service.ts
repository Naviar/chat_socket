import { Injectable } from '@angular/core';
import { register } from '../models/register';
import {HttpClient} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { login } from '../models/login';
import { rol } from '../models/rol';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  helper = new JwtHelperService();
  roles : rol[] =[];

  constructor(private http : HttpClient) { }
  readonly URL_API = 'http://localhost:5000/usuario'; 

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('usuario');
    return !this.helper.isTokenExpired(token);
  }

  register(usuario:register){
    return this.http.post(this.URL_API + '/register', usuario);
  }

  usuarioDuplicado(usuario:register){
    console.log('desde register service se va  aeniari ', usuario);
    return this.http.post(this.URL_API + '/usuarioDuplicado', usuario);
  }

  authentication(usuario:login){
    return this.http.post(this.URL_API + '/login', usuario);
  }

  logout(){
    return this.http.get(this.URL_API + '/logout');
  }

  getRoles(){
    return this.http.get(this.URL_API + '/roles');
  }
}
