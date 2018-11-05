const { dumpToFile } = require('./helpers.js');
const Enquirer = require('enquirer');

const enq = new Enquirer();
enq.register('confirm', require('prompt-confirm'));

enq.question({
  type: 'confirm',
  name: 'add_category',
  message: 'Would you like to add another category?'
});
enq.question('category', 'What is this category title?');
enq.question('points', 'How many points is it out of?');
enq.question('four', 'Describe what meets a 4');
enq.question('three', 'Describe what meets a 3');
enq.question('two', 'Describe what meets a 2');
enq.question('one', 'Describe what meets a 1');

enq.question({
  type: 'confirm',
  name: 'add_learning_target',
  message: 'Would you like to add a learning target?'
});
enq.question('learning_target_num', 'What number is the learning target?');
enq.question('learning_target', 'Describe the learning target');


(async function main(args) {
  let add_learning_target = false;
  let add_category = true;

  let categories = [];
  let learning_targets = [];

  let jsonString = "";

  while(add_category) {
    let answers = await enq.ask([
      'category',
      'points',
      'four',
      'three',
      'two',
      'one'
    ]);

    categories.push({
      name: answers.category,
      points: answers.points,
      levels: [
        answers.one,
        answers.two,
        answers.three,
        answers.four
      ]
    });

    add_category = (await enq.ask('add_category')).add_category;
  }

  add_learning_target = (await enq.ask('add_learning_target')).add_learning_target;

  while(add_learning_target) {
    let answers = await enq.ask([
      'learning_target',
      'learning_target_num'
    ]);

    learning_targets.push({
      name: answers.learning_target,
      number: answers.learning_target_num
    });

    add_learning_target = (await enq.ask('add_learning_target')).add_learning_target;
  }

  jsonString = JSON.stringify({
    learning_targets,
    categories
  }, null, 2);

  await dumpToFile(args[0] || 'rubric.json', jsonString);
  process.stdout.write('Done writing to file...');
})(process.argv.slice(2))

