import { Injectable } from '@angular/core'
import seedrandom from 'seedrandom'

@Injectable({
    providedIn: 'root',
})
export class RandomService {
    private _seed: string | null = null
    private rng: seedrandom.PRNG | null = null

    set seed(seed: string) {
        this._seed = seed
        this.rng = seedrandom(this._seed)
    }

    // generates random integer between min and max (inclusive)
    getRandomInt = (min: number, max: number): number => {
        if (this.rng === null) throw Error('rng not initialized')
        return Math.floor(this.rng() * (max - min + 1)) + min
    }
}
