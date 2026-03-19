// @ts-nocheck
// Backend Invisível na Vercel (Roda no ambiente Node.js, escondido dos usuários)
// Esta função processa as requisições que chegam de /api/chat do nosso React

const AGENT_ENDPOINT = 'https://carlo-mmw3h4cd-eastus2.services.ai.azure.com/api/projects/carlo-mmw3h4cd-eastus2_project/applications/EspecialistaMSEP/protocols/openai/responses?api-version=2025-11-15-preview';

export default async function handler(req, res) {
  // Apenas aceitamos chamadas POST do nosso front-end
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // A chave será lida do Cofre Secreto (Environment Variables) da máquina remota na Vercel
  // Nunca mais será lida localmente no navegador!
  let apiKey = process.env.VITE_AZURE_TOKEN || process.env.AZURE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: `🚨 Vercel Debugger: Chave não encontrada. As variáveis detectadas no servidor agora são: ${Object.keys(process.env).filter(k => k.includes('AZURE') || k.includes('VITE')).join(', ') || 'Nenhuma detectada'}` });
  }

  // Limpeza vitalícia: Evita que "copiar e colar" com espaços ou quebras de linha no terminal sejam enviados para a nuvem injetando o erro 401
  apiKey = apiKey.trim().replace(/['"]/g, "");

  try {
    // O SERVIDOR (Seguro) agora é quem fala com a Azure!
    const response = await fetch(AGENT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        input: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `🚨 DEBUG VERCEL (TamanhoDaChave: ${apiKey.length}, PrimeirasLetras: ${apiKey.substring(0,4)}) | Erro na Azure: ${errorText}` });
    }

    // Retorna a lista / resposta da Azure crua de volta ao nosso Front-end React
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
