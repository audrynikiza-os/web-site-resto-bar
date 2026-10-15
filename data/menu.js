// ============================================================
//  UMUCO RESTO-BAR — MENU & PRIX
//  Modifiez les prix et les plats ici, le site se met à jour
//  automatiquement. Les prix sont en francs burundais (FBu).
// ============================================================

const UMUCO_MENU = {
  drinks: {
    groups: [
      {
        name_fr: "Bières",
        name_en: "Beers",
        items: [
          { name_fr: "Primus Star", name_en: "Primus Star", price: 6000 },
          { name_fr: "Petite Primus Star", name_en: "Small Primus Star", price: 5000 },
          { name_fr: "Amstel Blonde", name_en: "Amstel Blonde", price: 9000 },
          { name_fr: "Amstel Bright", name_en: "Amstel Bright", price: 7000 },
          { name_fr: "Petite Amstel Bright", name_en: "Small Amstel Bright", price: 6000 },
          { name_fr: "Petite Amstel Blonde", name_en: "Small Amstel Blonde", price: 7000 },
          { name_fr: "Royal", name_en: "Royal", price: 8000 },
          { name_fr: "Bock", name_en: "Bock", price: 8000 }
        ]
      },
      {
        name_fr: "Boissons non alcoolisées",
        name_en: "Soft drinks",
        items: [
          { name_fr: "Fanta", name_en: "Fanta", price: 3000 },
          { name_fr: "Vitalo", name_en: "Vitalo", price: 2000 }
        ]
      }
    ]
  },
  food: {
    groups: [
      {
        name_fr: "Plats & Snacks",
        name_en: "Dishes & Snacks",
        items: [
          { name_fr: "Frites", name_en: "French fries", price: 7000 },
          { name_fr: "Brochette accompagnée", name_en: "Skewer with side dish", price: 15000 },
          { name_fr: "Rolex", name_en: "Rolex (omelette wrap)", price: 10000 },
          { name_fr: "Buffet", name_en: "Buffet", price: 15000 }
        ]
      }
    ]
  }
};
