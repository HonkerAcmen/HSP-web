<template>
    <HeaderNav @logout="handleLogout"></HeaderNav>
    <Breadcrumb :items="breadcrumbItems"></Breadcrumb>

    <div class="con">
        <el-form ref="ruleFormRef" :model="ruleform" :rules="rules" label-width="auto" style="width: 40%;">
            <el-form-item label="课程名称" label-position="top" prop="courseName">
                <el-input v-model="ruleform.courseName" placeholder="请输入课程名称"></el-input>
            </el-form-item>
            <el-form-item label="课程描述" label-position="top" prop="courseDesc">
                <el-input v-model="ruleform.courseDesc" placeholder="请输入课程的描述"></el-input>
            </el-form-item>
            <el-form-item label="课程图片" label-position="top" prop="courseImg">
                <el-upload :auto-upload="false" :limit="1" ref="upload" class="upload" list-type="picture-card"
                    :on-change="handleFileChange" :on-exceed="handleExceed" :show-file-list="false"
                    v-if="!ruleform.courseImg">
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

                <!-- 预览裁剪后的图片 -->
                <div v-if="ruleform.courseImg" class="image-preview">
                    <img :src="ruleform.courseImg" alt="Course Image"
                        style="width: 100%; max-height: 200px; object-fit: cover;" />
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 裁剪对话框 -->
    <el-dialog title="裁剪图片" v-model="showCropper" width="600px" @close="resetCropper" >
        <div>
            <img ref="cropperImage" :src="cropImageSrc" alt="Crop Image"
                style="max-width: 100%; height: 400px; object-fit: contain;" @load="initCropper" />
        </div>
        <template #footer> <!-- 使用 Vue 3 插槽语法 -->
            <el-button @click="showCropper = false">取消</el-button>
            <el-button type="primary" @click="getCroppedImage">确定裁剪</el-button>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { type UploadFile, type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus";
import HeaderNav from "@/components/HeaderNav.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import axios from "axios";
import { ServerAddress } from "@/utils/serverURL";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";


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
const ruleform = ref({
    courseName: '', // 课程名称
    courseDesc: '', // 课程描述
    courseImg: '',   // 课程图片
    courseImgSize: 0 // 课程图片大小
});

// 裁剪相关状态
let showCropper = ref(false);
const cropImageSrc = ref(''); // 原始图片源
const cropperInstance = ref<Cropper | null>(null);

// 获取裁剪图片的元素
const cropperImage = ref<HTMLImageElement | null>(null);


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


// 初始化 Cropper 实例
const initCropper = () => {
    if (cropperImage.value) {
        // 销毁之前的 Cropper 实例
        if (cropperInstance.value) {
            cropperInstance.value.destroy();
        }
        // 创建新的 Cropper 实例
        cropperInstance.value = new Cropper(cropperImage.value, {
            aspectRatio: 16 / 9, // 根据需要调整裁剪比例
            viewMode: 1,
            guides: true,
            cropBoxResizable: true,
            responsive: true,
            autoCropArea: 1,
        });
        console.log("Cropper 实例已初始化");
    }
};

// 文件处理
const handleFileChange = (file: UploadFile) => {
    const SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB

    // 当文件大小存在且文件存在时
    if (file.size && file.raw) {

        // 如果过大
        if (file.size > SIZE_LIMIT) {
            isFileTooLarge.value = true;
            ElMessage.error('图片大小最多10MB');
            return;
        }
        isFileTooLarge.value = false;

        // 检查文件的类型
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.raw.type)) {
            isFileType.value = false;
            ElMessage.error('文件类型不正确，只能上传 PNG 或 JPG 格式的图片');
            return;
        }
        isFileType.value = true;

        ruleform.value.courseImgSize = file.size;

        // 将文件转换为Base64编码
        const reader = new FileReader();
        reader.onload = () => {
            cropImageSrc.value = reader.result as string;
            showCropper.value = true; // 打开裁剪对话框
            console.log("文件已加载，准备显示裁剪对话框");
        };
        reader.onerror = (error) => console.error("文件读取出错:", error);
        reader.readAsDataURL(file.raw); // Convert the file to Base64
    }
};

// 检测文件是否超过规定的数量
const handleExceed = (files: UploadFile[]) => {
    ElMessage.warning("只能上传一个文件!");
};

// 登出逻辑
const handleLogout = () => {
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
                    .catch((error) => {
                        console.error("提交失败:", error);
                        ElMessage.error('课程创建失败，请重试');
                    });
            } else {
                ElMessage.error('token错误, 请重新登陆');
            }
        } else {
            ElMessage.error("表单验证失败，请检查输入内容!");
        }
    });
};

// 获取裁剪后的图片
const getCroppedImage = () => {
    if (cropperInstance.value) {
        cropperInstance.value.getCroppedCanvas({
            width: 400,
            height: 225,
            imageSmoothingQuality: 'high'
        }).toBlob((blob: Blob | null) => {
            if (blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    ruleform.value.courseImg = reader.result as string;
                    showCropper.value = false;
                    // 销毁 Cropper 实例
                    if (cropperInstance.value) {
                        cropperInstance.value.destroy();
                        cropperInstance.value = null;
                    }
                    console.log("裁剪完成，裁剪后的图片已设置");
                };
                reader.onerror = (error) => console.error("裁剪后文件读取出错:", error);
                reader.readAsDataURL(blob);
            }
        }, 'image/png');
    }
};

// 重置裁剪对话框
const resetCropper = () => {
    cropImageSrc.value = '';
    // 销毁 Cropper 实例
    if (cropperInstance.value) {
        cropperInstance.value.destroy();
        cropperInstance.value = null;
    }
    console.log("裁剪对话框已重置");
};
</script>

<style scoped>
@import '/css/CreateCourse.css';
@import 'cropperjs/dist/cropper.css';

.error-tip {
    color: red;
}

.image-preview {
    margin-top: 10px;
}

.cropper-container {
    width: 100%;
    height: 400px;
}

.el-dialog {
    z-index: 10000;
    /* 确保对话框在最上层 */
}
</style>