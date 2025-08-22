# 描述与属性部分组件
<template>
  <div class="section">
    <div class="section-header">
      <h3>描述与属性</h3>
      <el-tooltip content="基于类目动态显示的商品属性">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="section-body">
      <!-- 商品描述 -->
      <el-form-item
        label="商品描述"
        prop="descriptionInfo.description"
        class="description-item"
      >
        <div class="editor-container">
          <!-- 富文本编辑器工具栏 -->
          <div class="editor-toolbar">
            <el-button-group>
              <el-button
                v-for="(btn, index) in editorButtons"
                :key="index"
                :type="btn.active ? 'primary' : 'default'"
                @click="handleEditorCommand(btn.command)"
              >
                <el-icon>
                  <component :is="btn.icon" />
                </el-icon>
              </el-button>
            </el-button-group>
          </div>

          <!-- 富文本编辑器内容区 -->
          <div 
            class="editor-content"
            contenteditable="true"
            @input="handleEditorInput"
            @paste="handleEditorPaste"
            ref="editorRef"
          />

          <!-- 字数统计 -->
          <div class="editor-footer">
            <span class="word-count">
              {{ wordCount }} / 5000 字
            </span>
          </div>
        </div>
      </el-form-item>

      <!-- 卖点 -->
      <el-form-item
        label="卖点"
        prop="descriptionInfo.bulletPoints"
        class="bullet-points-item"
      >
        <div class="bullet-points-container">
          <div
            v-for="(point, index) in form.descriptionInfo.bulletPoints || []"
            :key="index"
            class="bullet-point-row"
          >
            <el-input
              v-model="form.descriptionInfo.bulletPoints[index]"
              :placeholder="'卖点 ' + (index + 1)"
              :maxlength="200"
              show-word-limit
            >
              <template #prepend>
                <el-tag round>{{ index + 1 }}</el-tag>
              </template>
              <template #append>
                <el-button
                  type="danger"
                  link
                  @click="removeBulletPoint(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>

          <div
            v-if="(form.descriptionInfo.bulletPoints?.length || 0) < 5"
            class="add-bullet-point"
          >
            <el-button
              type="primary"
              link
              @click="addBulletPoint"
            >
              <el-icon><Plus /></el-icon>
              添加卖点（还可添加 {{ 5 - (form.descriptionInfo.bulletPoints?.length || 0) }} 条）
            </el-button>
          </div>

          <div class="bullet-points-tip">
            建议添加3-5条突出商品特点的卖点描述
          </div>
        </div>
      </el-form-item>

      <!-- 类目属性 -->
      <template v-if="currentCategoryAttributes && currentCategoryAttributes.length > 0">
        <el-divider>类目属性</el-divider>
        
        <div class="category-attributes">
          <el-form-item
            v-for="attr in currentCategoryAttributes"
            :key="attr.name"
            :label="attr.name"
            :prop="'descriptionInfo.categoryAttributes.' + attr.name + '.value'"
            :required="attr.required"
            class="attribute-item"
          >
            <!-- 文本输入 -->
            <template v-if="attr.type === 'text'">
              <el-input
                :model-value="getCategoryAttributeValue(attr.name)"
                @update:model-value="(val) => updateCategoryAttribute(attr.name, val)"
                :placeholder="'请输入' + attr.name"
              />
            </template>

            <!-- 数字输入 -->
            <template v-else-if="attr.type === 'number'">
              <el-input-number
                :model-value="getCategoryAttributeValue(attr.name)"
                @update:model-value="(val) => updateCategoryAttribute(attr.name, val)"
                :min="attr.validation?.min"
                :max="attr.validation?.max"
                :step="1"
                style="width: 100%"
              >
                <template #append v-if="attr.unit">
                  {{ attr.unit }}
                </template>
              </el-input-number>
            </template>

            <!-- 单选 -->
            <template v-else-if="attr.type === 'select'">
              <el-select
                :model-value="getCategoryAttributeValue(attr.name)"
                @update:model-value="(val) => updateCategoryAttribute(attr.name, val)"
                :placeholder="'请选择' + attr.name"
                style="width: 100%"
              >
                <el-option
                  v-for="option in attr.options"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>
            </template>

            <!-- 多选 -->
            <template v-else-if="attr.type === 'multiSelect'">
              <el-select
                :model-value="getCategoryAttributeValue(attr.name)"
                @update:model-value="(val) => updateCategoryAttribute(attr.name, val)"
                multiple
                :placeholder="'请选择' + attr.name"
                style="width: 100%"
              >
                <el-option
                  v-for="option in attr.options"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>
            </template>

            <!-- 属性说明 -->
            <div 
              v-if="attr.validation?.pattern" 
              class="attribute-tip"
            >
              格式要求：{{ attr.validation.pattern }}
            </div>
          </el-form-item>
        </div>
      </template>

      <!-- 未选择类目时的提示 -->
      <template v-else>
        <el-empty description="请先选择商品类目以加载对应的属性">
          <template #image>
            <el-icon style="font-size: 48px"><Connection /></el-icon>
          </template>
        </el-empty>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product, CategoryAttributeValue } from '@/types/product';

const props = defineProps<{
  form: Product;
}>();

// 富文本编辑器相关
const editorRef = ref<HTMLElement>();
const editorButtons = [
  { icon: 'Bold', command: 'bold', active: false },
  { icon: 'Italic', command: 'italic', active: false },
  { icon: 'List', command: 'insertUnorderedList', active: false },
  { icon: 'Link', command: 'createLink', active: false },
  { icon: 'Picture', command: 'insertImage', active: false }
];

// 字数统计
const wordCount = computed(() => {
  if (!editorRef.value) return 0;
  return editorRef.value.innerText.length;
});

// 编辑器命令处理
function handleEditorCommand(command: string) {
  document.execCommand(command, false);
  // 更新按钮状态
  editorButtons.forEach(btn => {
    btn.active = document.queryCommandState(btn.command);
  });
}

// 编辑器输入处理
function handleEditorInput(e: Event) {
  const content = (e.target as HTMLElement).innerHTML;
  props.form.descriptionInfo.description = content;
}

// 编辑器粘贴处理
function handleEditorPaste(e: ClipboardEvent) {
  e.preventDefault();
  const text = e.clipboardData?.getData('text/plain') || '';
  document.execCommand('insertText', false, text);
}

// 卖点相关
function addBulletPoint() {
  if (!props.form.descriptionInfo.bulletPoints) {
    props.form.descriptionInfo.bulletPoints = [];
  }
  if (props.form.descriptionInfo.bulletPoints.length < 5) {
    props.form.descriptionInfo.bulletPoints.push('');
  }
}

function removeBulletPoint(index: number) {
  if (props.form.descriptionInfo.bulletPoints) {
    props.form.descriptionInfo.bulletPoints.splice(index, 1);
  }
}

// 类目属性相关
const currentCategoryAttributes = computed(() => {
  // 模拟数据，实际应该根据选择的类目动态加载
  return [
    {
      name: '颜色',
      type: 'select' as const,
      required: true,
      options: ['红色', '蓝色', '黑色', '白色']
    },
    {
      name: '尺码',
      type: 'multiSelect' as const,
      required: true,
      options: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      name: '材质',
      type: 'text' as const,
      required: true,
      validation: {
        pattern: '请输入主要材质成分，例：95%棉 5%氨纶'
      }
    },
    {
      name: '重量',
      type: 'number' as const,
      required: true,
      unit: 'g',
      validation: {
        min: 0,
        max: 10000
      }
    }
  ];
});

// 获取类目属性值
function getCategoryAttributeValue(name: string): CategoryAttributeValue {
  const attr = props.form.descriptionInfo.categoryAttributes[name];
  if (!attr) {
    return '';
  }
  return attr.value;
}

// 更新类目属性值
function updateCategoryAttribute(name: string, value: CategoryAttributeValue) {
  if (!props.form.descriptionInfo.categoryAttributes[name]) {
    props.form.descriptionInfo.categoryAttributes[name] = {
      name,
      value: '',
      required: false,
      type: 'text'
    };
  }
  props.form.descriptionInfo.categoryAttributes[name].value = value;
}
</script>

<style scoped>
/* 样式保持不变 */
</style>