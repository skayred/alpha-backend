import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column("text", { name: "content", nullable: true })
  public content: string;

  @Column({ name: "author_id" })
  public authorID: number;

  @Column({ name: "post_id" })
  public postID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "author_id" })
  public author: User;

  @ManyToOne(() => Post)
  @JoinColumn({ name: "post_id" })
  public post: Post;
}
