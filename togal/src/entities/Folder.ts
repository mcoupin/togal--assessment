import { IsDefined, IsNumber, IsNumberString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "./Document";

@Entity()
export class Folder {
  @PrimaryGeneratedColumn({ name: "folder_id" })
  id!: number;

  @Column({ name: "folder_name" })
  @IsDefined()
  name!: string;

  @OneToMany(() => Document, (document) => document.folder)
  documents!: Document[];
}
