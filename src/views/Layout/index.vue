<template>
    <div class="common-layout">
        <header-nav @logout="headleLogout"></header-nav>
        <div class="container-2">
            <div class="sub-title">
                <p>欢迎来到纸飞机<br>你现在可以…</p>
            </div>
            <div class="cards">
                <a href="/createCourse"><el-card shadow="hover" header="创建课程"><img :src="create_pic" alt=""></el-card></a>
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
import HeaderNav from '@/components/HeaderNav.vue'
import create_pic from '/images/Painter.svg'
import join_pic from '/images/Business Plan.svg'
import update_pic from '/images/Order Placed.svg'

function headleLogout() {
    localStorage.clear();
    window.location.reload()
}


</script>

<style>
@import "/css/Layout.css"
</style>