type SubjectMatter = ('cse' | 'tanf' | 'snap' | 'wfd' | 'general')

type IntentHandler = (agent: any) => Promise<any>

type IntentHandlersByName = { [name: string]: IntentHandler }