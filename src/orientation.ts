import { writable } from 'svelte/store'

let status: string;
let heading: number;
let headingAccuracy: number;

// For iOS
interface WebKitCompass {
    readonly webkitCompassHeading: number;
    readonly webkitCompassAccuracy: number;
}

const store = writable({
    status: "uninitialized",
    orientation: {}
})

export async function requestPermission(): Promise<boolean> {  
    let permission = "granted";
    
    // Perform permission check for iOS devices
    if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        permission = await DeviceOrientationEvent.requestPermission()
    }
    
    store.set({
        status: `permission ${permission}`,
        orientation: {
            heading,
            headingAccuracy
        }
    })

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
    const event = e as DeviceOrientationEvent & WebKitCompass;

    if (event.webkitCompassHeading !== undefined) {
        if (event.webkitCompassAccuracy < 50) {
            heading = event.webkitCompassHeading!;
            headingAccuracy = event.webkitCompassAccuracy;
            status = "oriented";
        } else {
            console.warn(`webkitCompassAccuracy is ${event.webkitCompassAccuracy}`);
        }
    } else if (event.gamma !== null) {
        if (event.absolute === true || event.absolute === undefined) {
            heading = _computeCompassHeading(event.alpha!, event.beta!, event.gamma!);
            headingAccuracy = 10;
            status = "oriented";

            store.set({
                status,
                orientation: {
                    heading,
                    headingAccuracy
                }
            });
        } else {
            console.warn('e.absolute === false');
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