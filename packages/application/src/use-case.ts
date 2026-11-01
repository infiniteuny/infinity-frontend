export abstract class UseCase<S, T extends unknown[] = []> {
  public abstract execute(...[param]: T): S;
}
