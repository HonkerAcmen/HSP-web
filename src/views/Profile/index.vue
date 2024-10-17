<template>
    <HeaderNav @logout="headleLogout"></HeaderNav>
    <div class="profile-con">
        <!-- 上部分头像详情 -->
        <div class="profile-top">
            <div class="avatar"><el-avatar :icon="UserFilled" /></div>
            <div class="title">
                <span>爱媳妇的老猪</span><span>性别: 男 年龄: 18</span
                ><span>haker0x04@163.com</span><span>天工若拙，大巧若通</span>
            </div>
            <div class="button">修改个人信息</div>
        </div>

        <!-- 下部分，加入的课程 -->
        <div class="profile-down">
            <ul
                v-infinite-scroll="loadData"
                :infinite-scroll-disabled="
                    loadedCourses.length >= testCourseData.length
                "
                :infinite-scroll-distance="10"
                class="infinite-list"
                style="overflow: auto"
            >
                <li
                    v-for="i in loadedCourses"
                    :key="i.courseName"
                    class="infinite-list-item"
                    @click=""
                >
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
import { UserFilled } from "@element-plus/icons-vue";
import { type userCourse, testCourseData } from "@/res/dataModel";
import { ref } from "vue";

function headleLogout() {
    localStorage.clear();
    window.location.reload();
}
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

// 初始化数据
initializeData();
</script>

<style>
@import "/css/profile.css";
</style>
