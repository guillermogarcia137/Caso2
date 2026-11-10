import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/editor/editor.api.js';
import 'monaco-editor/languages/definitions/javascript/register.js';
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker';
import { useApp } from '../utils/context';
self.MonacoEnvironment = { getWorker: () => new EditorWorker() };
loader.config({ monaco });
/** Editor Monaco servido desde el propio sitio, con resaltado de JavaScript. */
export function CodeEditor({ code, onChange }: { code: string; onChange: (code: string) => void }) {
  const { theme } = useApp();
  return (
    <div className="code-editor">
      <Editor
        height="365px"
        defaultLanguage="javascript"
        value={code}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={(value) => onChange(value ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 20 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
        loading={<p>Cargando editor…</p>}
      />
    </div>
  );
}
