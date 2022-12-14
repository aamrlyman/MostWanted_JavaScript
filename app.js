/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It operates as the entry point for our entire application and allows
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
  // promptFor() is a custom function defined below that helps us prompt and validate input more easily
  // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
  let searchType = promptFor(
    "Do you know the name of the person you are looking for?\n Enter (y) for yes or (n) for no",
    yesNo
  ).toLowerCase();
  let searchResults;
  // Routes our application based on the user's input
  switch (searchType) {
    case "y": //yes
      searchResults = searchByName(people);
      break;
    case "n": //no
      //! TODO #4: Declare a searchByTraits (multiple traits) function //////////////////////////////////////////
      //! TODO #4a: Provide option to search for single or multiple //////////////////////////////////////////
      searchResults = searchByTraits(people);
      (searchResults.length > 0 ? alert(displayPeople(searchResults)): "" );
      break;
    default:
      // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
      app(people);
      break;
  }
  // Calls the mainMenu() only AFTER we find the SINGLE PERSON
  mainMenu(searchResults, people);
}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
  // A check to verify a person was found via searchByName() or searchByTrait()
  if (!person[0]) {
    alert("Could not find that individual.");
    // Restarts app() from the very beginning
    return app(people);
  }
  let displayOption = prompt(
    `Found ${person[0].firstName} ${person[0].lastName}. 
        Type a NUMBER to choose from the following options: 
            (1) Get more INFO about ${person[0].firstName} ${person[0].lastName}  
            (2) Find ${person[0].firstName} ${person[0].lastName}'s FAMILY members 
            (3) Find ${person[0].firstName} ${person[0].lastName}'s DESCENDANTS 
            (4) Restart 
            (5) Quit`
  );
  // Routes our application based on the user's input
  switch (displayOption) {
    case "1": //info
      //! TODO #1: Utilize the displayPerson function //////////////////////////////////////////
      // HINT: Look for a person-object stringifier utility function to help
      let personInfo = displayPerson(person[0]);
      alert(personInfo);
      break;
    case "2": //family
      //! TODO #2: Declare a findPersonFamily function //////////////////////////////////////////
      // HINT: Look for a people-collection stringifier utility function to help
      let personRelationships = findPersonFamily(person[0], people);
      alert(
        personRelationships.length === 0
          ? "No family found"
          : renderPersonRelationships(personRelationships)
      );
      break;
    case "3": //descendants
      //! TODO #3: Declare a findPersonDescendants function //////////////////////////////////////////
      // HINT: Review recursion lecture + demo for bonus user story
      let personDescendants = findPersonDescendants(person[0], people);
      alert(
        personDescendants.length === 0
          ? "No descendants found."
          : renderPersonRelationships(
              personDescendants.map((d) =>
                Object.assign({ relationship: "Descendant" }, d)
              )
            )
      );
      break;
    case "4": //restart
      // Restart app() from the very beginning
      app(people);
      break;
    case "5": //quit
      // Stop application execution
      return;
    default:
      // Prompt user again. Another instance of recursion
      return mainMenu(person, people);
  }
}
// End of mainMenu()

/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}             An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
  let foundPerson = people.filter(function (person) {
    if (person.firstName === firstName && person.lastName === lastName) {
      return true;
    }
  });
  return foundPerson;
}
// End of searchByName()

/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
  let altertString = people
    .map(function (person) {
      return `${person.firstName} ${person.lastName}`;
    })
    .join("\n");
  return altertString;
}
// End of displayPeople()

function renderPersonRelationships(personRelationships) {
  let alertString = personRelationships
    .map(function (personRelationship) {
      return `${personRelationship.relationship}: ${personRelationship.firstName} ${personRelationship.lastName}`;
    })
    .join("\n");
  return alertString;
}

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person) {
  let personInfo = "";
  for (const key in person) {
    if (key === "currentSpouse" || key === "parents") {
      continue;
    } else {
      personInfo += `${key}: ${person[key]} \n`;
    }
  }
  //! TODO #1a: finish getting the rest of the information to display //////////////////////////////////////////
  return personInfo;
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid) {
  do {
    var response = prompt(question).trim();
  } while (!response || !valid(response));
  response = response.toLowerCase();
  response = response.charAt(0).toUpperCase() + response.slice(1);
  return response;
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
  return input.toLowerCase() === "y" || input.toLowerCase() === "n";
}
// End of yesNo()

/**
 * This helper function operates as a default callback for promptFor's validation.
 * Feel free to modify this to suit your needs.
 * @param {String} input        A string.
 * @returns {Boolean}           Default validation -- no logic yet.
 */
function chars(input) {
  if (!/^[a-zA-Z]+$/.test(input)) {
    alert("Response must contain only letters.");
    searchByName(data);
  }
  return true;
}
// End of chars()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line ????. Happy Coding! ????

/**
 * Find Family Function searches for Siblings, Spouse and parents
 * @param {Object}      person
 * @param {Array}      people
 * @returns {Object []}    personRelationsips
 */
function findPersonFamily(person, people) {
  let foundPerson = person;
  let currentSpouses = people.filter((p) => p.id === foundPerson.currentSpouse);
  let parents = people.filter(
    (p) => p.id === foundPerson.parents[0] || p.id === foundPerson.parents[1]
  );
  let siblings = people.filter(
    (p) =>
      p.id !== foundPerson.id &&
      p.parents.some((parentId) => foundPerson.parents.includes(parentId))
  );
  let personRelationships = [
    { relationship: "Current Spouse", people: currentSpouses },
    { relationship: "Parent", people: parents },
    { relationship: "Sibling", people: siblings },
  ].flatMap((pr) =>
    pr.people.map((p) => Object.assign({ relationship: pr.relationship }, p))
  );

  return personRelationships;
}

/**
 * Find Children Function:
 * @param {Object}      person
 * @param {Array}      people
 * @returns {Object []}    personChildren
 */

function findPersonDescendants(foundPerson, people) {
  const personChildren = people.filter((peopleItem) =>
    peopleItem.parents.includes(foundPerson.id)
  );
  const childDescendants = personChildren.flatMap((child) =>
    findPersonDescendants(child, people)
  );
  const personDescendents = personChildren.concat(childDescendants);
  return personDescendents;
}

function chooseSeachByTrait(traitsArray) {
  let alertString = "";
  let counter = 0;
  for (const trait of traitsArray) {
    alertString += `(${(counter += 1)}) ${trait}\n`;
  }
  return prompt(
    `Type a number to select the trait you want to search:\n${alertString}`
  );
}

function switchCaseQuery(queryArray) {
  let traits = [
    "id",
    "gender",
    "dob",
    "height",
    "weight",
    "eyeColor",
    "occupation",
    "restart",
  ];
  let userChosenTraitIndex = chooseSeachByTrait(traits);

  switch (userChosenTraitIndex) {
    //number format validation
    case "1": //id
    case "4": //height
    case "5": //weight
      addKeyValueToQuery(traits[userChosenTraitIndex - 1], queryArray);
      break;
    //date format validation
    case "3": //dob
      addKeyValueToQuery(traits[userChosenTraitIndex - 1], queryArray);
      break;
    //letter format validation
    case "2": // gender
    case "6": // eye color
    case "7": // occupation
      addKeyValueToQuery(traits[userChosenTraitIndex - 1], queryArray);
      break;
    case "8":
      app(people);
    default:
      switchCaseQuery();
  }
}

function addKeyValueToQuery(chosenTrait, queryArray) {
  let traitObj = { trait: chosenTrait, value: addValue(chosenTrait) };
  queryArray.push(traitObj);
}
function yesNoSwitchCase(input) {
  switch (input) {
    case "y":
      break;
    case "n":
      return input;
      break;
    default:
      yesNoSwitchCase(
        prompt(
          `Would you like to add another trait?\n Enter (y) for yes or (n) for no`
        ).trim()
      );
  }
}

function addValue(chosenTrait) {
  let userChosenValue = prompt(
    `What "${chosenTrait}" would you like to search for?`
  )
    .trim()
    .toLowerCase();
  return userChosenValue;
}
function checkReadyForQuery(queryArray) {
  let keepGoing = true;
  do {
    switchCaseQuery(queryArray);
    if (
      queryArray.length >= 5 ||
      yesNoSwitchCase(
        prompt(`Would you like to add another trait? \nEnter (y) for yes or (n) for no`)
      )
    ) {
      keepGoing = false;
    }
  } while (keepGoing);
  return queryArray;
}

function filterByQuery(people, queryArray) {
  let foundByQuery = people.filter((peopleItem) =>
    queryArray.every(
      (query) => query.value === peopleItem[query.trait].toString()
    )
  );
  return foundByQuery;
}

function searchByTraits(people) {
  let queryArray = [];
  queryArray = checkReadyForQuery(queryArray);
  let result = filterByQuery(people, queryArray);
  return result;
}


