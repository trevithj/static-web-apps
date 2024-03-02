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

export function createRental(movie, daysRented) {

    const getMovie = () => movie;

    const getDaysRented = () => daysRented;

    return Object.freeze({
        getMovie, getDaysRented
    });
}
