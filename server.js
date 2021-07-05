const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const users = [];

app.use(express.json());

app.get('/users', (req, res) => {
    res.json(users);
});

//make sure that pass are hashed
app.post('/users', async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(); // or put just 10(eg) en following line
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/users/login', async (req, res) => {
   const user = users.find(user => user.name = req.body.name) 
    if(user == null){

        return res.status(400).send('Cannot find user')
    } 
    try{ // IMPORTANT: compare hashed psswd with bcrypt method otherwise tingling attack
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Success');
        } else 
            res.send('Not allowed');
    } catch{
        res.status(500).send();
    }

})

app.listen(3000);
