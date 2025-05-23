# 🧠 Portfolio Support Bot

A lightweight, customizable chatbot built with **React** and powered by **Google Gemini**. Designed specifically for **developer portfolio websites**, it allows visitors to chat with an AI assistant that can answer questions about your skills, projects, and contact information.

---

## ✨ Features

- 🤖 Google Gemini (gemini-2.0-flash) integration
- 💼 Personalized based on your developer profile
- 🔌 Plug-and-play React component
- 💬 Typing animation for realistic chat experience
- 🎨 Minimal styling, easy to override with your own CSS

---

## 📦 Installation

```bash
npm install portfolio-support-bot
```

## 🧠 Props

| Prop      | Type     | Required | Description                                                               |
| --------- | -------- | -------- | ------------------------------------------------------------------------- |
| `apiKey`  | `string` | ✅ Yes   | Your Google Generative AI API Key                                         |
| `profile` | `object` | ✅ Yes   | JSON object with details about you: name, skills, projects, contact, etc. |

# 📁 Profile Object Structure

The `profile` prop is an object that defines what the chatbot knows about you. Here’s the full schema with an example:

```js
const profile = {
  name: "John Doe", // Your full name
  role: "Fullstack Developer", // Your professional title
  skills: ["React", "Next.js", "Node.js", "MongoDB"], // List of your technical skills
  about: "I build fast, scalable, and accessible full-stack web apps.", // Short personal intro
  open_to_work: "yes",
  projects: [
    {
      name: "My Portfolio",
      url: "https://johndoe.dev",
    },
    {
      name: "Blog Platform",
      url: "https://blog.johndoe.dev",
    },
  ], // Array of your notable projects with URLs
  contact: {
    email: "john@example.com", // Your email
    github: "https://github.com/johndoe", // GitHub profile
    linkedin: "https://linkedin.com/in/johndoe", // LinkedIn profile
  },
};
```
![npm image](https://raw.githubusercontent.com/mahesh-barapatre/custom-gemini-chatbot/refs/heads/main/Screenshot%20(118).png)
