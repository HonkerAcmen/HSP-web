<template>
    <HeaderNav ></HeaderNav>
    <Breadcrumb :items="breadcrumbItems"></Breadcrumb>

    <div class="cov">
        <img :src="data?.courseImg" class="cov-img">
        <h2 class="c-title">{{ data?.courseName }}</h2>
        <h6 class="c-owner">教师：{{ data?.owner }}</h6>
        <h6 class="c-desc">{{ data?.courseDesc }}</h6>
    </div>

</template>

<script lang="ts" setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import HeaderNav from '@/components/HeaderNav.vue'

import {type userCourse} from '@/res/dataModel'
import { ServerAddress } from '@/utils/serverURL';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

// 面包屑的路径
const breadcrumbItems = ref([
    { text: '主页', link: '/' },
    { text: '课程详情', link: '/courseDetails' }
]);
const data = ref<userCourse>()
// 接收路由参数
const props = defineProps({
    id: String
});

const courseId = props.id;
function getUserCourse(){
    axios.get(ServerAddress+"/api/getUserCourse?courseID="+courseId, {
        withCredentials: true
    })
    .then((res) =>{
        data.value = res.data.data
    })
    .catch((err) => {
        console.log("CoureseDetails err ===>", err);
    })
}

onMounted(() =>{
    getUserCourse()
})

</script>

<style>
@import url(/css/CourseDetails.css);
</style>