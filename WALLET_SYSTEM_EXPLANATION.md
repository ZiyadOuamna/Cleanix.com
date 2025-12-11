# 📌 Explication: Système de Portefeuille Escrow (Wallet System)

## Qu'est-ce que c'est?

**Les fonds verrouillés** = L'argent que tu as réservé pour les services que tu as commandés, **en attente de completion**.

## Comment ça fonctionne? (Système d'Escrow)

```
TU VEUX FAIRE NETTOYER TON APPART
           ↓
1️⃣ Tu crées une commande de nettoyage (850 DH)
           ↓
2️⃣ Les 850 DH sont BLOQUÉS dans ton portefeuille
   (C'est les fonds verrouillés)
           ↓
3️⃣ Un freelancer ACCEPTE la commande
           ↓
4️⃣ Le freelancer COMPLÈTE le service
           ↓
5️⃣ Les 850 DH sont LIBÉRÉS:
   - Freelancer reçoit: 765 DH (90%)
   - Cleanix prend: 85 DH (10% commission)
           ↓
6️⃣ La transaction est COMPLÉTÉE
   (Elle apparaît dans l'historique)
```

## Les 3 états possibles des fonds bloqués

| État | Signification | Exemple |
|------|--------------|---------|
| **⏳ Pending** | En attente qu'un freelancer accepte | Commande créée, pas encore acceptée |
| **🔄 In Progress** | Freelancer est en train de faire le service | Nettoyage en cours |
| **✅ Completed** | Service terminé, attendant ta validation | Freelancer a fini, il attend ton avis |

## Pourquoi c'est utile pour toi?

✅ **Sécurité** - L'argent n'est pas perdu si le freelancer disparaît  
✅ **Contrôle** - Tu vois exactement combien t'as réservé  
✅ **Flexibilité** - Tu peux annuler et être remboursé si freelancer refuse  
✅ **Transparence** - Chaque montant a une commande associée  

## Ce que tu vois dans la section "Fonds verrouillés"

Pour chaque commande bloquée:
- 🎯 **Service** - Quel nettoyage?
- 👤 **Freelancer** - Qui va le faire?
- 💰 **Montant** - Combien c'est bloqué?
- 📍 **Lieu** - Où?
- ⏰ **Date** - Quand?
- 🔴 **Statut** - État actuel (pending, in_progress)
- **Bouton Annuler** - Pour annuler et te faire rembourser

## Dans l'exemple du portefeuille client

```
Commande 1: Ahmed M. - Nettoyage complet - 850 DH (Pending)
→ Pas encore accepté, 850 DH sont bloqués en attente

Commande 2: Hassan D. - Nettoyage bureau - 1200 DH (In Progress)
→ Hassan nettoie en ce moment, 1200 DH sont bloqués

Commande 3: Ali B. - Remise de clé - 50 DH (Pending)
→ Pas encore accepté, 50 DH sont bloqués en attente

TOTAL BLOQUÉ: 2100 DH
```

## Différence entre les différents soldes

| Solde | Montant | État | Explication |
|-------|---------|------|-------------|
| **💚 Disponible** | 5000 DH | **TU PEUX L'UTILISER** | Pour créer de nouvelles commandes |
| **🔒 Verrouillé** | 2100 DH | **BLOQUÉ** | Pour les commandes en cours |
| **📊 Total Dépensé** | 2850 DH | **DÉJÀ PAYÉ** | Aux freelancers (historique complet) |

## Flux de paiement détaillé

### Étape 1: Création de la commande
```
Client crée commande (850 DH)
         ↓
850 DH passent de "Disponible" à "Verrouillé"
         ↓
Freelancer reçoit notification
```

**État du portefeuille:**
- Disponible: 5000 - 850 = 4150 DH
- Verrouillé: 2100 + 850 = 2950 DH

### Étape 2: Freelancer accepte et complète

```
Freelancer accepte
         ↓
Client valide le service
         ↓
Montant est libéré
```

### Étape 3: Paiement libéré

```
850 DH total est distribué:
├─ 765 DH → Freelancer (90%)
└─ 85 DH → Cleanix (10% commission)
```

**État du portefeuille:**
- Disponible: 4150 + 850 = 5000 DH (remis à disposition)
- Verrouillé: 2100 DH (les autres commandes)
- Historique: Nouvelle transaction "Paiement libéré"

### Étape 4: Annulation possible

```
Si client annule avant que freelancer accepte:
         ↓
850 DH retournent à "Disponible"
         ↓
Transaction "Remboursement" ajoutée à l'historique
```

**État du portefeuille:**
- Disponible: 4150 + 850 = 5000 DH
- Verrouillé: 2100 - 850 = 1250 DH
- Historique: Nouvelle transaction "Remboursement"

## Commission Cleanix

### Comment ça marche?

Quand un service est complété et payé:
- **Montant de la commande:** 1000 DH
- **Freelancer reçoit:** 1000 × 90% = 900 DH
- **Cleanix reçoit:** 1000 × 10% = 100 DH

### Pourquoi Cleanix prend une commission?

1. **Plateforme de paiement** - Frais de transaction
2. **Support client** - Équipe disponible 24/7
3. **Garantie de qualité** - Vérification des services
4. **Développement** - Maintenance et améliorations de l'app
5. **Sécurité** - Protection escrow pour client et freelancer

## Types de transactions dans l'historique

### 1️⃣ Paiement libéré (Released)
```
✅ Status: Completed
💰 Montant: -850 DH (débité)
📋 Détails:
   - Freelancer reçoit: 765 DH (90%)
   - Cleanix reçoit: 85 DH (10%)
⏰ Quand: Après validation du client
```

### 2️⃣ Fonds bloqués (Locked)
```
⏳ Status: Locked
💰 Montant: -850 DH (bloqué)
📋 Détails:
   - Attente acceptation freelancer
   - OU Freelancer travaille
⏰ Quand: Immédiatement après création
```

### 3️⃣ Remboursement (Refund)
```
✅ Status: Completed
💰 Montant: +850 DH (crédité)
📋 Détails:
   - Pas de commission
   - Montant complet retourné
⏰ Quand: Après annulation avant acceptation
```

## Filtrage de l'historique des transactions

### Recherche textuelle
- Tape le nom du freelancer
- Tape le type de service
- Tape la description

### Filtrer par type
- **Libérées** - Services payés et complétés
- **Verrouillées** - Services en cours
- **Remboursements** - Services annulés

### Filtrer par statut
- **Complétées** - Transactions finalisées
- **Verrouillées** - Transactions en attente

## Statistiques du portefeuille

### 3 cartes d'information

| Carte | Affiche | Utilité |
|-------|---------|---------|
| **Nombre de transactions** | Total de toutes les transactions | Voir ton activité |
| **Total libéré** | Somme des paiements complétés | Savoir ce que t'as dépensé |
| **En attente** | Nombre de commandes en cours | Savoir combien de services actifs |

## 💰 CONDITIONS DE REMBOURSEMENT - QUAND PEUX-TU TE FAIRE REMBOURSER?

### Scénario 1: Avant que le freelancer accepte ✅ REMBOURSEMENT 100%

```
TU CRÉAS UNE COMMANDE
       ↓
850 DH bloqués
       ↓
TU CLIQUES "ANNULER" (avant que freelancer accepte)
       ↓
✅ 850 DH REMBOURSÉ INTÉGRALEMENT
   - Pas de commission
   - Pas de frais
   - 100% du montant revient à "Disponible"
```

**Délai:** Remboursement immédiat (dans les 5-10 minutes)

**Conditions:**
- ✅ Le freelancer n'a PAS encore accepté
- ✅ Le service n'a PAS commencé
- ✅ C'est AVANT la date prévue du service

**Exemple:**
```
Commande créée: 10 Déc 10:00 - 850 DH bloqués
Tu annules: 10 Déc 10:15
Résultat: ✅ 850 DH remboursé en 10 minutes
```

---

### Scénario 2: Après acceptation du freelancer ⚠️ CAS COMPLEXE

```
COMMANDE CRÉÉE (850 DH bloqués)
       ↓
FREELANCER ACCEPTE (850 DH toujours bloqués)
       ↓
DEUX CAS POSSIBLES:
```

#### **CAS A: Freelancer n'a pas commencé** ✅ REMBOURSEMENT POSSIBLE

```
Freelancer accepte mais demande l'annulation
       ↓
TU ACCEPTES L'ANNULATION
       ↓
✅ 850 DH REMBOURSÉ
   - Accord mutuel entre toi et freelancer
   - Pas de frais d'annulation
```

**Conditions:**
- ✅ Les deux (client + freelancer) acceptent
- ✅ Le service n'a PAS commencé
- ✅ Communication avant la date prévue

**Délai:** 1-2 heures après accord

---

#### **CAS B: Freelancer travaille déjà** ⚠️ REMBOURSEMENT PARTIEL OU NON

```
Freelancer a commencé le travail
       ↓
TU VEUX ANNULER
       ↓
DEUX OPTIONS:
```

##### **Option 1: Refuser le travail** 🔄 CORRECTIONS GRATUITES

```
Freelancer termine mais le travail est mauvais
       ↓
TU CLIQUES "REFUSER LE TRAVAIL"
       ↓
⚠️ PAS DE REMBOURSEMENT
✅ MAIS: Freelancer doit CORRIGER GRATUITEMENT
```

**Conditions:**
- ✅ Le travail n'est pas conforme
- ✅ Le freelancer a accepté la commande
- ✅ Une seule correction gratuite par commande
- ❌ Pas de remboursement

**Processus:**
```
1️⃣ Tu refus le travail
2️⃣ Tu expliques ce qui ne va pas
3️⃣ Freelancer revient corriger
4️⃣ Tu valides à nouveau
5️⃣ Si OK: 850 DH libérés (765 freelancer + 85 Cleanix)
6️⃣ Si toujours pas OK: Escalade support Cleanix
```

---

##### **Option 2: Service complété, tu valides** ✅ PAIEMENT LIBÉRÉ

```
Freelancer termine le travail
       ↓
TU VALIDES LE TRAVAIL
       ↓
✅ 850 DH LIBÉRÉS:
   - Freelancer reçoit: 765 DH
   - Cleanix reçoit: 85 DH (10%)
   - Transaction "Paiement libéré" ajoutée
```

**Conditions:**
- ✅ Le travail est bon
- ✅ Le freelancer a complété
- ✅ Tu acceptes la qualité

**Délai:** Immédiat (freelancer recevra son argent en 24-48h)

---

### Scénario 3: Dispute ou Problème Majeur ⚖️ SUPPORT CLEANIX

```
PLUSIEURS CAS POSSIBLES:
```

#### **Cas 1: Freelancer disparaît** 🚨 REMBOURSEMENT 100%

```
Freelancer accepte mais DISPARAÎT
SANS commencer le travail
       ↓
TU ATTENDS 48H
       ↓
✅ REMBOURSEMENT AUTOMATIQUE 100%
   - Après 48h sans contact du freelancer
   - 850 DH revient à "Disponible"
   - Pas de frais
```

**Conditions:**
- ✅ Freelancer n'a rien fait
- ✅ Plus de 48h sans nouvelle
- ✅ Tu as tenté de le contacter

**Délai:** Automatique après 48h

---

#### **Cas 2: Qualité très mauvaise après correction** 🚨 ESCALADE SUPPORT

```
Freelancer a corrigé MAIS c'est toujours mauvais
       ↓
TU CONTACTER LE SUPPORT CLEANIX
       ↓
CLEANIX ÉVALUE
       ↓
DEUX RÉSULTATS POSSIBLES:
```

**Résultat 1: Cleanix donne raison au client**
```
✅ REMBOURSEMENT 50-100%
   - Dépend de la situation
   - Freelancer peut être sanctionné
   - Tu reçois ton argent en 24-48h
```

**Résultat 2: Cleanix donne raison au freelancer**
```
❌ PAS DE REMBOURSEMENT
✅ MAIS: Autre freelancer gratuit pour corriger
   - Cleanix paie la correction
   - Tu n'ajoutes rien
   - Résultat garanti
```

---

#### **Cas 3: Freelancer refuse le remboursement** ⚖️ ARBITRAGE

```
Vous êtes en désaccord
       ↓
CLEANIX INTERVIENT
       ↓
ARBITRAGE CLEANIX:
```

**Processus:**
```
1️⃣ Tu fournis des preuves (photos, messages, etc.)
2️⃣ Freelancer défend sa position
3️⃣ Cleanix évalue les éléments
4️⃣ Décision finale de Cleanix (3-5 jours)
5️⃣ Remboursement ou maintien selon décision
```

**Critères de décision:**
- Photos du travail avant/après
- Messages échangés
- Respect des spécifications
- Historique du freelancer
- Avis des clients précédents

---

## 📋 TABLEAU RÉCAPITULATIF DES REMBOURSEMENTS

| Situation | Quand? | Remboursement | Conditions |
|-----------|--------|---------------|-----------|
| **Annulation avant acceptation** | Avant acceptation freelancer | ✅ 100% | Immédiat, sans frais |
| **Accord mutuel après acceptation** | Avant le service | ✅ 100% | Les deux d'accord |
| **Service non complété (48h)** | Freelancer disparaît | ✅ 100% | Automatique après 48h |
| **Refus de travailler** | Après acceptation | ❌ Non | Freelancer doit corriger |
| **Service mauvais après correction** | Après 1ère correction | ⚖️ Support décide | 50-100% selon cas |
| **Service accepté et payé** | Après validation | ❌ Non | Paiement irréversible |

---

## 🔒 PROTECTION MAXIMUM

### Pour le CLIENT (toi):
- ✅ 48h de protection automatique
- ✅ Droit à une correction gratuite
- ✅ Support Cleanix en cas de dispute
- ✅ Arbitrage neutre de Cleanix

### Pour le FREELANCER:
- ✅ Protection du paiement jusqu'à validation
- ✅ Droit à corriger une fois
- ✅ Arbitrage justes en cas de dispute

---

## ⏰ DÉLAIS DE REMBOURSEMENT

| Cas | Délai |
|-----|-------|
| Annulation avant acceptation | Immédiat (5-10 min) |
| Accord mutuel | 1-2h |
| Disparition freelancer (48h) | Automatique |
| Support Cleanix | 3-5 jours |
| Virement bancaire (une fois approuvé) | 24-48h |

---

## Questions fréquentes

### Q: Pourquoi mes fonds sont bloqués?
**R:** C'est une protection. L'argent reste bloqué jusqu'à ce que tu valides le service, pour être sûr que le freelancer ne disparaît pas avec l'argent.

### Q: Je peux annuler une commande?
**R:** Oui! Tant que le freelancer n'a pas accepté, tu peux annuler et être complètement remboursé. Après acceptation, tu dois valider ou refuser le travail.

### Q: Quand je reçois mon argent si je suis freelancer?
**R:** Quand le client valide le service, tu reçois 90% immédiatement.

### Q: Comment je vois mes transactions?
**R:** Dans l'historique avec filtres de recherche. Tu peux trier par:
- Nom du freelancer
- Type de service
- Type de transaction
- Statut

### Q: Y a-t-il des frais cachés?
**R:** Non! La commission est toujours 10% et c'est transparent. Tu vois la répartition exacte dans chaque transaction (90% freelancer, 10% Cleanix).

### Q: Que se passe-t-il si le service n'est pas bon?
**R:** Deux options:
1. **Refuser le travail** - Le freelancer doit corriger
2. **Donner une note basse** - Après validation, tu laisses un avis

## Résumé rapide

🔒 **Fonds verrouillés** = Argent réservé, pas perdu, en attente de complétion  
💚 **Fonds disponibles** = Tu peux les utiliser pour nouvelles commandes  
📊 **Total dépensé** = Historique des paiements finalisés  
📝 **Historique** = Toutes tes transactions avec filtres  
💰 **Commission** = 10% Cleanix, 90% Freelancer, 100% transparent  

**EN RÉSUMÉ:** Le système d'escrow te montre **l'argent que tu as réservé mais pas encore payé** pour tes services en attente ou en cours. C'est une protection pour toi ET pour le freelancer! 🛡️
