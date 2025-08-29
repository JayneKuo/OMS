<template>
  <div class="media-info">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="media-form"
    >
      <!-- 主图设置 -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>主图设置</span>
            <el-tooltip content="建议尺寸：1500x1500px，支持jpg、png格式" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-form-item label="主图" prop="mainImages">
          <el-upload
            v-model:file-list="form.mainImages"
            action="/api/upload"
            list-type="picture-card"
            :limit="8"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-card>

      <!-- 详情图设置 -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>详情图设置</span>
            <el-tooltip content="建议尺寸：1500x1500px，支持jpg、png格式" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-form-item label="详情图" prop="detailImages">
          <el-upload
            v-model:file-list="form.detailImages"
            action="/api/upload"
            list-type="picture-card"
            :limit="20"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-card>

      <!-- 视频设置 -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>视频设置</span>
            <el-tooltip content="支持mp4格式，最大100MB" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-form-item label="产品视频" prop="videos">
          <el-upload
            v-model:file-list="form.videos"
            action="/api/upload"
            :limit="3"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUploadVideo"
          >
            <el-button type="primary">上传视频</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持mp4格式，单个文件不超过100MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-card>

      <!-- 3D模型设置 -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>3D模型</span>
            <el-tooltip content="支持glb、gltf格式" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-form-item label="3D模型文件" prop="threeDModel">
          <el-upload
            v-model:file-list="form.threeDModel"
            action="/api/upload"
            :limit="1"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUploadModel"
          >
            <el-button type="primary">上传3D模型</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持glb、gltf格式，单个文件不超过50MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-card>
    </el-form>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" title="预览">
      <img v-if="previewType === 'image'" :src="previewUrl" class="preview-image" />
      <video
        v-else-if="previewType === 'video'"
        :src="previewUrl"
        controls
        class="preview-video"
      />
      <div v-else-if="previewType === '3d'" class="preview-3d">
        <!-- 3D预览组件 -->
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, UploadProps } from 'element-plus';
import { ElMessage } from 'element-plus';
import { InfoFilled, Plus } from '@element-plus/icons-vue';

const props = defineProps<{
  form: any
}>();

const formRef = ref<FormInstance>();
const form = reactive(props.form);

// 预览相关
const previewVisible = ref(false);
const previewUrl = ref('');
const previewType = ref<'image' | 'video' | '3d'>('image');

// 处理预览
const handlePreview = (file: any) => {
  previewUrl.value = file.url;
  previewType.value = file.type?.startsWith('image/')
    ? 'image'
    : file.type?.startsWith('video/')
    ? 'video'
    : '3d';
  previewVisible.value = true;
};

// 处理移除
const handleRemove: UploadProps['onRemove'] = (file, fileList) => {
  // 处理文件移除逻辑
};

// 上传前检查图片
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！');
    return false;
  }
  return true;
};

// 上传前检查视频
const beforeUploadVideo: UploadProps['beforeUpload'] = (file) => {
  const isVideo = file.type === 'video/mp4';
  const isLt100M = file.size / 1024 / 1024 < 100;

  if (!isVideo) {
    ElMessage.error('只能上传MP4格式视频！');
    return false;
  }
  if (!isLt100M) {
    ElMessage.error('视频大小不能超过 100MB！');
    return false;
  }
  return true;
};

// 上传前检查3D模型
const beforeUploadModel: UploadProps['beforeUpload'] = (file) => {
  const isValidFormat = /\.(glb|gltf)$/.test(file.name.toLowerCase());
  const isLt50M = file.size / 1024 / 1024 < 50;

  if (!isValidFormat) {
    ElMessage.error('只能上传glb或gltf格式的3D模型！');
    return false;
  }
  if (!isLt50M) {
    ElMessage.error('模型大小不能超过 50MB！');
    return false;
  }
  return true;
};

// 表单验证规则
const rules = {
  mainImages: [
    { required: true, message: '请上传至少一张主图', trigger: 'change' }
  ]
};

// 暴露验证方法给父组件
defineExpose({
  validate: () => formRef.value?.validate()
});
</script>

<style scoped>
.media-info {
  height: 100%;
  overflow-y: auto;
}

.media-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  :deep(.el-card__header) {
    padding: 12px 20px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

:deep(.el-upload--picture-card) {
  width: 148px;
  height: 148px;
  line-height: 148px;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
}

.preview-video {
  width: 100%;
  max-height: 70vh;
}

.preview-3d {
  width: 100%;
  height: 70vh;
  background-color: #f5f7fa;
}

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 148px;
}

.el-upload__tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}
</style>
