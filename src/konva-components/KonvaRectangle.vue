<template>
    <v-rect :config="config" @mouseover="onMouseover" @mouseout="onMouseout" />
</template>
<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { Rectangle } from '@/common/interfaces';

@Options({
    components: {},
})
export default class KonvaRectangle extends Vue {
    @Prop() rectangle!: Rectangle;

    get config() {
        return {
            ...this.rectangle,
            draggable: true,
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
