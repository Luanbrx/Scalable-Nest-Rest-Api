
export abstract class  HashingServiceProtocol {
  abstract hash(password: string): Promise<string>;

  abstract compare(password: string, passwordhash: string): Promise<boolean>;
  
}