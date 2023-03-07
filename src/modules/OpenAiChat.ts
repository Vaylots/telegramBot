//@ts-nocheck
import { Configuration, OpenAIApi } from "openai";
interface IError {
  response: {
    status: number;
    statusText: string;
  };
}
export class OpenAiChat {
  private configuration: Configuration;
  private openai: OpenAIApi;

  constructor() {
    this.configuration = new Configuration({
      apiKey: `${process.env.OPENAI_API_KEY}`,
    });
    this.openai = new OpenAIApi(this.configuration);
  }
  async getCompletion(prompt: string) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `${prompt}` }],
      });

      const status = response.status;
      const responseMessage = response.data.choices[0].message?.content;
      return [status, responseMessage];
    } catch (error)  {
      if(error.response.status){
        const status = error.response.status;
        const responseMessage:string = "";
        return [status, responseMessage];
      }
      else{
        return [0,""]
      }
      
    }
  }
}
