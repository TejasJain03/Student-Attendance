import { useState } from "react";
import Navbar from "../components/Navbar";

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Add Teacher</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
