var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Employee = require('./models/employee');
 
 
//get all employee data from db
app.get('/api/employees', async function(req, res) {
	// use mongoose to get all todos in the database
	try {
		const employee = await Employee.find(req.params.employee_id);
        console.log(employee)
		if (!employee) {
			return res.status(404).send('Employee not found');
		}
		res.json(employee);
	} catch (err) {
		res.status(400).send(err);
	}
});

// get a employee with ID of 1
app.get('/api/employees/:employee_id', async function(req, res) {
	try {
		const employee = await Employee.findById(req.params.employee_id);
		if (!employee) {
			return res.status(404).send('Employee not found');
		}
		res.json(employee);
	} catch (err) {
		res.status(400).send(err);
	}
 
});


// create employee and send back all employees after creation
app.post('/api/employees', async function(req, res) {

    // create mongose method to create a new record into collection
    try {
		const employee = await Employee.create({
			name: req.body.name,
			salary: req.body.salary,
			age: req.body.age
		});

		// Fetch all employees after creating a new one
		const allEmployees = await Employee.find();

		res.json({
			allEmployees: allEmployees
		});
	} catch (err) {
		res.status(400).send(err);
	}
 
});


// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', async function(req, res) {
	// create mongose method to update an existing record into collection
    try {
		const employee = await Employee.findByIdAndUpdate(req.params.employee_id, {
			name: req.body.name,
			salary: req.body.salary,
			age: req.body.age
		});
		if (!employee) {
			return res.status(404).send('Employee not found');
		}
		res.send(`Successfully! Employee updated - ${employee.name}`);
	} catch (err) {
		res.status(400).send(err);
	}
});

// delete a employee by id
app.delete('/api/employees/:employee_id', async function(req, res) {
	try {
		const employee = await Employee.findByIdAndRemove(req.params.employee_id);
		if (!employee) {
			return res.status(404).send('Employee not found');
		}
		res.send('Successfully! Employee has been Deleted.');
	} catch (err) {
		res.status(400).send(err);
	}
});

app.listen(port);
console.log("App listening on port : " + port);
