var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice','Alice','Bob','Johnny'];

var countedNames = names.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;
  }
  else {
    allNames[name] = 1;
  }
  console.log(allNames);
  return allNames;
}, {});

// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
