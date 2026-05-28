import json
from sqlalchemy.orm import Session
from .models import GrainDetail

GRAINS_SEED = [
    {
        "name": "Rice",
        "description": "Rice is the seed of the grass species Oryza sativa. It is the most widely consumed staple food for a large part of the world's human population, especially in Asia.",
        "nutrition_calories": 365.0,
        "nutrition_protein": 7.1,
        "nutrition_carbs": 80.0,
        "nutrition_fat": 0.6,
        "nutrition_fiber": 1.3,
        "cultivation_info": "Grown in flooded paddies. Requires warm, humid climate and clayey/loamy soil. Needs a lot of water and sunshine.",
        "uses": "Staple food cooked by boiling, used in sushi, risotto, pilaf, or processed into flour, syrup, and rice milk.",
        "translations_json": json.dumps({
            "es": {
                "name": "Arroz",
                "description": "El arroz es la semilla de la planta Oryza sativa. Es el alimento básico más consumido por una gran parte de la población mundial, especialmente en Asia.",
                "cultivation_info": "Cultivado en arrozales inundados. Requiere clima cálido y húmedo y suelo arcilloso. Necesita mucha agua y sol.",
                "uses": "Alimento básico cocido al vapor, utilizado en sushi, risotto, paella, o procesado en harina."
            },
            "hi": {
                "name": "चावल (Rice)",
                "description": "चावल ओरिज़ा सैटिवा पौधे का बीज है। यह दुनिया की एक बड़ी मानव आबादी, विशेष रूप से एशिया में सबसे व्यापक रूप से खाया जाने वाला मुख्य भोजन है।",
                "cultivation_info": "बाढ़ वाले खेतों में उगाया जाता है। इसके लिए गर्म, आर्द्र जलवायु और मिट्टी की आवश्यकता होती है। बहुत अधिक पानी और धूप चाहिए।",
                "uses": "उबालकर खाया जाता है, खिचड़ी, पुलाव, बिरयानी में इस्तेमाल होता है या आटा और सिरप में संसाधित किया जाता है।"
            },
            "fr": {
                "name": "Riz",
                "description": "Le riz est la graine de l'espèce de graminée Oryza sativa. C'est l'aliment de base le plus consommé pour une grande partie de la population mondiale, notamment en Asie.",
                "cultivation_info": "Cultivé dans des rizières inondées. Nécessite un climat chaud et humide et un sol argileux. Nécessite beaucoup d'eau et de soleil.",
                "uses": "Aliment de base cuit à l'eau, utilisé dans les sushis, risottos, paellas ou transformé en farine."
            }
        })
    },
    {
        "name": "Wheat",
        "description": "Wheat is a cereal grain, originally from the Levant region but now cultivated worldwide. It is grown on more land area than any other food crop.",
        "nutrition_calories": 340.0,
        "nutrition_protein": 13.2,
        "nutrition_carbs": 72.0,
        "nutrition_fat": 2.5,
        "nutrition_fiber": 10.7,
        "cultivation_info": "Requires well-drained loamy soil, moderate rainfall, and moderate temperatures. Grown during winter or early spring.",
        "uses": "Ground into flour to make bread, pasta, noodles, cakes, biscuits, couscous, and used in fermentation.",
        "translations_json": json.dumps({
            "es": {
                "name": "Trigo",
                "description": "El trigo es un cereal originario de la región de Levante pero cultivado en todo el mundo. Se cultiva en más superficie que cualquier otro cultivo alimentario.",
                "cultivation_info": "Requiere suelo franco bien drenado, lluvia moderada y temperaturas templadas. Se cultiva en invierno o primavera temprana.",
                "uses": "Molido en harina para hacer pan, pasta, fideos, pasteles, galletas y en fermentación."
            },
            "hi": {
                "name": "गेहूं (Wheat)",
                "description": "गेहूं एक अनाज है, जो मूल रूप से लेवंत क्षेत्र से है लेकिन अब दुनिया भर में खेती की जाती है। यह किसी भी अन्य खाद्य फसल की तुलना में अधिक भूमि क्षेत्र पर उगाया जाता है।",
                "cultivation_info": "अच्छी जल निकासी वाली दोमट मिट्टी, मध्यम वर्षा और मध्यम तापमान की आवश्यकता होती है। सर्दियों या वसंत की शुरुआत में उगाया जाता है।",
                "uses": "रोटी, पास्ता, नूडल्स, केक, बिस्कुट बनाने के लिए आटे में पीसा जाता है और किण्वन में उपयोग किया जाता है।"
            },
            "fr": {
                "name": "Blé",
                "description": "Le blé est une céréale originaire du Levant mais aujourd'hui cultivée dans le monde entier. Il est cultivé sur plus de superficie que toute autre culture alimentaire.",
                "cultivation_info": "Nécessite un sol limoneux bien drainé, des précipitations modérées et des températures douces. Cultivé en hiver ou au début du printemps.",
                "uses": "Moulu en farine pour faire du pain, des pâtes, des nouilles, des gâteaux, des biscuits et utilisé dans la fermentation."
            }
        })
    },
    {
        "name": "Maize",
        "description": "Maize, also known as corn, is a cereal grain first domesticated by indigenous peoples in southern Mexico about 10,000 years ago.",
        "nutrition_calories": 365.0,
        "nutrition_protein": 9.4,
        "nutrition_carbs": 74.0,
        "nutrition_fat": 4.7,
        "nutrition_fiber": 7.3,
        "cultivation_info": "Thrives in warm weather with fertile, well-drained soils and plenty of sunshine. Requires regular watering.",
        "uses": "Used for making cornstarch, cornmeal, polenta, tortillas, popcorn, corn oil, and syrup, as well as animal feed.",
        "translations_json": json.dumps({
            "es": {
                "name": "Maíz",
                "description": "El maíz es un cereal domesticado por primera vez por los pueblos indígenas en el sur de México hace unos 10,000 años.",
                "cultivation_info": "Prospera en climas cálidos con suelos fértiles y bien drenados y mucho sol. Requiere riego regular.",
                "uses": "Usado para hacer almidón de maíz, harina, polenta, tortillas, palomitas de maíz, aceite de maíz y jarabe."
            },
            "hi": {
                "name": "मक्का (Maize)",
                "description": "मक्का एक अनाज है जिसे लगभग 10,000 साल पहले दक्षिणी मैक्सिको में स्वदेशी लोगों द्वारा पहली बार पालतू बनाया गया था।",
                "cultivation_info": "उपजाऊ, अच्छी जल निकासी वाली मिट्टी और प्रचुर मात्रा में धूप के साथ गर्म मौसम में पनपता है। नियमित पानी की आवश्यकता होती है।",
                "uses": "कॉर्नस्टार्च, मक्के का आटा, दलिया, टॉर्टिला, पॉपकॉर्न, मक्के का तेल और सिरप बनाने के साथ-साथ पशु चारा बनाने में उपयोग किया जाता है।"
            },
            "fr": {
                "name": "Maïs",
                "description": "Le maïs est une céréale domestiquée pour la première fois par les peuples autochtones du sud du Mexique il y a environ 10 000 ans.",
                "cultivation_info": "Prospère par temps chaud avec des sols fertiles et bien drainés et beaucoup de soleil. Nécessite un arrosage régulier.",
                "uses": "Utilisé pour faire de la fécule de maïs, de la semoule, de la polenta, des tortillas, du pop-corn, de l'huile de maïs et du sirop."
            }
        })
    },
    {
        "name": "Barley",
        "description": "Barley is a major cereal grain widely used in food, beverages, and animal feed. It is one of the first cultivated grains.",
        "nutrition_calories": 354.0,
        "nutrition_protein": 12.5,
        "nutrition_carbs": 73.5,
        "nutrition_fat": 2.3,
        "nutrition_fiber": 17.3,
        "cultivation_info": "Cool climate crop, tolerant of poor soils and salinity. Needs well-drained soils and moderate rainfall.",
        "uses": "Principally used for beer brewing, whiskey distilling, animal feed, and in soups, stews, and barley bread.",
        "translations_json": json.dumps({
            "es": {
                "name": "Cebada",
                "description": "La cebada es un grano de cereal importante ampliamente utilizado en alimentos, bebidas y alimentación animal. Es uno de los primeros granos cultivados.",
                "cultivation_info": "Cultivo de clima fresco, tolerante a suelos pobres y salinidad. Necesita suelos bien drenados y lluvia moderada.",
                "uses": "Utilizado principalmente para la elaboración de cerveza, destilación de whisky, alimentación animal y en sopas y guisos."
            },
            "hi": {
                "name": "जौ (Barley)",
                "description": "जौ एक प्रमुख अनाज है जिसका व्यापक रूप से भोजन, पेय पदार्थों और पशु आहार में उपयोग किया जाता है। यह पहले खेती वाले अनाजों में से एक है।",
                "cultivation_info": "ठंडी जलवायु की फसल, खराब मिट्टी और लवणता के प्रति सहनशील। अच्छी जल निकासी वाली मिट्टी और मध्यम वर्षा की आवश्यकता होती है।",
                "uses": "मुख्य रूप से बीयर बनाने, व्हिस्की डिस्टिलिंग, पशु आहार, और सूप, स्टू और जौ की रोटी में उपयोग किया जाता है।"
            },
            "fr": {
                "name": "Orge",
                "description": "L'orge est une céréale majeure largement utilisée dans l'alimentation humaine, les boissons et l'alimentation animale. C'est l'un des premiers grains cultivés.",
                "cultivation_info": "Culture de climat frais, tolérante aux sols pauvres et à la salinité. Nécessite des sols bien drainés et des précipitations modérées.",
                "uses": "Principalement utilisé pour le brassage de la bière, la distillation du whisky, l'alimentation animale, et dans les soupes, ragoûts."
            }
        })
    },
    {
        "name": "Millet",
        "description": "Millets are a highly varied group of small-seeded grasses, widely grown around the world as cereal crops for fodder and human food.",
        "nutrition_calories": 378.0,
        "nutrition_protein": 11.0,
        "nutrition_carbs": 73.0,
        "nutrition_fat": 4.2,
        "nutrition_fiber": 8.5,
        "cultivation_info": "Extremely drought-tolerant. Grows in dry, hot climates and poor, sandy soils. Requires very little water.",
        "uses": "Cooked as porridge, ground into flour for flatbreads, used in snacks, and widely used as birdseed and fodder.",
        "translations_json": json.dumps({
            "es": {
                "name": "Mijo",
                "description": "Los mijos son un grupo altamente variado de gramíneas de semilla pequeña, cultivadas ampliamente en todo el mundo como cereales para forraje y alimentación humana.",
                "cultivation_info": "Extremadamente tolerante a la sequía. Crece en climas cálidos y secos y en suelos pobres y arenosos.",
                "uses": "Cocinado como papilla, molido en harina para panes planos, utilizado en bocadillos y como alpiste."
            },
            "hi": {
                "name": "बाजरा (Millet)",
                "description": "बाजरा छोटी बीज वाली घासों का एक अत्यधिक विविध समूह है, जो दुनिया भर में चारे और मानव भोजन के लिए अनाज फसलों के रूप में व्यापक रूप से उगाया जाता है।",
                "cultivation_info": "अत्यधिक सूखा-सहिष्णु। शुष्क, गर्म जलवायु और खराब, रेतीली मिट्टी में उगता है। बहुत कम पानी की आवश्यकता होती है।",
                "uses": "दलिया के रूप में पकाया जाता है, रोटी के लिए आटे में पीसा जाता है, स्नैक्स में और व्यापक रूप से पक्षियों के दाने और चारे के रूप में उपयोग किया जाता है।"
            },
            "fr": {
                "name": "Millet",
                "description": "Les millets sont un groupe très varié de graminées à petites graines, largement cultivées dans le monde comme céréales pour le fourrage et l'alimentation humaine.",
                "cultivation_info": "Extrêmement résistant à la sécheresse. Pousse dans les climats secs et chauds et les sols pauvres et sableux.",
                "uses": "Cuit sous forme de bouillie, moulu en farine pour les galettes, utilisé dans les collations, et comme graines pour oiseaux."
            }
        })
    },
    {
        "name": "Oats",
        "description": "Oats is a species of cereal grain grown for its seed, which is known by the same name. Oats are suitable for human consumption as oatmeal and oat milk.",
        "nutrition_calories": 389.0,
        "nutrition_protein": 16.9,
        "nutrition_carbs": 66.0,
        "nutrition_fat": 6.9,
        "nutrition_fiber": 10.6,
        "cultivation_info": "Prefers cool, moist climates. Does well in acid soils and requires moderate rainfall. Common in northern climates.",
        "uses": "Rolled or ground for porridge (oatmeal), used in granola, muesli, cookies, and processed into oat milk.",
        "translations_json": json.dumps({
            "es": {
                "name": "Avena",
                "description": "La avena es una especie de cereal cultivada por su semilla. Es ideal para consumo humano en forma de harina de avena y leche de avena.",
                "cultivation_info": "Prefiere climas frescos y húmedos. Prospera en suelos ácidos y requiere lluvia moderada.",
                "uses": "Copos o molida para papilla (avena), utilizada en granola, muesli, galletas y procesada en leche de avena."
            },
            "hi": {
                "name": "जई (Oats)",
                "description": "जई एक अनाज की प्रजाति है जो अपने बीज के लिए उगाई जाती है। जई मानव उपभोग के लिए दलिया और जई के दूध के रूप में उपयुक्त हैं।",
                "cultivation_info": "ठंडी, नम जलवायु पसंद करती है। अम्लीय मिट्टी में अच्छी तरह से बढ़ती है और मध्यम वर्षा की आवश्यकता होती है।",
                "uses": "दलिया (ओटमील) के लिए रोल या पीसा जाता है, ग्रेनोला, मूसली, कुकीज़ में उपयोग किया जाता है और जई के दूध में संसाधित किया जाता है।"
            },
            "fr": {
                "name": "Avoine",
                "description": "L'avoine est une espèce de céréale cultivée pour ses graines. L'avoine convient à la consommation humaine sous forme de flocons et de lait d'avoine.",
                "cultivation_info": "Préfère les climats frais et humides. Réussit bien dans les sols acides et nécessite des précipitations modérées.",
                "uses": "Flocons ou moulus pour la bouillie (porridge), utilisés dans le granola, le muesli, les biscuits et transformés en lait d'avoine."
            }
        })
    },
    {
        "name": "Chickpeas",
        "description": "The chickpea or garbanzo bean is an annual legume of the family Fabaceae. It is high in protein and is one of the earliest cultivated legumes.",
        "nutrition_calories": 364.0,
        "nutrition_protein": 19.3,
        "nutrition_carbs": 61.0,
        "nutrition_fat": 6.0,
        "nutrition_fiber": 17.0,
        "cultivation_info": "Requires subtropical or warm climate, sandy or loamy soils with good drainage. Fairly drought-tolerant.",
        "uses": "Used to make hummus, falafel, curries (chana masala), salads, and ground into chickpea flour (besan).",
        "translations_json": json.dumps({
            "es": {
                "name": "Garbanzos",
                "description": "El garbanzo es una legumbre anual de la familia Fabaceae. Es rico en proteínas y es una de las primeras legumbres cultivadas.",
                "cultivation_info": "Requiere clima subtropical o cálido, suelos arenosos o francos con buen drenaje. Bastante tolerante a la sequía.",
                "uses": "Usado para hacer hummus, falafel, curry (chana masala), ensaladas, y molido en harina de garbanzo (besán)."
            },
            "hi": {
                "name": "चना (Chickpeas)",
                "description": "चना फैबेसी परिवार का एक वार्षिक फलियां है। यह प्रोटीन से भरपूर होता है और सबसे पहले खेती की जाने वाली फलियों में से एक है।",
                "cultivation_info": "उपोष्णकटिबंधीय या गर्म जलवायु, अच्छी जल निकासी वाली रेतीली या दोमट मिट्टी की आवश्यकता होती है। काफी सूखा-सहिष्णु।",
                "uses": "हम्मस, फलाफेल, करी (चना मसाला), सलाद बनाने और चने के आटे (बेसन) में पीसने के लिए उपयोग किया जाता है।"
            },
            "fr": {
                "name": "Pois chiches",
                "description": "Le pois chiche est une légumineuse annuelle de la famille des Fabaceae. Il est riche en protéines et constitue l'une des premières légumineuses cultivées.",
                "cultivation_info": "Nécessite un climat subtropical ou chaud, des sols sableux ou limoneux avec un bon drainage. Assez résistant à la sécheresse.",
                "uses": "Utilisé pour faire du houmous, des falafels, des currys (chana masala), des salades et moulu en farine de pois chiche (besan)."
            }
        })
    },
    {
        "name": "Corn",
        "description": "Corn is a tall annual cereal grass (Zea mays) that is widely grown for its large yellow ears of starchy seeds.",
        "nutrition_calories": 365.0,
        "nutrition_protein": 9.4,
        "nutrition_carbs": 74.0,
        "nutrition_fat": 4.7,
        "nutrition_fiber": 7.3,
        "cultivation_info": "Prefers fertile, well-drained loams, warm temperatures, and frequent watering. Needs rich nitrogen soils.",
        "uses": "Eaten fresh as sweetcorn, boiled, roasted, or processed into corn flakes, grits, taco shells, and ethanol.",
        "translations_json": json.dumps({
            "es": {
                "name": "Elote / Maíz dulce",
                "description": "El maíz dulce es una variedad de maíz con alto contenido de azúcar. Se cosecha cuando las mazorcas están tiernas.",
                "cultivation_info": "Prefiere suelos fértiles y bien drenados, temperaturas cálidas y riego frecuente. Necesita suelos ricos en nitrógeno.",
                "uses": "Se come fresco cocido o asado, procesado en hojuelas de maíz, tortillas y jarabe."
            },
            "hi": {
                "name": "भुट्टा / मकई (Corn)",
                "description": "मक्का एक लंबा वार्षिक अनाज घास (ज़िया मेस) है जिसे इसके बड़े पीले रंग के स्टार्चयुक्त बीजों के लिए व्यापक रूप से उगाया जाता है।",
                "cultivation_info": "उपजाऊ, अच्छी जल निकासी वाली दोमट मिट्टी, गर्म तापमान और बार-बार सिंचाई पसंद करता है। नाइट्रोजन युक्त मिट्टी की आवश्यकता होती है।",
                "uses": "स्वीटकॉर्न के रूप में ताजा खाया जाता है, उबाला जाता है, भुना जाता है, या कॉर्न फ्लेक्स, दलिया, टैको शेल में संसाधित किया जाता है।"
            },
            "fr": {
                "name": "Maïs doux",
                "description": "Le maïs est une grande graminée céréalière annuelle (Zea mays) largement cultivée pour ses grands épis jaunes de graines féculentes.",
                "cultivation_info": "Préfère les limons fertiles et bien drainés, les températures chaudes et les arrosages fréquents. Nécessite des sols riches en azote.",
                "uses": "Mangé frais cuit à l'eau ou grillé, transformé en cornflakes, tortillas et éthanol."
            }
        })
    },
    {
        "name": "Pulses",
        "description": "Pulses are the edible seeds of plants in the legume family. They include lentils, dry peas, and beans, and are high in protein and fiber.",
        "nutrition_calories": 350.0,
        "nutrition_protein": 24.5,
        "nutrition_carbs": 60.0,
        "nutrition_fat": 1.1,
        "nutrition_fiber": 15.0,
        "cultivation_info": "Grown in rotation with other crops. They fix nitrogen in the soil, improving soil health. Require moderate water.",
        "uses": "Used in dals, soups, stews, salads, curries, and processed into protein powders and meat substitutes.",
        "translations_json": json.dumps({
            "es": {
                "name": "Legumbres",
                "description": "Las legumbres son las semillas comestibles de las plantas de la familia de las leguminosas. Incluyen lentejas, guisantes secos y frijoles.",
                "cultivation_info": "Cultivado en rotación con otros cultivos. Fijan nitrógeno en el suelo, mejorando su fertilidad. Requieren agua moderada.",
                "uses": "Utilizado en guisos, sopas, ensaladas, curries, y procesado en polvos de proteína o sustitutos de carne."
            },
            "hi": {
                "name": "दालें (Pulses)",
                "description": "दालें फलियां परिवार के पौधों के खाद्य बीज हैं। इनमें दालें, सूखे मटर और बीन्स शामिल हैं, और इनमें प्रोटीन और फाइबर प्रचुर मात्रा में होता है।",
                "cultivation_info": "अन्य फसलों के साथ बारी-बारी से उगाया जाता है। वे मिट्टी में नाइट्रोजन का स्थिरीकरण करते हैं, जिससे मिट्टी के स्वास्थ्य में सुधार होता है।",
                "uses": "दाल, सूप, स्टू, सलाद, करी में उपयोग किया जाता है और प्रोटीन पाउडर और मांस के विकल्पों में संसाधित किया जाता है।"
            },
            "fr": {
                "name": "Légumineuses",
                "description": "Les légumineuses sont les graines comestibles des plantes de la famille des légumineuses. Elles comprennent les lentilles, les pois secs et les haricots.",
                "cultivation_info": "Cultivées en rotation avec d'autres cultures. Elles fixent l'azote dans le sol, améliorant sa fertilité. Nécessitent peu d'eau.",
                "uses": "Utilisées dans les dhal, soupes, ragoûts, salades, currys, et transformées en poudres protéinées."
            }
        })
    }
]

def seed_db(db: Session):
    """Seed the database with default grain details if the table is empty."""
    count = db.query(GrainDetail).count()
    if count == 0:
        print("Seeding database with default grain details...")
        for seed in GRAINS_SEED:
            db_grain = GrainDetail(
                name=seed["name"],
                description=seed["description"],
                nutrition_calories=seed["nutrition_calories"],
                nutrition_protein=seed["nutrition_protein"],
                nutrition_carbs=seed["nutrition_carbs"],
                nutrition_fat=seed["nutrition_fat"],
                nutrition_fiber=seed["nutrition_fiber"],
                cultivation_info=seed["cultivation_info"],
                uses=seed["uses"],
                translations_json=seed["translations_json"]
            )
            db.add(db_grain)
        db.commit()
        print("Database seeded successfully.")
    else:
        print(f"Database already has {count} grain entries. Seeding skipped.")
