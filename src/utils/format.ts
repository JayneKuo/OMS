/**
 * 格式化日期
 * @param date - ISO格式的日期字符串或Date对象
 * @param locale - 本地化设置，默认为中文
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | Date, locale: string = 'zh-CN'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 高亮文本中的关键词
 * @param text - 原始文本
 * @param keywords - 需要高亮的关键词
 * @returns 包含高亮HTML标记的文本
 */
export const highlightKeywords = (text: string, keywords: string): string => {
  if (!keywords.trim()) return text

  const pattern = keywords
    .trim()
    .split(/\s+/)
    .map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  
  return text.replace(
    new RegExp(`(${pattern})`, 'gi'),
    '<span class="highlight">$1</span>'
  )
}

/**
 * 格式化消息文本
 * @param text - 原始消息文本
 * @returns 格式化后的HTML文本
 */
export const formatMessage = (text: string): string => {
  // 将换行符转换为<br>标签
  let formatted = text.replace(/\n/g, '<br>')
  
  // 将URL转换为可点击的链接
  formatted = formatted.replace(
    /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  
  return formatted
} 