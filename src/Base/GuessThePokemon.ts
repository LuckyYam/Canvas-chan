import { createCanvas, loadImage } from 'canvas';
import { Utils } from '../lib/Utils';
import { join } from 'path';

export class GuessThePokemon {
  private utils: Utils = new Utils();

  private paths = {
    images: {
      shown: join(__dirname, '..', '..', 'assets', 'images', 'show.png'),
      hidden: join(__dirname, '..', '..', 'assets', 'images', 'hidden.png'),
    },
    font: join(__dirname, '..', '..', 'assets', 'fonts', 'Pokemon_Solid.ttf'),
  };

  /**
   * Constructs an instance of the Guess-The-Pokemon
   * @param {string | number} pokemon The Pokedex ID or name of the pokemon
   * @param {boolean} hide Should be true if you want the pokemon to be hidden and false if you want to show the pokemon
   */

  constructor(private pokemon: string | number, private hide: boolean = true) {}

  /**
   * Builds the image of Guess-The_Pokemon game acording to the given condition
   * @returns {Buffer} The image of the game
   */

  public build = async (): Promise<Buffer> => {
    const query =
      typeof this.pokemon === 'string'
        ? this.pokemon.toLowerCase()
        : this.pokemon.toString();
    let data;
    try {
      data = await this.utils.fetch(
        `https://pokeapi.co/api/v2/pokemon/${query}`
      );
    } catch (error) {
      throw new Error(`Invalid Pokemon name or id`);
    }
    const { name, id } = data;
    if (this.hide)
      return await this.createImage({
        name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      });
    else
      return await this.createImage({
        name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      });
  };

  private createImage = async (pokemon: {
    name: string;
    image: string;
  }): Promise<Buffer> => {
    const file = this.hide ? 'hidden' : 'shown';
    const bg = await loadImage(this.paths.images[file]);
    const pkmn = await loadImage(await this.utils.getBuffer(pokemon.image));
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    if (this.hide) {
      const silhouetteCanvas = createCanvas(pkmn.width, pkmn.height);
      const silhouetteCtx = silhouetteCanvas.getContext('2d');
      silhouetteCtx.drawImage(pkmn, 0, 0);
      this.utils.silhouette(silhouetteCtx, 0, 0, pkmn.width, pkmn.height);
      ctx.drawImage(silhouetteCanvas, 30, 39, 200, 200);
    } else {
      ctx.drawImage(pkmn, 30, 39, 200, 200);
      ctx.font = this.paths.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#3c5aa6';
      ctx.strokeText(this.utils.capitalize(pokemon.name), 362, 158, 240);
      ctx.fillStyle = '#ffcb05';
      ctx.fillText(this.utils.capitalize(pokemon.name), 362, 158, 240);
    }
    return canvas.toBuffer();
  };
}
