import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTestEditorStore } from '@/stores/useTestEditorStore'
import type { AnswerOption, Question, Test } from '@/types/types'

const makeQuestion = (
  id: number | string,
  answerOptions: AnswerOption[] = [],
): Question => ({
  id,
  test_id: 1,
  text: `Question ${id}`,
  allows_multiple_correct: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  answer_options: answerOptions,
})

const makeAnswerOption = (
  id: number | string,
  questionId: number | string,
  isCorrect = false,
): AnswerOption => ({
  id,
  question_id: questionId,
  text: `Option ${id}`,
  is_correct: isCorrect,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
})

const makeTest = (questions: Question[] = []): Test => ({
  id: 1,
  title: 'Sample test',
  description: 'Sample description',
  questions,
})

describe('useTestEditorStore local mutations', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes a blank test for an authenticated user', () => {
    const authStore = useAuthStore()
    authStore.user = { id: 9, name: 'Tester', email: 'tester@example.com' }
    const store = useTestEditorStore()

    store.initializeNewTest()

    expect(store.test).toEqual({
      title: '',
      description: '',
      questions: [],
    })
  })

  it('rejects initialization without a user and adding questions without a test', () => {
    const store = useTestEditorStore()

    expect(() => store.initializeNewTest()).toThrow('User not authenticated')
    expect(() => store.addNewQuestion()).toThrow('No test loaded to add a question to')
    expect(store.test).toBeNull()
  })

  it('adds questions with distinct frontend IDs', () => {
    const store = useTestEditorStore()
    store.test = makeTest()

    store.addNewQuestion()
    store.addNewQuestion()

    const questions = store.test.questions ?? []
    expect(questions).toHaveLength(2)
    expect(questions[0].id).toEqual(expect.any(String))
    expect(questions[1].id).toEqual(expect.any(String))
    expect(questions[0].id).not.toBe(questions[1].id)
    expect(questions.map(question => question.text)).toEqual(['', ''])
    expect(questions.map(question => question.answer_options)).toEqual([[], []])
  })

  it('updates and deletes only the targeted question', () => {
    const firstQuestion = makeQuestion(1)
    const draftQuestion = makeQuestion('draft-question')
    const store = useTestEditorStore()
    store.test = makeTest([firstQuestion, draftQuestion])

    store.setQuestionTextInStore(1, 'Updated question')
    store.deleteQuestion('draft-question')

    expect(store.test.questions).toEqual([
      { ...firstQuestion, text: 'Updated question' },
    ])
  })

  it('adds, edits, and deletes only the targeted answer option', () => {
    const question = makeQuestion('draft-question', [
      makeAnswerOption('keep-option', 'draft-question'),
    ])
    const store = useTestEditorStore()
    store.test = makeTest([question])

    store.addNewAnswerOption('draft-question')
    const addedOption = question.answer_options?.[1]
    expect(addedOption?.id).toEqual(expect.any(String))
    expect(addedOption?.text).toBe('')
    expect(addedOption?.is_correct).toBe(false)

    store.setAnswerOptionTextInStore('draft-question', addedOption!.id, 'New choice')
    store.deleteAnswerOption('draft-question', addedOption!.id as string)

    expect(question.answer_options).toEqual([
      makeAnswerOption('keep-option', 'draft-question'),
    ])
  })

  it('keeps the correct-answer selection exclusive to the targeted question', () => {
    const firstQuestion = makeQuestion(1, [
      makeAnswerOption(11, 1, true),
      makeAnswerOption(12, 1),
    ])
    const secondQuestion = makeQuestion('draft-question', [
      makeAnswerOption('draft-a', 'draft-question', true),
      makeAnswerOption('draft-b', 'draft-question'),
    ])
    const store = useTestEditorStore()
    store.test = makeTest([firstQuestion, secondQuestion])

    store.setAnswerOptionIsCorrectInStore(1, 12)

    expect(firstQuestion.answer_options?.map(option => option.is_correct)).toEqual([false, true])
    expect(secondQuestion.answer_options?.map(option => option.is_correct)).toEqual([true, false])

    store.setAnswerOptionIsCorrectInStore('draft-question', 'draft-b')

    expect(secondQuestion.answer_options?.map(option => option.is_correct)).toEqual([false, true])
    expect(firstQuestion.answer_options?.map(option => option.is_correct)).toEqual([false, true])
  })

  it('reports missing question, answer option, and answer-option list targets', () => {
    const store = useTestEditorStore()
    const questionWithoutOptions = makeQuestion(2)
    questionWithoutOptions.answer_options = undefined
    store.test = makeTest([
      makeQuestion(1, [makeAnswerOption(11, 1)]),
      questionWithoutOptions,
    ])

    expect(() => store.setQuestionTextInStore(99, 'Missing')).toThrow('Question not found')
    expect(() => store.setAnswerOptionTextInStore(1, 99, 'Missing')).toThrow('Answer option not found')
    expect(() => store.addNewAnswerOption(2)).toThrow('Answer options array not found')
    expect(() => store.setAnswerOptionIsCorrectInStore(2, 21)).toThrow('Answer options array not found')
  })
})