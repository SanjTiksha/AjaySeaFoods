import { useState } from 'react';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFeedback = () => {
    // Open email client with pre-filled subject
    const subject = encodeURIComponent('Feedback - Rajesh Fish Market');
    const body = encodeURIComponent('Hi,\n\nI would like to share my feedback about your fish market:\n\n');
    window.open(`mailto:rajeshfishmarket@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110"
        aria-label="Give Feedback"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Share Your Feedback</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              We value your feedback! Help us improve our service by sharing your experience.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleFeedback}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-opacity-90 transition-colors"
              >
                📧 Send Email Feedback
              </button>
              
              <a
                href="https://forms.google.com/your-feedback-form"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-opacity-90 transition-colors text-center"
              >
                📝 Google Form
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;

