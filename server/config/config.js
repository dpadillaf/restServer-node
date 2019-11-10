/**
 * configuracion del puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Determinar entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Vencimiento del token
 */
process.env.VENCIMINTO_TOKEN = 60 * 60 * 24 * 30;

/**
 * seed de autenticación
 */
process.env.SEED = process.env.SEED || 'token-desarrollo';

/**
 * Definir BD
 */
let urlDB;

if ( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;