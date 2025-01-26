import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const TeacherDashboard = () => {
  const classes = [6, 7, 8, 9, 10]; // List of classes from 6th to 10th
  const navigate = useNavigate();

  const handleNavigate = (classNumber) => {
    navigate(`/class-details/${classNumber}`);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-blue-100 text-gray-800 p-6 h-screen rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Teacher Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classNumber) => (
            <div
              key={classNumber}
              className="flex flex-col items-center bg-white p-6 rounded-md shadow-md"
            >
              <span className="text-xl font-semibold mb-4">
                Class {classNumber}
              </span>
              <button
                onClick={() => handleNavigate(classNumber)}
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
