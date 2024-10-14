<template>
    <div class="common-layout">
        <div class="container">
            <div class="head">
                <ul>
                    <li><span><a href="#">作业</a></span></li>
                    <li><span><a href="#">课程</a></span></li>
                </ul>
                <div class="paper-plane plane-1"></div>
                <el-dropdown>
                    <el-avatar :icon="UserFilled" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人主页</el-dropdown-item>
                            <el-dropdown-item>个人资料设置</el-dropdown-item>
                            <el-dropdown-item @click="out">登出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

            </div>

        </div>
        <div class="container-2">
            <div class="sub-title"><p>欢迎来到纸飞机<br>你现在可以…</p></div>
            <div class="cards">
                <el-card shadow="hover" header="创建课程"><img :src="create_pic" alt=""></el-card>
                <el-card shadow="hover" header="加入课程"><img :src="join_pic" alt=""></el-card>
                <el-card shadow="hover" header="提交作业"><img :src="update_pic" alt=""></el-card>
            </div>

        </div>
    </div>
    <div class="down">
        <p><span>2024 @CopyRight</span> 纸飞机团队</p>
    </div>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue'
import create_pic from '/images/Painter.svg'
import join_pic from '/images/Business Plan.svg'
import update_pic from '/images/Order Placed.svg'
function out() {
    localStorage.clear();
    window.location.reload()
}
</script>

<style>
@import "/css/Layout.css"
</style>