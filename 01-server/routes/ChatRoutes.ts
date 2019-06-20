import { Router } from 'express';// importar express
import chatController from '../controllers/chatController'

class ChatRoutes {

    public router :Router = Router();

    constructor(){

        this.config();
    }

    config() : void {
        this.router.post('/MensajesPrivados/:id', chatController.MensajePrivado );
        this.router.post('/MensajesChat',chatController.getMensajesChat);
    }

}

const chatRoutes = new ChatRoutes();
export default chatRoutes.router;