const express = require( 'express' );
const Usuario = require( '../models/usuario' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client( process.env.CLIENT_ID );

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

//config google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend

    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
  }

app.post( '/google', async ( req, res ) => {

    let token = req.body.idtoken;

    let googleUser = await verify( token )
        .catch( e => {
            return res.status( 403 ).json( {
                ok: false,
                err: e
            } );
        } );

    Usuario.findOne( { email: googleUser.email }, ( err, usrDB ) => {

        if ( err ) {
            return res.status( 500 ).json( {
                ok: false,
                err
            } );
        }

        if ( usrDB ) {

            if ( usrDB.google === false ) {
                return res.status( 400 ).json( {
                    ok: false,
                    err: 'Deebe usar autenticación normal'
                } );
            } else {
                let token = jwt.sign( {
                    usuario: usrDB
                }, process.env.SEED, { expiresIn: process.env.VENCIMINTO_TOKEN } );

                return res.json( {
                    ok: true,
                    usuario: usrDB,
                    token
                } );
            }

        } else {

            // si nuevo user no existe en BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':=)';

            usuario.save( ( err, usrDB ) => {

                if ( err ) {
                    return res.status( 500 ).json( {
                        ok: false,
                        err
                    } );
                }

                let token = jwt.sign( {
                    usuario: usrDB
                }, process.env.SEED, { expiresIn: process.env.VENCIMINTO_TOKEN } );

                return res.json( {
                    ok: true,
                    usuario: usrDB,
                    token
                } );

            } );

        }

    } );

} );

module.exports = app;