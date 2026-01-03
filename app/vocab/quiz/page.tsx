'use client'

import { useState, useEffect, useMemo } from 'react'
import { vocab, VocabTerm, getVocabTerm } from '@/data/vocab'
import Link from 'next/link'
import { useVocabStore } from '@/lib/useVocabStore'

type QuizQuestion = {
  term: VocabTerm
  options: string[]
  correctIndex: number
}

export default function QuizPage() {
  const { list, save, get } = useVocabStore()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [viewMode, setViewMode] = useState<'simple' | 'clinical'>('simple')

  // Generate quiz questions from saved terms
  const generateQuiz = () => {
    const savedItems = list()
    // Match saved items with vocab dictionary entries
    const savedTerms = savedItems
      .map((item) => vocab.find(v => v.term.toLowerCase() === item.term.toLowerCase()))
      .filter((term): term is VocabTerm => term !== undefined)
    
    if (savedTerms.length === 0) {
      return
    }

    // Shuffle and take 10 terms
    const shuffled = [...savedTerms].sort(() => Math.random() - 0.5).slice(0, 10)
    
    const quizQuestions: QuizQuestion[] = shuffled.map(term => {
      // Get 3 random wrong answers
      const wrongAnswers = vocab
        .filter(t => t.term !== term.term)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(t => viewMode === 'simple' ? t.definitionSimple : t.definitionClinical)
      
      // Correct answer
      const correctAnswer = viewMode === 'simple' ? term.definitionSimple : term.definitionClinical
      
      // Combine and shuffle
      const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5)
      const correctIndex = allOptions.indexOf(correctAnswer)
      
      return {
        term,
        options: allOptions,
        correctIndex
      }
    })
    
    setQuestions(quizQuestions)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizComplete(false)
  }

  useEffect(() => {
    const savedItems = list()
    if (savedItems.length > 0) {
      generateQuiz()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]) // generateQuiz depends on list() which is stable

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    const question = questions[currentQuestion]
    const isCorrect = selectedAnswer === question.correctIndex
    
    // Update score
    if (isCorrect) {
      setScore(score + 1)
    }
    
    // Update saved vocab stats (quiz tracking)
    // Note: timesReviewed is stored in the store but not part of VocabExplanation
    // The store handles this internally, so we just need to ensure the term exists
    // Quiz tracking enhancement can be added later
    
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
    }
  }

  const savedItems = list()
  const savedTerms = savedItems
    .map((item) => vocab.find(v => v.term.toLowerCase() === item.term.toLowerCase()))
    .filter((term): term is VocabTerm => term !== undefined)

  if (savedTerms.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vocabulary Quiz</h1>
          <p className="text-gray-600 mb-6">You need to save some terms before you can take a quiz.</p>
          <Link
            href="/vocab"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            Go to My Vocabulary
          </Link>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vocabulary Quiz</h1>
          <p className="text-gray-600 mb-6">Generating quiz questions...</p>
        </div>
      </div>
    )
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
          <div className="mb-6">
            <p className="text-5xl font-bold text-primary-600 mb-2">{percentage}%</p>
            <p className="text-lg text-gray-700">
              You got {score} out of {questions.length} questions correct!
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={generateQuiz}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
            >
              Take Another Quiz
            </button>
            <Link
              href="/vocab"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Back to Vocabulary
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Vocabulary Quiz</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">View:</span>
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => {
                setViewMode('simple')
                generateQuiz()
              }}
              className={`px-3 py-1 text-sm font-medium rounded transition ${
                viewMode === 'simple'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => {
                setViewMode('clinical')
                generateQuiz()
              }}
              className={`px-3 py-1 text-sm font-medium rounded transition ${
                viewMode === 'clinical'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Clinical
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            Score: {score} / {currentQuestion + (showResult ? 1 : 0)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">
            What is the definition of <span className="text-primary-600">{question.term.display}</span>?
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Why it matters:</strong> {question.term.whyItMatters}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correctIndex
            const showCorrect = showResult && isCorrect
            const showIncorrect = showResult && isSelected && !isCorrect

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  showCorrect
                    ? 'border-green-500 bg-green-50'
                    : showIncorrect
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
                } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    showCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : showIncorrect
                      ? 'border-red-500 bg-red-500 text-white'
                      : isSelected
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {showCorrect ? '✓' : showIncorrect ? '×' : String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg mb-4 ${
            selectedAnswer === question.correctIndex
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-medium ${
              selectedAnswer === question.correctIndex
                ? 'text-green-800'
                : 'text-red-800'
            }`}>
              {selectedAnswer === question.correctIndex
                ? '✓ Correct!'
                : `✗ Incorrect. The correct answer is: ${question.options[question.correctIndex]}`}
            </p>
            {question.term.exampleSimple && (
              <p className="text-sm text-gray-700 mt-2 italic">
                Example: {question.term.exampleSimple}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

