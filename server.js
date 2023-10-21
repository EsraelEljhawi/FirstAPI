const express=require('express');
const mysql=require('mysql2');
const bcrypt=require('bcrypt');
var bodyParser = require('body-parser')
const app=express();
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 app.listen(3000);

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'esraesra12344321',
    database:'login_system'
});

connection.connect((err)=>{
if (err) {
    console.log('connection is failed ! try again ');
}
else{
    console.log('connection to mysql seccussfully');
}
});
app.use(express.json());
// first one is to create user :)


app.post('/users', (req, res) => {
    const { username, password } = req.body;
  
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('An error:', err);
        res.status(500).json({ message: 'An error no.1' });
        return;
      }
  
      const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      const values = [username, hashedPassword];
  
      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error('An error happend while creating user:', err);
          res.status(500).json({ message: 'An error occurred while creating the user.' });
        } else {
          console.log('User created successfully!');
          res.status(200).json({ message: 'User created successfully!' });
        }
      });
    });
  });

  app.get('/users/:username', (req, res) => {
    const { username } = req.params;
  
    const sql = 'SELECT * FROM users WHERE username = ?';
    const values = [username];
  
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('An error occurred while reading the user:', err);
        res.status(500).json({ message: 'An error occurred while reading the user.' });
      } else {
        if (results.length > 0) {
          const user = results[0];
          console.log('User:', user.username);
          res.status(200).json({ message: 'User found! Hi',user});
        } else {
          console.log('User not found!');
          res.status(404).json({ message: 'User not found!' });
        }
      }
    });
  });

  app.put('/users/:username', (req, res) => {
    const { username } = req.params;
    const { newUsername } = req.body;
  
    const sql = 'UPDATE users SET username = ? WHERE username = ?';
    const values = [newUsername, username];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('An error occurred while updating the user:', err);
        res.status(500).json({ message: 'An error occurred while updating the user.' });
      } else {
        console.log('User updated successfully!');
        res.status(200).json({ message: 'User updated successfully!' });
      }
    });
  });

  
  app.delete('/users/:username', (req, res) => {
    const { username } = req.params;
    const sql = 'DELETE FROM users WHERE username = ?';
    const values = [username];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('An error occurred while deleting the user:', err);
        res.status(500).json({ message: 'An error occurred while deleting the user.' });
      } else {
        console.log('User deleted successfully!');
        res.status(200).json({ message: 'User deleted successfully!' });
      }
    });
  });
  app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
  
    // we check if the user is exists 
    connection.query("SELECT * FROM users WHERE username=?",[username],(err,result)=>{
       if(err){
        res.status(500).send(err);
        return;
       }
       
          // If the user exists, check the password
          if (result.length > 0) {
            const hashedPassword = result[0].password;
    
            // Compare between the passwords
            if (bcrypt.compareSync(password, hashedPassword)) {
              // The password is correct, so log the user in
              res.status(200).send(
                "Right password"
             );
              return;
            }
          }
          res.status(401).send("Wrong password");
    }); 
  });