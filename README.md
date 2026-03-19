# 🤖 Especialista MSEP - AI Foundry & React

Este repositório contém o código-fonte completo da **Plataforma Web Especialista MSEP**, uma aplicação web moderna que atua como consultora pedagógica interativa para a Metodologia SENAI de Educação Profissional. A plataforma é impulsionada pela nuvem **Microsoft Azure AI Foundry** e desenhada com uma arquitetura Serverless hiper escalável na **Vercel**.

---

## ✨ Principais Funcionalidades (Versão 1.0)

- **Chatbot Inteligente**: Conexões de altíssima velocidade interligadas ao Agente Especialista hospedado no ecossistema da Microsoft Azure.
- **Extrator Oculto de Anexos (Local)**: Leitura ponta a ponta no lado do cliente (Navegador) de arquivos `.docx` (Word), `.txt`, `.csv` e `.md` (embutidos através do pacote inteligente `Mammoth`), permitindo a análise instantânea de planos de aula.
- **UI Premium Design (Glassmorphism)**: Efeito de vidro opaco nativo e ultra sofisticado, responsivo para Dispositivos Móveis e Tablets sem "esmagar" botões graças aos bloqueios Flex-Shrink.
- **Background Integrado**: Experiência visual dinâmica exclusiva para computadores com um Papel de Parede Abstract Mesh 4K na identidade visual do aplicativo.
- **Renderização Impecável (Markdown)**: Motor `react-markdown` importado diretamente do padrão mental do mercado de IA para exibição de Tabelas rigorosas, Trechos de Código Hacker `(pre)` e listas metodológicas.

---

## 🏗️ Arquitetura e Segurança de Nível Bancário

A maior vantagem desta plataforma em relação a web-apps amadores é o uso de **Serverless Functions** atuando como "Firewall". 
Se o aplicativo fizesse requisições no Frontend, a chave do Azure (AZURE_API_KEY) vazaria na aba "Inspeção de Código F12" dos alunos. 
Nesse design:
1. Seu código React (Front) pede socorro pra própria **Vercel**.
2. A **Vercel** acorda um roteador Invisível de Nuvem, abre a tampa da aba Environment Variables, injeta o Autenticador Secreto, higieniza o `Authorization: Bearer` da requisição e faz o arremate oficial pra API da Azure. Em seguida envia para o usuário sem que o mundo exterior da Web veja credenciais vazadas.

### 🔌 Stack Utilizada
- **Linguagens**: TypeScript / TSX
- **Biblioteca Front-End**: React.js com Vite
- **Extrator de Documentos**: `mammoth` (Microsoft Word/Docx Reader)
- **Renderizador de Textos Ricos**: `react-markdown` + `remark-gfm`
- **Hospedagem & Backend API**: Vercel

---

## 🚀 Como Rodar e Testar Localmente (Modo Desenvolvedor)

1. Clone o repositório em sua máquina:
```bash
git clone https://github.com/Carlos-Augusto-Roque/agent-msep-aifoundry-antigravity.git
```
2. Instale todas as engrenagens e módulos de dependência:
```bash
npm install
```
3. Crie um arquivo com o nome exato de `.env` (com o ponto na frente) protegido da internet para abrigar sua Chave Mestra da Azure:
```env
# URL da sua implementação de Inferência na rede Americana EastUS
VITE_AZURE_API_URL=SUA_URL_AZURE
# Chave sigilosa guardada nas chaves Mestras do Foundry
AZURE_API_KEY=SUA_CHAVE_AQUI
```
4. Em sua última etapa ligue o motor do Servidor React Local:
```bash
npm run dev
```

> **Aviso de Segurança**: O arquivo `.env` NUNCA é upado de volta para o GitHub graças à restrição rigorosa que injetamos manualmente no arquivo `.gitignore`.

---

**Desenvolvido magistralmente por Carlos Roque (Equipe SENAI / MSEP) com o poder somado da Inteligência Antigravity e Foundry Agents.**
