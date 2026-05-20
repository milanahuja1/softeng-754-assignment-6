import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

interface QuestionBody {
  question: string
  answers: string[]
  explanations: string[]
  correctAnswer: string
  correctExplanation: string
}

app.post('/question', (req: Request, res: Response) => {
  const { question, answers, explanations, correctAnswer, correctExplanation } =
    req.body as QuestionBody

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

  res.json({
    question,
    options: answers.map((text, i) => ({
      id: String.fromCharCode(65 + i), // A, B, C, D ...
      text,
      explanation: explanations[i],
    })),
    correctAnswer,
    correctExplanation,
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
