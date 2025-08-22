# 基本信息组件
<template>
  <el-form :model="form" label-position="top">
    <!-- 基本信息 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <span class="text-red-500">*必填</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item 
            label="商品名称" 
            prop="generalInfo.productName"
            required
          >
            <el-input 
              v-model="form.generalInfo.productName"
              placeholder="请输入商品名称"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item 
            label="SKU" 
            prop="generalInfo.sku"
            required
          >
            <el-input 
              v-model="form.generalInfo.sku"
              placeholder="请输入商品SKU"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item 
            label="商品类型" 
            prop="generalInfo.type"
            required
          >
            <el-select 
              v-model="form.generalInfo.type"
              placeholder="请选择商品类型"
              style="width: 100%"
            >
              <el-option label="实物商品" value="Physical" />
              <el-option label="数字商品" value="Digital" />
              <el-option label="组合商品" value="Bundle" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item 
            label="品牌" 
            prop="generalInfo.brand"
          >
            <el-select
              v-model="form.generalInfo.brand"
              placeholder="请选择品牌"
              filterable
              allow-create
              style="width: 100%"
            >
              <el-option
                v-for="brand in brands"
                :key="brand"
                :label="brand"
                :value="brand"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item 
            label="商品状态" 
            prop="generalInfo.status"
            required
          >
            <el-select 
              v-model="form.generalInfo.status"
              placeholder="请选择商品状态"
              style="width: 100%"
            >
              <el-option label="草稿" value="Draft" />
              <el-option label="活跃" value="Active" />
              <el-option label="非活跃" value="Inactive" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item 
        label="商品类目" 
        prop="generalInfo.category"
        required
      >
        <el-cascader
          v-model="form.generalInfo.category"
          :options="categories"
          :props="{
            checkStrictly: false,
            emitPath: true,
            expandTrigger: 'hover'
          }"
          placeholder="请选择商品类目"
          style="width: 100%"
        />
      </el-form-item>
    </el-card>

    <!-- 图片视频 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>图片视频</span>
          <el-link type="primary" @click="openImageGuide">查看图片要求</el-link>
        </div>
      </template>

      <div class="upload-section">
        <div class="section-title">
          <span>主图</span>
          <span class="required">*</span>
          <span class="desc">（建议尺寸：800×800px，白底图）</span>
        </div>
        <el-upload
          v-model:file-list="mainImages"
          :action="uploadAction"
          list-type="picture-card"
          :limit="8"
          :before-upload="beforeUploadImage"
          :on-success="handleMainImageSuccess"
          :on-remove="handleMainImageRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </div>

      <div class="upload-section">
        <div class="section-title">
          <span>视频</span>
          <span class="desc">（最大60秒，MP4格式）</span>
        </div>
        <el-upload
          v-model:file-list="videoFiles"
          :action="uploadAction"
          :limit="1"
          :before-upload="beforeUploadVideo"
          :on-success="handleVideoSuccess"
          :on-remove="handleVideoRemove"
        >
          <el-button type="primary">
            <el-icon><VideoCamera /></el-icon>
            上传视频
          </el-button>
        </el-upload>
      </div>
    </el-card>

    <!-- 商品描述 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>商品描述</span>
        </div>
      </template>

      <div class="mb-4">
        <div class="section-title">
          <span>卖点</span>
          <span class="desc">（最多5条）</span>
        </div>
        <div class="bullet-points">
          <div
            v-for="(point, index) in form.descriptionInfo.bulletPoints"
            :key="index"
            class="mb-2"
          >
            <el-input
              v-model="form.descriptionInfo.bulletPoints[index]"
              :placeholder="'卖点 ' + (index + 1)"
              maxlength="200"
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
          <el-button
            v-if="(form.descriptionInfo.bulletPoints?.length || 0) < 5"
            type="primary"
            link
            @click="addBulletPoint"
          >
            <el-icon><Plus /></el-icon>
            添加卖点
          </el-button>
        </div>
      </div>

      <div>
        <div class="section-title">
          <span>详细描述</span>
        </div>
        <el-input
          v-model="form.descriptionInfo.description"
          type="textarea"
          :rows="10"
          placeholder="请输入商品描述..."
          maxlength="5000"
          show-word-limit
        />
      </div>
    </el-card>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '@/types/product';

const props = defineProps<{
  form: Product;
}>();

// 上传相关
const uploadAction = '/api/upload';
const mainImages = ref([]);
const videoFiles = ref([]);

// 品牌列表
const brands = [
  'Apple',
  'Samsung',
  'Huawei',
  'Xiaomi',
  'OPPO',
  'VIVO'
];

// 类目列表
const categories = [
  {
    value: 'electronics',
    label: '电子产品',
    children: [
      {
        value: 'phones',
        label: '手机',
        children: [
          {
            value: 'smartphone',
            label: '智能手机'
          }
        ]
      }
    ]
  }
];

// 图片上传前检查
function beforeUploadImage(file: File) {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB！');
    return false;
  }
  return true;
}

// 视频上传前检查
function beforeUploadVideo(file: File) {
  const isMP4 = file.type === 'video/mp4';
  const isLt100M = file.size / 1024 / 1024 < 100;

  if (!isMP4) {
    ElMessage.error('只能上传MP4格式视频！');
    return false;
  }
  if (!isLt100M) {
    ElMessage.error('视频大小不能超过100MB！');
    return false;
  }
  return true;
}

// 图片上传成功
function handleMainImageSuccess(response: any, file: any) {
  if (!props.form.mediaInfo.mainImages) {
    props.form.mediaInfo.mainImages = [];
  }
  props.form.mediaInfo.mainImages.push({
    url: response.url,
    isWhiteBackground: true,
    hasWatermark: false,
    sortOrder: props.form.mediaInfo.mainImages.length
  });
}

// 图片删除
function handleMainImageRemove(file: any) {
  const index = props.form.mediaInfo.mainImages.findIndex(img => img.url === file.url);
  if (index > -1) {
    props.form.mediaInfo.mainImages.splice(index, 1);
  }
}

// 视频上传成功
function handleVideoSuccess(response: any, file: any) {
  props.form.mediaInfo.video = {
    url: response.url,
    duration: 0 // TODO: 获取实际视频时长
  };
}

// 视频删除
function handleVideoRemove() {
  props.form.mediaInfo.video = undefined;
}

// 添加卖点
function addBulletPoint() {
  if (!props.form.descriptionInfo.bulletPoints) {
    props.form.descriptionInfo.bulletPoints = [];
  }
  if (props.form.descriptionInfo.bulletPoints.length < 5) {
    props.form.descriptionInfo.bulletPoints.push('');
  }
}

// 删除卖点
function removeBulletPoint(index: number) {
  props.form.descriptionInfo.bulletPoints?.splice(index, 1);
}

// 打开图片指南
function openImageGuide() {
  ElMessage.info('图片指南开发中...');
}
</script>

<style scoped lang="scss">
.mb-4 {
  margin-bottom: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  .required {
    color: #f56c6c;
  }

  .desc {
    color: #909399;
    font-size: 12px;
  }
}

.upload-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.bullet-points {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 120px;
}

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 120px;
}
</style>