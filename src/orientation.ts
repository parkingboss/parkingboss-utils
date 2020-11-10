import { writable } from "svelte/store";

// For iOS
interface WebKitCompass {
    readonly webkitCompassHeading: number;
    readonly webkitCompassAccuracy: number;
}

export interface OrientationState {
  status: string;
  heading: number | undefined;
  headingAccuracy: number | undefined;   
}

const initialState: OrientationState = {
  status: "uninitialized",
  heading: undefined,
  headingAccuracy: undefined
};

export const store = writable(initialState);

function setStatus(status: string) {
    store.update((state: OrientationState) => {
        state.status = status;
        return state;
    })
};

function setHeading(heading: number | undefined) {
    store.update((state: OrientationState) => {
        state.heading = heading;
        return state;
    })
};

function setHeadingAccuracy(headingAccuracy: number | undefined) {
    store.update((state: OrientationState) => {
        state.headingAccuracy = headingAccuracy;
        return state;
    })
};

export async function requestPermission(): Promise<boolean> {  
    let permission = "granted";
    
    // Perform permission check for iOS devices
    if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        permission = await DeviceOrientationEvent.requestPermission()
    }

    setStatus(`permission ${permission}`);
    return permission === "granted";
}

export function start() {
    setStatus("initialized");
    window.addEventListener("deviceorientationabsolute", onDeviceOrientation, false);
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
    setStatus("oriented");

    if (event.webkitCompassHeading !== undefined) {
        if (event.webkitCompassAccuracy < 50) {
            setHeading(event.webkitCompassHeading);
            setHeadingAccuracy(event.webkitCompassAccuracy);
        } else {
            console.warn(`webkitCompassAccuracy is ${event.webkitCompassAccuracy}`);
        }
    } else if (event.gamma !== null) {
        setHeading(_computeCompassHeading(event.alpha!, event.beta!, event.gamma!));
        setHeadingAccuracy(10);
    } else {
        console.warn('event.gamma === null');
    }
}
