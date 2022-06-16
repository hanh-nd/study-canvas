<template>
    <div class="menu-toolbar">
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @select="onMenuItemSelect"
        >
            <el-menu-item index="1">
                <template #title>Select</template>
            </el-menu-item>
            <el-menu-item index="2">
                <template #title>Rectangle</template>
            </el-menu-item>
            <el-menu-item index="3">
                <template #title>Circle</template>
            </el-menu-item>
            <el-menu-item index="4">
                <template #title>Quad</template>
            </el-menu-item>
            <el-menu-item index="5">
                <template #title>Pen</template>
            </el-menu-item>
            <el-menu-item index="6">
                <template #title>Laser</template>
            </el-menu-item>
        </el-menu>
        <el-color-picker v-model="color" @change="$emit('on-color-change', color)" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ArrowType } from '../common/interfaces';

@Options({
    components: {},
    emits: ['on-arrow-type-change', 'on-color-change'],
})
export default class Toolbar extends Vue {
    arrowType: ArrowType = ArrowType.SELECT;
    color = '#000';
    onMenuItemSelect(index: number) {
        switch (+index) {
            case 2:
                this.arrowType = ArrowType.RECTANGLE;
                break;
            case 3:
                this.arrowType = ArrowType.CIRCLE;
                break;
            case 4:
                this.arrowType = ArrowType.QUAD;
                break;
            case 5:
                this.arrowType = ArrowType.LINE;
                break;
            case 6:
                this.arrowType = ArrowType.LASER;
                break;
            default:
                this.arrowType = ArrowType.SELECT;
        }
        this.$emit('on-arrow-type-change', this.arrowType);
    }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    height: 600px;
}
</style>
