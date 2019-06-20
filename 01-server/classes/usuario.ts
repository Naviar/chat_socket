export class Usuario{
    
    public id_socket: string;
    public nombre: string;
    public atendido:string;
    public id_user? : number;
    public id_rol? :number;
    public id_atencion?:number;

    constructor(id_socket: string,id_rol?: number){
        
        this.id_socket = id_socket;
        this.id_rol = id_rol;
        this.nombre = "sin-nombre";
        this.atendido = "sin-atender";
        this.id_atencion = undefined;
        
    }
}