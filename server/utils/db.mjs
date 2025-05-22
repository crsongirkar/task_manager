import mysql from 'mysql'

export const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "taskms",
    dbdriver: 'mysqli',
    port: 3306 


})

con.connect(function(err){
    if(err){
        console.log("connection error",err)
    } else {
        console.log("Connected")
    }
})

