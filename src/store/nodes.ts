import { type AppNode } from './types';

export const initialNodes = [
    {
        id: '1',
        type: 'root',
        data: { tags: ['root', 'test']},
        position: { x: 0, y: 0 },
    },
    // {
    //     id: '2',
    //     type: 'youtube',
    //     data: { tags: ['youtube', 'test 1'] },
    //     position: { x: 0, y: 0 },
    // },
    // {
    //     id: '2a',
    //     type: 'book',
    //     data: { tags: ['book', 'test 2'] },
    //     position: { x: 0, y: 0 },
    // },
    // {
    //     id: '2b',
    //     type: 'book',
    //     data: { tags: ['book', 'test 3'] },
    //     position: { x: 0, y: 0 },
    // },
    // {
    //     id: '2c',
    //     type: 'basic',
    //     data: {},
    //     position: { x: 0, y: 0 },
    // },
    // {
    //     id: '2d',
    //     type: 'basic',
    //     data: {  },
    //     position: { x: 0, y: 0 },
    // },
    // {
    //     id: '3',
    //     type: 'basic',
    //     data: { },
    //     position: { x: 0, y: 0 },
    // },
] as AppNode[];