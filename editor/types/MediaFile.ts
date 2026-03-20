export type MediaFile = {
  name: string;
  data: string | null;
  state: {
    progress: number;
    isLoading: boolean;
    error: boolean;
  };
  size: number;
  lastModified: number;
  path?: string;
};
