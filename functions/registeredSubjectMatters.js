function registeredSubjectMatters() {
    const registeredSubjectMattersMap = new Map();
    registeredSubjectMattersMap.set('project-1', require(process.env.PROJECT1_KEY_FILE));
    registeredSubjectMattersMap.set('project-2', require(process.env.PROJECT2_KEY_FILE));
    registeredSubjectMattersMap.set('project-3', require(process.env.PROJECT3_KEY_FILE));
    registeredSubjectMattersMap.set('project-4', require(process.env.PROJECT4_KEY_FILE));

    return registeredSubjectMattersMap;
};