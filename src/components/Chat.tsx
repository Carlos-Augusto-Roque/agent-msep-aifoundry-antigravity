import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';
import { sendMessageToAgent } from '../api/azureAgent';
import { extractTextFromFile } from '../utils/fileExtractor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'agent',
            content: 'Olá! Sou o Especialista MSEP, seu agente de IA. Como posso ajudar você?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [attachedFile, setAttachedFile] = useState<{ name: string, content: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleClearChat = () => {
        setMessages([
            {
                id: 'welcome',
                role: 'agent',
                content: 'Olá! Sou o Especialista MSEP, seu agente de IA. Como posso ajudar você?'
            }
        ]);
        setShowConfirmClear(false);
        setAttachedFile(null);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('O arquivo é muito grande (Máximo de 2MB permitidos para Word e Textos).');
            return;
        }

        try {
            setIsLoading(true);
            const text = await extractTextFromFile(file);
            setAttachedFile({ name: file.name, content: text });
        } catch (err: any) {
            alert(err.message || 'Erro ao processar o arquivo.');
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((!input.trim() && !attachedFile) || isLoading) return;

        const userText = input.trim();
        let compositeMessage = userText;
        let displayContent = userText;

        if (attachedFile) {
            compositeMessage += `\n\n[INÍCIO DO DOCUMENTO ANEXADO PELO USUÁRIO: ${attachedFile.name}]\n${attachedFile.content}\n[FIM DO DOCUMENTO ANEXADO]`;
            displayContent += displayContent ? `\n\n📎 *Arquivo lido localmente: ${attachedFile.name}*` : `📎 *Arquivo lido localmente: ${attachedFile.name}*`;
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: displayContent
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setAttachedFile(null);
        setIsLoading(true);

        try {
            const responseText = await sendMessageToAgent(compositeMessage);

            const agentMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: responseText
            };

            setMessages(prev => [...prev, agentMessage]);
        } catch (error: any) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'agent',
                content: `⛔ Falha na conexão: ${error.message}`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <div className="chat-container glass-panel" style={{ margin: '0' }}>
                <div className="chat-header">
                    <div className="agent-avatar">
                        <div className="avatar-glow"></div>
                        🤖
                    </div>
                    <div className="agent-info" style={{ flex: 1 }}>
                        <h2>Agente Especialista na MSEP</h2>
                        <span className="status-indicator">
                            <span className="dot"></span> Online - v1
                        </span>
                    </div>
                    <button
                        onClick={() => setShowConfirmClear(true)}
                        className="clear-chat-btn"
                        title="Limpar Conversa"
                        aria-label="Limpar Conversa"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>

                {showConfirmClear && (
                    <div className="confirm-overlay">
                        <div className="confirm-modal glass-panel">
                            <h3>🗑️ Limpar Conversa</h3>
                            <p>Tem certeza que deseja apagar todo o histórico desta conversa no seu navegador? Essa ação não pode ser desfeita.</p>
                            <div className="confirm-actions">
                                <button className="cancel-btn" onClick={() => setShowConfirmClear(false)}>Cancelar</button>
                                <button className="confirm-clean-btn" onClick={handleClearChat}>Sim, apagar</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-wrapper ${msg.role}`}>
                            <div className="message-bubble">
                                {msg.role === 'agent' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-wrapper agent">
                            <div className="message-bubble typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" style={{ flexDirection: 'column', gap: '8px', padding: '1rem 1.5rem' }} onSubmit={handleSend}>
                    <div style={{ padding: '0 4px', marginBottom: '-4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Anexos permitidos: <strong>.docx, .txt, .csv, .md</strong> (Máx. 2MB)
                        </span>
                    </div>
                    {attachedFile && (
                        <div className="attached-file-chip">
                            <span>📄 {attachedFile.name}</span>
                            <button type="button" onClick={() => setAttachedFile(null)}>×</button>
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }}>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".txt,.csv,.md,.html,.docx,.doc"
                            style={{ display: 'none' }}
                        />
                        <button 
                            type="button" 
                            className="attach-btn" 
                            onClick={() => fileInputRef.current?.click()}
                            title="Anexar arquivos de Word ou Textos"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={attachedFile ? "Faça sua pergunta sobre o arquivo (ou envie vazio)..." : "Digite sua mensagem ao especialista..."}
                            disabled={isLoading}
                            style={{ flex: 1 }}
                        />
                        <button type="submit" disabled={(!input.trim() && !attachedFile) || isLoading} className="send-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
