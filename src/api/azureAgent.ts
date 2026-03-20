export async function sendMessageToAgent(message: string): Promise<string> {
  try {
    // Requisição encaminhada para o NOSSO Backend Invisível (/api/chat) que esconde a chave da Azure.
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Erro de API do Backend: HTTP ${response.status}`);
    }

    const data = await response.json();

    // Extrator robusto para lidar com as diferentes camadas JSON do Azure
    const extrairTexto = (obj: any): string | null => {
      if (!obj) return null;
      if (obj.role === 'assistant' && Array.isArray(obj.content)) {
        for (const item of obj.content) {
          if (item.text) return item.text;
          if (item.output_text) return item.output_text;
        }
      }
      if (Array.isArray(obj)) {
        // Percorre de trás pra frente pra pegar a mensagem mais recente do assistant
        for (let i = obj.length - 1; i >= 0; i--) {
          const txt = extrairTexto(obj[i]);
          if (txt) return txt;
        }
      }
      if (obj.output && Array.isArray(obj.output)) return extrairTexto(obj.output);
      if (obj.data && Array.isArray(obj.data)) return extrairTexto(obj.data);
      if (obj.choices && Array.isArray(obj.choices) && obj.choices[0].message) return extrairTexto(obj.choices[0].message);
      if (obj.output_text) return obj.output_text;
      if (typeof obj.output === 'string') return obj.output;
      if (obj.text && typeof obj.text === 'string') return obj.text;
      if (obj.answer && typeof obj.answer === 'string') return obj.answer;
      return null;
    };

    const textoFinal = extrairTexto(data);
    if (textoFinal) return textoFinal;

    return JSON.stringify(data);
  } catch (err: any) {
    throw new Error(err.message || 'Falha de rede ao conectar com a Azure.');
  }
}
