declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ALESSOR_EP: string;
  readonly VITE_WORKER_EP: string;
  readonly VITE_PROPERTY_EP: string;
  readonly VITE_TEMP_PROPERTIES_EP: string;
  readonly VITE_TASK_EP: string;
  readonly VITE_USER_EP: string;
  readonly VITE_NOTIF_EP: string;
  readonly VITE_SIGN_IN: string;
  readonly VITE_SIGN_UP: string;
  readonly VITE_CLAIMS_EP: string;
  readonly VITE_AUTH_ENABLED?: string;
  readonly VITE_DEV_JWT?: string;
  readonly VITE_ENVIRONMENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
