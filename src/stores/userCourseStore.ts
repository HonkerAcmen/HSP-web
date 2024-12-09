import type { userCourse } from "@/res/dataModel";
import { ServerAddress } from "@/utils/serverURL";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useCourseStore = defineStore('courseStore', () => {
    
    const coursesData = ref<userCourse[]>([])
    const courseData = ref<userCourse>()
    const allCourseData = ref<userCourse[]>([])

    const isDatas = ref(false)
    const isData = ref(false)
    const isDataAllCourse = ref(false)

    // 获取该用户所有的课程
    async function  getUserCoursesData (){
        await axios
        .get(ServerAddress + "/api/getAllUserCourse", {
            withCredentials: true,
        })
        .then((res) => {
            coursesData.value = res.data.data;
            isDatas.value = true;
        })
        .catch((err) => {
            isDatas.value = false;
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
            isData.value = true;
        })
        .catch((err) => {
            isData.value = false;
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
            isDataAllCourse.value = true;
        })
        .catch((err) => {
            isDataAllCourse.value = false;
            console.error(err);
        });
    }
    return {
        coursesData,
        isDatas,
        isData,
        isDataAllCourse,
        allCourseData,
        getCoursesData,
        getUserCourseData,
        getUserCoursesData
    }
})