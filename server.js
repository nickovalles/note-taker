

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
const fs = require('fs');


app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

// initialize noteData
var noteData = [];

// API ROUTES

// add GET route /api/notes to read db.json and return all saved notes as json
app.get('/api/notes', (req, res) => {
    try {
        // read noteData from json file
        noteData = fs.readFileSync('./db/db.json', 'utf8');
        // parse noteData so is an array of objects
        noteData = JSON.parse(noteData);
    } catch (err) {
        console.log(err);
    }
    // send noteData as json to the server
    res.json(noteData);
});

// add POST route /api/notes to receive a new note to save on the request body, add to db.json file, and return the new note to the client
app.post('/api/notes', (req, res) => {
    try {
        // read noteData from json file
        noteData = fs.readFileSync('./db/db.json', 'utf8');
        // parse data to get array of objects
        noteData = JSON.parse(noteData);
        // set new note id
        req.body.id = noteData.length;
        // push new note to array of note objects
        noteData.push(req.body);

        noteData = JSON.stringify(noteData);
        // write new note to json file
        fs.writeFile('./db/db.json', noteData, 'utf8', (err) => {
            if (err) throw err;
        });
        // change back to array and sent back to client
        res.json(JSON.parse(noteData));

    } catch (err) {
        throw err;
    }
});

app.delete('/api/notes/:id', (req, res) => {
    try {
        // read noteData from json file
        noteData = fs.readFileSync('./db/db.json', 'utf8');
        // parse data to get array of objects
        noteData = JSON.parse(noteData);
        // delete old note from array of note objects
        noteData = noteData.filter(function(note) {
            return note.id != req.params.id;
        });
        noteData = JSON.stringify(noteData);
        //write new notes to the file
        fs.writeFile('./db/db.json', noteData, 'utf8',
        function(err) {
            if (err) throw err;
        });

        // parse data to array of objects and send 
        res.send(JSON.parse(noteData));
        } catch (err) {
            throw err;
        }
});

// HTM ROUTES

// add route /notes to return notes.html file when get started is clicked
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// add route "*" to return index.html file (homepage)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});


app.listen(PORT, () => {
    console.log('API server now on port' + PORT);
})