import React, { useEffect, useState, useMemo } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackStack,
  OpenInCodeSandboxButton,
} from '@codesandbox/sandpack-react';

const hiddenBaseStyles = {
  '/styles.css': {
    code: `
html, body, #root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}
`,
    hidden: true,
  },
};

const defaultSetup = {
  dependencies: {
    reactflow: '11.5.5',
  },
};

const defaultOptions = {
  editorHeight: '70vh',
  editorWidthPercentage: 45,
  wrapContent: true,
};

export default function CodeViewer({
  codePath,
  additionalFiles = [],
  dependencies = {},
  options = defaultOptions,
  activeFile = null,
  showEditor = true,
  showPreview = true,
  isTypescript = false,
  customPreview = null,
  sandpackOptions = {},
}) {
  const [files, setFiles] = useState(null);
  const scriptExtension = isTypescript ? 'tsx' : 'js';

  useEffect(() => {
    const loadFiles = async () => {
      const res = await import(`!raw-loader!./${codePath}/index.${scriptExtension}`);

      const additional = {};

      for (let additionalFile of additionalFiles) {
        if (typeof additionalFile === 'string') {
          const file = await import(`!raw-loader!./${codePath}/${additionalFile}`);
          additional[`/${additionalFile}`] = { code: file.default };

          if (additionalFile === activeFile) {
            additional[`/${additionalFile}`].active = true;
          }
        } else {
          const fileName = Object.keys(additionalFile)[0];
          additional[fileName] = additionalFile[fileName];
        }
      }

      setFiles({
        [`/App.${scriptExtension}`]: res.default,
        ...additional,
      });
    };

    loadFiles();
  }, []);

  const customSetup = useMemo(
    () => ({
      ...defaultSetup,
      dependencies: {
        ...defaultSetup.dependencies,
        ...dependencies,
      },
    }),
    []
  );

  const editorHeight = options?.editorHeight || '70vh';
  const panelStyle = { height: editorHeight };

  if (!files) {
    return <div style={{ minHeight: editorHeight }} />;
  }

  options.readOnly = !!customPreview;

  return (
    <div style={{ minHeight: editorHeight, marginBottom: 20 }}>
      <SandpackProvider
        template={isTypescript ? 'react-ts' : 'react'}
        options={sandpackOptions}
        customSetup={customSetup}
        files={{
          ...files,
          ...hiddenBaseStyles,
        }}
      >
        <SandpackLayout>
          {showEditor && <SandpackCodeEditor {...options} style={panelStyle} />}
          {showPreview && customPreview ? (
            <>
              <SandpackStack style={{ flex: '1 1 0%' }}>
                <div className="sp-preview-container" style={{ flex: '1 1 0%', height: '100%' }}>
                  {customPreview}
                  <div
                    className="sp-preview-actions"
                    style={{ zIndex: 10, position: 'absolute', bottom: 10, right: 10 }}
                  >
                    <OpenInCodeSandboxButton />
                  </div>
                </div>
              </SandpackStack>
            </>
          ) : (
            <SandpackPreview style={panelStyle} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
