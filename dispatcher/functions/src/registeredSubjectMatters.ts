import KeyFile from "./KeyFile";

const registeredSubjectMatters = (): Map<string, KeyFile> => {
    const registeredSubjectMattersMap = new Map<string, KeyFile>();
    registeredSubjectMattersMap.set('project-1', <KeyFile>require(process.env.PROJECT1_KEY_FILE!));
    registeredSubjectMattersMap.set('project-2', <KeyFile>require(process.env.PROJECT2_KEY_FILE!));
    registeredSubjectMattersMap.set('project-3', <KeyFile>require(process.env.PROJECT3_KEY_FILE!));
    registeredSubjectMattersMap.set('project-4', <KeyFile>require(process.env.PROJECT4_KEY_FILE!));

    return registeredSubjectMattersMap;
};

export default registeredSubjectMatters;