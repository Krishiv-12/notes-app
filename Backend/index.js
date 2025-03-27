import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import notesRoutes from './routes/notesRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors());
const port = process.env.PORT || 5000

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Helloiw Duniya")
})

app.use("/api/notes", notesRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    
})
