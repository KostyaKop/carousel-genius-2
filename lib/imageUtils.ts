export async function compressImage(file: File, maxSizeMB: number = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions if needed
        const maxDimension = 1920
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension
            width = maxDimension
          } else {
            width = (width / height) * maxDimension
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to base64 with quality adjustment
        let quality = 0.9
        let base64 = canvas.toDataURL('image/jpeg', quality)

        // Check size and reduce quality if needed
        while (base64.length > maxSizeMB * 1024 * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1
          base64 = canvas.toDataURL('image/jpeg', quality)
        }

        resolve(base64)
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}
