# Guia de Contribuição

## Como contribuir?

Se você é um **usuário externo** ao time de desenvolvimento do StreamUs e quer contribuir com a nossa proposta você deve fazer um **fork** do repositório e seguir os passos a frente. Para quem já faz parte do nosso time de desenvolvimento, basta seguir esses passos:

1. Criar sua [_issue_](#política-de-issues)
1. Criar uma [_branch_](#política-de-branchs)
1. Fazer seus [_commits_](#política-de-commits)
1. Abrir um [_Pull Request_](#política-de-pull-requests)

---

## Política de _Issues_

* As _issues_ devem possuir um nome simples que descreva com poucas palavras o seu propósito;
* A descrição da _issue_ deve relatar mais a funcionalidade ou _bug_ a ser solucionado. Não é obrigatório inserir uma descrição se o nome da _issue_ já consegue descrever bem o objetivo, mas nós recomendamos colocar sempre :)
* Lembre-se sempre de identificar a _issue_ com as _**labels**_ referentes. Isso ajuda o nosso trabalho na hora de mapear quais são as demandas de cada área do projeto.

### _Issues_ para novas funcionalidades

* Novas funcionalidades devem ser descritas como _user stories_
* Essas _issues_ devem ser acompanhadas de uma lista de critérios de aceitação que garantem que o ao implementar o objetivo será atendido, tanto em termos de funcionalidade, usabilidade, design e qualidade de código;
* No nosso repositório nós já disponibilizamos um [templete básico](https://github.com/fga-eps-mds/2019.1-StreamUs-Backend/blob/master/.github/ISSUE_TEMPLATE/abertura-de-nova-issue.md) para essas _issues_, com alguns critérios comuns a maioria das funcionalidades.
* Para melhor identificar essas _issues_ o nome deve seguir o seguinte padrão:

    > US - Nome da Issue
    > TS - Nome da Issue

---

## Política de _Branchs_

#### Branch _master_

A _branch master_ é a _branch_ estável do projeto, onde estará o código de produção. _Commits_ e _pushes_ para essa _branch_ estarão bloqueados.


### Nomenclatura das _branchs_

Os nomes das _branchs_ devem ser objetivos e claros, especificando em poucas palavras a intenção da _branch_. Além do mais, devem referenciar a _issue_ relacionada no início do nome, conforme o seguinte padrão:

> `x-branch-name`

Onde x refere-se ao número da _issue_.


## Política de _Commits_

### Mensagem do _Commit_
A descrição dos _commits_ deve estar em **inglês** e ser sucinta e objetiva, representando claramente o que está sendo alterado naquele _commit_. A mensagem deve estar acompanhada do número da _issue_ relacionada, como no exemplo abaixo:

> `git commit -m'#X my message'`

Onde X representa o número da _issue_ relacionada.

### _Commits_ com pareamento

Quando houver pareamento o _commit_ deve vir acompanhado da mensagem: `Co-authored-by: CoAuthorName <coauthoremail@mail.com>`. Para tal deve-se seguir os seguintes passos:

1. `git commit -s`
1. Inserir a descrição do _commit_ na primeira linha
1. Na linha seguinte inserir a mensagem `Co-authored-by: CoAuthorName <coauthoremail@mail.com>`, com os respectivos dados do co-autor.


### _Pull Requests_ em progresso

_Pull Requests_ que ainda não estão prontos para serem aceitos devem conter a sinalização _WIP - Work in Progress_ logo no início do nome. Exemplo:

> `WIP: my pull request`

### Condições para aprovação do _Pull Request_

Para que o _pull request_ seja aceito nas _branchs_ oficiais ele deve atender os seguintes pontos:

* Funcionalidade, correção ou refatoração completa;
* _Build_ de integração contínua passando;
* Manter a cobertura do código acima de 90%;
* Estar de acordo com as métricas de qualidade de código descritas no plano de qualidade.

