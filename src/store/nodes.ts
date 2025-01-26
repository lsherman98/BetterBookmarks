import { type AppNode } from './types';

export const initialNodes = [
    {
        id: '1',
        type: 'default',
        data: { label: 'input' },
        position: { x: 0, y: 0 },
    },
    {
        id: '2',
        type: 'default',
        data: { label: 'node 2' },
        position: { x: 0, y: 100 },
    },
    {
        id: '2a',
        type: 'default',
        data: { label: 'node 2a' },
        position: { x: 0, y: 200 },
    },
    {
        id: '2b',
        type: 'default',
        data: { label: 'node 2b' },
        position: { x: 0, y: 300 },
    },
    {
        id: '2c',
        type: 'default',
        data: { label: 'node 2c' },
        position: { x: 0, y: 400 },
    },
    {
        id: '2d',
        type: 'default',
        data: { label: 'node 2d' },
        position: { x: 0, y: 500 },
    },
    {
        id: '3',
        type: 'default',
        data: { label: 'node 3' },
        position: { x: 200, y: 100 },
    },
] as AppNode[];