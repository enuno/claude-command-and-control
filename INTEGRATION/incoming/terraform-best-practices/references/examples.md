# Terraform-Best-Practices - Examples

**Pages:** 20

---

## Середня інфраструктура з Terraform

**URL:** https://www.terraform-best-practices.com/uk/examples/terraform/medium-size-infrastructure.md

Джерело: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/medium-terraform>

Цей приклад містить код як приклад структурування конфігурацій Terraform для інфраструктури середнього розміру, яка використовує:

* 2 AWS акаунти
* 2 окремих середовища (`prod` та `stage,`які не мають нічого спільного). Кожне середовище живе в окремому акаунті AWS
* Кожне середовище використовує різну версію готового інфраструктурного модуля (alb), отриманого з [Terraform Registry](https://registry.terraform.io/)
* Кожне середовище використовує одинакову версію модулів/мережі внутрішнього модуля, оскільки джерело отримане з локального каталогу

{% hint style="success" %}

* Ідеально підходить для проектів, де інфраструктура логічно розділена (окремі акаунти AWS)
* Добре, коли немає необхідності змінювати ресурси, спільні для акаунтів AWS (одне середовище = один акаунт AWS = один файл стану)
* Добре, коли немає потреби в оркестровці змін між середовищами
* Добре, коли ресурси інфраструктури відрізняються для кожного середовища спеціально і не можуть бути узагальнені (наприклад, деякі ресурси відсутні в одному середовищі або в деяких регіонах)
  {% endhint %}

{% hint style="warning" %}
Із розвитком проекту буде все важче підтримувати ці середовища в актуальному стані одне з одним. Подумайте про використання інфраструктурних модулів (готових або внутрішніх) для повторюваних завдань.
{% endhint %}

---

## Terraform

**URL:** https://www.terraform-best-practices.com/es/examples/terraform.md

Estos son los artículos de la presente sección:

{% content-ref url="terraform/small-size-infrastructure" %}
[small-size-infrastructure](https://www.terraform-best-practices.com/es/examples/terraform/small-size-infrastructure)
{% endcontent-ref %}

{% content-ref url="terraform/medium-size-infrastructure" %}
[medium-size-infrastructure](https://www.terraform-best-practices.com/es/examples/terraform/medium-size-infrastructure)
{% endcontent-ref %}

{% content-ref url="terraform/large-size-infrastructure-with-terraform" %}
[large-size-infrastructure-with-terraform](https://www.terraform-best-practices.com/es/examples/terraform/large-size-infrastructure-with-terraform)
{% endcontent-ref %}

---

## Exemple de structuri de cod

**URL:** https://www.terraform-best-practices.com/ro/examples.md

**Contents:**
- Structuri de cod Terraform
- Structuri de cod Terragrunt

{% hint style="info" %}
Exemplele următoare prezintă cazul în care AWS a fost ales ca furnizor, dar majoritatea principiilor descrise pot fi refolosite pentru ceilalți furnizori de cloud și de asemenea în cazul în care alegem alți furnizori în general (de DNS, baze de date, monitorizare, etc.).
{% endhint %}

| Tip                                                                                                             | Descriere                                                                                                                                                                                                  | Disponibilitate |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| [mică](https://www.terraform-best-practices.com/ro/examples/terraform/small-size-infrastructure)                | Puține resurse, fără dependențe externe. Un singur cont AWS. O singura regiune. Un singur mediu.                                                                                                           | Da              |
| [medie](https://www.terraform-best-practices.com/ro/examples/terraform/medium-size-infrastructure)              | Câteva conturi AWS și medii de lucru, module de infrastructură gata de folosire cu Terraform.                                                                                                              | Da              |
| [mare](https://www.terraform-best-practices.com/ro/examples/terraform/large-size-infrastructure-with-terraform) | Mai multe conturi de AWS, mai multe regiuni, nevoie urgentă de a reduce folosirea metodei copy-paste, module de infrastructură personalizate, utilizare ridicata a compoziției de cod. Folosind Terraform. | În lucru        |
| foarte mare                                                                                                     | Furnizori multiplii (AWS, GCP, Azure). Implementări multi-cloud. Folosind Terraform.                                                                                                                       | Nu              |

| Tip         | Descriere                                                                                                                                                                                                  | Disponibilitate |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| medie       | Mai multe conturi de AWS și medii de lucru, module de infrastructură gata de folosire, model de compoziție folosind Terragrunt.                                                                            | Nu              |
| mare        | Mai multe conturi de AWS, multiple regiuni, nevoie urgentă de a reduce folosirea metodei copy-paste, module de infrastructură personalizate, utilizare ridicata a compoziției de cod. Folosind Terragrunt. | Nu              |
| foarte mare | Furnizori multiplii (AWS, GCP, Azure). Implementări multi-cloud. Folosind Terragrunt.                                                                                                                      | Nu              |

---

## Terraform을 사용한 대규모 인프라

**URL:** https://www.terraform-best-practices.com/ko/examples/terraform/large-size-infrastructure-with-terraform.md

출처: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/large-terraform>

이 예시에는 다음을 사용하는 대규모 인프라에 대한 Terraform 구성(configurations)을 구조화하는 예제 코드가 포함되어 있습니다.

* AWS 계정 2개
* 지역 2곳
* 2개의 개별 환경(아무것도 공유하지 않는 `prod` 및 `stag`). 각 환경은 별도의 AWS 계정에 존재하며 두 지역 간의 리소스를 포괄합니다
* 각 환경은 [Terraform Registry](https://registry.terraform.io/)에서 제공되는 기존 인프라 모듈(`alb`)의 다른 버전을 사용합니다.
* 로컬 디렉토리에서 소스를 제공하므로 각 환경은 같은 버전의 내부 모듈 `modules/network`을 사용합니다.

{% hint style="info" %}
여기에 설명된 것과 같은 대규모 프로젝트에서는 Terragrrunt를 사용함으로써 얻을 수 있는 이점이 매우 분명해집니다. [Terragrunt를 사용한 코드 구조 예제](https://www.terraform-best-practices.com/ko/examples/terragrunt)를 참조하세요.
{% endhint %}

{% hint style="success" %}

* 인프라가논리적으로 분리된 프로젝트에 적합(AWS 계정 별도)
* AWS 계정 간에 공유된 리소스를 수정할 필요가 없는 경우(환경 1개 = AWS 계정 1개 = 상태 파일 1개)
* 환경 간에 변경 사항을 조정할 필요가 없는 경우에 적합
* 인프라 리소스가 환경별로 의도적으로 달라 일반화할 수 없는 경우(예: 어떤 리소스가 특정 환경이나 일부 지역에 없음)
  {% endhint %}

{% hint style="warning" %}
프로젝트가 커짐에 따라 이러한 환경을 서로 최신 상태로 유지하는 것은 더욱 어려워집니다. 반복 가능한 작업에 인프라 모듈(기존 모듈 또는 내부 모듈) 사용을 고려해 보세요.
{% endhint %}

---

## टेराफॉर्म के साथ छोटे आकार का बुनियादी ढांचा

**URL:** https://www.terraform-best-practices.com/hi/examples/terraform/small-size-infrastructure.md

Source: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/small-terraform>

इस उदाहरण में छोटे आकार के बुनियादी ढांचे के लिए टेराफॉर्म कॉन्फ़िगरेशन की संरचना के उदाहरण के रूप में कोड शामिल है, जहां कोई बाहरी निर्भरता का उपयोग नहीं किया जाता है।

{% hint style="success" %}

* आरंभ करने के लिए बिल्कुल सही और जैसे ही आप जाते हैं रिफैक्टर करें
* &#x20;छोटे संसाधन मॉड्यूल के लिए बिल्कुल सही&#x20;
* छोटे और रैखिक आधारभूत संरचना मॉड्यूल के लिए अच्छा है (eg, [terraform-aws-atlantis](https://github.com/terraform-aws-modules/terraform-aws-atlantis))
* संसाधनों की एक छोटी संख्या के लिए अच्छा है (20-30 से कम)
  {% endhint %}

{% hint style="warning" %}
यदि संसाधनों की संख्या बढ़ रही है तो सभी संसाधनों के लिए सिंगल स्टेट फाइल टेराफॉर्म के साथ काम करने की प्रक्रिया को धीमा कर सकती है (संसाधनों की संख्या को सीमित करने के लिए एक argument `-target` का उपयोग करने पर विचार करें)&#x20;
{% endhint %}

---

## Terraform

**URL:** https://www.terraform-best-practices.com/el/examples/terraform.md

Τα παρακάτω είναι τα άρθρα αυτής της ενότητας:

<table data-card-size="large" data-view="cards" data-full-width="false"><thead><tr><th></th><th data-hidden data-type="content-ref"></th></tr></thead><tbody><tr><td>Υποδομή μικρού μεγέθους με Terraform</td><td><a href="terraform/small-size-infrastructure">small-size-infrastructure</a></td></tr><tr><td>Υποδομή μεσαίου μεγέθους με Terraform</td><td><a href="terraform/medium-size-infrastructure">medium-size-infrastructure</a></td></tr><tr><td>Υποδομή μεγάλου μεγέθους με Terraform</td><td><a href="terraform/medium-size-infrastructure">medium-size-infrastructure</a></td></tr></tbody></table>

---

## ٹیرافارم (Terraform) کے ساتھ چھوٹے سائز کا انفراسٹرکچر

**URL:** https://www.terraform-best-practices.com/ur/examples/terraform/small-size-infrastructure.md

**ماخذ:** <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/small-terraform>\
**اس مثال میں  وہ کوڈ شامل ہے جو ایک چھوٹے سائز کی ٹیرا فارم کنفیگریشن کی ساخت کی مثال کے طور پر دیا گیا ہے، جہاں کوئی بیرونی دپندنکئیس**  `dependencies`**استعمال نہیں کیا گیا ہے۔**

{% hint style="success" %}

* **شروع کرنے اور جیسے جیسے آپ آگے بڑھیں ترمیم کرنے کے لیے بہترین ہے۔**
* **چھوٹے پیمانے کے انفراسٹرکچر کے ماڈیولز کے لیے بہترین ہے۔**
* &#x20;**چھوٹے اور لکیری انفراسٹرکچر ماڈیولز کے لیے اچھا ہے (مثال کے طور پر،** [**terraform-aws-**](https://github.com/terraform-aws-modules/terraform-aws-atlantis)[**atlantis**](https://github.com/terraform-aws-modules/terraform-aws-atlantis)**)**
* **چھوٹی تعداد میں** resources **کے لیے اچھا ہے (20-30 سے کم)**
  {% endhint %}

{% hint style="warning" %}
\
تمام ریسورسز کے لئے ایک state فائل ٹیرافارم Terraform سے کام کرنے کے طریقے کو دھیما بنا سکتا ہ اگر  ریسورسز کی تعداد بڑھ رہی ہو ( ریسورسز کی تعداد کو محدود کرنے کے لئے ایک ارغومنٹ -target کا استعمال کرنے کو مد نظر میں رکھیں)
{% endhint %}

---

## Terraform көмегімен шағын өлшемді инфрақұрылым

**URL:** https://www.terraform-best-practices.com/kk/examples/terraform/small-size-infrastructure.md

Дереккөз: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/small-terraform>

Бұл мысал сыртқы тәуелділіктер қолданылмаған, шағын өлшемді инфрақұрылымға арналған Terraform конфигурацияларын құрылымдау мысалы ретінде кодты қамтиды.

{% hint style="success" %}

* Жұмысты бастауға және жүре келе рефакторинг жасауға өте ыңғайлы
* Шағын ресурс модульдері үшін өте қолайлы
* Шағын және сызықтық инфрақұрылым модульдері үшін жақсы (мысалы, [terraform-aws-atlantis](https://github.com/terraform-aws-modules/terraform-aws-atlantis))
* Ресурстар саны аз болғанда (20-30-дан аз) жақсы
  {% endhint %}

{% hint style="warning" %}
Егер ресурстар саны өссе, барлық ресурстар үшін бір күй (state) файлының болуы Terraform-мен жұмыс істеу процесін баяулатуы мүмкін (ресурстар санын шектеу үшін `-target` аргументін қолдануды қарастырыңыз)
{% endhint %}

---

## Υποδομή μεσαίου μεγέθους με Terraform

**URL:** https://www.terraform-best-practices.com/el/examples/terraform/medium-size-infrastructure.md

Πηγή: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/medium-terraform>

Αυτό το παράδειγμα περιέχει κώδικα ως παράδειγμα δόμησης των ρυθμίσεων Terraform για μια μεσαίου μεγέθους υποδομή που χρησιμοποιεί:

* 2 λογαριασμούς AWS
* 2 ξεχωριστά περιβάλλοντα (`prod` και `stage` που δεν διαμοιράζονται τίποτα). Κάθε περιβάλλον ζει σε ξεχωριστό λογαριασμό AWS
* Κάθε περιβάλλον χρησιμοποιεί διαφορετική έκδοση της έτοιμης μονάδας υποδομής (`alb`) που προέρχεται από το [Terraform registry](https://registry.terraform.io/)
* Κάθε περιβάλλον χρησιμοποιεί την ίδια έκδοση μιας εσωτερικής μονάδας `modules/network`, καθώς προέρχεται από έναν τοπικό κατάλογο.

{% hint style="success" %}

* Ιδανικό για έργα όπου η υποδομή διαχωρίζεται λογικά (ξεχωριστοί λογαριασμοί AWS)
* Καλό όταν δεν υπάρχει ανάγκη τροποποίησης πόρων που διαμοιράζονται μεταξύ λογαριασμών AWS (ένα περιβάλλον = ένας λογαριασμός AWS = ένα αρχείο κατάστασης)
* Καλό όταν δεν υπάρχει ανάγκη ενορχήστρωσης των αλλαγών μεταξύ των περιβαλλόντων
* Καλό όταν οι πόροι υποδομής είναι διαφορετικοί ανά περιβάλλον επίτηδες και δεν μπορούν να γενικευτούν (π.χ. κάποιοι πόροι απουσιάζουν από ένα περιβάλλον ή από ορισμένες περιοχές)
  {% endhint %}

{% hint style="warning" %}
Καθώς το έργο μεγαλώνει, θα είναι πιο δύσκολο να διατηρούνται αυτά τα περιβάλλοντα ενημερωμένα μεταξύ τους. Εξετάστε το ενδεχόμενο χρήσης μονάδων υποδομής (έτοιμων ή εσωτερικών) για επαναλαμβανόμενες εργασίες.
{% endhint %}

---

## Exemples de structure de code

**URL:** https://www.terraform-best-practices.com/fr/examples.md

**Contents:**
- Structures de code Terraform
- Structures de code Terragrunt

{% hint style="info" %}
Ces exemples montrent un fournisseur AWS, mais la majorité des principes présentés dans les exemples peuvent être appliqués à d'autres fournisseurs de cloud public ainsi qu'à d'autres types de fournisseurs (DNS, DB, Monitoring, etc.)
{% endhint %}

| Type                                                                                                             | Description                                                                                                                                                             | Préparation           |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| [petit](https://www.terraform-best-practices.com/fr/examples/terraform/small-size-infrastructure)                | Peu de ressources, pas de dépendances externes. Compte AWS unique. Région unique. Environnement unique                                                                  | Oui                   |
| [moyen](https://www.terraform-best-practices.com/fr/examples/terraform/medium-size-infrastructure)               | Plusieurs comptes et environnements AWS, modules d'infrastructure prêts à l'emploi utilisant Terraform.                                                                 | Oui                   |
| [grand](https://www.terraform-best-practices.com/fr/examples/terraform/large-size-infrastructure-with-terraform) | Plusieurs régions, besoin urgent de réduire le copier-coller, modules d'infrastructure personnalisés, utilisation intensive des compositions. Utilisation de Terraform. | TeC(Travail en Cours) |
| Très grand                                                                                                       | Plusieurs fournisseurs (AWS, GCP, Azure). Déploiements multi-cloud. Utilisation de Terraform.                                                                           | Non                   |

| Type       | Description                                                                                                                                                              | Préparation |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| moyen      | Plusieurs comptes et environnements AWS, modules d'infrastructure prêts à l'emploi utilisant Terragrunt.                                                                 | No          |
| grand      | Plusieurs régions, besoin urgent de réduire le copier-coller, modules d'infrastructure personnalisés, utilisation intensive des compositions. Utilisation de Terragrunt. | No          |
| très grand | Plusieurs fournisseurs (AWS, GCP, Azure). Déploiements multi-cloud. Utilisation de Terragrunt.                                                                           | Non         |

---

## Terraform

**URL:** https://www.terraform-best-practices.com/examples/terraform.md

- [Small-size infrastructure with Terraform](/examples/terraform/small-size-infrastructure.md)
- [Medium-size infrastructure with Terraform](/examples/terraform/medium-size-infrastructure.md)
- [Large-size infrastructure with Terraform](/examples/terraform/large-size-infrastructure-with-terraform.md)

---

## Infrastructură de dimensiune mică - Terraform

**URL:** https://www.terraform-best-practices.com/ro/examples/terraform/small-size-infrastructure.md

Sursă: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/small-terraform>

Acest exemplu conține un cod ca exemplu de structurare a configuraților Terraform pentru o infrastructură de dimensiuni mici, unde nu există dependențe externe.

{% hint style="success" %}

* Perfect pentru a începe și pentru a edita pe parcurs
* Perfect pentru module cu resurse puține
* Bun pentru module de infrastructură mici si lineare (ex: [terraform-aws-atlantis](https://github.com/terraform-aws-modules/terraform-aws-atlantis))
* Bun pentru un număr redus de resurse (mai puține de 20-30)
  {% endhint %}

{% hint style="warning" %}
Un singur fișier de stare pentru toate resursele poate face procesul de lucru cu Terraform să încetinească dacă numărul de resurse crește (considerați folosirea unui argument ca`-target` pentru a limita numărul de resurse).
{% endhint %}

---

## Infraestructura de tamaño mediano con Terraform

**URL:** https://www.terraform-best-practices.com/es/examples/terraform/medium-size-infrastructure.md

Fuente: [<mark style="color:purple;">https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/medium-terraform</mark>](https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/medium-terraform)

La presente integra código como ejemplo de la estructuración de la configuración para una infraestructura de tamaño mediano que utiliza:

* 2 cuentas de AWS.
* 2 entornos separados (`prod` y `stage`*,* los cuales no comparten nada). Cada entorno vive en una cuenta separada de AWS.
* Cada entorno utiliza diferentes versiones del módulo estándar de infraestructura (`alb`*)* proveniente del [<mark style="color:purple;">Registro de Terraform</mark>](https://registry.terraform.io) -*Terraform Registry***-**.
* Cada entorno hace uso de la misma versión del módulo interno `modules/network` dado que es procedente de un directorio local.

{% hint style="success" %}

* Perfecta para proyectos en donde la infraestructura está separa lógicamente (cuentas separadas de AWS).
* Buena cuando no hay necesidad de modificar recursos compartidos entre las diferentes cuentas de AWS (un entorno = una cuenta AWS = un archivo de estado).
* Buena cuando no hay necesidad de orquestación de los cambios entre los entornos.
* Buena cuando los recursos de infraestructura son diferentes por entorno intencionalmente y no pueden ser generalizados (por ejemplo, algunos recursos están ausentes en un entorno o en algunas regiones).
  {% endhint %}

{% hint style="warning" %}
A medida de que el proyecto crezca, estos entornos serán más difíciles de mantener actualizados al día unos de otros. Considerar utilizar módulos de infraestructura (estándares o propios) para tareas repetibles.
{% endhint %}

---

## תשתיות בקנה מידה קטן עם Terraform

**URL:** https://www.terraform-best-practices.com/he/examples/terraform/small-size-infrastructure.md

מקור: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/small-terraform>

דוגמא זו מכילה קוד לבניית קונפיגורציית Terraform עבור תשתית בקנה מידה קטן, שבה לא נעשה שימוש בתלות חיצונית.

{% hint style="success" %}

* מושלם להתחלה ולשיכתוב בהמשך
* מושלם עבור מודולי משאבים קטנים
* מתאים למודולי תשתית קטנים וליניאריים
* טוב למספר קטן של משאבים (פחות מ- 20-30)
  {% endhint %}

{% hint style="warning" %}
קובץ מצב יחיד עבור כל המשאבים יכול להאט את תהליך העבודה עם Terraform אם מספר המשאבים גדל\
(שקול להשתמש בארגומנט - יעד (`target-)` להגבלת מספר המשאבים)
{% endhint %}

---

## 代码结构示例

**URL:** https://www.terraform-best-practices.com/zh/examples.md

**Contents:**
- Terraform 代码结构
- Terragrunt 代码结构

{% hint style="info" %}
这些示例显示的是 AWS 提供商，但示例中显示的大部分原则可以应用于其他公共云提供商以及其他类型的提供商（DNS、DB、监控等）。
{% endhint %}

| Type 类型                                                                                                          | Description 描述                                           | Readiness 准备 |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------ |
| [small](https://www.terraform-best-practices.com/zh/examples/terraform/small-size-infrastructure)                | 很少资源，没有外部依赖。 单个 AWS 账户。 单一区域。 单一环境。                      | Yes          |
| [medium](https://www.terraform-best-practices.com/zh/examples/terraform/medium-size-infrastructure)              | 多个 AWS 账户和环境，使用 Terraform 的现成基础设施模块。                     | Yes          |
| [large](https://www.terraform-best-practices.com/zh/examples/terraform/large-size-infrastructure-with-terraform) | 许多 AWS 账户，许多地区，迫切需要减少复制粘贴、自定义基础设施模块、大量使用组合。 使用Terraform。 | WIP 生产中      |
| very-large                                                                                                       | 多个提供商（AWS、GCP、Azure）。 多云部署。 使用Terraform。                 | No           |

| Type 类型    | Description 描述                                             | Readiness 准备 |
| ---------- | ---------------------------------------------------------- | ------------ |
| medium     | 多个 AWS 账户和环境，现成的基础设施模块，使用 Terragrunt 的组合模式。                | No           |
| large      | 许多 AWS 账户，许多地区，迫切需要减少复制粘贴、自定义基础设施模块、大量使用组合。 使用 Terragrunt。 | No           |
| very-large | 多个提供商（AWS、GCP、Azure）。 多云部署。 使用 Terragrunt。                 | No           |

---

## Terraform

**URL:** https://www.terraform-best-practices.com/tr/examples/terraform.md

- [Terraform ile küçük ölçekli altyapı yönetimi](/tr/examples/terraform/small-size-infrastructure.md)
- [Terraform ile orta ölçekli altyapı yönetimi](/tr/examples/terraform/medium-size-infrastructure.md)
- [Terraform ile büyük ölçekli altyapı yönetimi](/tr/examples/terraform/large-size-infrastructure-with-terraform.md)

---

## कोड संरचना उदाहरण

**URL:** https://www.terraform-best-practices.com/hi/examples.md

**Contents:**
- टेराफॉर्म कोड संरचनाएं
- टेराग्रंट कोड संरचनाएं

{% hint style="info" %}
ये उदाहरण AWS प्रदाता दिखा रहे हैं लेकिन उदाहरणों में दिखाए गए अधिकांश सिद्धांत अन्य सार्वजनिक क्लाउड प्रदाताओं के साथ-साथ अन्य प्रकार के प्रदाताओं (DNS, DB, मॉनिटरिंग, आदि) पर लागू किए जा सकते हैं।
{% endhint %}

| Type                                                                                                             | Description                                                                                                                                         | Readiness |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| [small](https://www.terraform-best-practices.com/hi/examples/terraform/small-size-infrastructure)                | कुछ संसाधन, कोई बाहरी निर्भरता नहीं। एकल एडब्ल्यूएस खाता। एकल क्षेत्र। एकल वातावरण।                                                                 | Yes       |
| [medium](https://www.terraform-best-practices.com/hi/examples/terraform/medium-size-infrastructure)              | टेराफॉर्म का उपयोग करते हुए कई AWS खाते और वातावरण, ऑफ-द-शेल्फ इंफ्रास्ट्रक्चर मॉड्यूल।                                                             | Yes       |
| [large](https://www.terraform-best-practices.com/hi/examples/terraform/large-size-infrastructure-with-terraform) | कई AWS खाते, कई क्षेत्र, कॉपी-पेस्ट, कस्टम इंफ्रास्ट्रक्चर मॉड्यूल, रचनाओं के भारी उपयोग को कम करने की तत्काल आवश्यकता है। टेराफॉर्म का उपयोग करना। | WIP       |
| very-large                                                                                                       | कई प्रदाता (AWS, GCP, Azure)। मल्टी-क्लाउड परिनियोजन। टेराफॉर्म का उपयोग करना।                                                                      | No        |

| Type       | Description                                                                                                                                          | Readiness |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| medium     | कई AWS खाते और वातावरण, ऑफ-द-शेल्फ इंफ्रास्ट्रक्चर मॉड्यूल, टेराग्रंट का उपयोग कर संरचना पैटर्न।                                                     | No        |
| large      | कई  AWS खाते, कई क्षेत्र, कॉपी-पेस्ट, कस्टम इंफ्रास्ट्रक्चर मॉड्यूल, रचनाओं के भारी उपयोग को कम करने की तत्काल आवश्यकता है। टेराग्रंट का उपयोग करना। | No        |
| very-large | कई प्रदाता (AWS, GCP, Azure)। मल्टी-क्लाउड परिनियोजन। टेराग्रंट का उपयोग करना।                                                                       | No        |

---

## Terraform을 사용한 소규모 인프라

**URL:** https://www.terraform-best-practices.com/ko/examples/terraform/small-size-infrastructure.md

출처: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/small-terraform>

이 예시에는 외부 의존성을 전혀 사용하지 않는 소규모 인프라에 대한 Terraform 구성(configurations)을 구조화하는 예제 코드가 포함되어 있습니다.

{% hint style="success" %}

* 프로젝트를시작하고 진행해 가면서 리팩토링하기에 딱입니다.
* 소규모 리소스 모듈에 적합
* 소규모 및 선형 인프라 모듈(예: [terraform-aws-atlantis](https://github.com/terraform-aws-modules/terraform-aws-atlantis))에 적합
* 소수의 리소스에 적합(20\~30개 미만)
  {% endhint %}

{% hint style="warning" %}
리소스 수가 증가하는 경우, 모든 리소스에 대한 단일 상태 파일은 Terraform 작업 프로세스를 느리게 만들 수 있습니다(리소스 수를 제한하려면 `-target` 인수를 사용하는 것이 좋습니다).
{% endhint %}

---

## Terraform per infrastrutture di piccole dimensioni

**URL:** https://www.terraform-best-practices.com/it/examples/terraform/small-size-infrastructure.md

Sorgente: <https://github.com/antonbabenko/terraform-best-practices/tree/master/examples/small-terraform>

Questo esempio contiene codice per la strutturazione delle configurazioni Terraform per un infrastruttura di piccole dimensioni, dove non sono usate dipendenze esterne.

{% hint style="success" %}

* Perfetto per iniziare e fare la rifattorizzazione mentre procedi.
* Perfetto per moduli con poche risorse
* Buono per moduli di infrastrutture piccoli e lineari come (per esempio, [terraform-aws-atlantis](https://github.com/terraform-aws-modules/terraform-aws-atlantis))
* Buono per un piccolo numero di risorse (meno di 20-30)
  {% endhint %}

{% hint style="warning" %}
Un singolo file di stato per tutte le risorse, può rendere il processo di esecuzione di Terraform lento se il numero di risorse é in crescita (considera l'uso dell'argomento -`target` per limitare il numero di risorse)
{% endhint %}

---

## コード構造サンプル

**URL:** https://www.terraform-best-practices.com/ja/examples.md

**Contents:**
- Terraformのコード構造
- Terragruntコード構造

{% hint style="info" %}
これらの例ではAWSプロバイダーを使用していますが、例で示された原則の大部分は、他のパブリッククラウドプロバイダーや、DNS、データベース、モニタリングなどの他の種類のプロバイダーにも適用可能です。
{% endhint %}

| タイプ                                                                                                         | 説明                                                                        | 準備状況 |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---- |
| [小規模](https://www.terraform-best-practices.com/examples/terraform/small-size-infrastructure)                | リソースは少数、外部依存なし。単一のAWSアカウント。単一のリージョン。単一の環境。                                | 完了   |
| [中規模](https://www.terraform-best-practices.com/examples/terraform/medium-size-infrastructure)               | 複数のAWSアカウントと環境、Terraformを使用した既製のインフラモジュール。                                | 完了   |
| [大規模](https://www.terraform-best-practices.com/examples/terraform/large-size-infrastructure-with-terraform) | 多数のAWSアカウントと複数のリージョン、コピーペーストの削減が急務、カスタムインフラモジュール、コンポジションの多用。Terraformを使用。 | 進行中  |
| 超大規模                                                                                                        | 複数のプロバイダー（AWS、GCP、Azure）。マルチクラウド展開。Terraformを使用。                          | 未着手  |

| タイプ  | 説明                                                                         | 準備状況 |
| ---- | -------------------------------------------------------------------------- | ---- |
| 中規模  | 複数のAWSアカウントと環境、既製のインフラモジュール、Terragruntを用いたコンポジションパターン。                     | 未着手  |
| 大規模  | 多数のAWSアカウントと複数のリージョン、コピーペーストの削減が急務、カスタムインフラモジュール、コンポジションの多用。Terragruntを使用。 | 未着手  |
| 超大規模 | 複数のプロバイダー（AWS、GCP、Azure）。マルチクラウド展開。Terragruntを使用。                          | 未着手  |

---
