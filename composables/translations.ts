interface Translations {
    ENG: {
        [key: string]: string;
    };
    FR: {
        [key: string]: string;
    };
    // Add other languages as needed
}

export const translations: Translations = {
    ENG: {
        dashboard: 'Dashboard',
        profile: 'Profile',
        user: 'User',
        category: 'Category',
        unit: 'Unit',
        product: 'Product',
        inventory: 'Inventory',
        purchase: 'Purchases',
        sales: 'Sales',
        stockSituation: 'Stock situation',
        firstName: 'First Name',
        lastName: 'Last Name',
        password: 'Password',
        confirmPassword: 'Confirm password',
        confirmPasswordPlaceholder: 'Repeat your password',
        phoneNumber: 'Phone number',
        errorEmail: 'The input is not a valid email format !',
        errorFirstName: 'Please input your first name !',
        errorLastName: 'Please input your last name !',
        errorPassword: "Please input the password for this new user !",
        errorConfirmPassword: "Please repeat your password !",
        errorPasswordDontMatch: 'Passwords do not match !',
        errorDesignation: 'Please enter the designation !',
        errorUnit: 'Unit is required !',
        errorCategory: 'Category is required !',
        errorQuantity: 'All quantity must be greater than 0 !',
        priceErrorGreater: 'The price must be greater than 0 !',
        unitPriceError: 'Please input the unit price !',
        purchasePriceError: 'Please input the purchase price !',
        updateProfile: 'Update profile',
        confirmationTitle: 'Confirmation Required',
        confirmationDescription: 'Are you sure you want to proceed? This action is irreversible.',
        success: 'Success',
        successDescription: 'Operation Successful !',
        error: 'Error',
        warning: 'Attention',
        yes: 'Yes',
        no: 'No',
        active: 'Active',
        deleted: 'Deleted',
        old: 'Old',
        role: 'Role',
        admin: 'Admin',
        manager: 'Manager',
        status: 'Status',
        add: 'Add',
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
        designation: 'Designation',
        unitPrice: 'Unit price',
        wholesalePrice: 'Wholesale price',
        purchasePrice: 'Purchase price',
        all: 'All',
        search: 'Search',
        descriptionPlaceholder: 'You can write an description here',
        selectProduct: 'Select product',
        selectUnit: 'Select unit',
        selectCategory: 'Select category',
        modalSalesPriceTitle: 'Sales price of',
        inProgress: 'In progress',
        validated: 'Validated',
        rejected: 'Rejected',
        completed: 'Completed',
        editor: 'Editor',
        validator: 'Validator',
        remainingStock: 'Remaining stock',
        quantity: 'Quantity',
        amount: 'Amount',
        productAvailable: 'Product available in stock',
        productOutOfStock: 'Product out of stock',
        startDate: 'Start date',
        endDate: 'End date',
        selectProductError: 'Can not select a product already selected !',
        addRowDetailsError: 'Impossible to add a new line if you have a line that does not yet have a product !',
        rejectModalTitle: 'Reject movement',
        observationError: 'Please input your observation !',
        ValidationHistory: 'Validation History',
        summarize: 'Summarize',
        output: 'Output',
        input: 'Input',
        stockInput: 'Stock input',
        stockOutput: 'Stock output',
        makePurchase: 'Making a purchase',
        newPurchase: 'New purchase',
        errorPurchase: "You can't make a purchase without details !",
        makeSales: 'Making a sale',
        newSales: 'New sale',
        errorSale: "You can't make a sale without details !",
        priceType: "Price type",
        unitaryPriceType: "Unitary",
        wholesalePriceType: "Wholesale",
        salesDetails: 'Sale details',
        purchaseDetails: 'Purchase details',
        errorSaveDetailsSales: 'You have not selected a product or quantity fields are not greater than 0',
        settings: 'Settings',
        settings_generale: 'General parameters',
        generale: 'General',
        companyName: 'Company name',
        companyEmail: 'Company email',
        companyAddress: 'Company address',
        companyPhoneNumber: 'Company phone number',
        currencyType: 'Currency type',
        errorCompanyName: 'Company name is required !',
        errorCompanyAddress: 'Company address is required !',
        errorCompanyPhoneNumber: 'Company phone number is required !',
        updateSettings: 'Update Settings',
        expensesType: 'Expenses type',
        expenses: 'Expenses',
        selectExpensesType: 'Select expense type',
        expensesTypeError: 'Expenses type is required !',
        otherDescriptions: 'Other descriptions',
        amountGreaterError: 'The amount must be greater than 0 !',
        amountError: 'The amount is required',
        initialCash: 'Initial cash',
        cashSummary: 'Cash summary',
        amountInput: 'Amount input',
        amountOutput: 'Amount output',
        realCash: 'Real cash',
        profits: 'Profits',
        losses: 'Losses',
        profitsLosses: 'Profits and losses',
        salesPurchases: 'Sales and purchases',
        presentSales: 'Present sales',
        presentPurchase: 'Present purchase',
        presentExpenses: 'Present expenses',
        totalOfSales: 'Total of sales',
        totalOfPurchase: 'Total of purchase',
        totalOfExpenses: 'Total of expenses',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly',
        recipes: "The recipes",
        revenue: "Revenue",
        quantityDelivered: "Quantity delivered",
        invoice: 'Invoice',
        amountPaid: 'Amount paid',
        amountStillToBePaid: 'Amount still to be paid',
        remainderToBeDelivered: 'Remainder to be delivered',
        amountToBeReimbursed: 'Amount to be reimbursed',
        clientAmount: 'Client amount',
        errorClientAmount: 'The client amount must be greater than or equal to the amount paid or be equal to 0.',
        generate: 'Generate',
        refresh: 'Refresh',
    },
    FR: {
        dashboard: 'Tableau de bord',
        profile: 'Profil',
        user: 'Utilisateur',
        category: 'Catégorie',
        unit: 'Unité',
        product: 'Produit',
        inventory: 'Inventaire',
        purchase: 'Achats',
        sales: 'Ventes',
        firstName: 'Prènoms',
        lastName: 'Nom',
        password: 'Mot de passe',
        confirmPassword: 'Confirmation Mot de passe',
        confirmPasswordPlaceholder: 'Répéter votre mot de passe',
        phoneNumber: 'Numéro de téléphone',
        errorEmail: "L'entrée n'est pas un format d'email valide !",
        errorFirstName: "Veuillez saisir vos prènoms !",
        errorLastName: "Veuillez saisir votre Nom !",
        errorPassword: "Veuillez saisir le mot de passe de ce nouvel utilisateur !",
        errorConfirmPassword: "Veuillez répéter votre mot de passe !",
        errorPasswordDontMatch: 'Les mots de passe ne correspondent pas !',
        errorDesignation: 'Veuillez entrer la désignation !',
        errorUnit: "L'unité est obligatoire !",
        errorCategory: 'La catégorie est obligatoire !',
        errorQuantity: 'Toutes les quantités doivent être supérieures à 0 !',
        priceErrorGreater: 'Le prix doit être supérieur à 0 !',
        unitPriceError: 'Veuillez indiquer le prix unitaire !',
        purchasePriceError: "Veuillez indiquer le prix d'achat !",
        updateProfile: 'Mettre à jour le profil',
        confirmationTitle: 'Confirmation nécessaire',
        confirmationDescription: 'Êtes-vous sûr de vouloir continuer ? Cette action est irréversible.',
        success: 'Succès',
        successDescription: 'Opération réussie !',
        error: 'Erreur',
        warning: 'Attention',
        yes: 'Oui',
        no: 'Non',
        active: 'Actif',
        deleted: 'Supprimé',
        old: 'Ancienne',
        role: 'Rôle',
        admin: 'Administrateur',
        manager: 'Gestionnaire',
        status: 'État',
        add: 'Ajouter',
        save: 'sauvegarder',
        cancel: 'Annuler',
        close: 'Fermer',
        designation: 'Désignation',
        unitPrice: 'Prix unitaire',
        wholesalePrice: 'Prix de gros',
        purchasePrice: "Prix d'achat",
        all: 'Tous',
        search: 'Rechercher',
        descriptionPlaceholder: 'Vous pouvez écrire une description ici.',
        selectProduct: 'Sélectionner un produit',
        selectUnit: "Sélectionner l'unité",
        selectCategory: "Sélectionner une catégorie",
        modalSalesPriceTitle: "Prix de vente du",
        inProgress: 'En cours',
        validated: 'Validé',
        rejected: 'Rejeté',
        completed: 'Terminé',
        editor: 'Éditeur',
        validator: 'Validateur',
        remainingStock: 'Stock restant',
        quantity: 'Quantité',
        amount: 'Montant',
        productAvailable: 'Produit disponible en stock',
        productOutOfStock: 'Produit en rupture de stock',
        newPurchase: 'Nouvel achat',
        startDate: 'Date de début',
        endDate: 'Date de fin',
        selectProductError: 'Impossible de sélectionner un produit déjà sélectionné !',
        addRowDetailsError: "Impossible d'ajouter une nouvelle ligne si vous avez une ligne qui n'a pas encore de produit.",
        rejectModalTitle: 'Rejeter le mouvement',
        observationError: 'Faites part de vos observations !',
        ValidationHistory: 'Historique des validations',
        summarize: 'Résumer',
        stockSituation: 'Situation des stocks',
        output: 'Sorties',
        input: 'Entrées',
        stockInput: 'Entrée en stock',
        stockOutput: 'Sortie en stock',
        makePurchase: 'Effectuer un achat',
        errorPurchase: "Vous ne pouvez pas faire d'achat sans détails !",
        makeSales: 'Effectuer une vente',
        newSales: 'Nouvelle vente',
        errorSale: "Vous ne pouvez pas réaliser une vente sans détails !",
        priceType: "Type de prix",
        unitaryPriceType: "Unitaire",
        wholesalePriceType: "Vente en gros",
        salesDetails: 'Détails de la vente',
        purchaseDetails: "Détails de l'achat",
        errorSaveDetailsSales: "Vous n'avez pas sélectionné de produit ou les champs de quantité ne sont pas supérieurs à 0",
        settings: 'Paramètres',
        settings_generale: 'Paramètres généraux',
        generale: 'Général',
        companyName: 'Raison sociale',
        companyEmail: "Email de l'entreprise",
        companyAddress: "Adresse de l'entreprise",
        companyPhoneNumber: "Numéro de téléphone de l'entreprise",
        currencyType: 'Type de devise',
        errorCompanyName: 'Company name is required !',
        errorCompanyAddress: 'Company address is required !',
        errorCompanyPhoneNumber: 'Company phone number is required !',
        updateSettings: 'Mettre à jour les paramètres',
        expensesType: 'Type de dépenses',
        expenses: 'Dépenses',
        selectExpensesType: 'Sélectionner le type de dépenses',
        expensesTypeError: 'Le type de dépenses est requis !',
        otherDescriptions: 'Autres descriptions',
        amountGreaterError: 'Le montant doit être supérieur à 0 !',
        amountError: 'Le montant est exigé',
        initialCash: 'Trésorerie initiale',
        cashSummary: 'Résumer du caisse',
        amountInput: 'Amount input',
        amountOutput: 'Amount output',
        realCash: 'Trésorerie réelle',
        profits: 'Bénéfices',
        losses: 'Pertes',
        profitsLosses: 'Bénéfices et pertes',
        salesPurchases: 'Ventes et achats',
        presentSales: 'Vente actuelle',
        presentPurchase: 'Achat actuel',
        presentExpenses: 'Dépenses actuelles',
        totalOfSales: 'Total des ventes',
        totalOfPurchase: "Total de l'achat",
        totalOfExpenses: 'Total des dépenses',
        weekly: 'Hebdomadaires',
        monthly: 'Mensuels',
        yearly: 'Annuel',
        recipes: "Les recettes",
        revenue: "Chiffre d'affaires",
        quantityDelivered: "Quantité livrée",
        invoice: 'Facture',
        amountPaid: 'Montant payé',
        amountStillToBePaid: 'Montant restant à payer',
        remainderToBeDelivered: 'Reste à livrer',
        amountToBeReimbursed: 'Montant à rembourser',
        clientAmount: 'Montant du client',
        errorClientAmount: 'Le montant du client doit être supérieur ou égal au montant payé ou être égal à 0.',
        generate: 'Générer',
        refresh: 'Rafraîchir',
    }
};