import { createCanvas, loadImage, registerFont } from 'canvas';
import { join } from 'path';
import { Utils } from '../lib';

export class Friendship {
  private paths = {
    image: join(__dirname, '..', '..', 'assets', 'images', 'friendship.png'),
    font: join(__dirname, '..', '..', 'assets', 'fonts', 'Pinky_Cupid.ttf'),
  };

  private utils: Utils = new Utils();
  /**
   * Constructs an instance of the Frienship class
   * @param {IFriendShip[]} options Array of name and image of the people
   * @param {number} percentage The level of their friencship
   * @param {string} text The text to be written at the above for their friendship
   */

  constructor(
    private options: IFriendShip[],
    private percentage: number,
    private text?: string
  ) {}

  /**
   * Builds the image
   * @returns {Bufffer}
   */

  public build = async (): Promise<Buffer> => {
    registerFont(this.paths.font, { family: 'Pinky Cupid' });
    if (this.options.length <= 1)
      this.options.push({
        name: this.options[0].name,
        image: this.options[0].image,
      });
    if (
      (typeof this.options[0].image !== 'string' &&
        !Buffer.isBuffer(this.options[0].image)) ||
      (typeof this.options[1].image !== 'string' &&
        !Buffer.isBuffer(this.options[1].image))
    )
      throw new TypeError('The image should be of type string or Buffer');
    if (typeof this.options[0].image === 'string')
      this.options[0].image = await this.utils.getBuffer(this.options[0].image);
    if (typeof this.options[1].image === 'string')
      this.options[1].image = await this.utils.getBuffer(this.options[1].image);
    const image1 = await loadImage(this.options[0].image);
    const image2 = await loadImage(this.options[1].image);
    const base = await loadImage(this.paths.image);
    const canvas = createCanvas(base.width, base.height);
    const percentColors = [
      { pct: 0.0, color: { r: 0, g: 0, b: 255 } },
      { pct: 0.5, color: { r: 0, g: 255 / 2, b: 255 / 2 } },
      { pct: 1.0, color: { r: 0, g: 255, b: 0 } },
    ];
    let text!: string;
    if (this.percentage === 0 || (this.percentage > 0 && this.percentage < 10))
      text = 'Awful';
    else if (this.percentage >= 10 && this.percentage < 25) text = 'Very Bad';
    else if (this.percentage >= 25 && this.percentage < 50) text = 'Poor';
    else if (this.percentage >= 50 && this.percentage < 75) text = 'Average';
    else if (this.percentage >= 75 && this.percentage < 80) text = 'Good';
    else if (this.percentage >= 80 && this.percentage < 90) text = 'Great';
    else if (this.percentage >= 90 && this.percentage < 95)
      text = 'Best Friends';
    else if (this.percentage >= 95) text = 'Soulmates';
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image1, 70, 56, 400, 400);
    ctx.drawImage(image2, 730, 56, 400, 400);
    ctx.drawImage(base, 0, 0);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'green';
    ctx.font = '40px Pinky Cupid';
    ctx.fillText('~Friendship Meter~', 600, 15);
    ctx.fillStyle = 'white';
    ctx.fillText(this.options[0].name, 270, 448);
    ctx.fillText(this.options[1].name, 930, 448);
    ctx.font = '60px Pinky Cupid';
    ctx.fillStyle = this.utils.percentColor(
      this.percentage / 100,
      percentColors
    );
    ctx.fillText(`~${this.percentage}%~`, 600, 230);
    ctx.fillText(this.text ?? text, 600, 296);
    ctx.font = '90px Pinky Cupid';
    ctx.fillText(this.percentage > 49 ? '👍' : '👎', 600, 100);
    return canvas.toBuffer();
  };
}

export interface IFriendShip {
  name: string;
  image: string | Buffer;
}
