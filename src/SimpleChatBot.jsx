import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  SendHorizontal,
  CircleStop,
  Trash2,
  BotMessageSquare,
  UserCheck,
} from "lucide-react";

const SimpleChatBot = ({ apiKey, systemPrompt }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    { text: systemPrompt, sender: "info" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingResponse, setTypingResponse] = useState("");
  const [stopTyping, setStopTyping] = useState(false);
  const typingIntervalRef = useRef(null);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const sendMessage = async () => {
    if (prompt.trim()) {
      const newMessages = [...messages, { text: prompt, sender: "user" }];
      setMessages(newMessages);
      setPrompt("");
      setIsLoading(true);
      setStopTyping(false);

      try {
        const formattedMessages = newMessages
          .map((msg) => `${msg.sender}: ${msg.text}`)
          .join("\n");

        const result = await model.generateContent(formattedMessages);
        let response = await result.response.text();

        let index = 0;
        setTypingResponse("");
        typingIntervalRef.current = setInterval(() => {
          if (index < response.length && !stopTyping) {
            setTypingResponse((prev) => prev + response.charAt(index));
            index++;
          } else {
            clearInterval(typingIntervalRef.current);
            setIsLoading(false);
            setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
            setTypingResponse("");
          }
        }, 10);
      } catch (error) {
        console.error("Error generating content:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Error generating response", sender: "bot" },
        ]);
        setIsLoading(false);
      }
    }
  };

  const handleStopTyping = () => {
    setStopTyping(true);
    clearInterval(typingIntervalRef.current);
    setIsLoading(false);
  };

  const handleClearAll = () => {
    setMessages([{ text: systemPrompt, sender: "info" }]);
    setPrompt("");
    setTypingResponse("");
    setIsLoading(false);
    setStopTyping(false);
    clearInterval(typingIntervalRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages
          .filter((msg) => msg.sender !== "info")
          .map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.sender === "bot" && <BotMessageSquare size={16} />}
              <span>{msg.text}</span>
              {msg.sender === "user" && <UserCheck size={16} />}
            </div>
          ))}
        {isLoading && (
          <div className="message bot">
            <BotMessageSquare size={16} />
            ...
          </div>
        )}
        {typingResponse && <div className="message bot">{typingResponse}</div>}
      </div>
      <div className="chat-input">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Ask something..."
        />
        <button onClick={sendMessage}>
          <SendHorizontal size={18} />
        </button>
        {isLoading && (
          <button onClick={handleStopTyping}>
            <CircleStop size={18} />
          </button>
        )}
        <button onClick={handleClearAll}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default SimpleChatBot;
