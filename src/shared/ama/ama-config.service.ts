import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { parseKey } from "./helpers/env";

@Injectable()
export class AMAConfigService {
  constructor(private readonly config: ConfigService) {}

  get<T = string>(key: string, defaultValue?: any): T {
    const value = this.config.get(key, defaultValue);

    if (!value) {
      return defaultValue;
    }

    return parseKey(value, key) as unknown as T;
  }
}
