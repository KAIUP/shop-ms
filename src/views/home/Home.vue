<template>
    <el-container>
      <!--头部区域-->
      <el-header>
        <div>
          <img src="~assets/img/logo.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!--侧边栏区域-->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <aside-cont :menuList="menuList" @toggleCollapse="toggleCollapse"/>
        </el-aside>
        <!--主题区域-->
        <el-main>
          <!--路由占位符,展示home下的所有子路由-->
          <router-view/>
        </el-main>
      </el-container>
      
    </el-container>
</template>

<script>
import AsideCont from 'components/asideCont/AsideCont'

export default {
  components: {
    AsideCont
  },
  data() {
    return {
      menuList: [],
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      //清空 sessionStorage 保存的token
      window.sessionStorage.clear()
      //路由跳转到登陆页
      this.$router.push('/login')
    },
    toggleCollapse(isCollapse) {
      this.isCollapse = isCollapse
    }, 

    //获取全有菜单数据
    async getMenuList() {
      const {data: res}  = await this.$axios.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }

  .el-header {
    color: #fff;
    font-size: 20px;
    background-color: #373d41;
    padding-left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    >div {
      display: flex;
      align-items: center;

      img {
        width: 60px;
        height: 60px;
        margin-right: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
  }

  .el-main {
    background-color: #eaedf1;
  }
</style>>
