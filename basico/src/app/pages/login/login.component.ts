import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  nombre = '';
  constructor(
    public wsService: WebsocketService,
    private router: Router,
    
  ) { }

  ngOnInit() {
  }

  ingresar(){
    this.wsService.loginWebSocket(this.nombre,1,1,'atendido',undefined)
    .then(()=>{
      this.router.navigateByUrl('/mensajes');
    });
  }

}
