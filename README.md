# Quiz App

An interactive quiz application built with React + TypeScript (Vite) and an Express API backend. Questions are pushed to the server via a POST request and the frontend automatically updates to display them.

## How it works

The app has two parts that run simultaneously:

- **Frontend** (`localhost:5173`) — a React app that displays the current question, answer options, and feedback
- **API server** (`localhost:3001`) — an Express server that stores the active question in memory

### Flow

1. Send a question to the API via Postman (or any HTTP client)
2. The server stores it and returns the formatted question
3. The frontend polls `GET /question` every 3 seconds and re-renders automatically

## Running the app

Install dependencies:
```bash
npm install
```

Start the API server (in one terminal):
```bash
npm run server
```

Start the frontend (in another terminal):
```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

## API

### `POST /question`

Loads a new question into the server. The frontend will display it within 3 seconds.

**Request body:**
```json
{
  "question": "What is the time complexity of binary search?",
  "answers": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
  "explanations": [
    "Incorrect — that would be linear search",
    "Correct — binary search halves the search space each time",
    "Incorrect — that is bubble sort",
    "Incorrect — nothing is constant time here"
  ],
  "correctAnswer": "O(log n)",
  "correctExplanation": "Binary search divides the array in half each iteration, giving it O(log n) time complexity.",
  "topic": "Algorithms",
  "subtopic": "Searching",
  "xp": 300,
  "step": 2,
  "totalSteps": 5
}
```

`topic`, `subtopic`, `xp`, `step`, and `totalSteps` are optional (defaults: General / Knowledge / 100 XP / step 1 of 10).

**Response:** the formatted question object with options assigned letter IDs (A, B, C, D).

---

### `GET /question`

Returns the currently stored question. Used by the frontend to poll for updates. Returns `404` if no question has been posted yet.

## Tech stack

- React 19 + TypeScript
- Vite (frontend dev server + build)
- Express 5 (API server)
- tsx (runs the TypeScript server directly)
