export class TeamMember {
  public readonly priority: number;
  public readonly name: string;
  public readonly major: string;
  public readonly year: number;
  public readonly cabinet: number;
  public readonly division: string;
  public readonly photo: string;
  public readonly socialMedia?: {
    instagram?: string;
    github?: string;
  };

  public constructor(
    priority: number,
    name: string,
    major: string,
    year: number,
    cabinet: number,
    division: string,
    photo: string,
    socialMedia?: {
      github?: string;
      instagram?: string;
    },
  ) {
    this.priority = priority;
    this.name = name;
    this.major = major;
    this.year = year;
    this.cabinet = cabinet;
    this.division = division;
    this.photo = photo;
    this.socialMedia = socialMedia;
  }
}
