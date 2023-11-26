const express = require("express");
const {getStorage, ref, uploadBytesResumable} = require("firebase/storage");
const app = express();
const  uploadRouter = require("./middleware/multer");

const admin =  require("firebase-admin");
const credentials = require("./key.json");


admin.initializeApp({
    credential: admin.credential.cert(credentials),
    storageBucket : "gs://firestorecrud-5c0ee.appspot.com"
})

const db = admin.firestore();

app.use(express.json());

app.use(express.urlencoded({extended: true}));



const uploadFile = async (file, quantity) => {
    const storageFB = getStorage();

    const dateTime = Date.now();
    const fileName = `images/${dateTime}`;
    const storageRef = ref(storageFB, fileName);
    const metadata = {
        contentType : file.type,
    }
    await uploadBytesResumable(storageRef, file.buffer, metadata);
    return fileName;
};



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

app.get('/model', async (req, res) => {
    try {
        var bucket = admin.storage().bucket();
        const fileName = 'files/sample.json';
    
        const options = {
            destination : "./model.json",
        };
        const result = await bucket.file(fileName).download(options);
        console.log('result: ' + result);
        
    }
    catch (err){
        console.log(err);
    }
})

app.get('/read', async (req, res) => {
    try {
        const readJson = await db.collection("users").doc(req.body.email).get();
        //console.log(readJson.body.firstName);
        res.send(readJson);
        console.log(readJson.body.lastName);
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

app.use("/upload", uploadRouter );

const PORT  = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Server is running on PORT: ' + PORT);
});

