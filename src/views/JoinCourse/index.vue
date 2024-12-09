<template>
  <div>
    <HeaderNav></HeaderNav>
    <Breadcrumb :items="breadItems"></Breadcrumb>
    <div class="search-course">
      <!-- 搜索框 -->
      <input v-model="searchQuery" type="text" placeholder="搜索课程..." class="search-input" />

      <!-- 显示匹配的课程列表 -->
      <div v-if="paginatedCourses.length > 0">
        <ul>
          <li v-for="course in paginatedCourses" :key="course.courseID" @click="jumpTo(course.courseID)">
            <img :src="course.courseImg" alt="课程图片" />
            <h3>{{ course.courseName }}</h3>
            <p>{{ course.courseDesc }}</p>
          </li>
        </ul>

        <!-- 分页组件 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredCourses.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handlePageChange"
        />
      </div>
      <div v-else>
        <p>没有找到相关课程</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
import HeaderNav from "@/components/HeaderNav.vue";
import router from "@/router";
import { useCourseStore } from "@/stores/userCourseStore";
import { ref, computed, onMounted } from 'vue';

const courseStore = useCourseStore();

onMounted(() => {
  courseStore.getCoursesData();
});

// 搜索查询关键词
const searchQuery = ref('');

// 分页相关变量
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的课程数量

// 计算属性：根据 searchQuery 过滤课程
const filteredCourses = computed(() => {
  return courseStore.allCourseData.filter(course => {
    const searchTerm = searchQuery.value.toLowerCase();
    return (
      course.courseName.toLowerCase().includes(searchTerm) ||
      course.courseDesc.toLowerCase().includes(searchTerm)
    );
  });
});

// 计算属性：当前页的课程
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredCourses.value.slice(start, end);
});

// 面包屑导航数据
const breadItems: any[] = [
  { text: "主页", link: '/' },
  { text: "加入课程", link: '' },
];

// 页面跳转方法
const jumpTo = (num: number) => {
  router.push("/courseDetails/" + num);
};

// 处理分页切换
const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<style scoped>
@import url(/css/JoinCourse.css);
</style>
