import type { Component } from 'vue'

export interface MenuItem {
  title: string
  path: string
  icon?: Component
  children?: MenuItem[]
}

export interface Menu {
  path: string
  name: string
  icon?: string
  children?: Menu[]
} 