# jenius-hotelpet

# 🐾 Sistema de Gestão para Hotelaria e Bem-Estar Pet (HOTELPET)

## 📝 Visão Geral do Projeto
Este projeto consiste em uma plataforma web robusta desenvolvida no **Appsmith** integrada a um banco de dados **PostgreSQL**. O sistema foi projetado especificamente para otimizar, centralizar e automatizar a gestão operacional de hotéis e centros de convivência para animais de estimação (Pets). 

Utilizando uma arquitetura dinâmica de microsserviços e tabelas altamente indexadas, o sistema garante o controle total da jornada do pet — desde o check-in e escolha da acomodação até o monitoramento intensivo de sua saúde, comportamento e interações sociais.

---

## 🎯 Objetivo Geral
O objetivo principal do sistema é mitigar riscos operacionais comuns no ecossistema de hotelaria pet (como superlotação, transmissão de doenças por vacinas vencidas e incidentes por incompatibilidade comportamental) através de validações lógicas automatizadas em tempo real. A plataforma transforma dados complexos em alertas visuais claros, permitindo que os atendentes tomem decisões rápidas e seguras no manejo diário dos animais.

---

## 🚀 Para que Servirá o Sistema? (Funcionalidades Principais)

### 1. Gestão de Clientes e Prontuário do Pet
* **Cadastro Unificado:** Registro detalhado dos tutores e prontuário completo de cada animal (nome, raça, porte, idade e restrições).
* **Histórico Integrado:** Centralização de todas as passagens, eventos e ocorrências do animal no estabelecimento.

### 2. Controle de Convivência (Módulo Amigos)
* **Mapeamento de Afinidades:** Registro de quais pets possuem boa convivência entre si, criando uma rede de conexões seguras.
* **Prevenção de Conflitos:** Identificação imediata de restrições de socialização para otimizar a divisão de grupos nas áreas comuns (creche/playgrounds) e evitar acidentes.

### 3. Monitoramento Comportamental e Clínico (Módulo Particularidades)
* **Classificação de Severidade:** Registro de traços de personalidade, manias, alergias alimentares ou restrições físicas categorizadas por níveis de risco: **CRÍTICA**, **ATENÇÃO** ou **NORMAL**.
* **Alertas Visuais:** Exibição agressiva de avisos na tela do operador no exato momento em que o pet é selecionado, garantindo que cuidados especiais (como medicação ou reatividade a outros cães) nunca sejam ignorados.

### 4. Segurança Sanitária Automatizada (Módulo Imunização)
* **Ficha de Vacinação:** Histórico de imunizantes aplicados com controle rigoroso de datas de aplicação e validade.
* **Barreira de Entrada Humana:** Validação nativa que impede a entrada ou avisa o atendente caso o animal tente realizar um check-in com vacinas obrigatórias vencidas, protegendo a saúde coletiva do hotel.

### 5. Gestão de Ocupação Inteligente (Módulo Reservas & Check-in)
* **Respeito à Capacidade Física:** Controle em tempo real do limite máximo de animais que cada acomodação ou quarto suporta (`acomo01_capacidade`). O sistema bloqueia overbookings de forma automática.
* **Check-in Simplificado:** Fluxo rápido de entrada com checagem tripla instantânea: disponibilidade de vaga + alertas de saúde + perfil comportamental.

---

## ⚙️ Diferenciais Técnicos da Arquitetura
* **Multi-Schema Dinâmico (`JSutils.currentSchema`):** O sistema isola os dados de forma lógica permitindo que a mesma aplicação mude de banco ou ambiente em tempo real para homologação ou produção sem necessidade de alterar o código-fonte.
* **Interface Single-Page Ultra-Responsiva:** Otimização visual onde formulários de edição e listagens conversam instantaneamente através de estados controlados em memória (`appsmith.store`), acelerando o atendimento no balcão e eliminando pop-ups desnecessários.
* **Segurança de Integridade Relacional:** Banco de dados blindado por restrições de chaves estrangeiras (Foreign Keys), impedindo a exclusão de dados vinculados (ex: excluir um pet que possui reservas ou registros de vacinas pendentes).
