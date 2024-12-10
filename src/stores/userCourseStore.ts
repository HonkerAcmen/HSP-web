import type { userCourse } from "@/res/dataModel";
import { ServerAddress } from "@/utils/serverURL";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useCourseStore = defineStore('courseStore', () => {
    
    // 该用户所有已创建课程数据
    const coursesData = ref<userCourse[]>([])

    // 该用户某个课程的数据
    const courseData = ref<userCourse>()

    // 所有课程的数据
    const allCourseData = ref<userCourse[]>([])

    /// 该用户加入的课程的数据
    const joinCourseData = ref<userCourse[]> ([])

    // 获取该用户加入的课程的数据
    async function getUserJoinedCourses() {
        await axios
        .get(ServerAddress + "/api/getJoinedCourses", {
            withCredentials: true
        })
        .then((res) => {
            joinCourseData.value = res.data.data
        })
        .catch((err) => {
            console.error(err)
        })
    }

    // 获取该用户所有的课程
    async function  getUserCoursesData (){
        await axios
        .get(ServerAddress + "/api/getAllUserCourse", {
            withCredentials: true,
        })
        .then((res) => {
            coursesData.value = res.data.data;
        })
        .catch((err) => {
            console.error(err);
        });
    }

    // 获取该用户的一个课程
    async function getUserCourseData(courseID:number) {
        await axios
        .get(ServerAddress + "/api/getUserCourse/"+courseID, {
            withCredentials: true,
        })
        .then((res) => {
            courseData.value = res.data.data;
        })
        .catch((err) => {
            console.error(err);
        });
    }

    // 获取所有用户的课程
    async function  getCoursesData (){
        await axios
        .get(ServerAddress + "/api/getAllCourse", {
            withCredentials: true,
        })
        .then((res) => {
            allCourseData.value = res.data.data;
        })
        .catch((err) => {
            console.error(err);
        });
    }
    return {
        coursesData,
        allCourseData,
        getUserJoinedCourses,
        joinCourseData,
        getCoursesData,
        getUserCourseData,
        getUserCoursesData
    }
})