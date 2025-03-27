import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);


  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setName(data.name);
    } catch (err) {
      setMessage("Failed to fetch profile");
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:3000/api/users/profile",
        { name, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile");
    }
  };

  if (!user) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={updateProfile} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="password"
          placeholder="New Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Profile
        </button>

        {/* ✅ Back to Notes Button */}
      <button
        onClick={() => navigate("/notes")}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Back to Notes
      </button>
      </form>
    </div>
  );
};

export default Profile;
