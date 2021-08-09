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
          <el-button type="primary">添加角色</el-button>
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
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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
      rightlist: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultKeys: [],
      roleId: ''
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
    setRightDialogClose () {
      this.defaultKeys = []
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
