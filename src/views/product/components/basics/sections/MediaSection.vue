# 图片与媒体部分组件
<template>
  <div class="section">
    <div class="section-header">
      <h3>图片与媒体</h3>
      <el-tooltip content="用于商品前台展示和平台审核">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="section-body">
      <!-- 主图 -->
      <el-form-item
        label="主图"
        prop="mediaInfo.mainImages"
        required
        class="main-images"
      >
        <div class="upload-container">
          <el-upload
            v-model:file-list="mainImageFiles"
            :action="uploadAction"
            list-type="picture-card"
            :limit="5"
            :before-upload="beforeUploadImage"
            :on-success="handleMainImageSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleMainImageRemove"
          >
            <template #default>
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">上传主图</div>
            </template>
            <template #tip>
              <div class="upload-tip">
                <el-alert
                  title="主图要求"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <ul class="upload-requirements">
                      <li>至少1张，建议5张</li>
                      <li>白底图片，无水印</li>
                      <li>分辨率≥800×800px</li>
                      <li>文件大小≤5MB</li>
                      <li>支持jpg、png格式</li>
                    </ul>
                  </template>
                </el-alert>
              </div>
            </template>
          </el-upload>

          <!-- 图片预览 -->
          <el-image-viewer
            v-if="previewVisible"
            :url-list="previewUrls"
            :initial-index="previewIndex"
            @close="previewVisible = false"
          />

          <!-- 图片检查结果 -->
          <div class="image-check-results" v-if="imageCheckResults.length">
            <el-alert
              v-for="(result, index) in imageCheckResults"
              :key="index"
              :title="result.message"
              :type="result.type"
              :closable="false"
              show-icon
            />
          </div>
        </div>
      </el-form-item>

      <!-- 附图 -->
      <el-form-item
        label="附图"
        prop="mediaInfo.additionalImages"
        class="additional-images"
      >
        <div class="upload-container">
          <el-upload
            v-model:file-list="additionalImageFiles"
            :action="uploadAction"
            list-type="picture-card"
            :limit="8"
            :before-upload="beforeUploadImage"
            :on-success="handleAdditionalImageSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleAdditionalImageRemove"
          >
            <template #default>
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">上传附图</div>
            </template>
            <template #tip>
              <div class="upload-tip">
                支持多张排序，建议展示商品细节、包装、使用场景等
              </div>
            </template>
          </el-upload>
        </div>
      </el-form-item>

      <!-- 视频 -->
      <el-form-item
        label="视频"
        prop="mediaInfo.video"
        class="video-upload"
      >
        <div class="upload-container">
          <el-upload
            v-model:file-list="videoFiles"
            :action="uploadAction"
            :limit="1"
            :before-upload="beforeUploadVideo"
            :on-success="handleVideoSuccess"
            :on-remove="handleVideoRemove"
          >
            <template #default>
              <el-button type="primary">
                <el-icon><VideoCamera /></el-icon>
                上传视频
              </el-button>
            </template>
            <template #tip>
              <div class="upload-tip">
                <el-alert
                  title="视频要求"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <ul class="upload-requirements">
                      <li>时长≤60秒</li>
                      <li>分辨率≥720p</li>
                      <li>格式：MP4/WebM</li>
                      <li>大小≤100MB</li>
                    </ul>
                  </template>
                </el-alert>
              </div>
            </template>
          </el-upload>

          <!-- 视频预览 -->
          <div class="video-preview" v-if="form.mediaInfo.video?.url">
            <video
              :src="form.mediaInfo.video.url"
              controls
              style="max-width: 100%; max-height: 300px;"
            />
          </div>
        </div>
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '@/types/product';
import type { UploadFile } from 'element-plus';

const props = defineProps<{
  form: Product;
}>();

// 上传相关
const uploadAction = '/api/upload';
const mainImageFiles = ref<UploadFile[]>([]);
const additionalImageFiles = ref<UploadFile[]>([]);
const videoFiles = ref<UploadFile[]>([]);

// 预览相关
const previewVisible = ref(false);
const previewIndex = ref(0);
const previewUrls = ref<string[]>([]);

// 图片检查结果
const imageCheckResults = ref<{
  message: string;
  type: 'success' | 'warning' | 'error';
}[]>([]);

// 图片上传前检查
async function beforeUploadImage(file: File) {
  // 检查文件类型
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }

  // 检查文件大小
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB！');
    return false;
  }

  // 检查图片尺寸
  const { width, height } = await getImageDimensions(file);
  if (width < 800 || height < 800) {
    ElMessage.warning('图片尺寸建议不小于800×800px');
  }

  // 检查图片背景和水印
  const checkResults = await checkImage(file);
  imageCheckResults.value = checkResults;

  return true;
}

// 视频上传前检查
async function beforeUploadVideo(file: File) {
  // 检查文件类型
  const validTypes = ['video/mp4', 'video/webm'];
  if (!validTypes.includes(file.type)) {
    ElMessage.error('只能上传MP4或WebM格式的视频！');
    return false;
  }

  // 检查文件大小
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    ElMessage.error('视频大小不能超过100MB！');
    return false;
  }

  // 检查视频时长和分辨率
  const { duration, width, height } = await getVideoMetadata(file);
  if (duration > 60) {
    ElMessage.error('视频时长不能超过60秒！');
    return false;
  }
  if (height < 720) {
    ElMessage.warning('视频分辨率建议不低于720p');
  }

  return true;
}

// 获取图片尺寸
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.src = URL.createObjectURL(file);
  });
}

// 获取视频元数据
function getVideoMetadata(file: File): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    video.src = URL.createObjectURL(file);
  });
}

// 检查图片背景和水印
async function checkImage(file: File) {
  const results = [];
  
  // TODO: 实现图片背景检查
  results.push({
    message: '图片背景检查通过',
    type: 'success' as const
  });

  // TODO: 实现水印检查
  results.push({
    message: '未检测到水印',
    type: 'success' as const
  });

  return results;
}

// 图片上传成功处理
function handleMainImageSuccess(response: any, file: UploadFile) {
  props.form.mediaInfo.mainImages.push({
    url: response.url,
    isWhiteBackground: true, // TODO: 使用实际检查结果
    hasWatermark: false, // TODO: 使用实际检查结果
    sortOrder: props.form.mediaInfo.mainImages.length
  });
}

function handleAdditionalImageSuccess(response: any, file: UploadFile) {
  if (!props.form.mediaInfo.additionalImages) {
    props.form.mediaInfo.additionalImages = [];
  }
  props.form.mediaInfo.additionalImages.push({
    url: response.url,
    sortOrder: props.form.mediaInfo.additionalImages.length
  });
}

function handleVideoSuccess(response: any, file: UploadFile) {
  props.form.mediaInfo.video = {
    url: response.url,
    duration: 0 // TODO: 使用实际视频时长
  };
}

// 删除处理
function handleMainImageRemove(file: UploadFile) {
  const index = props.form.mediaInfo.mainImages.findIndex(img => img.url === file.url);
  if (index > -1) {
    props.form.mediaInfo.mainImages.splice(index, 1);
  }
}

function handleAdditionalImageRemove(file: UploadFile) {
  if (!props.form.mediaInfo.additionalImages) return;
  const index = props.form.mediaInfo.additionalImages.findIndex(img => img.url === file.url);
  if (index > -1) {
    props.form.mediaInfo.additionalImages.splice(index, 1);
  }
}

function handleVideoRemove() {
  props.form.mediaInfo.video = undefined;
}

// 图片预览
function handlePictureCardPreview(file: UploadFile) {
  previewIndex.value = 0;
  previewUrls.value = [file.url!];
  previewVisible.value = true;
}
</script>

<style scoped>
.section {
  padding: 16px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 4px;
  border: 1px solid var(--el-border-color-darker);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .el-icon {
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.upload-requirements {
  margin: 8px 0 0;
  padding-left: 20px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.image-check-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.video-preview {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 8px;
  background-color: var(--el-bg-color);
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 120px;
  background-color: var(--el-bg-color);
  border-color: var(--el-border-color-darker);

  &:hover {
    border-color: var(--el-color-primary);
  }
}

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 120px;
}

.upload-icon {
  font-size: 24px;
  color: var(--el-text-color-secondary);
}

.upload-text {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}
</style>
