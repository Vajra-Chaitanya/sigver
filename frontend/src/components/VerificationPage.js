import React, { useState } from 'react';
import './VerificationPage.css';

const VerificationPage = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [image, setImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // State to store result
  const [similarity, setSimilarity] = useState(null); // State to store similarity score
  const [uploadedSignature, setUploadedSignature] = useState(null); // State for uploaded signature
  const [referenceSignature, setReferenceSignature] = useState(null); // State for reference signature

  // Function to verify account number with backend
  const handleAccountVerification = async () => {
    setError(''); // Clear previous error messages

    if (!accountNumber.trim()) {
      setError('Please enter a valid account number.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber }),
      });

      const result = await response.json();

      if (response.status === 200) {
        setIsAccountValid(true);
        setError(''); // Clear error messages on success
        alert(result.message); // Show success message
      } else {
        setIsAccountValid(false);
        setError(result.message || 'Invalid account number.');
      }
    } catch (err) {
      console.error('Error verifying account:', err);
      setError('An error occurred while verifying the account. Please try again later.');
    }
  };

  // Handle signature image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create a preview URL for the uploaded image
    if (file) {
      setUploadedSignature(URL.createObjectURL(file));
    }
  };

  // Handle verification
  const handleVerify = async () => {
    const formData = new FormData();
    formData.append('account_number', accountNumber);
    formData.append('verifying_signature', image); // Use the selected image file

    try {
      const response = await fetch('http://127.0.0.1:5000/api/signature/verify', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      // Update state with verification result
      setResult(data.result);
      setSimilarity(data.similarity);
      setReferenceSignature(data.referenceSignature); // Assuming this is a URL or base64 string
    } catch (error) {
      console.log('Error verifying signature:', error);
    }
  };

  return (
    <div>
      <div className="verification-container">
        <div className="verification-box">
          <h1 className="verification-title">VERIFICATION</h1>
          <p className="verification-message">
            Please provide your account details and signature image for verification.
          </p>

          {/* Account Number Input */}
          <label className="input-label" htmlFor="account-number">
            Enter your account number:
          </label>
          <input
            type="text"
            id="account-number"
            className="input-field"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <button
            className="go-home-btn"
            onClick={handleAccountVerification}
            disabled={!accountNumber.trim()}
          >
            Verify Account
          </button>
          {error && <p className="error-message">{error}</p>}

          {/* Image Upload Field */}
          <label className="input-label" htmlFor="signature-image">
            Upload your signature:
          </label>
          <input
            type="file"
            id="signature-image"
            className="input-field"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={!isAccountValid}
          />

          {/* Verify Button */}
          <button
            className="go-home-btn"
            onClick={handleVerify}
            disabled={!isAccountValid || !image}
          >
            Verify
          </button>

          {/* Display verification result */}
          {result && (
            <div className="verification-result">
              <h3>Verification Result:</h3>
              <p>{result}</p>
              {similarity !== null && <p>Similarity: {similarity*100}%</p>}

              <div className="images-container">
                <div className="image-box">
                  <h4>Uploaded Signature</h4>
                  {uploadedSignature ? (
                    <img src={uploadedSignature} alt="Uploaded Signature" />
                  ) : (
                    <p>No uploaded signature available.</p>
                  )}
                </div>
                <div className="image-box">
                  <h4>Reference Signature</h4>
                  {referenceSignature ? (
                    <img src={referenceSignature} alt="Reference Signature" />
                  ) : (
                    <p>No reference signature available.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
