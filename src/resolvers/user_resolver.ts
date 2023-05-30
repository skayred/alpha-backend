import { Repository } from "typeorm";

import { User } from "../entity/User";
import { Post } from "../entity/Post";

const MAX_LIMIT = 5;

export const resolvers = (postRepo: Repository<Post>) => ({
  User: {
    posts: async (user: User, args: any) => {
      const { cursor, limit } = args;

      let query = postRepo.createQueryBuilder("posts").where("author_id = :authorID", { authorID: user.id }).limit(Math.min(limit, MAX_LIMIT));

      if (!!cursor) {
        query = query.andWhere("id > :id", { id: cursor });
      }

      return query.getMany();
    },
  },
});
