<template>
  <div class="header-nav container">
    <div class="head">
      <ul>
        <li><span><a href="#">我的作业</a></span></li>
        <li><span><a href="#">我的课程</a></span></li>
        <li>

          <el-dropdown>
            <el-avatar :icon="UserFilled" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item><a href="/profile">个人主页</a></el-dropdown-item>
                <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue'
import { defineEmits } from 'vue'


const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
};
</script>

<style scoped>
.container .head {
  position: relative;
  background-color: #fff;
  height: 60px;
  box-shadow: 0px 1px 7px #7c7c7c;
  margin-bottom: 13px;
  display: flex;
  justify-content: flex-end;
  /* 将内容靠右 */
  align-items: center;
  padding-right: 20px;
  /* 调整右侧间距 */
}

.head ul {
  display: flex;
  align-items: center;
  gap: 20px;
  /* 调整 li 之间的间距 */
  list-style: none;
  margin: 0;
  padding: 0;
}

.head li {
  display: flex;
  align-items: center;
}
.head span a:hover{
  color: #000000;
}

.head .el-avatar{
  transition: 0.3s;
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

</style>
