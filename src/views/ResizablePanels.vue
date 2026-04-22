<template>
  <div class="split-container" ref="container">
    <div class="panel top"  :style="{ height: topHeight + 'px' }">
      <slot name="topo" />
    </div>

    <div
      class="resizer"
      @pointerdown="startDrag"
    >
      <v-icon size="small">$mdiUnfoldMoreHorizontal</v-icon>
    </div>

    <div class="panel bottom" >
      <slot name="bottom" />
    </div>

    <div
      v-if="dragging"
      class="drag-overlay"
      @pointermove="onDrag"
      @pointerup="stopDrag"
      @pointercancel="stopDrag"
    />
  </div>
</template>

<script>
export default {
  name: "SplitVertical",

  data() {
    return {
      dragging: false,
      topHeight: 500,
      minTop: 80,
      minBottom: 120,
    };
  },

  methods: {
    startDrag(e) {
      e.preventDefault();
      this.dragging = true;

      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    },

    onDrag(e) {
      if (!this.dragging) return;

      const rect = this.$refs.container.getBoundingClientRect();
      const newHeight = e.clientY - rect.top;
      const maxTop = rect.height - this.minBottom;

      if (newHeight >= this.minTop && newHeight <= maxTop) {
        this.topHeight = newHeight;
      }
    },

    stopDrag() {
      this.dragging = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    },
  },

  beforeUnmount() {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  },
};
</script>

<style scoped>
.split-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.panel {
  min-height: 0;
  overflow: auto;
}

.top {
  overflow: hidden;
}

.bottom {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.resizer {
  height: 8px;
  flex-shrink: 0;
  cursor: row-resize;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.resizer:hover {
  background: #555;
}

.resizer i {
  color: #fff;
}

.drag-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  cursor: row-resize;
  background: transparent;
}

/* evita iframe quebrando layout */
.top :deep(iframe) {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
</style>