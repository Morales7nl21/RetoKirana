import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes_csv from "./routes/csv.routes.js";


const app = express();

//Asignación de puerto
app.set('port', process.env.PORT || 4000);

//Middlewares interceptan info
//Dev muestra detemrinado tipo por consola en mensaje
app.use(cors());
//app.use(bodyParser.json())
app.use(express.json({limit: '100mb'})); //to cath data  post method
app.use(morgan('dev'));

//Variables globales


//Rutas.
//var user_routes = require("./routes/cliente")import ruta from ;
app.use('/api',routes_csv);
//Si pasa por todas las rutas significa que no encontro ninguna y se hace lo sig
app.use((req,res,next)=>{
    res.status(404).json({
        message: 'endpoint not found'
    });

});

//Starting server
app.listen(app.get('port'),()=>{
    console.log('Server on port' + app.get('port'))
});