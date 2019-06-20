import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MensajesComponent } from './pages/mensajes/mensajes.component';

import { UsuarioGuardService } from './guards/usuario-guard.service';
import { RegisterComponent } from './components/register/register.component';
import { LoginappComponent } from './components/loginapp/loginapp.component';
import { ChatwindowComponent} from './components/chatwindow/chatwindow.component';
const appRoutes:Routes = [
  {path: 'Login', component: LoginComponent},
  {path: 'mensajes', component:MensajesComponent,
  canActivate:[UsuarioGuardService]},
  {path:'register', component:RegisterComponent},
  {path:'LoginApp', component:LoginappComponent},
  {path:'chatbonito', component:ChatwindowComponent},
  {path: '**', component:LoginappComponent}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
