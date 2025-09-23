import type { Component } from 'vue'

export interface MenuItem {
  title: string
  path: string
  icon?: Component | string
  children?: MenuItem[]
  meta?: {
    activeMenu?: string
    [key: string]: any
  }
}

export interface Menu {
  path: string
  name: string
  icon?: string
  children?: Menu[]
} 