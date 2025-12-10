import React from 'react';

const ChatBot = ({ 
  isDarkMode, 
  isChatOpen, 
  setIsChatOpen, 
  chatMessages, 
  setChatMessages, 
  chatInput, 
  setChatInput 
}) => {
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: chatMessages.length + 1,
      text: chatInput,
      sender: 'user'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Réponse automatique du bot
    setTimeout(() => {
      const botMessage = {
        id: chatMessages.length + 2,
        text: "Merci pour votre message ! Notre équipe vous répondra rapidement.",
        sender: 'bot'
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 ${
          isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        💬
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 h-96 rounded-2xl shadow-2xl z-50 flex flex-col ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      
      {/* En-tête du chat */}
      <div className={`p-4 rounded-t-2xl flex justify-between items-center ${
        isDarkMode ? 'bg-gray-700' : 'bg-blue-600'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-white'}`}>
              Assistant Cleanix
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-blue-100'}`}>
              En ligne
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsChatOpen(false)}
          className={`p-1 rounded-full ${
            isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-700'
          }`}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className={`flex-1 p-4 overflow-y-auto ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div className={`inline-block p-3 rounded-2xl max-w-xs ${
              message.sender === 'user'
                ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800 shadow')
            }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Tapez votre message..."
            className={`flex-1 px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-800'
            }`}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;