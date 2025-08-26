// utils/fileAuthorization.js
import useCurrentStudent from "../learner-hooks/useCurrentStudent.js";
import useInstructorApi from "../course-hooks/useInstructorApi.js";
import useStudentCourseApi from "../learner-hooks/useStudentCourseApi.js";
import useCourseApi from "../course-hooks/useCourseApi.js";

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
            const {getEnrolledCourseIdsByStudent} = useStudentCourseApi();

            const enrolledIds = await getEnrolledCourseIdsByStudent(student.id);

            return enrolledIds.includes(parseInt(courseId));
        }
    }

    if (role === "INSTRUCTOR") {

        const { getMyProfile } = useInstructorApi();

        const instructor = await getMyProfile();

        if (!instructor) return false;

        if (type === "submission") {
            // instructor can only access if assigned to the course
            const { getCourseByIdPublic } = useCourseApi();

            const course = await getCourseByIdPublic(courseId);

            return course.instructorId === instructor.id;

        } else if (type === "resource") {
            // instructor can only access own resource
            return instructor.id === downloadFileDto.instructorId;
        }
    }

    return false;
}
