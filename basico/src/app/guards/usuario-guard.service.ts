import { Injectable } from '@angular/core';

import { WebsocketService } from '../services/websocket.service';
import { Router , CanActivate } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuardService implements CanActivate {

  constructor(
    public wsService: WebsocketService,
    public router : Router,
    public auth: LoginService
  ) { }

    canActivate(){
    
    console.log(this.wsService.getUsuario());

    if(this.wsService.getUsuario())  {
      return true;
    }else{
      this.router.navigateByUrl('/LoginApp');
      return false;
    }
    }
}