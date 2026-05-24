# Quiz App — Instant Feedback

An interactive quiz app (React + TypeScript frontend, Express backend) that delivers instant answer feedback.

## Feature

When a student selects an answer, the app immediately highlights it as correct or incorrect and displays an explanation — no submission step required.

## Usage

```bash
npm install
npm run server   # terminal 1 — API on localhost:3001
npm run dev      # terminal 2 — UI on localhost:5173
```

POST a question to `localhost:3001/question` (see API docs). The frontend polls every 3 seconds and renders new questions automatically.