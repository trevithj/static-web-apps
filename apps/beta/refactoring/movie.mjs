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

export const CHILDRENS = 2
export const REGULAR = 1
export const NEW_RELEASE = 0

function checkIsInt(n, field) {
    if(isNaN(n)) throw new TypeError(`${field} must be numeric`);
    return Math.round(n);
}

export function createMovie(title, priceCode) {
    if(typeof title !== "string") throw new TypeError("title must be a string");
    priceCode = checkIsInt(priceCode, "priceCode");

    const getPriceCode = () => priceCode;
    const getTitle = () => title;
    const setPriceCode = args => priceCode = checkIsInt(args, "priceCode");

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


    return Object.freeze({
        getPriceCode, getTitle, setPriceCode, getCharge, _TYPE: "Movie"
    });
}
