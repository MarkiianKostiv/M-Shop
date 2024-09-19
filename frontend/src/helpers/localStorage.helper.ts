export class LocalStorageHelper {
  private stringifyValue(value: string): string {
    return JSON.stringify(value);
  }

  private parseValue(value: string): string {
    if (value === null) {
      console.error("Item value is null");
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error("Error parsing value from localStorage", e);
      return value;
    }
  }

  public addItem(name: string, value: string) {
    const stringifiedValue = this.stringifyValue(value);
    localStorage.setItem(name, stringifiedValue);
  }

  public removeItem(name: string) {
    localStorage.removeItem(name);
  }

  public updateItem(name: string, value: string) {
    const stringifiedValue = this.stringifyValue(value);
    localStorage.setItem(name, stringifiedValue);
  }

  public getItem(name: string) {
    const value = localStorage.getItem(name);
    if (value) {
      return this.parseValue(value);
    } else {
      console.error(`item ${name} not found`);
    }
  }
}
