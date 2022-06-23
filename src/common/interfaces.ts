import { Vue } from 'vue-class-component';
import Konva from 'konva';

export enum ArrowType {
    SELECT = 'Select',
    RECTANGLE = 'Rectangle',
    CIRCLE = 'Circle',
    QUAD = 'Quad',
    LINE = 'Line',
    REMOVABLE_LINE = 'RemovableLine',
    LASER = 'Laser',
    ERASER = 'Eraser',
}

export interface Pointer {
    x: number;
    y: number;
}

export enum MouseButton {
    LEFT = 0,
    SCROLL = 1,
    RIGHT = 2,
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
    draggable?: boolean;
    globalCompositeOperation?: string;
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
    strokeScaleEnabled?: boolean;
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
