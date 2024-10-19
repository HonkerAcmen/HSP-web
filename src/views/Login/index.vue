<template>

    <body>
        <div class="sky">
            <div class="box">
                <div class="title"><span>停机坪</span>
                    <p>欢迎回来</p>
                </div>
                <el-input v-model="email" style="width: 300px;" placeholder="请输入电子邮箱" />
                <el-link type="info" :underline=false style="transition: 0.3s;" href="/register">忘记密码？</el-link>
                <el-input v-model="passwd" style="width: 300px" type="password" placeholder="请输入密码" show-password />
                <div class="login-button" @click="Login"><span>登陆</span></div>
                <el-link type="info" style="transition: 0.3s;" href="/register" :underline="false">没有账号？点击注册</el-link>
            </div>
            <div class="paper-plane plane-1"></div>
            <div class="paper-plane plane-2"></div>
        </div>
    </body>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue'; // 引入 onMounted 钩子
import { ServerAddress } from '@/utils/serverURL'
import router from '@/router';
import {useUserDataStore} from '@/stores/userDataStore'

const store = useUserDataStore()

const email = ref("")
const passwd = ref("")

// 设置邮箱到pinia
// store.setEmail(email.value)

function isVaildAccount(input: string): boolean {
    const regex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(input)
}
function isVaildPasswd(input: string): boolean {
    const regex: RegExp = /^[a-zA-Z0-9_@*!]+$/
    return regex.test(input)
}
async function Login() {
    if (email.value == "") {
        ElMessage({
            message: "电子邮件不能为空",
            type: "error",
            plain: true
        })
        return
    }
    else if (passwd.value == "") {
        ElMessage({
            message: "密码不能为空",
            type: "error",
            plain: true
        })
        return
    }
    else if (!isVaildAccount(email.value)) {
        ElMessage({
            message: "电子邮件格式错误",
            type: "error",
            plain: true
        })
        return
    }
    else if (!isVaildPasswd(passwd.value)) {
        ElMessage({
            message: "密码只能由字母、数字、下划线、@、*、!组成",
            type: "error",
            plain: true
        })
        return
    }

    try {

        const res = await axios.get(ServerAddress + "/api/login?email=" + email.value + "&password=" + passwd.value)
        console.log("Login.vue Login() ===> ", res.data, email)

        if (res.data.code != 200) {
            ElMessage({
                message: res.data.message,
                type: "error"
            })
            return
        }
        else {
            localStorage.setItem("token", res.data.data)
            localStorage.setItem('useremail', email.value)
            ElMessage({
                message: res.data.message,
                type: 'success'
            })
            router.push("/")
        }
    } catch (err: any) {
        console.log("Login.vue Login() err ===> ", err)
    }

}


</script>

<style scoped>
@import "/public/css/Login.css"
</style>