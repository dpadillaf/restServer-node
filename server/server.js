require( './config/config' );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const mongoose = require( 'mongoose' );
const path = require( 'path' );

const app = express();

mongoose.connect( process.env.URLDB, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    }, ( err, res ) => {
    
        if ( err ) throw err;

        console.log( 'DB is connected' );

} );

//manejador de datos en las peticiones
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

//habilitar carpeta public
app.use( express.static( path.resolve( __dirname, '../public' ) ) );

//import rutas
app.use( require( './routes/index' ) );

app.listen( process.env.PORT, () => {
    console.log( `Listen on port ${ process.env.PORT }` );
} );