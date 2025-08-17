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
    contentVersions: "Content Versions",
    quizConfigurator: "Quiz Configurator",
    quizQuestions: "Quiz Questions",
    addQuestion: "Add Question",
    addOption: "Add Option",
    questionText: "Question Text",
    optionText: "Option Text",
    isCorrect: "Is Correct?",
    options: "Options", // NEW: For quiz options
    instructorPublicProfile: "Instructor Profile", // NEW
    noCoursesTaughtPublic: "No published course available to show",
    reorderModules: "Reorder Modules", // NEW
    saveOrder: "Save Order", // NEW
    reorderModulesModalTitle: "Reorder Course Modules", // NEW
    compareVersions: "Compare Versions", // NEW
    selectVersion: "Select Version", // NEW
    version: "Version", // NEW
    versionA: "Version A", // NEW
    versionB: "Version B", // NEW
    compare: "Compare", // NEW
    noVersionsToCompare: "No versions available for comparison.", // NEW
    versionComparison: "Course Version Comparison", // NEW
    added: "Added", // NEW
    removed: "Removed", // NEW
    modified: "Modified", // NEW
    noChanges: "No Changes", // NEW
    enterVersionNumber: "Enter Version Number", // NEW
    notAddedYet: "Not added yet", // For items removed from A
    removedFuture: "Removed",
    published: "Published",
    publish: "Publish",
    draft: "Draft",
    viewContentDetails: "View Details", // NEW
    lectureDetails: "Lecture Details", // NEW
    submissionDetails: "Submission Details", // NEW
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
  courseDetails: {
    addModule: "Add Module",
  },
  instructorCard: {
    viewProfile: "View Profile",
    specialties: "Specialties", // Keeping this for now, but not used with current API schema
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
    questionAddedSuccess: "Question added successfully!",
    questionDeletedSuccess: "Question deleted successfully!",
    optionAddedSuccess: "Option added successfully!",
    optionDeletedSuccess: "Option deleted successfully!",
    unenrolledCourse: "You are not enrolled in this course. Enroll to view its modules and content.",
    searchPlaceholder: "Search by name or email...",
    filterBySpecialty: "Filter by Specialty",
    allSpecialties: "All Specialties",
    loadingInstructors: "Loading instructors...",
    noInstructorsFound: "No instructors found matching your criteria.",
    failedToLoadInstructors: "Failed to load instructors.",
    modulesReorderedSuccess: "Modules reordered successfully!", // NEW
    fetchingVersions: "Fetching course versions...", // NEW
    comparisonError: "Error comparing versions.", // NEW
    noVersionsToCompare: "No version to compare!",
  },
  buttons: {
    publishNewVersion: "Publish New Version",
    publish: "Publish",
  },
  footer: {
    copyright: "LearnHub. All rights reserved.",
  },
  sampleMarkdownDescription: `
    # Course Overview

    This is a **comprehensive** course designed to teach you the fundamentals of React.js.

    ## What you'll learn:

    * React Basics (Components, Props, State)
    * React Hooks (useState, useEffect, useContext)
    * Routing with React Router
    * API Integration

    ### Key Features:

    * **Interactive lessons**
    * *Hands-on projects*
    * Quizzes to test your knowledge

    \`\`\`javascript
    // Example code block
    function greet(name) {
      return \`Hello, \${name}!\`;
    }
    \`\`\`

    You can find more resources [here](https://react.dev/).

    | Feature      | Status     | Notes           |
    | :----------- | :--------- | :-------------- |
    | Markdown     | ✅ Done    | Tables, bold, italics |
    | Code Blocks  | ✅ Done    | Syntax highlighting (basic) |
    | Links        | ✅ Done    | External links  |
    | Lists        | ✅ Done    | Unordered/Ordered |

    - [ ] Task list item 1
    - [x] Task list item 2
    `,
};

export default texts;

