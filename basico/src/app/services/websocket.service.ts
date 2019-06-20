import { Injectable } from '@angular/core';
import { Socket} from 'ngx-socket-io';// imortar el socket
import { Usuario } from '../classes/usuario';

import { Router } from '@angular/router';
import { ChatService } from './chat.service';
import { stringify } from '@angular/compiler/src/util';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario : Usuario = null;

  constructor(
    
    private socket: Socket,
    private router : Router
  ) { 
    this.cargarStorage();
    this.checkStatus();// ver el el estado del servidor 
  }

  // metodo para revisar el estado del servidor (conecta y desconecta)
  checkStatus(){
    this.socket.on('connect', ()=>{
      console.log('conectado al servidor');
      this.socketStatus=true;
      this.cargarStorage();
    });

    this.socket.on('disconnect', ()=>{
      console.log('desconectando del servidor');
      this.socketStatus=false;
    });
  }
  
  // metodo para hacer emisiones de algun tipo de evento 
  emitir(evento : string, payload?: any, callback?: Function){
    
    console.log('emitiendo:', evento);
    this.socket.emit(evento, payload, callback);
  }

  // metodo para escuchar cualquier evento 
  escuchar(evento:string){
    return this.socket.fromEvent(evento);
  }

  // emitir el evento para configurar el nombre
  loginWebSocket( nombre : string , id_user :number , id_rol:number ,atendido:string,id_atencion:number){
    
    return new Promise ((resolve,reject)=>{
     

      this.emitir('configurar-usuario',{nombre,id_user,id_rol,atendido,id_atencion},res=>{
        
        console.log('login wws id:', res.id);
        
        this.usuario = new Usuario (nombre , res.id , id_user, id_rol ,atendido,id_atencion);
        this.guardarStorage();
        resolve();
      });
    });
  }

  logoutWebSocket(){
    this.usuario = null;
    
    localStorage.removeItem('socket');
    const payload = {
      nombre:'sin-nombre',
      id_user: null,
      id_rol:null,
    }
    this.emitir('configurar-usuario', payload, ()=>{});
    // this.router.navigateByUrl('/LoginApp');
  }
  

  getUsuario(){
    return this.usuario;
  }

  guardarStorage(){
    localStorage.setItem('socket',JSON.stringify(this.usuario));
  }
  
  cargarStorage(){
    if(localStorage.getItem('socket')){
     
      this.usuario = JSON.parse(localStorage.getItem('socket'));
      this.loginWebSocket(this.usuario.nombre,this.usuario.id_user,this.usuario.id_rol,this.usuario.atendido,this.usuario.id_atencion);
    }
  }

}
