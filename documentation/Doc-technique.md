# Documentation technique
Maison des Femmes — Emazteen Etxea

Dernière mise à jour : octobre 2026

## 1. Objet du document

Cette documentation décrit l’architecture, l’hébergement, le déploiement, les bases de données, les services externes, les sauvegardes et les principales opérations de maintenance du site de la Maison des Femmes — Emazteen Etxea.

Elle est destinée à la personne chargée de la maintenance technique actuelle ou future du projet.

Les bénévoles disposent d’un guide utilisateur séparé pour l’administration des contenus dans Strapi.

---

# 2. Architecture générale

Le projet est composé de deux applications principales :

Frontend :
Next.js 16 / React / TypeScript

CMS :
Strapi 5

Services complémentaires :
PostgreSQL  
Brevo  
OVH pour les domaines  
Alwaysdata pour l’hébergement

Architecture :

Utilisateur  
→ mdf-ee.fr ou mdf-ee.eus  
→ Frontend Next.js sur Alwaysdata  
→ API Strapi sur Alwaysdata  
→ PostgreSQL Strapi

Les formulaires du frontend utilisent directement une deuxième base PostgreSQL Alwaysdata :

Frontend Next.js  
→ PostgreSQL applicatif  
→ inscriptions aux activités  
→ messages de contact

Les e-mails sont envoyés via Brevo.

Supabase n’est plus utilisé par le site.

---

# 3. Domaines

Domaines principaux :

Version française :

https://mdf-ee.fr

Version basque :

https://mdf-ee.eus

Les variantes www sont également configurées :

https://www.mdf-ee.fr

https://www.mdf-ee.eus

Sous-domaine de préproduction / secours :

https://front.mdf-ee.fr

Ce sous-domaine pourra être supprimé une fois la nouvelle infrastructure considérée comme définitivement stable.

Les noms de domaine sont gérés chez OVH.

---

# 4. DNS

Les domaines racine pointent vers Alwaysdata.

IPv4 Alwaysdata :

185.31.41.11

IPv6 Alwaysdata :

2a00:b6e0:0001:0020:0023:0000:0000:0001

Les sous-domaines www utilisent un CNAME vers :

mdf-ee.alwaysdata.net.

Ne pas modifier les entrées MX, SPF, DKIM ou autres enregistrements liés à la messagerie lors d’une modification DNS du site.

---

# 5. Hébergement Alwaysdata

Compte :

mdf-ee

Connexion SSH :

ssh mdf-ee@ssh-mdf-ee.alwaysdata.net

Répertoire principal du projet :

/home/mdf-ee/www/mdf

CMS Strapi :

/home/mdf-ee/www/mdf/cms

Frontend Next.js :

/home/mdf-ee/www/mdf/frontend

---

# 6. Frontend

Technologies principales :

Next.js 16  
React  
TypeScript  
CSS Modules

Répertoire :

/home/mdf-ee/www/mdf/frontend

Commande de build :

rm -rf .next  
npm run build

Commande de démarrage gérée par Alwaysdata :

npm run start

Alwaysdata fournit automatiquement l’IP et le port utilisés par le serveur HTTP.

En production, ne pas lancer durablement un second `npm run start` manuellement en SSH.

---

# 7. CMS Strapi

Répertoire :

/home/mdf-ee/www/mdf/cms

Strapi est exécuté en mode production.

Commande :

npm run start

L’API publique est accessible via le site Alwaysdata configuré pour Strapi.

Exemple de test :

/api/landing-page?locale=fr

Administration :

/admin

---

# 8. Structure des contenus Strapi

Strapi gère notamment :

Maisons

Événements

Partenaires

Ressources

Pages éditoriales

Page Actions

Actions

Mentions légales

Politique de confidentialité

Contenus FR / EU

Media Library

## Page Actions et Actions

Page Actions contient le contenu général et permanent de la page « Que fait-on ? ».

La collection Actions sert à ajouter des contenus ponctuels ou à mettre en avant.

Une Action avec :

displayOrder = 1

est considérée comme l’action principale par le frontend.

La page peut fonctionner avec une collection Actions vide.

---

# 9. Médias Strapi

Provider actuel :

stockage local Strapi.

Répertoire :

/home/mdf-ee/www/mdf/cms/public/uploads

Les informations concernant les médias sont enregistrées dans PostgreSQL, mais les fichiers eux-mêmes sont stockés physiquement dans ce dossier.

Il est donc indispensable de sauvegarder :

la base PostgreSQL Strapi

ET

le dossier public/uploads.

En cas de médias cassés après une migration, vérifier d’abord :

ls -lah public/uploads

du -sh public/uploads

---

# 10. Bases PostgreSQL

Serveur :

postgresql-mdf-ee.alwaysdata.net

Port :

5432

Utilisateur PostgreSQL :

mdf-ee

Deux bases sont utilisées.

## Base Strapi

Nom :

mdf-ee_strapi

Contient :

contenus Strapi

utilisateurs administrateurs

relations

Media Library

localisations FR / EU

configuration de contenu

## Base applicative

Nom :

mdf-ee_app

Contient notamment :

event_registrations

contact_messages

Cette séparation permet d’éviter de mélanger les données métier des formulaires avec la base interne de Strapi.

---

# 11. Table event_registrations

Cette table stocke les inscriptions aux événements.

Principaux champs :

id

house_slug

event_id

event_title

first_name

last_name

email

phone

participants

message

consent

status

created_at

digest_sent_at

Les statuts utilisés pour le calcul des capacités sont notamment :

pending

confirmed

La capacité maximale d’un événement est définie dans Strapi.

Le frontend calcule :

capacité Strapi  
moins  
nombre total de participantes inscrites

---

# 12. Table contact_messages

Cette table stocke les formulaires de contact.

Principaux champs :

id

house_slug

first_name

last_name

email

subject

message

consent

status

created_at

---

# 13. E-mails Brevo

Brevo est utilisé pour les e-mails transactionnels.

Il gère notamment :

confirmation d’inscription à une activité

confirmation de réception d’un message de contact

notification interne de nouveau message

récapitulatif quotidien des inscriptions

La clé API Brevo ne doit jamais apparaître dans le code ou dans Git.

---

# 14. Récapitulatif quotidien des inscriptions

Route Next.js :

/api/cron/daily-registrations

La route récupère les inscriptions dont :

digest_sent_at IS NULL

Elle envoie un récapitulatif via Brevo.

Après un envoi réussi, les lignes concernées sont marquées avec une date dans :

digest_sent_at

La route est protégée par :

CRON_SECRET

L’appel doit utiliser :

Authorization: Bearer CRON_SECRET

---

# 15. Variables d’environnement — Frontend

Les variables du frontend sont configurées directement dans l’interface Alwaysdata :

Alwaysdata  
→ Web  
→ Sites  
→ site frontend  
→ Variables d’environnement

Il n’existe pas de fichier `.env.production` utilisé pour le frontend en production.

Variables principales :

NEXT_PUBLIC_STRAPI_URL

APP_DB_HOST

APP_DB_PORT

APP_DB_NAME

APP_DB_USER

APP_DB_PASSWORD

BREVO_API_KEY

BREVO_SENDER_EMAIL

BREVO_SENDER_NAME

CONTACT_RECIPIENT_EMAIL

REGISTRATION_DIGEST_RECIPIENTS

CRON_SECRET

Valeurs de structure :

APP_DB_HOST=postgresql-mdf-ee.alwaysdata.net

APP_DB_PORT=5432

APP_DB_NAME=mdf-ee_app

APP_DB_USER=mdf-ee

La valeur APP_DB_PASSWORD doit rester secrète.

Les valeurs sensibles ne doivent jamais être enregistrées dans Git, dans le code source ou dans un document partagé.

---

# 16. Variables d’environnement — Strapi

Les variables de production de Strapi sont définies dans l’interface Alwaysdata :

Alwaysdata  
→ Web  
→ Sites  
→ site Strapi  
→ Variables d’environnement

Un fichier serveur existe également ici :

/home/mdf-ee/www/mdf/cms/.env

Il peut être utilisé pour les démarrages manuels de Strapi en SSH.

Variables base de données :

DATABASE_CLIENT

DATABASE_HOST

DATABASE_PORT

DATABASE_NAME

DATABASE_USERNAME

DATABASE_PASSWORD

DATABASE_SSL

DATABASE_SSL_REJECT_UNAUTHORIZED

Valeurs de structure :

DATABASE_CLIENT=postgres

DATABASE_HOST=postgresql-mdf-ee.alwaysdata.net

DATABASE_PORT=5432

DATABASE_NAME=mdf-ee_strapi

DATABASE_USERNAME=mdf-ee

Secrets Strapi :

APP_KEYS

API_TOKEN_SALT

ADMIN_JWT_SECRET

TRANSFER_TOKEN_SALT

JWT_SECRET

ENCRYPTION_KEY

APP_KEYS contient quatre valeurs distinctes séparées par des virgules.

Exemple :

APP_KEYS=cle1,cle2,cle3,cle4

Les valeurs réelles ne doivent apparaître ni dans ce document, ni dans Git, ni dans un e-mail.

---

# 17. Où sont stockés les secrets

Les secrets de production sont principalement stockés dans les variables d’environnement configurées dans Alwaysdata.

Pour le frontend :

Alwaysdata  
→ Web  
→ Sites  
→ site frontend  
→ Variables d’environnement

Pour Strapi :

Alwaysdata  
→ Web  
→ Sites  
→ site Strapi  
→ Variables d’environnement

Strapi dispose également d’un fichier serveur :

/home/mdf-ee/www/mdf/cms/.env

Ce fichier contient les variables nécessaires lorsqu’on lance Strapi directement depuis le serveur.

Les secrets ne doivent pas être stockés :

dans Git

dans Trello

dans un document partagé

dans un guide bénévole

dans un e-mail

dans le code source

Les fichiers `.env` présents dans le projet doivent être protégés par `.gitignore`.


Les identifiants et secrets techniques sont conservés dans un fichier chiffré distinct de la documentation.
---

# 18. Rotation des secrets

En cas d’exposition, renouveler :

APP_KEYS

API_TOKEN_SALT

ADMIN_JWT_SECRET

TRANSFER_TOKEN_SALT

JWT_SECRET

ENCRYPTION_KEY

Changer API_TOKEN_SALT peut invalider les anciens tokens API.

Changer les secrets d’administration peut déconnecter les sessions Strapi existantes.

Après modification :

mettre à jour les valeurs dans les variables d’environnement du site Strapi dans Alwaysdata

mettre également à jour cms/.env si ce fichier est conservé pour les démarrages manuels

redémarrer Strapi

tester /admin

tester une API publique

Pour les secrets du frontend, les modifications se font directement dans les variables d’environnement du site frontend dans Alwaysdata.

Après modification d’une variable utilisée au build par Next.js, effectuer un nouveau build du frontend puis redémarrer le site.

---

# 19. Accès administrateur Strapi

À ce jour, l’accès Strapi destiné à la MDF repose temporairement sur un compte partagé.

Ce fonctionnement est accepté comme solution transitoire uniquement.

La MDF devra créer des comptes nominatifs pour chaque bénévole ou personne amenée à administrer le contenu du site.

À terme, il est recommandé de :

créer un compte personnel par utilisatrice

attribuer le rôle adapté à chaque compte

éviter le partage d’un mot de passe commun

réserver le compte Super Admin à la maintenance technique

En attendant cette mise en place, le compte partagé doit être utilisé uniquement par les personnes autorisées par la MDF.

Le mot de passe du compte partagé ne doit pas être transmis dans cette documentation.

---

# 20. Rôle bénévole Strapi

Rôle recommandé :

Bénévole éditrice

Permissions possibles :

lecture

création

modification

publication

suppression pour les contenus courants

Media Library

gestion FR / EU

Ne pas donner accès aux fonctions techniques suivantes :

API Tokens

Transfer Tokens

Webhooks

Content-Type Builder

gestion des rôles

configuration système

paramètres de base de données

---

# 21. CORS Strapi

Le CORS est restreint aux origines nécessaires.

Origines autorisées :

https://mdf-ee.fr

https://www.mdf-ee.fr

https://mdf-ee.eus

https://www.mdf-ee.eus

https://front.mdf-ee.fr

http://localhost:3000

Le localhost est conservé pour le développement local.

Configuration :

cms/config/middlewares.ts

---

# 22. Permissions publiques Strapi

Le rôle Public doit être limité aux lectures nécessaires au frontend.

Typiquement :

find

findOne

sur les contenus publics.

Ne pas autoriser publiquement :

create

update

delete

Les formulaires ne passent pas par une écriture publique Strapi.

Ils utilisent les routes API Next.js et PostgreSQL.

---

# 23. Sécurité HTTP

Le frontend envoie notamment les headers suivants :

X-Content-Type-Options: nosniff

X-Frame-Options: SAMEORIGIN

Referrer-Policy: strict-origin-when-cross-origin

Permissions-Policy: camera=(), microphone=(), geolocation=()

HSTS est actif en HTTPS.

---

# 24. HTTPS

Les certificats SSL sont gérés par Alwaysdata.

Les domaines .fr et .eus ainsi que leurs variantes www disposent de certificats valides.

En cas de problème de certificat :

vérifier d’abord que le DNS pointe vers Alwaysdata

puis vérifier :

Alwaysdata  
→ Avancé  
→ Certificats SSL

---

# 25. Référencement

Le frontend fournit :

robots.txt

sitemap.xml

métadonnées SEO

Open Graph

hreflang FR / EU

Sitemaps :

https://mdf-ee.fr/sitemap.xml

https://mdf-ee.eus/sitemap.xml

Robots :

https://mdf-ee.fr/robots.txt

https://mdf-ee.eus/robots.txt

Les routes suivantes sont volontairement exclues :

/api/

/design-system

Les langues déclarées sont :

fr

eu

---

# 26. Google Search Console

Deux propriétés peuvent être utilisées :

mdf-ee.fr

mdf-ee.eus

Validation recommandée :

DNS TXT chez OVH.

Sitemaps à soumettre :

https://mdf-ee.fr/sitemap.xml

https://mdf-ee.eus/sitemap.xml

---

# 27. Police du site

Police personnalisée :

BDSans-Black.woff2

Emplacement du projet :

frontend/src/fonts/BDSans-Black.woff2

Chargement via :

next/font/local

Variable CSS :

--font-beautifully-delicious

Le layout racine doit contenir le chargement de cette police.

Si la police disparaît après un déploiement :

vérifier que le fichier est présent

vérifier son suivi Git

rebuild Next.js

redémarrer le frontend

---

# 28. Déploiement après une modification

## Sur le poste local

Vérifier :

git status

Ajouter les modifications :

git add ...

Créer un commit :

git commit -m "Description"

Pousser :

git push origin main

## Sur Alwaysdata

Connexion :

ssh mdf-ee@ssh-mdf-ee.alwaysdata.net

Mise à jour :

cd ~/www/mdf  
git pull

### Si le frontend change

cd frontend  
rm -rf .next  
npm run build

Puis redémarrer le site frontend depuis l’interface Alwaysdata.

### Si Strapi change

cd ~/www/mdf/cms

Selon la modification :

npm install

ou éventuellement build de l’admin Strapi.

Attention :

le build de l’admin Strapi est gourmand en mémoire.

Si nécessaire, builder Strapi localement puis transférer les fichiers générés.

---

# 29. Erreur “Connection to upstream failed”

Vérifier :

répertoire du site

commande npm run start

process Node

variables d’environnement

Pour vérifier un port :

ss -ltnp

Pour rechercher les processus Node :

ps aux | grep node

---

# 30. Sauvegardes PostgreSQL

Deux bases doivent être sauvegardées :

mdf-ee_strapi

mdf-ee_app

Le serveur PostgreSQL est actuellement en version majeure 17.

Si le pg_dump local est plus ancien, effectuer la sauvegarde depuis Alwaysdata.

Exemple Strapi :

pg_dump 
-h postgresql-mdf-ee.alwaysdata.net 
-U mdf-ee 
-d mdf-ee_strapi 
-F c 
-f ~/backup_strapi_DATE.dump

Base applicative :

pg_dump 
-h postgresql-mdf-ee.alwaysdata.net 
-U mdf-ee 
-d mdf-ee_app 
-F c 
-f ~/backup_app_DATE.dump

---

# 31. Sauvegarde des médias

Depuis :

~/www/mdf/cms

Commande :

tar -czf ~/backup_strapi_uploads_DATE.tar.gz public/uploads

Vérification :

ls -lh ~/backup_strapi_uploads_DATE.tar.gz

Important :

vérifier que public/uploads contient réellement les fichiers avant de créer l’archive.

Une archive contenant uniquement `.gitkeep` ne constitue pas une sauvegarde des médias.

---

# 32. Rapatrier une sauvegarde sur le poste local

Depuis PowerShell :

scp mdf-ee@ssh-mdf-ee.alwaysdata.net:/home/mdf-ee/NOM_DU_BACKUP "CHEMIN_LOCAL"

Conserver idéalement :

backup Strapi

backup base applicative

backup médias

---

# 33. Restauration des médias

Si les médias existent sur le poste local :

scp -r "CHEMIN_LOCAL/uploads/*" mdf-ee@ssh-mdf-ee.alwaysdata.net:/home/mdf-ee/www/mdf/cms/public/uploads/

Puis :

chmod -R u+rwX,g+rwX ~/www/mdf/cms/public/uploads

Aucune réimportation PostgreSQL n’est nécessaire si les entrées Media Library existent déjà et que les noms des fichiers correspondent.

---

# 34. Anciennes infrastructures

Le site a auparavant utilisé notamment :

Vercel

Render

Supabase

Elles ne sont plus nécessaires au fonctionnement courant une fois la migration Alwaysdata validée.

Avant suppression définitive :

laisser le nouveau site fonctionner plusieurs jours

vérifier les formulaires

vérifier les mails

vérifier Strapi

vérifier les sauvegardes

Supabase peut être conservé temporairement comme sauvegarde passive avant suppression définitive.

---

# 35. Vérifications après déploiement

Après une mise en production importante, vérifier :

page d’accueil FR

page d’accueil EU

agenda

événements

inscription

mail de confirmation

contact

mail MDF

mail de confirmation contact

partenaires

ressources

Page Actions

mentions légales

politique de confidentialité

médias

Media Library

robots.txt

sitemap.xml

---

# 36. Principe de maintenance

Avant une modification importante :

1. faire une sauvegarde

2. vérifier Git

3. modifier

4. tester localement si possible

5. déployer

6. tester en production

Ne jamais modifier simultanément plusieurs éléments d’infrastructure en cas d’incident.

Procéder étape par étape afin de pouvoir identifier facilement la cause d’une erreur.