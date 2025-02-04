import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "tailwindcss/tailwind.css";

const ClassDetails = () => {
  const [students, setStudents] = useState([]);
  const { classNumber } = useParams();

  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    axios
      .get(`/students/${classNumber}`)
      .then((response) => {
        console.log(response.data)
        setStudents(response.data.students);
      })
      .catch((error) => {
        console.error("There was an error fetching the students!", error);
      });

    axios
      .get("/users/isallowed")
      .then((response) => {
        console.log(response.data);
        setIsAllowed(response.data.allowed);
      })
      .catch((error) => {
        console.error("There was an error checking permissions!", error);
      });
  }, []);

  const totalStudents = students.length;
  const totalBoys = students.filter(
    (student) => student.gender === "BOY"
  ).length;
  const totalGirls = students.filter(
    (student) => student.gender === "GIRL"
  ).length;

  const navigate = useNavigate();

  const handleTakeAttendance = () => {
    // Logic for taking attendance
    console.log("Taking attendance...");
    navigate(`/class-attendance/${classNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Class: {classNumber}</h1>
          <button
            disabled={!isAllowed}
            onClick={handleTakeAttendance}
            className={`px-4 py-2 rounded ${
              isAllowed
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Take Attendance
          </button>
        </div>
        <p className="mb-2">Total Students: {totalStudents}</p>
        <p className="mb-2">Total Boys: {totalBoys}</p>
        <p className="mb-4">Total Girls: {totalGirls}</p>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 border-b">Full Name</th>
              <th className="py-2 border-b">Gender</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{student.fullName}</td>
                <td className="border px-4 py-2">{student.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassDetails;
