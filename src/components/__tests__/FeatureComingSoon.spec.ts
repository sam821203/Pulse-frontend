import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FeatureComingSoon from '../FeatureComingSoon.vue'

describe('FeatureComingSoon', () => {
  it('renders default title and subtitle', () => {
    const wrapper = mount(FeatureComingSoon, {
      props: {
        icon: 'pi pi-chart-line',
        subtitle: '技術分析即將推出，敬請期待。'
      }
    })

    expect(wrapper.text()).toContain('功能開發中')
    expect(wrapper.text()).toContain('技術分析即將推出，敬請期待。')
    expect(wrapper.find('i').classes()).toContain('pi-chart-line')
  })

  it('renders custom title when provided', () => {
    const wrapper = mount(FeatureComingSoon, {
      props: {
        icon: 'pi pi-users',
        title: '籌碼分析',
        subtitle: '敬請期待'
      }
    })

    expect(wrapper.text()).toContain('籌碼分析')
    expect(wrapper.text()).not.toContain('功能開發中')
  })
})
