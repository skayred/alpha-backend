import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: "title" })
  public title: string;

  @Column("text", { name: "content", nullable: true })
  public content: string;

  @Column({ name: "author_id" })
  public authorID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "author_id" })
  public author: User;

  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  public comments: Comment[];
}
