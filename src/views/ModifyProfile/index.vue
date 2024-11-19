<template>
    <HeaderNav @logout="logout"></HeaderNav>
    <Breadcrumb :items="breadcrumbItems"></Breadcrumb>

    <div class="customzation-bar">
        <div class="title-customzation"><span>个人资料自定义</span></div>
    </div>
    <div class="customzation-con">
        <el-form ref="ruleFormRef" :model="ruleform" :rules="rules" label-width="auto" style="width: 600px"
            size="large">
            <el-form-item label="你的姓名" prop="name">
                <el-input v-model="ruleform.name" placeholder="请输入你的姓名" />
            </el-form-item>
            <el-form-item label="性别" prop="region">
                <el-select v-model="ruleform.region" placeholder="点击选择">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                </el-select>
            </el-form-item>
            <el-form-item label="电子邮件" prop="email">
                <el-input v-model="ruleform.email" placeholder="请输入你要更改的电子邮箱" />
            </el-form-item>
            <el-form-item label="个性签名" prop="desc">
                <el-input v-model="ruleform.desc" placeholder="请输入您的个性签名" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import HeaderNav from '@/components/HeaderNav.vue'
import Breadcrumb from "@/components/Breadcrumb.vue"
import { reactive, ref } from 'vue'
import router from '@/router';
import type { FormRules } from 'element-plus';
import { ElMessage, type FormInstance } from 'element-plus';
import axios from 'axios';
import { ServerAddress } from '@/utils/serverURL';

// 面包屑的路径
const breadcrumbItems = [
    { text: '主页', link: '/' },
    { text: '个人资料', link: '/profile' },
    { text: '修改信息', link: '/profile' }
];

const ruleFormRef = ref<FormInstance>()

const ruleform = ref({
    name: '',
    region: '',
    desc: '',
    email: ''
})




function logout() {
    localStorage.clear()
    window.location.reload();
}

function isVaildEmail(input: string): boolean {
    const regex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(input)
}


const validateName = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('姓名不能为空'))
    }
    else if (String(value).length > 4) {
        callback(new Error('姓名不能大于4个字'))
    } else {
        callback()
    }
}

const validateRegion = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('性别选择不能为空'))
    }
    else {
        callback()
    }
}

const validateDesc = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('签名不能为空'))
    }
    else if (String(value).length > 20) {
        callback(new Error('签名不能大于4个字'))
    }
    else {
        callback()
    }
}

const validateEmail = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('电子邮件不能为空'))
    }
    else if (!isVaildEmail(value)) {
        callback("电子邮件格式错误")
    }
    else {
        callback()
    }
}

const rules = reactive<FormRules<typeof ruleform>>({
    name: [{ validator: validateName, trigger: 'blur' }],
    region: [{ validator: validateRegion, trigger: 'blur' }],
    desc: [{ validator: validateDesc, trigger: 'blur' }],
    email: [{ validator: validateEmail, trigger: 'blur' }]
})



async function submitModifyData(userdata: any, token: string) {
    try {
        const res = await axios.put(ServerAddress + "/api/modifyUserInfo", userdata, {
            withCredentials: true
        })
        console.log(res.data.data)
        ElMessage({
            message: '修改成功, 请重新登陆',
            type: "success"
        })
        setTimeout(() => {
            localStorage.removeItem('token')
            router.push('/profile')
            window.location.reload()
        }, 1000)
        // localStorage.setItem('token', res.data.data)

    } catch (error) {
        console.log('数据传输错误', userdata, token);
    }
}

const onSubmit = () => {
    console.log('submit!')
    // 提交时校验
    const modifyUserData = {
        email: ruleform.value.email,
        userName: ruleform.value.name,
        gender: ruleform.value.region == '男' ? Number(1) : Number(0),
        userDesc: ruleform.value.desc
    }
    const token = localStorage.getItem('token')

    ruleFormRef.value?.validate((valid: boolean) => {
        if (valid) {
            console.log('表单验证通过，准备提交', modifyUserData);
            if (token != null) {
                submitModifyData(modifyUserData, token)
            } else {
                ElMessage({
                    message: "身份token错误, 请重新登陆",
                    type: "error"
                })
            }

        } else {
            console.log('表单验证失败');
            ElMessage({
                message: "请确认填写正确",
                type: "error"
            })
        }
    });
}

const cancel = () => {
    router.push('/profile')
}
</script>

<style>
@import url("/css/ModifyProfile.css");
</style>
