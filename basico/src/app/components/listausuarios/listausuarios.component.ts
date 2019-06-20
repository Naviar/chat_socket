import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { Usuario } from '../../classes/usuario';
import { MensajePrivado } from '../../models/MensajePrivado';
import { Directive, Output, EventEmitter, Input, SimpleChange} from '@angular/core';


@Component({
  selector: 'app-listausuarios',
  templateUrl: './listausuarios.component.html',
  styleUrls: ['./listausuarios.component.css']
})


export class ListausuariosComponent implements OnInit {

  
  usuariosActivosObs: Observable<any>;
  // listaUsuarios: string[];
  usuarioActual : Usuario;
  constructor(
    public chatService : ChatService,
    public wsService :WebsocketService
  ) { }
  
 

  confDestino(id_socket:string, id_user_destination: number , nombre:string){
    
    this.chatService.notificaciones = this.chatService.notificaciones.filter(notificacion => notificacion != id_user_destination)
    console.log('enviar mensaje a usuario con id_socket ',id_socket);
    console.log('enviar mensaje a usuario con id_user ',id_user_destination);
    this.chatService.mensajePrivado.ID_socket_user_destination = id_socket;
    this.chatService.mensajePrivado.ID_USER_ID_DESTINATION = id_user_destination;
    this.chatService.mensajePrivado.Nombre_destination = nombre;
    this.chatService.loadingMensajes = true;
    
    this.chatService.getMessagesChat(this.wsService.usuario.id_user,id_user_destination)
    .subscribe(
      (res) => {console.log('llegaron estos mensajillos:', res);
                this.chatService.mensajes = res as MensajePrivado []
                  this.chatService.loadingMensajes=false;},
      (err) => {console.log('ocurrio un error trayendo los mensajes: ', err)}
    )
    
    
  }

  verificarNotificacion(id:number){
    
    
    var notificacion = this.chatService.notificaciones.filter(notificacion => notificacion == id)
   if(notificacion.length > 0){
    console.log(`rotorno true para id: ${id}`);
     return true;
   }
   
   return false;
  }

  contarNotificaciones(id: number){
  var numero = this.chatService.notificaciones.filter(Notification => Notification == id).length;
  return numero;
  }

  ngOnInit() {
    // this.usuarioActual = this.wsService.getUsuario();
    this.usuariosActivosObs = this.chatService.getUsuariosActivos();
    
    // emitir usuarios activos
    this.chatService.emitirUsuariosActivos();
  }

}
