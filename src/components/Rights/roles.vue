<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
          <el-dialog
            title="添加角色"
            :visible.sync="addDialogVisible"
            width="50%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
              <el-form-item label="角色名" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addForm.roleDesc"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button @click="addDialogClose">重 置</el-button>
              <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table
        :data="rolelist"
        style="width: 100%"
        :border ="true"
        :stripe="true">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['vcenter' , 'bdbottom',i1 === 0 ? 'bdtop' : '']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="['vcenter' , i2 !== 0 ? 'bdtop' : '']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag type="danger" closable @close="removeRightById(scope.row,item3.id)" v-for="item3 in item2.children" :key="item3.id">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column prop="id" label="角色id" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="权限分配" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
          <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClose"
            :append-to-body="true">
            <el-tree
              :data="rightlist"
              :props="treeProps"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="defaultKeys"
              ref="treeRef"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
              </span>
          </el-dialog>
          <el-dialog
            title="删除角色"
            :visible.sync="deleteDialogVisible"
            width="50%"
            :append-to-body="true">
            <span>此操作将永久删除角色 {{roleName}} 并不可恢复，请确认是否继续？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRole">确 定</el-button>
              </span>
          </el-dialog>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolelist: [],
      setRightDialogVisible: false,
      deleteDialogVisible: false,
      addDialogVisible: false,
      rightlist: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultKeys: [],
      roleId: '',
      roleName: '',
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 12, message: '角色名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
    },
    async removeRightById (role, rightId) {
      const confirmResult = await this.$messagebox.confirm('此操作将删除该角色此权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除成功')
      role.children = res.data
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('权限获取失败')
      }
      this.$message.success('权限获取成功')
      this.rightlist = res.data
      this.getLeafKeys(role, this.defaultKeys)
      this.setRightDialogVisible = true
    },
    showDeleteDialog (role) {
      this.deleteDialogVisible = true
      this.roleName = role.roleName
      this.roleId = role.id
    },
    async deleteRole () {
      const { data: res } = await this.$http.delete(`roles/${this.roleId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('角色删除失败')
      }
      this.$message.success('角色删除成功')
      this.deleteDialogVisible = false
      await this.getRoleList()
    },
    closeDeleteDialog () {
      this.roleName = ''
      this.roleId = ''
    },
    setRightDialogClose () {
      this.defaultKeys = []
      this.roleId = ''
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('权限分配失败')
      }
      this.$message.success('权限分配成功')
      this.setRightDialogVisible = false
      await this.getRoleList()
    },
    async addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        // 刷新用户列表
        await this.getRoleList()
      })
    }
  },
  name: 'roles'
}
</script>

<style lang="less" scoped>
.el-table{
  margin-top: 20px;
}

.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom{
  border-bottom: 1px solid #eee;
}

.vcenter{
  display: flex;
  align-items: center;
}
</style>
