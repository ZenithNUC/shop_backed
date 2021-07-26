<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/img/logo.png" alt="">
        <span>蒋姨厨房后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <el-row class="tac">
          <el-col>
            <h2>功能菜单</h2>
            <el-menu
              background-color="#f0932b"
              text-color="#ffffff"
              active-text-color="#ecf0f1"
              unique-opened="true"
              :router="true"
              :default-active="activePath"
              >
              <el-submenu :index="'/' + item.path" v-for="item in menuList" :key="item.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item.authName}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="subItem in item.children" :index="'/' + subItem.path" :key="subItem.id" @click="saveNavState('/' + subItem.path)">{{subItem.authName}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!--右侧内容-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-menu i{
  color: #ffffff;
}
.el-aside h2{
  align-items: center;
  text-align: center;
  color: #ffffff;
}

.el-header{
  background-color: #f0932b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  > div {
    display: flex;
    align-items: center;
    span{
      color: #ffffff;
      margin-left: 20px;
    }
  }
}

.el-header img{
  height: 50px;
  width: 50px;
}

.el-aside{
  background-color: #ffbe76;
  .el-menu{
    border-right: 0;
    .el-submenu__title{
      color: white;
      .el-submenu__icon-arrow el-icon-arrow-down{
        color: white;
      }
    }
  }
}
.el-main{
  background-color: #c7ecee;
}
</style>
