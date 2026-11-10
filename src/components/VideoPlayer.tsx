import { useRef, useState, useEffect } from 'react';
import { readStorage, writeStorage } from '../utils/storage';
/** Reproductor HTML5 con posición persistente y controles de aprendizaje. */
export function VideoPlayer({ lessonKey }: { lessonKey: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaved = useRef(0);
  const [speed, setSpeed] = useState('1');
  const [quality, setQuality] = useState('720p');
  const [subtitles, setSubtitles] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let restored = false;
    /** Restaura al disponer de datos, incluso cuando el navegador usa su caché. */
    const restore = () => {
      if (restored || video.readyState < 2) return;
      restored = true;
      const position = readStorage(`video:${lessonKey}`, 0);
      video.currentTime = Math.min(position, Math.max(0, video.duration - 0.1));
      lastSaved.current = position;
    };
    const save = () => {
      if (!restored) return;
      const time = video.currentTime;
      if (Math.abs(time - lastSaved.current) > 1) {
        writeStorage(`video:${lessonKey}`, time);
        lastSaved.current = time;
      }
    };
    video.addEventListener('loadeddata', restore);
    video.addEventListener('canplay', restore);
    video.addEventListener('timeupdate', save);
    restore();
    return () => {
      if (restored) writeStorage(`video:${lessonKey}`, video.currentTime);
      video.removeEventListener('loadeddata', restore);
      video.removeEventListener('canplay', restore);
      video.removeEventListener('timeupdate', save);
    };
  }, [lessonKey]);
  return (
    <div className="video-component">
      <video
        key={lessonKey}
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedMetadata={() => {
          if (!videoRef.current) return;
          videoRef.current.playbackRate = Number(speed);
          if (videoRef.current.textTracks[0])
            videoRef.current.textTracks[0].mode = subtitles ? 'showing' : 'hidden';
        }}
        onLoadStart={() => setError(false)}
        onError={() => setError(true)}
      >
        <source src={`${import.meta.env.BASE_URL}sample-nasa.mp4`} type="video/mp4" />
        <track
          kind="subtitles"
          src={`${import.meta.env.BASE_URL}subtitles.vtt`}
          srcLang="es"
          label="Español (demo)"
        />
      </video>
      {error && (
        <p className="demo-note">
          No se ha podido cargar el vídeo de muestra. Puedes seguir utilizando las demás funciones
          del aula.
        </p>
      )}
      <div className="player-settings">
        <label>
          Calidad{' '}
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            {['360p', '720p', '1080p'].map((q) => (
              <option key={q}>{q}</option>
            ))}
          </select>
          <small>(simulada)</small>
        </label>
        <label>
          Velocidad{' '}
          <select
            value={speed}
            onChange={(e) => {
              setSpeed(e.target.value);
              if (videoRef.current) videoRef.current.playbackRate = Number(e.target.value);
            }}
          >
            {['0.5', '0.75', '1', '1.25', '1.5', '2'].map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>
        <button
          className={`button small ${subtitles ? '' : 'secondary'}`}
          aria-pressed={subtitles}
          onClick={() => {
            const next = !subtitles;
            setSubtitles(next);
            if (videoRef.current?.textTracks[0])
              videoRef.current.textTracks[0].mode = next ? 'showing' : 'hidden';
          }}
        >
          CC · Subtítulos {subtitles ? 'sí' : 'no'}
        </button>
      </div>
      <p className="video-credit">
        Vídeo de muestra de NASA (dominio público). Los controles de calidad son una simulación; no
        se aplica streaming adaptativo.
      </p>
    </div>
  );
}
