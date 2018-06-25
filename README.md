# Freud

Aplicação que busca informações de Issues e Pull Requests de um repositório Github.

### Instalando

Para instalar o freud é necessário clonar ou baixar este repositório.

Instalar as dependências no repositório baixado:

```
npm install
```

Rodar a aplicação:

```
npm start
```

A aplicação vai iniciar em localhost:3000

## Atenção

A API do GitHub V3 permite apenas 60 requisições por hora para um mesmo IP.

## Feito com

* [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
* [Bootstrap](https://getbootstrap.com/) - An open source toolkit for developing with HTML, CSS, and JS.
* [MDBootstrap](https://mdbootstrap.com/) - Material Design for Bootstrap 4.

### Informações adicionais

Existe uma branch chamada 'all-search-version' que permite a pesquisa de todo os itens do repositório, porém o tempo de pesquisa é demasiadamente lento.

### Itens para o futuro

    - Migrar para GitHub API V4;
    - Permitir o usuário informar um período de datas;
    - Incluir testes;