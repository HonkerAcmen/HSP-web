import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login/index.vue";
import Register from "@/views/Register/index.vue";
import Layout from "@/views/Layout/index.vue";
import Profile from "@/views/Profile/index.vue";
import ModifyProfile from "@/views/ModifyProfile/index.vue";
import createCourse from "@/views/CreateCourse/index.vue";
import { ElMessage } from "element-plus";
import { useCookies } from "@vueuse/integrations/useCookies";

const cookies = useCookies();

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", name: "layout", component: Layout },
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
        { path: "/profile", name: "Profile", component: Profile },
        { path: "/modifyProfile", name: "ModifyProfile", component: ModifyProfile },
        { path: "/createCourse", name: "CreateCourse", component: createCourse }
    ],
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");

    if (token || to.path === "/login" || to.path === "/register") {
        next();  // 允许访问
    } else {
        next("/login");  // 重定向到登录页面
    }
});

export default router;
