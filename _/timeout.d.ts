

export function Timeouted <P extends Promise<any>> (promise: P, ms: number): P

export function Timeout (ms: number): Promise<never>

export class TimeoutError extends Error {}
