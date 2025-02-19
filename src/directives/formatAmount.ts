import type { DirectiveBinding } from 'vue'

const formatValue = (value: number): string => {
  const formatter = new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })

  if (value >= 1e8) {
    return formatter.format(value / 1e8) + '億'
  } else if (value >= 1e4) {
    return formatter.format(value / 1e4) + '萬'
  } else {
    return formatter.format(value)
  }
}

const vAmountFormat = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.innerText = formatValue(binding.value)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    el.innerText = formatValue(binding.value)
  }
}

export default vAmountFormat
