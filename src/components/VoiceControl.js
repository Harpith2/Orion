import React, { useState, useEffect } from 'react';
import { useConversation } from "@11labs/react";
import { getAgentId } from '../services/elevenlabsService';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import './VoiceControl.css';

const VoiceControl = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        console.error("Microphone access denied");
      }
    };
    requestMicPermission();
  }, []);

  const handleVoiceControl = async () => {
    try {
      if (status === "connected") {
        await conversation.endSession();
      } else {
        const agentId = getAgentId();
        if (!agentId) {
          throw new Error("ElevenLabs Agent ID is not configured");
        }
        await conversation.startSession({
          agentId: agentId,
        });
      }
    } catch (error) {
      console.error("Voice control error:", error);
    }
  };

  return (
    <button
      className={`voice-icon ${status === "connected" ? 'active' : ''}`}
      onClick={handleVoiceControl}
      disabled={!hasPermission}
      title={status === "connected" ? "Stop voice chat" : "Start voice chat"}
    >
      {status === "connected" ? <FaMicrophoneSlash /> : <FaMicrophone />}
    </button>
  );
};

export default VoiceControl; 