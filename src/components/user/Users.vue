<template>
  <div class="user">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!--搜索区域-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="dialogVisible = true">添加</el-button></el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="users" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column> //索引列
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="editDialogVisible(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
           <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 7]"
      :page-size="queryInfo.pagesize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="dialogClose">
      <el-form :model="addForm" :rules="addFormRules" label-width="70px" status-icon ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm" :rules="rules" label-width="70px" status-icon ref="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义表单验证规则
     var checkEmail = (rule, value, callback) => {
       //校验邮箱的正则
       const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
       if(regEmail.test(value)) return callback()
       callback(new Error('请输入正确的邮箱'))
     }
     var checkMobile = (rule, value, callback) => {
       const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
       if(regMobile.test(value)) return callback()
       callback(new Error('请输入正确的手机号'))
     }
    return {
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //每页展示多少条数据
        pagesize: 2
      },
      users: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
     editForm: {
        username: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
         username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符之间', trigger: 'blur' }
         ],
         password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少 6 个字符', trigger: 'blur' }
         ],
         email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
         ],
         mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
         ],
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const {data: res} = await this.$axios.get('users', { params: this.queryInfo })
      if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.users = res.data.users
      this.total = res.data.total
    },
    //监听每页显示数据条数
    handleSizeChange(nweSize) {
      this.queryInfo.pagesize = nweSize
      this.getUserList()
    },
    //监听页码改变
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getUserList()
    },
    //更改用户状态
    async changeState(usersInfo) {
      const {data: res} = await this.$axios.put(`users/${usersInfo.id}/state/${usersInfo.mg_state}`)
      if(res.meta.status !== 200) {
        usersInfo.mg_state = !usersInfo.mg_state
        return this.$message.error('更改用户状态失败！')
      }
      this.$message.success('更改用户状态成功~')
    },
    //添加用户对话框关闭后清空表单内容
    dialogClose() {
      this.$refs.addForm.resetFields()
    },
    //确认按钮添加用户
    addUser() {
      this.$refs.addForm.validate(async valid => {
        if(!valid) return
        //添加用户的网络请求
        const {data: res} = await this.$axios.post('users',this.addForm)
        if(res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        //关闭对话框
        this.addDialogVisible = false
        //重新获取用户列表
        this.getUserList()
      })
    },
    editDialogVisible(usersInfo) {
      
    }
  }
}
</script>

<style>

</style>