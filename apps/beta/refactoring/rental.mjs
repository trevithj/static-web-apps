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

    const getFrequentRenterPoints = () => getMovie().getFrequentRenterPoints(daysRented);

    return Object.freeze({
        getMovie, getDaysRented, getCharge, getFrequentRenterPoints
    });
}
