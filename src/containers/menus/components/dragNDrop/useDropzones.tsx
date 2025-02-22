import { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'

type Dropzone = { x: number; y: number; w: number; h: number } | null

export function useDropzones() {
    const [dropzones, setDropzones] = useState<Record<string, Dropzone>>({})

    function registerDropzone(e: LayoutChangeEvent, dropzoneId: string) {
        e.target.measureInWindow((x, y, w, h) => {
            setDropzones((prev) => ({ ...prev, [dropzoneId]: { x, y, w, h } }))
        })
    }

    function getDropTarget(finalX: number, finalY: number) {
        const targetDropzoneId =
            Object.entries(dropzones).find(([, dropzone]) => {
                if (!dropzone) {
                    return
                }

                const { x: dzLeft, y: dzTop, w, h } = dropzone
                const dzRight = dzLeft + w
                const dzBottom = dzTop + h

                const isInside = finalX > dzLeft && finalX < dzRight && finalY > dzTop && finalY < dzBottom

                return isInside
            })?.[0] ?? null

        return targetDropzoneId
    }

    return { registerDropzone, getDropTarget }
}
