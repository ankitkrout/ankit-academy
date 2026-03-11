import { useState, useEffect } from 'react';
import { certificateAPI } from '../services/api';
import toast from 'react-hot-toast';

const CertificateDownload = ({ courseId, onCertificateGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [checking, setChecking] = useState(true);

  // Check eligibility on mount
  useEffect(() => {
    checkEligibility();
  }, [courseId]);

  const checkEligibility = async () => {
    setChecking(true);
    try {
      const response = await certificateAPI.checkEligibility(courseId);
      setEligibility(response.data);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleGenerateCertificate = async () => {
    setLoading(true);
    try {
      const response = await certificateAPI.generate(courseId);
      if (response.data.success) {
        toast.success('Certificate generated successfully!');
        setEligibility(prev => ({
          ...prev,
          hasCertificate: true,
          certificateId: response.data.certificate.certificateId
        }));
        if (onCertificateGenerated) {
          onCertificateGenerated(response.data.certificate);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate certificate';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!eligibility?.certificateId) return;
    
    setLoading(true);
    try {
      const response = await certificateAPI.download(eligibility.certificateId);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${eligibility.certificateId}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Already has certificate
  if (eligibility?.hasCertificate) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6 border border-amber-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-800">🎉 Course Completed!</h3>
            <p className="text-amber-700 text-sm">
              Congratulations! You've completed all {eligibility?.totalLessons} lessons.
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="btn bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Downloading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Certificate
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Not eligible yet
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Get Your Certificate</h3>
          <p className="text-gray-500 text-sm">
            {eligibility?.completedLessons || 0} of {eligibility?.totalLessons || 0} lessons completed
          </p>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${eligibility?.progress || 0}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={handleGenerateCertificate}
          disabled={!eligibility?.eligible || loading}
          className={`btn ${eligibility?.eligible ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {eligibility?.eligible ? 'Get Certificate' : 'Complete Lessons First'}
        </button>
      </div>
    </div>
  );
};

export default CertificateDownload;

