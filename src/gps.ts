export const available = 'geolocation' in navigator;

export async function isPermitted(opts?: PositionOptions) {
  // Short circuit with the sparsely supported permissions api
  try {
    const perm = await navigator.permissions.query({ name: 'geolocation' });
    if (perm.state != 'prompt') {
      return perm.state === 'granted';
    }
  } catch (e) {}

  // Fall back to just trying and seeing if it works.
  try {
    await position(opts || { enableHighAccuracy: false });
    return true;
  } catch (e) {
    return e.code !== e.PERMISSION_DENIED;
  }
}

export function position(opts: PositionOptions) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, opts);
  });
}

export function watch(success: PositionCallback, failure?: PositionErrorCallback, opts?: PositionOptions) {
  const id = navigator.geolocation.watchPosition(success, failure, opts);
  return () => navigator.geolocation.clearWatch(id);
}
