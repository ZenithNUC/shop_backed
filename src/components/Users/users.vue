<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
              <!--添加用户对话框-->
              <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClose">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="addForm.checkPass"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="addDialogVisible = false">取 消</el-button>
                  <el-button @click="addDialogClose">重 置</el-button>
                  <el-button type="primary" @click="addUsers">确 定</el-button>
                </span>
              </el-dialog>
            </div>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
      </div>
      <el-table
        :data="userList"
        style="width: 100%"
        :border ="true"
        :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="usersStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑用户" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="权限分配" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoles(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.username)"></el-button>
            </el-tooltip>
            <el-dialog
              title="修改用户"
              :visible.sync="editDialogVisible"
              width="50%"
              :append-to-body="true"
              @close="editDialogClose">
              <el-form :model="editForm" :rules="editFormRules" label-width="70px" ref="editFormRef">
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
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="editUsers">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="删除用户"
              :visible.sync="deleteDialogVisible"
              width="50%"
              :append-to-body="true"
              @close="editDialogClose">
              <span>此操作将永久删除用户{{delUsername}}并不可恢复，请确认是否继续？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteUser(scope.row.id)">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="权限分配"
              :visible.sync="rightDialogVisible"
              width="50%"
              :append-to-body="true"
              @close="closeRightDialog">
              <p>当前用户:{{userInfo.username}}</p>
              <p>当前角色:{{userInfo.role_name}}</p>
              <el-select v-model="selectedRoleId" placeholder="请选择角色">
                <el-option v-for="item in rolelist" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
              </el-select>
              <span slot="footer" class="dialog-footer">
                <el-button @click="rightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      const emailRe = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      const isEmailRe = emailRe.test(value)
      if (!isEmailRe) {
        callback(new Error('请检查邮箱格式!'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      const emailRe = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/
      const isEmailRe = emailRe.test(value)
      if (!isEmailRe) {
        callback(new Error('请检查手机号码格式'))
      } else {
        callback()
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 15
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      rightDialogVisible: false,
      delUsername: '',
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        checkPass: ''
      },
      editForm: {
      },
      selectedRoleId: '',
      userInfo: {
      },
      rolelist: [],
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async usersStateChanged (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新状态成功')
    },
    async addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addUsers () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        // 刷新用户列表
        await this.getUserList()
      })
    },
    async showEditDialog (userId) {
      const { data: res } = await this.$http.get('users/' + userId)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async closeEditDialog () {
      this.editDialogVisible = false
    },
    async editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editUsers () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败')
        }
        this.$message.success('更新用户成功')
        this.editDialogVisible = false
        // 刷新用户列表
        await this.getUserList()
      })
    },
    async showDeleteDialog (username) {
      this.delUsername = username
      this.deleteDialogVisible = true
    },
    async deleteUser (userId) {
      const { data: res } = await this.$http.delete('users/' + userId)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.deleteDialogVisible = false
      await this.getUserList()
    },
    async setRoles (userinfo) {
      this.userInfo = userinfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      this.rightDialogVisible = true
    },
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('用户分配角色失败')
      }
      this.$message.success('用户分配角色成功')
      await this.getUserList()
      this.rightDialogVisible = false
    },
    closeRightDialog () {
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
</style>
