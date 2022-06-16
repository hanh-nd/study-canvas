<template>
    <v-circle :config="point" />
    <v-line :config="laser" />
</template>
<script lang="ts">
import { Prop, Watch } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { Line } from '@/common/interfaces';

@Options({
    components: {},
})
export default class KonvaLaser extends Vue {
    @Prop() laser!: Line;
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
        radius: 5,
        fill: 'red',
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
