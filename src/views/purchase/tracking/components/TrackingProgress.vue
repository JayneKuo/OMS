<!-- src/views/purchase/tracking/components/TrackingProgress.vue -->
<template>
  <div class="tracking-progress">
    <!-- Main Stage Progress -->
    <el-steps :active="activeStageIndex" finish-status="success" class="main-stages">
      <el-step 
        v-for="stage in stages" 
        :key="stage.status"
        :title="stage.title"
        :status="getStageStatus(stage)"
      />
    </el-steps>

    <!-- Sub-process Details -->
    <div class="sub-processes" v-if="currentStage">
      <div class="stage-title">
        <h3>{{ currentStage.title }}</h3>
        <el-tag :type="currentStage.completed ? 'success' : 'warning'">
          {{ currentStage.completed ? 'Completed' : 'In Progress' }}
        </el-tag>
      </div>

      <el-timeline>
        <el-timeline-item
          v-for="process in currentStage.subProcesses"
          :key="process.name"
          :type="getProcessType(process)"
          :timestamp="process.timestamp"
          :hollow="process.status === 'pending'"
        >
          <div class="process-content">
            <h4>{{ process.name }}</h4>
            
            <!-- Process Fields -->
            <div class="process-fields" v-if="process.fields">
              <el-descriptions :column="2" border>
                <el-descriptions-item 
                  v-for="(value, key) in process.fields"
                  :key="key"
                  :label="formatFieldLabel(key)"
                >
                  {{ value }}
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- Attachments -->
            <div class="attachments" v-if="process.attachments && process.attachments.length">
              <h5>Attachments</h5>
              <el-upload
                class="attachment-list"
                action="#"
                :auto-upload="false"
                :file-list="process.attachments"
              >
                <template #file="{ file }">
                  <el-link :href="file.url" target="_blank">
                    {{ file.name }}
                  </el-link>
                </template>
              </el-upload>
            </div>

            <!-- Remarks -->
            <div class="remarks" v-if="process.remarks">
              <el-alert
                :title="'Remarks'"
                :description="process.remarks"
                type="info"
                :closable="false"
              />
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TrackingStage, SubProcess } from '../types'

const props = defineProps<{
  stages: TrackingStage[]
}>()

const activeStageIndex = computed(() => {
  return props.stages.findIndex(stage => stage.current)
})

const currentStage = computed(() => {
  return props.stages.find(stage => stage.current)
})

const getStageStatus = (stage: TrackingStage) => {
  if (stage.completed) return 'success'
  if (stage.current) return 'process'
  return 'wait'
}

const getProcessType = (process: SubProcess) => {
  switch (process.status) {
    case 'completed':
      return 'success'
    case 'in_progress':
      return 'primary'
    case 'error':
      return 'danger'
    default:
      return 'info'
  }
}

const formatFieldLabel = (key: string) => {
  return key
    .split(/(?=[A-Z])|_/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
</script>

<style scoped lang="scss">
.tracking-progress {
  padding: 20px;

  .main-stages {
    margin-bottom: 40px;
  }

  .stage-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      margin-right: 12px;
    }
  }

  .process-content {
    h4 {
      margin: 0 0 12px;
    }

    .process-fields {
      margin: 12px 0;
    }

    .attachments {
      margin: 12px 0;
      
      h5 {
        margin: 0 0 8px;
      }

      .attachment-list {
        margin-top: 8px;
      }
    }

    .remarks {
      margin-top: 12px;
    }
  }
}
</style> 