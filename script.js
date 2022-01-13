var express = require('express');
var mysql = require('mysql');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var validator = require('validator');
var session = require('express-session');

var masterModel = require("./masterModel");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// xss attack prevention by preventing cookie access by browser js scripts
app.use(session({
    secret: "k5Zurj4",
    cookie: {
        httpOnly: true,
        secure: true
    },
    resave: true,
    saveUninitialized: true
})
)

var options = {
    'client1': {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'superadmindb',
        insecureAuth: true,
    },
    'client2': {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'adamasdb',
        insecureAuth: true,
    },
    'client3': {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mitdb',
        insecureAuth: true,
    }
};

var domainid;
var employeeid;

for (const key in options) {
    var connection = mysql.createConnection(options[key]);
}

connection.connect(function (error) {
    if (error) {
        console.log('Error in connection');
        console.log(error);
    }
    console.log('connected')
});

app.post('/verifyemployee/', function (req, resp) {

    // xss attack prevention of string coming from user input using validator
    employeeid = validator.escape(req.body.employeeid);
    domainid = String(employeeid).split('@')[1];

    // console.log(employeeid)

    masterModel.get_student(connection, domainid, employeeid, function (err, result) {
        // console.log(employeeid);
        if ((result.length) == 1) {
            var responseData = {
                status: 'success',
                data: true,
                message: 'Student Verified Successfully'
            }
            resp.send(JSON.stringify(responseData))
        }
        else {
            console.log(result);
            var responseData = {
                status: 'failure',
                data: false,
                message: 'Student Not Veified'
            }
            resp.send(JSON.stringify(responseData))

        }
    });

});

app.post('/get_current_details/', function (req, resp) {

    // const employeeid = String(req.body.employeeid).split('@')[1];
    masterModel.get_current_details(connection, employeeid, domainid, function (err, result_session) {
        console.log(result_session);

        for (const key in result_session) {
            if (err) {
                console.log(err);
            }
            else {
                var responseData = {
                    name: result_session[key].name,
                    email: result_session[key].email,
                    phone: result_session[key].phone,
                    organization_name: result_session[key].organization_name
                }

                // console.log(responseData);

            }
        }
        resp.send(JSON.stringify(responseData));
    });

});

app.listen(4000);