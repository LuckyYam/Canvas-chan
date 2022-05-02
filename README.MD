## Canvas-chan

[![NPM](https://img.shields.io/badge/Available%20On-NPM-lightgrey.svg?logo=npm&logoColor=339933&labelColor=white&style=flat-square)](https://www.npmjs.com/package/@shineiichijo/canvas-chan)

Making canvas stuffs easier

---

### Installation
```
yarn add @shineiichijo/canvas-chan
```

## Features
- Simple to use
- Can be used for shipping people ❤️
- Can be used to make a person simp (ahm..)
- Generates image of Guess-The-Pokemon game (hidden and shown)

# Usage

## Ship

```ts
import { Ship, IShipOptions } from '@shineiichijo/canvas-chan'
import { writeFile } from 'fs-extra'

(async () => {
    const options: IShipOptions = [
        {
            //name of the person1
            name: 'Person1',
            //image of the person1 (can be a Buffer)
            image: 'https://i.pinimg.com/originals/35/66/03/3566030107abb8193bfe646ee53ba3a0.jpg'
        },
        {
            //name of the person2
            name: 'Person2',
            //image of the person2 (can be a Buffer)
            image: 'https://i.pinimg.com/originals/5a/d2/0b/5ad20b2696a632543659055d62928028.jpg'
        }
    ]
    const level = Math.floor(Math.random() * 100)
    const ship = await new Ship(options, level, 'Amazing').build()
    //now let's write the image (Buffer)
    await writeFile('ship.png', ship, 'Amazing')
})()
```

### Result 

<div align=center>
<a href="https://github.com/ShineiIchijo/Canvas-chan/blob/master/.github/assets/ship.png"><img src="https://raw.githubusercontent.com/ShineiIchijo/Canvas-chan/master/.github/assets/ship.png" alt="ship" border="0"></a>

</div>

## Simp

```ts
import { Simp } from '@shineiichijo/canvas-chan'
import { writeFile } from 'fs-extra'

(async () => {
    const simp = await new Simp('https://static.fandomspot.com/images/12/11202/05-makoto-itou-school-days-anime-screenshot.jpg').build() //the image can also be a Buffer
    //now let's write the image (Buffer)
    await writeFile('simp.png', simp)
})()
```

### Result

<div align=center>
<a href="https://github.com/ShineiIchijo/Canvas-chan/blob/master/.github/assets/simp.png"><img src="https://raw.githubusercontent.com/ShineiIchijo/Canvas-chan/master/.github/assets/simp.png" alt="simp" border="0"></a>

</div>

## Guess-The-Pokemon

```ts
import { Pokemon } from '@shineiichijo/canvas-chan'
import { writeFile } from 'fs-extra'
```

### Hidden

```ts
(async () => {
    const image = await new Pokemon(/**Name or Pokedex ID of the Pokemon*/'Chikorita', /**gonna hide it?*/ true).build()
    //now let's write the image (Buffer)
    await writeFile('hiddenPokemon.png', image)
})()
```

#### Result

<div align=center>
<a href="https://github.com/ShineiIchijo/Canvas-chan/blob/master/.github/assets/hiddenPokemon.png"><img src="https://raw.githubusercontent.com/ShineiIchijo/Canvas-chan/master/.github/assets/hiddenPokemon.png" alt="pokemon" border="0"></a>

</div>

### Shown

```ts
(async () => {
    const image = await new Pokemon(/**Name or Pokedex ID of the Pokemon*/'Chikorita', /**gonna hide it?*/ false).build()
    //now let's write the image (Buffer)
    await writeFile('shownPokemon.png', image)
})()
```

#### Result

<div align=center>
<a href="https://github.com/ShineiIchijo/Canvas-chan/blob/master/.github/assets/shownPokemon.png"><img src="https://raw.githubusercontent.com/ShineiIchijo/Canvas-chan/master/.github/assets/shownPokemon.png" alt="pokemon" border="0"></a>

</div>