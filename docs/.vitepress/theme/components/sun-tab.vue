<template>
  <div class="tab-container">
    <div class="tab-header">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-title', { active: index === activeIndex }]"
        @click="activeIndex = index"
      >
        {{ tab.title }}
      </div>
    </div>

    <div class="tab-content">
      <template v-for="(tab, index) in tabs" :key="tab.name">
        <div v-show="activeIndex === index">
          <slot :name="tab.name"></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

interface TabItem {
  name: string;
  title: string;
}

defineProps<{
  tabs: TabItem[];
}>();

const activeIndex = ref(0);
</script>

<style lang="less" scoped>
.tab-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  display: flex;
  flex-direction: column;

  .tab-header {
    display: flex;
    border: 1px solid #ccc;
    height: 48px;
    line-height: 48px;
    position: sticky;
    top: 0;
    background-color: white;

    .tab-title {
      padding: 0px 20px;
      cursor: pointer;
      transition: background 0.3s;

      &.active {
        background-color: #f0f0f0;
        font-weight: bold;
      }

      &:hover {
        background-color: #f9f9f9;
      }
    }
  }

  .tab-content {
    padding: 20px;
    display: flex;
    > * {
      width: 100%;
    }
  }
}
</style>
