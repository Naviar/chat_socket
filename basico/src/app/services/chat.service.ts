import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { MensajePrivado } from '../models/MensajePrivado';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  loadingMensajes : boolean = false;
  mensajes:MensajePrivado []= [];
  mensajesPrivados:MensajePrivado[] = [];
  mensajePrivado : MensajePrivado = {
    ID_USER_ID_DESTINATION:null,
    ID_USER_ID_ORIGIN:null,
    ID_socket_user_destination:"",
    ID_socket_user_origin:'',
    Nombre_destination:"",
    NOMBRE_ORIGIN:'',
    FECHA: new Date,
    MENSAJE:"",
  }

 readonly URL = 'http://localhost:5000/chats';

notificaciones : number [] = [];


  constructor(
    public wsService: WebsocketService,
    private http : HttpClient
  ) { }

  // emitir un mensaje 
  sendMessage(mensaje: string){
    const payload = {
      de: this.wsService.getUsuario().nombre,
      cuerpo: mensaje
    };

    this.wsService.emitir('mensaje', payload);
  }

  // escuchar mensajes generales
  getMessages(): Observable<MensajePrivado>{
   return this.wsService.escuchar('mensaje-nuevo');
  }
  

  // emitir mensaje privado con sockets , usare rest por la BD
  sendMessagesPrivate(){
    
    
    console.log('el mensaje que se envio',this.mensajePrivado);
    
    this.wsService.emitir('mensaje-privado',this.mensajePrivado);
  }

  // emitir mensaje privado con rest
  SendMessagePrivateREST(){
    console.log('se va enviar :', this.mensajePrivado);
    
   return this.http.post(this.URL+`/MensajesPrivados/${this.mensajePrivado.ID_socket_user_destination}`,this.mensajePrivado);

  }

  getMessagesChat(id_user1 :number , id_user2:number) {
    let ids_users = {
      id_user1,
      id_user2
    } 
    return this.http.post(`${this.URL}/MensajesChat`,ids_users)
  }

  getMessagesPrivate(){
    return this.wsService.escuchar('mensaje-privado');
  }

  getUsuariosActivos(){
    return this.wsService.escuchar('usuarios-activos');
  }

  emitirUsuariosActivos(){
    this.wsService.emitir('obtener-usuarios');
  }

  // liberar un usuario (dejar de atender)
  liberarUsuario(){
    var id_user = this.mensajePrivado.ID_USER_ID_DESTINATION;
    var id_socket = this.mensajePrivado.ID_socket_user_destination;
    console.log('se va a liberar con id: ', id_user);
    this.wsService.emitir('liberar-usuario',{id_user,id_socket});
  }

  // cliente escucha que lo liberaron
  cambiarEstado(){
    return this.wsService.escuchar('liberar-usuario');
  }

  // limpiar MP
  limpiarMP(){
    this.mensajePrivado.ID_USER_ID_DESTINATION = null;
    this.mensajePrivado.ID_socket_user_destination = null;
    this.mensajePrivado.Nombre_destination = null;
  }

}
