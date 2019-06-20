import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder , Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import decode from 'jwt-decode';
import { WebsocketService } from '../../services/websocket.service';
import { ChatService } from '../../services/chat.service';


declare var M: any;

@Component({
  selector: 'app-loginapp',
  templateUrl: './loginapp.component.html',
  styleUrls: ['./loginapp.component.css']
})
export class LoginappComponent implements OnInit {

  
  cargando = false;
  loginForm: FormGroup;
 condition:number=0;
  tokenPayload;
  constructor(private wsService : WebsocketService,
              private chatService : ChatService,
              private http : Router,
              private _loginService :LoginService,
              private fb : FormBuilder,
              private router : Router) { 
                this.buildForm();
              }

  buildForm() {
    this.loginForm = this.fb.group({
    correo: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z]*.[a-z]*@(ibm).(com)$/)]) ],
    password: ['', Validators.compose([Validators.required, Validators.minLength(6)]) ]
    });
    }

    login(form?: NgForm){
      this.cargando = true;
      console.log(form.value); 
      this._loginService.authentication(form.value)
        .subscribe( (data)=>{
          console.log('llego de login',data);
          if(data['fail'] == true){
            this.cargando =false;
            M.toast({
              html: `<div class="alert alert-danger" style="position: fixed; top: 300px; right: 620px; z-index: 7000;" role="alert">
                  <h4 class="alert-heading">FALLO AUTENTICACIÓN</h4>
                  <p>El correo y/o contraseña es incorrecto</p>
                  <hr>
              </div>`});
          }
          else{
          localStorage.setItem('usuario', data['token']);
        
          
          this.tokenPayload = decode(data['token']); 
          console.log('usuario logeado:',this.tokenPayload);
          var nombre = this.tokenPayload.nombre_usuario;
          var id_user = this.tokenPayload.id_usuario;
          var id_rol = this.tokenPayload.rol_usuario;
          if(id_rol === 2){
            var atendido = 'sin-atender'
          }
          else{
            var atendido = 'atendido'
          }
          this.wsService.loginWebSocket(nombre, id_user , id_rol ,atendido,undefined)
              .then(()=>{
              
              this.router.navigateByUrl('/mensajes');
              });
          console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOO",this.tokenPayload);
          console.log("askjkjsakjsakjsakjsakj",this.tokenPayload.id_usuario);  
            }    
        });   
          
    }

    yaCargo(){
      if(this.cargando == false){
        return false;
    }else{
        return true;
    }
  }

  ngOnInit() {
    this.chatService.limpiarMP();
    this.wsService.logoutWebSocket();
    this._loginService.logout()
  .subscribe( (data)=>{
    localStorage.setItem('usuario', data['token']);
  });
  //  this.cargando = true;
  }

}
