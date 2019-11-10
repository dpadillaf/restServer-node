const express = require( 'express' );
const Usuario = require( '../models/usuario' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

const app = express();

app.post( '/login', ( req, res ) => {

    let body = req.body;

    Usuario.findOne( { email: body.email }, ( err, usrDB ) => {

        if ( err ){
            return res.status( 500 ).json( {
                ok: false,
                err
            } );
        }

        if ( !usrDB ){
            return res.status( 400 ).json( {
                ok: false,
                err: {
                    message: 'email* or password wrong'
                }
            } );
        }

        if ( !bcrypt.compareSync( body.password, usrDB.password ) ){
            return res.status( 400 ).json( {
                ok: false,
                err: {
                    message: 'email or password* wrong'
                }
            } );
        }

        let token = jwt.sign( {
            usuario: usrDB
        }, process.env.SEED, { expiresIn: process.env.VENCIMINTO_TOKEN } );

        res.json( {
            ok: true,
            usuario: usrDB,
            token
        } );

    } );

} );

module.exports = app;