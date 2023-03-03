import { Configuration, OpenAIApi } from "openai";

export class OpenAiChat{
  private configuration: Configuration;
  private openai: OpenAIApi;

  constructor() {
    this.configuration = new Configuration({
      apiKey: `${process.env.OPENAI_API_KEY}`,
    });
    this.openai = new OpenAIApi(this.configuration);
  }
  async getCompletion(prompt: string) {
    // This code is making an API call to the OpenAI API to create a completion using the given parameters.
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", "content": `${prompt}` }],
    });

    return response.data.choices[0].message;
  }
}
