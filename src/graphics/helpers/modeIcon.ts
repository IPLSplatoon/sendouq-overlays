import SZ from "../assets/SZ.avif";
import TC from "../assets/TC.avif";
import RM from "../assets/RM.avif";
import CB from "../assets/CB.avif";
import counter from "../assets/Counter.avif"
import blank from "../assets/blank.png";

export function getModeIcon(mode: string): string { 
    //sendouq season 1 finale is zones only, so hardcoding blank icons
    //ideally don't pull this into master
    return blank;

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