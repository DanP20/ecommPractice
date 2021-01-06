const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(
  cookieSession({
    keys: ["hajksdhskj"],
  })
);

app.get("/signup", (req, res) => {
  res.send(`
    <div>
      Your id is ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post("/signup", async (req, res) => {
  const {
    email,
    password,
    passwordConfirmation
  } = req.body;

  const existingUser = await usersRepo.getOneBy({
    email
  });
  if (existingUser) {
    return res.send("Email address in use");
  }

  if (password !== passwordConfirmation) {
    return res.send("passwords must match");
  }

  //Create a user in the user repo to represent this person
  const user = await usersRepo.create({
    email: email,
    password: password
  });

  // Store the id of that user inside the user cookie
  req.session.userId = user.id;

  res.send("Account created!!!");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("you are logged out");
});

app.get("/signin", (req, res) => {
  res.send(`
      <div>
      
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
    `);
});

app.post("/signin", async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const user = await usersRepo.getOneBy({
    email
  });

  if (!user) {
    return res.send("email not found");
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password, 
    password
    );
  if (!validPassword) {
    return res.send("invalid password");
  }

  req.session.useId = user.id;

  res.send("You are signed in!!")
});

app.listen(3000, () => {
  console.log("Listening");
});