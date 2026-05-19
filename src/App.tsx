import { useState } from 'react'
import './App.css'

const QUESTION = {
  topic: 'OOP',
  subtopic: 'Inheritance',
  xp: 520,
  step: 3,
  totalSteps: 6,
  text: (
    <>
      What does the <span className="keyword">super</span> keyword do in a
      constructor?
    </>
  ),
  options: [
    { id: 'A', text: 'Calls the parent constructor' },
    { id: 'B', text: 'Creates a new instance of Animal' },
    { id: 'C', text: 'Overrides the parent method' },
    { id: 'D', text: 'Accesses the static fields' },
  ],
  correctId: 'A',
  explanation:
    'The super() call must be the first statement in a constructor to ensure the parent class is initialized before the child.',
}

export default function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const progress = (QUESTION.step / QUESTION.totalSteps) * 100
  const isCorrect = selected === QUESTION.correctId

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
        <h1 className="title">
          {QUESTION.topic} &middot; {QUESTION.subtopic}
        </h1>
        <div className="xp-badge">&#11088; {QUESTION.xp} XP</div>
      </div>

      <div className="progress-section">
        <div className="progress-labels">
          <span className="step-label">
            STEP {QUESTION.step} OF {QUESTION.totalSteps}
          </span>
          <span className="complete-label">{progress}% Complete</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card">
        <p className="question-text">{QUESTION.text}</p>

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
          {QUESTION.options.map((opt) => {
            const isSelected = selected === opt.id
            const isRight = opt.id === QUESTION.correctId
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
          <p className="fb-text">{QUESTION.explanation}</p>
          <button className="next-btn">Next question &#8594;</button>
        </div>
      )}
    </div>
  )
}
