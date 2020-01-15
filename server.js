var express = require("express");
var fs = require("fs");
var path = require("path");

var notesInfo = require("./db.json");

var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
// app.use(express.static('files'))


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.post("/api/notes", function(req,res){
    let newNote = req.body;
    notesInfo.push(newNote);
    addId();
    let save = JSON.stringify(notesInfo);
    fs.writeFileSync("db.json",save)

    res.redirect('back');
});

app.delete("/api/notes/:id", function (req,res) {
    const deleted = notesInfo.findIndex((i) => i.id == req.params.id);
    notesInfo.splice(deleted, 1);
    reWrite();
    res.json(notesInfo);
});

function addId() {
    notesInfo.forEach((element, i) => {
        element.id = i + 1;
    });
};
let reWrite = () => {
    let newDB = JSON.stringify(notesInfo);
    fs.writeFile('db.json', newDB, err => { if (err) throw err });
};

app.get("/api/notes", function (req, res) {
    return res.json(notesInfo);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});