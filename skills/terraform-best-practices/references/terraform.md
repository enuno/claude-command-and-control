# Terraform-Best-Practices - Terraform

**Pages:** 27

---

## Česta pitanja

**URL:** https://www.terraform-best-practices.com/ba/faq.md

**Contents:**
- Koje alate bi trebali korisititi ili razmisliti o njihovoj upotrebi?
- Sta su rjesenja za [pakao zavisnosti](https://en.wikipedia.org/wiki/Dependency_hell) izmedju modula?

* [**Terragrunt**](https://terragrunt.gruntwork.io/) - Orkestracijski alat
* [**tflint**](https://github.com/terraform-linters/tflint) - Alat za formatiranje koda
* [**tfenv**](https://github.com/tfutils/tfenv) - Menadzer verzija
* [**Atlantis**](https://www.runatlantis.io/) - Automatizacija zahtijeva za izmjene&#x20;
* [**pre-commit-terraform**](https://github.com/antonbabenko/pre-commit-terraform) - Kolekcija git okidaca za Terraform koji mogu biti koristeni sa [pre-commit framework](https://pre-commit.com/)
* [**Infracost**](https://www.infracost.io) - Procjena troskova infrastrukture za Terraform unutar zahtjeva za izmjenu. Radi sa Terragruntom, Atlantisom i pre-commit-terraform.

Verzionisanje resursa i infrastrukturnih modula treba biti specificirano. Provajderi trebaju biti konfigurisani izvan modula, ali samo unutar kompozicija. Verzinisanje provajdera i Terrafroma moze takodjer biti zakljucano.

Ne postoji najbolji alat za odrzavanje zavisnosti i njihov menadzment, ali postoje odredjene upute kako napraviti zavisnosti manje problematicnim. Na primjer, [Dependabot](https://dependabot.com/) moze biti koriste za automatizaciju azuriranja zavisnosti. Dependabot zahtjev za izmjenu da bi drzao vase zavisnosti sigurnim i azuiranim. Dependabot podrzava Terraform konfiguracije.

---

## Εργαστήριο

**URL:** https://www.terraform-best-practices.com/el/workshop.md

Υπάρχει επίσης ένα εργαστήριο για άτομα που θέλουν να εφαρμόσουν στην πράξη κάποια από τα πράγματα που περιγράφονται σε αυτόν τον οδηγό.&#x20;

Το περιεχόμενο βρίσκεται εδώ - <https://github.com/antonbabenko/terraform-best-practices-workshop>

---

## Bienvenue

**URL:** https://www.terraform-best-practices.com/fr/readme.md

**Contents:**
- Sponsors
- Translations
- Contributions
- Authors
- License

[Terraform](https://www.terraform.io), un projet relativement nouveau (comme la plus part des outils Devops actuellement), a été lancé en 2014.

Terraform est un outil puissant (si ce n'est le plus puissant actuellement disponible) et le plus utilisé pour le gestion de l'infrastructure comme code. Il permet aux developpeurs de créer plusieurs codes dont le support et l'intégration seront faciles

Certaines informations décrit dans ce livre pourraient ne pas ressembler aux bonnes pratiques. J'en suis conscient, et pour aider les lecteurs à séparer ce qui établit comme bonnes pratiques et ce que je considère être d'autres méthodes équivalentes, j'utiliserai par moment des indications pour fournir un certain contexte et des icônes pour spécifier le niveau de maturité de chaque sous-section reliée aux bonnes pratiques

Ce livre a été commencé dans une ville de Madrid ensoleillée en 2018 et est disponible gratuitement ici [https://www.terraform-best-practices.com/](https://www.terraform-best-practices.com)

Quelques années plus tard il a été mis à jour grâce à plusieurs récentes bonnes pratiques disponibles avec Terraform 1.0. Éventuellement ce livre devrait contenir la plupart des bonnes pratiques et recommandations indiscutables pour les utilisateurs de Terraform.

Please [contact me](https://github.com/antonbabenko/terraform-aws-devops#social-links) if you want to become a sponsor.

| [![](https://4195313895-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F6shyPtr2KrqW4ANbFXYg%2Fuploads%2Fgit-blob-a20cbce63c68eb37bae050e948606a3a24b58238%2Fctf-logo.png?alt=media)](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) | [Compliance.tf](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) — Terraform Compliance Simplified. Make your Terraform modules compliance-ready. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![](https://github.com/antonbabenko/terraform-best-practices/blob/fr/.gitbook/assets)](https://www.terraform-best-practices.com/fr/readme)                                                                                                                                            | —                                                                                                                                                                             |

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/>" %}
[العربية (Arabic)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/>" %}
[Bosanski (Bosnian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/>" %}
[Português (Brazilian Portuguese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/>" %}
[English](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/DyguS0uZfMW7X7m9BWx1/>" %}
[ქართული (Georgian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/DyguS0uZfMW7X7m9BWx1/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/>" %}
[Deutsch (German)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5c1kFpqxaDZC2g9e6rtT/>" %}
[ελληνικά (Greek)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5c1kFpqxaDZC2g9e6rtT/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/4bq6CyY8vYiEHkjN63rT/>" %}
[עברית (Hebrew)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/4bq6CyY8vYiEHkjN63rT/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/>" %}
[हिंदी (Hindi)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/>" %}
[Bahasa Indonesia (Indonesian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/>" %}
[Italiano (Italian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/>" %}
[日本語 (Japanese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/>" %}
[ಕನ್ನಡ (Kannada)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/>" %}
[한국어 (Korean)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/>" %}
[Polski (Polish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/sFM1GW5TPCGsskQ03mTm/>" %}
[Română (Romanian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/sFM1GW5TPCGsskQ03mTm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/>" %}
[简体中文 (Simplified Chinese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/>" %}
[Español (Spanish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/>" %}
[Türkçe (Turkish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/>" %}
[Українська (Ukrainian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/>" %}
[اردو (Urdu)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/)
{% endcontent-ref %}

Contactez-moi si vous voulez aider à traduire ce livre dans d'autres langues.

Je souhaite toujours obtenir des commentaires et mettre à jour ce livre au fur et à mesure que la communauté mûrit et que de nouvelles idées sont mises en œuvre et vérifiées au fil du temps. Si vous êtes intéressé par certains sujets, veuillez ouvrir un problème ou en indiquer un que vous souhaitez être traiter plus en détail. Si vous sentez que vous avez du contenu et que vous souhaitez y contribuer, rédigez un brouillon et soumettez un pull request (ne vous souciez pas d'écrire un bon texte à ce stade !)

Ce livre est maintenu par Anton Babenko avec l'aide de différents contributeurs et traducteurs. Nicanor Foping l'a traduit en français.

Ce travail est sous licence Apache 2. Voir LICENCE pour plus de détails.

Les auteurs et contributeurs de ce contenu ne peuvent garantir la validité des informations trouvées ici. Veuillez vous assurer que vous comprenez que les informations fournies ici sont fournies librement et qu'aucun type d'accord ou de contrat n'est créé entre vous et toute personne associée à ce contenu ou projet. Les auteurs et les contributeurs n'assument pas et déclinent par la présente toute responsabilité envers toute partie pour toute perte, dommage ou perturbation causé par des erreurs ou des omissions dans les informations contenues dans, associées ou liées à ce contenu, que ces erreurs ou omissions résultent de négligence, accident ou toute autre cause.

Copyright © 2018-2023 Anton Babenko.

---

## 编写Terraform配置

**URL:** https://www.terraform-best-practices.com/zh/writing-terraform-configurations.md

**Contents:**
- 使用 `locals` 指定资源之间的显式依赖关系
- Terraform 0.12 - 必需参数与可选参数

这是一种有用的方法，可以向Terraform提供提示，即使在Terraform配置中没有直接依赖关系，某些资源也应该在其它资源之前被删除。

<https://raw.githubusercontent.com/antonbabenko/terraform-best-practices/master/snippets/locals.tf>

1. 如果`var.website`不是一个空的map，则必须设置必需参数 `index_document`。
2. 可选参数`error_document`可以省略。

{% code title="main.tf" %}

{% code title="terraform.tfvars" %}

**Examples:**

Example 1 (hcl):
```hcl
variable "website" {
  type    = map(string)
  default = {}
}

resource "aws_s3_bucket" "this" {
  # omitted...

  dynamic "website" {
    for_each = length(keys(var.website)) == 0 ? [] : [var.website]

    content {
      index_document = website.value.index_document
      error_document = lookup(website.value, "error_document", null)
    }
  }
}
```

Example 2 (hcl):
```hcl
website = {
  index_document = "index.html"
}
```

---

## Structure du code

**URL:** https://www.terraform-best-practices.com/fr/code-structure.md

**Contents:**
- Comment devrais-je structurer mes configurations Terraform?
- Initiation à la structuration des configurations Terraform
- Comment structurer les configurations Terraform?
  - Recommandations courantes pour structurer le code
  - Orchestration des modules d'infrastructure et compositions

Les questions liées à la structure du code Terraform sont de loin les plus fréquentes dans la communauté. Tout le monde a également pensé à la meilleure structure de code pour le projet à un moment donné.

C'est l'une des questions pour lesquelles de nombreuses solutions existent, mais il est très difficile de donner des conseils universels, alors commençons par comprendre à quoi nous avons affaire.

* Quelle est la complexité de votre projet?
  * Nombre de ressources associées
  * Nombre de fournisseurs Terraform (voir la remarque ci-dessous sur les "fournisseurs logiques")
* À quelle fréquence votre infrastructure change-t-elle ?
  * À partir d'une fois par mois/semaine/jour
  * À continuellement (à chaque fois qu'il y a un nouveau commit)
* Quelles sont les initiateurs de changement de code? Laissez-vous le serveur CI mettre à jour le référentiel lorsqu'un nouvel artefact est créé ?
  * Seuls les développeurs peuvent pousser vers le référentiel d'infrastructure?
  * Tout le monde peut proposer un changement à n'importe quoi en ouvrant un PR (y compris les tâches automatisées exécutées sur le serveur CI)
* Quelle plate-forme de déploiement ou service de déploiement utilisez-vous ?
  * AWS CodeDeploy, Kubernetes ou OpenShift nécessitent une approche légèrement différente
* Comment les environnements sont-ils regroupés ?
  * Par environnement, région, projet

{% hint style="info" %}
Les fournisseurs logiques fonctionnent entièrement dans la logique de Terraform et très souvent n'interagissent avec aucun autre service, nous pouvons donc considérer leur complexité comme O(1). Les fournisseurs logiques les plus courants incluent [random](https://registry.terraform.io/providers/hashicorp/random/latest/docs), [local](https://registry.terraform.io/providers/hashicorp/local/latest/docs), [terraform](https://www.terraform.io/docs/providers/terraform/index.html), [null](https://registry.terraform.io/providers/hashicorp/null/latest/docs), [time](https://registry.terraform.io/providers/hashicorp/time/latest).
{% endhint %}

Mettre tout le code dans main.tf est une bonne idée lorsque vous débutez ou que vous écrivez un exemple de code. Dans tous les autres cas, il sera préférable d'avoir plusieurs fichiers répartis logiquement comme ceci :

* `main.tf` - appelle les modules, les variables locals et les sources de données pour créer toutes les ressources
* `variables.tf` - contient les variables qui seront utilisées dans `main.tf`
* `outputs.tf` - contient les sorties des ressources créées dans `main.tf`
* `versions.tf` - contient les exigences de version pour Terraform et les fournisseurs

`terraform.tfvars` ne doit être utilisé nulle part sauf [composition](https://www.terraform-best-practices.com/fr/key-concepts#composition).

{% hint style="info" %}
Veuillez vous assurer que vous comprenez les concepts clés - [resource module](https://www.terraform-best-practices.com/fr/key-concepts#resource-module), [infrastructure module](https://www.terraform-best-practices.com/fr/key-concepts#infrastructure-module), et [composition](https://www.terraform-best-practices.com/fr/key-concepts#composition), tels qu'ils sont utilisés dans les exemples suivants.
{% endhint %}

* Il est plus facile et plus rapide de travailler avec un plus petit nombre de ressources
  * `terraform plan` et`terraform apply` effectuent tous deux des appels d'API cloud pour vérifier l'état des ressources
  * Si vous avez toute votre infrastructure dans une seule composition, cela peut prendre un certain temps
* Le surface d'exposition est plus petit avec moins de ressources
  * Isoler les ressources non liées les unes des autres en les plaçant dans des compositions séparées réduit le risque en cas de problème
* Démarrez votre projet en utilisant l'état distant car :
  * Votre ordinateur portable n'est pas une source fiable pour votre infrastructure
  * Gérer un fichier `tfstate` file dans un git est cauchemar
  * Plus tard, lorsque les couches d'infrastructure commenceront à se développer dans plusieurs directions (nombre de dépendances ou de ressources), il sera plus facile de garder les choses sous contrôle
* Adoptez une structure et une convention de [dénomination ](https://www.terraform-best-practices.com/fr/naming)cohérentes :
  * Comme tout code procédural, le code Terraform doit être écrit pour permettre d'abord aux gens de le lire. Sa cohérence aidera lorsque des changements se produiront dans une période de six mois
  * Il est possible de déplacer des ressources dans le fichier d'état Terraform, mais cela peut être plus difficile à faire si vous avez une structure et un nom incohérents
* Gardez les modules de ressources aussi clairs que possible
* Ne codez pas en dur les valeurs qui peuvent être transmises en tant que variables ou découvertes à l'aide de sources de données
* Utilisez les sources de données et `terraform_remote_state` spécifiquement comme colle (liaison) entre les modules d'infrastructure au sein de la composition.

Dans ce livre, des exemples de projets sont regroupés par complexité - des petites aux très grandes infrastructures. Cette séparation n'est pas stricte, vérifiez donc également les autres structures.

Avoir une petite infrastructure signifie qu'il y a un petit nombre de dépendances et peu de ressources. Au fur et à mesure que le projet se développe, la nécessité d'enchaîner l'exécution des configurations Terraform, de connecter différents modules d'infrastructure et de transmettre des valeurs au sein d'une composition devient évidente.

On dénombre au moins 5 groupes distincts de solutions d'orchestration utilisées par les développeurs :

1. Terraform uniquement. Très simple, les développeurs ne doivent connaître que Terraform pour faire le travail.
2. Terragrunt. Un pur outil d'orchestration qui peut être utilisé pour orchestrer l'ensemble de l'infrastructure ainsi que pour gérer les dépendances. Terragrunt fonctionne nativement avec des modules d'infrastructure et des compositions, ce qui réduit la duplication de code.
3. Scripts maison (personnel). Ils sont souvent utilisés comme point de départ vers l'orchestration et avant de découvrir Terragrunt.
4. Ansible ou les outils d'automatisation généraux similaires. Généralement utilisé lorsque Terraform est adopté après Ansible, ou lorsque l'UI Ansible est activement utilisée.
5. [Crossplane](https://crossplane.io) et autres solutions inspirées de Kubernetes. Parfois, il est logique d'utiliser l'écosystème Kubernetes et d'employer une fonction de boucle de réconciliation pour atteindre l'état souhaité de vos configurations Terraform. Voir la vidéo [Crossplane vs Terraform](https://www.youtube.com/watch?v=ELhVbSdcqSY) pour plus d'information.

Avec cela en tête, ce livre passe en revue les deux premières structures de projet ci-dessus, [Terraform](https://www.terraform-best-practices.com/fr/examples/terraform) uniquement ou [Terragrunt](https://www.terraform-best-practices.com/fr/examples/terragrunt).

Voir des exemples de structure de code pour [Terraform](https://www.terraform-best-practices.com/fr/examples/terraform) et [Terragrunt](https://www.terraform-best-practices.com/fr/examples/terragrunt) dans le prochain chapitre.

---

## Bine ați venit

**URL:** https://www.terraform-best-practices.com/ro/readme.md

**Contents:**
- Sponsori
- Traduceri
- Contribuții
- Autori
- Licență

[Terraform](https://www.terraform.io/) este un proiect nou (ca și majoritatea tool-urilor de DevOps) și a fost creat în 2014.

Terraform este unul din cele mai puternice (poate chiar cel mai puternic) instrumente și unul din cele mai folosite pentru a defini infrastructura ca și cod. Le permite dezvoltatorilor să facă o mulțime de lucruri și nu îi împiedică să facă lucruri în moduri care vor fi greu de susținut sau de integrat în viitor.

Este posibil ca unele informații descrise în această carte să nu pară cele mai bune practici. Știu acest lucru și pentru a ajuta cititorii să separe cele mai bune practici stabilite de ceea ce este doar un alt mod de a face lucrurile într-un anumit fel, folosesc uneori indicii pentru a oferi context și pictograme pentru a specifica nivelul de maturitate pentru fiecare subsecțiune legată de cele mai bune practici.

Cartea a început în însoritul Madrid în 2018 și este disponibilă gratuit aici - <https://www.terraform-best-practices.com/> .

Câțiva ani mai târziu, a fost actualizată cu mai multe bune practici disponibile cu Terraform 1.0. În cele din urmă, această carte ar trebui să conțină cele mai multe dintre cele mai bune practici și recomandări indiscutabile pentru utilizatorii Terraform.

Please [contact me](https://github.com/antonbabenko/terraform-aws-devops#social-links) if you want to become a sponsor.

| [![](https://1430054145-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FsFM1GW5TPCGsskQ03mTm%2Fuploads%2Fgit-blob-a20cbce63c68eb37bae050e948606a3a24b58238%2Fctf-logo.png?alt=media)](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) | [Compliance.tf](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) — Terraform Compliance Simplified. Make your Terraform modules compliance-ready. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![](https://github.com/antonbabenko/terraform-best-practices/blob/ro/.gitbook/assets)](https://www.terraform-best-practices.com/ro/readme)                                                                                                                                            | —                                                                                                                                                                             |

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/>" %}
[العربية (Arabic)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/>" %}
[Bosanski (Bosnian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/>" %}
[Português (Brazilian Portuguese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/>" %}
[English](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/6shyPtr2KrqW4ANbFXYg/>" %}
[Français (French)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/6shyPtr2KrqW4ANbFXYg/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/DyguS0uZfMW7X7m9BWx1/>" %}
[ქართული (Georgian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/DyguS0uZfMW7X7m9BWx1/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/>" %}
[Deutsch (German)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5c1kFpqxaDZC2g9e6rtT/>" %}
[ελληνικά (Greek)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5c1kFpqxaDZC2g9e6rtT/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/4bq6CyY8vYiEHkjN63rT/>" %}
[עברית (Hebrew)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/4bq6CyY8vYiEHkjN63rT/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/>" %}
[हिंदी (Hindi)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/>" %}
[Bahasa Indonesia (Indonesian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/>" %}
[Italiano (Italian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/>" %}
[日本語 (Japanese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/>" %}
[ಕನ್ನಡ (Kannada)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/>" %}
[한국어 (Korean)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/>" %}
[Polski (Polish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/>" %}
[简体中文 (Simplified Chinese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/>" %}
[Español (Spanish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/>" %}
[Türkçe (Turkish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/>" %}
[Українська (Ukrainian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/>" %}
[اردو (Urdu)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/)
{% endcontent-ref %}

Contactați-mă dacă doriți să ajutați la traducerea acestei cărți în alte limbi.

Îmi doresc întotdeauna să primesc feedback și să actualizez această carte pe măsură ce comunitatea se maturizează și noi idei sunt implementate și verificate în timp.

Dacă sunteți interesați de anumite subiecte vă rog[ ](https://github.com/antonbabenko/terraform-best-practices/issues)deschideți [un issue](https://github.com/antonbabenko/terraform-best-practices/issues) (o problemă), sau dați "Like" la o problemă existentă pe care doriți să o abordați cel mai mult. Dacă simțiți că aveți conținut și doriți să contribui, scrieți un text și trimiteți un pull request (nu vă faceți griji dacă scrieți un text bun în acest moment!).

Această carte este menținută de [Anton Babenko](https://github.com/antonbabenko) cu ajutorul diferiților colaboratori și traducători.

Această lucrare este licențiată sub Apache 2 License. Consultați LICENSE pentru detalii complete.

Autorii și colaboratorii la acest conținut nu pot garanta valabilitatea informațiilor găsite aici. Vă rugăm să vă asigurați că înțelegeți că informațiile furnizate aici sunt furnizate în mod liber și că nu este creat niciun fel de acord sau contract între dvs. și orice persoană asociată cu acest conținut sau proiect. Autorii și colaboratorii nu își asumă și nu își declină nicio responsabilitate față de orice parte pentru orice pierdere, daune sau întrerupere cauzată de erori sau omisiuni în informațiile conținute în, asociate cu sau legate de acest conținut, indiferent dacă astfel de erori sau omisiuni rezultă din neglijență, accident sau orice altă cauză.

Copyright © 2018-2023 Anton Babenko.

---

## Kod Yapısı

**URL:** https://www.terraform-best-practices.com/tr/code-structure.md

**Contents:**
- Terraform konfigürasyon yapısını nasıl kurmalıyım?
- Terraform konfigürasyonlarının yapılandırılmasına başlarken
- Terraform yapılandırma yapısı hakkında nasıl düşünülür?
  - Kod yapısı hakkında genel öneriler
  - Altyapı modüllerinin ve kompozisyonlarının yönetimi

Terraform kod yapısıyla ilgili sorular, toplulukta açık ara en sık sorulan sorulardır. Herkes bir noktada proje için en iyi kod yapısını da düşündü.

Bu, birçok çözümün bulunduğu ve genel bir tavsiye vermenin çok zor olduğu sorulardan biridir, o yüzden neyle uğraştığımızı anlamakla başlayalım.

* Projeniz ne kadar karışık?
  * Bağımlı olduğu kaynakların sayısı
  * Terraform sağlayıcılarının sayısı (Mantıksal ayraçlar hakkındaki not için aşağıya gözatınız)
* Altyapınız ne sıklıkla değişiyor?
  * Ayda/yılda/günde bir defadan
  * Sürekli değişen bir yapıya (Her committe güncellenen bir yapı)
* Kod değişikliği başlatıcıları? Yeni bir çıktı üretildiğinde CI aracınızın repoyu güncellemesine izin veriyor musunuz?
  * Altyapı reposunda sadece geliştiriciler kod değişikliği yapabilir.
  * Herkes, altyapı reposunda değişiklik için PR(Pull Request) açabilir (Buna CI aracı ve diğer botlar da dahil.)
* Hangi geliştirme platformunu veya dağıtım servisini kullanıyorsunuz?
  * AWS CodeDeploy, Kubernetes veya OpenShift için farklı farklı yaklaşımlar sergilemeniz gerekebilir.
* Hangi özelliğe göre gruplandırma yapıyorsunuz?
  * Ortam(environment), bölge(region), proje

{% hint style="info" %}
Mantıksal sağlayıcılar tamamen Terraform'un mantığı içinde çalışır ve çoğu zaman başka hizmetlerle etkileşime girmez, bu nedenle karmaşıklıklarını O(1) olarak düşünebiliriz. En yaygın mantıksal sağlayıcılar arasında rastgele([random](https://registry.terraform.io/providers/hashicorp/random/latest/docs)), yerel([local](https://registry.terraform.io/providers/hashicorp/local/latest/docs)), [terraform](https://www.terraform.io/docs/providers/terraform/index.html), [null](https://registry.terraform.io/providers/hashicorp/null/latest/docs), [time](https://registry.terraform.io/providers/hashicorp/time/latest) bulunur.
{% endhint %}

Başlarken veya bir örnek kod yazarken tüm kodu `main.tf`'ye koymak iyi bir fikirdir. Diğer tüm durumlarda, aşağıdaki gibi mantıksal olarak bölünmüş birkaç dosyaya sahip olmak daha iyi olacaktır:

* `main.tf` - tüm kaynakları oluşturmak için modülleri, yerelleri ve veri kaynaklarını çağıran dosyadır.
* `variables.tf` - `main.tf`'de kullanılan değişkenlerin tanımlamalarını içerir.
* `outputs.tf` - `main.tf`'de oluşturulan kaynaklardan çıktıları içerir
* `versions.tf` - Terraform ve sağlayıcılar için sürüm gereksinimlerini içerir

`terraform.tfvars` [kompozisyon](https://www.terraform-best-practices.com/tr/key-concepts#composition) dışında hiçbir yerde kullanılmamalıdır.

{% hint style="info" %}
Aşağıdaki örneklerde kullanıldığı şekliyle kaynak modülü, altyapı modülü ve kompozisyon gibi temel kavramları anladığınızdan lütfen emin olun.
{% endhint %}

* Daha az sayıda kaynakla çalışmak daha kolay ve hızlıdır
  * `terraform plan` ve `terraform apply`, kaynakların durumunu doğrulamak için bulut API istekleri yapar
  * Tüm altyapınız tek bir kompozisyondaysa bu biraz zaman alabilir.
* Patlama çapı (güvenlik ihlali durumunda) daha az kaynakla daha küçüktür
  * Birbiriyle ilgisi olmayan kaynakları ayrı bileşimlere yerleştirerek birbirinden yalıtmak, bir şeyler ters giderse oluşacak sorun riskini azaltır.
* Projenizdi endirekt durum kullanarak başlatın çünkü
  * Dizüstü bilgisayarınız, altyapınızın kaynaklarını barındırmak için için doğru bir yer değil.
  * Git'te bir `tfstate` dosyasını yönetmek kabustur.
  * Daha sonra altyapı katmanları birden çok yönde (bağımlılık veya kaynak sayısı) büyümeye başladığında, işleri kontrol altında tutmak daha kolay olacaktır.
* Tutarlı bir yapı ve [adlandırma](https://www.terraform-best-practices.com/tr/naming) kuralı uygulayın:
  * Prosedürel kod gibi, Terraform kodu da insanların okuyabilmesi için yazılmalıdır, bundan altı ay sonra değişiklikler olduğunda tutarlılık yardımcı olacaktır.
  * Kaynakları Terraform durum dosyasında taşımak mümkündür ancak tutarsız yapı ve adlandırmalarınız varsa bunu yapmak daha zor olabilir.
* Kaynak modüllerini olabildiğince sade tutun.
* Değişken olarak iletilebilecek veya veri kaynakları kullanılarak keşfedilebilecek değerleri sabit kodlamayın.
* Veri kaynaklarını ve `terraform_remote_state'i` özellikle kompozisyon içindeki altyapı modülleri arasında bir tutkal olarak kullanın

Bu kitapta, örnek projeler karmaşıklığa göre gruplandırılmıştır - küçük ölçekli yapılardan en büyüğene. Bu ayrım kesin çizgilerle ayrılmamıştır, bu nedenle diğer yapılara da göz gezdirmeniz iyi olacaktır.

Küçük bir altyapıya sahip olmak, az sayıda bağımlılık ve az kaynak olduğu anlamına gelir. Proje büyüdükçe, Terraform konfigürasyonlarının büyümesi ve bağımlılıklarının artmasıyla, farklı altyapı modülleri birbirine bağlama ve bir kompozisyon içindeki değerleri geçirme ihtiyacı ortaya çıkması kaçınılmazdır.

Geliştiricilerin kullandığı en az 5 farklı düzenleme çözümünden söz edebiliriz:

1. Terraform. Çok basit, geliştiricilerin işi halletmek için yalnızca Terraform'u bilmesi gerekiyor.
2. Terragrunt. Tüm altyapıyı düzenlemek ve bağımlılıkları işlemek için kullanılabilen saf düzenleme aracı. Terragrunt, altyapı modülleri ve kompozisyonları ile kendi makinenizde çalışır, böylece kod tekrarını azaltır.
3. Şirket içi scriptler. Genellikle bu, düzenlemeye yönelik bir başlangıç noktası olarak ve Terragrunt'ı keşfetmeden önce olur.
4. Ansible veya benzeri genel amaçlı otomasyon aracı. Genellikle Ansible'dan sonra Terraform benimsendiğinde veya Ansible UI aktif olarak kullanıldığında kullanılır.
5. Crossplane ve Kubernetes'ten ilham alan diğer çözümler. Bazen, Terraform konfigürasyonlarınızın istenen durumunu elde etmek için Kubernetes ekosistemini kullanmak ve bir mutabakat döngüsü özelliği kullanmak mantıklıdır. Daha fazla bilgi için Crossplane vs Terraform videosunu izleyin.

Bunları akılda tutarak, bu kitap bu proje yapılarının ilk ikisini, sadece Terraform ve Terragrunt hakkında bilgi içermektedir.

Bir sonraki bölümde [Terraform](https://www.terraform-best-practices.com/tr/examples/terraform) veya [Terragrunt](https://www.terraform-best-practices.com/tr/examples/terragrunt) için kod yapısı örneklerine gözatabilirsiniz.

---

## მოგესალმებით!

**URL:** https://www.terraform-best-practices.com/ka/readme.md

**Contents:**
- სპონსორები
- თარგმანები
- კონტრიბუცია
- ავტორები
- ლიცენზია

[Terraform](https://www.terraform.io) არის ერთერთი ძლიერი (თუ არა დღესდღეისობით ყველაზე ძლიერი) და ერთერთი ყველაზე ხშირად გამოყენებადი ხელსაწყო რომელიც გაძლევთ საშუალებას მართოთ ინფრასტრუქტურა როგორც კოდი (IaC). ის საშუალებას გაძლევთ შექმნათ სხვადასხვა რესურსები და არ ზღუდავს მათ ინტეგრაციასა და მხარდაჭერაში.

ამ წიგნში აღწერილი ზოგიერთი ინფორმაცია შეიძლება არ ჩანდეს საუკეთესო პრაქტიკად. მე ვიცი ეს, ვეხმარები მკითხველს გამიჯნოს თუ რა არის საუკეთესო პრაქტიკა და რა არის კიდევ ერთი გზა ამის გამეორებისა.

ამ წიგნის შექმნა დაიწყო მზიან მადრიდში 2018 წელს და ის ხელმისაწვდომია შემდეგ მისამართზე: [https://www.terraform-best-practices.com/](https://www.terraform-best-practices.com).

წლების შემდეგ ის განახლდა უფრო აქტუალური პრაქტიკები რომლებიც ხელმისაწვდომი გახდა Terraform 1.0-ის შემდეგ. საბოლოოდ, ეს წიგნი შეიცავს უდაოდ ყველაზე საუკეთესო პრაქტიკებსა და რეკომენდაციებს Terraform-ის მომხმარებლებისათვის.

Please [contact me](https://github.com/antonbabenko/terraform-aws-devops#social-links) if you want to become a sponsor.

| [![](https://2052121379-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FDyguS0uZfMW7X7m9BWx1%2Fuploads%2Fgit-blob-a20cbce63c68eb37bae050e948606a3a24b58238%2Fctf-logo.png?alt=media)](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) | [Compliance.tf](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) — Terraform Compliance Simplified. Make your Terraform modules compliance-ready. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![](https://github.com/antonbabenko/terraform-best-practices/blob/ka/.gitbook/assets)](https://www.terraform-best-practices.com/ka/readme)                                                                                                                                            | —                                                                                                                                                                             |

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/>" %}
[العربية (Arabic)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/>" %}
[Bosanski (Bosnian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/>" %}
[Português (Brazilian Portuguese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/>" %}
[English](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/6shyPtr2KrqW4ANbFXYg/>" %}
[Français (French)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/6shyPtr2KrqW4ANbFXYg/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/>" %}
[Deutsch (German)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5c1kFpqxaDZC2g9e6rtT/>" %}
[ελληνικά (Greek)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5c1kFpqxaDZC2g9e6rtT/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/4bq6CyY8vYiEHkjN63rT/>" %}
[עברית (Hebrew)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/4bq6CyY8vYiEHkjN63rT/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/>" %}
[हिंदी (Hindi)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/>" %}
[Bahasa Indonesia (Indonesian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/>" %}
[Italiano (Italian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/>" %}
[日本語 (Japanese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/>" %}
[ಕನ್ನಡ (Kannada)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/>" %}
[한국어 (Korean)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/>" %}
[Polski (Polish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/sFM1GW5TPCGsskQ03mTm/>" %}
[Română (Romanian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/sFM1GW5TPCGsskQ03mTm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/>" %}
[简体中文 (Simplified Chinese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/>" %}
[Español (Spanish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/>" %}
[Türkçe (Turkish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/>" %}
[Українська (Ukrainian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/>" %}
[اردو (Urdu)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/)
{% endcontent-ref %}

დამეკონტაქტეთ თუ გსურთ დახმარება გამიწიოთ ამ წიგნის თარგმნაში სხვა ენაზე.

მსურს ყოველთვის მივიღო უკუკავშირი და ახალი იდეები საზოგადოებისგან რაც მომცემს საშუალებას განვაახლო წიგნი დროდადრო.

თუ დაინტერესებული ხართ კონკრეტული საკითხებით, გახსენით ან მონიშნეთ [issue](https://github.com/antonbabenko/terraform-best-practices/issues), რომელიც გსურთ რომ უფრო დეტალურად იქნას განხილული. თუ გაქვთ კონტექნი კონკრეტული მიმართულებით რომელიც გსურთ რომ გააზიაროთ, დაწერეთ და გააკეთეთ pull-request (ამ ეტაპზე არ არის აუცილებელი იდეალურად დაწერილი ტექსტი გქონდეთ).

ეს წიგნი შექმნილია[ ანტონ ბაბენკოს](https://github.com/antonbabenko), სხვადასხვა კონტრიბუტორებისა და მთარგმნელების მიერ.

ეს ნამუშევარი გახლავთ Apache 2 License-ის ქვეშ. იხილეთ LICENSE მეტი ინფორმაციისთვის.

ამ წიგნში მოცემულ ინფორმაციის ვალიდურობაზე მისი ავტორები და კონტრიბუტორები ვერ მოგცემენ გარანტიას. გთხოვთ გაითვალისწინოთ რომ, ამ წიგნში მოყვანილი ინფორმაციას ვრცელდება უფასოდ, არანაირი ხელშეკრულება ან კონტრაქტი არ არსებობს თქვენსა და ამ კონტენტთან/პროექტთან ნებისმიერ ასოცირებულ პირს შორის.ავტორები და კონტრიბუტორები არ იღებენ და ამით უარს აცხადებენ პასუხისმგებლობაზე რომელიმე მხარის წინაშე ნებისმიერი დანაკარგის, დაზიანების ან შეფერხების გამო, რომელიც გამოწვეულია ამ კონტენტში შემავალ, ასოცირებულ ან დაკავშირებულ ინფორმაციაში შეცდომით ან უმოქმედობით, მიუხედავად იმისა, ასეთი შეცდომები ან გამოტოვებები გამოწვეულია დაუდევრობისა, უბედური შემთხვების ან სხვა მიზეზით.

Copyright © 2018-2022 ანტონ ბაბენკო.

---

## Сілтемелер

**URL:** https://www.terraform-best-practices.com/kk/references.md

{% hint style="info" %}
There are a lot of people who create great content and manage open-source projects relevant to the Terraform қауымдастығына қатысты керемет контент жасайтын және ашық бастапқы кодты жобаларды жүргізетін адамдар өте көп, бірақ [awesome-terraform](https://github.com/shuaibiyy/awesome-terraform). сияқты тізімдерді көшірместен, бұл сілтемелерді осында тізімдеудің ең жақсы құрылымын ойластыра алмадым.
{% endhint %}

<https://x.com/i/lists/1042729226057732096> - Terraform-мен өте белсенді жұмыс істейтін және сізге көп нәрсе айтып бере алатын адамдар тізімі (егер олардан сұрасаңыз).

<https://www.hashicorp.com/ambassador/directory?products=Terraform> - Контент, іс-шаралар және ашық ынтымақтастық арқылы Terraform бойынша білімдерін белсенді бөлісетін жеке тұлғалар

<https://github.com/shuaibiyy/awesome-terraform> - HashiCorp Terraform бойынша ресурстардың іріктелген тізімі.

<http://bit.ly/terraform-youtube> - Антон Бабенконың "Your Weekly Dose of Terraform" YouTube арнасы. Шолулар, сұхбаттар, сұрақ-жауап (Q\&A), live coding және Terraform-мен түрлі эксперименттер жүргізілетін тікелей трансляциялар.

<https://weekly.tf> - Terraform Weekly ақпараттық бюллетені. Антон Бабенко ұсынатын Terraform әлеміндегі түрлі жаңалықтар (жобалар, хабарландырулар, талқылаулар).

---

## Références

**URL:** https://www.terraform-best-practices.com/fr/references.md

{% hint style="info" %}
Il y a beaucoup de gens qui créent un excellent contenu et gèrent des projets open source pertinents pour la communauté Terraform, mais je ne peux pas penser à la meilleure structure pour obtenir ces liens répertoriés ici sans copier des listes comme [awesome-terraform](https://github.com/shuaibiyy/awesome-terraform).
{% endhint %}

<https://twitter.com/antonbabenko/lists/terraform-experts> - Liste des personnes qui travaillent très activement avec Terraform et qui peuvent vous en dire beaucoup (si vous leur demandez).

<https://github.com/shuaibiyy/awesome-terraform> - Liste organisée de ressources sur Terraform de HashiCorp.

<http://bit.ly/terraform-youtube> - "Your Weekly Dose of Terraform" chaine YouTube par Anton Babenko. Live avec des critiques, des interviews, des questions-réponses, du codage en direct et du hacking avec Terraform.

<https://weekly.tf> - Infolettre hebdomadaire avec Terraform. Diverses actualités dans le monde Terraform (projets, annonces, discussions) par Anton Babenko.

---

## Vježba

**URL:** https://www.terraform-best-practices.com/ba/workshop.md

Ukoliko zelite vježbati neke od stvari opisanih u ovom upustvu pogledajte link ispod na kojem cete pronaci workshop za vježbu.

Workshop za vježbu je dostupna na sljedecem linku - <https://github.com/antonbabenko/terraform-best-practices-workshop>

---

## 代码结构

**URL:** https://www.terraform-best-practices.com/zh/code-structure.md

**Contents:**
- 我应该如何构建我的 Terraform 配置？
- 开始了解 Terraform 配置的结构
- 如何考虑 Terraform 配置结构？
  - 结构化代码的常见建议
  - 基础架构模块和组合的编排

有关Terraform代码结构的问题是社区中迄今为止最常见的问题。 每个人都在某个时候考虑过项目的最佳代码结构。

这是一个有很多解决方案的问题之一，很难给出通用的建议，所以让我们从理解我们正在处理什么开始。

* 你的项目有多复杂？
  * 相关resources（资源）数量
  * Terraform 提供商的数量（参见下面关于“逻辑提供者”的注释）
* 你的基础架构多久更改一次？
  * **从**每月/每周/每天一次
  * **到**连续（每次有新提交时）
* 代码更改发起者？ 当一个新的*artifact（*&#x6784;件）生成时，是否让 CI 服务器更新存储库？
  * 只有开发人员可以推送到基础架构存储库
  * 每个人都可以通过打开 PR（包括在 CI 服务器上运行的自动化任务）来提出对任何事物的更改
* 你使用哪种部署平台或部署服务？
  * AWS CodeDeploy、Kubernetes 或 OpenShift 需要稍微不同的方法
* 环境如何分组？
  * 按环境、地区、项目

{% hint style="info" %}
*Logical providers（逻辑提供商）*&#x5B8C;全在 Terraform 的逻辑中工作，并且通常不与任何其他服务交互，因此我们可以将它们的复杂性视为 O(1)。 最常见的逻辑提供商包括 [random](https://registry.terraform.io/providers/hashicorp/random/latest/docs), [local](https://registry.terraform.io/providers/hashicorp/local/latest/docs), [terraform](https://www.terraform.io/docs/providers/terraform/index.html), [null](https://registry.terraform.io/providers/hashicorp/null/latest/docs), [time](https://registry.terraform.io/providers/hashicorp/time/latest).
{% endhint %}

当开始或编写示例代码时，将所有代码放在 `main.tf`中是一个好主意。 在所有其他情况下，最好将多个文件按逻辑拆分，如下所示：

* `main.tf` - 调用modules（模块）、locals（本地）和data sources（数据源）来创建所有资源
* `variables.tf` - 包含在`main.tf` 中使用的变量声明
* `outputs.tf` - 包含在 `main.tf`中创建的资源的输出
* `versions.tf` - 包含 Terraform 和提供商的版本要求

`terraform.tfvars` 不应在除[composition](https://www.terraform-best-practices.com/zh/key-concepts#composition)（组合）之外的任何地方使用。

{% hint style="info" %}
&#x20;请确保您了解核心概念 - [resource module](https://www.terraform-best-practices.com/zh/key-concepts#resource-module)（资源模块），[infrastructure module](https://www.terraform-best-practices.com/zh/key-concepts#infrastructure-module)（基础设施模块），和 [composition](https://www.terraform-best-practices.com/zh/key-concepts#composition)（组合）， 因为它们在以下示例中使用。
{% endhint %}

* 使用更少的资源可以更轻松、更快速地进行工作
  * `terraform plan` 和 `terraform apply` 都调用 cloud API 来验证资源状态
  * 如果你的整个基础设施都在一个组合中，这可能需要一些时间
* 资源越少，爆炸半径（A blast radius）就越小
  * 通过将不相关的资源放置在单独的组合中以进行隔离，可以降低如果出现问题时的风险
* 使用远程状态启动您的项目，因为：
  * 你的笔记本电脑不是基础设施代码真实来源的合适位置
  * 在 git 中管理`tfstate`文件是一场噩梦
  * 当基础设施层开始朝多个方向（依赖项或资源数量）增长时，将更容易控制事物
* 实践一致的结构和 [naming](https://www.terraform-best-practices.com/zh/naming) convention（命名约定）：
  * 与procedural code（过程式代码）一样，Terraform 代码应该首先编写供人们阅读。当六个月后发生变化时，一致性将有所帮助
  * 可以在 Terraform 状态文件中移动资源，但如果结构和命名不一致，则可能更难做到
* 保持资源模块尽可能简单
* 不要将可以作为变量传递或使用数据源(data sources)发现的值硬编码
* 专门使用data sources(数据源)和`terraform_remote_state` 作为composition（组合）中基础设施模块之间的粘合剂&#x20;

在本书中，示例项目按*复杂性*分组 —— 从小型到超大型基础设施。这种分离并不严格，因此还要检查其他结构。

拥有小型基础设施意味着存在少量依赖项和资源。 随着项目的增长，链接 Terraform 配置的执行、连接不同的基础设施模块以及在组合中传递值的需求变得显而易见。

开发人员使用的编排解决方案至少有5个不同的群体:

1. 仅限Terraform。 非常简单，开发人员只需了解 Terraform 即可完成工作。
2. Terragrunt。 纯编排工具，可用于编排整个基础架构以及处理依赖项。 Terragrunt 原生地操作基础设施模块和组合，因此它减少了代码重复。
3. In-house scripts（内部脚本）。 通常，这发生在编排的起点和发现 Terragrunt 之前。
4. Ansible 或类似的通用自动化工具。通常在 Ansible 之后采用 Terraform 时使用，或者在积极使用 Ansible UI 时使用。&#x20;
5. [Crossplane](https://crossplane.io/) 和其他受 Kubernetes 启发的解决方案。有时，利用 Kubernetes 生态系统并采用reconciliation loop（协调循环）功能来实现 Terraform 配置的所需状态是有意义的。 观看视频[Crossplane vs Terraform](https://www.youtube.com/watch?v=ELhVbSdcqSY)了解更多信息。

考虑到这一点，本书回顾了这些项目结构中的前两个，即仅使用Terraform和Terragrunt。

请参阅下一章中 [Terraform](https://www.terraform-best-practices.com/zh/examples/terraform) 或 [Terragrunt](https://www.terraform-best-practices.com/zh/examples/terragrunt) 的代码结构示例。

---

## عمومی سوالات

**URL:** https://www.terraform-best-practices.com/ur/faq.md

**Contents:**
- یہاں کچھ ٹولز ہیں جن کے بارے میں آپ کو آگاہ ہونا چاہیے اور ٹیرافارم کے ساتھ کام کرتے وقت استعمال کرنے پر غور کرنا چاہیے
- ماڈیولز کے ساتھ انحصار کی مشکل کا حل کیا ہوتا ہے؟

* [Terragrunt ](https://terragrunt.gruntwork.io/)- آرکیسٹریشن ٹول&#x20;
* [tflint](https://github.com/terraform-linters/tflint) - کوڈ لنٹر&#x20;
* [tfenv](https://github.com/tfutils/tfenv) - ورژن منیجر&#x20;
* [Atlantis](https://www.runatlantis.io/) - پل پریس کی آٹومیشن&#x20;
* [pre-commit-terraform](https://github.com/antonbabenko/pre-commit-terraform) - ٹیرافارم کی ساتھ استعمال کرنے والے [پری-کمٹ فریم ورک](https://pre-commit.com/) کے لئے گٹ ہکس کا مجموعہ&#x20;
* [Infracost](https://www.infracost.io/) - **پل کی درخواستوں میں ٹیرافارم کے لیے کلاؤڈ لاگت کا تخمینہ۔ ٹیراگرنٹ، اٹلانٹس اور پری کمٹ ٹیرافارم کے ساتھ بھی کام کرتا ہے۔**

مواد اور زیریں ماڈیول کی ورژنز کو وضاحت سے ذکر کرنا چاہئیں۔ Providers کو ماڈیول کے باہر تشکیل دینا چاہئیں، مگر صرف ترتیب میں providers **اور ٹیرا فارم کی ورژنز کو بھی بند کرسکتے ہیں۔**

&#x20;کوئی ماسٹر ڈیپنڈنسی منجمنٹ ٹول نہیں ہے۔، مگر انحصار کو کم پریشانی والی بنانے کے لئے کچھ مشورے ہیں۔ مثال کے طور پر، [Dependabot](https://dependabot.com/) **کو ڈیپنڈنسی اپ ڈیٹس کو خود بخود کرنے کے لئے استعمال کیا جا سکتا ہے۔** Dependabot آپ کی ڈیپنڈنسیوں کو محفوظ اور up-to-date رکھنے کے لئے pull requests **کھولتا  ہے۔** Dependabot **ٹیرا فارم کنفیگریشن کو بھی معاونیت پہنچاتا ہے۔**

---

## नामकरण की परंपरा

**URL:** https://www.terraform-best-practices.com/hi/naming.md

**Contents:**
- सामान्य सम्मेलन
- संसाधन और डेटा स्रोत तर्क
- &#x20;`resource` कोड के उदाहरण
  - &#x20;  `count` / `for_each` का उपयोग
  - `tags` का स्थानन
  - Conditions in `count`
- चर(Variables)
- उत्पादन
  - कोड के उदाहरण `output`
  - बहुवचन नाम का प्रयोग करें यदि रिटर्निंग मान एक सूची है

{% hint style="info" %}
कम से कम इन सम्मेलनों का पालन न करने का कोई कारण नहीं होना चाहिए :)
{% endhint %}

{% hint style="info" %}
सावधान रहें कि वास्तविक क्लाउड संसाधनों में अक्सर अनुमत नामों पर प्रतिबंध होते हैं। उदाहरण के लिए, कुछ संसाधनों में डैश नहीं हो सकते, कुछ में ऊंट-आवरण होना चाहिए। इस पुस्तक में सम्मेलन स्वयं टेराफॉर्म नामों का उल्लेख करते हैं।
{% endhint %}

1. हर जगह - (डैश) के बजाय \_ (अंडरस्कोर) का उपयोग करें (संसाधन नाम, डेटा स्रोत नाम, चर नाम, आउटपुट आदि में)
2. लोअरकेस अक्षरों और संख्याओं का उपयोग करना पसंद करें (भले ही UTF-8 समर्थित हो)।

1. संसाधन नाम में संसाधन प्रकार को न दोहराएं (आंशिक रूप से नहीं, न ही पूरी तरह से):

{% hint style="success" %}

{% hint style="danger" %}

{% hint style="danger" %}

1. यदि कोई और वर्णनात्मक और सामान्य नाम उपलब्ध नहीं है, या यदि संसाधन मॉड्यूल इस प्रकार का एकल संसाधन बनाता है, तो संसाधन नाम को इसका नाम दिया जाना चाहिए (eg, in [AWS VPC module](https://github.com/terraform-aws-modules/terraform-aws-vpc) प्रकार का एक ही संसाधन है `aws_nat_gateway` और प्रकार के कई संसाधन type`aws_route_table`, इसलिए `aws_nat_gateway`नाम दिया जाना चाहिए `this` तथा`aws_route_table` अधिक वर्णनात्मक नाम होने चाहिए - जैसे `private`, `public`, `database`).
2. नामों के लिए हमेशा एकवचन संज्ञा का प्रयोग करें।
3. उपयोग - तर्कों के अंदर मूल्यों और उन जगहों पर जहां मूल्य मानव के सामने आ जाएगा (eg, inside DNS name of RDS instance).
4. संसाधन या डेटा स्रोत ब्लॉक के अंदर तर्क count / for\_each को शीर्ष पर पहले तर्क के रूप में शामिल करें और इसके बाद न्यूलाइन द्वारा अलग करें।
5. तर्क `tags` शामिल करें, यदि संसाधन द्वारा समर्थित है, तो अंतिम वास्तविक तर्क के रूप में, यदि आवश्यक हो तो `depends_on` and `lifecycle` के बाद। इन सभी को एक खाली लाइन से अलग किया जाना चाहिए।&#x20;
6. एक तर्क में शर्तों का उपयोग करते समय `count` / `for_each` उपयोग करने के बजाय बूलियन मान पसंद करें `length` या अन्य भाव.

{% hint style="success" %}
{% code title="main.tf" %}

{% endcode %}
{% endhint %}

{% hint style="danger" %}
{% code title="main.tf" %}

{% endcode %}
{% endhint %}

{% hint style="success" %}
{% code title="main.tf" %}

{% endcode %}
{% endhint %}

{% hint style="danger" %}
{% code title="main.tf" %}

{% endcode %}
{% endhint %}

{% hint style="success" %}
{% code title="outputs.tf" %}

{% endcode %}
{% endhint %}

1. संसाधन मॉड्यूल में पहिया का पुन: आविष्कार न करें: जिस संसाधन के साथ आप काम कर रहे हैं, उसके लिए "तर्क संदर्भ" अनुभाग में परिभाषित चर के लिए नाम, विवरण और डिफ़ॉल्ट मान का उपयोग करें।&#x20;
2. चरों में सत्यापन के लिए समर्थन सीमित है (उदाहरण के लिए अन्य चरों तक नहीं पहुंच सकते हैं या लुकअप नहीं कर सकते हैं)। तदनुसार योजना बनाएं क्योंकि कई मामलों में यह सुविधा बेकार है।&#x20;
3. एक चर नाम में बहुवचन रूप का प्रयोग करें जब प्रकार list(...) or map(...) हो।&#x20;
4. इस तरह एक चर ब्लॉक में आदेश कुंजी:description , type, default, validation.
5. हमेशा सभी चरों पर विवरण शामिल करें, भले ही आपको लगता है कि यह स्पष्ट है (आपको भविष्य में इसकी आवश्यकता होगी)।&#x20;
6. जब तक आपको प्रत्येक कुंजी पर सख्त बाधाओं की आवश्यकता न हो, तब तक साधारण प्रकार(number, string, list(...), map(...), any) कोई भी) विशिष्ट प्रकार जैसे object() का उपयोग करना पसंद करें।&#x20;
7. यदि मानचित्र के सभी तत्वों का एक ही प्रकार (जैसे string) है या इसमें परिवर्तित किया जा सकता है (जैसे संख्या प्रकार को स्ट्रिंग में परिवर्तित किया जा सकता है) तो मानचित्र like map(map(string)) जैसे विशिष्ट प्रकारों का उपयोग करें।&#x20;
8. एक निश्चित गहराई से शुरू होने वाले प्रकार सत्यापन को अक्षम करने के लिए या जब कई प्रकारों का समर्थन किया जाना चाहिए, तो टाइप करें का उपयोग करें।&#x20;
9. मान {} कभी-कभी एक नक्शा होता है लेकिन कभी-कभी एक वस्तु। नक्शा बनाने के लिए tomap(...) का उपयोग करें क्योंकि कोई वस्तु बनाने का कोई तरीका नहीं है।

उत्पादन को उसके दायरे के बाहर संगत और समझने योग्य बनाएं (जब कोई उपयोगकर्ता मॉड्यूल का उपयोग कर रहा हो तो यह स्पष्ट होना चाहिए कि यह किस प्रकार और मूल्य का गुण लौटाता है)।

1. आउटपुट का नाम उस संपत्ति का वर्णन करना चाहिए जिसमें यह शामिल है और सामान्य रूप से जितना आप चाहते हैं उससे कम फ्री-फॉर्म होना चाहिए
2. आउटपुट के नाम के लिए अच्छी संरचना दिखती है `{name}_{type}_{attribute}` , जहां:
   1. `{name}` प्रदाता उपसर्ग के बिना संसाधन या डेटा स्रोत का नाम है। `{name}` for `aws_subnet` is `subnet`, for`aws_vpc` it is `vpc`.
   2. `{type}` संसाधन स्रोतों का एक प्रकार है
   3. `{attribute}` आउटपुट द्वारा लौटाई गई एक विशेषता है
   4. [See examples](#code-examples-of-output).
3. यदि आउटपुट प्रक्षेप कार्यों और कई संसाधनों के साथ एक मान लौटा रहा है, `{name}` and `{type}` जितना संभव हो उतना सामान्य होना चाहिए (`this` as prefix should be omitted). [See example](#code-examples-of-output).
4. यदि लौटाया गया मान एक सूची है तो उसका बहुवचन नाम होना चाहिए। [See example](#use-plural-name-if-the-returning-value-is-a-list).
5. हमेशा सभी आउटपुट के लिए विवरण  `description` शामिल करें भले ही आपको लगता है कि यह स्पष्ट है.
6. जब तक आप सभी मॉड्यूल में सभी जगहों पर इस आउटपुट के उपयोग को पूरी तरह से नियंत्रित नहीं करते तब तक संवेदनशील  `sensitive` तर्क सेट करने से बचें।
7. Prefer `try()` (available since Terraform 0.13) over `element(concat(...))` (legacy approach for the version before 0.13)

सुरक्षा समूह की अधिकतम एक आईडी पर लौटें:

{% hint style="success" %}
{% code title="outputs.tf" %}

{% endcode %}
{% endhint %}

एक ही प्रकार के कई संसाधन होने पर, इसे आउटपुट के नाम से हटा दिया जाना चाहिए:

{% hint style="danger" %}
{% code title="outputs.tf" %}

{% endcode %}
{% endhint %}

{% hint style="success" %}
{% code title="outputs.tf" %}

{% endcode %}
{% endhint %}

**Examples:**

Example 1 (unknown):
```unknown
`resource "aws_route_table" "public" {}`
```

Example 2 (unknown):
```unknown
`resource "aws_route_table" "public_route_table" {}`
```

Example 3 (unknown):
```unknown
`resource "aws_route_table" "public_aws_route_table" {}`
```

Example 4 (hcl):
```hcl
resource "aws_route_table" "public" {
  count = 2

  vpc_id = "vpc-12345678"
  # ... remaining arguments omitted
}

resource "aws_route_table" "private" {
  for_each = toset(["one", "two"])

  vpc_id = "vpc-12345678"
  # ... remaining arguments omitted
}
```

---

## SSS

**URL:** https://www.terraform-best-practices.com/tr/faq.md

**Contents:**
- Farkında olmam ve kullanmayı düşünmem gereken araçlar nelerdir?
- Modüllerle bağımlılık cehennemine (dependency hell) çözümler nelerdir?

* [**Terragrunt**](https://terragrunt.gruntwork.io/) - Yönetim aracı
* [**tflint**](https://github.com/terraform-linters/tflint) - Statik kod analiz aracı
* [**tfenv**](https://github.com/tfutils/tfenv) - Versiyon yönetimi
* [**Atlantis**](https://www.runatlantis.io/) - Pull Request otomasyonu
* [**pre-commit-terraform**](https://github.com/antonbabenko/pre-commit-terraform) - pre-commit'lerde kullanılabilecek git hooklarının birleşimi olan bir framework.
* [**Infracost**](https://www.infracost.io) - Pull requestlerde Terraform için bulut maliyet tahminleri. Terragrunt, Atlantis ve pre-commit-terraform ile de çalışır.

Kaynak ve altyapı modüllerinin sürümleri belirtilmelidir. Sağlayıcılar, modüllerin dışında, ancak yalnızca bileşimde yapılandırılmalıdır. Sağlayıcıların sürümü ve Terraform da kilitlenebilir.

Ana bağımlılık yönetimi aracı yoktur, ancak bağımlılık belirtimlerini daha az sorunlu hale getirmek için bazı ipuçları vardır. Örneğin, [Dependabot](https://dependabot.com/), bağımlılık güncellemelerini otomatikleştirmek için kullanılabilir. Dependabot, bağımlılıklarınızı güvenli ve güncel tutmak için çekme istekleri oluşturur. Dependabot, Terraform konfigürasyonlarını destekler.

---

## ಆಗಾಗ್ಗೆ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)

**URL:** https://www.terraform-best-practices.com/kn/faq.md

**Contents:**
- ನಾನು ತಿಳಿದಿರಬೇಕಾದ ಮತ್ತು ಬಳಸಲು ಪರಿಗಣಿಸಬೇಕಾದ ಸಾಧನಗಳು ಯಾವುವು?
- ಮಾಡ್ಯೂಲ್‌ಗಳ [dependency hell](https://en.wikipedia.org/wiki/Dependency_hell) ಗೆ ಪರಿಹಾರಗಳು ಯಾವುವು?

* [<mark style="color:blue;">**ಟೆರಾಗ್ರಂಟ್**</mark>](https://terragrunt.gruntwork.io/) - ಆರ್ಕೆಸ್ಟ್ರೇಶನ್ ಸಾಧನ
* [**tflint**](https://github.com/terraform-linters/tflint) - ಕೋಡ್ ಲಿಂಟರ್
* [**tfenv**](https://github.com/tfutils/tfenv) - ವರ್ಷನ್ ಮ್ಯಾನೇಜರ್
* [<mark style="color:blue;">**ಅಟ್ಲಾಂಟಿಸ್**</mark>](https://www.runatlantis.io/) - ಪುಲ್ ರಿಕ್ವೆಸ್ಟ್ ಆಟೋಮೇಷನ್
* [**pre-commit-terraform**](https://github.com/antonbabenko/pre-commit-terraform) - [pre-commit framework](https://pre-commit.com/)ನೊಂದಿಗೆ ಬಳಸಲು ಟೆರಾಫಾರ್ಮ್‌ಗಾಗಿ git ಹುಕ್‌ಗಳ ಸಂಗ್ರಹ
* [**Infracost**](https://www.infracost.io) - ಪುಲ್ ರಿಕ್ವೆಸ್ಟ್ ಗಳಲ್ಲಿ ಟೆರಾಫಾರ್ಮ್‌ ಕ್ಲೌಡ್ ವೆಚ್ಚದ ಅಂದಾಜು. ಟೆರಾಗ್ರಂಟ್, ಅಟ್ಲಾಂಟಿಸ್ ಮತ್ತು ಪ್ರಿ-ಕಮಿಟ್-ಟೆರಾಫಾರ್ಮ್‌ನೊಂದಿಗೆ ಸಹ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.

ಸಂಪನ್ಮೂಲ ಮತ್ತು infrastructure ಮಾಡ್ಯೂಲ್‌ಗಳ version ಗಳನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸಬೇಕು. ಪೂರೈಕೆದಾರರನ್ನು ಮಾಡ್ಯೂಲ್‌ಗಳ ಹೊರಗೆ ಕಾನ್ಫಿಗರ್ ಮಾಡಬೇಕು, ಆದರೆ ಕಂಪೋಸಿಷನ್ ಗಳಲ್ಲಿ ಮಾತ್ರ. ಪೂರೈಕೆದಾರರ version ಮತ್ತು ಟೆರಾಫಾರ್ಮ್ ಅನ್ನು ಸಹ ಲಾಕ್ ಮಾಡಬಹುದು.

ಯಾವುದೇ ಮಾಸ್ಟರ್ ಡೆಪೆಂಡೆನ್ಸಿ ಮ್ಯಾನೇಜ್ಮೆಂಟ್ ಸಾಧನವಿಲ್ಲ, ಆದರೆ ಡೆಪೆಂಡೆನ್ಸಿ ಸ್ಪೆಸಿಫಿಕೇಷನ್ ಗಳ ಕ್ಲಿಷ್ಟತೆ ಕಡಿಮೆ ಮಾಡಲು ಕೆಲವು ಸಲಹೆಗಳಿವೆ. ಉದಾಹರಣೆಗೆ, ಡೆಪೆಂಡೆನ್ಸಿ updateಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತಗೊಳಿಸಲು [Dependabot](https://dependabot.com/) ಅನ್ನು ಬಳಸಬಹುದು. Dependabot ನಿಮ್ಮ ಡೆಪೆಂಡೆನ್ಸಿಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಮತ್ತು ಅಪ್-ಟು-ಡೇಟ್ ಆಗಿ ಇರಿಸಲು ಪುಲ್ ರಿಕ್ವೆಸ್ಟ್ ಗಳನ್ನು ರಚಿಸುತ್ತದೆ. Dependabot ಟೆರಾಫಾರ್ಮ್ ಸಂರಚನೆಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ.

---

## Καλώς ήρθατε

**URL:** https://www.terraform-best-practices.com/el/readme.md

**Contents:**
- Χορηγοί
- Μεταφράσεις
- Συνεισφορές
- Συγγραφείς
- Άδεια

Το [Terraform](https://www.terraform.io) είναι ένα πολύ ισχυρό εργαλείο (αν όχι το ισχυρότερο που υπάρχει αυτή τη στιγμή) και ένα από τα πιο συχνά χρησιμοποιούμενα εργαλεία που επιτρέπουν τη διαχείριση της υποδομής ως κώδικα. Επιτρέπει στους προγραμματιστές να κάνουν πολλά πράγματα και δεν τους περιορίζει στο να κάνουν πράγματα με τρόπους που θα είναι δύσκολο να υποστηριχθούν ή να ενσωματωθούν.

Ορισμένες πληροφορίες που περιγράφονται σε αυτό το βιβλίο μπορεί να μην φαίνονται ως οι βέλτιστες πρακτικές. Το γνωρίζω αυτό και για να βοηθήσω τους αναγνώστες να διαχωρίσουν ποιες είναι οι καθιερωμένες βέλτιστες πρακτικές και ποιος είναι απλώς ένας άλλος δογματικός τρόπος να γίνονται τα πράγματα, χρησιμοποιώ μερικές φορές υποδείξεις για να δώσω κάποιο πλαίσιο και εικονίδια για να προσδιορίσω το επίπεδο ωριμότητας σε κάθε υποενότητα που σχετίζεται με τις βέλτιστες πρακτικές.

Το βιβλίο ξεκίνησε στην ηλιόλουστη Μαδρίτη το 2018 και είναι διαθέσιμο δωρεάν στην διεύθυνση [https://www.terraform-best-practices.com/](https://www.terraform-best-practices.com).

Λίγα χρόνια αργότερα έχει ενημερωθεί με περισσότερες πραγματικές βέλτιστες πρακτικές που είναι διαθέσιμες με το Terraform 1.0. Τελικά, αυτό το βιβλίο θα πρέπει να περιέχει τις περισσότερες από τις αδιαμφισβήτητες βέλτιστες πρακτικές και συστάσεις για τους χρήστες του Terraform.

Please [contact me](https://github.com/antonbabenko/terraform-aws-devops#social-links) if you want to become a sponsor.

| [![](https://1788834857-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F5c1kFpqxaDZC2g9e6rtT%2Fuploads%2Fgit-blob-a20cbce63c68eb37bae050e948606a3a24b58238%2Fctf-logo.png?alt=media)](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) | [Compliance.tf](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) — Terraform Compliance Simplified. Make your Terraform modules compliance-ready. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![](https://github.com/antonbabenko/terraform-best-practices/blob/el/.gitbook/assets)](https://www.terraform-best-practices.com/el/readme)                                                                                                                                            | —                                                                                                                                                                             |

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/>" %}
[العربية (Arabic)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/>" %}
[Bosanski (Bosnian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/>" %}
[Português (Brazilian Portuguese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/>" %}
[English](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/6shyPtr2KrqW4ANbFXYg/>" %}
[Français (French)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/6shyPtr2KrqW4ANbFXYg/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/DyguS0uZfMW7X7m9BWx1/>" %}
[ქართული (Georgian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/DyguS0uZfMW7X7m9BWx1/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/>" %}
[Deutsch (German)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/4bq6CyY8vYiEHkjN63rT/>" %}
[עברית (Hebrew)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/4bq6CyY8vYiEHkjN63rT/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/>" %}
[हिंदी (Hindi)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/>" %}
[Bahasa Indonesia (Indonesian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/>" %}
[Italiano (Italian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/>" %}
[日本語 (Japanese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/>" %}
[ಕನ್ನಡ (Kannada)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/>" %}
[한국어 (Korean)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/>" %}
[Polski (Polish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/sFM1GW5TPCGsskQ03mTm/>" %}
[Română (Romanian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/sFM1GW5TPCGsskQ03mTm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/>" %}
[简体中文 (Simplified Chinese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/>" %}
[Español (Spanish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/>" %}
[Türkçe (Turkish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/>" %}
[Українська (Ukrainian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/>" %}
[اردو (Urdu)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/)
{% endcontent-ref %}

Επικοινωνήστε μαζί μου αν θέλετε να βοηθήσετε στη μετάφραση αυτού του βιβλίου σε άλλες γλώσσες.

Θέλω πάντα να λαμβάνω σχόλια και να ενημερώνω αυτό το βιβλίο καθώς η κοινότητα ωριμάζει και νέες ιδέες εφαρμόζονται και επαληθεύονται με την πάροδο του χρόνου.

Αν ενδιαφέρεστε για συγκεκριμένα θέματα, παρακαλώ ανοίξτε [ένα θέμα](https://github.com/antonbabenko/terraform-best-practices/issues) ή κάντε 'thumb up' σε ένα θέμα που θέλετε να καλυφθεί. Αν αισθάνεστε ότι **έχετε περιεχόμενο** και θέλετε να συνεισφέρετε, γράψτε ένα προσχέδιο και υποβάλετε ένα pull request (μην ανησυχείτε για τη συγγραφή καλού κειμένου σε αυτό το σημείο!).\\

Αυτό το βιβλίο συντηρείται από τον [Anton Babenko](https://github.com/antonbabenko) με τη βοήθεια διαφόρων συνεργατών και μεταφραστών.\\

Το έργο αυτό διατίθεται με άδεια Apache 2 License. Δείτε το LICENSE για πλήρεις λεπτομέρειες.

Οι συγγραφείς και οι συντελεστές αυτού του περιεχομένου δεν μπορούν να εγγυηθούν την εγκυρότητα των πληροφοριών που βρίσκονται εδώ. Βεβαιωθείτε ότι κατανοείτε ότι οι πληροφορίες που παρέχονται εδώ παρέχονται δωρεάν και ότι δεν δημιουργείται κανενός είδους συμφωνία ή σύμβαση μεταξύ εσάς και οποιουδήποτε προσώπου που σχετίζεται με αυτό το περιεχόμενο ή το έργο. Οι συγγραφείς και οι συντελεστές δεν αναλαμβάνουν και αποποιούνται με το παρόν κάθε ευθύνη έναντι οποιουδήποτε μέρους για οποιαδήποτε απώλεια, ζημία ή διαταραχή που προκαλείται από λάθη ή παραλείψεις στις πληροφορίες που περιέχονται στο παρόν περιεχόμενο, σχετίζονται με αυτό ή συνδέονται με αυτό, είτε τα εν λόγω λάθη ή παραλείψεις οφείλονται σε αμέλεια, ατύχημα ή οποιαδήποτε άλλη αιτία.

Copyright © 2018-2023 Anton Babenko.

---

## Konwencje nazewnictwa

**URL:** https://www.terraform-best-practices.com/pl/naming.md

**Contents:**
- Podstawowe zasady
- Zasoby i źródła danych
- Przykładowy kod zasobu (`resource`)
  - Użycie `count` / `for_each`
  - Umiejscowienie `tags`
  - Warunki w `count`
- Zmienne
- Dane wyjściowe
  - Przykłady poprawnego `output`
  - Użyj nazwy w liczbie mnogiej, jeśli wartością zwracaną jest lista

{% hint style="info" %}
Nie ma powodu, aby nie przestrzegać przynajmniej poniższych zasad :)
{% endhint %}

{% hint style="info" %}
Pamiętaj, że rzeczywiste zasoby często mają ograniczenia w dopuszczalnym nazewnictwie. Niektóre zasoby, na przykład nie mogą zawierać myślników. Inne zaś muszą być napisane z wykorzystaniem camelCase. Konwencje zawarte w tej książce odnoszą się tylko do samych nazw Terraform.
{% endhint %}

1. Wszędzie używaj `_` (podkreślenia) zamiast `-` (myślnika) (nazwy zasobów, nazwy źródeł danych, nazwy zmiennych, dane wyjściowe itp.).
2. Staraj się używać małych liter i cyfr (nawet jeśli obsługiwany jest kod UTF-8).

1. Nie powtarzaj typu zasobu w nazwie zasobu (ani częściowo, ani całkowicie):

<div data-gb-custom-block data-tag="hint" data-style="success" class="hint hint-success"><p><code>resource "aws_route_table" "public" {}</code></p></div>

<div data-gb-custom-block data-tag="hint" data-style="danger" class="hint hint-danger"><p><code>resource "aws_route_table" "public_route_table" {}</code></p></div>

<div data-gb-custom-block data-tag="hint" data-style="danger" class="hint hint-danger"><p><code>resource "aws_route_table" "public_aws_route_table" {}</code></p></div>
2. Nazwa zasobu powinna nazywać się `this`, jeśli nie ma bardziej opisowej i ogólnej nazwy, lub jeśli moduł zasobów tworzy pojedynczy zasób tego typu (np. w module [AWS VPC](https://github.com/terraform-aws-modules/terraform-aws-vpc) jest pojedynczy zasób typu `aws_nat_gateway` i wiele zasobów typu `aws_route_table`, więc `aws_nat_gateway` powinien nazywać się `this`, a `aws_route_table` powinny być nazwane opisowe - jak `private`, `public`, `database`.
3. Nazwy zawsze powinny być rzeczownikami w liczbie pojedynczej.
4. Używaj `-` wewnątrz wartości argumentów oraz w miejscach, w których wartość będą odczytywane przez człowiekowa (np. wewnątrz nazwy DNS instancji RDS).
5. Argumenty `count` lub `for_each` umieszczaj wewnątrz bloku zasobu lub źródła danych jako pierwszy argument u góry i oddzielaj go znakiem nowej linii.
6. Argument `tags`, jeśli jest obsługiwany przez zasób, umieszczaj jako ostatni , po którym następuje `depend_on` i `lifecycle`, jeśli to konieczne. Wszystkie te elementy powinny być oddzielone pojedynczym pustym wierszem.
7. Używając warunków logicznych przy argumencie `count` lub `for_each` stosuj wartości logiczne zamiast porównywania długości ciągu czy innych wyrażeń.

{% hint style="success" %}
{% code title="main.tf" %}

{% endcode %}
{% endhint %}

{% hint style="danger" %}
{% code title="main.tf" %}

{% endcode %}
{% endhint %}

{% hint style="success" %}
{% code title="main.tf" %}

{% endcode %}
{% endhint %}

{% hint style="danger" %}
{% code title="main.tf" %}

{% endcode %}
{% endhint %}

{% hint style="success" %}
{% code title="outputs.tf" %}

{% endcode %}
{% endhint %}

1. Nie próbuj na nowo wymyślać koła w modułach zasobów: użyj nazwy (`name`), opisu (`description`) i wartości domyślnej (`default`) dla zmiennych zgodnie z definicją w sekcji „Odniesienie do argumentów” ("Argument Reference") dla zasobu, z którym pracujesz.
2. Obsługa walidacji w zmiennych jest raczej ograniczona (np. brak dostępu do innych zmiennych lub wyszukiwania). Zawczasu planuj odpowiednie użycie, ponieważ w wielu przypadkach funkcja walidacji jest bezużyteczna.
3. Używaj liczby mnogiej w nazwie zmiennej, gdy jest ona listą (`list(...)`) lub mapą (`map(...)`) .
4. Uporządkuj klucze w bloku zmiennych w następujący sposób: opis (`description`), typ (`type`), wartość domyślna (`default`), walidacja (`validation`).
5. Zawsze dołączaj opis (`description`) do wszystkich zmiennych, nawet jeśli uważasz, że jest to oczywiste (przyda się w przyszłości).
6. Używaj prostych typów (`number`, `string`, `list(...)`, `map(...)`, `any`) zamiast określonego typu, takiego jak `object()`, chyba że musisz mieć ścisłą kontrolę nad każdym elementem.
7. Użyj określonych typów, np. `map(map(string))` jeśli wszystkie elementy mapy mają ten sam typ (np. `string` ) lub mogą być na niego przekonwertowane (np. typ `number` można przekonwertować na `string`).
8. Użyj `any`, aby ominąć walidację typu, gdy chcesz obsłużyć różne typy..
9. Wartość `{}` to czasami mapa, a czasami obiekt. Użyj `tomap(...)`, aby stworzyć mapę, ponieważ nie ma możliwości stworzenia obiektu.

Spraw, aby dane wyjściowe były spójne i zrozumiałe poza zakresem użycia (scope) (gdy użytkownik korzysta z modułu, powinno być oczywiste, jaki jest typ i atrybut zwracanej wartości).

1. Nazwa danych wyjściowych powinna opisywać właściwość, którą zawiera, i być bardziej ścisła niż standardowo.
2. Dobra struktura nazwy wyjścia wygląda tak: `{name}_{type}_{attribute}` , gdzie:
   1. `{name}` to nazwa zasobu lub źródła danych bez prefiksu dostawcy. `{name}` dla `aws_subnet` to `subnet`, a dla `aws_vpc` to `vpc`.
   2. `{type}` to rodzaj źródła zasobów.
   3. `{attribute}` to zwracany atrybut
   4. [Zobacz przykłady](#code-examples-of-output).
3. Jeśli zwracana jest wartość z funkcjami interpolacji i wieloma zasobami, `{name}` i `{type}` powinny być jak najbardziej ogólne (należy unikać prefiksu `this`). [Zobacz przykłady](#code-examples-of-output).
4. Jeśli zwracana wartość jest listą, powinna mieć nazwę w liczbie mnogiej. [Zobacz przykłady](#use-plural-name-if-the-returning-value-is-a-list).
5. Zawsze dołączaj opis (`description`) danych wyjściowych, nawet jeśli uważasz, że jest to oczywiste.
6. Unikaj użycia `sensitive`, chyba że w pełni kontrolujesz użycie tego wyjścia (danych wyjściowych) we wszystkich miejscach i we wszystkich modułach.
7. Stosuj `try()` (dostępne od Terraform 0.13) zamiast `element(concat(...))` (podejście starsze dla wersji przed 0.13)

Zwróć co najwyżej jeden identyfikator `security_group`:

{% hint style="success" %}
{% code title="outputs.tf" %}

{% endcode %}
{% endhint %}

W przypadku posiadania wielu zasobów tego samego typu, należy unikać `this` w nazwie wyjścia:

{% hint style="danger" %}
{% code title="outputs.tf" %}

{% endcode %}
{% endhint %}

{% hint style="success" %}
{% code title="outputs.tf" %}

{% endcode %}
{% endhint %}

**Examples:**

Example 1 (hcl):
```hcl
resource "aws_route_table" "public" {
  count = 2

  vpc_id = "vpc-12345678"
  # ... w celu uproszczenia pomijamy pozostałe argumenty
}

resource "aws_route_table" "private" {
  for_each = toset(["one", "two"])

  vpc_id = "vpc-12345678"
  # ... w celu uproszczenia pomijamy pozostałe argumenty
}
```

Example 2 (hcl):
```hcl
resource "aws_route_table" "public" {
  vpc_id = "vpc-12345678"
  count  = 2

  # ... w celu uproszczenia pomijamy pozostałe argumenty
}
```

Example 3 (hcl):
```hcl
resource "aws_nat_gateway" "this" {
  count = 2

  allocation_id = "..."
  subnet_id     = "..."

  tags = {
    Name = "..."
  }

  depends_on = [aws_internet_gateway.this]

  lifecycle {
    create_before_destroy = true
  }
}
```

Example 4 (hcl):
```hcl
resource "aws_nat_gateway" "this" {
  count = 2

  tags = "..."

  depends_on = [aws_internet_gateway.this]

  lifecycle {
    create_before_destroy = true
  }

  allocation_id = "..."
  subnet_id     = "..."
}
```

---

## Посилання

**URL:** https://www.terraform-best-practices.com/uk/references.md

{% hint style="info" %}
Є багато людей, які створюють чудовий контент і керують проектами з відкритим кодом, що мають відношення до спільноти Terraform, але я не можу думати про найкращу структуру, не згадавши посилання, перераховані тут, а також без копіювання списків, наприклад таких як [awesome-terraform](https://github.com/shuaibiyy/awesome-terraform).
{% endhint %}

<https://twitter.com/antonbabenko/lists/terraform-experts> - Список людей, які дуже активно працюють з Terraform і можуть багато розповісти (якщо їх запитати).

<https://github.com/shuaibiyy/awesome-terraform> - Кураторський список ресурсів на HashiCorp's Terraform.

<http://bit.ly/terraform-youtube> - YouTube-канал «Ваша щотижнева доза Terraform» від Антона Бабенка. Прямі трансляції з оглядами, інтерв’ю, запитаннями й відповідями, кодуванням у прямому ефірі та деякими лайф-хаками за допомогою Terraform.

<https://weekly.tf> - Terraform Weekly newsletter. Різні новини у світі Terraform (проекти, анонси, дискусії) від Антона Бабенка.

---

## कोड स्टाइलिंग

**URL:** https://www.terraform-best-practices.com/hi/code-styling.md

**Contents:**
- प्रलेखन
  - स्वचालित रूप से उत्पन्न दस्तावेज
  - terraform-docs
- साधन

{% hint style="info" %}

* उदाहरण और टेराफॉर्म मॉड्यूल में सुविधाओं की व्याख्या करने वाले दस्तावेज और उनका उपयोग कैसे करना चाहिए।&#x20;
* टेराफॉर्म रजिस्ट्री वेबसाइट को सही ढंग से दिखाने के लिए README.md फाइलों के सभी लिंक पूर्ण होने चाहिए।
* &#x20;दस्तावेज़ीकरण में  [mermaid](https://github.com/mermaid-js/mermaid) के साथ बनाए गए आरेख और [cloudcraft.co](https://cloudcraft.co) के साथ बनाए गए ब्लूप्रिंट शामिल हो सकते हैं।
* &#x20;यह सुनिश्चित करने के लिए [Terraform pre-commit hooks](https://github.com/antonbabenko/pre-commit-terraform) का उपयोग करें कि कोड मान्य है, ठीक से स्वरूपित है, और स्वचालित रूप से इसे git में धकेलने और मनुष्यों द्वारा समीक्षा करने से पहले प्रलेखित किया गया है।

[pre-commit](https://pre-commit.com/) बहु-भाषा प्री-कमिट हुक के प्रबंधन और रखरखाव के लिए एक ढांचा है। यह Python में लिखा गया है और एक गिट रिपॉजिटरी के लिए कोड प्रतिबद्ध होने से पहले एक डेवलपर की मशीन पर स्वचालित रूप से कुछ करने के लिए एक शक्तिशाली उपकरण है। आम तौर पर, इसका उपयोग लिंटर चलाने और कोड को प्रारूपित करने के लिए किया जाता है (see [supported hooks](https://pre-commit.com/hooks.html)).

टेराफॉर्म कॉन्फ़िगरेशन के साथ `pre-commit`  का उपयोग कोड को प्रारूपित करने और मान्य करने के साथ-साथ प्रलेखन को अपडेट करने के लिए किया जा सकता है.&#x20;

इसके साथ खुद को परिचित करने के लिए [pre-commit-terraform repository ](https://github.com/antonbabenko/pre-commit-terraform/blob/master/README.md)भंडार देखें, और मौजूदा भंडार (उदाहरण के लिए,  [terraform-aws-vpc](https://github.com/terraform-aws-modules/terraform-aws-vpc))) जहां यह पहले से ही उपयोग किया जाता है।&#x20;

[terraform-docs](https://github.com/segmentio/terraform-docs) एक ऐसा उपकरण है जो विभिन्न आउटपुट स्वरूपों में टेराफॉर्म मॉड्यूल से प्रलेखन तैयार करता है। आप इसे मैन्युअल रूप से चला सकते हैं (प्री-कमिट हुक के बिना), or use [pre-commit-terraform hooks](https://github.com/antonbabenko/pre-commit-terraform) दस्तावेज़ को स्वचालित रूप से अपडेट करने के लिए.

@todo: Document module versions, release, GH actions

1. [pre-commit framework homepage](https://pre-commit.com/)
2. [Collection of git hooks for Terraform to be used with pre-commit framework](https://github.com/antonbabenko/pre-commit-terraform)
3. Blog post by [Dean Wilson](https://github.com/deanwilson): [pre-commit hooks and terraform - a safety net for your repositories](https://www.unixdaemon.net/tools/terraform-precommit-hooks/)

---

## 参考文献

**URL:** https://www.terraform-best-practices.com/ja/references.md

{% hint style="info" %}
Terraformコミュニティに関連する素晴らしいコンテンツやオープンソースプロジェクトを作成・管理している人々は大勢いますが、[awesome-terraform](https://github.com/shuaibiyy/awesome-terraform)のような既存のコレクションをコピーすることなく、これらのリンクを掲載するための最適な構造を考えるのは難しいです。
{% endhint %}

<https://twitter.com/antonbabenko/lists/terraform-experts> - Terraformを非常に活発に使用しており、尋ねると多くのことを教えてくれる人々のリスト

<https://github.com/shuaibiyy/awesome-terraform> - HashiCorpのTerraformに関するキュレーションされたリソースのリスト

<http://bit.ly/terraform-youtube> - Anton Babenkoによる"Your Weekly Dose of Terraform"というYouTubeチャンネル。レビュー、インタビュー、Q\&A、ライブコーディング、そしてTerraformを使用したハッキングなどのライブストリームを提供しています。

<https://weekly.tf> - Anton Babenkoによる"Terraform Weekly"ニュースレター。Terraformの世界における様々なニュース（プロジェクト、アナウンス、ディスカッション）を提供しています。

---

## コード構造

**URL:** https://www.terraform-best-practices.com/ja/code-structure.md

**Contents:**
- Terraformの設定はどのように構造化すべきでしょうか？
- Terraformの設定の構造化を始めるにあたって
- Terraformの設定構造についての考え方
  - コードを構造化するための一般的な推奨事項
  - インフラモジュールと構成のオーケストレーション

Terraformのコード構造に関する質問は、コミュニティで最も頻繁に見られるものです。誰もが一度はプロジェクトの最適なコード構造について考えたことがあるでしょう。

これは多くの解決策が存在する質問の一つであり、普遍的なアドバイスを提供することは非常に難しいため、まず私たちが扱っているものを理解することから始めましょう。

* プロジェクトの複雑さはどの程度ですか？
  * 関連するリソースの数
  * Terraformプロバイダーの数 (下記の「論理的なプロバイダー」に関する注記を参照)
* インフラの変更頻度は？
  * 月1回/週1回/1日1回
  * 継続的 (新しいコミットがある度に毎回)
* 誰がコードを変更しますか？ 新しいアーティファクトがビルドされた時にCIサーバーがリポジトリを更新することを許可していますか？
  * 開発者のみがインフラのリポジトリにプッシュ可能
  * 誰でも（CIサーバー上で実行される自動化されたタスクを含む）PRをオープンすることで何かしらの変更を提案可能
* どのデプロイメントプラットフォームまたはデプロイメントサービスを使用していますか？
  * AWS CodeDeploy、Kubernetes、OpenShiftは少し異なるアプローチが必要
* 環境はどのようにグループ化されていますか？
  * 環境、リージョン、プロジェクトごと

{% hint style="info" %}
論理的なプロバイダーはTerraformのロジック内だけで完全に動作し、他のサービスとの相互作用はほとんどありません。そのため、その複雑さはO(1)として考えることができます。最も一般的な論理的なプロバイダーには、[random](https://registry.terraform.io/providers/hashicorp/random/latest/docs)、[local](https://registry.terraform.io/providers/hashicorp/local/latest/docs)、[terraform](https://www.terraform.io/docs/providers/terraform/index.html)、[null](https://registry.terraform.io/providers/hashicorp/null/latest/docs)、[time](https://registry.terraform.io/providers/hashicorp/time/latest) などがあります。
{% endhint %}

すべてのコードを `main.tf` に配置することは、初めて始める時やサンプルコードを書く時には良い方法です。それ以外の場合は、以下のように論理的に複数のファイルに分割する方が良いでしょう：

* `main.tf` - モジュール、ローカル変数、データソースを呼び出してすべてのリソースを作成します
* `variables.tf` - `main.tf`で使用される変数の宣言を含みます
* `outputs.tf` - `main.tf`で作成されたリソースからの出力を含みます
* `versions.tf` - Terraformとプロバイダーのバージョン要件を含みます

`terraform.tfvars` は、 [composition](https://www.terraform-best-practices.com/ja/key-concepts#composition) 以外では使用すべきではありません。

{% hint style="info" %}
以下の例で使用される主要な概念の [resource module](https://www.terraform-best-practices.com/ja/key-concepts#resource-module)、[infrastructure module](https://www.terraform-best-practices.com/ja/key-concepts#infrastructure-module)、 [composition](https://www.terraform-best-practices.com/ja/key-concepts#composition) を必ず理解してください。
{% endhint %}

* より少ないリソース数で作業する方が容易で速い
  * `terraform plan`と `terraform apply` はともに、リソースの状態を確認するためにクラウドAPIを呼び出します
  * インフラ全体を単一の構成にまとめると時間がかかる可能性がある
* セキュリティ侵害時の影響範囲はリソースが少ない方が小さい
  * 関連のないリソースを別々の構成に配置することで、問題が発生した場合のリスクを軽減
* プロジェクトはリモートステートを使用して開始してください。その理由は:
  * あなたのラップトップは、インフラの信頼できる情報源として適切な場所ではありません
  * gitでtfstateファイルを管理することは悪夢のようなものです
  * 後にインフラレイヤーが複数の方向（依存関係やリソースの数）に成長した時、制御しやすい
* 一貫した構造と[命名](https://www.terraform-best-practices.com/ja/naming)規則を実践してください
  * 手続き型コードと同様に、Terraformコードは最初に人が読むことを考えて書かれるべきです。一貫性があれば、6ヶ月後に変更が必要になった時に役立ちます
  * Terraformステートファイル内でリソースを移動することは可能ですが、構造や命名に一貫性がない場合、移動が困難になる可能性があります
* リソースモジュールはできるだけシンプルに保ってください
* &#x20;変数として渡せる値や、データソースを使用して検出できる値は、ハードコードしないでください
* データソースと `terraform_remote_state` は、特に構成内のインフラモジュール間の「接着剤」として使用してください

本書では、サンプルプロジェクトが複雑さによって小規模から大規模インフラまでグループ分けされています。この区分は厳密なものではないので、他の構造も確認してください。

小規模なインフラストラクチャとは、依存関係が少なく、リソースも少ないことを意味します。プロジェクトが成長するにつれて、Terraformの設定の実行を連鎖させ、異なるインフラストラクチャモジュールを接続し、構成内で値を受け渡す必要性が明らかになってきます。

開発者が使用するオーケストレーションソリューションには、少なくとも5つの異なるグループがあります：

1. Terraformのみ：非常に直接的なアプローチで、開発者は仕事を完了するためにTerraformだけを知って必要があります。
2. Terragrunt：インフラ全体のオーケストレーションと依存関係の処理が可能な純粋なオーケストレーションツールです。Terragruntはインフラストラクチャモジュールと構成をネイティブに扱うため、コードの重複を減らすことができます。
3. 自社開発スクリプト：多くの場合、これはオーケストレーションへの最初のステップとして、Terragruntを発見する前に行われます。
4. Ansibleやそれに類似する汎用自動化ツール：通常、TerraformがAnsible採用後に導入される場合や、Ansible UIが積極的に使用される場合に使用されます。
5. [Crossplane](https://crossplane.io) やその他のKubernetesに触発されたソリューション：Kubernetesエコシステムを活用し、reconciliation loop機能を使用してTerraform設定の望ましい状態を達成することが意味を持つ場合があります。詳細については、「 [Crossplane vs Terraform](https://www.youtube.com/watch?v=ELhVbSdcqSY) 」 の動画を参照

これを踏まえて、本書では最初の2つのプロジェクト構造、TerraformのみとTerragruntについて検討します。

次の章で [Terraform](https://www.terraform-best-practices.com/ja/examples/terraform) または [Terragrunt](https://www.terraform-best-practices.com/ja/examples/terragrunt) のコード構造の例を確認してください。

---

## FAQ

**URL:** https://www.terraform-best-practices.com/fr/faq.md

**Contents:**
- Quels sont les outils que je devrais connaître et envisager d'utiliser?
- Quelles sont les solutions à l'enfer des dépendances avec les modules ?

* [**Terragrunt**](https://terragrunt.gruntwork.io) - Outil d'orchestration
* [**tflint**](https://github.com/terraform-linters/tflint) - Code linter
* [**tfenv**](https://github.com/tfutils/tfenv) - Gestionnaire de versions
* [**Atlantis**](https://www.runatlantis.io) - Automation des demandes d'extraction (Pull Request)
* [**pre-commit-terraform**](https://github.com/antonbabenko/pre-commit-terraform) - Collection de git hooks pour Terraform à utiliser avec [pre-commit framework](https://pre-commit.com)
* [**Infracost**](https://www.infracost.io/) - Estimation des coûts du cloud pour Terraform dans les demandes de pull. Fonctionne aussi avec Terragrunt, Atlantis et pre-commit-terraform

Les versions des modules de ressources et d'infrastructure doivent être spécifiées. Les fournisseurs doivent être configurés en dehors des modules, mais uniquement en composition. La version des fournisseurs et de Terraform peut également être verrouillée.

Il n'y a pas d'outil maître de gestion des dépendances, mais il existe quelques astuces pour rendre l'enfer des dépendances moins problématique. Par exemple, [Dependabot](https://dependabot.com) peut être utilisé pour automatiser les mises à jour des dépendances. Dependabot crée des demandes d'extraction pour garder vos dépendances sécurisées et à jour. Dependabot prend en charge les configurations Terraform.

---

## Estilo del código

**URL:** https://www.terraform-best-practices.com/es/code-styling.md

**Contents:**
  - **Documentación**
    - **Documentación generada automáticamente**
  - Recursos

{% hint style="info" %}

* Los ejemplos y módulos de Terraform deberían integrar documentación que describa sus funcionalidades y el cómo utilizarlas.
* Enlaces en el sitio web del Terraform Registry son relevantes y no funcionarán, así que hacer uso de rutas absolutas en el README.md.
* La documentación puede incluir diagramas creados con [<mark style="color:purple;">mermaid</mark>](https://github.com/mermaid-js/mermaid) \*\*\*\* y planos creados con [<mark style="color:purple;">cloudfcraft.co</mark>](https://www.cloudcraft.co).
* Hacer uso de los \*\*\*\* [<mark style="color:purple;">hooks de pre-commit de Terraform</mark>](https://github.com/antonbabenko/pre-commit-terraform) \*\*\*\* para asegurarse de que el código es válido, de que está en el formato adecuado y está documentado adecuadamente antes de que sea *pusheado* a git y revisado por una persona.\\
  {% endhint %}

[<mark style="color:purple;">pre-commit</mark>](https://pre-commit.com) \*\*\*\* es un marco de trabajo **-***framework*- para administrar y mantener hooks de precommit multi lenguaje. Está escrito en Python y es una herramienta potente para hacer algo de manera automática en la máquina del desarrollador antes de que el código sea *commiteado* al repositorio de git. Normalmente, es utilizado para ejecutar *linters* y formatear código (ver [<mark style="color:purple;">hooks soportados</mark>](https://pre-commit.com/hooks.html)).

Con las configuraciones de Terraform, el `pre-commit` puede ser utilizado para formatear y validar código, así como actualizar documentación.

Se recomienda revisar el [<mark style="color:purple;">repositorio de pre-commit-terraform</mark>](https://github.com/antonbabenko/pre-commit-terraform/blob/master/README.md) para la familiarización con el mismo, y con otros repositorios existentes (por ejemplo, [<mark style="color:purple;">terraform-aws-vpc</mark>](https://github.com/terraform-aws-modules/terraform-aws-vpc)) en donde está siendo utilizado.

@porhacer: Documentar versiones de módulos, liberaciones, GH Actions.

1\. [<mark style="color:purple;">Página principal de pre-commit</mark>](https://pre-commit.com).

2\. [<mark style="color:purple;">Colección de git hooks para Terraform a ser usados con el framework pre-commit</mark>](https://github.com/antonbabenko/pre-commit-terraform).

3\. Publicación de blog por [<mark style="color:purple;">Dean Wilson: hooks de pre-commit y terraform – una red segura para tus repositorios</mark>](https://www.unixdaemon.net/tools/terraform-precommit-hooks/).

---

## الأسئلة الأكثر تكراراً

**URL:** https://www.terraform-best-practices.com/ar/faq.md

**Contents:**
- ما هي الأدوات التي يجب معرفتها واستخدامها؟
- ما هي الحلول لمشكلة [dependency hell](https://en.wikipedia.org/wiki/Dependency_hell) مع الوحدات؟

* أداة [**Terragrunt**](https://terragrunt.gruntwork.io/) -أداة تنسيق
* &#x20;أداة [**tflint**](https://github.com/terraform-linters/tflint)
* أداة [**tfenv**](https://github.com/tfutils/tfenv) - إدارة الإصدارات
* أداة [**Atlantis**](https://www.runatlantis.io/) أتمتة العمل مع PR
* أداة [**pre-commit-terraform**](https://github.com/antonbabenko/pre-commit-terraform) مجموعة من git-hooks خاصة بأداة Terraform التي يتم استعمالها مع إطار العمل [pre-commit framework](https://pre-commit.com/)

يجب تحديد إصدار الوحدة التي نتعامل معها. يجب تعريف الموفرات خارج الوحدات وفقط في التراكيب، يجب أيضاً  تحديد إصدار الموفرات وإصدار Terraform أالذي نتعامل معه.&#x20;

لا يوجدا أداة إدارة Dependency، لكن يوجد بعض النصائح التي تجعل هذه المشكلة أقل إشكالاً. كمثال يمكن استعمال أداة [Dependabot](https://dependabot.com/) لأتمتة تحديث الارتباطات. تقوم هذه الأداة بإنشاء PR للحفاظ على الارتباطات بشكل أمن ومحدث. تدعم هذه الأداة ملفات Terraform.&#x20;

---

## Код құрылымы

**URL:** https://www.terraform-best-practices.com/kk/code-structure.md

**Contents:**
- Terraform конфигурацияларын қалай құрылымдауым керек?
- Terraform конфигурацияларын құрылымдауға кіріспе
- Terraform конфигурациясының құрылымы туралы қалай ойлау керек?
  - Кодты құрылымдау бойынша жалпы ұсыныстар
  - Инфрақұрылым модульдері мен композицияларды оркестрациялау

Terraform кодының құрылымына қатысты сұрақтар - қауымдастықта ең жиі қойылатын сұрақтардың бірі. Әркім де бір кездері жоба үшін ең жақсы код құрылымы қандай болатыны туралы ойланған.

Бұл - көптеген шешімдері бар және әмбебап кеңес беру өте қиын сұрақтардың бірі, сондықтан біз немен жұмыс істеп жатқанымызды түсінуден бастайық.

* Жобаңыздың күрделілігі қандай?
  * Байланысты ресурстар саны
  * Terraform провайдерлерінің саны (төмендегі «логикалық провайдерлер» туралы ескертуді қараңыз)
* Инфрақұрылымыңыз қаншалықты жиі өзгереді?
  * Айына/аптасына/күніне бір реттен **бастап**
  * Үздіксізге **дейін** (жаңа коммит болған сайын)
* Код өзгерістерінің бастамашылары кімдер? *Жаңа артефакт жиналған кезде CI серверіне репозиторийді жаңартуға рұқсат бересіз бе?*
  * Инфрақұрылым репозиторийіне тек әзірлеушілер ғана push жасай алады (өзгеріс жібере алады)
  * Әркім PR ашу арқылы кез келген нәрсеге өзгеріс ұсына алады (соның ішінде CI серверінде жұмыс істейтін автоматтандырылған тапсырмалар да)
* Қандай орналастыру (deployment) платформасын немесе қызметін пайдаланасыз?
  * AWS CodeDeploy, Kubernetes немесе OpenShift сәл басқаша тәсілді қажет етеді
* Орталар қалай топтастырылған?
  * Орта, аймақ, жоба бойынша

{% hint style="info" %}
Логикалық провайдерлер\_ толығымен Terraform логикасының ішінде жұмыс істейді және көбінесе басқа қызметтермен мүлдем әрекеттеспейді, сондықтан біз олардың күрделілігін O(1) деп қарастыра аламыз. Ең жиі кездесетін логикалық провайдерлерге [random](https://registry.terraform.io/providers/hashicorp/random/latest/docs), [local](https://registry.terraform.io/providers/hashicorp/local/latest/docs), [terraform](https://www.terraform.io/docs/providers/terraform/index.html), [null](https://registry.terraform.io/providers/hashicorp/null/latest/docs), [time](https://registry.terraform.io/providers/hashicorp/time/latest) жатады.
{% endhint %}

Жұмысты бастағанда немесе мысал жазғанда, барлық кодты `main.tf` файлына орналастыру - жақсы идея. Басқа жағдайлардың барлығында файлдарды келесідей логикалық түрде бөлген дұрыс:

* `main.tf` - барлық ресурстарды құру үшін модульдерді, locals және дереккөздерді шақыру
* `variables.tf` -  `main.tf` ішінде қолданылатын айнымалылардың сипаттамасын қамтиды
* `outputs.tf` -  `main.tf` ішінде құрылған ресурстардың шығыстарын (outputs) қамтиды
* `versions.tf` - Terraform және провайдерлерге арналған нұсқа талаптарын қамтиды

`terraform.tfvars` файлын [композициядан](https://www.terraform-best-practices.com/kk/key-concepts#kompoziciya) басқа еш жерде қолданбау керек.

{% hint style="info" %}
Келесі мысалдарда қолданылатындықтан, негізгі ұғымдарды -[ресурс модулі](https://www.terraform-best-practices.com/kk/key-concepts#resurs-moduli), [инфрақұрылым модулі](https://www.terraform-best-practices.com/kk/key-concepts#infra-rylym-moduli) және [композицияны](https://www.terraform-best-practices.com/kk/key-concepts#kompoziciya) түсінгеніңізге көз жеткізіңіз.&#x20;
{% endhint %}

* Аз санды ресурстармен жұмыс істеу оңайырақ әрі жылдамырақ
  * `terraform plan` және `terraform apply` пәрмендері ресурстардың күйін тексеру үшін бұлттық API шақыруларын жасайды
  * Егер бүкіл инфрақұрылымыңыз бір композицияда болса, бұл біраз уақыт алуы мүмкін
* Ресурстар аз болғанда зақымдану аймағы (қауіпсіздік бұзылған жағдайда) кішірек болады
  * Тәуелсіз ресурстарды бөлек композицияларға орналастыру арқылы бір-бірінен оқшаулау, бірдеңе дұрыс болмай қалған жағдайда тәуекелді азайтады
* Жобаңызды қашықтағы күйді пайдалана отырып бастаңыз, себебі:
  * Сіздің ноутбугіңіз инфрақұрылымның ақиқат көзі болатын орын емес
  * &#x20;`tfstate` файлын git-те басқару — нағыз қорқынышты түс
  * Кейінірек инфрақұрылым қабаттары бірнеше бағытта (тәуелділіктер немесе ресурстар саны) өсе бастағанда, бәрін бақылауда ұстау оңайырақ болады
* Бірізді құрылым мен [атау келісімін](https://www.terraform-best-practices.com/kk/naming) ұстаныңыз:
  * Процедуралық код сияқты, Terraform коды да бірінші кезекте адамдар оқуы үшін жазылуы керек, ал бірізділік алты айдан кейін өзгерістер енгізілгенде көмектеседі
  * Terraform күй файлында (state file) ресурстарды жылжытуға болады, бірақ құрылым мен атаулар жүйесіз болса, мұны істеу қиынырақ болуы мүмкін
* Ресурс модульдерін мүмкіндігінше қарапайым етіп сақтаңыз
* Айнымалы ретінде беруге немесе дереккөздер арқылы табуға болатын мәндерді кодқа қатқыл жазбаңыз
* Дереккөздер мен `terraform_remote_state` -ті композиция ішіндегі инфрақұрылым модульдерінің арасындағы «желім» ретінде арнайы қолданыңыз

Бұл кітапта үлгі жобалар *күрделілігіне* қарай топтастырылған — кішіден бастап өте үлкен инфрақұрылымдарға дейін. Бұл бөлу қатаң емес, сондықтан басқа құрылымдарды да тексеріп көріңіз.

Шағын инфрақұрылымның болуы тәуелділіктердің және ресурстардың аз екенін білдіреді. Жоба өскен сайын Terraform конфигурацияларының орындалуын тізбектеу, әртүрлі инфрақұрылым модульдерін байланыстыру және композиция ішінде мәндерді тасымалдау қажеттілігі айқын болады.

Әзірлеушілер қолданатын оркестрация шешімдерінің кем дегенде 5 бөлек тобы бар:

1. Тек Terraform. Өте қарапайым, жұмысты орындау үшін әзірлеушілерге тек Terraform-ды білу жеткілікті.
2. Terragrunt. Бүкіл инфрақұрылымды оркестрациялауға, сондай-ақ тәуелділіктерді басқаруға болатын таза оркестрация құралы. Terragrunt инфрақұрылым модульдерімен және композициялармен тума түрде жұмыс істейді, сондықтан ол кодтың қайталануын азайтады.
3. Ішкі скрипттер. Бұл көбінесе оркестрацияға бастапқы қадам ретінде және Terragrunt-ты ашқанға дейін орын алады.
4. Ansible немесе соған ұқсас жалпы мақсаттағы автоматтандыру құралы. Әдетте Terraform Ansible-ден кейін қабылданғанда немесе Ansible UI белсенді қолданылғанда пайдаланылады.
5. [Crossplane](https://crossplane.io) және басқа Kubernetes-пен шабыттандырылған шешімдер. Кейде Kubernetes экожүйесін пайдалану және Terraform конфигурацияларының қалаған күйіне жету үшін үйлестіру циклі мүмкіндігін қолдану мағыналы болады. Қосымша ақпарат алу үшін [Crossplane vs Terraform](https://www.youtube.com/watch?v=ELhVbSdcqSY) бейнесін қараңыз.

Осыны ескере отырып, бұл кітап осы жоба құрылымдарының алғашқы екеуін — «Тек Terraform» және «Terragrunt»-ты қарастырады.

Келесі тарауда [Terraform](https://www.terraform-best-practices.com/kk/examples/terraform) немесе [Terragrunt](https://www.terraform-best-practices.com/kk/examples/terragrunt) үшін код құрылымдарының мысалдарын қараңыз.

---

## ברוכים הבאים

**URL:** https://www.terraform-best-practices.com/he/readme.md

**Contents:**
- ספונסרים
- תרגומים
- תרומות
- מחברים
- רישיון

[Terraform](https://www.terraform.io/) הוא פרויטק חדש למדי (כמו רוב הכלים בחלל ה DevOps) שהחל ב2014.

Terraform הוא כלי רב עוצמה (אם לא העוצמתי ביותר שיש בשוק כרגע) ואחד הכלים המשומשים ביותר המאפשר ניוהל של תשתיות כקוד. זה מאפשר למתפחים לעשות הרבה דברים ולא מגביל אותם בצורה שתהיה קשה לתחזוק,תמיכה ואינטגרציה.

ייתכן שחלק מהמידע המתואר בספר זה לא נראה כמו שיטות העבודה הכי טובות. אני יודע זאת, וכדי לעזור לקוראים להפריד בין שיטות עבודה מבוססות ומהן דעות אישיות על עשיית דברים, אני לפעמים משמתש ברמזים כדי לספק הקשר ואייקונים כדי לציין את רמת המוכנות בכל תת-סעיף הקשור לשיטות העבודה המומלצות.

הספר התחיל במדריד בשנת 2018, זמין בחינם בכתובת [https://www.terraform-best-practices.com/](https://www.terraform-best-practices.com).

כמה שנים לאחר מכן, הוא עודכן עם שיטות עבודה מומלצות יותר אשר זמינות עם Terraform גרסה 1.0. בסופו של דבר, הספר אמור להכיל את רוב שיטות העבודה המומלצות והבלתי מעורערות עבור משמתשי Terraform.

Please [contact me](https://github.com/antonbabenko/terraform-aws-devops#social-links) if you want to become a sponsor.

| [![](https://1698677751-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4bq6CyY8vYiEHkjN63rT%2Fuploads%2Fgit-blob-a20cbce63c68eb37bae050e948606a3a24b58238%2Fctf-logo.png?alt=media)](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) | [Compliance.tf](https://compliance.tf/?utm_source=tf_best_practices\&utm_medium=sponsorship) — Terraform Compliance Simplified. Make your Terraform modules compliance-ready. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![](https://github.com/antonbabenko/terraform-best-practices/blob/he/.gitbook/assets)](https://www.terraform-best-practices.com/he/readme)                                                                                                                                            | —                                                                                                                                                                             |

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/>" %}
[العربية (Arabic)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/u3iITRIHQx97ro2PkfdC/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/>" %}
[Bosanski (Bosnian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PJbgKPAX0ohEMLpETpg7/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/>" %}
[Português (Brazilian Portuguese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/B48qUSNPO2XmkIySLzfr/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/>" %}
[English](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/e1Mp2scOX6OnQbifCen3/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/6shyPtr2KrqW4ANbFXYg/>" %}
[Français (French)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/6shyPtr2KrqW4ANbFXYg/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/DyguS0uZfMW7X7m9BWx1/>" %}
[ქართული (Georgian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/DyguS0uZfMW7X7m9BWx1/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/>" %}
[Deutsch (German)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/PKopCWJZbhpQ9FT0W8tL/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5c1kFpqxaDZC2g9e6rtT/>" %}
[ελληνικά (Greek)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5c1kFpqxaDZC2g9e6rtT/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/>" %}
[हिंदी (Hindi)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Mgong4S6IjtibE055zUM/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/>" %}
[Bahasa Indonesia (Indonesian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/ZLCz7lNWbSJxDGuNOI44/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/>" %}
[Italiano (Italian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/8VlMHbHDbW6qRWdgN5oU/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/>" %}
[日本語 (Japanese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/3vykLOWgdQLPLgHtxqQH/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/>" %}
[ಕನ್ನಡ (Kannada)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/BoZVs6O2OJFQLNV1utmm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/>" %}
[한국어 (Korean)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/bJnDvAqIyVgo7LDHgxYJ/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/>" %}
[Polski (Polish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/9yChMGbFo2G47Wiow1yY/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/sFM1GW5TPCGsskQ03mTm/>" %}
[Română (Romanian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/sFM1GW5TPCGsskQ03mTm/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/>" %}
[简体中文 (Simplified Chinese)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/5VD4NK4mHOY8SWjC9N5e/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/>" %}
[Español (Spanish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/fTxekzr50pIuGmrPkXUD/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/>" %}
[Türkçe (Turkish)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/Fedpbc5NbKjynXI8xTeF/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/>" %}
[Українська (Ukrainian)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/tXRvMPILxeJaJTM2CsSq/)
{% endcontent-ref %}

{% content-ref url="<https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/>" %}
[اردو (Urdu)](https://app.gitbook.com/o/-LMqIrDlzEiI-N4uHrWg/s/dcjhau04KQIKHUJA90iN/)
{% endcontent-ref %}

צרו איתי קשר אם אתם מעוניים לעזור בתרגום הספר לספות שונות.

אני תמיד רוצה לקבל משוב ולעדכן את הספר ככל שהקהילה גדלה, מתבגרת ורעיונות חדשים מיושמים ומאומתים לאורך זמן

אם אתם מעוניינים בנושאים ספציפיים, אנא פתחו סוגייה, או סמנו נושא שאתם רוצים שאכסה אותו. אם אתה מרגיש שיש לך תוכן לתרום, כתוב טיוטה ושלח pull request (אל תדאג/י לגבי כתיבת טקסט טוב בשלב זה!)

ספר זה מתוחזק על ידי [Anton Babenko](https://github.com/antonbabenko) ובעזרת תורמים ומתרגמנים שונים.

This work is licensed under Apache 2 License. See LICENSE for full details.

The authors and contributors to this content cannot guarantee the validity of the information found here. Please make sure that you understand that the information provided here is being provided freely, and that no kind of agreement or contract is created between you and any persons associated with this content or project. The authors and contributors do not assume and hereby disclaim any liability to any party for any loss, damage, or disruption caused by errors or omissions in the information contained in, associated with, or linked from this content, whether such errors or omissions result from negligence, accident, or any other cause.

Copyright © 2018-2023 Anton Babenko.

---
