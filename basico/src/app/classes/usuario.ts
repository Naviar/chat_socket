export class Usuario {

    public nombre:string;
    public id_socket:string;
    public atendido :string;
    public id_user: number;
    public id_rol: number;
    public id_atencion :number;
    constructor(
        nombre:string,
        id_socket:string,
        id_user: number,
        id_rol: number,
        atendido?:string,
        id_atencion? : number
        
    ){  

        this.nombre=nombre;
        this.id_socket = id_socket;
        this.atendido = atendido;
        this.id_user = id_user;
        this.id_rol = id_rol;
        this.id_atencion = id_atencion;    }
}