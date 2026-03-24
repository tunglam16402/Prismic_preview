export interface Category {
  id: string;
  priority: number;
  name: string;
  url: string;
}

export enum FileType {
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
}

export interface MediaType {
  name: string;
  media_type: FileType;
}

export interface File {
  url: string;
  sk: string;
  pin: boolean;
  pin_at?: string;
  name: string;
  thumbnailUrl: string;
  signed_url: string;
}

export interface JwtPayload {
  auth_time: number;
  client_id: string;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  origin_jti: string;
  scope: string;
  sub: string;
  token_use: string;
  username: string;
  version: number;
}

export interface RefreshAccessTokenRes {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

export interface DownloadedFile {
  sk: string;
  url: string;
  blob: Blob;
}

export type DownloadedFileRecord = Record<string, DownloadedFile>;

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
}

export type ImageLoading = "loading" | "loaded" | "error";
