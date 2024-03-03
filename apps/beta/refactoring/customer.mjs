/* 
class Customer {
    private String _name;
    private Vector _rentals = new Vector();

    public Customer(String name) {
        _name = name;
    };

    public void addRental(Rental arg) {
        _rentals.addElement(Rental);
    }

    public String getName() {
        return _name;
    }

    public String statement() {
        double totalAmount = 0;
        int frequentRenterPoints = 0;
        Enumeration rentals = _rentals.elements();
        String result = "Rentals record for " + getName() + "\n";
        while (rentals.hasMoreElements()) {
            double thisAmount = 0;
            Rental each = (Rental) rentals.nextElement();

            // determine amounts for each line
            switch(each.getMovie().getPriceCode()) {
                case Movie.REGULAR:
                    thisAmount += 2;
                    if (each.getDaysRented() > 2)
                        thisAmount += (each.getDaysRented() -2) * 1.5;
                    break;
                case Movie.NEW_RELEASE:
                    thisAmount += each.getDaysRented() * 3;
                    break;
                case Movie.CHILDRENS:
                    thisAmount += 1.5;
                    if (each.getDaysRented() > 3)
                        thisAmount += (each.getDaysRented() -3) * 1.5;
                    break;
            }

            // add frequent renter points
            frequentRenterPoints ++;
            // add bonus for a two day new release rental
            if ((each.getMovie().getPriceCode() == Movie.NEW_RELEASE) &&
                each.getDaysRented() > 1) frequentRenterPoints ++;

            // Show figures for this rental
            result += "\t" + each.getMovie().getTitle() + "\t" + String.valueOf(thisAmount) + "\n";
            totalAmount += thisAmount;
        }
        // add footer lines
        result += "Amount owed is " + String.valueOf(totalAmount) + "\n";
        result += "You earned " + String.valueOf(frequentRenterPoints) + " frequent renter points.";
        return result;
    }
}
*/
export function createCustomer(name) {
    const rentals = new Set();

    const getName = () => name;
    const addRental = rental => rentals.add(rental);

    function getTotalAmount() {
        // return [...rentals].reduce((total, rental) => total + rental.getCharge(), 0);
        let result = 0;
        rentals.forEach(aRental => result += aRental.getCharge());
        return result;
    }

    function getTotalFrequentRenterPoints() {
        // return [...rentals].reduce((total, rental) => total + rental.getFrequentRenterPoints(), 0);
        let result = 0;
        rentals.forEach(aRental => result += aRental.getFrequentRenterPoints());
        return result;
    }

    const statement = () => {
        let result = "Rentals record for " + getName() + "\n";
        rentals.forEach(each => {
            // Show figures for this rental
            result += "\t" + each.getMovie().getTitle() + "\t" + each.getCharge() + "\n";
        })
        // add footer lines
        result += "Amount owed is " + getTotalAmount() + "\n";
        result += "You earned " + getTotalFrequentRenterPoints() + " frequent renter points.";
        return result;
    }

    const htmlStatement = () => {
        let result = "<h1>Rentals record for <em>" + getName() + "</em></h1>\n";
        rentals.forEach(each => {
            // Show figures for this rental
            result += "<p>" + each.getMovie().getTitle() + ": " + each.getCharge() + "</p>\n";
        })
        // add footer lines
        result += "<p>You owe <em>" + getTotalAmount() + "</em></p>\n";
        result += "<p>On this rental you earned <em>" + getTotalFrequentRenterPoints() + "</em> frequent renter points.</p>";
        return result;
    }

    return Object.freeze({addRental, getName, statement, htmlStatement});
}
