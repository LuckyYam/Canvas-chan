import { join } from 'path';
import GIFEncoder from 'gifencoder';
import { createCanvas, loadImage } from 'canvas';
import { Utils } from '../lib';
import { type } from 'os';

export class Triggered {
  private path = join(
    __dirname,
    '..',
    '..',
    'assets',
    'images',
    'triggered.png'
  );

  private utils = new Utils();

  /**
   * Constructs an instance of the triggered class
   * @param {string | Buffer} image Image to be triggered
   */

  constructor(private image: string | Buffer) {}

  /**
   * Builds the triggered gif
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
    const data = await loadImage(this.image);
    const coord1 = [-25, -33, -42, -14];
    const coord2 = [-25, -13, -34, -10];
    const base = await loadImage(this.path);
    const encoder = new GIFEncoder(base.width, base.width);
    const canvas = createCanvas(base.width, base.width);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, base.width, base.width);
    const stream = encoder.createReadStream();
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(50);
    encoder.setQuality(200);
    for (let i = 0; i < 4; i++) {
      this.utils.drawImageWithTint(
        ctx,
        data,
        'red',
        coord1[i],
        coord2[i],
        300,
        300
      );
      ctx.drawImage(base, 0, 218, 256, 38);
      encoder.addFrame(ctx);
    }
    encoder.finish();
    return Buffer.concat(
      (await this.utils.streamToArray(stream)) as readonly Uint8Array[]
    );
  };
}
