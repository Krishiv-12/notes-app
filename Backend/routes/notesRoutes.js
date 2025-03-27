import express, { json } from 'express'
import Note from '../models/noteModel.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get All Notes
router.get('/', protect, async (req, res) => {
    try{
        const notes = await Note.find();
        res.json(notes)
    } catch(error) {
        res.status(500).json({message: "Server Error"})
    }
})

// ✅ Get Single Note
router.get('/:id', protect, async (req , res) => {
    try{
        const note = await Note.findById(req.params.id);
        if(!note) {
            return res.status(404).json({message: "Note not found"})
        }
        res.json(note)
    } catch (error) {
        console.error("Error fetching note:", error.message);
        res.status(500).json({message: "Server Error"})
    }
})


// ✅ Create a New Note
router.post("/", protect, async (req, res) => {
    try {
      const { title, content } = req.body;
  
      if (!title || !content) {
        return res.status(400).json({ message: "Title and Content are required" });
      }
  
      const newNote = new Note({
        user: req.user.id,  // ✅ Ensure user ID is saved
        title,
        content,
      });
  
      const savedNote = await newNote.save();
      res.status(201).json(savedNote);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
 
// ✅ Update a Note (Protected Route)
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!note.user || note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this note" });
    }

    // ✅ Update Note
    note.title = title || note.title;
    note.content = content || note.content;
    const updatedNote = await note.save();

    res.json(updatedNote);
  } catch (error) {
    console.error("Update Note Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
  

 
// ✅ Delete a Note (Debugging Logs Added)
router.delete("/:id", protect, async (req, res) => {
    try {
      console.log("Delete Request Received for Note ID:", req.params.id);
      console.log("User ID from Token:", req.user.id);
  
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid Note ID format" });
      }
  
      const note = await Note.findById(req.params.id);
      console.log("Fetched Note from DB:", note);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      console.log("Note User ID:", note.user ? note.user.toString() : "No user field");
  
      if (!note.user || note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not authorized to delete this note" });
      }
  
      await note.deleteOne();
      res.json({ message: "Note deleted successfully" });
  
    } catch (error) {
      console.error("Delete Note Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  
  
  

export default router;