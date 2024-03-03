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
console.log(expectedName === actualName);

const expectedStatement = `Rentals record for Jimbo Jackson
\tRambo 3\t6.5
\tFinding Nemo\t3
\tDune 2\t9
Amount owed is 18.5
You earned 4 frequent renter points.`;
const actualStatement = customer.statement();
console.log(expectedStatement === actualStatement);

const expectedHtmlStatement = `<h1>Rentals record for <em>Jimbo Jackson</em></h1>
<p>Rambo 3: 6.5</p>
<p>Finding Nemo: 3</p>
<p>Dune 2: 9</p>
<p>You owe <em>18.5</em></p>
<p>On this rental you earned <em>4</em> frequent renter points.</p>`;
const actualHtmlStatement = customer.htmlStatement();
console.log(expectedHtmlStatement === actualHtmlStatement);
