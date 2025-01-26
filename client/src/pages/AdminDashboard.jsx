import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [classes] = useState([6, 7, 8, 9, 10]);
  const [loadingTeachers, setLoadingTeachers] = useState(true); // Loading state for teachers
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch list of teachers using axios
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/users/getallteachers");
        setUsers(response.data); // Assuming the API returns an array of teachers
      } catch (err) {
        setError("Failed to fetch teachers");
        console.error("Error fetching teachers:", err); // Log the error for debugging
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  const addTeacher = () => {
    navigate("/admin/add-teacher");
  };

  const handleAllowChange = (isAllowed, teacherId) => async () => {
    try {
      // Update the server with the new state (allowChanges toggled)
      const response = await axios.put(
        `/users/admin/changefield/${teacherId}`,
        {
          allowChanges: !isAllowed,
        }
      );
      // Optimistically update the UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === teacherId
            ? { ...user, isAllowedChanges: !isAllowed }
            : user
        )
      );

      // You can also force a page reload if desired (optional)
      // window.location.reload();

      console.log("Server response:", response.data); // Log response if needed
    } catch (err) {
      console.error("Error changing allowChanges field:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-col justify-center items-center flex-grow">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Here, you can manage users, view analytics, and handle admin tasks.
            Choose an option from the menu to get started.
          </p>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Teachers</h2>
            {loadingTeachers ? (
              <div className="text-center text-gray-500">
                Loading Teachers...
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <ul className="mt-4">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded-lg shadow-md"
                  >
                    <span className="text-lg text-gray-700">
                      {user.username}
                    </span>
                    <button
                      onClick={handleAllowChange(
                        user.isAllowedChanges,
                        user._id
                      )}
                      className={`${
                        user.isAllowedChanges
                          ? "bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white px-4 py-2 rounded-lg transition`}
                    >
                      {user.isAllowedChanges ? "Disallow" : "Allow"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Classes</h2>
            <ul className="mt-4">
              {classes.map((classNumber) => (
                <li
                  key={classNumber}
                  className="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded-lg shadow-md"
                >
                  <span className="text-lg text-gray-700">
                    Class {classNumber}
                  </span>
                  <button
                    onClick={() => navigate(`/class-details/${classNumber}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Add Teacher Button */}
          <div className="mt-8 text-center">
            <button
              onClick={addTeacher}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
