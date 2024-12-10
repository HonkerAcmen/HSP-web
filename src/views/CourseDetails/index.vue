<template>
    <HeaderNav></HeaderNav>
    <Breadcrumb :items="breadcrumbItems"></Breadcrumb>

    <div class="cov">
        <img :src="data?.courseImg" class="cov-img">
        <h2 class="c-title">{{ data?.courseName }}</h2>
        <h6 class="c-owner">教师：{{ data?.owner }}</h6>
        <h6 class="c-desc">{{ data?.courseDesc }}</h6>

        <!-- 根据状态显示按钮 -->
        <div class="button" style="background-color: aliceblue;" v-if="isCreator">
            这是你创建的课程
        </div>
        <div class="button" style="background-color: aliceblue;" v-else-if="isJoined">
            已加入课程
        </div>
        <div class="button" v-else @click="joinCourse">
            加入课程
        </div>
    </div>
</template>

<script lang="ts" setup>
import Breadcrumb from '@/components/Breadcrumb.vue';
import HeaderNav from '@/components/HeaderNav.vue';

import { type userCourse } from '@/res/dataModel';
import { ServerAddress } from '@/utils/serverURL';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

import {useCourseStore} from '@/stores/userCourseStore'

const courseStore = useCourseStore()
const isJoined = ref(false)
// 面包屑的路径
const breadcrumbItems = ref([
    { text: '主页', link: '/' },
    { text: '课程详情', link: '' }
]);

const data = ref<userCourse | null>(null); // 课程数据
const isCreator = ref(false); // 是否为课程创建者
const joinCourseData = ref<userCourse[]>([])

// 接收路由参数
const props = defineProps({
    id: String
});
const courseId = props.id;

// 加入课程逻辑
const joinCourse = async () => {
    try {
        const res = await axios.get(`${ServerAddress}/api/joinCourse?courseID=${courseId}`, {
            withCredentials: true
        });
        ElMessage({
            type: 'success',
            message: "加入成功"
        });
    } catch (err) {
        ElMessage({
            type: 'error',
            message: "不能加入自己课程或者重复加入"
        });
        console.error("CourseDetails joinCourse error:", err);
    }
};

// 获取课程详情逻辑
async function getUserCourse() {
    try {
        const res = await axios.get(`${ServerAddress}/api/getUserCourse?courseID=${courseId}`, {
            withCredentials: true
        });
        data.value = res.data.data;

        // 判断是否为创建者
        const useremail = localStorage.getItem("useremail"); // 从 localStorage 获取当前用户 ID
        isCreator.value = data.value?.owner.split("#")[1] === useremail; // 对比课程的创建者 ID

    } catch (err) {
        console.error("CourseDetails getUserCourse error:", err);
    }
}

 // 获取该用户加入的课程的数据
 async function getUserJoinedCourses() {
        await axios
        .get(ServerAddress + "/api/getJoinedCourses", {
            withCredentials: true
        })
        .then((res) => {
             console.log(res.data.data)
            joinCourseData.value = res.data.data
            isJoined.value = joinCourseData.value.some((course) => String(course.courseID) === courseId);
        })
        .catch((err) => {
            console.error(err)
        })
    }

// 挂载时获取课程数据
onMounted(() => {
    getUserCourse();
    getUserJoinedCourses()
});
</script>


<style>
@import url(/css/CourseDetails.css);
</style>