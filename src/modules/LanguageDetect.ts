// @ts-ignore
import detectlang from "lang-detector";
export class LanguageDetect {
  detectLanguage(input: string | undefined): string | undefined {
    if (input) {
      const language: string = detectlang(input);
      if (language == "Unknown") {
        return "Natural";
      } else {
        return language;
      }
    }
  }
}
