// utils/fileAuthorization.js
import useCurrentStudent from "../learner-hooks/useCurrentStudent.js";
import useCurrentInstructor from "../instructor-hooks/useCurrentInstructor.js";
import { checkAssignedCourse } from "../instructor-hooks/useInstructorCourseApi.js";
import { checkEnrolledCourse } from "../learner-hooks/useStudentCourseApi.js";

export async function isAuthorized(downloadFileDto, courseId, type) {
    const role = localStorage.getItem("role"); // "STUDENT" or "INSTRUCTOR"

    if (role === "STUDENT") {
        const { student } = useCurrentStudent();
        if (!student) return false;

        if (type === "submission") {
            // student can only access own submission
            return student.id === downloadFileDto.studentId;

        } else if (type === "resource") {
            // student can only access if enrolled in the course
            return await checkEnrolledCourse(student.id, courseId);
        }
    }

    if (role === "INSTRUCTOR") {

        const { instructor } = useCurrentInstructor();

        if (!instructor) return false;

        if (type === "submission") {
            // instructor can only access if assigned to the course
            return await checkAssignedCourse(instructor.id, courseId);

        } else if (type === "resource") {
            // instructor can only access own resource
            return instructor.id === downloadFileDto.instructorId;
        }
    }

    return false;
}
