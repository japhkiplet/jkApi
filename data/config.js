import dotenv from 'dotenv'
import assert from 'assert'
// import { Server } from 'http';

dotenv.config();

const{host,hostUrl,port,sqlServer,sqlUser,sqlPort,sqlPwd,sqlDb,JWT_SECRET,STRIPE_KEY} = process.env

const sqlEncrypt = process.env.sqlEncrypted==='true';

assert(port,'port is required');
assert(host,'host is required');


const config ={
    port: port,
    host: host,
    url: hostUrl,
    sql:{
        user: sqlUser,
        password: sqlPwd,
        server: sqlServer,
        database: sqlDb,
        options: {
            encrypt: sqlEncrypt,
            trustServerCertificate:true
        }

    },
    jwt_secret: JWT_SECRET,
    STRIPE_KEY: STRIPE_KEY
}
export default config;