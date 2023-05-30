import * as fs from "fs";
import { faker } from "@faker-js/faker";

const usersAmount = 10;
const postsPerUser = 3;
const commentsPerPost = 15;

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const generate = () => {
  const users = Array(usersAmount)
    .fill(0)
    .map((_: any, id: number) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      return {
        id: id + 1,
        name: faker.helpers.unique(faker.internet.userName, [
          firstName,
          lastName,
        ]),
        email: faker.helpers.unique(faker.internet.email, [
          firstName,
          lastName,
        ]),
      };
    });

  let postCounter = 1;
  const posts = users
    .map((user: any) => {
      return Array(postsPerUser)
        .fill(0)
        .map(() => ({
          id: postCounter++,
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          authorID: user.id,
        }));
    })
    .flat();

  let commentCounter = 1;
  const comments = posts
    .map((post: any) => {
      return Array(commentsPerPost)
        .fill(0)
        .map(() => ({
          id: commentCounter++,
          content: `RE: ${post.title}: ${faker.hacker.phrase()}`,
          postID: post.id,
          authorID: randomIntFromInterval(1, usersAmount),
        }));
    })
    .flat();

  return {
    Users: users,
    Posts: posts,
    Comments: comments,
  };
};

fs.writeFile(
  __dirname + "/seed/context.json",
  JSON.stringify(generate()),
  (err) => {
    if (err) {
      console.error(err);
    }
  }
);

console.log("Mocks generated and put into ./seed/context.json");
