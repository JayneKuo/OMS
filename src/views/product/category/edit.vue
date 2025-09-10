<template>
  <div class="category-edit-container">
    <page-header
      :title="isEdit ? '编辑分类' : '新增分类'"
      :back="{ name: 'ProductCategory' }"
    />

    <el-card class="edit-form">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="category-form"
      >
        <!-- 上级分类选择 -->
        <el-form-item label="上级分类">
          <div class="parent-category">
            <div class="selected-path">
              <template v-if="selectedPath.length">
                <el-tag 
                  v-for="(category, index) in selectedPath" 
                  :key="category.id"
                  :type="index === selectedPath.length - 1 ? 'primary' : ''"
                  class="path-tag"
                >
                  {{ category.name }}
                </el-tag>
              </template>
              <span v-else class="no-parent">顶级分类</span>
            </div>
            <el-button type="primary" link @click="selectParentVisible = true">
              选择上级分类
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类编码">
            <template #append>
              <el-button @click="generateCode">生成编码</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 选择上级分类对话框 -->
    <el-dialog
      v-model="selectParentVisible"
      title="选择上级分类"
      width="600px"
      destroy-on-close
    >
      <div class="category-tree">
        <div class="tree-search">
          <el-input
            v-model="searchQuery"
            placeholder="搜索分类"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="tree-content">
          <el-tree
            ref="treeRef"
            :data="categoryTree"
            :props="treeProps"
            :filter-node-method="filterNode"
            node-key="id"
            highlight-current
            @current-change="handleCategorySelect"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span class="level-tag">
                  <el-tag size="small" :type="getLevelType(data.level)">
                    {{ `${data.level}级` }}
                  </el-tag>
                </span>
              </div>
            </template>
          </el-tree>
        </div>

        <div class="selected-info" v-if="currentSelected">
          <div class="info-title">已选分类：</div>
          <div class="info-content">
            <div class="info-item">
              <span class="label">分类名称：</span>
              <span class="value">{{ currentSelected.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">当前层级：</span>
              <span class="value">{{ currentSelected.level }}级</span>
            </div>
            <div class="info-item">
              <span class="label">新建层级：</span>
              <span class="value">{{ currentSelected.level + 1 }}级</span>
              <el-tag 
                size="small" 
                :type="currentSelected.level >= 4 ? 'danger' : 'success'"
                class="level-warning"
              >
                {{ currentSelected.level >= 4 ? '已达到最大层级' : '可以创建子分类' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
          <span class="dialog-footer">
            <el-button @click="selectParentVisible = false">取消</el-button>
            <el-button
              type="primary"
              :disabled="!canSelectParent"
              @click="handleParentConfirm"
            >
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import type { LocalCategory } from '../types/category'
import { getCategoryTree, generateCategoryCode, checkCategoryCode, createCategory, getCategoryDetail, updateCategory } from '@/api/product/category'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

// 判断是否为编辑模式
const isEdit = computed(() => route.name === 'EditCategory')

// 表单数据
const form = ref({
  name: '',
  code: '',
  parentId: null as string | null,
  sort: 0,
  status: 'active' as 'active' | 'inactive',
  description: '',
  level: 1
})

// 表单校验规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[A-Z0-9-_]+$/, message: '只能包含大写字母、数字、横线和下划线', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序值', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 选择上级分类相关
const selectParentVisible = ref(false)
const searchQuery = ref('')
const categoryTree = ref<LocalCategory[]>([])
const currentSelected = ref<LocalCategory | null>(null)
const selectedPath = ref<LocalCategory[]>([])

const treeRef = ref()
const treeProps = {
  label: 'name',
  children: 'children'
}

// 是否可以选择当前分类作为父分类
const canSelectParent = computed(() => {
  if (!currentSelected.value) return false
  return currentSelected.value.level < 4 // 最多支持4级分类
})

// 获取层级类型
const getLevelType = (level: number) => {
  const types = ['', 'success', 'warning', 'danger', 'info']
  return types[level] || 'info'
}

// 过滤节点
const filterNode = (value: string, data: LocalCategory) => {
  if (!value) return true
  return data.name.toLowerCase().includes(value.toLowerCase())
}

// 监听搜索关键词变化
watch(searchQuery, (val) => {
  treeRef.value?.filter(val)
})

// 生成分类编码
const generateCode = async () => {
  if (!form.value.name) {
    ElMessage.warning('请先输入分类名称')
    return
  }
  try {
    const { data } = await generateCategoryCode(form.value.name)
    form.value.code = data.code
  } catch (error) {
    ElMessage.error('生成编码失败')
  }
}

// 处理分类选择
const handleCategorySelect = (data: LocalCategory) => {
  currentSelected.value = data
}

// 处理确认选择父分类
const handleParentConfirm = () => {
  if (!currentSelected.value || currentSelected.value.level >= 4) return
  
  // 更新父分类信息
  form.value.parentId = currentSelected.value.id
  form.value.level = currentSelected.value.level + 1
  
  // 构建选中路径
  const path = []
  let current = currentSelected.value
  while (current) {
    path.unshift(current)
    current = categoryTree.value.find(c => c.id === current.parentId) || null
  }
  selectedPath.value = path
  
  selectParentVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updateCategory(route.params.id as string, form.value)
          ElMessage.success('更新成功')
        } else {
          await createCategory(form.value)
          ElMessage.success('创建成功')
        }
        router.push({ name: 'ProductCategory' })
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      }
    }
  })
}

// 初始化
const init = async () => {
  try {
    // 加载分类树
    const { data } = await getCategoryTree()
    categoryTree.value = data

    // 编辑模式下加载分类详情
    if (isEdit.value && route.params.id) {
      const { data: detail } = await getCategoryDetail(route.params.id as string)
      Object.assign(form.value, detail)
      
      // 构建选中路径
      if (detail.parentId) {
        const path = []
        let current = detail
        while (current) {
          path.unshift(current)
          current = categoryTree.value.find(c => c.id === current.parentId) || null
        }
        selectedPath.value = path.slice(0, -1) // 不包含当前分类
      }
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

onMounted(init)
</script>

<style scoped lang="scss">
.category-edit-container {
  padding: 20px;

  .edit-form {
    margin-top: 20px;
    
    .category-form {
      max-width: 800px;
      margin: 0 auto;
    }
  }

  .parent-category {
    display: flex;
    align-items: center;
    gap: 16px;

    .selected-path {
      flex: 1;
      min-height: 32px;
      padding: 4px 8px;
      background-color: var(--el-fill-color-lighter);
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;

      .path-tag {
        cursor: default;
      }

      .no-parent {
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.category-tree {
  .tree-search {
    margin-bottom: 16px;
  }

  .tree-content {
    height: 300px;
    overflow-y: auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 8px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .selected-info {
    margin-top: 16px;
    padding: 12px;
    background-color: var(--el-fill-color-lighter);
    border-radius: 4px;

    .info-title {
      margin-bottom: 8px;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }

    .info-content {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          width: 100px;
          color: var(--el-text-color-secondary);
        }

        .value {
          flex: 1;
          color: var(--el-text-color-primary);
        }

        .level-warning {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>