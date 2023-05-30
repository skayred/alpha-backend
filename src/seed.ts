import { AppDataSource } from "./data-source";

import { Post } from "./entity/Post";
import { User } from "./entity/User";
import { Comment } from "./entity/Comment";

import * as seed from "./seed/context.json";

const runSeeding = async () => {
  await AppDataSource.initialize();

  const users = await AppDataSource.getRepository(User).find();

  if (users.length == 0) {
    await AppDataSource.transaction(async (transactionalEntityManager: any) => {
      seed["Users"].forEach((user: any) => {
        const candidate = new User();
        transactionalEntityManager.save(Object.assign(candidate, user));
      });

      seed["Posts"].forEach((post: any) => {
        const candidate = new Post();
        transactionalEntityManager.save(Object.assign(candidate, post));
      });

      seed["Comments"].forEach((comment: any) => {
        const candidate = new Comment();
        transactionalEntityManager.save(Object.assign(candidate, comment));
      });
    });
  } else {
    console.log("DATABASE IS ALREADY INITIALISED, SKIPPING...");
  }
};

runSeeding();
