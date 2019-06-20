import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder , Validators, NgForm } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { WebsocketService } from '../../services/websocket.service';
import { ChatService } from '../../services/chat.service';
import { rol } from '../../models/rol';

declare var M: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;
  tokenPayload;
  nombre: string;
  constructor(private fb: FormBuilder,
              private _loginService :LoginService,
              private router : Router,
              private wsService : WebsocketService,
              private chatService : ChatService) {
                
    this.buildForm();
   }
  
  buildForm(){
    this.registerForm = this.fb.group({
      nombre_usuario: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z A-Z]*$/)]) ],
      apellido_usuario: ['',Validators.compose([Validators.required, Validators.pattern(/^[a-z A-Z]*$/)])],
      correo: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-z]*.[a-z]*@(ibm).(com)$/)]) ],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)]) ]
    })
  }
    
  Registrar(form?: NgForm){
    console.log('se registra', form.value);
    this._loginService.usuarioDuplicado(form.value)
    .subscribe(
      (data) => {  
        console.log("esto llegoooooooo", data);
        if (data[0].DUPLICATE == 0) {
          this._loginService.register(form.value)
            .subscribe((data) => {
              localStorage.setItem('usuario', data['token']);
              console.log('data en register:',data);

              // this.router.navigate(['/Login'])
              this.tokenPayload = decode(data['token']);
              this.nombre = this.tokenPayload.nombre_usuario;
              var id_user = this.tokenPayload.id_usuario;
              var id_rol = this.tokenPayload.rol_usuario;
              console.log('id_user',id_user);
              if(id_rol === 2){
                var atendido = 'sin-atender'
              }
              else{
                var atendido = 'atendido'
              }
              this.wsService.loginWebSocket(this.nombre,id_user,id_rol,atendido,undefined)
              .then(()=>{
              
              this.router.navigateByUrl('/mensajes');
              });
              // console.log("this.tokenPayload", this.tokenPayload);
              // console.log("this.tokenpayload.id_usuario", this.tokenPayload.id_usuario);
            },
            (err) => {console.log('error registrando el usuario:', err);}
            );
        }
       else {
        M.toast({
          html: `<div class="alert alert-danger" style="position: fixed; top: 100px; right: 50px; z-index: 7000;" role="alert">
                  <h4 class="alert-heading">FALLO REGISTRO</h4>
                  <p>El correo que diligencio ya se encuentra registrado</p>
                  <hr>
              </div>`});
       } 
      },

      (err) => {console.log('ocurrio un error en la BD en  usuario duplicado: ',err);}
        
    )
  } 

  getRoles() {
    this._loginService.getRoles()
      .subscribe(res => {
        this._loginService.roles = res as rol[];
        console.log('los roles:', this._loginService.roles);
      })
  }

  ngOnInit() {
    this.wsService.logoutWebSocket();
  }

}
