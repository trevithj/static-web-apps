/*
class Rental {
    private Movie _movie;
    private int _daysRented;

    public Rental(Movie movie, int daysRented) {
        _movie = movie;
        _daysRented = daysRented;
    }

    public Movie getMovie() {
        return _movie;
    }

    public int getDaysRented() {
        return _daysRented;
    }
}
*/
import * as Movie from "./movie.mjs";


export function createRental(movie, daysRented) {

    const getMovie = () => movie;

    const getDaysRented = () => daysRented;

    const getCharge = () => getMovie().getCharge(daysRented);

    function getFrequentRenterPoints() {
        if ((getMovie().getPriceCode() == Movie.NEW_RELEASE) && getDaysRented() > 1) {
            return 2;
        } else {
            return 1;
        }
    }

    return Object.freeze({
        getMovie, getDaysRented, getCharge, getFrequentRenterPoints
    });
}
