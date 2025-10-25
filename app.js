const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/noteapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Note Schema
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    date: { type: Date, default: Date.now }
});

const Note = mongoose.model('Students', noteSchema);

// API Routes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort('-date');
        res.json(notes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const note = new Note(req.body);
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(400).send('Invalid data');
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(400).send('Delete failed');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
