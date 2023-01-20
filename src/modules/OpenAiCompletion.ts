import { Configuration, OpenAIApi } from "openai";

export class OpenAICompletion {
  private configuration: Configuration;
  private openai: OpenAIApi;

  constructor() {
    this.configuration = new Configuration({
      apiKey: `${process.env.OPENAI_API_KEY}`,
    });
    this.openai = new OpenAIApi(this.configuration);
  }
  async getCompletion(prompt: string) {
    const response = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.3,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.data.choices[0];
  }
}
