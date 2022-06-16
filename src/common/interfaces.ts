import { Vue } from 'vue-class-component';
import Konva from 'konva';

export enum ArrowType {
    SELECT = 'select',
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle',
    QUAD = 'quad',
    LINE = 'line',
    LASER = 'laser',
}

export interface Pointer {
    x: number;
    y: number;
}

export interface Shape {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    rotation?: number;
    visible?: boolean;
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
    lineCap?: string;
    lineJoin?: string;
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
