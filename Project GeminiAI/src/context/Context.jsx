import { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSent = async (prompt) => {
    if (!prompt || !prompt.trim()) {
      setError('Please enter a valid prompt');
      return;
    }
    
    const trimmedPrompt = prompt.trim();
    
    setLoading(true);
    setError("");
    setRecentPrompt(trimmedPrompt);
    setShowResult(true);
    setResultData("");
// http://localhost:4000/generate
    try {
      const res = await fetch('https://geminclone-server-1.onrender.com/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: trimmedPrompt })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      
      setResultData(data.text);
      
      setPrevPrompts(prev => {
        if (!prev.includes(trimmedPrompt)) {
          return [...prev, trimmedPrompt];
        }
        return prev;
      });
      
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Could not get response from server');
      
      setPrevPrompts(prev => {
        if (!prev.includes(trimmedPrompt)) {
          return [...prev, trimmedPrompt];
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    prevPrompts,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    error,
    
    setPrevPrompts,
    setRecentPrompt,
    setShowResult,
    setLoading,
    setResultData,
    setInput,
    setError,
    
    
    onSent
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;