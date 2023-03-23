const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');


// Route 1: Get All the notes using:GET '/api/notes/getuser'. Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send(" Internal Server Error")
    }
})

// Route 2: Add a new notes using:post '/api/notes/addnote'. Login required
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', 'description must be atleast 5 charecters').isLength({ min: 5 }),], async (req, res) => {

        try {
            const { title, description, tag } = req.body;

            // If there are  errors, return Bad request and the error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNode = await note.save()

            res.json(savedNode)
        } catch (error) {
            console.error(error.message);
            res.status(500).send(" Internal Server Error")
        }
    })

//Route 3: update an existing Note using:PUT '/api/notes/updatenote'. Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    // Create a newNote object
    try {
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and  update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Note Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send(" Internal Server Error")
    }
})

//Route 4: Delete an existing Note using:delete '/api/notes/deletenote'. Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be updated and  delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Note Found") }

        // Allow delete only if user own this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send(" Internal Server Error")
    }
})

module.exports = router