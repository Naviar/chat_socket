import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';// se debe importar este modulo para poder hacer peticiones http

import {ReactiveFormsModule} from '@angular/forms';
//sockets
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: environment.wsUrl, options: {} };


import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatComponent } from './components/chat/chat.component';
import { ListausuariosComponent } from './components/listausuarios/listausuarios.component';
import { LoginComponent } from './pages/login/login.component';
import { MensajesComponent } from './pages/mensajes/mensajes.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginappComponent } from './components/loginapp/loginapp.component';
import { ChatwindowComponent } from './components/chatwindow/chatwindow.component';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ChatComponent,
    ListausuariosComponent,
    LoginComponent,
    MensajesComponent,
    RegisterComponent,
    LoginappComponent,
    ChatwindowComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
