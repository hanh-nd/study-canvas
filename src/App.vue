<template>
    <el-row>
        <el-col :span="4">
            <Toolbar
                class="toolbar"
                @on-arrow-type-change="onArrowTypeChange"
                @on-color-change="onColorChange"
                @on-export-image="exportImage"
                @on-save-file="onSaveFile"
                @on-open-file="onOpenFile"
            />
        </el-col>
        <el-col :span="20">
            <MyKonva
                ref="konva"
                id="canvas"
                class="konva"
                :arrowType="arrowType"
                :currentColor="currentColor"
                :importArr="importArr"
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
    importArr = [];

    onArrowTypeChange(arrowType: ArrowType) {
        this.arrowType = arrowType;
    }
    onColorChange(currentColor: string) {
        this.currentColor = currentColor;
    }
    exportImage() {
        const uri = (this.$refs.konva as any).$refs.stage.getNode().toDataURL();
        const link = document.createElement('a');
        link.href = uri;
        link.download = 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    onSaveFile() {
        const uri = (this.$refs.konva as any).$refs.stage.getNode().toJSON();
        const link = document.createElement('a');
        const file = new Blob([uri], { type: 'application/json' });
        link.href = URL.createObjectURL(file);
        link.download = 'save';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    onOpenFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = () => {
            const file = input?.files?.[0] || null;
            if (file && file.name.includes('.json')) {
                const reader = new FileReader();
                reader.onload = (res) => {
                    const content = res.target?.result || '';
                    if (typeof content === 'string') {
                        const obj = JSON.parse(content);
                        this.importArr =
                            obj?.children?.[0]?.children.map((ele: any) => ele.attrs) ||
                            [];
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
}
</script>
<style scoped>
.konva {
    height: 100%;
    border: 2px black solid;
}
</style>
