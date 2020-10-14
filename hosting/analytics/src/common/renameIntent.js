const intentRenamingMappings = {
  "general": {
    "Default Welcome Intent": "welcome-home",
    "global-restart": "cse-snap-tanf-wfd-restart",
  },
  "subjectMatters": {
    "cse": {
      "Default Fallback Intent": "cse-automl-trigger",
      "cse-pmts-general-root": "cse-payments-general-root",
      "cse-map-root": "cse-officelocations-root",
      "cse-dirDep-start": "cse-directdeposit-start",
      "cse-dirDep-root": "cse-directdeposit-root",
      "cse-root": "childsupport-root",
      "cse-iwoQA-arrears-balance": "cse-arrears-balance-support ticket",
      "cse-iwo-when-to-begin": "cse-income-withholding-order-when-to begin",
      "cse-iwo-root": "cse-income-withholding-order-root",
      "cse-dirDep-stop": "cse-directdeposit-stop",
      "map-deliver-map": "cse-return-officelocations",
    },
    "snap": {
      "Default Fallback Intent": "snap-nocontent",
      "map-deliver-map": "snap-return-officelocations",
      "snap-map-root": "snap-officelocations",
    },
    "tanf": {
      "Default Fallback Intent": "tanf-nocontent",
      "tanf-map-root": "tanf-officelocations",
      "map-deliver-map": "tanf-return-officelocations",
    },
    "wfd": {
      "Default Fallback Intent": "wfd-nocontent",
      "wfd-map-root": "wfd-officelocations",
      "map-deliver-map": "wfd-return-officelocations",
    }
  }
}

export const renameIntent = (subjectMatter, currentIntentName) => {
  let renamedIntent
  if (subjectMatter === undefined || subjectMatter === 'general' || subjectMatter === '') {
    renamedIntent = intentRenamingMappings["general"][currentIntentName]
  } else {
    renamedIntent = intentRenamingMappings["subjectMatters"][subjectMatter][currentIntentName]
  }

  return renamedIntent ? renamedIntent : currentIntentName
}