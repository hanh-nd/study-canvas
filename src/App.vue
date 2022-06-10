<template>
    <el-row>
        <el-col :span="4">
            <Toolbar
                class="toolbar"
                @on-arrow-type-change="onArrowTypeChange"
                @on-color-change="onColorChange"
            />
        </el-col>
        <el-col :span="20">
            <MyKonva
                id="canvas"
                class="konva"
                :arrowType="arrowType"
                :currentColor="currentColor"
            />
        </el-col>
    </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ArrowType } from './common/interfaces';
import MyKonva from './components/MyKonva.vue';
import Toolbar from './components/Toolbar.vue';

@Options({
    components: { MyKonva, Toolbar },
})
export default class App extends Vue {
    arrowType: ArrowType = ArrowType.SELECT;
    currentColor = '';

    onArrowTypeChange(arrowType: ArrowType) {
        this.arrowType = arrowType;
    }
    onColorChange(currentColor: string) {
        this.currentColor = currentColor;
    }
}
</script>
<style scoped>
.konva {
    height: 100%;
    border: 2px black solid;
}
</style>
