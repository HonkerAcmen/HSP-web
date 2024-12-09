<template>
    <HeaderNav></HeaderNav>
    <Breadcrumb :items="breadcrumbItems"></Breadcrumb>
    <div class="profile-con">
        <!-- 上部分头像详情 -->
        <div class="profile-top">
            <div class="avatar"><el-avatar :icon="UserFilled" /></div>
            <div class="title">
                <span>{{ userinfo.userName }}</span>
                <span>性别: {{ userinfo.gender }}</span>
                <span>{{ userinfo.email }}</span>
                <span>{{ userinfo.userDesc }}</span>
            </div>
            <div class="button">
                <a href="/modifyProfile">修改个人信息</a>
            </div>
        </div>
        <!-- 下部分，加入的课程 -->
        <div class="profile-down">
            <ul v-if="courseStore.isDatas" v-infinite-scroll="loadData"
                :infinite-scroll-disabled="loadedCourses.length >= courseStore.coursesData.length" :infinite-scroll-distance="10"
                class="infinite-list" style="overflow: auto">
                <li class="infinite-list-li" v-for="i in loadedCourses" :key="i.courseName" style="width: 74%;">
                    <!-- 动态绑定课程 ID -->
                    <a :href="'/courseDetails/' + i.courseID">
                        <img class="infinite-list-li-img" :src="i.courseImg" />
                        <h2>{{ i.courseName }}</h2>
                        <h6>{{ i.courseDesc }}</h6>
                    </a>
                </li>
            </ul>
            <el-empty v-if="!courseStore.isDatas" :image-size="200" description="该用户没有创建或者加入的课程" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import HeaderNav from "@/components/HeaderNav.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { UserFilled } from "@element-plus/icons-vue";
import { type userCourse, type userData } from "@/res/dataModel";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { ServerAddress } from "@/utils/serverURL";
import { ElMessage } from "element-plus";
import {useCourseStore} from '@/stores/userCourseStore'

const courseStore = useCourseStore()
// 显示在网页上的信息
const userinfo = ref({
    email: "",
    userName: "",
    gender: "",
    profileImg: "",
    userDesc: ""
});

// 更新用户信息的函数
const updateUserInfo = (data: any) => {
    userinfo.value = {
        email: data.email || "无",
        userName: data.userName || "你没有名字哦",
        gender: (data.gender == 1 ? "男" : "女"),
        profileImg: data.profileImg || "",
        userDesc: data.userDesc || "来写点什么，彰显你的个性吧"
    };
};

// 获取用户信息并更新 localStorage
async function GetUserProfile() {
    try {
        const res = await axios.get(ServerAddress + "/api/getUserInfo", {
            withCredentials: true
        });
        // getCourseData();
        courseStore.getUserCoursesData()
        localStorage.setItem("userdata", JSON.stringify(res.data.data)); // 存储数据
        updateUserInfo(res.data.data);
    } catch (err: any) {
        console.error(err); // 记录错误
        ElMessage({
            message: err.response?.data?.message || '获取用户信息失败',
            type: 'error'
        });
        return;
    }
}

// 在组件挂载时获取用户信息
onMounted(() => {
    GetUserProfile(); // 直接请求用户信息并更新
});

// 监听 localStorage 中 userdata 的变化
watch(
    () => localStorage.getItem("userdata"),
    (newValue) => {
        if (newValue) {
            const parsedData = JSON.parse(newValue);
            updateUserInfo(parsedData);
        }
    }
);

// 懒加载代码
const count = 6; // 每次加载6个数据
const loadedCourses = ref<userCourse[]>([]); // 初始加载数据

// 初始化加载前6个数据
const initializeData = () => {
    loadedCourses.value = courseStore.coursesData.slice(0, count);
    // console.log(courseStore.courseData.slice(0, count));
};

// 加载更多数据
const loadData = () => {
    const nextCount = loadedCourses.value.length + count;
    if (nextCount >= courseStore.coursesData.length) {
        loadedCourses.value = courseStore.coursesData; // 所有数据已加载完成
        console.log(loadedCourses.value)
    } else {
        loadedCourses.value = courseStore.coursesData.slice(0, nextCount);
    }
};

// 面包屑的路径
const breadcrumbItems = ref([
    { text: '主页', link: '/' },
    { text: '个人资料', link: '/profile' }
]);

// 初始化数据
initializeData();
</script>

<style>
@import "/css/profile.css";
</style>