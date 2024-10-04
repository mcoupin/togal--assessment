import { IsDefined } from "class-validator";
import { Folder } from "./Folder";
import { File } from "./File";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Document {
  @PrimaryGeneratedColumn({ name: "document_id" })
  id!: number;

  @Column({ name: "document_title" })
  @IsDefined()
  title!: string;

  @Column({ name: "document_description" })
  @IsDefined()
  description!: string;

  @ManyToOne(() => Folder, (folder) => folder.documents, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "fk_folder" })
  @IsDefined()
  folder!: Folder;

  @OneToMany(() => File, (file) => file.document, { cascade: true })
  files!: File[];
}
