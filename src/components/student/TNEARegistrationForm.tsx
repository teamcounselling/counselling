import React, { useState } from 'react';

interface FormData {
  personal_details: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    mobile: string;
    aadhaar: string;
  };
  address_info: {
    permanentAddress: string;
    state: string;
    district: string;
    pincode: string;
  };
  community_info: {
    community: string;
    casteName: string;
    communityFile: File | null;
    specialCategories: string[];
  };
  academic_details: {
    tenth: {
      marksheetNumber: string;
      school: string;
      board: string;
      year: string;
    };
    twelfth: {
      marksheetNumber: string;
      school: string;
      board: string;
      year: string;
    };
    marksheetFiles: File[];
  };
  marks: {
    maths: string;
    physics: string;
    chemistry: string;
    cutoff: string;
    combinedMarksheetFile: File | null;
  };
  preferences: {
    colleges: string[];
    branches: string[];
  };
  declaration: {
    agreed: boolean;
    signatureFile: File | null;
  };
}

const TNEARegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    personal_details: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      mobile: '',
      aadhaar: '',
    },
    address_info: {
      permanentAddress: '',
      state: '',
      district: '',
      pincode: '',
    },
    community_info: {
      community: '',
      casteName: '',
      communityFile: null,
      specialCategories: [],
    },
    academic_details: {
      tenth: {
        marksheetNumber: '',
        school: '',
        board: '',
        year: '',
      },
      twelfth: {
        marksheetNumber: '',
        school: '',
        board: '',
        year: '',
      },
      marksheetFiles: [],
    },
    marks: {
      maths: '',
      physics: '',
      chemistry: '',
      cutoff: '',
      combinedMarksheetFile: null,
    },
    preferences: {
      colleges: [],
      branches: [],
    },
    declaration: {
      agreed: false,
      signatureFile: null,
    },
  });

  const steps = [
    { id: 1, title: 'Personal Details', icon: '👤' },
    { id: 2, title: 'Address Info', icon: '📍' },
    { id: 3, title: 'Community', icon: '👥' },
    { id: 4, title: 'Academic', icon: '🎓' },
    { id: 5, title: 'Marks', icon: '📊' },
    { id: 6, title: 'Preferences', icon: '❤️' },
    { id: 7, title: 'Declaration', icon: '📝' },
    { id: 8, title: 'Preview', icon: '👁️' },
  ];

  const states = ['Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Puducherry'];
  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
    'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Kanchipuram',
  ];
  const communities = ['OC', 'BC', 'MBC', 'SC', 'ST'];
  const specialCategories = ['Ex-Servicemen', 'Sports Quota', 'Differently Abled', 'First Graduate', 'NCC', 'NSS'];
  const boards = ['Tamil Nadu State Board', 'CBSE', 'ICSE', 'Matriculation'];
  const years = ['2024', '2023', '2022', '2021', '2020'];
  const colleges = [
    'Anna University - CEG Campus',
    'MIT Campus - Anna University', 
    'Thiagarajar College of Engineering',
    'PSG College of Technology',
    'Kumaraguru College of Technology',
    'SSN College of Engineering'
  ];
  const branches = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const calculateCutoff = () => {
    const { maths, physics, chemistry } = formData.marks;
    if (maths && physics && chemistry) {
      const cutoff = (parseFloat(maths) + parseFloat(physics) + parseFloat(chemistry)) / 3;
      updateFormData('marks', { cutoff: cutoff.toFixed(2) });
    }
  };

  const handleNext = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFileUpload = (section: keyof FormData, field: string, file: File | File[]) => {
    updateFormData(section, { [field]: file });
  };

  const handleMultiSelect = (section: keyof FormData, field: string, value: string, checked: boolean) => {
    const currentArray = (formData[section] as any)[field] || [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter((item: string) => item !== value);
    updateFormData(section, { [field]: newArray });
  };

  const handleSubmit = () => {
    console.log('Final submission:', formData);
    alert('Application submitted successfully!');
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
    padding: '20px'
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(30, 64, 175, 0.1)',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    padding: '30px',
    textAlign: 'center'
  };

  const progressStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  };

  const stepIndicatorStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
    marginBottom: '20px'
  };

  const stepStyle = (stepNumber: number): React.CSSProperties => ({
    padding: '12px 8px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '2px solid',
    borderColor: stepNumber === currentStep ? '#3b82f6' : stepNumber < currentStep ? '#10b981' : '#e5e7eb',
    backgroundColor: stepNumber === currentStep ? '#dbeafe' : stepNumber < currentStep ? '#d1fae5' : '#f9fafb',
    color: stepNumber === currentStep ? '#1e40af' : stepNumber < currentStep ? '#065f46' : '#6b7280',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
  });

  const contentStyle: React.CSSProperties = {
    padding: '30px'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.2s',
    outline: 'none'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#374151'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  };

  const buttonStyle = (variant: 'primary' | 'secondary' | 'success'): React.CSSProperties => ({
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 
      variant === 'primary' ? '#3b82f6' :
      variant === 'success' ? '#10b981' : '#6b7280',
    color: 'white'
  });

  const renderPersonalDetails = () => (
    <div>
      <h2 style={{ color: '#1e40af', marginBottom: '25px', fontSize: '24px' }}>Personal Details</h2>
      <div style={gridStyle}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            style={inputStyle}
            value={formData.personal_details.fullName}
            onChange={(e) => updateFormData('personal_details', { fullName: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label style={labelStyle}>Date of Birth *</label>
          <input
            type="date"
            style={inputStyle}
            value={formData.personal_details.dateOfBirth}
            onChange={(e) => updateFormData('personal_details', { dateOfBirth: e.target.value })}
          />
        </div>
        <div>
          <label style={labelStyle}>Email ID *</label>
          <input
            type="email"
            style={inputStyle}
            value={formData.personal_details.email}
            onChange={(e) => updateFormData('personal_details', { email: e.target.value })}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label style={labelStyle}>Mobile Number *</label>
          <input
            style={inputStyle}
            value={formData.personal_details.mobile}
            onChange={(e) => updateFormData('personal_details', { mobile: e.target.value })}
            placeholder="10-digit mobile number"
            maxLength={10}
          />
        </div>
        <div>
          <label style={labelStyle}>Aadhaar Number *</label>
          <input
            style={inputStyle}
            value={formData.personal_details.aadhaar}
            onChange={(e) => updateFormData('personal_details', { aadhaar: e.target.value })}
            placeholder="12-digit Aadhaar number"
            maxLength={12}
          />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Gender *</label>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          {['male', 'female', 'other'].map(gender => (
            <label key={gender} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.personal_details.gender === gender}
                onChange={(e) => updateFormData('personal_details', { gender: e.target.value })}
                style={{ marginRight: '8px' }}
              />
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div>
      <h2 style={{ color: '#1e40af', marginBottom: '25px', fontSize: '24px' }}>Address Information</h2>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Permanent Address *</label>
        <textarea
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          value={formData.address_info.permanentAddress}
          onChange={(e) => updateFormData('address_info', { permanentAddress: e.target.value })}
          placeholder="Enter your complete permanent address"
        />
      </div>
      <div style={gridStyle}>
        <div>
          <label style={labelStyle}>State *</label>
          <select
            style={inputStyle}
            value={formData.address_info.state}
            onChange={(e) => updateFormData('address_info', { state: e.target.value })}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>District *</label>
          <select
            style={inputStyle}
            value={formData.address_info.district}
            onChange={(e) => updateFormData('address_info', { district: e.target.value })}
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Pincode *</label>
          <input
            style={inputStyle}
            value={formData.address_info.pincode}
            onChange={(e) => updateFormData('address_info', { pincode: e.target.value })}
            placeholder="6-digit pincode"
            maxLength={6}
          />
        </div>
      </div>
    </div>
  );

  const renderCommunityInfo = () => (
    <div>
      <h2 style={{ color: '#1e40af', marginBottom: '25px', fontSize: '24px' }}>Community & Category</h2>
      <div style={gridStyle}>
        <div>
          <label style={labelStyle}>Community *</label>
          <select
            style={inputStyle}
            value={formData.community_info.community}
            onChange={(e) => updateFormData('community_info', { community: e.target.value })}
          >
            <option value="">Select Community</option>
            {communities.map(community => (
              <option key={community} value={community}>{community}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Caste Name *</label>
          <input
            style={inputStyle}
            value={formData.community_info.casteName}
            onChange={(e) => updateFormData('community_info', { casteName: e.target.value })}
            placeholder="Enter your caste name"
          />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Upload Community Certificate *</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload('community_info', 'communityFile', e.target.files?.[0] || null)}
          style={{ ...inputStyle, padding: '8px' }}
        />
        {formData.community_info.communityFile && (
          <p style={{ marginTop: '8px', color: '#10b981' }}>
            ✓ {formData.community_info.communityFile.name}
          </p>
        )}
      </div>

      <div>
        <label style={labelStyle}>Special Categories (if applicable)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
          {specialCategories.map(category => (
            <label key={category} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.community_info.specialCategories.includes(category)}
                onChange={(e) => handleMultiSelect('community_info', 'specialCategories', category, e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAcademicDetails = () => (
    <div>
      <h2 style={{ color: '#1e40af', marginBottom: '25px', fontSize: '24px' }}>Academic Details</h2>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '15px' }}>10th Standard Details</h3>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Marksheet Number *</label>
            <input
              style={inputStyle}
              value={formData.academic_details.tenth.marksheetNumber}
              onChange={(e) => updateFormData('academic_details', { 
                tenth: { ...formData.academic_details.tenth, marksheetNumber: e.target.value }
              })}
              placeholder="Enter 10th marksheet number"
            />
          </div>
          <div>
            <label style={labelStyle}>School Name *</label>
            <input
              style={inputStyle}
              value={formData.academic_details.tenth.school}
              onChange={(e) => updateFormData('academic_details', { 
                tenth: { ...formData.academic_details.tenth, school: e.target.value }
              })}
              placeholder="Enter school name"
            />
          </div>
          <div>
            <label style={labelStyle}>Board *</label>
            <select
              style={inputStyle}
              value={formData.academic_details.tenth.board}
              onChange={(e) => updateFormData('academic_details', { 
                tenth: { ...formData.academic_details.tenth, board: e.target.value }
              })}
            >
              <option value="">Select Board</option>
              {boards.map(board => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Year of Passing *</label>
            <select
              style={inputStyle}
              value={formData.academic_details.tenth.year}
              onChange={(e) => updateFormData('academic_details', { 
                tenth: { ...formData.academic_details.tenth, year: e.target.value }
              })}
            >
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '15px' }}>12th Standard Details</h3>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Marksheet Number *</label>
            <input
              style={inputStyle}
              value={formData.academic_details.twelfth.marksheetNumber}
              onChange={(e) => updateFormData('academic_details', { 
                twelfth: { ...formData.academic_details.twelfth, marksheetNumber: e.target.value }
              })}
              placeholder="Enter 12th marksheet number"
            />
          </div>
          <div>
            <label style={labelStyle}>School Name *</label>
            <input
              style={inputStyle}
              value={formData.academic_details.twelfth.school}
              onChange={(e) => updateFormData('academic_details', { 
                twelfth: { ...formData.academic_details.twelfth, school: e.target.value }
              })}
              placeholder="Enter school name"
            />
          </div>
          <div>
            <label style={labelStyle}>Board *</label>
            <select
              style={inputStyle}
              value={formData.academic_details.twelfth.board}
              onChange={(e) => updateFormData('academic_details', { 
                twelfth: { ...formData.academic_details.twelfth, board: e.target.value }
              })}
            >
              <option value="">Select Board</option>
              {boards.map(board => (
                <option key={board} value={board}>{board}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Year of Passing *</label>
            <select
              style={inputStyle}
              value={formData.academic_details.twelfth.year}
              onChange={(e) => updateFormData('academic_details', { 
                twelfth: { ...formData.academic_details.twelfth, year: e.target.value }
              })}
            >
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Upload 10th & 12th Marksheets *</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          onChange={(e) => handleFileUpload('academic_details', 'marksheetFiles', Array.from(e.target.files || []))}
          style={{ ...inputStyle, padding: '8px' }}
        />
        {formData.academic_details.marksheetFiles.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {formData.academic_details.marksheetFiles.map((file, index) => (
              <p key={index} style={{ color: '#10b981', margin: '4px 0' }}>
                ✓ {file.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMarksDetails = () => (
    <div>
      <h2 style={{ color: '#1e40af', marginBottom: '25px', fontSize: '24px' }}>Marks & Cutoff</h2>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '15px' }}>Subject Marks (12th Standard)</h3>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Mathematics *</label>
            <input
              type="number"
              style={inputStyle}
              value={formData.marks.maths}
              onChange={(e) => updateFormData('marks', { maths: e.target.value })}
              placeholder="Enter marks out of 100"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label style={labelStyle}>Physics *</label>
            <input
              type="number"
              style={inputStyle}
              value={formData.marks.physics}
              onChange={(e) => updateFormData('marks', { physics: e.target.value })}
              placeholder="Enter marks out of 100"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label style={labelStyle}>Chemistry *</label>
            <input
              type="number"
              style={inputStyle}
              value={formData.marks.chemistry}
              onChange={(e) => updateFormData('marks', { chemistry: e.target.value })}
              placeholder="Enter marks out of 100"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '15px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
          <div>
            <strong style={{ color: '#1e40af' }}>TNEA Cutoff Mark: {formData.marks.cutoff || '0.00'}</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              Formula: (Maths + Physics + Chemistry) ÷ 3
            </p>
          </div>
          <button
            onClick={calculateCutoff}
            style={{ ...buttonStyle('primary'), padding: '8px 16px', fontSize: '14px' }}
          >
            🧮 Calculate
          </button>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Upload Combined Marksheet (12th Standard) *</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload('marks', 'combinedMarksheetFile', e.target.files?.[0] || null)}
          style={{ ...inputStyle, padding: '8px' }}
        />
        {formData.marks.combinedMarksheetFile && (
          <p style={{ marginTop: '8px', color: '#10b981' }}>
            ✓ {formData.marks.combinedMarksheetFile.name}
          </p>
        )}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div>
      <h2 style={{ color: '#1e40af', marginBottom: '25px', fontSize: '24px' }}>College Preferences</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <label style={labelStyle}>Preferred Colleges * (Select multiple)</label>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '2px solid #e5e7eb', borderRadius: '6px', padding: '10px' }}>
          {colleges.map(college => (
            <label key={college} style={{ display: 'flex', alignItems: 'center', margin: '8px 0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.preferences.colleges.includes(college)}
                onChange={(e) => handleMultiSelect('preferences', 'colleges', college, e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              {college}
            </label>
          ))}
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
          Selected: {formData.preferences.colleges.length}
        </p>
      </div>

      <div>
        <label style={labelStyle}>Preferred Branches * (Select multiple)</label>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '2px solid #e5e7eb', borderRadius: '6px', padding: '10px' }}>
          {branches.map(branch => (
            <label key={branch} style={{ display: 'flex', alignItems: 'center', margin: '8px 0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.preferences.branches.includes(branch)}
                onChange={(e) => handleMultiSelect('preferences', 'branches', branch, e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              {branch}
            </label>
          ))}
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
          Selected: {formData.preferences.branches.length}
        </p>
      </div>
    </div>
  );

  const renderDeclaration = () => (
    <div>
      <h2 style={{ color: '#1e40af', marginBottom: '25px', fontSize: '24px' }}>Declaration & Submit</h2>
      
      <div style={{ padding: '20px', backgroundColor: '#fef7cd', border: '1px solid #f59e0b', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ color: '#92400e', marginBottom: '15px' }}>DECLARATION BY THE CANDIDATE</h3>
        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#78350f' }}>
          <p>I hereby declare that:</p>
          <ol style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li>All the information provided by me in this application form is true, complete and correct to the best of my knowledge and belief.</li>
            <li>I understand that any false information or suppression of material facts will disqualify my candidature for admission.</li>
            <li>I have read and understood all the rules, regulations, and guidelines for TNEA admissions as published by Anna University.</li>
            <li>I agree to abide by all the terms and conditions set forth by the admission authorities.</li>
            <li>I understand that admission is subject to verification of original documents and meeting the eligibility criteria.</li>
          </ol>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.declaration.agreed}
            onChange={(e) => updateFormData('declaration', { agreed: e.target.checked })}
            style={{ marginRight: '10px', marginTop: '2px' }}
          />
          <span style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <span style={{ color: '#dc2626' }}>*</span> I have read and understood the above declaration. 
            I agree to all the terms and conditions mentioned above and declare that all the information 
            provided is true and accurate.
          </span>
        </label>
      </div>

      <div>
        <label style={labelStyle}>Upload Your Signature (Optional)</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload('declaration', 'signatureFile', e.target.files?.[0] || null)}
          style={{ ...inputStyle, padding: '8px' }}
        />
        {formData.declaration.signatureFile && (
          <p style={{ marginTop: '8px', color: '#10b981' }}>
            ✓ {formData.declaration.signatureFile.name}
          </p>
        )}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div>
      <h2 style={{ color: '#1e40af', marginBottom: '25px', fontSize: '24px' }}>Preview & Submit</h2>
      
      <div style={{ backgroundColor: '#dbeafe', padding: '20px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '10px' }}>Application Summary</h3>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Please review all information below before submitting your application.
        </p>
      </div>

      {[
        { title: 'Personal Details', data: formData.personal_details, step: 1 },
        { title: 'Address Information', data: formData.address_info, step: 2 },
        { title: 'Community & Category', data: formData.community_info, step: 3 },
        { title: 'Academic Details', data: formData.academic_details, step: 4 },
        { title: 'Marks & Cutoff', data: formData.marks, step: 5 },
        { title: 'Preferences', data: formData.preferences, step: 6 },
        { title: 'Declaration', data: formData.declaration, step: 7 }
      ].map(section => (
        <div key={section.title} style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#1e40af', margin: 0 }}>{section.title}</h3>
            <button
              onClick={() => setCurrentStep(section.step)}
              style={{ 
                ...buttonStyle('secondary'), 
                padding: '6px 12px', 
                fontSize: '12px',
                backgroundColor: '#6b7280'
              }}
            >
              ✏️ Edit
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {Object.entries(section.data).map(([key, value]) => (
              <div key={key}>
                <strong style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '14px' }}>
                  {Array.isArray(value) ? value.join(', ') || 'None selected' :
                   typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                   value instanceof File ? value.name :
                   typeof value === 'object' ? JSON.stringify(value) :
                   value || 'Not provided'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ 
        backgroundColor: '#d1fae5', 
        border: '2px solid #10b981', 
        borderRadius: '8px', 
        padding: '25px', 
        textAlign: 'center' 
      }}>
        <h3 style={{ color: '#065f46', marginBottom: '15px' }}>Ready to Submit?</h3>
        <p style={{ color: '#047857', marginBottom: '20px' }}>
          By clicking submit, you confirm that all information provided is accurate and complete.
        </p>
        <button
          onClick={handleSubmit}
          style={{ 
            ...buttonStyle('success'), 
            fontSize: '18px', 
            padding: '15px 30px',
            backgroundColor: '#10b981'
          }}
        >
          🚀 Submit Application
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalDetails();
      case 2: return renderAddressInfo();
      case 3: return renderCommunityInfo();
      case 4: return renderAcademicDetails();
      case 5: return renderMarksDetails();
      case 6: return renderPreferences();
      case 7: return renderDeclaration();
      case 8: return renderPreview();
      default: return null;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            🎓 Tamil Nadu Engineering Admissions (TNEA)
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
            Student Registration Form 2024-25
          </p>
        </div>

        {/* Progress */}
        <div style={progressStyle}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Progress: {Math.round((currentStep / 8) * 100)}% Complete
            </div>
            <div style={{ 
              height: '6px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                backgroundColor: '#3b82f6',
                width: `${(currentStep / 8) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          
          <div style={stepIndicatorStyle}>
            {steps.map(step => (
              <div
                key={step.id}
                style={stepStyle(step.id)}
                onClick={() => setCurrentStep(step.id)}
              >
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>{step.icon}</div>
                <div>{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div style={{ 
          padding: '20px 30px', 
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              ...buttonStyle('secondary'),
              opacity: currentStep === 1 ? 0.5 : 1,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>

          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Step {currentStep} of 8
          </div>

          {currentStep === 8 ? null : (
            <button onClick={handleNext} style={buttonStyle('primary')}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TNEARegistrationForm;