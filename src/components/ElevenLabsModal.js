import React, { useState, useEffect } from "react";
import "./ElevenLabsModal.css";
import { uploadToKnowledgeBase } from '../services/elevenlabsService';
import { useConversation } from "@11labs/react";

const ElevenLabsModal = ({ onClose }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isConfigValid, setIsConfigValid] = useState(false);

  const conversation = useConversation({
    onError: (error) => {
      setErrorMessage(typeof error === "string" ? error : error.message);
      console.error("Error:", error);
    },
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setErrorMessage("Microphone access denied");
      }
    };
    requestMicPermission();
  }, []);

  useEffect(() => {
    const agentId = process.env.REACT_APP_ELEVENLABS_AGENT_ID;
    const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
    
    console.log('Agent ID:', agentId); // For debugging
    console.log('API Key exists:', !!apiKey); // For debugging, don't log the actual key
    
    if (!apiKey || !agentId) {
      setErrorMessage("Missing ElevenLabs configuration. Please check your environment variables.");
      setIsConfigValid(false);
    } else {
      setIsConfigValid(true);
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setUploadStatus(null);
      setErrorMessage("");
    } else {
      setErrorMessage("Only PDF files are allowed.");
    }
  };

  const handleStartLearning = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setUploadStatus("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      // First request: Upload document
      console.log("Uploading to ElevenLabs...");
      const uploadResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${process.env.REACT_APP_ELEVENLABS_AGENT_ID}/add-to-knowledge-base`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorData}`);
      }

      const uploadData = await uploadResponse.json();
      const documentId = uploadData.id;
      console.log("Document uploaded successfully, ID:", documentId);

      // Second request: Update agent
      const updateResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${process.env.REACT_APP_ELEVENLABS_AGENT_ID}`,
        {
          method: 'PATCH',
          headers: {
            'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversation_config: {
              agent: {
                prompt: {
                  knowledge_base: [
                    {
                      type: "file",
                      name: uploadedFile.name,
                      id: documentId
                    }
                  ]
                }
              }
            }
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("Agent update failed:", errorData);
        throw new Error(`Agent update failed: ${JSON.stringify(errorData)}`);
      }

      const updateResult = await updateResponse.json();
      console.log("Agent updated successfully:", updateResult);
      
      setUploadStatus("success");
    } catch (error) {
      console.error('Upload Error:', error);
      setUploadStatus("error");
      setErrorMessage(error.message || "Failed to process document");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartConversation = async () => {
    try {
      if (!isConfigValid) {
        throw new Error("ElevenLabs configuration is not valid");
      }

      setErrorMessage("Connecting...");
      
      await conversation.startSession({
        agentId: process.env.REACT_APP_ELEVENLABS_AGENT_ID,
      });
      
      setErrorMessage("");
    } catch (error) {
      console.error("Connection error:", error);
      setErrorMessage(
        `Failed to start conversation: ${error.message}`
      );
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      setErrorMessage("Failed to end conversation");
    }
  };

  useEffect(() => {
    if (status === "error") {
      setErrorMessage("Connection lost. Please try reconnecting.");
    }
  }, [status]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>What Happens to My Data</h2>
        <p>Orion can explain the privacy policies or terms and conditions that you find confusing!</p>
        
        <div className="upload-section">
          {!uploadedFile ? (
            <label htmlFor="file-upload" className="upload-button">
              <span>Upload PDF</span>
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          ) : (
            <div className="uploaded-file-section">
              <p>{uploadedFile.name}</p>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setUploadStatus(null);
                  setErrorMessage("");
                }}
              >
                Change File
              </button>
              {uploadStatus === "success" ? (
                <p className="success">Successfully uploaded!</p>
              ) : (
                <>
                  {uploadStatus === "error" && <p className="error">{errorMessage}</p>}
                  <button
                    className={isProcessing ? "loading" : ""}
                    onClick={handleStartLearning}
                    disabled={isProcessing}
                  >
                    Upload to Knowledge Base
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Voice Chat Section */}
        <div className="voice-chat-section">
          {!isConfigValid && (
            <p className="error-message">
              ElevenLabs configuration is missing. Please check your environment variables.
            </p>
          )}
          
          {/* Status Indicators */}
          {status === "connected" && (
            <p className="status-text">
              {isSpeaking ? "Agent is speaking..." : "Listening..."}
            </p>
          )}
          {!hasPermission && (
            <p className="permission-text">
              Please allow microphone access to use voice chat
            </p>
          )}

          {/* Voice Controls */}
          <div className="voice-controls">
            {status === "connected" ? (
              <button
                onClick={handleEndConversation}
                className="voice-button end"
              >
                End Conversation
              </button>
            ) : (
              <button
                onClick={handleStartConversation}
                disabled={!hasPermission || !isConfigValid}
                className="voice-button start"
              >
                Start Conversation
              </button>
            )}
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ElevenLabsModal;
