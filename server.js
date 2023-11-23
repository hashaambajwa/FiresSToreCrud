const express = require("express");
const app = express();

const admin =  require("firebase-admin");
const credentials = require("./key.json");


admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const db = admin.firestore();

app.use(express.json());

app.use(express.urlencoded({extended: true}));


app.post('/create', async (req, res) => {
    try{   
        console.log(req.body);
        const userJson = {
            email: req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName
        }
        const response = await db.collection("users").doc(userJson.email).set(userJson);
        res.send(response);
    }
    catch (error){
        res.send(error);

    }
})


app.delete('/delete', async (req, res) => {
    try {
        console.log(req.body);
        const response = await db.collection("users").doc(req.body.email).delete();
        res.send(response);
    }
    catch (error){
        res.send(error);
    }
})

const PORT  = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Server is running on PORT: ' + PORT);
});

