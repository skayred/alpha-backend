import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Post } from "./Post";
import { Comment } from "./Comment";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: "name", nullable: true })
  public name: string;

  @Column({ name: "email" })
  public email: string;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

  @OneToMany(() => Comment, (comment: Comment) => comment.author)
  public comments: Comment[];
}
