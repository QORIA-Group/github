---
name: "🐛 Signaler un Bug (Triage Architectural)"
about: "Créer un rapport détaillé mappé sur l'infrastructure QORIA pour un traitement IA rapide"
title: "[BUG] - "
labels: ['bug', 'triage-pending']
assignees: ''
---

## 🚨 Description de l'Anomalie
[Décrivez le problème tel qu'observé par l'utilisateur. Ex: "Le lead n'apparaît pas dans le tableau de bord Nexus alors que le diagnostic est terminé."]

## 🧩 Composant Architectural (Triage)
*Où pensez-vous que l'erreur se situe ? (Cochez la case la plus probable)*

**1. Couche de Présentation (Frontend)**
- [ ] 🖥️ **Nexus CGO Platform / Ascendia Client** (Erreur visuelle, bouton inactif, problème React/Tailwind)

**2. Couche Infrastructure & Événements (QORIA OS)**
- [ ] 🔐 **API Gateway / Auth / RLS** (Erreur 401/403, problème d'accès aux données d'un autre tenant)
- [ ] ⏱️ **PulseFlow Broker** (La donnée existe en base, mais le tableau de bord ne s'est pas mis à jour en temps réel)
- [ ] 💰 **Metering & Facturation** (Erreur dans le décompte des API calls ou tokens pour la Holding)

**3. Couche Intelligence Artificielle (KYRA)**
- [ ] 🧠 **Cognitive Engine (Tri-Brain)** (L'IA a pris une mauvaise décision de routage ou a fait une erreur de logique métier)
- [ ] 🕸️ **Knowledge Graph (Neo4j)** (L'IA a produit une hallucination factuelle ou ignoré un indicateur existant)

**4. Suite Pulse (Micro-services métiers)**
- [ ] 💼 **PulsePayroll** (Erreur de calcul de commission CGO, congés non synchronisés)
- [ ] 🌱 **PulseRSE** (Anomalie sur la génération du rapport de conformité)

## 🔄 Étapes pour reproduire (Steps to Reproduce)
1. 
2. 
3. 

## 🎯 Comportement Attendu
[Ce que le système aurait dû faire]

## ⚠️ Sévérité & Impact Business
- [ ] **P0 (Critique) :** Fuite de données (cross-tenant), facturation bloquée, ou crash de l'API Gateway.
- [ ] **P1 (Majeur) :** Hallucination KYRA avérée ou processus métier (Diag Flash) impossible à terminer.
- [ ] **P2 (Mineur) :** Latence PulseFlow ou défaut purement cosmétique sur Nexus.
