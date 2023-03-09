import { DB } from "./mockdb";

export const db = new DB();
db.prompt.insert({
  id: '',
  text: `Answer todays quiz`,
  questions: [
    {
      text: 'How are you feeling (1-5)',
      type: 'scale',
      choices: ['1', '2', '3', '4', '5']
    },
    {
      text: 'What have you been doing recently',
      type: 'free-text'
    },
    {
      text: 'Which of the following describes you best',
      type: 'multiple-choice',
      choices: [`I have diverse set of friends`, `Most of my friends are Chinese`, `I don't have many friends in the UK`]
    }
  ]
});
