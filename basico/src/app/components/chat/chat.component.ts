import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { MensajePrivado } from '../../models/MensajePrivado';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit , OnDestroy {
  primer_mensaje = false;
  mensaje: string ='';
  mensajesSubscription: Subscription;
  mensajePrivateSubscription: Subscription;
  
  elemento: HTMLElement;
  constructor(public chatService: ChatService,
              public wsService : WebsocketService) { }
  addMensaje(mp: MensajePrivado){
    console.log('aquiii estamos:', mp);
    this.chatService.mensajes.push(mp);
    console.log('mensajessssss:',this.chatService.mensajes);
  }
  enviar_mensaje(){
    if(this.mensaje.trim().length === 0){return;}
    
    var hoy = new Date;
    // var fecha = hoy.getDate() +'-'+ hoy.getMonth() +'-'+ hoy.getFullYear();
    // var hora = hoy.getHours() +':'+ hoy.getMinutes() +':'+ hoy.getSeconds();
    // var fechayhora = fecha + ' ' + hora
    this.chatService.mensajePrivado.FECHA = hoy;
    this.chatService.mensajePrivado.MENSAJE = this.mensaje;

    var mp : MensajePrivado = {}

    
    mp.FECHA = hoy;
    mp.ID_USER_ID_DESTINATION = this.chatService.mensajePrivado.ID_USER_ID_DESTINATION;
    mp.ID_USER_ID_ORIGIN = this.chatService.mensajePrivado.ID_USER_ID_ORIGIN;
    mp.ID_socket_user_destination = this.chatService.mensajePrivado.ID_socket_user_destination;
    mp.ID_socket_user_origin = this.chatService.mensajePrivado.ID_socket_user_origin;
    mp.MENSAJE = this.mensaje;
    mp.NOMBRE_ORIGIN = this.chatService.mensajePrivado.NOMBRE_ORIGIN;
    mp.Nombre_destination = this.chatService.mensajePrivado.Nombre_destination;
    
    this.addMensaje(mp);
    // this.chatService.mensajes.push(this.chatService.mensajePrivado);
   
    // this.chatService.mensajesPrivados.push(this.chatService.mensajePrivado);
    // this.chatService.sendMessagesPrivate();
    this.chatService.SendMessagePrivateREST()
    .subscribe(
      (res) => {console.log('llego de send res: ',res);},
      (err) => {console.log('error enviando el mensaje: ',err);},
      () => {console.log('revision mensajes:', this.chatService.mensajes);}
    )
    this.mensaje='';
    
    setTimeout( ()=>this.elemento.scrollTop = this.elemento.scrollHeight, 20 );
  }

  configurar_mensaje(){
    this.chatService.mensajePrivado.ID_socket_user_destination= this.chatService.mensajes[this.chatService.mensajes.length-1].ID_socket_user_origin;
    this.chatService.mensajePrivado.Nombre_destination = this.chatService.mensajes[this.chatService.mensajes.length-1].NOMBRE_ORIGIN;
    this.chatService.mensajePrivado.ID_USER_ID_DESTINATION = this.chatService.mensajes[this.chatService.mensajes.length-1].ID_USER_ID_ORIGIN;
    // this.chatService.mensajePrivado.Nombre_origin = this.wsService.usuario.nombre;
    // this.chatService.mensajePrivado.ID_user_origin = this.wsService.usuario.id_usuario;
    console.log('se configuro mensaje privado',this.chatService.mensajePrivado);
  }

  

  ngOnInit() {
    
    this.elemento = document.getElementById('app-mensajes');
    this.mensajesSubscription =  this.chatService.getMessages().subscribe(msg =>{
      console.log('mensaje privado',msg);
      this.chatService.mensajes.push(msg);
      if(msg.ID_USER_ID_ORIGIN !== this.chatService.mensajePrivado.ID_USER_ID_DESTINATION)
      {this.chatService.notificaciones.push(msg.ID_USER_ID_ORIGIN)
        }
      
      if(this.wsService.usuario.id_rol===2 && this.wsService.usuario.atendido==='sin-atender'){

        this.wsService.loginWebSocket(this.wsService.usuario.nombre,this.wsService.usuario.id_user,this.wsService.usuario.id_rol,'atendido',msg.ID_USER_ID_ORIGIN);
        this.primer_mensaje = true;
        // configurar mensaje privado
        this.chatService.mensajePrivado.ID_USER_ID_DESTINATION = msg.ID_USER_ID_ORIGIN;
        this.chatService.mensajePrivado.ID_socket_user_destination = msg.ID_socket_user_origin;
        this.chatService.mensajePrivado.Nombre_destination = msg.NOMBRE_ORIGIN;

        console.log('lo que esta configurado por ahora:',this.chatService.mensajePrivado);
      }
      
      // this.configurar_mensaje();
     setTimeout( ()=>this.elemento.scrollTop = this.elemento.scrollHeight, 20 ); 
      
    });
    // this.mensajePrivateSubscription = this.chatService.getMessagesPrivate().subscribe(msg =>{
    //   console.log('mensaje recibido',msg);
    //   console.log('mi nueva configuracion',this.chatService.mensajePrivado);
    //   this.chatService.mensajes.push(msg)
      
      
    //   setTimeout( ()=>this.elemento.scrollTop = this.elemento.scrollHeight, 20 ); 
    // })
  }

  liberarUsuario(){
    this.chatService.liberarUsuario();
    this.chatService.mensajePrivado.ID_USER_ID_DESTINATION = null;
    this.chatService.mensajePrivado.ID_socket_user_destination = null;
    this.chatService.mensajePrivado.Nombre_destination = null;
    this.chatService.mensajes = [];
  }

  ngOnDestroy(){
    this.mensajesSubscription.unsubscribe();
  }

}
