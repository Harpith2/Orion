import React, { useState, useEffect, useRef } from 'react';
import { Send, Wrench, BookOpen, MessageSquare, User, Plus, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './MainInterface.css';
import logo from './logo.png';
import PasswordVault from './PasswordVault'; // tool component import
import BreachModal from './BreachModal'; // tool component import
import PasswordGeneratorModal from './PasswordGeneratorModal'; // tool component import
import ElevenLabsModal from './ElevenLabsModal';
import VoiceControl from './VoiceControl';

import image2 from '../components/image2.png';

import image4 from '../components/image4.png';
import image5 from '../components/image5.png';
import image6 from '../components/image6.png';
import image7 from '../components/image7.png';
import image8 from '../components/image8.png';
import image9 from '../components/image9.png';
import image10 from '../components/image10.png';
import image11 from '../components/image11.png';
import image12 from '../components/image12.png';
import image13 from '../components/image13.png';
import image14 from '../components/image14.png';
import image15 from '../components/image15.png';



import vault from '../components/vault.png';
import databreach from '../components/databreach.png';
import privacy from '../components/privacy.png';
import phish from '../components/phish.png';

// SourceItem Component
const SourceItem = ({ source }) => {
  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const getCleanTitle = (title) => {
    return title.replace(/^Source \d+:\s*/i, '');
  };

  const getCleanUrl = (url) => {
    try {
      return url.replace(/^https?:\/\/(www\.)?/i, '');
    } catch {
      return url;
    }
  };

  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className="source-item">
      <div className="source-content">
        <div className="source-title">{getCleanTitle(source.title)}</div>
        <div className="source-url">{getCleanUrl(source.url)}</div>
      </div>
      <div className="source-favicon">
        <img
          src={getFaviconUrl(source.url)}
          alt=""
          className="favicon-image"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </a>
  );
};
const Tools = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  // To control the modal visibility
  const user = JSON.parse(localStorage.getItem('user'));

  // Map tool titles to their background images
  const toolBackgrounds = {
    "Orion Vault": vault,
    "Data Breach Status": databreach,
    "What happens to my data": privacy,
    "Password Generator": phish
  };

  const handleToolClick = (toolName) => {
    setActiveComponent(toolName);
    setIsModalOpen(true);  // Open the modal when a tool is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // Close the modal when the close button is clicked
  };

  const tools = [
    {
      title: "Orion Vault",
      description: "Securely manage and store your passwords",
      action: 'PasswordVault'
    },
    {
      title: "Data Breach Status",
      description: "Check if your personal data has been exposed.",
      action: 'DataBreachStatus'
    },
    {
      title: "What happens to my data",
      description: "I can help explain any privacy policy or T&C",
      action: 'Data Explain'

    },
    {
      title: "Password Generator",
      description: "Create strong passwords that you can remember!",
      action: 'Password Generator'  

    }
  ];

  return (
    <div className="tcontent-section">
      <h2 className="tool-section-header">Good Morning, {user ? user.firstName : 'User'}</h2>
      <h2 className="tsection-header">Your Tools</h2>
      <div className="tools-grid">
        {tools.map((tool, index) => {
          const backgroundImage = toolBackgrounds[tool.title];
          const cardStyle = {
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          };

          return (
            <div
              key={index}
              className="tool-card"
              onClick={() => tool.action && handleToolClick(tool.action)}
              style={cardStyle}
            >
              <div className="tool-card-content">
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
              <div className="card-overlay"></div>
              <div className="tool-card-icon">→</div>
            </div>
          );
        })}
      </div>
      {activeComponent === 'Data Explain' && isModalOpen && (
        <ElevenLabsModal onClose={handleCloseModal} />
      )}
      {activeComponent === 'Password Generator' && isModalOpen && (
        <PasswordGeneratorModal onClose={handleCloseModal} />
      )}
      {/* Conditionally render modals based on activeComponent */}
      {activeComponent === 'PasswordVault' && isModalOpen && (
        <PasswordVault isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
      {activeComponent === 'DataBreachStatus' && (
        <BreachModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};


// Learn Component !!!

const Learn = ({ onSendMessage, setActiveSection }) => {
  

  const tileBackgrounds = {
  "Understand Phishing": image8,
    "Creating Strong Passwords": image2,
    "Two-Factor Authentication": image10,
    "Safe Browsing Habits": image4,
    "Social Media Privacy": image5,
    "Recognizing Scam Calls": image6,
    "Securing Your Email": image7,
    "Avoiding Identity Theft": image8,
    "Wi-Fi Security Basics": image9,
    "How to Spot Fake Apps": image10,
    "Public Wi-Fi Risks": image11,
    "Safe Online Shopping": image12,
    "Privacy Settings on Your Phone": image13,
    "Understanding VPNs": image14,
    "Protecting Personal Data": image15
   
    

  };

  const learningBits = [
    { title: "Understand Phishing", description: "Recognize and avoid phishing scams" },
    { title: "Creating Strong Passwords", description: "Learn how to craft secure passwords" },
    { title: "Two-Factor Authentication", description: "Why 2FA matters and how to enable it" },
    { title: "Safe Browsing Habits", description: "Protect yourself from malicious websites" },
    { title: "Social Media Privacy", description: "Adjust settings to keep your data private" },
    { title: "Recognizing Scam Calls", description: "Identify and avoid phone scams" },
    { title: "Securing Your Email", description: "Prevent email hacking and spoofing" },
    { title: "Avoiding Identity Theft", description: "Steps to protect personal information" },
    { title: "Wi-Fi Security Basics", description: "Keep your home network safe" },
    { title: "How to Spot Fake Apps", description: "Avoid installing malicious applications" },
    { title: "Public Wi-Fi Risks", description: "Stay safe while using public networks" },
    { title: "Safe Online Shopping", description: "Detect fake stores and protect your payments" },
    { title: "Privacy Settings on Your Phone", description: "Control app permissions effectively" },
    { title: "Understanding VPNs", description: "How VPNs enhance your online security" },
    { title: "Protecting Personal Data", description: "Reduce digital footprints and trackability" }
  ];

  const learningPrompts = {
    "Understand Phishing": "Explain in detail how to identify and protect against phishing attacks. Include common signs of phishing emails and best practices for staying safe.",
    "Creating Strong Passwords": "Provide comprehensive guidelines for creating and managing strong passwords. Include best practices and common mistakes to avoid.",
    "Two-Factor Authentication": "Explain what two-factor authentication is, why it's important, and how to set it up on common platforms.",
    "Safe Browsing Habits": "Detail the essential safe browsing practices for protecting against online threats.",
    "Social Media Privacy": "Explain how to optimize privacy settings on social media platforms and protect personal information.",
    "Recognizing Scam Calls": "Provide guidance on identifying and handling potential phone scams and fraudulent calls.",
    "Securing Your Email": "Explain comprehensive email security practices and how to prevent email-based attacks.",
    "Avoiding Identity Theft": "Detail strategies for protecting against identity theft in the digital age.",
    "Wi-Fi Security Basics": "Explain how to secure home Wi-Fi networks and safe practices for using public Wi-Fi.",
    "How to Spot Fake Apps": "Provide guidelines for identifying and avoiding malicious mobile applications.",
    "Public Wi-Fi Risks": "Detail the risks of public Wi-Fi networks and how to protect yourself when using them.",
    "Safe Online Shopping": "Explain best practices for secure online shopping and avoiding fraudulent websites.",
    "Privacy Settings on Your Phone": "Guide through essential privacy settings for mobile devices and app permissions.",
    "Understanding VPNs": "Explain what VPNs are, how they work, and their role in online privacy.",
    "Protecting Personal Data": "Detail comprehensive strategies for protecting personal information online."
  };

  const handleTileClick = (title) => {
    const prompt = learningPrompts[title];
    if (prompt) {
      onSendMessage(prompt);  // This line is correct
     
    }
  };

  return (
    <div className="content-section">
      <div className="learn-grid">
        {learningBits.map((bit, index) => {
          const isRectangle = index % 3 === 2;
          const backgroundImage = tileBackgrounds[bit.title];
          
          const cardStyle = {
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white'
          };
          
          return isRectangle ? (
            <div 
              key={index} 
              className="learn-card-rectangle" 
              style={cardStyle}
              onClick={() => handleTileClick(bit.title)}
            >
              <div className="card-content">
                <h3>{bit.title}</h3>
                <p>{bit.description}</p>
              </div>
              <div className="card-overlay"></div>
            </div>
          ) : (
            <div 
              key={index} 
              className="learn-card-square" 
              style={cardStyle}
              onClick={() => handleTileClick(bit.title)}
            >
              <div className="card-content">
                <h3>{bit.title}</h3>
                <p>{bit.description}</p>
              </div>
              <div className="card-overlay"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
// CSS styles (example for the grid layout)


// Profile Component (Sign-Out Logic)
const Profile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSignOut = () => {
    // Clear Google Auth session if available
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  
    // Clear the JWT token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
  
    // Log the successful sign-out action
    console.log("User has signed out successfully.");
  
    // Redirect to the Sign-In page
    navigate('/');
  };

  return (
    <div className="profile-section">
      <h2 className="profile-section-header">Good Morning, {user ? user.firstName : 'User'}</h2>
      <div className="profile-section-card">
        <div className="profile-section-info">
          <div className="profile-section-avatar"></div>
          <div>
            <h3>{user ? user.firstName : 'User'}</h3>
          </div>
        </div>
        <div className="profile-section-controls">
          <button onClick={handleSignOut} className="profile-section-button">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Threads Component
const Threads = ({ threads, activeThreadId, onSelectThread, onNewThread, onDeleteThread }) => (
  <div className="thread-container">
    <div className="thread-header">
      <h2 className="thread-title-header">Your Threads</h2>
      <button onClick={onNewThread} className="thread-new-button">
        <Plus size={20} />
      </button>
    </div>
    <div className="thread-list">
      {threads.map((thread) => (
        <div
          key={thread.id}
          className={`thread-item ${thread.id === activeThreadId ? 'active' : ''}`}
          onClick={() => onSelectThread(thread)}
        >
          <div className="thread-content">
            <h3 className="thread-item-title">{thread.title}</h3>
            <p className="thread-item-preview">{thread.lastMessage}</p>
          </div>
          <div
            className="thread-delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteThread(thread.id);
            }}
          >
            ×
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Chat Interface Component
const ChatInterface = ({ messages, inputValue, setInputValue, handleSubmit, currentThread, onSendMessage }) => {
  const textareaRef = useRef(null);
  const [spaceKeyPressed, setSpaceKeyPressed] = useState(false);
  const [spaceKeyTimer, setSpaceKeyTimer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitWithLoader = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
  
    setIsLoading(true);
    try {
      // Reset textarea height immediately after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = '52px'; // Reset to default height
      }
      await handleSubmit(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymize = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/anonymize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputValue
        }),
      });

      if (!response.ok) {
        throw new Error('Anonymization failed');
      }

      const data = await response.json();
      setInputValue(data.anonymized_text);
    } catch (error) {
      console.error('Error anonymizing text:', error);
    }
  };

  // Modify your keydown handler
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitWithLoader(e);
    } else if (e.key === ' ') {
      setSpaceKeyPressed(true);
      const timer = setTimeout(() => {
        if (spaceKeyPressed) {
          handleAnonymize();
        }
      }, 1000); // 1 second long press
      setSpaceKeyTimer(timer);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === ' ') {
      setSpaceKeyPressed(false);
      if (spaceKeyTimer) {
        clearTimeout(spaceKeyTimer);
      }
    }
  };

  const handleTextareaInput = (e) => {
    const textarea = e.target;
    textarea.style.height = '52px'; // Fixed base height
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    setInputValue(e.target.value);
  };

  const getDomainIcon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.split('.')[0];
    } catch {
      return 'link';
    }
  };

  const Loader = () => (
    <div className="loader-container">
      <svg className="loader-svg" viewBox="0 0 100 100" width="40" height="40">
        <line className="loader-line1" x1="20" y1="20" x2="80" y2="80" />
        <line className="loader-line2" x1="20" y1="80" x2="80" y2="20" />
      </svg>
    </div>
  );

  const formatMessage = (text) => {
    if (!text) return [];

    const sections = text.split(/(?=##\s|###\s)/);

    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const firstLine = lines[0];
      let content = lines.slice(1).join('\n');

      content = content.replace(/```(.*?)\n([\s\S]*?)```/g, (match, language, code) => {
        const escapedCode = code.trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');

        const blockId = `code-block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return `
          <div class="code-block">
            <div class="code-header">
              <span class="code-language">${language || 'plaintext'}</span>
              <button class="copy-button" onclick="
                navigator.clipboard.writeText(document.getElementById('${blockId}').textContent);
                this.textContent = 'Copied!';
                setTimeout(() => this.textContent = 'Copy', 2000);
              ">
                Copy
              </button>
            </div>
            <pre><code id="${blockId}" class="language-${language || 'plaintext'}">${escapedCode}</code></pre>
          </div>
        `.trim();
      });

      if (firstLine.startsWith('## ')) {
        return (
          <div key={index} className="message-section">
            <h2 className="message-heading">{firstLine.replace('## ', '')}</h2>
            <div className="message-content" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        );
      } else if (firstLine.startsWith('### ')) {
        return (
          <div key={index} className="message-subsection">
            <h3 className="message-subheading">{firstLine.replace('### ', '')}</h3>
            <div className="message-content" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        );
      } else {
        return (
          <div key={index} className="message-paragraph">
            <div dangerouslySetInnerHTML={{ __html: section }} />
          </div>
        );
      }
    });
  };

  

  return (
    <div className="chat-section">
      <div className="chat-container">
      <VoiceControl />
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.isBot ? 'bot' : 'user'}`}>
              {message.isBot ? (
                <>
                  <div className="message-content-wrapper">
                    {formatMessage(message.text)}
                  </div>
                  {message.sources && message.sources.length > 0 && (
                    <div className="sources-section">
                      <h4 className="sources-heading">Sources</h4>
                      <div className="sources-list">
                        {message.sources.map((source, index) => (
                          <SourceItem key={index} source={source} />
                        ))}
                      </div>
                      
                    </div>
                  )}
                </>
              ) : (
                <p>{message.text}</p>
              )}
              
            </div>
          ))}
          {isLoading && <Loader />}
        </div>
        <form onSubmit={handleSubmitWithLoader} className="input-form">
  <div className="input-area">
    <div className="input-container">
      {inputValue && (
        <div className="info-tooltip-container">
          <div className="info-circle">i</div>
          <span className="info-tooltip">Long press the space bar to anonymize Personally Identifiable Information (PII) </span>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleTextareaInput}
        placeholder="For security tips try: How do I secure my Wi-Fi network?"
        className="message-input"
        rows={1}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </div>
    <button 
      type="submit"  // Add type="submit"
      
      className="send-button-circle"
      disabled={!inputValue.trim()}
    >
      <ArrowUp size={20} />
    </button>
  </div>
</form>
      </div>
    </div>
  );
};

// MainInterface Component
const MainInterface = () => {
  const [activeSection, setActiveSection] = useState('tools');
  const [threads, setThreads] = useState([
    {
      id: 1,
      title: "Navigate the digital",
      lastMessage: "ecosystem with confidence",
      messages: [{ id: 1, text: "Hi! I'm Orion. How can I help you?", isBot: true }],
    },
    {
      id: 2,
      title: "Here to help!",
      lastMessage: "Your intelligent security assistant",
      messages: [{ id: 1, text: "What information can I help you with?", isBot: true }],
    },
  ]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSendMessage = async (content) => {
    try {
      // Add user message to the UI
      const userMessage = {
        id: Date.now(),
        text: content,
        isBot: false
      };
      setMessages(prev => [...prev, userMessage]);

      setActiveSection('threads');
  
      // Send to API
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
  
      const data = await response.json();
  
      // Add bot response to the UI
      const botMessage = {
        id: Date.now() + 1,
        text: data.text,
        isBot: true,
        sources: data.sources
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update threads if there's an active thread
      if (currentThreadId) {
        setThreads(prevThreads =>
          prevThreads.map(thread =>
            thread.id === currentThreadId
              ? {
                  ...thread,
                  lastMessage: data.text,
                  messages: [...thread.messages, userMessage, botMessage]
                }
              : thread
          )
        );
      } else {
        // Create new thread if none exists
        const newThread = {
          id: Date.now(),
          title: content.slice(0, 30) + '...',
          lastMessage: data.text,
          messages: [userMessage, botMessage]
        };
        setThreads(prev => [...prev, newThread]);
        setCurrentThreadId(newThread.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Token check on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to Sign-In page if no token is found
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    };

    const newMessages = [...messages, userMessage];

    // Create new thread if no thread is selected
    if (!currentThreadId) {
      const newThread = {
        id: Date.now(),
        title: `Chat ${threads.length + 1}`,
        lastMessage: userMessage.text,
        messages: newMessages,
      };
      setThreads((prevThreads) => [...prevThreads, newThread]);
      setCurrentThreadId(newThread.id);
    }

    setMessages(newMessages);
    setInputValue('');

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: inputValue }],
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      const botResponse = {
        id: newMessages.length + 1,
        text: data.text,
        isBot: true,
        sources: data.sources,
      };

      const updatedMessages = [...newMessages, botResponse];
      setMessages(updatedMessages);

      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === currentThreadId
            ? {
                ...thread,
                lastMessage: botResponse.text,
                messages: updatedMessages,
              }
            : thread
        )
      );
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: newMessages.length + 1,
        text: `Error: ${error.message}. Please try again.`,
        isBot: true,
      };

      setMessages([...newMessages, errorMessage]);
    }
  };

  const handleNewThread = () => {
    const newThread = {
      id: Date.now(),
      title: 'New Chat',
      lastMessage: 'Start a new conversation',
      messages: [{ id: 1, text: 'Hi! How can I help you today?', isBot: true }],
    };
    setThreads([...threads, newThread]);
    setCurrentThreadId(newThread.id);
    setMessages(newThread.messages);
  };

  const handleDeleteThread = (threadId) => {
    setThreads(threads.filter((t) => t.id !== threadId));
    if (currentThreadId === threadId) {
      setCurrentThreadId(null);
      setMessages([]);
    }
  };

  const handleSelectThread = (thread) => {
    setCurrentThreadId(thread.id);
    setMessages(thread.messages);
  };

  

  

  const renderMiddleContent = () => {
    switch (activeSection) {
      case 'tools':
        return <Tools />;
      case 'learn':
        return <Learn onSendMessage={handleSendMessage} setActiveSection={setActiveSection} />;
      case 'threads':
        return (
          <Threads
            threads={threads}
            activeThreadId={currentThreadId}
            onSelectThread={handleSelectThread}
            onNewThread={handleNewThread}
            onDeleteThread={handleDeleteThread}
          />
        );
      case 'profile':
        return <Profile />;
      default:
        return <Threads
          threads={threads}
          activeThreadId={currentThreadId}
          onSelectThread={handleSelectThread}
          onNewThread={handleNewThread}
          onDeleteThread={handleDeleteThread}
        />;
    }
  };

  return (
    <div className="app-container">
      <nav className="nav-sidebar">
        <div className="nav-logo">
          <img src={logo} alt="Logo" />
        </div>
        <button
          onClick={() => setActiveSection('profile')}
          className={`nav-button ${activeSection === 'profile' ? 'active' : ''}`}
        >
          <User size={24} />
        </button>
        <button
          onClick={() => setActiveSection('threads')}
          className={`nav-button ${activeSection === 'threads' ? 'active' : ''}`}
        >
          <MessageSquare size={24} />
        </button>
        <button
          onClick={() => setActiveSection('learn')}
          className={`nav-button ${activeSection === 'learn' ? 'active' : ''}`}
        >
          <BookOpen size={24} />
        </button>
        <button
          onClick={() => setActiveSection('tools')}
          className={`nav-button ${activeSection === 'tools' ? 'active' : ''}`}
        >
          <Wrench size={24} />
        </button>
      </nav>
      <div className="middle-content">{renderMiddleContent()}</div>
      <ChatInterface
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        currentThread={threads.find((t) => t.id === currentThreadId)}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MainInterface;
