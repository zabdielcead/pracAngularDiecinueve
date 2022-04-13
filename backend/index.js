
/*
primero usamos el comando npm init enter

para ejecutar el index.js -> node index.js

nodemon index.js


como modificamos el package.json  
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev":"nodemon index.js",
    "start":"node index.js"
  },
  Ahora lo vamos a lanzar asi
  npm run dev
  npm run start


  
npm i bcryptjs cors dotenv express express-validator jsonwebtoken mongoose
*/
const  express = require('express');
const  cors    = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

//crear el servidor/aplicacion de express
console.log(process.env);

const app = express();
//conexion de base de datos
dbConnection();

//Directorio Publico
app.use(express.static('public'));
// CORS
app.use(cors());

//lectura y parseo del body
app.use(express.json())


//rutas
app.use('/api/auth', require('./routes/auth'))

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});


