<template>
  <div class="customer-tags">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>客户标签</span>
          <el-button type="primary" @click="handleAdd">新增标签</el-button>
        </div>
      </template>

      <div class="tag-list">
        <el-row :gutter="20">
          <el-col :span="8" v-for="tag in tagList" :key="tag.id">
            <div class="tag-item">
              <div class="tag-header">
                <el-tag
                  :color="tag.color"
                  style="color: #fff; border: none;"
                >{{ tag.name }}</el-tag>
                <div class="tag-actions">
                  <el-button type="primary" link @click="handleEdit(tag)">编辑</el-button>
                  <el-button type="danger" link @click="handleDelete(tag)">删除</el-button>
                </div>
              </div>
              <div class="tag-content">
                <p class="tag-desc">{{ tag.description || '暂无描述' }}</p>
                <div class="tag-info">
                  <span>创建时间：{{ tag.createTime }}</span>
                  <span>使用次数：{{ tag.useCount }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 新增/编辑标签对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标签颜色" prop="color">
          <el-color-picker v-model="form.color" show-alpha />
        </el-form-item>
        <el-form-item label="标签描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入标签描述"
          />
        </el-form-item>
        <el-form-item label="自动标记" prop="autoTag">
          <el-switch v-model="form.autoTag" />
        </el-form-item>
        <el-form-item
          v-if="form.autoTag"
          label="标记规则"
          prop="rules"
        >
          <el-select
            v-model="form.rules"
            multiple
            collapse-tags
            collapse-tags-tooltip
            style="width: 100%"
            placeholder="请选择标记规则"
          >
            <el-option-group label="消费相关">
              <el-option label="消费金额 > 10000" value="spend_gt_10000" />
              <el-option label="消费金额 > 5000" value="spend_gt_5000" />
              <el-option label="消费频率 > 每周1次" value="frequency_gt_weekly" />
            </el-option-group>
            <el-option-group label="行为相关">
              <el-option label="浏览商品 > 100次" value="view_gt_100" />
              <el-option label="加入收藏 > 50次" value="favorite_gt_50" />
              <el-option label="分享商品 > 10次" value="share_gt_10" />
            </el-option-group>
            <el-option-group label="账户相关">
              <el-option label="注册时间 > 1年" value="register_gt_1y" />
              <el-option label="积分 > 1000" value="points_gt_1000" />
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 标签列表数据
const tagList = ref([])
const loading = ref(false)

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const form = reactive({
  id: '',
  name: '',
  color: '#409EFF',
  description: '',
  autoTag: false,
  rules: []
})

// 表单校验规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  color: [{ required: true, message: '请选择标签颜色', trigger: 'change' }]
})

// 获取标签列表数据
const getTagList = async () => {
  loading.value = true
  try {
    // TODO: 调用后端API获取数据
    // const res = await api.getCustomerTagList()
    // tagList.value = res.data

    // 模拟数据
    tagList.value = [
      {
        id: '1',
        name: '高价值客户',
        color: '#67C23A',
        description: '消费金额超过10000的客户',
        createTime: '2024-01-01 12:00:00',
        useCount: 100,
        autoTag: true,
        rules: ['spend_gt_10000']
      },
      {
        id: '2',
        name: '忠实粉丝',
        color: '#E6A23C',
        description: '经常浏览和分享商品的客户',
        createTime: '2024-01-01 12:00:00',
        useCount: 200,
        autoTag: true,
        rules: ['view_gt_100', 'share_gt_10']
      },
      {
        id: '3',
        name: '新注册',
        color: '#409EFF',
        description: '最近30天内注册的新客户',
        createTime: '2024-01-01 12:00:00',
        useCount: 500,
        autoTag: false,
        rules: []
      }
    ]
  } catch (error) {
    console.error('获取标签列表失败:', error)
    ElMessage.error('获取标签列表失败')
  } finally {
    loading.value = false
  }
}

// 新增标签
const handleAdd = () => {
  dialogTitle.value = '新增标签'
  Object.keys(form).forEach(key => {
    form[key] = key === 'color' ? '#409EFF' : key === 'autoTag' ? false : key === 'rules' ? [] : ''
  })
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (tag: any) => {
  dialogTitle.value = '编辑标签'
  Object.keys(form).forEach(key => {
    form[key] = tag[key]
  })
  dialogVisible.value = true
}

// 删除标签
const handleDelete = (tag: any) => {
  ElMessageBox.confirm('确认删除该标签吗？删除后不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用后端API删除数据
      // await api.deleteCustomerTag(tag.id)
      ElMessage.success('删除成功')
      getTagList()
    } catch (error) {
      console.error('删除标签失败:', error)
      ElMessage.error('删除标签失败')
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用后端API保存数据
        // if (form.id) {
        //   await api.updateCustomerTag(form)
        // } else {
        //   await api.createCustomerTag(form)
        // }
        ElMessage.success(form.id ? '更新成功' : '创建成功')
        dialogVisible.value = false
        getTagList()
      } catch (error) {
        console.error('保存标签失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

onMounted(() => {
  getTagList()
})
</script>

<style scoped>
.customer-tags {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-list {
  margin-top: 20px;
}

.tag-item {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #fff;
  transition: all 0.3s;
}

.tag-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.tag-content {
  color: #606266;
}

.tag-desc {
  margin: 10px 0;
  font-size: 14px;
}

.tag-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}
</style>
