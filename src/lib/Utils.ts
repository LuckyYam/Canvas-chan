import { Image, CanvasRenderingContext2D } from 'canvas'
import axios from 'axios'

export class Utils {
    constructor() {}

    public centerImage = (base: Image, data: Image) => {
        const dataRatio = data.width / data.height
        const baseRatio = base.width / base.height
        let { width, height } = data
        let x = 0
        let y = 0
        if (baseRatio < dataRatio) {
            height = data.height
            width = base.width * (height / base.height)
            x = (data.width - width) / 2
            y = 0
        } else if (baseRatio > dataRatio) {
            width = data.width
            height = base.height * (width / base.width)
            x = 0
            y = (data.height - height) / 2
        }
        return { x, y, width, height }
    }

    public silhouette = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number
    ): CanvasRenderingContext2D => {
        const data = ctx.getImageData(x, y, width, height)
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = 0
            data.data[i + 1] = 0
            data.data[i + 2] = 0
        }
        ctx.putImageData(data, x, y)
        return ctx
    }

    public getBuffer = async (url: string): Promise<Buffer> =>
        (await axios.get<Buffer>(url, { responseType: 'arraybuffer' })).data

    public fetch = async (url: string) => await (await axios.get(url)).data

    public capitalize = (content: string): string => `${content.charAt(0).toUpperCase()}${content.slice(1)}`
}
