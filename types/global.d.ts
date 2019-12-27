declare const PUBLIC_URL: string;

declare namespace echarts {
    namespace EChartOption {
        /**
         * Line style
         */
        interface LineStyle {
            color?: string | string[] | any;
            width?: number;
            type?: 'solid' | 'dashed' | 'dotted';
            shadowBlur?: number;
            shadowColor?: string;
            shadowOffsetX?: number;
            shadowOffsetY?: number;
            opacity?: number;
        }
    }
}

declare interface Window {
    less: any;
}

declare module 'react-split' {
    interface SplitProps {
        direction?: 'vertical' | 'horizontal';
        cursor?: string;
        sizes?: number[];
        minSize?: number | number[];
        expandToMin?: boolean;
        gutterSize?: number;
        gutterAlign?: 'center' | 'start' | 'end';
        snapOffset?: number;
        dragInterval?: number;
        gutter?: (index, direction, pairElement) => HTMLElement;
        elementStyle?: (dimension, elementSize, gutterSize, index) => Object;
        gutterStyle?: (dimension, gutterSize, index) => Object;
        onDrag?: (sizes: number[]) => void;
        onDragEnd?: (sizes: number[]) => void;
        style?: React.CSSProperties;
    }
    export default class Split extends React.Component<SplitProps> {}
}