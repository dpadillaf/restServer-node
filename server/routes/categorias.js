const express = require( 'express' );
const Categoria = require( '../models/categoria' );
const { verificaToken, verificaAdmin_Role } = require( '../middlewares/authenticator' );

const app = express();

app.get( '/categoria', verificaToken, ( req, res ) => {

    let desde = req.query.desde || 0;
    desde = Number( desde );

    let limite = req.query.limite || 5;
    limite = Number( limite );
    
    Categoria.find( {}, 'descripcion usuario' )
            .skip( desde )
            .limit( limite )
            .exec( ( err, categorias ) => {

                if ( err ){
                    return res.status( 400 ).json( {
                        ok: false,
                        err
                    } );
                }
        
                Categoria.countDocuments( ( err, cuantas ) => {

                    return res.json( {
                        ok: true,
                        categorias,
                        cuantas
                    } );

                } );

            } );

} );

app.get( '/categoria/:id', verificaToken, ( req, res ) => {

    let idCategoria = req.params.id;
    
    Categoria.findById( idCategoria, ( err, catDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        return res.json( {
            ok: true,
            categoria: catDB
        } );

    } );

} );

app.post( '/categoria', verificaToken, ( req, res ) => {
    
    let body = req.body;
    
    let categoria = new Categoria( {
        descripcion: body.descripcion,
        usuario: req.usuario._id
    } );

    categoria.save( ( err, catDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        res.json( {
            ok: true,
            categoria: catDB
        } );

    } );

} );

app.put( '/categoria/:id', verificaToken, ( req, res ) => {
    
    let id = req.params.id;
    let descripcion = req.body.descripcion;

    Categoria.findByIdAndUpdate( id, { descripcion }, { new: true, runValidators: true }, ( err, catDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        res.json( {
            ok: true,
            categoria: catDB
        } );        

    } );
} );

app.delete( '/categoria/:id', [ verificaToken, verificaAdmin_Role ], ( req, res ) => {
    
    let id = req.params.id;

    Categoria.findByIdAndRemove( id, ( err, catDeleted ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        if ( !catDeleted ){
            return res.status( 400 ).json( {
                ok: false,
                err: {
                    message: 'Categoría no existe en BD'
                }
            } );
        }

        res.json( {
            ok: true,
            categoria: catDeleted
        } );

    } );

} );


module.exports = app;