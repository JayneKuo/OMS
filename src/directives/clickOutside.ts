import type { Directive } from 'vue'

export const vClickOutside: Directive = {
  mounted(el, binding) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el._clickOutside)
  },
  beforeUnmount(el) {
    document.body.removeEventListener('click', el._clickOutside)
  }
} 