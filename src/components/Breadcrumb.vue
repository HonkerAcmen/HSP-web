<template>
    <nav class="breadcrumb">
        <el-breadcrumb separator="/">
            <!-- :key="index" 为每个面包屑项提供一个唯一的键，优化渲染性能。 -->
            <el-breadcrumb-item class="bread-item" v-for="(item, index) in items" :key="index" :to="item.link">
                {{ item.text }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </nav>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

interface BreadcrumbItem {
    text: string
    link: string
}
// 使用 defineProps 定义组件接收的 props，要求 items 是一个 BreadcrumbItem 数组。
const props = defineProps<{
    items: BreadcrumbItem[];
}>()
</script>

<style scoped>
.breadcrumb {
    margin-top: 20px;
    margin-left: 5rem;
}

.bread-item {
    font-size: 17px;
}
</style>