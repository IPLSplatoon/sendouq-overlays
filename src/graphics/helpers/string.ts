export function limitString(str: string, limit: number = 30): string {
    if (str.length > limit) {
        return str.substring(0, limit).trim() + "…";
    }
    return str;
}

export function isBlank(value?: string): boolean {
    return typeof value !== 'string' || value.trim() === '';
}
