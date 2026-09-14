# Casamento Isabelle & Guilherme

Site estático single page para o casamento de **Isabelle & Guilherme**, feito com **HTML5**, **CSS3** e **JavaScript Vanilla**, pronto para abrir diretamente no navegador ou publicar no **GitHub Pages**.

## Estrutura

```text
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   └── icons/
└── README.md
```

## Como abrir localmente

Como o projeto é totalmente estático, você pode:

1. abrir o arquivo `/index.html` diretamente no navegador; ou
2. iniciar um servidor local simples, se preferir.

Exemplo com Python:

```bash
python -m http.server
```

Depois, abra `http://localhost:8000`.

## Onde alterar as principais informações

### Data, horário e arquivo de calendário

Edite o arquivo `/js/script.js`, no objeto `weddingConfig`:

```javascript
const weddingConfig = {
    date: '2027-08-14T16:00:00-03:00',
    endDate: '2027-08-14T23:59:00-03:00',
    // ...
};
```

- `date`: data e horário usados na contagem regressiva e no calendário;
- `endDate`: horário final do evento para o arquivo `.ics`.

### Links principais

Também em `/js/script.js`, altere:

```javascript
mapsUrl: '#',
receptionMapsUrl: '#',
rsvpUrl: '#',
giftsUrl: '#',
```

Sugestões de uso:

- `mapsUrl`: link do Google Maps da cerimônia;
- `receptionMapsUrl`: link da recepção;
- `rsvpUrl`: Google Forms, WhatsApp ou outro formulário;
- `giftsUrl`: lista de presentes.

### Textos e informações visíveis do evento

Edite diretamente o arquivo `/index.html` para alterar:

- mensagem dos noivos;
- nome do local;
- cidade;
- horário exibido na cerimônia;
- endereço completo;
- texto da recepção;
- dress code;
- textos das demais seções.

## Onde colocar as fotos

Adicione imagens na pasta:

```text
/assets/images/
```

Para definir uma foto principal no hero:

1. coloque o arquivo, por exemplo, em `/assets/images/hero-image.webp`;
2. atualize `heroBackgroundUrl` em `/js/script.js`:

```javascript
heroBackgroundUrl: 'assets/images/hero-image.webp',
```

A imagem de compartilhamento para WhatsApp/Open Graph deve ficar em:

```text
/assets/images/og-image.jpg
```

## Como publicar no GitHub Pages

O projeto usa apenas caminhos relativos, então funciona bem em repositórios como:

```text
https://<usuario>.github.io/casamento/
```

### Passo a passo

1. envie os arquivos para a branch desejada do repositório;
2. abra o repositório no GitHub;
3. vá em **Settings**;
4. acesse **Pages**;
5. em **Build and deployment**, selecione:
   - **Source**: `Deploy from a branch`
   - **Branch**: escolha a branch publicada (por exemplo, `main`)
   - **Folder**: `/ (root)`
6. salve as configurações.

Depois disso, o GitHub Pages publicará o site automaticamente.

## Observações

- O projeto foi construído em formato **mobile-first**.
- O botão **Adicionar ao calendário** gera um arquivo `.ics` automaticamente.
- Os links com `#` são placeholders e devem ser substituídos antes do uso oficial.
- As animações respeitam `prefers-reduced-motion`.
