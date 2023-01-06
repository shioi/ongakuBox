const express = require("express")
const multer = require("multer");
const fse = require("fs-extra")
const fs = require("fs")
const path = require("path");
const mongoose = require("mongoose")
const dbURI = 'mongodb+srv://helloloneliness:Onepiece123@nodetuts.vik7rzo.mongodb.net/ongakuUser?retryWrites=true&w=majority'
const Music = require('./models/UserModel');
const ongaku = require('./ongaku')

mongoose.set('strictQuery', false);
const app = express()


mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((result) => app.listen(3000))
    .catch((err) => console.log(err))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let Name = req.body.title;
        let path = `./musicFiles/${Name}`;
        fse.mkdirSync(path);
        cb(null, path)
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });


app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.post('/upload', upload.single('xml'), (req, res) => {
    const datares = req.body;
    console.log(datares);
    const music = new Music(datares)
    music.save()
        .then((result) => {
            ongaku.initialize('./musicFiles/' + datares.title + '/');
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/', (req, res) => {
    Music.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Music', sheets: result })
        })
})

app.get('/getdata/:id', (req, res) => {
    const id = req.params.id;
    Music.findById(id)
        .then(result => {
            const EXTENSION = '.xml';
            const newpath = './musicFiles/' + result.title
            fs.readdir(newpath, function (err, files) {
                for (let i = 0; i < files.length; i++) {
                    if (path.extname(files[i]) == ".xml") {
                        targetFile = files[i];
                        console.log(targetFile)
                        res.sendFile(newpath + "/" + targetFile, { root: __dirname });
                    }
                }
            })
        })
})

app.get('/register', (req, res) => {
    res.render('registration');
})

app.get('/sheets/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    Music.findById(id)
        .then(result => {
            res.render('details', { sheet: result, title: 'Sheet Details' })
        })
        .catch(err => {
            console.log(err)
        })
})

var currentlyWorking = "";

app.get('/commit/:id', (req, res) => {
    const id = req.params.id;
    Music.findById(id)
        .then(result => {
            currentlyWorking = result.title;
            console.log(currentlyWorking)
            res.json({ redirect: '/uploadCommit' })
        })
})

app.get('/uploadCommit', (req, res) => {
    res.render('uploadCommit');
})


const commitStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = `./musicFiles/${currentlyWorking}`;
        cb(null, path)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const uploadCommit = multer({ storage: commitStorage });


app.post('/commit', uploadCommit.single('xml'), (req, res) => {
    const datares = req.body;
    ongaku.snapShotCopy("./musicFiles/" + currentlyWorking + "/");
    res.redirect('/')
})

app.get('/gettotalversion/:id', (req, res) => {
    const id = req.params.id;
    Music.findById(id)
        .then((result) => {
            let basepath = './musicFiles/' + result.title + '/.snapshots/'
            fs.readFile(basepath + "versionfile", 'utf8', function read(err, data) {
                res.json({ versions: data })
            })
        })
})

app.get('/versionFile/:id', (req, res) => {
    console.log("wer are called")
    const id = req.params.id;
    console.log(id);
})

