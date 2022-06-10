<template>
    <v-line :config="config" @mouseover="onMouseover" @mouseout="onMouseout" />
</template>
<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { Line } from '@/common/interfaces';

@Options({
    components: {},
})
export default class KonvaLine extends Vue {
    @Prop() line!: Line;

    get config() {
        return {
            ...this.line,
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
