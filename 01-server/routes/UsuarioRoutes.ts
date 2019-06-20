import { Router } from 'express';// importar express
import usuarioController from '../controllers/usuarioController'


class UsuarioRoutes {

    //
    public router: Router = Router();

    constructor(){
        // se llama la funcion de configuracion de las peticiones donde se especifica las funcione del controlador que se hacen al hacer la peticion
        this.config();
    }

    config(): void{

        this.router.post('/usuarioDuplicado', usuarioController.usuarioDuplicado);
        this.router.post('/register', usuarioController.Register);
        this.router.get('/logout',usuarioController.logout);
        this.router.post('/login',usuarioController.authentication);  
       

    }

}

const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;