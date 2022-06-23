<template>
    <div @keydown.delete="deleteShape">
        <v-stage
            ref="stage"
            :config="stageSize"
            @mousedown="onStageMousedown"
            @touchstart="onStageMousedown"
            @contextmenu="onContextMenuOpen"
            @mousemove="onStageMousemove"
            @mouseup="onStageMouseup"
        >
            <v-layer ref="layer">
                <KonvaRectangle
                    v-for="rectangle in rectangles"
                    :key="rectangle.name"
                    :rectangle="rectangle"
                    @transform="onTransformRectangle"
                    @transformend="handleTransformRectangle"
                    @dragstart="moveToTop(ArrowType.RECTANGLE)"
                    @click="moveToTop(ArrowType.RECTANGLE)"
                />
                <KonvaCircle
                    v-for="circle in circles"
                    :key="circle.name"
                    :circle="circle"
                    @transformend="handleTransformCircle"
                    @dragstart="moveToTop(ArrowType.CIRCLE)"
                    @click="moveToTop(ArrowType.CIRCLE)"
                />
                <KonvaQuad
                    v-for="quad in quads"
                    :key="quad.name"
                    :quad="quad"
                    @dragstart="moveToTop(ArrowType.QUAD)"
                    @click="moveToTop(ArrowType.QUAD)"
                />
                <KonvaLine
                    v-for="line in lines"
                    :key="line.name"
                    :line="line"
                    @dragstart="moveToTop"
                    @click="moveToTop"
                />
                <KonvaLine v-for="line in removableLines" :key="line.name" :line="line" />
                <v-transformer ref="transformer" />
                <KonvaLaser
                    v-for="laser in lasers"
                    :key="laser.name"
                    :laser="laser"
                    :isHideCursor="arrowType === ArrowType.LASER"
                />
                <KonvaEraser :isHideCursor="arrowType === ArrowType.ERASER" />
            </v-layer>
            <v-layer ref="drawLayer"></v-layer>
        </v-stage>
        <ContextMenu @on-delete="deleteShape" @on-duplicate="onDuplicate" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import {
    ArrowType,
    Circle,
    Line,
    MouseButton,
    Rectangle,
    Shape,
} from '@/common/interfaces';
import KonvaCircle from '@/konva-components/KonvaCircle.vue';
import { generateUuid } from '../common/helper';
import KonvaRectangle from '@/konva-components/KonvaRectangle.vue';
import KonvaQuad from '@/konva-components/KonvaQuad.vue';
import KonvaLine from '@/konva-components/KonvaLine.vue';
import KonvaLaser from '@/konva-components/KonvaLaser.vue';
import KonvaEraser from '@/konva-components/KonvaEraser.vue';
import ContextMenu from './ContextMenu.vue';

@Options({
    components: {
        KonvaCircle,
        KonvaRectangle,
        KonvaQuad,
        KonvaLine,
        KonvaLaser,
        KonvaEraser,
        ContextMenu,
    },
})
export default class MyKonva extends Vue {
    @Prop({ default: ArrowType.SELECT }) arrowType!: ArrowType;
    @Prop() currentColor!: string;
    @Prop() importArr!: any[];

    ArrowType = ArrowType;

    @Watch('currentColor')
    handleCurrentColorChange(e: any) {
        this.handleTransform(e);
    }

    @Watch('importArr')
    handleImportChange() {
        this.importArr.forEach((ele) => {
            const shape = (ele?.name || ArrowType.SELECT).split('-')[0] as ArrowType;
            switch (shape) {
                case ArrowType.RECTANGLE:
                    ele.name = generateUuid(ArrowType.RECTANGLE);
                    this.rectangles.push(ele);
                    break;
                case ArrowType.CIRCLE:
                    ele.name = generateUuid(ArrowType.CIRCLE);
                    this.circles.push(ele);
                    break;
                case ArrowType.QUAD:
                    ele.name = generateUuid(ArrowType.QUAD);
                    this.quads.push(ele);
                    break;
                case ArrowType.LINE:
                    ele.name = generateUuid(ArrowType.LINE);
                    this.lines.push(ele);
                    break;
            }
        });
    }

    stageSize = {
        width: 500,
        height: 500,
    };

    mounted() {
        this.setupCanvas();
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('resize', this.setupCanvas);
        this.lines.push({
            name: generateUuid(ArrowType.LINE),
            points: [100, 100, 200, 200],
            fill: 'red',
            stroke: this.currentColor || 'black',
            draggable: true,
        });
    }

    setupCanvas() {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const { width, height } = canvas.getBoundingClientRect();
            this.stageSize.width = width;
            this.stageSize.height = height;
        }
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
    removableLines: Line[] = [];
    lasers: Line[] = [];

    // Event listener
    deleteShape() {
        if (this.selectedShapeName) {
            const shape = this.selectedShapeName.split('-')[0] as ArrowType;
            switch (shape) {
                case ArrowType.RECTANGLE:
                    {
                        const rect = this.rectangles.find(
                            (r) => r.name === this.selectedShapeName,
                        );
                        if (rect === undefined) return;
                        const index = this.rectangles.indexOf(rect);
                        this.rectangles.splice(index, 1);
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
                    }
                    break;
                case ArrowType.LINE:
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
    onKeyDown(e: any) {
        if (e.keyCode === 46) {
            this.deleteShape();
        }
    }

    onContextMenuOpen(e: any) {
        if (e.preventDefault !== undefined) {
            e.preventDefault();
        }
    }

    onStageMousedown(e: any) {
        this.isDrawing = true;

        if (!e.evt) {
            return;
        }

        if (e.evt.button === MouseButton.RIGHT) {
            const contextMenu = document.getElementById('context-menu');
            if (contextMenu) {
                contextMenu.style.left = `${e.evt.clientX}px`;
                contextMenu.style.top = `${e.evt.clientY}px`;
                contextMenu.style.visibility = 'visible';
            }
            return;
        }

        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.style.visibility = 'hidden';
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
                    name: generateUuid(ArrowType.RECTANGLE),
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
                    name: generateUuid(ArrowType.CIRCLE),
                    x: position.x,
                    y: position.y,
                    radius: 30,
                    fill: this.currentColor || 'blue',
                    stroke: 'black',
                });
                break;

            case ArrowType.QUAD:
                this.quads.push({
                    name: generateUuid(ArrowType.QUAD),
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
                    name: generateUuid(ArrowType.LINE),
                    points: [+position.x, +position.y, +position.x, +position.y],
                    fill: 'red',
                    stroke: this.currentColor || 'black',
                    draggable: true,
                });
                break;
            case ArrowType.REMOVABLE_LINE:
                this.removableLines.push({
                    name: generateUuid(ArrowType.LINE),
                    points: [+position.x, +position.y, +position.x, +position.y],
                    fill: 'red',
                    stroke: this.currentColor || 'black',
                });
                break;
            case ArrowType.LASER:
                this.lasers.push({
                    name: generateUuid(ArrowType.LASER),
                    points: [+position.x, +position.y],
                    stroke: 'red',
                    strokeWidth: 4,
                    lineCap: 'round',
                    lineJoin: 'round',
                });
                break;
            case ArrowType.ERASER:
                this.lines.push({
                    name: generateUuid(ArrowType.ERASER),
                    points: [+position.x, +position.y],
                    globalCompositeOperation: 'destination-out',
                    stroke: 'green',
                    strokeWidth: 20,
                    lineCap: 'round',
                    lineJoin: 'round',
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
                        currentCircle.radius = Math.sqrt(width * width + height * height);
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
                case ArrowType.REMOVABLE_LINE:
                    {
                        // this.removableLines.push({
                        //     name: generateUuid(ArrowType.LINE),
                        //     points: [+position.x, +position.y, +position.x, +position.y],
                        //     fill: 'red',
                        //     stroke: this.currentColor || 'black',
                        // });
                    }

                    break;
                case ArrowType.LASER:
                    {
                        const currentLaser = this.lasers[this.lasers.length - 1];
                        const points = currentLaser?.points?.concat([
                            position.x,
                            position.y,
                        ]);
                        currentLaser.points = points;
                        setTimeout(() => {
                            currentLaser.points?.splice(0, 8);
                            (this.$refs.stage as any).getNode().draw();
                        }, 1000);
                    }

                    break;
                case ArrowType.ERASER:
                    {
                        const currentEraser = this.lines[this.lines.length - 1];
                        const points = currentEraser?.points?.concat([
                            position.x,
                            position.y,
                        ]);
                        currentEraser.points = points;
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

    onDuplicate() {
        if (this.selectedShapeName) {
            const shape = this.selectedShapeName.split('-')[0] as ArrowType;
            switch (shape) {
                case ArrowType.RECTANGLE:
                    {
                        const rect = this.rectangles.find(
                            (r) => r.name === this.selectedShapeName,
                        );
                        if (rect === undefined) return;
                        const newRect = Object.assign({}, rect);
                        newRect.name = generateUuid(ArrowType.RECTANGLE);
                        const x = newRect?.x || 0;
                        const y = newRect?.y || 0;
                        newRect.x = x + 50;
                        newRect.y = y + 50;
                        this.rectangles.push({ ...newRect });
                    }
                    break;
                case ArrowType.CIRCLE:
                    {
                        const circle = this.circles.find(
                            (r) => r.name === this.selectedShapeName,
                        );
                        if (circle === undefined) return;
                        const newCircle = { ...circle };
                        newCircle.x = (newCircle?.x || 0) + 50;
                        newCircle.y = (newCircle?.y || 0) + 50;
                        newCircle.name = generateUuid(ArrowType.CIRCLE);
                        this.circles.push(newCircle);
                    }
                    break;
                case ArrowType.QUAD:
                    {
                        const quad = this.quads.find(
                            (r) => r.name === this.selectedShapeName,
                        );
                        if (quad === undefined) return;
                        const newQuad = { ...quad };
                        newQuad.x = (newQuad?.x || 0) + 50;
                        newQuad.y = (newQuad?.y || 0) + 50;
                        newQuad.name = generateUuid(ArrowType.QUAD);
                        this.quads.push(newQuad);
                    }
                    break;
                case ArrowType.LINE:
                    {
                        const line = this.lines.find(
                            (r) => r.name === this.selectedShapeName,
                        );
                        if (line === undefined) return;
                        const newLine = { ...line };
                        newLine.x = (newLine?.x || 0) + 50;
                        newLine.y = (newLine?.y || 0) + 50;
                        newLine.name = generateUuid(ArrowType.LINE);
                        this.lines.push(newLine);
                    }
                    break;
            }
            this.selectedShapeName = '';
            this.updateTransformer();
            return;
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

            if (selectedNode?.className === ArrowType.LINE) {
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
    onTransformRectangle(e: any) {
        const rect = this.rectangles.find((r) => r.name === this.selectedShapeName);
        if (rect === undefined) return;
        rect.width = (rect?.width || 0) * (rect?.scaleX || 1);
        rect.height = (rect?.height || 0) * (rect?.scaleY || 1);
        rect.scaleX = 1;
        rect.scaleY = 1;
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

    unmounted() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('resize', this.setupCanvas);
    }
}
</script>
