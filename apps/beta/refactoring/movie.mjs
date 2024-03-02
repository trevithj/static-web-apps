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

    return Object.freeze({
        getPriceCode, getTitle, setPriceCode, _TYPE: "Movie"
    });
}

export function createMovie2(title, priceCode) {
    if(typeof title !== "string") throw new TypeError("title must be a string");
    priceCode = checkIsInt(priceCode, "priceCode");

    return Object.freeze({
        get title() {
            return title;
        },
        get priceCode() {
            return priceCode;
        },
        set priceCode(arg) {
            priceCode = checkIsInt(arg, "priceCode");
        }
    });
}
