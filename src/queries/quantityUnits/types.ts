interface Millilitres {
    name: 'millilitres'
    symbol: 'mL'
}

interface Litres {
    name: 'litres'
    symbol: 'L'
}

interface Cups {
    name: 'cups'
    symbol: 'cups'
}

interface FluidOunces {
    name: 'fluid ounces'
    symbol: 'fl.oz'
}

interface Teaspoon {
    name: 'teaspoon'
    symbol: 'tsp'
}

interface Tablespoon {
    name: 'tablespoon'
    symbol: 'tbsp'
}

interface Grams {
    name: 'grams'
    symbol: 'g'
}

interface Pounds {
    name: 'pounds'
    symbol: 'lbs'
}

interface Ounces {
    name: 'ounces'
    symbol: 'oz'
}

export type QuantityUnit = (Millilitres | Litres | Cups | FluidOunces | Teaspoon | Tablespoon | Grams | Pounds | Ounces) & {
    id: number
}
