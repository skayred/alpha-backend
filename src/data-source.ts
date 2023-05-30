import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { Comment } from "./entity/Comment";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DBHOST,
  port: parseInt(process.env.DBPORT || "5432"),
  username: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  synchronize: true,
  logging: true,
  entities: [User, Post, Comment],
  migrations: [__dirname + '/migrations/*.ts'],
  subscribers: [],
});
