//input output readline

import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function input(question: string, trim = true): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(trim ? answer.trim() : answer));
  });
}

export function closeIO(): void {
  rl.close();
}

export async function esperarEnter(): Promise<void> {
  await input("\n(Enter para continuar) ");
}
