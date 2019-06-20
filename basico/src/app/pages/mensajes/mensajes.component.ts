import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { ChatService } from '../../services/chat.service';
import decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {
  
  condition:number;
  nombre_Usuario:string;
  constructor(
    private _chatService :ChatService,
    public wsService:WebsocketService,
    private router :Router
    
  ) { }
  
  salir(){
    this.wsService.logoutWebSocket();
    this.router.navigateByUrl('/LoginApp');
  }
  
  getValidRol(){
    const token = localStorage.getItem('usuario');
    const tokenPayload = decode(token); 
    console.log('this.tokenpayload', tokenPayload);
    this.condition = parseInt(tokenPayload.rol_usuario);
    this.nombre_Usuario = tokenPayload.nombre_usuario;
    console.log("ESTE ES EL ROL",this.condition);
    this._chatService.mensajePrivado.ID_USER_ID_ORIGIN = tokenPayload.id_usuario;
  }
  ngOnInit() {
    this._chatService.mensajePrivado.NOMBRE_ORIGIN = this.wsService.usuario.nombre;
    this._chatService.mensajePrivado.ID_socket_user_origin = this.wsService.usuario.id_socket;
    this._chatService.mensajePrivado.ID_USER_ID_ORIGIN = this.wsService.usuario.id_user;
    this._chatService.mensajes = [];
    this.getValidRol();

    this._chatService.cambiarEstado().subscribe(
      () =>{
        console.log('me liberaron');
        this.wsService.usuario.atendido = 'sin-atender';
        this.wsService.usuario.id_atencion = null;
      }
    )
  }

  

}
