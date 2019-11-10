/**
 * Autenticar token
 */
const jwt = require( 'jsonwebtoken' );

 let verificaToken = ( req, res, next ) => {

    let token = req.get( 'token' );

    jwt.verify( token, process.env.SEED, ( err, decoded ) => {

        if ( err ){
            return res.status( 401 ).json( {
                ok: false,
                err
            } );
        }

        req.usuario = decoded.usuario;
        next();

    } );

 };

 /**
  * Verificar rol de administrador
  */
 let verificaAdmin_Role = ( req, res, next ) => {

    let role = req.usuario.role;

    if ( role === 'ADMIN_ROLE' ) {
        next();
    }else{
        return res.status( 400 ).json( {
            ok: false,
            err: {
                message: 'Usuario no autorizado!'
            }
        } );
    }

 }

 module.exports = {
    verificaToken,
    verificaAdmin_Role
 };