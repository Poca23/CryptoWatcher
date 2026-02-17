"Crypto Watcher
🎯 Objectif
Tu dois créer une petite application web en JavaScript pur, qui permet de suivre le prix d'une cryptomonnaie, avec des mises à jour automatiques et un indicateur d'évolution.

Aucune bibliothèque externe n'est autorisée : tu utiliseras HTML, CSS et JavaScript uniquement, avec manipulation du DOM via l’API native.

🧩 Contexte
Coinbase propose une API gratuite pour consulter le prix d’une crypto-monnaie en euros :

https://api.coinbase.com/v2/prices/[SYMBOL]-EUR/buy

Exemples :

Prix du Bitcoin

https://api.coinbase.com/v2/prices/BTC-EUR/buy
Prix de l’Ethereum

https://api.coinbase.com/v2/prices/ETH-EUR/buy

Cryptos à utiliser dans l’exercice :

Bitcoin → BTC
Ethereum → ETH
Cardano → ADA
Polkadot → DOT
Cronos → CRO
Polygon → MATIC"

"V - Affichage de la variation de prix
👉 Le prix doit changer de couleur ou d’icône selon son évolution :

🔼 Vert si le prix monte
🔽 Rouge s’il baisse
➡️ Gris s’il est stable

Attendus :

Comparaison entre le prix précédent et le nouveau
Modification du DOM selon le cas
Affichage lisible et dynamique
"

"VI - Code structuré et réutilisable
👉 Le code doit être clair, lisible, organisé.

Attendus :

Fonctions bien nommées
Réutilisation correcte de la logique
Aucun code dupliqué inutilement
"

"VII - Qualité générale et rigueur
👉 L’ensemble du projet doit montrer que tu maîtrises les bases :

Indentation
Pas de console.log ou alert oubliés
Gestion des erreurs et des cas limites (ex : crypto non reconnue)
"

"BONUS - Ajout manuel de crypto
👉 Permets à l’utilisateur d’ajouter une nouvelle cryptomonnaie via un champ texte.

Attendus :

L’utilisateur tape un symbole (ex : XRP), valide, et celui-ci est ajouté à la liste.
Le système vérifie que la crypto est bien prise en charge par l’API (optionnel mais idéal).
Elle devient disponible dans le sélecteur ou la liste affichée.

💡 Cela permet de rendre l’application plus ouverte et dynamique, comme un vrai "watcher" personnel.
"

"BONUS - Changement de devise (EUR/USD)
👉 L’utilisateur peut choisir d’afficher les prix en euros (€) ou en dollars ($).

Attendus :

Une sélection (boutons radio, select, toggle…) permet de basculer entre les deux devises.
L’URL de l’API s’adapte automatiquement en remplaçant -EUR par -USD.

💡 Ce bonus te fait manipuler dynamiquement les requêtes selon une variable.
"

"BONUS - Graphique d’évolution
👉 Affiche un graphique simple représentant l’évolution du prix dans le temps.

Attendus :

Pas besoin de bibliothèque graphique, tu peux utiliser <canvas>, <svg>, ou même une représentation textuelle en ASCII.
Le graphique se met à jour automatiquement.

💡 Même une mini-barre en div avec une largeur proportionnelle suffit pour montrer ta créativité.
"

"BONUS - Historique des prix
👉 Affiche une liste des anciens prix pour la crypto sélectionnée.

Attendus :

Une zone dans l’interface affiche l’historique des prix récupérés.
Chaque nouveau prix différent est ajouté à la liste.
Si le prix ne change pas, il ne doit pas être ré-ajouté.

💡 Cela peut être une simple liste HTML (<ul>) ou un tableau, et peut inclure l’heure du changement.
"

"BONUS - Loader visuel
👉 Pendant qu’un prix est en cours de récupération, un indicateur visuel de chargement est affiché.

Attendus :

Avant de recevoir la réponse de l’API, affiche par exemple un texte "Chargement..." ou une icône animée.
Une fois les données reçues, le loader disparaît et laisse place au prix.

💡 Tu peux le faire avec une classe CSS ou du texte conditionnel en JavaScript.
"