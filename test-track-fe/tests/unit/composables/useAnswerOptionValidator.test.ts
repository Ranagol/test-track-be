import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, ref, toRef, type PropType } from 'vue'
import { describe, expect, it } from 'vitest'
import { useValidateAnswerOnTakeTest } from '@/composables/answerOptionListComposables/useValidateAnswerOnTakeTest'
import { useAnswerOptionValidator } from '@/composables/validatorComposables/useAnswerOptionValidator'

const AnswerValidationProbe = defineComponent({
  props: {
    selectedAnswerOption: {
      type: Number as PropType<number | null>,
      default: null,
    },
  },
  emits: ['showError'],
  setup(props, { emit }) {
    useValidateAnswerOnTakeTest(
      toRef(props, 'selectedAnswerOption'),
      (showError) => emit('showError', showError),
    )

    return () => h('div')
  },
})

const createValidationHarness = (initialAnswers: Array<number | null>) =>
  defineComponent({
    setup() {
      const selectedAnswers = ref([...initialAnswers])
      const showErrors = ref(initialAnswers.map(() => false))
      const validationResult = ref<boolean | null>(null)
      const { validateSelectAnswerOptions } = useAnswerOptionValidator()

      const validate = async () => {
        validationResult.value = await validateSelectAnswerOptions()
      }

      return () => {
        const answerProbes = selectedAnswers.value.flatMap((selectedAnswer, index) => [
          h(AnswerValidationProbe, {
            key: `probe-${index}`,
            selectedAnswerOption: selectedAnswer,
            onShowError: (showError: boolean) => {
              showErrors.value[index] = showError
            },
          }),
          h('button', {
            key: `answer-${index}`,
            'data-test': `answer-${index}`,
            onClick: () => {
              selectedAnswers.value[index] = index + 1
            },
          }, 'Select answer'),
        ])

        return h('div', [
          ...answerProbes,
          h('button', { 'data-test': 'validate', onClick: validate }, 'Validate'),
          h('output', { 'data-test': 'validation-result' }, String(validationResult.value)),
          ...showErrors.value.map((showError, index) =>
            h('output', { 'data-test': `error-${index}` }, String(showError)),
          ),
        ])
      }
    },
  })

const validate = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get('[data-test="validate"]').trigger('click')
  await flushPromises()
}

describe('useAnswerOptionValidator', () => {
  it('passes when every question has a selected answer', async () => {
    const wrapper = mount(createValidationHarness([12, 25]))

    await validate(wrapper)

    expect(wrapper.get('[data-test="validation-result"]').text()).toBe('true')
    expect(wrapper.get('[data-test="error-0"]').text()).toBe('false')
    expect(wrapper.get('[data-test="error-1"]').text()).toBe('false')
  })

  it('blocks submission and marks only unanswered questions', async () => {
    const wrapper = mount(createValidationHarness([12, null, null]))

    await validate(wrapper)

    expect(wrapper.get('[data-test="validation-result"]').text()).toBe('false')
    expect(wrapper.get('[data-test="error-0"]').text()).toBe('false')
    expect(wrapper.get('[data-test="error-1"]').text()).toBe('true')
    expect(wrapper.get('[data-test="error-2"]').text()).toBe('true')
  })

  it('passes on a new validation cycle after the missing answer is supplied', async () => {
    const wrapper = mount(createValidationHarness([12, null]))

    await validate(wrapper)
    expect(wrapper.get('[data-test="validation-result"]').text()).toBe('false')

    await wrapper.get('[data-test="answer-1"]').trigger('click')
    await validate(wrapper)

    expect(wrapper.get('[data-test="validation-result"]').text()).toBe('true')
  })
})