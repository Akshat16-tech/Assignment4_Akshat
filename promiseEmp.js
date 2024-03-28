const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const database = require('./config/database');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(database.url);

const Employee = require('./models/employee');

// get all employee data from db
app.get('/api/employees', (req, res) => {
    Employee.find()
        .then(employee => {
            res.json(employee);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// get a employee with ID of 1
app.get('/api/employees/:employee_id', (req, res) => {
    Employee.findById(req.params.employee_id)
        .then(employee => {
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.json(employee);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Create a new employee
app.post('/api/employees', (req, res) => {
    const { name, salary, age } = req.body;
    Employee.create({ name, salary, age })
        .then(employee => {
            return Employee.find();
        })
        .then(allEmployees => {
            res.json({ allEmployees });
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Update an existing employee
app.put('/api/employees/:employee_id', (req, res) => {
    const { name, salary, age } = req.body;
    Employee.findByIdAndUpdate(req.params.employee_id, { name, salary, age })
        .then(employee => {
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.send(`Successfully! Employee updated - ${employee.name}`);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Delete an employee by ID
app.delete('/api/employees/:employee_id', (req, res) => {
    Employee.findByIdAndRemove(req.params.employee_id)
        .then(employee => {
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.send('Successfully! Employee has been Deleted.');
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

app.listen(port, () => {
    console.log(`App listening on port : ${port}`);
});
