import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const PORT = 3001;

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '/data/users.json');

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());

// Serve static files from the Nuxt build output
app.use(express.static(path.join(__dirname, '../.output/public')));

// Endpoint to fetch users
app.get('/api/users', (req, res) => {
    fs.readFile(USERS_FILE, (err, data) => {
        if (err) {
            res.status(500).send({ message: 'Error reading users file' });
            return;
        }
        res.send(JSON.parse(data));
    });
});

// Endpoint to fetch a user by email
app.get('/api/users/:email', (req, res) => {
    const email = req.params.email;

    fs.readFile(USERS_FILE, (err, data) => {
        if (err) {
            res.status(500).send({ message: 'Error reading users file' });
            return;
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);

        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    });
});

// Endpoint for user login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile(USERS_FILE, (err, data) => {
        if (err) {
            res.status(500).send({ message: 'Error reading users file' });
            return;
        }
        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);

        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        if (user.password !== password) {
            res.status(400).send({ message: 'Incorrect password' });
            return;
        }

        res.status(200).send({ message: 'Login successful', user });
    });
});

// Endpoint to add a new user
app.post('/api/register', (req, res) => {
    fs.readFile(USERS_FILE, (err, data) => {
        if (err) {
            res.status(500).send({ message: 'Error reading users file' });
            return;
        }
        const users = JSON.parse(data);
        const { email, firstName, lastName, password } = req.body;

        // Check if the email already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            res.status(400).send({ message: 'Email already exists' });
            return;
        }

        // Add new user
        const newUser = { id: Date.now(), email, firstName, lastName, password };
        users.push(newUser);

        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                res.status(500).send({ message: 'Error writing users file'});
                return;
            }
            res.status(201).send(newUser);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
