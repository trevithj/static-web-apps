// Node script to run some tests
// Idea is to trial all possible versions of a wordwheel quiz
// where the missing letter is represented by an underscore.

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function readWord() {
    // TODO modify so ithreads the word from the command line
    return "RINGEIN_";
}

function permutate(word) {
    const chars = word.split("");
    const words = [word];
    while (words.length < chars.length) {
        const char = chars.shift();
        chars.push(char);
        words.push(chars.join(""));
    }
    return words;
}

function reverse(word) {
    return word.split("").reverse().join("");
}

function replaceLetter(word, letter) {
    const words = permutate(word);
    return words.map(word => word.replaceAll("_", letter)).join(" ");
}

function main() {
    const word = readWord();
    LETTERS.split("").forEach(char => {
        const trial = replaceLetter(word, char);
        if(trial) {
            console.log(trial.toLowerCase());
            // console.log(trial);
        }
    })
    console.log();
    LETTERS.split("").forEach(char => {
        const trial = replaceLetter(reverse(word), char);
        if(trial) {
            console.log(trial.toLowerCase());
        }
    })
}

main();
