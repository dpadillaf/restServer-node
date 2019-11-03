require( './config/config' );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );

const app = express();

//manejador de datos en las peticiones
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

app.get( '/usuario', ( req, res ) => {
    res.send( 'Hello world!' );
} );

app.post( '/usuario', ( req, res ) => {
    
    let body = req.body;
    
    if ( body.nombre === undefined ){
        res.status( 400 ).json( {
            ok: false,
            msj: 'El nombre es necesario',
        } );
    }else{
        res.json( { body } );
    }

} );

app.put( '/usuario/:id', ( req, res ) => {
    
    let id = req.params.id;
    res.json( { id } );

} );

app.delete( '/usuario', ( req, res ) => {
    res.send( 'Hello world!' );
} );

app.listen( process.env.PORT, () => {
    console.log( `Listen on port ${ process.env.PORT }` );
} );