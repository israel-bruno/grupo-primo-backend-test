# Sistema de Transações Bancárias com Concorrência de Saldo - Grupo Primo

## Objetivo:

Desenvolver uma API de um sistema de transações bancárias que suporte múltiplas transações concorrentes, garantindo a integridade do saldo da conta em todas as operações.

## Descrição:

Você deve criar um sistema bancário básico com as seguintes funcionalidades:

1. **Cadastro de Conta Bancária:**

   - Permitir a criação de novas contas bancárias com um saldo inicial.
   - Cada conta deve ter um número único e um saldo associado.

2. **Transações:**

   - Implementar funcionalidades para depósito, saque e transferência entre contas.
   - As transações devem ser atomicamente seguras, mesmo em cenários de concorrência.

3. **Concorrência de Transações:**
   - O sistema deve ser capaz de lidar com múltiplas transações ocorrendo simultaneamente.
   - Garantir que a concorrência não corrompa o saldo das contas ou leve a inconsistências.

## Tabela Verdade:

| Transação      | Entrada                                                                                        | Saída                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Depósito       | Conta: 123, Valor: 100                                                                         | Saldo da Conta 123: 100                                                        |
| Saque          | Conta: 123, Valor: 50                                                                          | Saldo da Conta 123: 50                                                         |
| Transferência  | De: 123, Para: 456, Valor: 30                                                                  | Saldo da Conta 123: 20 <br> Saldo da Conta 456: 30                             |
| Concorrência 1 | Depósito(Conta: 123, Valor: 50) <br> Saque(Conta: 123, Valor: 30)                              | Saldo da Conta 123: 20                                                         |
| Concorrência 2 | Depósito(Conta: 123, Valor: 100) <br> Transferência(De: 123, Para: 456, Valor: 50)             | Saldo da Conta 123: 50 <br> Saldo da Conta 456: 50                             |
| Concorrência 3 | Transferência(De: 123, Para: 456, Valor: 20) <br> Transferência(De: 456, Para: 789, Valor: 10) | Saldo da Conta 123: 80 <br> Saldo da Conta 456: 10 <br> Saldo da Conta 789: 10 |

## Requisitos Técnicos:

- Utilize preferencialmente a linguagem TypeScript/JavaScript.
- Implemente logs para rastrear transações e operações em caso de problemas.

## O que gostariamos de ver a mais

- Garanta que o sistema seja robusto o suficiente para lidar com falhas de rede, como timeouts ou indisponibilidade de servidores.

## Entrega:

- Cumprir o prazo estipulado de 2 a 3 dias corridos.
- Crie um repositório no Git (GitHub, GitLab, etc.) e compartilhe o link para revisão.
- Incluir um README com instruções passo-a-passo para a execução.
- Forneça exemplos de uso e cenários de teste que demonstrem a capacidade do sistema de lidar com concorrência de transações.

## Exemplo de API com JSON:

```json
{
  "contas": [
    {
      "numero": 123,
      "saldo": 500
    },
    {
      "numero": 456,
      "saldo": 1000
    }
  ],
  "transacoes": [
    {
      "tipo": "transferencia",
      "origem": 123,
      "destino": 456,
      "valor": 200
    },
    {
      "tipo": "saque",
      "conta": 456,
      "valor": 50
    }
  ]
}
```
