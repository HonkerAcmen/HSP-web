<template>
    <div class="header-nav container">
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
              <el-dropdown-item><a href="/profile">个人主页</a></el-dropdown-item>
              <el-dropdown-item>个人资料设置</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { UserFilled } from '@element-plus/icons-vue'
  import { defineEmits } from 'vue'
  
  const emit = defineEmits(['logout'])
  
  const handleLogout = () => {
    emit('logout')
  }
  </script>
  
  <style scoped>
  .container .head {
    position: relative;
    background-color: #fff;
    height: 60px;
    box-shadow: 0px 1px 7px #7c7c7c;
    margin-bottom: 13px;
  }
  
  .head .el-dropdown {
    position: relative;
  }
  
  .head .el-dropdown .el-avatar {
    position: absolute;
    top: 10px;
    left: 94vw;
    transition: 0.5s;
  }
  
  .head .el-avatar:hover {
    transform: scale(1.2);
  }
  
  .head .el-avatar:active {
    background-color: #fff;
  }
  
  .container .paper-plane {
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: var(--primary-color);
    clip-path: polygon(50% 0%, 0% 100%, 50% 80%, 100% 100%);
  }
  
  .plane-1 {
    left: -100px;
    animation: fly1 6s ease-in-out infinite;
  }
  
  @keyframes fly1 {
    0% {
      transform: translateX(0) translateY(0) rotate(0deg);
    }
    25% {
      transform: translateX(25vw) translateY(-5vh) rotate(30deg);
    }
    50% {
      transform: translateX(50vw) translateY(0) rotate(0deg);
    }
    75% {
      transform: translateX(75vw) translateY(10vh) rotate(-30deg);
    }
    100% {
      transform: translateX(100vw) translateY(0) rotate(0deg);
    }
  }
  
  .head ul {
    position: absolute;
    left: 80%;
    top: 7px;
  }
  
  .head ul li {
    margin: 10px 30px;
  }
  
  .head ul li span a {
    font-size: 14px;
    color: #1c1c1c;
    font-weight: bolder;
    cursor: pointer;
    transition: 0.3s;
  }
  
  .head ul li span a:hover {
    color: #676767;
  }
  
  .head ul li:nth-child(1) span a {
    color: #676767;
  }
  
  .head ul li:nth-child(1) span a:hover {
    color: #1c1c1c;
  }
  </style>
  