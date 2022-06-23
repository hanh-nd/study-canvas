<template>
    <v-circle :config="config" @mouseover="onMouseover" @mouseout="onMouseout" />
</template>
<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import { Circle } from '@/common/interfaces';
export default class KonvaCircle extends Vue {
    @Prop() circle!: Circle;

    get config() {
        return {
            ...this.circle,
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
