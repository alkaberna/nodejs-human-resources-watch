const assert = require('assert');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'human-resources-watch';

mongoClient.connect(url, (err, client) => {

    assert.equal(err, null);

    console.log("Connected correctly to MongoDB server");

    const db = client.db(dbName);
    const collection = db.collection("employees");
    collection.insertOne({"name": "Raman", "surname": "Ulezla"},
        (err, result) => {
            assert.equal(err, null);

            console.log("After Insert:\n");
            console.log(result.ops);

            collection.find({}).toArray((err, docs) => {
                assert.equal(err, null);
            
                console.log("Found:\n");
                console.log(docs);

                db.dropCollection("employees", (err, result) => {
                    assert.equal(err, null);

                    client.close();
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