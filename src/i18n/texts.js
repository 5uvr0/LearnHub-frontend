// src/i18n/texts.js

const texts = {
  appTitle: "LearnHub",
  nav: {
    home: "Home",
    courses: "Courses",
    instructors: "Instructors",
    aboutUs: "About Us",
    contact: "Contact",
    signUp: "Sign Up",
  },
  sidebar: { // NEW: Sidebar texts
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
  },
  courseCard: {
    learnMore: "Learn More",
  },
  instructorCard: {
    viewProfile: "View Profile",
  },
  alerts: {
    exploreCoursesClicked: "Explore Courses clicked!",
    themeChangedTo: (theme) => `Theme changed to ${theme}!`,
  },
  footer: {
    copyright: "LearnHub. All rights reserved.",
  },
  // Example course data (ideally fetched from API)
  sampleCourses: [
    {
      id: 1,
      name: "Web Development Basics",
      description: "Learn the fundamentals of HTML, CSS, and JavaScript to build your first websites.",
      instructorName: "Dr. Alice Smith",
      imageUrl: "https://placehold.co/400x250/FFD700/333333?text=WebDev"
    },
    {
      id: 2,
      name: "Data Science with Python",
      description: "Dive into data analysis, machine learning, and visualization using Python.",
      instructorName: "Prof. Bob Johnson",
      imageUrl: "https://placehold.co/400x250/ADD8E6/333333?text=DataSci"
    },
    {
      id: 3,
      name: "Graphic Design Essentials",
      description: "Master design principles and tools to create stunning visual content.",
      instructorName: "Ms. Carol White",
      imageUrl: "https://placehold.co/400x250/90EE90/333333?text=Design"
    }
  ],
  sampleInstructors: [
    {
      id: 101,
      name: "Dr. Alice Smith",
      email: "alice@learnhub.com",
      imageUrl: "https://placehold.co/150x150/FF6347/FFFFFF?text=Alice"
    },
    {
      id: 102,
      name: "Prof. Bob Johnson",
      email: "bob@learnhub.com",
      imageUrl: "https://placehold.co/150x150/4682B4/FFFFFF?text=Bob"
    },
    {
      id: 103,
      name: "Ms. Carol White",
      email: "carol@learnhub.com",
      imageUrl: "https://placehold.co/150x150/32CD32/FFFFFF?text=Carol"
    }
  ],
  sampleModules: [ // Example module data for CourseDetailsPage
    {
      id: 201,
      title: "Module 1: Introduction to HTML",
      courseId: 1,
      orderIndex: 0,
      contents: [
        {
          id: 301,
          title: "Lecture: HTML Structure",
          type: "LectureCatalogDTO",
          description: "Understanding basic HTML document structure.",
          videoUrl: "https://example.com/html-structure",
          resourceLink: "https://example.com/html-notes.pdf"
        },
        {
          id: 302,
          title: "Quiz: HTML Basics",
          type: "QuizCatalogDTO",
          questions: [
            { questionText: "What does HTML stand for?", options: [] },
          ]
        }
      ]
    },
    {
      id: 202,
      title: "Module 2: CSS Fundamentals",
      courseId: 1,
      orderIndex: 1,
      contents: [
        {
          id: 303,
          title: "Lecture: CSS Selectors",
          type: "LectureCatalogDTO",
          description: "Learning how to select elements with CSS.",
          videoUrl: "https://example.com/css-selectors",
          resourceLink: "https://example.com/css-cheatsheet.pdf"
        }
      ]
    }
  ]
};

export default texts;