export function initPlayer() {
    // 1. Seleciona o botão de salvar
    const btnSalvar = document.getElementById('id-do-seu-botao-salvar');

    // Verifica se o botão existe na tela para não dar erro
    if (btnSalvar) {
        btnSalvar.addEventListener('click', (e) => {
            // ISSO AQUI RESOLVE O SEU PROBLEMA: Impede a página de recarregar!
            e.preventDefault(); 

            // 2. Captura os links do Drive e os textos digitados
            const linkAudio = document.getElementById('id-do-input-audio-drive').value;
            const linkCapa = document.getElementById('link-capa-drive').value;
            const titulo = document.getElementById('id-do-input-titulo').value;
            const artista = document.getElementById('id-do-input-artista').value;

            // Verificação de segurança: não deixa salvar vazio
            if (!linkAudio || !titulo) {
                alert("Por favor, preencha pelo menos o link da música e o Título!");
                return;
            }

            // 3. Área de salvamento no Banco de Dados
            try {
                console.log("Dados capturados com sucesso:", { titulo, artista, linkAudio, linkCapa });
                
                // === ATENÇÃO AQUI ===
                // O botão já está funcionando e não recarrega mais a página.
                // Agora, cole aqui o seu código do Firebase ou Supabase para 
                // enviar essas informações (titulo, artista, etc) para o seu banco de dados!
                
                
                // Limpa os campos depois de salvar para o usuário colocar outra música
                document.getElementById('id-do-input-audio-drive').value = '';
                document.getElementById('link-capa-drive').value = '';
                document.getElementById('id-do-input-titulo').value = '';
                document.getElementById('id-do-input-artista').value = '';
                
                alert("Música enviada com sucesso!");

            } catch (error) {
                console.error("Erro ao salvar:", error);
                alert("Deu um erro ao salvar. Verifique o console (F12).");
            }
        });
    }
}
