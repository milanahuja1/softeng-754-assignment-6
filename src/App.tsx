import { useState, useEffect } from 'react'
import './App.css'

interface QuestionData {
  question: string
  options: Array<{ id: string; text: string; explanation: string }>
  correctAnswer: string
  correctExplanation: string
  topic: string
  subtopic: string
  xp: number
  step: number
  totalSteps: number
}

export default function App() {
  const [question, setQuestion] = useState<QuestionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch('/question')
        if (!res.ok) throw new Error(res.status === 404 ? 'No question loaded yet — POST one to /question' : 'Failed to fetch question')
        const data = await res.json()
        setQuestion(data)
        setSelected(null)
        setAnswered(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading question')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
    const interval = setInterval(fetchQuestion, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="screen">
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>Loading question...</div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="screen">
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#ef4444' }}>
          Error: {error || 'No question loaded'}
        </div>
      </div>
    )
  }

  const correctId = question.options.find((o) => o.text === question.correctAnswer)?.id
  const isCorrect = selected === correctId

  const handleSelect = (id: string) => {
    if (!answered) setSelected(id)
  }

  const handleCheck = () => {
    if (selected) setAnswered(true)
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn">&#8592;</button>
        <h1 className="title">{question.topic} &middot; {question.subtopic}</h1>
        <div className="xp-badge">&#11088; {question.xp} XP</div>
      </div>

      <div className="progress-section">
        <div className="progress-labels">
          <span className="step-label">STEP {question.step} OF {question.totalSteps}</span>
          <span className="complete-label">{Math.round((question.step / question.totalSteps) * 100)}% Complete</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(question.step / question.totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className="card">
        <p className="question-text">{question.question}</p>

        <div className="code-block">
          <div className="code-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <pre className="code-pre">
            <code>
              <span className="kw">public class </span>
              <span className="cls">Dog </span>
              <span className="kw">extends </span>
              <span className="cls">Animal </span>
              {'{\n'}
              {'    '}
              <span className="kw">public </span>
              <span className="fn">Dog</span>
              {'() {\n'}
              {'        '}
              <span className="fn">super</span>
              {'(); '}
              <span className="comment">// ?</span>
              {'\n'}
              {'        '}
              <span className="cls">System</span>
              {'.out.'}
              <span className="fn">println</span>
              {'('}
              <span className="str">"Dog created"</span>
              {');\n'}
              {'    }\n}'}
            </code>
          </pre>
        </div>

        <div className="options">
          {question.options.map((opt) => {
            const isSelected = selected === opt.id
            const isRight = opt.id === correctId
            let cls = 'option'
            if (answered && isSelected) cls += isRight ? ' correct' : ' wrong'
            else if (isSelected) cls += ' selected'
            return (
              <button key={opt.id} className={cls} onClick={() => handleSelect(opt.id)}>
                <span className="opt-id">{opt.id}</span>
                <span className="opt-text">{opt.text}</span>
                {answered && isSelected && isRight && (
                  <span className="opt-check">&#10003;</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {!answered ? (
        <button className="check-btn" onClick={handleCheck} disabled={!selected}>
          Check Answer
        </button>
      ) : (
        <div className={`feedback ${isCorrect ? 'fb-correct' : 'fb-wrong'}`}>
          <div className="fb-row">
            <span className="fb-icon">{isCorrect ? '✓' : '✗'}</span>
            <span className="fb-title">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
          </div>
          <p className="fb-text">{question.correctExplanation}</p>
          <button className="next-btn">Next question &#8594;</button>
        </div>
      )}
    </div>
  )
}
