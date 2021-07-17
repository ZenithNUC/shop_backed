<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/logo.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -150px 0 0 -225px;
    .avatar_box{
      height: 130px;
      width: 130px;
      border:5px solid #81ecec;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
</style>
