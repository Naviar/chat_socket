import { Usuario } from './usuario';

export class UsuariosLista {
    private lista: Usuario [] = [];
    constructor(){}

    // Agregar un usuario 
    public agregarUsuario(usuario: Usuario){
        this.lista.push(usuario);
        console.log('lista agregar un usuario:',this.lista);
        return usuario;
    }
    
    // actualizar el nombre cuando se logea
    public actualizarNombre(id_socket:string,id_user:number, nombre:string,id_rol :number,atendido:string,id_atencion:number){
        for(let usuario of this.lista){
            if(usuario.id_socket === id_socket){
                usuario.nombre = nombre;
                usuario.id_user = id_user;
                usuario.id_rol = id_rol;
                usuario.atendido = atendido;
                usuario.id_atencion = id_atencion;
                break;
            }
        }
        console.log('==== Actualizando Usuario ===='); 
        console.log('lista de usurios luego de actualizar nombre',this.lista);
    }

    public liberarUsuario(id_user : number){

        for(let usuario of this.lista){
            if(usuario.id_user === id_user){
                usuario.atendido = 'sin-atender';
                usuario.id_atencion = undefined;
            }
        }

    }

    // obtener lista de usuarios conectados

    public getLista(){
        console.log('lista usuarios:',this.lista);
        
        return this.lista.filter(usuario => usuario.nombre !== 'sin-nombre' && usuario.id_rol===2);
        // return this.lista.filter(usuario => usuario.id != id);
        
    }

    // obtener usuario

    public getUsuario(id: string){
        
        return this.lista.find( usuario => usuario.id_socket === id);

    }

    // obtener usuarios en una sala en particular

    public getUsuariosAtendidos(atendido:string){
        return this.lista.filter(usuario =>{
            return usuario.atendido === atendido;
        })
    }

    // borrar usuario

    public borrarUsuario(id:string){
        const tempUsuario = this.getUsuario(id);

        this.lista = this.lista.filter(usuario =>{
            return usuario.id_socket !== id;
        })
        console.log(this.lista);
        return tempUsuario;
    }
}