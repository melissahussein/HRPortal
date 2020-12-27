const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./config/db.config");
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var corsOptions = {
    origin: "http://localhost:8081"
};


const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;


//Connect to database
const db = require("./models");
db.mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/admins.routes")(app);
require("./routes/employee.routes")(app);
require("./routes/company.routes")(app);
require("./routes/HR.routes")(app);
require("./routes/payroll.routes")(app);

const fileRoutes = require('./routes/file.routes');
app.use('/public', express.static('public'));
app.use('/api', fileRoutes);

const Company = require('./models/company.model');
const User = require('./models/user.model');


//Add a new company to the database
app.post('/api/addcompany', (req, res) => {
    const company = new Company({ name: req.body.name, LR: req.body.LR, HR: req.body.HR });
    company.save((err) => {
        if (err) return res.status(404).send({ message: err.message });
        return res.send({ company });
    });
});


//Add a new user to the database
app.post('/api/adduser', (req, res) => {
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
        mycompany: req.body.mycompany,
        activity: req.body.activity
    });
    user.save((err) => {
        if (err) return res.status(404).send({ message: err.message });
        return res.send({ user });
    });
});


//Run servers
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {}