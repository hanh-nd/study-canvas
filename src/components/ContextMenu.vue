<template>
    <div id="context-menu">
        <el-menu @select="onMenuItemSelect">
            <el-menu-item index="1">
                <template #title>Delete</template>
            </el-menu-item>
            <el-menu-item index="2">
                <template #title>Duplicate</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
    emits: ['on-delete', 'on-duplicate'],
})
export default class ContextMenu extends Vue {
    onMenuItemSelect(index: number) {
        switch (+index) {
            case 1:
                this.$emit('on-delete');
                break;
            case 2:
                this.$emit('on-duplicate');
                break;
        }
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.style.visibility = 'hidden';
        }
    }
}
</script>
<style scoped>
#context-menu {
    position: absolute;
    visibility: hidden;
    --el-menu-active-color: '#303133';
}
</style>
