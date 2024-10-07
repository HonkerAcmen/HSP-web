<template>
<button @click="out">登出</button>
</template>

<script setup lang="ts">
function out(){
    localStorage.clear();
    window.location.reload()
}
</script>