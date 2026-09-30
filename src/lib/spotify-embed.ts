export type SpotifyPlayback = { data: { isPaused: boolean; isBuffering: boolean; position: number; duration: number } };
export type SpotifyController = {
  play(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  addListener(event: 'ready', listener: () => void): void;
  addListener(event: 'playback_update', listener: (event: SpotifyPlayback) => void): void;
};
type SpotifyIframeAPI = { createController(element: HTMLElement, options: { uri: string; width: string; height: number }, callback: (controller: SpotifyController) => void): void };
declare global { interface Window { onSpotifyIframeApiReady?: (api: SpotifyIframeAPI) => void } }

let apiPromise: Promise<SpotifyIframeAPI> | undefined;
export function loadSpotifyEmbed() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<SpotifyIframeAPI>((resolve, reject) => {
    const script = document.createElement('script');
    const fail = () => { clearTimeout(timeout); script.remove(); apiPromise = undefined; reject(new Error('Spotify could not load.')); };
    const timeout = setTimeout(fail, 12000);
    window.onSpotifyIframeApiReady = api => { clearTimeout(timeout); resolve(api); };
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    script.onerror = fail;
    document.body.appendChild(script);
  });
  return apiPromise;
}
