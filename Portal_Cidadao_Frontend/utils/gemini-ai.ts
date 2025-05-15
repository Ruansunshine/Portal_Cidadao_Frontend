import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// A chave da API deve ser passada como string no construtor
// Não é um objeto GoogleGenAIOptions como o erro sugere
const genAI = new GoogleGenerativeAI('AIzaSyDAkj-4eA4s3iWf4hoOcLXN7bpYh2545BA');

// O método correto é getGenerativeModel (sem 's')
export const geminiProModel: GenerativeModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Função de exemplo para gerar conteúdo
export async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await geminiProModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error);
    throw error;
  }
}

// Função de exemplo para chat
export async function startChat() {
  const chat = geminiProModel.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
  
  return chat;
}