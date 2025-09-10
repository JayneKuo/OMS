import type { LocalCategory } from '../types/category'

// 服装品类的预设分类数据
export const defaultCategories: LocalCategory[] = [
  {
    id: '1',
    name: '女装',
    code: 'WOMEN',
    parentId: null,
    level: 1,
    path: '/女装',
    sort: 1,
    status: 'active',
    source: 'local',
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
    operator: 'system',
    children: [
      {
        id: '1-1',
        name: '上装',
        code: 'WOMEN_TOP',
        parentId: '1',
        level: 2,
        path: '/女装/上装',
        sort: 1,
        status: 'active',
        source: 'local',
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z',
        operator: 'system',
        children: [
          {
            id: '1-1-1',
            name: 'T恤',
            code: 'WOMEN_TSHIRT',
            parentId: '1-1',
            level: 3,
            path: '/女装/上装/T恤',
            sort: 1,
            status: 'active',
            source: 'local',
            createTime: '2024-01-01T00:00:00Z',
            updateTime: '2024-01-01T00:00:00Z',
            operator: 'system',
            children: [
              {
                id: '1-1-1-1',
                name: '短袖T恤',
                code: 'WOMEN_TSHIRT_SHORT',
                parentId: '1-1-1',
                level: 4,
                path: '/女装/上装/T恤/短袖T恤',
                sort: 1,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              },
              {
                id: '1-1-1-2',
                name: '长袖T恤',
                code: 'WOMEN_TSHIRT_LONG',
                parentId: '1-1-1',
                level: 4,
                path: '/女装/上装/T恤/长袖T恤',
                sort: 2,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              }
            ]
          },
          {
            id: '1-1-2',
            name: '衬衫',
            code: 'WOMEN_SHIRT',
            parentId: '1-1',
            level: 3,
            path: '/女装/上装/衬衫',
            sort: 2,
            status: 'active',
            source: 'local',
            createTime: '2024-01-01T00:00:00Z',
            updateTime: '2024-01-01T00:00:00Z',
            operator: 'system',
            children: [
              {
                id: '1-1-2-1',
                name: '短袖衬衫',
                code: 'WOMEN_SHIRT_SHORT',
                parentId: '1-1-2',
                level: 4,
                path: '/女装/上装/衬衫/短袖衬衫',
                sort: 1,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              },
              {
                id: '1-1-2-2',
                name: '长袖衬衫',
                code: 'WOMEN_SHIRT_LONG',
                parentId: '1-1-2',
                level: 4,
                path: '/女装/上装/衬衫/长袖衬衫',
                sort: 2,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              }
            ]
          }
        ]
      },
      {
        id: '1-2',
        name: '下装',
        code: 'WOMEN_BOTTOM',
        parentId: '1',
        level: 2,
        path: '/女装/下装',
        sort: 2,
        status: 'active',
        source: 'local',
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z',
        operator: 'system',
        children: [
          {
            id: '1-2-1',
            name: '裤装',
            code: 'WOMEN_PANTS',
            parentId: '1-2',
            level: 3,
            path: '/女装/下装/裤装',
            sort: 1,
            status: 'active',
            source: 'local',
            createTime: '2024-01-01T00:00:00Z',
            updateTime: '2024-01-01T00:00:00Z',
            operator: 'system',
            children: [
              {
                id: '1-2-1-1',
                name: '牛仔裤',
                code: 'WOMEN_JEANS',
                parentId: '1-2-1',
                level: 4,
                path: '/女装/下装/裤装/牛仔裤',
                sort: 1,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              },
              {
                id: '1-2-1-2',
                name: '休闲裤',
                code: 'WOMEN_CASUAL_PANTS',
                parentId: '1-2-1',
                level: 4,
                path: '/女装/下装/裤装/休闲裤',
                sort: 2,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              }
            ]
          },
          {
            id: '1-2-2',
            name: '裙装',
            code: 'WOMEN_SKIRTS',
            parentId: '1-2',
            level: 3,
            path: '/女装/下装/裙装',
            sort: 2,
            status: 'active',
            source: 'local',
            createTime: '2024-01-01T00:00:00Z',
            updateTime: '2024-01-01T00:00:00Z',
            operator: 'system',
            children: [
              {
                id: '1-2-2-1',
                name: '短裙',
                code: 'WOMEN_SHORT_SKIRT',
                parentId: '1-2-2',
                level: 4,
                path: '/女装/下装/裙装/短裙',
                sort: 1,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              },
              {
                id: '1-2-2-2',
                name: '长裙',
                code: 'WOMEN_LONG_SKIRT',
                parentId: '1-2-2',
                level: 4,
                path: '/女装/下装/裙装/长裙',
                sort: 2,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '男装',
    code: 'MEN',
    parentId: null,
    level: 1,
    path: '/男装',
    sort: 2,
    status: 'active',
    source: 'local',
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-01-01T00:00:00Z',
    operator: 'system',
    children: [
      {
        id: '2-1',
        name: '上装',
        code: 'MEN_TOP',
        parentId: '2',
        level: 2,
        path: '/男装/上装',
        sort: 1,
        status: 'active',
        source: 'local',
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z',
        operator: 'system',
        children: [
          {
            id: '2-1-1',
            name: 'T恤',
            code: 'MEN_TSHIRT',
            parentId: '2-1',
            level: 3,
            path: '/男装/上装/T恤',
            sort: 1,
            status: 'active',
            source: 'local',
            createTime: '2024-01-01T00:00:00Z',
            updateTime: '2024-01-01T00:00:00Z',
            operator: 'system',
            children: [
              {
                id: '2-1-1-1',
                name: '短袖T恤',
                code: 'MEN_TSHIRT_SHORT',
                parentId: '2-1-1',
                level: 4,
                path: '/男装/上装/T恤/短袖T恤',
                sort: 1,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              },
              {
                id: '2-1-1-2',
                name: '长袖T恤',
                code: 'MEN_TSHIRT_LONG',
                parentId: '2-1-1',
                level: 4,
                path: '/男装/上装/T恤/长袖T恤',
                sort: 2,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              }
            ]
          }
        ]
      },
      {
        id: '2-2',
        name: '下装',
        code: 'MEN_BOTTOM',
        parentId: '2',
        level: 2,
        path: '/男装/下装',
        sort: 2,
        status: 'active',
        source: 'local',
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z',
        operator: 'system',
        children: [
          {
            id: '2-2-1',
            name: '裤装',
            code: 'MEN_PANTS',
            parentId: '2-2',
            level: 3,
            path: '/男装/下装/裤装',
            sort: 1,
            status: 'active',
            source: 'local',
            createTime: '2024-01-01T00:00:00Z',
            updateTime: '2024-01-01T00:00:00Z',
            operator: 'system',
            children: [
              {
                id: '2-2-1-1',
                name: '牛仔裤',
                code: 'MEN_JEANS',
                parentId: '2-2-1',
                level: 4,
                path: '/男装/下装/裤装/牛仔裤',
                sort: 1,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              },
              {
                id: '2-2-1-2',
                name: '休闲裤',
                code: 'MEN_CASUAL_PANTS',
                parentId: '2-2-1',
                level: 4,
                path: '/男装/下装/裤装/休闲裤',
                sort: 2,
                status: 'active',
                source: 'local',
                createTime: '2024-01-01T00:00:00Z',
                updateTime: '2024-01-01T00:00:00Z',
                operator: 'system'
              }
            ]
          }
        ]
      }
    ]
  }
]

// 扁平化分类列表
export const flattenCategories = (categories: LocalCategory[]): LocalCategory[] => {
  const result: LocalCategory[] = []
  const flatten = (items: LocalCategory[]) => {
    items.forEach(item => {
      const { children, ...rest } = item
      result.push(rest)
      if (children?.length) {
        flatten(children)
      }
    })
  }
  flatten(categories)
  return result
}

// 获取分类统计数据
export const getCategoryStatistics = () => {
  const flatList = flattenCategories(defaultCategories)
  return {
    total: flatList.length,
    mapped: 0,
    unmapped: flatList.length,
    pending: 0,
    byPlatform: {
      shein: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
      amazon: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
      shopify: { total: 0, mapped: 0, unmapped: 0, pending: 0 },
      local: { total: flatList.length, mapped: 0, unmapped: flatList.length, pending: 0 }
    },
    byStatus: {
      active: flatList.length,
      inactive: 0,
      pending: 0,
      deleted: 0
    },
    lastSyncTime: new Date().toISOString(),
    syncStatus: 'success'
  }
}