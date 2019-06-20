import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

//rutas
import usuarioRoutes from './routes/UsuarioRoutes'
import chatRoutes from './routes/ChatRoutes'


const server = Server.instance; 

//BodyParser configuracion para leer post y usar json
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

//para ver que solicitudes rest le hacen al server
server.app.use(morgan('dev'));
//cors permite que puedan consumir los servicios del server sin que esten en el mismo dominion (front y backend en host distintos) 
server.app.use(cors({origin: true,credentials:true}));

//Rutas de servicios REST 
server.app.use('/chatprueba', router);
server.app.use('/chats', chatRoutes);
server.app.use('/usuario',usuarioRoutes);

//levantar el servidor
server.start(()=>{
    console.log(`servidor corriendo en el puerto ${server.port}`);
});