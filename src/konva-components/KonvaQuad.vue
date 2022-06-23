<template>
    <v-shape :config="config" @mouseover="onMouseover" @mouseout="onMouseout" />
</template>
<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import { Shape } from '@/common/interfaces';
export default class KonvaQuad extends Vue {
    @Prop() quad!: Shape;

    get config() {
        return {
            ...this.quad,
            sceneFunc: (context: any, shape: any) => {
                context.beginPath();
                context.moveTo(this.quad.x, this.quad.y);
                context.lineTo(
                    (this.quad.x || 0) + (this.quad.width || 0),
                    (this.quad.y || 0) + (this.quad.height || 0) + 20,
                );
                context.quadraticCurveTo(
                    (this.quad.x || 0) + (this.quad.width || 0) + 10,
                    (this.quad.y || 0) + (this.quad.height || 0),
                    (this.quad.x || 0) + (this.quad.width || 0),
                    (this.quad.y || 0) + (this.quad.height || 0) + 50,
                );
                context.closePath();

                // special Konva.js method
                context.fillStrokeShape(shape);
            },
            draggable: true,
            strokeScaleEnabled: false,
        };
    }

    onMouseover() {
        document.body.style.cursor = 'pointer';
    }

    onMouseout() {
        document.body.style.cursor = 'default';
    }
}
</script>
