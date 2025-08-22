import React, { useState } from 'react';

const SimpleRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: '',
    branch: ''
  });

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Application submitted successfully!');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #1e40af, #3b82f6)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>
            Tamil Nadu Engineering Admissions (TNEA)
          </h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            Student Registration Form 2024-25
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '10px' 
          }}>
            {[1, 2, 3].map(step => (
              <div key={step} style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px',
                backgroundColor: step <= currentStep ? '#3b82f6' : '#e5e7eb',
                color: step <= currentStep ? 'white' : '#6b7280',
                margin: '0 5px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Step {step}: {
                  step === 1 ? 'Personal Details' :
                  step === 2 ? 'Academic Info' : 'Review & Submit'
                }
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={{ marginBottom: '30px' }}>
          {currentStep === 1 && (
            <div>
              <h2 style={{ color: '#1e40af', marginBottom: '20px' }}>Personal Details</h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Email ID *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 style={{ color: '#1e40af', marginBottom: '20px' }}>Academic Information</h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Preferred College *
                  </label>
                  <select
                    value={formData.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Select College</option>
                    <option value="anna-university">Anna University - CEG Campus</option>
                    <option value="mit-campus">MIT Campus - Anna University</option>
                    <option value="psg">PSG College of Technology</option>
                    <option value="thiagarajar">Thiagarajar College of Engineering</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Preferred Branch *
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Select Branch</option>
                    <option value="cse">Computer Science and Engineering</option>
                    <option value="ece">Electronics and Communication Engineering</option>
                    <option value="mech">Mechanical Engineering</option>
                    <option value="civil">Civil Engineering</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 style={{ color: '#1e40af', marginBottom: '20px' }}>Review & Submit</h2>
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '20px', 
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginTop: 0, color: '#1e40af' }}>Application Summary</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div><strong>Name:</strong> {formData.fullName || 'Not provided'}</div>
                  <div><strong>Email:</strong> {formData.email || 'Not provided'}</div>
                  <div><strong>Mobile:</strong> {formData.mobile || 'Not provided'}</div>
                  <div><strong>College:</strong> {formData.college || 'Not provided'}</div>
                  <div><strong>Branch:</strong> {formData.branch || 'Not provided'}</div>
                </div>
              </div>
              <div style={{ 
                backgroundColor: '#fef3c7', 
                border: '1px solid #f59e0b',
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <p style={{ margin: 0, color: '#92400e' }}>
                  <strong>Declaration:</strong> I hereby declare that all information provided is true and accurate.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '20px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              padding: '10px 20px',
              border: '1px solid #d1d5db',
              backgroundColor: currentStep === 1 ? '#f3f4f6' : 'white',
              color: currentStep === 1 ? '#9ca3af' : '#374151',
              borderRadius: '4px',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          {currentStep === 3 ? (
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Submit Application
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleRegistrationForm;