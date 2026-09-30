import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { useTestValidator } from '@/composables/validatorComposables/useTestValidator'

describe('useTestValidator', () => {
  it('returns false without a mounted form and leaves backend errors untouched', async () => {
    const backendValidationErrors = { title: ['Title is required'] }
    const { validateTest } = useTestValidator(
      ref<FormInstance | undefined>(undefined),
      backendValidationErrors,
    )

    await expect(validateTest()).resolves.toBe(false)
    expect(backendValidationErrors).toEqual({ title: ['Title is required'] })
  })

  it('clears old errors before running valid form validation', async () => {
    const callOrder: string[] = []
    const clearValidate = vi.fn(() => callOrder.push('clear'))
    const validate = vi.fn<() => Promise<boolean>>().mockImplementation(async () => {
      callOrder.push('validate')
      return true
    })
    const form = { clearValidate, validate } as unknown as FormInstance
    const backendValidationErrors = { title: ['Old backend error'] }
    const { validateTest } = useTestValidator(ref(form), backendValidationErrors)

    await expect(validateTest()).resolves.toBe(true)

    expect(backendValidationErrors).toEqual({})
    expect(clearValidate).toHaveBeenCalledOnce()
    expect(validate).toHaveBeenCalledOnce()
    expect(callOrder).toEqual(['clear', 'validate'])
  })

  it('returns false when Element Plus reports invalid fields', async () => {
    const validate = vi.fn<() => Promise<boolean>>().mockResolvedValue(false)
    const form = { clearValidate: vi.fn(), validate } as unknown as FormInstance
    const backendValidationErrors = { description: ['Old backend error'] }
    const { validateTest } = useTestValidator(ref(form), backendValidationErrors)

    await expect(validateTest()).resolves.toBe(false)

    expect(backendValidationErrors).toEqual({})
    expect(form.clearValidate).toHaveBeenCalledOnce()
  })

  it('returns false when Element Plus validation rejects', async () => {
    const validate = vi.fn<() => Promise<boolean>>().mockRejectedValue(new Error('Validation failed'))
    const form = { clearValidate: vi.fn(), validate } as unknown as FormInstance
    const { validateTest } = useTestValidator(ref(form), {})

    await expect(validateTest()).resolves.toBe(false)
    expect(form.clearValidate).toHaveBeenCalledOnce()
  })
})
