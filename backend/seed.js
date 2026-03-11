const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edusmart';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing data');

    // Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: await bcrypt.hash('123456', 10),
      role: 'admin',
      isApproved: true
    });

    const teacher = await User.create({
      name: 'Ankit Sir',
      email: 'teacher@demo.com',
      password: await bcrypt.hash('123456', 10),
      role: 'teacher',
      isApproved: true
    });

    const student = await User.create({
      name: 'Rahul Kumar',
      email: 'student@demo.com',
      password: await bcrypt.hash('123456', 10),
      role: 'student',
      class: 10,
      points: 150
    });

    const student2 = await User.create({
      name: 'Priya Singh',
      email: 'student2@demo.com',
      password: await bcrypt.hash('123456', 10),
      role: 'student',
      class: 10,
      points: 200
    });

    console.log('Created users');

    // Create Courses
    const mathCourse = await Course.create({
      title: 'Complete Mathematics for Class 10',
      description: 'Master algebra, geometry, trigonometry, and more with expert guidance. This comprehensive course covers all topics in the Class 10 Mathematics syllabus including real numbers, polynomials, quadratic equations, triangles, circles, and statistics.',
      shortDescription: 'Master all topics in Class 10 Mathematics',
      instructor: teacher._id,
      instructorName: 'Ankit Sir',
      category: 'Mathematics',
      class: 10,
      level: 'Intermediate',
      isFree: true,
      isPublished: true,
      status: 'published',
      isApproved: true,
      totalLessons: 0,
      totalDuration: 0,
      totalEnrolled: 2,
      rating: 4.8,
      totalRatings: 120,
      outcomes: [
        'Complete understanding of all Class 10 Math topics',
        'Problem-solving techniques and shortcuts',
        'Confidence to score 95%+ in exams',
        'Strong foundation for competitive exams'
      ],
      requirements: [
        'Basic knowledge of Class 9 Mathematics',
        'Dedication to practice regularly'
      ]
    });

    const scienceCourse = await Course.create({
      title: 'Complete Science for Class 10',
      description: 'Learn physics, chemistry, and biology with interactive experiments and detailed explanations. Covering chemical reactions, acids and bases, electricity, magnetic effects, and life processes.',
      shortDescription: 'Complete Science with experiments',
      instructor: teacher._id,
      instructorName: 'Ankit Sir',
      category: 'Science',
      class: 10,
      level: 'Intermediate',
      isFree: true,
      isPublished: true,
      isApproved: true,
      totalLessons: 0,
      totalDuration: 0,
      totalEnrolled: 1,
      rating: 4.9,
      totalRatings: 85,
      outcomes: [
        'Clear understanding of all Science concepts',
        'Knowledge of practical experiments',
        'Problem-solving skills for numericals',
        'Exam preparation with previous year questions'
      ],
      requirements: [
        'Interest in Science',
        'Willingness to do experiments'
      ]
    });

    const englishCourse = await Course.create({
      title: 'English Grammar & Literature',
      description: 'Master English grammar, comprehension, and literature with our comprehensive course. Includes grammar rules, story summaries, poem explanations, and writing skills.',
      shortDescription: 'Complete English for Class 10',
      instructor: teacher._id,
      instructorName: 'Ankit Sir',
      category: 'English',
      class: 10,
      level: 'Beginner',
      isFree: true,
      isPublished: true,
      isApproved: true,
      totalLessons: 0,
      totalDuration: 0,
      totalEnrolled: 1,
      rating: 4.7,
      totalRatings: 60,
      outcomes: [
        'Strong command over English grammar',
        'Better writing and speaking skills',
        'Understanding of literature texts',
        'Improved comprehension skills'
      ],
      requirements: [
        'Basic English knowledge',
        'Willingness to read and practice'
      ]
    });

    console.log('Created courses');

    // Create Lessons for Math Course
    const mathLessons = [
      { title: 'Introduction to Real Numbers', videoDuration: 1800, order: 1, isFree: true },
      { title: 'Fundamental Theorem of Arithmetic', videoDuration: 1500, order: 2, isFree: true },
      { title: 'Revisiting Irrational Numbers', videoDuration: 1200, order: 3, isFree: false },
      { title: 'Polynomials - Introduction', videoDuration: 1500, order: 4, isFree: false },
      { title: 'Zeros of a Polynomial', videoDuration: 1800, order: 5, isFree: false },
      { title: 'Relationship between Zeros and Coefficients', videoDuration: 2100, order: 6, isFree: false },
      { title: 'Quadratic Equations - Introduction', videoDuration: 1500, order: 7, isFree: false },
      { title: 'Solution of Quadratic Equations', videoDuration: 2400, order: 8, isFree: false },
      { title: 'Nature of Roots', videoDuration: 1800, order: 9, isFree: false },
      { title: 'Triangles - Basic Concepts', videoDuration: 1500, order: 10, isFree: false }
    ];

    for (const lesson of mathLessons) {
      const createdLesson = await Lesson.create({
        title: lesson.title,
        description: `Learn ${lesson.title} in detail with examples and practice questions`,
        course: mathCourse._id,
        lessonNumber: lesson.order,
        order: lesson.order,
        videoDuration: lesson.videoDuration,
        isFree: lesson.isFree,
        isPublished: true
      });
      mathCourse.totalLessons += 1;
      mathCourse.totalDuration += Math.floor(lesson.videoDuration / 60);
    }

    // Create Lessons for Science Course
    const scienceLessons = [
      { title: 'Chemical Reactions and Equations', videoDuration: 1800, order: 1, isFree: true },
      { title: 'Types of Chemical Reactions', videoDuration: 2100, order: 2, isFree: true },
      { title: 'Oxidation and Reduction', videoDuration: 1500, order: 3, isFree: false },
      { title: 'Acids, Bases and Salts', videoDuration: 1800, order: 4, isFree: false },
      { title: 'Metals and Non-metals', videoDuration: 2400, order: 5, isFree: false },
      { title: 'Carbon and its Compounds', videoDuration: 2100, order: 6, isFree: false }
    ];

    for (const lesson of scienceLessons) {
      const createdLesson = await Lesson.create({
        title: lesson.title,
        description: `Learn ${lesson.title} with practical examples`,
        course: scienceCourse._id,
        lessonNumber: lesson.order,
        order: lesson.order,
        videoDuration: lesson.videoDuration,
        isFree: lesson.isFree,
        isPublished: true
      });
      scienceCourse.totalLessons += 1;
      scienceCourse.totalDuration += Math.floor(lesson.videoDuration / 60);
    }

    await mathCourse.save();
    await scienceCourse.save();

    console.log('Created lessons');

    await Quiz.create({
      title: 'Real Numbers - Test Your Knowledge',
      description: 'Test your understanding of real numbers, irrational numbers, and related concepts',
      course: mathCourse._id,
      timeLimit: 10,
      passingScore: 60,
      isPublished: true,
      createdBy: teacher._id,
      questions: [
        {
          question: 'What is the square root of 144?',
          options: ['10', '11', '12', '14'],
          correctAnswer: 2,
          explanation: '12 × 12 = 144, so √144 = 12'
        },
        {
          question: 'Which of the following is a rational number?',
          options: ['√2', '√3', '√4', '√5'],
          correctAnswer: 2,
          explanation: '√4 = 2, which is a rational number'
        },
        {
          question: 'The decimal expansion of 22/7 is:',
          options: ['Terminating', 'Non-terminating repeating', 'Non-terminating non-repeating', 'None'],
          correctAnswer: 1,
          explanation: '22/7 = 3.142857142857... is repeating'
        },
        {
          question: 'If a and b are integers, then a + b is:',
          options: ['Always integer', 'Always rational', 'Always irrational', 'None'],
          correctAnswer: 0,
          explanation: 'Sum of two integers is always an integer'
        },
        {
          question: 'What is the LCM of 12 and 15?',
          options: ['30', '45', '60', '75'],
          correctAnswer: 2,
          explanation: 'LCM(12, 15) = 60'
        }
      ]
    });

    await Quiz.create({
      title: 'Quadratic Equations Quiz',
      description: 'Test your knowledge of quadratic equations',
      course: mathCourse._id,
      timeLimit: 15,
      passingScore: 60,
      isPublished: true,
      createdBy: teacher._id,
      questions: [
        {
          question: 'The standard form of quadratic equation is:',
          options: ['ax + b = 0', 'ax² + bx + c = 0', 'ax² + bx = 0', 'ax² = b'],
          correctAnswer: 1,
          explanation: 'ax² + bx + c = 0 is the standard form'
        },
        {
          question: 'Find the roots of x² - 5x + 6 = 0',
          options: ['1, 6', '2, 3', '-2, -3', '1, -6'],
          correctAnswer: 1,
          explanation: '(x-2)(x-3) = 0, so x = 2 or 3'
        },
        {
          question: 'If discriminant is zero, roots are:',
          options: ['Real and unequal', 'Real and equal', 'Imaginary', 'Equal'],
          correctAnswer: 1,
          explanation: 'Zero discriminant means equal real roots'
        }
      ]
    });

    console.log('Created quizzes');

    // Update students with enrolled courses
    await User.findByIdAndUpdate(student._id, {
      enrolledCourses: [mathCourse._id, scienceCourse._id]
    });

    await User.findByIdAndUpdate(student2._id, {
      enrolledCourses: [mathCourse._id]
    });

    console.log('Updated student enrollments');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('   Admin: admin@demo.com / demo123');
    console.log('   Teacher: teacher@demo.com / demo123');
    console.log('   Student: student@demo.com / demo123');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();

