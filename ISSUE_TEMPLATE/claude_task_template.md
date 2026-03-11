---
name: "🤖 Claude Code : Tâche d'Ingénierie"
about: "Template strict pour l'assignation de tâches de développement backend/frontend à l'Agent IA"
title: "[CLAUDE] - "
labels: ['ai-task', 'needs-review']
assignees: ''
---

## 🎯 Objectif de la Mission
[Décrire précisément la tâche métier ou technique à accomplir]

## 📜 Contrat d'Architecture (Rappel Strict pour Claude)
En acceptant cette tâche, tu t'engages à respecter l'intégralité du `ENGINEERING_PLAYBOOK.md` situé à la racine du projet `.github`.

### Check-list de pré-exécution (Ne commence pas à coder sans valider ceci) :
- [ ] **Souveraineté des données :** Si tu touches à la BDD, as-tu implémenté le RLS (Row Level Security) avec le `tenant_id` ?
- [ ] **Typage :** Le mode TypeScript strict est-il respecté (aucun `any`) ?
- [ ] **PulseFlow :** As-tu utilisé le pattern Outbox pour les événements asynchrones au lieu d'appels directs ?
- [ ] **Sanitization :** As-tu vérifié que l'UI ne recevra aucune métadonnée interne KYRA (seulement des insights épurés) ?

## 📥 Inputs & Documentation
- **Contrat API (OpenAPI/AsyncAPI) :** [Lien ou description]
- **Fichiers concernés :** [Liste des fichiers à modifier]

## 📤 Output attendu (Definition of Done)
1. Code métier implémenté.
2. Tests unitaires Jest ajoutés (Coverage > 85%).
3. Code prêt pour la revue humaine (Pull Request).
