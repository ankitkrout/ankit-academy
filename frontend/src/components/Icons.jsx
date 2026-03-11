// Modern SVG Icons for Ankit Academy - Online Learning Platform
// Designed for Class 8-12 students

import React from 'react';

// Video Lectures Icon - Play button inside video screen with graduation cap
export const VideoLectureIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="videoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6"/>
        <stop offset="100%" stopColor="#1D4ED8"/>
      </linearGradient>
    </defs>
    {/* Video Screen */}
    <rect x="4" y="10" width="48" height="36" rx="6" fill="url(#videoGrad)"/>
    {/* Screen Inner */}
    <rect x="8" y="14" width="40" height="28" rx="3" fill="#1E3A8A" fillOpacity="0.3"/>
    {/* Play Button */}
    <path d="M24 20L24 36L38 28L24 20Z" fill="white"/>
    {/* Graduation Cap */}
    <path d="M32 4L38 10H26L32 4Z" fill="#F59E0B"/>
    <rect x="24" y="10" width="16" height="4" rx="1" fill="#F59E0B"/>
    <rect x="28" y="12" width="8" height="6" fill="#F59E0B"/>
    <circle cx="32" cy="18" r="2" fill="#FBBF24"/>
  </svg>
);

// Practice Quiz Icon - Checklist with question marks
export const QuizIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="quizGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981"/>
        <stop offset="100%" stopColor="#059669"/>
      </linearGradient>
    </defs>
    {/* Clipboard */}
    <rect x="14" y="8" width="36" height="48" rx="6" fill="url(#quizGrad)"/>
    {/* Clipboard Top */}
    <rect x="14" y="8" width="36" height="12" rx="6" fill="#065F46"/>
    <circle cx="32" cy="14" r="3" fill="#34D399"/>
    {/* Checklist Items */}
    <rect x="20" y="26" width="16" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    <circle cx="23" cy="27.5" r="2" fill="#34D399"/>
    <rect x="20" y="34" width="12" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    <circle cx="23" cy="35.5" r="2" fill="#34D399"/>
    <rect x="20" y="42" width="14" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    <circle cx="23" cy="43.5" r="2" fill="#34D399"/>
    {/* Question Mark */}
    <text x="42" y="42" fontSize="20" fontWeight="bold" fill="#F59E0B">?</text>
  </svg>
);

// Study Materials Icon - Stacked books
export const StudyMaterialsIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="booksGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6"/>
        <stop offset="100%" stopColor="#6D28D9"/>
      </linearGradient>
    </defs>
    {/* Book 1 (Back) */}
    <path d="M12 18H44C46.2 18 48 19.8 48 22V52C48 54.2 46.2 56 44 56H12C9.8 56 8 54.2 8 52V22C8 19.8 9.8 18 12 18Z" fill="url(#booksGrad)" fillOpacity="0.5"/>
    <rect x="12" y="18" width="4" height="38" fill="#7C3AED" fillOpacity="0.5"/>
    {/* Book 2 (Middle) */}
    <path d="M8 12H40C42.2 12 44 13.8 44 16V46C44 48.2 42.2 50 40 50H8C5.8 50 4 48.2 4 46V16C4 13.8 5.8 12 8 12Z" fill="url(#booksGrad)" fillOpacity="0.7"/>
    <rect x="8" y="12" width="4" height="38" fill="#7C3AED" fillOpacity="0.7"/>
    {/* Book 3 (Front) */}
    <path d="M16 6H48C50.2 6 52 7.8 52 10V40C52 42.2 50.2 44 48 44H16C13.8 44 12 42.2 12 40V10C12 7.8 13.8 6 16 6Z" fill="url(#booksGrad)"/>
    <rect x="16" y="6" width="4" height="38" fill="#7C3AED"/>
    {/* Lines on front book */}
    <line x1="22" y1="14" x2="40" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="20" x2="36" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="26" x2="44" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Expert Teachers Icon - Teacher avatar with graduation cap
export const TeacherIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="teacherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1"/>
        <stop offset="100%" stopColor="#4F46E5"/>
      </linearGradient>
    </defs>
    {/* Circle Background */}
    <circle cx="32" cy="32" r="28" fill="url(#teacherGrad)"/>
    {/* Body/Shoulders */}
    <path d="M12 52C12 44 20 38 32 38C44 38 52 44 52 52V56H12V52Z" fill="white" fillOpacity="0.9"/>
    {/* Face */}
    <circle cx="32" cy="28" r="12" fill="#FDE68A"/>
    {/* Hair */}
    <path d="M20 24C20 18 24 14 32 14C40 14 44 18 44 24C44 26 42 28 40 28H24C22 28 20 26 20 24Z" fill="#4B5563"/>
    {/* Eyes */}
    <circle cx="28" cy="26" r="1.5" fill="#1F2937"/>
    <circle cx="36" cy="26" r="1.5" fill="#1F2937"/>
    {/* Smile */}
    <path d="M28 32Q32 35 36 32" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Graduation Cap */}
    <path d="M26 12L30 6H34L38 12" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <rect x="24" y="10" width="16" height="4" rx="1" fill="#FBBF24"/>
  </svg>
);

// Courses Icon - Open book with bookmark
export const CoursesIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="courseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EC4899"/>
        <stop offset="100%" stopColor="#BE185D"/>
      </linearGradient>
    </defs>
    {/* Open Book */}
    <path d="M8 16C8 14 10 12 12 12H28C30 12 32 14 32 16V48C32 50 30 52 28 52H12C10 52 8 50 8 48V16Z" fill="url(#courseGrad)" fillOpacity="0.3"/>
    <path d="M32 16C32 14 34 12 36 12H52C54 12 56 14 56 16V48C56 50 54 52 52 52H36C34 52 32 50 32 48V16Z" fill="url(#courseGrad)"/>
    {/* Book Spine */}
    <rect x="30" y="12" width="4" height="40" fill="#BE185D"/>
    {/* Bookmark */}
    <path d="M40 12V28L48 20V12H40Z" fill="#F59E0B"/>
    {/* Text Lines */}
    <line x1="14" y1="20" x2="26" y2="20" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="26" x2="24" y2="26" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="32" x2="26" y2="32" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="38" x2="22" y2="38" stroke="#EC4899" strokeWidth="2" strokeLinecap="round"/>
    <line x1="38" y1="20" x2="50" y2="20" stroke="#BE185D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="38" y1="26" x2="48" y2="26" stroke="#BE185D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="38" y1="32" x2="50" y2="32" stroke="#BE185D" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Certificates Icon - Certificate badge with ribbon
export const CertificateIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B"/>
        <stop offset="100%" stopColor="#D97706"/>
      </linearGradient>
    </defs>
    {/* Badge Circle */}
    <circle cx="32" cy="30" r="22" fill="url(#certGrad)"/>
    <circle cx="32" cy="30" r="18" fill="#FFF" fillOpacity="0.95"/>
    {/* Star */}
    <path d="M32 18L34.5 25.5L42 26L36 31L38 38L32 34L26 38L28 31L22 26L29.5 25.5L32 18Z" fill="#F59E0B"/>
    {/* Ribbon Left */}
    <path d="M20 48L14 60L20 56L26 60L20 48Z" fill="#DC2626"/>
    {/* Ribbon Right */}
    <path d="M44 48L50 60L44 56L38 60L44 48Z" fill="#DC2626"/>
    {/* Text */}
    <text x="32" y="48" fontSize="6" fontWeight="bold" fill="#92400E" textAnchor="middle">CERTIFICATE</text>
  </svg>
);

// Chapters/Lessons Icon - Notebook with chapter list
export const ChapterIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chapterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6"/>
        <stop offset="100%" stopColor="#0D9488"/>
      </linearGradient>
    </defs>
    {/* Notebook */}
    <rect x="12" y="8" width="40" height="48" rx="6" fill="url(#chapterGrad)"/>
    {/* Binding */}
    <rect x="12" y="8" width="8" height="48" rx="3" fill="#0F766E"/>
    {/* Binding Rings */}
    <circle cx="16" cy="18" r="2" fill="#5EEAD4"/>
    <circle cx="16" cy="30" r="2" fill="#5EEAD4"/>
    <circle cx="16" cy="42" r="2" fill="#5EEAD4"/>
    {/* Chapter Lines */}
    <rect x="26" y="16" width="18" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    <rect x="26" y="24" width="14" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    <rect x="26" y="32" width="18" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    <rect x="26" y="40" width="12" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    {/* Page curl */}
    <path d="M48 52C48 54 50 56 52 56H48V52Z" fill="#0D9488"/>
  </svg>
);

// Student Community Icon - Group of students with chat bubble
export const CommunityIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="communityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4"/>
        <stop offset="100%" stopColor="#0891B2"/>
      </linearGradient>
    </defs>
    {/* Chat Bubble Background */}
    <circle cx="32" cy="32" r="26" fill="url(#communityGrad)"/>
    {/* Student 1 (Left) */}
    <circle cx="20" cy="30" r="8" fill="#FDE68A"/>
    <path d="M12 44C12 40 16 38 20 38C24 38 28 40 28 44H12Z" fill="#FDE68A"/>
    {/* Student 2 (Right) */}
    <circle cx="44" cy="30" r="8" fill="#FDE68A"/>
    <path d="M36 44C36 40 40 38 44 38C48 38 52 40 52 44H36Z" fill="#FDE68A"/>
    {/* Student 3 (Center - Back) */}
    <circle cx="32" cy="24" r="7" fill="#FDE68A"/>
    <path d="M25 36C25 33 28 31 32 31C36 31 39 33 39 36H25Z" fill="#FDE68A"/>
    {/* Chat Bubble */}
    <ellipse cx="44" cy="14" rx="10" ry="8" fill="white"/>
    <path d="M40 20L42 24L46 18" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="42" cy="14" r="2" fill="#06B6D4"/>
  </svg>
);

// Export all icons as a single component
const Icons = {
  VideoLectureIcon,
  QuizIcon,
  StudyMaterialsIcon,
  TeacherIcon,
  CoursesIcon,
  CertificateIcon,
  ChapterIcon,
  CommunityIcon
};

export default Icons;

// Example usage in your component:
// import { VideoLectureIcon, QuizIcon, StudyMaterialsIcon, TeacherIcon, CoursesIcon, CertificateIcon, ChapterIcon, CommunityIcon } from './components/Icons';
//
// <VideoLectureIcon className="w-16 h-16" />
// <QuizIcon className="w-16 h-16 text-green-500" />

