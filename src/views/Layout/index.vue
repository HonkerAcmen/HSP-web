<template>
    <div class="common-layout">
        <header-nav ></header-nav>
        <div class="container-2">
            <div class="sub-title">
                <p>
                    欢迎来到纸飞机<br>
                    <span class="dynamic-text">{{ dynamicText }}</span>
                </p>
            </div>
            <div class="cards">
                <a href="/createCourse" @click.prevent="handleCourseSelection('/createCourse')">
                    <el-card shadow="hover" header="创建课程">
                        <img :src="create_pic" alt="">
                    </el-card>
                </a>
                <a href="#" @click.prevent="handleCourseSelection('#')">
                    <el-card shadow="hover" header="加入课程">
                        <img :src="join_pic" alt="">
                    </el-card>
                </a>
                <a href="#" @click.prevent="handleCourseSelection('#')">
                    <el-card shadow="hover" header="提交作业">
                        <img :src="update_pic" alt="">
                    </el-card>
                </a>
            </div>
        </div>
    </div>
    <div class="down">
        <p><span>2024 @CopyRight</span> 纸飞机团队</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HeaderNav from '@/components/HeaderNav.vue';
import create_pic from '/images/Painter.svg';
import join_pic from '/images/Business Plan.svg';
import update_pic from '/images/Order Placed.svg';
import router from '@/router';

const dynamicText = ref('');

/** 打字机效果的文本 */
const texts = [
    "提交作业...",
    "创建课程...",
    "加入课程..."
];
const typingSpeed = 100; // 每个字符的延迟（毫秒）
const displayTimes = 2000; // 每个文本显示的时间（毫秒）

/** 初始化打字机效果 */
const typeText = (text: string, callback: Function) => {
    let index = 0;
    dynamicText.value = ''; // 清空文本

    const typeCharacter = () => {
        if (index < text.length) {
            dynamicText.value += text.charAt(index); // 逐字添加
            index++;
            setTimeout(typeCharacter, typingSpeed); // 设置下一个字符的显示时间
        } else {
            setTimeout(callback, displayTimes); // 完成后等待一段时间后调用回调
        }
    };

    typeCharacter(); // 启动打字任务
};

/** 回退效果 */
const resetText = (currentText: string, callback: Function) => {
    let index = currentText.length - 1;

    const removeCharacter = () => {
        if (index >= 0) {
            dynamicText.value = currentText.substring(0, index); // 逐字去除
            index--;
            setTimeout(removeCharacter, typingSpeed); // 设置去除下一个字符的时间
        } else {
            callback(); // 完成后调用回调
        }
    };

    removeCharacter(); // 启动去除任务
};

/** 顺序显示文本并循环 */
const showTextsInOrder = (index: number) => {
    if (index >= texts.length) index = 0; // 如果超过文本长度则重新开始

    // 当前的文本
    const currentText = texts[index];

    // 显示当前文本
    typeText(currentText, () => {
        // 回退当前文本
        resetText(currentText, () => {
            // 递归调用显示下一个文本
            showTextsInOrder(index + 1);
        });
    });
};

onMounted(() => {
    showTextsInOrder(0); // 启动文本显示循环
});


function handleCourseSelection(url: string) {
    router.push(url);
}
</script>

<style>
@import "/css/Layout.css";
.dynamic-text {
    border-right: 2px solid; /* 仿佛文本光标 */
    white-space: nowrap; /* 防止换行 */
    overflow: hidden; /* 隐藏文本以外的部分 */
}
</style>