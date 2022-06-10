import { v4 as uuidv4 } from 'uuid';

export function generateUuid(shape: string): string {
    return shape + '-' + uuidv4();
}
