import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { describe, expect, it } from 'vitest'

const Counter = defineComponent({
  setup() {
    const count = ref(0)

    return () => h(
      'button',
      { type: 'button', onClick: () => count.value++ },
      String(count.value),
    )
  },
})

describe('Vue unit test setup', () => {
  it('mounts a component and handles interaction', async () => {
    const wrapper = mount(Counter)

    expect(wrapper.text()).toBe('0')

    await wrapper.trigger('click')

    expect(wrapper.text()).toBe('1')
  })
})
