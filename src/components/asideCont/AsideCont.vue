<template>
  <div class="aside-cont">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
      :unique-opened="true" background-color="#333744" text-color="#fff" 
      active-text-color="#409EFF" :collapse-transition="false" :collapse="isCollapse"
      :router="true" :default-active="$route.path">
      <!--一级菜单-->
      <el-submenu :index="item.id + ''" v-for="(item,index) in menuList" :key="item.id">
        <!--一级菜单模板-->
        <template slot="title">
           <!--图标-->
          <i :class="icons[index]"></i>
           <!--文本-->
          <span>{{item.authName}}</span>
        </template>
           <!--二级菜单-->
          <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
            <!--二级菜单模板-->
            <template slot="title">
              <!--图标-->
              <i class="el-icon-menu"></i>
              <!--文本-->
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    menuList: Array,
  },
  data() {
    return {
      icons: {
      '0': 'el-icon-s-custom',
      '1': 'el-icon-s-tools',
      '2': 'el-icon-s-goods',
      '3': 'el-icon-s-order',
      '4': 'el-icon-s-marketing'
      },
      isCollapse: false
    }
  },
  methods: {
    //菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      this.$emit('toggleCollapse',this.isCollapse)
    }
  }
}
</script>

<style>
  .aside-cont .el-menu {
    border-right: none;
  }

  .toggle-button {
    line-height: 24px;
    color: #fff;
    font-size: 12px;
    background-color: #4a5064;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>