// An image as sent to the server: base64 data without the `data:...;base64,` prefix
export type ImageInput = { mediaType: string; data: string }

// The image types the Anthropic API accepts
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function toDataUrl({ mediaType, data }: ImageInput) {
  return `data:${mediaType};base64,${data}`
}

export function readImage(file: File): Promise<ImageInput> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const [, data] = (reader.result as string).split(',')
      resolve({ mediaType: file.type, data })
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
