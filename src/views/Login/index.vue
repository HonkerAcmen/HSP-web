<template>
    <body>
        <div class="sky">
            <div class="box">
                <div class="title"><span>停机坪</span>
                    <p>欢迎回来</p>
                </div>
                <el-input v-model="account" style="width: 300px;" placeholder="请输入电子邮箱" />
                <el-link type="info" :underline=false style="transition: 0.3s;">忘记密码？</el-link>
                <el-input v-model="passwd" style="width: 300px" type="password" placeholder="请输入密码" show-password />
                <div class="login-button" @click="Login"><span>登陆</span></div>
                <el-link type="info" style="transition: 0.3s;">没有账号？点击注册</el-link>
            </div>
            <div class="paper-plane plane-1"></div>
            <div class="paper-plane plane-2"></div>
        </div>
    </body>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue'; // 引入 onMounted 钩子

const account = ref("")
const passwd = ref("")

function isVaildAccount(input: string): boolean {
    const regex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(input)
}
function isVaildPasswd(input: string): boolean {
    const regex: RegExp = /^[a-zA-Z0-9_@*!]+$/
    return regex.test(input)
}
function Login() {
    if (account.value == "") {
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
    else if (!isVaildAccount(account.value)) {
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
}

</script>

<style scoped>
@import "/public/css/Login.css"
</style>