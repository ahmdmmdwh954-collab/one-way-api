'use strict';
function validate(env) {
  if(env.FLEETOPS_DB_DRIVER!=='postgres'||env.FLEETOPS_AUTH_MODE!=='supabase'||env.FLEETOPS_SEED_DEMO!=='false') throw Error('CLOUD_MODE_REQUIRED');
  if(env.SUPABASE_URL!=='https://kpgjxpuisgjislwedbka.supabase.co'||!env.SUPABASE_PUBLISHABLE_KEY) throw Error('SUPABASE_CONFIG_REQUIRED');
  if(!env.PGSSLROOTCERT||!require('node:fs').existsSync(env.PGSSLROOTCERT)) throw Error('CA_FILE_REQUIRED');
  if(env.NODE_TLS_REJECT_UNAUTHORIZED==='0') throw Error('TLS_VERIFICATION_REQUIRED');
  const port=Number(env.PORT||10000);
  if(!Number.isInteger(port)||port<1||port>65535) throw Error('PORT_INVALID');
  require('./backend/db/postgres/config').configFromEnv(env);
  return port;
}
function start() {
  try {
    const port=validate(process.env);
    const {app,db}=require('./backend/server');
    const server=app.listen(port,'0.0.0.0',()=>console.log('ONE_WAY_CLOUD_READY'));
    server.on('error',()=>{console.error('CLOUD_LISTEN_FAILED');process.exit(1);});
    const shutdown=()=>{server.close(()=>{db.close();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();};
    process.once('SIGTERM',shutdown);process.once('SIGINT',shutdown);
  } catch (_) { console.error('CLOUD_START_FAILED_CHECK_ENV_AND_DATABASE');process.exitCode=1; }
}
if(require.main===module)start();
module.exports={validate};
