export interface MensajePrivado {
    
    NOMBRE_ORIGIN?:string,
    ID_USER_ID_ORIGIN?:number,
    ID_socket_user_origin?: string,
    Nombre_destination?:string,
    ID_USER_ID_DESTINATION?:number,
    ID_socket_user_destination?: string,
    MENSAJE?: string,
    FECHA?: Date,
}