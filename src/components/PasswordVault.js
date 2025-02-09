import React, { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import './PasswordVault.css';

const PasswordVault = ({ onClose }) => {
 const [masterPassword, setMasterPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [site, setSite] = useState('');
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [passwords, setPasswords] = useState([]);
 const [isLocked, setIsLocked] = useState(true);
 const [isFirstTime, setIsFirstTime] = useState(true);
 const [error, setError] = useState('');
 const [editingId, setEditingId] = useState(null);
 const [editForm, setEditForm] = useState({
   site: '',
   username: '',
   password: ''
 });

 const modalRef = useRef(null);

  // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

 // Check if vault has been initialized
 useEffect(() => {
   const hasInitialized = localStorage.getItem('vaultInitialized');
   if (hasInitialized) {
     setIsFirstTime(false);
   }

   const storedPasswords = localStorage.getItem('encryptedPasswords');
   if (storedPasswords) {
     setPasswords(JSON.parse(storedPasswords));
   }
 }, []);

 const encryptData = (data, key) => {
   return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
 };

 const decryptData = (encryptedData, key) => {
   try {
     const bytes = CryptoJS.AES.decrypt(encryptedData, key);
     return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
   } catch (error) {
     return null;
   }
 };

 const handleFirstTimeSetup = (e) => {
   e.preventDefault();
   if (!masterPassword || !confirmPassword) {
     setError('Please fill in both password fields');
     return;
   }

   if (masterPassword.length < 8) {
     setError('Master password must be at least 8 characters long');
     return;
   }

   if (masterPassword !== confirmPassword) {
     setError('Passwords do not match');
     return;
   }

   // Initialize vault
   localStorage.setItem('vaultInitialized', 'true');
   setIsFirstTime(false);
   setIsLocked(false);
   setError('');

   // Create a test encryption to verify the master password works
   const testData = encryptData({ test: 'data' }, masterPassword);
   localStorage.setItem('testEncryption', testData);
 };

 const handleUnlock = (e) => {
   e.preventDefault();
   if (!masterPassword) {
     setError('Please enter a master password');
     return;
   }
  
   // Verify master password using test encryption
   const testEncryption = localStorage.getItem('testEncryption');
   if (testEncryption) {
     const decrypted = decryptData(testEncryption, masterPassword);
     if (!decrypted) {
       setError('Incorrect master password');
       return;
     }
   }
  
   setIsLocked(false);
   setError('');
 };

 const handleAddPassword = (e) => {
   e.preventDefault();
   if (!site || !username || !password) {
     setError('Please fill in all fields');
     return;
   }
  
   const encrypted = encryptData({ site, username, password }, masterPassword);

   const newPasswordEntry = {
     id: Date.now(),
     data: encrypted
   };

   const updatedPasswords = [...passwords, newPasswordEntry];
   setPasswords(updatedPasswords);
   localStorage.setItem('encryptedPasswords', JSON.stringify(updatedPasswords));

   // Clear form
   setSite('');
   setUsername('');
   setPassword('');
   setError('');
 };

 const handleEdit = (id) => {
    const passwordEntry = passwords.find(pw => pw.id === id);
    const decryptedData = decryptData(passwordEntry.data, masterPassword);
    
    // Store decrypted data in edit form
    setEditForm({
      site: decryptedData.site,
      username: decryptedData.username,
      password: decryptedData.password
    });
    setEditingId(id);
  };

 const handleDelete = (id) => {
   const updatedPasswords = passwords.filter(pw => pw.id !== id);
   setPasswords(updatedPasswords);
   localStorage.setItem('encryptedPasswords', JSON.stringify(updatedPasswords));
 };

 const handleExitVault = () => {
   setIsLocked(true);
   setMasterPassword('');
   setConfirmPassword('');
   setError('');
 };

 const handleReset = () => {
   const confirmReset = window.confirm(
     'WARNING: This will delete all stored passwords and reset the vault. This action cannot be undone. Are you sure?'
   );
  
   if (confirmReset) {
     // Clear all localStorage data
     localStorage.removeItem('vaultInitialized');
     localStorage.removeItem('encryptedPasswords');
     localStorage.removeItem('testEncryption');
    
     // Reset all state
     setPasswords([]);
     setMasterPassword('');
     setConfirmPassword('');
     setSite('');
     setUsername('');
     setPassword('');
     setIsFirstTime(true);
     setIsLocked(true);
     setError('');
   }
 };

 const getPasswordMetrics = () => {
   const metrics = {
     totalPasswords: 0,
     shortPasswords: 0,
     weakPasswords: 0,
     averageLength: 0
   };

   passwords.forEach(pw => {
     const decryptedData = decryptData(pw.data, masterPassword);
     if (decryptedData) {
       metrics.totalPasswords++;
       if (decryptedData.password.length < 8) {
         metrics.shortPasswords++;
       }
       // Check for weak passwords (no numbers or special characters)
       if (!/[0-9]/.test(decryptedData.password) || !/[^A-Za-z0-9]/.test(decryptedData.password)) {
         metrics.weakPasswords++;
       }
       metrics.averageLength += decryptedData.password.length;
     }
   });

   if (metrics.totalPasswords > 0) {
     metrics.averageLength = Math.round(metrics.averageLength / metrics.totalPasswords);
   }

   return metrics;
 };

 // Render first-time setup or unlock screen
 if (isFirstTime) {
    return (
      <div className="modal-overlay" ref={modalRef}>
        <div className="modal-content" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>×</button>
          <h1 className="header">Vault</h1>
          <p className="setup-text">
            Please set up your master password. This password will be used to encrypt and decrypt all your stored passwords. 
            Make sure to remember it!
          </p>
          <form onSubmit={handleFirstTimeSetup} className="form">
            <input
              type="password"
              placeholder="Create master password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="Confirm master password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" className="button">Set Master Password</button>
          </form>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="modal-overlay" ref={modalRef}>
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>×</button>
          <h1 className="header">Vault</h1>
          <form onSubmit={handleUnlock} className="form">
            <input
              type="password"
              placeholder="Enter master password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="input"
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" className="button">Unlock Vault</button>
            <button
              type="button"
              onClick={handleReset}
              className="button reset-button"
            >
              Reset Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="header">
          <h1>Orion Vault</h1>
          <button onClick={handleExitVault} className="exit-button">
            Logout
          </button>
        </div>

        <div className="dashboard">
          <h2 className="dashboard-title">Your Security Dashboard</h2>
          {passwords.length === 0 ? (
            <div className="no-passwords">No passwords stored in vault!</div>
          ) : (
            <>
              {(() => {
                const metrics = getPasswordMetrics();
                return (
                  <>
                    {metrics.shortPasswords > 0 && (
                      <div className="metric metric-warning">
                        <p className="metric-text">
                          ⚠️ {metrics.shortPasswords} password{metrics.shortPasswords !== 1 ? 's are' : ' is'} shorter than 8 characters. 
                          Change it for better security!
                        </p>
                      </div>
                    )}
                    {metrics.weakPasswords > 0 && (
                      <div className="metric metric-warning">
                        <p className="metric-text">
                          ⚠️ {metrics.weakPasswords} password{metrics.weakPasswords !== 1 ? 's' : ''} could be stronger! 
                          Add numbers and special characters.
                        </p>
                      </div>
                    )}
                    <div className="metric metric-good">
                      <p className="metric-text">
                        📊 Total passwords stored: {metrics.totalPasswords}
                      </p>
                    </div>
                  
                  </>
                );
              })()}
            </>
          )}
        </div>

        <form onSubmit={handleAddPassword} className="form">
          <input
            type="text"
            placeholder="Site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button">Add Password</button>
        </form>

        <ul className="password-list">
          {passwords.map(pw => {
            const decryptedData = decryptData(pw.data, masterPassword);
            if (!decryptedData) return null;
            return (
              <li key={pw.id} className="password-item">
              {editingId === pw.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.site}
                    onChange={(e) => setEditForm({...editForm, site: e.target.value})}
                    className="input"
                  />
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="input"
                  />
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    className="input"
                  />
                  <div className="button-group">
                    <button
                      onClick={() => {
                        const encrypted = encryptData(editForm, masterPassword);
                        const updatedPasswords = passwords.map(p => 
                          p.id === pw.id ? { ...p, data: encrypted } : p
                        );
                        setPasswords(updatedPasswords);
                        localStorage.setItem('encryptedPasswords', JSON.stringify(updatedPasswords));
                        setEditingId(null);
                      }}
                      className="button-edit-button"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="button-edit-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="password-details">
                    <strong className="site-name">{decryptedData.site}</strong>
                    <span className="credential-text">Username: {decryptedData.username}</span>
                    <span className="credential-text">Password: {decryptedData.password}</span>
                  </div>
                  <div className="button-group">
                    <button
                      onClick={() => handleEdit(pw.id)}
                      className="button-edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pw.id)}
                      className="delete-button"
                    >
                
                    </button>
                  </div>
                </>
              )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PasswordVault;