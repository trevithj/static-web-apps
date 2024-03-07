/*
public class Movie {
    public static final int CHILDRENS = 2
    public static final int REGULAR = 1
    public static final int NEW_RELEASE = 0

    private String _title;
    private int _priceCode;

    public Movie(String title, int priceCode) {
        _title = title;
        _priceCode = priceCode;
    }

    public int getPriceCode() {
        return _priceCode;
    }
    public void setPriceCode(int arg) {
        _priceCode = arg;
    }
    public String getTitle() {
        return _title;
    }
}
*/
import * as Price from "./price.mjs";

const { CHILDRENS, REGULAR, NEW_RELEASE, createPrice } = Price;

function checkIsInt(n, field) {
    if(isNaN(n)) throw new TypeError(`${field} must be numeric`);
    return Math.round(n);
}

export function createMovie(title, priceCode) {
    if(typeof title !== "string") throw new TypeError("title must be a string");
    const price = createPrice(priceCode);

    const setPriceCode = args => price = createPrice(args);

    const getPriceCode = () =>price.getPriceCode();

    const getTitle = () => title;

    function getCharge(daysRented) {
        let result = 0;
        // determine amounts for each line
        switch (getPriceCode()) {
            case REGULAR:
                result += 2;
                if (daysRented > 2)
                    result += (daysRented - 2) * 1.5;
                break;
            case NEW_RELEASE:
                result += daysRented * 3;
                break;
            case CHILDRENS:
                result += 1.5;
                if (daysRented > 3)
                    result += (daysRented - 3) * 1.5;
                break;
        }
        return result;
    }

    function getFrequentRenterPoints(daysRented) {
        if ((getPriceCode() === NEW_RELEASE) && daysRented > 1) {
            return 2;
        } else {
            return 1;
        }
    }

    return Object.freeze({
        getPriceCode, getTitle, setPriceCode, getCharge, getFrequentRenterPoints, _TYPE: "Movie"
    });
}
