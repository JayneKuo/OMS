import type { Component } from 'vue'

export interface MenuItem {
  title: string
  path: string
  icon?: Component
  children?: MenuItem[]
} 