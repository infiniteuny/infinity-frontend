import { Persona } from './persona';

export class UserPersona extends Persona {
  public membership: {
    id: string;
    userId: string;
    personaId: string;
    createdAt: Date;
    updatedAt: Date;
  };

  public constructor(
    id: string,
    name: string,
    priority: number,
    description: string,
    logo: string,
    createdAt: Date,
    updatedAt: Date,
    membership: {
      id: string;
      userId: string;
      personaId: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    super(id, name, priority, description, logo, createdAt, updatedAt);
    this.membership = membership;
  }
}
