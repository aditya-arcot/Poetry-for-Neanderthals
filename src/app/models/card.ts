export interface RawCard {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1': string
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '3': string
}

export interface Card {
    id: string
    onePoint: string
    threePoint: string
}
