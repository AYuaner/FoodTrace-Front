<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用FoodTrace溯源系统</div>
    <div class="dashboard-name">用户: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
  &-name {
    font-size: 30px;
    color: brown;
  }
}
</style>
