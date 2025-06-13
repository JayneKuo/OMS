<template>
  <div class="tracking-wrapper">
    <iframe
      ref="trackingFrame"
      :src="getHtmlPath()"
      style="width: 100%; height: calc(100vh - 60px); border: none;"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'TrackingWrapper',
  setup() {
    const trackingFrame = ref<HTMLIFrameElement | null>(null)

    const getHtmlPath = () => {
      // 使用public目录下的文件
      return '/tracking/order-tracking.html'
    }

    onMounted(() => {
      console.log('Tracking iframe mounted')
    })

    return {
      trackingFrame,
      getHtmlPath
    }
  }
})
</script>

<style scoped>
.tracking-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style> 