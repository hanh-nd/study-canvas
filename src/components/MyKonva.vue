<template>
    <div @keydown.delete="deleteShape">
        <v-stage
            ref="stage"
            :config="stageSize"
            @mousedown="onStageMousedown"
            @touchstart="onStageMousedown"
            @mousemove="onStageMousemove"
            @mouseup="onStageMouseup"
        >
            <v-layer ref="layer">
                <KonvaRectangle
                    v-for="rectangle in rectangles"
                    :key="rectangle.name"
                    :rectangle="rectangle"
                    @transformend="handleTransform"
                    @dragstart="moveToTop(ArrowType.RECTANGLE)"
                    @click="moveToTop(ArrowType.RECTANGLE)"
                />
                <KonvaCircle
                    v-for="circle in circles"
                    :key="circle.name"
                    :circle="circle"
                    @transformend="handleTransform"
                    @dragstart="moveToTop(ArrowType.CIRCLE)"
                    @click="moveToTop(ArrowType.CIRCLE)"
                />
                <KonvaQuad
                    v-for="quad in quads"
                    :key="quad.name"
                    :quad="quad"
                    @transformend="handleTransform"
                    @dragstart="moveToTop(ArrowType.QUAD)"
                    @click="moveToTop(ArrowType.QUAD)"
                />
                <KonvaLine
                    v-for="line in lines"
                    :key="line.name"
                    :line="line"
                    @transformend="handleTransform"
                    @dragstart="moveToTop"
                    @click="moveToTop"
                />

                <v-transformer ref="transformer" />
                <v-rect :config="selectionRectangle" />
            </v-layer>
        </v-stage>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { ArrowType, Circle, Line, Rectangle, Shape } from '@/common/interfaces';
import KonvaCircle from '@/konva-components/KonvaCircle.vue';
import { generateUuid } from '../common/helper';
import KonvaRectangle from '@/konva-components/KonvaRectangle.vue';
import KonvaQuad from '@/konva-components/KonvaQuad.vue';
import KonvaLine from '@/konva-components/KonvaLine.vue';

@Options({
    components: { KonvaCircle, KonvaRectangle, KonvaQuad, KonvaLine },
})
export default class MyKonva extends Vue {
    @Prop({ default: ArrowType.SELECT }) arrowType!: ArrowType;
    @Prop() currentColor!: string;
    ArrowType = ArrowType;

    @Watch('currentColor')
    handleCurrentColorChange(e: any) {
        this.handleTransform(e);
    }

    stageSize = {
        width: 500,
        height: 500,
    };

    mounted() {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const { width, height } = canvas.getBoundingClientRect();
            this.stageSize.width = width;
            this.stageSize.height = height;
        }
        window.addEventListener('keydown', this.onKeyDown);
    }

    // Props
    isDrawing = false;
    selectedShapeName = '';
    transformerNode = '';
    x1 = 0;
    x2 = 0;
    y1 = 0;
    y2 = 0;
    selectionRectangle = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: 'rgba(0, 0, 255, 0.2)',
        visible: false,

        getClientRect() {
            return {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            };
        },
    };

    // Shapes
    rectangles: Rectangle[] = [];
    circles: Circle[] = [];
    quads: Shape[] = [];
    lines: Line[] = [];

    // Methods
    onKeyDown(e: any) {
        if (e.keyCode === 46) {
            if (this.selectedShapeName) {
                const shape = this.selectedShapeName.split('-')[0];
                switch (shape) {
                    case 'rectangle':
                        {
                            const rect = this.rectangles.find(
                                (r) => r.name === this.selectedShapeName,
                            );
                            if (rect === undefined) return;
                            const index = this.rectangles.indexOf(rect);
                            this.rectangles.splice(index, 1);
                        }
                        break;
                    case 'circle':
                        {
                            const circle = this.circles.find(
                                (r) => r.name === this.selectedShapeName,
                            );
                            if (circle === undefined) return;
                            const index = this.circles.indexOf(circle);
                            this.circles.splice(index, 1);
                        }
                        break;
                    case 'quad':
                        {
                            const quad = this.quads.find(
                                (r) => r.name === this.selectedShapeName,
                            );
                            if (quad === undefined) return;
                            const index = this.quads.indexOf(quad);
                            this.quads.splice(index, 1);
                        }
                        break;
                    case 'line':
                        {
                            const line = this.lines.find(
                                (r) => r.name === this.selectedShapeName,
                            );
                            if (line === undefined) return;
                            const index = this.lines.indexOf(line);
                            this.lines.splice(index, 1);
                        }
                        break;
                }
                this.selectedShapeName = '';
                this.updateTransformer();
                return;
            }
        }
    }

    onStageMousedown(e: any) {
        this.isDrawing = true;

        if (!e.evt) {
            return;
        }

        if (e.target.nodeType === 'Stage' && this.arrowType === ArrowType.SELECT) {
            const stage = e.target;
            e.evt.preventDefault();
            this.x1 = stage.getPointerPosition().x;
            this.y1 = stage.getPointerPosition().y;
            this.x2 = stage.getPointerPosition().x;
            this.y2 = stage.getPointerPosition().y;
            this.selectionRectangle.visible = true;
            this.selectionRectangle.width = 0;
            this.selectionRectangle.height = 0;
            this.selectedShapeName = '';
            this.updateTransformer();
            return;
        }

        const clickedOnTransformer = e.target?.parent?.className === 'Transformer';
        if (clickedOnTransformer) {
            return;
        }

        const name = e.target.name();
        this.selectedShapeName = name;
        this.updateTransformer();

        const position = (this.$refs.stage as any).getNode().getPointerPosition();

        // drawing
        switch (this.arrowType) {
            case ArrowType.SELECT:
                break;

            case ArrowType.RECTANGLE:
                this.rectangles.push({
                    name: generateUuid('rectangle'),
                    x: position.x,
                    y: position.y,
                    width: 50,
                    height: 50,
                    fill: this.currentColor || 'red',
                    stroke: 'black',
                });
                break;

            case ArrowType.CIRCLE:
                this.circles.push({
                    name: generateUuid('circle'),
                    x: position.x,
                    y: position.y,
                    radius: 30,
                    fill: this.currentColor || 'blue',
                    stroke: 'black',
                });
                break;

            case ArrowType.QUAD:
                this.quads.push({
                    name: generateUuid('quad'),
                    x: position.x,
                    y: position.y,
                    width: 100,
                    height: 100,
                    fill: this.currentColor || 'red',
                    stroke: 'black',
                });
                break;

            case ArrowType.LINE:
                this.lines.push({
                    name: generateUuid('line'),
                    points: [+position.x, +position.y],
                    fill: 'red',
                    stroke: this.currentColor || 'black',
                });
                break;
        }
    }

    onStageMousemove(e: any) {
        if (this.isDrawing) {
            const position = (this.$refs.stage as any).getNode().getPointerPosition();

            switch (this.arrowType) {
                case ArrowType.SELECT:
                    break;

                case ArrowType.RECTANGLE:
                    {
                        const currentRectangle =
                            this.rectangles[this.rectangles.length - 1];
                        const width = position.x - (currentRectangle?.x || 0);
                        const height = position.y - (currentRectangle?.y || 0);
                        currentRectangle.width = width;
                        currentRectangle.height = height;
                    }
                    break;

                case ArrowType.CIRCLE:
                    {
                        const currentCircle = this.circles[this.circles.length - 1];
                        const width = position.x - (currentCircle?.x || 0);
                        const height = position.y - (currentCircle?.y || 0);
                        currentCircle.radius = Math.abs(Math.min(width, height));
                    }

                    break;

                case ArrowType.QUAD:
                    {
                        const currentQuad = this.quads[this.quads.length - 1];
                        const width = position.x - (currentQuad?.x || 0);
                        const height = position.y - (currentQuad?.y || 0);
                        currentQuad.width = width;
                        currentQuad.height = height;
                    }
                    break;
                case ArrowType.LINE:
                    {
                        const currentLine = this.lines[this.lines.length - 1];
                        const points = currentLine.points?.concat([
                            position.x,
                            position.y,
                        ]);
                        currentLine.points = points;
                    }
                    break;
            }
        }
        if (!this.selectionRectangle.visible) {
            return;
        }
        if (e.target.nodeType === 'Stage') {
            const stage = e.target;
            e.evt.preventDefault();
            this.x2 = stage.getPointerPosition().x;
            this.y2 = stage.getPointerPosition().y;
            this.selectionRectangle.visible = true;
            this.selectionRectangle.x = Math.min(this.x1, this.x2);
            this.selectionRectangle.y = Math.min(this.y1, this.y2);
            this.selectionRectangle.width = Math.abs(this.x2 - this.x1);
            this.selectionRectangle.height = Math.abs(this.y2 - this.y1);
        }
    }

    onStageMouseup(e: any) {
        this.isDrawing = false;
        if (!this.selectionRectangle.visible) {
            return;
        }
        if (e.target.nodeType === 'Stage') {
            e.evt.preventDefault();
            setTimeout(() => {
                this.selectionRectangle.visible = false;
            });
            const box = this.selectionRectangle.getClientRect();
            const selected = this.rectangles.filter((rect) => false);
            const transformerNode = (this.$refs.transformer as any).getNode();
            transformerNode.nodes(selected);
        }
    }

    updateTransformer() {
        // here we need to manually attach or detach Transformer node
        const transformerNode = (this.$refs.transformer as any).getNode();
        const stage = transformerNode.getStage();
        const { selectedShapeName } = this;
        if (stage !== null) {
            const selectedNode = stage.findOne('.' + selectedShapeName);
            // do nothing if selected node is already attached
            if (selectedNode === transformerNode.node()) {
                return;
            }

            if (selectedNode) {
                // attach to another node
                transformerNode.nodes([selectedNode]);
            } else {
                // remove transformer
                transformerNode.nodes([]);
            }
        }
    }

    handleTransform(e: any) {
        this.handleTransformRectangle(e);
        this.handleTransformCircle(e);
    }

    handleTransformRectangle(e: any) {
        const rect = this.rectangles.find((r) => r.name === this.selectedShapeName);
        if (rect === undefined) return;
        // change fill
        rect.fill = this.currentColor;
        if (!e.target) return;
        // update the state
        rect.x = e.target.x();
        rect.y = e.target.y();
        rect.rotation = e.target.rotation();
        rect.scaleX = e.target.scaleX();
        rect.scaleY = e.target.scaleY();
    }

    handleTransformCircle(e: any) {
        const circle = this.circles.find((r) => r.name === this.selectedShapeName);
        if (circle === undefined) return;
        const index = this.circles.indexOf(circle);
        this.circles.splice(index, 1);
        this.circles.push(circle);
        // change fill
        circle.fill = this.currentColor;
        if (!e.target) return;
        // update the state
        circle.x = e.target.x();
        circle.y = e.target.y();
    }

    moveToTop(type: ArrowType) {
        switch (type) {
            case ArrowType.RECTANGLE:
                {
                    const rect = this.rectangles.find(
                        (r) => r.name === this.selectedShapeName,
                    );
                    if (rect === undefined) return;
                    const index = this.rectangles.indexOf(rect);
                    this.rectangles.splice(index, 1);
                    this.rectangles.push(rect);
                }
                break;

            case ArrowType.CIRCLE:
                {
                    const circle = this.circles.find(
                        (r) => r.name === this.selectedShapeName,
                    );
                    if (circle === undefined) return;
                    const index = this.circles.indexOf(circle);
                    this.circles.splice(index, 1);
                    this.circles.push(circle);
                }
                break;

            case ArrowType.QUAD:
                {
                    const quad = this.quads.find(
                        (r) => r.name === this.selectedShapeName,
                    );
                    if (quad === undefined) return;
                    const index = this.quads.indexOf(quad);
                    this.quads.splice(index, 1);
                    this.quads.push(quad);
                }
                break;
        }
    }
}
</script>
