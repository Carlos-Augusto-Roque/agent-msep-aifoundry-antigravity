import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  try {
    // 1. Tratamento de Word (.docx / .doc)
    if (extension === 'docx' || extension === 'doc') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || 'Arquivo de Word vazio.';
    }
    
    // 2. Tratamento de Arquivos de Texto Comum (.txt, .md, .csv, .json, .html)
    return await file.text();
  } catch (err) {
    console.error("Erro ao extrair arquivo:", err);
    throw new Error("Falha ao ler o conteúdo do arquivo. O arquivo pode estar criptografado ou corrompido.");
  }
}
