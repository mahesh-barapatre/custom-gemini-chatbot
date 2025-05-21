import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  SendHorizontal,
  CircleStop,
  Trash2,
  BotMessageSquare,
  MessageCircleQuestion,
  ChevronDown,
  BotMessageSquareIcon,
  ChevronUp,
} from "lucide-react";
import "./SimpleChatBot.css";
import FadeComponent from "./FadeComponent.jsx";

const SimpleChatBot = ({ apiKey, profile }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      text: `You are an AI assistant for a developer portfolio. Answer questions about the developer based on this profile precisely and positively:\n${JSON.stringify(
        profile,
        null,
        2
      )}`,
      sender: "info",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingResponse, setTypingResponse] = useState("");
  const [stopTyping, setStopTyping] = useState(false);
  const typingIntervalRef = useRef(null);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    const newMessages = [...messages, { text: prompt, sender: "user" }];
    setMessages(newMessages);
    setPrompt("");
    setIsLoading(true);
    setStopTyping(false);
    setTypingResponse("");

    try {
      const formattedMessages = newMessages
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");

      const result = await model.generateContent(formattedMessages);
      const response = await result.response.text();

      let index = 0;
      typingIntervalRef.current = setInterval(() => {
        if (index < response.length && !stopTyping) {
          setTypingResponse((prev) => prev + response.charAt(index));
          index++;
        } else {
          clearInterval(typingIntervalRef.current);
          setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
          setTypingResponse("");
          setIsLoading(false);
        }
      }, 10);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong.", sender: "bot" },
      ]);
      setIsLoading(false);
    }
  };

  const handleStopTyping = () => {
    setStopTyping(true);
    clearInterval(typingIntervalRef.current);
    setIsLoading(false);
  };

  const handleClearAll = () => {
    setMessages([
      {
        text: `You are an AI assistant for a developer portfolio. Answer questions about the developer based on this profile precisely:\n${JSON.stringify(
          profile,
          null,
          2
        )}`,
        sender: "info",
      },
    ]);
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
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="header-label">chat with</div>
          <div className="header-profile">
            <MessageCircleQuestion color="#0cd42e" size={16} />
            {profile.name}
          </div>
        </div>
        <div
          className="header-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <ChevronUp color="#8898aa" size={16} />
          ) : (
            <ChevronDown color="#8898aa" size={16} />
          )}
        </div>
      </div>

      <FadeComponent isOpen={isOpen}>
        <div className="collapse-div">
          {messages.length < 2 ? (
            <div className="default-msgbox">
              <BotMessageSquareIcon />
              <div className="msgbox-text-sm">
                Send a message to start the chat!
              </div>
              <div className="msgbox-text-xs">
                You can ask the bot anything about me and it will help to find
                the relevant information!
              </div>
            </div>
          ) : (
            <div className="chat-window">
              {messages
                .filter((msg) => msg.sender !== "info")
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.sender === "user" ? "user" : "bot"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="">
                        <BotMessageSquare size={16} />
                      </div>
                    )}
                    {msg.sender === "bot" && (
                      <span className="bot-message">{msg.text}</span>
                    )}

                    {msg.sender === "user" && (
                      <span className="user-message">{msg.text}</span>
                    )}

                    {/* {msg.sender === "user" && <UserCheck size={16} />} */}
                  </div>
                ))}

              {isLoading && (
                <div className="message bot">
                  <BotMessageSquare size={16} />
                  ...
                </div>
              )}

              {typingResponse && (
                <div className="message bot">
                  <BotMessageSquare size={16} />
                  {typingResponse}
                </div>
              )}
            </div>
          )}

          <div className="chat-input">
            <button
              style={{ aspectRatio: "1 / 1" }}
              className="clear-button"
              onClick={handleClearAll}
            >
              <Trash2 size={18} />
            </button>

            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Ask something..."
            />
            <button
              className="send-button"
              onClick={sendMessage}
              disabled={isLoading}
            >
              <SendHorizontal size={18} />
            </button>

            {isLoading && (
              <button className="stop-button" onClick={handleStopTyping}>
                <CircleStop size={18} />
              </button>
            )}
          </div>
        </div>
      </FadeComponent>
    </div>
  );
};

export default SimpleChatBot;
