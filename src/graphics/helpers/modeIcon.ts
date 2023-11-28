import SZ from "../assets/SZ.avif";
import TC from "../assets/TC.avif";
import RM from "../assets/RM.avif";
import CB from "../assets/CB.avif";
import counter from "../assets/Counter.avif"
import blank from "../assets/blank.png";

export function getModeIcon(mode: string): string { 
    switch(mode) {
        case "Splat Zones":
            return SZ;
        case "Tower Control":
            return TC;
        case "Rainmaker":
            return RM;
        case "Clam Blitz":
            return CB;
        case "Unknown Mode":
            return counter;
        default:
            return blank;
    }
}