import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './VerificationPage.css';

const VerificationPage = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [isAccountValid, setIsAccountValid] = useState(false);
  const [image, setImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [error, setError] = useState('');

  // Function to verify account number with backend
  const handleAccountVerification = async () => {
    setError('');  // Clear previous error messages

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
        setError('');  // Clear error messages on success
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
    setImage(e.target.files[0]);
  };

  // Handle verification
//   const handleVerify = async (storedSignature, verifyingSignature) => {
//     const formData = new FormData();
//     formData.append("stored_signature", storedSignature);
//     formData.append("verifying_signature", verifyingSignature);

//     try {
//         const response = await fetch("http://localhost:3000/verify", {
//             method: "POST",
//             body: formData,
//         });
//         const data = await response.json();
//         alert(`Result: ${data.result}\nSimilarity: ${data.similarity}`);
//     } catch (error) {
//         console.error("Error verifying signature:", error);
//     }
// };
const handleVerify = async () => {
  const formData = new FormData();
  formData.append("account_number", accountNumber);
  // formData.append("stored_signature", image); // Use the selected image file
  formData.append("verifying_signature", image); // Assuming same image for demo

  try {
      const response = await fetch("http://127.0.0.1:5000/api/signature/verify", {
          method: "POST",
          body: formData,
      });
      const data = await response.json();
      alert(`Result: ${data.result}\nSimilarity: ${data.similarity}`);
  } catch (error) {
      console.log("Error verifying signature:", error);
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

         
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;