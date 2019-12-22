const express = require( 'express' );
const fs = require( 'fs' );
const path = require( 'path' );
const { verificaTokenImg } = require( '../middlewares/authenticator' )

let app = express();

app.get( '/:tipo/:img', verificaTokenImg, ( req, res ) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ img }` );

    if ( fs.existsSync( pathImagen ) ){
        res.sendFile( pathImagen );
    }else{
        let imagePath = path.resolve( __dirname, '../assets/no-imagen.jpg' );
        res.sendFile( imagePath );
    }
    

    

});



module.exports = app;