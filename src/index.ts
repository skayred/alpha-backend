import "reflect-metadata";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";

import { schema } from "./schema";
import { resolvers } from "./resolvers/resolvers";
import { AppDataSource } from "./data-source";

import { UserLoader } from "./dataloaders/user-loader";
import { PostLoader } from "./dataloaders/post-loader";

import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { Comment } from "./entity/Comment";

const startServer = async () => {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const postRepo = AppDataSource.getRepository(Post);
  const commentRepo = AppDataSource.getRepository(Comment);

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers(userRepo, postRepo, commentRepo),
    context: async () => {
      return {
        dataSources: {
          users: new UserLoader(userRepo),
          posts: new PostLoader(postRepo),
        },
      };
    },
  });

  const app = express();

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
