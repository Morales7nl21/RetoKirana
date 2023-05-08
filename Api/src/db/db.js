import {createPool} from 'mysql2/promise'
//create conexion solo mantiene un hilo de conexion
//create pool mantiene varias
export const pool = createPool({
    host:'localhost',
    user: 'Blas',
    password: 'David_escomMySQL',
    port: 3306,
    database:'kirana'
});
