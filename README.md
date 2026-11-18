# Olho d'Água — alerta comunitário de alagamentos

> Global Solution 2026.2 · FIAP · Engenharia de Software · CitizenTech

## Ficha da CitizenTech

| Campo | Resposta |
|---|---|
| **Nome** | Olho d'Água |
| **Cidade e bairro** | São Paulo — Jardim Pantanal, em São Miguel Paulista (zona leste), na várzea do Rio Tietê. Os dados de demonstração também cobrem o Jardim Romano e a região do Córrego Ipiranga |
| **Cidadão beneficiado** | Morador de área de risco de alagamento — em especial idosos, pessoas com mobilidade reduzida e famílias que moram perto de córregos |
| **Problema, em uma frase** | Quem mora perto de córregos em São Paulo só descobre que a rua vai alagar quando a água já está entrando em casa, sem tempo para proteger pessoas, documentos e bens. |
| **Como funciona** | Sensores de baixo custo medem o nível do córrego e a chuva; quando o nível cruza um limite, o morador inscrito naquela área recebe um alerta no celular com o que fazer e o abrigo mais próximo. Os próprios moradores também reportam alagamentos pelo app, e relatos confirmados viram alerta comunitário. |
| **O que cada parte faz** | **ESP32 (IoT)** mede o nível · **Serviço de Telemetria (Java/SOA)** recebe leituras e detecta limites · **Serviço do Cidadão (C#)** gera alertas, guarda relatos, áreas e abrigos · **App (Expo)** mostra alertas, recebe relatos (funciona offline) e indica abrigos · **ML** prevê chuva forte a partir de dados do INMET · **Linux (SO)** provisiona e monitora os serviços |
| **Link do repositório** | https://github.com/PeOliveira18/GlobalSolution-Mobile |
| **Indicador de impacto** | Minutos de antecedência entre o alerta e o transbordamento · nº de moradores alertados por evento · % de relatos confirmados pela comunidade |
| **ODS conectados** | **ODS 11** (meta 11.5: reduzir mortes e perdas por desastres) · **ODS 13** (meta 13.1: resiliência a riscos climáticos) · **ODS 10** (a população mais exposta é a de baixa renda em áreas de várzea) |

## Arquitetura

```mermaid
flowchart LR
    ESP[ESP32 no Wokwi<br/>sensor de nível + chuva] -- POST /api/leituras --> TEL
    subgraph SOA [Serviço de Telemetria · Java Spring Boot]
      TEL[API Telemetria] --> PGT[(PostgreSQL<br/>telemetria)]
    end
    TEL -- "nível cruzou limite<br/>POST /api/alertas/sensor" --> CID
    subgraph CS [Serviço do Cidadão · C# .NET]
      CID[API Cidadão] --> PGC[(PostgreSQL<br/>cidadao)]
    end
    APP[App Expo<br/>React Native + TS] -- alertas, abrigos, relatos --> CID
    APP -- nível atual do córrego --> TEL
    APP --- SQL[(SQLite local<br/>fila offline)]
    ML[ML · INMET<br/>previsão de chuva forte] -. alerta de previsão .-> CID
```

**Por que dois serviços:** cada um tem uma responsabilidade clara. A Telemetria só conversa com hardware (muitas leituras, regras de limite). O serviço do Cidadão conversa com pessoas (alertas, relatos, abrigos). Eles se integram por REST: é a parte "orientada a serviços" da entrega de SOA, e deixa as entregas de SOA e C# separadas.

<!-- ESTE-REPO:INICIO -->
## Este repositório: Mobile Development & IOT

Entrega da disciplina **Mobile Development & IOT**: o **app do morador**, em Expo com React Native, TypeScript e Expo Router. Ele mostra o nível do córrego e os alertas da área do morador, recebe relatos de alagamento (salvos no SQLite do celular para funcionar sem internet) e indica os abrigos mais próximos com vaga.

```
GlobalSolution-Mobile/
├── README.md     ← esta Ficha
├── prompts.md    ← registro do uso de IA
└── app-mobile/   ← código do app (instruções completas, todos os prints e o roteiro do vídeo no README da pasta)
```

**🎬 Vídeo do app rodando (2min26s):** [app-mobile/docs/video-app.mp4](app-mobile/docs/video-app.mp4)

<table>
  <tr>
    <td align="center"><img src="app-mobile/docs/prints/02-inicio.jpg" width="180" alt="Início: nível do córrego em ALERTA, 2,35 m"><br><b>Vai alagar?</b><br>Início</td>
    <td align="center"><img src="app-mobile/docs/prints/03-detalhe-alerta.jpg" width="180" alt="Detalhe do alerta com o passo a passo"><br><b>O que eu faço?</b><br>Detalhe do alerta</td>
    <td align="center"><img src="app-mobile/docs/prints/05-abrigos.jpg" width="180" alt="Abrigos com vaga por distância"><br><b>Para onde eu vou?</b><br>Abrigos</td>
    <td align="center"><img src="app-mobile/docs/prints/08-relato-offline-pendente.jpg" width="180" alt="Relato feito sem internet, pendente"><br><b>Como aviso os vizinhos?</b><br>Reportar (até sem internet)</td>
  </tr>
</table>

**Destaques:** Expo Router com onboarding, 4 abas e telas de detalhe · consumo das APIs reais do C# e do Java, ou mock com os mesmos contratos · SQLite com fila offline que envia sozinha quando a internet volta · acessibilidade auditada (leitor de tela, alvos de 48 dp, contraste AA, letra grande e alto contraste).

**Rodar rápido (modo mock, sem backend):**

```bash
cd app-mobile
npm install
npx expo start
```

Leia o QR code com o **Expo Go** (SDK 58). Para ligar nas APIs reais, veja [app-mobile/README.md](app-mobile/README.md#modo-mock--api-real).
<!-- ESTE-REPO:FIM -->

## Repositórios do projeto

| Parte | Disciplina | Repositório |
|---|---|---|
| Serviço do Cidadão (.NET) | C# Software Development | https://github.com/PeOliveira18/Olho-dagua |
| Serviço de Telemetria (Java) | SOA e Web Services | https://github.com/PeOliveira18/GlobalSolution-SOA |
| App do morador (Expo) | Mobile Development & IOT | https://github.com/PeOliveira18/GlobalSolution-Mobile |

## Links das entregas

| Disciplina | Link |
|---|---|
| Vídeo do app (Mobile) | [app-mobile/docs/video-app.mp4](app-mobile/docs/video-app.mp4) |
| Projeto Wokwi (IoT) | *a definir* |
| Vídeo IoT | *a definir* |
| Vídeo ML | *a definir* |
| Vídeo Linux (OS) | *a definir* |
| Pitch (Testing) | *a definir* |

## Integrantes

| Nome | RM |
|---|---|
| Pedro Oliveira | 99943 |
| Debora Ivanowski | 555694 |
| Diego Cabral | 557817 |
