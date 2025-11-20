<template>
  <div class="load-plan-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1>Load Plan</h1>
        <el-tooltip content="Help">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="header-right">
        <div class="action-buttons">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            Create Load Plan
          </el-button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-container">
      <el-card>
        <div class="empty-state">
          <el-empty description="Load Plan content will be implemented here" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'

const router = useRouter()

const handleCreate = () => {
  // TODO: 实现创建 Load Plan 的逻辑
  console.log('Create Load Plan')
}
</script>

<style scoped lang="scss">
.load-plan-page {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;

      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }

      .help-icon {
        cursor: pointer;
        color: #909399;
        font-size: 18px;

        &:hover {
          color: #409eff;
        }
      }
    }

    .header-right {
      .action-buttons {
        display: flex;
        gap: 10px;
      }
    }
  }

  .content-container {
    flex: 1;
    overflow: auto;

    .empty-state {
      padding: 40px 0;
    }
  }
}
</style>

