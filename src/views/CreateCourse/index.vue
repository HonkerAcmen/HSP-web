<template>
    <HeaderNav @logout="headleLogout"></HeaderNav>
    <Breadcrumb :items="breadcrumbItems"></Breadcrumb>

    <div class="con">
        <el-form ref="ruleFormRef" :model="ruleform" :rules="rules" label-width="auto" style="width: 600px;">
            <el-form-item label="课程名称" label-position="top" prop="courseName">
                <el-input v-model="ruleform.courseName" placeholder="请输入课程名称"></el-input>
            </el-form-item>
            <el-form-item label="课程描述" label-position="top" prop="courseDesc">
                <el-input v-model="ruleform.courseDesc" placeholder="请输入课程的描述"></el-input>
            </el-form-item>
            <el-form-item label="课程图片" label-position="top" prop="courseImg">
                <el-upload :auto-upload="false" :limit="1" ref="upload" class="upload" list-type="picture-card"
                    :on-change="handleFileChange" :on-exceed="handleExceed">
                    <el-button type="primary">点击上传</el-button>
                    <template #tip>
                        <div v-if="isFileTooLarge" class="error-tip">
                            文件大小必须小于500kb
                        </div>
                        <div v-if="!isFileType" class="error-tip">
                            文件必须是png格式或jpg格式
                        </div>
                    </template>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import HeaderNav from "@/components/HeaderNav.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { ref } from "vue";
import { type UploadFile, type FormInstance, type FormRules, ElMessage } from "element-plus";
import axios from "axios";
import { ServerAddress } from "@/utils/serverURL";

// 面包屑的路径
const breadcrumbItems = [
    { text: '主页', link: '/' },
    { text: '创建课程', link: '/createCourse' }
];

// 上传组件的实体
const upload = ref();

// 文件是否过大
const isFileTooLarge = ref(false);

// 文件类型是否错误
const isFileType = ref(true);

// form的实体
const ruleFormRef = ref<FormInstance>();

// form的数据类型
const ruleform = ref({
    courseName: '', // 课程名称
    courseDesc: '', // 课程描述
    courseImg: '',   // 课程图片
    courseImgSize: 0 // 课程图片大小
});


// 验证逻辑
const validCourseName = (rule: any, value: any, callback: any) => {
    if (!value) callback(new Error('课程名称不能为空'));
    else if (String(value).length > 20) callback(new Error('课程名称不能超过20个字符'));
    else callback();
};

const validCourseDesc = (rule: any, value: any, callback: any) => {
    if (!value) callback(new Error('课程描述不能为空'));
    else if (String(value).length > 100) callback(new Error('课程描述不能超过100个字符'));
    else callback();
};

const validCourseImg = (rule: any, value: any, callback: any) => {
    if (!value) callback(new Error('请上传图片'));
    else callback();
};

const rules: FormRules = {
    courseName: [{ validator: validCourseName, trigger: 'blur' }],
    courseDesc: [{ validator: validCourseDesc, trigger: 'blur' }],
    courseImg: [{ validator: validCourseImg, trigger: 'blur' }]
};

// 文件处理
const handleFileChange = (file: UploadFile) => {
    const SIZE_LIMIT = 500 * 1024; // 500 KB

    // 当文件大小存在且文件存在时
    if (file.size && file.raw) {

        // 如果过大
        if (file.size > SIZE_LIMIT) {
            isFileTooLarge.value = true;
            ElMessage.error('文件过大，无法上传');
            return;
        }
        isFileTooLarge.value = false;

        // 检查文件的类型
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.raw.type)) {
            isFileType.value = false;
            return;
        }
        isFileType.value = true;


        ruleform.value.courseImgSize =  file.size
        
        // 将文件转换为Base64编码
        const reader = new FileReader();
        reader.onload = () => {
            ruleform.value.courseImg = reader.result as string;
        };
        reader.onerror = (error) => console.error("文件读取出错:", error);
        reader.readAsDataURL(file.raw); // Convert the file to Base64
    }
};


// 检测文件是否超过规定的数量
const handleExceed = (files: UploadFile[]) => {
    alert("只能上传一个文件!");
};


// 登出逻辑
const headleLogout = () => {
    localStorage.clear();
    window.location.reload();
};


// 提交表单
const submitForm = () => {
    const token = localStorage.getItem('token');
    ruleFormRef.value?.validate((valid) => {
        if (valid) {
            if (token) {
                axios.post(`${ServerAddress}/api/createCourse/${token}`, ruleform.value)
                    .then((response) => {
                        ElMessage.success('课程创建成功');
                        setTimeout(() => window.location.reload(), 700);
                    })
                    .catch((error) => console.error("提交失败:", error));
            } else {
                ElMessage.error('token错误, 请重新登陆');
            }
        } else {
            console.log("表单验证失败!");
        }
    });
};
</script>


<style scoped>
@import '/css/CreateCourse.css';
.error-tip {
    color: red;
}
</style>
