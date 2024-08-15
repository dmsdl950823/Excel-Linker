import { type UploadFileInfo } from "naive-ui"

export interface UploadComponentProps {
  placeholder?: string
  description?: string
  max?: number
}

export interface UploadComponentEmits {
  (e: 'upload', files: UploadFileInfo[]): void
}
