const { User } = require("./models");
const express = require("exp");
const mongoose = require("mongo");

mongoose.connect(
  "mongodb+srv://unifeso:unifeso-password@unifeso.kwuxv.gcp.mongodb.net/unifeso-financial-control?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "the action cannot be completed!"));
db.once("open", function () {
  console.log("mongoDB in operation.");
});

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// CREATE
app.post("/", async (request, response) => {
  const jsonContent = request.body;
  const user = await User.create(jsonContent);
  response.status(201).send(user);
});

// READ
app.get("/:Identify", async (request, response) => {
  const { id } = request.params;

  try {
    const result = await User.findById(id);

    response.status(200).json({ 
      username: result.username, 
      password: result.password
    });
  } catch {
    console.log('the data was not recognized');
  }
});

// UPDATE
app.put("/:Identify", async (request, response) => {
  const { id } = request.params;

  const { username, password } = request.body;

  try {
    const result = await User.findByIdAndUpdate(id, { 
      username, password
    });

    response.status(200).json({ 
      username, password
    });
    
  } catch {
    console.log('The data could not be confirmed');
  }
});

// DELETE
// infinite load on request
app.delete("/:Identify", async (request, response) => {
  const { id } = request.params;

  try {
    User.findOneAndRemove(User._id == id);

    response.status(202);
  } catch {
    console.log('The data could not be confirmed');
  }
});

const port = 8090;
app.listen(port, () => console.log(`Rodando em localhost:${port}`));
