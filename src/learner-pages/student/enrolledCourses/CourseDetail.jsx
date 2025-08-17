import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStudentCourseApi } from "@/api/useStudentCourseApi";
import ContentListItem from "@/components/ContentListItem";

const CourseDetail = ({ studentId }) => {

  const { courseId } = useParams();
  const { getCourseDetail } = useStudentCourseApi();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {

      try {
        const data = await getCourseDetail(courseId, studentId);
        setCourse(data);

      } catch (err) {
        console.error("Failed to load course detail", err);

      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, studentId]);

  if (loading) {
    return <div className="p-6">Loading course details...</div>;
  }

  if (!course) {
    return <div className="p-6 text-red-500">Course not found.</div>;
  }

  return (
    <div className="p-6">

      {/* Course Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{course.title}</h1>

        <p className="text-gray-600">{course.description}</p>

        <p className="mt-2 text-sm text-gray-500">
          Progress: {course.progress?.completed} / {course.progress?.total} contents
        </p>

      </div>

      {/* Modules */}
      <div className="space-y-6">

        {course.modules.map((module) => (

          <div key={module.id} className="bg-white rounded-2xl shadow p-4">

            <h2 className="text-xl font-semibold mb-3">{module.title}</h2>

            <p className="text-gray-500 mb-4">{module.description}</p>

            <div className="space-y-2">
              {module.contents.map((content) => (
                <ContentListItem key={content.id} content={content} />
              ))}
            </div>

            <p className="text-sm text-gray-400 mt-3">
              Module progress: {module.progress?.completed} / {module.progress?.total}
            </p>

          </div>
        ))}
        
      </div>
    </div>
  );
};

export default CourseDetail;
