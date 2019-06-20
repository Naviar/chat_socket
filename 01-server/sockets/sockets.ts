import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const UsuariosConectados = new UsuariosLista();

// Conectar cliente cuando alguien se conecta al servidor , pasa el id de socket a ese usuario y lo agrega
export const conectarCliente = (cliente:Socket, io: socketIO.Server) => {
    const usuario = new Usuario (cliente.id,undefined);
    UsuariosConectados.agregarUsuario(usuario);
    console.log('conectando cliente');
    
     
    
}


// Desconectar cliente
export const desconectar = (cliente : Socket , io:socketIO.Server)=>{
    
    cliente.on('disconnect',()=>{
        console.log('cliente desconectado');
        UsuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos',UsuariosConectados.getLista());
    });
}

// Escuchar mensajes generales
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    
    cliente.on('mensaje',(payload:{de:string, cuerpo:string})=>{
        console.log('mensaje recibido', payload);
        // le llega a todos los clientes conectados al servidor socket
        io.emit('mensaje-nuevo',payload);        

    });
}

// escuchar mensajes privados
export const mensajePrivado = (cliente: Socket, io: socketIO.Server) => {
    
    cliente.on('mensaje-privado',(payload)=>{
        console.log('mensaje recibido', payload);
        // le llega a todos los clientes conectados al servidor socket
        io.in(payload.ID_socket_user_destination).emit('mensaje-nuevo',payload);        

    });
}

// LoginWebSocket , configurar usuario 
export const loginWS = (cliente:Socket , io :socketIO.Server)=>{
    
    
    cliente.on('configurar-usuario',(payload: {nombre:string,id_user:number,id_rol:number,atendido:string,id_atencion:number}, callback: Function) =>{

        
        console.log('configurando nombre login recibido:', payload.nombre);
        console.log('configurando id_useer login recibido:', payload.id_user);
        console.log('configurando id_rol login recibido:',payload.id_rol);
        console.log('configurando atendido login recibido:',payload.atendido);
        console.log('configurando id_atendido',payload.id_atencion);
        UsuariosConectados.actualizarNombre(cliente.id, payload.id_user,payload.nombre,payload.id_rol,payload.atendido,payload.id_atencion);
        io.emit('usuarios-activos',UsuariosConectados.getLista()); 
        callback({
            ok: true, 
            mensaje: `usuario : ${payload.nombre} , configurado`,
            id : cliente.id
        })
        
    });
}

// obtener usuarios
export const obtenerUsuarios = (cliente:Socket , io :socketIO.Server)=>{
    
    
    cliente.on('obtener-usuarios',() =>{

        
        
        io.to(cliente.id).emit('usuarios-activos',UsuariosConectados.getLista());
        
        
    });
}

//LIBERAR USUARIO ATENDIDO A SIN-ATENDER
export const liberarUsuario = (cliente:Socket , io : SocketIO.Server)=>{

    cliente.on('liberar-usuario',(payload : {id_user:number, id_socket:string})=>{
        console.log('escucooooooo liberar usaurii payload',payload.id_user);
        UsuariosConectados.liberarUsuario(payload.id_user);
        io.emit('usuarios-activos',UsuariosConectados.getLista());
        io.to(payload.id_socket).emit('liberar-usuario');
    })

}
