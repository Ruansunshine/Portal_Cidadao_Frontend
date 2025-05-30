# 🧠 Sistema de Acesso Inteligente – Front-End (Next.js)

Este é o front-end do projeto desenvolvido com **Next.js**. Ele é responsável por exibir informações dos serviços públicos e realizar a comunicação com a inteligência artificial simulada, localização e rotas de ônibus.

---

## ⚙️ Requisitos

Antes de iniciar o projeto, é necessário ter:

- **Node.js** instalado (recomenda-se a versão LTS)
- **npm** (Node Package Manager), que já vem com o Node

---

## 📦 Instalação

Para instalar as dependências, siga os passos abaixo:

```bash
npm install
```

---

## ▶️ Como executar o projeto

Após a instalação, execute o servidor de desenvolvimento com:

```bash
npm run dev
```

O projeto será iniciado e poderá ser acessado em:

```bash
http://localhost:(número da porta)
```

---

## 💡 Importante

- Este projeto depende de dados vindos da URL (parâmetros `token` e `user`) e armazena essas informações no `localStorage`.
- Para evitar erros de **hidratação no Next.js**, a renderização do nome do usuário foi ajustada com `useEffect` e estado local.
- Evite utilizar `Date`, `Math.random()` ou `window` diretamente na renderização inicial fora de `useEffect`.
- Verifiquem o repositório backend antes de investigar erros no frontend. Confiram as portas em que o servidor backend está rodando para testes.

---

## 📌 Pontos importantes

- **Link do repositório Backend**: (insira aqui o link do repositório)
- **Padrão de commit**: `Desafio 04: adicionado/corrigido/atualizado/apagado + tarefas`
- Criem suas **branchs** para organização do fluxo de trabalho
- Verifiquem se o front e o back estão rodando em portas diferentes. Ambos utilizam a porta 3000 por padrão, então ativem o backend primeiro para o front iniciar na 3001.
- Analisem o banco de dados. Se precisarem de um servidor local, utilizem o **XAMPP**, conforme mencionado no início do projeto.

---

## ❓ Suporte

Caso tenha dúvidas ou encontre algum problema ao rodar o projeto, sinta-se à vontade para abrir uma issue ou entrar em contato com a equipe.

---

Desafio Trilhas Inova 🚀#
