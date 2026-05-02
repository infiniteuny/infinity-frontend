import { Persona, PersonaFilterOptions, PersonaSortOptions } from './persona';

export type UserPersonaFilterOptions = PersonaFilterOptions;

export type UserPersonaSortOptions = PersonaSortOptions;

export class UserPersona extends Persona {
  public entitlement: {
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
    logo: string | File,
    createdAt: Date,
    updatedAt: Date,
    entitlement: {
      id: string;
      userId: string;
      personaId: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    super(id, name, priority, description, logo, createdAt, updatedAt);
    this.entitlement = entitlement;
  }
}
