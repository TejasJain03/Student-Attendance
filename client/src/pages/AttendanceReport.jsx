import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import Navbar from "../components/Navbar";

export default function DailyReport() {
  const { classNumber } = useParams();
  const [date, setDate] = useState("");
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");

  const fetchDailyReport = async () => {
    try {
      setError(""); // Reset any previous errors
      // Check for empty inputs
      if (!classNumber || !date) {
        setError("Please provide both class number and date.");
        return;
      }
      const response = await axios.get(
        `/attendance/daily-report/${classNumber}/${date}`
      );

      setReport(response.data);
    } catch (error) {
      console.error("Error fetching daily report:", error); // Log the error for debugging
      setError(
        "Failed to fetch the report. Please check the inputs or try again."
      );
    }
  };

  return (
    <>
      <Navbar />
      <h1 className="text-2xl font-bold text-center mb-4">
        Daily Attendance Report
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={fetchDailyReport}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Get Report
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="mt-6">
        {report.length > 0 && (
          <div className="space-y-6">
            {report.map((record) => (
              <div
                key={record._id}
                className="bg-white shadow rounded-lg p-6 space-y-4"
              >
                <h2 className="text-xl font-semibold">
                  Class: {record.class} | Date:{" "}
                  {new Date(record.date).toDateString()}
                </h2>
                <p>Total Students: {record.totalStudents}</p>
                <p>Present Count: {record.presentCount}</p>
                <p>Absent Count: {record.absentCount}</p>

                <div>
                  <h3 className="font-semibold">Boy Counts:</h3>
                  <p>Present: {record.presentGenderCounts.boy}</p>
                  <p>Absent: {record.absentGenderCounts.boy}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Absent Counts:</h3>
                  <p>Present: {record.presentGenderCounts.girl}</p>
                  <p>Absent: {record.absentGenderCounts.girl}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Present Students:</h3>
                  <ul className="list-disc pl-6">
                    {record.presentStudents.map((student) => (
                      <li key={student._id}>{student.fullName}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Absent Students:</h3>
                  <ul className="list-disc pl-6">
                    {record.absentStudents.map((student) => (
                      <li key={student._id}>{student.fullName}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
