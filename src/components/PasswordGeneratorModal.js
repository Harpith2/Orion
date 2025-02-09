import React, { useState } from "react";
import axios from "axios";
import "./PasswordGeneratorModal.css";

const PasswordGeneratorModal = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  const [detail, setDetail] = useState("");
  const [number, setNumber] = useState("");
  const [passwords, setPasswords] = useState([]);
  
  const API_KEY = "key";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      extractImageData(file);
    }
  };

  const extractImageData = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1];
      
      try {
        const response = await axios.post(
          `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
          {
            requests: [
              {
                image: { content: base64Image },
                features: [
                  { type: "LABEL_DETECTION", maxResults: 5 },
                  { type: "LANDMARK_DETECTION", maxResults: 3 },
                ],
              },
            ],
          }
        );

        const extractedLabels = response.data.responses[0].labelAnnotations?.map(
          (label) => label.description
        ) || [];
        setLabels(extractedLabels);

        const extractedLandmarks = response.data.responses[0].landmarkAnnotations?.map(
          (landmark) => landmark.description
        ) || [];
        setLandmarks(extractedLandmarks);
      } catch (error) {
        console.error("Error extracting image data:", error);
      }
    };
  };

  const handleDetailChange = (e) => {
    setDetail(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNumber(e.target.value);
  };

  const limitAtSymbol = (password) => {
    return password.replace(/@/g, (match, offset) => (offset === password.indexOf("@") ? "@" : ""));
  };

  const generatePassword = () => {
    const labelPart = labels.length > 0 ? labels[0].slice(0, 5).replace(/[aeiouAEIOU]/g, "@") : "image";
    const landmarkPart = landmarks.length > 0 ? landmarks[0].slice(0, 5) : "land";
    const detailPart = detail;
    const numberPart = number;

    const newPasswords = [
      `!${labelPart}${landmarkPart}${detailPart}${numberPart}`,
      `${labelPart}${landmarkPart}${detailPart}${numberPart}!`,
      `!${labelPart}${landmarkPart}${detailPart}${numberPart}!`,
    ].map(limitAtSymbol);

    const updatedPasswords = newPasswords.map((password) =>
      password.length < 8 ? password + "123" : password
    );

    setPasswords(updatedPasswords);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Password Generator</h2>
        <div>
          <label>
            The first photo in your 2025 vision board!
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <div>
          <label>
            A word that is meaningful to you!
            <input type="text" value={detail} onChange={handleDetailChange} />
          </label>
        </div>
        <div>
          <label>
            How much do you like pineapple on a scale of 1 to 100?
            <input type="text" value={number} onChange={handleNumberChange} />
          </label>
        </div>
        <button onClick={generatePassword}>Generate Password</button>
        {passwords.length > 0 && (
          <div>
            <h3>Generated Password Options:</h3>
            <ul>
              {passwords.map((password, index) => (
                <li key={index}>{password}</li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={onClose}>Close</button>

        <div>
          <h3>Tips for Creating a Strong Password:</h3>
          <ul>
            <li>Use at least 12 characters.</li>
            <li>Include uppercase and lowercase letters.</li>
            <li>Include numbers and special characters.</li>
            <li>Avoid common words and predictable sequences.</li>
            <li>Do not reuse passwords across multiple accounts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordGeneratorModal;
