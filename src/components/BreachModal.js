import React, { useState } from 'react';
import axios from 'axios';
import './BreachModal.css';

const BreachModal = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isSafe, setIsSafe] = useState(null);
  const [emailBreached, setEmailBreached] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const checkUrlSafety = async () => {
    if (!url) return;

    setLoading(true);
    setIsSafe(null);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5001/check-url', { url });

      if (response.data.matches && response.data.matches.length > 0) {
        setIsSafe(false); // URL is unsafe
      } else {
        setIsSafe(true); // URL is safe
      }
    } catch (err) {
      setError('Error checking URL safety. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkEmailBreaches = async () => {
    if (!email) return;

    setLoading(true);
    setEmailBreached(null);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5001/check-email/${email}`);

      if (response.data && response.data.length > 0) {
        setEmailBreached(true); // Email is breached
      } else {
        setEmailBreached(false); // No breach
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setEmailBreached(false); // No breach found
      } else {
        setError('Error checking email breaches. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="Bmodal-overlay">
        <div className="Bmodal">
          <h2>Check for malicious links or breached emails!</h2>

          <input
            type="url"
            placeholder="Enter URL to check"
            value={url}
            onChange={handleUrlChange}
            required
          />
          <button onClick={checkUrlSafety} disabled={loading}>
            {loading ? 'Checking...' : 'Check URL'}
          </button>

          {isSafe !== null && (
            <div className={`Bresult ${isSafe ? 'safe' : 'unsafe'}`}>
              {isSafe ? 'Good News - This URL is safe!' : 'The URL is unsafe.'}
            </div>
          )}

          <input
            type="email"
            placeholder="Enter Email to check"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <button onClick={checkEmailBreaches} disabled={loading}>
            {loading ? 'Checking...' : 'Check Email'}
          </button>

          {emailBreached !== null && (
            <div className={`Bresult ${emailBreached ? 'unsafe' : 'safe'}`}>
              {emailBreached ? 'Alert! This email has been breached.' : 'Great! This email has not been breached.'}
            </div>
          )}

          {error && <div className="Berror">{error}</div>}

          <button onClick={onClose} className="Bclose-btn">Close</button>
        </div>
      </div>
    )
  );
};

export default BreachModal;
