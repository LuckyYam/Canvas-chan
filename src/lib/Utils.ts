import { Image, CanvasRenderingContext2D } from 'canvas';
import axios from 'axios';

export class Utils {
  constructor() {}

  public centerImage = (base: Image, data: Image) => {
    const dataRatio = data.width / data.height;
    const baseRatio = base.width / base.height;
    let { width, height } = data;
    let x = 0;
    let y = 0;
    if (baseRatio < dataRatio) {
      height = data.height;
      width = base.width * (height / base.height);
      x = (data.width - width) / 2;
      y = 0;
    } else if (baseRatio > dataRatio) {
      width = data.width;
      height = base.height * (width / base.width);
      x = 0;
      y = (data.height - height) / 2;
    }
    return { x, y, width, height };
  };

  public centerImagePart = (
    data: Image,
    maxWidth: number,
    maxHeight: number,
    widthOffset: number,
    heightOffest: number
  ) => {
    let { width, height } = data;
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height *= ratio;
    }
    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width *= ratio;
    }
    const x = widthOffset + (maxWidth / 2 - width / 2);
    const y = heightOffest + (maxHeight / 2 - height / 2);
    return { x, y, width, height };
  };

  public drawImageWithTint = (
    ctx: CanvasRenderingContext2D,
    image: Image,
    color: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): CanvasRenderingContext2D => {
    const { fillStyle, globalAlpha } = ctx;
    ctx.fillStyle = color;
    ctx.drawImage(image, x, y, width, height);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = globalAlpha;
    return ctx;
  };

  public percentColor = (
    pct: number,
    percentColors: { pct: number; color: { r: number; g: number; b: number } }[]
  ): string => {
    let i = 1;
    for (i; i < percentColors.length - 1; i++) {
      if (pct < percentColors[i].pct) {
        break;
      }
    }
    const lower = percentColors[i - 1];
    const upper = percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (pct - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper)
        .toString(16)
        .padStart(2, '0'),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper)
        .toString(16)
        .padStart(2, '0'),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        .toString(16)
        .padStart(2, '0'),
    };
    return `#${color.r}${color.g}${color.b}`;
  };

  public wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ) => {
    return new Promise((resolve) => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText('W').width > maxWidth) return resolve(null);
      const words = text.split(' ');
      const lines: string[] = [];
      let line: string = '';
      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) {
            words[1] = `${temp.slice(-1)}${words[1]}`;
          } else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `;
        } else {
          lines.push(line.trim());
          line = '';
        }
        if (words.length === 0) lines.push(line.trim());
      }
      return resolve(lines);
    });
  };

  public silhouette = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): CanvasRenderingContext2D => {
    const data = ctx.getImageData(x, y, width, height);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = 0;
      data.data[i + 1] = 0;
      data.data[i + 2] = 0;
    }
    ctx.putImageData(data, x, y);
    return ctx;
  };

  public getBuffer = async (url: string): Promise<Buffer> =>
    (await axios.get<Buffer>(url, { responseType: 'arraybuffer' })).data;

  public fetch = async (url: string) => await (await axios.get(url)).data;

  public capitalize = (content: string): string =>
    `${content.charAt(0).toUpperCase()}${content.slice(1)}`;

  public streamToArray = (stream) => {
    if (!stream.readable) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      const array = [];
      function onData(data: never) {
        array.push(data);
      }
      function onEnd(error) {
        if (error) reject(error);
        else resolve(array);
        cleanup();
      }
      function onClose() {
        resolve(array);
        cleanup();
      }
      function cleanup() {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        stream.removeListener('close', onClose);
      }
      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('error', onEnd);
      stream.on('close', onClose);
    });
  };
}
