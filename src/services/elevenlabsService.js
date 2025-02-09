// Get environment variables
const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;
const ELEVENLABS_AGENT_ID = process.env.REACT_APP_ELEVENLABS_AGENT_ID;

// Add error checking for environment variables
if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
  console.error('Missing required environment variables:', {
    hasApiKey: !!ELEVENLABS_API_KEY,
    hasAgentId: !!ELEVENLABS_AGENT_ID
  });
}

export const uploadToKnowledgeBase = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`https://api.elevenlabs.io/v1/knowledge-base/${ELEVENLABS_AGENT_ID}/upload`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading to knowledge base:', error);
    throw error;
  }
};

// Export the agent ID so it can be used in other components
export const getAgentId = () => ELEVENLABS_AGENT_ID;
