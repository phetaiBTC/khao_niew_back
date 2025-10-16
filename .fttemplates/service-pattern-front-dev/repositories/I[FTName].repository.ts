export interface <FTName>Repository {
  findById(id: string): Promise<<FTName> | null>;
}