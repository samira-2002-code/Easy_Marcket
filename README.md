# Easy Market 🛍️

**Easy Market** est une marketplace web développée dans le cadre de mon **projet fil rouge**.

L'idée est simple : permettre à un utilisateur de mettre un objet en vente ou de proposer un échange, puis permettre aux autres utilisateurs de rechercher les annonces, les filtres et de consulter leurs détails.

Le projet est construit avec une séparation claire entre un **backend Laravel qui expose une API REST** et un **frontend React qui consomme cette API**.

---

## 💡 Le concept

Sur Easy Market, un utilisateur peut par exemple publier :

> **iPhone 15 — 7 500 DH — Électronique — Vente**

ou :

> **Vélo — Échange — Sports**

Chaque annonce appartient à un utilisateur et à une catégorie.

L'utilisateur peut ensuite retrouver ses annonces, les modifier et ou les supprimer.

---

## 🔄 Comment fonctionne l'application ?

```text
                    EASY MARKET
                         │
              ┌──────────┴──────────┐
              │                     │
          FRONTEND               BACKEND
           React                 Laravel
              │                     │
              │       API REST      │
              └──────────┬──────────┘
                         │
                       MySQL
```

Le frontend ne manipule pas directement la base de données.

React envoie les requêtes HTTP à l'API Laravel, et Laravel s'occupe de la validation, de l'authentification et de l'accès aux données.

---

# ✨ Fonctionnalités développées

## 👤 Compte utilisateur

L'application possède un système d'authentification permettant de :

* créer un compte ;
* se connecter ;
* se déconnecter ;
* consulter son profil ;
* modifier ses informations.

L'API utilise **Laravel Sanctum** pour gérer l'authentification des utilisateurs.

---

## 🛒 Les annonces

Une annonce contient notamment :

```text
Titre
Description
Prix
Type
Catégorie
Image
Utilisateur propriétaire
Date de création
```

Le type d'annonce peut être :

```text
SALE
EXCHANGE
```

Un utilisateur peut :

* publier une annonce ;
* consulter une annonce ;
* modifier sa propre annonce ;
* supprimer sa propre annonce.

Une vérification côté backend empêche un utilisateur de modifier ou supprimer l'annonce d'un autre utilisateur.

---

## 🔎 Recherche et exploration

La page Marketplace permet de rechercher les annonces par mot-clé.

La recherche porte sur :

* le titre ;
* la description.

Il est également possible de filtrer les résultats par :

* catégorie ;
* prix minimum ;
* prix maximum ;
* type de transaction.

Les annonces peuvent être triées par :

* plus récentes ;
* plus anciennes ;
* prix croissant ;
* prix décroissant.

---

## 🖼️ Gestion des images

Lors de la création d'une annonce, l'utilisateur peut sélectionner une image depuis son ordinateur.

Le frontend utilise `FormData` pour envoyer le fichier à Laravel.

Laravel valide ensuite le fichier avant de le stocker dans :

`
USE CASE DIAGRAME 

<img width="437" height="378" alt="Screenshot 2026-08-04 103104" src="https://github.com/user-attachments/assets/a888a5b5-b8fb-4c1e-95ab-7aece64d5d52" />


UML DIAGRAME 

<img width="812" height="427" alt="Screenshot 2026-08-07 215144" src="https://github.com/user-attachments/assets/901d6dd6-af64-4390-a12f-ccf371996c39" />


ERD DIAGRAME

<img width="409" height="298" alt="Screenshot 2026-08-04 121226" src="https://github.com/user-attachments/assets/83aece1a-ca3d-4c52-b65e-163b0b80054e" />


