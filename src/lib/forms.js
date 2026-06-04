export const forms = {
  "Eyewash": {
    en: {
      title: "Eyewash Safety Checklist – Stores",
      description: "Checklist for inspecting eyewash stations.",
      fields: [
        { name: "company", label: "Company", type: "text", required: true },
        { name: "department", label: "Department / Zone", type: "text", required: true },
        { name: "location", label: "Location of eyewash station", type: "text", required: true },
      ],
      items: [
        "Access – Path to station clear (no obstacles, pallets, equipment).",
        "Lighting – Area well-lit, emergency light functional if equipped",
        "Signage – Highly visible sign (dark yellow/green with ISO 7010 pictogram).",
        "Shut-off valve – No leaks, no corrosion, handles easily.",
        "Nozzle covers – Present, intact, clean, not yellowed or brittle.",
        "Bowl / basin – Clean, no debris, no scratches.",
        "Protective covers – Closed (if unit is plumbed-in).",
        "No hazardous chemicals stored directly next to unit",
        "Water clarity – Clear, no rust, no particles.",
        "Flow rate (quick check) – Visually strong, steady flow"
      ],
      itemOptions: ["Compliant", "Non-Compliant", "Corrective Action Required"]
    },
    ar: {
      title: "قائمة فحص سلامة غسيل العين – المستودعات",
      description: "قائمة مرجعية لفحص محطات غسيل العين.",
      fields: [
        { name: "company", label: "الشركة", type: "text", required: true },
        { name: "department", label: "القسم / المنطقة", type: "text", required: true },
        { name: "location", label: "موقع محطة غسيل العين", type: "text", required: true },
      ],
      items: [
        "الوصول - مسار المحطة واضح (بدون عوائق، منصات، معدات).",
        "الإضاءة - منطقة مضاءة جيدًا، ضوء الطوارئ يعمل إذا كان مجهزًا",
        "اللافتات - لافتة مرئية للغاية (أصفر/أخضر داكن مع رسم تخطيطي ISO 7010).",
        "صمام الإغلاق - لا يوجد تسرب، لا يوجد تآكل، يسهل التعامل معه.",
        "أغطية الفوهات - موجودة، سليمة، نظيفة، ليست صفراء أو هشة.",
        "الوعاء / الحوض - نظيف، لا يوجد حطام، لا يوجد خدوش.",
        "الأغطية الواقية - مغلقة (إذا كانت الوحدة موصلة بأنابيب).",
        "لا توجد مواد كيميائية خطرة مخزنة بجوار الوحدة مباشرة",
        "وضوح الماء - صافي، لا يوجد صدأ، لا توجد جزيئات.",
        "معدل التدفق (فحص سريع) - تدفق قوي ومستقر بصريًا"
      ],
      itemOptions: ["مطابق", "غير مطابق", "إجراء تصحيحي مطلوب"]
    }
  },
  "Forklift": {
    en: {
      title: "Forklift Checklist",
      description: "Daily inspection checklist for forklift operators.",
      fields: [
        { name: "forkliftReg", label: "Forklift Reg #", type: "text", required: true },
        { name: "site", label: "Site / Location", type: "text", required: true },
        { name: "contractor", label: "Contractor", type: "text", required: true },
      ],
      items: [
        "Lift system (includes cables, forks, etc.)",
        "Seat Belt",
        "Cabin",
        "Emergency Tool",
        "Steps",
        "Manufacturer Manual/ Maintenance Program",
        "Leakage in hydraulic cylinders",
        "Leakage of Diesel/ Oil and Lubricant etc.",
        "Warning & Cautionary Boards",
        "Main clutch",
        "Condition of Tyre/Tyre pressure",
        "Condition of Battery and Lamps",
        "Reverse horn",
        "Operators Fitness",
        "Fire Extinguisher in operators cabin",
        "Rotatory beacons",
        "Personnel operating the forklift properly trained.",
        "Registration & Insurance Paper",
        "Forklift Operator License",
        "Forklift Operator TTSJV ID Badge",
        "Forklift Operator 3rd party valid certified Paper",
        "Qualified & Third Party certified Rigger",
        "Forklift 3rd Party valid certified Paper",
        "SWL Marked on equipment"
      ],
      itemOptions: ["OK", "NOT OK", "N/A"],
      extraFields: [
        { name: "actionTaken", label: "Action Taken", type: "textarea", required: false }
      ]
    },
    ar: {
      title: "قائمة فحص الرافعة الشوكية",
      description: "قائمة فحص يومية لمشغلي الرافعة الشوكية.",
      fields: [
        { name: "forkliftReg", label: "رقم تسجيل الرافعة الشوكية", type: "text", required: true },
        { name: "site", label: "الموقع / المكان", type: "text", required: true },
        { name: "contractor", label: "المقاول", type: "text", required: true },
      ],
      items: [
        "نظام الرفع (يشمل الكابلات، الشوك، إلخ)",
        "حزام الأمان",
        "الكابينة",
        "أداة الطوارئ",
        "الخطوات",
        "دليل الشركة المصنعة / برنامج الصيانة",
        "تسرب في الأسطوانات الهيدروليكية",
        "تسرب الديزل / الزيت والزيوت المعدنية إلخ.",
        "لوحات التحذير والاحتراس",
        "القابض الرئيسي",
        "حالة الإطارات / ضغط الإطارات",
        "حالة البطارية والمصابيح",
        "بوق الرجوع للخلف",
        "لياقة المشغلين",
        "طفاية حريق في كابينة المشغل",
        "منارات دوارة",
        "الأفراد الذين يشغلون الرافعة الشوكية مدربون تدريباً مناسباً.",
        "ورقة التسجيل والتأمين",
        "رخصة مشغل الرافعة الشوكية",
        "شارة تعريف مشغل الرافعة الشوكية TTSJV",
        "ورقة معتمدة سارية المفعول لطرف ثالث لمشغل الرافعة الشوكية",
        "مجهز مؤهل ومعتمد من طرف ثالث",
        "ورقة معتمدة سارية المفعول لطرف ثالث للرافعة الشوكية",
        "SWL محدد على المعدات"
      ],
      itemOptions: ["موافق", "غير موافق", "غير متاح"],
      extraFields: [
        { name: "actionTaken", label: "الإجراء المتخذ", type: "textarea", required: false }
      ]
    }
  },
  "Site Safety": {
    en: {
      title: "Site Safety Checklist",
      description: "Comprehensive site safety inspection.",
      fields: [
        { name: "location", label: "Location", type: "text", required: true },
        { name: "area", label: "Area", type: "text", required: true },
      ],
      sections: [
        {
          title: "A. PEDESTRIAN SAFETY",
          items: [
            "Pedestrian walkways clearly marked (yellow lines)",
            "Walkways free from obstructions, loose tools, cables, or spills",
            "High-spillage areas have anti-slip mats/carpets",
            "No cables running across pedestrian lanes (or properly covered/rewired)",
            "Moving vehicles have side mirrors installed and functional",
            "Drivers honk when approaching pedestrian zones or blind spots",
            "Objects stored at height are stable and size/weight appropriate",
            "Storage racks bolted to ground; no loose tools/materials on high platforms",
            "Work at height areas barricaded below"
          ]
        },
        {
          title: "B. LIFTING OPERATIONS",
          items: [
            "Lifting area isolated / barricaded during operations",
            "Load weight confirmed within equipment capacity (load chart visible)",
            "Load properly fastened/secured before lift",
            "Daily pre-use checklist completed for lifting equipment",
            "Lifting equipment maintenance up to date (records available)",
            "Third-party inspection certificate valid and displayed",
            "Operator trained and certified",
            "No obstructions blocking operator’s vision; or spotter used",
            "Speed limits enforced for lifting vehicles; horns used at intersections"
          ]
        },
        {
          title: "C. WOODWORKS",
          items: [
            "Cutting tools have guards/covers; emergency stops within reach",
            "Operators using anti-cut gloves and appropriate PPE",
            "Dust extraction / local exhaust ventilation (LEV) working",
            "Dust masks provided and worn (if LEV insufficient)",
            "Eye protection (visors/safety glasses) used for flying chips",
            "Wood storage away from ignition sources; fire detection/alarm system functional",
            "Firefighting equipment (extinguishers) accessible and inspected",
            "Woodworking area isolated (noise barrier) and hearing protection used",
            "Hand-held tools checked for vibration dampers; workers have rotating schedules",
            "General housekeeping: dust and wood chips cleaned regularly"
          ]
        }
      ],
      itemOptions: ["Yes", "No", "N/A"]
    },
    ar: {
      title: "قائمة فحص سلامة الموقع",
      description: "فحص شامل لسلامة الموقع.",
      fields: [
        { name: "location", label: "الموقع", type: "text", required: true },
        { name: "area", label: "المنطقة", type: "text", required: true },
      ],
      sections: [
        {
          title: "أ. سلامة المشاة",
          items: [
            "ممرات المشاة محددة بوضوح (خطوط صفراء)",
            "الممرات خالية من العوائق والأدوات السائبة والكابلات أو الانسكابات",
            "المناطق ذات الانسكاب العالي بها حصائر/سجاد مضاد للانزلاق",
            "لا توجد كابلات تعمل عبر ممرات المشاة (أو مغطاة/موصولة بشكل صحيح)",
            "المركبات المتحركة بها مرايا جانبية مثبتة وتعمل",
            "يطلق السائقون بوق السيارة عند الاقتراب من مناطق المشاة أو النقاط العمياء",
            "الأشياء المخزنة في الأعلى مستقرة ومناسبة من حيث الحجم/الوزن",
            "رفوف التخزين مثبتة على الأرض؛ لا توجد أدوات/مواد سائبة على منصات عالية",
            "العمل في مناطق مرتفعة محاط بحواجز أدناه"
          ]
        },
        {
          title: "ب. عمليات الرفع",
          items: [
            "منطقة الرفع معزولة / محاطة بحواجز أثناء العمليات",
            "تأكيد وزن الحمل ضمن قدرة المعدات (مخطط التحميل مرئي)",
            "ربط/تأمين الحمل بشكل صحيح قبل الرفع",
            "إكمال قائمة الفحص اليومية قبل الاستخدام لمعدات الرفع",
            "صيانة معدات الرفع محدثة (السجلات متاحة)",
            "شهادة فحص طرف ثالث صالحة ومعروضة",
            "المشغل مدرب ومعتمد",
            "لا توجد عوائق تحجب رؤية المشغل؛ أو يتم استخدام مراقب",
            "حدود السرعة مطبقة على مركبات الرفع؛ استخدام الأبواق عند التقاطعات"
          ]
        },
        {
          title: "ج. الأعمال الخشبية",
          items: [
            "أدوات القطع بها حراس/أغطية؛ نقاط توقف الطوارئ في متناول اليد",
            "يستخدم المشغلون قفازات مضادة للقطع ومعدات الوقاية الشخصية المناسبة",
            "استخراج الغبار / تهوية العادم المحلي (LEV) تعمل",
            "أقنعة الغبار متوفرة ومستعملة (إذا كان LEV غير كافٍ)",
            "استخدام حماية العين (واقيات/نظارات أمان) للرقائق المتطايرة",
            "تخزين الخشب بعيدًا عن مصادر الاشتعال؛ نظام الكشف عن الحرائق/الإنذار يعمل",
            "معدات مكافحة الحرائق (طفايات) يمكن الوصول إليها وتم فحصها",
            "منطقة الأعمال الخشبية معزولة (حاجز ضوضاء) واستخدام حماية السمع",
            "فحص الأدوات المحمولة باليد لمخمدات الاهتزاز؛ لدى العمال جداول متناوبة",
            "التدبير المنزلي العام: تنظيف الغبار ورقائق الخشب بانتظام"
          ]
        }
      ],
      itemOptions: ["نعم", "لا", "غير متاح"]
    }
  }
};
