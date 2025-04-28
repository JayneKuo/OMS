<template>
  <div class="template-editor">
    <el-form :model="formData" label-position="top">
      <el-form-item label="模板名称">
        <el-input v-model="formData.name" placeholder="输入模板名称" />
      </el-form-item>
      
      <el-form-item label="模板描述">
        <el-input 
          v-model="formData.description" 
          type="textarea" 
          :rows="3"
          placeholder="描述该模板的用途和特点" 
        />
      </el-form-item>
      
      <el-form-item label="模板类型">
        <el-radio-group v-model="formData.templateType">
          <el-radio label="business">业务场景模板</el-radio>
          <el-radio label="processing">处理配置模板</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="所属分类">
        <el-select v-model="formData.category" placeholder="选择分类">
          <el-option label="仓储" value="仓储" />
          <el-option label="物流" value="物流" />
          <el-option label="电商" value="电商" />
          <el-option label="财务" value="财务" />
          <el-option label="客户服务" value="客户服务" />
          <el-option label="内容处理" value="内容处理" />
          <el-option label="数据分析" value="数据分析" />
          <el-option label="通用" value="通用" />
          <el-option label="自定义" value="自定义" />
        </el-select>
      </el-form-item>
      
      <!-- 业务场景模板特有字段 -->
      <template v-if="formData.templateType === 'business'">
        <el-form-item label="业务类型">
          <el-select v-model="formData.type" placeholder="选择业务类型">
            <el-option label="标准" value="标准" />
            <el-option label="流程" value="流程" />
            <el-option label="知识库" value="知识库" />
            <el-option label="表单" value="表单" />
            <el-option label="自定义" value="自定义" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="业务场景配置">
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>业务场景配置项</span>
                <el-button type="primary" link @click="addConfigField('business')">
                  添加配置项
                </el-button>
              </div>
            </template>
            
            <div v-for="(field, index) in businessConfigFields" :key="index" class="config-field">
              <div class="field-header">
                <el-input v-model="field.name" placeholder="配置项名称" class="field-name" />
                <el-button type="danger" link @click="removeConfigField('business', index)">
                  删除
                </el-button>
              </div>
              <el-input 
                v-model="field.description" 
                placeholder="配置项描述" 
                class="field-description" 
              />
              <el-select v-model="field.type" placeholder="字段类型" class="field-type">
                <el-option label="文本" value="text" />
                <el-option label="数字" value="number" />
                <el-option label="布尔" value="boolean" />
                <el-option label="日期" value="date" />
                <el-option label="选择" value="select" />
                <el-option label="多选" value="multiselect" />
              </el-select>
              
              <div v-if="field.type === 'select' || field.type === 'multiselect'" class="field-options">
                <div class="options-header">
                  <span>选项列表</span>
                  <el-button type="primary" link @click="addOption(field)">
                    添加选项
                  </el-button>
                </div>
                <div v-for="(option, optIndex) in field.options" :key="optIndex" class="option-item">
                  <el-input v-model="option.label" placeholder="选项名称" class="option-label" />
                  <el-input v-model="option.value" placeholder="选项值" class="option-value" />
                  <el-button type="danger" link @click="removeOption(field, optIndex)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-form-item>
      </template>
      
      <!-- 处理配置模板特有字段 -->
      <template v-else>
        <el-form-item label="处理模式">
          <el-select v-model="formData.processingMode" placeholder="选择处理模式">
            <el-option label="摘要" value="摘要" />
            <el-option label="问答" value="问答" />
            <el-option label="关键点" value="关键点" />
            <el-option label="分析" value="分析" />
            <el-option label="对比" value="对比" />
            <el-option label="合并" value="合并" />
            <el-option label="自定义" value="自定义" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="处理配置">
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>处理配置项</span>
                <el-button type="primary" link @click="addConfigField('processing')">
                  添加配置项
                </el-button>
              </div>
            </template>
            
            <div v-for="(field, index) in processingConfigFields" :key="index" class="config-field">
              <div class="field-header">
                <el-input v-model="field.name" placeholder="配置项名称" class="field-name" />
                <el-button type="danger" link @click="removeConfigField('processing', index)">
                  删除
                </el-button>
              </div>
              <el-input 
                v-model="field.description" 
                placeholder="配置项描述" 
                class="field-description" 
              />
              <el-select v-model="field.type" placeholder="字段类型" class="field-type">
                <el-option label="文本" value="text" />
                <el-option label="数字" value="number" />
                <el-option label="布尔" value="boolean" />
                <el-option label="日期" value="date" />
                <el-option label="选择" value="select" />
                <el-option label="多选" value="multiselect" />
                <el-option label="滑块" value="slider" />
                <el-option label="开关" value="switch" />
              </el-select>
              
              <div v-if="field.type === 'select' || field.type === 'multiselect'" class="field-options">
                <div class="options-header">
                  <span>选项列表</span>
                  <el-button type="primary" link @click="addOption(field)">
                    添加选项
                  </el-button>
                </div>
                <div v-for="(option, optIndex) in field.options" :key="optIndex" class="option-item">
                  <el-input v-model="option.label" placeholder="选项名称" class="option-label" />
                  <el-input v-model="option.value" placeholder="选项值" class="option-value" />
                  <el-button type="danger" link @click="removeOption(field, optIndex)">
                    删除
                  </el-button>
                </div>
              </div>
              
              <div v-if="field.type === 'slider'" class="slider-config">
                <el-input-number v-model="field.min" :min="0" placeholder="最小值" />
                <el-input-number v-model="field.max" :min="1" placeholder="最大值" />
                <el-input-number v-model="field.step" :min="1" placeholder="步长" />
              </div>
            </div>
          </el-card>
        </el-form-item>
      </template>
    </el-form>
    
    <div class="action-buttons">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存模板</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

// 定义配置字段选项类型
interface FieldOption {
  label: string;
  value: string;
}

// 定义配置字段类型
interface ConfigField {
  name: string;
  description: string;
  type: string;
  required: boolean;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
}

// 定义配置类型
interface TemplateConfig {
  fields: ConfigField[];
  [key: string]: any;
}

// 定义模板类型
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type?: string;
  processingMode?: string;
  config: TemplateConfig;
  createTime?: string;
  updateTime?: string;
  creator?: string;
}

// 组件接收的props
const props = defineProps({
  template: {
    type: Object,
    required: true
  }
})

// 组件触发的事件
const emit = defineEmits(['save', 'cancel'])

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  description: '',
  templateType: 'business', // business 或 processing
  category: '通用',
  type: '',
  processingMode: '',
  config: {}
})

// 业务配置字段
const businessConfigFields = ref<ConfigField[]>([])

// 处理配置字段
const processingConfigFields = ref<ConfigField[]>([])

// 在组件挂载时初始化表单数据
onMounted(() => {
  // 复制模板数据到表单
  formData.id = props.template.id
  formData.name = props.template.name
  formData.description = props.template.description
  formData.category = props.template.category
  
  // 判断模板类型
  if (props.template.processingMode) {
    formData.templateType = 'processing'
    formData.processingMode = props.template.processingMode
    
    // 初始化处理配置字段
    if (props.template.config && props.template.config.fields) {
      processingConfigFields.value = [...props.template.config.fields]
    } else {
      processingConfigFields.value = []
    }
  } else {
    formData.templateType = 'business'
    formData.type = props.template.type || '标准'
    
    // 初始化业务配置字段
    if (props.template.config && props.template.config.fields) {
      businessConfigFields.value = [...props.template.config.fields]
    } else {
      businessConfigFields.value = []
    }
  }
})

// 添加配置字段
const addConfigField = (type: 'business' | 'processing') => {
  const newField: ConfigField = {
    name: '',
    description: '',
    type: 'text',
    required: false,
    options: []
  }
  
  if (type === 'business') {
    businessConfigFields.value.push(newField)
  } else {
    processingConfigFields.value.push(newField)
  }
}

// 移除配置字段
const removeConfigField = (type: 'business' | 'processing', index: number) => {
  if (type === 'business') {
    businessConfigFields.value.splice(index, 1)
  } else {
    processingConfigFields.value.splice(index, 1)
  }
}

// 添加选项
const addOption = (field: ConfigField) => {
  if (!field.options) {
    field.options = []
  }
  field.options.push({ label: '', value: '' })
}

// 移除选项
const removeOption = (field: ConfigField, index: number) => {
  if (field.options) {
    field.options.splice(index, 1)
  }
}

// 取消编辑
const cancel = () => {
  emit('cancel')
}

// 保存模板
const save = () => {
  // 构建保存的模板对象
  const template: Template = {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    category: formData.category,
    config: { fields: [] }
  }
  
  // 根据模板类型设置特定属性
  if (formData.templateType === 'business') {
    template.type = formData.type
    template.config = {
      fields: businessConfigFields.value
    }
  } else {
    template.processingMode = formData.processingMode
    template.config = {
      fields: processingConfigFields.value
    }
  }
  
  // 更新时间
  template.updateTime = new Date().toISOString()
  
  // 发送保存事件
  emit('save', template)
}
</script>

<style lang="scss" scoped>
.template-editor {
  padding: 20px 0;
  
  .config-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .config-field {
      margin-bottom: 16px;
      padding: 16px;
      border: 1px solid var(--el-border-color);
      border-radius: 4px;
      
      .field-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      
      .field-name {
        flex: 1;
        margin-right: 10px;
      }
      
      .field-description {
        margin-bottom: 12px;
      }
      
      .field-type {
        width: 100%;
        margin-bottom: 12px;
      }
      
      .field-options {
        margin-top: 12px;
        padding: 12px;
        background-color: var(--el-fill-color-light);
        border-radius: 4px;
        
        .options-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .option-item {
          display: flex;
          margin-bottom: 8px;
          
          .option-label,
          .option-value {
            flex: 1;
            margin-right: 8px;
          }
        }
      }
      
      .slider-config {
        display: flex;
        gap: 10px;
        margin-top: 12px;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    gap: 12px;
  }
}
</style> 