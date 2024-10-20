<template>
    <HeaderNav @logout="headleLogout"></HeaderNav>
    <Breadcrumb :items="breadcrumbItems"></Breadcrumb>
    <div class="profile-con">
        <!-- 上部分头像详情 -->
        <div class="profile-top">
            <div class="avatar"><el-avatar :icon="UserFilled" /></div>
            <div class="title">
                <span>{{ userinfo.userName }}</span><span>性别: {{ userinfo.gender }} </span><span>{{userinfo.email}}</span><span>{{ userinfo.userDesc }}</span>
            </div>
            <div class="button">修改个人信息</div>
        </div>

        <!-- 下部分，加入的课程 -->
        <div class="profile-down">
            <ul v-infinite-scroll="loadData" :infinite-scroll-disabled="loadedCourses.length >= testCourseData.length"
                :infinite-scroll-distance="10" class="infinite-list" style="overflow: auto">
                <li v-for="i in loadedCourses" :key="i.courseName" class="infinite-list-item" @click="">
                    <h2>{{ i.courseName }}</h2>
                    <h6>教师: {{ i.coursePerson }}</h6>
                    <h6>{{ i.courseDesc }}</h6>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import HeaderNav from "@/components/HeaderNav.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { UserFilled } from "@element-plus/icons-vue";
import { type userCourse, testCourseData } from "@/res/dataModel";
import { ref, onMounted } from "vue";
import axios from "axios";
import { ServerAddress } from "@/utils/serverURL";
import { ElMessage } from "element-plus";

// 处理登出
function headleLogout() {
    localStorage.clear();
    window.location.reload();
}

// 响应式用户信息
const userinfo = ref({
    email: "",
    userName: "",
    gender: "",
    profileImg: "",
    userDesc: ""
});

// 获取用户信息
async function GetUserProfile() {
    try {
        const res = await axios.get(ServerAddress + "/api/getUserInfo/" + localStorage.getItem('token'));
        if (res.data.code !== 200) {
            ElMessage({
                message: res.data.message,
                type: 'error'
            });
            return;
        } else {
            localStorage.setItem("userdata", JSON.stringify(res.data.data)); // 存储数据
            userinfo.value = {
                email: res.data.data.email || "无",
                userName: res.data.data.userName || "无名氏",
                gender: res.data.data.gender || "不明",
                profileImg: res.data.data.profileImg || "", // 添加这一行
                userDesc: res.data.data.userDesc || "来写点什么，彰显你的个性吧"
            };
        }
    } catch (err: any) {
        console.error(err); // 记录错误
    }
}
// 在组件挂载时获取用户信息
onMounted(() => {
    if (localStorage.getItem("userdata") == null) {
        GetUserProfile();
    } else {
        const userdata = JSON.parse(localStorage.getItem("userdata") || '{}');
        userinfo.value = {
            email: userdata.email || "无",
            userName: userdata.userName || "无名氏",
            gender: userdata.gender || "不明",
            profileImg: userdata.profileImg || "", // 添加这一行
            userDesc: userdata.userDesc || "来写点什么，彰显你的个性吧"
        };
    }
});

// 懒加载代码
const count = 6; // 每次加载6个数据
const loadedCourses = ref<userCourse[]>([]); // 初始加载数据

// 初始化加载前6个数据
const initializeData = () => {
    loadedCourses.value = testCourseData.value.slice(0, count); // 使用 .value 提取数组
};

// 加载更多数据
const loadData = () => {
    const nextCount = loadedCourses.value.length + count;
    if (nextCount >= testCourseData.value.length) {
        loadedCourses.value = testCourseData.value; // 所有数据已加载完成
    } else {
        loadedCourses.value = testCourseData.value.slice(0, nextCount); // 使用 .value 提取数组
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
