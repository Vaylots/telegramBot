/**
 * @description Method for removing a slash command from message
 * @param message string message from context
 * @return string without slash command
 */
export function splitMessage(message: string): string {
   let array = message.split(" ")
   array.splice(0, 1)
  return array.join(" ");
}
