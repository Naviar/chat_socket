import {Request,Response} from 'express';
var ibmdb = require('ibm_db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../models/config');
import connStr from '../database/database';


class UsuarioController{
    
    
     public async usuarioDuplicado (req : Request,res: Response): Promise<void>{
        
        let correo = req.body.correo;
        

        var query = `SELECT COUNT(*) AS duplicate from usuario where correo='${correo}'`;
 
      await ibmdb.open(connStr, function (err:any, conn:any) {

          if (err) return console.log(err);
 
      conn.query(query, function (err:any, data:any) {
 
                  if (err) res.json({ error: err,
                                      correo: correo })
                  else res.json(data)
                  console.log('la dataa:',data);
                  conn.close(function () { 
                  console.log('termino de buscar');
          });
              });
          });
         
     }

     public async Register (req:Request,res:Response): Promise<void>{

         let NOMBRE = req.body.nombre_usuario;
         let APELLIDO = req.body.apellido_usuario;
         let CORREO = req.body.correo;
         let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        //  let hashedPassword = req.body.password;
         let ROL_ID_ROL = 2;

         console.log('llego esto:', req.body);

         ibmdb.open(connStr, (err:any, conn:any) => {
    
            if (err) { console.log("ERROR" + err); }
            else {
              //Metodo que hace el query
              
              conn.query(`INSERT INTO usuario (nombre, correo, contrasena, apellido, rol_id_rol)
                  VALUES ( '${NOMBRE}', '${CORREO}', '${hashedPassword}', '${APELLIDO}', '${ROL_ID_ROL}')` 
                , (err:any, data:any) => {
                  //Se cierra la conexion de la base de datos
                  
                  if (err) {
                    res.status(500).send('Hubo un problema registrando el usuario ' + err)
                    console.log("Este es el error",err)
                  }
                  else {     
                    conn.query(`select id_usuario,rol_id_rol from usuario order by id_usuario desc limit 0,1`, (err:any, data:any) => {
                      console.log("Se registro con este IDD",data[0].ID_USUARIO);
                      console.log('se registro con este id rol',data[0].ROL_ID_ROL);
                      var token = jwt.sign(
                        { nombre_usuario: req.body.nombre_usuario, rol_usuario: data[0].ROL_ID_ROL, id_usuario: data[0].ID_USUARIO},
                        config.secret,
                        { expiresIn: 86400 }
                        )                
        
                        res.json({ auth: true, token:token })
                    })   
                    conn.close()                 
        
                  }
                }
              )
            }
          })
        }
        
        public async logout (req : Request,res: Response): Promise<void>{
        
          res.status(200).send({ auth: false, token: null });
           
       }

       public async authentication (req : Request,res: Response): Promise<void>{

        let correo = req.body.correo;
        let password = req.body.password;
        
        ibmdb.open(connStr, (err:any, conn:any) => {
          if (err) { console.log(err) }
          else {
              conn.query(`SELECT * FROM usuario WHERE correo = '${correo}'`, (err:any, data:any) => {
    
                  conn.close()
                  if (err) { res.send('Correo o contraseña no son correctos' + err) }
                  else {
                      //console.log(bcrypt.compareSync(password, data[0].PASSWORD))
                      if (data.length == 0) {
                        console.log("correo no existe");

                        res.json({ fail: true})
                      }
                     else if (bcrypt.compareSync(password, data[0].CONTRASENA) != true) {
                      //  else if (password != data[0].PASSWORD){
                          res.json({fail:true})
                      } else {
                        console.log("esto llega", data[0].ID_USUARIO);
                            //Se crea un token con el id el correo y el rol
                        var token = jwt.sign(
                          { id_usuario: data[0].ID_USUARIO, rol_usuario: data[0].ROL_ID_ROL, nombre_usuario: data[0].NOMBRE},
                          config.secret,
                          { expiresIn: 86400 }
                          )
                          //Se responde con el token de autenticacion
                          res.json({ auth: true, token: token })
    
                      }
    
                  }
              }) 
          }
      }) 
         
     }
    
    

}

const usuarioController = new UsuarioController();
export default usuarioController;