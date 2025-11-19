======================================================================
            GUIDE DE TRAVAIL GIT - PROJET CLEANIX
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
### PHASE 2 : on va à la nouvelle branch ajouter pour tester le code afin de le validé 
```diff
## au place de tailwind-setup tu fait le nom de la nouvelle branche bach dakchi li 3and lbinome kaywli 3and l'autre (sans toucher la branche main )
--> git checkout feature/tailwind-setup
# si des dependencies sont installé tu doit le faire aussi , donc tu doit faire 
--> cd frontend
--> npm install
# maintenant on exécute le projet pour le tester 
--> npm start
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
# creer ta  branche pouur ta taches spécifique 
--> git checkout -b feature/nomDeVotreBranch

```
======================================================================
## EN CAS DE PANIQUE (CONFLITS OU ERREURS)
======================================================================

## Si git affiche "CONFLICT" ou des messages bizarres :
## Ne panique pas.
## Ne force rien.
## Appelle ton binôme pour régler ça ensemble.
