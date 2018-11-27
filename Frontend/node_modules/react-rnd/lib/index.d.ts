import * as React from "react";
import Draggable from "react-draggable";
import Resizable, { ResizableDirection } from "re-resizable";
export declare type Grid = [number, number];
export declare type Position = {
    x: number;
    y: number;
};
export declare type DraggableData = {
    node: HTMLElement;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
} & Position;
export declare type RndDragCallback = (e: Event, data: DraggableData) => void | false;
export declare type RndResizeStartCallback = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, dir: ResizableDirection, elementRef: HTMLDivElement) => void;
export declare type ResizableDelta = {
    width: number;
    height: number;
};
export declare type RndResizeCallback = (e: MouseEvent | TouchEvent, dir: ResizableDirection, elementRef: HTMLDivElement, delta: ResizableDelta, position: Position) => void;
declare type Size = {
    width: string | number;
    height: string | number;
};
declare type State = {
    original: Position;
    bounds: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    maxWidth?: number | string;
    maxHeight?: number | string;
};
declare type MaxSize = {
    maxWidth: number | string;
    maxHeight: number | string;
};
export declare type ResizeEnable = {
    bottom?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
    left?: boolean;
    right?: boolean;
    top?: boolean;
    topLeft?: boolean;
    topRight?: boolean;
};
export declare type HandleClasses = {
    bottom?: string;
    bottomLeft?: string;
    bottomRight?: string;
    left?: string;
    right?: string;
    top?: string;
    topLeft?: string;
    topRight?: string;
};
export declare type HandleStyles = {
    bottom?: React.CSSProperties;
    bottomLeft?: React.CSSProperties;
    bottomRight?: React.CSSProperties;
    left?: React.CSSProperties;
    right?: React.CSSProperties;
    top?: React.CSSProperties;
    topLeft?: React.CSSProperties;
    topRight?: React.CSSProperties;
};
export interface Props {
    dragGrid?: Grid;
    default?: {
        x: number;
        y: number;
    } & Size;
    position?: {
        x: number;
        y: number;
    };
    size?: Size;
    resizeGrid?: Grid;
    bounds?: string;
    onMouseDown?: (e: MouseEvent) => void;
    onResizeStart?: RndResizeStartCallback;
    onResize?: RndResizeCallback;
    onResizeStop?: RndResizeCallback;
    onDragStart?: RndDragCallback;
    onDrag?: RndDragCallback;
    onDragStop?: RndDragCallback;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    enableResizing?: ResizeEnable;
    resizeHandleClasses?: HandleClasses;
    resizeHandleStyles?: HandleStyles;
    resizeHandleWrapperClass?: string;
    resizeHandleWrapperStyle?: React.CSSProperties;
    lockAspectRatio?: boolean | number;
    lockAspectRatioExtraWidth?: number;
    lockAspectRatioExtraHeight?: number;
    maxHeight?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    minWidth?: number | string;
    dragAxis?: "x" | "y" | "both" | "none";
    dragHandleClassName?: string;
    disableDragging?: boolean;
    cancel?: string;
    enableUserSelectHack?: boolean;
    [key: string]: any;
}
export declare class Rnd extends React.Component<Props, State> {
    static defaultProps: {
        maxWidth: number;
        maxHeight: number;
        onResizeStart: () => void;
        onResize: () => void;
        onResizeStop: () => void;
        onDragStart: () => void;
        onDrag: () => void;
        onDragStop: () => void;
    };
    resizable: Resizable;
    draggable: Draggable;
    isResizing: boolean;
    constructor(props: Props);
    componentDidMount(): void;
    getDraggablePosition(): {
        x: number;
        y: number;
    };
    getParent(): any;
    getParentSize(): {
        width: number;
        height: number;
    };
    getMaxSizesFromProps(): MaxSize;
    getSelfElement(): Element;
    onDragStart(e: Event, data: DraggableData): void;
    onDrag(e: Event, data: DraggableData): void;
    onDragStop(e: Event, data: DraggableData): void;
    onResizeStart(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, dir: ResizableDirection, elementRef: HTMLDivElement): void;
    onResize(e: MouseEvent | TouchEvent, direction: ResizableDirection, elementRef: HTMLDivElement, delta: {
        height: number;
        width: number;
    }): void;
    onResizeStop(e: MouseEvent | TouchEvent, direction: ResizableDirection, elementRef: HTMLDivElement, delta: {
        height: number;
        width: number;
    }): void;
    updateSize(size: {
        width: number | string;
        height: number | string;
    }): void;
    updatePosition(position: Position): void;
    getOffsetFromParent(): {
        top: number;
        left: number;
    };
    render(): JSX.Element;
}
export {};
