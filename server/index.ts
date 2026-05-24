import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

interface StoredQuestion {
  question: string
  code?: string
  options: Array<{ id: string; text: string; explanation: string }>
  correctAnswer: string
  correctExplanation: string
  topic: string
  subtopic: string
  xp: number
  step: number
  totalSteps: number
}

let currentQuestion: StoredQuestion | null = {
  question: 'What does the `typeof` operator return for an undeclared variable?',
  code: 'console.log(typeof undeclaredVar)',
  options: [
    { id: 'A', text: '"undefined"', explanation: 'Correct — typeof safely returns "undefined" for undeclared variables instead of throwing a ReferenceError.' },
    { id: 'B', text: '"null"', explanation: 'null is a distinct type; typeof null returns "object" due to a historical quirk in JavaScript.' },
    { id: 'C', text: 'It throws a ReferenceError', explanation: 'typeof is special-cased to not throw for undeclared variables — unlike directly accessing them.' },
    { id: 'D', text: '"unknown"', explanation: '"unknown" is a TypeScript type, not a value returned by the typeof operator at runtime.' },
  ],
  correctAnswer: '"undefined"',
  correctExplanation: 'typeof returns the string "undefined" for undeclared variables. This makes it a safe way to check whether a variable exists without risking a ReferenceError.',
  topic: 'JavaScript',
  subtopic: 'Types & Operators',
  xp: 100,
  step: 1,
  totalSteps: 10,
}

interface QuestionBody {
  question: string
  code?: string
  answers: string[]
  explanations: string[]
  correctAnswer: string
  correctExplanation: string
  topic?: string
  subtopic?: string
  xp?: number
  step?: number
  totalSteps?: number
}

app.post('/question', (req: Request, res: Response) => {
  const {
    question,
    code,
    answers,
    explanations,
    correctAnswer,
    correctExplanation,
    topic = 'General',
    subtopic = 'Knowledge',
    xp = 100,
    step = 1,
    totalSteps = 10,
  } = req.body as QuestionBody

  if (!question || !answers?.length || !explanations?.length || !correctAnswer || !correctExplanation) {
    res.status(400).json({ error: 'Missing required fields: question, answers, explanations, correctAnswer, correctExplanation' })
    return
  }

  if (answers.length !== explanations.length) {
    res.status(400).json({ error: 'answers and explanations arrays must be the same length' })
    return
  }

  if (!answers.includes(correctAnswer)) {
    res.status(400).json({ error: 'correctAnswer must be one of the values in answers' })
    return
  }

  currentQuestion = {
    question,
    code,
    options: answers.map((text, i) => ({
      id: String.fromCharCode(65 + i),
      text,
      explanation: explanations[i],
    })),
    correctAnswer,
    correctExplanation,
    topic,
    subtopic,
    xp,
    step,
    totalSteps,
  }

  res.json(currentQuestion)
})

app.get('/question', (_req: Request, res: Response) => {
  if (!currentQuestion) {
    res.status(404).json({ error: 'No question loaded yet' })
    return
  }
  res.json(currentQuestion)
})

const PORT = 3001
const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})

server.on('error', (err: NodeJS.ErrnoException) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
