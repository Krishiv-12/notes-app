import { useState, useEffect } from "react";
import axios from "axios";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editNote, setEditNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search State

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:3000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch notes.");
      setLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:3000/api/notes",
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotes([...notes, data]);
      setTitle("");
      setContent("");
    } catch (err) {
      alert("Failed to add note");
    }
  };

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      alert("Failed to delete note");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `http://localhost:3000/api/notes/${editNote._id}`,
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotes(notes.map((n) => (n._id === editNote._id ? data : n)));
      setEditNote(null);
      setTitle("");
      setContent("");
    } catch (err) {
      alert("Failed to update note");
    }
  };

  // ✅ Filtered Notes Based on Search Query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Notes</h2>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search Notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      {/* ✅ Add / Edit Note Form */}
      <form onSubmit={editNote ? handleUpdate : addNote} className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editNote ? "Update Note" : "Add Note"}
        </button>
        {editNote && (
          <button
            type="button"
            onClick={() => setEditNote(null)}
            className="bg-gray-500 text-white px-4 py-2 ml-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* ✅ Notes List (Filtered) */}
      <ul>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <li key={note._id} className="border p-3 mb-2 rounded flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{note.title}</h3>
                <p>{note.content}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  📝 Edit
                </button>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center">No matching notes found.</p>
        )}
      </ul>
    </div>
  );
};

export default Notes;
