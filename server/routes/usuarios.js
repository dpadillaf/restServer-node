const express = require( 'express' );
const Usuario = require( '../models/usuario' );
const bcrypt = require( 'bcrypt' );
const _ = require( 'underscore' );

const app = express();

app.get( '/usuario', ( req, res ) => {

    let desde = req.query.desde || 0;
    desde = Number( desde );

    let limite = req.query.limite || 5;
    limite = Number( limite );
    
    Usuario.find( { estado: true }, 'nombre email role estado google img' )
            .skip( desde )
            .limit( limite )
            .exec( ( err, usuarios ) => {

                if ( err ){
                    return res.status( 400 ).json( {
                        ok: false,
                        err
                    } );
                }
        
                Usuario.countDocuments( { estado: true }, ( err, cuantos ) => {

                    res.json( {
                        ok: true,
                        usuarios,
                        cuantos
                    } );

                } );

            } );

} );

app.post( '/usuario', ( req, res ) => {
    
    let body = req.body;
    
    let usuario = new Usuario( {
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role
    } );

    usuario.save( ( err, usrDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        res.json( {
            ok: true,
            usuario: usrDB
        } );

    } );

} );

app.put( '/usuario/:id', ( req, res ) => {
    
    let id = req.params.id;
    let body = _.pick( req.body, [ 'nombre', 'email', 'img', 'role', 'estado' ] );

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, ( err, usrDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        res.json( {
            ok: true,
            usuario: usrDB
        } );        

    } );
    

} );

app.delete( '/usuario/:id', ( req, res ) => {
    
    let id = req.params.id;

    Usuario.findOneAndUpdate( { _id: id }, { estado: false }, { new: true }, ( err, usrDeleted ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        if ( !usrDeleted ){
            return res.status( 400 ).json( {
                ok: false,
                err: {
                    message: 'Usuario no existe en BD'
                }
            } );
        }

        res.json( {
            ok: true,
            usuario: usrDeleted
        } );

    } );

} );

module.exports = app;