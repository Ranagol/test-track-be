import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, ref, toRef, type PropType } from 'vue'
import { describe, expect, it } from 'vitest'
import { useValidateAnswerBackend } from '@/composables/answerOptionListComposables/useValidateAnswerBackend'

const BackendValidationProbe = defineComponent({
  props: {
    beValidationErrors: {
      type: Object as PropType<Record<string, string[]>>,
      required: true,
    },
    questionIndex: {
      type: Number,
      required: true,
    },
    selectedAnswerOption: {
      type: [Number, String] as PropType<number | string | null>,
      default: null,
    },
  },
  emits: ['showError'],
  setup(props, { emit }) {
    useValidateAnswerBackend(
      (showError) => emit('showError', showError),
      toRef(props, 'selectedAnswerOption'),
      toRef(props, 'beValidationErrors'),
      props.questionIndex,
    )

    return () => h('div')
  },
})

const createValidationHarness = (
  questionIndex: number,
  selectedAnswerOption: number | string | null = null,
  initialErrors: Record<string, string[]> = {},
) => defineComponent({
  setup() {
    const backendErrors = ref<Record<string, string[]>>({ ...initialErrors })
    const showError = ref(false)

    const setError = (index: number) => {
      backendErrors.value = {
        [`questions.${index}.answer_options`]: ['Select a valid answer option'],
      }
    }

    return () => h('div', [
      h(BackendValidationProbe, {
        beValidationErrors: backendErrors.value,
        questionIndex,
        selectedAnswerOption,
        onShowError: (value: boolean) => {
          showError.value = value
        },
      }),
      h('button', {
        'data-test': 'matching-error',
        onClick: () => setError(questionIndex),
      }, 'Set matching error'),
      h('button', {
        'data-test': 'other-question-error',
        onClick: () => setError(questionIndex + 1),
      }, 'Set other question error'),
      h('button', {
        'data-test': 'clear-error',
        onClick: () => {
          backendErrors.value = {}
        },
      }, 'Clear error'),
      h('output', { 'data-test': 'show-error' }, String(showError.value)),
    ])
  },
})

const clickAndFlush = async (wrapper: ReturnType<typeof mount>, selector: string) => {
  await wrapper.get(selector).trigger('click')
  await flushPromises()
}

describe('useValidateAnswerBackend', () => {
  it('shows an existing backend error when the question mounts', async () => {
    const wrapper = mount(createValidationHarness(1, null, {
      'questions.1.answer_options': ['Select a valid answer option'],
    }))
    await flushPromises()

    expect(wrapper.get('[data-test="show-error"]').text()).toBe('true')
  })

  it('shows an error when the backend reports one for this unanswered question', async () => {
    const wrapper = mount(createValidationHarness(1))

    await clickAndFlush(wrapper, '[data-test="matching-error"]')

    expect(wrapper.get('[data-test="show-error"]').text()).toBe('true')
  })

  it('ignores backend errors belonging to another question', async () => {
    const wrapper = mount(createValidationHarness(1))

    await clickAndFlush(wrapper, '[data-test="other-question-error"]')

    expect(wrapper.get('[data-test="show-error"]').text()).toBe('false')
  })

  it.each([17, 'draft-answer'])(
    'does not show an answer-selection error when an option is selected (%s)',
    async (selectedAnswerOption) => {
      const wrapper = mount(createValidationHarness(1, selectedAnswerOption))

      await clickAndFlush(wrapper, '[data-test="matching-error"]')

      expect(wrapper.get('[data-test="show-error"]').text()).toBe('false')
    },
  )

  it('clears the answer-selection error when the backend error is cleared', async () => {
    const wrapper = mount(createValidationHarness(1))

    await clickAndFlush(wrapper, '[data-test="matching-error"]')
    expect(wrapper.get('[data-test="show-error"]').text()).toBe('true')

    await clickAndFlush(wrapper, '[data-test="clear-error"]')

    expect(wrapper.get('[data-test="show-error"]').text()).toBe('false')
  })
})
