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
            <el-menu class="profile-menu" :default-active="selectMenuIndex" mode="horizontal" @select="handleMenuSelect">
                <el-menu-item index="1">已加入课程</el-menu-item>
                <el-menu-item index="2">已创建课程</el-menu-item>
            </el-menu>

            <!-- 已加入的课程 -->
            <ul v-if="selectMenuIndex === '1' && loadedCourses.length > 0" v-infinite-scroll="loadData"
                :infinite-scroll-disabled="loadedCourses.length >= courseStore.joinCourseData.length"
                :infinite-scroll-distance="10" class="infinite-list" style="overflow: auto">
                <li class="infinite-list-li" v-for="course in loadedCourses" :key="course.courseID" style="width: 74%;">
                    <a :href="'/courseDetails/' + course.courseID">
                        <img class="infinite-list-li-img" :src="course.courseImg" />
                        <h2>{{ course.courseName }}</h2>
                        <h6>{{ course.courseDesc }}</h6>
                    </a>
                </li>
            </ul>

            <!-- 已创建的课程 -->
            <ul v-if="selectMenuIndex === '2' && loadedCourses.length > 0" v-infinite-scroll="loadData"
                :infinite-scroll-disabled="loadedCourses.length >= courseStore.coursesData.length"
                :infinite-scroll-distance="10" class="infinite-list" style="overflow: auto">
                <li class="infinite-list-li" v-for="course in loadedCourses" :key="course.courseID" style="width: 74%;">
                    <a :href="'/courseDetails/' + course.courseID">
                        <img class="infinite-list-li-img" :src="course.courseImg" />
                        <h2>{{ course.courseName }}</h2>
                        <h6>{{ course.courseDesc }}</h6>
                    </a>
                </li>
            </ul>

            <!-- 空数据时显示 -->
            <el-empty v-else :image-size="200" description="该用户没有创建或者加入的课程" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import HeaderNav from "@/components/HeaderNav.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { UserFilled } from "@element-plus/icons-vue";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { ServerAddress } from "@/utils/serverURL";
import { ElMessage } from "element-plus";
import { useCourseStore } from "@/stores/userCourseStore";
import type { userCourse } from "@/res/dataModel";

const courseStore = useCourseStore();

// 用户信息
const userinfo = ref({
    email: "",
    userName: "",
    gender: "",
    profileImg: "",
    userDesc: ""
});

// 当前选中的菜单项
const selectMenuIndex = ref("1");

// 已加载的课程
const loadedCourses = ref<userCourse[]>([]);

// 每次加载的课程数量
const count = 6;

// 切换菜单时加载数据
const handleMenuSelect = (index: string) => {
    selectMenuIndex.value = index;
    initializeData(); // 初始化数据
};

// 初始化数据
const initializeData = () => {
    const source = selectMenuIndex.value === "1" ? courseStore.joinCourseData : courseStore.coursesData;
    loadedCourses.value = source.slice(0, count);
};

// 加载更多数据
const loadData = () => {
    const source = selectMenuIndex.value === "1" ? courseStore.joinCourseData : courseStore.coursesData;
    const nextCount = loadedCourses.value.length + count;
    if (nextCount >= source.length) {
        loadedCourses.value = source;
    } else {
        loadedCourses.value = source.slice(0, nextCount);
    }
};

// 更新用户信息
const updateUserInfo = (data: any) => {
    userinfo.value = {
        email: data.email || "无",
        userName: data.userName || "你没有名字哦",
        gender: data.gender === 1 ? "男" : "女",
        profileImg: data.profileImg || "",
        userDesc: data.userDesc || "来写点什么，彰显你的个性吧"
    };
};

// 获取用户信息
async function GetUserProfile() {
    try {
        const res = await axios.get(ServerAddress + "/api/getUserInfo", {
            withCredentials: true
        });
        localStorage.setItem("userdata", JSON.stringify(res.data.data));
        updateUserInfo(res.data.data);
        await courseStore.getUserJoinedCourses();
        await courseStore.getUserCoursesData();
        initializeData(); // 初始化数据
    } catch (err: any) {
        console.error(err);
        ElMessage.error(err.response?.data?.message || "获取用户信息失败");
    }
}

// 监听 localStorage 变化
watch(
    () => localStorage.getItem("userdata"),
    (newValue) => {
        if (newValue) {
            const parsedData = JSON.parse(newValue);
            updateUserInfo(parsedData);
        }
    }
);

// 组件挂载时加载数据
onMounted(() => {
    GetUserProfile();
});

// 面包屑的路径
const breadcrumbItems = ref([
    { text: '主页', link: '/' },
    { text: '个人资料', link: '/profile' }
]);
</script>


<style>
@import "/css/profile.css";
</style>