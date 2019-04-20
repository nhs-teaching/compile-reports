const { promisify } = require('util');
const fs = require('fs');
const parse = promisify(require('csv-parse'));

async function fetchRoster(path) {
  let file = fs.readFileSync(path).toString();

  return await parse(file, {
    columns: true  
  });
}

function getStudent(github, roster) {
  let user = roster.find((element) => {
    return element['Github'] === github; 
  });

  return user;
}

module.exports = {
  getStudent,
  fetchRoster
};

