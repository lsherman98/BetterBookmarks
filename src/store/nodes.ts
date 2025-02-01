import { type AppNode } from './types';

export const initialNodes = [
    {
        id: '1',
        type: 'root',
        data: {},
        position: { x: 0, y: 0 },
    },
    {
        id: '2',
        type: 'basic',
        data: {},
        position: { x: 0, y: 0 },
    },
    {
        id: '2a',
        type: 'basic',
        data: {  },
        position: { x: 0, y: 0 },
    },
    {
        id: '2b',
        type: 'basic',
        data: {  },
        position: { x: 0, y: 0 },
    },
    {
        id: '2c',
        type: 'basic',
        data: {},
        position: { x: 0, y: 0 },
    },
    {
        id: '2d',
        type: 'basic',
        data: {  },
        position: { x: 0, y: 0 },
    },
    {
        id: '3',
        type: 'basic',
        data: { },
        position: { x: 0, y: 0 },
    },
] as AppNode[];