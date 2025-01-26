import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/authProvider"; // Assuming you have an authProvider
import axios from "../axios";
import Navbar from "../components/Navbar";

const AttendancePage = () => {
  const { user } = useAuth(); // Ensure this provides the correct user object
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set()); // Set to track selected students
  const [isAllowed, setIsAllowed] = useState(false);
  const { classNumber } = useParams();

  useEffect(() => {
    axios
      .get("/students/6") // Adjust this URL to get the correct data
      .then((response) => {
        setStudents(response.data.students);
      })
      .catch((error) => {
        console.error("There was an error fetching the students!", error);
      });

    axios
      .get("/users/isallowed")
      .then((response) => {
        setIsAllowed(response.data.allowed);
      })
      .catch((error) => {
        console.error("There was an error checking permissions!", error);
      });
  }, [user]);

  const totalStudents = students.length;
  const totalBoys = students.filter(
    (student) => student.gender === "BOY"
  ).length;
  const totalGirls = students.filter(
    (student) => student.gender === "GIRL"
  ).length;

  const handleTakeAttendance = () => {
    // Split the students into present and absent arrays based on selected students
    const present = students.filter((student) =>
      selectedStudents.has(student._id)
    );
    const absent = students.filter(
      (student) => !selectedStudents.has(student._id)
    );

    // Include the teacher (user) in the request body
    const attendanceData = {
      teacher: user._id,
      classNumber: classNumber,
      present: present.map((student) => student._id),
      absent: absent.map((student) => student._id),
    };

    console.log("Attendance Data:", attendanceData);
    const today = new Date().toISOString().split("T")[0]; // Get today's date in yyyy-mm-dd format

    axios
      .post(`/attendance/mark/${today}`, attendanceData) // Adjust this URL to match your backend endpoint
      .then((response) => {
        console.log("Attendance submitted successfully:", response.data);
      })
      .catch((error) => {
        console.error("There was an error submitting the attendance!", error);
      });
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(studentId)) {
        newSelected.delete(studentId); // Deselect if already selected
      } else {
        newSelected.add(studentId); // Select if not selected
      }
      return newSelected;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Attendance</h1>
          <button
            disabled={!isAllowed}
            onClick={handleTakeAttendance}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ${
              isAllowed
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Attendance
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xl font-medium">Total Students: {totalStudents}</p>
          <p className="text-lg text-gray-700">Boys: {totalBoys}</p>
          <p className="text-lg text-gray-700">Girls: {totalGirls}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left">Full Name</th>
                <th className="py-3 px-6 text-left">Gender</th>
                <th className="py-3 px-6 text-center">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-100">
                  <td className="border px-6 py-3">{student.fullName}</td>
                  <td className="border px-6 py-3">{student.gender}</td>
                  <td className="border px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student._id)}
                      onChange={() => toggleStudentSelection(student._id)}
                      className="h-5 w-5"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
