<script setup>
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
</script>

<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="global-footer">
        <hr>
        <br/>
        <a href="/privacy-policy/privacy-policy">Privacy policy</a>
        <br/>
        <br/>
        <a href="https://nodepa.org">Copyright &copy; 2019-2022 Norwegian Development Partners</a>
      </div>
    </template>
  </ParentLayout>
</template>

<style lang="css">
.global-footer {
  text-align: center;
}
</style>
