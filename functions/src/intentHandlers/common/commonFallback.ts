import { defaultFallback } from '../globalFunctions'

export const noneOfThese = async agent => {
  // TODO For now, treat as unhandled w/o ML.
  // In the future record the phrase, category, and suggestions not selected.
  try {
    await defaultFallback(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}

export const commonFallback = async agent => {
  if (agent.context.get('cse-subject-matter') !== undefined) {
    const { autoMlFallback }  = await import( './categorizeAndPredict')

    return autoMlFallback(agent)
  } else {
    return defaultFallback(agent)
  }
}