import React, { useState, useContext, useEffect } from 'react'
import "./sidebar.css"
import { assets } from "../../assets/assets"
import { Context } from '../../context/Context'

const Sidebar = () => {
    const [extended, setExtended] = useState(false)
    const { 
        prevPrompts, 
        onSent, 
        setRecentPrompt,
        setShowResult,
        setResultData,
        recentPrompt
    } = useContext(Context)

    // Debugging: Log when prevPrompts changes
    // useEffect(() => {
    //     // console.log('prevPrompts updated:', prevPrompts);
    // }, [prevPrompts]);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        setShowResult(true);
        setResultData("Loading...");
        
        try {
            await onSent(prompt);
        } catch (error) {
            console.error('Error loading prompt:', error);
        }
    }

    return (
        <div className={`sidebar ${extended ? 'extended' : 'collapsed'}`}>
            <div className="top">
                <img 
                    onClick={() => setExtended(prev => !prev)} 
                    className='menu' 
                    src={assets.menu_icon}  
                    alt="menu" 
                />
                
                <div 
                    className="new-chat"
                    onClick={() => {
                        setShowResult(false);
                        setResultData("");
                        setRecentPrompt("");
                    }}
                    title="New Chat"
                >
                    <img src={assets.plus_icon} alt="new chat" />
                    {extended ? <p>New Chat</p> : null}
                </div>

                {extended && (
                    <div className="recent">
                        <p className='recent-title'>Recent Chats</p>
                        <p className='debug-info'>Total: {prevPrompts.length}</p>
                        
                        {prevPrompts.length > 0 ? (
                            [...prevPrompts].reverse().map((prompt, index) => (
                                <div 
                                    key={index} 
                                    className="recent-entry"
                                    onClick={() => loadPrompt(prompt)}
                                    title={prompt}
                                >
                                    <img src={assets.message_icon} alt="chat" />
                                    <p>
                                        {prompt.length > 25 
                                            ? `${prompt.substring(0, 25)}...` 
                                            : prompt
                                        }
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="no-recent">No recent chats yet</p>
                        )}
                    </div>
                )}
            </div>

            <div className="bottom">
                <div className="bottom-item recent-entry" title="Help">
                    <img src={assets.question_icon} alt="help" />
                    {extended ? <p>Help</p> : null}
                </div>

                <div className="bottom-item recent-entry" title="Activity">
                    <img src={assets.history_icon} alt="activity" />
                    {extended ? <p>Activity</p> : null}
                </div>

                <div className="bottom-item recent-entry" title="Settings">
                    <img src={assets.setting_icon} alt="settings" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar