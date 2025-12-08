import { Injectable } from '@angular/core'
import seedrandom from 'seedrandom'

@Injectable({
    providedIn: 'root',
})
export class RandomService {
    private rng: seedrandom.PRNG | null = null

    set seed(seed: string) {
        this.rng = seedrandom(seed, { state: true })
    }

    get rngState(): seedrandom.State.Arc4 | null {
        // @ts-expect-error state is defined
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
        return this.rng ? this.rng.state() : null
    }

    setRngFromState(state: seedrandom.State.Arc4): void {
        this.rng = seedrandom('', { state })
    }

    // generates random integer between min and max (inclusive)
    getRandomInt = (min: number, max: number): number => {
        if (this.rng === null) throw Error('rng not initialized')
        return Math.floor(this.rng() * (max - min + 1)) + min
    }
}
