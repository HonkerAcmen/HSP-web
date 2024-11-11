<template>
    <div class="sky">
        <el-form ref="ruleFormRef" style="max-width: 300px" :model="ruleForm" status-icon :rules="rules"
            label-width="auto" class="demo-ruleForm" label-position="top">
            <div class="title"><span>登机坪</span>
                <p>加入纸飞机</p>
            </div>
            <el-form-item label="" prop="email">
                <el-input v-model="ruleForm.email" placeholder="电子邮件" />
            </el-form-item>
            <el-form-item label="" prop="pass">
                <el-input v-model="ruleForm.pass" placeholder="密码" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="" prop="checkPass">
                <el-input v-model="ruleForm.checkPass" placeholder="确认密码" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-link type="info" style="transition: 0.3s;" href="/login" :underline="false">已有账号？点击登陆</el-link>
                <div class="button" @click="submitForm(ruleFormRef)">
                    <p>提交</p>
                </div>
            </el-form-item>
        </el-form>
        <div class="paper-plane plane-1"></div>
        <div class="paper-plane plane-2"></div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios';
import { ServerAddress } from '@/utils/serverURL';
import router from '@/router';

const ruleFormRef = ref<FormInstance>()

function isVaildAccount(input: string): boolean {
    const regex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(input)
}

function isVaildPasswd(input: string): boolean {
    const regex: RegExp = /^[a-zA-Z0-9_@*!]+$/
    return regex.test(input)
}

const checkemail = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入您的电子邮件！'))
    } else if (!isVaildAccount(value)) {
        callback(new Error('电子邮件格式错误！'))
    } else {
        callback()
    }
}

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('密码不能为空'))
    } else if (String(value).length < 6) {
        callback(new Error('密码不能少于6位'))
    }
    else if (String(value).length > 16) {
        callback(new Error('密码不能多于20位'))
    }
    else if (!isVaildPasswd(value)) {
        callback(new Error('密码格式错误, 只允许字母、数字、_、@、*符号！'))
    } else {
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass')
        }
        callback()
    }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== ruleForm.pass) {
        callback(new Error("两次密码不一致"))
    } else {
        callback()
    }
}

const ruleForm = reactive({
    pass: '',
    checkPass: '',
    email: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
    pass: [{ validator: validatePass, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
    email: [{ validator: checkemail, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    console.log('Submitting form...')
    formEl.validate((valid) => {
        if (valid) {
            register()
        } else {
            console.log('error submit!')
            ElMessage({
                message: '请修正错误并再次提交！',
                type: 'error',
            });
        }
    })
}

async function register() {
    const data = {
        email: ruleForm.email,
        password: ruleForm.pass
    }
    try {
        const res = await axios.post(ServerAddress + "/api/register", data)
        console.log("Register.vue Register() ===> ", res.data, data)
        // console.log(axios.defaults.headers)
        if (res.data.code != 201) {
            ElMessage({
                message: res.data.message,
                type: "error"
            })
        } else {
            ElMessage({
                message: res.data.message,
                type: "success"
            })
            localStorage.setItem("token", res.data.data)
            localStorage.setItem('useremail', data.email)

            router.push("/")
        }
    } catch (err: any) {
        console.log("Register.vue Register() error ===> ", err.data)
        ElMessage({
            message: err.data,
            type: "error"
        })
    }
}

</script>

<style scoped>
@import "/public/css/Register.css";
</style>