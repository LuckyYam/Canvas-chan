import { join } from 'path';
import { createCanvas, loadImage } from 'canvas';
import { Utils } from '../lib/Utils';

export class Simp {
  private path = join(__dirname, '..', '..', 'assets', 'images', 'simp.png');

  private utils: Utils = new Utils();

  /**
   * Constucts an instance of the Simp class
   * @param {string | Buffer} image The image that you want to mark as a simp
   */

  constructor(private image: string | Buffer) {}

  /**
   * Builds the simp image
   * @returns {Buffer}
   */

  public build = async (): Promise<Buffer> => {
    const base = await loadImage(this.path);
    if (typeof this.image !== 'string' && !Buffer.isBuffer(this.image))
      throw new TypeError(
        `The image should be of type string or instance of Buffer. Recieved ${typeof this
          .image}`
      );
    if (typeof this.image === 'string')
      this.image = await this.utils.getBuffer(this.image);
    const data = await loadImage(this.image);
    const canvas = createCanvas(data.width, data.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(data, 0, 0);
    const { x, y, width, height } = await this.utils.centerImage(base, data);
    ctx.drawImage(base, x, y, width, height);
    return canvas.toBuffer();
  };
}
