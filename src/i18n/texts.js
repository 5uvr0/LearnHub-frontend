// src/i18n/texts.js

const texts = {
  appTitle: "LearnHub",
  nav: {
    home: "Home",
    courses: "Courses",
    instructors: "Instructors",
    teacherDashboard: "Teacher Dashboard",
    aboutUs: "About Us",
    contact: "Contact",
    signUp: "Sign Up",
  },
  sidebar: {
    title: "Navigation",
  },
  hero: {
    headline: "Your Journey to Knowledge Starts Here",
    description: "Explore a vast library of courses designed to empower your learning and career growth.",
    exploreButton: "Explore Courses",
  },
  sections: {
    popularCourses: "Popular Courses",
    allCourses: "All Courses",
    ourInstructors: "Our Esteemed Instructors",
    courseDetails: "Course Details",
    modules: "Modules",
    contents: "Contents",
    allContentReleases: "All Content Releases",
    latestContentRelease: "Latest Content Release",
    teacherDashboard: "Teacher Dashboard",
    courseConfigurator: "Course Configurator",
    createCourse: "Create New Course",
    editCourse: "Edit Course",
    manageModules: "Manage Modules",
    manageContents: "Manage Contents",
    draftCourses: "Draft Courses",
    coursePublicView: "Public Course Overview",
    publicViewNote: "Note: This is a public overview. Enroll to access course content and modules.",
    myCourses: "My Courses",
    incompleteContentDrafts: "Incomplete Content Drafts",
    noIncompleteContentDrafts: "No incomplete content drafts found or available via current APIs.",
    contentVersions: "Content Versions", // NEW
    quizConfigurator: "Quiz Configurator", // NEW
    quizQuestions: "Quiz Questions", // NEW
    addQuestion: "Add Question", // NEW
    addOption: "Add Option", // NEW
    questionText: "Question Text", // NEW
    optionText: "Option Text", // NEW
    isCorrect: "Is Correct?", // NEW
  },
  courseCard: {
    learnMore: "Learn More",
    viewDetails: "View Details",
    edit: "Edit",
    publish: "Publish",
    delete: "Delete",
    confirmDelete: (name) => `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    confirmPublish: (name) => `Are you sure you want to publish "${name}"? This will make it visible to students.`,
  },
  instructorCard: {
    viewProfile: "View Profile",
  },
  forms: {
    courseName: "Course Name",
    courseDescription: "Course Description",
    instructorId: "Instructor",
    selectInstructor: "Select an Instructor",
    addCourse: "Add Course",
    updateCourse: "Update Course",
    moduleTitle: "Module Title",
    moduleOrderIndex: "Order Index",
    addModule: "Add Module",
    updateModule: "Update Module",
    contentTitle: "Content Title",
    contentType: "Content Type",
    contentOrderIndex: "Order Index",
    lectureDescription: "Description",
    lectureVideoUrl: "Video URL",
    lectureResourceLink: "Resource Link",
    quizQuestions: "Quiz Questions",
    submissionDescription: "Description",
    submissionResourceLink: "Resource Link",
    addContent: "Add Content",
    updateContent: "Update Content",
  },
  alerts: {
    exploreCoursesClicked: "Explore Courses clicked!",
    themeChangedTo: (theme) => `Theme changed to ${theme}!`,
    apiError: (msg) => `API Error: ${msg}`,
    courseCreatedSuccess: "Course created successfully!",
    courseUpdatedSuccess: "Course updated successfully!",
    coursePublishedSuccess: "Course published successfully!",
    courseDeletedSuccess: "Course deleted successfully!",
    moduleCreatedSuccess: "Module created successfully!",
    moduleUpdatedSuccess: "Module updated successfully!",
    moduleDeletedSuccess: "Module deleted successfully!",
    contentCreatedSuccess: "Content created successfully!",
    contentUpdatedSuccess: "Content updated successfully!",
    contentPublishedSuccess: "Content published successfully!",
    contentDeletedSuccess: "Content deleted successfully!",
    noCoursesFound: "No courses found.",
    noDraftCoursesFound: "No draft courses found.",
    noModulesFound: "No modules found for this course.",
    noContentsFound: "No contents found for this module.",
    contentFormSelectType: "Please select a content type.",
    courseNotFound: "Course not found.",
    moduleNotFound: "Module not found.",
    contentNotFound: "Content not found.",
    questionAddedSuccess: "Question added successfully!", // NEW
    questionDeletedSuccess: "Question deleted successfully!", // NEW
    optionAddedSuccess: "Option added successfully!", // NEW
    optionDeletedSuccess: "Option deleted successfully!", // NEW
  },
  footer: {
    copyright: "LearnHub. All rights reserved.",
  },
};

export default texts;