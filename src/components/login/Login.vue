<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/img/logo.png" alt="" class="avatar">
      </div>
      <el-form :model="fromInfo" :rules="rules" ref="from" label-width="0px" class="login_from">
        <!--用户-->
        <el-form-item prop="username">
          <el-input v-model="fromInfo.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="fromInfo.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="bottons">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetInfo">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromInfo: {
        username: 'admin',
        password: '123456'
      },
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入管路员名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度最少6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetInfo() {
      this.$refs.from.resetFields()
    },
    login() {
      //表单预验证
      this.$refs.from.validate(async valid => {
        if(!valid) return
        //对象的结构 直接将返回结果的data数据返回
        const {data: res} = await this.$axios.post('login',this.fromInfo)
        if(res.meta.status !== 200) return this.$message.error('登陆失败！')
        this.$message.success('登陆成功~')
        //1.将登陆成功后的 token 保存到客户端的 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        //2.页面跳转到后台主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    position: relative;
    height: 100%;
    background-color: #2b4b6b;
  }

  .login_box {
    width: 460px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 3px;

    .avatar_box {
      width: 120px;
      height: 120px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: 0;
      background-color: #fff;
      padding: 10px;
      border-radius: 50%;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #ddd;

      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .login_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .bottons {
    display: flex;
    justify-content: flex-end;
  }
</style>