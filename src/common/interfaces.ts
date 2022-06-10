import { Vue } from 'vue-class-component';
import Konva from 'konva';

export enum ArrowType {
    SELECT,
    RECTANGLE,
    CIRCLE,
    QUAD,
    LINE,
}

export interface Shape {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    rotation?: number;
}

export interface Rectangle extends Shape {
    scaleX?: number;
    scaleY?: number;
}

export interface Circle extends Shape {
    radius: number;
    scale?: number;
}

export interface Line extends Shape {
    points?: number[];
}

export interface KonvaLayer extends Vue {
    getNode(): Konva.Layer;
}

export interface KonvaStage extends Vue {
    getStage(): Konva.Stage;
}

export interface KonvaTransformer extends Vue {
    getNode(): Konva.Transformer;
}
