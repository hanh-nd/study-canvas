<template>
    <v-circle :config="point" />
</template>
<script lang="ts">
import { Prop, Watch } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class KonvaEraser extends Vue {
    @Prop({ default: false }) isHideCursor!: boolean;

    mounted() {
        window.addEventListener('mousemove', this.onMousemove);
    }

    onMousemove(e: any) {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const { top, left } = canvas.getBoundingClientRect();
            this.point.x = e.clientX - left;
            this.point.y = e.clientY - top;
        }
    }
    point = {
        x: 0,
        y: 0,
        radius: 20,
        fill: 'white',
        stroke: 'black',
        visible: false,
    };

    @Watch('isHideCursor', { immediate: true })
    onCursorChange() {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            if (this.isHideCursor) {
                canvas.style.cursor = 'none';
                this.point.visible = true;
            } else {
                canvas.style.cursor = 'default';
                this.point.visible = false;
            }
        }
    }
}
</script>
