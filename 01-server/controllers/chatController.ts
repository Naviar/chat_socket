import {Request,Response} from 'express';
var ibmdb = require('ibm_db');
// var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
var config = require('../models/config');
import connStr from '../database/database';
import { MensajePrivado } from '../models/MensajePrivado';
import Server from '../classes/server';

const server = Server.instance;// instancia servidor

class ChatController {

     

    public async MensajePrivado(req : Request , res : Response) : Promise<void> {
        
        var mp : MensajePrivado = req.body;
        let {id} = req.params;
        console.log('MP',mp);
        
         
        var query = `INSERT INTO Mensajes (ID_USER_ID_ORIGIN,NOMBRE_ORIGIN,ID_USER_ID_DESTINATION,MENSAJE,FECHA) VALUES('${mp.ID_USER_ID_ORIGIN}','${mp.NOMBRE_ORIGIN}','${mp.ID_USER_ID_DESTINATION}','${mp.MENSAJE}','${mp.FECHA}') `;
 
        await ibmdb.open(connStr, function (err:any, conn:any) {
  
            if (err) return console.log(err);
   
        conn.query(query, function (err:any, data:any) {
   
                    if (err) {res.json({ error: err })}
                    else {
                        server.io.in(id).emit('mensaje-nuevo',mp);
                        res.json({llego: true,
                            mp})
                    }
                    conn.close(function () { 
                    console.log('termino de buscar');
            });
                });
            });
    }


    public async getMensajesChat(req : Request , res :Response){

        let id_users = req.body;
       
        var query = `SELECT * FROM Mensajes WHERE (Id_user_id_origin='${id_users.id_user1}' AND Id_user_id_destination='${id_users.id_user2}') OR 
                    (Id_user_id_origin='${id_users.id_user2}' AND ID_user_id_destination='${id_users.id_user1}') ORDER BY Fecha`;
        
                    await ibmdb.open(connStr, function (err:any, conn:any) {
  
                        if (err) return console.log(err);
               
                    conn.query(query, function (err:any, data:any) {
               
                                if (err) {res.json({ error: err })}
                                else {
                                    
                                    res.json(data)
                                }
                                conn.close(function () { 
                                console.log('termino de buscar mensajes entre los del chat');
                        });
                            });
                        });
        
        

    }


}

const chatController = new ChatController();
export default chatController;