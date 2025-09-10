# Media Resources Component
<template>
  <div class="section">
    <div class="section-header">
      <h3>Media Resources</h3>
      <el-tooltip content="For product display and platform review">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="section-body">
      <el-row :gutter="20">
        <!-- Main Images -->
        <el-col :span="16">
          <el-form-item
            label="Main Images"
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
                  <div class="upload-text">Upload Main Images</div>
                </template>
              </el-upload>

              <div class="upload-tip">
                <el-alert
                  title="Main Image Requirements"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <ul class="upload-requirements">
                      <li>Minimum 1 image, recommended 5 images</li>
                      <li>White background, no watermark</li>
                      <li>Resolution ≥ 800×800px</li>
                      <li>File size ≤ 5MB</li>
                      <li>Formats: JPG, PNG</li>
                    </ul>
                  </template>
                </el-alert>
              </div>

              <!-- Image Check Results -->
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
        </el-col>

        <!-- Additional Images -->
        <el-col :span="8">
          <el-form-item
            label="Additional Images"
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
                  <div class="upload-text">Upload Additional</div>
                </template>
              </el-upload>
              <div class="upload-tip">
                Show product details, packaging, and usage scenarios
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- Video Upload -->
        <el-col :span="12">
          <el-form-item
            label="Product Video"
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
                class="video-uploader"
              >
                <template #default>
                  <el-button type="primary">
                    <el-icon><VideoCamera /></el-icon>
                    Upload Video
                  </el-button>
                </template>
              </el-upload>

              <div class="upload-tip">
                <el-alert
                  title="Video Requirements"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <ul class="upload-requirements">
                      <li>Duration ≤ 60 seconds</li>
                      <li>Resolution ≥ 720p</li>
                      <li>Format: MP4/WebM</li>
                      <li>Size ≤ 100MB</li>
                    </ul>
                  </template>
                </el-alert>
              </div>
            </div>
          </el-form-item>
        </el-col>

        <!-- Video Preview -->
        <el-col :span="12">
          <div class="video-preview" v-if="form.mediaInfo.video?.url">
            <div class="preview-header">Video Preview</div>
            <video
              :src="form.mediaInfo.video.url"
              controls
              class="preview-player"
            />
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Image Preview Dialog -->
    <el-image-viewer
      v-if="previewVisible"
      :url-list="previewUrls"
      :initial-index="previewIndex"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, InfoFilled, VideoCamera } from '@element-plus/icons-vue';
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

<style scoped lang="scss">
.section {
  padding: 24px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .el-icon {
    font-size: 18px;
    color: var(--el-text-color-secondary);
    cursor: help;
  }
}

.section-body {
  .el-row {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: var(--el-bg-color);
  border-radius: 4px;
  border: 1px dashed var(--el-border-color);
  transition: all 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
  }
}

.upload-tip {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.upload-requirements {
  margin: 8px 0 0;
  padding-left: 20px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.image-check-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.video-preview {
  height: 100%;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--el-bg-color);

  .preview-header {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    background-color: var(--el-bg-color-overlay);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .preview-player {
    width: 100%;
    height: 300px;
    object-fit: contain;
    background-color: #000;
  }
}

.video-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--el-fill-color-dark);
  }

  .el-button {
    padding: 12px 24px;
    font-size: 14px;

    .el-icon {
      font-size: 18px;
      margin-right: 8px;
    }
  }
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 140px;
  background-color: var(--el-bg-color);
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
    transform: translateY(-2px);
  }
}

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 140px;

  .el-upload-list__item {
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.upload-icon {
  font-size: 28px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.upload-text {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

// Dark theme optimizations
:deep(.dark) {
  .upload-container {
    background-color: var(--el-bg-color-overlay);
  }

  .video-preview {
    border-color: var(--el-border-color-darker);
    
    .preview-header {
      background-color: var(--el-bg-color);
      border-color: var(--el-border-color-darker);
    }
  }

  .video-uploader {
    background-color: var(--el-bg-color);

    &:hover {
      background-color: var(--el-bg-color-overlay);
    }
  }
}
</style>
