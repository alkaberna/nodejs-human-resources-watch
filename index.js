const assert = require('assert');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dboper = require('./operations');

const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'human-resources-watch';

mongoClient.connect(url, (err, client) => {

    assert.equal(err, null);

    console.log("Connected correctly to MongoDB server");

    const db = client.db(dbName);

    dboper.insertDocument(db, { name: "Aliaksandr", surname: "Kabrna" },
        "employees", (result) => {
            console.log("Insert Document:\n", result.ops);

            dboper.findDocuments(db, "employees", (docs) => {
                console.log("Found Documents:\n", docs);

                dboper.updateDocument(db, { name: "Aliaksandr" },
                    { surname: "Kaberna" }, "employees", (result) => {
                        console.log("Updated Document:\n", result.result);

                        dboper.findDocuments(db, "employees", (docs) => {
                            console.log("Found Updated Documents:\n", docs);
                            
                            db.dropCollection("employees", (result) => {
                                console.log("Dropped Collection: ", result);

                                client.close();
                            });
                        });
                    });
            });
    });
});

const employeeRouter = require('./routes/employeeRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/employees', employeeRouter);

app.get('/employees/:employeeId', (req, res, next) => {
    res.end('Will send details of the employee: ' +
        req.params.employeeId + ' to you!');
});
  
app.post('/employees/:employeeId', (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /employees/' + req.params.employeeId);
});
  
app.put('/employees/:employeeId', (req, res, next) => {
    res.write('Updating the employee: ' + req.params.employeeId + '\n');
    res.end('Will update the employee: ' + req.body.name + 
        ' ' + req.body.surname);
});
  
app.delete('/employees/:employeeId', (req, res, next) => {
    res.end('Deleting employee: ' + req.params.employeeId);
});

app.use((req, res, next) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
  });
  
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});