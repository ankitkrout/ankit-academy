const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
    default: () => uuidv4()
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  completionDate: {
    type: Date,
    default: Date.now
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 100
  },
  totalLessons: {
    type: Number,
    required: true
  },
  completedLessons: {
    type: Number,
    required: true
  },
  verificationUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
certificateSchema.index({ student: 1, course: 1 }, { unique: true });
certificateSchema.index({ certificateId: 1 });

// Virtual for certificate verification URL
certificateSchema.virtual('verifyUrl').get(function() {
  return `/api/certificates/verify/${this.certificateId}`;
});

// Method to generate certificate HTML for printing
certificateSchema.methods.toCertificateHTML = function() {
  const date = new Date(this.completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const html = '<!DOCTYPE html><html><head><title>Certificate of Completion</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: Georgia, serif; } .certificate { width: 800px; height: 600px; padding: 40px; border: 8px solid #2563EB; text-align: center; margin: 20px auto; background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%); } .header { color: #2563EB; font-size: 14px; letter-spacing: 4px; margin-bottom: 20px; } .title { font-size: 42px; color: #1e3a8a; margin-bottom: 10px; } .subtitle { font-size: 18px; color: #64748b; margin-bottom: 30px; } .student { font-size: 32px; color: #1e3a8a; font-weight: bold; margin-bottom: 20px; } .course-label { font-size: 16px; color: #64748b; } .course { font-size: 24px; color: #2563EB; font-weight: bold; margin-bottom: 30px; } .date { font-size: 14px; color: #64748b; } .footer { margin-top: 40px; display: flex; justify-content: space-around; } .signature { text-align: center; } .sig-line { border-top: 2px solid #94a3b8; width: 150px; margin: 10px auto; } .instructor { color: #374151; } .cert-id { font-size: 10px; color: #94a3b8; margin-top: 20px; }</style></head><body><div class="certificate"><div class="header">ANKIT ACADEMY</div><div class="title">Certificate of Completion</div><div class="subtitle">This is to certify that</div><div class="student">' + this.studentName + '</div><div class="course-label">has successfully completed the course</div><div class="course">' + this.courseName + '</div><div class="date">on ' + date + '</div><div class="footer"><div class="signature"><div class="sig-line"></div><div class="instructor">' + this.instructorName + '</div><div style="font-size: 12px; color: #64748b;">Instructor</div></div><div class="signature"><div class="sig-line"></div><div class="instructor">Ankit Academy</div><div style="font-size: 12px; color: #64748b;">Platform</div></div></div><div class="cert-id">Certificate ID: ' + this.certificateId + '</div></div></body></html>';
  
  return html;
};

module.exports = mongoose.model('Certificate', certificateSchema);

