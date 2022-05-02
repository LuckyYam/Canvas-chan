import { createCanvas, loadImage, registerFont } from 'canvas'
import { join } from 'path'
import { Utils } from '../lib'

export class Ship {
    private paths = {
        image: join(__dirname, '..', '..', 'assets', 'images', 'ship.png'),
        font: join(__dirname, '..', '..', 'assets', 'fonts', 'Pinky_Cupid.ttf')
    }

    private utils: Utils = new Utils()

    /**
     * Constructs an instance of the ship image
     * @param {IShipProfile[]} profile Array of name and image of the people that you want to ship
     * @param {number} percentage The level of their shipping
     * @param {string} text The text that you want to write at the top of the image
     */

    constructor(private profile: IShipProfile[], private percentage: number, private text?: string) {}

    /**
     * Builds the ship image
     * @returns {Buffer}
     */

    public build = async (): Promise<Buffer> => {
        registerFont(this.paths.font, { family: 'Pinky Cupid' })
        if (this.profile.length <= 1) this.profile.push({ name: this.profile[0].name, image: this.profile[0].image })
        if (typeof this.profile[0].image !== 'string' && !Buffer.isBuffer(this.profile[0].image) || typeof this.profile[1].image !== 'string' && !Buffer.isBuffer(this.profile[1].image)) throw new TypeError('The image should be of type string or instance of Buffer')
        if (typeof this.profile[0].image === 'string') this.profile[0].image = await this.utils.getBuffer(this.profile[0].image)
        if (typeof this.profile[1].image === 'string') this.profile[1].image = await this.utils.getBuffer(this.profile[1].image)
        const image1 = await loadImage(this.profile[0].image)
        const image2 = await loadImage(this.profile[1].image)
        const base = await loadImage(this.paths.image)
        const canvas = createCanvas(base.width, base.height)
        const ctx = canvas.getContext('2d')
        
        let text!: string
        if (this.percentage === 0 || (this.percentage > 0 && this.percentage < 10)) text = 'Awful'
        else if (this.percentage >= 10 && this.percentage < 25) text = 'Very Bad'
        else if (this.percentage >= 25 && this.percentage < 50) text = 'Poor'
        else if (this.percentage >= 50 && this.percentage < 75) text = 'Average'
        else if (this.percentage >= 75 && this.percentage < 80) text = 'Good'
        else if (this.percentage >= 80 && this.percentage < 90) text = 'Great'
        else if (this.percentage >= 90) text = 'Amazing'
        ctx.drawImage(image1, 70, 56, 400, 400)
        ctx.drawImage(image2, 730, 56, 400, 400)
        ctx.drawImage(base, 0, 0)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = '#ff6c6c'
        ctx.font = '40px Pinky Cupid'
        ctx.fillText('~Compatability Meter~', 600, 15)
        ctx.fillStyle = 'white'
        ctx.fillText(this.profile[0].name, 270, 448)
        ctx.fillText(this.profile[1].name, 930, 448)
        ctx.font = '60px Pinky Cupid'
        ctx.fillStyle = 'red'
        ctx.fillText(`~${this.percentage}%~`, 600, 230)
        ctx.fillText(this.text ?? text, 600, 296)
        ctx.font = '90px Pinky Cupid'
        ctx.fillText(this.percentage > 49 ? '❤️' : '💔', 600, 100)
        return canvas.toBuffer()
    }
}

export interface IShipProfile {
    name: string;
    image: string | Buffer;
}