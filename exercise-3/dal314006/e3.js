// ===============================
// E3: JavaScript Starter File
// ===============================
//
// The assignment page is the authoritative specification.
// This file provides function stubs and sample usage for testing.

// Problem 1
/**
 * @param {string[]} titles
 * @returns {string[]}
 */
function generateIds(titles) {
    // Split on a run of whitespace, since a title typed with a double space
    // between words would otherwise come back with two hyphens in it.
    return titles.map(title => title.trim().toLowerCase().split(/\s+/).join("-"));
}

// Problem 2
/**
 * @param {string[]} titles
 * @returns {string[]}
 */
function highlightImportant(titles) {
    return generateIds(titles.filter(title => title.includes("Important")));
}

// Problem 3
/**
 * @param {string[]} titles
 * @returns {Object}
 */
function wordFrequency(titles) {
    const words = titles.flatMap(title => title.toLowerCase().split(/\s+/));

    return words.reduce((counts, word) => {
        // hasOwn, because a title holding the word "constructor" reads a
        // function off the prototype and counting would start from that.
        counts[word] = Object.hasOwn(counts, word) ? counts[word] + 1 : 1;
        return counts;
    }, {});
}

// Problem 4
/**
 * @param {string[]} menu
 * @param {string} item
 * @returns {string[]}
 */
function addMenuItem(menu, item) {
    return [...menu, item];
}

// Problem 5
/**
 * @param {string} message
 * @param {(msg: string) => string} formatter
 * @returns {void}
 */
function showFormattedMessage(message, formatter) {
    console.log(formatter(message));
}

// Problem 6
/**
 * @param {string[]} items
 * @param {(item: string) => string} formatter
 * @returns {string[]}
 */
function formatMenu(items, formatter) {
    // map hands its callback the index and the whole array as well, so the
    // formatter is called here with the one argument it expects.
    return items.map(item => formatter(item));
}

// Problem 7
/**
 * @param {Object} user
 * @param {Object} updates
 * @returns {Object}
 */
function updateUser(user, updates) {
    return { ...user, ...updates };
}

// Problem 8
/**
 * @param {Object} user
 * @returns {Object}
 */
function removeSensitive(user) {
    const { password, ...safe } = user;
    return safe;
}

// Problem 9
/**
 * @param {...Object} profiles
 * @returns {Object}
 */
function mergeProfiles(...profiles) {
    return profiles.reduce((merged, profile) => ({ ...merged, ...profile }), {});
}

// Problem 10
/**
 * @param {Object[]} sections
 * @param {(title: string) => string} formatter
 * @returns {Object[]}
 */
function buildNavigation(sections, formatter) {
    return sections
        .filter(section => section.priority > 2)
        .map(section => ({
            id: generateIds([section.title])[0],
            label: formatter(section.title),
            // A copy. Pushing a class onto a navigation entry should leave the
            // section it came from alone.
            classes: [...section.classes]
        }));
}


// ===============================
// Sample Usage / Testing
// ===============================

// Problem 1
console.log(generateIds(["About Us", "Our Projects", "Contact Info"]));
// Expected: ["about-us", "our-projects", "contact-info"]

// Problem 2
console.log(highlightImportant([
    "About Us",
    "Important Notice",
    "Our Projects",
    "Very Important Update"
]));
// Expected: ["important-notice", "very-important-update"]

// Problem 3
console.log(wordFrequency([
    "About Us",
    "Our Projects",
    "Important Projects",
    "Contact Us"
]));
// Expected:
// { about: 1, us: 2, our: 1, projects: 2, important: 1, contact: 1 }

// Problem 4
const originalMenu = ["Home", "About"];
const newMenu = addMenuItem(originalMenu, "Contact");

console.log(newMenu);
// Expected: ["Home", "About", "Contact"]

console.log(originalMenu);
// Expected: ["Home", "About"]

// Problem 5
showFormattedMessage("hello world", msg => msg.toUpperCase());
// Expected: HELLO WORLD

showFormattedMessage("new user joined", msg => "# " + msg + " #");
// Expected: # new user joined #

// Problem 6
console.log(formatMenu(
    ["Home", "About", "Contact"],
    item => item.toUpperCase()
));
// Expected: ["HOME", "ABOUT", "CONTACT"]

// Problem 7
const user = { name: "Maya", age: 25, city: "Boston" };
const updates = { age: 26, city: "New York" };
const updatedUser = updateUser(user, updates);

console.log(updatedUser);
// Expected: { name: "Maya", age: 26, city: "New York" }

console.log(user);
// Expected: { name: "Maya", age: 25, city: "Boston" }

// Problem 8
const user2 = { name: "Maya", age: 26, password: "secret123" };

console.log(removeSensitive(user2));
// Expected: { name: "Maya", age: 26 }

console.log(user2);
// Expected: { name: "Maya", age: 26, password: "secret123" }

// Problem 9
console.log(mergeProfiles(
    { name: "Maya", age: 25 },
    { age: 26 },
    { city: "NY" }
));
// Expected: { name: "Maya", age: 26, city: "NY" }

// Problem 10
const sections = [
    { title: "Home", priority: 1, classes: ["menu-item"] },
    { title: "Important Updates", priority: 3, classes: ["menu-item", "highlight"] },
    { title: "Contact", priority: 2, classes: ["menu-item"] }
];

console.log(
    buildNavigation(
        sections,
        title => "# " + title.toUpperCase() + " #"
    )
);

// Expected:
// [
//   {
//     id: "important-updates",
//     label: "# IMPORTANT UPDATES #",
//     classes: ["menu-item", "highlight"]
//   }
// ]
