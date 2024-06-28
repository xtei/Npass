# NPASS - Gerador de Senhas Seguras

## Descrição
NPASS é uma aplicação web simples para geração e armazenamento seguro de senhas.

## Funcionalidades

### Geração de Senhas
- Gera senhas seguras com opções personalizáveis de comprimento e caracteres especiais.

### Armazenamento Local Criptografado
- Armazena as senhas localmente no navegador do usuário de forma criptografada.
- Utiliza algoritmos AES-GCM para garantir a segurança das informações armazenadas.

### Listagem e Gerenciamento de Senhas
- Permite ao usuário visualizar, copiar e exportar suas senhas armazenadas.
- Classifica automaticamente a força das senhas (Forte, Média, Fraca) com base em critérios como comprimento e uso de caracteres especiais.

### Exportação de Senhas
- Exporta senhas selecionadas para um arquivo TXT para fácil backup e transferência.

### Integração de Sidebar e Cookies
- Sidebar interativa para alternar entre seções principais da aplicação.
- Solicitação de consentimento do usuário para utilização de cookies através de um dialog personalizado.

## Instruções de Uso
1. **Geração de Senhas:** Configure o comprimento e opções desejadas para gerar uma nova senha.
2. **Armazenamento de Senhas:** Salve suas senhas com segurança no navegador.
3. **Listagem de Senhas:** Visualize, copie ou exporte suas senhas armazenadas.
4. **Configurações Avançadas:** Personalize suas preferências de geração de senha.

## Instalação e Execução Local
1. Clone este repositório: `git clone https://github.com/xtei/Npass.git`
2. Abra `index.html` no seu navegador web.

## Tecnologias Utilizadas
- HTML, CSS, JavaScript
- Crypto API para criptografia de senhas
- Bootstrap para estilos e componentes

## Autor
CarlosEdev - (https://github.com/xtei)

## Licença
Sem Licença
