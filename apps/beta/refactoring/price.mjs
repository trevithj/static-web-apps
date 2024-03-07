/*
Inheritance may not be useful here. But well...
*/

export const CHILDRENS = 2
export const REGULAR = 1
export const NEW_RELEASE = 0

const Price = {}

const ChildrensPrice = Object.create(Price);
ChildrensPrice.getPriceCode = () => CHILDRENS;

const NewReleasePrice = Object.create(Price);
NewReleasePrice.getPriceCode = () => NEW_RELEASE;

const RegularPrice = Object.create(Price);
RegularPrice.getPriceCode = () =>REGULAR;

export function createPrice(priceCode) {
    switch(priceCode) {
        case CHILDRENS:
            return ChildrensPrice;
        case REGULAR:
            return RegularPrice;
        case NEW_RELEASE:
            return NewReleasePrice;
        default:
            throw new Error("Incorrect Price Code");
    }
}