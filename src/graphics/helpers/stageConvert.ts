export function modeNameToLetters(mode: string): string {
    switch (mode) {
        case "Splat Zones":
            return "SZ";
        case "Tower Control":   
            return "TC";
        case "Rainmaker":
            return "RM";
        case "Clam Blitz":
            return "CB";
        default:
            return "??";
    }
}