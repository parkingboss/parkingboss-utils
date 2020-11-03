import { writable } from 'svelte/store'

let status: string;
let heading: number;
let headingAccuracy: number;

const store = writable({
    status: "uninitialized",
    orientation: {}
})

export async function requestPermission(): Promise<string> {  
    if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        return await DeviceOrientationEvent.requestPermission()
    }

    return "";
}

export async function isPermitted(permission: string) {
    return permission === "granted";
}

export function start() {
    const listener = window.addEventListener("deviceorientation", onDeviceOrientation, false);
    return () => window.removeEventListener('deviceorientation', onDeviceOrientation, false);
}
​
function _computeCompassHeading(alpha: number, beta: number, gamma: number) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);
​
    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);
​
    // Calculate A, B, C rotation components
    var rA = - cA * sG - sA * sB * cG;
    var rB = - sA * sG + cA * sB * cG;
​
    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);
​
    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
        compassHeading += Math.PI;
    } else if (rA < 0) {
        compassHeading += 2 * Math.PI;
    }
​
    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;
​
    return compassHeading;
}
​
function onDeviceOrientation(e: DeviceOrientationEvent) {
    if (e.webkitCompassHeading !== undefined) {
        if (e.webkitCompassAccuracy < 50) {
            heading = e.webkitCompassHeading!;
            headingAccuracy = e.webkitCompassAccuracy;
            status = "oriented";
        } else {
            console.warn(`webkitCompassAccuracy is ${e.webkitCompassAccuracy}`);
        }
    } else if (e.gamma !== null) {
        if (e.absolute === true || e.absolute === undefined) {
            heading = _computeCompassHeading(e.alpha!, e.beta!, e.gamma!);
            headingAccuracy = 10;
            status = "oriented";

            store.set({
                status: "oriented",
                orientation: {
                    heading,
                    headingAccuracy
                }
            });
        } else {
            console.warn('event.absolute === false');
        }
    } else {
        console.warn('event.gamma === null');
    }
}
​
export const current = function() {
    return {
        status, 
        orientation: {
            heading,
            headingAccuracy,
        }
    };
}