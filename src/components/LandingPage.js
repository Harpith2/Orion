import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logo from './logo.png';
import './LandingPage.css';
import { jwtDecode } from 'jwt-decode';

const LandingPage = () => {
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const navigate = useNavigate();

  const handleCallbackResponse = (response) => {
    console.log("Encoded JWT Token: " + response.credential);
    const userObject = jwtDecode(response.credential); // Decode the JWT token to get user data
    console.log("Decoded User:", userObject);

    // Extract the first name from the full name
    const fullName = userObject.name || "User";
    const firstName = fullName.split(" ")[0]; // Get only the first name

    // Store the JWT token and user info in localStorage
    localStorage.setItem('token', response.credential);
    localStorage.setItem('user', JSON.stringify({ 
        firstName: firstName,  // Store only the first name
        
    }));

    console.log(`User ${firstName} signed in successfully.`);

    // Redirect to the main interface after successful sign-in
    navigate('/chat');
};



  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log('Google script loaded successfully');
        setGoogleScriptLoaded(true);  // Set state to true when the script is loaded
      };

      script.onerror = () => {
        console.error('Failed to load Google script');
      };
    };

    loadGoogleScript();

    // Cleanup the script when the component unmounts
    return () => {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize Google Sign-In only after the script has loaded and google object is available
    if (googleScriptLoaded && window.google) {
      console.log('Initializing Google Sign-In...');

      // Ensure google.accounts.id is available
      if (window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: "143735753214-s38co5b5er3vvprd12urd20idekghvgp.apps.googleusercontent.com",
          callback: handleCallbackResponse
        });

        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large" }
        );
      } else {
        console.error('google.accounts.id is not available');
      }
    }
  }, [googleScriptLoaded]);

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-logo">
          <img src={logo} alt="Logo" />
        </div>
        
        <div id="signInDiv"></div>
      </div>
    </div>
  );
};

export default LandingPage;
