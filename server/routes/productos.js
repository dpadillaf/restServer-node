const express = require( 'express' );
const Producto = require( '../models/producto' );
const { verificaToken } = require( '../middlewares/authenticator' );

const app = express();

app.get( '/producto', verificaToken, ( req, res ) => {

    let desde = req.query.desde || 0;
    desde = Number( desde );

    let limite = req.query.limite || 5;
    limite = Number( limite );
    
    Producto.find( { disponible: true } )
            .populate( 'categoria', 'descripcion' )
            .populate( 'usuario', 'nombre email' ) //filtra por usuario y trae nombre, email de usuario
            .skip( desde )
            .limit( limite )
            .exec( ( err, productos ) => {

                if ( err ){
                    return res.status( 400 ).json( {
                        ok: false,
                        err
                    } );
                }
        
                Producto.countDocuments( { disponible: true }, ( err, cuantos ) => {

                    return res.json( {
                        ok: true,
                        productos,
                        cuantos
                    } );

                } );

            } );

} );

app.get( '/producto/:id', verificaToken, ( req, res ) => {

    let idProducto = req.params.id;
    
    Producto.findOne( { _id: idProducto, disponible: true })
                .populate( 'categoria', 'descripcion' )
                .populate( 'usuario', 'nombre email' ) //filtra por usuario y trae nombre, email de usuario 
                .exec(( err, prodDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        if ( !prodDB ){
            return res.status( 400 ).json( {
                ok: false,
                err: {
                    message: 'Producto no está disponible en BD'
                }
            } );
        }

        return res.json( {
            ok: true,
            producto: prodDB
        } );

    } );

} );

app.get( '/producto/buscar/:termino', verificaToken, ( req, res ) => {

    let termino = req.params.termino;

    let regex = new RegExp( termino, 'i' ); //expresión regular para búsquedas, i para que ignore mayúsculas y minúsculas
    
    Producto.find( { nombre: regex, disponible: true })
                .populate( 'categoria', 'descripcion' )
                .exec(( err, prodDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }


        return res.json( {
            ok: true,
            productos: prodDB
        } );

    } );

} );

app.post( '/producto', verificaToken, ( req, res ) => {
    
    let body = req.body;
    
    let producto = new Producto( {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    } );

    producto.save( ( err, prodDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        res.json( {
            ok: true,
            producto: prodDB
        } );

    } );

} );

app.put( '/producto/:id', verificaToken, ( req, res ) => {
    
    let id = req.params.id;
    let body = req.body;
    
    let producto =  {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    };

    Producto.findOneAndUpdate( { _id: id, disponible: true }, producto, { new: true, runValidators: true }, ( err, prodDB ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        if ( !prodDB ){
            return res.status( 400 ).json( {
                ok: false,
                err: {
                    message: 'Producto no está disponible en BD'
                }
            } );
        }

        res.json( {
            ok: true,
            producto: prodDB
        } );        

    } );
} );

app.delete( '/producto/:id', verificaToken, ( req, res ) => {
    
    let id = req.params.id;

    Producto.findOneAndUpdate( { _id: id, disponible: true }, { disponible: false }, { new: true }, ( err, prodDeleted ) => {

        if ( err ){
            return res.status( 400 ).json( {
                ok: false,
                err
            } );
        }

        if ( !prodDeleted ){
            return res.status( 400 ).json( {
                ok: false,
                err: {
                    message: 'Producto no está disponible en BD'
                }
            } );
        }

        res.json( {
            ok: true,
            producto: prodDeleted
        } );

    } );

} );

module.exports = app;