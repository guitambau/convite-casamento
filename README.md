# Jantar dos Padrinhos — Isabelle & Guilherme

Convite digital estático, mobile-first, feito com HTML, CSS e JavaScript puro.

## Personalização rápida

Todas as informações variáveis estão no início de `js/script.js`, dentro de `dinnerConfig`:

```javascript
const dinnerConfig = {
    date: '2027-07-31T19:30:00-03:00',
    endDate: '2027-07-31T23:00:00-03:00',
    venue: 'Nome do local',
    address: 'Endereço completo',
    heroBackgroundUrl: 'assets/images/hero-image.webp',
    mapsUrl: 'https://maps.google.com/...',
    rsvpUrl: 'https://wa.me/...'
};
```

- Enquanto `date` estiver vazia, o convite exibe “Data a confirmar” e desativa a contagem e o calendário.
- `endDate` é opcional; sem ela, o evento no calendário terá três horas de duração.
- `heroBackgroundUrl` é opcional; sem foto, o convite usa o fundo verde editorial.
- O link do Espaço Canto Verde que já estava configurado foi mantido.

## Imagens

Coloque a foto principal em `assets/images/hero-image.webp` e a imagem de compartilhamento em `assets/images/og-image.jpg`.

## Abrir localmente

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`. O projeto também pode ser publicado diretamente no GitHub Pages.

## Recursos

- layout responsivo;
- contagem regressiva;
- link para mapa;
- confirmação de presença;
- geração automática de arquivo `.ics`;
- animações com suporte a `prefers-reduced-motion`;
- metadados para compartilhamento em redes sociais.
