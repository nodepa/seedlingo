export type MediaFile = {
  name: string;
  data: Base64URLString | null;
  state: {
    progress: number;
    isLoading: boolean;
    error: boolean;
  };
  size: number;
  lastModified: number;
  path?: string;
};