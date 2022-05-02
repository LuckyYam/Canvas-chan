import { createCanvas, loadImage } from 'canvas';
import { join } from 'path';
import { Utils } from '../lib';

export class Crush {
  private path = join(__dirname, '..', '..', 'assets', 'images', 'crush.png');

  private utils = new Utils();

  /**
   * Constructs an instance of the Crush class
   * @param {string | Buffer} image Image of the crush
   */

  constructor(private image: string | Buffer) {}

  /**
   * Builds the image
   * @returns {Buffer}
   */

  public build = async (): Promise<Buffer> => {
    if (typeof this.image !== 'string' && !Buffer.isBuffer(this.image))
      throw new TypeError(
        `Image should be of type string or Buffer. Recieved ${typeof this
          .image}`
      );
    if (typeof this.image === 'string')
      this.image = await this.utils.getBuffer(this.image);
    const base = await loadImage(this.path);
    const data = await loadImage(this.image);
    const canvas = createCanvas(base.width, base.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, base.width, base.height);
    ctx.rotate(3.79 * (Math.PI / 180));
    const { x, y, width, height } = this.utils.centerImagePart(
      data,
      400,
      400,
      79,
      472
    );
    ctx.drawImage(data, x, y, width, height);
    ctx.rotate(-3.79 * (Math.PI / 180));
    ctx.drawImage(base, 0, 0);
    return canvas.toBuffer();
  };
}
