const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// This line will handle all form parsing in the app automatically
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
        `);
});

app.post("/", (req, res) => {
 console.log(req.body)
    res.send("account created");
});

app.listen(3000, () => {
    console.log("listening");   
});     