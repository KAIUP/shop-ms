<template>
  <div id="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      //清空 sessionStorage 保存的token
      window.sessionStorage.clear()
      //路由跳转到登陆页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>>
