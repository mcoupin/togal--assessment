import { IsDefined } from "class-validator";
import { Document } from "./Document";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class File {
  @PrimaryGeneratedColumn({ name: "file_id" })
  id!: number;

  @Column({ name: "file_name" })
  @IsDefined()
  name!: string;

  @Column({ name: "updload_date", type: "timestamptz" })
  @IsDefined()
  uploadDate!: Date;

  @Column({ name: "s3_key" })
  @IsDefined()
  s3Key!: string;

  @Column({ name: "file_type" })
  @IsDefined()
  type!: string;

  @ManyToOne(() => Document, (document) => document.files, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "fk_document" })
  @IsDefined()
  document!: Document;
}
