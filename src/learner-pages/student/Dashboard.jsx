import React, { useEffect, useState } from "react";
import { useStudentCourseApi } from "@/api/useStudentCourseApi";
import CourseCard from "@/components/CourseCard";

const StudentDashboard = ({ studentId }) => {

  const [courses, setCourses] = useState([]);
  const { getEnrolledCourses } = useStudentCourseApi();

  useEffect(() => {
    const fetchCourses = async () => {

      try {
        const data = await getEnrolledCourses(studentId);
        setCourses(data);

      } catch (err) {
        console.error("Failed to load enrolled courses", err);
      }
    };

    fetchCourses();

  }, [studentId]);

  return (
    <div className="p-6">
        
      <h1 className="text-2xl font-semibold mb-4">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
