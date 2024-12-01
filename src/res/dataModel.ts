import { ServerAddress } from "@/utils/serverURL";
import axios from "axios";
import { ref } from "vue";

export interface userData {
    email: string;
    userName: string;
    gender: number;
    profileImg: string;
    userDesc: string;
}

export interface userCourse {
    courseID: number;
    courseName: string;
    courseDesc: string;
    owner: string, 
    courseImg: string;
    courseImgSize:number
}

export let testCourseData = ref<userCourse[]>([])
export let isData = ref(false)
export async function getCourseData() {
    const token = localStorage.getItem('token')
    if (token!=null){
       await axios.get(ServerAddress+'/api/getAllUserCourse', {
            withCredentials: true
       })
       .then((res) =>{
            testCourseData.value = res.data.data
            isData.value = true
       })
       .catch((err) =>{
            isData.value = false
            console.error(err)
       })
    }
}

