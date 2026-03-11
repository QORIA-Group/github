---
name: "🛠️ Action IA/Dev : Résolution de Bug"
about: "Template d'exécution pour assigner la correction d'une anomalie à Claude Code ou un développeur"
title: "[FIX] - "
labels: ['bug-fix', 'needs-review']
assignees: ''
---

## 🎯 Contexte de l'Anomalie
- **Ticket Humain d'origine :** # [Insérer le numéro du ticket de déclaration]
- **Dépôt (Repository) ciblé :** [ex: qoria-os-gateway, nexus-cgo-platform]
- **Fichiers suspectés :** [Liste si connue]

## 📜 Contrat de Résolution (Guardrails stricts)
En acceptant cette tâche de correction, tu (Agent IA ou Développeur) t'engages à respecter l'intégralité du `ENGINEERING_PLAYBOOK.md`. 

### Check-list de pré-exécution (Interdiction de coder sans valider ceci) :
- [ ] **Isolement du correctif :** Le fix ne doit traiter *que* ce bug précis. Pas de refactoring global non sollicité.
- [ ] **Sécurité RLS :** Si la requête SQL/Prisma est modifiée, le filtre `tenant_id` doit être explicitement maintenu et testé.
- [ ] **Typage Strict :** L'utilisation de `any` ou `@ts-ignore` pour contourner une erreur de compilation est formellement interdite.
- [ ] **Test de Non-Régression :** Un test unitaire (Jest) reproduisant le bug doit être écrit en premier, et le fix doit faire passer ce test au vert.

## 📥 Inputs & Logs Techniques
- **Stack Trace / Message d'erreur exact :** ```text
[Coller les logs de la console ou l'erreur du serveur ici]
