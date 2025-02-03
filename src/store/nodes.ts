import { type AppNode } from './types';

export const initialNodes = [
    {
        id: '1',
        type: 'root',
        data: {},
        position: { x: 0, y: 0 },
        deletable: false,
        selectable: false,
        draggable: false,
    },
] as AppNode[];