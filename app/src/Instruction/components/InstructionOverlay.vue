<template>
  <div
    class="instruction-overlay"
    v-click-outside="false"
    data-test="instruction-overlay"
  />
</template>

<style>
.instruction-overlay {
  display: flex;
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 74px;
  right: 0;
  pointer-events: none;
  z-index: 3;
  opacity: 0.4;
  background-color: black;
}
</style>
