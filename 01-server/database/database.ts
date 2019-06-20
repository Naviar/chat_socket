var hasConnect = false;
var db2;
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    if (env['dashDB']) {
        hasConnect = true;
        db2 = env['dashDB'][0].credentials;
    }

}

if (hasConnect == false) {


    db2 = {
        db: "COCBOT",
        hostname: "129.39.55.100",
        port: 50000,
        username: "COCBOT",
        password: "C0l0mb14Sm@rt019*"
    };
}
var connStr = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;
console.log("Se conectó correctamente a la DB");
export default connStr;