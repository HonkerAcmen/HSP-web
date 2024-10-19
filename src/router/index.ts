import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/Login/index.vue";
import Register from "@/views/Register/index.vue";
import Layout from "@/views/Layout/index.vue";
import Profile from "@/views/Profile/index.vue";
import { jwtDecode } from "jwt-decode";
import { ElMessage } from "element-plus";
import { useUserDataStore } from "@/stores/userDataStore";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "layout",
            component: Layout,
        },
        {
            path: "/login",
            name: "login",
            component: Login,
            beforeEnter(to, from, next) {
                if (localStorage.getItem("token")) {
                    next("/");
                } else {
                    next();
                }
            },
        },
        {
            path: "/register",
            name: "register",
            component: Register,
            beforeEnter(to, from, next) {
                if (localStorage.getItem("token")) {
                    next("/");
                } else {
                    next();
                }
            },
        },
        {
            path: "/profile",
            name: "Profile",
            component: Profile,
        },
    ],
});

router.beforeEach((to, from, next) => {
    const store = useUserDataStore();
    const token = localStorage.getItem("token");
    let isLogin = false;

    if (token) {
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
            try {
                const decodedToken: any = jwtDecode(token);
                if (store.email === "") {
                    console.error("请输入邮箱");
                    ElMessage({
                      message: "邮箱不能为空",
                      type: "error",
                  });
                    localStorage.clear();
                } else if (
                    decodedToken.userEmail &&
                    store.email === decodedToken.userEmail
                ) {
                    isLogin = true;
                    console.log("用户已登录");
                }
            } catch (error) {
                console.error("JWT 解码失败:", error);
                ElMessage({
                    message: "无效的用户凭证",
                    type: "error",
                });
                localStorage.clear();
            }
        } else {
            console.warn("无效的 token 格式");
            ElMessage({
                message: "无效的用户凭证",
                type: "error",
            });
            localStorage.clear();
        }
    }

    if (isLogin || to.path === "/login" || to.path === "/register") {
        next();
    } else {
        next("/login");
    }
});

export default router;
