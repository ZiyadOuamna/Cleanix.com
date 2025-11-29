======================================================================
            GUIDE DE TRAVAIL GIT - PROJET CLEANIX - BACKEND
======================================================================

## Règle d'Or : Ne jamais travailler directement sur 'main'.

### PHASE 1 : AVANT DE COMMENCER UNE NOUVELLE TÂCHE (début)
```diff

# Ouvre le terminal à la racine du projet (Cleanix.com).
#// Hadi katjib ghir "l-khbar" anaho kayn branch jdid, ma katbdel walo f fichiers
--> git fetch origin 
# hadi ktl3 lik ga3 les branch li kaynin Ghadi tban lik chi 7aja b7al : remotes/origin/feature/tailwind-setup (b l7mer).
--> git branch -a 
```
## PHASE 11 : pour la lisaison de backend au frontend 3andi en notant que moi j'ai travaillé le front et le binome a travaillé le backend

```diff
--> 1 ) Créer une base de donnée avec le meme nom que nous avons dans le fichioer .env sur le dossier backend DB_DATABASE=cleanix
--> 2 ) On active le xampp ( mysql tout seule ) retourne au terminal du projet sur vs code sur le dossier backend et on fait la migration des tables au base de donnée en utilisant mysql
# php artisan migrate 
--> 3 ) Puis aprés la migration on démare le serveur de laravel 
# php artisan serve 
--> 4 ) Puis on vas sur un autre terminal
# cd frontend 
# npm start
--> 5 ) pour que le frontend savoir ou il va envoyer les données
# va sur package.json
# "proxy": "http://127.0.0.1:8000" hadak lurl li 3tak artisan diro hna  9bl mn eslintConfig
--> 6 ) va vers back end wdir php artisan route/list bach t2akd anaho les routes existent
#
```
### PHASE 2 : on va à la nouvelle branch ajouter pour tester le code afin de le validé 
```diff

```

## PHASE 3 : si tout va bien on retourne vers la branch main pour faire une merge 
```diff
# Va sur la branche principale :
--> ctrl + c
--> cd ..
# donc 9bl maghandozo l main darori ncommitiw dakchi li modifina mn package.json bsbab npm insall li lfou9 
--> git add frontend/package-lock.json
--> git commit -m "Mise à jour package-lock après installation"
# Daba l-fichiers ghayrrj3o kif kano 9bel
--> git checkout main 
# Hadi katched dakchi li f branch dialha o katzidou f main dialek
--> git merge feature/le nom de nouvelle branch
hna safi lgit automatiquement kadir lcommit simto lmerge branch mais kayb9a ghir flpc dialk
# tu dois faire push 
--> git push -u origin main


```


## PHASE 4 : daba ila bghiti tkhdm(i) les taches dialk on va suivre had les etapes 
```diff

```
