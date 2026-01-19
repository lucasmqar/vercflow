---
name: vercflow-identity
description: Single source of truth for VERCFLOW standards (ID Verc), Design Tokens, and Engineering Protocols.
---

# VERCFLOW Identity & Standards

This skill defines the constraints for the Unified Construction Management System.

## Reference Documentation

### Visual Design (Glassmorphism Premium)
For colors, gradients, and glass effects:
👉 **[`resources/design-tokens.json`](resources/design-tokens.json)**

### Technical Implementation
For code structure, Prisma schemas, and file handling rules:
👉 **[`resources/tech-stack.md`](resources/tech-stack.md)**

### Terminology (The "ID Verc" Language)
For correct naming of processes (e.g., "Captação" vs "Cadastro"):
👉 **[`resources/voice-tone.md`](resources/voice-tone.md)**

## Critical "ID Verc" Workflows
When asked to implement a feature, identify the ID:
* **1.0 Comercial**: Captação -> Proposta -> Contrato.
* **2.0 Engenharia**: Croqui -> Projeto Legal -> Executivo.
* **3.0 Aprovações**: Condomínio -> Prefeitura -> Habite-se.
* **4.0 Planejamento**: Canteiro -> Cronograma -> Obra.
* **5.0 Compras**: Solicitação -> Cotação -> Logística.

## Development Protocol
1.  **Check the ID**: Which flow item is this? (e.g., 5.1.2)
2.  **Verify Schema**: Does the database support this?
3.  **Apply Tokens**: Use `glass` classes, not plain backgrounds.
4.  **Validate Output**: Ensure error messages use "Não Conformidade" terminology.
