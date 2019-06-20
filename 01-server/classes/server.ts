import express from 'express';// importar express
import { SERVER_PORT } from '../global/environment';// importar variable global del puerto donde corre el server 
import socketIO from 'socket.io';// importar socket.io
import http from 'http';//para comunicar xpress con io usar http como intermediario

import * as socket from '../sockets/sockets';

// exportar la clase servidor y default para que sea lo unico que se exporte
export default class Server {
    private static _instance: Server;

    public app: express.Application; // usar express aplication se debe inicializar en el contructor
    public port: number;
    public io:socketIO.Server; // propiedad encargada de emitir eventos y escuchar , configuracion de los sockets
    public httpServer: http.Server; // http server para levantar servidor y se le va a mandar lo configuracion de express

    private constructor() {
        this.app = express(); // inicializar express
        this.port = SERVER_PORT;// al port le asigno el puerto que se define en global environment

        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        
        this.escucharSockets();
    }
    //patron singleton
    public static get instance (){
        
        return this._instance || (this._instance = new this());

    }

    private escucharSockets(){
        
        console.log('escuchando conexiones - sockets');
        
        // escuchar cuando un cliente se conecta evento ('connection')
        this.io.on('connection', cliente => { 
            
            // cada que se crea una instancia en el servidor socket se cre un id para el cliente conectado (id de socket)
            console.log('nuevo cliente conectado con id:',cliente.id);
            
            // conectar cliente
            socket.conectarCliente(cliente,this.io);
            // login web socket , configurar usuario 
            socket.loginWS(cliente,this.io);
            // escuchar/obtener usuarios activos
            socket.obtenerUsuarios(cliente,this.io);
            // mensajes
            socket.mensaje(cliente, this.io);
            // mensajes privados
            socket.mensajePrivado(cliente,this.io);
            // desconectar
            socket.desconectar(cliente, this.io);
            // liberar usuario
            socket.liberarUsuario(cliente,this.io);
            

            
        });

        
    }
    
    // metodo para levantar el servidor 
    start(callback: Function) {
        this.httpServer.listen(this.port , callback);
    }
}
