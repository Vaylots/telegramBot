import { Configuration, OpenAIApi } from "openai";

export class OpenAICompletion {
  private configuration: Configuration;
  private openai: OpenAIApi;

  constructor() {
    // Initializing the Configuration object with the API key from the environment variable OPENAI_API_KEY.
    this.configuration = new Configuration({
      apiKey: `${process.env.OPENAI_API_KEY}`,
    });
    // Initializes a new OpenAIApi instance with the given configuration
    this.openai = new OpenAIApi(this.configuration);
  }
  //This function uses the OpenAI API to generate a completion for the given prompt, with parameters and return the choices from OpenAI response.
  async getCompletion(prompt: string) {
    // This code is making an API call to the OpenAI API to create a completion using the given parameters.
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
