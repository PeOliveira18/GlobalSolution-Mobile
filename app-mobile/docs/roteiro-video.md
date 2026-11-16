# Roteiro do vídeo: app do morador (até 3 minutos)

Vídeo da disciplina **Mobile Development & IOT**, com o app rodando no celular (Expo Go).
O objetivo é mostrar a jornada principal da Ficha: *"Vai alagar na minha rua? O que eu faço? Para onde eu vou? Como eu aviso os vizinhos?"*.

## Antes de gravar

- [ ] Celular com o **Expo Go** atualizado, na mesma rede Wi-Fi do computador.
- [ ] Escolha o modo:
  - **Mock** (mais seguro para gravar): no `app-mobile/.env`, deixe `EXPO_PUBLIC_USE_MOCK=true`. O nível aparece em **ALERTA — 2,35 m**, com alertas prontos.
  - **API real**: suba o C# (`--launch-profile lan`) e a Telemetria e use `EXPO_PUBLIC_USE_MOCK=false` com o IP do computador (veja o README). Antes, limpe os alertas e relatos de teste no banco.
- [ ] Rode `npx expo start`, abra o app no celular e use **Perfil → Limpar dados locais** para começar do onboarding.
- [ ] Ative a gravação de tela do celular. Deixe o modo avião e o TalkBack fáceis de alcançar (atalhos rápidos).
- [ ] Letra do celular no tamanho padrão, brilho alto e notificações silenciadas.

## Roteiro (3:00)

| Tempo | Na tela | Fala (sugestão) |
|---|---|---|
| 0:00–0:15 | App fechado; abrir o Olho d'Água | "Quem mora perto de córrego em São Paulo só descobre que vai alagar quando a água já entrou em casa. O Olho d'Água avisa antes, mostra o que fazer e para onde ir." |
| 0:15–0:35 | **Onboarding**: escolher "Várzea do Jardim Pantanal" e ligar **Letra grande** → Começar | "Na primeira abertura o morador escolhe a área e como prefere ler. Não pedimos nome, telefone nem CPF: o celular é inscrito com um código anônimo." |
| 0:35–1:05 | **Início**: cartão "ALERTA — 2,35 m" → tocar no alerta → **passo a passo** | "Vai alagar? O nível do córrego aparece com cor, ícone e texto, nunca só a cor. Tocando no alerta, o morador vê o que fazer agora, em passos simples." |
| 1:05–1:30 | **Ver abrigos com vaga** → lista por distância → ligar **Só acessíveis** → abrir um abrigo → **Como chegar** (abre o Maps) | "Para onde eu vou? Os abrigos com vaga, do mais perto para o mais longe, com filtro para cadeira de rodas. O Como chegar abre o mapa do celular." |
| 1:30–2:10 | Ligar o **modo avião** → aba **Reportar** → escolher "Rua alagada" → Enviar → mostrar **Pendente** e o banner "Sem internet" → desligar o modo avião → o relato vira **Enviado** | "Como aviso os vizinhos? Na enchente, a internet costuma cair. O relato fica salvo no SQLite do celular e é enviado sozinho quando a conexão volta, sem duplicar." |
| 2:10–2:35 | **Perfil → Alto contraste** → voltar ao Início. Ligar o **TalkBack** e tocar no cartão de nível e num alerta | "Acessibilidade é parte da solução: alto contraste, letra grande, botões grandes e tudo lido pelo leitor de tela." (deixe o TalkBack falar) |
| 2:35–2:50 | *(se estiver com a API real)* enviar uma leitura da Telemetria (comando abaixo) e puxar o Início para atualizar | "O nível vem do sensor ESP32, pela Telemetria em Java; os alertas e relatos vêm do Serviço do Cidadão em C#." |
| 2:50–3:00 | Tela do Início | "Expo com React Native, TypeScript e Expo Router, API ou mock, SQLite e modo offline. Olho d'Água: ODS 11 e 13." |

> Sem a API real, troque o trecho 2:35–2:50 por **puxar o Início para atualizar**, mostrando o banner sumir e os dados voltarem.

## Comando para a cena da integração (API real)

Com a Telemetria e o C# no ar, envie uma leitura de 235 cm para o sensor da área 1 (contrato ① do PLANO.md). Ela gera o alerta no Serviço do Cidadão:

```bash
curl -X POST http://localhost:8081/api/leituras -H "Content-Type: application/json" -d "{\"sensorCodigo\":\"SNS-PANTANAL-01\",\"valor\":235.0,\"unidade\":\"CM\"}"
```

Para voltar ao normal depois da gravação, envie uma leitura de 90 cm.

## Depois de gravar

- [ ] Subir no YouTube como **não listado** e colar o link no `README.md` da raiz e no `app-mobile/README.md`.
- [ ] Conferir se o vídeo tem no máximo **3 minutos**.
