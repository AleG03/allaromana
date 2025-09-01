interface ImportMetaEnv {
  readonly VITE_USE_MOCKS?: string;
  readonly DEV?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
