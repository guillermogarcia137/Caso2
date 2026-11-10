import { useRef, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';
/** Reproductor HTML5 con posición persistente y controles de aprendizaje. */
export function VideoPlayer({ lessonKey }: { lessonKey: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSaved = useRef(0);
  const [speed, setSpeed] = useState('1');
  const [quality, setQuality] = useState('720p');
  const [subtitles, setSubtitles] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="video-component">
      <video
        key={lessonKey}
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onLoadStart={() => setError(false)}
        onError={() => setError(true)}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = readStorage(`video:${lessonKey}`, 0);
            videoRef.current.playbackRate = Number(speed);
            if (videoRef.current.textTracks[0])
              videoRef.current.textTracks[0].mode = subtitles ? 'showing' : 'hidden';
          }
        }}
        onTimeUpdate={() => {
          const time = videoRef.current?.currentTime ?? 0;
          if (Math.abs(time - lastSaved.current) > 2) {
            writeStorage(`video:${lessonKey}`, time);
            lastSaved.current = time;
          }
        }}
        onPause={() => writeStorage(`video:${lessonKey}`, videoRef.current?.currentTime ?? 0)}
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
