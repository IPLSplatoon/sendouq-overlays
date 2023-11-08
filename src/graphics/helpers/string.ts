export function limitString(str: string, limit: number = 30): string {
    if (str.length > limit) {
        return str.substring(0, limit) + "…";
    }
    return str;
}