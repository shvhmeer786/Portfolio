'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, X, ArrowUpRight } from '@phosphor-icons/react';
import { loadSpotifyEmbed, type SpotifyController } from '@/lib/spotify-embed';

const trackId = '1jBKtzlwTVtCrScpiiHiKT';
const trackUrl = `https://open.spotify.com/track/${trackId}`;

export function FooterRecord() {
  const [engaged, setEngaged] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const record = useRef<HTMLButtonElement>(null);
  const wanted = useRef(false);
  const playTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function waitForPlayback() {
    clearTimeout(playTimer.current);
    setStatus('');
    playTimer.current = setTimeout(() => setStatus('If playback hasn’t started, press play in Spotify below.'), 4000);
  }

  useEffect(() => {
    if (!engaged || !host.current) return;
    let disposed = false;
    let embed: SpotifyController | undefined;
    setStatus('Loading Spotify…');
    const timeout = setTimeout(() => { if (!disposed) setStatus('Spotify is taking a moment. You can also open the song below.'); }, 14000);
    loadSpotifyEmbed().then(api => {
      if (disposed || !host.current) return;
      const mount = document.createElement('div');
      host.current.appendChild(mount);
      api.createController(mount, { uri: `spotify:track:${trackId}`, width: '100%', height: 80 }, created => {
        if (disposed) { created.destroy(); return; }
        embed = created;
        controller.current = created;
        const iframe = host.current?.querySelector('iframe');
        if (iframe) iframe.title = 'Intimidated (feat. H.E.R.) by KAYTRANADA on Spotify';
        created.addListener('playback_update', event => {
          if (disposed) return;
          const active = !event.data.isPaused && !event.data.isBuffering;
          setPlaying(active);
          if (active) { clearTimeout(playTimer.current); setStatus(''); }
          else if (event.data.isBuffering) setStatus('Buffering…');
        });
        created.addListener('ready', () => {
          if (disposed) return;
          clearTimeout(timeout);
          setReady(true);
          setStatus('');
          if (wanted.current) { waitForPlayback(); created.play(); }
        });
      });
    }).catch(() => { if (!disposed) { clearTimeout(timeout); setStatus('Spotify couldn’t load here. Open the song on Spotify below.'); } });
    return () => { disposed = true; clearTimeout(timeout); clearTimeout(playTimer.current); embed?.destroy(); controller.current = null; };
  }, [engaged]);

  function stop() {
    wanted.current = false;
    controller.current?.pause();
    clearTimeout(playTimer.current);
    setPlaying(false);
    setOpen(false);
    record.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') stop(); };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);

  function toggle() {
    if (playing || (open && wanted.current && !ready)) { stop(); return; }
    wanted.current = true;
    setOpen(true);
    setEngaged(true);
    if (controller.current && ready) { waitForPlayback(); controller.current.resume(); }
  }

  return <div className="footer-record" data-playing={playing}>
    <button ref={record} className="record-toggle" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} Intimidated by KAYTRANADA featuring H.E.R.`} title="Intimidated · KAYTRANADA feat. H.E.R." aria-pressed={playing} aria-expanded={open} aria-controls="footer-soundtrack">
      <span className="vinyl-disc" aria-hidden="true"><span className="vinyl-label"><i /></span></span>
      <span className="record-control" aria-hidden="true">{playing ? <Pause weight="fill" size={11} /> : <Play weight="fill" size={11} />}</span>
      <svg className="record-arm" viewBox="0 0 64 64" aria-hidden="true"><circle cx="57" cy="8" r="3" /><path d="M57 8 48 31 42 34" /><path className="record-stylus" d="m41 30 4 2-3 7-4-2z" /></svg>
    </button>
    {engaged && <div id="footer-soundtrack" className="record-popover" hidden={!open} role="region" aria-label="Footer soundtrack" data-lenis-prevent>
      <div className="record-popover-heading"><span>On repeat</span><button onClick={stop} aria-label="Close soundtrack and pause"><X size={15} /></button></div>
      {status && <p className="record-status" role="status">{status}</p>}
      <div ref={host} className="spotify-embed-host" />
      <a className="record-spotify-link" href={trackUrl} target="_blank" rel="noopener noreferrer">Listen on Spotify <ArrowUpRight size={12} /></a>
    </div>}
  </div>;
}
