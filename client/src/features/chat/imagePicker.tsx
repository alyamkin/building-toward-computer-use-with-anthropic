import { useRef, type ChangeEvent } from 'react'
import { PaperClipIcon, XMarkIcon } from './icons'
import { ACCEPTED_TYPES, readImage, toDataUrl, type ImageInput } from './images'

type ImagePickerProps = {
  images: ImageInput[]
  onChange: (images: ImageInput[]) => void
  disabled?: boolean
}

export function ImagePickerButton({ images, onChange, disabled }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])].filter((f) => ACCEPTED_TYPES.includes(f.type))
    // Reset so picking the same file again still fires onChange
    e.target.value = ''
    if (files.length) onChange([...images, ...(await Promise.all(files.map(readImage)))])
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        hidden
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        aria-label="Attach images"
        className="rounded-lg border border-gray-300 px-3 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PaperClipIcon className="size-5" />
      </button>
    </>
  )
}

export function ImagePreviews({ images, onChange }: ImagePickerProps) {
  if (images.length === 0) return null
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {images.map((image, i) => (
        <div key={i} className="relative">
          <img
            src={toDataUrl(image)}
            alt=""
            className="size-16 rounded-md border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(images.filter((_, j) => j !== i))}
            aria-label="Remove image"
            className="absolute -top-1.5 -right-1.5 rounded-full bg-gray-800 p-0.5 text-white hover:bg-gray-600"
          >
            <XMarkIcon className="size-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
