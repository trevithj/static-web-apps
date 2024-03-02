import * as Customer from "./customer.mjs";
import * as Movie from "./movie.mjs";
import * as Rental from "./rental.mjs";

const movies = [
    Movie.createMovie("Rambo 3", Movie.REGULAR),
    Movie.createMovie("Finding Nemo", Movie.CHILDRENS),
    Movie.createMovie("Dune 2", Movie.NEW_RELEASE)
];

const rentals = [
    Rental.createRental(movies[0], 5),
    Rental.createRental(movies[1], 4),
    Rental.createRental(movies[2], 3)
]

const expectedName = "Jimbo Jackson";
const customer = Customer.createCustomer(expectedName);
const actualName = customer.getName();

rentals.forEach(rental => {
    customer.addRental(rental);
});

const expectedStatement = `Rentals record for Jimbo Jackson
\tRambo 3\t6.5
\tFinding Nemo\t3
\tDune 2\t9
Amount owed is 18.5
You earned 4 frequent renter points.`;
const actualStatement = customer.statement();
console.log(expectedName === actualName);
console.log(expectedStatement === actualStatement);

