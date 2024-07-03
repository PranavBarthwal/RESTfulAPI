import express from "express";
import users from "./MOCK_DATA.json" assert { type: "json" };
import fs from "fs";     // file system module to read and write files

const app = express();
const PORT = 8000;


// Middleware : accepts data from URL and adds it to the body of the request object, without this it would be undefined
app.use(express.urlencoded({ extended: false }));


// Define the routes

//Home route
app.get("/", (req, res) => {
    res.send("Hello World");
  });

// Get all users' name (this is server side rendered app as it is returning html)
app.get("/users", (req, res) => {
  const html = `
        <ul>
            ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `;

  res.send(html); 
});


// Get all users (this is client side rendered app as it is returning json)
app.get("/api/users", (req, res) => {
  res.json(users);
});


// methods for single route defined together
app.route('/api/users/:id')
    .get((req, res)=>{ // get user by id
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .patch((req, res)=>{  // update user by id
        return res.json({status : "Pending"})
    })
    .delete((req, res)=>{ // delete user by id
        return res.json({status : "Pending"})
    })


//create new user
app.post('/api/users', (req, res)=>{ 

    const body = req.body;

    users.push({
      id: users.length + 1,
      ...body
  });

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
      return res.json({status : "Success", id: users.length})
    });
    
});    





// listen and Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
