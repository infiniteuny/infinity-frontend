import { Degree } from './degree';
import { Faculty } from './faculty';

export class Major {
  public id: string;
  public degreeId: string;
  public facultyId: string;
  public code: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  public degree?: Degree;
  public faculty?: Faculty;

  public constructor(
    id: string,
    degreeId: string,
    facultyId: string,
    code: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    degree: Degree | undefined,
    faculty: Faculty | undefined,
  ) {
    this.id = id;
    this.degreeId = degreeId;
    this.facultyId = facultyId;
    this.code = code;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.degree = degree;
    this.faculty = faculty;
  }
}
